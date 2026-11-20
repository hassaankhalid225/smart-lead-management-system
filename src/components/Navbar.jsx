import React from 'react';
import {
  Layers,
  LayoutDashboard,
  FileText,
  Zap,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { getWebhookUrl } from '../services/leadService';

export default function Navbar({
  activeView = 'form',
  onSelectView,
  leadCount = 0,
  onOpenWebhookModal,
}) {
  const webhookUrl = getWebhookUrl();
  const isCustomConfigured =
    webhookUrl &&
    !webhookUrl.includes('example.com') &&
    !webhookUrl.includes('your-domain.com');

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-slate-900">
                Smart<span className="text-sky-600">Leads</span>
              </span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-semibold text-slate-500 bg-slate-100 rounded-md uppercase tracking-wider">
                React + n8n
              </span>
            </div>
          </div>

          {/* Center View Navigation Tabs */}
          <nav className="flex items-center p-1 bg-slate-100/80 rounded-xl border border-slate-200/60">
            <button
              onClick={() => onSelectView('form')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeView === 'form'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Lead Form</span>
            </button>

            <button
              onClick={() => onSelectView('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeView === 'dashboard'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Admin Dashboard</span>
              {leadCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-sky-100 text-sky-700">
                  {leadCount}
                </span>
              )}
            </button>
          </nav>

          {/* Right Action: Webhook Status Pill */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenWebhookModal}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                isCustomConfigured
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/70'
                  : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100/70'
              }`}
              title="Click to configure n8n Webhook settings"
            >
              {isCustomConfigured ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>n8n Active</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                  <span>Webhook Setup</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

