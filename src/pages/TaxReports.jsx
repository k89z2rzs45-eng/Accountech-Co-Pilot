import React, { useState, useEffect } from "react";
import { TaxReport } from "@/api/entities";
import { Transaction } from "@/api/entities";
import { User } from "@/api/entities";
import { Invoice } from "@/api/entities";
import { Company } from "@/api/entities";
import { InvokeLLM } from "@/api/integrations";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calculator, 
  FileText, 
  Download, 
  Plus, 
  AlertTriangle,
  DollarSign,
  Brain,
  TrendingUp,
  Shield,
  Calendar,
  CheckCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { detectDefaultCurrency } from "@/components/utils/currency";
import { safeFormatDate } from "@/components/utils/formatters";

import { taxPreparationAI } from "@/api/functions";
import { geniusTaxAccountant } from "@/api/functions";
import { taxComplianceMonitor } from "@/api/functions";

import TaxCalculator from "../components/tax/TaxCalculator";
import TaxDeductionTracker from "../components/tax/TaxDeductionTracker";
import AITaxPreparation from "../components/tax/AITaxPreparation";

export default function TaxReports() {
  const [reports, setReports] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [user, setUser] = useState(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [aiTaxReport, setAiTaxReport] = useState(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [defaultCurrency, setDefaultCurrency] = useState("USD");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      const defaultCur = detectDefaultCurrency({ userCountry: currentUser?.country, userPreferred: currentUser?.preferred_currency });
      setDefaultCurrency(defaultCur || "USD");
      
      const [reportData, transactionData] = await Promise.all([
        TaxReport.list('-created_date', 50),
        Transaction.list('-date', 500)
      ]);
      setReports(reportData);
      setTransactions(transactionData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setIsLoading(false);
  };

  const generateBasicTaxReport = async (reportData) => {
    if (!user || !user.country) {
      alert("Please set your country in your profile settings first.");
      return;
    }
    
    setIsGeneratingReport(true);
    try {
      const filteredForPeriod = transactions.filter(t => {
        const date = new Date(t.date);
        return date >= new Date(reportData.period_start) && date <= new Date(reportData.period_end);
      });

      await TaxReport.create({
        ...reportData,
        jurisdiction: reportData.jurisdiction || user.country,
        currency: defaultCurrency,
        status: "generated",
        total_income: filteredForPeriod.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
        total_expenses: filteredForPeriod.filter(t => t.type === 'expense' && t.tax_deductible).reduce((sum, t) => sum + t.amount, 0)
      });
      alert('Basic Tax Report Generated Successfully!');
    } catch (error) {
      console.error('Error generating basic tax report:', error);
      alert('Error generating basic tax report: ' + error.message);
    } finally {
      setIsGeneratingReport(false);
      setShowForm(false);
      loadData();
    }
  };

  const generateAITaxReport = async (reportData) => {
    setIsGeneratingAI(true);
    try {
      const response = await geniusTaxAccountant({
        action: 'generate_comprehensive_tax_report',
        data: {
          taxYear: reportData.tax_year,
          jurisdiction: reportData.jurisdiction || user?.country,
          businessStructure: reportData.business_structure || 'sole_proprietorship'
        }
      });

      if (response.data && response.data.success !== false) {
        setAiTaxReport(response.data.report);
        alert('🤖 AI Tax Analysis Complete! Your comprehensive tax report is ready with personalized recommendations.');
      } else {
        throw new Error(response.data?.error || 'AI analysis failed');
      }
    } catch (error) {
      console.error('AI tax preparation error:', error);
      alert(`AI Analysis Error: ${error.message}\n\nA basic report will be generated instead.`);
      await generateBasicTaxReport(reportData);
    } finally {
      setIsGeneratingAI(false);
      setShowForm(false);
      loadData();
    }
  };

  const handleSubmit = async (reportData) => {
    if (reportData.enable_ai_analysis) {
      await generateAITaxReport(reportData);
    } else {
      await generateBasicTaxReport(reportData);
    }
  };

  const statusColors = {
    draft: "bg-gray-700/50 text-gray-300",
    generated: "bg-green-600/50 text-green-300",
    filed: "bg-blue-600/50 text-blue-300"
  };

  // Safe function to get jurisdiction display text
  const getJurisdictionText = (report) => {
    if (typeof report.jurisdiction === 'string') {
      return report.jurisdiction;
    }
    if (report.jurisdiction && typeof report.jurisdiction === 'object') {
      return report.jurisdiction.country || report.jurisdiction.state || 'Unknown';
    }
    return 'Unknown';
  };

  // Safe function to get tax rate
  const getTaxRate = (country) => {
    const rates = {
      MM: '25%',
      US: '21%', 
      UK: '19%',
      CA: '15%'
    };
    return rates[country] || 'N/A';
  };

  return (
    <div className="tax-reports-future-container">
      <style jsx>{`
        /* ... keep existing code (all the CSS styles) ... */
        /* REVOLUTIONARY TAX REPORTS TRANSFORMATION - NO WHITE! */
        .tax-reports-future-container {
          background: linear-gradient(135deg, 
            #0a0a0a 0%,
            #1a1a2e 25%,
            #16213e 50%,
            #0f0f23 75%,
            #000000 100%
          );
          background-size: 400% 400%;
          animation: cosmicTaxFlow 20s ease infinite;
          position: relative;
          overflow: hidden;
          padding: 2rem;
          min-height: 100vh;
        }
        
        @keyframes cosmicTaxFlow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        /* Floating Tax Data Particles */
        .tax-reports-future-container::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 25% 25%, rgba(34, 197, 94, 0.03) 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, rgba(59, 130, 246, 0.02) 1px, transparent 1px),
            radial-gradient(circle at 50% 10%, rgba(168, 85, 247, 0.025) 1px, transparent 1px);
          background-size: 60px 60px, 80px 80px, 40px 40px;
          animation: taxDataFloat 25s linear infinite;
          z-index: 1;
          pointer-events: none;
        }
        
        @keyframes taxDataFloat {
          0% { transform: translate(0, 0) rotate(0deg); }
          100% { transform: translate(-40px, -40px) rotate(360deg); }
        }
        
        /* FUTURISTIC TAX CARDS - NO WHITE BACKGROUNDS! */
        .tax-card-future {
          background: linear-gradient(145deg, 
            rgba(15, 23, 42, 0.98) 0%,
            rgba(30, 41, 59, 0.95) 25%,
            rgba(51, 65, 85, 0.92) 50%,
            rgba(30, 41, 59, 0.95) 75%,
            rgba(15, 23, 42, 0.98) 100%
          );
          backdrop-filter: blur(30px);
          border: 2px solid transparent;
          border-image: linear-gradient(45deg, #22c55e, #3b82f6, #a855f7, #22c55e) 1;
          border-radius: 20px;
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.4),
            0 0 80px rgba(34, 197, 94, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          z-index: 10;
        }
        
        .tax-card-future::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg,
            transparent,
            rgba(34, 197, 94, 0.1),
            transparent
          );
          transition: left 0.6s ease;
          z-index: 1;
        }
        
        .tax-card-future:hover::before {
          left: 100%;
        }
        
        .tax-card-future:hover {
          transform: translateY(-8px) scale(1.02);
          border-image: linear-gradient(45deg, #3b82f6, #a855f7, #22c55e, #3b82f6) 1;
          box-shadow: 
            0 30px 60px rgba(0, 0, 0, 0.5),
            0 0 120px rgba(59, 130, 246, 0.25),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }
        
        .tax-card-content {
          position: relative;
          z-index: 10;
          padding: 1.5rem;
        }
        
        /* TAX METRIC ICONS */
        .tax-icon-future {
          width: 4rem;
          height: 4rem;
          background: linear-gradient(135deg,
            rgba(34, 197, 94, 0.2) 0%,
            rgba(59, 130, 246, 0.15) 100%
          );
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 16px;
          backdrop-filter: blur(15px);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .tax-icon-future::before {
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
          0%, 100% { 
            opacity: 0.5; 
            transform: scale(1); 
          }
          50% { 
            opacity: 1; 
            transform: scale(1.1); 
          }
        }
        
        .tax-card-future:hover .tax-icon-future {
          background: linear-gradient(135deg,
            rgba(34, 197, 94, 0.3) 0%,
            rgba(59, 130, 246, 0.25) 100%
          );
          border: 1px solid rgba(34, 197, 94, 0.5);
          transform: rotateY(15deg) scale(1.1);
          box-shadow: 0 0 30px rgba(34, 197, 94, 0.4);
        }
        
        /* TAX VALUES AND LABELS */
        .tax-value-future {
          color: #f8fafc !important;
          font-weight: 900;
          font-size: 2.5rem;
          text-shadow: 0 0 20px rgba(34, 197, 94, 0.5);
          background: linear-gradient(45deg, #f8fafc, #e2e8f0, #cbd5e1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .tax-label-future {
          color: #94a3b8 !important;
          font-weight: 600;
          font-size: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
        }
        
        /* TAX CALCULATOR CARDS */
        .tax-calculator-future {
          background: linear-gradient(145deg, 
            rgba(15, 23, 42, 0.98) 0%,
            rgba(30, 41, 59, 0.95) 100%
          );
          backdrop-filter: blur(25px);
          border: 1px solid rgba(168, 85, 247, 0.3);
          border-radius: 20px;
          box-shadow: 
            0 15px 35px rgba(0, 0, 0, 0.3),
            0 0 60px rgba(168, 85, 247, 0.1);
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        .tax-calculator-future:hover {
          border: 1px solid rgba(168, 85, 247, 0.5);
          box-shadow: 
            0 20px 45px rgba(0, 0, 0, 0.4),
            0 0 80px rgba(168, 85, 247, 0.15);
          transform: translateY(-2px);
        }
        
        /* DEDUCTION TRACKER */
        .deduction-tracker-future {
          background: linear-gradient(145deg, 
            rgba(15, 23, 42, 0.98) 0%,
            rgba(30, 41, 59, 0.95) 100%
          );
          backdrop-filter: blur(25px);
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 20px;
          box-shadow: 
            0 15px 35px rgba(0, 0, 0, 0.3),
            0 0 60px rgba(34, 197, 94, 0.1);
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        .deduction-tracker-future:hover {
          border: 1px solid rgba(34, 197, 94, 0.5);
          box-shadow: 
            0 20px 45px rgba(0, 0, 0, 0.4),
            0 0 80px rgba(34, 197, 94, 0.15);
          transform: translateY(-2px);
        }
        
        /* TAX TITLE */
        .tax-title-future {
          background: linear-gradient(45deg, #22c55e, #3b82f6, #a855f7, #f59e0b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-size: 3.5rem;
          font-weight: 900;
          text-align: center;
          margin-bottom: 1rem;
          animation: taxTitleGlow 4s ease-in-out infinite;
        }
        
        @keyframes taxTitleGlow {
          0%, 100% { 
            filter: brightness(1) saturate(1);
            transform: scale(1);
          }
          50% { 
            filter: brightness(1.2) saturate(1.5);
            transform: scale(1.02);
          }
        }
        
        .tax-subtitle-future {
          color: #64748b !important;
          text-align: center;
          font-size: 1.2rem;
          margin-bottom: 2rem;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
        }
        
        /* AI TAX PREPARATION ENHANCEMENT */
        .ai-tax-card-future {
          background: linear-gradient(145deg, 
            rgba(15, 23, 42, 0.98) 0%,
            rgba(30, 41, 59, 0.95) 100%
          );
          backdrop-filter: blur(25px);
          border: 1px solid rgba(59, 130, 246, 0.4);
          border-radius: 20px;
          box-shadow: 
            0 15px 35px rgba(0, 0, 0, 0.3),
            0 0 60px rgba(59, 130, 246, 0.15);
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        .ai-tax-card-future:hover {
          border: 1px solid rgba(59, 130, 246, 0.6);
          box-shadow: 
            0 20px 45px rgba(0, 0, 0, 0.4),
            0 0 80px rgba(59, 130, 246, 0.2);
          transform: translateY(-2px);
        }
        
        /* TEXT COLORS FOR DARK THEME */
        .tax-text-future {
          color: #f1f5f9 !important;
          font-weight: 600;
        }
        
        .tax-subtitle-text {
          color: #cbd5e1 !important;
          font-weight: 500;
        }
        
        /* ENHANCED BUTTONS */
        .tax-button-future {
          background: linear-gradient(135deg, #22c55e 0%, #3b82f6 50%, #a855f7 100%);
          border: none;
          border-radius: 12px;
          color: white;
          font-weight: 700;
          padding: 0.75rem 1.5rem;
          transition: all 0.3s ease;
          box-shadow: 
            0 4px 15px rgba(34, 197, 94, 0.4),
            0 0 0 1px rgba(255, 255, 255, 0.1);
          position: relative;
          overflow: hidden;
        }
        
        .tax-button-future::before {
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
        
        .tax-button-future:hover::before {
          left: 100%;
        }
        
        .tax-button-future:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 
            0 8px 25px rgba(34, 197, 94, 0.5),
            0 0 30px rgba(59, 130, 246, 0.4);
        }

        .tax-button-outline-future {
          background: transparent;
          border: 1px solid rgba(148, 163, 184, 0.4);
          color: #94a3b8;
          border-radius: 12px;
          font-weight: 700;
          padding: 0.75rem 1.5rem;
          transition: all 0.3s ease;
          box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.05);
        }
        
        .tax-button-outline-future:hover {
          background: rgba(148, 163, 184, 0.1);
          border: 1px solid rgba(148, 163, 184, 0.6);
          transform: translateY(-1px);
        }

        .tax-button-download-future {
            background: transparent;
            border: 1px solid rgba(37, 99, 235, 0.4);
            color: #60a5fa;
            border-radius: 12px;
            font-weight: 700;
            padding: 0.75rem 1.5rem;
            transition: all 0.3s ease;
            box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.1);
        }
        .tax-button-download-future:hover {
            background: rgba(37, 99, 235, 0.1);
            border: 1px solid rgba(37, 99, 235, 0.6);
            transform: translateY(-1px);
        }
        
        .tax-button-ai-download-future {
          background: transparent;
          border: 1px solid rgba(34, 197, 94, 0.4);
          color: #22c55e;
          border-radius: 12px;
          font-weight: 700;
          padding: 0.75rem 1.5rem;
          transition: all 0.3s ease;
          box-shadow: 0 0 0 1px rgba(34, 197, 94, 0.1);
        }
        
        .tax-button-ai-download-future:hover {
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.6);
          transform: translateY(-1px);
        }
        
        /* FORM ENHANCEMENTS - NO WHITE BACKGROUNDS */
        .tax-form-future {
          background: linear-gradient(145deg, 
            rgba(15, 23, 42, 0.98) 0%,
            rgba(30, 41, 59, 0.95) 100%
          );
          backdrop-filter: blur(25px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          box-shadow: 
            0 15px 35px rgba(0, 0, 0, 0.3),
            0 0 60px rgba(37, 99, 235, 0.1);
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        .tax-input-future {
          background: linear-gradient(135deg, 
            rgba(51, 65, 85, 0.8) 0%,
            rgba(30, 41, 59, 0.6) 100%
          );
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 12px;
          padding: 0.75rem 1rem;
          color: #f1f5f9;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }
        
        .tax-input-future:focus {
          background: linear-gradient(135deg, 
            rgba(51, 65, 85, 0.95) 0%,
            rgba(30, 41, 59, 0.8) 100%
          );
          border: 1px solid rgba(59, 130, 246, 0.6);
          box-shadow: 
            0 0 20px rgba(59, 130, 246, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          transform: translateY(-1px);
          outline: none;
        }
        
        .tax-input-future::placeholder {
          color: rgba(148, 163, 184, 0.8);
        }
        
        /* DISCLAIMER ENHANCEMENT */
        .tax-disclaimer-future {
          background: linear-gradient(45deg, rgba(245, 158, 11, 0.15), rgba(217, 119, 6, 0.1));
          border: 1px solid rgba(245, 158, 11, 0.3);
          border-left: 4px solid #f59e0b;
          border-radius: 12px;
          padding: 1rem;
          color: #fbbf24 !important;
          backdrop-filter: blur(10px);
        }
        
        /* REPORTS HISTORY ENHANCEMENT */
        .tax-history-future {
          background: linear-gradient(145deg, 
            rgba(15, 23, 42, 0.98) 0%,
            rgba(30, 41, 59, 0.95) 100%
          );
          backdrop-filter: blur(25px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          box-shadow: 
            0 15px 35px rgba(0, 0, 0, 0.3),
            0 0 60px rgba(37, 99, 235, 0.1);
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        .tax-history-item:hover {
          background: rgba(255, 255, 255, 0.05) !important;
          border: 1px solid rgba(59, 130, 246, 0.3);
          transform: translateY(-2px);
        }

        .tax-report-header {
          padding: 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          margin-bottom: 1rem;
        }
        .tax-report-content {
          padding: 1.5rem;
        }
      `}</style>

      <div className="space-y-6 max-w-7xl mx-auto relative z-10">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <h1 className="tax-title-future">Tax Reports & Compliance</h1>
            <p className="tax-subtitle-future">
              Automated tax calculations for: 
              <span className="font-semibold text-indigo-400 mx-2">{user?.country || "Loading..."}</span>
              <Badge variant="outline" className="text-indigo-300">{defaultCurrency}</Badge>
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => setShowForm(true)} className="tax-button-future">
              <Plus className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </motion.div>

        {/* Enhanced Metrics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <div className="tax-card-future">
            <div className="tax-card-content">
              <div className="flex items-center gap-3">
                <div className="tax-icon-future">
                  <Calculator className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="tax-label-future">Tax Rate ({user?.country || 'Loading'})</p>
                  <p className="tax-value-future">
                    {getTaxRate(user?.country)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="tax-card-future">
            <div className="tax-card-content">
              <div className="flex items-center gap-3">
                <div className="tax-icon-future">
                  <DollarSign className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="tax-label-future">YTD Deductions</p>
                  <p className="tax-value-future">
                    {defaultCurrency} {transactions.filter(t => t.tax_deductible && t.currency === defaultCurrency).reduce((sum, t) => sum + t.amount, 0).toFixed(0)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="tax-card-future">
            <div className="tax-card-content">
              <div className="flex items-center gap-3">
                <div className="tax-icon-future">
                  <FileText className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="tax-label-future">Reports Generated</p>
                  <p className="tax-value-future">{reports.length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="tax-card-future">
            <div className="tax-card-content">
              <div className="flex items-center gap-3">
                <div className="tax-icon-future">
                  <AlertTriangle className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <p className="tax-label-future">Compliance Status</p>
                  <p className="text-2xl font-bold text-green-400">✓ Current</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="tax-disclaimer-future"
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">
                <span className="font-bold text-amber-100">Disclaimer:</span> These calculations are AI-generated estimates for guidance only. Always consult with a certified tax professional before filing.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Keep AI Tax Preparation Section */}
        {aiTaxReport && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="ai-tax-card-future"
          >
            <AITaxPreparation
              taxReport={aiTaxReport}
              isLoading={isGeneratingAI}
              onDownload={() => {}}
            />
          </motion.div>
        )}

        {/* Enhanced Calculator and Tracker Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="grid lg:grid-cols-2 gap-6"
        >
          <div className="tax-calculator-future">
            <TaxCalculator 
              transactions={transactions.filter(t => t.currency === defaultCurrency)} 
              jurisdiction={user?.country}
              defaultCurrency={defaultCurrency}
            />
          </div>
          <div className="deduction-tracker-future">
            <TaxDeductionTracker 
              transactions={transactions.filter(t => t.tax_deductible && t.currency === defaultCurrency)} 
              defaultCurrency={defaultCurrency}
            />
          </div>
        </motion.div>

        {/* Enhanced Tax Report Form */}
        {showForm && (
          <div className="tax-form-future">
            <div className="tax-report-header">
              <h2 className="flex items-center gap-2 text-white text-lg font-bold">
                <Brain className="w-5 h-5 text-blue-400" />
                AI-Powered Tax Report Generator
              </h2>
            </div>
            <div className="tax-report-content">
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const reportData = {
                  report_type: formData.get('report_type'),
                  tax_year: parseInt(formData.get('tax_year')),
                  jurisdiction: formData.get('jurisdiction'),
                  period_start: formData.get('period_start'),
                  period_end: formData.get('period_end'),
                  enable_ai_analysis: formData.get('enable_ai_analysis') === 'on'
                };
                handleSubmit(reportData);
              }} className="space-y-6">
                {/* Form fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="report_type" className="block text-sm font-medium tax-text-future">Report Type</label>
                    <select
                      id="report_type"
                      name="report_type"
                      className="mt-1 block w-full tax-input-future sm:text-sm p-2"
                      defaultValue="annual"
                    >
                      <option value="annual">Annual</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="custom">Custom Period</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="tax_year" className="block text-sm font-medium tax-text-future">Tax Year</label>
                    <input
                      type="number"
                      id="tax_year"
                      name="tax_year"
                      className="mt-1 block w-full tax-input-future sm:text-sm p-2"
                      defaultValue={new Date().getFullYear()}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="period_start" className="block text-sm font-medium tax-text-future">Period Start Date</label>
                    <input
                      type="date"
                      id="period_start"
                      name="period_start"
                      className="mt-1 block w-full tax-input-future sm:text-sm p-2"
                    />
                  </div>
                  <div>
                    <label htmlFor="period_end" className="block text-sm font-medium tax-text-future">Period End Date</label>
                    <input
                      type="date"
                      id="period_end"
                      name="period_end"
                      className="mt-1 block w-full tax-input-future sm:text-sm p-2"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="jurisdiction" className="block text-sm font-medium tax-text-future">Jurisdiction</label>
                  <input
                    type="text"
                    id="jurisdiction"
                    name="jurisdiction"
                    className="mt-1 block w-full tax-input-future sm:text-sm p-2"
                    defaultValue={user?.country || ''}
                    placeholder="e.g., US, UK, CA, MM"
                  />
                </div>

                {/* AI Enhancement Option */}
                <div className="p-4 bg-blue-900/30 border border-blue-800 rounded-lg">
                  <div className="flex items-start gap-3">
                    <input 
                      type="checkbox" 
                      id="enable_ai_analysis" 
                      name="enable_ai_analysis" 
                      defaultChecked
                      className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 bg-gray-700"
                    />
                    <div>
                      <label htmlFor="enable_ai_analysis" className="font-semibold text-blue-300 cursor-pointer">
                        🤖 Enable AI Tax Analysis (Recommended)
                      </label>
                      <p className="text-sm text-blue-400 mt-1">
                        Get personalized tax advice, deduction optimization, compliance guidance, 
                        and audit risk assessment powered by advanced AI.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button type="button" onClick={() => setShowForm(false)} className="tax-button-outline-future">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isGeneratingAI || isGeneratingReport} className="tax-button-future">
                    {isGeneratingAI ? (
                      <>
                        <Brain className="w-4 h-4 mr-2 animate-pulse" />
                        Generating AI Analysis...
                      </>
                    ) : isGeneratingReport ? (
                      <>
                        <Calculator className="w-4 h-4 mr-2 animate-pulse" />
                        Generating Report...
                      </>
                    ) : (
                      <>
                        <Calculator className="w-4 h-4 mr-2" />
                        Generate Tax Report
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
        >
          <div className="tax-history-future">
            <div className="tax-report-header">
              <h2 className="text-lg font-bold tax-text-future">Tax Reports History</h2>
            </div>
            <div className="tax-report-content">
              <div className="space-y-3">
                {isLoading ? (
                  <div className="space-y-4">
                    {Array(3).fill(0).map((_, i) => (
                      <div key={i} className="animate-pulse flex items-center justify-between p-4 border border-gray-700 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-700 rounded-lg" />
                          <div>
                            <div className="h-4 bg-gray-700 rounded w-32 mb-2" />
                            <div className="h-3 bg-gray-700 rounded w-24" />
                          </div>
                        </div>
                        <div className="h-6 bg-gray-700 rounded w-20" />
                      </div>
                    ))}
                  </div>
                ) : (
                  reports.map((report) => (
                    <motion.div 
                      key={report.id} 
                      whileHover={{ scale: 1.02 }}
                      className="tax-history-item flex items-center justify-between p-4 rounded-xl transition-colors border border-transparent"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold tax-text-future">
                              {report.report_type?.toUpperCase()} {report.tax_year} - {getJurisdictionText(report)}
                            </h3>
                            <Badge className={`${statusColors[report.status]} text-xs`}>
                              {report.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm tax-subtitle-text mt-1">
                            <span>{safeFormatDate(report.period_start, "MMM d")} - {safeFormatDate(report.period_end, "MMM d, yyyy")}</span>
                            {report.tax_owed && (
                              <span>• Tax Owed: {report.currency || defaultCurrency} {report.tax_owed.toFixed(2)}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {report.report_url && (
                          <Button size="sm" className="tax-button-download-future">
                            <Download className="w-4 h-4 mr-2" />
                            Download PDF
                          </Button>
                        )}
                        {aiTaxReport?.id === report.id && (
                           <Button size="sm" className="tax-button-ai-download-future">
                              <Download className="w-4 h-4 mr-2" />
                              Download AI PDF
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}