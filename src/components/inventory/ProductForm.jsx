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
import { Save, X, Package, Barcode, DollarSign, TrendingUp, AlertTriangle, Camera, Plus, Trash2 } from "lucide-react";

const PRODUCT_CATEGORIES = [
  "electronics", "clothing", "food", "books", "furniture", "medical", 
  "automotive", "sports", "beauty", "home", "office", "industrial", "other"
];

const CURRENCIES = ["USD", "GBP", "CAD", "EUR", "MMK", "JPY", "CNY", "INR", "SGD", "THB", "KRW"];
const PRODUCT_STATUSES = ["active", "discontinued", "out_of_stock", "low_stock", "overstocked"];

export default function ProductForm({ 
  product, 
  onSubmit, 
  onCancel, 
  onDelete,
  defaultCurrency = "USD" 
}) {
  const [formData, setFormData] = useState(product || {
    sku: `SKU-${Date.now().toString().slice(-6)}`,
    name: "",
    description: "",
    category: "other",
    brand: "",
    barcode: "",
    cost_price: "",
    selling_price: "",
    suggested_price: "",
    currency: defaultCurrency,
    current_stock: "",
    reorder_point: "10",
    max_stock: "",
    lead_time_days: "7",
    supplier_info: {
      name: "",
      contact: "",
      cost: "",
      min_order_qty: ""
    },
    locations: [{
      location_name: "Main Warehouse",
      quantity: "",
      reserved: "0"
    }],
    product_images: [],
    dimensions: {
      length: "",
      width: "",
      height: "",
      weight: "",
      unit: "cm"
    },
    expiry_date: "",
    batch_number: "",
    status: "active",
    tags: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        cost_price: product.cost_price?.toString() || "",
        selling_price: product.selling_price?.toString() || "",
        suggested_price: product.suggested_price?.toString() || "",
        current_stock: product.current_stock?.toString() || "",
        reorder_point: product.reorder_point?.toString() || "10",
        max_stock: product.max_stock?.toString() || "",
        lead_time_days: product.lead_time_days?.toString() || "7",
        supplier_info: product.supplier_info || {
          name: "",
          contact: "",
          cost: "",
          min_order_qty: ""
        },
        locations: product.locations && product.locations.length > 0 ? product.locations : [{
          location_name: "Main Warehouse",
          quantity: "",
          reserved: "0"
        }],
        dimensions: product.dimensions || {
          length: "",
          width: "",
          height: "",
          weight: "",
          unit: "cm"
        },
        tags: product.tags || []
      });
    }
  }, [product]);

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

  const handleLocationChange = (index, field, value) => {
    const updatedLocations = [...formData.locations];
    updatedLocations[index] = {
      ...updatedLocations[index],
      [field]: value
    };
    setFormData(prev => ({ ...prev, locations: updatedLocations }));
  };

  const addLocation = () => {
    setFormData(prev => ({
      ...prev,
      locations: [...prev.locations, {
        location_name: "",
        quantity: "",
        reserved: "0"
      }]
    }));
  };

  const removeLocation = (index) => {
    if (formData.locations.length > 1) {
      const updatedLocations = formData.locations.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, locations: updatedLocations }));
    }
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

  const calculateProfitMargin = () => {
    const cost = parseFloat(formData.cost_price) || 0;
    const selling = parseFloat(formData.selling_price) || 0;
    if (cost > 0 && selling > 0) {
      return ((selling - cost) / selling * 100).toFixed(1);
    }
    return "0.0";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Validation
    if (!formData.sku.trim()) {
      alert("Please enter a SKU");
      return;
    }
    if (!formData.name.trim()) {
      alert("Please enter product name");
      return;
    }
    if (!formData.cost_price || parseFloat(formData.cost_price) < 0) {
      alert("Please enter a valid cost price");
      return;
    }
    if (!formData.selling_price || parseFloat(formData.selling_price) < 0) {
      alert("Please enter a valid selling price");
      return;
    }
    if (!formData.current_stock || parseFloat(formData.current_stock) < 0) {
      alert("Please enter a valid stock quantity");
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData = {
        ...formData,
        cost_price: parseFloat(formData.cost_price) || 0,
        selling_price: parseFloat(formData.selling_price) || 0,
        suggested_price: parseFloat(formData.suggested_price) || 0,
        current_stock: parseFloat(formData.current_stock) || 0,
        reorder_point: parseFloat(formData.reorder_point) || 10,
        max_stock: parseFloat(formData.max_stock) || null,
        lead_time_days: parseInt(formData.lead_time_days) || 7,
        supplier_info: {
          ...formData.supplier_info,
          cost: parseFloat(formData.supplier_info.cost) || null,
          min_order_qty: parseInt(formData.supplier_info.min_order_qty) || null
        },
        locations: formData.locations.map(loc => ({
          ...loc,
          quantity: parseFloat(loc.quantity) || 0,
          reserved: parseFloat(loc.reserved) || 0
        })),
        dimensions: {
          ...formData.dimensions,
          length: parseFloat(formData.dimensions.length) || null,
          width: parseFloat(formData.dimensions.width) || null,
          height: parseFloat(formData.dimensions.height) || null,
          weight: parseFloat(formData.dimensions.weight) || null
        }
      };
      await onSubmit(submitData);
    } catch (error) {
      console.error('Product submission error:', error);
      alert('Failed to save product. Please try again.');
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
          className="revolutionary-product-form w-full max-w-6xl max-h-[95vh] overflow-hidden"
        >
          <style jsx>{`
            .revolutionary-product-form {
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
            
            .section-card {
              background: linear-gradient(135deg, 
                rgba(51, 65, 85, 0.4) 0%,
                rgba(30, 41, 59, 0.3) 100%
              );
              border: 1px solid rgba(255, 255, 255, 0.08);
              border-radius: 16px;
              backdrop-filter: blur(15px);
              margin-bottom: 1.5rem;
            }
            
            .section-card:hover {
              background: linear-gradient(135deg, 
                rgba(51, 65, 85, 0.6) 0%,
                rgba(30, 41, 59, 0.5) 100%
              );
              border: 1px solid rgba(255, 255, 255, 0.12);
              transform: translateY(-1px);
            }
            
            .profit-badge {
              background: linear-gradient(45deg, #10b981, #059669);
              color: white;
              font-weight: 700;
              padding: 0.5rem 1rem;
              border-radius: 12px;
              font-size: 1.125rem;
            }
            
            .tag-item {
              background: linear-gradient(45deg, #3b82f6, #1d4ed8);
              color: white;
              padding: 0.25rem 0.75rem;
              border-radius: 20px;
              font-size: 0.75rem;
              font-weight: 600;
              display: flex;
              align-items: center;
              gap: 0.5rem;
            }
          `}</style>

          {/* Header */}
          <div className="form-header-enhanced">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {product ? 'Edit Product' : 'Add New Product'}
                  </h2>
                  <p className="text-sm text-gray-300">
                    Comprehensive inventory management with AI insights
                  </p>
                </div>
              </div>
              {formData.selling_price && formData.cost_price && (
                <div className="profit-badge">
                  {calculateProfitMargin()}% Profit Margin
                </div>
              )}
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit}>
            <div className="form-content-enhanced">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic Information */}
                <Card className="section-card">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Package className="w-5 h-5 text-orange-400" />
                      Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="enhanced-label">SKU *</Label>
                        <Input
                          value={formData.sku}
                          onChange={(e) => handleChange('sku', e.target.value)}
                          className="enhanced-input"
                          placeholder="Product SKU"
                          required
                        />
                      </div>
                      <div>
                        <Label className="enhanced-label">Barcode</Label>
                        <Input
                          value={formData.barcode}
                          onChange={(e) => handleChange('barcode', e.target.value)}
                          className="enhanced-input"
                          placeholder="UPC/EAN barcode"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="enhanced-label">Product Name *</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className="enhanced-input"
                        placeholder="Enter product name"
                        required
                      />
                    </div>

                    <div>
                      <Label className="enhanced-label">Description</Label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        className="enhanced-input min-h-20"
                        placeholder="Product description..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="enhanced-label">Category</Label>
                        <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                          <SelectTrigger className="enhanced-input">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700">
                            {PRODUCT_CATEGORIES.map(cat => (
                              <SelectItem key={cat} value={cat}>
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="enhanced-label">Brand</Label>
                        <Input
                          value={formData.brand}
                          onChange={(e) => handleChange('brand', e.target.value)}
                          className="enhanced-input"
                          placeholder="Product brand"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="enhanced-label">Status</Label>
                      <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                        <SelectTrigger className="enhanced-input">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          {PRODUCT_STATUSES.map(status => (
                            <SelectItem key={status} value={status}>
                              {status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Pricing Information */}
                <Card className="section-card">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-green-400" />
                      Pricing & Costing
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
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

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="enhanced-label">Cost Price *</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.cost_price}
                          onChange={(e) => handleChange('cost_price', e.target.value)}
                          className="enhanced-input"
                          placeholder="0.00"
                          required
                        />
                      </div>
                      <div>
                        <Label className="enhanced-label">Selling Price *</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.selling_price}
                          onChange={(e) => handleChange('selling_price', e.target.value)}
                          className="enhanced-input"
                          placeholder="0.00"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="enhanced-label">AI Suggested Price</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.suggested_price}
                        onChange={(e) => handleChange('suggested_price', e.target.value)}
                        className="enhanced-input"
                        placeholder="AI will suggest optimal price"
                      />
                    </div>

                    {formData.selling_price && formData.cost_price && (
                      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-green-300 font-medium">Profit Margin:</span>
                          <span className="text-green-400 font-bold text-lg">
                            {calculateProfitMargin()}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-green-300 font-medium">Profit per Unit:</span>
                          <span className="text-green-400 font-bold">
                            {formData.currency} {(parseFloat(formData.selling_price) - parseFloat(formData.cost_price)).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Inventory Management */}
              <Card className="section-card">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    Inventory Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label className="enhanced-label">Current Stock *</Label>
                      <Input
                        type="number"
                        min="0"
                        value={formData.current_stock}
                        onChange={(e) => handleChange('current_stock', e.target.value)}
                        className="enhanced-input"
                        placeholder="0"
                        required
                      />
                    </div>
                    <div>
                      <Label className="enhanced-label">Reorder Point</Label>
                      <Input
                        type="number"
                        min="0"
                        value={formData.reorder_point}
                        onChange={(e) => handleChange('reorder_point', e.target.value)}
                        className="enhanced-input"
                        placeholder="10"
                      />
                    </div>
                    <div>
                      <Label className="enhanced-label">Max Stock</Label>
                      <Input
                        type="number"
                        min="0"
                        value={formData.max_stock}
                        onChange={(e) => handleChange('max_stock', e.target.value)}
                        className="enhanced-input"
                        placeholder="Maximum capacity"
                      />
                    </div>
                    <div>
                      <Label className="enhanced-label">Lead Time (Days)</Label>
                      <Input
                        type="number"
                        min="0"
                        value={formData.lead_time_days}
                        onChange={(e) => handleChange('lead_time_days', e.target.value)}
                        className="enhanced-input"
                        placeholder="7"
                      />
                    </div>
                  </div>

                  {/* Stock Locations */}
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-4">
                      <Label className="enhanced-label">Stock Locations</Label>
                      <Button
                        type="button"
                        onClick={addLocation}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Location
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      {formData.locations.map((location, index) => (
                        <div key={index} className="grid grid-cols-12 gap-3 items-center bg-gray-700/30 p-3 rounded-lg">
                          <div className="col-span-5">
                            <Input
                              value={location.location_name}
                              onChange={(e) => handleLocationChange(index, 'location_name', e.target.value)}
                              className="enhanced-input text-sm"
                              placeholder="Location name"
                            />
                          </div>
                          <div className="col-span-3">
                            <Input
                              type="number"
                              min="0"
                              value={location.quantity}
                              onChange={(e) => handleLocationChange(index, 'quantity', e.target.value)}
                              className="enhanced-input text-sm"
                              placeholder="Quantity"
                            />
                          </div>
                          <div className="col-span-3">
                            <Input
                              type="number"
                              min="0"
                              value={location.reserved}
                              onChange={(e) => handleLocationChange(index, 'reserved', e.target.value)}
                              className="enhanced-input text-sm"
                              placeholder="Reserved"
                            />
                          </div>
                          <div className="col-span-1 flex justify-center">
                            {formData.locations.length > 1 && (
                              <Button
                                type="button"
                                onClick={() => removeLocation(index)}
                                variant="ghost"
                                size="sm"
                                className="text-red-400 hover:text-red-300"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Supplier Information */}
              <Card className="section-card">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Barcode className="w-5 h-5 text-purple-400" />
                    Supplier Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="enhanced-label">Supplier Name</Label>
                      <Input
                        value={formData.supplier_info.name}
                        onChange={(e) => handleChange('supplier_info.name', e.target.value)}
                        className="enhanced-input"
                        placeholder="Primary supplier"
                      />
                    </div>
                    <div>
                      <Label className="enhanced-label">Supplier Contact</Label>
                      <Input
                        value={formData.supplier_info.contact}
                        onChange={(e) => handleChange('supplier_info.contact', e.target.value)}
                        className="enhanced-input"
                        placeholder="Email or phone"
                      />
                    </div>
                    <div>
                      <Label className="enhanced-label">Supplier Cost</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.supplier_info.cost}
                        onChange={(e) => handleChange('supplier_info.cost', e.target.value)}
                        className="enhanced-input"
                        placeholder="Cost from supplier"
                      />
                    </div>
                    <div>
                      <Label className="enhanced-label">Min Order Quantity</Label>
                      <Input
                        type="number"
                        min="0"
                        value={formData.supplier_info.min_order_qty}
                        onChange={(e) => handleChange('supplier_info.min_order_qty', e.target.value)}
                        className="enhanced-input"
                        placeholder="Minimum order"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Product Tags */}
              <Card className="section-card">
                <CardHeader>
                  <CardTitle className="text-white">Product Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 mb-4">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      className="enhanced-input flex-1"
                      placeholder="Add a tag..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    />
                    <Button
                      type="button"
                      onClick={handleAddTag}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <div key={index} className="tag-item">
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-red-300"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-700 flex justify-between items-center">
              {product && onDelete && (
                <Button 
                  type="button" 
                  onClick={() => onDelete(product)} 
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Product
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
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSubmitting ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
                </Button>
              </div>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}