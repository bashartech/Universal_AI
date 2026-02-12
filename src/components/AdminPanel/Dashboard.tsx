import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminStore } from '../../store/adminStore';
import { configService } from '../../services/configService';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    conversations,
    leads,
    escalations,
    loadConversations,
    loadLeads,
    loadEscalations,
    logout,
  } = useAdminStore();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }

    loadConversations({ limitCount: 10 });
    loadLeads({ limitCount: 10 });
    loadEscalations({ limitCount: 10 });
  }, [isAuthenticated, navigate, loadConversations, loadLeads, loadEscalations]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const config = configService.getConfig();

  const stats = [
    {
      label: 'Total Conversations',
      value: conversations.length,
      icon: '💬',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
    },
    {
      label: 'Captured Leads',
      value: leads.length,
      icon: '👥',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
    },
    {
      label: 'Escalations',
      value: escalations.filter((e) => e.status === 'pending').length,
      icon: '⚠️',
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30',
    },
    {
      label: 'New Leads',
      value: leads.filter((l) => l.status === 'new').length,
      icon: '✨',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
    },
  ];

  return (
    <div className='w-screen h-[730px] '>
    <div className=" bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-xl border-b border-purple-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-sm text-slate-400">{config.business_name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl sm:mt-10 mt-40 mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`bg-slate-800/50 backdrop-blur-sm rounded-xl border ${stat.borderColor} p-6 hover:scale-105 transition-transform`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center text-2xl shadow-lg`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => navigate('/admin/conversations')}
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-purple-500/20 p-6 hover:border-purple-500/50 transition-all text-left group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-xl">
                💬
              </div>
              <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">
                Conversations
              </h3>
            </div>
            <p className="text-sm text-slate-400">View all chat conversations and transcripts</p>
          </button>

          <button
            onClick={() => navigate('/admin/leads')}
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-purple-500/20 p-6 hover:border-purple-500/50 transition-all text-left group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center text-xl">
                👥
              </div>
              <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">
                Leads
              </h3>
            </div>
            <p className="text-sm text-slate-400">Manage captured leads and contacts</p>
          </button>

          <button
            onClick={() => navigate('/admin/escalations')}
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-purple-500/20 p-6 hover:border-purple-500/50 transition-all text-left group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center text-xl">
                ⚠️
              </div>
              <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">
                Escalations
              </h3>
            </div>
            <p className="text-sm text-slate-400">Handle human escalation requests</p>
          </button>
        </div>
      </main>
    </div>
    </div>
  );
};
