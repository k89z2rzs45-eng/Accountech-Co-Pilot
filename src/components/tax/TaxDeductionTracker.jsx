import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tag, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function TaxDeductionTracker({ transactions, defaultCurrency }) {
  const categoryTotals = transactions.reduce((acc, t) => {
    if (t.type === 'expense' && t.tax_deductible) {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
    }
    return acc;
  }, {});

  const sortedCategories = Object.entries(categoryTotals).sort(([, a], [, b]) => b - a);

  return (
    <Card className="premium-card h-full">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-white sharp-text flex items-center gap-2">
          <Tag className="w-5 h-5 text-teal-400" />
          Deductible Expense Tracker
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedCategories.length > 0 ? (
          <ScrollArea className="h-72">
            <div className="space-y-3 pr-4">
              {sortedCategories.map(([category, amount]) => (
                <div key={category} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                  <span className="text-sm font-medium text-gray-300 capitalize">{category.replace(/_/g, ' ')}</span>
                  <Badge variant="secondary" className="bg-teal-400/20 text-teal-300">
                    {defaultCurrency} {amount.toFixed(2)}
                  </Badge>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="h-72 flex flex-col items-center justify-center text-center text-gray-500">
            <Tag className="w-10 h-10 mb-4" />
            <h3 className="font-semibold text-gray-300">No Deductible Expenses</h3>
            <p className="text-sm mt-1">Mark expenses as tax deductible to track them here.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}