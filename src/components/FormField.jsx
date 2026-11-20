import React from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * Reusable accessible form input component
 */
export default function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  required = false,
  disabled = false,
  icon: Icon,
  rows = 4,
  maxLength,
  helperText,
}) {
  const isTextarea = type === 'textarea';
  const hasError = Boolean(error);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <label
          htmlFor={name}
          className="block text-sm font-semibold text-slate-700"
        >
          {label}{' '}
          {required ? (
            <span className="text-rose-500 font-bold">*</span>
          ) : (
            <span className="text-xs font-normal text-slate-400">(Optional)</span>
          )}
        </label>
        {maxLength && isTextarea && (
          <span className="text-xs text-slate-400">
            {value?.length || 0}/{maxLength}
          </span>
        )}
      </div>

      <div className="relative rounded-xl shadow-xs">
        {Icon && !isTextarea && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}

        {isTextarea ? (
          <textarea
            id={name}
            name={name}
            rows={rows}
            maxLength={maxLength}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            placeholder={placeholder}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${name}-error` : undefined}
            className={`w-full px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 bg-white border rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 disabled:bg-slate-50 disabled:text-slate-400 resize-y min-h-[110px] ${
              hasError
                ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                : 'border-slate-300 focus:border-sky-500 focus:ring-sky-100 hover:border-slate-400'
            }`}
          />
        ) : (
          <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            placeholder={placeholder}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${name}-error` : undefined}
            className={`w-full py-2.5 text-sm text-slate-800 placeholder-slate-400 bg-white border rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 disabled:bg-slate-50 disabled:text-slate-400 ${
              Icon ? 'pl-10 pr-3.5' : 'px-3.5'
            } ${
              hasError
                ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                : 'border-slate-300 focus:border-sky-500 focus:ring-sky-100 hover:border-slate-400'
            }`}
          />
        )}
      </div>

      {hasError ? (
        <p
          id={`${name}-error`}
          className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-600 font-medium animate-fadeIn"
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
}

