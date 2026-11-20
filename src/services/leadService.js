/**
 * Lead Service
 * Handles POSTing lead submissions to the n8n Webhook
 * and syncing with localStorage for the Admin Dashboard.
 */

const STORAGE_KEY = 'smart_leads_system_data';

/**
 * Retrieve the active n8n webhook URL from environment or localStorage override
 * @returns {string}
 */
export function getWebhookUrl() {
  const customUrl = localStorage.getItem('n8n_custom_webhook_url');
  if (customUrl && customUrl.trim()) {
    return customUrl.trim();
  }
  return import.meta.env.VITE_N8N_WEBHOOK_URL || '';
}

/**
 * Save custom webhook URL override to localStorage
 * @param {string} url
 */
export function setCustomWebhookUrl(url) {
  if (!url) {
    localStorage.removeItem('n8n_custom_webhook_url');
  } else {
    localStorage.setItem('n8n_custom_webhook_url', url.trim());
  }
}

/**
 * Load leads from localStorage (or seed with initial data)
 * @param {Array} initialSeed
 * @returns {Array}
 */
export function loadStoredLeads(initialSeed = []) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialSeed));
      return initialSeed;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : initialSeed;
  } catch (err) {
    console.warn('Failed to load leads from localStorage:', err);
    return initialSeed;
  }
}

/**
 * Save leads list to localStorage
 * @param {Array} leads
 */
export function saveStoredLeads(leads) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  } catch (err) {
    console.error('Failed to save leads to localStorage:', err);
  }
}

/**
 * Send lead submission to n8n Webhook
 * @param {Object} leadData - Form data: { fullName, email, phone, company, message }
 * @returns {Promise<{ success: boolean, lead?: Object, message?: string, error?: string }>}
 */
export async function submitLeadToWebhook(leadData) {
  const webhookUrl = getWebhookUrl();

  // Construct structured payload
  const lead = {
    id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    fullName: leadData.fullName.trim(),
    email: leadData.email.trim().toLowerCase(),
    phone: leadData.phone.trim(),
    company: (leadData.company || '').trim(),
    message: leadData.message.trim(),
    status: 'New',
    submittedAt: new Date().toISOString(),
    source: 'Smart Lead Management System - Web Form',
    metadata: {
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      platform: typeof navigator !== 'undefined' ? navigator.platform : '',
      language: typeof navigator !== 'undefined' ? navigator.language : '',
    },
  };

  // Check if webhook URL is configured
  if (!webhookUrl || webhookUrl.includes('example.com') || webhookUrl.includes('your-domain.com')) {
    // If running in development or demo mode without real n8n URL configured,
    // simulate a realistic network delay and succeed while advising the user
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Save lead locally so it still appears in the Admin Dashboard
    appendLeadToStorage(lead);

    return {
      success: true,
      lead,
      isDemoMode: true,
      message: 'Lead captured successfully! (Notice: Using demo mode since a valid n8n Webhook URL is not yet configured in .env)',
    };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(lead),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(`n8n Webhook returned status ${response.status}: ${errorText || response.statusText}`);
    }

    // Attempt to parse response body if JSON
    let responseData = null;
    try {
      responseData = await response.json();
    } catch {
      // n8n webhooks sometimes return plain string "Workflow was started" or empty body
    }

    // Save to local storage for Admin Dashboard reflection
    appendLeadToStorage(lead);

    return {
      success: true,
      lead,
      responseData,
      message: 'Your inquiry has been submitted and dispatched to our n8n automation pipeline!',
    };
  } catch (error) {
    console.error('Webhook dispatch error:', error);

    // Common issue: CORS restriction or n8n test webhook not running
    let errorMessage = error.message || 'Failed to dispatch data to n8n webhook.';
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      errorMessage =
        'Network/CORS error: The n8n Webhook was unreachable. Verify your n8n webhook URL, check if your n8n workflow is active, and ensure CORS is enabled on your n8n instance.';
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Append newly created lead to localStorage
 * @param {Object} newLead
 */
function appendLeadToStorage(newLead) {
  try {
    const existing = loadStoredLeads([]);
    const updated = [newLead, ...existing];
    saveStoredLeads(updated);
  } catch (err) {
    console.warn('Could not save lead to local storage:', err);
  }
}

/**
 * Test connectivity to an n8n webhook URL
 * @param {string} url
 * @returns {Promise<{ ok: boolean, status: number|string, message: string }>}
 */
export async function testWebhookConnectivity(url) {
  if (!url) {
    return { ok: false, status: 'EMPTY', message: 'Webhook URL cannot be empty.' };
  }

  try {
    const testPayload = {
      test: true,
      eventType: 'connection_test',
      timestamp: new Date().toISOString(),
      client: 'Smart Lead Management System',
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testPayload),
    });

    return {
      ok: res.ok,
      status: res.status,
      message: res.ok
        ? `Successfully connected! n8n responded with status ${res.status}.`
        : `n8n returned status ${res.status} (${res.statusText}).`,
    };
  } catch (err) {
    return {
      ok: false,
      status: 'NETWORK_ERROR',
      message: `Failed to connect: ${err.message}. If n8n is running locally or self-hosted, check CORS headers or make sure the workflow is Active / "Listen for test event" is turned on.`,
    };
  }
}

