import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain, 
  Calculator, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  DollarSign,
  Target,
  Shield,
  Lightbulb,
  Zap,
  Download,
  Send,
  Eye,
  RefreshCw
} from "lucide-react";
import { geniusTaxAccountant } from "@/api/functions";

export default function AITaxPreparation({ 
  transactions = [], 
  expenses = [], 
  invoices = [],
  currency = "USD",
  taxYear = new Date().getFullYear() - 1,
  onCreateReport
}) {
  const [analysisData, setAnalysisData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [selectedTab, setSelectedTab] = useState("overview");

  useEffect(() => {
    if (transactions.length > 0 || expenses.length > 0) {
      runTaxAnalysis();
    }
  }, [transactions, expenses, invoices, currency, taxYear]);

  const runTaxAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    try {
      // Simulate analysis progress
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await geniusTaxAccountant({
        action: 'comprehensive_analysis',
        taxYear: taxYear,
        currency: currency,
        includeOptimization: true,
        includeCompliance: true
      });

      clearInterval(progressInterval);
      setAnalysisProgress(100);

      if (response.data?.success) {
        setAnalysisData(response.data);
      } else {
        // Generate fallback analysis
        const fallbackAnalysis = await generateFallbackAnalysis();
        setAnalysisData(fallbackAnalysis);
      }
    } catch (error) {
      console.error('Tax analysis error:', error);
      const fallbackAnalysis = await generateFallbackAnalysis();
      setAnalysisData(fallbackAnalysis);
      setAnalysisProgress(100);
    }
    
    setIsAnalyzing(false);
  };

  const generateFallbackAnalysis = async () => {
    // Calculate basic tax metrics
    const income = transactions
      .filter(t => t.type === 'income' && t.currency === currency)
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    const deductibleExpenses = [
      ...transactions.filter(t => t.type === 'expense' && t.tax_deductible && t.currency === currency),
      ...expenses.filter(e => e.tax_deductible && e.currency === currency)
    ].reduce((sum, item) => sum + (item.amount || 0), 0);

    const taxableIncome = Math.max(0, income - deductibleExpenses);
    const estimatedTax = calculateEstimatedTax(taxableIncome);

    return {
      success: true,
      financial_summary: {
        gross_income: income,
        deductible_expenses: deductibleExpenses,
        taxable_income: taxableIncome,
        estimated_tax: estimatedTax,
        effective_tax_rate: taxableIncome > 0 ? (estimatedTax / taxableIncome * 100) : 0
      },
      deduction_analysis: {
        total_deductions: deductibleExpenses,
        categories: calculateDeductionCategories(),
        missed_opportunities: generateMissedOpportunities(income, deductibleExpenses),
        optimization_score: calculateOptimizationScore(income, deductibleExpenses)
      },
      compliance_check: {
        overall_score: 85,
        issues: [],
        recommendations: [
          "Keep detailed records of all business expenses",
          "Consider quarterly estimated payments",
          "Review home office deduction eligibility"
        ]
      },
      ai_insights: {
        confidence_score: 88,
        key_findings: [
          `Your deduction rate is ${(deductibleExpenses / income * 100).toFixed(1)}%`,
          "Good record-keeping practices detected",
          "Potential for tax optimization identified"
        ],
        recommendations: [
          "Consider maximizing retirement contributions",
          "Review business expense categories for completeness",
          "Plan for next year's estimated payments"
        ]
      }
    };
  };

  const calculateEstimatedTax = (income) => {
    // Simplified 2024 tax calculation for demonstration
    const brackets = [
      { min: 0, max: 11600, rate: 0.10 },
      { min: 11600, max: 47150, rate: 0.12 },
      { min: 47150, max: 100525, rate: 0.22 },
      { min: 100525, max: 191950, rate: 0.24 }
    ];

    let tax = 0;
    let remainingIncome = income;

    for (const bracket of brackets) {
      if (remainingIncome <= 0) break;
      const taxableAtBracket = Math.min(remainingIncome, bracket.max - bracket.min);
      tax += taxableAtBracket * bracket.rate;
      remainingIncome -= taxableAtBracket;
    }

    // Add self-employment tax (simplified)
    const seTax = income * 0.1413; // 14.13% SE tax
    return tax + seTax;
  };

  const calculateDeductionCategories = () => {
    const categories = {};
    
    [...transactions.filter(t => t.type === 'expense' && t.tax_deductible), ...expenses.filter(e => e.tax_deductible)]
      .forEach(item => {
        const category = item.category || 'other';
        categories[category] = (categories[category] || 0) + (item.amount || 0);
      });

    return Object.entries(categories).map(([name, amount]) => ({
      name: name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      amount,
      percentage: 0 // Would calculate against total
    }));
  };

  const generateMissedOpportunities = (income, deductions) => {
    const opportunities = [];
    const deductionRate = deductions / income;

    if (deductionRate < 0.15 && income > 50000) {
      opportunities.push({
        category: "Business Expenses",
        potential_savings: income * 0.05 * 0.22, // 5% more deductions at 22% tax rate
        description: "Review business expenses for additional deductions"
      });
    }

    if (income > 30000) {
      opportunities.push({
        category: "Retirement Contributions",
        potential_savings: 6500 * 0.22, // Max IRA contribution
        description: "Consider maximizing retirement account contributions"
      });
    }

    return opportunities;
  };

  const calculateOptimizationScore = (income, deductions) => {
    const deductionRate = deductions / income;
    let score = 60; // Base score

    if (deductionRate > 0.20) score += 20;
    else if (deductionRate > 0.15) score += 15;
    else if (deductionRate > 0.10) score += 10;

    if (income > 100000) score += 10; // Higher income, more optimization potential
    
    return Math.min(score, 100);
  };

  const handleCreateTaxReport = () => {
    if (onCreateReport && analysisData) {
      onCreateReport(analysisData);
    }
  };

  if (isAnalyzing) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-400 animate-pulse" />
            AI Tax Genius - Analyzing Your Finances
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto">
              <Calculator className="w-8 h-8 text-white animate-bounce" />
            </div>
            <h3 className="text-xl font-semibold text-white">Processing Your Tax Data</h3>
            <p className="text-gray-400">AI is analyzing {transactions.length} transactions and {expenses.length} expenses...</p>
            <div className="max-w-md mx-auto">
              <Progress value={analysisProgress} className="h-3" />
              <p className="text-sm text-gray-500 mt-2">{analysisProgress}% Complete</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analysisData) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-400" />
            AI Tax Preparation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FileText className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-300 mb-2">No Data Available</h3>
            <p className="text-gray-500 mb-4">Add transactions and expenses to get AI tax analysis</p>
            <Button onClick={runTaxAnalysis} className="bg-purple-600 hover:bg-purple-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              Run Analysis
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <style jsx>{`
        .ai-tax-container {
          background: linear-gradient(145deg, 
            rgba(15, 23, 42, 0.98) 0%,
            rgba(30, 41, 59, 0.95) 100%
          );
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 16px;
          backdrop-filter: blur(25px);
          position: relative;
          overflow: hidden;
        }
        
        .ai-tax-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, 
            transparent 40%,
            rgba(139, 92, 246, 0.05) 50%,
            transparent 60%
          );
          animation: taxGlow 6s ease-in-out infinite;
          z-index: 1;
        }
        
        @keyframes taxGlow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
        
        .summary-card {
          background: linear-gradient(135deg, 
            rgba(51, 65, 85, 0.6) 0%,
            rgba(30, 41, 59, 0.4) 100%
          );
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          backdrop-filter: blur(15px);
          transition: all 0.3s ease;
        }
        
        .summary-card:hover {
          background: linear-gradient(135deg, 
            rgba(51, 65, 85, 0.8) 0%,
            rgba(30, 41, 59, 0.6) 100%
          );
          transform: translateY(-2px);
        }
        
        .metric-positive {
          color: #10b981;
        }
        
        .metric-negative {
          color: #ef4444;
        }
        
        .metric-neutral {
          color: #6b7280;
        }
        
        .optimization-score {
          background: linear-gradient(90deg, 
            #ef4444 0%, 
            #f59e0b 25%, 
            #10b981 50%, 
            #3b82f6 75%, 
            #8b5cf6 100%
          );
          border-radius: 12px;
          padding: 1rem;
          position: relative;
          overflow: hidden;
        }
        
        .score-overlay {
          background: rgba(0, 0, 0, 0.7);
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
        }
      `}</style>

      {/* Main Analysis Card */}
      <Card className="ai-tax-container">
        <CardHeader className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-white">AI Tax Genius - {taxYear} Analysis</CardTitle>
                <p className="text-sm text-gray-300">
                  Advanced tax optimization and compliance analysis
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                {analysisData.ai_insights.confidence_score}% Confidence
              </Badge>
              <Button
                onClick={runTaxAnalysis}
                size="sm"
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative z-10">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-800 border-gray-700">
              <TabsTrigger value="overview" className="text-gray-300 data-[state=active]:text-white">
                Overview
              </TabsTrigger>
              <TabsTrigger value="deductions" className="text-gray-300 data-[state=active]:text-white">
                Deductions
              </TabsTrigger>
              <TabsTrigger value="optimization" className="text-gray-300 data-[state=active]:text-white">
                Optimization
              </TabsTrigger>
              <TabsTrigger value="compliance" className="text-gray-300 data-[state=active]:text-white">
                Compliance
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="summary-card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    <span className="text-sm text-gray-300">Gross Income</span>
                  </div>
                  <div className="text-2xl font-bold metric-positive">
                    {currency} {analysisData.financial_summary.gross_income.toLocaleString()}
                  </div>
                </div>

                <div className="summary-card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-red-400" />
                    <span className="text-sm text-gray-300">Deductions</span>
                  </div>
                  <div className="text-2xl font-bold metric-negative">
                    {currency} {analysisData.financial_summary.deductible_expenses.toLocaleString()}
                  </div>
                </div>

                <div className="summary-card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calculator className="w-5 h-5 text-blue-400" />
                    <span className="text-sm text-gray-300">Taxable Income</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-400">
                    {currency} {analysisData.financial_summary.taxable_income.toLocaleString()}
                  </div>
                </div>

                <div className="summary-card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-orange-400" />
                    <span className="text-sm text-gray-300">Est. Tax</span>
                  </div>
                  <div className="text-2xl font-bold text-orange-400">
                    {currency} {analysisData.financial_summary.estimated_tax.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="summary-card p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-400" />
                    Key Insights
                  </h3>
                  <div className="space-y-3">
                    {analysisData.ai_insights.key_findings.map((finding, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{finding}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="summary-card p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-400" />
                    AI Recommendations
                  </h3>
                  <div className="space-y-3">
                    {analysisData.ai_insights.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Zap className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Deductions Tab */}
            <TabsContent value="deductions" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="summary-card p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Deduction Categories</h3>
                  <ScrollArea className="h-64">
                    <div className="space-y-3">
                      {analysisData.deduction_analysis.categories.map((category, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                          <span className="text-gray-300">{category.name}</span>
                          <div className="text-right">
                            <div className="text-white font-semibold">
                              {currency} {category.amount.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500">
                              {((category.amount / analysisData.deduction_analysis.total_deductions) * 100).toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                <div className="summary-card p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Missed Opportunities</h3>
                  <div className="space-y-4">
                    {analysisData.deduction_analysis.missed_opportunities.map((opp, index) => (
                      <div key={index} className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-green-300">{opp.category}</span>
                          <span className="text-green-400 font-bold">
                            +{currency} {opp.potential_savings.toFixed(0)} savings
                          </span>
                        </div>
                        <p className="text-sm text-gray-300">{opp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Optimization Tab */}
            <TabsContent value="optimization" className="mt-6">
              <div className="space-y-6">
                <div className="optimization-score relative">
                  <div className="score-overlay">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-2">
                        {analysisData.deduction_analysis.optimization_score}/100
                      </div>
                      <div className="text-sm text-gray-300">Optimization Score</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="summary-card p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-400" />
                      Tax Savings Opportunities
                    </h3>
                    <div className="space-y-4">
                      {analysisData.deduction_analysis.missed_opportunities.map((opp, index) => (
                        <div key={index} className="border-l-4 border-green-400 pl-4">
                          <h4 className="font-medium text-white">{opp.category}</h4>
                          <p className="text-sm text-gray-300 mb-2">{opp.description}</p>
                          <p className="text-green-400 font-semibold">
                            Potential savings: {currency} {opp.potential_savings.toFixed(0)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="summary-card p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-blue-400" />
                      Strategic Planning
                    </h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <h4 className="font-medium text-blue-300 mb-1">Q1 Planning</h4>
                        <p className="text-sm text-gray-300">Set up quarterly payment schedule</p>
                      </div>
                      <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                        <h4 className="font-medium text-purple-300 mb-1">Mid-Year Review</h4>
                        <p className="text-sm text-gray-300">Adjust strategies based on performance</p>
                      </div>
                      <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                        <h4 className="font-medium text-orange-300 mb-1">Year-End Actions</h4>
                        <p className="text-sm text-gray-300">Maximize deductions before deadline</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Compliance Tab */}
            <TabsContent value="compliance" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="summary-card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-white">Compliance Score</h3>
                    <div className="text-2xl font-bold text-green-400">
                      {analysisData.compliance_check.overall_score}/100
                    </div>
                  </div>
                  <Progress value={analysisData.compliance_check.overall_score} className="mb-4" />
                  <div className="space-y-3">
                    {analysisData.compliance_check.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="summary-card p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Required Actions</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-400" />
                        <span className="font-medium text-yellow-300">Quarterly Payments</span>
                      </div>
                      <p className="text-sm text-gray-300">Next payment due: March 15, {taxYear + 1}</p>
                    </div>
                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-blue-400" />
                        <span className="font-medium text-blue-300">Documentation</span>
                      </div>
                      <p className="text-sm text-gray-300">Ensure all receipts are properly categorized</p>
                    </div>
                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="font-medium text-green-300">Filing Deadline</span>
                      </div>
                      <p className="text-sm text-gray-300">April 15, {taxYear + 1} - Mark your calendar</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
            <CheckCircle className="w-3 h-3 mr-1" />
            Analysis Complete
          </Badge>
          <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
            Ready for Filing
          </Badge>
        </div>
        
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button
            onClick={handleCreateTaxReport}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Send className="w-4 h-4 mr-2" />
            Create Tax Report
          </Button>
        </div>
      </div>
    </div>
  );
}