import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '../components/AdminPanel/Login';
import { Dashboard } from '../components/AdminPanel/Dashboard';
import { ConversationsList } from '../components/AdminPanel/ConversationsList';
import { LeadsList } from '../components/AdminPanel/LeadsList';
import { EscalationsList } from '../components/AdminPanel/EscalationsList';

export const AdminApp: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/conversations" element={<ConversationsList />} />
        <Route path="/admin/leads" element={<LeadsList />} />
        <Route path="/admin/escalations" element={<EscalationsList />} />
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
        <Route path="*" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
