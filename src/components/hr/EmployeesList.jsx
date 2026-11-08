
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  Phone, 
  Mail, 
  Calendar, 
  Search,
  Plus,
  Eye,
  Edit,
  UserCheck,
  Building,
  Award,
  Clock,
  MapPin
} from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import EmployeeForm from "./EmployeeForm"; // Fixed: Correct relative path

export default function EmployeesList({ employees = [], onRefresh }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("created_date");
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  // Filter and sort employees
  const filteredEmployees = employees
    .filter(employee => {
      const matchesSearch = !searchTerm || 
        employee.personal_info?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.personal_info?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.personal_info?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.employment_details?.job_title?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDepartment = departmentFilter === "all" || 
        employee.employment_details?.department === departmentFilter;
      const matchesStatus = statusFilter === "all" || 
        employee.employment_details?.employment_status === statusFilter;
      
      return matchesSearch && matchesDepartment && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "created_date") {
        return new Date(b.created_date) - new Date(a.created_date);
      }
      if (sortBy === "hire_date") {
        return new Date(b.employment_details?.hire_date) - new Date(a.employment_details?.hire_date);
      }
      if (sortBy === "name") {
        const nameA = `${a.personal_info?.first_name} ${a.personal_info?.last_name}`;
        const nameB = `${b.personal_info?.first_name} ${b.personal_info?.last_name}`;
        return nameA.localeCompare(nameB);
      }
      return 0;
    });

  const getStatusColor = (status) => {
    const colors = {
      active: "bg-green-500/20 text-green-300 border-green-500/30",
      inactive: "bg-gray-500/20 text-gray-300 border-gray-500/30",
      terminated: "bg-red-500/20 text-red-300 border-red-500/30",
      on_leave: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      probation: "bg-blue-500/20 text-blue-300 border-blue-500/30"
    };
    return colors[status] || colors.active;
  };

  const getDepartmentColor = (department) => {
    const colors = {
      accounting: "bg-green-500/20 text-green-300",
      sales: "bg-blue-500/20 text-blue-300",
      marketing: "bg-purple-500/20 text-purple-300",
      operations: "bg-orange-500/20 text-orange-300",
      hr: "bg-pink-500/20 text-pink-300",
      executive: "bg-red-500/20 text-red-300",
      engineering: "bg-cyan-500/20 text-cyan-300",
      other: "bg-gray-500/20 text-gray-300"
    };
    return colors[department] || colors.other;
  };

  const handleAddEmployee = () => {
    setEditingEmployee(null); // Clear any previously selected employee for editing
    setShowEmployeeForm(true); // Open the form in 'add' mode
  };

  const handleViewEmployee = (employee) => {
    alert(`View ${employee.personal_info?.first_name} ${employee.personal_info?.last_name} details`);
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee); // Set the employee data for editing
    setShowEmployeeForm(true); // Open the form in 'edit' mode
  };

  const handleEmployeeSuccess = (newEmployee) => {
    if (onRefresh) {
      onRefresh(); // Trigger a refresh of the employee list
    }
    setShowEmployeeForm(false); // Close the form after successful operation
    setEditingEmployee(null); // Clear the editing state
  };

  return (
    <div className="space-y-6">
      <style>{`
        .employees-container {
          background: transparent;
        }
        
        .employee-card {
          background: linear-gradient(145deg, 
            rgba(15, 23, 42, 0.9) 0%,
            rgba(30, 41, 59, 0.8) 100%
          );
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          transition: all 0.3s ease;
        }
        
        .employee-card:hover {
          transform: translateY(-2px);
          border: 1px solid rgba(16, 185, 129, 0.3);
          box-shadow: 
            0 10px 25px rgba(0, 0, 0, 0.3),
            0 0 20px rgba(16, 185, 129, 0.1);
        }
      `}</style>

      {/* Header and Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex gap-3 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400"
            />
          </div>
          
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-40 bg-slate-800/50 border-slate-700 text-white">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="accounting">Accounting</SelectItem>
              <SelectItem value="sales">Sales</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="operations">Operations</SelectItem>
              <SelectItem value="hr">Human Resources</SelectItem>
              <SelectItem value="executive">Executive</SelectItem>
              <SelectItem value="engineering">Engineering</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 bg-slate-800/50 border-slate-700 text-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="terminated">Terminated</SelectItem>
              <SelectItem value="on_leave">On Leave</SelectItem>
              <SelectItem value="probation">Probation</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40 bg-slate-800/50 border-slate-700 text-white">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="created_date">Latest</SelectItem>
              <SelectItem value="hire_date">Hire Date</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleAddEmployee} className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Employee
        </Button>
      </div>

      {/* Employees Grid */}
      <div className="employees-container">
        {filteredEmployees.length > 0 ? (
          <div className="grid gap-4">
            {filteredEmployees.map((employee, index) => (
              <motion.div
                key={employee.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="employee-card p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-emerald-500/20 rounded-full">
                        <UserCheck className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {employee.personal_info?.first_name} {employee.personal_info?.last_name}
                        </h3>
                        <p className="text-slate-400 text-sm">
                          {employee.employment_details?.job_title || 'No title'}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-300">
                          {employee.personal_info?.email || 'No email'}
                        </span>
                      </div>
                      
                      {employee.personal_info?.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-300">{employee.personal_info.phone}</span>
                        </div>
                      )}
                      
                      {employee.employment_details?.hire_date && (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-300">
                            Hired: {format(new Date(employee.employment_details.hire_date), 'MMM d, yyyy')}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge className={getStatusColor(employee.employment_details?.employment_status)}>
                        {(employee.employment_details?.employment_status || 'active').replace('_', ' ').toUpperCase()}
                      </Badge>
                      
                      {employee.employment_details?.department && (
                        <Badge className={getDepartmentColor(employee.employment_details.department)}>
                          {employee.employment_details.department.replace('_', ' ')}
                        </Badge>
                      )}
                      
                      {employee.employment_details?.employment_type && (
                        <Badge className="bg-blue-500/20 text-blue-300">
                          {employee.employment_details.employment_type.replace('_', ' ')}
                        </Badge>
                      )}

                      {employee.employment_details?.location && (
                        <Badge className="bg-purple-500/20 text-purple-300">
                          <MapPin className="w-3 h-3 mr-1" />
                          {employee.employment_details.location}
                        </Badge>
                      )}
                    </div>

                    {/* Compensation Info */}
                    {employee.compensation && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-300 mb-3">
                        {employee.compensation.base_salary && (
                          <div>
                            <span className="text-slate-400">Salary:</span> 
                            <span className="font-semibold ml-2">
                              {employee.compensation.currency || 'USD'} {employee.compensation.base_salary.toLocaleString()}
                            </span>
                          </div>
                        )}
                        {employee.compensation.pay_frequency && (
                          <div>
                            <span className="text-slate-400">Pay Frequency:</span> 
                            <span className="ml-2 capitalize">
                              {employee.compensation.pay_frequency.replace('_', ' ')}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewEmployee(employee)}
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditEmployee(employee)}
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* AI Insights */}
                {employee.ai_insights && (
                  <div className="mt-4 p-3 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm font-medium text-emerald-400">Employee Insights</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                      {employee.ai_insights.performance_trend && (
                        <div className="text-slate-300">
                          Performance: {employee.ai_insights.performance_trend}
                        </div>
                      )}
                      {employee.ai_insights.flight_risk && (
                        <div className="text-slate-300">
                          Flight Risk: {employee.ai_insights.flight_risk}%
                        </div>
                      )}
                      {employee.ai_insights.promotion_readiness && (
                        <div className="text-slate-300">
                          Promotion Ready: {employee.ai_insights.promotion_readiness}%
                        </div>
                      )}
                    </div>
                    {employee.ai_insights.recommended_training && employee.ai_insights.recommended_training.length > 0 && (
                      <p className="text-xs text-slate-300 mt-2">
                        Training: {employee.ai_insights.recommended_training.slice(0, 2).join(', ')}
                      </p>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-slate-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-300 mb-2">No employees found</h3>
            <p className="text-slate-400 mb-6">
              {searchTerm || departmentFilter !== "all" || statusFilter !== "all"
                ? "Try adjusting your filters" 
                : "Start by adding your first employee"}
            </p>
            <Button onClick={handleAddEmployee} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Employee
            </Button>
          </div>
        )}
      </div>

      {/* Employee Form Modal */}
      <EmployeeForm
        isOpen={showEmployeeForm}
        onClose={() => {
          setShowEmployeeForm(false);
          setEditingEmployee(null); // Ensure editing state is cleared on close
        }}
        employee={editingEmployee}
        onSuccess={handleEmployeeSuccess}
      />
    </div>
  );
}
