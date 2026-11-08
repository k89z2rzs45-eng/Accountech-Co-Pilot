import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DollarSign, Send, X } from 'lucide-react';
import { Payroll } from '@/api/entities';

export default function PayrollCalculator({ employees, onRunPayroll, onCancel }) {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [payPeriodStart, setPayPeriodStart] = useState('');
  const [payPeriodEnd, setPayPeriodEnd] = useState('');
  const [grossPay, setGrossPay] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRunPayroll = async () => {
    if (!selectedEmployee || !payPeriodStart || !payPeriodEnd || !grossPay) {
      alert('Please fill all fields');
      return;
    }
    setIsLoading(true);
    try {
      const employee = employees.find(e => e.id === selectedEmployee);
      await Payroll.create({
        employee_id: employee.id,
        pay_period_start: payPeriodStart,
        pay_period_end: payPeriodEnd,
        pay_date: new Date().toISOString().split('T')[0],
        gross_pay: parseFloat(grossPay),
        currency: employee.currency,
        status: 'draft',
      });
      onRunPayroll();
    } catch (error) {
      console.error("Error running payroll:", error);
      alert('Failed to run payroll.');
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="premium-card">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white sharp-text flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-400" />
            Run New Payroll
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <Label className="text-gray-400">Select Employee</Label>
            <Select onValueChange={setSelectedEmployee}>
              <SelectTrigger className="bg-white/5 border-white/20 text-white"><SelectValue placeholder="Select an employee..." /></SelectTrigger>
              <SelectContent>{employees.map(e => <SelectItem key={e.id} value={e.id}>{e.first_name} {e.last_name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label className="text-gray-400">Pay Period Start</Label><Input type="date" value={payPeriodStart} onChange={e => setPayPeriodStart(e.target.value)} className="bg-white/5 border-white/20 text-white" /></div>
            <div><Label className="text-gray-400">Pay Period End</Label><Input type="date" value={payPeriodEnd} onChange={e => setPayPeriodEnd(e.target.value)} className="bg-white/5 border-white/20 text-white" /></div>
          </div>
          <div><Label className="text-gray-400">Gross Pay</Label><Input type="number" placeholder="Enter gross pay amount" value={grossPay} onChange={e => setGrossPay(e.target.value)} className="bg-white/5 border-white/20 text-white" /></div>
        </div>
        <DialogFooter className="pt-6">
          <Button type="button" variant="outline" onClick={onCancel} className="bg-white/5 border-white/20 text-gray-300 hover:bg-white/10 hover:text-white"><X className="w-4 h-4 mr-2" />Cancel</Button>
          <Button onClick={handleRunPayroll} disabled={isLoading} className="premium-button">
            <Send className="w-4 h-4 mr-2" />
            {isLoading ? 'Processing...' : 'Save as Draft'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}