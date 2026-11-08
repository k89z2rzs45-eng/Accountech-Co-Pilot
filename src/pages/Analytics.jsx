
import React, { useState, useEffect } from "react";
import { Transaction } from "@/api/entities";
import { Invoice } from "@/api/entities";
import { Budget } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import {
  TrendingUp,
  DollarSign,
  Calendar,
  Target,
  Download,
  RefreshCw,
  Brain,
  Trash2,
  Sparkles,
  Zap,
  Star
} from "lucide-react";
import { format, subDays, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { motion } from "framer-motion";

import RevenueAnalysis from "../components/analytics/RevenueAnalysis";
import ExpenseBreakdown from "../components/analytics/ExpenseBreakdown";
import ProfitabilityChart from "../components/analytics/ProfitabilityChart";

import { User } from "@/api/entities";
import { detectDefaultCurrency } from "@/components/utils/currency";

import { AnalyticsReport } from "@/api/entities";
import { InvokeLLM } from "@/api/integrations";
import { Badge } from "@/components/ui/badge";

export default function Analytics() {
  const [transactions, setTransactions] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("6months");
  const [aiInsights, setAiInsights] = useState(null);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [defaultCurrency, setDefaultCurrency] = useState("USD");
  const [savedReports, setSavedReports] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    (async () => {
      const me = await User.me().catch(() => null);
      const auto = detectDefaultCurrency({ userCountry: me?.country, userPreferred: me?.preferred_currency });
      setDefaultCurrency(auto || "USD");
    })();
  }, []);

  useEffect(() => {
    loadSavedReports();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [transactionData, invoiceData, budgetData] = await Promise.all([
        Transaction.list('-date', 1000),
        Invoice.list('-created_date', 200),
        Budget.list('-created_date', 50)
      ]);
      setTransactions(transactionData);
      setInvoices(invoiceData);
      setBudgets(budgetData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setIsLoading(false);
  };

  const loadSavedReports = async () => {
    try {
      const reports = await AnalyticsReport.list('-created_date', 20);
      setSavedReports(reports);
    } catch (error) {
      console.error('Error loading saved reports:', error);
    }
  };
  
  const handleDeleteReport = async (report) => {
    if (confirm(`Are you sure you want to delete the report "${report.report_name}"? This is permanent.`)) {
      try {
        await AnalyticsReport.delete(report.id);
        await loadSavedReports();
      } catch (error) {
        console.error('Error deleting report:', error);
        alert('Error deleting report. Please try again.');
      }
    }
  };

  const generateAIInsights = async () => {
    setIsGeneratingInsights(true);
    setAiInsights(null); // Clear previous insights
    try {
      const filteredTransactions = getFilteredTransactions();

      // Ensure invoices and budgets are also filtered by the selected currency if applicable
      const filteredInvoices = invoices.filter(i => i.currency === defaultCurrency);
      const filteredBudgets = budgets.filter(b => (b.currency || 'USD') === defaultCurrency); // Assuming USD as default if currency isn't set on budget

      // Use Core integration directly instead of custom function
      const user = await User.me();
      const country = user.country || 'US';

      const analysis = await InvokeLLM({
        prompt: `As a business analyst expert in ${country} markets, analyze this financial data:

        BUSINESS PERFORMANCE DATA:
        - Country: ${country}
        - Currency: ${defaultCurrency}
        - Analysis Period: ${timeRange}
        - Total Transactions: ${filteredTransactions.length}
        - Revenue Transactions: ${filteredTransactions.filter(t => t.type === 'income').length}
        - Expense Transactions: ${filteredTransactions.filter(t => t.type === 'expense').length}
        - Outstanding Invoices: ${filteredInvoices.length}
        - Total Revenue: ${filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)} ${defaultCurrency}
        - Total Expenses: ${filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)} ${defaultCurrency}

        Provide comprehensive analysis including:
        1. Financial health assessment for ${country} market
        2. Industry benchmarking and competitive positioning
        3. Current news and economic trends impact
        4. Regulatory compliance considerations for ${country}
        5. Strategic growth recommendations
        6. Cash flow optimization strategies
        7. Risk assessment and mitigation plans`,

        add_context_from_internet: true,

        response_json_schema: {
          type: "object",
          properties: {
            key_metrics: {
              type: "object",
              properties: {
                total_revenue: { type: "number" },
                total_expenses: { type: "number" },
                net_income: { type: "number" },
                profit_margin: { type: "number" },
                growth_rate: { type: "number" }
              }
            },
            ai_insights: { type: "array", items: { type: "string" } },
            performance_analysis: { type: "string" },
            market_comparison: { type: "string" },
            strategic_recommendations: { type: "array", items: { type: "string" } },
            risk_assessment: { type: "array", items: { type: "string" } },
            compliance_notes: { type: "array", items: { type: "string" } },
            news_impact: { type: "array", items: { type: "string" } },
            confidence_score: { type: "number", minimum: 0, maximum: 100 }
          },
          required: ["key_metrics", "confidence_score"]
        }
      });

      setAiInsights(analysis);

      // Try to save the report directly using the entity
      try {
        await AnalyticsReport.create({
          report_name: `Analytics Report ${new Date().toLocaleDateString()}`,
          report_type: "comprehensive",
          analysis_period: timeRange,
          country: country,
          currency: defaultCurrency,
          status: "generated",
          ...analysis // Spread the AI-generated analysis data
        });
        loadSavedReports(); // Reload to show new saved report
      } catch (saveError) {
        console.error('Error saving analytics report:', saveError);
        // Continue even if saving fails - user still gets the analysis
      }

    } catch (error) {
      console.error('Error generating AI insights:', error);
      alert('Error generating insights. Please try again or check your network connection.');
    }
    setIsGeneratingInsights(false);
  };

  const exportReport = async (reportData) => {
    try {
      // Simple CSV export since reportExporter function may not exist
      const csvData = [
        ['Analytics Report Export'],
        ['Generated:', new Date().toLocaleDateString()],
        ['Currency:', defaultCurrency],
        ['Period:', timeRange],
        [''],
        ['Key Insights:']
      ];
      
      if (reportData.ai_insights) {
        reportData.ai_insights.forEach(insight => {
          csvData.push([insight]);
        });
      }
      
      const csv = csvData.map(row => row.join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics_report_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting report:', error);
      alert('Failed to export report. Please try again.');
    }
  };

  const getFilteredTransactions = () => {
    const now = new Date();
    let startDate;

    switch (timeRange) {
      case "1month":
        startDate = subDays(now, 30);
        break;
      case "3months":
        startDate = subDays(now, 90);
        break;
      case "6months":
        startDate = subDays(now, 180);
        break;
      case "1year":
        startDate = subDays(now, 365);
        break;
      default:
        startDate = subDays(now, 180);
    }

    // Filter transactions by date AND currency
    const filtered = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      const matchesDate = transactionDate >= startDate;
      const matchesCurrency = t.currency === defaultCurrency;
      return matchesDate && matchesCurrency;
    });

    return filtered;
  };

  const filteredTransactions = getFilteredTransactions();

  // Calculate key metrics
  const totalRevenue = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netIncome = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? (netIncome / totalRevenue) * 100 : 0;

  return (
    <div className="analytics-future-container">
      <style jsx>{`
        /* FUTURISTIC ANALYTICS PAGE TRANSFORMATION */
        .analytics-future-container {
          background: linear-gradient(135deg, 
            #0a0a0a 0%,
            #1a1a2e 25%,
            #16213e 50%,
            #0f0f23 75%,
            #000000 100%
          );
          background-size: 400% 400%;
          animation: cosmicFlow 20s ease infinite;
          position: relative;
          overflow: hidden;
          padding: 2rem;
          min-height: 100vh;
        }
        
        @keyframes cosmicFlow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        /* Holographic Data Grid */
        .analytics-future-container::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            linear-gradient(rgba(0, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.02) 1px, transparent 1px);
          background-size: 30px 30px;
          animation: dataGridMove 15s linear infinite;
          z-index: 1;
          pointer-events: none;
        }
        
        @keyframes dataGridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(30px, 30px); }
        }
        
        /* Future Cards */
        .analytics-card-future {
          background: linear-gradient(145deg, 
            rgba(15, 23, 42, 0.95) 0%,
            rgba(30, 41, 59, 0.9) 100%
          );
          backdrop-filter: blur(30px);
          border: 1px solid rgba(0, 255, 255, 0.3);
          border-radius: 20px;
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.4),
            0 0 60px rgba(0, 255, 255, 0.1);
          position: relative;
          overflow: hidden;
          transition: all 0.4s ease;
          z-index: 2; /* Ensure cards are above the grid */
        }
        
        .analytics-card-future:hover {
          border: 1px solid rgba(0, 255, 255, 0.6);
          box-shadow: 
            0 25px 50px rgba(0, 0, 0, 0.5),
            0 0 80px rgba(0, 255, 255, 0.2);
          transform: translateY(-4px);
        }
        
        .analytics-title {
          background: linear-gradient(45deg, #00ffff, #ff00ff, #00ff00);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-size: 3rem;
          font-weight: 900;
          text-align: center;
          margin-bottom: 1rem;
          position: relative;
          z-index: 2; /* Ensure title is above the grid */
        }
        
        .analytics-subtitle {
          color: #64748b !important;
          text-align: center;
          font-size: 1.2rem;
          margin-bottom: 2rem;
          position: relative;
          z-index: 2; /* Ensure subtitle is above the grid */
        }
        
        .metric-value-future {
          color: #f1f5f9 !important;
          font-weight: 800;
          font-size: 2rem;
          text-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
        }
        
        .metric-label-future {
          color: #94a3b8 !important;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        /* Specific AI Insights Card styling - retains its unique glow */
        .ai-insights-card {
          background: linear-gradient(145deg, 
            rgba(124, 58, 237, 0.15) 0%,
            rgba(15, 23, 42, 0.98) 25%,
            rgba(30, 41, 59, 0.96) 75%,
            rgba(124, 58, 237, 0.15) 100%
          );
          border: 2px solid rgba(124, 58, 237, 0.4);
          animation: aiGlow 6s ease-in-out infinite;
          z-index: 2; /* Ensure it's above the grid */
        }
        
        @keyframes aiGlow {
          0%, 100% {
            border-color: rgba(124, 58, 237, 0.4);
            box-shadow: 0 0 40px rgba(124, 58, 237, 0.3);
          }
          50% {
            border-color: rgba(124, 58, 237, 0.8);
            box-shadow: 0 0 80px rgba(124, 58, 237, 0.6);
          }
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="analytics-title">
          📊 Advanced Analytics
        </h1>
        <p className="analytics-subtitle">
          AI-powered insights into your financial universe
        </p>
      </motion.div>

      {/* Header and Controls */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 relative z-10"
      >
        <div className="flex gap-3 ml-auto"> {/* Aligns controls to the right */}
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white w-40 backdrop-blur-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={generateAIInsights} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300" disabled={isGeneratingInsights}>
            <Brain className="w-4 h-4 mr-2" />
            {isGeneratingInsights ? 'Analyzing...' : 'AI Analysis'}
          </Button>
          {aiInsights && (
            <Button variant="outline" onClick={() => exportReport(aiInsights)} className="bg-slate-800/50 border-slate-600 text-gray-300 hover:bg-slate-700/50 backdrop-blur-sm">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          )}
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 relative z-20"
      >
        <Card className="analytics-card-future">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl border border-green-500/30">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="metric-label-future">Total Revenue</p>
                <p className="metric-value-future">
                  ${totalRevenue.toFixed(0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="analytics-card-future">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-red-500/20 to-rose-500/20 rounded-xl border border-red-500/30">
                <TrendingUp className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <p className="metric-label-future">Total Expenses</p>
                <p className="metric-value-future">
                  ${totalExpenses.toFixed(0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="analytics-card-future">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl border border-blue-500/30">
                <Target className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="metric-label-future">Net Income</p>
                <p className="metric-value-future">
                  ${netIncome.toFixed(0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="analytics-card-future">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-purple-500/20 to-violet-500/20 rounded-xl border border-purple-500/30">
                <Calendar className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="metric-label-future">Profit Margin</p>
                <p className="metric-value-future">
                  {profitMargin.toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* AI Insights */}
      {aiInsights && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8 relative z-20"
        >
          <Card className="ai-insights-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3 text-2xl">
                <Brain className="w-8 h-8 text-purple-400" />
                🧠 Cosmic AI Intelligence
                <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {aiInsights.ai_insights && aiInsights.ai_insights.length > 0 && (
                <div>
                  <h3 className="font-semibold text-purple-300 mb-4 text-xl flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Revolutionary Insights
                  </h3>
                  <div className="grid gap-3">
                    {aiInsights.ai_insights.map((insight, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl backdrop-blur-sm"
                      >
                        <p className="text-purple-200 font-medium">{insight}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {aiInsights.confidence_score !== undefined && (
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20">
                  <span className="font-semibold text-green-300 text-lg flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    AI Confidence Score
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="w-40 h-3 bg-slate-700 rounded-full">
                      <div
                        className="h-3 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full transition-all duration-1000"
                        style={{ width: `${aiInsights.confidence_score}%` }}
                      />
                    </div>
                    <span className="font-bold text-green-300 text-xl">{aiInsights.confidence_score}%</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Charts Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="grid lg:grid-cols-2 gap-8 mb-8 relative z-20"
      >
        <Card className="analytics-card-future">
          <RevenueAnalysis
            transactions={filteredTransactions}
            timeRange={timeRange}
            isLoading={isLoading}
            currency={defaultCurrency}
          />
        </Card>
        
        <Card className="analytics-card-future">
          <ExpenseBreakdown
            transactions={filteredTransactions}
            isLoading={isLoading}
            currency={defaultCurrency}
          />
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="grid lg:grid-cols-1 gap-8 relative z-20"
      >
        <Card className="analytics-card-future">
          <ProfitabilityChart
            transactions={filteredTransactions}
            timeRange={timeRange}
            isLoading={isLoading}
            currency={defaultCurrency}
          />
        </Card>
      </motion.div>
    </div>
  );
}
