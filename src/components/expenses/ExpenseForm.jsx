import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Save, X, Receipt, Upload, Brain, DollarSign, Calendar, MapPin, CreditCard, Tag, AlertCircle } from "lucide-react";

const EXPENSE_CATEGORIES = [
  "office_supplies", "travel", "utilities", "software", "marketing", "meals", 
  "professional_services", "equipment", "rent", "insurance", "taxes", "freelance",
  "subscription", "fuel", "maintenance", "legal", "bank_fees", "advertising",
  "training", "entertainment", "phone_internet", "postage_shipping", "repairs",
  "cleaning", "security", "other"
];

const PAYMENT_METHODS = [
  "cash", "credit_card", "debit_card", "bank_transfer", "check", 
  "paypal", "company_card", "petty_cash", "other"
];

const CURRENCIES = ["USD", "GBP", "CAD", "EUR", "MMK", "JPY", "CNY", "INR", "SGD", "THB", "KRW"];

const CATEGORY_LABELS = {
  office_supplies: "📎 Office Supplies",
  travel: "✈️ Business Travel",
  utilities: "⚡ Utilities",
  software: "💻 Software & Apps",
  marketing: "📈 Marketing",
  meals: "🍽️ Business Meals",
  professional_services: "🤝 Professional Services",
  equipment: "🖥️ Equipment",
  rent: "🏢 Rent & Lease",
  insurance: "🛡️ Insurance",
  taxes: "📊 Taxes & Fees",
  freelance: "👨‍💼 Freelance Work",
  subscription: "🔄 Subscriptions",
  fuel: "⛽ Fuel & Gas",
  maintenance: "🔧 Maintenance",
  legal: "⚖️ Legal Services",
  bank_fees: "🏦 Bank Fees",
  advertising: "📺 Advertising",
  training: "📚 Training & Education",
  entertainment: "🎭 Entertainment",
  phone_internet: "📱 Phone & Internet",
  postage_shipping: "📦 Shipping",
  repairs: "🛠️ Repairs",
  cleaning: "🧽 Cleaning Services",
  security: "🔒 Security",
  other: "📋 Other"
};

