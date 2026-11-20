import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LeadForm from './components/LeadForm';
import AdminDashboard from './components/AdminDashboard';
import WebhookConfigModal from './components/WebhookConfigModal';
import { INITIAL_LEADS } from './data/mockLeads';
import { loadStoredLeads, saveStoredLeads } from './services/leadService';

export default function App() {
  const [activeView, setActiveView] = useState('form'); // 'form' | 'dashboard'
  const [leads, setLeads] = useState(() => loadStoredLeads(INITIAL_LEADS));
  const [isWebhookModalOpen, setIsWebhookModalOpen] = useState(false);

  // Sync leads back to local storage whenever modified
  useEffect(() => {
    saveStoredLeads(leads);
  }, [leads]);

  // Handle new lead submitted through the form
  const handleLeadSubmitted = (newLead) => {
    setLeads((prev) => {
      const exists = prev.some((l) => l.id === newLead.id);
      if (exists) return prev;
      return [newLead, ...prev];
    });
  };

  // Update status of a specific lead
  const handleUpdateLeadStatus = (leadId, newStatus) => {
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      )
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800 antialiased selection:bg-sky-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeView={activeView}
        onSelectView={setActiveView}
        leadCount={leads.length}
        onOpenWebhookModal={() => setIsWebhookModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {activeView === 'form' ? (
          <div className="animate-fade-in">
            <LeadForm
              onLeadSubmitted={handleLeadSubmitted}
              onSwitchToDashboard={() => setActiveView('dashboard')}
            />
          </div>
        ) : (
          <div className="animate-fade-in">
            <AdminDashboard
              leads={leads}
              onUpdateLeadStatus={handleUpdateLeadStatus}
              onSwitchToForm={() => setActiveView('form')}
              onOpenWebhookModal={() => setIsWebhookModalOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Webhook Settings Modal */}
      <WebhookConfigModal
        isOpen={isWebhookModalOpen}
        onClose={() => setIsWebhookModalOpen(false)}
      />

      {/* Modern Minimal Footer */}
      <footer className="w-full border-t border-slate-200/80 bg-white py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-600">Smart Lead Management System</span>
            <span>&bull;</span>
            <span>React + Tailwind CSS + n8n + Google Sheets</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <button
              onClick={() => setIsWebhookModalOpen(true)}
              className="hover:text-sky-600 transition-colors"
            >
              n8n Webhook Settings
            </button>
            <span>&bull;</span>
            <span>Vercel Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
