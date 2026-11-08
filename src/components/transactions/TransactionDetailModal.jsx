import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  X, 
  Edit, 
  Trash2, 
  Calendar, 
  DollarSign, 
  Tag, 
  FileText, 
  Building,
  Receipt as ReceiptIcon,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { safeFormatDate } from "@/components/utils/formatters";

const STATUS_CONFIG = {
  pending: { 
    icon: Clock, 
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    description: "Awaiting processing"
  },
  cleared: { 
    icon: CheckCircle, 
    color: "bg-green-100 text-green-700 border-green-200",
    description: "Transaction completed"
  },
  reconciled: { 
    icon: CheckCircle, 
    color: "bg-blue-100 text-blue-700 border-blue-200",
    description: "Verified and matched"
  }
};

const CATEGORY_LABELS = {
  office_supplies: "Office Supplies",
  travel: "Travel",
  utilities: "Utilities", 
  software: "Software",
  marketing: "Marketing",
  meals: "Meals & Entertainment",
  professional_services: "Professional Services",
  equipment: "Equipment",
  rent: "Rent & Facilities",
  insurance: "Insurance",
  taxes: "Taxes",
  sales: "Sales Revenue",
  consulting: "Consulting",
  other: "Other"
};

export default function TransactionDetailModal({ transaction, onClose, onEdit, onDelete }) {
  if (!transaction) return null;

  const statusConfig = STATUS_CONFIG[transaction.status] || STATUS_CONFIG.pending;
  const StatusIcon = statusConfig.icon;
  const categoryLabel = CATEGORY_LABELS[transaction.category] || transaction.category;

  const handleEdit = () => {
    onClose();
    onEdit(transaction);
  };

  const handleDelete = () => {
    onClose();
    onDelete(transaction);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <motion.div 
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                transaction.type === 'income' ? 'bg-green-100' : 
                transaction.type === 'expense' ? 'bg-red-100' : 'bg-blue-100'
              }`}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 0.5 }}
            >
              {transaction.type === 'income' ? (
                <ArrowUpRight className="w-6 h-6 text-green-600" />
              ) : transaction.type === 'expense' ? (
                <ArrowDownRight className="w-6 h-6 text-red-600" />
              ) : (
                <CreditCard className="w-6 h-6 text-blue-600" />
              )}
            </motion.div>
            Transaction Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Main Transaction Info */}
          <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {transaction.description}
                  </h2>
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge className={`border ${statusConfig.color}`}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {transaction.status.toUpperCase()}
                    </Badge>
                    
                    <Badge variant="outline" className="bg-white">
                      {categoryLabel}
                    </Badge>
                    
                    {transaction.tax_deductible && (
                      <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                        TAX DEDUCTIBLE
                      </Badge>
                    )}
                    
                    {transaction.ai_categorized && (
                      <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                        🤖 AI CATEGORIZED ({transaction.ai_confidence}%)
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`text-3xl font-bold ${
                    transaction.type === 'income' ? 'text-green-600' : 
                    transaction.type === 'expense' ? 'text-red-600' : 'text-blue-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : transaction.type === 'expense' ? '-' : ''}
                    {transaction.currency} {transaction.amount?.toFixed(2)}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">{statusConfig.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Transaction Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Transaction Info
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Date
                    </span>
                    <span className="font-medium">
                      {safeFormatDate(transaction.date, 'PPP')}
                    </span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Amount
                    </span>
                    <span className="font-medium">
                      {transaction.currency} {transaction.amount?.toFixed(2)}
                    </span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Type
                    </span>
                    <Badge variant="outline" className={
                      transaction.type === 'income' ? 'text-green-700 border-green-200' :
                      transaction.type === 'expense' ? 'text-red-700 border-red-200' :
                      'text-blue-700 border-blue-200'
                    }>
                      {transaction.type.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Category</span>
                    <span className="font-medium">{categoryLabel}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Details */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Building className="w-5 h-5 text-green-600" />
                  Additional Details
                </h3>
                
                <div className="space-y-4">
                  {transaction.vendor && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Vendor/Client</span>
                        <span className="font-medium">{transaction.vendor}</span>
                      </div>
                      <Separator />
                    </>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tax Deductible</span>
                    <Badge className={
                      transaction.tax_deductible 
                        ? "bg-green-100 text-green-700" 
                        : "bg-gray-100 text-gray-700"
                    }>
                      {transaction.tax_deductible ? "Yes" : "No"}
                    </Badge>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status</span>
                    <Badge className={statusConfig.color}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {transaction.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  
                  {transaction.receipt_url && (
                    <>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 flex items-center gap-2">
                          <ReceiptIcon className="w-4 h-4" />
                          Receipt
                        </span>
                        <Button variant="outline" size="sm" asChild>
                          <a href={transaction.receipt_url} target="_blank" rel="noopener noreferrer">
                            View Receipt
                          </a>
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notes Section */}
          {transaction.notes && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-orange-600" />
                  Notes
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">{transaction.notes}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI Insights */}
          {transaction.ai_categorized && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-6">
                <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  🤖 AI Insights
                </h3>
                <div className="space-y-2">
                  <p className="text-blue-800 text-sm">
                    This transaction was automatically categorized as "{categoryLabel}" 
                    with {transaction.ai_confidence}% confidence.
                  </p>
                  {transaction.ai_confidence < 80 && (
                    <div className="flex items-center gap-2 text-amber-700 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      Consider reviewing the category for accuracy.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Close
            </Button>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleDelete}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
              
              <Button
                onClick={handleEdit}
                className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Transaction
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}