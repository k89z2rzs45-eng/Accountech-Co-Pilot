
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { motion, AnimatePresence } from "framer-motion";
import { Save, X, DollarSign, Calendar as CalendarIcon, Tag, FileText, Sparkles, Brain } from "lucide-react";
import { format } from "date-fns";

const TRANSACTION_CATEGORIES = {
  income: ["sales", "consulting", "freelance", "dividends", "interest", "refund", "other"],
  expense: ["office_supplies", "travel", "utilities", "software", "marketing", "meals", 
           "professional_services", "equipment", "rent", "insurance", "taxes", "other"],
  transfer: ["bank_transfer", "investment", "loan", "other"]
};

const CURRENCIES = ["USD", "GBP", "CAD", "EUR", "MMK", "JPY", "CNY", "INR", "SGD", "THB", "KRW"];

const PAYMENT_METHODS = ["cash", "credit_card", "debit_card", "bank_transfer", "check", "paypal", "stripe", "other"];

export default function TransactionForm({ 
  transaction, 
  onSubmit, 
  onCancel, 
  onDelete, 
  defaultCurrency = "USD" 
}) {
  const [formData, setFormData] = useState(transaction || {
    type: "expense",
    amount: "",
    description: "",
    category: "other",
    date: new Date().toISOString().split('T')[0],
    currency: defaultCurrency,
    vendor: "",
    tax_deductible: false,
    notes: "",
    status: "pending",
    payment_method: "credit_card",
    location: "",
    tags: []
  });

  const [showCalendar, setShowCalendar] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (transaction) {
      setFormData({
        ...transaction,
        date: transaction.date || new Date().toISOString().split('T')[0],
        amount: transaction.amount?.toString() || "",
        tags: transaction.tags || []
      });
    }
  }, [transaction]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTagsChange = (tagsString) => {
    const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    setFormData(prev => ({ ...prev, tags }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Validation
    if (!formData.description.trim()) {
      alert("Please enter a description");
      return;
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData = {
        ...formData,
        amount: parseFloat(formData.amount),
        tags: formData.tags || []
      };
      await onSubmit(submitData);
    } catch (error) {
      console.error('Transaction submission error:', error);
      alert('Failed to save transaction. Please try again.');
    }
    setIsSubmitting(false);
  };

  const availableCategories = TRANSACTION_CATEGORIES[formData.type] || [];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="revolutionary-transaction-form w-full max-w-2xl max-h-[90vh] overflow-hidden"
        >
          <style jsx>{`
            .revolutionary-transaction-form {
              background: linear-gradient(145deg, 
                rgba(15, 23, 42, 0.98) 0%,
                rgba(30, 41, 59, 0.96) 50%,
                rgba(51, 65, 85, 0.94) 100%
              );
              border: 2px solid transparent;
              border-image: linear-gradient(45deg, #10b981, #3b82f6, #8b5cf6) 1;
              border-radius: 24px;
              backdrop-filter: blur(30px);
              box-shadow: 
                0 25px 50px rgba(0, 0, 0, 0.5),
                0 0 80px rgba(16, 185, 129, 0.2),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
              position: relative;
              overflow: hidden;
            }
            
            .form-header-enhanced {
              background: linear-gradient(135deg, 
                rgba(16, 185, 129, 0.1) 0%,
                rgba(59, 130, 246, 0.08) 50%,
                rgba(139, 92, 246, 0.1) 100%
              );
              border-bottom: 1px solid rgba(255, 255, 255, 0.1);
              padding: 1.5rem;
              position: relative;
              z-index: 10;
            }
            
            .form-content-enhanced {
              position: relative;
              z-index: 10;
              max-height: 60vh;
              overflow-y: auto;
              padding: 1.5rem;
            }
            
            .form-content-enhanced::-webkit-scrollbar {
              width: 6px;
            }
            
            .form-content-enhanced::-webkit-scrollbar-track {
              background: rgba(255, 255, 255, 0.1);
              border-radius: 3px;
            }
            
            .form-content-enhanced::-webkit-scrollbar-thumb {
              background: linear-gradient(135deg, #10b981, #3b82f6);
              border-radius: 3px;
            }
            
            .enhanced-input {
              background: linear-gradient(135deg, 
                rgba(255, 255, 255, 0.08) 0%,
                rgba(255, 255, 255, 0.04) 100%
              );
              border: 1px solid rgba(255, 255, 255, 0.2);
              border-radius: 12px;
              color: rgba(255, 255, 255, 0.9);
              padding: 0.75rem 1rem;
              backdrop-filter: blur(10px);
              transition: all 0.3s ease;
            }
            
            .enhanced-input:focus {
              background: linear-gradient(135deg, 
                rgba(255, 255, 255, 0.12) 0%,
                rgba(255, 255, 255, 0.08) 100%
              );
              border: 1px solid rgba(16, 185, 129, 0.5);
              box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
              transform: translateY(-1px);
              outline: none;
            }
            
            .enhanced-label {
              color: rgba(255, 255, 255, 0.9);
              font-weight: 600;
              font-size: 0.875rem;
              margin-bottom: 0.5rem;
              display: block;
            }
            
            .form-footer-enhanced {
              background: linear-gradient(135deg, 
                rgba(15, 23, 42, 0.8) 0%,
                rgba(30, 41, 59, 0.6) 100%
              );
              border-top: 1px solid rgba(255, 255, 255, 0.1);
              padding: 1.5rem;
              position: relative;
              z-index: 10;
            }
            
            .enhanced-button-primary {
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
              border: none;
              border-radius: 12px;
              color: white;
              font-weight: 700;
              padding: 0.75rem 1.5rem;
              transition: all 0.3s ease;
              box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
              position: relative;
              overflow: hidden;
            }
            
            .enhanced-button-primary:hover {
              transform: translateY(-2px);
              box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
            }
            
            .enhanced-button-secondary {
              background: linear-gradient(135deg, 
                rgba(255, 255, 255, 0.1) 0%,
                rgba(255, 255, 255, 0.05) 100%
              );
              border: 1px solid rgba(255, 255, 255, 0.2);
              border-radius: 12px;
              color: rgba(255, 255, 255, 0.8);
              font-weight: 600;
              padding: 0.75rem 1.5rem;
              transition: all 0.3s ease;
              backdrop-filter: blur(10px);
            }
            
            .enhanced-button-secondary:hover {
              background: linear-gradient(135deg, 
                rgba(255, 255, 255, 0.15) 0%,
                rgba(255, 255, 255, 0.08) 100%
              );
              transform: translateY(-1px);
            }
          `}</style>

          {/* Header */}
          <div className="form-header-enhanced">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {transaction ? 'Edit Transaction' : 'Add New Transaction'}
                </h2>
                <p className="text-sm text-gray-300">
                  Track your income, expenses, and transfers
                </p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit}>
            <div className="form-content-enhanced space-y-6">
              {/* Transaction Type & Amount */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="enhanced-label">Transaction Type</Label>
                  <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
                    <SelectTrigger className="enhanced-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="income">💰 Income</SelectItem>
                      <SelectItem value="expense">💸 Expense</SelectItem>
                      <SelectItem value="transfer">🔄 Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="enhanced-label">Amount</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.amount}
                      onChange={(e) => handleChange('amount', e.target.value)}
                      className="enhanced-input pl-10"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Description & Category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="enhanced-label">Description</Label>
                  <Input
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    className="enhanced-input"
                    placeholder="What was this transaction for?"
                    required
                  />
                </div>

                <div>
                  <Label className="enhanced-label">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                    <SelectTrigger className="enhanced-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {availableCategories.map(cat => (
                        <SelectItem key={cat} value={cat}>
                          {cat.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Date & Currency */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="enhanced-label">Date</Label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleChange('date', e.target.value)}
                      className="enhanced-input pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label className="enhanced-label">Currency</Label>
                  <Select value={formData.currency} onValueChange={(value) => handleChange('currency', value)}>
                    <SelectTrigger className="enhanced-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {CURRENCIES.map(curr => (
                        <SelectItem key={curr} value={curr}>{curr}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Vendor & Payment Method */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="enhanced-label">Vendor/Client (Optional)</Label>
                  <Input
                    value={formData.vendor}
                    onChange={(e) => handleChange('vendor', e.target.value)}
                    className="enhanced-input"
                    placeholder="Who was this transaction with?"
                  />
                </div>

                <div>
                  <Label className="enhanced-label">Payment Method</Label>
                  <Select value={formData.payment_method} onValueChange={(value) => handleChange('payment_method', value)}>
                    <SelectTrigger className="enhanced-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {PAYMENT_METHODS.map(method => (
                        <SelectItem key={method} value={method}>
                          {method.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Location & Tags */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="enhanced-label">Location (Optional)</Label>
                  <Input
                    value={formData.location || ""}
                    onChange={(e) => handleChange('location', e.target.value)}
                    className="enhanced-input"
                    placeholder="Where did this happen?"
                  />
                </div>

                <div>
                  <Label className="enhanced-label">Tags (Optional)</Label>
                  <Input
                    value={(formData.tags || []).join(', ')}
                    onChange={(e) => handleTagsChange(e.target.value)}
                    className="enhanced-input"
                    placeholder="business, client, urgent (comma separated)"
                  />
                </div>
              </div>

              {/* Tax Deductible Checkbox */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="tax_deductible"
                  checked={formData.tax_deductible || false}
                  onCheckedChange={(checked) => handleChange('tax_deductible', checked)}
                />
                <Label htmlFor="tax_deductible" className="enhanced-label text-sm">
                  This transaction is tax deductible
                </Label>
              </div>

              {/* Notes */}
              <div>
                <Label className="enhanced-label">Notes (Optional)</Label>
                <Textarea
                  value={formData.notes || ""}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  className="enhanced-input min-h-20"
                  placeholder="Any additional notes or details..."
                />
              </div>
            </div>

            {/* Footer */}
            <div className="form-footer-enhanced">
              <div className="flex justify-between items-center">
                {transaction && onDelete && (
                  <Button 
                    type="button" 
                    onClick={() => onDelete(transaction)} 
                    className="enhanced-button-secondary text-red-400 border-red-500/30 hover:bg-red-900/20"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                )}
                <div className="flex gap-3 ml-auto">
                  <Button 
                    type="button" 
                    onClick={onCancel} 
                    className="enhanced-button-secondary"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="enhanced-button-primary"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSubmitting ? 'Saving...' : transaction ? 'Update Transaction' : 'Create Transaction'}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
