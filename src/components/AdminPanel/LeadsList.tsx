import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminStore } from '../../store/adminStore';
import { format } from 'date-fns';
import { Loader } from '../shared/Loader';
import { Lead } from '../../types/lead.types';

export const LeadsList: React.FC = () => {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    leads,
    isLoadingLeads,
    loadLeads,
    updateLeadStatus,
  } = useAdminStore();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }
    loadLeads();
  }, [isAuthenticated, navigate, loadLeads]);

  const handleStatusChange = async (leadId: string, status: Lead['status']) => {
    try {
      await updateLeadStatus(leadId, status);
    } catch (error) {
      console.error('Failed to update lead status:', error);
    }
  };

  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'new':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'contacted':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'converted':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'lost':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className='w-screen'>
    <div className=" bg-slate-900">
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
          <h1 className="text-2xl font-bold text-white">Leads</h1>
        </div>
      </header>

      <main className="max-w-7xl mt-5 mx-auto px-4 py-8">
        {isLoadingLeads ? (
          <div className="flex justify-center items-center h-64">
            <Loader size="lg" />
          </div>
        ) : (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-purple-500/20 overflow-hidden">
            <div className="p-4 border-b border-purple-500/20">
              <h2 className="font-semibold text-white">All Leads</h2>
              <p className="text-sm text-slate-400">{leads.length} total</p>
            </div>

            {leads.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                No leads captured yet
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-700/50 border-b border-purple-500/20">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase">
                        Contact
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase">
                        Service Interest
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase">
                        Captured At
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-500/10">
                    {leads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-700/30 transition-colors">
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-sm font-medium text-white">{lead.name}</p>
                            {lead.company && (
                              <p className="text-xs text-slate-400">{lead.company}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm">
                            <p className="text-slate-200">{lead.email}</p>
                            <p className="text-slate-400">{lead.phone}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm text-slate-200">
                            {lead.serviceInterest || 'N/A'}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm text-slate-200">
                            {format(new Date(lead.capturedAt), 'MMM dd, yyyy')}
                          </p>
                          <p className="text-xs text-slate-400">
                            {format(new Date(lead.capturedAt), 'HH:mm')}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(
                              lead.status
                            )}`}
                          >
                            {lead.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={lead.status}
                            onChange={(e) =>
                              handleStatusChange(lead.id, e.target.value as Lead['status'])
                            }
                            className="text-sm bg-slate-700 border border-purple-500/30 text-slate-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="converted">Converted</option>
                            <option value="lost">Lost</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
    </div>
  );
};
