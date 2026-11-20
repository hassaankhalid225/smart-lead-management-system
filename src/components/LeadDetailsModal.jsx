import React from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  Building2,
  Calendar,
  MessageSquare,
  CheckCircle,
  Clock,
  Send,
  PhoneCall,
  Copy,
} from 'lucide-react';
import StatusBadge from './StatusBadge';
import { formatDate } from '../utils/formatters';

export default function LeadDetailsModal({
  lead,
  isOpen,
  onClose,
  onUpdateStatus,
}) {
  if (!isOpen || !lead) return null;

  const statuses = ['New', 'Contacted', 'Converted', 'Qualified', 'Lost'];

  const copyLeadSummary = () => {
    const text = `Lead: ${lead.fullName}\nEmail: ${lead.email}\nPhone: ${lead.phone}\nCompany: ${lead.company || 'N/A'}\nStatus: ${lead.status}\nMessage: ${lead.message}`;
    navigator.clipboard.writeText(text);
    alert('Lead details copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 font-bold flex items-center justify-center text-sm">
              {lead.fullName
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase()}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {lead.fullName}
              </h3>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                <Clock className="w-3.5 h-3.5" />
                Submitted {formatDate(lead.submittedAt)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Status Control Card */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600">Current Status:</span>
              <StatusBadge status={lead.status} />
            </div>
            <div className="flex items-center gap-1.5">
              <label htmlFor="lead-status-select" className="text-xs text-slate-500 font-medium">
                Change:
              </label>
              <select
                id="lead-status-select"
                value={lead.status}
                onChange={(e) => onUpdateStatus(lead.id, e.target.value)}
                className="text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-sky-200"
              >
                {statuses.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Contact Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-3 bg-white border border-slate-200 rounded-xl">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1 mb-1">
                <Mail className="w-3.5 h-3.5 text-sky-500" /> Email
              </span>
              <a
                href={`mailto:${lead.email}`}
                className="text-xs font-semibold text-sky-600 hover:underline break-all"
              >
                {lead.email}
              </a>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-xl">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1 mb-1">
                <Phone className="w-3.5 h-3.5 text-emerald-500" /> Phone
              </span>
              <a
                href={`tel:${lead.phone}`}
                className="text-xs font-semibold text-slate-800 hover:text-sky-600"
              >
                {lead.phone}
              </a>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-xl sm:col-span-2">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1 mb-1">
                <Building2 className="w-3.5 h-3.5 text-indigo-500" /> Company
              </span>
              <p className="text-xs font-semibold text-slate-800">
                {lead.company || <span className="text-slate-400 font-normal italic">Not specified</span>}
              </p>
            </div>
          </div>

          {/* Message / Requirements */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" /> Requirements / Message
            </span>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 leading-relaxed whitespace-pre-line">
              {lead.message}
            </div>
          </div>

          {/* Quick Contact Actions */}
          <div className="pt-2 flex flex-wrap items-center gap-2">
            <a
              href={`mailto:${lead.email}?subject=Follow%20up%20on%20your%20inquiry&body=Hi%20${encodeURIComponent(
                lead.fullName
              )},`}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-xs transition-colors"
            >
              <Send className="w-3.5 h-3.5" /> Email Lead
            </a>
            <a
              href={`tel:${lead.phone}`}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" /> Call Lead
            </a>
            <button
              onClick={copyLeadSummary}
              className="p-2 text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              title="Copy Summary"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl shadow-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

