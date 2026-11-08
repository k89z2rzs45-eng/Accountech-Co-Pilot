
import React, { useState, useEffect } from "react";
import { Transaction } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Upload,
  Search,
  Filter,
  Download,
  Receipt,
  Mic,
  TrendingUp,
  TrendingDown,
  Minus,
  X,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Edit,
  Trash2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

// Import components
import TransactionForm from "../components/transactions/TransactionForm";
import TransactionFilters from "../components/transactions/TransactionFilters";
import ReceiptUpload from "../components/transactions/ReceiptUpload";
import VoiceInput from "../components/transactions/VoiceInput";
import TransactionDetailModal from "../components/transactions/TransactionDetailModal";

import { User } from "@/api/entities";
import { detectDefaultCurrency } from "@/components/utils/currency";
import { safeFormatDate } from "@/components/utils/formatters";

// Category labels constant
const CATEGORY_LABELS = {
  meals: "🍔 Food & Dining",
  travel: "✈️ Travel", 
  software: "💻 Software",
  office_supplies: "📎 Office Supplies",
  utilities: "⚡ Bills & Utilities",
  sales: "💰 Sales & Revenue",
  consulting: "🤝 Consulting",
  other: "📋 Other"
};

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showVoice, setShowVoice] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    type: "all",
    category: "all",
    dateRange: "all"
  });
  const [defaultCurrency, setDefaultCurrency] = useState("USD");

  useEffect(() => {
    loadTransactions();
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('new') === 'true') {
      setShowForm(true);
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const me = await User.me();
        const auto = detectDefaultCurrency({
          userCountry: me?.country,
          userPreferred: me?.preferred_currency
        });
        setDefaultCurrency(auto || "USD");
      } catch (error) {
        console.log('Could not load user currency preference');
      }
    })();
  }, []);

  const loadTransactions = async () => {
    setIsLoading(true);
    try {
      const data = await Transaction.list('-date', 100);
      setTransactions(data || []);
    } catch (error) {
      console.error('Error loading transactions:', error);
      setTransactions([]);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (transactionData) => {
    try {
      if (editingTransaction) {
        await Transaction.update(editingTransaction.id, transactionData);
      } else {
        await Transaction.create(transactionData);
      }
      
      setShowForm(false);
      setEditingTransaction(null);
      await loadTransactions();
      
    } catch (error) {
      console.error('Error saving transaction:', error);
      alert('Error saving transaction. Please try again.');
    }
  };

  const handleEdit = (transaction, event) => {
    event?.stopPropagation();
    setEditingTransaction(transaction);
    setShowForm(true);
  };
  
  const handleDelete = async (transaction, event) => {
    event?.stopPropagation();
    if (confirm(`Are you sure you want to delete transaction: ${transaction.description}?`)) {
      try {
        await Transaction.delete(transaction.id);
        await loadTransactions();
      } catch (error) {
        console.error('Error deleting transaction:', error);
        alert('Error deleting transaction. Please try again.');
      }
    }
  };

  const handleView = (transaction) => {
    setSelectedTransaction(transaction);
    setShowDetailModal(true);
  };

  const handleExport = () => {
    try {
      const csvRows = [
        ["Date", "Description", "Amount", "Currency", "Type", "Category", "Vendor", "Status"],
        ...filteredTransactions.map(t => [
          t.date,
          t.description,
          t.amount,
          t.currency,
          t.type,
          t.category,
          t.vendor || "",
          t.status
        ])
      ];
      
      const csv = csvRows.map(row => row.join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `transactions_${defaultCurrency}_${new Date().toISOString().slice(0,10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Export error:', error);
      alert('Export failed. Please try again.');
    }
  };

  const filteredTransactions = React.useMemo(() => {
    return transactions
      .filter(transaction => transaction.currency === defaultCurrency)
      .filter(transaction => {
        // Search filter
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = !searchTerm || 
          transaction.description?.toLowerCase().includes(searchLower) ||
          transaction.vendor?.toLowerCase().includes(searchLower) ||
          transaction.category?.toLowerCase().includes(searchLower);

        // Type filter
        const matchesType = filters.type === "all" || transaction.type === filters.type;
        
        // Category filter
        const matchesCategory = filters.category === "all" || transaction.category === filters.category;

        // Date filter
        let matchesDate = true;
        if (filters.dateRange !== "all") {
          const transactionDate = new Date(transaction.date);
          const now = new Date();
          
          switch (filters.dateRange) {
            case "today":
              matchesDate = transactionDate.toDateString() === now.toDateString();
              break;
            case "week":
              const startOfWeek = new Date(now.setDate(now.getDate() - (now.getDay() || 7) + 1));
              matchesDate = transactionDate >= startOfWeek;
              break;
            case "month":
              const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
              matchesDate = transactionDate >= startOfMonth;
              break;
          }
        }

        return matchesSearch && matchesType && matchesCategory && matchesDate;
      });
  }, [transactions, defaultCurrency, searchTerm, filters]);

  return (
    <div className="min-h-screen transactions-page-container w-full">
      <style jsx>{`
        /* FULL SCREEN TRANSACTIONS PAGE - PROFESSIONAL LAYOUT */
        .transactions-page-container {
          background: linear-gradient(135deg, 
            #0f172a 0%,
            #1e293b 25%,
            #334155 50%,
            #1e293b 75%,
            #0f172a 100%
          );
          background-size: 400% 400%;
          animation: backgroundFlow 20s ease infinite;
          position: relative;
          overflow: hidden;
          padding: 2rem;
          width: 100% !important;
          min-height: 100vh;
        }
        
        /* MAIN CONTENT CONTAINER - FULL WIDTH */
        .transactions-main-container {
          width: 100% !important;
          max-width: none !important;
          margin: 0;
          padding: 0;
        }
        
        /* ALL CHILD CONTAINERS FULL WIDTH */
        .transactions-page-container > * {
          width: 100% !important;
          max-width: none !important;
        }
        
        @keyframes backgroundFlow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        /* Floating Light Rays */
        .light-ray {
          position: fixed;
          width: 2px;
          height: 100vh;
          pointer-events: none;
          z-index: 1;
        }
        
        .light-ray-1 {
          background: linear-gradient(to bottom, 
            transparent, 
            rgba(37, 99, 235, 0.6), 
            transparent
          );
          left: 15%;
          animation: lightFlow1 18s linear infinite;
        }
        
        .light-ray-2 {
          background: linear-gradient(to bottom, 
            transparent, 
            rgba(124, 58, 237, 0.5), 
            transparent
          );
          left: 65%;
          animation: lightFlow2 22s linear infinite;
          animation-delay: -7s;
        }
        
        .light-ray-3 {
          background: linear-gradient(to bottom, 
            transparent, 
            rgba(245, 158, 11, 0.4), 
            transparent
          );
          left: 85%;
          animation: lightFlow3 20s linear infinite;
          animation-delay: -14s;
        }
        
        @keyframes lightFlow1 {
          0% { transform: translateY(-100%) rotate(10deg); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100vh) rotate(10deg); opacity: 0; }
        }
        
        @keyframes lightFlow2 {
          0% { transform: translateY(-100%) rotate(-8deg); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100vh) rotate(-8deg); opacity: 0; }
        }
        
        @keyframes lightFlow3 {
          0% { transform: translateY(-100%) rotate(12deg); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100vh) rotate(12deg); opacity: 0; }
        }
        
        /* Floating Particles */
        .transactions-particles {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 1;
        }
        
        .particle {
          position: absolute;
          border-radius: 50%;
          animation: floatParticle 15s ease-in-out infinite;
        }
        
        .particle-1 {
          width: 6px;
          height: 6px;
          background: linear-gradient(135deg, #10b981, #34d399);
          top: 20%;
          left: 10%;
          animation-delay: 0s;
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.5);
        }
        
        .particle-2 {
          width: 8px;
          height: 8px;
          background: linear-gradient(135deg, #ef4444, #f87171);
          top: 70%;
          left: 90%;
          animation-delay: 5s;
          box-shadow: 0 0 25px rgba(239, 68, 68, 0.6);
        }
        
        .particle-3 {
          width: 4px;
          height: 4px;
          background: linear-gradient(135deg, #f59e0b, #fbbf24);
          top: 40%;
          left: 75%;
          animation-delay: 10s;
          box-shadow: 0 0 15px rgba(245, 158, 11, 0.4);
        }
        
        .particle-4 {
          width: 7px;
          height: 7px;
          background: linear-gradient(135deg, #2563eb, #3b82f6);
          top: 85%;
          left: 25%;
          animation-delay: 3s;
          box-shadow: 0 0 20px rgba(37, 99, 235, 0.5);
        }
        
        .particle-5 {
          width: 5px;
          height: 5px;
          background: linear-gradient(135deg, #7c3aed, #8b5cf6);
          top: 15%;
          left: 60%;
          animation-delay: 8s;
          box-shadow: 0 0 18px rgba(124, 58, 237, 0.4);
        }
        
        @keyframes floatParticle {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) rotate(0deg) scale(1); 
            opacity: 0.6; 
          }
          25% { 
            transform: translateY(-40px) translateX(20px) rotate(90deg) scale(1.3); 
            opacity: 1; 
          }
          50% { 
            transform: translateY(-80px) translateX(-15px) rotate(180deg) scale(1.6); 
            opacity: 0.8; 
          }
          75% { 
            transform: translateY(-40px) translateX(25px) rotate(270deg) scale(1.2); 
            opacity: 1; 
          }
        }
        
        /* Revolutionary Filters Card */
        .filters-card {
          background: linear-gradient(145deg, 
            rgba(15, 23, 42, 0.98) 0%,
            rgba(30, 41, 59, 0.95) 100%
          );
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          backdrop-filter: blur(30px);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.4),
            0 0 40px rgba(37, 99, 235, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          position: relative;
          overflow: hidden;
          margin-bottom: 2rem;
        }
        
        .filters-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, 
            rgba(37, 99, 235, 0.04) 0%,
            rgba(124, 58, 237, 0.03) 50%,
            rgba(245, 158, 11, 0.02) 100%
          );
          animation: filtersShimmer 10s ease-in-out infinite;
          z-index: 1;
        }
        
        @keyframes filtersShimmer {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }
        
        .filters-content {
          position: relative;
          z-index: 10;
          padding: 1rem 1.5rem;
        }
        
        /* Revolutionary Transactions List Card */
        .transactions-list-card {
          background: linear-gradient(145deg, 
            rgba(15, 23, 42, 0.98) 0%,
            rgba(30, 41, 59, 0.95) 100%
          );
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          backdrop-filter: blur(30px);
          box-shadow: 
            0 12px 40px rgba(0, 0, 0, 0.4),
            0 0 60px rgba(37, 99, 235, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          position: relative;
          overflow: hidden;
          margin-bottom: 2rem;
        }
        
        .transactions-list-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, 
            rgba(37, 99, 235, 0.04) 0%,
            rgba(124, 58, 237, 0.03) 50%,
            rgba(245, 158, 11, 0.02) 100%
          );
          animation: transactionsShimmer 12s ease-in-out infinite;
          z-index: 1;
        }
        
        @keyframes transactionsShimmer {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }
        
        .transactions-header {
          position: relative;
          z-index: 10;
          padding: 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .transactions-content {
          position: relative;
          z-index: 10;
          padding: 0;
        }
        
        /* Enhanced Transaction Items */
        .transaction-item-enhanced {
          background: linear-gradient(135deg, 
            rgba(51, 65, 85, 0.3) 0%,
            rgba(30, 41, 59, 0.2) 100%
          );
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding: 1.5rem;
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        
        .transaction-item-enhanced::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg,
            transparent,
            rgba(37, 99, 235, 0.1),
            transparent
          );
          transition: left 0.6s ease;
        }
        
        .transaction-item-enhanced:hover::before {
          left: 100%;
        }
        
        .transaction-item-enhanced:hover {
          background: linear-gradient(135deg, 
            rgba(51, 65, 85, 0.5) 0%,
            rgba(30, 41, 59, 0.4) 100%
          );
          transform: translateX(4px);
          box-shadow: 0 4px 20px rgba(37, 99, 235, 0.2);
        }
        
        /* Transaction Type Icons with Enhanced Effects */
        .transaction-icon-enhanced {
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .transaction-icon-enhanced::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: inherit;
          animation: iconPulse 3s ease-in-out infinite;
          z-index: -1;
        }
        
        @keyframes iconPulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        
        .income-icon {
          background: linear-gradient(135deg, 
            rgba(16, 185, 129, 0.3) 0%,
            rgba(5, 150, 105, 0.2) 100%
          );
          border: 1px solid rgba(16, 185, 129, 0.4);
        }
        
        .expense-icon {
          background: linear-gradient(135deg, 
            rgba(239, 68, 68, 0.3) 0%,
            rgba(220, 38, 38, 0.2) 100%
          );
          border: 1px solid rgba(239, 68, 68, 0.4);
        }
        
        .transfer-icon {
          background: linear-gradient(135deg, 
            rgba(37, 99, 235, 0.3) 0%,
            rgba(29, 78, 216, 0.2) 100%
          );
          border: 1px solid rgba(37, 99, 235, 0.4);
        }
        
        /* Enhanced Typography for Dark Theme */
        .transaction-title {
          color: #f1f5f9;
          font-weight: 700;
          font-size: 1.125rem;
          margin-bottom: 0.25rem;
        }
        
        .transaction-details {
          color: rgba(148, 163, 184, 0.9);
          font-size: 0.875rem;
        }
        
        .transaction-amount-income {
          color: #34d399;
          font-weight: 800;
          font-size: 1.25rem;
        }
        
        .transaction-amount-expense {
          color: #f87171;
          font-weight: 800;
          font-size: 1.25rem;
        }
        
        /* Enhanced Badges */
        .badge-enhanced {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
        }
        
        .badge-tax-deductible {
          background: linear-gradient(135deg, 
            rgba(124, 58, 237, 0.3) 0%,
            rgba(109, 40, 217, 0.2) 100%
          );
          color: #c084fc;
          border: 1px solid rgba(124, 58, 237, 0.4);
        }
        
        .badge-cleared {
          background: linear-gradient(135deg, 
            rgba(16, 185, 129, 0.3) 0%,
            rgba(5, 150, 105, 0.2) 100%
          );
          color: #6ee7b7;
          border: 1px solid rgba(16, 185, 129, 0.4);
        }
        
        .badge-pending {
          background: linear-gradient(135deg, 
            rgba(245, 158, 11, 0.3) 0%,
            rgba(217, 119, 6, 0.2) 100%
          );
          color: #fcd34d;
          border: 1px solid rgba(245, 158, 11, 0.4);
        }
        
        .badge-category {
          background: linear-gradient(135deg, 
            rgba(37, 99, 235, 0.3) 0%,
            rgba(29, 78, 216, 0.2) 100%
          );
          color: #93c5fd;
          border: 1px solid rgba(37, 99, 235, 0.4);
        }
        
        /* Summary Stats Enhancement */
        .summary-stats {
          display: flex;
          align-items: center;
          gap: 2rem;
          color: rgba(148, 163, 184, 0.9);
          font-size: 0.875rem;
          font-weight: 600;
        }
        
        .income-stat {
          color: #34d399;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .expense-stat {
          color: #f87171;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        /* Enhanced Loading States */
        .loading-skeleton {
          background: linear-gradient(90deg,
            rgba(51, 65, 85, 0.5) 0%,
            rgba(71, 85, 105, 0.7) 50%,
            rgba(51, 65, 85, 0.5) 100%
          );
          background-size: 200% 100%;
          animation: skeletonLoading 1.5s ease-in-out infinite;
          border-radius: 8px;
        }
        
        @keyframes skeletonLoading {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        /* Empty State Enhancement */
        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: rgba(148, 163, 184, 0.8);
        }
        
        .empty-state h3 {
          color: #f1f5f9;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        
        .empty-state p {
          color: rgba(148, 163, 184, 0.9);
          margin-bottom: 1.5rem;
        }
      `}</style>

      {/* Floating Light Rays */}
      <div className="light-ray light-ray-1"></div>
      <div className="light-ray light-ray-2"></div>
      <div className="light-ray light-ray-3"></div>
      
      {/* Floating Particles */}
      <div className="transactions-particles">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="particle particle-4"></div>
        <div className="particle particle-5"></div>
      </div>

      {/* FULL WIDTH MAIN CONTAINER */}
      <div className="transactions-main-container space-y-8">
        {/* Enhanced Header - FULL WIDTH */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full">
            <div>
              <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 tracking-tight">
                💰 My Money
              </h1>
              <p className="text-gray-400 mt-2 text-xl">Track where your money comes from and goes to</p>
            </div>
            
            <div className="flex gap-3 items-center flex-wrap">
              <Button 
                onClick={() => {
                  setEditingTransaction(null);
                  setShowForm(true);
                }}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Income
              </Button>
              
              <Button 
                onClick={() => {
                  setEditingTransaction(null);
                  setShowForm(true);
                }}
                className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <Minus className="w-5 h-5 mr-2" />
                Add Expense
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Quick Actions - FULL WIDTH */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full"
        >
          <Card className="bg-gray-900 border-gray-700 w-full">
            <CardContent className="p-6 w-full">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
                <div className="md:col-span-2 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-20" />
                  <Input
                    placeholder="Find a transaction... (e.g., 'coffee', 'client payment')"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 w-full"
                  />
                </div>
                
                <Button
                  onClick={() => setShowUpload(true)}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Receipt
                </Button>
                
                <Button
                  onClick={handleExport}
                  className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Export for Taxes
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Enhanced Filters - FULL WIDTH */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="filters-card w-full"
        >
          <CardContent className="filters-content">
            <div className="flex flex-wrap gap-4 items-center w-full">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium text-gray-300">Show:</Label>
                <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger className="w-32 bg-slate-700/50 border-slate-600 text-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="all">All Money</SelectItem>
                    <SelectItem value="income">💰 Money In</SelectItem>
                    <SelectItem value="expense">💸 Money Out</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium text-gray-300">Time:</Label>
                <Select value={filters.dateRange} onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}>
                  <SelectTrigger className="w-32 bg-slate-700/50 border-slate-600 text-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium text-gray-300">Category:</Label>
                <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger className="w-40 bg-slate-700/50 border-slate-600 text-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="all">All Categories</SelectItem>
                    {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {(filters.type !== 'all' || filters.dateRange !== 'all' || filters.category !== 'all') && (
                <Badge variant="secondary" className="badge-enhanced flex items-center gap-2">
                  <Filter className="w-3 h-3" />
                  {[filters.type, filters.dateRange, filters.category].filter(f => f !== 'all').length} filter{[filters.type, filters.dateRange, filters.category].filter(f => f !== 'all').length > 1 ? 's' : ''} active
                  <button 
                    onClick={() => setFilters({ type: 'all', dateRange: 'all', category: 'all' })}
                    className="ml-1 text-gray-400 hover:text-gray-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
            </div>
          </CardContent>
        </motion.div>

        {/* Enhanced Transaction List - FULL WIDTH */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="transactions-list-card w-full"
        >
          <CardHeader className="transactions-header">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-gray-100 mb-1">
                  Your Transactions ({filteredTransactions.length})
                </CardTitle>
                <div className="summary-stats">
                  <span className="income-stat">
                    <TrendingUp className="w-4 h-4" />
                    Income: {defaultCurrency} {filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0).toFixed(0)}
                  </span>
                  <span className="expense-stat">
                    <TrendingDown className="w-4 h-4" />
                    Expenses: {defaultCurrency} {filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0).toFixed(0)}
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="transactions-content">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mr-4"></div>
                <p className="text-gray-300">Loading your transactions...</p>
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="empty-state">
                <Receipt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3>No transactions found</h3>
                <p>
                  {searchTerm ? 'Try different search terms or filters.' : 'Add your first transaction to get started.'}
                </p>
                {!searchTerm && (
                  <Button onClick={() => setShowForm(true)} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Transaction
                  </Button>
                )}
              </div>
            ) : (
              <div className="w-full">
                {filteredTransactions.map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleView(transaction)}
                    className="transaction-item-enhanced w-full"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`transaction-icon-enhanced ${
                          transaction.type === 'income' ? 'income-icon' : 
                          transaction.type === 'expense' ? 'expense-icon' : 'transfer-icon'
                        }`}>
                          {transaction.type === 'income' ? (
                            <ArrowUpRight className="w-6 h-6 text-green-400" />
                          ) : transaction.type === 'expense' ? (
                            <ArrowDownRight className="w-6 h-6 text-red-400" />
                          ) : (
                            <ArrowUpRight className="w-6 h-6 text-blue-400" />
                          )}
                        </div>
                        
                        <div>
                          <h3 className="transaction-title">{transaction.description}</h3>
                          <div className="flex items-center gap-3 mt-1">
                            <p className="transaction-details">{safeFormatDate(transaction.date)}</p>
                            {transaction.vendor && (
                              <>
                                <span className="text-gray-500">•</span>
                                <p className="transaction-details">{transaction.vendor}</p>
                              </>
                            )}
                            <Badge className="badge-category">
                              {CATEGORY_LABELS[transaction.category] || transaction.category}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className={`${
                            transaction.type === 'income' ? 'transaction-amount-income' : 'transaction-amount-expense'
                          }`}>
                            {transaction.type === 'income' ? '+' : '-'}{transaction.currency} {transaction.amount.toFixed(2)}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {transaction.tax_deductible && (
                              <Badge className="badge-tax-deductible">Tax Deductible</Badge>
                            )}
                            <Badge className={`${
                              transaction.status === 'cleared' ? 'badge-cleared' :
                              transaction.status === 'pending' ? 'badge-pending' :
                              'badge-category'
                            }`}>
                              {transaction.status}
                            </Badge>
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()} className="text-gray-400 hover:text-gray-200">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-slate-800 border-slate-700">
                            <DropdownMenuItem onClick={(e) => handleEdit(transaction, e)} className="text-gray-200 hover:bg-slate-700">
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => handleDelete(transaction, e)} className="text-red-400 hover:bg-red-900/20">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </motion.div>
      </div>

      {showForm && (
        <TransactionForm
          transaction={editingTransaction}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingTransaction(null);
          }}
          defaultCurrency={defaultCurrency}
        />
      )}

      {showDetailModal && (
        <TransactionDetailModal
          transaction={selectedTransaction}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedTransaction(null);
          }}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {showUpload && (
        <ReceiptUpload
          onComplete={async () => {
            await loadTransactions();
            setShowUpload(false);
          }}
          onCancel={() => setShowUpload(false)}
          defaultCurrency={defaultCurrency}
        />
      )}

      {showVoice && (
        <VoiceInput
          onComplete={async () => {
            await loadTransactions();
            setShowVoice(false);
          }}
          onCancel={() => setShowVoice(false)}
          defaultCurrency={defaultCurrency}
        />
      )}
    </div>
  );
}
