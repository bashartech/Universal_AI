import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Message, ChatSession, QuickReply } from '../types/chat.types';
import { Intent } from '../types/config.types';
import { APP_CONSTANTS } from '../utils/constants';
import { mistralService } from '../services/mistralService';
import { firebaseService } from '../services/firebaseService';

interface ChatState {
  // Session data
  sessionId: string;
  messages: Message[];
  isOpen: boolean;
  isTyping: boolean;

  // Lead capture
  leadCaptured: boolean;
  showLeadForm: boolean;

  // Escalation
  escalated: boolean;
  showEscalationButton: boolean;

  // Current state
  currentIntent: Intent | null;
  lastConfidence: number;

  // Actions
  initializeSession: () => void;
  toggleChat: () => void;
  openChat: () => void;
  closeChat: () => void;
  sendMessage: (content: string) => Promise<void>;
  addMessage: (message: Message) => void;
  setTyping: (isTyping: boolean) => void;
  setLeadCaptured: (captured: boolean) => void;
  setShowLeadForm: (show: boolean) => void;
  setEscalated: (escalated: boolean) => void;
  setShowEscalationButton: (show: boolean) => void;
  clearChat: () => void;
  saveSession: () => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  // Initial state
  sessionId: '',
  messages: [],
  isOpen: false,
  isTyping: false,
  leadCaptured: false,
  showLeadForm: false,
  escalated: false,
  showEscalationButton: false,
  currentIntent: null,
  lastConfidence: 1.0,

  // Initialize session
  initializeSession: () => {
    const existingSessionId = localStorage.getItem(APP_CONSTANTS.STORAGE_KEYS.SESSION_ID);
    const sessionId = existingSessionId || uuidv4();

    if (!existingSessionId) {
      localStorage.setItem(APP_CONSTANTS.STORAGE_KEYS.SESSION_ID, sessionId);
    }

    set({ sessionId });
  },

  // Toggle chat window
  toggleChat: () => {
    set((state) => ({ isOpen: !state.isOpen }));
  },

  // Open chat
  openChat: () => {
    set({ isOpen: true });
  },

  // Close chat
  closeChat: () => {
    set({ isOpen: false });
  },

  // Send message and get AI response
  sendMessage: async (content: string) => {
    const state = get();

    // Create user message
    const userMessage: Message = {
      id: uuidv4(),
      sessionId: state.sessionId,
      content,
      sender: 'user',
      timestamp: new Date(),
    };

    // Add user message to state
    set((state) => ({
      messages: [...state.messages, userMessage],
    }));

    // Save user message to Firebase
    try {
      await firebaseService.saveMessage(userMessage);
    } catch (error) {
      console.error('Failed to save user message:', error);
    }

    // Show typing indicator
    set({ isTyping: true });

    try {
      // Detect intent
      const { intent, confidence: intentConfidence } = await mistralService.detectIntent(content);

      // Generate AI response
      const { response, confidence } = await mistralService.generateResponse(
        content,
        state.messages,
        intent
      );

      // Create bot message
      const botMessage: Message = {
        id: uuidv4(),
        sessionId: state.sessionId,
        content: response,
        sender: 'bot',
        timestamp: new Date(),
        intent,
        confidence,
      };

      // Add bot message to state
      set((state) => ({
        messages: [...state.messages, botMessage],
        isTyping: false,
        currentIntent: intent,
        lastConfidence: confidence,
      }));

      // Save bot message to Firebase
      await firebaseService.saveMessage(botMessage);

      // Check if escalation is needed
      if (mistralService.shouldEscalate(confidence, intent)) {
        set({ showEscalationButton: true });
      }

      // Check if lead capture should be triggered
      if (
        (intent === Intent.BOOKING || intent === Intent.PRICING) &&
        !state.leadCaptured &&
        confidence > APP_CONSTANTS.MIN_CONFIDENCE_THRESHOLD
      ) {
        setTimeout(() => {
          set({ showLeadForm: true });
        }, 2000);
      }

    } catch (error) {
      console.error('Error processing message:', error);

      // Add error message
      const errorMessage: Message = {
        id: uuidv4(),
        sessionId: state.sessionId,
        content: "I'm having trouble processing your request. Would you like to speak with a human representative?",
        sender: 'bot',
        timestamp: new Date(),
        confidence: 0.2,
      };

      set((state) => ({
        messages: [...state.messages, errorMessage],
        isTyping: false,
        showEscalationButton: true,
      }));
    }
  },

  // Add message manually
  addMessage: (message: Message) => {
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  // Set typing indicator
  setTyping: (isTyping: boolean) => {
    set({ isTyping });
  },

  // Set lead captured status
  setLeadCaptured: (captured: boolean) => {
    set({ leadCaptured: captured });
  },

  // Set show lead form
  setShowLeadForm: (show: boolean) => {
    set({ showLeadForm: show });
  },

  // Set escalated status
  setEscalated: (escalated: boolean) => {
    set({ escalated });
  },

  // Set show escalation button
  setShowEscalationButton: (show: boolean) => {
    set({ showEscalationButton: show });
  },

  // Clear chat
  clearChat: () => {
    set({
      messages: [],
      leadCaptured: false,
      showLeadForm: false,
      escalated: false,
      showEscalationButton: false,
      currentIntent: null,
      lastConfidence: 1.0,
    });
  },

  // Save session to Firebase
  saveSession: async () => {
    const state = get();

    const session: ChatSession = {
      id: state.sessionId,
      startTime: state.messages[0]?.timestamp || new Date(),
      endTime: new Date(),
      messages: state.messages,
      leadCaptured: state.leadCaptured,
      escalated: state.escalated,
      status: state.escalated ? 'escalated' : 'completed',
      metadata: {
        userAgent: navigator.userAgent,
        referrer: document.referrer,
      },
    };

    try {
      await firebaseService.saveConversation(session);
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  },
}));
