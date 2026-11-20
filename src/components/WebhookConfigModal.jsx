import React, { useState } from 'react';
import {
  X,
  Link,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  Zap,
  Code2,
  FileSpreadsheet,
} from 'lucide-react';
import {
  getWebhookUrl,
  setCustomWebhookUrl,
  testWebhookConnectivity,
} from '../services/leadService';

export default function WebhookConfigModal({ isOpen, onClose }) {
  const currentUrl = getWebhookUrl();
  const envUrl = import.meta.env.VITE_N8N_WEBHOOK_URL || '';
  const [urlInput, setUrlInput] = useState(currentUrl);
  const [testState, setTestState] = useState({ loading: false, result: null });
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('config'); // 'config' | 'payload' | 'guide'

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    setCustomWebhookUrl(urlInput);
    setTestState({
      loading: false,
      result: {
        ok: true,
        message: 'Webhook configuration saved successfully in local settings.',
      },
    });
  };

  const handleResetToEnv = () => {
    setCustomWebhookUrl('');
    setUrlInput(envUrl);
    setTestState({
      loading: false,
      result: {
        ok: true,
        message: 'Reset back to .env default configuration.',
      },
    });
  };

  const handleTestPing = async () => {
    setTestState({ loading: true, result: null });
    const res = await testWebhookConnectivity(urlInput);
    setTestState({ loading: false, result: res });
  };

  const samplePayload = {
    id: 'lead_1710928392100_x9a2',
    fullName: 'Jane Doe',
    email: 'jane.doe@example.com',
    phone: '+1 (555) 234-5678',
    company: 'Acme Technologies',
    message: 'We require an automated sales funnel connecting to Google Sheets.',
    status: 'New',
    submittedAt: new Date().toISOString(),
    source: 'Smart Lead Management System - Web Form',
    metadata: {
      userAgent: 'Mozilla/5.0 ...',
      platform: 'Win32',
      language: 'en-US',
    },
  };

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(JSON.stringify(samplePayload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-100 text-sky-700">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                n8n Webhook & Integration Settings
              </h3>
              <p className="text-xs text-slate-500">
                Configure your automation endpoint and Google Sheets pipeline
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

        {/* Tabs */}
        <div className="flex border-b border-slate-200 px-6 bg-white gap-6">
          <button
            onClick={() => setActiveTab('config')}
            className={`py-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'config'
                ? 'border-sky-600 text-sky-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Link className="w-4 h-4" /> Endpoint Configuration
          </button>
          <button
            onClick={() => setActiveTab('payload')}
            className={`py-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'payload'
                ? 'border-sky-600 text-sky-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Code2 className="w-4 h-4" /> JSON Payload Schema
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`py-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'guide'
                ? 'border-sky-600 text-sky-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" /> n8n + Sheets Guide
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {activeTab === 'config' && (
            <div className="space-y-4">
              <form onSubmit={handleSave} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Active n8n Webhook URL
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="https://n8n.your-domain.com/webhook/..."
                      className="w-full px-3.5 py-2.5 text-xs font-mono bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-500"
                    />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    Default from <code className="text-sky-700 bg-sky-50 px-1 py-0.5 rounded">.env</code>:{' '}
                    {envUrl || 'Not set in environment'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-xs transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={handleTestPing}
                    disabled={testState.loading || !urlInput}
                    className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {testState.loading ? 'Testing Connection...' : 'Ping Test Webhook'}
                  </button>
                  <button
                    type="button"
                    onClick={handleResetToEnv}
                    className="px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors ml-auto"
                  >
                    Reset to .env
                  </button>
                </div>
              </form>

              {/* Ping Result Banner */}
              {testState.result && (
                <div
                  className={`p-3.5 rounded-xl border flex items-start gap-2.5 text-xs ${
                    testState.result.ok
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-rose-50 border-rose-200 text-rose-800'
                  }`}
                >
                  {testState.result.ok ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                  )}
                  <div>
                    <div className="font-semibold">
                      {testState.result.ok ? 'Connection Verified' : 'Ping Failed'}
                    </div>
                    <p className="mt-0.5 leading-relaxed">{testState.result.message}</p>
                  </div>
                </div>
              )}

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 leading-relaxed">
                <span className="font-semibold">Important note on n8n Webhook:</span> When using
                n8n test webhooks (e.g. <code>/webhook-test/...</code>), remember to click{' '}
                <strong>"Listen for test event"</strong> in n8n before submitting, or activate the workflow
                to use the production webhook URL (<code>/webhook/...</code>).
              </div>
            </div>
          )}

          {activeTab === 'payload' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500">
                  Data structure sent via HTTP <code>POST</code> with <code>Content-Type: application/json</code>:
                </p>
                <button
                  onClick={handleCopyPayload}
                  className="inline-flex items-center gap-1 text-xs font-medium text-sky-600 hover:text-sky-700"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copied ? 'Copied!' : 'Copy JSON'}
                </button>
              </div>
              <pre className="p-4 bg-slate-900 text-emerald-400 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">
                {JSON.stringify(samplePayload, null, 2)}
              </pre>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-2">
                <h4 className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px]">1</span>
                  Create n8n Webhook Node
                </h4>
                <p>
                  Add a <strong>Webhook</strong> trigger node in n8n. Set HTTP Method to <strong>POST</strong> and Path to <code>smart-lead-intake</code>. Set Response Mode to <strong>On Received</strong> with response code <code>200</code>.
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-2">
                <h4 className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px]">2</span>
                  Add Google Sheets Node
                </h4>
                <p>
                  Connect the Webhook output to a <strong>Google Sheets</strong> node. Choose the operation <strong>Append Row</strong>. Select your spreadsheet and map the fields:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-700">
                  <li><code>Full Name</code> &rarr; <code>{`{{ $json.body.fullName }}`}</code></li>
                  <li><code>Email</code> &rarr; <code>{`{{ $json.body.email }}`}</code></li>
                  <li><code>Phone</code> &rarr; <code>{`{{ $json.body.phone }}`}</code></li>
                  <li><code>Company</code> &rarr; <code>{`{{ $json.body.company }}`}</code></li>
                  <li><code>Requirements</code> &rarr; <code>{`{{ $json.body.message }}`}</code></li>
                  <li><code>Status</code> &rarr; <code>{`{{ $json.body.status }}`}</code></li>
                  <li><code>Timestamp</code> &rarr; <code>{`{{ $json.body.submittedAt }}`}</code></li>
                </ul>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-2">
                <h4 className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px]">3</span>
                  Activate Workflow & Set Environment Variable
                </h4>
                <p>
                  Toggle the workflow to <strong>Active</strong> in n8n. Copy the production Webhook URL into your <code>.env</code> file as <code>VITE_N8N_WEBHOOK_URL</code> or add it in your Vercel Project Environment Variables.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
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

