
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Eye,
  RefreshCw
} from "lucide-react";
import { motion } from "framer-motion";

export default function MobileOptimizedDashboard({ 
  metrics = {}, 
  recentTransactions = [], 
  currency = "USD",
  onQuickAdd,
  onRefresh,
  isLoading = false 
}) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    if (onRefresh) {
      await onRefresh();
    }
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <div className="mobile-dashboard-container">
      <style jsx>{`
        .mobile-dashboard-container {
          padding: 1rem;
          padding-top: 5rem; /* Account for mobile nav */
          padding-bottom: 6rem; /* Account for bottom nav */
          min-height: 100vh;
          background: linear-gradient(135deg, 
            #0f172a 0%,
            #1e293b 25%,
            #334155 50%,
            #1e293b 75%,
            #0f172a 100%
          );
        }

        .mobile-metrics-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .mobile-metric-card {
          background: linear-gradient(145deg, 
            rgba(30, 41, 59, 0.9) 0%,
            rgba(51, 65, 85, 0.8) 100%
          );
          backdrop-filter: blur(15px);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 12px;
          padding: 1rem;
          transition: all 0.3s ease;
        }

        .mobile-metric-card:hover {
          transform: translateY(-2px);
          border: 1px solid rgba(59, 130, 246, 0.5);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.2);
        }

        .mobile-metric-icon {
          width: 2rem;
          height: 2rem;
          background: linear-gradient(135deg, 
            rgba(59, 130, 246, 0.2) 0%,
            rgba(139, 92, 246, 0.2) 100%
          );
          border: 1px solid rgba(59, 130, 246, 0.4);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.75rem;
        }

        .mobile-metric-value {
          color: #f1f5f9;
          font-weight: 800;
          font-size: 1.25rem;
          margin-bottom: 0.25rem;
        }

        .mobile-metric-label {
          color: #94a3b8;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .mobile-quick-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .mobile-quick-action-button {
          background: linear-gradient(135deg, 
            rgba(59, 130, 246, 0.1) 0%,
            rgba(139, 92, 246, 0.1) 100%
          );
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 12px;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          color: #f1f5f9;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .mobile-quick-action-button:hover {
          background: linear-gradient(135deg, 
            rgba(59, 130, 246, 0.2) 0%,
            rgba(139, 92, 246, 0.2) 100%
          );
          border: 1px solid rgba(59, 130, 246, 0.5);
          transform: translateY(-2px);
        }

        .mobile-section-card {
          background: linear-gradient(145deg, 
            rgba(30, 41, 59, 0.9) 0%,
            rgba(51, 65, 85, 0.8) 100%
          );
          backdrop-filter: blur(15px);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 12px;
          margin-bottom: 1.5rem;
        }

        .mobile-section-header {
          padding: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: between;
        }

        .mobile-section-title {
          color: #f1f5f9;
          font-weight: 700;
          font-size: 1.125rem;
          flex: 1;
        }

        .mobile-transaction-item {
          padding: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .mobile-transaction-item:last-child {
          border-bottom: none;
        }

        .mobile-transaction-icon {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .mobile-transaction-icon.income {
          background: rgba(16, 185, 129, 0.2);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.4);
        }

        .mobile-transaction-icon.expense {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.4);
        }

        .mobile-transaction-details {
          flex: 1;
          min-width: 0;
        }

        .mobile-transaction-description {
          color: #f1f5f9;
          font-weight: 600;
          font-size: 0.9rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .mobile-transaction-date {
          color: #94a3b8;
          font-size: 0.75rem;
          margin-top: 0.125rem;
        }

        .mobile-transaction-amount {
          font-weight: 700;
          font-size: 0.9rem;
        }

        .mobile-transaction-amount.income {
          color: #10b981;
        }

        .mobile-transaction-amount.expense {
          color: #ef4444;
        }

        .mobile-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          color: #94a3b8;
        }

        .mobile-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          color: #94a3b8;
          text-align: center;
        }

        @media (min-width: 768px) {
          .mobile-dashboard-container {
            display: none;
          }
        }
      `}</style>

      {/* Mobile Header with Refresh */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Financial Command Center</h1>
          <p className="text-gray-400 text-sm">Your financial overview</p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          className="bg-blue-600 hover:bg-blue-700 px-3 py-2"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Mobile Metrics Grid */}
      <div className="mobile-metrics-grid">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mobile-metric-card"
        >
          <div className="mobile-metric-icon">
            <ArrowUpRight className="w-4 h-4 text-green-400" />
          </div>
          <div className="mobile-metric-value">
            {currency} {(metrics.totalRevenue || 0).toLocaleString()}
          </div>
          <div className="mobile-metric-label">Revenue</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mobile-metric-card"
        >
          <div className="mobile-metric-icon">
            <ArrowDownRight className="w-4 h-4 text-red-400" />
          </div>
          <div className="mobile-metric-value">
            {currency} {(metrics.totalExpenses || 0).toLocaleString()}
          </div>
          <div className="mobile-metric-label">Expenses</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mobile-metric-card"
        >
          <div className="mobile-metric-icon">
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mobile-metric-value">
            {currency} {(metrics.netIncome || 0).toLocaleString()}
          </div>
          <div className="mobile-metric-label">Net Income</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mobile-metric-card"
        >
          <div className="mobile-metric-icon">
            <DollarSign className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mobile-metric-value">
            {(metrics.profitMargin || 0).toFixed(1)}%
          </div>
          <div className="mobile-metric-label">Profit Margin</div>
        </motion.div>
      </div>

      {/* Mobile Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mobile-quick-actions"
      >
        <button 
          className="mobile-quick-action-button"
          onClick={() => onQuickAdd && onQuickAdd('income')}
        >
          <Plus className="w-5 h-5 text-green-400" />
          <span>Add Income</span>
        </button>
        
        <button 
          className="mobile-quick-action-button"
          onClick={() => onQuickAdd && onQuickAdd('expense')}
        >
          <Plus className="w-5 h-5 text-red-400" />
          <span>Add Expense</span>
        </button>
      </motion.div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mobile-section-card"
      >
        <div className="mobile-section-header">
          <h3 className="mobile-section-title">Recent Transactions</h3>
          <Button variant="ghost" size="sm" className="text-blue-400">
            <Eye className="w-4 h-4" />
          </Button>
        </div>
        
        <div>
          {isLoading ? (
            <div className="mobile-loading">
              <RefreshCw className="w-4 h-4 animate-spin mr-2" />
              Loading...
            </div>
          ) : recentTransactions.length === 0 ? (
            <div className="mobile-empty-state">
              <p>No recent transactions</p>
              <Button 
                className="mt-2 bg-blue-600 hover:bg-blue-700"
                onClick={() => onQuickAdd && onQuickAdd()}
              >
                Add First Transaction
              </Button>
            </div>
          ) : (
            recentTransactions.slice(0, 5).map((transaction, index) => (
              <motion.div
                key={transaction.id || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="mobile-transaction-item"
              >
                <div className={`mobile-transaction-icon ${transaction.type}`}>
                  {transaction.type === 'income' ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                </div>
                
                <div className="mobile-transaction-details">
                  <div className="mobile-transaction-description">
                    {transaction.description}
                  </div>
                  <div className="mobile-transaction-date">
                    {transaction.date}
                  </div>
                </div>
                
                <div className={`mobile-transaction-amount ${transaction.type}`}>
                  {transaction.type === 'income' ? '+' : '-'}
                  {currency} {(transaction.amount || 0).toLocaleString()}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
