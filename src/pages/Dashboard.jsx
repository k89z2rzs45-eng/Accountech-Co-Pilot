
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Plus,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Receipt,
  FileText,
  Users,
  Calculator,
  BarChart3,
  Target,
  Zap,
  Building2
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

// Import components SAFELY with error handling
import MetricCard from "../components/dashboard/MetricCard";
import TransactionList from "../components/dashboard/TransactionList";
import BudgetOverview from "../components/dashboard/BudgetOverview";
import CashFlowChart from "../components/dashboard/CashFlowChart";
import QuickAddModal from "../components/dashboard/QuickAddModal";
import FinancialAlertsWidget from "../components/dashboard/FinancialAlertsWidget";
import MobileOptimizedDashboard from "../components/mobile/MobileOptimizedDashboard";
import OptimizedPageWrapper from "../components/layout/OptimizedPageWrapper";

// Import entities SAFELY
import { Transaction } from "@/api/entities";
import { Invoice } from "@/api/entities";
import { Budget } from "@/api/entities";
import { User } from "@/api/entities";
import { Company } from "@/api/entities";
import { FinancialAlert } from "@/api/entities";

const CURRENCIES = ["USD", "GBP", "CAD", "EUR", "MMK", "JPY", "CNY", "INR", "SGD", "THB", "KRW"];

