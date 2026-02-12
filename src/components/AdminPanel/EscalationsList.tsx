import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminStore } from '../../store/adminStore';
import { format } from 'date-fns';
import { Loader } from '../shared/Loader';

export const EscalationsList: React.FC = () => {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    escalations,
    isLoadingEscalations,
    loadEscalations,
    updateEscalationStatus,
  } = useAdminStore();

  const [selectedEscalation, setSelectedEscalation] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }
    loadEscalations();
  }, [isAuthenticated, navigate, loadEscalations]);

  const handleResolve = async (escalationId: string) => {
    try {
      await updateEscalationStatus(escalationId, 'resolved');
    } catch (error) {
      console.error('Failed to resolve escalation:', error);
    }
  };

  const selectedEsc = escalations.find((e) => e.id === selectedEscalation);

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
          <h1 className="text-2xl font-bold text-white">Escalations</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isLoadingEscalations ? (
          <div className="flex justify-center items-center h-64">
            <Loader size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Escalations List */}
            <div className="lg:col-span-1 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-purple-500/20 overflow-hidden">
              <div className="p-4 border-b border-purple-500/20">
                <h2 className="font-semibold text-white">All Escalations</h2>
                <p className="text-sm text-slate-400">{escalations.length} total</p>
              </div>
              <div className="overflow-y-auto" style={{ maxHeight: '600px' }}>
                {escalations.length === 0 ? (
                  <div className="p-8 text-center text-slate-500">
                    No escalations yet
                  </div>
                ) : (
                  escalations.map((esc) => (
                    <button
                      key={esc.id}
                      onClick={() => setSelectedEscalation(esc.id)}
                      className={`w-full p-4 border-b border-purple-500/10 hover:bg-slate-700/50 text-left transition-colors ${
                        selectedEscalation === esc.id ? 'bg-purple-500/10' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-white">
                          {esc.userContact?.name || 'Unknown User'}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full border ${
                            esc.status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                              : 'bg-green-500/20 text-green-400 border-green-500/30'
                          }`}
                        >
                          {esc.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mb-1">{esc.reason}</p>
                      <p className="text-xs text-slate-500">
                        {format(new Date(esc.createdAt), 'MMM dd, yyyy HH:mm')}
                      </p>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Escalation Details */}
            <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-purple-500/20">
              {selectedEsc ? (
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b border-purple-500/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="font-semibold text-white">
                          Escalation Details
                        </h2>
                        <p className="text-sm text-slate-400">
                          Created: {format(new Date(selectedEsc.createdAt), 'MMM dd, yyyy HH:mm')}
                        </p>
                      </div>
                      {selectedEsc.status === 'pending' && (
                        <button
                          onClick={() => handleResolve(selectedEsc.id)}
                          className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all text-sm shadow-lg"
                        >
                          Mark as Resolved
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="p-4 border-b border-purple-500/20 bg-slate-700/30">
                    <h3 className="text-sm font-semibold text-white mb-3">
                      Contact Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-slate-400">Name:</p>
                        <p className="text-white font-medium">
                          {selectedEsc.userContact?.name || 'Not provided'}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400">Email:</p>
                        <p className="text-white font-medium">
                          {selectedEsc.userContact?.email || 'Not provided'}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400">Phone:</p>
                        <p className="text-white font-medium">
                          {selectedEsc.userContact?.phone || 'Not provided'}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400">Reason:</p>
                        <p className="text-white font-medium">{selectedEsc.reason}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4" style={{ maxHeight: '400px' }}>
                    <h3 className="text-sm font-semibold text-white mb-3">
                      Conversation Transcript
                    </h3>
                    {selectedEsc.conversationTranscript.map((msg:any) => (
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
                  Select an escalation to view details
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
