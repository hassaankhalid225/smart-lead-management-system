import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Building2,
  MessageSquare,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import FormField from './FormField';
import { validateField, validateLeadForm } from '../utils/validation';
import { submitLeadToWebhook, getWebhookUrl } from '../services/leadService';

const INITIAL_FORM_STATE = {
  fullName: '',
  email: '',
  phone: '',
  company: '',
  message: '',
};

export default function LeadForm({ onLeadSubmitted, onSwitchToDashboard }) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [lastSubmittedLead, setLastSubmittedLead] = useState(null);
  const [isDemoNotification, setIsDemoNotification] = useState(false);

  const webhookUrl = getWebhookUrl();

  // Handle field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Real-time validation clearance if field was previously errored
    if (errors[name]) {
      const fieldError = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: fieldError }));
    }
  };

  // Handle field blur for validation feedback
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldError = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  // Trigger celebration confetti
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#0284c7', '#38bdf8', '#10b981', '#6366f1'],
      });
    } catch {
      // Confetti fallback
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const formErrors = validateLeadForm(formData);
    setErrors(formErrors);

    // Mark all as touched
    setTouched({
      fullName: true,
      email: true,
      phone: true,
      company: true,
      message: true,
    });

    if (Object.keys(formErrors).length > 0) {
      // Scroll first invalid input into view
      const firstErrorKey = Object.keys(formErrors)[0];
      const el = document.getElementById(firstErrorKey);
      if (el) el.focus();
      return;
    }

    setStatus('submitting');
    setErrorMessage('');
    setIsDemoNotification(false);

    try {
      const result = await submitLeadToWebhook(formData);

      if (result.success) {
        setStatus('success');
        setLastSubmittedLead(result.lead);
        setIsDemoNotification(Boolean(result.isDemoMode));
        triggerConfetti();

        // Notify parent to refresh leads in Admin Dashboard
        if (onLeadSubmitted) {
          onLeadSubmitted(result.lead);
        }

        // Reset form inputs as requested
        setFormData(INITIAL_FORM_STATE);
        setErrors({});
        setTouched({});
      } else {
        setStatus('error');
        setErrorMessage(
          result.error || 'Failed to submit form data to the n8n webhook.'
        );
      }
    } catch (err) {
      setStatus('error');
      setErrorMessage(
        err.message || 'An unexpected error occurred while submitting.'
      );
    }
  };

  // Reset from success state to submit another lead
  const handleResetForAnother = () => {
    setStatus('idle');
    setFormData(INITIAL_FORM_STATE);
    setErrors({});
    setTouched({});
    setErrorMessage('');
    setLastSubmittedLead(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* SUCCESS STATE */}
      {status === 'success' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden p-8 sm:p-10 animate-slide-up text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-xs">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Lead Successfully Processed
          </span>

          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Thank you, {lastSubmittedLead?.fullName || 'for your request'}!
          </h2>

          <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            Your inquiry has been captured and routed to our automated n8n pipeline.
            Our team will review your requirements and reach out promptly.
          </p>

          {/* Submission Details Card */}
          {lastSubmittedLead && (
            <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-left max-w-md mx-auto space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-400">Lead Reference ID</span>
                <span className="font-mono font-semibold text-slate-700">
                  {lastSubmittedLead.id}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Email</span>
                <span className="font-medium text-slate-700">
                  {lastSubmittedLead.email}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Phone</span>
                <span className="font-medium text-slate-700">
                  {lastSubmittedLead.phone}
                </span>
              </div>
              {lastSubmittedLead.company && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Company</span>
                  <span className="font-medium text-slate-700">
                    {lastSubmittedLead.company}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Notice if running in demo mode */}
          {isDemoNotification && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 text-left max-w-md mx-auto flex items-start gap-2">
              <Zap className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
              <span>
                <strong>Demo Mode Active:</strong> Default placeholder webhook detected. The lead was saved to your browser's local state and will appear in the Admin Dashboard.
              </span>
            </div>
          )}

          {/* Action buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleResetForAnother}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-xs transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Submit Another Lead
            </button>
            {onSwitchToDashboard && (
              <button
                type="button"
                onClick={onSwitchToDashboard}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                View in Admin Dashboard
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* FORM STATE */}
      {status !== 'success' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden p-6 sm:p-10">
          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200 mb-3">
              <ShieldCheck className="w-3.5 h-3.5" /> Smart Lead Intake
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Start Your Project Consultation
            </h1>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              Fill out the details below. Our automated system will validate your requirements and instantly connect to our processing workflow.
            </p>
          </div>

          {/* Error Banner */}
          {status === 'error' && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 animate-fadeIn">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 text-xs text-rose-800">
                <p className="font-semibold text-rose-900">Submission Encountered an Issue</p>
                <p className="mt-1 leading-relaxed">{errorMessage}</p>
                <p className="mt-2 text-slate-600">
                  Tip: Verify your n8n webhook URL, test webhook listening status, or check network/CORS configuration.
                </p>
              </div>
            </div>
          )}

          {/* Main Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Full Name */}
              <div className="sm:col-span-2">
                <FormField
                  label="Full Name"
                  name="fullName"
                  type="text"
                  placeholder="e.g. Alexandra Chen"
                  value={formData.fullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.fullName ? errors.fullName : null}
                  required
                  disabled={status === 'submitting'}
                  icon={User}
                />
              </div>

              {/* Email Address */}
              <div>
                <FormField
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="e.g. alex@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email ? errors.email : null}
                  required
                  disabled={status === 'submitting'}
                  icon={Mail}
                />
              </div>

              {/* Phone Number */}
              <div>
                <FormField
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  placeholder="e.g. +1 (555) 019-2834"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.phone ? errors.phone : null}
                  required
                  disabled={status === 'submitting'}
                  icon={Phone}
                />
              </div>

              {/* Company Name (Optional) */}
              <div className="sm:col-span-2">
                <FormField
                  label="Company Name"
                  name="company"
                  type="text"
                  placeholder="e.g. Acme Innovations Ltd."
                  value={formData.company}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.company ? errors.company : null}
                  required={false}
                  disabled={status === 'submitting'}
                  icon={Building2}
                  helperText="Leave blank if inquiring as an individual."
                />
              </div>

              {/* Requirements / Message */}
              <div className="sm:col-span-2">
                <FormField
                  label="Requirements / Message"
                  name="message"
                  type="textarea"
                  placeholder="Describe your project, timeline, budget expectations, or specific requirements..."
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.message ? errors.message : null}
                  required
                  disabled={status === 'submitting'}
                  maxLength={2000}
                  rows={4}
                  icon={MessageSquare}
                />
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 disabled:bg-sky-400 disabled:cursor-not-allowed rounded-xl shadow-md transition-all duration-150 transform active:scale-[0.99]"
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Transmitting to n8n Webhook...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Lead Information</span>
                  </>
                )}
              </button>
            </div>

            {/* Footer Notice */}
            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Data encrypted & safely routed via HTTPS
              </span>
              <span>Direct n8n & Sheets sync</span>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

