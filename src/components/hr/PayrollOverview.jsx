import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  Search,
  Plus,
  Eye,
  Edit,
  Calculator,
  Download,
  Send,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Users,
  CreditCard,
  FileText,
  Calendar
} from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

export default function PayrollOverview({ employees = [], onRefresh }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [payPeriodFilter, setPayPeriodFilter] = useState("current");

  // Mock payroll data (in real app, this would come from Payroll entity)
  const payrollData = employees.map((emp, index) => ({
    id: `payroll-${index}`,
    employee_id: emp.id,
    employee_name: `${emp.personal_info?.first_name || ''} ${emp.personal_info?.last_name || ''}`,
    pay_period_start: '2024-01-01',
    pay_period_end: '2024-01-15',
    pay_date: '2024-01-20',
    gross_pay: emp.compensation?.base_salary ? (emp.compensation.base_salary / 26) : 2000, // Bi-weekly
    regular_hours: 80,
    overtime_hours: index % 3 === 0 ? 5 : 0,
    overtime_rate: emp.compensation?.hourly_rate ? emp.compensation.hourly_rate * 1.5 : 30,
    deductions: {
      federal_tax: emp.compensation?.base_salary ? (emp.compensation.base_salary / 26) * 0.22 : 440,
      state_tax: emp.compensation?.base_salary ? (emp.compensation.base_salary / 26) * 0.05 : 100,
      social_security: emp.compensation?.base_salary ? (emp.compensation.base_salary / 26) * 0.062 : 124,
      medicare: emp.compensation?.base_salary ? (emp.compensation.base_salary / 26) * 0.0145 : 29,
      health_insurance: emp.benefits?.health_insurance?.employee_cost || 150,
      retirement_401k: emp.compensation?.base_salary ? (emp.compensation.base_salary / 26) * 0.06 : 120,
      other: 0
    },
    net_pay: 0, // Will be calculated
    currency: emp.compensation?.currency || 'USD',
    status: index % 4 === 0 ? 'paid' : index % 4 === 1 ? 'approved' : index % 4 === 2 ? 'draft' : 'cancelled',
    payment_method: 'direct_deposit'
  })).map(payroll => {
    // Calculate net pay
    const totalDeductions = Object.values(payroll.deductions).reduce((sum, val) => sum + val, 0);
    payroll.net_pay = payroll.gross_pay - totalDeductions;
    return payroll;
  });

  // Filter payroll data
  const filteredPayroll = payrollData
    .filter(payroll => {
      const matchesSearch = !searchTerm || 
        payroll.employee_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payroll.employee_id?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || payroll.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => new Date(b.pay_date) - new Date(a.pay_date));

  // Calculate payroll metrics
  const totalGrossPay = filteredPayroll.reduce((sum, payroll) => sum + payroll.gross_pay, 0);
  const totalNetPay = filteredPayroll.reduce((sum, payroll) => sum + payroll.net_pay, 0);
  const totalDeductions = totalGrossPay - totalNetPay;
  const paidPayrolls = filteredPayroll.filter(p => p.status === 'paid').length;

  const getStatusColor = (status) => {
    const colors = {
      draft: "bg-gray-500/20 text-gray-300 border-gray-500/30",
      approved: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      paid: "bg-green-500/20 text-green-300 border-green-500/30",
      cancelled: "bg-red-500/20 text-red-300 border-red-500/30"
    };
    return colors[status] || colors.draft;
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'direct_deposit':
        return <CreditCard className="w-4 h-4" />;
      case 'check':
        return <FileText className="w-4 h-4" />;
      case 'cash':
        return <DollarSign className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  const handleRunPayroll = () => {
    alert("Run Payroll functionality would open here!");
  };

  const handleViewPayroll = (payroll) => {
    alert(`View payroll details for ${payroll.employee_name}`);
  };

  const handleEditPayroll = (payroll) => {
    alert(`Edit payroll for ${payroll.employee_name}`);
  };

  const handleApprovePayroll = (payroll) => {
    alert(`Approve payroll for ${payroll.employee_name}`);
  };

  const handlePayPayroll = (payroll) => {
    alert(`Process payment for ${payroll.employee_name}`);
  };

  const handleDownloadReports = () => {
    alert("Download Payroll Reports functionality would open here!");
  };

  return (
    <div className="space-y-6">
      <style>{`
        .payroll-container {
          background: transparent;
        }
        
        .payroll-card {
          background: linear-gradient(145deg, 
            rgba(15, 23, 42, 0.9) 0%,
            rgba(30, 41, 59, 0.8) 100%
          );
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          transition: all 0.3s ease;
        }
        
        .payroll-card:hover {
          transform: translateY(-2px);
          border: 1px solid rgba(34, 197, 94, 0.3);
          box-shadow: 
            0 10px 25px rgba(0, 0, 0, 0.3),
            0 0 20px rgba(34, 197, 94, 0.1);
        }

        .metric-card {
          background: linear-gradient(145deg, 
            rgba(15, 23, 42, 0.95) 0%,
            rgba(30, 41, 59, 0.9) 100%
          );
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          box-shadow: 
            0 10px 25px rgba(0, 0, 0, 0.3),
            0 0 30px rgba(34, 197, 94, 0.05);
        }
      `}</style>

      {/* Payroll Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="metric-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-5 h-5 text-green-400" />
              <span className="text-sm text-slate-400">Total Gross</span>
            </div>
            <h3 className="text-2xl font-bold text-white">${totalGrossPay.toLocaleString()}</h3>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <Calculator className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-slate-400">Total Net</span>
            </div>
            <h3 className="text-2xl font-bold text-white">${totalNetPay.toLocaleString()}</h3>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-orange-400" />
              <span className="text-sm text-slate-400">Deductions</span>
            </div>
            <h3 className="text-2xl font-bold text-white">${totalDeductions.toLocaleString()}</h3>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-slate-400">Paid</span>
            </div>
            <h3 className="text-2xl font-bold text-white">{paidPayrolls}/{filteredPayroll.length}</h3>
          </CardContent>
        </Card>
      </div>

      {/* Header and Actions */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex gap-3 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search payroll..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32 bg-slate-800/50 border-slate-700 text-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select value={payPeriodFilter} onValueChange={setPayPeriodFilter}>
            <SelectTrigger className="w-40 bg-slate-800/50 border-slate-700 text-white">
              <SelectValue placeholder="Pay Period" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="current">Current Period</SelectItem>
              <SelectItem value="last">Last Period</SelectItem>
              <SelectItem value="ytd">Year to Date</SelectItem>
              <SelectItem value="all">All Periods</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleDownloadReports} variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
            <Download className="w-4 h-4 mr-2" />
            Reports
          </Button>
          
          <Button onClick={handleRunPayroll} className="bg-green-600 hover:bg-green-700 text-white">
            <Calculator className="w-4 h-4 mr-2" />
            Run Payroll
          </Button>
        </div>
      </div>

      {/* Payroll List */}
      <div className="payroll-container">
        {filteredPayroll.length > 0 ? (
          <div className="grid gap-4">
            {filteredPayroll.map((payroll, index) => (
              <motion.div
                key={payroll.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="payroll-card p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-green-500/20 rounded-full">
                        <DollarSign className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {payroll.employee_name}
                        </h3>
                        <p className="text-slate-400 text-sm">
                          Pay Period: {format(new Date(payroll.pay_period_start), 'MMM d')} - {format(new Date(payroll.pay_period_end), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-3 bg-slate-800/30 rounded-lg">
                        <div className="text-lg font-bold text-green-400">
                          ${payroll.gross_pay.toLocaleString()}
                        </div>
                        <div className="text-xs text-slate-400">Gross Pay</div>
                      </div>
                      
                      <div className="text-center p-3 bg-slate-800/30 rounded-lg">
                        <div className="text-lg font-bold text-red-400">
                          ${Object.values(payroll.deductions).reduce((sum, val) => sum + val, 0).toLocaleString()}
                        </div>
                        <div className="text-xs text-slate-400">Deductions</div>
                      </div>
                      
                      <div className="text-center p-3 bg-slate-800/30 rounded-lg">
                        <div className="text-lg font-bold text-blue-400">
                          ${payroll.net_pay.toLocaleString()}
                        </div>
                        <div className="text-xs text-slate-400">Net Pay</div>
                      </div>
                      
                      <div className="text-center p-3 bg-slate-800/30 rounded-lg">
                        <div className="text-lg font-bold text-yellow-400">
                          {payroll.regular_hours + payroll.overtime_hours}h
                        </div>
                        <div className="text-xs text-slate-400">Total Hours</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge className={getStatusColor(payroll.status)}>
                        {payroll.status.toUpperCase()}
                      </Badge>
                      
                      <Badge className="bg-blue-500/20 text-blue-300">
                        {getPaymentMethodIcon(payroll.payment_method)}
                        <span className="ml-1">{payroll.payment_method.replace('_', ' ')}</span>
                      </Badge>
                      
                      {payroll.overtime_hours > 0 && (
                        <Badge className="bg-orange-500/20 text-orange-300">
                          ⏰ {payroll.overtime_hours}h OT
                        </Badge>
                      )}
                      
                      <Badge className="bg-green-500/20 text-green-300">
                        💰 Pay Date: {format(new Date(payroll.pay_date), 'MMM d')}
                      </Badge>
                    </div>

                    {/* Deductions Breakdown */}
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <h4 className="text-sm font-semibold text-green-400 mb-2">Deductions Breakdown</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Federal Tax:</span>
                          <span className="text-slate-300">${payroll.deductions.federal_tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">State Tax:</span>
                          <span className="text-slate-300">${payroll.deductions.state_tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Social Security:</span>
                          <span className="text-slate-300">${payroll.deductions.social_security.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Medicare:</span>
                          <span className="text-slate-300">${payroll.deductions.medicare.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Health Insurance:</span>
                          <span className="text-slate-300">${payroll.deductions.health_insurance.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">401k:</span>
                          <span className="text-slate-300">${payroll.deductions.retirement_401k.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    {payroll.status === 'draft' && (
                      <Button
                        size="sm"
                        onClick={() => handleApprovePayroll(payroll)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                    )}
                    
                    {payroll.status === 'approved' && (
                      <Button
                        size="sm"
                        onClick={() => handlePayPayroll(payroll)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    )}
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewPayroll(payroll)}
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditPayroll(payroll)}
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <DollarSign className="w-16 h-16 text-slate-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-300 mb-2">No payroll records found</h3>
            <p className="text-slate-400 mb-6">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your filters" 
                : "Start by running payroll for your employees"}
            </p>
            <Button onClick={handleRunPayroll} className="bg-green-600 hover:bg-green-700 text-white">
              <Calculator className="w-4 h-4 mr-2" />
              Run Payroll
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}