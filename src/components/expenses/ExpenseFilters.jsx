import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ExpenseFilters({ filters, onFiltersChange }) {
  const handleFilterChange = (filterType, value) => {
    onFiltersChange(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearAllFilters = () => {
    onFiltersChange({
      status: "all",
      category: "all",
      dateRange: "all",
      amountRange: "all",
      taxDeductible: "all"
    });
  };

  const activeFilterCount = Object.values(filters).filter(value => value !== "all").length;

  return (
    <div className="flex flex-wrap gap-4 items-center">
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-gray-500" />
        <Select 
          value={filters.status} 
          onValueChange={(value) => handleFilterChange("status", value)}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="reimbursed">Reimbursed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Select 
          value={filters.category} 
          onValueChange={(value) => handleFilterChange("category", value)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="office_supplies">📎 Office Supplies</SelectItem>
            <SelectItem value="travel">✈️ Travel</SelectItem>
            <SelectItem value="utilities">⚡ Utilities</SelectItem>
            <SelectItem value="software">💻 Software</SelectItem>
            <SelectItem value="marketing">📢 Marketing</SelectItem>
            <SelectItem value="meals">🍔 Meals</SelectItem>
            <SelectItem value="professional_services">🤝 Professional Services</SelectItem>
            <SelectItem value="equipment">🛠️ Equipment</SelectItem>
            <SelectItem value="rent">🏢 Rent</SelectItem>
            <SelectItem value="insurance">🛡️ Insurance</SelectItem>
            <SelectItem value="taxes">📋 Taxes</SelectItem>
            <SelectItem value="other">📋 Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Select 
          value={filters.dateRange} 
          onValueChange={(value) => handleFilterChange("dateRange", value)}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Date Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Select 
          value={filters.amountRange} 
          onValueChange={(value) => handleFilterChange("amountRange", value)}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Amount Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Amounts</SelectItem>
            <SelectItem value="0-100">$0 - $100</SelectItem>
            <SelectItem value="100-500">$100 - $500</SelectItem>
            <SelectItem value="500-1000">$500 - $1,000</SelectItem>
            <SelectItem value="1000+">$1,000+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Select 
          value={filters.taxDeductible} 
          onValueChange={(value) => handleFilterChange("taxDeductible", value)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Tax Deductible" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Expenses</SelectItem>
            <SelectItem value="yes">Tax Deductible</SelectItem>
            <SelectItem value="no">Not Tax Deductible</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {activeFilterCount > 0 && (
        <Badge 
          variant="secondary" 
          className="flex items-center gap-2 cursor-pointer hover:bg-gray-200"
          onClick={clearAllFilters}
        >
          <Filter className="w-3 h-3" />
          {activeFilterCount} Active
          <X className="w-3 h-3" />
        </Badge>
      )}
    </div>
  );
}