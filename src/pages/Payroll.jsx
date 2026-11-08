
import React, { useState, useEffect } from "react";
import { Employee } from "@/api/entities";
import { Payroll as PayrollEntity } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // NEW IMPORT: Badge component
import { Plus, Users, DollarSign, Shield, Edit, Trash2, MoreHorizontal, Calculator, FileText } from "lucide-react"; // NEW ICONS: Calculator, FileText
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

import EmployeeForm from "../components/payroll/EmployeeForm";
import PayrollCalculator from "../components/payroll/PayrollCalculator";

export default function Payroll() {
  const [employees, setEmployees] = useState([]);
  const [payrolls, setPayrolls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [showPayrollCalculator, setShowPayrollCalculator] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [employeeData, payrollData] = await Promise.all([
        Employee.list('-created_date', 200),
        PayrollEntity.list('-pay_date', 100)
      ]);
      setEmployees(employeeData);
      setPayrolls(payrollData);
    } catch (error) {
      console.error('Error loading payroll data:', error);
    }
    setIsLoading(false);
  };

  const handleEmployeeSubmit = async (employeeData) => {
    try {
      if (editingEmployee) {
        await Employee.update(editingEmployee.id, employeeData);
      } else {
        await Employee.create(employeeData);
      }
      setShowEmployeeForm(false);
      setEditingEmployee(null);
      await loadData();
    } catch (error) {
      console.error('Error saving employee:', error);
      alert('Error saving employee. Please try again.');
    }
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setShowEmployeeForm(true);
  };

  const handleDeleteEmployee = async (employee) => {
    if (confirm(`Are you sure you want to permanently delete employee "${employee.first_name} ${employee.last_name}"? This action cannot be undone.`)) {
      try {
        await Employee.delete(employee.id);
        await loadData();
      } catch (error) {
        console.error('Error deleting employee:', error);
        alert('Error deleting employee. Please try again.');
      }
    }
  };

  const handleDeletePayroll = async (payroll) => {
    if (confirm(`Are you sure you want to permanently delete this payroll record? This action cannot be undone.`)) {
      try {
        await PayrollEntity.delete(payroll.id);
        await loadData();
      } catch (error) {
        console.error('Error deleting payroll:', error);
        alert('Error deleting payroll. Please try again.');
      }
    }
  };

  const handleRunPayroll = () => {
    setShowPayrollCalculator(false);
    loadData();
  };

  const handleCreatePayroll = (employee) => {
    // This function can be expanded to pre-select an employee in PayrollCalculator if supported
    setShowPayrollCalculator(true);
  };

  const monthlyPayrollTotal = payrolls
    .filter(p => {
      const payDate = new Date(p.pay_date);
      const now = new Date();
      return payDate.getMonth() === now.getMonth() &&
             payDate.getFullYear() === now.getFullYear() &&
             p.status === 'paid'; // Only sum 'paid' payrolls for the current month
    })
    .reduce((sum, p) => sum + (p.gross_pay || 0), 0);

  return (
    <div className="min-h-screen payroll-page-container space-y-8">
      <style jsx>{`
        /* REVOLUTIONARY PAYROLL PAGE STYLES */
        @keyframes backgroundFlow {
          0% { background-position: 0% 0%; }
          100% { background-position: 400% 0%; }
        }
        .payroll-page-container {
          background: linear-gradient(135deg, 
            #0f172a 0%,
            #1e293b 25%,
            #334155 50%,
            #1e293b 75%,
            #0f172a 100%
          );
          background-size: 400% 400%;
          animation: backgroundFlow 20s linear infinite; /* Changed ease to linear for smoother flow */
          position: relative;
          overflow: hidden;
          padding: 2rem;
          max-width: 7xl;
          margin: 0 auto;
        }
        
        /* Employee Floating Particles */
        .payroll-particles {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 1;
        }
        
        .employee-particle {
          position: absolute;
          border-radius: 50%;
          animation: floatEmployeeParticle 22s ease-in-out infinite;
        }
        
        .employee-particle-1 {
          width: 12px;
          height: 12px;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          top: 20%;
          left: 10%;
          animation-delay: 0s;
          box-shadow: 0 0 50px rgba(59, 130, 246, 0.8);
        }
        
        .employee-particle-2 {
          width: 16px;
          height: 16px;
          background: linear-gradient(135deg, #10b981, #059669);
          top: 70%;
          left: 90%;
          animation-delay: 8s;
          box-shadow: 0 0 60px rgba(16, 185, 129, 0.9);
        }
        
        .employee-particle-3 {
          width: 10px;
          height: 10px;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          top: 50%;
          left: 50%;
          animation-delay: 16s;
          box-shadow: 0 0 45px rgba(245, 158, 11, 0.7);
        }
        
        @keyframes floatEmployeeParticle {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) rotate(0deg) scale(1); 
            opacity: 0.8; 
          }
          25% { 
            transform: translateY(-100px) translateX(80px) rotate(90deg) scale(2); 
            opacity: 1; 
          }
          50% { 
            transform: translateY(-200px) translateX(-60px) rotate(180deg) scale(3); 
            opacity: 0.9; 
          }
          75% { 
            transform: translateY(-100px) translateX(100px) rotate(270deg) scale(2.5); 
            opacity: 1; 
          }
        }
        
        /* Revolutionary Employee Cards */
        .employee-card-revolutionary {
          background: linear-gradient(145deg, 
            rgba(15, 23, 42, 0.98) 0%,
            rgba(30, 41, 59, 0.96) 25%,
            rgba(51, 65, 85, 0.94) 50%,
            rgba(30, 41, 59, 0.96) 75%,
            rgba(15, 23, 42, 0.98) 100%
          );
          backdrop-filter: blur(40px);
          border: 2px solid transparent;
          border-image: linear-gradient(45deg, #3b82f6, #10b981, #f59e0b, #3b82f6) 1;
          border-radius: 24px;
          box-shadow: 
            0 25px 50px rgba(0, 0, 0, 0.4),
            0 0 100px rgba(59, 130, 246, 0.3),
            0 0 200px rgba(16, 185, 129, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          animation: payrollPulse 12s ease-in-out infinite;
        }
        
        @keyframes payrollPulse {
          0%, 100% {
            box-shadow: 
              0 25px 50px rgba(0, 0, 0, 0.4),
              0 0 100px rgba(59, 130, 246, 0.3),
              0 0 200px rgba(16, 185, 129, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
          }
          50% {
            box-shadow: 
              0 25px 50px rgba(0, 0, 0, 0.4),
              0 0 120px rgba(16, 185, 129, 0.4),
              0 0 240px rgba(245, 158, 11, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.15);
          }
        }
        
        .employee-card-revolutionary:hover {
          transform: translateY(-15px) rotateX(4deg) scale(1.04);
          border-image: linear-gradient(45deg, #10b981, #f59e0b, #3b82f6, #10b981) 1;
          box-shadow: 
            0 40px 80px rgba(0, 0, 0, 0.5),
            0 0 150px rgba(59, 130, 246, 0.4),
            0 0 300px rgba(16, 185, 129, 0.3),
            0 0 450px rgba(245, 158, 11, 0.2);
        }
        
        /* Employee Avatar Enhancement */
        .employee-avatar-revolutionary {
          width: 4rem;
          height: 4rem;
          background: linear-gradient(135deg, #3b82f6 0%, #10b981 50%, #f59e0b 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: bold;
          color: white;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          box-shadow: 
            0 8px 16px rgba(0, 0, 0, 0.3),
            0 0 30px rgba(59, 130, 246, 0.4),
            inset 0 2px 4px rgba(255, 255, 255, 0.2);
          position: relative;
          animation: avatarGlow 8s ease-in-out infinite;
        }
        
        @keyframes avatarGlow {
          0%, 100% {
            box-shadow: 
              0 8px 16px rgba(0, 0, 0, 0.3),
              0 0 30px rgba(59, 130, 246, 0.4),
              inset 0 2px 4px rgba(255, 255, 255, 0.2);
          }
          50% {
            box-shadow: 
              0 8px 16px rgba(0, 0, 0, 0.3),
              0 0 50px rgba(16, 185, 129, 0.6),
              inset 0 2px 4px rgba(255, 255, 255, 0.3);
          }
        }
        
        /* Payroll Stats Enhancement */
        .payroll-stat-card {
          background: linear-gradient(135deg, 
            rgba(59, 130, 246, 0.1) 0%,
            rgba(15, 23, 42, 0.95) 50%,
            rgba(59, 130, 246, 0.1) 100%
          );
          border: 2px solid rgba(59, 130, 246, 0.3);
          border-radius: 20px;
          backdrop-filter: blur(20px);
          transition: all 0.3s ease;
          animation: statFloat 14s ease-in-out infinite;
        }
        
        @keyframes statFloat {
          0%, 100% { 
            transform: translateY(0px) rotateY(0deg); 
            box-shadow: 0 15px 40px rgba(59, 130, 246, 0.2);
          }
          50% { 
            transform: translateY(-15px) rotateY(8deg); 
            box-shadow: 0 30px 80px rgba(59, 130, 246, 0.4);
          }
        }
        
        .payroll-stat-card:hover {
          transform: translateY(-18px) rotateX(8deg) scale(1.08);
          border-color: rgba(59, 130, 246, 0.8);
          box-shadow: 
            0 35px 70px rgba(59, 130, 246, 0.4),
            0 0 120px rgba(16, 185, 129, 0.3);
        }
      `}</style>

      {/* Floating Payroll Particles */}
      <div className="payroll-particles">
        <div className="employee-particle employee-particle-1"></div>
        <div className="employee-particle employee-particle-2"></div>
        <div className="employee-particle employee-particle-3"></div>
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
      >
        <div>
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-green-400 to-orange-400 tracking-tight">
            👥 Revolutionary Payroll
          </h1>
          <p className="text-gray-400 mt-2 text-xl">Cosmic employee management & compensation system</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => setShowEmployeeForm(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            <Users className="w-5 h-5 mr-2" />
            Add Employee
          </Button>
          <Button
            onClick={() => setShowPayrollCalculator(true)}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
            disabled={employees.length === 0}
          >
            <DollarSign className="w-5 h-5 mr-2" />
            Process Payroll
          </Button>
        </div>
      </motion.div>

      {/* Payroll Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <Card className="payroll-stat-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl border border-blue-500/30">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Total Employees</p>
                <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                  {employees.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="payroll-stat-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl border border-green-500/30">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Monthly Payroll</p>
                <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                  ${monthlyPayrollTotal.toFixed(0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="payroll-stat-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-orange-500/20 to-amber-500/20 rounded-xl border border-orange-500/30">
                <Calculator className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Pending Payrolls</p>
                <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">
                  {payrolls.filter(p => p.status === 'draft').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="payroll-stat-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-purple-500/20 to-violet-500/20 rounded-xl border border-purple-500/30">
                <FileText className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">This Month Paid</p>
                <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-400">
                  {payrolls.filter(p => {
                    const payDate = new Date(p.pay_date);
                    const now = new Date();
                    return payDate.getMonth() === now.getMonth() &&
                           payDate.getFullYear() === now.getFullYear() &&
                           p.status === 'paid';
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Employees Grid */}
      {isLoading ? (
        <div className="text-center py-12 bg-slate-900/50 rounded-xl border border-slate-700 shadow-xl">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading employees...</p>
        </div>
      ) : employees.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {employees.map((employee, index) => (
            <motion.div
              key={employee.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
              className="employee-card-revolutionary"
            >
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="employee-avatar-revolutionary">
                    {employee.first_name?.[0]}{employee.last_name?.[0]}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white">
                      {employee.first_name} {employee.last_name}
                    </h3>
                    <p className="text-gray-400 font-medium">{employee.job_title}</p>
                    <Badge className="mt-2 bg-gradient-to-r from-blue-500/20 to-green-500/20 text-blue-300 border-blue-500/30">
                      {employee.department}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-300">
                    <span>Base Salary:</span>
                    <span className="font-bold text-green-400">
                      {employee.salary_type === 'hourly'
                        ? `$${employee.hourly_rate?.toLocaleString()}/hr`
                        : `$${employee.base_salary?.toLocaleString()}`
                      }
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Type:</span>
                    <span className="font-medium text-blue-400">{employee.salary_type}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Status:</span>
                    <Badge className={`${employee.status === 'active' ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-gray-500/20 text-gray-300 border-gray-500/30'}`}>
                      {employee.status}
                    </Badge>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditEmployee(employee)}
                    className="flex-1 bg-slate-800/50 border-slate-600 text-gray-300 hover:bg-slate-700/50"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleCreatePayroll(employee)}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    Pay
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 bg-slate-800/50 border-slate-600 text-gray-300 hover:bg-slate-700/50">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-slate-900 border-slate-700 text-gray-200">
                      <DropdownMenuItem
                        onClick={() => handleDeleteEmployee(employee)}
                        className="text-red-500 focus:text-red-500 focus:bg-red-900/20"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-12 bg-slate-900/50 rounded-xl border border-slate-700 shadow-xl">
          <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No employees found</h3>
          <p className="text-gray-400 mb-4">Get started by adding your first employee.</p>
          <Button
            onClick={() => setShowEmployeeForm(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Employee
          </Button>
        </div>
      )}

      {/* Recent Payrolls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-slate-900/50 border-slate-700 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <DollarSign className="w-5 h-5 text-green-600" />
              Recent Payrolls ({payrolls.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {payrolls.length > 0 ? (
              <div className="space-y-4">
                {payrolls.slice(0, 10).map((payroll) => {
                  const employee = employees.find(e => e.id === payroll.employee_id);
                  return (
                    <div key={payroll.id} className="flex items-center justify-between p-4 border border-slate-700 rounded-lg hover:bg-slate-800/50 transition-colors">
                      <div>
                        <h3 className="font-semibold text-white">
                          {employee ? `${employee.first_name} ${employee.last_name}` : 'Unknown Employee'}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {payroll.pay_period_start} to {payroll.pay_period_end}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-400">${payroll.gross_pay?.toFixed(2) || '0.00'}</p>
                        <p className="text-sm text-gray-400">{payroll.status}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 bg-slate-800/50 border-slate-700 text-gray-400 hover:bg-slate-700/50">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-slate-900 border-slate-700 text-gray-200">
                          <DropdownMenuItem
                            onClick={() => handleDeletePayroll(payroll)}
                            className="text-red-500 focus:text-red-500 focus:bg-red-900/20"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Payroll
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-900/50 rounded-xl border border-slate-700 shadow-xl">
                <DollarSign className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No payroll records</h3>
                <p className="text-gray-400">Payroll records will appear here once processed.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Modals */}
      {showEmployeeForm && (
        <EmployeeForm
          employee={editingEmployee}
          onSubmit={handleEmployeeSubmit}
          onCancel={() => {
            setShowEmployeeForm(false);
            setEditingEmployee(null);
          }}
        />
      )}

      {showPayrollCalculator && (
        <PayrollCalculator
          employees={employees}
          onRunPayroll={handleRunPayroll}
          onCancel={() => setShowPayrollCalculator(false)}
        />
      )}
    </div>
  );
}
