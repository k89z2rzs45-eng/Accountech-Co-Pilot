import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Search, Filter, Edit, Trash2, AlertTriangle, TrendingUp, Eye, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = ["electronics", "clothing", "food", "books", "furniture", "medical", "automotive", "sports", "beauty", "home", "office", "industrial", "other"];
const STATUS_OPTIONS = ["active", "discontinued", "out_of_stock", "low_stock", "overstocked"];

export default function ProductList({ 
  products = [], 
  isLoading = false, 
  onEdit, 
  onDelete, 
  onView,
  onAddProduct,
  defaultCurrency = "USD" 
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const getStatusColor = (status) => {
    const colors = {
      active: "bg-green-500/20 text-green-300 border-green-500/30",
      discontinued: "bg-gray-500/20 text-gray-300 border-gray-500/30",
      out_of_stock: "bg-red-500/20 text-red-300 border-red-500/30",
      low_stock: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      overstocked: "bg-blue-500/20 text-blue-300 border-blue-500/30"
    };
    return colors[status] || colors.active;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'low_stock':
      case 'out_of_stock':
        return <AlertTriangle className="w-3 h-3" />;
      case 'overstocked':
        return <TrendingUp className="w-3 h-3" />;
      default:
        return <Package className="w-3 h-3" />;
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || product.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const formatPrice = (price, currency = defaultCurrency) => {
    return `${currency} ${(price || 0).toFixed(2)}`;
  };

  const calculateProfitMargin = (costPrice, sellingPrice) => {
    if (!costPrice || !sellingPrice || costPrice === 0) return 0;
    return ((sellingPrice - costPrice) / sellingPrice * 100);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array(5).fill(0).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-24 bg-gray-700/50 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <style jsx>{`
        .revolutionary-product-list {
          background: linear-gradient(145deg, 
            rgba(15, 23, 42, 0.9) 0%,
            rgba(30, 41, 59, 0.8) 50%,
            rgba(51, 65, 85, 0.9) 100%
          );
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          backdrop-filter: blur(20px);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.3),
            0 0 40px rgba(16, 185, 129, 0.1);
          position: relative;
          overflow: hidden;
        }
        
        .product-card {
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.08) 0%,
            rgba(255, 255, 255, 0.04) 100%
          );
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          backdrop-filter: blur(15px);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .product-card::before {
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
        
        .product-card:hover::before {
          left: 100%;
        }
        
        .product-card:hover {
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.12) 0%,
            rgba(255, 255, 255, 0.08) 100%
          );
          border: 1px solid rgba(16, 185, 129, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(16, 185, 129, 0.15);
        }
        
        .filter-card {
          background: linear-gradient(135deg, 
            rgba(16, 185, 129, 0.1) 0%,
            rgba(59, 130, 246, 0.08) 100%
          );
          border: 1px solid rgba(16, 185, 129, 0.2);
          border-radius: 12px;
          backdrop-filter: blur(15px);
          padding: 1.5rem;
        }
        
        .enhanced-input {
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.08) 0%,
            rgba(255, 255, 255, 0.04) 100%
          );
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
        }
        
        .enhanced-input:focus {
          border: 1px solid rgba(16, 185, 129, 0.5);
          box-shadow: 0 0 15px rgba(16, 185, 129, 0.2);
          outline: none;
        }
        
        .profit-indicator {
          font-weight: 600;
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          backdrop-filter: blur(10px);
        }
        
        .profit-high {
          background: rgba(34, 197, 94, 0.2);
          color: #22c55e;
          border: 1px solid rgba(34, 197, 94, 0.3);
        }
        
        .profit-medium {
          background: rgba(245, 158, 11, 0.2);
          color: #f59e0b;
          border: 1px solid rgba(245, 158, 11, 0.3);
        }
        
        .profit-low {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }
      `}</style>

      {/* Filters */}
      <Card className="filter-card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search products by name, SKU, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="enhanced-input pl-10"
            />
          </div>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="enhanced-input w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map(category => (
                <SelectItem key={category} value={category}>
                  {category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="enhanced-input w-48">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="all">All Status</SelectItem>
              {STATUS_OPTIONS.map(status => (
                <SelectItem key={status} value={status}>
                  {status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button 
            onClick={onAddProduct}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </Card>

      {/* Products List */}
      <Card className="revolutionary-product-list">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
            <Package className="w-6 h-6 text-green-400" />
            Products ({filteredProducts.length})
            {filteredProducts.length !== products.length && (
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                Filtered from {products.length}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-300 mb-2">No products found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || categoryFilter !== "all" || statusFilter !== "all" 
                  ? "Try adjusting your filters" 
                  : "Add your first product to get started"
                }
              </p>
              {(!searchTerm && categoryFilter === "all" && statusFilter === "all") && (
                <Button 
                  onClick={onAddProduct}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Product
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {filteredProducts.map((product, index) => {
                  const profitMargin = calculateProfitMargin(product.cost_price, product.selling_price);
                  const profitClass = profitMargin > 30 ? 'profit-high' : profitMargin > 15 ? 'profit-medium' : 'profit-low';
                  
                  return (
                    <motion.div
                      key={product.id || product.sku}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="product-card p-6 relative z-10"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                              <Package className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="font-bold text-lg text-white">
                                {product.name || 'Unnamed Product'}
                              </h3>
                              <p className="text-sm text-gray-400">
                                SKU: {product.sku} • {product.category?.replace(/_/g, ' ')}
                              </p>
                            </div>
                          </div>
                          
                          {product.description && (
                            <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                              {product.description}
                            </p>
                          )}
                          
                          <div className="flex items-center gap-4 flex-wrap">
                            <Badge className={getStatusColor(product.status)}>
                              {getStatusIcon(product.status)}
                              <span className="ml-1">
                                {(product.status || 'active').replace(/_/g, ' ')}
                              </span>
                            </Badge>
                            
                            <div className={`profit-indicator ${profitClass}`}>
                              {profitMargin.toFixed(1)}% margin
                            </div>
                            
                            <span className="text-sm text-gray-400">
                              Stock: <span className="text-white font-semibold">
                                {product.current_stock || 0}
                              </span>
                            </span>
                            
                            {product.current_stock <= product.reorder_point && (
                              <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Low Stock
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="mb-2">
                            <p className="text-sm text-gray-400">Selling Price</p>
                            <p className="text-xl font-bold text-white">
                              {formatPrice(product.selling_price, product.currency)}
                            </p>
                          </div>
                          
                          <div className="mb-4">
                            <p className="text-xs text-gray-500">Cost: {formatPrice(product.cost_price, product.currency)}</p>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => onView && onView(product)}
                              className="text-gray-400 hover:text-white hover:bg-gray-800"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => onEdit && onEdit(product)}
                              className="text-gray-400 hover:text-blue-400 hover:bg-blue-900/20"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => onDelete && onDelete(product)}
                              className="text-gray-400 hover:text-red-400 hover:bg-red-900/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}