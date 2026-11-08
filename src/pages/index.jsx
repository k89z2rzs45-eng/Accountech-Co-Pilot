import Layout from "./Layout.jsx";

import Dashboard from "./Dashboard";

import Transactions from "./Transactions";

import Invoices from "./Invoices";

import TaxReports from "./TaxReports";

import Budgets from "./Budgets";

import Analytics from "./Analytics";

import Payroll from "./Payroll";

import Forecasting from "./Forecasting";

import Workflows from "./Workflows";

import InvoiceView from "./InvoiceView";

import Profile from "./Profile";

import Clients from "./Clients";

import Inventory from "./Inventory";

import Alerts from "./Alerts";

import Testing from "./Testing";

import Settings from "./Settings";

import Expenses from "./Expenses";

import CRM from "./CRM";

import HumanResources from "./HumanResources";

import Integrations from "./Integrations";

import AIAssistant from "./AIAssistant";

import Collaboration from "./Collaboration";

import BusinessIntelligence from "./BusinessIntelligence";

import SystemMaintenance from "./SystemMaintenance";

import Pricing from "./Pricing";

import { HashRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Dashboard: Dashboard,
    
    Transactions: Transactions,
    
    Invoices: Invoices,
    
    TaxReports: TaxReports,
    
    Budgets: Budgets,
    
    Analytics: Analytics,
    
    Payroll: Payroll,
    
    Forecasting: Forecasting,
    
    Workflows: Workflows,
    
    InvoiceView: InvoiceView,
    
    Profile: Profile,
    
    Clients: Clients,
    
    Inventory: Inventory,
    
    Alerts: Alerts,
    
    Testing: Testing,
    
    Settings: Settings,
    
    Expenses: Expenses,
    
    CRM: CRM,
    
    HumanResources: HumanResources,
    
    Integrations: Integrations,
    
    AIAssistant: AIAssistant,
    
    Collaboration: Collaboration,
    
    BusinessIntelligence: BusinessIntelligence,
    
    SystemMaintenance: SystemMaintenance,
    
    Pricing: Pricing,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Dashboard />} />
                
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/Transactions" element={<Transactions />} />
                
                <Route path="/Invoices" element={<Invoices />} />
                
                <Route path="/TaxReports" element={<TaxReports />} />
                
                <Route path="/Budgets" element={<Budgets />} />
                
                <Route path="/Analytics" element={<Analytics />} />
                
                <Route path="/Payroll" element={<Payroll />} />
                
                <Route path="/Forecasting" element={<Forecasting />} />
                
                <Route path="/Workflows" element={<Workflows />} />
                
                <Route path="/InvoiceView" element={<InvoiceView />} />
                
                <Route path="/Profile" element={<Profile />} />
                
                <Route path="/Clients" element={<Clients />} />
                
                <Route path="/Inventory" element={<Inventory />} />
                
                <Route path="/Alerts" element={<Alerts />} />
                
                <Route path="/Testing" element={<Testing />} />
                
                <Route path="/Settings" element={<Settings />} />
                
                <Route path="/Expenses" element={<Expenses />} />
                
                <Route path="/CRM" element={<CRM />} />
                
                <Route path="/HumanResources" element={<HumanResources />} />
                
                <Route path="/Integrations" element={<Integrations />} />
                
                <Route path="/AIAssistant" element={<AIAssistant />} />
                
                <Route path="/Collaboration" element={<Collaboration />} />
                
                <Route path="/BusinessIntelligence" element={<BusinessIntelligence />} />
                
                <Route path="/SystemMaintenance" element={<SystemMaintenance />} />
                
                <Route path="/Pricing" element={<Pricing />} />
                
                <Route path="*" element={<Dashboard />} />
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}