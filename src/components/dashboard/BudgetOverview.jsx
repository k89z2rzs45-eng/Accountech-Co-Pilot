import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Target, AlertTriangle, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function BudgetOverview({ budgets = [], transactions = [], currency = "USD" }) {
  const calculateBudgetProgress = (budget) => {
    if (!budget || !transactions) return { spent: 0, percentage: 0, remaining: budget?.amount || 0 };

    const spent = transactions
      .filter(t => 
        t.type === 'expense' && 
        t.category === budget.category &&
        t.currency === budget.currency
      )
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    const percentage = budget.amount > 0 ? Math.min((spent / budget.amount) * 100, 100) : 0;
    const remaining = Math.max(budget.amount - spent, 0);

    return { spent, percentage, remaining };
  };

  const getStatusColor = (percentage) => {
    if (percentage >= 90) return "text-red-400";
    if (percentage >= 75) return "text-yellow-400";
    return "text-green-400";
  };

  const getStatusIcon = (percentage) => {
    if (percentage >= 90) return <AlertTriangle className="w-4 h-4 text-red-400" />;
    if (percentage >= 75) return <TrendingUp className="w-4 h-4 text-yellow-400" />;
    return <Target className="w-4 h-4 text-green-400" />;
  };

  if (!budgets || budgets.length === 0) {
    return (
      <div className="text-center py-8">
        <Target className="w-12 h-12 text-gray-500 mx-auto mb-4" />
        <p className="text-gray-400">No budgets set</p>
        <p className="text-sm text-gray-500 mt-1">Create budgets to track spending</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {budgets.slice(0, 4).map((budget, index) => {
        const { spent, percentage, remaining } = calculateBudgetProgress(budget);
        
        return (
          <motion.div
            key={budget.id || index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {getStatusIcon(percentage)}
                <span className="font-medium text-gray-200 capitalize">
                  {(budget.category || 'Unknown').replace(/_/g, ' ')}
                </span>
              </div>
              <Badge className={`${getStatusColor(percentage)} bg-transparent border-current`}>
                {percentage.toFixed(0)}%
              </Badge>
            </div>
            
            <Progress 
              value={percentage} 
              className="h-2 mb-2"
            />
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">
                Spent: {currency} {spent.toFixed(2)}
              </span>
              <span className="text-gray-400">
                Budget: {currency} {(budget.amount || 0).toFixed(2)}
              </span>
            </div>
            
            <div className="text-xs text-gray-500 mt-1">
              Remaining: {currency} {remaining.toFixed(2)}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}