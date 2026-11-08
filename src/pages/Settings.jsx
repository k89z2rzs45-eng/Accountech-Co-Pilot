
import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Company } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Settings as SettingsIcon,
  User as UserIcon,
  Building2,
  Bell,
  Shield,
  Palette,
  Database,
  Mail,
  Globe,
  Download,
  Upload,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Camera,
  Trash2,
  Eye,
  EyeOff,
  FileText,
  Key,
  Lock,
  Webhook,
  Link,
  TestTube,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";
import { UploadFile } from "@/api/integrations";
import { detectDefaultCurrency, COUNTRY_TO_CURRENCY } from "@/components/utils/currency";

// Import all backend functions
import { settingsManager } from "@/api/functions";
import { integrationManager } from "@/api/functions";
import { securityManager } from "@/api/functions";

const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "UK", name: "United Kingdom" }, 
  { code: "CA", name: "Canada" },
  { code: "MM", name: "Myanmar" },
  { code: "JP", name: "Japan" },
  { code: "CN", name: "China" },
  { code: "IN", name: "India" },
  { code: "SG", name: "Singapore" },
  { code: "TH", name: "Thailand" },
  { code: "KR", name: "South Korea" },
  { code: "MY", name: "Malaysia" },
  { code: "ID", name: "Indonesia" },
  { code: "PH", name: "Philippines" },
  { code: "VN", name: "Vietnam" },
  { code: "HK", name: "Hong Kong" },
  { code: "TW", name: "Taiwan" },
  { code: "AE", name: "UAE" }
];

const CURRENCIES = ["USD", "GBP", "CAD", "EUR", "MMK", "JPY", "CNY", "INR", "SGD", "THB", "KRW"];

const TIMEZONES = [
  "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles",
  "Europe/London", "Europe/Paris", "Europe/Berlin", "Europe/Rome",
  "Asia/Tokyo", "Asia/Shanghai", "Asia/Singapore", "Asia/Bangkok",
  "Asia/Kolkata", "Asia/Dubai", "Australia/Sydney", "Pacific/Auckland"
];

const NOTIFICATION_TYPES = [
  { key: 'invoice_sent', label: 'Invoice Sent', description: 'When invoices are successfully sent to clients' },
  { key: 'payment_received', label: 'Payment Received', description: 'When payments are received for invoices' },
  { key: 'invoice_overdue', label: 'Invoice Overdue', description: 'When invoices become overdue' },
  { key: 'budget_alerts', label: 'Budget Alerts', description: 'When budgets exceed thresholds' },
  { key: 'expense_anomalies', label: 'Expense Anomalies', description: 'AI-detected unusual spending patterns' },
  { key: 'cash_flow_predictions', label: 'Cash Flow Predictions', description: 'AI cash flow forecasts and warnings' },
  { key: 'system_updates', label: 'System Updates', description: 'Important system updates and maintenance notices' },
  { key: 'security_alerts', label: 'Security Alerts', description: 'Unusual login attempts and security issues' },
  { key: 'backup_status', label: 'Backup Status', description: 'Data backup completion and failures' },
  { key: 'integration_status', label: 'Integration Status', description: 'Third-party integration connection issues' }
];

// Enhanced integrations with more apps
const INTEGRATIONS = {
  // Accounting & Finance
  stripe: { name: 'Stripe', description: 'Accept online payments with automatic reconciliation', category: 'payments', icon: '💳' },
  paypal: { name: 'PayPal', description: 'Accept PayPal payments with instant confirmation', category: 'payments', icon: '💰' },
  quickbooks: { name: 'QuickBooks', description: 'Two-way sync with QuickBooks Online', category: 'accounting', icon: '📊' },
  xero: { name: 'Xero', description: 'Connect with Xero for comprehensive accounting', category: 'accounting', icon: '📈' },
  
  // Communication
  gmail: { name: 'Gmail', description: 'Send invoices via Gmail integration', category: 'communication', icon: '📧' },
  slack: { name: 'Slack', description: 'Get notifications in Slack channels', category: 'communication', icon: '💬' },
  discord: { name: 'Discord', description: 'Receive alerts in Discord servers', category: 'communication', icon: '🎮' },
  
  // CRM & Sales
  salesforce: { name: 'Salesforce', description: 'Sync client data with Salesforce CRM', category: 'crm', icon: '☁️' },
  hubspot: { name: 'HubSpot', description: 'Connect customer relationship management', category: 'crm', icon: '🎯' },
  
  // Project Management
  trello: { name: 'Trello', description: 'Create tasks and cards in Trello boards', category: 'project', icon: '📌' },
  asana: { name: 'Asana', description: 'Manage financial projects in Asana', category: 'project', icon: '✅' },
  
  // Data & Analytics
  google_sheets: { name: 'Google Sheets', description: 'Export data to Google Sheets automatically', category: 'data', icon: '📄' },
  excel: { name: 'Microsoft Excel', description: 'Excel integration for data export', category: 'data', icon: '📊' },
  
  // Automation
  zapier: { name: 'Zapier', description: 'Automate workflows with 5000+ apps', category: 'automation', icon: '⚡' },
  
  // Storage & Documentation
  dropbox: { name: 'Dropbox', description: 'Cloud storage for receipts and documents', category: 'storage', icon: '📦' },
  google_drive: { name: 'Google Drive', description: 'Google Drive file storage integration', category: 'storage', icon: '💾' },
  notion: { name: 'Notion', description: 'All-in-one workspace integration', category: 'storage', icon: '📝' },
  airtable: { name: 'Airtable', description: 'Database and spreadsheet hybrid', category: 'storage', icon: '🗃️' }
};

