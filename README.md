# ⚡ AccounTech Co-Pilot

> **Autonomous AI-Powered Financial Intelligence, Accounting & Business Operations Suite**

[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux%20%7C%20Web-blue.svg)](https://github.com)
[![License](https://img.shields.io/badge/License-Proprietary-indigo.svg)](LICENSE)
[![Built with React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61dafb.svg)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Style-Tailwind%20CSS-38bdf8.svg)](https://tailwindcss.com)
[![Electron](https://img.shields.io/badge/Desktop-Electron-47848F.svg)](https://electronjs.org)

AccounTech Co-Pilot is an all-in-one financial management platform combining double-entry accounting fundamentals with predictive AI models. Built privacy-first with local-first storage, it runs completely offline while offering optional cloud intelligence.

---

## 🌟 Key Features

### 💼 Financial Core & Accounting
- **Real-Time Cash Flow**: Executive dashboard showing total revenue, net income, burn rate, and runway.
- **Smart Transactions**: Categorization, receipt scanning, and automated balance reconciliation.
- **Branded Invoicing**: Professional invoice generator with status tracking (Draft, Sent, Paid, Overdue).
- **Tax Compliance & Deductions**: AI tax estimator with deductible expense detection and audit prep.
- **Budgets & Forecasting**: Predictive cash flow projections and department budget tracking.

### 👥 Operations & Growth
- **CRM & Client Hub**: Customer contact management, billing history, and contract records.
- **Automated Workflows**: Visual event-driven triggers for late payment notices and expense approvals.
- **Payroll & Compensation**: Salary calculators, tax withholdings, and pay run generator.
- **Inventory Tracking**: Stock level monitoring, SKU registry, and reorder alerts.

### 🤖 Autonomous AI Co-Pilot
- **Multi-Model Intelligence**: Works seamlessly with Google Gemini, OpenAI GPT-4o, or 100% offline local Ollama models.
- **Voice Assistant**: Natural voice-command queries for quick expense logging and balance queries.
- **Automated Anomaly Detection**: Proactive alerts for unusual expenses or margin shifts.

---

## 💻 Desktop Application (Windows, Mac, Linux)

### Download Installers
Pre-compiled standalone binaries can be found under the [Releases](https://github.com) section:
- **Windows**: `AccounTech-CoPilot-Setup-1.0.0.exe` (NSIS Installer) or Portable `.exe`
- **macOS**: `AccounTech-CoPilot-1.0.0.dmg`
- **Linux**: `AccounTech-CoPilot-1.0.0.AppImage` or `.deb`

---

## 🚀 Development & Building from Source

### Prerequisites
- [Node.js](https://nodejs.org) (v18 or higher)
- npm or yarn

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Web Dev Server
```bash
npm run dev
```

### 3. Run Desktop Application (Electron)
```bash
# Development mode with Hot Module Reloading:
npm run desktop:dev

# Run with local production build:
npm run desktop:preview
```

### 4. Build Production Binaries
```bash
# Build Web bundle (dist/):
npm run build

# Package Desktop Installers:
npm run dist:win     # Windows Installer (.exe)
npm run dist:mac     # macOS DMG (.dmg)
npm run dist:linux   # Linux AppImage & DEB
```

---

## 🌐 Deploying to the Web (Vercel)

Deploying AccounTech Co-Pilot as a web application on Vercel is seamless:
1. Push your code to GitHub.
2. Import your repository into [Vercel](https://vercel.com).
3. The included `vercel.json` and Vite build settings will configure everything automatically.
4. Your app is live with global CDN distribution and SSL!

---

## 🔒 Security & Privacy

- **Local-First Architecture**: Your financial records, client lists, and payroll data are stored locally in your app sandbox.
- **No Mandatory Cloud Database**: Operates without external database lock-in.
- **Configurable AI**: Connect your private API keys directly or run completely offline with local LLMs.
