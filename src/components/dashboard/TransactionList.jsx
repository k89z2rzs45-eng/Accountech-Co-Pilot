import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownRight, Receipt, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

export default function TransactionList({ 
  transactions = [], 
  isLoading = false, 
  currency = "USD",
  showDateRange = true,
  showQuickActions = true,
  onTransactionClick 
}) {
  const safeFormatDate = (dateString) => {
    try {
      if (!dateString) return 'No date';
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      income: "bg-green-500/20 text-green-300 border-green-500/30",
      expense: "bg-red-500/20 text-red-300 border-red-500/30",
      transfer: "bg-blue-500/20 text-blue-300 border-blue-500/30"
    };
    return colors[category] || "bg-gray-500/20 text-gray-300 border-gray-500/30";
  };

  const getTypeIcon = (type) => {
    return type === 'income' ? 
      <ArrowUpRight className="w-4 h-4 text-green-400" /> :
      <ArrowDownRight className="w-4 h-4 text-red-400" />;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array(5).fill(0).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-16 bg-gray-700/50 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <Receipt className="w-12 h-12 text-gray-500 mx-auto mb-4" />
        <p className="text-gray-400">No transactions found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.slice(0, 8).map((transaction, index) => (
        <motion.div
          key={transaction.id || index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 hover:bg-gray-800/70 transition-all cursor-pointer"
          onClick={() => onTransactionClick && onTransactionClick(transaction)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getTypeIcon(transaction.type)}
              <div>
                <p className="font-medium text-gray-200">
                  {transaction.description || 'No description'}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={getCategoryColor(transaction.category)}>
                    {(transaction.category || 'other').replace(/_/g, ' ')}
                  </Badge>
                  {showDateRange && (
                    <span className="text-xs text-gray-500">
                      {safeFormatDate(transaction.date)}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-bold text-lg ${
                transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
              }`}>
                {transaction.type === 'income' ? '+' : '-'}{currency} {Math.abs(transaction.amount || 0).toFixed(2)}
              </p>
              {transaction.vendor && (
                <p className="text-xs text-gray-500">{transaction.vendor}</p>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}