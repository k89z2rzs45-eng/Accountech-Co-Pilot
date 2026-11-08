
import React, { useState, useEffect } from 'react';
import { Product, InventoryMovement, InventoryAlert, PurchaseOrder } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Plus, Truck, BarChart, History, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

// Import all the inventory components we built
import InventoryDashboard from '../components/inventory/InventoryDashboard';
import ProductList from '../components/inventory/ProductList';
import InventoryAlerts from '../components/inventory/InventoryAlerts';
import StockMovements from '../components/inventory/StockMovements';
import ProductForm from '../components/inventory/ProductForm';
import PurchaseOrderForm from '../components/inventory/PurchaseOrderForm';
import { User } from '@/api/entities';
import { detectDefaultCurrency } from '@/components/utils/currency';

const TABS = [
  { name: 'Dashboard', icon: BarChart },
  { name: 'Products', icon: Package },
  { name: 'Alerts', icon: Bell },
  { name: 'Movements', icon: History },
  { name: 'Purchase Orders', icon: Truck },
];

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [defaultCurrency, setDefaultCurrency] = useState("USD");

  const [activeTab, setActiveTab] = useState('Dashboard');

  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [showPOForm, setShowPOForm] = useState(false);
  const [editingPO, setEditingPO] = useState(null);

  useEffect(() => {
    loadData();
    (async () => {
        const me = await User.me().catch(() => null);
        const auto = detectDefaultCurrency({ userCountry: me?.country, userPreferred: me?.preferred_currency });
        setDefaultCurrency(auto || "USD");
    })();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [productsData, movementsData, alertsData, poData] = await Promise.all([
        Product.list('-created_date', 500),
        InventoryMovement.list('-created_date', 200),
        InventoryAlert.list('-created_date', 100),
        PurchaseOrder.list('-created_date', 100),
      ]);
      setProducts(productsData);
      setMovements(movementsData);
      setAlerts(alertsData);
      setPurchaseOrders(poData);
    } catch (error) {
      console.error("Failed to load inventory data:", error);
    }
    setIsLoading(false);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };
  
  const handleDeleteProduct = async (product) => {
    if (confirm(`Are you sure you want to permanently delete the product "${product.name}" (SKU: ${product.sku})? This action cannot be undone.`)) {
      try {
        await Product.delete(product.id);
        setEditingProduct(null);
        setShowProductForm(false);
        await loadData();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product. Please try again.');
      }
    }
  };

  const handleProductSubmit = async (formData) => {
    if (editingProduct) {
      await Product.update(editingProduct.id, formData);
    } else {
      await Product.create(formData);
    }
    setEditingProduct(null);
    setShowProductForm(false);
    loadData();
  };
  
  const handleEditPO = (po) => {
    setEditingPO(po);
    setShowPOForm(true);
  };

  const handlePOSubmit = async (formData) => {
    if (editingPO) {
      await PurchaseOrder.update(editingPO.id, formData);
    } else {
      await PurchaseOrder.create(formData);
    }
    setEditingPO(null);
    setShowPOForm(false);
    loadData();
  };

  const handleAutoReorder = (product) => {
    // This is where you would trigger an AI-powered reorder workflow
    console.log("Auto-reordering for:", product.name);
    alert(`AI is generating a Purchase Order for ${product.name}...`);
    // For now, let's just open the PO form with pre-filled data
    const newPO = {
        supplier_name: product.supplier_info?.name || "",
        items: [{
            product_sku: product.sku,
            product_name: product.name,
            quantity_ordered: (product.max_stock || 100) - product.current_stock,
            unit_cost: product.supplier_info?.cost || product.cost_price,
            total_cost: ((product.max_stock || 100) - product.current_stock) * (product.supplier_info?.cost || product.cost_price)
        }],
        ai_generated: true,
    };
    setEditingPO(newPO);
    setShowPOForm(true);
  };

  return (
    <div className="min-h-screen inventory-future-container">
      <style jsx>{`
        /* REVOLUTIONARY INVENTORY PAGE STYLES */
        .inventory-future-container {
          background: linear-gradient(135deg, 
            #0a0a0a 0%,
            #1a1a2e 25%,
            #16213e 50%,
            #0f0f23 75%,
            #000000 100%
          );
          background-size: 400% 400%;
          animation: cosmicInventoryFlow 18s ease infinite;
          position: relative;
          overflow: hidden;
          padding: 2rem;
          min-height: 100vh;
        }
        
        @keyframes cosmicInventoryFlow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        /* Floating Data Particles */
        .inventory-future-container::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 15% 25%, rgba(0, 255, 136, 0.03) 1px, transparent 1px),
            radial-gradient(circle at 85% 75%, rgba(255, 0, 255, 0.02) 1px, transparent 1px),
            radial-gradient(circle at 50% 50%, rgba(0, 255, 255, 0.02) 1px, transparent 1px);
          background-size: 60px 60px, 80px 80px, 100px 100px;
          animation: inventoryDataFloat 25s linear infinite;
          z-index: 1;
          pointer-events: none;
        }
        
        @keyframes inventoryDataFloat {
          0% { transform: translate(0, 0) rotate(0deg); }
          100% { transform: translate(-60px, -60px) rotate(360deg); }
        }
        
        /* Enhanced Header */
        .inventory-header-enhanced {
          position: relative;
          z-index: 10;
          margin-bottom: 2rem;
        }
        
        .inventory-title-enhanced {
          background: linear-gradient(135deg, #00ff88 0%, #00ffff 50%, #ff00ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 900;
          font-size: 3rem;
          text-shadow: 
            0 0 30px rgba(0, 255, 136, 0.8),
            0 0 60px rgba(0, 255, 255, 0.6),
            0 4px 8px rgba(0, 0, 0, 0.8);
          filter: drop-shadow(0 0 15px rgba(0, 255, 136, 0.9));
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 0.5rem;
        }
        
        .inventory-subtitle-enhanced {
          color: #e2e8f0;
          font-size: 1.25rem;
          font-weight: 600;
          text-shadow: 
            0 2px 4px rgba(0, 0, 0, 0.8),
            0 0 15px rgba(0, 255, 136, 0.4);
          margin-bottom: 1.5rem;
        }
        
        /* Revolutionary Action Buttons */
        .neuro-button {
          background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%);
          border: 2px solid rgba(139, 92, 246, 0.5);
          border-radius: 16px;
          color: white;
          font-weight: 700;
          padding: 1rem 2rem;
          transition: all 0.3s ease;
          box-shadow: 
            0 8px 32px rgba(139, 92, 246, 0.3),
            0 0 20px rgba(59, 130, 246, 0.2);
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }
        
        .neuro-button::before {
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
        
        .neuro-button:hover::before {
          left: 100%;
        }
        
        .neuro-button:hover {
          transform: translateY(-3px) scale(1.02);
          border: 2px solid rgba(139, 92, 246, 0.8);
          box-shadow: 
            0 12px 40px rgba(139, 92, 246, 0.4),
            0 0 30px rgba(59, 130, 246, 0.3);
        }
        
        .neuro-button-primary {
          background: linear-gradient(135deg, #00ff88 0%, #00ffff 100%);
          border: 2px solid rgba(0, 255, 136, 0.5);
          border-radius: 16px;
          color: #000000;
          font-weight: 800;
          padding: 1rem 2rem;
          transition: all 0.3s ease;
          box-shadow: 
            0 8px 32px rgba(0, 255, 136, 0.3),
            0 0 20px rgba(0, 255, 255, 0.2);
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }
        
        .neuro-button-primary::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, 
            transparent, 
            rgba(255, 255, 255, 0.4), 
            transparent
          );
          transition: left 0.5s ease;
        }
        
        .neuro-button-primary:hover::before {
          left: 100%;
        }
        
        .neuro-button-primary:hover {
          transform: translateY(-3px) scale(1.02);
          border: 2px solid rgba(0, 255, 136, 0.8);
          box-shadow: 
            0 12px 40px rgba(0, 255, 136, 0.4),
            0 0 30px rgba(0, 255, 255, 0.3);
        }
        
        /* Enhanced Tabs */
        .inventory-tabs-enhanced {
          position: relative;
          z-index: 10;
          background: linear-gradient(135deg, 
            rgba(15, 23, 42, 0.8) 0%,
            rgba(30, 41, 59, 0.6) 100%
          );
          border: 1px solid rgba(0, 255, 136, 0.2);
          border-radius: 20px;
          backdrop-filter: blur(20px);
          padding: 1rem;
          margin-bottom: 2rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        }
        
        .inventory-tab-button {
          background: transparent;
          border: 2px solid transparent;
          border-radius: 12px;
          color: rgba(148, 163, 184, 0.8);
          font-weight: 600;
          padding: 0.75rem 1.5rem;
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        
        .inventory-tab-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, 
            rgba(0, 255, 136, 0.1) 0%,
            rgba(0, 255, 255, 0.05) 100%
          );
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .inventory-tab-button:hover::before {
          opacity: 1;
        }
        
        .inventory-tab-button:hover {
          color: #00ff88;
          border: 2px solid rgba(0, 255, 136, 0.3);
          transform: translateY(-2px);
        }
        
        .inventory-tab-button.active {
          background: linear-gradient(135deg, 
            rgba(0, 255, 136, 0.2) 0%,
            rgba(0, 255, 255, 0.1) 100%
          );
          border: 2px solid rgba(0, 255, 136, 0.6);
          color: #00ff88;
          box-shadow: 0 4px 20px rgba(0, 255, 136, 0.3);
        }
        
        /* Revolutionary Cards */
        .clay-card {
          background: linear-gradient(145deg, 
            rgba(15, 23, 42, 0.98) 0%,
            rgba(30, 41, 59, 0.95) 100%
          );
          border: 1px solid rgba(0, 255, 136, 0.1);
          border-radius: 20px;
          backdrop-filter: blur(30px);
          box-shadow: 
            0 12px 40px rgba(0, 0, 0, 0.4),
            0 0 60px rgba(0, 255, 136, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        .clay-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, 
            rgba(0, 255, 136, 0.03) 0%,
            rgba(0, 255, 255, 0.02) 50%,
            rgba(255, 0, 255, 0.03) 100%
          );
          animation: cardShimmer 8s ease-in-out infinite;
          z-index: 1;
        }
        
        @keyframes cardShimmer {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        
        .clay-card:hover {
          border: 1px solid rgba(0, 255, 136, 0.3);
          box-shadow: 
            0 20px 50px rgba(0, 0, 0, 0.5),
            0 0 80px rgba(0, 255, 136, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          transform: translateY(-4px);
        }
        
        /* Enhanced Content */
        .inventory-content {
          position: relative;
          z-index: 10;
        }
        
        /* Typography Enhancement */
        .inventory-card-title {
          color: #f1f5f9;
          font-weight: 700;
          font-size: 1.5rem;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
        }
        
        .inventory-text {
          color: rgba(148, 163, 184, 0.9);
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
        }
        
        /* Enhanced Button Styles */
        .clay-button-primary {
          background: linear-gradient(135deg, #00ff88 0%, #00ffff 100%);
          border: 2px solid rgba(0, 255, 136, 0.5);
          border-radius: 12px;
          color: #000000;
          font-weight: 700;
          padding: 0.75rem 1.5rem;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .clay-button-primary:hover {
          transform: translateY(-2px) scale(1.02);
          border: 2px solid rgba(0, 255, 136, 0.8);
          box-shadow: 0 8px 25px rgba(0, 255, 136, 0.4);
        }
      `}</style>

      {/* Enhanced Header with Maximum Visibility */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="inventory-header-enhanced"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="inventory-title-enhanced">
              <Package className="w-12 h-12" style={{
                color: '#00ff88',
                filter: 'drop-shadow(0 0 20px rgba(0, 255, 136, 1))'
              }} />
              INTELLIGENT INVENTORY
            </h1>
            <p className="inventory-subtitle-enhanced">
              AI-powered stock, order, and supply chain management.
            </p>
          </div>
          <div className="flex gap-4">
            <Button className="neuro-button" onClick={() => setShowPOForm(true)}>
              <Truck className="w-4 h-4 mr-2" />
              Create Purchase Order
            </Button>
            <Button className="neuro-button-primary" onClick={() => {
              setEditingProduct(null);
              setShowProductForm(true);
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="inventory-tabs-enhanced"
      >
        <nav className="flex space-x-2" aria-label="Tabs">
          {TABS.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`inventory-tab-button ${activeTab === tab.name ? 'active' : ''} flex items-center gap-2`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.name}
            </button>
          ))}
        </nav>
      </motion.div>

      {/* Enhanced Content */}
      <div className="inventory-content">
        {activeTab === 'Dashboard' && <InventoryDashboard products={products} movements={movements} alerts={alerts} currency={defaultCurrency} onAutoReorder={handleAutoReorder} />}
        {activeTab === 'Products' && <ProductList products={products} isLoading={isLoading} onEdit={handleEditProduct} onAutoReorder={handleAutoReorder} />}
        {activeTab === 'Alerts' && <InventoryAlerts alerts={alerts} products={products} onAutoReorder={handleAutoReorder} />}
        {activeTab === 'Movements' && <StockMovements movements={movements} products={products} />}
        {activeTab === 'Purchase Orders' && (
          <Card className="clay-card">
              <CardHeader>
                  <CardTitle className="inventory-card-title">All Purchase Orders</CardTitle>
              </CardHeader>
              <CardContent>
                  <ul className="space-y-2">
                      {purchaseOrders.map(po => (
                          <li key={po.id} onClick={() => handleEditPO(po)} className="p-3 border border-slate-700 rounded-lg hover:bg-slate-800/50 cursor-pointer flex justify-between items-center transition-all">
                              <div>
                                  <p className="font-semibold text-gray-100">{po.po_number} - {po.supplier_name}</p>
                                  <p className="text-sm inventory-text">Status: {po.status} | Total: {po.currency} {po.total_amount}</p>
                              </div>
                              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">Edit</Button>
                          </li>
                      ))}
                  </ul>
              </CardContent>
          </Card>
        )}
      </div>

      {showProductForm && (
        <ProductForm
          product={editingProduct}
          onSubmit={handleProductSubmit}
          onCancel={() => { 
            setShowProductForm(false); 
            setEditingProduct(null); 
          }}
          onDelete={handleDeleteProduct}
          defaultCurrency={defaultCurrency}
        />
      )}
      
      {showPOForm && (
        <PurchaseOrderForm
          purchaseOrder={editingPO}
          products={products}
          onSubmit={handlePOSubmit}
          onCancel={() => { 
            setShowPOForm(false); 
            setEditingPO(null); 
          }}
          defaultCurrency={defaultCurrency}
        />
      )}

    </div>
  );
}
