import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, TrendingUp, AlertTriangle, Edit, Trash2, Calendar } from "lucide-react";
import { motion } from "framer-motion";

export default function BudgetCard({ 
  budget, 
  spent = 0, 
  transactions = [],
  onEdit, 
  onDelete,
  index = 0
}) {
  // Calculate progress and status
  const progress = budget.amount > 0 ? Math.min((spent / budget.amount) * 100, 100) : 0;
  const remaining = Math.max(budget.amount - spent, 0);
  const isOverBudget = spent > budget.amount;
  const isNearThreshold = progress >= (budget.alert_threshold || 80);

  // Get status color and icon
  const getStatusInfo = () => {
    if (isOverBudget) {
      return {
        color: "text-red-400",
        bgColor: "bg-red-500/20 border-red-500/30",
        icon: <AlertTriangle className="w-4 h-4" />,
        status: "Over Budget"
      };
    } else if (isNearThreshold) {
      return {
        color: "text-yellow-400",
        bgColor: "bg-yellow-500/20 border-yellow-500/30",
        icon: <AlertTriangle className="w-4 h-4" />,
        status: "Near Limit"
      };
    } else {
      return {
        color: "text-green-400",
        bgColor: "bg-green-500/20 border-green-500/30",
        icon: <TrendingUp className="w-4 h-4" />,
        status: "On Track"
      };
    }
  };

  const statusInfo = getStatusInfo();

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const getProgressBarColor = () => {
    if (isOverBudget) return "bg-red-500";
    if (isNearThreshold) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4, scale: 1.02 }}
    >
      <Card className="revolutionary-budget-card">
        <style jsx>{`
          .revolutionary-budget-card {
            background: linear-gradient(145deg, 
              rgba(15, 23, 42, 0.9) 0%,
              rgba(30, 41, 59, 0.8) 50%,
              rgba(51, 65, 85, 0.9) 100%
            );
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            backdrop-filter: blur(20px);
            box-shadow: 
              0 8px 32px rgba(0, 0, 0, 0.3),
              0 0 40px rgba(16, 185, 129, 0.1);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
          }
          
          .revolutionary-budget-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, 
              rgba(245, 158, 11, 0.05) 0%,
              rgba(16, 185, 129, 0.03) 50%,
              rgba(59, 130, 246, 0.05) 100%
            );
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 1;
          }
          
          .revolutionary-budget-card:hover::before {
            opacity: 1;
          }
          
          .revolutionary-budget-card:hover {
            border: 1px solid rgba(245, 158, 11, 0.3);
            box-shadow: 
              0 12px 40px rgba(0, 0, 0, 0.4),
              0 0 60px rgba(245, 158, 11, 0.2);
          }
          
          .budget-progress-bar {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            overflow: hidden;
            position: relative;
          }
          
          .budget-progress-fill {
            height: 8px;
            border-radius: 8px;
            transition: all 0.5s ease;
            background: linear-gradient(90deg, 
              rgba(245, 158, 11, 0.8) 0%,
              rgba(16, 185, 129, 0.9) 50%,
              rgba(59, 130, 246, 0.8) 100%
            );
            position: relative;
          }
          
          .budget-progress-fill.over-budget {
            background: linear-gradient(90deg, #ef4444, #dc2626);
          }
          
          .budget-progress-fill.near-threshold {
            background: linear-gradient(90deg, #f59e0b, #d97706);
          }
          
          .budget-amount {
            font-size: 1.5rem;
            font-weight: 800;
            background: linear-gradient(45deg, #ffffff, #f1f5f9);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          
          .category-badge {
            background: linear-gradient(135deg, 
              rgba(245, 158, 11, 0.2) 0%,
              rgba(16, 185, 129, 0.15) 100%
            );
            border: 1px solid rgba(245, 158, 11, 0.3);
            color: #fbbf24;
            font-weight: 600;
            font-size: 0.75rem;
            padding: 0.25rem 0.75rem;
            border-radius: 12px;
            backdrop-filter: blur(10px);
          }
        `}</style>

        <CardHeader className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-green-500 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-white">
                  {budget.name || 'Unnamed Budget'}
                </CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <span className="category-badge">
                    {(budget.category || 'other').replace(/_/g, ' ')}
                  </span>
                  <Badge className={statusInfo.bgColor}>
                    {statusInfo.icon}
                    <span className="ml-1">{statusInfo.status}</span>
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onEdit && onEdit(budget)}
                className="text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete && onDelete(budget)}
                className="text-gray-400 hover:text-red-400 hover:bg-red-900/20"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative z-10 space-y-4">
          {/* Budget Amount */}
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-400">Budget</p>
              <p className="budget-amount">
                {budget.currency || 'USD'} {(budget.amount || 0).toFixed(2)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Spent</p>
              <p className={`text-lg font-bold ${statusInfo.color}`}>
                {budget.currency || 'USD'} {spent.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Progress</span>
              <span className={`text-sm font-semibold ${statusInfo.color}`}>
                {progress.toFixed(1)}%
              </span>
            </div>
            <div className="budget-progress-bar">
              <div 
                className={`budget-progress-fill ${
                  isOverBudget ? 'over-budget' : 
                  isNearThreshold ? 'near-threshold' : ''
                }`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>

          {/* Remaining Amount */}
          <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Remaining</p>
              <p className={`font-bold ${remaining > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {budget.currency || 'USD'} {remaining.toFixed(2)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 uppercase tracking-wide">Period</p>
              <p className="text-sm text-gray-300 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(budget.start_date)} - {formatDate(budget.end_date)}
              </p>
            </div>
          </div>

          {/* Alert Threshold Warning */}
          {isNearThreshold && !isOverBudget && (
            <div className="flex items-center gap-2 p-2 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              <p className="text-xs text-yellow-300">
                You've reached {budget.alert_threshold}% of your budget limit
              </p>
            </div>
          )}

          {isOverBudget && (
            <div className="flex items-center gap-2 p-2 bg-red-900/20 border border-red-500/30 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <p className="text-xs text-red-300">
                Budget exceeded by {budget.currency} {(spent - budget.amount).toFixed(2)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}