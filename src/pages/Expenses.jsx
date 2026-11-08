
import React, { useState, useEffect } from "react";
import { Expense } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Search,
  Filter,
  Download,
  Receipt,
  Upload,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Calendar,
  DollarSign,
  Tag,
  FileText,
  TrendingUp,
  TrendingDown,
  X,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

// Import components
import ExpenseForm from "../components/expenses/ExpenseForm";
import ExpenseFilters from "../components/expenses/ExpenseFilters";
import ExpenseDetailModal from "../components/expenses/ExpenseDetailModal";
import ExpenseUpload from "../components/expenses/ExpenseUpload";

import { User } from "@/api/entities";
import { detectDefaultCurrency } from "@/components/utils/currency";
import { safeFormatDate } from "@/components/utils/formatters";

// Category labels with icons
const CATEGORY_LABELS = {
  office_supplies: "📎 Office Supplies",
  travel: "✈️ Travel & Transport", 
  utilities: "⚡ Utilities",
  software: "💻 Software & Apps",
  marketing: "📢 Marketing & Advertising",
  meals: "🍔 Meals & Entertainment",
  professional_services: "🤝 Professional Services",
  equipment: "🛠️ Equipment & Tools",
  rent: "🏢 Rent & Facilities",
  insurance: "🛡️ Insurance",
  taxes: "📋 Taxes & Fees",
  freelance: "👥 Freelance & Contractors",
  subscription: "📅 Subscriptions",
  fuel: "⛽ Fuel & Vehicle",
  maintenance: "🔧 Maintenance & Repairs",
  legal: "⚖️ Legal Services",
  bank_fees: "🏦 Bank Fees",
  advertising: "📺 Advertising",
  training: "🎓 Training & Education",
  entertainment: "🎉 Entertainment",
  phone_internet: "📱 Phone & Internet",
  postage_shipping: "📦 Postage & Shipping",
  repairs: "🔨 Repairs",
  cleaning: "🧹 Cleaning Services",
  security: "🔒 Security",
  other: "📋 Other"
};

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  reimbursed: "bg-blue-100 text-blue-800"
};

