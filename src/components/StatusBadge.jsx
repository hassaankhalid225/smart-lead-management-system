import React from 'react';

/**
 * StatusBadge Component
 * Displays modern pill badge for lead statuses.
 */
export default function StatusBadge({ status = 'New', size = 'md' }) {
  const configs = {
    New: {
      bg: 'bg-sky-50 text-sky-700 border-sky-200 ring-sky-500/20',
      dot: 'bg-sky-500',
    },
    Contacted: {
      bg: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20',
      dot: 'bg-amber-500',
    },
    Converted: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20',
      dot: 'bg-emerald-500',
    },
    Qualified: {
      bg: 'bg-purple-50 text-purple-700 border-purple-200 ring-purple-500/20',
      dot: 'bg-purple-500',
    },
    Lost: {
      bg: 'bg-slate-100 text-slate-600 border-slate-200 ring-slate-400/20',
      dot: 'bg-slate-400',
    },
  };

  const style = configs[status] || configs.New;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ring-1 ${style.bg} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {status}
    </span>
  );
}

