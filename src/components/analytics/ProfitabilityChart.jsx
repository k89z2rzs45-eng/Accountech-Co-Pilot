import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from "recharts";
import { BarChart3 } from "lucide-react";
import { format, eachMonthOfInterval, subMonths, startOfMonth } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfitabilityChart({ transactions, timeRange, isLoading, currency }) {
  const profitabilityData = useMemo(() => {
    if (isLoading || !transactions.length) return [];

    const months = eachMonthOfInterval({
      start: subMonths(new Date(), timeRange === "1year" ? 12 : timeRange === "6months" ? 6 : 3),
      end: new Date()
    });

    return months.map(month => {
      const monthTransactions = transactions.filter(t => 
        format(new Date(t.date), 'yyyy-MM') === format(month, 'yyyy-MM')
      );

      const revenue = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const expenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      const profit = revenue - expenses;

      return {
        month: format(month, 'MMM yyyy'),
        shortMonth: format(month, 'MMM'),
        revenue,
        expenses,
        profit
      };
    });
  }, [transactions, timeRange, isLoading]);

  if (isLoading) {
    return (
      <Card className="premium-card">
        <CardHeader>
          <Skeleton className="h-6 w-32 bg-white/10" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-80 w-full bg-white/10" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="premium-card">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-white sharp-text flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-purple-400" />
          Profitability Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={profitabilityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis 
              dataKey="shortMonth" 
              stroke="#9ca3af"
              fontSize={12}
            />
            <YAxis 
              stroke="#9ca3af"
              fontSize={12}
              tickFormatter={(value) => `${currency === 'USD' ? '$' : currency} ${value.toLocaleString()}`}
            />
            <Tooltip 
              formatter={(value, name) => [
                `${currency === 'USD' ? '$' : currency} ${value.toLocaleString()}`, 
                name.charAt(0).toUpperCase() + name.slice(1)
              ]}
              labelFormatter={(label, payload) => payload[0]?.payload?.month || label}
              contentStyle={{
                background: 'rgba(22, 27, 34, 0.9)',
                border: '1px solid rgba(139, 148, 158, 0.2)',
                borderRadius: '8px',
                color: '#c9d1d9'
              }}
              cursor={{ fill: 'rgba(139, 148, 158, 0.1)' }}
            />
            <Legend wrapperStyle={{ color: '#c9d1d9' }} />
            <ReferenceLine y={0} stroke="#6b7280" strokeDasharray="2 2" />
            <Bar dataKey="revenue" fill="#22c55e" name="Revenue" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" fill="#ef4444" name="Expenses" radius={[4, 4, 0, 0]} />
            <Bar dataKey="profit" fill="#3b82f6" name="Profit" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}