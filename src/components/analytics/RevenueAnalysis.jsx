
import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";
import { format, startOfMonth, eachMonthOfInterval, subMonths } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export default function RevenueAnalysis({ transactions, timeRange, isLoading, currency }) {
  const revenueData = useMemo(() => {
    console.log('RevenueAnalysis received:', { 
      transactionCount: transactions?.length || 0, 
      timeRange, 
      currency,
      sampleTransaction: transactions?.[0]
    });

    if (isLoading || !transactions || !transactions.length) {
      console.log('RevenueAnalysis: No data available');
      return [];
    }

    const months = eachMonthOfInterval({
      start: subMonths(new Date(), timeRange === "1year" ? 12 : timeRange === "6months" ? 6 : 3),
      end: new Date()
    });

    const data = months.map(month => {
      const monthRevenue = transactions
        .filter(t => {
          const isIncome = t.type === 'income';
          const matchesMonth = format(new Date(t.date), 'yyyy-MM') === format(month, 'yyyy-MM');
          return isIncome && matchesMonth;
        })
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        month: format(month, 'MMM yyyy'),
        revenue: monthRevenue,
        shortMonth: format(month, 'MMM')
      };
    });

    console.log('RevenueAnalysis data generated:', data);
    return data;
  }, [transactions, timeRange, isLoading]);

  if (isLoading) {
    return (
      <Card className="premium-card">
        <CardHeader>
          <Skeleton className="h-6 w-32 bg-white/10" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full bg-white/10" />
        </CardContent>
      </Card>
    );
  }

  // Show message if no data
  if (!revenueData || revenueData.length === 0) {
    return (
      <Card className="premium-card">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-white sharp-text flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            Revenue Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-gray-400">
            <p>No revenue data available for the selected period</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="premium-card">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-white sharp-text flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-400" />
          Revenue Trend ({currency})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData}>
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
              formatter={(value) => [`${currency === 'USD' ? '$' : currency} ${value.toLocaleString()}`, 'Revenue']}
              labelFormatter={(label, payload) => payload[0]?.payload?.month || label}
              contentStyle={{
                background: 'rgba(22, 27, 34, 0.9)',
                border: '1px solid rgba(139, 148, 158, 0.2)',
                borderRadius: '8px',
                color: '#c9d1d9'
              }}
              cursor={{ fill: 'rgba(139, 148, 158, 0.1)' }}
            />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#22c55e" 
              strokeWidth={2}
              dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#16a34a' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
