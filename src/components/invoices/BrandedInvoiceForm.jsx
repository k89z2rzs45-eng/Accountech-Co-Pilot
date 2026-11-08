
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Save, X, Plus, Trash2, Send, Briefcase, Building2, Mail, FileText, Sparkles, Package } from "lucide-react"; // Added FileText, Sparkles, Package imports
import { Company } from "@/api/entities";
import { User } from "@/api/entities";
import { Client } from "@/api/entities";
import { detectDefaultCurrency } from "@/components/utils/currency";
import { sendBrandedInvoice } from "@/api/functions";

// Enhanced caching with longer durations and better error handling
let companyCache = null;
let companyCacheTime = null;
let clientsCache = null;
let clientsCacheTime = null;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes for better performance

// Enhanced retry logic with exponential backoff and better error handling
const retryApiCall = async (apiCall, maxRetries = 3, baseDelay = 2000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      console.log(`API call attempt ${attempt} failed:`, error.message);
      
      if (error.response?.status === 429 && attempt < maxRetries) {
        // Rate limited - use exponential backoff with jitter
        const delay = baseDelay * Math.pow(2, attempt - 1) + Math.random() * 1000;
        console.log(`Rate limited, waiting ${delay}ms before retry ${attempt + 1}/${maxRetries}`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      // If it's a rate limit error and we've exhausted retries, throw a user-friendly error
      if (error.response?.status === 429) {
        throw new Error('Server is busy. Please wait a moment and try again.');
      }
      
      throw error;
    }
  }
};

