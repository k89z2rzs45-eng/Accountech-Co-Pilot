
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, TrendingUp, Target } from "lucide-react";

export default function BudgetInsights({ budgets = [] }) {
  if (!Array.isArray(budgets)) {
    console.warn('BudgetInsights: budgets prop is not an array:', budgets);
    return null;
  }

  const totalBudgets = budgets.length;
  const activeBudgets = budgets.filter(b => (b.usage?.status || 'safe') !== 'exceeded').length;
  const exceededBudgets = budgets.filter(b => (b.usage?.status || 'safe') === 'exceeded').length;
  const warningBudgets = budgets.filter(b => (b.usage?.status || 'safe') === 'warning').length;

  const totalBudgetAmount = budgets.reduce((sum, b) => sum + (b.amount || 0), 0);
  const totalSpent = budgets.reduce((sum, b) => sum + (b.usage?.spent || 0), 0);
  const overallPercentage = totalBudgetAmount > 0 ? (totalSpent / totalBudgetAmount) * 100 : 0;

  const getOverallStatus = () => {
    if (overallPercentage >= 100) return { status: 'exceeded', color: 'text-red-600', icon: AlertTriangle };
    if (overallPercentage >= 80) return { status: 'warning', color: 'text-amber-600', icon: AlertTriangle };
    return { status: 'safe', color: 'text-green-600', icon: CheckCircle };
  };

  const overall = getOverallStatus();
  const StatusIcon = overall.icon;

  return (
    <Card className="budget-insights-card">
      <style jsx>{`
        .budget-insights-card {
          background: linear-gradient(145deg, 
            rgba(15, 23, 42, 0.98) 0%,
            rgba(30, 41, 59, 0.95) 50%,
            rgba(51, 65, 85, 0.92) 100%
          );
          backdrop-filter: blur(30px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          box-shadow: 
            0 12px 32px rgba(0, 0, 0, 0.4),
            0 0 60px rgba(37, 99, 235, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }
        
        .insights-title {
          color: #f8fafc !important;
          font-weight: 700;
          font-size: 1.25rem;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }
        
        .insights-overall-percentage {
          font-weight: 800;
          font-size: 1.5rem;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
          /* color: #f8fafc !important; Removed specific color to allow dynamic class */
        }
        
        .insights-overall-label {
          color: #cbd5e1 !important;
          font-weight: 600;
          font-size: 0.875rem;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
        }
        
        .insights-overall-sublabel {
          color: #94a3b8 !important;
          font-weight: 500;
          font-size: 0.75rem;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
        }
        
        .insights-stat-number {
          color: #f1f5f9 !important;
          font-weight: 800;
          font-size: 2rem;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
        }
        
        .insights-stat-label {
          color: #cbd5e1 !important;
          font-weight: 600;
          font-size: 0.875rem;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
        }
        
        .insights-section-title {
          color: #e2e8f0 !important;
          font-weight: 700;
          font-size: 1rem;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }
        
        .insights-spending-name { /* Old style, kept for completeness, but not used by new top spending items */
          color: #f1f5f9 !important;
          font-weight: 600;
          font-size: 0.875rem;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
        }
        
        .insights-spending-category { /* Old style, kept for completeness, but not used by new top spending items */
          color: #94a3b8 !important;
          font-weight: 500;
          font-size: 0.75rem;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
          text-transform: capitalize;
        }
        
        .insights-spending-amount { /* Old style, kept for completeness, but not used by new top spending items */
          color: #f1f5f9 !important;
          font-weight: 700;
          font-size: 0.875rem;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
        }
        
        .insights-spending-percentage { /* Old style, kept for completeness, but not used by new top spending items */
          color: #94a3b8 !important;
          font-weight: 600;
          font-size: 0.75rem;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
        }
        
        /* Enhanced Status Items */
        .status-item {
          background: linear-gradient(135deg, 
            rgba(51, 65, 85, 0.3) 0%,
            rgba(30, 41, 59, 0.2) 100%
          );
          border-radius: 12px;
          padding: 0.75rem;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.05); /* subtle border */
        }
        
        .status-item-exceeded {
          border: 1px solid rgba(239, 68, 68, 0.3);
          background: linear-gradient(135deg, 
            rgba(239, 68, 68, 0.15) 0%,
            rgba(220, 38, 38, 0.1) 100%
          );
        }
        
        .status-item-warning {
          border: 1px solid rgba(245, 158, 11, 0.3);
          background: linear-gradient(135deg, 
            rgba(245, 158, 11, 0.15) 0%,
            rgba(217, 119, 6, 0.1) 100%
          );
        }
        
        .status-item-healthy {
          border: 1px solid rgba(16, 185, 129, 0.3);
          background: linear-gradient(135deg, 
            rgba(16, 185, 129, 0.15) 0%,
            rgba(5, 150, 105, 0.1) 100%
          );
        }
        
        .status-text-exceeded {
          color: #fca5a5 !important;
          font-weight: 600;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
        }
        
        .status-text-warning {
          color: #fcd34d !important;
          font-weight: 600;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
        }
        
        .status-text-healthy {
          color: #6ee7b7 !important;
          font-weight: 600;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
        }

        /* Old Enhanced Top Spending Section - now obsolete */
        .top-spending-item {
          background: linear-gradient(135deg, 
            rgba(51, 65, 85, 0.4) 0%,
            rgba(30, 41, 59, 0.3) 100%
          );
          border-radius: 12px;
          padding: 1rem;
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          transition: all 0.3s ease;
        }
        
        .top-spending-item:hover {
          background: linear-gradient(135deg, 
            rgba(51, 65, 85, 0.6) 0%,
            rgba(30, 41, 59, 0.5) 100%
          );
          border: 1px solid rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
        }
        
        .spending-name {
          color: #f1f5f9 !important;
          font-weight: 700;
          font-size: 0.95rem;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
          line-height: 1.3;
          margin-bottom: 0.25rem;
        }
        
        .spending-category {
          color: #94a3b8 !important;
          font-weight: 500;
          font-size: 0.75rem;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
          text-transform: capitalize;
          margin-bottom: 0.5rem;
        }
        
        .spending-amount {
          color: #f1f5f9 !important;
          font-weight: 800;
          font-size: 1.1rem;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
        }
        
        .spending-percentage {
          font-weight: 700;
          font-size: 0.85rem;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
          margin-top: 0.25rem;
        }
        
        .spending-percentage-safe {
          color: #34d399 !important;
        }
        
        .spending-percentage-warning {
          color: #fbbf24 !important;
        }
        
        .spending-percentage-danger {
          color: #f87171 !important;
        }
        
        .spending-progress-bar {
          width: 100%;
          height: 4px;
          background: rgba(51, 65, 85, 0.5);
          border-radius: 2px;
          margin-top: 0.5rem;
          overflow: hidden;
        }
        
        .spending-progress-fill {
          height: 100%;
          transition: width 0.8s ease;
          border-radius: 2px;
        }
        
        .progress-safe {
          background: linear-gradient(90deg, #10b981, #34d399);
        }
        
        .progress-warning {
          background: linear-gradient(90deg, #f59e0b, #fbbf24);
        }
        
        .progress-danger {
          background: linear-gradient(90deg, #ef4444, #f87171);
        }
      `}</style>

      <CardHeader>
        <CardTitle className="insights-title flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-400" />
          Budget Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Status */}
        <div className="text-center p-4 status-item rounded-lg">
          <div className="flex items-center justify-center gap-2 mb-2">
            <StatusIcon className={`w-6 h-6 ${overall.color}`} />
            <span className={`insights-overall-percentage ${overall.color}`}>
              {overallPercentage.toFixed(0)}%
            </span>
          </div>
          <p className="insights-overall-label">Overall Budget Usage</p>
          <p className="insights-overall-sublabel mt-1">
            ${totalSpent.toFixed(0)} of ${totalBudgetAmount.toFixed(0)}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-center">
            <p className="insights-stat-number text-green-400">{activeBudgets}</p>
            <p className="insights-stat-label">On Track</p>
          </div>
          <div className="text-center">
            <p className="insights-stat-number text-red-400">{exceededBudgets}</p>
            <p className="insights-stat-label">Exceeded</p>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="space-y-3">
          <h4 className="insights-section-title">Budget Status</h4>
          
          {exceededBudgets > 0 && (
            <div className="status-item status-item-exceeded flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="status-text-exceeded">Exceeded</span>
              </div>
              <Badge className="bg-red-500/20 text-red-200 border-red-500/30 font-bold">{exceededBudgets}</Badge>
            </div>
          )}
          
          {warningBudgets > 0 && (
            <div className="status-item status-item-warning flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span className="status-text-warning">Near Limit</span>
              </div>
              <Badge className="bg-amber-500/20 text-amber-200 border-amber-500/30 font-bold">{warningBudgets}</Badge>
            </div>
          )}
          
          {activeBudgets > 0 && (
            <div className="status-item status-item-healthy flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="status-text-healthy">Healthy</span>
              </div>
              <Badge className="bg-green-500/20 text-green-200 border-green-500/30 font-bold">{activeBudgets}</Badge>
            </div>
          )}
        </div>

        {/* Enhanced Top Spending Categories - FULLY FUNCTIONAL */}
        {budgets.length > 0 && (
          <div className="space-y-3">
            <h4 className="insights-section-title">Top Spending</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
              {budgets
                .sort((a, b) => (b.usage?.spent || 0) - (a.usage?.spent || 0))
                .slice(0, 5)
                .map((budget, index) => {
                  const percentage = budget.usage?.percentage || 0;
                  const spent = budget.usage?.spent || 0;
                  const amount = budget.amount || 0;
                  
                  const getStatusColor = () => {
                    if (percentage >= 100) return 'text-red-400';
                    if (percentage >= 80) return 'text-yellow-400';
                    return 'text-green-400';
                  };
                  
                  const getBgColor = () => {
                    if (percentage >= 100) return 'bg-red-500/10 border-red-500/20';
                    if (percentage >= 80) return 'bg-yellow-500/10 border-yellow-500/20';
                    return 'bg-green-500/10 border-green-500/20';
                  };
                  
                  return (
                    <div 
                      key={budget.id || index} 
                      className={`p-3 rounded-lg border backdrop-blur-sm transition-all hover:scale-[1.02] ${getBgColor()}`}
                    >
                      {/* Top Row: Name & Amount */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h6 className="font-semibold text-white text-sm truncate">
                            {budget.name || 'Unnamed Budget'}
                          </h6>
                          <p className="text-xs text-gray-400 capitalize">
                            {(budget.category || 'other').replace(/_/g, ' ')}
                          </p>
                        </div>
                        <div className="text-right ml-3">
                          <p className="font-bold text-white text-sm">
                            ${spent.toFixed(0)}
                          </p>
                          <p className={`text-xs font-semibold ${getStatusColor()}`}>
                            {percentage.toFixed(0)}%
                          </p>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            percentage >= 100 ? 'bg-red-500' :
                            percentage >= 80 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ 
                            width: `${Math.min(percentage, 100)}%`,
                            boxShadow: `0 0 10px ${
                              percentage >= 100 ? 'rgba(239, 68, 68, 0.5)' :
                              percentage >= 80 ? 'rgba(245, 158, 11, 0.5)' :
                              'rgba(34, 197, 94, 0.5)'
                            }`
                          }}
                        />
                      </div>
                      
                      {/* Budget Info */}
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-400">
                          Budget: ${amount.toFixed(0)}
                        </span>
                        <span className={`font-medium ${
                          spent <= amount ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {spent <= amount ? 
                            `$${(amount - spent).toFixed(0)} left` : 
                            `$${(spent - amount).toFixed(0)} over`
                          }
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
            
            {/* Show All Button if more than 5 budgets */}
            {budgets.length > 5 && (
              <button 
                onClick={() => window.location.href = '/Budgets'}
                className="w-full mt-3 p-2 text-sm text-blue-400 hover:text-blue-300 border border-blue-500/30 hover:border-blue-400/50 rounded-lg transition-all hover:bg-blue-500/10"
              >
                View All {budgets.length} Budgets →
              </button>
            )}
          </div>
        )}

        {/* Empty State */}
        {budgets.length === 0 && (
          <div className="text-center py-8">
            <Target className="w-12 h-12 mx-auto mb-4 text-gray-600" />
            <h3 className="text-lg font-semibold text-white mb-2">No Budget Data</h3>
            <p className="text-gray-400 mb-4">Create your first budget to see spending insights here.</p>
            <button 
              onClick={() => window.location.href = '/Budgets?new=true'}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
            >
              Create Budget
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
