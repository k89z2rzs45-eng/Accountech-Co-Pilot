import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  ArrowDownRight,
  Edit,
  Trash2,
  MoreHorizontal,
  Calendar,
  Building,
  Sparkles
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

const categoryColors = {
  office_supplies: "bg-blue-50 text-blue-700 border-blue-200",
  travel: "bg-purple-50 text-purple-700 border-purple-200",
  utilities: "bg-green-50 text-green-700 border-green-200",
  software: "bg-indigo-50 text-indigo-700 border-indigo-200",
  marketing: "bg-pink-50 text-pink-700 border-pink-200",
  meals: "bg-orange-50 text-orange-700 border-orange-200",
  professional_services: "bg-cyan-50 text-cyan-700 border-cyan-200",
  equipment: "bg-red-50 text-red-700 border-red-200",
  rent: "bg-yellow-50 text-yellow-700 border-yellow-200",
  insurance: "bg-teal-50 text-teal-700 border-teal-200",
  taxes: "bg-gray-50 text-gray-700 border-gray-200",
  sales: "bg-emerald-50 text-emerald-700 border-emerald-200",
  consulting: "bg-violet-50 text-violet-700 border-violet-200",
  other: "bg-slate-50 text-slate-700 border-slate-200"
};

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  cleared: "bg-green-100 text-green-800",
  reconciled: "bg-blue-100 text-blue-800"
};

export default function TransactionList({ 
  transactions = [], 
  onEdit, 
  onDelete, 
  onView,
  isLoading = false 
}) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array(5).fill(0).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <ArrowUpRight className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No transactions found</h3>
          <p className="text-gray-600">Start by adding your first transaction</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction, index) => (
        <motion.div
          key={transaction.id || index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card className="hover:shadow-md transition-all duration-200 cursor-pointer group">
            <CardContent className="p-6" onClick={() => onView?.(transaction)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Transaction Type Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {transaction.type === 'income' ? (
                      <ArrowUpRight className="w-6 h-6 text-green-600" />
                    ) : (
                      <ArrowDownRight className="w-6 h-6 text-red-600" />
                    )}
                  </div>

                  {/* Transaction Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {transaction.description}
                      </h3>
                      
                      {/* AI Badge */}
                      {transaction.ai_categorized && (
                        <Badge variant="outline" className="text-xs bg-purple-50 text-purple-600 border-purple-200">
                          <Sparkles className="w-3 h-3 mr-1" />
                          AI
                        </Badge>
                      )}
                      
                      {/* Tax Deductible Badge */}
                      {transaction.tax_deductible && (
                        <Badge className="bg-purple-100 text-purple-700 text-xs">
                          TAX DEDUCTIBLE
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(transaction.date).toLocaleDateString()}
                      </div>
                      
                      {transaction.vendor && (
                        <div className="flex items-center gap-1">
                          <Building className="w-4 h-4" />
                          {transaction.vendor}
                        </div>
                      )}

                      {/* Category Badge */}
                      <Badge 
                        variant="outline" 
                        className={`text-xs border ${categoryColors[transaction.category] || categoryColors.other}`}
                      >
                        {transaction.category?.replace(/_/g, ' ').toUpperCase()}
                      </Badge>

                      {/* Status Badge */}
                      <Badge className={`text-xs ${statusColors[transaction.status] || statusColors.pending}`}>
                        {transaction.status?.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Amount and Actions */}
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className={`text-xl font-bold ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}
                      {transaction.currency} {transaction.amount?.toFixed(2)}
                    </p>
                    {transaction.ai_confidence > 0 && (
                      <p className="text-xs text-gray-500">
                        AI: {transaction.ai_confidence}%
                      </p>
                    )}
                  </div>

                  {/* Actions Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        onEdit?.(transaction);
                      }}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete?.(transaction);
                        }}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}