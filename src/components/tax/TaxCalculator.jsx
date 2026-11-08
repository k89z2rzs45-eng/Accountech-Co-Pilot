import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calculator, Wand2 } from 'lucide-react';

export default function TaxCalculator({ transactions, jurisdiction, defaultCurrency }) {
  const [manualIncome, setManualIncome] = useState('');
  const [manualExpenses, setManualExpenses] = useState('');
  const [estimatedTax, setEstimatedTax] = useState(null);

  const { totalIncome, totalDeductibleExpenses } = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return { totalIncome: 0, totalDeductibleExpenses: 0 };
    }
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions
      .filter(t => t.type === 'expense' && t.tax_deductible)
      .reduce((sum, t) => sum + t.amount, 0);
    return { totalIncome: income, totalDeductibleExpenses: expenses };
  }, [transactions]);

  const calculateTax = () => {
    const income = parseFloat(manualIncome) || totalIncome;
    const expenses = parseFloat(manualExpenses) || totalDeductibleExpenses;
    const taxableIncome = income - expenses;
    
    // Simplified tax rate logic
    const taxRate = jurisdiction === 'US' ? 0.21 : jurisdiction === 'UK' ? 0.19 : jurisdiction === 'CA' ? 0.15 : 0.20;
    const tax = taxableIncome > 0 ? taxableIncome * taxRate : 0;
    setEstimatedTax(tax);
  };

  return (
    <Card className="premium-card h-full">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-white sharp-text flex items-center gap-2">
          <Calculator className="w-5 h-5 text-orange-400" />
          Quick Tax Estimator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-gray-400">Total Income (YTD)</Label>
          <Input 
            type="number" 
            value={manualIncome}
            onChange={(e) => setManualIncome(e.target.value)}
            placeholder={`${defaultCurrency} ${totalIncome.toFixed(2)}`}
            className="bg-white/5 border-white/20 text-white mt-1"
          />
        </div>
        <div>
          <Label className="text-gray-400">Deductible Expenses (YTD)</Label>
          <Input 
            type="number" 
            value={manualExpenses}
            onChange={(e) => setManualExpenses(e.target.value)}
            placeholder={`${defaultCurrency} ${totalDeductibleExpenses.toFixed(2)}`}
            className="bg-white/5 border-white/20 text-white mt-1"
          />
        </div>
        <Button onClick={calculateTax} className="w-full premium-button">
          <Wand2 className="w-4 h-4 mr-2" />
          Estimate Tax
        </Button>
        {estimatedTax !== null && (
          <div className="p-4 bg-blue-500/10 rounded-lg text-center mt-4">
            <p className="text-sm text-blue-400">Estimated Tax Owed</p>
            <p className="text-2xl font-bold text-white sharp-text">
              {defaultCurrency} {estimatedTax.toFixed(2)}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}