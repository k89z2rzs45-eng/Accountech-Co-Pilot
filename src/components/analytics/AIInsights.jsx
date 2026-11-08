import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Lightbulb, 
  Target, 
  DollarSign,
  BarChart3,
  RefreshCw,
  Sparkles,
  Zap,
  Eye,
  CheckCircle
} from "lucide-react";
import { analyticsEngine } from "@/api/functions";

export default function AIInsights({ 
  transactions = [], 
  invoices = [], 
  budgets = [],
  expenses = [],
  currency = "USD",
  timeRange = "last_6_months"
}) {
  const [insights, setInsights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInsight, setSelectedInsight] = useState(null);
  const [confidence, setConfidence] = useState(0);

  useEffect(() => {
    generateInsights();
  }, [transactions, invoices, budgets, expenses, currency, timeRange]);

  const generateInsights = async () => {
    setIsLoading(true);
    try {
      const response = await analyticsEngine({
        analysisType: 'comprehensive',
        dateRange: timeRange,
        currency: currency,
        includeProjections: true,
        granularity: 'monthly'
      });

      if (response.data?.success) {
        setInsights(response.data.insights || []);
        setConfidence(response.data.confidence_score || 0);
      } else {
        // Fallback to local analysis
        const localInsights = await generateLocalInsights();
        setInsights(localInsights);
        setConfidence(75);
      }
    } catch (error) {
      console.error('Error generating insights:', error);
      // Generate basic insights locally
      const localInsights = await generateLocalInsights();
      setInsights(localInsights);
      setConfidence(60);
    }
    setIsLoading(false);
  };

  const generateLocalInsights = async () => {
    const insights = [];

    // Revenue Trend Analysis
    const revenueData = transactions
      .filter(t => t.type === 'income' && t.currency === currency)
      .reduce((acc, t) => acc + (t.amount || 0), 0);

    const expenseData = transactions
      .filter(t => t.type === 'expense' && t.currency === currency)
      .reduce((acc, t) => acc + (t.amount || 0), 0);

    const profitMargin = revenueData > 0 ? ((revenueData - expenseData) / revenueData * 100) : 0;

    // Generate insights based on data patterns
    if (profitMargin > 20) {
      insights.push({
        type: 'opportunity',
        title: 'Strong Profit Margins',
        description: `Your profit margin of ${profitMargin.toFixed(1)}% is excellent. Consider reinvesting in growth opportunities.`,
        impact: 'high',
        actionable: true,
        recommendations: [
          'Expand marketing budget to scale revenue',
          'Invest in new product development',
          'Consider opening additional revenue streams'
        ]
      });
    } else if (profitMargin < 5) {
      insights.push({
        type: 'warning',
        title: 'Low Profit Margins',
        description: `Your profit margin of ${profitMargin.toFixed(1)}% is concerning. Immediate action needed.`,
        impact: 'critical',
        actionable: true,
        recommendations: [
          'Review and optimize major expense categories',
          'Negotiate better rates with suppliers',
          'Consider pricing strategy adjustments'
        ]
      });
    }

    // Expense Pattern Analysis
    const expenseCategories = transactions
      .filter(t => t.type === 'expense' && t.currency === currency)
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + (t.amount || 0);
        return acc;
      }, {});

    const topExpenseCategory = Object.entries(expenseCategories)
      .sort(([,a], [,b]) => b - a)[0];

    if (topExpenseCategory && topExpenseCategory[1] > expenseData * 0.3) {
      insights.push({
        type: 'insight',
        title: 'Expense Concentration',
        description: `${topExpenseCategory[0].replace(/_/g, ' ')} represents ${((topExpenseCategory[1] / expenseData) * 100).toFixed(1)}% of your expenses.`,
        impact: 'medium',
        actionable: true,
        recommendations: [
          `Review ${topExpenseCategory[0].replace(/_/g, ' ')} expenses for optimization`,
          'Diversify spending to reduce concentration risk',
          'Negotiate bulk discounts or better terms'
        ]
      });
    }

    // Cash Flow Insights
    const overdueInvoices = invoices.filter(i => 
      i.status === 'overdue' && i.currency === currency
    );

    if (overdueInvoices.length > 0) {
      const overdueAmount = overdueInvoices.reduce((sum, i) => sum + (i.total || 0), 0);
      insights.push({
        type: 'warning',
        title: 'Outstanding Receivables',
        description: `You have ${currency} ${overdueAmount.toFixed(2)} in overdue invoices from ${overdueInvoices.length} clients.`,
        impact: 'high',
        actionable: true,
        recommendations: [
          'Implement automated follow-up system',
          'Consider offering early payment discounts',
          'Review credit terms for chronic late payers'
        ]
      });
    }

    // Budget Performance
    budgets.forEach(budget => {
      if (budget.currency === currency) {
        const spentPercentage = (budget.spent / budget.amount) * 100;
        if (spentPercentage > 90) {
          insights.push({
            type: 'warning',
            title: `Budget Alert: ${budget.name}`,
            description: `You've spent ${spentPercentage.toFixed(1)}% of your ${budget.name} budget.`,
            impact: 'medium',
            actionable: true,
            recommendations: [
              'Monitor remaining budget closely',
              'Consider budget reallocation if needed',
              'Implement spending controls'
            ]
          });
        }
      }
    });

    // Growth Opportunities
    if (revenueData > 0 && expenses.length > 0) {
      insights.push({
        type: 'opportunity',
        title: 'Growth Potential',
        description: 'Based on your financial patterns, there are opportunities for strategic growth.',
        impact: 'high',
        actionable: true,
        recommendations: [
          'Analyze top-performing revenue streams',
          'Invest in customer acquisition',
          'Consider expanding successful product lines'
        ]
      });
    }

    return insights;
  };

  const getInsightIcon = (type) => {
    const icons = {
      opportunity: <TrendingUp className="w-5 h-5 text-green-400" />,
      warning: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
      insight: <Lightbulb className="w-5 h-5 text-blue-400" />,
      critical: <AlertTriangle className="w-5 h-5 text-red-400" />
    };
    return icons[type] || <Brain className="w-5 h-5 text-purple-400" />;
  };

  const getImpactColor = (impact) => {
    const colors = {
      low: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      medium: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      high: "bg-orange-500/20 text-orange-300 border-orange-500/30",
      critical: "bg-red-500/20 text-red-300 border-red-500/30"
    };
    return colors[impact] || colors.medium;
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-400 animate-pulse" />
            AI Business Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-gray-700/50 rounded-lg" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <style jsx>{`
        .ai-insights-container {
          background: linear-gradient(145deg, 
            rgba(15, 23, 42, 0.98) 0%,
            rgba(30, 41, 59, 0.95) 100%
          );
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 16px;
          backdrop-filter: blur(20px);
          position: relative;
          overflow: hidden;
        }
        
        .ai-insights-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, 
            transparent 30%,
            rgba(139, 92, 246, 0.05) 50%,
            transparent 70%
          );
          animation: aiGlow 4s ease-in-out infinite;
          z-index: 1;
        }
        
        @keyframes aiGlow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        
        .insight-card {
          background: linear-gradient(135deg, 
            rgba(51, 65, 85, 0.6) 0%,
            rgba(30, 41, 59, 0.4) 100%
          );
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
          z-index: 10;
        }
        
        .insight-card:hover {
          background: linear-gradient(135deg, 
            rgba(51, 65, 85, 0.8) 0%,
            rgba(30, 41, 59, 0.6) 100%
          );
          border: 1px solid rgba(139, 92, 246, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(139, 92, 246, 0.2);
        }
        
        .confidence-indicator {
          background: linear-gradient(90deg, 
            #ef4444 0%, 
            #f59e0b 25%, 
            #10b981 50%, 
            #3b82f6 75%, 
            #8b5cf6 100%
          );
          height: 4px;
          border-radius: 2px;
          position: relative;
          overflow: hidden;
        }
        
        .confidence-bar {
          background: white;
          height: 100%;
          border-radius: 2px;
          transition: width 1s ease-out;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        }
      `}</style>

      {/* Main Insights Card */}
      <Card className="ai-insights-container">
        <CardHeader className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <Brain className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div>
                <CardTitle className="text-white">AI Business Insights</CardTitle>
                <p className="text-sm text-gray-300">Powered by advanced analytics</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs text-gray-400">Confidence</div>
                <div className="text-sm font-bold text-white">{confidence}%</div>
              </div>
              <Button
                onClick={generateInsights}
                size="sm"
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
          
          {/* Confidence Indicator */}
          <div className="confidence-indicator mt-4">
            <div 
              className="confidence-bar"
              style={{ width: `${confidence}%` }}
            />
          </div>
        </CardHeader>

        <CardContent className="relative z-10">
          {insights.length === 0 ? (
            <div className="text-center py-8">
              <Sparkles className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-300 mb-2">Generating Insights</h3>
              <p className="text-gray-500">AI is analyzing your financial data...</p>
            </div>
          ) : (
            <ScrollArea className="h-96">
              <div className="space-y-4 pr-4">
                <AnimatePresence>
                  {insights.map((insight, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="insight-card p-4"
                      onClick={() => setSelectedInsight(selectedInsight === index ? null : index)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {getInsightIcon(insight.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-white">{insight.title}</h4>
                            <Badge className={getImpactColor(insight.impact)}>
                              {insight.impact?.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-gray-300 mb-3">{insight.description}</p>
                          
                          {selectedInsight === index && insight.recommendations && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="border-t border-gray-600 pt-3 mt-3"
                            >
                              <h5 className="font-medium text-white mb-2 flex items-center gap-2">
                                <Target className="w-4 h-4 text-green-400" />
                                Recommended Actions:
                              </h5>
                              <ul className="space-y-1">
                                {insight.recommendations.map((rec, i) => (
                                  <li key={i} className="text-sm text-gray-400 flex items-center gap-2">
                                    <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
                                    {rec}
                                  </li>
                                ))}
                              </ul>
                            </motion.div>
                          )}
                        </div>
                        <div className="ml-2">
                          <Eye className="w-4 h-4 text-gray-500" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions Based on Insights */}
      <Card className="ai-insights-container">
        <CardHeader className="relative z-10">
          <CardTitle className="text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white justify-start p-4 h-auto">
              <div className="text-left">
                <div className="font-semibold">Review Expenses</div>
                <div className="text-xs opacity-80">Optimize spending patterns</div>
              </div>
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white justify-start p-4 h-auto">
              <div className="text-left">
                <div className="font-semibold">Follow Up Invoices</div>
                <div className="text-xs opacity-80">Improve cash flow</div>
              </div>
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white justify-start p-4 h-auto">
              <div className="text-left">
                <div className="font-semibold">Plan Growth</div>
                <div className="text-xs opacity-80">Strategic opportunities</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}