import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Save, X, Plus, Trash2, FileText, Send, DollarSign, Calculator, Users, Calendar } from "lucide-react";

const CURRENCIES = ["USD", "GBP", "CAD", "EUR", "MMK", "JPY", "CNY", "INR", "SGD", "THB", "KRW"];
const PAYMENT_TERMS = ["net_15", "net_30", "net_45", "net_60", "due_on_receipt", "custom"];
const INVOICE_STATUSES = ["draft", "sent", "viewed", "paid", "overdue", "cancelled"];

export default function InvoiceForm({ 
  invoice, 
  onSubmit, 
  onCancel, 
  onDelete,
  clients = [],
  defaultCurrency = "USD" 
}) {
  const [formData, setFormData] = useState(invoice || {
    invoice_number: `INV-${Date.now().toString().slice(-6)}`,
    client_name: "",
    client_email: "",
    client_phone: "",
    client_address: {
      street: "",
      city: "",
      state: "",
      zip_code: "",
      country: ""
    },
    issue_date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    currency: defaultCurrency,
    items: [{
      description: "",
      quantity: 1,
      rate: 0,
      amount: 0
    }],
    subtotal: 0,
    tax_rate: 0,
    tax_amount: 0,
    discount_rate: 0,
    discount_amount: 0,
    total: 0,
    status: "draft",
    payment_terms: "net_30",
    notes: "",
    internal_notes: ""
  });

  const [selectedClient, setSelectedClient] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showClientForm, setShowClientForm] = useState(false);

  useEffect(() => {
    if (invoice) {
      setFormData({
        ...invoice,
        items: invoice.items && invoice.items.length > 0 ? invoice.items : [{
          description: "",
          quantity: 1,
          rate: 0,
          amount: 0
        }],
        client_address: invoice.client_address || {
          street: "",
          city: "",
          state: "",
          zip_code: "",
          country: ""
        }
      });
    }
  }, [invoice]);

  // Auto-calculate totals when items change
  useEffect(() => {
    calculateTotals();
  }, [formData.items, formData.tax_rate, formData.discount_rate]);

  const handleChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleClientSelect = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      setSelectedClient(client);
      setFormData(prev => ({
        ...prev,
        client_name: client.name,
        client_email: client.email,
        client_phone: client.phone || "",
        client_address: client.address || prev.client_address
      }));
    }
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: field === 'quantity' || field === 'rate' ? parseFloat(value) || 0 : value
    };

    // Calculate amount for this item
    if (field === 'quantity' || field === 'rate') {
      updatedItems[index].amount = updatedItems[index].quantity * updatedItems[index].rate;
    }

    setFormData(prev => ({ ...prev, items: updatedItems }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, {
        description: "",
        quantity: 1,
        rate: 0,
        amount: 0
      }]
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const updatedItems = formData.items.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, items: updatedItems }));
    }
  };

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + (item.amount || 0), 0);
    const discountAmount = subtotal * (formData.discount_rate || 0) / 100;
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = taxableAmount * (formData.tax_rate || 0) / 100;
    const total = taxableAmount + taxAmount;

    setFormData(prev => ({
      ...prev,
      subtotal,
      discount_amount: discountAmount,
      tax_amount: taxAmount,
      total
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Validation
    if (!formData.client_name.trim()) {
      alert("Please enter client name or select a client");
      return;
    }
    if (!formData.client_email.trim()) {
      alert("Please enter client email");
      return;
    }
    if (formData.items.length === 0 || !formData.items[0].description.trim()) {
      alert("Please add at least one invoice item");
      return;
    }
    if (formData.total <= 0) {
      alert("Invoice total must be greater than 0");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Invoice submission error:', error);
      alert('Failed to save invoice. Please try again.');
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
          className="revolutionary-invoice-form w-full max-w-6xl max-h-[95vh] overflow-hidden"
        >
          <style jsx>{`
            .revolutionary-invoice-form {
              background: linear-gradient(145deg, 
                rgba(15, 23, 42, 0.98) 0%,
                rgba(30, 41, 59, 0.96) 50%,
                rgba(51, 65, 85, 0.94) 100%
              );
              border: 2px solid transparent;
              border-image: linear-gradient(45deg, #3b82f6, #10b981, #f59e0b) 1;
              border-radius: 24px;
              backdrop-filter: blur(30px);
              box-shadow: 
                0 25px 50px rgba(0, 0, 0, 0.5),
                0 0 80px rgba(59, 130, 246, 0.2),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
              position: relative;
              overflow: hidden;
            }
            
            .form-header-enhanced {
              background: linear-gradient(135deg, 
                rgba(59, 130, 246, 0.1) 0%,
                rgba(16, 185, 129, 0.08) 50%,
                rgba(245, 158, 11, 0.1) 100%
              );
              border-bottom: 1px solid rgba(255, 255, 255, 0.1);
              padding: 1.5rem;
              position: relative;
              z-index: 10;
            }
            
            .form-content-enhanced {
              position: relative;
              z-index: 10;
              max-height: 70vh;
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
              border: 1px solid rgba(59, 130, 246, 0.5);
              box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
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
            
            .item-card {
              background: linear-gradient(135deg, 
                rgba(51, 65, 85, 0.4) 0%,
                rgba(30, 41, 59, 0.3) 100%
              );
              border: 1px solid rgba(255, 255, 255, 0.08);
              border-radius: 16px;
              backdrop-filter: blur(15px);
              transition: all 0.3s ease;
              margin-bottom: 1rem;
            }
            
            .item-card:hover {
              background: linear-gradient(135deg, 
                rgba(51, 65, 85, 0.6) 0%,
                rgba(30, 41, 59, 0.5) 100%
              );
              border: 1px solid rgba(255, 255, 255, 0.15);
              transform: translateY(-2px);
            }
            
            .totals-card {
              background: linear-gradient(135deg, 
                rgba(16, 185, 129, 0.1) 0%,
                rgba(59, 130, 246, 0.08) 100%
              );
              border: 1px solid rgba(16, 185, 129, 0.3);
              border-radius: 16px;
              backdrop-filter: blur(15px);
              padding: 1.5rem;
            }
            
            .total-amount {
              background: linear-gradient(45deg, #10b981, #3b82f6);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              font-size: 2rem;
              font-weight: 900;
            }
          `}</style>

          {/* Header */}
          <div className="form-header-enhanced">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {invoice ? 'Edit Invoice' : 'Create New Invoice'}
                </h2>
                <p className="text-sm text-gray-300">
                  Professional invoice generation with smart calculations
                </p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit}>
            <div className="form-content-enhanced space-y-8">
              {/* Invoice Header Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="item-card">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-400" />
                      Invoice Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="enhanced-label">Invoice Number</Label>
                      <Input
                        value={formData.invoice_number}
                        onChange={(e) => handleChange('invoice_number', e.target.value)}
                        className="enhanced-input"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="enhanced-label">Issue Date</Label>
                        <Input
                          type="date"
                          value={formData.issue_date}
                          onChange={(e) => handleChange('issue_date', e.target.value)}
                          className="enhanced-input"
                          required
                        />
                      </div>
                      <div>
                        <Label className="enhanced-label">Due Date</Label>
                        <Input
                          type="date"
                          value={formData.due_date}
                          onChange={(e) => handleChange('due_date', e.target.value)}
                          className="enhanced-input"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
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
                      <div>
                        <Label className="enhanced-label">Payment Terms</Label>
                        <Select value={formData.payment_terms} onValueChange={(value) => handleChange('payment_terms', value)}>
                          <SelectTrigger className="enhanced-input">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700">
                            {PAYMENT_TERMS.map(term => (
                              <SelectItem key={term} value={term}>
                                {term.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Client Information */}
                <Card className="item-card">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Users className="w-5 h-5 text-green-400" />
                      Client Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {clients.length > 0 && (
                      <div>
                        <Label className="enhanced-label">Select Existing Client</Label>
                        <Select onValueChange={handleClientSelect}>
                          <SelectTrigger className="enhanced-input">
                            <SelectValue placeholder="Choose a client..." />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700">
                            {clients.map(client => (
                              <SelectItem key={client.id} value={client.id}>
                                {client.name} ({client.email})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="enhanced-label">Client Name *</Label>
                        <Input
                          value={formData.client_name}
                          onChange={(e) => handleChange('client_name', e.target.value)}
                          className="enhanced-input"
                          placeholder="Client or company name"
                          required
                        />
                      </div>
                      <div>
                        <Label className="enhanced-label">Email *</Label>
                        <Input
                          type="email"
                          value={formData.client_email}
                          onChange={(e) => handleChange('client_email', e.target.value)}
                          className="enhanced-input"
                          placeholder="client@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="enhanced-label">Phone</Label>
                      <Input
                        value={formData.client_phone}
                        onChange={(e) => handleChange('client_phone', e.target.value)}
                        className="enhanced-input"
                        placeholder="Client phone number"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="enhanced-label">City</Label>
                        <Input
                          value={formData.client_address.city}
                          onChange={(e) => handleChange('client_address.city', e.target.value)}
                          className="enhanced-input"
                          placeholder="Client city"
                        />
                      </div>
                      <div>
                        <Label className="enhanced-label">Country</Label>
                        <Input
                          value={formData.client_address.country}
                          onChange={(e) => handleChange('client_address.country', e.target.value)}
                          className="enhanced-input"
                          placeholder="Client country"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Invoice Items */}
              <Card className="item-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center gap-2">
                      <Calculator className="w-5 h-5 text-yellow-400" />
                      Invoice Items
                    </CardTitle>
                    <Button
                      type="button"
                      onClick={addItem}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      size="sm"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Item
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.items.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="grid grid-cols-12 gap-4 items-center p-4 bg-gray-700/30 rounded-lg"
                    >
                      <div className="col-span-5">
                        <Label className="enhanced-label text-xs">Description</Label>
                        <Input
                          value={item.description}
                          onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                          className="enhanced-input text-sm"
                          placeholder="Item description..."
                          required
                        />
                      </div>
                      <div className="col-span-2">
                        <Label className="enhanced-label text-xs">Quantity</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                          className="enhanced-input text-sm"
                        />
                      </div>
                      <div className="col-span-2">
                        <Label className="enhanced-label text-xs">Rate</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.rate}
                          onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                          className="enhanced-input text-sm"
                        />
                      </div>
                      <div className="col-span-2">
                        <Label className="enhanced-label text-xs">Amount</Label>
                        <Input
                          value={`${formData.currency} ${item.amount.toFixed(2)}`}
                          className="enhanced-input text-sm font-bold"
                          disabled
                        />
                      </div>
                      <div className="col-span-1 flex justify-center">
                        {formData.items.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => removeItem(index)}
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>

              {/* Calculations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="item-card">
                  <CardHeader>
                    <CardTitle className="text-white">Tax & Discount</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="enhanced-label">Discount %</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          value={formData.discount_rate}
                          onChange={(e) => handleChange('discount_rate', parseFloat(e.target.value) || 0)}
                          className="enhanced-input"
                        />
                      </div>
                      <div>
                        <Label className="enhanced-label">Tax Rate %</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          value={formData.tax_rate}
                          onChange={(e) => handleChange('tax_rate', parseFloat(e.target.value) || 0)}
                          className="enhanced-input"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="totals-card">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-green-400" />
                      Invoice Total
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-gray-300">
                      <span>Subtotal:</span>
                      <span>{formData.currency} {formData.subtotal.toFixed(2)}</span>
                    </div>
                    {formData.discount_amount > 0 && (
                      <div className="flex justify-between text-orange-300">
                        <span>Discount:</span>
                        <span>-{formData.currency} {formData.discount_amount.toFixed(2)}</span>
                      </div>
                    )}
                    {formData.tax_amount > 0 && (
                      <div className="flex justify-between text-blue-300">
                        <span>Tax:</span>
                        <span>+{formData.currency} {formData.tax_amount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="border-t border-gray-600 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-white">Total:</span>
                        <span className="total-amount">
                          {formData.currency} {formData.total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="enhanced-label">Public Notes</Label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    className="enhanced-input min-h-24"
                    placeholder="Notes visible to client..."
                  />
                </div>
                <div>
                  <Label className="enhanced-label">Internal Notes</Label>
                  <Textarea
                    value={formData.internal_notes}
                    onChange={(e) => handleChange('internal_notes', e.target.value)}
                    className="enhanced-input min-h-24"
                    placeholder="Internal notes (not visible to client)..."
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-700 flex justify-between items-center">
              {invoice && onDelete && (
                <Button 
                  type="button" 
                  onClick={() => onDelete(invoice)} 
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Invoice
                </Button>
              )}
              <div className="flex gap-3 ml-auto">
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
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSubmitting ? 'Saving...' : invoice ? 'Update Invoice' : 'Create Invoice'}
                </Button>
                {!invoice && (
                  <Button 
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, status: 'sent' }));
                      handleSubmit();
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Create & Send
                  </Button>
                )}
              </div>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}