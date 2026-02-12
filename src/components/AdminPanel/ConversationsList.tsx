import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminStore } from '../../store/adminStore';
import { format } from 'date-fns';
import { Loader } from '../shared/Loader';

export const ConversationsList: React.FC = () => {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    conversations,
    isLoadingConversations,
    loadConversations,
  } = useAdminStore();

  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }
    loadConversations();
  }, [isAuthenticated, navigate, loadConversations]);

  const selectedConv = conversations.find((c) => c.id === selectedConversation);

  return (
    <div className="min-h-screen w-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-xl border-b border-purple-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="text-purple-400 hover:text-purple-300 text-sm mb-2 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-white">Conversations</h1>
        </div>
      </header>

      <main className="max-w-7xl  mx-auto px-4 py-8">
        {isLoadingConversations ? (
          <div className="flex justify-center items-center h-64">
            <Loader size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Conversations List */}
            <div className="lg:col-span-1 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-purple-500/20 overflow-hidden">
              <div className="p-4 border-b border-purple-500/20">
                <h2 className="font-semibold text-white">All Conversations</h2>
                <p className="text-sm text-slate-400">{conversations.length} total</p>
              </div>
              <div className="overflow-y-auto" style={{ maxHeight: '600px' }}>
                {conversations.length === 0 ? (
                  <div className="p-8 text-center text-slate-500">
                    No conversations yet
                  </div>
                ) : (
                  conversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv.id)}
                      className={`w-full p-4 border-b border-purple-500/10 hover:bg-slate-700/50 text-left transition-colors ${
                        selectedConversation === conv.id ? 'bg-purple-500/10' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-white">
                          Session {conv.id.slice(0, 8)}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            conv.status === 'escalated'
                              ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                              : conv.status === 'completed'
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                              : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          }`}
                        >
                          {conv.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        {format(new Date(conv.startTime), 'MMM dd, yyyy HH:mm')}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {conv.messages.length} messages
                      </p>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Conversation Details */}
            <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-purple-500/20">
              {selectedConv ? (
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b border-purple-500/20">
                    <h2 className="font-semibold text-white">
                      Conversation Details
                    </h2>
                    <p className="text-sm text-slate-400">
                      Started: {format(new Date(selectedConv.startTime), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4" style={{ maxHeight: '600px' }}>
                    {selectedConv.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`mb-4 flex ${
                          msg.sender === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[75%] px-4 py-2 rounded-lg ${
                            msg.sender === 'user'
                              ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white'
                              : 'bg-slate-700 text-slate-100 border border-purple-500/20'
                          }`}
                        >
                          <p className="text-sm font-medium mb-1">
                            {msg.sender === 'user' ? 'User' : 'Bot'}
                          </p>
                          <p className="text-sm">{msg.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              msg.sender === 'user' ? 'text-purple-200' : 'text-slate-400'
                            }`}
                          >
                            {format(new Date(msg.timestamp), 'HH:mm')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full p-8 text-slate-500">
                  Select a conversation to view details
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
