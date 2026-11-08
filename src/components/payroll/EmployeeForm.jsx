import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { Save, X, User, Mail, Briefcase, DollarSign, Shield, Calendar } from "lucide-react";

const DEPARTMENTS = ["accounting", "sales", "marketing", "operations", "hr", "executive"];
const EMPLOYMENT_TYPES = ["full_time", "part_time", "contract", "intern"];
const SALARY_TYPES = ["hourly", "salary", "commission"];
const CURRENCIES = ["USD", "GBP", "CAD", "EUR", "MMK", "JPY", "CNY", "INR", "SGD", "THB", "KRW"];

export default function EmployeeForm({ 
  employee, 
  onSubmit, 
  onCancel, 
  onDelete, 
  defaultCurrency = "USD" 
}) {
  const [formData, setFormData] = useState(employee || {
    employee_id: `EMP-${Date.now().toString().slice(-6)}`,
    first_name: "",
    last_name: "",
    email: "",
    job_title: "",
    department: "operations",
    employment_type: "full_time",
    salary_type: "salary",
    base_salary: "",
    hourly_rate: "",
    currency: defaultCurrency,
    hire_date: new Date().toISOString().split('T')[0],
    status: "active",
    benefits: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (employee) {
      setFormData({
        ...employee,
        base_salary: employee.base_salary?.toString() || "",
        hourly_rate: employee.hourly_rate?.toString() || "",
        benefits: employee.benefits || []
      });
    }
  }, [employee]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Validation
    if (!formData.first_name.trim() || !formData.last_name.trim()) {
      alert("Please enter employee's first and last name");
      return;
    }
    if (!formData.email.trim()) {
      alert("Please enter employee's email address");
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData = {
        ...formData,
        base_salary: formData.base_salary ? parseFloat(formData.base_salary) : null,
        hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : null
      };
      await onSubmit(submitData);
    } catch (error) {
      console.error('Employee submission error:', error);
      alert('Failed to save employee. Please try again.');
    }
    setIsSubmitting(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="revolutionary-employee-form w-full max-w-4xl max-h-[95vh] overflow-hidden"
        >
          <style jsx>{`
            .revolutionary-employee-form {
              background: linear-gradient(145deg, 
                rgba(15, 23, 42, 0.98) 0%,
                rgba(30, 41, 59, 0.96) 50%,
                rgba(51, 65, 85, 0.94) 100%
              );
              border: 2px solid transparent;
              border-image: linear-gradient(45deg, #06b6d4, #3b82f6, #8b5cf6) 1;
              border-radius: 24px;
              backdrop-filter: blur(30px);
              box-shadow: 
                0 25px 50px rgba(0, 0, 0, 0.5),
                0 0 80px rgba(6, 182, 212, 0.2),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
              position: relative;
              overflow: hidden;
            }
            
            .form-header-enhanced {
              background: linear-gradient(135deg, 
                rgba(6, 182, 212, 0.1) 0%,
                rgba(59, 130, 246, 0.08) 50%,
                rgba(139, 92, 246, 0.1) 100%
              );
              border-bottom: 1px solid rgba(255, 255, 255, 0.1);
              padding: 1.5rem;
              position: relative;
              z-index: 10;
            }
            
            .form-content-enhanced {
              position: relative;
              z-index: 10;
              max-height: 60vh;
              overflow-y: auto;
              padding: 1.5rem;
            }
            
            .enhanced-input {
              background: linear-gradient(135deg, 
                rgba(255, 255, 255, 0.08) 0%,
                rgba(255, 255, 255, 0.04) 100%
              );
              border: 1px solid rgba(255, 255, 255, 0.2);
              border-radius: 12px;
              color: rgba(255, 255, 255, 0.9);
              padding: 0.75rem 1rem;
              backdrop-filter: blur(10px);
              transition: all 0.3s ease;
            }
            
            .enhanced-input:focus {
              background: linear-gradient(135deg, 
                rgba(255, 255, 255, 0.12) 0%,
                rgba(255, 255, 255, 0.08) 100%
              );
              border: 1px solid rgba(6, 182, 212, 0.5);
              box-shadow: 0 0 20px rgba(6, 182, 212, 0.3);
              transform: translateY(-1px);
              outline: none;
            }
            
            .enhanced-label {
              color: rgba(255, 255, 255, 0.9);
              font-weight: 600;
              font-size: 0.875rem;
              margin-bottom: 0.5rem;
              display: block;
            }
            
            .section-card {
              background: linear-gradient(135deg, 
                rgba(255, 255, 255, 0.08) 0%,
                rgba(255, 255, 255, 0.04) 100%
              );
              border: 1px solid rgba(255, 255, 255, 0.1);
              border-radius: 12px;
              padding: 1.5rem;
              backdrop-filter: blur(10px);
            }
            
            .enhanced-button-primary {
              background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
              border: none;
              border-radius: 12px;
              color: white;
              font-weight: 700;
              padding: 0.75rem 1.5rem;
              transition: all 0.3s ease;
              box-shadow: 0 4px 15px rgba(6, 182, 212, 0.3);
            }
            
            .enhanced-button-primary:hover {
              transform: translateY(-2px);
              box-shadow: 0 8px 25px rgba(6, 182, 212, 0.4);
            }
            
            .enhanced-button-secondary {
              background: linear-gradient(135deg, 
                rgba(255, 255, 255, 0.1) 0%,
                rgba(255, 255, 255, 0.05) 100%
              );
              border: 1px solid rgba(255, 255, 255, 0.2);
              border-radius: 12px;
              color: rgba(255, 255, 255, 0.8);
              font-weight: 600;
              padding: 0.75rem 1.5rem;
              transition: all 0.3s ease;
              backdrop-filter: blur(10px);
            }
            
            .enhanced-button-secondary:hover {
              background: linear-gradient(135deg, 
                rgba(255, 255, 255, 0.15) 0%,
                rgba(255, 255, 255, 0.08) 100%
              );
              transform: translateY(-1px);
            }
          `}</style>

          {/* Header */}
          <div className="form-header-enhanced">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {employee ? 'Edit Employee' : 'Add New Employee'}
                </h2>
                <p className="text-sm text-gray-300">
                  Manage employee information and compensation details
                </p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit}>
            <div className="form-content-enhanced space-y-6">
              {/* Personal Information */}
              <div className="section-card">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-cyan-400" />
                  Personal Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="enhanced-label">Employee ID</Label>
                    <Input
                      value={formData.employee_id}
                      onChange={(e) => handleChange('employee_id', e.target.value)}
                      className="enhanced-input"
                      placeholder="EMP-001"
                      required
                    />
                  </div>

                  <div>
                    <Label className="enhanced-label">First Name</Label>
                    <Input
                      value={formData.first_name}
                      onChange={(e) => handleChange('first_name', e.target.value)}
                      className="enhanced-input"
                      placeholder="John"
                      required
                    />
                  </div>

                  <div>
                    <Label className="enhanced-label">Last Name</Label>
                    <Input
                      value={formData.last_name}
                      onChange={(e) => handleChange('last_name', e.target.value)}
                      className="enhanced-input"
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label className="enhanced-label">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className="enhanced-input pl-10"
                        placeholder="john.doe@company.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="enhanced-label">Hire Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        type="date"
                        value={formData.hire_date}
                        onChange={(e) => handleChange('hire_date', e.target.value)}
                        className="enhanced-input pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Information */}
              <div className="section-card">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-400" />
                  Job Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="enhanced-label">Job Title</Label>
                    <Input
                      value={formData.job_title}
                      onChange={(e) => handleChange('job_title', e.target.value)}
                      className="enhanced-input"
                      placeholder="Software Engineer"
                      required
                    />
                  </div>

                  <div>
                    <Label className="enhanced-label">Department</Label>
                    <Select value={formData.department} onValueChange={(value) => handleChange('department', value)}>
                      <SelectTrigger className="enhanced-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {DEPARTMENTS.map(dept => (
                          <SelectItem key={dept} value={dept}>
                            {dept.charAt(0).toUpperCase() + dept.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="enhanced-label">Employment Type</Label>
                    <Select value={formData.employment_type} onValueChange={(value) => handleChange('employment_type', value)}>
                      <SelectTrigger className="enhanced-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {EMPLOYMENT_TYPES.map(type => (
                          <SelectItem key={type} value={type}>
                            {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="enhanced-label">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                      <SelectTrigger className="enhanced-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="terminated">Terminated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Compensation */}
              <div className="section-card">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  Compensation Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="enhanced-label">Salary Type</Label>
                    <Select value={formData.salary_type} onValueChange={(value) => handleChange('salary_type', value)}>
                      <SelectTrigger className="enhanced-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {SALARY_TYPES.map(type => (
                          <SelectItem key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="enhanced-label">Currency</Label>
                    <Select value={formData.currency} onValueChange={(value) => handleChange('currency', value)}>
                      <SelectTrigger className="enhanced-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {CURRENCIES.map(curr => (
                          <SelectItem key={curr} value={curr}>{curr}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.salary_type === 'salary' && (
                    <div>
                      <Label className="enhanced-label">Annual Salary</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.base_salary}
                          onChange={(e) => handleChange('base_salary', e.target.value)}
                          className="enhanced-input pl-10"
                          placeholder="50000.00"
                        />
                      </div>
                    </div>
                  )}

                  {formData.salary_type === 'hourly' && (
                    <div>
                      <Label className="enhanced-label">Hourly Rate</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.hourly_rate}
                          onChange={(e) => handleChange('hourly_rate', e.target.value)}
                          className="enhanced-input pl-10"
                          placeholder="25.00"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-700">
              <div className="flex justify-between items-center">
                {employee && onDelete && (
                  <Button 
                    type="button" 
                    onClick={() => onDelete(employee)} 
                    className="enhanced-button-secondary text-red-400 border-red-500/30 hover:bg-red-900/20"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Delete Employee
                  </Button>
                )}
                <div className="flex gap-3 ml-auto">
                  <Button 
                    type="button" 
                    onClick={onCancel} 
                    className="enhanced-button-secondary"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="enhanced-button-primary"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSubmitting ? 'Saving...' : employee ? 'Update Employee' : 'Add Employee'}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}