export default function ExpenseForm({ 
  expense, 
  onSubmit, 
  onCancel, 
  onDelete,
  defaultCurrency = "USD" 
}) {
  const [formData, setFormData] = useState(expense || {
    amount: "",
    currency: defaultCurrency,
    category: "other",
    subcategory: "",
    description: "",
    vendor: "",
    date: new Date().toISOString().split('T')[0],
    receipt_urls: [],
    tax_deductible: false,
    tax_amount: "",
    notes: "",
    status: "pending",
    ai_categorized: false,
    ai_confidence: 0,
    reference_number: "",
    payment_method: "credit_card",
    location: "",
    project_code: "",
    reimbursable: true,
    tags: [],
    recurring: false,
    recurring_frequency: "monthly"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [uploadingReceipt, setUploadingReceipt] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);

  useEffect(() => {
    if (expense) {
      setFormData({
        ...expense,
        amount: expense.amount?.toString() || "",
        tax_amount: expense.tax_amount?.toString() || "",
        tags: expense.tags || [],
        receipt_urls: expense.receipt_urls || []
      });
    }
  }, [expense]);

  // Auto-suggest category based on description and vendor
  useEffect(() => {
    if (formData.description && formData.description.length > 3) {
      suggestCategory();
    }
  }, [formData.description, formData.vendor]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const suggestCategory = async () => {
    try {
      // AI categorization logic (simplified)
      const description = formData.description.toLowerCase();
      const vendor = formData.vendor.toLowerCase();
      
      let suggestedCategory = "other";
      let confidence = 60;

      // Rule-based suggestions
      if (description.includes("gas") || description.includes("fuel") || vendor.includes("gas")) {
        suggestedCategory = "fuel";
        confidence = 90;
      } else if (description.includes("office") || description.includes("supplies") || vendor.includes("staples")) {
        suggestedCategory = "office_supplies";
        confidence = 85;
      } else if (description.includes("software") || description.includes("app") || vendor.includes("adobe")) {
        suggestedCategory = "software";
        confidence = 88;
      } else if (description.includes("meal") || description.includes("lunch") || description.includes("dinner")) {
        suggestedCategory = "meals";
        confidence = 85;
      } else if (description.includes("travel") || description.includes("hotel") || description.includes("flight")) {
        suggestedCategory = "travel";
        confidence = 90;
      } else if (description.includes("marketing") || description.includes("advertising") || description.includes("ads")) {
        suggestedCategory = "marketing";
        confidence = 82;
      }

      if (suggestedCategory !== "other" && suggestedCategory !== formData.category) {
        setAiSuggestions({
          category: suggestedCategory,
          confidence: confidence,
          reason: `Based on "${description}" and vendor "${vendor || 'N/A'}"`
        });
      }
    } catch (error) {
      console.error('AI suggestion error:', error);
    }
  };

  const acceptAISuggestion = () => {
    if (aiSuggestions) {
      setFormData(prev => ({
        ...prev,
        category: aiSuggestions.category,
        ai_categorized: true,
        ai_confidence: aiSuggestions.confidence
      }));
      setAiSuggestions(null);
    }
  };

  const dismissAISuggestion = () => {
    setAiSuggestions(null);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleReceiptUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadingReceipt(true);
    try {
      // Simulate receipt upload
      const receiptUrl = `https://example.com/receipts/${Date.now()}-${file.name}`;
      setFormData(prev => ({
        ...prev,
        receipt_urls: [...prev.receipt_urls, receiptUrl]
      }));
    } catch (error) {
      console.error('Receipt upload error:', error);
      alert('Failed to upload receipt. Please try again.');
    }
    setUploadingReceipt(false);
  };

  const removeReceipt = (index) => {
    setFormData(prev => ({
      ...prev,
      receipt_urls: prev.receipt_urls.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Validation
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert("Please enter a valid expense amount");
      return;
    }
    if (!formData.description.trim()) {
      alert("Please enter an expense description");
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData = {
        ...formData,
        amount: parseFloat(formData.amount),
        tax_amount: formData.tax_amount ? parseFloat(formData.tax_amount) : null
      };
      await onSubmit(submitData);
    } catch (error) {
      console.error('Expense submission error:', error);
      alert('Failed to save expense. Please try again.');
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
          className="revolutionary-expense-form w-full max-w-4xl max-h-[95vh] overflow-hidden"
        >
          <style jsx>{`
            .revolutionary-expense-form {
              background: linear-gradient(145deg, 
                rgba(15, 23, 42, 0.98) 0%,
                rgba(30, 41, 59, 0.96) 50%,
                rgba(51, 65, 85, 0.94) 100%
              );
              border: 2px solid transparent;
              border-image: linear-gradient(45deg, #f59e0b, #ef4444, #10b981) 1;
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
                rgba(239, 68, 68, 0.08) 50%,
                rgba(16, 185, 129, 0.1) 100%
              );
              border-bottom: 1px solid rgba(255, 255, 255, 0.1);
              padding: 1.5rem;
              position: relative;
              z-index: 10;
            }
            
            .form-content-enhanced {
              position: relative;
              z-index: 10;
              max-height: 75vh;
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
            
            .section-card {
              background: linear-gradient(135deg, 
                rgba(51, 65, 85, 0.4) 0%,
                rgba(30, 41, 59, 0.3) 100%
              );
              border: 1px solid rgba(255, 255, 255, 0.08);
              border-radius: 16px;
              backdrop-filter: blur(15px);
              margin-bottom: 1.5rem;
              transition: all 0.3s ease;
            }
            
            .section-card:hover {
              background: linear-gradient(135deg, 
                rgba(51, 65, 85, 0.6) 0%,
                rgba(30, 41, 59, 0.5) 100%
              );
              border: 1px solid rgba(255, 255, 255, 0.12);
              transform: translateY(-1px);
            }
            
            .ai-suggestion-card {
              background: linear-gradient(135deg, 
                rgba(139, 92, 246, 0.1) 0%,
                rgba(124, 58, 237, 0.08) 100%
              );
              border: 1px solid rgba(139, 92, 246, 0.3);
              border-radius: 12px;
              backdrop-filter: blur(15px);
              animation: suggestionPulse 2s ease-in-out infinite;
            }
            
            @keyframes suggestionPulse {
              0%, 100% {
                box-shadow: 0 0 10px rgba(139, 92, 246, 0.3);
              }
              50% {
                box-shadow: 0 0 20px rgba(139, 92, 246, 0.5);
              }
            }
            
            .receipt-preview {
              background: linear-gradient(135deg, 
                rgba(16, 185, 129, 0.1) 0%,
                rgba(5, 150, 105, 0.08) 100%
              );
              border: 1px solid rgba(16, 185, 129, 0.3);
              border-radius: 8px;
              padding: 0.75rem;
              transition: all 0.3s ease;
            }
            
            .receipt-preview:hover {
              background: linear-gradient(135deg, 
                rgba(16, 185, 129, 0.15) 0%,
                rgba(5, 150, 105, 0.12) 100%
              );
              transform: scale(1.02);
            }
            
            .tag-item {
              background: linear-gradient(45deg, #3b82f6, #1d4ed8);
              color: white;
              padding: 0.25rem 0.75rem;
              border-radius: 20px;
              font-size: 0.75rem;
              font-weight: 600;
              display: inline-flex;
              align-items: center;
              gap: 0.5rem;
              transition: all 0.3s ease;
            }
            
            .tag-item:hover {
              background: linear-gradient(45deg, #1d4ed8, #1e40af);
              transform: scale(1.05);
            }
            
            .deductible-toggle {
              background: linear-gradient(135deg, 
                rgba(16, 185, 129, 0.2) 0%,
                rgba(5, 150, 105, 0.15) 100%
              );
              border: 1px solid rgba(16, 185, 129, 0.4);
              border-radius: 12px;
              padding: 1rem;
            }
          `}</style>

          {/* Header */}
          <div className="form-header-enhanced">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <Receipt className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {expense ? 'Edit Business Expense' : 'Add Business Expense'}
                  </h2>
                  <p className="text-sm text-gray-300">
                    Track business expenses with AI-powered categorization
                  </p>
                </div>
              </div>
              {expense && onDelete && (
                <Button
                  type="button"
                  onClick={() => onDelete(expense)}
                  variant="destructive"
                  size="sm"
                >
                  Delete
                </Button>
              )}
            </div>
          </div>

          {/* AI Suggestion Card */}
          {aiSuggestions && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-6 mt-4 p-4 ai-suggestion-card"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Brain className="w-5 h-5 text-purple-400" />
                  <div>
                    <h4 className="text-white font-semibold">AI Suggestion</h4>
                    <p className="text-sm text-gray-300">
                      Category: <span className="text-purple-300">{CATEGORY_LABELS[aiSuggestions.category]}</span>
                      <span className="text-purple-400 ml-2">({aiSuggestions.confidence}% confidence)</span>
                    </p>
                    <p className="text-xs text-gray-400">{aiSuggestions.reason}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={acceptAISuggestion} size="sm" className="bg-purple-600 hover:bg-purple-700">
                    Accept
                  </Button>
                  <Button onClick={dismissAISuggestion} variant="outline" size="sm" className="border-gray-600 text-gray-400">
                    Dismiss
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Form Content */}
          <form onSubmit={handleSubmit}>
            <div className="form-content-enhanced">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Basic Info */}
                <div className="space-y-6">
                  {/* Amount & Currency */}
                  <div className="section-card p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-green-400" />
                      Amount & Currency
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2">
                        <Label className="text-gray-300 font-semibold">Amount *</Label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.amount}
                          onChange={(e) => handleChange('amount', e.target.value)}
                          className="enhanced-input text-lg"
                          placeholder="0.00"
                          required
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300 font-semibold">Currency</Label>
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
                  </div>

                  {/* Expense Details */}
                  <div className="section-card p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-400" />
                      Expense Details
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-gray-300 font-semibold">Description *</Label>
                        <Input
                          value={formData.description}
                          onChange={(e) => handleChange('description', e.target.value)}
                          className="enhanced-input"
                          placeholder="e.g., Client lunch meeting, Office supplies, Software subscription"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-300 font-semibold">Category</Label>
                          <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                            <SelectTrigger className="enhanced-input">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700 max-h-64">
                              {EXPENSE_CATEGORIES.map(category => (
                                <SelectItem key={category} value={category}>
                                  {CATEGORY_LABELS[category] || category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-gray-300 font-semibold">Subcategory</Label>
                          <Input
                            value={formData.subcategory}
                            onChange={(e) => handleChange('subcategory', e.target.value)}
                            className="enhanced-input"
                            placeholder="Optional subcategory"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-300 font-semibold">Vendor/Supplier</Label>
                          <Input
                            value={formData.vendor}
                            onChange={(e) => handleChange('vendor', e.target.value)}
                            className="enhanced-input"
                            placeholder="e.g., Amazon, Starbucks, Adobe"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-300 font-semibold">Date *</Label>
                          <Input
                            type="date"
                            value={formData.date}
                            onChange={(e) => handleChange('date', e.target.value)}
                            className="enhanced-input"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment & Location */}
                  <div className="section-card p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-purple-400" />
                      Payment & Location
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-300 font-semibold">Payment Method</Label>
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
                        <div>
                          <Label className="text-gray-300 font-semibold">Reference Number</Label>
                          <Input
                            value={formData.reference_number}
                            onChange={(e) => handleChange('reference_number', e.target.value)}
                            className="enhanced-input"
                            placeholder="Invoice #, Transaction ID"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-300 font-semibold flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            Location
                          </Label>
                          <Input
                            value={formData.location}
                            onChange={(e) => handleChange('location', e.target.value)}
                            className="enhanced-input"
                            placeholder="City, State or Address"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-300 font-semibold">Project Code</Label>
                          <Input
                            value={formData.project_code}
                            onChange={(e) => handleChange('project_code', e.target.value)}
                            className="enhanced-input"
                            placeholder="Project or cost center"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Tax & Additional Info */}
                <div className="space-y-6">
                  {/* Tax Information */}
                  <div className="section-card p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Receipt className="w-5 h-5 text-green-400" />
                      Tax Information
                    </h3>
                    <div className="deductible-toggle mb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-white">Tax Deductible</h4>
                          <p className="text-sm text-gray-300">Mark if this is a business expense</p>
                        </div>
                        <Switch
                          checked={formData.tax_deductible}
                          onCheckedChange={(checked) => handleChange('tax_deductible', checked)}
                        />
                      </div>
                    </div>

                    {formData.tax_deductible && (
                      <div>
                        <Label className="text-gray-300 font-semibold">Tax Amount</Label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.tax_amount}
                          onChange={(e) => handleChange('tax_amount', e.target.value)}
                          className="enhanced-input"
                          placeholder="Tax amount if applicable"
                        />
                      </div>
                    )}

                    <div className="mt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Switch
                          checked={formData.reimbursable}
                          onCheckedChange={(checked) => handleChange('reimbursable', checked)}
                        />
                        <Label className="text-gray-300">Reimbursable Expense</Label>
                      </div>
                    </div>
                  </div>

                  {/* Receipts */}
                  <div className="section-card p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Upload className="w-5 h-5 text-orange-400" />
                      Receipts & Documentation
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleReceiptUpload}
                          className="hidden"
                          id="receipt-upload"
                          multiple
                        />
                        <label htmlFor="receipt-upload">
                          <Button
                            type="button"
                            as="span"
                            variant="outline"
                            disabled={uploadingReceipt}
                            className="w-full border-dashed border-2 border-orange-400 text-orange-400 hover:bg-orange-400/10 cursor-pointer"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {uploadingReceipt ? 'Uploading...' : 'Upload Receipt'}
                          </Button>
                        </label>
                      </div>

                      {formData.receipt_urls.length > 0 && (
                        <div className="space-y-2">
                          {formData.receipt_urls.map((url, index) => (
                            <div key={index} className="receipt-preview">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-300 truncate flex-1">
                                  Receipt {index + 1}
                                </span>
                                <Button
                                  type="button"
                                  onClick={() => removeReceipt(index)}
                                  size="sm"
                                  variant="ghost"
                                  className="text-red-400 hover:text-red-300"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="section-card p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Tag className="w-5 h-5 text-blue-400" />
                      Tags & Classification
                    </h3>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                          className="enhanced-input flex-1"
                          placeholder="Add tags for better organization"
                        />
                        <Button type="button" onClick={handleAddTag} size="sm" className="bg-blue-600 hover:bg-blue-700">
                          Add
                        </Button>
                      </div>

                      {formData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {formData.tags.map((tag, index) => (
                            <div key={index} className="tag-item">
                              {tag}
                              <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="hover:text-red-300"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Recurring */}
                  <div className="section-card p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-purple-400" />
                      Recurring Settings
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={formData.recurring}
                          onCheckedChange={(checked) => handleChange('recurring', checked)}
                        />
                        <Label className="text-gray-300">This is a recurring expense</Label>
                      </div>

                      {formData.recurring && (
                        <div>
                          <Label className="text-gray-300 font-semibold">Frequency</Label>
                          <Select value={formData.recurring_frequency} onValueChange={(value) => handleChange('recurring_frequency', value)}>
                            <SelectTrigger className="enhanced-input">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700">
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="quarterly">Quarterly</SelectItem>
                              <SelectItem value="yearly">Yearly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="section-card p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Additional Notes</h3>
                    <Textarea
                      value={formData.notes}
                      onChange={(e) => handleChange('notes', e.target.value)}
                      className="enhanced-input h-24"
                      placeholder="Additional details, business purpose, meeting attendees, etc."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-700 flex justify-between items-center">
              <div className="flex items-center gap-4">
                {formData.ai_categorized && (
                  <div className="flex items-center gap-2 text-purple-400">
                    <Brain className="w-4 h-4" />
                    <span className="text-sm">AI Categorized ({formData.ai_confidence}%)</span>
                  </div>
                )}
                {formData.tax_deductible && (
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                    Tax Deductible
                  </Badge>
                )}
              </div>
              
              <div className="flex gap-3">
                <Button 
                  type="button" 
                  onClick={onCancel} 
                  variant="outline"
                  className="bg-transparent border-gray-600 text-gray-400 hover:bg-gray-700"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSubmitting ? 'Saving...' : expense ? 'Update Expense' : 'Save Expense'}
                </Button>
              </div>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}