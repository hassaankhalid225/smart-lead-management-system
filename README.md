# 🚀 Smart Lead Management System

A modern, minimal, and responsive **Smart Lead Management System** built with **React**, **Vite**, and **Tailwind CSS**, connected to **local n8n** and **Google Sheets**.

---

## ⚡ Quick Start with Local n8n (1-Click Run)

### 🎯 Option 1: Start Everything with 1 Click
Double-click [`START-ALL.bat`](file:///d:/Work/My%20Work/Web/Ayesha/START-ALL.bat) in this project folder:
- Starts **n8n Local Server** on [http://localhost:5678](http://localhost:5678)
- Starts **React Frontend** on [http://localhost:5173](http://localhost:5173)

### 🎯 Option 2: Start Services Separately
1. **Start n8n**: Double-click [`START-N8N.bat`](file:///d:/Work/My%20Work/Web/Ayesha/START-N8N.bat) (or run `n8n start`)
2. **Start Frontend**: Run `pnpm run dev` (or `npm run dev`)

---

## ⚙️ Local n8n Setup Details

1. **Active Endpoint**:
   Your [`.env`](file:///d:/Work/My%20Work/Web/Ayesha/.env) is configured to connect directly to your local n8n instance:
   ```env
   VITE_N8N_WEBHOOK_URL=http://localhost:5678/webhook/smart-lead-intake
   ```

2. **Pre-Built Automation Workflow**:
   The workflow file [`n8n-workflow-smart-leads.json`](file:///d:/Work/My%20Work/Web/Ayesha/n8n-workflow-smart-leads.json) includes:
   - **Webhook Node**: Receives form submissions at `/webhook/smart-lead-intake`
   - **Format Data Node**: Validates and cleans lead details
   - **Google Sheets Node**: Appends rows automatically into your Google Sheet
   - **Respond to Webhook Node**: Returns a 200 JSON confirmation to the React form

3. **Auto-Injected Workflow**:
   The workflow **"Smart Lead Management Intake Pipeline"** has already been injected into your local n8n database (`~/.n8n/database.sqlite`). You will see it directly inside your n8n workflows dashboard at [http://localhost:5678](http://localhost:5678)!

---

## 📋 Features

- **Lead Submission Form**:
  - Full Name, Email, Phone, Company (optional), Requirements / Message
  - Real-time inline validation & error messages
  - Loading animation, confetti celebration on success, and automatic form reset
- **Executive Admin Dashboard**:
  - Live metric cards: Total, New, Contacted, and Converted leads
  - Status filters and live search
  - Lead details modal with status switcher & direct email/call links
  - Export to CSV
- **Vercel Ready**:
  - Zero-config deployment with [`vercel.json`](file:///d:/Work/My%20Work/Web/Ayesha/vercel.json)