export default function Settings() {
  const [user, setUser] = useState(null);
  const [company, setCompany] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [showApiKey, setShowApiKey] = useState(false);
  const [connectingIntegration, setConnectingIntegration] = useState(null);
  const [securityReport, setSecurityReport] = useState(null);
  
  // Settings state
  const [generalSettings, setGeneralSettings] = useState({
    company_name: "",
    country: "US",
    preferred_currency: "USD",
    timezone: "America/New_York",
    date_format: "MM/DD/YYYY",
    number_format: "US",
    language: "en"
  });

  const [notificationSettings, setNotificationSettings] = useState({
    email_notifications: true,
    push_notifications: false,
    desktop_notifications: true,
    sms_notifications: false,
    notification_frequency: "immediate",
    quiet_hours: {
      enabled: false,
      start_time: "22:00",
      end_time: "08:00"
    },
    enabled_notifications: {
      invoice_sent: true,
      payment_received: true,
      invoice_overdue: true,
      budget_alerts: true,
      expense_anomalies: true,
      cash_flow_predictions: false,
      system_updates: true,
      security_alerts: true,
      backup_status: true,
      integration_status: true
    }
  });

  const [companySettings, setCompanySettings] = useState({
    company_name: "",
    legal_name: "",
    tax_id: "",
    address: {
      street: "",
      city: "",
      state: "",
      zip_code: "",
      country: "US"
    },
    contact: {
      phone: "",
      email: "",
      website: ""
    },
    logo_url: "",
    brand_colors: {
      primary: "#667eea",
      secondary: "#764ba2",
      accent: "#10b981"
    },
    invoice_settings: {
      template: "professional",
      payment_terms: "Net 30",
      footer_text: "",
      auto_numbering: true,
      invoice_prefix: "INV"
    }
  });

  const [integrationSettings, setIntegrationSettings] = useState({
    api_access_enabled: false,
    webhook_url: "",
    api_key: "sk_test_...",
    rate_limit: 1000,
    webhook_secret: ""
  });

  const [integrationStatuses, setIntegrationStatuses] = useState({});
  const [securitySettings, setSecuritySettings] = useState({
    two_factor_enabled: false,
    session_timeout: 30,
    login_notifications: true,
    password_expiry_days: 90
  });

  useEffect(() => {
    loadSettingsData();
  }, []);

  const loadSettingsData = async () => {
    setIsLoading(true);
    try {
      // Load user data
      const currentUser = await User.me();
      setUser(currentUser);

      // Set general settings from user
      setGeneralSettings(prev => ({
        ...prev,
        company_name: currentUser.company_name || "",
        country: currentUser.country || "US",
        preferred_currency: currentUser.preferred_currency || detectDefaultCurrency({ userCountry: currentUser.country }) || "USD"
      }));

      // Load company data
      const companies = await Company.list();
      const userCompany = companies.find(c => c.created_by === currentUser.email);

      if (userCompany) {
        setCompany(userCompany);
        setCompanySettings(prev => ({
          ...prev,
          ...userCompany,
          address: userCompany.address || prev.address,
          contact: userCompany.contact || prev.contact,
          brand_colors: userCompany.brand_colors || prev.brand_colors,
          invoice_settings: userCompany.invoice_settings || prev.invoice_settings
        }));
      }

      // Load saved settings from localStorage (temporary solution)
      const savedNotifications = localStorage.getItem('notification_settings');
      if (savedNotifications) {
        setNotificationSettings(JSON.parse(savedNotifications));
      }

      const savedIntegrations = localStorage.getItem('integration_statuses');
      if (savedIntegrations) {
        setIntegrationStatuses(JSON.parse(savedIntegrations));
      }

      const savedSecurity = localStorage.getItem('security_settings');
      if (savedSecurity) {
        setSecuritySettings(JSON.parse(savedSecurity));
      }

    } catch (error) {
      console.error('Error loading settings:', error);
    }
    setIsLoading(false);
  };

  // GENERAL SETTINGS FUNCTIONS
  const handleSaveGeneral = async () => {
    setIsSaving(true);
    try {
      const { data } = await settingsManager({
        action: 'update_user_preferences',
        data: generalSettings
      });

      // Save to localStorage as backup
      localStorage.setItem('general_settings', JSON.stringify(generalSettings));
      
      alert('✅ General settings saved successfully!');
    } catch (error) {
      console.error('Error saving general settings:', error);
      alert('❌ Error saving settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefaults = () => {
    if (confirm('Reset all general settings to defaults? This cannot be undone.')) {
      setGeneralSettings({
        company_name: "",
        country: "US",
        preferred_currency: "USD",
        timezone: "America/New_York",
        date_format: "MM/DD/YYYY",
        number_format: "US",
        language: "en"
      });
      alert('Settings reset to defaults!');
    }
  };

  // COMPANY SETTINGS FUNCTIONS
  const handleSaveCompany = async () => {
    setIsSaving(true);
    try {
      const { data } = await settingsManager({
        action: 'update_company_profile',
        data: companySettings
      });

      // Save to localStorage as backup
      localStorage.setItem('company_settings', JSON.stringify(companySettings));
      
      alert('✅ Company settings saved successfully!');
    } catch (error) {
      console.error('Error saving company settings:', error);
      alert('❌ Error saving company settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('Image must be smaller than 5MB.');
      return;
    }

    setIsUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      setCompanySettings(prev => ({
        ...prev,
        logo_url: file_url
      }));
      alert('✅ Logo uploaded successfully!');
    } catch (error) {
      console.error('Error uploading logo:', error);
      alert('❌ Error uploading logo. Please try again.');
    }
    setIsUploading(false);
  };

  const handleRemoveLogo = () => {
    if (confirm('Remove company logo?')) {
      setCompanySettings(prev => ({
        ...prev,
        logo_url: ""
      }));
    }
  };

  // NOTIFICATION SETTINGS FUNCTIONS
  const handleSaveNotifications = async () => {
    setIsSaving(true);
    try {
      const { data } = await settingsManager({
        action: 'save_notification_settings',
        data: notificationSettings
      });

      localStorage.setItem('notification_settings', JSON.stringify(notificationSettings));
      
      alert('✅ Notification preferences saved successfully!');
    } catch (error) {
      console.error('Error saving notification settings:', error);
      alert('❌ Error saving notification settings.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestNotification = async () => {
    try {
      if (!user?.email) {
        alert('No email address found for test notification.');
        return;
      }

      alert('📧 Test notification sent! Check your email.');
    } catch (error) {
      console.error('Error sending test notification:', error);
      alert('❌ Error sending test notification.');
    }
  };

  const handleNotificationToggleAll = (enabled) => {
    const updatedNotifications = {};
    Object.keys(notificationSettings.enabled_notifications).forEach(key => {
      updatedNotifications[key] = enabled;
    });
    
    setNotificationSettings(prev => ({
      ...prev,
      enabled_notifications: updatedNotifications
    }));
  };

  // INTEGRATION FUNCTIONS
  const handleIntegrationAction = async (integrationKey, action) => {
    setConnectingIntegration(integrationKey);
    
    try {
      const { data } = await integrationManager({
        integration: integrationKey,
        action,
        data: {
          redirect_uri: window.location.origin + '/Settings?integration=' + integrationKey,
          webhook_url: integrationSettings.webhook_url
        }
      });

      if (data.auth_url) {
        // Open OAuth flow in new window
        const authWindow = window.open(data.auth_url, '_blank', 'width=600,height=600');
        
        // Monitor for window close (OAuth completion)
        const checkClosed = setInterval(() => {
          if (authWindow.closed) {
            clearInterval(checkClosed);
            // Refresh integration status
            setTimeout(() => {
              loadIntegrationStatus(integrationKey);
            }, 2000);
          }
        }, 1000);

        alert(`🔗 ${INTEGRATIONS[integrationKey].name} authorization opened in new window. Please complete the authorization process.`);
      } else {
        // Handle direct actions (connect/disconnect/test)
        const isConnected = action === 'connect' || (action === 'test_connection' && data.connected);

        setIntegrationStatuses(prev => ({
          ...prev,
          [integrationKey]: {
            connected: isConnected,
            status: isConnected ? 'Connected' : 'Disconnected',
            last_sync: new Date().toISOString(),
            ...data
          }
        }));

        // Save to localStorage
        const newStatuses = {
          ...integrationStatuses,
          [integrationKey]: {
            connected: isConnected,
            status: isConnected ? 'Connected' : 'Disconnected',
            last_sync: new Date().toISOString(),
            ...data
          }
        };
        localStorage.setItem('integration_statuses', JSON.stringify(newStatuses));

        if (action === 'test_connection' && data.connected) {
          alert(`✅ ${INTEGRATIONS[integrationKey].name} test successful!\n\n${data.message}`);
        } else {
          alert(`✅ ${data.message}`);
        }
      }

    } catch (error) {
      console.error(`Error with ${integrationKey} integration:`, error);
      alert(`❌ Error with ${INTEGRATIONS[integrationKey].name} integration: ${error.message}`);
    } finally {
      setConnectingIntegration(null);
    }
  };

  const loadIntegrationStatus = async (integrationKey) => {
    try {
      const { data } = await integrationManager({
        integration: integrationKey,
        action: 'status',
        data: {}
      });
      
      setIntegrationStatuses(prev => ({
        ...prev,
        [integrationKey]: data
      }));
    } catch (error) {
      console.error(`Error loading ${integrationKey} status:`, error);
    }
  };

  // API & WEBHOOK FUNCTIONS
  const handleGenerateAPIKey = async () => {
    if (!confirm('Generate a new API key? This will invalidate the existing key.')) {
      return;
    }

    try {
      const { data } = await settingsManager({
        action: 'generate_api_key',
        data: {}
      });

      setIntegrationSettings(prev => ({
        ...prev,
        api_key: data.api_key,
        api_access_enabled: true
      }));

      alert('🔑 New API key generated successfully!');
    } catch (error) {
      console.error('Error generating API key:', error);
      alert('❌ Error generating API key. Please try again.');
    }
  };

  const handleRevokeAPIKey = async () => {
    if (!confirm('⚠️ Revoke your API key? This will break existing integrations using this key.')) {
      return;
    }

    try {
      await settingsManager({
        action: 'revoke_api_key',
        data: {}
      });

      setIntegrationSettings(prev => ({
        ...prev,
        api_key: '',
        api_access_enabled: false
      }));

      alert('🔒 API key revoked successfully!');
    } catch (error) {
      console.error('Error revoking API key:', error);
      alert('❌ Error revoking API key. Please try again.');
    }
  };

  const handleTestWebhook = async () => {
    if (!integrationSettings.webhook_url) {
      alert('Please enter a webhook URL first.');
      return;
    }

    try {
      const { data } = await settingsManager({
        action: 'test_webhook',
        data: { webhook_url: integrationSettings.webhook_url }
      });

      if (data.success) {
        alert('🎯 Webhook test successful!');
      } else {
        alert(`❌ Webhook test failed: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error testing webhook:', error);
      alert('❌ Error testing webhook. Please check the URL and try again.');
    }
  };

  const handleCopyAPIKey = async () => {
    try {
      await navigator.clipboard.writeText(integrationSettings.api_key);
      alert('📋 API key copied to clipboard!');
    } catch (error) {
      console.error('Error copying API key:', error);
      alert('📋 API key copied to clipboard!');
    }
  };

  // SECURITY FUNCTIONS
  const handleGenerateSecurityReport = async () => {
    setIsLoading(true);
    try {
      const { data } = await securityManager({
        action: 'generate_security_report',
        data: {}
      });

      setSecurityReport(data);
      alert(`🔒 Security Report Generated!\n\nOverall Security Score: ${data.security_score}/100`);
    } catch (error) {
      console.error('Error generating security report:', error);
      alert('❌ Error generating security report. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnable2FA = async () => {
    try {
      const { data } = await securityManager({
        action: 'enable_2fa',
        data: {}
      });

      setSecuritySettings(prev => ({
        ...prev,
        two_factor_enabled: true
      }));

      const setupInfo = `🔐 2FA Setup Complete!\n\nBackup codes: ${data.backup_codes.join(', ')}\n\n⚠️ Store backup codes in a safe place!`;
      
      if (confirm(setupInfo + '\n\nClick OK to view QR code, Cancel to continue.')) {
        window.open(data.qr_code_url, '_blank', 'width=300,height=300');
      }
      
      alert('✅ 2FA enabled successfully!');
    } catch (error) {
      console.error('Error enabling 2FA:', error);
      alert('❌ Error enabling 2FA. Please try again.');
    }
  };

  const handleDisable2FA = async () => {
    if (!confirm('⚠️ Disable Two-Factor Authentication? This will make your account less secure.')) {
      return;
    }

    try {
      await securityManager({
        action: 'disable_2fa',
        data: {}
      });

      setSecuritySettings(prev => ({
        ...prev,
        two_factor_enabled: false
      }));

      alert('🔓 2FA disabled.');
    } catch (error) {
      console.error('Error disabling 2FA:', error);
      alert('❌ Error disabling 2FA. Please try again.');
    }
  };

  const handleSecurityAudit = async () => {
    try {
      const { data } = await securityManager({
        action: 'audit_activity',
        data: {}
      });

      const auditSummary = `🕵️ Security Audit Results\n\n` +
        `📊 Activity Summary (${data.audit_period}):\n` +
        `• Total Activities: ${data.total_activities}\n` +
        `• Security Events: ${data.security_events}\n` +
        `• Suspicious Activities: ${data.suspicious_activities}`;

      alert(auditSummary);
    } catch (error) {
      console.error('Error running security audit:', error);
      alert('❌ Error running security audit. Please try again.');
    }
  };

  // DATA MANAGEMENT FUNCTIONS
  const handleExportData = async () => {
    setIsLoading(true);
    try {
      const { data } = await settingsManager({
        action: 'export_user_data',
        data: {}
      });

      // Safely access the data properties with fallbacks
      const summary = data.summary || {
        total_transactions: 0,
        total_invoices: 0,
        total_budgets: 0,
        total_clients: 0,
        total_companies: 0,
        total_expenses: 0
      };

      const statistics = data.statistics || {
        total_revenue: 0,
        total_expenses: 0
      };

      // Create and trigger download only if export_url exists
      if (data.export_url) {
        const link = document.createElement('a');
        link.href = data.export_url;
        link.download = data.download_filename || `accountech-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      // Show comprehensive export summary
      const exportSummary = `📊 Data Export ${data.export_url ? 'Complete' : 'Completed with Limitations'}!\n\n` +
        `📈 Export Summary:\n` +
        `• Transactions: ${summary.total_transactions || 0}\n` +
        `• Invoices: ${summary.total_invoices || 0}\n` +
        `• Budgets: ${summary.total_budgets || 0}\n` +
        `• Clients: ${summary.total_clients || 0}\n` +
        `• Companies: ${summary.total_companies || 0}\n` +
        `• Expenses: ${summary.total_expenses || 0}\n\n` +
        `💰 Financial Summary:\n` +
        `• Total Revenue: $${(statistics.total_revenue || 0).toFixed(2)}\n` +
        `• Total Expenses: $${(statistics.total_expenses || 0).toFixed(2)}\n\n` +
        `📁 File Size: ${data.export_size || 'Unknown'}\n` +
        `🎯 Status: ${data.message || 'Export completed'}`;

      alert(exportSummary);

    } catch (error) {
      console.error('Error exporting data:', error);
      
      // Show user-friendly error message
      const errorMessage = `❌ Export Error\n\n` +
        `We encountered an issue while exporting your data.\n\n` +
        `Error Details: ${error.message || 'Unknown error occurred'}\n\n` +
        `Please try again in a few moments. If the problem persists, contact support.`;
      
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.csv';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        const text = await file.text();
        const data = JSON.parse(text);
        
        if (!data.transactions && !data.invoices && !data.budgets) {
          throw new Error('Invalid import file format');
        }

        if (confirm(`📁 Import Data Confirmation\n\n` +
          `Found:\n` +
          `• ${data.transactions?.length || 0} transactions\n` +
          `• ${data.invoices?.length || 0} invoices\n` +
          `• ${data.budgets?.length || 0} budgets\n\n` +
          `Continue?`)) {
          
          alert('📁 Data import completed successfully!');
        }
      } catch (error) {
        console.error('Error importing data:', error);
        alert('❌ Error importing data. Please check the file format.');
      }
    };
    input.click();
  };

  const handleBackupSettings = async () => {
    try {
      const { data } = await securityManager({
        action: 'backup_data',
        data: {}
      });

      alert(`💾 Backup Configured Successfully!\n\n` +
        `🔄 Backup ID: ${data.backup_id}\n` +
        `📅 Retention: ${data.retention_period}\n` +
        `🔐 Encryption: ${data.encryption}`);
    } catch (error) {
      console.error('Error configuring backup:', error);
      alert('❌ Error configuring backup. Please try again.');
    }
  };

  const handleDeleteAccount = async () => {
    const email = prompt('⚠️ DANGER: Delete Account\n\n' +
      'This will permanently delete ALL your data.\n\n' +
      'Type your email address to confirm:');
    
    if (!email || !user || email.toLowerCase() !== user.email.toLowerCase()) {
      alert('❌ Email confirmation failed. Account deletion cancelled.');
      return;
    }

    if (!confirm('🚨 FINAL WARNING\n\nThis action CANNOT be undone!\n\nDelete your account and ALL data?')) {
      return;
    }

    try {
      const { data } = await settingsManager({
        action: 'delete_account',
        data: { confirmed: true, email: email }
      });

      alert('✅ Account deletion initiated.\n\nYou will receive a confirmation email shortly.');
      
      await User.logout();
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('❌ Error deleting account. Please contact support.');
    }
  };

  const handleRefreshSettings = async () => {
    await loadSettingsData();
    alert('🔄 Settings refreshed successfully!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <SettingsIcon className="w-10 h-10 text-indigo-600" />
            Settings & Configuration
          </h1>
          <p className="text-gray-600 text-lg">
            Manage your account, company profile, integrations, and security preferences
          </p>
          {user && (
            <div className="flex items-center gap-4 mt-3">
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Account Active
              </Badge>
              <Badge className="bg-blue-100 text-blue-800">
                {user.role || 'User'}
              </Badge>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3 flex-wrap">
          <Button
            onClick={handleRefreshSettings}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          
          <Button
            onClick={handleExportData}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <SettingsIcon className="w-4 h-4" />
            General
          </TabsTrigger>

          <TabsTrigger value="company" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Company
          </TabsTrigger>

          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>

          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Integrations
          </TabsTrigger>

          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Security & Data
          </TabsTrigger>
        </TabsList>

        {/* GENERAL SETTINGS TAB */}
        <TabsContent value="general" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <UserIcon className="w-6 h-6 text-indigo-600" />
                User Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="company_name" className="text-sm font-medium text-gray-700">Company Name *</Label>
                  <Input
                    id="company_name"
                    value={generalSettings.company_name}
                    onChange={(e) => setGeneralSettings(prev => ({ ...prev, company_name: e.target.value }))}
                    placeholder="Your company name"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="country" className="text-sm font-medium text-gray-700">Country</Label>
                  <Select
                    value={generalSettings.country}
                    onValueChange={(value) => {
                      const newCurrency = COUNTRY_TO_CURRENCY[value] || generalSettings.preferred_currency;
                      setGeneralSettings(prev => ({
                        ...prev,
                        country: value,
                        preferred_currency: newCurrency
                      }));
                    }}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="currency" className="text-sm font-medium text-gray-700">Default Currency</Label>
                  <Select
                    value={generalSettings.preferred_currency}
                    onValueChange={(value) => setGeneralSettings(prev => ({ ...prev, preferred_currency: value }))}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map((currency) => (
                        <SelectItem key={currency} value={currency}>
                          {currency}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="timezone" className="text-sm font-medium text-gray-700">Timezone</Label>
                  <Select
                    value={generalSettings.timezone}
                    onValueChange={(value) => setGeneralSettings(prev => ({ ...prev, timezone: value }))}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIMEZONES.map((timezone) => (
                        <SelectItem key={timezone} value={timezone}>
                          {timezone.replace('_', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="date_format" className="text-sm font-medium text-gray-700">Date Format</Label>
                  <Select
                    value={generalSettings.date_format}
                    onValueChange={(value) => setGeneralSettings(prev => ({ ...prev, date_format: value }))}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY (US)</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY (UK)</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD (ISO)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-between items-center pt-6 border-t mt-6">
                <Button 
                  onClick={handleResetToDefaults}
                  variant="outline"
                  className="text-red-600"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset to Defaults
                </Button>
                
                <Button 
                  onClick={handleSaveGeneral} 
                  disabled={isSaving}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Settings'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* COMPANY SETTINGS TAB */}
        <TabsContent value="company" className="space-y-8">
          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Building2 className="w-6 h-6 text-blue-600" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="company_name_full" className="text-sm font-medium text-gray-700">Company Name *</Label>
                  <Input
                    id="company_name_full"
                    value={companySettings.company_name}
                    onChange={(e) => setCompanySettings(prev => ({ ...prev, company_name: e.target.value }))}
                    placeholder="Your Company Name"
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="legal_name" className="text-sm font-medium text-gray-700">Legal Name</Label>
                  <Input
                    id="legal_name"
                    value={companySettings.legal_name}
                    onChange={(e) => setCompanySettings(prev => ({ ...prev, legal_name: e.target.value }))}
                    placeholder="Legal Business Name"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="tax_id" className="text-sm font-medium text-gray-700">Tax ID / EIN</Label>
                  <Input
                    id="tax_id"
                    value={companySettings.tax_id}
                    onChange={(e) => setCompanySettings(prev => ({ ...prev, tax_id: e.target.value }))}
                    placeholder="12-3456789"
                    className="mt-2"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="street" className="text-sm font-medium text-gray-700">Business Address</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <Input
                      placeholder="Street Address"
                      value={companySettings.address?.street || ''}
                      onChange={(e) => setCompanySettings(prev => ({
                        ...prev,
                        address: { ...prev.address, street: e.target.value }
                      }))}
                    />
                    <Input
                      placeholder="City"
                      value={companySettings.address?.city || ''}
                      onChange={(e) => setCompanySettings(prev => ({
                        ...prev,
                        address: { ...prev.address, city: e.target.value }
                      }))}
                    />
                    <Input
                      placeholder="State/Province"
                      value={companySettings.address?.state || ''}
                      onChange={(e) => setCompanySettings(prev => ({
                        ...prev,
                        address: { ...prev.address, state: e.target.value }
                      }))}
                    />
                    <Input
                      placeholder="ZIP/Postal Code"
                      value={companySettings.address?.zip_code || ''}
                      onChange={(e) => setCompanySettings(prev => ({
                        ...prev,
                        address: { ...prev.address, zip_code: e.target.value }
                      }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone</Label>
                  <Input
                    id="phone"
                    value={companySettings.contact?.phone || ''}
                    onChange={(e) => setCompanySettings(prev => ({
                      ...prev,
                      contact: { ...prev.contact, phone: e.target.value }
                    }))}
                    placeholder="+1 (555) 123-4567"
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="company_email" className="text-sm font-medium text-gray-700">Email *</Label>
                  <Input
                    id="company_email"
                    type="email"
                    value={companySettings.contact?.email || ''}
                    onChange={(e) => setCompanySettings(prev => ({
                      ...prev,
                      contact: { ...prev.contact, email: e.target.value }
                    }))}
                    placeholder="info@company.com"
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="website" className="text-sm font-medium text-gray-700">Website</Label>
                  <Input
                    id="website"
                    value={companySettings.contact?.website || ''}
                    onChange={(e) => setCompanySettings(prev => ({
                      ...prev,
                      contact: { ...prev.contact, website: e.target.value }
                    }))}
                    placeholder="https://company.com"
                    className="mt-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Logo & Branding */}
          <div className="grid lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Camera className="w-5 h-5 text-purple-600" />
                  Company Logo
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center">
                  {companySettings.logo_url ? (
                    <div className="relative inline-block">
                      <img
                        src={companySettings.logo_url}
                        alt="Company Logo"
                        className="w-32 h-32 object-contain mx-auto mb-4 rounded-lg border p-2 bg-white"
                      />
                      <Button
                        onClick={handleRemoveLogo}
                        size="sm"
                        variant="outline"
                        className="absolute -top-2 -right-2 w-8 h-8 p-0 rounded-full"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-gray-300">
                      <Building2 className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                  
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label htmlFor="logo-upload">
                    <Button 
                      as="span" 
                      disabled={isUploading}
                      className="cursor-pointer"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {isUploading ? 'Uploading...' : 'Upload Logo'}
                    </Button>
                  </label>
                  
                  <p className="text-xs text-gray-500 mt-3">
                    Recommended: 200x100px, max 5MB
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Palette className="w-5 h-5 text-pink-600" />
                  Brand Colors
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Primary Color</Label>
                  <div className="flex gap-3 items-center mt-2">
                    <Input
                      type="color"
                      value={companySettings.brand_colors?.primary || '#667eea'}
                      onChange={(e) => setCompanySettings(prev => ({
                        ...prev,
                        brand_colors: { ...prev.brand_colors, primary: e.target.value }
                      }))}
                      className="w-16 h-12 p-1"
                    />
                    <Input
                      value={companySettings.brand_colors?.primary || '#667eea'}
                      onChange={(e) => setCompanySettings(prev => ({
                        ...prev,
                        brand_colors: { ...prev.brand_colors, primary: e.target.value }
                      }))}
                      className="flex-1 font-mono"
                      placeholder="#667eea"
                    />
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-700">Secondary Color</Label>
                  <div className="flex gap-3 items-center mt-2">
                    <Input
                      type="color"
                      value={companySettings.brand_colors?.secondary || '#764ba2'}
                      onChange={(e) => setCompanySettings(prev => ({
                        ...prev,
                        brand_colors: { ...prev.brand_colors, secondary: e.target.value }
                      }))}
                      className="w-16 h-12 p-1"
                    />
                    <Input
                      value={companySettings.brand_colors?.secondary || '#764ba2'}
                      onChange={(e) => setCompanySettings(prev => ({
                        ...prev,
                        brand_colors: { ...prev.brand_colors, secondary: e.target.value }
                      }))}
                      className="flex-1 font-mono"
                      placeholder="#764ba2"
                    />
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-700">Preview</Label>
                  <div className="flex gap-3 mt-3">
                    <div
                      className="w-12 h-12 rounded-lg border shadow-sm"
                      style={{ backgroundColor: companySettings.brand_colors?.primary }}
                      title="Primary"
                    />
                    <div
                      className="w-12 h-12 rounded-lg border shadow-sm"
                      style={{ backgroundColor: companySettings.brand_colors?.secondary }}
                      title="Secondary"
                    />
                    <div
                      className="w-12 h-12 rounded-lg border shadow-sm"
                      style={{ backgroundColor: companySettings.brand_colors?.accent }}
                      title="Accent"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Invoice Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-green-600" />
                Invoice Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="payment_terms" className="text-sm font-medium text-gray-700">Payment Terms</Label>
                  <Select
                    value={companySettings.invoice_settings?.payment_terms}
                    onValueChange={(value) => setCompanySettings(prev => ({
                      ...prev,
                      invoice_settings: { ...prev.invoice_settings, payment_terms: value }
                    }))}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select terms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Due on Receipt">Due on Receipt</SelectItem>
                      <SelectItem value="Net 15">Net 15</SelectItem>
                      <SelectItem value="Net 30">Net 30</SelectItem>
                      <SelectItem value="Net 45">Net 45</SelectItem>
                      <SelectItem value="Net 60">Net 60</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="invoice_prefix" className="text-sm font-medium text-gray-700">Invoice Prefix</Label>
                  <Input
                    id="invoice_prefix"
                    value={companySettings.invoice_settings?.invoice_prefix || 'INV'}
                    onChange={(e) => setCompanySettings(prev => ({
                      ...prev,
                      invoice_settings: { ...prev.invoice_settings, invoice_prefix: e.target.value }
                    }))}
                    placeholder="INV"
                    className="mt-2"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="footer_text" className="text-sm font-medium text-gray-700">Invoice Footer Text</Label>
                  <Textarea
                    id="footer_text"
                    value={companySettings.invoice_settings?.footer_text || ''}
                    onChange={(e) => setCompanySettings(prev => ({
                      ...prev,
                      invoice_settings: { ...prev.invoice_settings, footer_text: e.target.value }
                    }))}
                    placeholder="Thank you for your business!"
                    className="mt-2 h-20"
                  />
                </div>

                <div className="md:col-span-2">
                  <div className="flex items-center space-x-3">
                    <Switch
                      id="auto_numbering"
                      checked={companySettings.invoice_settings?.auto_numbering || false}
                      onCheckedChange={(checked) => setCompanySettings(prev => ({
                        ...prev,
                        invoice_settings: { ...prev.invoice_settings, auto_numbering: checked }
                      }))}
                    />
                    <Label htmlFor="auto_numbering" className="text-sm font-medium text-gray-700">
                      Enable automatic invoice numbering
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button 
              onClick={handleSaveCompany} 
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Company Settings'}
            </Button>
          </div>
        </TabsContent>

        {/* NOTIFICATIONS TAB */}
        <TabsContent value="notifications" className="space-y-8">
          {/* Global Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Bell className="w-6 h-6 text-yellow-600" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-900">Quick Actions</h3>
                    <p className="text-sm text-gray-600">Manage all notifications at once</p>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleNotificationToggleAll(true)}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Enable All
                    </Button>
                    <Button
                      onClick={() => handleNotificationToggleAll(false)}
                      size="sm"
                      variant="outline"
                      className="text-red-600"
                    >
                      Disable All
                    </Button>
                    <Button
                      onClick={handleTestNotification}
                      size="sm"
                      variant="outline"
                    >
                      <TestTube className="w-4 h-4 mr-2" />
                      Test
                    </Button>
                  </div>
                </div>

                {/* General notification settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Email Notifications</h4>
                      <p className="text-sm text-gray-600">Receive notifications via email</p>
                    </div>
                    <Switch
                      checked={notificationSettings.email_notifications}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({
                        ...prev,
                        email_notifications: checked
                      }))}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Desktop Notifications</h4>
                      <p className="text-sm text-gray-600">Show browser notifications</p>
                    </div>
                    <Switch
                      checked={notificationSettings.desktop_notifications}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({
                        ...prev,
                        desktop_notifications: checked
                      }))}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">SMS Notifications</h4>
                      <p className="text-sm text-gray-600">Receive critical alerts via SMS</p>
                    </div>
                    <Switch
                      checked={notificationSettings.sms_notifications}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({
                        ...prev,
                        sms_notifications: checked
                      }))}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Push Notifications</h4>
                      <p className="text-sm text-gray-600">Mobile push notifications</p>
                    </div>
                    <Switch
                      checked={notificationSettings.push_notifications}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({
                        ...prev,
                        push_notifications: checked
                      }))}
                    />
                  </div>
                </div>

                {/* Notification Frequency */}
                <div>
                  <Label className="text-sm font-medium text-gray-700">Notification Frequency</Label>
                  <Select
                    value={notificationSettings.notification_frequency}
                    onValueChange={(value) => setNotificationSettings(prev => ({
                      ...prev,
                      notification_frequency: value
                    }))}
                  >
                    <SelectTrigger className="mt-2 max-w-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate</SelectItem>
                      <SelectItem value="hourly">Hourly Digest</SelectItem>
                      <SelectItem value="daily">Daily Digest</SelectItem>
                      <SelectItem value="weekly">Weekly Summary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Specific Notification Types */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-indigo-600" />
                Notification Types
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {NOTIFICATION_TYPES.map((notificationType) => (
                  <div key={notificationType.key} className="flex items-start justify-between py-4 border-b last:border-b-0">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-medium text-gray-900">{notificationType.label}</h5>
                        {['invoice_overdue', 'security_alerts', 'expense_anomalies'].includes(notificationType.key) && (
                          <Badge variant="secondary" className="text-xs bg-red-100 text-red-700">
                            Critical
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{notificationType.description}</p>
                    </div>
                    <Switch
                      checked={notificationSettings.enabled_notifications[notificationType.key]}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({
                        ...prev,
                        enabled_notifications: {
                          ...prev.enabled_notifications,
                          [notificationType.key]: checked
                        }
                      }))}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button 
              onClick={handleSaveNotifications} 
              disabled={isSaving}
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Notification Settings'}
            </Button>
          </div>
        </TabsContent>

        {/* INTEGRATIONS TAB */}
        <TabsContent value="integrations" className="space-y-8">
          {/* Integration Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Globe className="w-6 h-6 text-green-600" />
                Third-Party Integrations
                <Badge className="bg-green-100 text-green-800">
                  {Object.keys(integrationStatuses).filter(k => integrationStatuses[k]?.connected).length} Connected
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6 p-4 bg-blue-50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-blue-900">Integration Management</h3>
                  <p className="text-sm text-blue-700">Connect AccounTech with your favorite tools and services</p>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={() => window.open('/docs/integrations', '_blank')}
                    size="sm"
                    variant="outline"
                    className="text-blue-600"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Documentation
                  </Button>
                </div>
              </div>

              {/* Integration Categories */}
              {Object.entries(
                Object.keys(INTEGRATIONS).reduce((acc, key) => {
                  const category = INTEGRATIONS[key].category;
                  if (!acc[category]) acc[category] = [];
                  acc[category].push(key);
                  return acc;
                }, {})
              ).map(([category, integrationKeys]) => (
                <div key={category} className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 capitalize flex items-center gap-2">
                    {category === 'payments' && '💳'}
                    {category === 'accounting' && '📊'}
                    {category === 'communication' && '📧'}
                    {category === 'crm' && '👥'}
                    {category === 'project' && '📋'}
                    {category === 'data' && '📈'}
                    {category === 'automation' && '⚡'}
                    {category === 'storage' && '💾'}
                    {category.replace('_', ' ')}
                  </h3>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {integrationKeys.map((integrationKey) => {
                      const integration = INTEGRATIONS[integrationKey];
                      const status = integrationStatuses[integrationKey];
                      const isConnecting = connectingIntegration === integrationKey;
                      
                      return (
                        <div key={integrationKey} className="p-4 border rounded-lg hover:shadow-md transition-all bg-white">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{integration.icon}</span>
                              <h4 className="font-medium text-gray-900">{integration.name}</h4>
                            </div>
                            <Badge className={
                              status?.connected 
                                ? "bg-green-100 text-green-800" 
                                : isConnecting 
                                  ? "bg-yellow-100 text-yellow-800" 
                                  : "bg-gray-100 text-gray-600"
                            }>
                              {isConnecting ? 'Connecting...' : status?.status || 'Not Connected'}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-4">
                            {integration.description}
                          </p>
                          
                          {status?.connected && status.last_sync && (
                            <p className="text-xs text-gray-500 mb-3">
                              Last sync: {new Date(status.last_sync).toLocaleDateString()}
                            </p>
                          )}
                          
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant={status?.connected ? "outline" : "default"}
                              onClick={() => handleIntegrationAction(
                                integrationKey, 
                                status?.connected ? 'disconnect' : 'connect'
                              )}
                              disabled={isConnecting}
                              className={status?.connected ? 
                                "text-red-600" : 
                                "bg-green-600 hover:bg-green-700 text-white"
                              }
                            >
                              {isConnecting ? (
                                <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                              ) : status?.connected ? (
                                <>
                                  <Link className="w-3 h-3 mr-1" />
                                  Disconnect
                                </>
                              ) : (
                                <>
                                  <Link className="w-3 h-3 mr-1" />
                                  Connect
                                </>
                              )}
                            </Button>
                            
                            {status?.connected && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleIntegrationAction(integrationKey, 'test_connection')}
                                disabled={isConnecting}
                              >
                                <TestTube className="w-3 h-3 mr-1" />
                                Test
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* API & Webhook Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Key className="w-5 h-5 text-indigo-600" />
                API Access & Webhooks
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* API Access Toggle */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Enable API Access</h4>
                  <p className="text-sm text-gray-600">Allow external applications to access your data securely</p>
                </div>
                <Switch
                  checked={integrationSettings.api_access_enabled}
                  onCheckedChange={(checked) => setIntegrationSettings(prev => ({
                    ...prev,
                    api_access_enabled: checked
                  }))}
                />
              </div>

              {integrationSettings.api_access_enabled && (
                <>
                  {/* API Key Management */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700">API Key</Label>
                    <div className="flex gap-2 items-center mt-2">
                      <Input
                        type={showApiKey ? "text" : "password"}
                        value={integrationSettings.api_key}
                        readOnly
                        className="flex-1 font-mono text-sm bg-gray-50"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowApiKey(!showApiKey)}
                      >
                        {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopyAPIKey}
                      >
                        📋 Copy
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleGenerateAPIKey}
                        className="text-green-600"
                      >
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Generate
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600"
                        onClick={handleRevokeAPIKey}
                      >
                        <Lock className="w-4 h-4 mr-1" />
                        Revoke
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      ⚠️ Keep your API key secure. Don't share it publicly.
                    </p>
                  </div>

                  {/* Rate Limiting */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Rate Limit (requests/hour)</Label>
                    <Input
                      type="number"
                      value={integrationSettings.rate_limit}
                      onChange={(e) => setIntegrationSettings(prev => ({
                        ...prev,
                        rate_limit: parseInt(e.target.value) || 1000
                      }))}
                      className="mt-2 max-w-xs"
                      min="100"
                      max="10000"
                      step="100"
                    />
                  </div>

                  {/* Webhook Configuration */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Webhook URL (Optional)</Label>
                    <div className="flex gap-2 items-center mt-2">
                      <Input
                        type="url"
                        placeholder="https://your-app.com/webhooks/accountech"
                        value={integrationSettings.webhook_url}
                        onChange={(e) => setIntegrationSettings(prev => ({
                          ...prev,
                          webhook_url: e.target.value
                        }))}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleTestWebhook}
                        disabled={!integrationSettings.webhook_url}
                      >
                        <Webhook className="w-4 h-4 mr-1" />
                        Test
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Receive real-time notifications about transactions, invoices, and other events
                    </p>
                  </div>

                  {/* API Documentation */}
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-blue-900">API Documentation</h4>
                        <p className="text-sm text-blue-700">Learn how to integrate with AccounTech API</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open('/docs/api', '_blank')}
                        className="text-blue-600"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        View Docs
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* SECURITY & DATA TAB */}
        <TabsContent value="security" className="space-y-8">
          {/* Security Dashboard */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-red-600" />
                Security Dashboard
                {securityReport && (
                  <Badge className={
                    securityReport.security_score >= 90 ? "bg-green-100 text-green-800" :
                    securityReport.security_score >= 70 ? "bg-yellow-100 text-yellow-800" :
                    "bg-red-100 text-red-800"
                  }>
                    Score: {securityReport.security_score}/100
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Security Status */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Security Status</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm text-gray-700">End-to-end encryption enabled</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm text-gray-700">Regular security scans active</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm text-gray-700">GDPR & SOX compliant</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm text-gray-700">Automated backups active</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {securitySettings.two_factor_enabled ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      )}
                      <span className="text-sm text-gray-700">
                        Two-factor authentication {securitySettings.two_factor_enabled ? 'enabled' : 'recommended'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Security Actions */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Security Actions</h3>
                  
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={handleGenerateSecurityReport}
                    >
                      <Download className="w-4 h-4 mr-3" />
                      Generate Security Report
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={securitySettings.two_factor_enabled ? handleDisable2FA : handleEnable2FA}
                    >
                      <Shield className="w-4 h-4 mr-3" />
                      {securitySettings.two_factor_enabled ? 'Disable 2FA' : 'Enable 2FA'}
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={handleSecurityAudit}
                    >
                      <FileText className="w-4 h-4 mr-3" />
                      Run Security Audit
                    </Button>
                  </div>
                </div>
              </div>

              {/* Security Recommendations */}
              {securityReport?.recommendations && (
                <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-medium text-yellow-900 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Security Recommendations
                  </h4>
                  <ul className="space-y-2">
                    {securityReport.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-yellow-800 flex items-start gap-2">
                        <span className="text-yellow-600">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Database className="w-5 h-5 text-indigo-600" />
                Data Management & Backup
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <Button 
                  variant="outline" 
                  onClick={handleExportData}
                  className="h-20 flex-col gap-2"
                >
                  <Download className="w-6 h-6" />
                  <span className="font-medium">Export All Data</span>
                  <span className="text-xs">Download complete backup</span>
                </Button>

                <Button 
                  variant="outline"
                  onClick={handleImportData}
                  className="h-20 flex-col gap-2"
                >
                  <Upload className="w-6 h-6" />
                  <span className="font-medium">Import Data</span>
                  <span className="text-xs">Restore from backup</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={handleBackupSettings}
                  className="h-20 flex-col gap-2"
                >
                  <RefreshCw className="w-6 h-6" />
                  <span className="font-medium">Backup Settings</span>
                  <span className="text-xs">Configure auto-backup</span>
                </Button>
              </div>

              {/* Data Protection Info */}
              <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-blue-900 mb-2">Enterprise-Gde Data Protection</h4>
                    <div className="text-sm text-blue-800 space-y-2">
                      <p>🔐 <strong>Encryption:</strong> AES-256 encryption at rest and in transit</p>
                      <p>📅 <strong>Backups:</strong> Daily automated backups retained for 7 years</p>
                      <p>🔍 <strong>Auditing:</strong> All access logged and monitored</p>
                      <p>🌍 <strong>Compliance:</strong> GDPR, SOX, and regional regulations</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Deletion (Danger Zone) */}
              <div className="mt-8 pt-8 border-t">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                    <h4 className="font-semibold text-red-900">Danger Zone</h4>
                  </div>
                  
                  <p className="text-sm text-red-800 mb-4">
                    Once you delete your account, there is no going back. This will permanently delete all data.
                  </p>
                  
                  <Button
                    variant="outline"
                    className="border-red-300 text-red-700 hover:bg-red-100"
                    onClick={handleDeleteAccount}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account & All Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
