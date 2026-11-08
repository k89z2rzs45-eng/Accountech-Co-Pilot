import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, X } from "lucide-react";

export default function InvoiceFilters({ filters = {}, onFiltersChange }) {
  const handleFilterChange = (key, value) => {
    if (onFiltersChange) {
      onFiltersChange({ ...filters, [key]: value });
    }
  };

  const clearFilters = () => {
    if (onFiltersChange) {
      onFiltersChange({ status: "all", dateRange: "all" });
    }
  };

  const activeFiltersCount = Object.values(filters).filter(v => v !== "all").length;

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-gray-400" />
        <span className="text-sm font-medium text-gray-300">Filters:</span>
      </div>
      
      <Select 
        value={filters.status || "all"} 
        onValueChange={(value) => handleFilterChange("status", value)}
      >
        <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-gray-200">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="draft">Draft</SelectItem>
          <SelectItem value="sent">Sent</SelectItem>
          <SelectItem value="paid">Paid</SelectItem>
          <SelectItem value="overdue">Overdue</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>

      <Select 
        value={filters.dateRange || "all"} 
        onValueChange={(value) => handleFilterChange("dateRange", value)}
      >
        <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-gray-200">
          <SelectValue placeholder="Date Range" />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
          <SelectItem value="all">All Dates</SelectItem>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="week">This Week</SelectItem>
          <SelectItem value="month">This Month</SelectItem>
          <SelectItem value="quarter">This Quarter</SelectItem>
        </SelectContent>
      </Select>

      {activeFiltersCount > 0 && (
        <div className="flex items-center gap-2">
          <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
            {activeFiltersCount} active
          </Badge>
          <Button
            size="sm"
            variant="outline"
            onClick={clearFilters}
            className="h-8 px-2 border-gray-600 text-gray-400 hover:bg-gray-700"
          >
            <X className="w-3 h-3 mr-1" />
            Clear
          </Button>
        </div>
      )}
    </div>
  );
}