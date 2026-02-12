import React, { useEffect } from 'react';
import { useChatStore } from '../../store/chatStore';
import { configService } from '../../services/configService';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { QuickReplies } from './QuickReplies';
import { FloatingButton } from './FloatingButton';
import { LeadForm } from '../LeadCapture/LeadForm';
import { v4 as uuidv4 } from 'uuid';

export const ChatWidget: React.FC = () => {
  const {
    sessionId,
    messages,
    isOpen,
    isTyping,
    showLeadForm,
    showEscalationButton,
    initializeSession,
    toggleChat,
    sendMessage,
    addMessage,
    setShowLeadForm,
    saveSession,
  } = useChatStore();

  const config = configService.getConfig();
  const theme = configService.getTheme();

  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  useEffect(() => {
    // Add welcome message when chat opens for the first time
    if (isOpen && messages.length === 0) {
      const welcomeMessage = {
        id: uuidv4(),
        sessionId,
        content: configService.getWelcomeMessage(),
        sender: 'bot' as const,
        timestamp: new Date(),
      };
      addMessage(welcomeMessage);
    }
  }, [isOpen, messages.length, sessionId, addMessage]);

  useEffect(() => {
    // Save session when chat closes
    return () => {
      if (messages.length > 0) {
        saveSession();
      }
    };
  }, [messages.length, saveSession]);

  const handleSendMessage = async (content: string) => {
    await sendMessage(content);
  };

  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply);
  };

  const handleEscalation = () => {
    const escalationMessage = {
      id: uuidv4(),
      sessionId,
      content: "I'll connect you with a human representative. Please provide your contact information so we can reach out to you.",
      sender: 'bot' as const,
      timestamp: new Date(),
    };
    addMessage(escalationMessage);
    setShowLeadForm(true);
  };

  const position = theme.position === 'bottom-left' ? 'left-6' : 'right-6';

  if (!isOpen) {
    return <FloatingButton onClick={toggleChat} />;
  }

  return (
    <>
      <FloatingButton onClick={toggleChat} />

      <div
        className={`fixed bottom-24 ${position} w-[380px] h-[600px]  bg-slate-900 rounded-2xl shadow-2xl border border-purple-500/20 flex flex-col z-50 animate-slide-up`}
        style={{ maxHeight: 'calc(100vh - 120px)' }}
      >

        {/* Header */}
        <div
          className="px-4 py-4  rounded-t-2xl text-white flex items-center justify-between relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${theme.primaryColor || '#8b5cf6'} 0%, #7c3aed 100%)`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
          <div className="flex p-5 items-center space-x-3 relative z-10">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm p-5 rounded-full flex items-center justify-center border border-white/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-white">{config.business_name}</h3>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <p className="text-xs text-white/90">Online</p>
              </div>
            </div>
          </div>
          <button
            onClick={toggleChat}
            className="text-white hover:bg-white/20 rounded-full p-1.5 transition-all relative z-10 backdrop-blur-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        {/* Messages */}
        {!showLeadForm ? (
          <>
            <MessageList messages={messages} isTyping={isTyping} />

            {/* Escalation Button */}
            {showEscalationButton && (
              <div className="px-4 py-2 border-t border-purple-500/20 bg-slate-800/50">
                <button
                  onClick={handleEscalation}
                  className="w-full px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all text-sm font-medium shadow-lg"
                >
                  👤 Talk to a Human Representative
                </button>
              </div>
            )}

            {/* Quick Replies */}
            {messages.length <= 1 && <QuickReplies onReplyClick={handleQuickReply} />}

            {/* Input */}
            <MessageInput onSend={handleSendMessage} disabled={isTyping} />
          </>
        ) : (
          <LeadForm onClose={() => setShowLeadForm(false)} />
        )}
      </div>


      {/* Mobile Responsive Styles */}
      <style>{`
        @media (max-width: 768px) {
          .fixed.bottom-24 {
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            width: 100% !important;
            height: 100% !important;
            max-height: 100vh !important;
            border-radius: 0 !important;
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
      `}</style>
    </>
  );
};
