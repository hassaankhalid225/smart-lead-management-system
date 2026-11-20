/**
 * Formatting and Helper Utilities
 */

/**
 * Format ISO date string into human-readable relative or date format
 * @param {string} isoString
 * @returns {string}
 */
export function formatDate(isoString) {
  if (!isoString) return 'Just now';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return 'Recently';

    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  } catch {
    return 'Recently';
  }
}

/**
 * Convert leads array to CSV download
 * @param {Array} leads
 */
export function exportLeadsToCSV(leads) {
  if (!leads || leads.length === 0) return;

  const headers = ['ID', 'Full Name', 'Email', 'Phone', 'Company', 'Requirements', 'Status', 'Submitted At'];
  const rows = leads.map((lead) => [
    `"${(lead.id || '').replace(/"/g, '""')}"`,
    `"${(lead.fullName || '').replace(/"/g, '""')}"`,
    `"${(lead.email || '').replace(/"/g, '""')}"`,
    `"${(lead.phone || '').replace(/"/g, '""')}"`,
    `"${(lead.company || '').replace(/"/g, '""')}"`,
    `"${(lead.message || '').replace(/"/g, '""')}"`,
    `"${(lead.status || '').replace(/"/g, '""')}"`,
    `"${(lead.submittedAt || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `leads_export_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

