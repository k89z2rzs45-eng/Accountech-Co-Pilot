import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

export default function PayrollReports({ payrolls, isLoading }) {
  const statusColors = {
    paid: 'bg-green-500/20 text-green-400',
    draft: 'bg-yellow-500/20 text-yellow-400',
    approved: 'bg-blue-500/20 text-blue-400',
    cancelled: 'bg-red-500/20 text-red-400',
  };

  return (
    <Card className="premium-card">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-white sharp-text flex items-center gap-2">
          <FileText className="w-5 h-5 text-purple-400" />
          Payroll History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-gray-400">Loading payroll history...</p>
        ) : payrolls.length > 0 ? (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {payrolls.map(pr => (
              <div key={pr.id} className="p-3 bg-white/5 rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-semibold text-white">Pay run for {format(new Date(pr.pay_date), 'MMM dd, yyyy')}</p>
                  <p className="text-sm text-gray-400">Gross: {pr.currency} {pr.gross_pay.toFixed(2)}</p>
                </div>
                <Badge className={statusColors[pr.status]}>{pr.status}</Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 mx-auto text-gray-500 mb-4" />
            <h3 className="text-lg font-semibold text-white">No Payroll History</h3>
            <p className="text-gray-400 mt-2">Your completed payroll runs will appear here.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}