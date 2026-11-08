
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, X, DollarSign, Calendar, Tag } from "lucide-react";
import SmartCategoryButton from "../transactions/SmartCategoryButton";

const CATEGORIES = [
  "office_supplies", "travel", "utilities", "software", "marketing", 
  "meals", "professional_services", "equipment", "rent", "insurance", 
  "taxes", "sales", "consulting", "other"
];

export default function QuickAddModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  defaultCurrency = "USD" 
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactionData, setTransactionData] = useState({
    type: "expense",
    amount: "",
    description: "",
    category: "other",
    date: new Date().toISOString().split('T')[0],
    currency: defaultCurrency,
    vendor: "",
    tax_deductible: false,
    notes: "",
    status: "pending"
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { Transaction } = await import("@/api/entities");
      await Transaction.create({
        ...transactionData,
        amount: parseFloat(transactionData.amount)
      });
      
      if (onSuccess) onSuccess();
      onClose();
      
      // Reset form
      setTransactionData({
        type: "expense",
        amount: "",
        description: "",
        category: "other",
        date: new Date().toISOString().split('T')[0],
        currency: defaultCurrency,
        vendor: "",
        tax_deductible: false,
        notes: "",
        status: "pending"
      });
    } catch (error) {
      console.error('Error creating transaction:', error);
      alert('Error creating transaction. Please try again.');
    }
    setIsSubmitting(false);
  };

  const handleChange = (field, value) => {
    setTransactionData(prev => ({ ...prev, [field]: value }));
  };

  const handleSmartCategory = (suggestedCategory) => {
    setTransactionData(prev => ({ ...prev, category: suggestedCategory }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="neuro-card max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Plus className="w-6 h-6 text-indigo-600" />
            Quick Add Transaction
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Type</Label>
              <Select value={transactionData.type} onValueChange={(value) => handleChange('type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={transactionData.amount}
                  onChange={(e) => handleChange('amount', e.target.value)}
                  className="pl-10"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={transactionData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="What was this transaction for?"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={transactionData.category} onValueChange={(value) => handleChange('category', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {cat.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* Smart Categorization for Quick Add */}
              {(transactionData.description || transactionData.vendor) && (
                <div className="mt-2">
                  <SmartCategoryButton
                    transaction={transactionData}
                    onCategoryUpdate={handleSmartCategory}
                    currentCategory={transactionData.category}
                  />
                </div>
              )}
            </div>
            
            <div>
              <Label htmlFor="date">Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="date"
                  type="date"
                  value={transactionData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="vendor">Vendor/Client (Optional)</Label>
            <Input
              id="vendor"
              value={transactionData.vendor}
              onChange={(e) => handleChange('vendor', e.target.value)}
              placeholder="Where was this transaction?"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="tax_deductible"
              checked={transactionData.tax_deductible}
              onCheckedChange={(checked) => handleChange('tax_deductible', checked)}
            />
            <Label htmlFor="tax_deductible" className="text-sm">
              This transaction is tax deductible
            </Label>
          </div>

          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={transactionData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Any additional notes..."
              rows={2}
            />
          </div>
        </form>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="neuro-button-primary"
          >
            {isSubmitting ? 'Adding...' : 'Add Transaction'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
