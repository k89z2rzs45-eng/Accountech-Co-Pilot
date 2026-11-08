import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Invoice } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  Download,
  CreditCard,
  Building2,
  Mail,
  Phone,
  Globe,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import { format, isAfter } from "date-fns";
import { safeFormatDate } from "@/components/utils/formatters";

export default function InvoiceView() {
  const { invoiceId } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadInvoice();
  }, [invoiceId]);

  const loadInvoice = async () => {
    setIsLoading(true);
    try {
      const invoiceData = await Invoice.get(invoiceId);
      if (!invoiceData) {
        throw new Error('Invoice not found');
      }
      
      // Update status if overdue
      if (invoiceData.status === 'sent' && isAfter(new Date(), new Date(invoiceData.due_date))) {
        invoiceData.status = 'overdue';
        // Could update in database here if needed
      }
      
      setInvoice(invoiceData);
    } catch (error) {
      console.error('Error loading invoice:', error);
      setError(error.message);
    }
    setIsLoading(false);
  };

  const getStatusDisplay = (status) => {
    const statusConfig = {
      draft: { color: 'bg-gray-100 text-gray-700 border-gray-300', icon: FileText, text: 'Draft' },
      sent: { color: 'bg-blue-100 text-blue-700 border-blue-300', icon: Mail, text: 'Sent' },
      paid: { color: 'bg-green-100 text-green-700 border-green-300', icon: CheckCircle, text: 'Paid' },
      overdue: { color: 'bg-red-100 text-red-700 border-red-300', icon: AlertCircle, text: 'Overdue' },
      cancelled: { color: 'bg-gray-100 text-gray-700 border-gray-300', icon: Clock, text: 'Cancelled' }
    };

    const config = statusConfig[status] || statusConfig.draft;
    const IconComponent = config.icon;

    return (
      <Badge className={`${config.color} border px-3 py-1 flex items-center gap-2`}>
        <IconComponent className="w-4 h-4" />
        {config.text}
      </Badge>
    );
  };

  const handleDownload = () => {
    window.print();
  };

  const handlePayment = () => {
    alert('Payment integration coming soon! For now, please contact the company directly to arrange payment.');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Invoice Not Found</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500">Please check the invoice URL or contact the sender.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const company = invoice.company_branding || {};
  const brandColor = company.brand_colors?.primary || '#3b82f6';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Print-specific styles */}
      <style jsx>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .print-container { box-shadow: none !important; }
        }
      `}</style>

      <div className="max-w-4xl mx-auto py-8 px-4 print-container">
        {/* Action Bar - Hidden in print */}
        <div className="no-print mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Invoice #{invoice.invoice_number}</h1>
            <p className="text-gray-600">Issued on {safeFormatDate(invoice.issue_date, "MMMM d, yyyy")}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            {invoice.status !== 'paid' && (
              <Button onClick={handlePayment} style={{ backgroundColor: brandColor }}>
                <CreditCard className="w-4 h-4 mr-2" />
                Pay Invoice
              </Button>
            )}
          </div>
        </div>

        {/* Invoice Content */}
        <Card className="print-container">
          <CardContent className="p-8">
            {/* Header with Company Branding */}
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-4">
                {company.logo_url && (
                  <img 
                    src={company.logo_url} 
                    alt={company.company_name || 'Company Logo'} 
                    className="max-h-16 max-w-48 object-contain"
                  />
                )}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900" style={{ color: brandColor }}>
                    {company.company_name || 'Invoice'}
                  </h2>
                  <p className="text-gray-600">Invoice #{invoice.invoice_number}</p>
                </div>
              </div>
              <div className="text-right">
                {getStatusDisplay(invoice.status)}
                <div className="mt-2 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Due: {safeFormatDate(invoice.due_date, "MMMM d, yyyy")}
                  </div>
                </div>
              </div>
            </div>

            {/* Company and Client Info */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* From Company */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  From:
                </h3>
                <div className="space-y-1 text-gray-700">
                  <p className="font-medium">{company.company_name || 'Company Name'}</p>
                  {company.address && (
                    <div className="text-sm">
                      {company.address.street && <p>{company.address.street}</p>}
                      {(company.address.city || company.address.state || company.address.zip_code) && (
                        <p>
                          {[company.address.city, company.address.state, company.address.zip_code].filter(Boolean).join(', ')}
                        </p>
                      )}
                      {company.address.country && <p>{company.address.country}</p>}
                    </div>
                  )}
                  {company.contact && (
                    <div className="text-sm mt-3 space-y-1">
                      {company.contact.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3" />
                          <span>{company.contact.email}</span>
                        </div>
                      )}
                      {company.contact.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-3 h-3" />
                          <span>{company.contact.phone}</span>
                        </div>
                      )}
                      {company.contact.website && (
                        <div className="flex items-center gap-2">
                          <Globe className="w-3 h-3" />
                          <span>{company.contact.website}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* To Client */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Bill To:</h3>
                <div className="space-y-1 text-gray-700">
                  <p className="font-medium">{invoice.client_name}</p>
                  {invoice.client_email && <p className="text-sm">{invoice.client_email}</p>}
                  {invoice.client_address && (
                    <div className="text-sm mt-2 whitespace-pre-line">
                      {invoice.client_address}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="grid md:grid-cols-3 gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-500">Invoice Date</p>
                <p className="font-semibold">{safeFormatDate(invoice.issue_date, "MMM d, yyyy")}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Due Date</p>
                <p className="font-semibold">{safeFormatDate(invoice.due_date, "MMM d, yyyy")}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Amount Due</p>
                <p className="text-xl font-bold" style={{ color: brandColor }}>
                  {invoice.currency} {(invoice.total || 0).toFixed(2)}
                </p>
              </div>
            </div>

            {/* Line Items */}
            <div className="mb-8">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-2 font-semibold text-gray-900">Description</th>
                      <th className="text-center py-3 px-2 font-semibold text-gray-900 w-20">Qty</th>
                      <th className="text-right py-3 px-2 font-semibold text-gray-900 w-24">Rate</th>
                      <th className="text-right py-3 px-2 font-semibold text-gray-900 w-24">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(invoice.items || []).map((item, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 px-2 text-gray-900">{item.description}</td>
                        <td className="py-3 px-2 text-center text-gray-700">{item.quantity}</td>
                        <td className="py-3 px-2 text-right text-gray-700">
                          {invoice.currency} {(item.rate || 0).toFixed(2)}
                        </td>
                        <td className="py-3 px-2 text-right font-medium text-gray-900">
                          {invoice.currency} {(item.amount || 0).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-8">
              <div className="w-full max-w-sm space-y-2">
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">{invoice.currency} {(invoice.subtotal || 0).toFixed(2)}</span>
                </div>
                {invoice.tax_rate > 0 && (
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600">Tax ({invoice.tax_rate}%):</span>
                    <span className="font-medium">{invoice.currency} {(invoice.tax_amount || 0).toFixed(2)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between py-2">
                  <span className="text-lg font-semibold text-gray-900">Total:</span>
                  <span className="text-lg font-bold" style={{ color: brandColor }}>
                    {invoice.currency} {(invoice.total || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="mb-8 p-4 bg-blue-50 rounded-lg border-l-4" style={{ borderLeftColor: brandColor }}>
                <h4 className="font-semibold text-gray-900 mb-2">Notes:</h4>
                <p className="text-gray-700 whitespace-pre-line">{invoice.notes}</p>
              </div>
            )}

            {/* Payment Instructions */}
            {invoice.status !== 'paid' && (
              <div className="no-print bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Payment Instructions
                </h4>
                <p className="text-yellow-700 text-sm">
                  Please click the "Pay Invoice" button above to proceed with payment, or contact us directly for alternative payment methods.
                </p>
                {company.contact?.email && (
                  <p className="text-yellow-700 text-sm mt-2">
                    Questions? Contact us at: <strong>{company.contact.email}</strong>
                  </p>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="mt-8 pt-8 border-t text-center text-gray-500 text-sm">
              <p>Thank you for your business!</p>
              <p className="mt-1">This invoice was generated automatically.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}