export default function BrandedInvoiceForm({ invoice, onSubmit, onCancel }) {
  const [company, setCompany] = useState(null);
  const [clients, setClients] = useState([]);
  const [isClientsLoading, setIsClientsLoading] = useState(false);
  const [loadingError, setLoadingError] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [showSendOptions, setShowSendOptions] = useState(false);
  const [customMessage, setCustomMessage] = useState('');
  const [formData, setFormData] = useState(invoice || {
    invoice_number: `INV-${Date.now().toString().slice(-6)}`,
    client_id: null,
    client_name: "",
    client_email: "",
    client_address: "",
    issue_date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    currency: "USD",
    items: [{ description: "", quantity: 1, rate: 0, amount: 0 }],
    notes: "Thank you for your business.",
    status: "draft",
    tax_rate: 0
  });

  useEffect(() => {
    // Load data in sequence to avoid overwhelming the API
    const loadData = async () => {
      await loadCompany();
      // Add a small delay before loading clients to reduce API pressure
      setTimeout(() => {
        loadClients();
      }, 500);
    };
    
    loadData();
    
    // Calculate totals
    const newItems = formData.items.map(item => ({
      ...item,
      amount: (item.quantity || 0) * (item.rate || 0)
    }));
    const subtotal = newItems.reduce((sum, item) => sum + item.amount, 0);
    const tax_amount = subtotal * (formData.tax_rate / 100);
    const total = subtotal + tax_amount;
    
    setFormData(prev => ({ ...prev, items: newItems, subtotal, tax_amount, total }));
  }, []);

  useEffect(() => {
    if (!invoice) {
      (async () => {
        try {
          const me = await User.me();
          const cur = detectDefaultCurrency({ userCountry: me?.country, userPreferred: me?.preferred_currency });
          setFormData(prev => ({ ...prev, currency: cur }));
        } catch (error) {
          console.log('Could not load user currency preference');
        }
      })();
    }
  }, [invoice]);

  const loadCompany = async () => {
    try {
      // Check cache first
      if (companyCache && companyCacheTime && (Date.now() - companyCacheTime < CACHE_DURATION)) {
        console.log('Using cached company data');
        setCompany(companyCache);
        return;
      }

      console.log('Loading company from API...');
      
      // Load from API with enhanced retry logic
      const companies = await retryApiCall(
        () => Company.list(),
        3, // max retries
        3000 // base delay in ms
      );

      const companyData = companies[0] || null;
      
      // Update cache
      companyCache = companyData;
      companyCacheTime = Date.now();
      
      setCompany(companyData);
      console.log('Company data loaded successfully');
    } catch (error) {
      console.error('Error loading company:', error);
      setLoadingError('Could not load company data. Using cached data if available.');
      
      // Use cached data as fallback
      if (companyCache) {
        console.log('Using cached company data as fallback');
        setCompany(companyCache);
      }
    }
  };

  const loadClients = async () => {
    setIsClientsLoading(true);
    setLoadingError(null);
    
    try {
      // Check cache first
      if (clientsCache && clientsCacheTime && (Date.now() - clientsCacheTime < CACHE_DURATION)) {
        console.log('Using cached clients data');
        setClients(clientsCache);
        setIsClientsLoading(false);
        return;
      }

      console.log('Loading clients from API...');
      
      // Load from API with enhanced retry logic
      const clientData = await retryApiCall(
        () => Client.list(),
        3, // max retries  
        3000 // base delay in ms
      );
      
      // Update cache
      clientsCache = clientData;
      clientsCacheTime = Date.now();
      
      setClients(clientData);
      console.log(`Successfully loaded ${clientData.length} clients`);
    } catch (error) {
      console.error("Error loading clients:", error);
      setLoadingError('Could not load clients. Using cached data if available.');
      
      // Use cached data as fallback
      if (clientsCache) {
        console.log('Using cached clients data as fallback');
        setClients(clientsCache);
      } else {
        setClients([]); // Empty array as final fallback
      }
    }
    setIsClientsLoading(false);
  };

  const handleClientSelect = (clientId) => {
    const selectedClient = clients.find(c => c.id === clientId);
    if (selectedClient) {
      setFormData(prev => ({
        ...prev,
        client_id: selectedClient.id,
        client_name: selectedClient.name,
        client_email: selectedClient.email,
        client_address: selectedClient.address ? 
          `${selectedClient.address.street || ''}\n${selectedClient.address.city || ''}, ${selectedClient.address.state || ''} ${selectedClient.address.zip_code || ''}\n${selectedClient.address.country || ''}`.trim()
          : ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Auto-populate company branding from existing company data
    const invoiceWithBranding = {
      ...formData,
      company_branding: {
        logo_url: company?.logo_url,
        company_name: company?.company_name,
        address: company?.address,
        contact: company?.contact,
        brand_colors: company?.brand_colors
      }
    };
    
    onSubmit(invoiceWithBranding);
  };

  const handleSendInvoice = async () => {
    if (!formData.client_email) {
      alert('Please enter client email address to send invoice.');
      return;
    }

    setIsSending(true);
    try {
      // First save/update the invoice
      await handleSubmit(new Event('submit'));
      
      // Then send it
      const response = await sendBrandedInvoice({
        invoiceId: formData.id || invoice?.id,
        clientEmail: formData.client_email,
        customMessage: customMessage
      });

      if (response.success) {
        alert('Invoice sent successfully! The client will receive it via email.');
        setShowSendOptions(false);
        onCancel(); // Close the form
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('Error sending invoice:', error);
      alert('Error sending invoice: ' + error.message);
    }
    setIsSending(false);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: "", quantity: 1, rate: 0, amount: 0 }]
    }));
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden p-0 border-0 bg-transparent">
        <style jsx>{`
          /* Enhanced Invoice Form Styles */
          .invoice-form-container {
            background: linear-gradient(145deg, 
              rgba(15, 23, 42, 0.98) 0%,
              rgba(30, 41, 59, 0.96) 30%,
              rgba(51, 65, 85, 0.94) 70%,
              rgba(15, 23, 42, 0.98) 100%
            );
            backdrop-filter: blur(40px);
            border: 2px solid;
            border-image: linear-gradient(45deg, #2563eb, #7c3aed, #f59e0b) 1;
            border-radius: 24px;
            box-shadow: 
              0 25px 50px rgba(0, 0, 0, 0.5),
              0 0 100px rgba(37, 99, 235, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
            position: relative;
            overflow: hidden;
            animation: formGlow 4s ease-in-out infinite;
            max-height: 95vh; /* Ensure the container respects dialog height */
            overflow-y: auto; /* Make the container scrollable */
          }
          
          @keyframes formGlow {
            0%, 100% {
              box-shadow: 
                0 25px 50px rgba(0, 0, 0, 0.5),
                0 0 100px rgba(37, 99, 235, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
            }
            50% {
              box-shadow: 
                0 25px 50px rgba(0, 0, 0, 0.5),
                0 0 120px rgba(124, 58, 237, 0.4),
                inset 0 1px 0 rgba(255, 255, 255, 0.15);
            }
          }
          
          .invoice-form-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(
              45deg,
              transparent 30%,
              rgba(37, 99, 235, 0.08) 50%,
              transparent 70%
            );
            animation: shimmerBackground 15s ease-in-out infinite;
            pointer-events: none;
            z-index: 0;
          }
          
          @keyframes shimmerBackground {
            0%, 100% { transform: translateX(-100%) rotate(45deg); opacity: 0.5; }
            50% { transform: translateX(100%) rotate(45deg); opacity: 1; }
          }
          
          .invoice-header {
            background: linear-gradient(135deg, 
              rgba(37, 99, 235, 0.15) 0%,
              rgba(124, 58, 237, 0.1) 50%,
              rgba(245, 158, 11, 0.08) 100%
            );
            backdrop-filter: blur(20px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            position: relative;
            overflow: hidden;
          }
          
          .invoice-header::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, #2563eb, #7c3aed, #f59e0b, #2563eb);
            background-size: 200% 100%;
            animation: headerFlow 8s ease infinite;
          }
          
          @keyframes headerFlow {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          
          .form-section {
            position: relative;
            background: linear-gradient(135deg, 
              rgba(255, 255, 255, 0.08) 0%,
              rgba(255, 255, 255, 0.04) 100%
            );
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            backdrop-filter: blur(15px);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            overflow: hidden;
          }
          
          .form-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, 
              transparent, 
              rgba(255, 255, 255, 0.1), 
              transparent
            );
            transition: left 0.6s ease;
          }
          
          .form-section:hover::before {
            left: 100%;
          }
          
          .form-section:hover {
            background: linear-gradient(135deg, 
              rgba(255, 255, 255, 0.12) 0%,
              rgba(255, 255, 255, 0.08) 100%
            );
            border: 1px solid rgba(37, 99, 235, 0.3);
            box-shadow: 0 8px 32px rgba(37, 99, 235, 0.15);
            transform: translateY(-2px);
          }
          
          .enhanced-input {
            background: linear-gradient(135deg, 
              rgba(255, 255, 255, 0.08) 0%,
              rgba(255, 255, 255, 0.04) 100%
            );
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 12px;
            backdrop-filter: blur(10px);
            color: white;
            transition: all 0.3s ease;
            position: relative;
          }
          
          .enhanced-input:focus {
            background: linear-gradient(135deg, 
              rgba(37, 99, 235, 0.15) 0%,
              rgba(124, 58, 237, 0.1) 100%
            );
            border: 2px solid rgba(37, 99, 235, 0.5);
            box-shadow: 
              0 0 20px rgba(37, 99, 235, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
            transform: scale(1.02);
          }
          
          .enhanced-input::placeholder {
            color: rgba(255, 255, 255, 0.5);
          }
          
          .logo-upload-area {
            background: linear-gradient(135deg, 
              rgba(37, 99, 235, 0.1) 0%,
              rgba(124, 58, 237, 0.08) 50%,
              rgba(245, 158, 11, 0.06) 100%
            );
            border: 2px dashed rgba(37, 99, 235, 0.4);
            border-radius: 16px;
            backdrop-filter: blur(15px);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
          }
          
          .logo-upload-area::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, 
              transparent 30%,
              rgba(37, 99, 235, 0.1) 50%,
              transparent 70%
            );
            animation: logoShimmer 3s ease-in-out infinite;
          }
          
          @keyframes logoShimmer {
            0%, 100% { transform: translateX(-100%) rotate(45deg); }
            50% { transform: translateX(100%) rotate(45deg); }
          }
          
          .logo-upload-area:hover {
            border-color: rgba(37, 99, 235, 0.6);
            background: linear-gradient(135deg, 
              rgba(37, 99, 235, 0.15) 0%,
              rgba(124, 58, 237, 0.12) 50%,
              rgba(245, 158, 11, 0.1) 100%
            );
            transform: scale(1.02);
            box-shadow: 0 8px 32px rgba(37, 99, 235, 0.2);
          }
          
          .invoice-items-table {
            background: linear-gradient(135deg, 
              rgba(255, 255, 255, 0.06) 0%,
              rgba(255, 255, 255, 0.02) 100%
            );
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 12px;
            backdrop-filter: blur(10px);
            overflow: hidden;
          }
          
          .item-row {
            background: linear-gradient(135deg, 
              rgba(255, 255, 255, 0.04) 0%,
              rgba(255, 255, 255, 0.02) 100%
            );
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            transition: all 0.3s ease;
          }
          
          .item-row:hover {
            background: linear-gradient(135deg, 
              rgba(37, 99, 235, 0.1) 0%,
              rgba(124, 58, 237, 0.08) 100%
            );
            transform: translateX(4px);
          }
          
          .totals-section {
            background: linear-gradient(135deg, 
              rgba(37, 99, 235, 0.15) 0%,
              rgba(124, 58, 237, 0.12) 50%,
              rgba(245, 158, 11, 0.1) 100%
            );
            border: 1px solid rgba(37, 99, 235, 0.3);
            border-radius: 16px;
            backdrop-filter: blur(20px);
            position: relative;
            overflow: hidden;
          }
          
          .totals-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, 
              transparent 40%,
              rgba(255, 255, 255, 0.08) 50%,
              transparent 60%
            );
            animation: totalsGlow 6s ease-in-out infinite;
          }
          
          @keyframes totalsGlow {
            0%, 100% { transform: translateX(-100%) rotate(45deg); }
            50% { transform: translateX(100%) rotate(45deg); }
          }
          
          .action-buttons {
            background: linear-gradient(135deg, 
              rgba(255, 255, 255, 0.08) 0%,
              rgba(255, 255, 255, 0.04) 100%
            );
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
          }
          
          .btn-primary {
            background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
            border: 1px solid rgba(37, 99, 235, 0.5);
            border-radius: 12px;
            color: white;
            font-weight: 600;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(37, 99, 235, 0.3);
          }
          
          .btn-primary::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, 
              transparent, 
              rgba(255, 255, 255, 0.3), 
              transparent
            );
            transition: left 0.5s ease;
          }
          
          .btn-primary:hover::before {
            left: 100%;
          }
          
          .btn-primary:hover {
            background: linear-gradient(135deg, #1d4ed8 0%, #6d28d9 100%);
            transform: translateY(-2px) scale(1.05);
            box-shadow: 0 8px 30px rgba(37, 99, 235, 0.4);
          }
          
          .btn-secondary {
            background: linear-gradient(135deg, 
              rgba(255, 255, 255, 0.1) 0%,
              rgba(255, 255, 255, 0.05) 100%
            );
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 12px;
            color: rgba(255, 255, 255, 0.9);
            font-weight: 500;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
          }
          
          .btn-secondary:hover {
            background: linear-gradient(135deg, 
              rgba(255, 255, 255, 0.15) 0%,
              rgba(255, 255, 255, 0.1) 100%
            );
            border: 1px solid rgba(255, 255, 255, 0.3);
            transform: translateY(-1px);
          }
          
          .floating-particles {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            pointer-events: none;
          }
          
          .particle {
            position: absolute;
            width: 4px;
            height: 4px;
            border-radius: 50%;
            animation: floatParticle 15s ease-in-out infinite;
          }
          
          .particle-1 {
            background: #2563eb;
            top: 10%;
            left: 20%;
            animation-delay: 0s;
          }
          
          .particle-2 {
            background: #7c3aed;
            top: 70%;
            left: 80%;
            animation-delay: 5s;
          }
          
          .particle-3 {
            background: #f59e0b;
            top: 30%;
            left: 60%;
            animation-delay: 10s;
          }
          
          @keyframes floatParticle {
            0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); opacity: 0.6; }
            25% { transform: translateY(-20px) translateX(10px) rotate(90deg); opacity: 1; }
            50% { transform: translateY(-40px) translateX(-10px) rotate(180deg); opacity: 0.8; }
            75% { transform: translateY(-20px) translateX(15px) rotate(270deg); opacity: 1; }
          }
        `}</style>

        <div className="invoice-form-container p-8 relative z-10">
          {/* Floating Particles */}
          <div className="floating-particles">
            <div className="particle particle-1"></div>
            <div className="particle particle-2"></div>
            <div className="particle particle-3"></div>
          </div>

          {/* Enhanced Header */}
          <div className="invoice-header p-6 -m-8 mb-6 relative z-20">
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              {invoice ? `Edit Invoice #${invoice.invoice_number}` : 'Create Branded Invoice'}
              <div className="ml-auto flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-400 font-medium">Live Preview</span>
              </div>
            </DialogTitle>
            {loadingError && (
              <div className="text-amber-400 text-sm mt-3 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                ⚠️ {loadingError}
              </div>
            )}
          </div>
          
          <div className="relative z-20">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Company Branding Section */}
              <div className="form-section p-6">
                <h3 className="font-semibold text-lg text-white mb-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-white" />
                  </div>
                  Company Branding
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Auto-Applied</Badge>
                </h3>
                
                <div className="logo-upload-area p-6 relative z-10">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-white/10 border-2 border-dashed border-gray-600 rounded-xl flex items-center justify-center relative overflow-hidden">
                      {company?.logo_url ? (
                        <img src={company.logo_url} alt="Logo" className="w-full h-full object-contain rounded-lg" />
                      ) : (
                        <Building2 className="w-8 h-8 text-gray-400" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg"></div>
                    </div>
                    <div>
                      <p className="text-white font-semibold text-lg">
                        {company?.company_name || 'Company name not set'}
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        {company?.logo_url ? '✅ Logo will be included automatically' : '📤 No logo uploaded yet'}
                      </p>
                      {!company?.logo_url && (
                        <p className="text-amber-400 text-xs mt-2 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Upload logo in Company Settings to enhance branding
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Client Information */}
                <div className="form-section p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-4 h-4 text-white" />
                    </div>
                    Bill To:
                  </h3>
                  
                  {/* Client Selection */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="client_id" className="text-gray-300 text-sm font-medium">Select Existing Client</Label>
                      <Select 
                        onValueChange={handleClientSelect} 
                        disabled={isClientsLoading}
                        value={formData.client_id || ""}
                      >
                        <SelectTrigger className="enhanced-input mt-2">
                          <SelectValue placeholder={
                            isClientsLoading ? "Loading clients..." : 
                            loadingError ? "Could not load clients" :
                            clients.length === 0 ? "No clients found" :
                            "Select an existing client"
                          } />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          {clients.map(client => (
                            <SelectItem key={client.id} value={client.id} className="text-white hover:bg-gray-700">
                              {client.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="client_name" className="text-gray-300 text-sm font-medium">Client Name *</Label>
                      <Input 
                        id="client_name" 
                        value={formData.client_name} 
                        onChange={e => handleChange('client_name', e.target.value)} 
                        required 
                        className="enhanced-input mt-2" 
                        placeholder="Enter client name"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="client_email" className="text-gray-300 text-sm font-medium">Client Email *</Label>
                      <Input 
                        id="client_email" 
                        type="email" 
                        value={formData.client_email} 
                        onChange={e => handleChange('client_email', e.target.value)} 
                        required 
                        className="enhanced-input mt-2" 
                        placeholder="client@example.com"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="client_address" className="text-gray-300 text-sm font-medium">Client Address</Label>
                      <Textarea 
                        id="client_address" 
                        value={formData.client_address} 
                        onChange={e => handleChange('client_address', e.target.value)} 
                        className="enhanced-input mt-2" 
                        rows={3}
                        placeholder="Enter full billing address"
                      />
                    </div>
                  </div>
                </div>

                {/* Invoice Details */}
                <div className="form-section p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-white" />
                    </div>
                    Invoice Details
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="text-gray-300 text-sm font-medium">Invoice Number</Label>
                      <Input 
                        value={formData.invoice_number} 
                        onChange={(e) => handleChange('invoice_number', e.target.value)} 
                        required 
                        className="enhanced-input mt-2"
                        placeholder="INV-001"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-gray-300 text-sm font-medium">Issue Date</Label>
                      <Input 
                        type="date" 
                        value={formData.issue_date} 
                        onChange={(e) => handleChange('issue_date', e.target.value)} 
                        required 
                        className="enhanced-input mt-2"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-gray-300 text-sm font-medium">Due Date</Label>
                      <Input 
                        type="date" 
                        value={formData.due_date} 
                        onChange={(e) => handleChange('due_date', e.target.value)} 
                        required 
                        className="enhanced-input mt-2"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-gray-300 text-sm font-medium">Currency</Label>
                      <Input 
                        value={formData.currency} 
                        readOnly 
                        className="enhanced-input mt-2 opacity-60"
                        placeholder="USD"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Invoice Items */}
              <div className="form-section p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                      <Package className="w-4 h-4 text-white" />
                    </div>
                    Invoice Items
                  </h3>
                  <Button 
                    type="button" 
                    onClick={addItem} 
                    className="btn-secondary flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Item
                  </Button>
                </div>
                
                <div className="invoice-items-table">
                  <div className="grid grid-cols-12 gap-3 p-4 border-b border-white/10 text-sm font-medium text-gray-300">
                    <div className="col-span-5">Description</div>
                    <div className="col-span-2 text-center">Quantity</div>
                    <div className="col-span-2 text-center">Rate</div>
                    <div className="col-span-2 text-center">Amount</div>
                    <div className="col-span-1 text-center">Action</div>
                  </div>
                  
                  {formData.items.map((item, index) => (
                    <div key={index} className="item-row grid grid-cols-12 gap-3 p-4 items-center">
                      <Input 
                        placeholder="Item description" 
                        value={item.description} 
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)} 
                        className="enhanced-input col-span-5" 
                      />
                      <Input 
                        type="number" 
                        placeholder="1" 
                        value={item.quantity} 
                        onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)} 
                        className="enhanced-input col-span-2 text-center" 
                      />
                      <Input 
                        type="number" 
                        placeholder="0.00" 
                        value={item.rate} 
                        onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value) || 0)} 
                        className="enhanced-input col-span-2 text-center" 
                      />
                      <div className="col-span-2 text-center font-semibold text-white">
                        {formData.currency} ${item.amount.toFixed(2)}
                      </div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeItem(index)} 
                        className="col-span-1 text-red-400 hover:text-red-300 hover:bg-red-500/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals Section */}
              <div className="flex justify-end">
                <div className="totals-section p-6 w-full max-w-md relative z-10">
                  <h4 className="text-lg font-semibold text-white mb-4">Invoice Summary</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-white">
                      <span>Subtotal</span>
                      <span className="font-semibold">{formData.currency} ${(formData.subtotal || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <Label className="text-gray-300">Tax Rate (%)</Label>
                      <Input 
                        type="number" 
                        value={formData.tax_rate} 
                        onChange={(e) => handleChange('tax_rate', parseFloat(e.target.value) || 0)} 
                        className="enhanced-input w-20 text-center" 
                      />
                    </div>
                    <div className="flex justify-between items-center text-white">
                      <span>Tax Amount</span>
                      <span className="font-semibold">{formData.currency} ${(formData.tax_amount || 0).toFixed(2)}</span>
                    </div>
                    <div className="border-t border-white/20 pt-3">
                      <div className="flex justify-between items-center text-xl font-bold text-white">
                        <span>Total</span>
                        <span className="text-green-400">{formData.currency} ${(formData.total || 0).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="form-section p-6">
                <Label className="text-gray-300 text-sm font-medium">Notes & Terms</Label>
                <Textarea 
                  value={formData.notes} 
                  onChange={(e) => handleChange('notes', e.target.value)} 
                  className="enhanced-input mt-2" 
                  rows={4}
                  placeholder="Payment terms, additional notes, or special instructions..."
                />
              </div>

              {/* Send Invoice Options */}
              {showSendOptions && (
                <div className="form-section p-6 border border-green-500/30 bg-green-500/10">
                  <h4 className="font-semibold text-white flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
                      <Mail className="w-4 h-4 text-white" />
                    </div>
                    Send Invoice to Client
                  </h4>
                  <Textarea 
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Add a personal message to include with the invoice email..."
                    className="enhanced-input"
                    rows={3}
                  />
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="action-buttons p-6 -m-8 mt-8 flex justify-end gap-4">
                <Button 
                  type="button" 
                  onClick={onCancel} 
                  className="btn-secondary"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                
                {!showSendOptions && (
                  <Button 
                    type="button" 
                    onClick={() => setShowSendOptions(true)}
                    disabled={!formData.client_email}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0 relative overflow-hidden"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Invoice
                  </Button>
                )}
                
                {showSendOptions && (
                  <Button 
                    type="button" 
                    onClick={handleSendInvoice}
                    disabled={isSending}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {isSending ? 'Sending...' : 'Send Now'}
                  </Button>
                )}
                
                <Button 
                  type="submit" 
                  className="btn-primary"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {invoice ? 'Update' : 'Save'} Invoice
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
