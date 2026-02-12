import { create } from 'zustand';
import { ChatSession } from '../types/chat.types';
import { Lead, Escalation } from '../types/lead.types';
import { firebaseService } from '../services/firebaseService';
import { APP_CONSTANTS } from '../utils/constants';

interface AdminState {
  // Authentication
  isAuthenticated: boolean;
  username: string | null;

  // Data
  conversations: ChatSession[];
  leads: Lead[];
  escalations: Escalation[];

  // Loading states
  isLoadingConversations: boolean;
  isLoadingLeads: boolean;
  isLoadingEscalations: boolean;

  // Filters
  conversationFilters: {
    startDate?: Date;
    endDate?: Date;
    status?: string;
  };
  leadFilters: {
    startDate?: Date;
    endDate?: Date;
    status?: string;
  };

  // Actions
  login: (username: string, password: string) => boolean;
  logout: () => void;
  loadConversations: (filters?: any) => Promise<void>;
  loadLeads: (filters?: any) => Promise<void>;
  loadEscalations: (filters?: any) => Promise<void>;
  updateLeadStatus: (leadId: string, status: Lead['status']) => Promise<void>;
  updateEscalationStatus: (escalationId: string, status: Escalation['status']) => Promise<void>;
  setConversationFilters: (filters: any) => void;
  setLeadFilters: (filters: any) => void;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  // Initial state
  isAuthenticated: false,
  username: null,
  conversations: [],
  leads: [],
  escalations: [],
  isLoadingConversations: false,
  isLoadingLeads: false,
  isLoadingEscalations: false,
  conversationFilters: {},
  leadFilters: {},

  // Login (demo credentials)
  login: (username: string, password: string) => {
    if (
      username === APP_CONSTANTS.DEMO_ADMIN_USERNAME &&
      password === APP_CONSTANTS.DEMO_ADMIN_PASSWORD
    ) {
      set({ isAuthenticated: true, username });
      localStorage.setItem(APP_CONSTANTS.STORAGE_KEYS.ADMIN_AUTH, 'true');
      return true;
    }
    return false;
  },

  // Logout
  logout: () => {
    set({ isAuthenticated: false, username: null });
    localStorage.removeItem(APP_CONSTANTS.STORAGE_KEYS.ADMIN_AUTH);
  },

  // Load conversations
  loadConversations: async (filters?: any) => {
    set({ isLoadingConversations: true });
    try {
      const conversations = await firebaseService.getConversations(filters);
      set({ conversations, isLoadingConversations: false });
    } catch (error) {
      console.error('Failed to load conversations:', error);
      set({ isLoadingConversations: false });
    }
  },

  // Load leads
  loadLeads: async (filters?: any) => {
    set({ isLoadingLeads: true });
    try {
      const leads = await firebaseService.getLeads(filters);
      set({ leads, isLoadingLeads: false });
    } catch (error) {
      console.error('Failed to load leads:', error);
      set({ isLoadingLeads: false });
    }
  },

  // Load escalations
  loadEscalations: async (filters?: any) => {
    set({ isLoadingEscalations: true });
    try {
      const escalations = await firebaseService.getEscalations(filters);
      set({ escalations, isLoadingEscalations: false });
    } catch (error) {
      console.error('Failed to load escalations:', error);
      set({ isLoadingEscalations: false });
    }
  },

  // Update lead status
  updateLeadStatus: async (leadId: string, status: Lead['status']) => {
    try {
      await firebaseService.updateLeadStatus(leadId, status);
      // Reload leads
      await get().loadLeads(get().leadFilters);
    } catch (error) {
      console.error('Failed to update lead status:', error);
      throw error;
    }
  },

  // Update escalation status
  updateEscalationStatus: async (escalationId: string, status: Escalation['status']) => {
    try {
      await firebaseService.updateEscalationStatus(escalationId, status);
      // Reload escalations
      await get().loadEscalations();
    } catch (error) {
      console.error('Failed to update escalation status:', error);
      throw error;
    }
  },

  // Set conversation filters
  setConversationFilters: (filters: any) => {
    set({ conversationFilters: filters });
  },

  // Set lead filters
  setLeadFilters: (filters: any) => {
    set({ leadFilters: filters });
  },
}));
