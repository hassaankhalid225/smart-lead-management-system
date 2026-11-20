/**
 * Mock leads data used for initial seeding of the Admin Dashboard.
 * Includes various lead statuses: New, Contacted, Converted, Qualified.
 */

export const INITIAL_LEADS = [
  {
    id: 'lead-1001',
    fullName: 'Sarah Jenkins',
    email: 'sarah.j@novacrest.io',
    phone: '+1 (415) 882-9301',
    company: 'NovaCrest Solutions',
    message: 'Looking for a custom CRM automation workflow connecting Google Sheets, n8n, and Slack alerts for our 15-person sales team.',
    status: 'New',
    submittedAt: '2026-11-18T18:42:00.000Z',
    source: 'Smart Lead Form',
  },
  {
    id: 'lead-1002',
    fullName: 'David Miller',
    email: 'd.miller@apexlogistics.co',
    phone: '+1 (206) 492-1144',
    company: 'Apex Logistics Corp',
    message: 'We receive ~200 inbound enterprise requests monthly. We need automated qualification rules and direct sync to our backend spreadsheets.',
    status: 'Contacted',
    submittedAt: '2026-11-17T14:15:00.000Z',
    source: 'Smart Lead Form',
  },
  {
    id: 'lead-1003',
    fullName: 'Elena Rostova',
    email: 'elena@vanguarddigital.de',
    phone: '+49 170 555 3829',
    company: 'Vanguard Digital Agency',
    message: 'Need full-stack frontend lead capture system with webhook integration. Very impressed by the dashboard preview, let’s schedule a demo.',
    status: 'Converted',
    submittedAt: '2026-11-16T09:30:00.000Z',
    source: 'Smart Lead Form',
  },
  {
    id: 'lead-1004',
    fullName: 'Marcus Thorne',
    email: 'marcus@thornecapital.com',
    phone: '+1 (312) 710-8492',
    company: 'Thorne Capital Partners',
    message: 'Exploring automated ingestion for our client consultation requests. Please contact me via phone afternoon EST.',
    status: 'Contacted',
    submittedAt: '2026-11-15T11:05:00.000Z',
    source: 'Smart Lead Form',
  },
  {
    id: 'lead-1005',
    fullName: 'Amira Patel',
    email: 'amira.patel@horizonhealth.org',
    phone: '+1 (617) 329-0199',
    company: 'Horizon Health Initiative',
    message: 'We are revamping our partner intake pipeline. Need n8n webhooks to dispatch instant WhatsApp notifications and write to Google Sheets.',
    status: 'Converted',
    submittedAt: '2026-11-14T16:20:00.000Z',
    source: 'Smart Lead Form',
  },
  {
    id: 'lead-1006',
    fullName: 'Liam O’Connor',
    email: 'liam@emeraldventures.ie',
    phone: '+353 87 123 4567',
    company: 'Emerald Ventures',
    message: 'Just testing out the form responsiveness. Interested in pricing for custom multi-step lead routing.',
    status: 'New',
    submittedAt: '2026-11-13T20:10:00.000Z',
    source: 'Smart Lead Form',
  },
];

