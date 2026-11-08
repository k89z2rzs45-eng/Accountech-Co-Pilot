import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis } from "recharts";
import { TrendingDown, DollarSign, Package } from "lucide-react";
import { motion } from "framer-motion";

const CATEGORY_COLORS = {
  office_supplies: '#3b82f6',
  travel: '#8b5cf6',
  utilities: '#10b981',
  software: '#f59e0b',
  marketing: '#ef4444',
  meals: '#06b6d4',
  professional_services: '#84cc16',
  equipment: '#f97316',
  rent: '#6366f1',
  insurance: '#ec4899',
  taxes: '#64748b',
  other: '#9ca3af'
};

export default function ExpenseBreakdown({ 
  transactions = [], 
  currency = "USD", 
  showChart = true,
  period = "all"
}) {
  const expenseData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense' && t.currency === currency);
    
    // Group by category
    const categoryTotals = expenses.reduce((acc, t) => {
      const category = t.category || 'other';
      if (!acc[category]) {
        acc[category] = { 
          category, 
          amount: 0, 
          count: 0,
          percentage: 0
        };
      }
      acc[category].amount += t.amount || 0;
      acc[category].count += 1;
      return acc;
    }, {});

    const data = Object.values(categoryTotals);
    const totalExpenses = data.reduce((sum, cat) => sum + cat.amount, 0);
    
    // Calculate percentages and sort by amount
    return data
      .map(cat => ({
        ...cat,
        percentage: totalExpenses > 0 ? (cat.amount / totalExpenses * 100) : 0,
        color: CATEGORY_COLORS[cat.category] || CATEGORY_COLORS.other,
        name: cat.category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions, currency]);

  const totalExpenses = expenseData.reduce((sum, cat) => sum + cat.amount, 0);
  const topCategory = expenseData[0];
  const categoryCount = expenseData.length;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-white font-semibold">{data.name}</p>
          <p className="text-gray-300">
            Amount: <span className="text-green-400">{currency} {data.amount.toFixed(2)}</span>
          </p>
          <p className="text-gray-300">
            Percentage: <span className="text-blue-400">{data.percentage.toFixed(1)}%</span>
          </p>
          <p className="text-gray-300">
            Transactions: <span className="text-purple-400">{data.count}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  if (expenseData.length === 0) {
    return (
      <Card className="revolutionary-expense-card">
        <style jsx>{`
          .revolutionary-expense-card {
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
              0 0 40px rgba(239, 68, 68, 0.1);
          }
        `}</style>
        
        <CardContent className="p-8 text-center">
          <TrendingDown className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-300 mb-2">No Expenses Found</h3>
          <p className="text-gray-500">Start tracking your expenses to see the breakdown</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="revolutionary-expense-card">
      <style jsx>{`
        .revolutionary-expense-card {
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
            0 0 40px rgba(239, 68, 68, 0.1);
          position: relative;
          overflow: hidden;
        }
        
        .revolutionary-expense-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, 
            rgba(239, 68, 68, 0.05) 0%,
            rgba(245, 158, 11, 0.03) 50%,
            rgba(139, 92, 246, 0.05) 100%
          );
          z-index: 1;
        }
        
        .expense-stat-card {
          background: linear-gradient(135deg, 
            rgba(239, 68, 68, 0.1) 0%,
            rgba(245, 158, 11, 0.08) 100%
          );
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 12px;
          padding: 1rem;
          backdrop-filter: blur(10px);
          position: relative;
          z-index: 10;
        }
        
        .category-item {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 0.75rem;
          transition: all 0.3s ease;
        }
        
        .category-item:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-1px);
        }
      `}</style>

      <CardHeader className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-white">Expense Breakdown</CardTitle>
              <p className="text-sm text-gray-400">
                {categoryCount} categories • {currency} {totalExpenses.toFixed(2)} total
              </p>
            </div>
          </div>
          
          {topCategory && (
            <div className="text-right">
              <p className="text-sm text-gray-400">Top Category</p>
              <p className="font-semibold text-white">{topCategory.name}</p>
              <p className="text-red-400 font-bold">
                {topCategory.percentage.toFixed(1)}%
              </p>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="relative z-10 space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="expense-stat-card">
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-red-400" />
              <div>
                <p className="text-sm text-gray-400">Total Expenses</p>
                <p className="font-bold text-lg text-white">
                  {currency} {totalExpenses.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="expense-stat-card">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-orange-400" />
              <div>
                <p className="text-sm text-gray-400">Categories</p>
                <p className="font-bold text-lg text-white">{categoryCount}</p>
              </div>
            </div>
          </div>
          
          <div className="expense-stat-card">
            <div className="flex items-center gap-3">
              <TrendingDown className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-sm text-gray-400">Avg per Category</p>
                <p className="font-bold text-lg text-white">
                  {currency} {categoryCount > 0 ? (totalExpenses / categoryCount).toFixed(2) : '0.00'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {showChart && expenseData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div className="expense-stat-card">
              <h4 className="font-semibold text-white mb-4">Distribution</h4>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={expenseData.slice(0, 8)} // Show top 8 categories
                    dataKey="amount"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={30}
                  >
                    {expenseData.slice(0, 8).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    wrapperStyle={{ color: '#f1f5f9', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart */}
            <div className="expense-stat-card">
              <h4 className="font-semibold text-white mb-4">Top Categories</h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={expenseData.slice(0, 6)}>
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#9ca3af', fontSize: 10 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    tick={{ fill: '#9ca3af', fontSize: 10 }}
                    tickFormatter={(value) => `${currency} ${value.toFixed(0)}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                    {expenseData.slice(0, 6).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Category List */}
        <div className="expense-stat-card">
          <h4 className="font-semibold text-white mb-4">All Categories</h4>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {expenseData.map((category, index) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="category-item"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    />
                    <div>
                      <p className="font-medium text-white">{category.name}</p>
                      <p className="text-xs text-gray-400">
                        {category.count} transaction{category.count !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-semibold text-white">
                      {currency} {category.amount.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {category.percentage.toFixed(1)}%
                    </p>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="mt-2">
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <div 
                      className="h-1.5 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${category.percentage}%`,
                        backgroundColor: category.color
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}