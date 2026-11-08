
import React, { useState, useEffect } from "react";
import { Invoice } from "@/api/entities";
import { InvokeLLM } from "@/api/integrations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, Download, FileText, DollarSign, Clock, CheckCircle, RefreshCw, Send, Mail, Sparkles, Zap, Star } from "lucide-react";
import { isAfter } from "date-fns";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

import BrandedInvoiceForm from "../components/invoices/BrandedInvoiceForm";
import InvoiceFilters from "../components/invoices/InvoiceFilters";
import InvoiceList from "../components/invoices/InvoiceList";

import { User } from "@/api/entities";
import { detectDefaultCurrency } from "@/components/utils/currency";
import { AlertTriangle } from "lucide-react";
import { safeFormatDate } from "@/components/utils/formatters";
import { sendBrandedInvoice } from "@/api/functions";

// Invoice cache to prevent excessive API calls
let invoiceCache = null;
let invoiceCacheTime = null;
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes for invoices

// Retry API call with exponential backoff
const retryApiCall = async (apiCall, maxRetries = 3, baseDelay = 2000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      console.log(`API call attempt ${attempt} failed:`, error.message);
      
      if (error.response?.status === 429 && attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt - 1);
        console.log(`Rate limited, waiting ${delay}ms before retry ${attempt + 1}/${maxRetries}`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      if (error.response?.status === 429) {
        throw new Error('Server is busy. Please wait a moment and try again.');
      }
      
      throw error;
    }
  }
};

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    dateRange: "all"
  });
  const [defaultCurrency, setDefaultCurrency] = useState("USD");
  const [error, setError] = useState(null);
  const [sendingInvoiceId, setSendingInvoiceId] = useState(null);

  useEffect(() => {
    loadInvoices();
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('new') === 'true') {
      setShowForm(true);
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const me = await User.me();
        const auto = detectDefaultCurrency({ userCountry: me?.country, userPreferred: me?.preferred_currency });
        setDefaultCurrency(auto || "USD");
      } catch (error) {
        console.log('Could not load user preferences');
      }
    })();
  }, []);

  const loadInvoices = async (forceRefresh = false) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Check cache first (unless forcing refresh)
      if (!forceRefresh && invoiceCache && invoiceCacheTime && 
          (Date.now() - invoiceCacheTime < CACHE_DURATION)) {
        console.log('Using cached invoice data');
        setInvoices(invoiceCache);
        setIsLoading(false);
        return;
      }

      console.log('Loading invoices from API...');
      
      // Load invoices with retry logic
      const data = await retryApiCall(
        () => Invoice.list('-issue_date', 100),
        3, // max retries
        2000 // base delay
      );
      
      // Update overdue status
      const updatedData = data.map(invoice => {
        if (invoice.status === 'sent' && isAfter(new Date(), new Date(invoice.due_date))) {
          return { ...invoice, status: 'overdue' };
        }
        return invoice;
      });
      
      // Update cache
      invoiceCache = updatedData;
      invoiceCacheTime = Date.now();
      
      setInvoices(updatedData);
      console.log(`Successfully loaded ${updatedData.length} invoices`);
      
    } catch (error) {
      console.error('Error loading invoices:', error);
      setError(error.message || 'Failed to load invoices. Please try again.');
      
      // If we have cached data, use it as fallback
      if (invoiceCache) {
        console.log('Using cached invoice data as fallback');
        setInvoices(invoiceCache);
      }
    }
    
    setIsLoading(false);
  };

  const handleSubmit = async (invoiceData) => {
    try {
      if (editingInvoice) {
        await retryApiCall(
          () => Invoice.update(editingInvoice.id, invoiceData),
          3,
          1000
        );
      } else {
        await retryApiCall(
          () => Invoice.create(invoiceData),
          3,
          1000
        );
      }
      
      setShowForm(false);
      setEditingInvoice(null);
      
      // Force refresh to get latest data
      await loadInvoices(true);
      
    } catch (error) {
      console.error('Error saving invoice:', error);
      alert(error.message || 'Error saving invoice. Please try again.');
    }
  };

  const handleEdit = (invoice) => {
    setEditingInvoice(invoice);
    setShowForm(true);
  };
  
  const handleDelete = async (invoice) => {
    if (confirm(`Are you sure you want to permanently delete invoice #${invoice.invoice_number}? This action cannot be undone.`)) {
      try {
        await Invoice.delete(invoice.id);
        await loadInvoices(true); // Force refresh
      } catch (error) {
        console.error('Error deleting invoice:', error);
        alert('Error deleting invoice. Please try again.');
      }
    }
  };

  // **NEW ENHANCED SEND INVOICE FUNCTION**
  const handleSendInvoice = async (invoice) => {
    if (!invoice.client_email) {
      alert('This invoice has no client email address. Please edit the invoice and add the client email first.');
      return;
    }

    setSendingInvoiceId(invoice.id);
    
    try {
      // Show sending confirmation with custom message option
      const customMessage = prompt(
        `📧 Send invoice ${invoice.invoice_number} to ${invoice.client_email}?\n\n✨ Optional: Add a personal message (or leave blank for default):`
      );
      
      if (customMessage === null) {
        setSendingInvoiceId(null);
        return; // User cancelled
      }

      console.log('Sending invoice with branded email...');
      
      const response = await sendBrandedInvoice({
        invoiceId: invoice.id,
        clientEmail: invoice.client_email,
        customMessage: customMessage || ''
      });

      if (response.data?.success) {
        // Show success message with shareable link
        const successMessage = `✅ Invoice sent successfully!\n\n📧 Sent to: ${invoice.client_email}\n🔗 Invoice URL: ${response.data.invoiceUrl}\n\n🎉 The client will receive a professionally branded email with your company logo and details.`;

        // Try to copy link to clipboard and show success
        try {
          await navigator.clipboard.writeText(response.data.invoiceUrl);
          alert(successMessage + "\n\n📋 Invoice link copied to clipboard!");
        } catch (clipboardError) {
          alert(successMessage);
        }

        // Force refresh to show updated status
        await loadInvoices(true);
      } else {
        throw new Error(response.data?.error || 'Failed to send invoice');
      }
    } catch (error) {
      console.error('Error sending invoice:', error);
      alert(`❌ Error sending invoice: ${error.message}\n\nPlease check:\n• Client email is valid\n• Company settings are configured\n• Network connection is stable`);
    } finally {
      setSendingInvoiceId(null);
    }
  };

  const handleMarkPaid = async (invoice) => {
    try {
      await retryApiCall(
        () => Invoice.update(invoice.id, {
          status: 'paid',
          paid_date: new Date().toISOString().split('T')[0]
        }),
        3,
        1000
      );
      
      // Force refresh to show updated status
      await loadInvoices(true);
      
    } catch (error) {
      console.error('Error marking invoice as paid:', error);
      alert(error.message || 'Error updating invoice status. Please try again.');
    }
  };

  const handleDownloadPDF = async (invoice) => {
    try {
      // Generate a comprehensive invoice PDF content
      const pdfContent = await InvokeLLM({
        prompt: `Generate a complete professional invoice PDF in HTML format with the following details:

        INVOICE DETAILS:
        - Invoice Number: ${invoice.invoice_number}
        - Client: ${invoice.client_name}
        - Client Email: ${invoice.client_email}
        - Issue Date: ${safeFormatDate(invoice.issue_date, 'MMMM d, yyyy')}
        - Due Date: ${safeFormatDate(invoice.due_date, 'MMMM d, yyyy')}
        - Currency: ${invoice.currency}
        - Items: ${JSON.stringify(invoice.items)}
        - Subtotal: ${invoice.subtotal || 0}
        - Tax Rate: ${invoice.tax_rate || 0}%
        - Tax Amount: ${invoice.tax_amount || 0}
        - Total Amount: ${invoice.total || 0}
        - Notes: ${invoice.notes || 'N/A'}

        Create a complete HTML document with:
        1. Professional styling and layout
        2. Company branding section (placeholder for logo)
        3. Client billing information
        4. Itemized services/products table
        5. Tax calculations and totals
        6. Payment terms and instructions
        7. Print-friendly CSS styles
        8. Professional color scheme

        Make it ready for PDF conversion and printing.`,
      });

      // Create and download the HTML file
      const blob = new Blob([pdfContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${invoice.invoice_number}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error downloading invoice:', error);
      alert('Error generating invoice PDF. Please try again.');
    }
  };

  const filteredInvoices = invoices
    .filter(invoice => invoice.currency === defaultCurrency)
    .filter(invoice => {
      const matchesSearch = invoice.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           invoice.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filters.status === "all" || invoice.status === filters.status;

      let matchesDate = true;
      if (filters.dateRange !== "all") {
        const invoiceDate = new Date(invoice.issue_date);
        const now = new Date();

        switch (filters.dateRange) {
          case "today":
            matchesDate = invoiceDate.toDateString() === now.toDateString();
            break;
          case "week":
            matchesDate = invoiceDate >= new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
            break;
          case "month":
            matchesDate = invoiceDate >= new Date(now.getFullYear(), now.getMonth(), 1);
            break;
          default:
            matchesDate = true;
        }
      }

      return matchesSearch && matchesStatus && matchesDate;
    });

  // Calculate metrics
  const totalRevenue = invoices.filter(i => i.status === 'paid' && i.currency === defaultCurrency).reduce((sum, i) => sum + (i.total || 0), 0);
  const pendingAmount = invoices.filter(i => (i.status === 'sent' || i.status === 'draft') && i.currency === defaultCurrency).reduce((sum, i) => sum + (i.total || 0), 0);
  const overdueAmount = invoices.filter(i => i.status === 'overdue' && i.currency === defaultCurrency).reduce((sum, i) => sum + (i.total || 0), 0);
  const draftCount = invoices.filter(i => i.status === 'draft' && i.currency === defaultCurrency).length;

  const handleExport = () => {
    const rows = [
      ["invoice_number", "client_name", "issue_date", "due_date", "status", "currency", "total", "subtotal", "tax_rate", "tax_amount", "notes"],
      ...filteredInvoices.map(i => [
        i.invoice_number,
        i.client_name,
        i.issue_date,
        i.due_date,
        i.status,
        i.currency,
        i.total ?? 0,
        i.subtotal ?? 0,
        i.tax_rate ?? 0,
        i.tax_amount ?? 0,
        (i.notes || "").replace(/"/g, '""')
      ])
    ];
    const csv = rows.map(r => r.map(String).map(s => `"${s.replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoices_${defaultCurrency}_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRetry = () => {
    loadInvoices(true); // Force refresh
  };

  return (
    <div className="invoices-future-container w-full">
      <style jsx>{`
        /* FUTURISTIC INVOICES TRANSFORMATION */
        .invoices-future-container {
          background: linear-gradient(135deg, 
            #0f172a 0%,
            #1e293b 25%,
            #334155 50%,
            #1e293b 75%,
            #0f172a 100%
          );
          background-size: 400% 400%;
          animation: invoiceFlow 22s ease infinite;
          position: relative;
          overflow: hidden;
          padding: 2rem;
          min-height: 100vh;
          width: 100% !important; /* Added for full width */
        }
        
        /* FULL WIDTH CONTENT CONTAINERS */
        .invoices-future-container > * {
          width: 100% !important;
          max-width: none !important;
        }

        @keyframes invoiceFlow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .invoice-card-future {
          background: linear-gradient(145deg, 
            rgba(15, 23, 42, 0.98) 0%,
            rgba(30, 41, 59, 0.95) 100%
          );
          backdrop-filter: blur(25px);
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 16px;
          box-shadow: 
            0 15px 35px rgba(0, 0, 0, 0.3),
            0 0 40px rgba(34, 197, 94, 0.1);
          transition: all 0.3s ease;
        }
        
        .invoice-card-future:hover {
          border: 1px solid rgba(34, 197, 94, 0.5);
          transform: translateY(-2px);
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.4),
            0 0 60px rgba(34, 197, 94, 0.15);
        }
        
        .invoice-title-future {
          background: linear-gradient(45deg, #22c55e, #16a34a, #15803d);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-size: 2.5rem;
          font-weight: 800;
        }
        
        .invoice-text-future {
          color: #e2e8f0 !important;
          font-weight: 500;
        }

        /* Remaining styles from previous version to preserve non-replaced elements */
        .primary-button-enhanced {
          background: linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #f59e0b 100%);
          border: none;
          border-radius: 12px;
          color: white;
          font-weight: 700;
          padding: 0.75rem 1.5rem;
          transition: all 0.3s ease;
          box-shadow: 
            0 4px 15px rgba(37, 99, 235, 0.4),
            0 0 0 1px rgba(255, 255, 255, 0.1);
          position: relative;
          overflow: hidden;
        }
        
        .primary-button-enhanced::before {
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
        
        .primary-button-enhanced:hover::before {
          left: 100%;
        }
        
        .primary-button-enhanced:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 
            0 8px 25px rgba(37, 99, 235, 0.5),
            0 0 30px rgba(124, 58, 237, 0.4);
        }
        
        .secondary-button-enhanced {
          background: linear-gradient(135deg, 
            rgba(51, 65, 85, 0.9) 0%,
            rgba(30, 41, 59, 0.8) 100%
          );
          border: 1px solid rgba(37, 99, 235, 0.3);
          border-radius: 12px;
          color: #f1f5f9;
          font-weight: 600;
          padding: 0.75rem 1.5rem;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }
        
        .secondary-button-enhanced:hover {
          background: linear-gradient(135deg, 
            rgba(51, 65, 85, 1) 0%,
            rgba(30, 41, 59, 0.95) 100%
          );
          border: 1px solid rgba(37, 99, 235, 0.5);
          color: #ffffff;
          transform: translateY(-1px) scale(1.01);
          box-shadow: 0 4px 15px rgba(37, 99, 235, 0.25);
        }
        
        .search-input-enhanced {
          background: linear-gradient(135deg, 
            rgba(51, 65, 85, 0.8) 0%,
            rgba(30, 41, 59, 0.6) 100%
          );
          border: 1px solid rgba(37, 99, 235, 0.3);
          border-radius: 12px;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          color: #f1f5f9;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
          position: relative;
          z-index: 10;
        }
        
        .search-input-enhanced:focus {
          background: linear-gradient(135deg, 
            rgba(51, 65, 85, 0.95) 0%,
            rgba(30, 41, 59, 0.8) 100%
          );
          border: 1px solid rgba(37, 99, 235, 0.6);
          box-shadow: 
            0 0 20px rgba(37, 99, 235, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          transform: translateY(-1px);
        }
        
        .search-input-enhanced::placeholder {
          color: rgba(148, 163, 184, 0.8);
        }

        .feature-badge {
          background: linear-gradient(135deg, 
            rgba(16, 185, 129, 0.2) 0%,
            rgba(5, 150, 105, 0.15) 100%
          );
          border: 1px solid rgba(16, 185, 129, 0.4);
          border-radius: 12px;
          color: rgb(52, 211, 153);
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          font-weight: 600;
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          animation: featurePulse 3s ease-in-out infinite;
        }
        
        @keyframes featurePulse {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(16, 185, 129, 0.3); 
          }
          50% { 
            box-shadow: 0 0 30px rgba(16, 185, 129, 0.5); 
          }
        }

        /* ONLY ENHANCE WHITE/PLAIN BACKGROUNDS - KEEP ALL GOOD PARTS! */
        
        /* If there are any plain white invoice cards, enhance them gently */
        .invoice-item-card {
          background: linear-gradient(135deg, 
            rgba(15, 23, 42, 0.98) 0%,
            rgba(30, 41, 59, 0.95) 100%
          ) !important;
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.3),
            0 0 40px rgba(37, 99, 235, 0.1);
          transition: all 0.3s ease;
        }
        
        .invoice-item-card:hover {
          border: 1px solid rgba(37, 99, 235, 0.3);
          box-shadow: 
            0 12px 40px rgba(0, 0, 0, 0.4),
            0 0 60px rgba(37, 99, 235, 0.2);
          transform: translateY(-2px);
        }
        
        /* Enhance any white text that's hard to read */
        .invoice-title {
          color: #f1f5f9 !important;
          font-weight: 700;
        }
        
        .invoice-subtitle {
          color: #cbd5e1 !important;
          font-weight: 500;
        }
        
        .invoice-amount {
          color: #f8fafc !important;
          font-weight: 800;
        }
        
        .invoice-status-paid {
          background: linear-gradient(45deg, rgba(34, 197, 94, 0.2), rgba(21, 128, 61, 0.2));
          color: #4ade80 !important;
          border: 1px solid #22c55e;
        }
        
        .invoice-status-pending {
          background: linear-gradient(45deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.2));
          color: #fbbf24 !important;
          border: 1px solid #f59e0b;
        }
        
        .invoice-status-overdue {
          background: linear-gradient(45deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.2));
          color: #f87171 !important;
          border: 1px solid #ef4444;
        }
      `}</style>

      {/* Removed Floating Light Rays and Particles as their CSS definitions were removed */}

      <div className="space-y-8 relative z-10 w-full"> {/* Added w-full */}
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full" /* Added w-full */
        >
          <div>
            <h1 className="invoice-title-future">Invoices</h1>
            <p className="invoice-text-future">Create, send, and track professional invoices with company branding</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleRetry}
              className="secondary-button-enhanced flex items-center gap-2"
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              onClick={() => setShowForm(true)}
              className="primary-button-enhanced flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Invoice
            </Button>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/20 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <span className="text-red-300">{error}</span>
              </div>
              <Button
                onClick={handleRetry}
                size="sm"
                className="secondary-button-enhanced"
              >
                Try Again
              </Button>
            </div>
          </motion.div>
        )}

        {/* Enhanced Metrics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full" /* Added w-full */
        >
          <Card className="invoice-card-future">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-500/20">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium invoice-text-future mb-1">Total Revenue</p>
                <p className="text-2xl font-bold invoice-text-future">${totalRevenue.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="invoice-card-future">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-500/20">
                <Clock className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium invoice-text-future mb-1">Pending</p>
                <p className="text-2xl font-bold invoice-text-future">${pendingAmount.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="invoice-card-future">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-red-500/20">
                <Clock className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <p className="text-sm font-medium invoice-text-future mb-1">Overdue</p>
                <p className="text-2xl font-bold invoice-text-future">${overdueAmount.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="invoice-card-future">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-gray-500/20">
                <FileText className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-medium invoice-text-future mb-1">Drafts</p>
                <p className="text-2xl font-bold invoice-text-future">{draftCount}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Enhanced Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="w-full" /* Added w-full */
        >
          <Card className="invoice-card-future w-full"> {/* Added w-full */}
            <CardContent className="p-6 relative z-10 w-full"> {/* Added w-full */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-20" />
                  <Input
                    placeholder="Search by client or invoice #"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input-enhanced"
                  />
                </div>
                <InvoiceFilters filters={filters} onFiltersChange={setFilters} />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Enhanced Invoice List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="w-full" /* Added w-full */
        >
          <Card className="invoice-card-future w-full"> {/* Added w-full */}
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center justify-between invoice-text-future">
                <span className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-blue-400" />
                  All Invoices ({filteredInvoices.length})
                </span>
                <div className="flex items-center gap-3">
                  <Badge className="feature-badge">
                    <Mail className="w-4 h-4" />
                    Email Sending Ready
                  </Badge>
                  <Button 
                    className="secondary-button-enhanced flex items-center gap-2" 
                    onClick={handleExport}
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 w-full"> {/* Added w-full */}
              <InvoiceList
                invoices={filteredInvoices}
                isLoading={isLoading}
                onEdit={handleEdit}
                onSend={handleSendInvoice}
                onDownload={handleDownloadPDF}
                onMarkPaid={handleMarkPaid}
                onDelete={handleDelete}
                sendingInvoiceId={sendingInvoiceId}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Branded Invoice Form Modal */}
        {showForm && (
          <BrandedInvoiceForm
            invoice={editingInvoice}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingInvoice(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
