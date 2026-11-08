import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Filter, X, Search, Calendar, DollarSign, Tag } from "lucide-react";

const TRANSACTION_TYPES = ["all", "income", "expense", "transfer"];
const DATE_RANGES = ["all", "today", "week", "month", "quarter", "year"];
const CATEGORIES = ["all", "office_supplies", "travel", "utilities", "software", "marketing", "meals", 
                   "professional_services", "equipment", "rent", "insurance", "taxes", "sales", 
                   "consulting", "freelance", "other"];

export default function TransactionFilters({ 
  filters = {}, 
  onFiltersChange,
  showAdvanced = false 
}) {
  const handleFilterChange = (key, value) => {
    if (onFiltersChange) {
      onFiltersChange({ ...filters, [key]: value });
    }
  };

  const clearFilters = () => {
    if (onFiltersChange) {
      onFiltersChange({
        type: "all",
        category: "all",
        dateRange: "all",
        search: "",
        minAmount: "",
        maxAmount: "",
        vendor: "",
        taxDeductible: "all"
      });
    }
  };

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => 
    value && value !== "all" && value !== ""
  ).length;

  return (
    <div className="space-y-4">
      <style jsx>{`
        .filters-container {
          background: linear-gradient(135deg, 
            rgba(30, 41, 59, 0.8) 0%,
            rgba(51, 65, 85, 0.6) 100%
          );
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          backdrop-filter: blur(20px);
          padding: 1.5rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        
        .filter-input {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: #f1f5f9;
          transition: all 0.3s ease;
        }
        
        .filter-input:focus {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(59, 130, 246, 0.5);
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
          outline: none;
        }
      `}</style>

      <div className="filters-container">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Filter Transactions</h3>
          </div>
          {activeFiltersCount > 0 && (
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                {activeFiltersCount} active
              </Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={clearFilters}
                className="h-8 px-2 bg-transparent border-gray-600 text-gray-400 hover:bg-gray-700"
              >
                <X className="w-3 h-3 mr-1" />
                Clear All
              </Button>
            </div>
          )}
        </div>

        {/* Basic Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
            <Select 
              value={filters.type || "all"} 
              onValueChange={(value) => handleFilterChange("type", value)}
            >
              <SelectTrigger className="filter-input">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {TRANSACTION_TYPES.map(type => (
                  <SelectItem key={type} value={type}>
                    {type === "all" ? "All Types" : 
                     type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
            <Select 
              value={filters.category || "all"} 
              onValueChange={(value) => handleFilterChange("category", value)}
            >
              <SelectTrigger className="filter-input">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {CATEGORIES.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" :
                     category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Date Range</label>
            <Select 
              value={filters.dateRange || "all"} 
              onValueChange={(value) => handleFilterChange("dateRange", value)}
            >
              <SelectTrigger className="filter-input">
                <SelectValue placeholder="All Dates" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {DATE_RANGES.map(range => (
                  <SelectItem key={range} value={range}>
                    {range === "all" ? "All Dates" :
                     range.charAt(0).toUpperCase() + range.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Tax Deductible</label>
            <Select 
              value={filters.taxDeductible || "all"} 
              onValueChange={(value) => handleFilterChange("taxDeductible", value)}
            >
              <SelectTrigger className="filter-input">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="true">Tax Deductible</SelectItem>
                <SelectItem value="false">Not Tax Deductible</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="space-y-4 pt-4 border-t border-gray-700">
            <h4 className="text-sm font-medium text-gray-300">Advanced Filters</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    value={filters.search || ""}
                    onChange={(e) => handleFilterChange("search", e.target.value)}
                    className="filter-input pl-10"
                    placeholder="Search descriptions, vendors..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Min Amount</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={filters.minAmount || ""}
                    onChange={(e) => handleFilterChange("minAmount", e.target.value)}
                    className="filter-input pl-10"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Max Amount</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={filters.maxAmount || ""}
                    onChange={(e) => handleFilterChange("maxAmount", e.target.value)}
                    className="filter-input pl-10"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Vendor/Client</label>
                <Input
                  value={filters.vendor || ""}
                  onChange={(e) => handleFilterChange("vendor", e.target.value)}
                  className="filter-input"
                  placeholder="Filter by vendor or client name..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                <Select 
                  value={filters.status || "all"} 
                  onValueChange={(value) => handleFilterChange("status", value)}
                >
                  <SelectTrigger className="filter-input">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="cleared">Cleared</SelectItem>
                    <SelectItem value="reconciled">Reconciled</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}