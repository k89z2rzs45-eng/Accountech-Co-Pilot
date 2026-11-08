import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { motion, AnimatePresence } from "framer-motion";
import { Save, X, Target, DollarSign, Calendar, Bell, Sparkles } from "lucide-react";

const BUDGET_CATEGORIES = [
  "office_supplies", "travel", "utilities", "software", "marketing", "meals",
  "professional_services", "equipment", "rent", "insurance", "taxes", "other"
];

const BUDGET_PERIODS = ["monthly", "quarterly", "yearly"];
const CURRENCIES = ["USD", "GBP", "CAD", "EUR", "MMK", "JPY", "CNY", "INR", "SGD", "THB", "KRW"];

export default function BudgetForm({ budget, onSubmit, onCancel, onDelete, defaultCurrency = "USD" }) {
  const [formData, setFormData] = useState(budget || {
    name: "",
    category: "other",
    amount: "",
    period: "monthly",
    currency: defaultCurrency,
    alert_threshold: 80,
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
    status: "active"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (budget) {
      setFormData({
        ...budget,
        amount: budget.amount?.toString() || "",
        alert_threshold: budget.alert_threshold || 80
      });
    }
  }, [budget]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Validation
    if (!formData.name.trim()) {
      alert("Please enter a budget name");
      return;
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert("Please enter a valid budget amount");
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData = {
        ...formData,
        amount: parseFloat(formData.amount),
        spent: 0 // Initialize spent amount
      };
      await onSubmit(submitData);
    } catch (error) {
      console.error('Budget submission error:', error);
      alert('Failed to save budget. Please try again.');
    }
    setIsSubmitting(false);
  };

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
          className="revolutionary-budget-form w-full max-w-2xl max-h-[90vh] overflow-hidden"
        >
          <style jsx>{`
            .revolutionary-budget-form {
              background: linear-gradient(145deg, 
                rgba(15, 23, 42, 0.98) 0%,
                rgba(30, 41, 59, 0.96) 50%,
                rgba(51, 65, 85, 0.94) 100%
              );
              border: 2px solid transparent;
              border-image: linear-gradient(45deg, #f59e0b, #10b981, #3b82f6) 1;
              border-radius: 24px;
              backdrop-filter: blur(30px);
              box-shadow: 
                0 25px 50px rgba(0, 0, 0, 0.5),
                0 0 80px rgba(245, 158, 11, 0.2),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
              position: relative;
              overflow: hidden;
            }
            
            .form-header-enhanced {
              background: linear-gradient(135deg, 
                rgba(245, 158, 11, 0.1) 0%,
                rgba(16, 185, 129, 0.08) 50%,
                rgba(59, 130, 246, 0.1) 100%
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
              border: 1px solid rgba(245, 158, 11, 0.5);
              box-shadow: 0 0 20px rgba(245, 158, 11, 0.3);
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
            
            .alert-slider {
              background: linear-gradient(135deg, 
                rgba(245, 158, 11, 0.2) 0%,
                rgba(16, 185, 129, 0.15) 100%
              );
              border: 1px solid rgba(245, 158, 11, 0.3);
              border-radius: 12px;
              padding: 1rem;
              backdrop-filter: blur(10px);
            }
            
            .enhanced-button-primary {
              background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
              border: none;
              border-radius: 12px;
              color: white;
              font-weight: 700;
              padding: 0.75rem 1.5rem;
              transition: all 0.3s ease;
              box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
            }
            
            .enhanced-button-primary:hover {
              transform: translateY(-2px);
              box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4);
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
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-green-500 rounded-full flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {budget ? 'Edit Budget' : 'Create New Budget'}
                </h2>
                <p className="text-sm text-gray-300">
                  Set spending limits and track your financial goals
                </p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit}>
            <div className="form-content-enhanced space-y-6">
              {/* Budget Name & Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="enhanced-label">Budget Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="enhanced-input"
                    placeholder="e.g., Monthly Office Supplies"
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
                      {BUDGET_CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>
                          {category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Amount & Period */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="enhanced-label">Budget Amount</Label>
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

                <div>
                  <Label className="enhanced-label">Period</Label>
                  <Select value={formData.period} onValueChange={(value) => handleChange('period', value)}>
                    <SelectTrigger className="enhanced-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {BUDGET_PERIODS.map(period => (
                        <SelectItem key={period} value={period}>
                          {period.charAt(0).toUpperCase() + period.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="enhanced-label">Start Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => handleChange('start_date', e.target.value)}
                      className="enhanced-input pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label className="enhanced-label">End Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => handleChange('end_date', e.target.value)}
                      className="enhanced-input pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Alert Threshold */}
              <div className="alert-slider">
                <div className="flex items-center gap-2 mb-3">
                  <Bell className="w-5 h-5 text-yellow-400" />
                  <Label className="enhanced-label mb-0">Alert Threshold: {formData.alert_threshold}%</Label>
                </div>
                <Slider
                  value={[formData.alert_threshold]}
                  onValueChange={(value) => handleChange('alert_threshold', value[0])}
                  max={100}
                  min={10}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>10%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
                <p className="text-xs text-gray-300 mt-2">
                  Get notified when spending reaches {formData.alert_threshold}% of budget
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-700">
              <div className="flex justify-between items-center">
                {budget && onDelete && (
                  <Button 
                    type="button" 
                    onClick={() => onDelete(budget)} 
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
                    {isSubmitting ? 'Saving...' : budget ? 'Update Budget' : 'Create Budget'}
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