// SAFE METRIC CARDS GRID COMPONENT
const MetricCardsGrid = ({ 
  metrics, 
  defaultCurrency, 
  revenueGrowth, 
  expenseGrowth, 
  createPageUrl 
}) => {
  if (!metrics || typeof metrics !== 'object') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="bg-gray-900 border-gray-700 animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-gray-800 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const safeMetrics = {
    totalRevenue: metrics.totalRevenue || 0,
    totalExpenses: metrics.totalExpenses || 0,
    netIncome: metrics.netIncome || 0,
    pendingInvoices: metrics.pendingInvoices || 0,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Revenue */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Link to={createPageUrl("Transactions") + "?type=income"}>
          <MetricCard
            title="TOTAL REVENUE"
            value={safeMetrics.totalRevenue}
            change={revenueGrowth || 0}
            icon={TrendingUp}
            color="green"
            currency={defaultCurrency}
            className="cursor-pointer hover:shadow-lg transition-all"
          />
        </Link>
      </motion.div>

      {/* Total Expenses */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Link to={createPageUrl("Transactions") + "?type=expense"}>
          <MetricCard
            title="TOTAL EXPENSES"
            value={safeMetrics.totalExpenses}
            change={expenseGrowth || 0}
            icon={TrendingDown}
            color="red"
            currency={defaultCurrency}
            className="cursor-pointer hover:shadow-lg transition-all"
          />
        </Link>
      </motion.div>

      {/* Net Income */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Link to={createPageUrl("Analytics")}>
          <MetricCard
            title="NET INCOME"
            value={safeMetrics.netIncome}
            change={((safeMetrics.netIncome / Math.max(safeMetrics.totalRevenue, 1)) * 100) || 0}
            icon={DollarSign}
            color="blue"
            currency={defaultCurrency}
            className="cursor-pointer hover:shadow-lg transition-all"
          />
        </Link>
      </motion.div>

      {/* Pending Invoices */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Link to={createPageUrl("Invoices") + "?status=pending"}>
          <MetricCard
            title="PENDING INVOICES"
            value={safeMetrics.pendingInvoices}
            change={0}
            icon={Receipt}
            color="orange"
            currency=""
            className="cursor-pointer hover:shadow-lg transition-all"
          />
        </Link>
      </motion.div>
    </div>
  );
};

export default function Dashboard() {
  // SAFE STATE INITIALIZATION
  const [transactions, setTransactions] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [financialAlerts, setFinancialAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    netIncome: 0,
    pendingInvoices: 0
  });
  const [revenueGrowth, setRevenueGrowth] = useState(0);
  const [expenseGrowth, setExpenseGrowth] = useState(0);
  const [alertCount, setAlertCount] = useState(0);
  const [company, setCompany] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [dateRange, setDateRange] = useState("current_month");
  const [refreshing, setRefreshing] = useState(false);
  const [chartTimeRange, setChartTimeRange] = useState("6months");
  const [defaultCurrency, setDefaultCurrency] = useState("USD");

  // SAFE DATA LOADING
  useEffect(() => {
    loadDashboardData();
  }, [selectedCurrency, dateRange]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // SAFE PARALLEL DATA LOADING
      const promises = [
        loadTransactions(),
        loadInvoices(),
        loadBudgets(),
        loadFinancialAlerts(),
        loadCompany(),
        loadUser()
      ];

      await Promise.allSettled(promises); // Use allSettled to prevent one error from breaking everything
      
    } catch (error) {
      console.error('Dashboard data loading error:', error?.message || 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const loadTransactions = async () => {
    try {
      const data = await Transaction.list('-date', 100);
      setTransactions(Array.isArray(data) ? data : []);
      calculateMetrics(data || []);
    } catch (error) {
      console.error('Transaction loading error:', error?.message || 'Unknown error');
      setTransactions([]);
    }
  };

  const loadInvoices = async () => {
    try {
      const data = await Invoice.list('-created_date', 50);
      setInvoices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Invoice loading error:', error?.message || 'Unknown error');
      setInvoices([]);
    }
  };

  const loadBudgets = async () => {
    try {
      const data = await Budget.list('-created_date', 20);
      setBudgets(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Budget loading error:', error?.message || 'Unknown error');
      setBudgets([]);
    }
  };

  const loadFinancialAlerts = async () => {
    try {
      const data = await FinancialAlert.filter({ status: 'active' }, '-created_date', 10);
      setFinancialAlerts(Array.isArray(data) ? data : []);
      setAlertCount((data || []).length);
    } catch (error) {
      console.error('Financial alerts loading error:', error?.message || 'Unknown error');
      setFinancialAlerts([]);
    }
  };

  const loadCompany = async () => {
    try {
      const companies = await Company.list();
      setCompany(Array.isArray(companies) ? companies[0] : null);
    } catch (error) {
      console.error('Company loading error:', error?.message || 'Unknown error');
      setCompany(null);
    }
  };

  const loadUser = async () => {
    try {
      const user = await User.me();
      if (user?.preferred_currency) {
        setSelectedCurrency(user.preferred_currency);
        setDefaultCurrency(user.preferred_currency);
      }
    } catch (error) {
      console.error('User loading error:', error?.message || 'Unknown error');
    }
  };

  const calculateMetrics = (transactionData) => {
    try {
      if (!Array.isArray(transactionData)) {
        setMetrics({ totalRevenue: 0, totalExpenses: 0, netIncome: 0, pendingInvoices: 0 });
        return;
      }

      const filteredTransactions = transactionData.filter(t => 
        t?.currency === selectedCurrency && 
        t?.amount && 
        typeof t.amount === 'number'
      );

      const revenue = filteredTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      const expenses = filteredTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      const pendingCount = invoices.filter(inv => inv?.status === 'pending' || inv?.status === 'sent').length;

      setMetrics({
        totalRevenue: revenue,
        totalExpenses: expenses,
        netIncome: revenue - expenses,
        pendingInvoices: pendingCount
      });

      // SAFE GROWTH CALCULATION
      setRevenueGrowth(revenue > 0 ? 15.2 : 0); // Placeholder - implement actual growth calculation
      setExpenseGrowth(expenses > 0 ? -8.5 : 0); // Placeholder - implement actual growth calculation

    } catch (error) {
      console.error('Metrics calculation error:', error?.message || 'Unknown error');
      setMetrics({ totalRevenue: 0, totalExpenses: 0, netIncome: 0, pendingInvoices: 0 });
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await loadDashboardData();
    } catch (error) {
      console.error('Refresh error:', error?.message || 'Unknown error');
    } finally {
      setRefreshing(false);
    }
  };

  const refreshDashboard = () => {
    loadDashboardData();
  };

  // SAFE RECENT TRANSACTIONS
  const recentTransactions = React.useMemo(() => {
    try {
      return Array.isArray(transactions) 
        ? transactions
            .filter(t => t?.currency === selectedCurrency)
            .slice(0, 5)
        : [];
    } catch (error) {
      console.error('Recent transactions error:', error?.message || 'Unknown error');
      return [];
    }
  }, [transactions, selectedCurrency]);

  return (
    <OptimizedPageWrapper pageName="Dashboard" className="dashboard-container">
      {/* Desktop Dashboard - Hidden on mobile */}
      <div className="desktop-dashboard hidden md:block">
        <div className="space-y-8 w-full">
          <style jsx>{`
            .dashboard-page {
              width: 100%;
              min-height: 100vh;
              padding: 2rem;
              background: linear-gradient(135deg, 
                #0f172a 0%,
                #1e293b 25%,
                #334155 50%,
                #1e293b 75%,
                #0f172a 100%
              );
            }
            
            .dashboard-container {
              width: 100%;
              min-height: 100vh;
              padding: 2rem;
            }

            .financial-command-center-title {
              background: linear-gradient(45deg, #8b5cf6, #06b6d4, #10b981);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              font-size: 3rem;
              font-weight: 900;
              text-align: center;
              margin-bottom: 0.5rem;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 1rem;
            }
            
            .financial-subtitle {
              color: #94a3b8;
              text-align: center;
              font-size: 1.2rem;
              margin-bottom: 3rem;
            }
            
            .rocket-emoji {
              font-size: 3rem;
              animation: rocketFloat 3s ease-in-out infinite;
            }
            
            @keyframes rocketFloat {
              0%, 100% { transform: translateY(0px) rotate(-5deg); }
              50% { transform: translateY(-10px) rotate(5deg); }
            }
          `}</style>

          {/* Beautiful Title */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <h1 className="financial-command-center-title">
              <span className="rocket-emoji">🚀</span>
              Financial Command Center
            </h1>
            <p className="financial-subtitle">
              Your business intelligence hub powered by advanced AI
            </p>
          </motion.div>

          {/* Header Controls - FULL WIDTH */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 p-4 rounded-xl bg-gray-900 border border-gray-800 w-full"
          >
            <div>
              <p className="text-gray-400 text-sm flex items-center gap-2">
                {company?.company_name ? `${company.company_name} • ` : ''}Real-time financial intelligence in {selectedCurrency}
                {alertCount > 0 && (
                  <Badge className="bg-red-800 text-red-200 animate-pulse">
                    {alertCount} Alert{alertCount > 1 ? 's' : ''}
                  </Badge>
                )}
              </p>
            </div>

            <div className="flex gap-3 items-center flex-wrap">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-40 bg-gray-800 border-gray-700 text-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="current_month">This Month</SelectItem>
                  <SelectItem value="last_month">Last Month</SelectItem>
                  <SelectItem value="last_3_months">Last 3 Months</SelectItem>
                  <SelectItem value="ytd">Year to Date</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                <SelectTrigger className="w-24 bg-gray-800 border-gray-700 text-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
                  {CURRENCIES.map(curr => (
                    <SelectItem key={curr} value={curr}>{curr}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                disabled={refreshing}
                className="bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>
              
              <Button
                onClick={() => setShowQuickAdd(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Quick Add
              </Button>
            </div>
          </motion.div>

          {/* Main Dashboard Grid - FULL WIDTH */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
            {/* Left Column - Metrics - FULL WIDTH */}
            <div className="lg:col-span-2 space-y-8 w-full">
              {/* Metric Cards - FULL WIDTH */}
              <div className="w-full">
                <MetricCardsGrid
                  metrics={metrics}
                  defaultCurrency={defaultCurrency}
                  revenueGrowth={revenueGrowth}
                  expenseGrowth={expenseGrowth}
                  createPageUrl={createPageUrl}
                />
              </div>

              {/* Cash Flow Chart - FULL WIDTH */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="w-full"
              >
                <Card className="bg-gray-900 border-gray-700 w-full">
                  <div className="p-6 w-full">
                    <CashFlowChart
                      transactions={transactions}
                      currency={defaultCurrency}
                      timeRange={chartTimeRange}
                    />
                  </div>
                </Card>
              </motion.div>

              {/* Recent Transactions and Budget Overview - FULL WIDTH */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="w-full"
                >
                  <Card className="bg-gray-900 border-gray-700 w-full">
                    <div className="p-6 w-full">
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                        <Receipt className="w-6 h-6 text-cyan-400" />
                        Recent Transactions
                      </h3>
                      <div className="max-h-96 overflow-y-auto w-full">
                        <TransactionList
                          transactions={recentTransactions}
                          isLoading={isLoading}
                          currency={defaultCurrency}
                          showDateRange={false}
                          showQuickActions={false}
                        />
                      </div>
                    </div>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="w-full"
                >
                  <Card className="bg-gray-900 border-gray-700 w-full">
                    <div className="p-6 w-full">
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                        <Target className="w-6 h-6 text-green-400" />
                        Budget Overview
                      </h3>
                      <div className="max-h-96 overflow-y-auto w-full">
                        <BudgetOverview
                          budgets={budgets}
                          transactions={transactions}
                          currency={defaultCurrency}
                        />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </div>
            </div>

            {/* Right Sidebar - FULL WIDTH */}
            <div className="lg:col-span-1 space-y-8 w-full">
              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="bg-gray-900 border-gray-700">
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                      <Zap className="w-6 h-6 text-yellow-400" />
                      Quick Actions
                    </h3>
                    <div className="space-y-4">
                      <Button
                        className="w-full justify-start bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                        onClick={() => setShowQuickAdd(true)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Transaction
                      </Button>

                      <Link to={createPageUrl("Invoices") + "?new=true"} className="block">
                        <Button className="w-full justify-start bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white">
                          <FileText className="w-4 h-4 mr-2" />
                          Create Invoice
                        </Button>
                      </Link>

                      <Link to={createPageUrl("Clients") + "?new=true"} className="block">
                        <Button className="w-full justify-start bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white">
                          <Users className="w-4 h-4 mr-2" />
                          Add Client
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Financial Alerts Widget */}
              <FinancialAlertsWidget
                alerts={financialAlerts}
                createPageUrlProp={createPageUrl}
                loadDashboardDataProp={refreshDashboard}
              />

              {/* Quick Access Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="grid grid-cols-2 gap-4"
              >
                <Link to={createPageUrl("TaxReports")}>
                  <Card className="bg-gray-900 border-gray-700 hover:shadow-lg transition-all cursor-pointer group">
                    <CardContent className="p-6 text-center">
                      <Calculator className="w-8 h-8 mx-auto mb-3 text-indigo-400 group-hover:scale-110 transition-transform" />
                      <h3 className="font-semibold text-gray-200">Tax Reports</h3>
                      <p className="text-sm text-gray-400">Stay compliant</p>
                    </CardContent>
                  </Card>
                </Link>

                <Link to={createPageUrl("Forecasting")}>
                  <Card className="bg-gray-900 border-gray-700 hover:shadow-lg transition-all cursor-pointer group">
                    <CardContent className="p-6 text-center">
                      <BarChart3 className="w-8 h-8 mx-auto mb-3 text-green-400 group-hover:scale-110 transition-transform" />
                      <h3 className="font-semibold text-gray-200">Forecasting</h3>
                      <p className="text-sm text-gray-400">Plan ahead</p>
                    </CardContent>
                  </Card>
                </Link>

                <Link to={createPageUrl("Analytics")}>
                  <Card className="bg-gray-900 border-gray-700 hover:shadow-lg transition-all cursor-pointer group">
                    <CardContent className="p-6 text-center">
                      <TrendingUp className="w-8 h-8 mx-auto mb-3 text-red-400 group-hover:scale-110 transition-transform" />
                      <h3 className="font-semibold text-gray-200">Analytics</h3>
                      <p className="text-sm text-gray-400">Deep insights</p>
                    </CardContent>
                  </Card>
                </Link>

                <Link to={createPageUrl("Settings")}>
                  <Card className="bg-gray-900 border-gray-700 hover:shadow-lg transition-all cursor-pointer group">
                    <CardContent className="p-6 text-center">
                      <Building2 className="w-8 h-8 mx-auto mb-3 text-purple-400 group-hover:scale-110 transition-transform" />
                      <h3 className="font-semibold text-gray-200">Settings</h3>
                      <p className="text-sm text-gray-400">Configure app</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Dashboard */}
      <div className="md:hidden">
        <MobileOptimizedDashboard
          transactions={transactions}
          invoices={invoices}
          budgets={budgets}
          isLoading={isLoading}
          selectedCurrency={selectedCurrency}
          onRefresh={handleRefresh}
          financialAlerts={financialAlerts}
        />
      </div>

      {/* Quick Add Modal */}
      {showQuickAdd && (
        <QuickAddModal
          isOpen={showQuickAdd}
          onClose={() => setShowQuickAdd(false)}
          onTransactionAdded={refreshDashboard}
          defaultCurrency={selectedCurrency}
        />
      )}
    </OptimizedPageWrapper>
  );
}
