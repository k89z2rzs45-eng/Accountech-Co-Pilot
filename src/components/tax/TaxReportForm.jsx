import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { Save, X, FileText, Calculator, AlertTriangle, CheckCircle, Brain, DollarSign, Calendar } from "lucide-react";

const REPORT_TYPES = ["quarterly", "annual", "monthly", "custom", "amended", "estimated"];
const BUSINESS_STRUCTURES = ["sole_proprietorship", "partnership", "llc", "s_corp", "c_corp"];
const CURRENCIES = ["USD", "GBP", "CAD", "EUR", "MMK", "JPY", "CNY", "INR", "SGD", "THB", "KRW"];

export default function TaxReportForm({ 
  report, 
  onSubmit, 
  onCancel, 
  onDelete,
  transactions = [],
  expenses = [],
  defaultCurrency = "USD" 
}) {
  const [formData, setFormData] = useState(report || {
    report_id: `TAX-${Date.now().toString().slice(-6)}`,
    report_name: "",
    report_type: "annual",
    tax_year: new Date().getFullYear(),
    filing_period: {
      start_date: `${new Date().getFullYear()}-01-01`,
      end_date: `${new Date().getFullYear()}-12-31`,
      quarter: "Q4",
      due_date: `${new Date().getFullYear() + 1}-04-15`
    },
    jurisdiction: {
      country: "US",
      state: "",
      tax_authority: "IRS",
      business_structure: "sole_proprietorship",
      tax_id: "",
      registration_numbers: []
    },
    currency: defaultCurrency,
    financial_summary: {
      gross_revenue: 0,
      cost_of_goods_sold: 0,
      gross_profit: 0,
      total_deductible_expenses: 0,
      depreciation: 0,
      home_office_deduction: 0,
      business_use_of_home: 0,
      net_business_income: 0,
      self_employment_income: 0,
      estimated_tax_payments: 0,
      withholding_tax: 0,
      other_income: []
    },
    tax_calculations: {
      taxable_income: 0,
      income_tax: 0,
      self_employment_tax: 0,
      alternative_minimum_tax: 0,
      total_tax_liability: 0,
      tax_credits: [],
      penalties_interest: 0,
      refund_owed: 0,
      amount_due: 0,
      effective_tax_rate: 0,
      marginal_tax_rate: 0
    },
    deductions_breakdown: [],
    forms_schedules: [],
    compliance_checklist: [],
    ai_insights: {
      tax_optimization_opportunities: [],
      audit_risk_assessment: {
        risk_level: "low",
        risk_factors: [],
        mitigation_strategies: []
      },
      deduction_recommendations: [],
      estimated_payments_guidance: "",
      year_end_planning: [],
      industry_benchmarking: {
        industry_average_deductions: 0,
        your_deduction_percentage: 0,
        comparison_notes: ""
      },
      confidence_score: 0
    },
    status_tracking: {
      preparation_status: "draft",
      review_status: "pending",
      filing_status: "not_filed",
      payment_status: "not_due",
      last_updated: new Date().toISOString(),
      filed_date: "",
      acceptance_date: "",
      confirmation_number: ""
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calculationProgress, setCalculationProgress] = useState(0);
  const [aiAnalysisComplete, setAiAnalysisComplete] = useState(false);

  useEffect(() => {
    if (report) {
      setFormData({
        ...report,
        filing_period: {
          ...report.filing_period,
          start_date: report.filing_period?.start_date || `${new Date().getFullYear()}-01-01`,
          end_date: report.filing_period?.end_date || `${new Date().getFullYear()}-12-31`
        }
      });
    }
  }, [report]);

  // Auto-calculate financial summary when transactions/expenses change
  useEffect(() => {
    calculateFinancialSummary();
  }, [transactions, expenses, formData.currency]);

  const handleChange = (field, value) => {
    if (field.includes('.')) {
      const fields = field.split('.');
      setFormData(prev => {
        const updated = { ...prev };
        let current = updated;
        for (let i = 0; i < fields.length - 1; i++) {
          current[fields[i]] = { ...current[fields[i]] };
          current = current[fields[i]];
        }
        current[fields[fields.length - 1]] = value;
        return updated;
      });
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const calculateFinancialSummary = async () => {
    setCalculationProgress(10);
    
    // Filter data by currency and date range
    const filteredTransactions = transactions.filter(t => 
      t.currency === formData.currency &&
      t.date >= formData.filing_period.start_date &&
      t.date <= formData.filing_period.end_date
    );
    
    const filteredExpenses = expenses.filter(e => 
      e.currency === formData.currency &&
      e.date >= formData.filing_period.start_date &&
      e.date <= formData.filing_period.end_date
    );

    setCalculationProgress(30);

    // Calculate revenue
    const grossRevenue = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    // Calculate deductible expenses
    const totalDeductibleExpenses = [
      ...filteredTransactions.filter(t => t.type === 'expense' && t.tax_deductible),
      ...filteredExpenses.filter(e => e.tax_deductible)
    ].reduce((sum, item) => sum + (item.amount || 0), 0);

    setCalculationProgress(60);

    // Calculate derived values
    const netBusinessIncome = grossRevenue - totalDeductibleExpenses;
    const selfEmploymentTax = netBusinessIncome > 0 ? netBusinessIncome * 0.1413 : 0; // Simplified SE tax
    const incomeTax = calculateIncomeTax(netBusinessIncome);
    
    setCalculationProgress(80);

    // Update financial summary
    const updatedSummary = {
      gross_revenue: grossRevenue,
      cost_of_goods_sold: 0, // Would need specific COGS data
      gross_profit: grossRevenue,
      total_deductible_expenses: totalDeductibleExpenses,
      depreciation: 0, // Would need depreciation schedule
      home_office_deduction: 0, // Would need home office data
      business_use_of_home: 0,
      net_business_income: netBusinessIncome,
      self_employment_income: netBusinessIncome,
      estimated_tax_payments: 0,
      withholding_tax: 0,
      other_income: []
    };

    const updatedTaxCalculations = {
      taxable_income: netBusinessIncome,
      income_tax: incomeTax,
      self_employment_tax: selfEmploymentTax,
      alternative_minimum_tax: 0,
      total_tax_liability: incomeTax + selfEmploymentTax,
      tax_credits: [],
      penalties_interest: 0,
      refund_owed: 0,
      amount_due: incomeTax + selfEmploymentTax,
      effective_tax_rate: netBusinessIncome > 0 ? ((incomeTax + selfEmploymentTax) / netBusinessIncome * 100) : 0,
      marginal_tax_rate: getMarginalTaxRate(netBusinessIncome)
    };

    setFormData(prev => ({
      ...prev,
      financial_summary: updatedSummary,
      tax_calculations: updatedTaxCalculations
    }));

    setCalculationProgress(100);
    
    // Run AI analysis
    setTimeout(() => {
      runAIAnalysis(updatedSummary, updatedTaxCalculations);
    }, 500);
  };

  const calculateIncomeTax = (income) => {
    // Simplified 2024 tax brackets for single filer
    const brackets = [
      { min: 0, max: 11600, rate: 0.10 },
      { min: 11600, max: 47150, rate: 0.12 },
      { min: 47150, max: 100525, rate: 0.22 },
      { min: 100525, max: 191950, rate: 0.24 },
      { min: 191950, max: 243725, rate: 0.32 },
      { min: 243725, max: 609350, rate: 0.35 },
      { min: 609350, max: Infinity, rate: 0.37 }
    ];

    let tax = 0;
    let remainingIncome = income;

    for (const bracket of brackets) {
      if (remainingIncome <= 0) break;
      
      const taxableAtThisBracket = Math.min(remainingIncome, bracket.max - bracket.min);
      tax += taxableAtThisBracket * bracket.rate;
      remainingIncome -= taxableAtThisBracket;
    }

    return tax;
  };

  const getMarginalTaxRate = (income) => {
    const brackets = [
      { min: 0, max: 11600, rate: 10 },
      { min: 11600, max: 47150, rate: 12 },
      { min: 47150, max: 100525, rate: 22 },
      { min: 100525, max: 191950, rate: 24 },
      { min: 191950, max: 243725, rate: 32 },
      { min: 243725, max: 609350, rate: 35 },
      { min: 609350, max: Infinity, rate: 37 }
    ];

    for (const bracket of brackets) {
      if (income <= bracket.max) {
        return bracket.rate;
      }
    }
    return 37;
  };

  const runAIAnalysis = async (financialSummary, taxCalculations) => {
    // Simulate AI analysis
    const optimizations = [];
    const risks = [];
    const recommendations = [];

    // Tax optimization opportunities
    if (financialSummary.home_office_deduction === 0 && financialSummary.net_business_income > 10000) {
      optimizations.push("Consider claiming home office deduction if you work from home");
    }

    if (financialSummary.total_deductible_expenses / financialSummary.gross_revenue < 0.2) {
      optimizations.push("Your deduction ratio is low - review business expenses for missed deductions");
    }

    // Risk assessment
    const deductionRatio = financialSummary.total_deductible_expenses / financialSummary.gross_revenue;
    let riskLevel = "low";
    
    if (deductionRatio > 0.6) {
      riskLevel = "high";
      risks.push("High deduction ratio may trigger audit attention");
    } else if (deductionRatio > 0.4) {
      riskLevel = "medium";
      risks.push("Moderate deduction ratio - ensure documentation is complete");
    }

    // Recommendations
    recommendations.push("Maintain detailed records for all business expenses");
    recommendations.push("Consider quarterly estimated payments to avoid penalties");
    
    if (taxCalculations.total_tax_liability > 5000) {
      recommendations.push("Consider retirement plan contributions to reduce tax liability");
    }

    setFormData(prev => ({
      ...prev,
      ai_insights: {
        ...prev.ai_insights,
        tax_optimization_opportunities: optimizations,
        audit_risk_assessment: {
          risk_level: riskLevel,
          risk_factors: risks,
          mitigation_strategies: [
            "Keep detailed expense records",
            "Save all receipts and documentation",
            "Consider professional review"
          ]
        },
        deduction_recommendations: recommendations,
        confidence_score: 85
      }
    }));

    setAiAnalysisComplete(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Validation
    if (!formData.report_name.trim()) {
      alert("Please enter a report name");
      return;
    }
    if (!formData.jurisdiction.tax_id.trim()) {
      alert("Please enter your tax ID");
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData = {
        ...formData,
        status_tracking: {
          ...formData.status_tracking,
          last_updated: new Date().toISOString()
        }
      };
      await onSubmit(submitData);
    } catch (error) {
      console.error('Tax report submission error:', error);
      alert('Failed to save tax report. Please try again.');
    }
    setIsSubmitting(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="revolutionary-tax-form w-full max-w-7xl max-h-[95vh] overflow-hidden"
        >
          <style jsx>{`
            .revolutionary-tax-form {
              background: linear-gradient(145deg, 
                rgba(15, 23, 42, 0.98) 0%,
                rgba(30, 41, 59, 0.96) 50%,
                rgba(51, 65, 85, 0.94) 100%
              );
              border: 2px solid transparent;
              border-image: linear-gradient(45deg, #dc2626, #f59e0b, #10b981) 1;
              border-radius: 24px;
              backdrop-filter: blur(30px);
              box-shadow: 
                0 25px 50px rgba(0, 0, 0, 0.5),
                0 0 80px rgba(220, 38, 38, 0.2),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
              position: relative;
              overflow: hidden;
            }
            
            .form-header-enhanced {
              background: linear-gradient(135deg, 
                rgba(220, 38, 38, 0.1) 0%,
                rgba(245, 158, 11, 0.08) 50%,
                rgba(16, 185, 129, 0.1) 100%
              );
              border-bottom: 1px solid rgba(255, 255, 255, 0.1);
              padding: 1.5rem;
              position: relative;
              z-index: 10;
            }
            
            .form-content-enhanced {
              position: relative;
              z-index: 10;
              max-height: 75vh;
              overflow-y: auto;
              padding: 1.5rem;
            }
            
            .enhanced-input {
              background: linear-gradient(135deg, 
                rgba(255, 255, 255, 0.08) 0%,
                rgba(255, 255, 255, 0.04) 100%
              );
              border: 1px solid rgba(255, 255, 255, 0.2);
              border-radius: 12px;
              color: rgba(255, 255, 255, 0.9);
              padding: 0.75rem 1rem;
              backdrop-filter: blur(10px);
              transition: all 0.3s ease;
            }
            
            .enhanced-input:focus {
              background: linear-gradient(135deg, 
                rgba(255, 255, 255, 0.12) 0%,
                rgba(255, 255, 255, 0.08) 100%
              );
              border: 1px solid rgba(220, 38, 38, 0.5);
              box-shadow: 0 0 20px rgba(220, 38, 38, 0.3);
              transform: translateY(-1px);
              outline: none;
            }
            
            .section-card {
              background: linear-gradient(135deg, 
                rgba(51, 65, 85, 0.4) 0%,
                rgba(30, 41, 59, 0.3) 100%
              );
              border: 1px solid rgba(255, 255, 255, 0.08);
              border-radius: 16px;
              backdrop-filter: blur(15px);
              margin-bottom: 1.5rem;
              transition: all 0.3s ease;
            }
            
            .section-card:hover {
              background: linear-gradient(135deg, 
                rgba(51, 65, 85, 0.6) 0%,
                rgba(30, 41, 59, 0.5) 100%
              );
              border: 1px solid rgba(255, 255, 255, 0.12);
              transform: translateY(-1px);
            }
            
            .tax-calculation-card {
              background: linear-gradient(135deg, 
                rgba(16, 185, 129, 0.1) 0%,
                rgba(5, 150, 105, 0.08) 100%
              );
              border: 1px solid rgba(16, 185, 129, 0.3);
              border-radius: 16px;
              backdrop-filter: blur(15px);
            }
            
            .ai-insights-card {
              background: linear-gradient(135deg, 
                rgba(139, 92, 246, 0.1) 0%,
                rgba(124, 58, 237, 0.08) 100%
              );
              border: 1px solid rgba(139, 92, 246, 0.3);
              border-radius: 16px;
              backdrop-filter: blur(15px);
            }
            
            .risk-indicator-low {
              background: linear-gradient(45deg, #10b981, #059669);
              color: white;
              padding: 0.25rem 0.75rem;
              border-radius: 20px;
              font-size: 0.75rem;
              font-weight: 700;
            }
            
            .risk-indicator-medium {
              background: linear-gradient(45deg, #f59e0b, #d97706);
              color: white;
              padding: 0.25rem 0.75rem;
              border-radius: 20px;
              font-size: 0.75rem;
              font-weight: 700;
            }
            
            .risk-indicator-high {
              background: linear-gradient(45deg, #ef4444, #dc2626);
              color: white;
              padding: 0.25rem 0.75rem;
              border-radius: 20px;
              font-size: 0.75rem;
              font-weight: 700;
            }
          `}</style>

          {/* Header */}
          <div className="form-header-enhanced">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {report ? 'Edit Tax Report' : 'Prepare Tax Report'}
                  </h2>
                  <p className="text-sm text-gray-300">
                    AI-powered tax preparation with compliance checking
                  </p>
                </div>
              </div>
              {calculationProgress > 0 && calculationProgress < 100 && (
                <div className="w-48">
                  <div className="flex items-center gap-2 mb-1">
                    <Calculator className="w-4 h-4 text-blue-400 animate-spin" />
                    <span className="text-xs text-gray-300">Calculating...</span>
                  </div>
                  <Progress value={calculationProgress} className="h-2" />
                </div>
              )}
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit}>
            <div className="form-content-enhanced">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Left Column - Basic Info */}
                <div className="space-y-6">
                  {/* Report Details */}
                  <Card className="section-card">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <FileText className="w-5 h-5 text-red-400" />
                        Report Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-gray-300 font-semibold">Report Name *</Label>
                        <Input
                          value={formData.report_name}
                          onChange={(e) => handleChange('report_name', e.target.value)}
                          className="enhanced-input"
                          placeholder="e.g., 2024 Annual Tax Report"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-300 font-semibold">Report Type</Label>
                          <Select value={formData.report_type} onValueChange={(value) => handleChange('report_type', value)}>
                            <SelectTrigger className="enhanced-input">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700">
                              {REPORT_TYPES.map(type => (
                                <SelectItem key={type} value={type}>
                                  {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-gray-300 font-semibold">Tax Year</Label>
                          <Input
                            type="number"
                            value={formData.tax_year}
                            onChange={(e) => handleChange('tax_year', parseInt(e.target.value))}
                            className="enhanced-input"
                            min="2020"
                            max="2030"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-300 font-semibold">Start Date</Label>
                          <Input
                            type="date"
                            value={formData.filing_period.start_date}
                            onChange={(e) => handleChange('filing_period.start_date', e.target.value)}
                            className="enhanced-input"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-300 font-semibold">End Date</Label>
                          <Input
                            type="date"
                            value={formData.filing_period.end_date}
                            onChange={(e) => handleChange('filing_period.end_date', e.target.value)}
                            className="enhanced-input"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Jurisdiction Info */}
                  <Card className="section-card">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-400" />
                        Tax Jurisdiction
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-300 font-semibold">Country</Label>
                          <Input
                            value={formData.jurisdiction.country}
                            onChange={(e) => handleChange('jurisdiction.country', e.target.value)}
                            className="enhanced-input"
                            placeholder="US"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-300 font-semibold">State/Province</Label>
                          <Input
                            value={formData.jurisdiction.state}
                            onChange={(e) => handleChange('jurisdiction.state', e.target.value)}
                            className="enhanced-input"
                            placeholder="e.g., CA"
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-gray-300 font-semibold">Business Structure</Label>
                        <Select value={formData.jurisdiction.business_structure} onValueChange={(value) => handleChange('jurisdiction.business_structure', value)}>
                          <SelectTrigger className="enhanced-input">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700">
                            {BUSINESS_STRUCTURES.map(structure => (
                              <SelectItem key={structure} value={structure}>
                                {structure.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-gray-300 font-semibold">Tax ID (EIN/SSN) *</Label>
                        <Input
                          value={formData.jurisdiction.tax_id}
                          onChange={(e) => handleChange('jurisdiction.tax_id', e.target.value)}
                          className="enhanced-input"
                          placeholder="XX-XXXXXXX"
                          required
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Middle Column - Financial Summary */}
                <div className="space-y-6">
                  <Card className="tax-calculation-card">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-green-400" />
                        Financial Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                          <div className="text-xs text-green-300 font-medium">Gross Revenue</div>
                          <div className="text-lg font-bold text-green-400">
                            {formData.currency} {formData.financial_summary.gross_revenue.toLocaleString()}
                          </div>
                        </div>
                        <div className="text-center p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                          <div className="text-xs text-red-300 font-medium">Deductible Expenses</div>
                          <div className="text-lg font-bold text-red-400">
                            {formData.currency} {formData.financial_summary.total_deductible_expenses.toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <div className="text-center p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                        <div className="text-sm text-blue-300 font-medium mb-1">Net Business Income</div>
                        <div className="text-2xl font-bold text-blue-400">
                          {formData.currency} {formData.financial_summary.net_business_income.toLocaleString()}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <Label className="text-gray-300 font-semibold">Home Office Deduction</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={formData.financial_summary.home_office_deduction}
                            onChange={(e) => handleChange('financial_summary.home_office_deduction', parseFloat(e.target.value) || 0)}
                            className="enhanced-input"
                            placeholder="0.00"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-300 font-semibold">Estimated Tax Payments</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={formData.financial_summary.estimated_tax_payments}
                            onChange={(e) => handleChange('financial_summary.estimated_tax_payments', parseFloat(e.target.value) || 0)}
                            className="enhanced-input"
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Tax Calculations */}
                  <Card className="tax-calculation-card">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Calculator className="w-5 h-5 text-green-400" />
                        Tax Calculations
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-300">Income Tax:</span>
                          <span className="text-white font-semibold">
                            ${formData.tax_calculations.income_tax.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">SE Tax:</span>
                          <span className="text-white font-semibold">
                            ${formData.tax_calculations.self_employment_tax.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Effective Rate:</span>
                          <span className="text-white font-semibold">
                            {formData.tax_calculations.effective_tax_rate.toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Marginal Rate:</span>
                          <span className="text-white font-semibold">
                            {formData.tax_calculations.marginal_tax_rate}%
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-gray-600 pt-4">
                        <div className="text-center p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                          <div className="text-sm text-orange-300 font-medium mb-1">Total Tax Liability</div>
                          <div className="text-2xl font-bold text-orange-400">
                            {formData.currency} {formData.tax_calculations.total_tax_liability.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column - AI Insights */}
                <div className="space-y-6">
                  <Card className="ai-insights-card">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Brain className="w-5 h-5 text-purple-400" />
                        AI Tax Insights
                        {aiAnalysisComplete && <CheckCircle className="w-4 h-4 text-green-400" />}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Audit Risk:</span>
                        <div className={`risk-indicator-${formData.ai_insights.audit_risk_assessment.risk_level}`}>
                          {formData.ai_insights.audit_risk_assessment.risk_level.toUpperCase()} RISK
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">AI Confidence:</span>
                        <span className="text-purple-400 font-bold">
                          {formData.ai_insights.confidence_score}%
                        </span>
                      </div>

                      {formData.ai_insights.tax_optimization_opportunities.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-white mb-2">💡 Optimization Opportunities</h4>
                          <div className="space-y-2">
                            {formData.ai_insights.tax_optimization_opportunities.map((opp, index) => (
                              <div key={index} className="text-xs text-gray-300 p-2 bg-blue-500/10 border border-blue-500/20 rounded">
                                {opp}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {formData.ai_insights.deduction_recommendations.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-white mb-2">📋 Recommendations</h4>
                          <div className="space-y-2">
                            {formData.ai_insights.deduction_recommendations.map((rec, index) => (
                              <div key={index} className="text-xs text-gray-300 p-2 bg-green-500/10 border border-green-500/20 rounded">
                                {rec}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {formData.ai_insights.audit_risk_assessment.risk_factors.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-white mb-2">⚠️ Risk Factors</h4>
                          <div className="space-y-2">
                            {formData.ai_insights.audit_risk_assessment.risk_factors.map((risk, index) => (
                              <div key={index} className="text-xs text-gray-300 p-2 bg-red-500/10 border border-red-500/20 rounded">
                                {risk}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Status Tracking */}
                  <Card className="section-card">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-400" />
                        Status Tracking
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm">Preparation:</span>
                        <Badge className="bg-yellow-500/20 text-yellow-300">
                          {formData.status_tracking.preparation_status.replace(/_/g, ' ').toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm">Review:</span>
                        <Badge className="bg-blue-500/20 text-blue-300">
                          {formData.status_tracking.review_status.replace(/_/g, ' ').toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm">Filing:</span>
                        <Badge className="bg-gray-500/20 text-gray-300">
                          {formData.status_tracking.filing_status.replace(/_/g, ' ').toUpperCase()}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-700 flex justify-between items-center">
              {report && onDelete && (
                <Button 
                  type="button" 
                  onClick={() => onDelete(report)} 
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete Report
                </Button>
              )}
              <div className="flex gap-3 ml-auto">
                <Button 
                  type="button" 
                  onClick={onCancel} 
                  variant="outline"
                  className="bg-transparent border-gray-600 text-gray-400 hover:bg-gray-700"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSubmitting ? 'Saving...' : report ? 'Update Report' : 'Create Report'}
                </Button>
              </div>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}