const STATUS_ICONS = {
  pending: Clock,
  approved: CheckCircle,
  rejected: AlertCircle,
  reimbursed: DollarSign
};

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    category: "all",
    dateRange: "all",
    amountRange: "all",
    taxDeductible: "all"
  });
  const [defaultCurrency, setDefaultCurrency] = useState("USD");

  useEffect(() => {
    loadExpenses();
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

  const loadExpenses = async () => {
    setIsLoading(true);
    try {
      const data = await Expense.list('-date', 200);
      setExpenses(data || []);
    } catch (error) {
      console.error('Error loading expenses:', error);
      setExpenses([]);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (expenseData) => {
    try {
      if (editingExpense) {
        await Expense.update(editingExpense.id, expenseData);
      } else {
        await Expense.create(expenseData);
      }
      
      setShowForm(false);
      setEditingExpense(null);
      await loadExpenses();
      
    } catch (error) {
      console.error('Error saving expense:', error);
      alert('Error saving expense. Please try again.');
    }
  };

  const handleEdit = (expense, event) => {
    event?.stopPropagation();
    setEditingExpense(expense);
    setShowForm(true);
  };
  
  const handleDelete = async (expense, event) => {
    event?.stopPropagation();
    if (confirm(`Are you sure you want to delete expense: ${expense.description}?`)) {
      try {
        await Expense.delete(expense.id);
        await loadExpenses();
      } catch (error) {
        console.error('Error deleting expense:', error);
        alert('Error deleting expense. Please try again.');
      }
    }
  };

  const handleView = (expense) => {
    setSelectedExpense(expense);
    setShowDetailModal(true);
  };

  const handleApprove = async (expense, event) => {
    event?.stopPropagation();
    try {
      await Expense.update(expense.id, { 
        status: 'approved',
        approved_by: 'current_user',
        approved_date: new Date().toISOString()
      });
      await loadExpenses();
    } catch (error) {
      console.error('Error approving expense:', error);
      alert('Error approving expense. Please try again.');
    }
  };

  const handleExport = () => {
    try {
      const csvRows = [
        ["Date", "Description", "Amount", "Currency", "Category", "Vendor", "Status", "Tax Deductible", "Payment Method"],
        ...filteredExpenses.map(e => [
          e.date,
          e.description,
          e.amount,
          e.currency,
          e.category,
          e.vendor || "",
          e.status,
          e.tax_deductible ? "Yes" : "No",
          e.payment_method || ""
        ])
      ];
      
      const csv = csvRows.map(row => row.join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `expenses_${defaultCurrency}_${new Date().toISOString().slice(0,10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Export error:', error);
      alert('Export failed. Please try again.');
    }
  };

  const filteredExpenses = React.useMemo(() => {
    return expenses
      .filter(expense => expense.currency === defaultCurrency)
      .filter(expense => {
        // Search filter
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = !searchTerm || 
          expense.description?.toLowerCase().includes(searchLower) ||
          expense.vendor?.toLowerCase().includes(searchLower) ||
          expense.category?.toLowerCase().includes(searchLower);

        // Status filter
        const matchesStatus = filters.status === "all" || expense.status === filters.status;
        
        // Category filter
        const matchesCategory = filters.category === "all" || expense.category === filters.category;

        // Tax deductible filter  
        const matchesTaxDeductible = filters.taxDeductible === "all" || 
          (filters.taxDeductible === "yes" && expense.tax_deductible) ||
          (filters.taxDeductible === "no" && !expense.tax_deductible);

        // Date filter
        let matchesDate = true;
        if (filters.dateRange !== "all") {
          const expenseDate = new Date(expense.date);
          const now = new Date();
          
          switch (filters.dateRange) {
            case "today":
              matchesDate = expenseDate.toDateString() === now.toDateString();
              break;
            case "week":
              const startOfWeek = new Date(now.setDate(now.getDate() - (now.getDay() || 7) + 1));
              matchesDate = expenseDate >= startOfWeek;
              break;
            case "month":
              const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
              matchesDate = expenseDate >= startOfMonth;
              break;
            case "quarter":
              const currentQuarter = Math.floor(now.getMonth() / 3);
              const startOfQuarter = new Date(now.getFullYear(), currentQuarter * 3, 1);
              matchesDate = expenseDate >= startOfQuarter;
              break;
          }
        }

        // Amount filter
        let matchesAmount = true;
        if (filters.amountRange !== "all") {
          const amount = expense.amount;
          switch (filters.amountRange) {
            case "0-100":
              matchesAmount = amount >= 0 && amount <= 100;
              break;
            case "100-500":
              matchesAmount = amount > 100 && amount <= 500;
              break;
            case "500-1000":
              matchesAmount = amount > 500 && amount <= 1000;
              break;
            case "1000+":
              matchesAmount = amount > 1000;
              break;
          }
        }

        return matchesSearch && matchesStatus && matchesCategory && matchesTaxDeductible && matchesDate && matchesAmount;
      });
  }, [expenses, defaultCurrency, searchTerm, filters]);

  // Calculate totals
  const totalAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const pendingAmount = filteredExpenses.filter(e => e.status === 'pending').reduce((sum, e) => sum + e.amount, 0);
  const approvedAmount = filteredExpenses.filter(e => e.status === 'approved').reduce((sum, e) => sum + e.amount, 0);
  const taxDeductibleAmount = filteredExpenses.filter(e => e.tax_deductible).reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Professional Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Expense Management
            </h1>
            <p className="text-gray-600 text-lg mt-2">Track, categorize and manage all your business expenses</p>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">Total: {defaultCurrency} {totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-600">Pending: {defaultCurrency} {pendingAmount.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Approved: {defaultCurrency} {approvedAmount.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-gray-600">Tax Deductible: {defaultCurrency} {taxDeductibleAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 flex-wrap">
            <Button 
              onClick={() => setShowUpload(true)}
              variant="outline"
              className="px-6 py-3 border-red-200 text-red-600 hover:bg-red-50"
            >
              <Upload className="w-5 h-5 mr-2" />
              Upload Receipts
            </Button>
            
            <Button 
              onClick={() => {
                setEditingExpense(null);
                setShowForm(true);
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Expense
            </Button>
          </div>
        </motion.div>

        {/* Enhanced Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="md:col-span-2 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search expenses by description, vendor, or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 text-base border-gray-200 focus:border-red-400"
                  />
                </div>
                
                <Button
                  onClick={handleExport}
                  variant="outline"
                  className="h-12 flex items-center gap-2 border-gray-200 hover:bg-gray-50"
                >
                  <Download className="w-5 h-5" />
                  Export CSV
                </Button>
                
                <Button
                  onClick={() => window.open('/analytics?tab=expenses', '_blank')}
                  variant="outline"
                  className="h-12 flex items-center gap-2 border-gray-200 hover:bg-gray-50"
                >
                  <TrendingUp className="w-5 h-5" />
                  View Reports
                </Button>
              </div>

              {/* Filter Row */}
              <ExpenseFilters filters={filters} onFiltersChange={setFilters} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Expense List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="border-b border-gray-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-gray-800">
                  Expense Records ({filteredExpenses.length})
                </CardTitle>
                
                {(filters.status !== 'all' || filters.category !== 'all' || filters.dateRange !== 'all' || 
                  filters.amountRange !== 'all' || filters.taxDeductible !== 'all') && (
                  <Badge variant="secondary" className="flex items-center gap-2">
                    <Filter className="w-3 h-3" />
                    Filters Active
                    <button 
                      onClick={() => setFilters({
                        status: 'all',
                        category: 'all', 
                        dateRange: 'all',
                        amountRange: 'all',
                        taxDeductible: 'all'
                      })}
                      className="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                  <p className="ml-3 text-gray-600">Loading expenses...</p>
                </div>
              ) : filteredExpenses.length === 0 ? (
                <div className="text-center py-12">
                  <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No expenses found</h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm || filters.status !== 'all' ? 'Try adjusting your search or filters.' : 'Add your first expense to get started.'}
                  </p>
                  {!searchTerm && filters.status === 'all' && (
                    <Button onClick={() => setShowForm(true)} className="bg-red-600 hover:bg-red-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Expense
                    </Button>
                  )}
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredExpenses.map((expense, index) => {
                    const StatusIcon = STATUS_ICONS[expense.status];
                    return (
                      <motion.div
                        key={expense.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleView(expense)}
                        className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                              <Receipt className="w-6 h-6 text-red-600" />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold text-gray-900 text-lg truncate">
                                  {expense.description}
                                </h3>
                                <Badge className={STATUS_COLORS[expense.status]} variant="secondary">
                                  <StatusIcon className="w-3 h-3 mr-1" />
                                  {expense.status}
                                </Badge>
                              </div>
                              
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {safeFormatDate(expense.date)}
                                </span>
                                
                                {expense.vendor && (
                                  <span className="flex items-center gap-1">
                                    <Tag className="w-4 h-4" />
                                    {expense.vendor}
                                  </span>
                                )}
                                
                                <Badge variant="outline" className="text-xs">
                                  {CATEGORY_LABELS[expense.category] || expense.category}
                                </Badge>
                                
                                {expense.tax_deductible && (
                                  <Badge className="bg-purple-100 text-purple-700 text-xs">
                                    Tax Deductible
                                  </Badge>
                                )}
                                
                                {expense.receipt_urls && expense.receipt_urls.length > 0 && (
                                  <Badge variant="outline" className="text-xs flex items-center gap-1">
                                    <FileText className="w-3 h-3" />
                                    {expense.receipt_urls.length} Receipt{expense.receipt_urls.length > 1 ? 's' : ''}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-xl font-bold text-red-600">
                                {expense.currency} {expense.amount.toFixed(2)}
                              </p>
                              {expense.payment_method && (
                                <p className="text-sm text-gray-500 mt-1">
                                  via {expense.payment_method.replace('_', ' ')}
                                </p>
                              )}
                            </div>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem onClick={(e) => handleView(expense)}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => handleEdit(expense, e)}>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                {expense.status === 'pending' && (
                                  <DropdownMenuItem onClick={(e) => handleApprove(expense, e)}>
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Approve
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={(e) => handleDelete(expense, e)} className="text-red-600">
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Modals */}
        {showForm && (
          <ExpenseForm
            expense={editingExpense}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingExpense(null);
            }}
            defaultCurrency={defaultCurrency}
          />
        )}

        {showDetailModal && (
          <ExpenseDetailModal
            expense={selectedExpense}
            onClose={() => {
              setShowDetailModal(false);
              setSelectedExpense(null);
            }}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onApprove={handleApprove}
          />
        )}

        {showUpload && (
          <ExpenseUpload
            onComplete={async () => {
              await loadExpenses();
              setShowUpload(false);
            }}
            onCancel={() => setShowUpload(false)}
            defaultCurrency={defaultCurrency}
          />
        )}
      </div>
    </div>
  );
}
