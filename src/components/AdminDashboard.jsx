import React, { useState, useMemo } from 'react';
import {
  Users,
  Sparkles,
  PhoneCall,
  CheckCircle,
  Search,
  Filter,
  Download,
  PlusCircle,
  Eye,
  SlidersHorizontal,
  Mail,
  Building2,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import StatCard from './StatCard';
import StatusBadge from './StatusBadge';
import LeadDetailsModal from './LeadDetailsModal';
import { formatDate, exportLeadsToCSV } from '../utils/formatters';

export default function AdminDashboard({
  leads = [],
  onUpdateLeadStatus,
  onSwitchToForm,
  onOpenWebhookModal,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');
  const [selectedLead, setSelectedLead] = useState(null);

  // Compute metrics
  const stats = useMemo(() => {
    const total = leads.length;
    const newCount = leads.filter((l) => l.status === 'New').length;
    const contactedCount = leads.filter((l) => l.status === 'Contacted').length;
    const convertedCount = leads.filter((l) => l.status === 'Converted').length;
    const conversionRate = total > 0 ? ((convertedCount / total) * 100).toFixed(0) : 0;

    return {
      total,
      newCount,
      contactedCount,
      convertedCount,
      conversionRate: `${conversionRate}%`,
    };
  }, [leads]);

  // Filter leads by search query and status filter
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      // Status match
      if (selectedStatusFilter !== 'ALL' && lead.status !== selectedStatusFilter) {
        return false;
      }

      // Search match
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const nameMatch = lead.fullName?.toLowerCase().includes(q);
      const emailMatch = lead.email?.toLowerCase().includes(q);
      const phoneMatch = lead.phone?.toLowerCase().includes(q);
      const companyMatch = lead.company?.toLowerCase().includes(q);
      const messageMatch = lead.message?.toLowerCase().includes(q);

      return nameMatch || emailMatch || phoneMatch || companyMatch || messageMatch;
    });
  }, [leads, selectedStatusFilter, searchQuery]);

  const handleExportCSV = () => {
    exportLeadsToCSV(filteredLeads.length > 0 ? filteredLeads : leads);
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Smart Lead Management Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time pipeline monitoring synced with n8n & Google Sheets
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenWebhookModal}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl shadow-xs transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            n8n Settings
          </button>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            Export CSV
          </button>
          <button
            onClick={onSwitchToForm}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-xs transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            New Submission
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Leads"
          value={stats.total}
          subtext="In Database"
          icon={Users}
          colorScheme="blue"
          active={selectedStatusFilter === 'ALL'}
          onClick={() => setSelectedStatusFilter('ALL')}
        />
        <StatCard
          title="New Leads"
          value={stats.newCount}
          subtext="Pending Review"
          icon={Sparkles}
          colorScheme="indigo"
          active={selectedStatusFilter === 'New'}
          onClick={() => setSelectedStatusFilter('New')}
        />
        <StatCard
          title="Contacted Leads"
          value={stats.contactedCount}
          subtext="In Discussion"
          icon={PhoneCall}
          colorScheme="amber"
          active={selectedStatusFilter === 'Contacted'}
          onClick={() => setSelectedStatusFilter('Contacted')}
        />
        <StatCard
          title="Converted Leads"
          value={stats.convertedCount}
          subtext={`${stats.conversionRate} Conv. Rate`}
          icon={CheckCircle}
          colorScheme="emerald"
          active={selectedStatusFilter === 'Converted'}
          onClick={() => setSelectedStatusFilter('Converted')}
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filter:
          </span>
          {['ALL', 'New', 'Contacted', 'Converted'].map((filterKey) => (
            <button
              key={filterKey}
              onClick={() => setSelectedStatusFilter(filterKey)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                selectedStatusFilter === filterKey
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {filterKey === 'ALL' ? `All Leads (${leads.length})` : filterKey}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search leads by name, email, company..."
            className="w-full pl-9 pr-3.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-sky-200 focus:border-sky-500"
          />
        </div>
      </div>

      {/* Leads Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Lead / Contact</th>
                <th className="py-3.5 px-4">Company</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 hidden md:table-cell">Requirements Preview</th>
                <th className="py-3.5 px-4 hidden lg:table-cell">Submitted</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-slate-600 text-sm">No leads match your criteria</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {searchQuery
                        ? 'Try clearing the search query or changing filters.'
                        : 'Submit a new lead to populate this dashboard.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                    onClick={() => setSelectedLead(lead)}
                  >
                    {/* Lead Info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-semibold flex items-center justify-center text-xs shrink-0 group-hover:bg-sky-100 group-hover:text-sky-700 transition-colors">
                          {lead.fullName
                            ?.split(' ')
                            .map((p) => p[0])
                            .slice(0, 2)
                            .join('')
                            .toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                            {lead.fullName}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {lead.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Company */}
                    <td className="py-3.5 px-4">
                      {lead.company ? (
                        <span className="font-medium text-slate-700 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          {lead.company}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Personal</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={lead.status} size="sm" />
                        <select
                          value={lead.status}
                          onChange={(e) => onUpdateLeadStatus(lead.id, e.target.value)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-[11px] bg-white border border-slate-200 rounded px-1.5 py-0.5 text-slate-600 focus:outline-none"
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Converted">Converted</option>
                          <option value="Qualified">Qualified</option>
                          <option value="Lost">Lost</option>
                        </select>
                      </div>
                    </td>

                    {/* Message Preview */}
                    <td className="py-3.5 px-4 hidden md:table-cell max-w-xs">
                      <p className="truncate text-slate-600 text-xs">
                        {lead.message}
                      </p>
                    </td>

                    {/* Submitted Date */}
                    <td className="py-3.5 px-4 hidden lg:table-cell text-slate-500 whitespace-nowrap text-[11px]">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {formatDate(lead.submittedAt)}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                          title="View Full Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <a
                          href={`mailto:${lead.email}`}
                          className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Email Lead"
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-4 py-3 bg-slate-50/80 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing <strong>{filteredLeads.length}</strong> of <strong>{leads.length}</strong> leads
          </span>
          <span className="hidden sm:inline text-slate-400">
            Click any row to open lead details and actions
          </span>
        </div>
      </div>

      {/* Selected Lead Details Modal */}
      <LeadDetailsModal
        lead={selectedLead}
        isOpen={Boolean(selectedLead)}
        onClose={() => setSelectedLead(null)}
        onUpdateStatus={(id, st) => {
          onUpdateLeadStatus(id, st);
          if (selectedLead && selectedLead.id === id) {
            setSelectedLead({ ...selectedLead, status: st });
          }
        }}
      />
    </div>
  );
}

