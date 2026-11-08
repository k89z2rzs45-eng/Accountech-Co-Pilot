import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Receipt,
  Calendar,
  DollarSign,
  Tag,
  Building2,
  MapPin,
  CreditCard,
  FileText,
  Edit,
  Trash2,
  CheckCircle,
  Eye,
  Download,
  X
} from "lucide-react";
import { safeFormatDate } from "@/components/utils/formatters";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  reimbursed: "bg-blue-100 text-blue-800"
};

const CATEGORY_LABELS = {
  office_supplies: "📎 Office Supplies",
  travel: "✈️ Travel & Transport", 
  utilities: "⚡ Utilities",
  software: "💻 Software & Apps",
  marketing: "📢 Marketing & Advertising",
  meals: "🍔 Meals & Entertainment",
  professional_services: "🤝 Professional Services",
  equipment: "🛠️ Equipment & Tools",
  rent: "🏢 Rent & Facilities",
  insurance: "🛡️ Insurance",
  taxes: "📋 Taxes & Fees",
  freelance: "👥 Freelance & Contractors",
  subscription: "📅 Subscriptions",
  fuel: "⛽ Fuel & Vehicle",
  maintenance: "🔧 Maintenance & Repairs",
  legal: "⚖️ Legal Services",
  bank_fees: "🏦 Bank Fees",
  advertising: "📺 Advertising",
  training: "🎓 Training & Education",
  entertainment: "🎉 Entertainment",
  phone_internet: "📱 Phone & Internet",
  postage_shipping: "📦 Postage & Shipping",
  repairs: "🔨 Repairs",
  cleaning: "🧹 Cleaning Services",
  security: "🔒 Security",
  other: "📋 Other"
};

export default function ExpenseDetailModal({ expense, onClose, onEdit, onDelete, onApprove }) {
  if (!expense) return null;

  const handleEdit = () => {
    onEdit(expense);
    onClose();
  };

  const handleDelete = () => {
    onDelete(expense);
    onClose();
  };

  const handleApprove = () => {
    onApprove(expense);
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
              <Receipt className="w-6 h-6 text-red-600" />
            </div>
            Expense Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Main Info Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {expense.description}
                  </h3>
                  <div className="flex items-center gap-3">
                    <Badge className={STATUS_COLORS[expense.status]}>
                      {expense.status.toUpperCase()}
                    </Badge>
                    {expense.tax_deductible && (
                      <Badge className="bg-purple-100 text-purple-700">
                        Tax Deductible
                      </Badge>
                    )}
                    {expense.reimbursable && (
                      <Badge variant="outline">
                        Reimbursable
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-red-600">
                    {expense.currency} {expense.amount.toFixed(2)}
                  </p>
                  {expense.tax_amount > 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      Tax: {expense.currency} {expense.tax_amount.toFixed(2)}
                    </p>
                  )}
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">{safeFormatDate(expense.date)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Tag className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-medium">
                      {CATEGORY_LABELS[expense.category] || expense.category}
                    </p>
                  </div>
                </div>

                {expense.vendor && (
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Vendor</p>
                      <p className="font-medium">{expense.vendor}</p>
                    </div>
                  </div>
                )}

                {expense.payment_method && (
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Payment Method</p>
                      <p className="font-medium">{expense.payment_method.replace('_', ' ')}</p>
                    </div>
                  </div>
                )}

                {expense.location && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">{expense.location}</p>
                    </div>
                  </div>
                )}

                {expense.project_code && (
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Project Code</p>
                      <p className="font-medium">{expense.project_code}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Additional Details */}
              {expense.subcategory && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-500">Subcategory</p>
                  <p className="font-medium">{expense.subcategory}</p>
                </div>
              )}

              {expense.notes && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-500 mb-2">Notes</p>
                  <p className="text-gray-700 whitespace-pre-wrap">{expense.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Receipts Section */}
          {expense.receipt_urls && expense.receipt_urls.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Receipts & Documents ({expense.receipt_urls.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {expense.receipt_urls.map((url, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <span className="text-sm font-medium">Receipt {index + 1}</span>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(url, '_blank')}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `receipt-${index + 1}`;
                            a.click();
                          }}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI Info */}
          {expense.ai_categorized && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <p className="text-sm text-blue-700">
                  <strong>AI Categorized:</strong> This expense was automatically categorized with {expense.ai_confidence}% confidence.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Approval Info */}
          {expense.approved_by && expense.approved_date && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <p className="text-sm text-green-700">
                  <strong>Approved by:</strong> {expense.approved_by} on {safeFormatDate(expense.approved_date)}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter className="gap-3 pt-6">
          <Button variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Close
          </Button>
          
          {expense.status === 'pending' && (
            <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve
            </Button>
          )}
          
          <Button onClick={handleEdit} variant="outline">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          
          <Button onClick={handleDelete} variant="outline" className="text-red-600 hover:bg-red-50">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}