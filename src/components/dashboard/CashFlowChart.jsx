import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TrendingUp, BarChart3, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { format, subDays, startOfDay, eachDayOfInterval } from "date-fns";

export default function CashFlowChart({ 
  transactions = [], 
  currency = "USD", 
  timeRange = "30days",
  onTimeRangeChange 
}) {
  const chartData = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];

    const days = timeRange === "7days" ? 7 : timeRange === "30days" ? 30 : 90;
    const endDate = new Date();
    const startDate = subDays(endDate, days - 1);
    
    const dateRange = eachDayOfInterval({ start: startDate, end: endDate });
    
    return dateRange.map(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayTransactions = transactions.filter(t => t.date === dateStr);
      
      const income = dayTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + (t.amount || 0), 0);
        
      const expenses = dayTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + (t.amount || 0), 0);
      
      const net = income - expenses;
      
      return {
        date: format(date, 'MMM dd'),
        fullDate: dateStr,
        income,
        expenses,
        net
      };
    });
  }, [transactions, timeRange]);

  const totals = useMemo(() => {
    return chartData.reduce((acc, day) => ({
      totalIncome: acc.totalIncome + day.income,
      totalExpenses: acc.totalExpenses + day.expenses,
      netCashFlow: acc.netCashFlow + day.net
    }), { totalIncome: 0, totalExpenses: 0, netCashFlow: 0 });
  }, [chartData]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-gray-300 text-sm">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className={`text-sm font-medium ${
              entry.dataKey === 'income' ? 'text-green-400' :
              entry.dataKey === 'expenses' ? 'text-red-400' : 'text-blue-400'
            }`}>
              {entry.dataKey === 'income' ? 'Income' :
               entry.dataKey === 'expenses' ? 'Expenses' : 'Net'}: {currency} {entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="section-card-future">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-cyan-400" />
          <div>
            <CardTitle className="section-title-future">Cash Flow Analysis</CardTitle>
            <p className="section-subtitle-future">Income vs Expenses over time</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-400">Net Cash Flow</p>
            <p className={`text-lg font-bold ${totals.netCashFlow >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {totals.netCashFlow >= 0 ? '+' : ''}{currency} {totals.netCashFlow.toFixed(2)}
            </p>
          </div>
          {onTimeRangeChange && (
            <Select value={timeRange} onValueChange={onTimeRangeChange}>
              <SelectTrigger className="w-32 bg-gray-800 border-gray-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="7days">7 Days</SelectItem>
                <SelectItem value="30days">30 Days</SelectItem>
                <SelectItem value="90days">90 Days</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-80"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickFormatter={(value) => `${currency} ${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#EF4444" 
                  strokeWidth={2}
                  dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="net" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        ) : (
          <div className="h-80 flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No transaction data available</p>
              <p className="text-sm text-gray-500">Add transactions to see cash flow chart</p>
            </div>
          </div>
        )}
        
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-700">
          <div className="text-center">
            <p className="text-sm text-gray-400">Total Income</p>
            <p className="text-lg font-bold text-green-400">
              {currency} {totals.totalIncome.toFixed(2)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-400">Total Expenses</p>
            <p className="text-lg font-bold text-red-400">
              {currency} {totals.totalExpenses.toFixed(2)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-400">Net Flow</p>
            <p className={`text-lg font-bold ${totals.netCashFlow >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {totals.netCashFlow >= 0 ? '+' : ''}{currency} {totals.netCashFlow.toFixed(2)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}