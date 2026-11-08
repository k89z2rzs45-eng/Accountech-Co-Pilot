
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { DollarSign } from "lucide-react";

export default function CashFlowForecast({ data }) {
  if (!data || data.length === 0) {
    return (
      <Card className="futuristic-chart-card">
        <style jsx>{`
          .futuristic-chart-card {
            background: linear-gradient(145deg, 
              rgba(15, 23, 42, 0.98) 0%,
              rgba(30, 41, 59, 0.96) 25%,
              rgba(51, 65, 85, 0.94) 50%,
              rgba(30, 41, 59, 0.96) 75%,
              rgba(15, 23, 42, 0.98) 100%
            );
            backdrop-filter: blur(30px);
            border: 2px solid transparent;
            border-image: linear-gradient(45deg, #00ffff, #ff00ff, #00ff00, #00ffff) 1;
            border-radius: 20px;
            box-shadow: 
              0 20px 40px rgba(0, 0, 0, 0.4),
              0 0 80px rgba(0, 255, 255, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
            position: relative;
            overflow: hidden;
            transition: all 0.4s ease;
          }
          
          .chart-title {
            color: #f8fafc !important;
            font-weight: 700;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
          }
          
          .chart-content {
            position: relative;
            z-index: 2;
          }
          
          .no-data-text {
            color: #94a3b8 !important;
            font-weight: 500;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
          }
        `}</style>
        <CardHeader>
          <CardTitle className="chart-title text-lg font-semibold flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-blue-400" />
            Cash Flow Forecast
          </CardTitle>
        </CardHeader>
        <CardContent className="chart-content">
          <div className="h-96 flex items-center justify-center no-data-text">
            Generate forecasts to view cash flow projections
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="futuristic-chart-card">
      <style jsx>{`
        .futuristic-chart-card {
          background: linear-gradient(145deg, 
            rgba(15, 23, 42, 0.98) 0%,
            rgba(30, 41, 59, 0.96) 25%,
            rgba(51, 65, 85, 0.94) 50%,
            rgba(30, 41, 59, 0.96) 75%,
            rgba(15, 23, 42, 0.98) 100%
          );
          backdrop-filter: blur(30px);
          border: 2px solid transparent;
          border-image: linear-gradient(45deg, #00ffff, #ff00ff, #00ff00, #00ffff) 1;
          border-radius: 20px;
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.4),
            0 0 80px rgba(0, 255, 255, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          position: relative;
          overflow: hidden;
          transition: all 0.4s ease;
        }
        
        .chart-title {
          color: #f8fafc !important;
          font-weight: 700;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
        }
        
        .chart-content {
          position: relative;
          z-index: 2;
        }
      `}</style>
      <CardHeader>
        <CardTitle className="chart-title text-lg font-semibold flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-blue-400" />
          12-Month Cash Flow Forecast
        </CardTitle>
      </CardHeader>
      <CardContent className="chart-content">
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis 
              dataKey="month" 
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#94a3b8"
              fontSize={12}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              formatter={(value, name) => {
                const formattedValue = `$${value.toLocaleString()}`;
                const labels = {
                  revenue: 'Revenue',
                  expenses: 'Expenses', 
                  cash_balance: 'Cash Balance'
                };
                return [formattedValue, labels[name] || name];
              }}
              labelStyle={{ color: '#f1f5f9', fontWeight: 'bold' }}
              contentStyle={{
                background: 'rgba(15, 23, 42, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(0, 255, 255, 0.3)',
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                color: '#e2e8f0'
              }}
            />
            <Legend />
            <Bar dataKey="revenue" fill="#10b981" name="Revenue" />
            <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
            <Line 
              type="monotone" 
              dataKey="cash_balance" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              name="Cash Balance"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
