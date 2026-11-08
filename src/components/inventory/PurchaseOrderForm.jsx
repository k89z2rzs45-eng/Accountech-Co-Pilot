import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Save, X, Truck, Calendar, DollarSign, Package, Sparkles, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PurchaseOrderForm({ purchaseOrder, products, onSubmit, onCancel, defaultCurrency }) {
  const [poData, setPOData] = useState(purchaseOrder || {
    po_number: `PO-${Date.now()}`,
    supplier_name: '',
    order_date: new Date().toISOString().split('T')[0],
    expected_delivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: [{ product_sku: '', quantity_ordered: 1, unit_cost: 0 }],
    currency: defaultCurrency,
    status: 'draft',
    notes: ''
  });

  const handleItemChange = (index, field, value) => {
    const newItems = [...poData.items];
    newItems[index][field] = value;
    
    if (field === 'product_sku') {
      const product = products.find(p => p.sku === value);
      if (product) {
        newItems[index].unit_cost = product.cost_price;
        newItems[index].product_name = product.name;
      }
    }

    setPOData(prev => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setPOData(prev => ({
      ...prev,
      items: [...prev.items, { product_sku: '', quantity_ordered: 1, unit_cost: 0 }]
    }));
  };

  const removeItem = (index) => {
    setPOData(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
  };

  const calculateTotals = () => {
    const subtotal = poData.items.reduce((sum, item) => {
      const quantity = parseFloat(item.quantity_ordered) || 0;
      const cost = parseFloat(item.unit_cost) || 0;
      return sum + quantity * cost;
    }, 0);
    return { subtotal, total_amount: subtotal };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const totals = calculateTotals();
    onSubmit({ ...poData, ...totals });
  };

  const { total_amount } = calculateTotals();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, rotateY: -15 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          exit={{ scale: 0.9, opacity: 0, rotateY: 15 }}
          className="revolutionary-po-form w-full max-w-5xl max-h-[95vh] overflow-hidden"
        >
          <style jsx>{`
            /* REVOLUTIONARY PURCHASE ORDER FORM STYLES */
            .revolutionary-po-form {
              background: linear-gradient(145deg, 
                rgba(5, 15, 35, 0.98) 0%,
                rgba(20, 30, 55, 0.96) 25%,
                rgba(35, 45, 75, 0.94) 50%,
                rgba(20, 30, 55, 0.96) 75%,
                rgba(5, 15, 35, 0.98) 100%
              );
              border: 3px solid transparent;
              border-image: linear-gradient(45deg, #ff6b35, #f7931e, #ffd700, #ff6b35) 1;
              border-radius: 28px;
              backdrop-filter: blur(40px);
              box-shadow: 
                0 30px 60px rgba(0, 0, 0, 0.6),
                0 0 120px rgba(255, 107, 53, 0.3),
                0 0 240px rgba(247, 147, 30, 0.2),
                inset 0 2px 0 rgba(255, 215, 0, 0.15);
              position: relative;
              overflow: hidden;
              animation: poFormPulse 8s ease-in-out infinite;
            }
            
            @keyframes poFormPulse {
              0%, 100% {
                border-image: linear-gradient(45deg, #ff6b35, #f7931e, #ffd700, #ff6b35) 1;
                box-shadow: 
                  0 30px 60px rgba(0, 0, 0, 0.6),
                  0 0 120px rgba(255, 107, 53, 0.3),
                  0 0 240px rgba(247, 147, 30, 0.2),
                  inset 0 2px 0 rgba(255, 215, 0, 0.15);
              }
              50% {
                border-image: linear-gradient(45deg, #ffd700, #ff6b35, #f7931e, #ffd700) 1;
                box-shadow: 
                  0 35px 70px rgba(0, 0, 0, 0.7),
                  0 0 150px rgba(255, 215, 0, 0.4),
                  0 0 300px rgba(255, 107, 53, 0.3),
                  inset 0 2px 0 rgba(247, 147, 30, 0.2);
              }
            }
            
            .revolutionary-po-form::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: 
                radial-gradient(circle at 20% 30%, rgba(255, 107, 53, 0.08) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, rgba(247, 147, 30, 0.06) 0%, transparent 50%),
                radial-gradient(circle at 50% 50%, rgba(255, 215, 0, 0.04) 0%, transparent 50%);
              animation: poBackgroundFloat 15s ease-in-out infinite;
              pointer-events: none;
              z-index: 1;
            }
            
            @keyframes poBackgroundFloat {
              0%, 100% { opacity: 0.4; transform: rotate(0deg) scale(1); }
              33% { opacity: 0.6; transform: rotate(120deg) scale(1.05); }
              66% { opacity: 0.5; transform: rotate(240deg) scale(0.95); }
            }
            
            .po-form-header {
              background: linear-gradient(135deg, 
                rgba(255, 107, 53, 0.15) 0%,
                rgba(247, 147, 30, 0.1) 50%,
                rgba(255, 215, 0, 0.08) 100%
              );
              backdrop-filter: blur(30px);
              border-bottom: 2px solid rgba(255, 107, 53, 0.3);
              position: relative;
              overflow: hidden;
              z-index: 2;
            }
            
            .po-form-header::after {
              content: '';
              position: absolute;
              bottom: 0;
              left: 0;
              right: 0;
              height: 4px;
              background: linear-gradient(90deg, #ff6b35, #f7931e, #ffd700, #ff6b35);
              background-size: 300% 100%;
              animation: poHeaderFlow 12s ease infinite;
            }
            
            @keyframes poHeaderFlow {
              0%, 100% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
            }
            
            .po-form-content {  
              position: relative;
              z-index: 10;
              padding: 2rem;
              height: 100%;
              display: flex;
              flex-direction: column;
            }
            
            .po-form-title {
              color: #ffffff;
              font-weight: 900;
              font-size: 2.5rem;
              text-shadow: 
                0 0 20px rgba(255, 107, 53, 0.8),
                0 0 40px rgba(247, 147, 30, 0.6),
                0 4px 8px rgba(0, 0, 0, 0.9);
              background: linear-gradient(45deg, #ffffff, #ff6b35, #ffd700);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              margin-bottom: 0.5rem;
              animation: poTitleGlow 6s ease-in-out infinite alternate;
            }
            
            @keyframes poTitleGlow {
              0% { 
                text-shadow: 
                  0 0 20px rgba(255, 107, 53, 0.8),
                  0 0 40px rgba(247, 147, 30, 0.6);
              }
              100% { 
                text-shadow: 
                  0 0 30px rgba(255, 215, 0, 0.9),
                  0 0 60px rgba(255, 107, 53, 0.7);
              }
            }
            
            .po-subtitle {
              color: #f7931e;
              font-size: 1.125rem;
              font-weight: 600;
              text-shadow: 0 0 15px rgba(247, 147, 30, 0.6);
              margin-bottom: 2rem;
            }
            
            .po-section {
              background: linear-gradient(135deg, 
                rgba(255, 255, 255, 0.08) 0%,
                rgba(255, 255, 255, 0.04) 50%,
                rgba(255, 255, 255, 0.02) 100%
              );
              border: 2px solid rgba(255, 107, 53, 0.2);
              border-radius: 20px;
              backdrop-filter: blur(20px);
              transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
              overflow: hidden;
              margin-bottom: 2rem;
              position: relative;
            }
            
            .po-section::before {
              content: '';
              position: absolute;
              top: 0;
              left: -100%;
              width: 100%;
              height: 100%;
              background: linear-gradient(90deg, 
                transparent, 
                rgba(255, 215, 0, 0.1), 
                transparent
              );
              transition: left 0.8s ease;
            }
            
            .po-section:hover::before {
              left: 100%;
            }
            
            .po-section:hover {
              background: linear-gradient(135deg, 
                rgba(255, 255, 255, 0.12) 0%,
                rgba(255, 255, 255, 0.08) 50%,
                rgba(255, 255, 255, 0.06) 100%
              );
              border: 2px solid rgba(255, 107, 53, 0.4);
              box-shadow: 0 8px 32px rgba(255, 107, 53, 0.2);
              transform: translateY(-3px) scale(1.002);
            }
            
            .po-section-header {
              background: linear-gradient(135deg,
                rgba(255, 107, 53, 0.15) 0%,
                rgba(247, 147, 30, 0.1) 100%
              );
              border-bottom: 1px solid rgba(255, 107, 53, 0.2);
              backdrop-filter: blur(15px);
              transition: all 0.3s ease;
            }
            
            .po-section-title {
              color: #ffd700;
              font-weight: 800;
              font-size: 1.25rem;
              text-shadow: 0 0 12px rgba(255, 215, 0, 0.6);
              display: flex;
              align-items: center;
              gap: 0.75rem;
            }
            
            .po-section-icon {
              background: linear-gradient(135deg,
                rgba(255, 107, 53, 0.3) 0%,
                rgba(247, 147, 30, 0.2) 100%
              );
              border: 2px solid rgba(255, 107, 53, 0.4);
              border-radius: 14px;
              backdrop-filter: blur(15px);
              transition: all 0.3s ease;
              position: relative;
              overflow: hidden;
            }
            
            .po-section-icon::before {
              content: '';
              position: absolute;
              top: 50%;
              left: 50%;
              width: 0;
              height: 0;
              background: radial-gradient(circle, rgba(255, 215, 0, 0.4) 0%, transparent 70%);
              transition: all 0.3s ease;
              transform: translate(-50%, -50%);
              border-radius: 50%;
            }
            
            .po-section:hover .po-section-icon::before {
              width: 120px;
              height: 120px;
            }
            
            .po-section:hover .po-section-icon {
              background: linear-gradient(135deg,
                rgba(255, 107, 53, 0.4) 0%,
                rgba(247, 147, 30, 0.3) 100%
              );
              animation: poIconSpin 2s ease-in-out infinite;
              transform: scale(1.1);
            }
            
            @keyframes poIconSpin {
              0%, 100% { 
                box-shadow: 0 0 20px rgba(255, 107, 53, 0.4); 
              }
              50% { 
                box-shadow: 0 0 40px rgba(255, 215, 0, 0.6); 
                transform: scale(1.15) rotateY(10deg);
              }
            }
            
            .po-enhanced-input {
              background: linear-gradient(135deg, 
                rgba(255, 255, 255, 0.1) 0%,
                rgba(255, 255, 255, 0.05) 100%
              );
              border: 2px solid rgba(255, 107, 53, 0.3);
              border-radius: 14px;
              color: rgba(255, 255, 255, 0.95);
              backdrop-filter: blur(15px);
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
              position: relative;
              overflow: hidden;
              padding: 0.875rem;
            }
            
            .po-enhanced-input::before {
              content: '';
              position: absolute;
              top: 0;
              left: -100%;
              width: 100%;
              height: 100%;
              background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.1), transparent);
              transition: left 0.6s ease;
            }
            
            .po-enhanced-input:focus::before {
              left: 100%;
            }
            
            .po-enhanced-input:focus {
              background: linear-gradient(135deg, 
                rgba(255, 255, 255, 0.15) 0%,
                rgba(255, 255, 255, 0.08) 100%
              );
              border: 2px solid rgba(255, 215, 0, 0.6);
              box-shadow: 0 0 25px rgba(255, 215, 0, 0.3);
              color: rgba(255, 255, 255, 1);
              transform: scale(1.02);
              outline: none;
            }
            
            .po-enhanced-input::placeholder {
              color: rgba(255, 255, 255, 0.4);
            }
            
            .po-enhanced-label {
              color: rgba(255, 255, 255, 0.9);
              font-weight: 700;
              font-size: 0.875rem;
              transition: all 0.3s ease;
              position: relative;
              margin-bottom: 0.5rem;
              display: block;
            }
            
            .po-enhanced-label::after {
              content: '';
              position: absolute;
              bottom: -3px;
              left: 0;
              width: 0;
              height: 2px;
              background: linear-gradient(90deg, #ff6b35, #ffd700);
              transition: width 0.3s ease;
            }
            
            .po-section:hover .po-enhanced-label::after {
              width: 100%;
            }
            
            .po-item-row {
              background: linear-gradient(135deg, 
                rgba(255, 107, 53, 0.08) 0%,
                rgba(247, 147, 30, 0.06) 50%,
                rgba(255, 215, 0, 0.04) 100%
              );
              border: 1px solid rgba(255, 107, 53, 0.2);
              border-radius: 16px;
              backdrop-filter: blur(15px);
              transition: all 0.3s ease;
              margin-bottom: 1rem;
              position: relative;
              overflow: hidden;
            }
            
            .po-item-row:hover {
              background: linear-gradient(135deg, 
                rgba(255, 107, 53, 0.12) 0%,
                rgba(247, 147, 30, 0.1) 50%,
                rgba(255, 215, 0, 0.08) 100%
              );
              border: 1px solid rgba(255, 107, 53, 0.4);
              transform: translateY(-2px);
              box-shadow: 0 8px 25px rgba(255, 107, 53, 0.2);
            }
            
            .po-action-button {
              background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
              border: 2px solid rgba(255, 107, 53, 0.5);
              border-radius: 14px;
              color: white;
              font-weight: 700;
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
              position: relative;
              overflow: hidden;
              box-shadow: 0 6px 20px rgba(255, 107, 53, 0.3);
            }
            
            .po-action-button::before {
              content: '';
              position: absolute;
              top: 0;
              left: -100%;
              width: 100%;
              height: 100%;
              background: linear-gradient(90deg, 
                transparent, 
                rgba(255, 255, 255, 0.3), 
                transparent
              );
              transition: left 0.5s ease;
            }
            
            .po-action-button:hover::before {
              left: 100%;
            }
            
            .po-action-button:hover {
              background: linear-gradient(135deg, #e55a2b 0%, #dc7d14 100%);
              transform: translateY(-3px) scale(1.05);
              box-shadow: 0 10px 30px rgba(255, 107, 53, 0.4);
            }
            
            .po-cancel-button {
              background: linear-gradient(135deg, 
                rgba(107, 114, 128, 0.8) 0%,
                rgba(75, 85, 99, 0.6) 100%
              );
              border: 2px solid rgba(107, 114, 128, 0.5);
              color: rgba(255, 255, 255, 0.9);
            }
            
            .po-cancel-button:hover {
              background: linear-gradient(135deg, 
                rgba(107, 114, 128, 1) 0%,
                rgba(75, 85, 99, 0.8) 100%
              );
              transform: translateY(-2px);
            }
            
            .po-primary-button {
              background: linear-gradient(135deg, #ffd700 0%, #ff6b35 100%);
              border: 2px solid rgba(255, 215, 0, 0.6);
              color: #000000;
              font-weight: 800;
            }
            
            .po-primary-button:hover {
              background: linear-gradient(135deg, #ffed4e 0%, #ff8c42 100%);
              box-shadow: 0 10px 30px rgba(255, 215, 0, 0.4);
            }
            
            .po-delete-button {
              background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
              border: 2px solid rgba(239, 68, 68, 0.5);
              color: white;
            }
            
            .po-delete-button:hover {
              background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
              box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);
            }
            
            .po-total-display {
              background: linear-gradient(135deg, 
                rgba(255, 215, 0, 0.15) 0%,
                rgba(255, 107, 53, 0.1) 100%
              );
              border: 2px solid rgba(255, 215, 0, 0.4);
              border-radius: 20px;
              backdrop-filter: blur(20px);
              animation: poTotalPulse 4s ease-in-out infinite;
            }
            
            @keyframes poTotalPulse {
              0%, 100% {
                border: 2px solid rgba(255, 215, 0, 0.4);
                box-shadow: 0 0 20px rgba(255, 215, 0, 0.2);
              }
              50% {
                border: 2px solid rgba(255, 215, 0, 0.6);
                box-shadow: 0 0 30px rgba(255, 215, 0, 0.4);
              }
            }
            
            .po-total-amount {
              background: linear-gradient(45deg, #ffd700, #ff6b35);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              font-size: 2rem;
              font-weight: 900;
              text-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
            }
            
            .po-form-scroll {
              flex: 1;
              overflow-y: auto;
              padding-right: 1rem;
              margin-right: -1rem;
            }
            
            .po-form-footer {
              display: flex;
              justify-content: flex-end;
              gap: 1rem;
              padding-top: 2rem;
              border-top: 2px solid rgba(255, 107, 53, 0.3);
              margin-top: auto;
            }
            
            .po-grid {
              display: grid;
              gap: 1.5rem;
              margin-bottom: 1.5rem;
            }
            
            @media (min-width: 768px) {
              .po-grid {
                grid-template-columns: repeat(2, 1fr);
              }
            }
            
            @media (min-width: 1024px) {
              .po-grid.po-grid-4 {
                grid-template-columns: repeat(4, 1fr);
              }
            }
          `}</style>

          <div className="po-form-content">
            <div className="po-form-header p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="po-form-title flex items-center gap-3">
                    <Truck className="w-10 h-10 text-orange-400" />
                    {purchaseOrder ? 'Edit Purchase Order' : 'Create Purchase Order'}
                  </h2>
                  <p className="po-subtitle">
                    Smart procurement with AI-powered supplier management
                  </p>
                </div>
                <button 
                  onClick={onCancel}
                  className="text-gray-400 hover:text-white transition-colors p-3 hover:bg-white/10 rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="po-form-scroll">
              <form onSubmit={handleSubmit}>
                
                {/* Order Information Section */}
                <div className="po-section">
                  <div className="po-section-header p-4">
                    <h3 className="po-section-title">
                      <div className="po-section-icon w-10 h-10 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-orange-400" />
                      </div>
                      Order Information
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="po-grid">
                      <div>
                        <label className="po-enhanced-label">PO Number</label>
                        <input 
                          value={poData.po_number} 
                          readOnly 
                          disabled 
                          className="po-enhanced-input opacity-60"
                        />
                      </div>
                      <div>
                        <label className="po-enhanced-label">Supplier Name *</label>
                        <input 
                          value={poData.supplier_name} 
                          onChange={e => setPOData({ ...poData, supplier_name: e.target.value })} 
                          required 
                          className="po-enhanced-input"
                          placeholder="Enter supplier name"
                        />
                      </div>
                      <div>
                        <label className="po-enhanced-label">Order Date</label>
                        <input 
                          type="date" 
                          value={poData.order_date} 
                          onChange={e => setPOData({ ...poData, order_date: e.target.value })} 
                          className="po-enhanced-input"
                        />
                      </div>
                      <div>
                        <label className="po-enhanced-label">Expected Delivery</label>
                        <input 
                          type="date" 
                          value={poData.expected_delivery} 
                          onChange={e => setPOData({ ...poData, expected_delivery: e.target.value })} 
                          className="po-enhanced-input"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items Section */}
                <div className="po-section">
                  <div className="po-section-header p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="po-section-title">
                        <div className="po-section-icon w-10 h-10 flex items-center justify-center">
                          <Package className="w-5 h-5 text-orange-400" />
                        </div>
                        Order Items
                      </h3>
                      <Button 
                        type="button" 
                        onClick={addItem} 
                        className="po-action-button px-4 py-2"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Item
                      </Button>
                    </div>
                  </div>
                  <div className="p-6">
                    {poData.items.map((item, index) => (
                      <div key={index} className="po-item-row p-4">
                        <div className="po-grid po-grid-4">
                          <div>
                            <label className="po-enhanced-label text-sm">Product</label>
                            <select 
                              value={item.product_sku} 
                              onChange={e => handleItemChange(index, 'product_sku', e.target.value)}
                              className="po-enhanced-input"
                            >
                              <option value="">Select Product</option>
                              {products.map(p => (
                                <option key={p.id} value={p.sku} style={{ background: '#1e293b', color: '#f8fafc' }}>
                                  {p.name} ({p.sku})
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="po-enhanced-label text-sm">Quantity</label>
                            <input 
                              type="number" 
                              value={item.quantity_ordered} 
                              onChange={e => handleItemChange(index, 'quantity_ordered', e.target.value)} 
                              className="po-enhanced-input"
                              placeholder="1"
                              min="1"
                            />
                          </div>
                          <div>
                            <label className="po-enhanced-label text-sm">Unit Cost</label>
                            <input 
                              type="number" 
                              step="0.01" 
                              value={item.unit_cost} 
                              onChange={e => handleItemChange(index, 'unit_cost', e.target.value)} 
                              className="po-enhanced-input"
                              placeholder="0.00"
                            />
                          </div>
                          <div className="flex items-end">
                            <Button 
                              type="button" 
                              onClick={() => removeItem(index)} 
                              className="po-delete-button po-action-button w-full"
                              disabled={poData.items.length === 1}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total Section */}
                <div className="po-total-display p-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <DollarSign className="w-6 h-6 text-yellow-400" />
                    <h3 className="text-xl font-bold text-white">Order Total</h3>
                  </div>
                  <p className="po-total-amount">
                    {poData.currency} {total_amount.toFixed(2)}
                  </p>
                </div>

              </form>
            </div>

            <div className="po-form-footer">
              <button 
                type="button" 
                onClick={onCancel} 
                className="po-cancel-button po-action-button px-6 py-3"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </button>
              <button 
                onClick={handleSubmit}
                className="po-primary-button po-action-button px-6 py-3"
              >
                <Save className="w-4 h-4 mr-2" />
                {purchaseOrder ? 'Update PO' : 'Create PO'}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}