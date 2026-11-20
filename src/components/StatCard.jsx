import React from 'react';

/**
 * StatCard Component
 * Metric summary card with clean typography, icon, and trend/subtext.
 */
export default function StatCard({
  title,
  value,
  subtext,
  icon: Icon,
  colorScheme = 'blue',
  onClick,
  active = false,
}) {
  const colorMap = {
    blue: {
      iconBg: 'bg-sky-100 text-sky-600',
      activeBorder: 'border-sky-500 ring-2 ring-sky-500/20',
      tagBg: 'text-sky-700 bg-sky-50',
    },
    amber: {
      iconBg: 'bg-amber-100 text-amber-600',
      activeBorder: 'border-amber-500 ring-2 ring-amber-500/20',
      tagBg: 'text-amber-700 bg-amber-50',
    },
    emerald: {
      iconBg: 'bg-emerald-100 text-emerald-600',
      activeBorder: 'border-emerald-500 ring-2 ring-emerald-500/20',
      tagBg: 'text-emerald-700 bg-emerald-50',
    },
    indigo: {
      iconBg: 'bg-indigo-100 text-indigo-600',
      activeBorder: 'border-indigo-500 ring-2 ring-indigo-500/20',
      tagBg: 'text-indigo-700 bg-indigo-50',
    },
  };

  const current = colorMap[colorScheme] || colorMap.blue;

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`relative overflow-hidden bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm transition-all duration-200 ${
        onClick
          ? 'cursor-pointer hover:shadow-md hover:border-slate-300 active:scale-[0.99]'
          : ''
      } ${active ? current.activeBorder : ''}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl ${current.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-3xl font-bold tracking-tight text-slate-900">
          {value}
        </span>
        {subtext && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${current.tagBg}`}>
            {subtext}
          </span>
        )}
      </div>
    </div>
  );
}

