import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, TrendingUp, AlertTriangle, ShoppingCart, DollarSign, BarChart3, Plus, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

import ProductList from "./ProductList";
import InventoryAlerts from "./InventoryAlerts";

export default function InventoryDashboard({ 
  products = [], 
  movements = [], 
  alerts = [],
  isLoading = false,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onViewProduct,
  onRefresh,
  defaultCurrency = "USD"
}) {
  const [activeTab, setActiveTab] = useState("overview");

  // Calculate metrics
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === 'active').length;
  const lowStockProducts = products.filter(p => p.current_stock <= p.reorder_point).length;
  const outOfStockProducts = products.filter(p => p.current_stock <= 0).length;
  
  const totalInventoryValue = products.reduce((sum, p) => 
    sum + (p.current_stock * p.cost_price), 0
  );
  
  const totalSellingValue = products.reduce((sum, p) => 
    sum + (p.current_stock * p.selling_price), 0
  );
  
  const potentialProfit = totalSellingValue - totalInventoryValue;

  const recentMovements = movements.slice(0, 5);
  const activeAlerts = alerts.filter(a => a.status === 'active');

  return (
    <div className="space-y-8">
      <style jsx>{`
        .revolutionary-inventory-dashboard {
          background: linear-gradient(135deg, 
            #0a0a0a 0%,
            #1a1a2e 25%,
            #16213e 50%,
            #0f0f23 75%,
            #000000 100%
          );
          background-size: 400% 400%;
          animation: inventoryFlow 20s ease infinite;
          position: relative;
          overflow: hidden;
          padding: 2rem;
          min-height: 100vh;
          border-radius: 0;
        }
        
        @keyframes inventoryFlow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .inventory-metric-card {
          background: linear-gradient(145deg, 
            rgba(15, 23, 42, 0.98) 0%,
            rgba(30, 41, 59, 0.95) 25%,
            rgba(51, 65, 85, 0.92) 50%,
            rgba(30, 41, 59, 0.95) 75%,
            rgba(15, 23, 42, 0.98) 100%
          );
          backdrop-filter: blur(30px);
          border: 2px solid transparent;
          border-image: linear-gradient(45deg, #10b981, #3b82f6, #8b5cf6, #10b981) 1;
          border-radius: 20px;
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.4),
            0 0 80px rgba(16, 185, 129, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }
        
        .inventory-metric-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg,
            transparent,
            rgba(16, 185, 129, 0.1),
            transparent
          );
          transition: left 0.6s ease;
        }
        
        .inventory-metric-card:hover::before {
          left: 100%;
        }
        
        .inventory-metric-card:hover {
          transform: translateY(-8px) scale(1.02);
          border-image: linear-gradient(45deg, #3b82f6, #8b5cf6, #10b981, #3b82f6) 1;
          box-shadow: 
            0 30px 60px rgba(0, 0, 0, 0.5),
            0 0 120px rgba(16, 185, 129, 0.25),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }
        
        .metric-icon-container {
          width: 4rem;
          height: 4rem;
          background: linear-gradient(135deg,
            rgba(16, 185, 129, 0.2) 0%,
            rgba(59, 130, 246, 0.15) 100%
          );
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: 16px;
          backdrop-filter: blur(15px);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .inventory-metric-card:hover .metric-icon-container {
          background: linear-gradient(135deg,
            rgba(16, 185, 129, 0.3) 0%,
            rgba(59, 130, 246, 0.25) 100%
          );
          border: 1px solid rgba(16, 185, 129, 0.5);
          transform: scale(1.1) rotate(5deg);
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
        }
        
        .metric-value {
          color: #f8fafc !important;
          font-weight: 900;
          font-size: 2.5rem;
          text-shadow: 0 0 20px rgba(16, 185, 129, 0.5);
          background: linear-gradient(45deg, #f8fafc, #e2e8f0, #cbd5e1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .metric-label {
          color: #94a3b8 !important;
          font-weight: 600;
          font-size: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
        }
        
        .tab-button {
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
        
        .tab-button:hover,
        .tab-button.active {
          background: linear-gradient(135deg, 
            rgba(16, 185, 129, 0.2) 0%,
            rgba(59, 130, 246, 0.15) 100%
          );
          border: 1px solid rgba(16, 185, 129, 0.4);
          color: #10b981;
          transform: translateY(-1px);
        }
      `}</style>

      <div className="revolutionary-inventory-dashboard">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Inventory Management</h1>
            <p className="text-gray-400">AI-powered stock, order, and supply chain management.</p>
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={onRefresh}
              className="tab-button flex items-center gap-2"
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              onClick={onAddProduct}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-12 font-semibold px-6 py-3"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </div>
        </motion.div>

        {/* Metrics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="inventory-metric-card">
            <div className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="metric-icon-container">
                  <Package className="w-6 h-6 text-green-400" />
                </div>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                  {activeProducts} Active
                </Badge>
              </div>
              <div>
                <p className="metric-value">{totalProducts}</p>
                <p className="metric-label">Total Products</p>
              </div>
            </div>
          </div>

          <div className="inventory-metric-card">
            <div className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="metric-icon-container">
                  <DollarSign className="w-6 h-6 text-purple-400" />
                </div>
                <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                  {((potentialProfit / totalInventoryValue) * 100 || 0).toFixed(1)}% Margin
                </Badge>
              </div>
              <div>
                <p className="metric-value">{defaultCurrency} {totalInventoryValue.toFixed(0)}</p>
                <p className="metric-label">Inventory Value</p>
              </div>
            </div>
          </div>

          <div className="inventory-metric-card">
            <div className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="metric-icon-container">
                  <AlertTriangle className="w-6 h-6 text-yellow-400" />
                </div>
                <Badge className={`${lowStockProducts > 0 ? 'bg-red-500/20 text-red-300 border-red-500/30' : 'bg-green-500/20 text-green-300 border-green-500/30'}`}>
                  {lowStockProducts > 0 ? 'Action Needed' : 'All Good'}
                </Badge>
              </div>
              <div>
                <p className="metric-value">{lowStockProducts}</p>
                <p className="metric-label">Low Stock Items</p>
              </div>
            </div>
          </div>

          <div className="inventory-metric-card">
            <div className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="metric-icon-container">
                  <TrendingUp className="w-6 h-6 text-blue-400" />
                </div>
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                  {defaultCurrency} {potentialProfit.toFixed(0)}
                </Badge>
              </div>
              <div>
                <p className="metric-value">{defaultCurrency} {totalSellingValue.toFixed(0)}</p>
                <p className="metric-label">Potential Revenue</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-4 mb-8"
        >
          <button
            onClick={() => setActiveTab("overview")}
            className={`tab-button ${activeTab === "overview" ? "active" : ""}`}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`tab-button ${activeTab === "products" ? "active" : ""}`}
          >
            <Package className="w-4 h-4 mr-2" />
            Products
          </button>
          <button
            onClick={() => setActiveTab("alerts")}
            className={`tab-button ${activeTab === "alerts" ? "active" : ""}`}
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Alerts ({activeAlerts.length})
          </button>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Quick Stats */}
              <div className="lg:col-span-2">
                <ProductList
                  products={products.slice(0, 10)}
                  isLoading={isLoading}
                  onEdit={onEditProduct}
                  onDelete={onDeleteProduct}
                  onView={onViewProduct}
                  onAddProduct={onAddProduct}
                  defaultCurrency={defaultCurrency}
                />
              </div>
              
              {/* Alerts Sidebar */}
              <div>
                <InventoryAlerts
                  alerts={activeAlerts.slice(0, 10)}
                  products={products}
                  defaultCurrency={defaultCurrency}
                />
              </div>
            </div>
          )}

          {activeTab === "products" && (
            <ProductList
              products={products}
              isLoading={isLoading}
              onEdit={onEditProduct}
              onDelete={onDeleteProduct}
              onView={onViewProduct}
              onAddProduct={onAddProduct}
              defaultCurrency={defaultCurrency}
            />
          )}

          {activeTab === "alerts" && (
            <InventoryAlerts
              alerts={alerts}
              products={products}
              defaultCurrency={defaultCurrency}
              showAll={true}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}