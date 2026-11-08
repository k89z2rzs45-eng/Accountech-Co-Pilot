import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Send, 
  Download, 
  CheckCircle, 
  Trash2, 
  Edit,
  Clock,
  DollarSign,
  Calendar,
  Mail,
  Eye
} from "lucide-react";
import { motion } from "framer-motion";

export default function InvoiceList({ 
  invoices = [], 
  isLoading = false, 
  onEdit, 
  onSend, 
  onDownload, 
  onMarkPaid, 
  onDelete,
  sendingInvoiceId = null 
}) {
  const safeFormatDate = (dateString) => {
    try {
      if (!dateString) return 'No date';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: "bg-gray-500/20 text-gray-300 border-gray-500/30",
      sent: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      paid: "bg-green-500/20 text-green-300 border-green-500/30",
      overdue: "bg-red-500/20 text-red-300 border-red-500/30",
      cancelled: "bg-gray-500/20 text-gray-400 border-gray-500/30"
    };
    return colors[status] || colors.draft;
  };

  const getStatusIcon = (status) => {
    const icons = {
      draft: <Edit className="w-3 h-3" />,
      sent: <Send className="w-3 h-3" />,
      paid: <CheckCircle className="w-3 h-3" />,
      overdue: <Clock className="w-3 h-3" />,
      cancelled: <Trash2 className="w-3 h-3" />
    };
    return icons[status] || icons.draft;
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

  if (!invoices || invoices.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 text-gray-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-300 mb-2">No invoices found</h3>
        <p className="text-gray-500">Create your first invoice to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {invoices.map((invoice, index) => (
        <motion.div
          key={invoice.id || index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card className="invoice-item-card hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="invoice-title font-bold text-lg">
                      #{invoice.invoice_number || 'N/A'}
                    </h3>
                    <Badge className={`${getStatusColor(invoice.status)} flex items-center gap-1`}>
                      {getStatusIcon(invoice.status)}
                      {(invoice.status || 'draft').toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="invoice-subtitle text-sm mb-1">Client</p>
                      <p className="invoice-amount font-medium">
                        {invoice.client_name || 'Unknown Client'}
                      </p>
                      {invoice.client_email && (
                        <p className="text-xs text-gray-500">{invoice.client_email}</p>
                      )}
                    </div>
                    
                    <div>
                      <p className="invoice-subtitle text-sm mb-1">Amount</p>
                      <p className="invoice-amount font-bold text-lg">
                        {invoice.currency || 'USD'} {(invoice.total || 0).toFixed(2)}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        Due: {safeFormatDate(invoice.due_date)}
                      </div>
                    </div>
                    
                    <div>
                      <p className="invoice-subtitle text-sm mb-1">Issued</p>
                      <p className="text-gray-300">
                        {safeFormatDate(invoice.issue_date)}
                      </p>
                      {invoice.items && (
                        <p className="text-xs text-gray-500">
                          {invoice.items.length} item{invoice.items.length !== 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 ml-6">
                  {invoice.status === 'draft' && (
                    <Button
                      size="sm"
                      onClick={() => onEdit && onEdit(invoice)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                  )}
                  
                  {(invoice.status === 'draft' || invoice.status === 'sent') && invoice.client_email && (
                    <Button
                      size="sm"
                      onClick={() => onSend && onSend(invoice)}
                      disabled={sendingInvoiceId === invoice.id}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Mail className="w-3 h-3 mr-1" />
                      {sendingInvoiceId === invoice.id ? 'Sending...' : 'Send'}
                    </Button>
                  )}
                  
                  {invoice.status === 'sent' && (
                    <Button
                      size="sm"
                      onClick={() => onMarkPaid && onMarkPaid(invoice)}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Mark Paid
                    </Button>
                  )}
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDownload && onDownload(invoice)}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    PDF
                  </Button>
                  
                  {invoice.status === 'draft' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDelete && onDelete(invoice)}
                      className="border-red-600 text-red-400 hover:bg-red-900/20"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}