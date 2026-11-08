import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  Search,
  Plus,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  User,
  CalendarDays,
  Briefcase,
  Heart,
  Plane,
  AlertTriangle,
  TrendingUp
} from "lucide-react";
import { motion } from "framer-motion";
import { format, differenceInDays, isAfter, isBefore } from "date-fns";

export default function LeaveManagement({ leaveRequests = [], employees = [], onRefresh }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [employeeFilter, setEmployeeFilter] = useState("all");

  // Filter leave requests
  const filteredLeaves = leaveRequests
    .filter(leave => {
      const matchesSearch = !searchTerm || 
        leave.employee_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leave.reason?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || leave.status === statusFilter;
      const matchesType = typeFilter === "all" || leave.leave_type === typeFilter;
      const matchesEmployee = employeeFilter === "all" || leave.employee_id === employeeFilter;
      
      return matchesSearch && matchesStatus && matchesType && matchesEmployee;
    })
    .sort((a, b) => new Date(b.created_date) - new Date(a.created_date));

  // Calculate leave metrics
  const pendingRequests = leaveRequests.filter(leave => leave.status === 'pending').length;
  const approvedRequests = leaveRequests.filter(leave => leave.status === 'approved').length;
  const totalLeaveDays = leaveRequests.reduce((sum, leave) => sum + (leave.total_days || 0), 0);
  
  const leaveTypeStats = leaveRequests.reduce((acc, leave) => {
    acc[leave.leave_type] = (acc[leave.leave_type] || 0) + (leave.total_days || 0);
    return acc;
  }, {});

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      approved: "bg-green-500/20 text-green-300 border-green-500/30",
      rejected: "bg-red-500/20 text-red-300 border-red-500/30",
      cancelled: "bg-gray-500/20 text-gray-300 border-gray-500/30"
    };
    return colors[status] || colors.pending;
  };

  const getLeaveTypeIcon = (type) => {
    const icons = {
      vacation: Plane,
      sick: Heart,
      personal: User,
      bereavement: AlertTriangle,
      jury_duty: Briefcase,
      military: Briefcase,
      maternity: Heart,
      paternity: Heart,
      family_medical: Heart,
      sabbatical: Calendar,
      unpaid: Clock,
      other: CalendarDays
    };
    const IconComponent = icons[type] || icons.other;
    return <IconComponent className="w-4 h-4" />;
  };

  const getLeaveTypeColor = (type) => {
    const colors = {
      vacation: "bg-blue-500/20 text-blue-300",
      sick: "bg-red-500/20 text-red-300",
      personal: "bg-purple-500/20 text-purple-300",
      bereavement: "bg-gray-500/20 text-gray-300",
      jury_duty: "bg-orange-500/20 text-orange-300",
      military: "bg-green-500/20 text-green-300",
      maternity: "bg-pink-500/20 text-pink-300",
      paternity: "bg-cyan-500/20 text-cyan-300",
      family_medical: "bg-yellow-500/20 text-yellow-300",
      sabbatical: "bg-indigo-500/20 text-indigo-300",
      unpaid: "bg-slate-500/20 text-slate-300",
      other: "bg-gray-500/20 text-gray-300"
    };
    return colors[type] || colors.other;
  };

  const getEmployee = (employeeId) => {
    return employees.find(emp => emp.id === employeeId) || { personal_info: { first_name: 'Unknown', last_name: 'Employee' } };
  };

  const handleApproveLeave = (leave) => {
    alert(`Approve leave request for ${leave.employee_id}`);
    // In real implementation, update leave status
  };

  const handleRejectLeave = (leave) => {
    alert(`Reject leave request for ${leave.employee_id}`);
    // In real implementation, update leave status
  };

  const handleAddLeaveRequest = () => {
    alert("Add Leave Request functionality would open here!");
  };

  const handleViewLeave = (leave) => {
    alert(`View leave request details for ${leave.employee_id}`);
  };

  const handleEditLeave = (leave) => {
    alert(`Edit leave request for ${leave.employee_id}`);
  };

  return (
    <div className="space-y-6">
      <style>{`
        .leave-container {
          background: transparent;
        }
        
        .leave-card {
          background: linear-gradient(145deg, 
            rgba(15, 23, 42, 0.9) 0%,
            rgba(30, 41, 59, 0.8) 100%
          );
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          transition: all 0.3s ease;
        }
        
        .leave-card:hover {
          transform: translateY(-2px);
          border: 1px solid rgba(139, 92, 246, 0.3);
          box-shadow: 
            0 10px 25px rgba(0, 0, 0, 0.3),
            0 0 20px rgba(139, 92, 246, 0.1);
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
            0 0 30px rgba(139, 92, 246, 0.05);
        }
      `}</style>

      {/* Leave Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="metric-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-yellow-400" />
              <span className="text-sm text-slate-400">Pending</span>
            </div>
            <h3 className="text-2xl font-bold text-white">{pendingRequests}</h3>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-sm text-slate-400">Approved</span>
            </div>
            <h3 className="text-2xl font-bold text-white">{approvedRequests}</h3>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-slate-400">Total Days</span>
            </div>
            <h3 className="text-2xl font-bold text-white">{totalLeaveDays}</h3>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-slate-400">This Month</span>
            </div>
            <h3 className="text-2xl font-bold text-white">
              {leaveRequests.filter(leave => {
                const requestDate = new Date(leave.created_date);
                const thisMonth = new Date();
                return requestDate.getMonth() === thisMonth.getMonth() && 
                       requestDate.getFullYear() === thisMonth.getFullYear();
              }).length}
            </h3>
          </CardContent>
        </Card>
      </div>

      {/* Header and Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex gap-3 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search leave requests..."
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
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-32 bg-slate-800/50 border-slate-700 text-white">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="vacation">Vacation</SelectItem>
              <SelectItem value="sick">Sick</SelectItem>
              <SelectItem value="personal">Personal</SelectItem>
              <SelectItem value="bereavement">Bereavement</SelectItem>
              <SelectItem value="maternity">Maternity</SelectItem>
              <SelectItem value="paternity">Paternity</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>

          <Select value={employeeFilter} onValueChange={setEmployeeFilter}>
            <SelectTrigger className="w-40 bg-slate-800/50 border-slate-700 text-white">
              <SelectValue placeholder="Employee" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="all">All Employees</SelectItem>
              {employees.slice(0, 10).map(emp => (
                <SelectItem key={emp.id} value={emp.id}>
                  {emp.personal_info?.first_name} {emp.personal_info?.last_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleAddLeaveRequest} className="bg-purple-600 hover:bg-purple-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Leave Request
        </Button>
      </div>

      {/* Leave Requests List */}
      <div className="leave-container">
        {filteredLeaves.length > 0 ? (
          <div className="grid gap-4">
            {filteredLeaves.map((leave, index) => {
              const employee = getEmployee(leave.employee_id);
              const daysDuration = differenceInDays(new Date(leave.end_date), new Date(leave.start_date)) + 1;
              
              return (
                <motion.div
                  key={leave.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="leave-card p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-purple-500/20 rounded-full">
                          {getLeaveTypeIcon(leave.leave_type)}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {employee.personal_info?.first_name} {employee.personal_info?.last_name}
                          </h3>
                          <p className="text-slate-400 text-sm">
                            {leave.leave_type?.replace('_', ' ')} Leave Request
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-300">
                            {format(new Date(leave.start_date), 'MMM d')} - {format(new Date(leave.end_date), 'MMM d, yyyy')}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm">
                          <CalendarDays className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-300">
                            {leave.total_days || daysDuration} days
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-300">
                            Requested: {format(new Date(leave.created_date), 'MMM d, yyyy')}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge className={getStatusColor(leave.status)}>
                          {(leave.status || 'pending').toUpperCase()}
                        </Badge>
                        
                        <Badge className={getLeaveTypeColor(leave.leave_type)}>
                          {getLeaveTypeIcon(leave.leave_type)}
                          <span className="ml-1">{leave.leave_type?.replace('_', ' ')}</span>
                        </Badge>
                        
                        {leave.partial_day && (
                          <Badge className="bg-blue-500/20 text-blue-300">
                            🕐 Partial Day
                          </Badge>
                        )}
                        
                        {leave.emergency_contact_notified && (
                          <Badge className="bg-orange-500/20 text-orange-300">
                            🚨 Emergency Contact Notified
                          </Badge>
                        )}
                      </div>

                      {leave.reason && (
                        <p className="text-slate-300 text-sm line-clamp-2 mb-4">
                          <strong>Reason:</strong> {leave.reason}
                        </p>
                      )}

                      {/* Coverage Plan */}
                      {leave.coverage_plan && (
                        <div className="bg-slate-800/50 rounded-lg p-3 mb-3">
                          <h4 className="text-sm font-semibold text-purple-400 mb-2">Coverage Plan</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300">
                            {leave.coverage_plan.coverage_employee_id && (
                              <div>
                                <strong>Coverage:</strong> {leave.coverage_plan.coverage_employee_id}
                              </div>
                            )}
                            {leave.coverage_plan.handover_notes && (
                              <div>
                                <strong>Notes:</strong> {leave.coverage_plan.handover_notes}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Approval Notes */}
                      {leave.approval_notes && (
                        <div className="bg-slate-800/30 rounded-lg p-3">
                          <h4 className="text-sm font-semibold text-slate-300 mb-1">Manager Notes</h4>
                          <p className="text-xs text-slate-400">{leave.approval_notes}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      {leave.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleApproveLeave(leave)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleRejectLeave(leave)}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewLeave(leave)}
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditLeave(leave)}
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-slate-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-300 mb-2">No leave requests found</h3>
            <p className="text-slate-400 mb-6">
              {searchTerm || statusFilter !== "all" || typeFilter !== "all" || employeeFilter !== "all"
                ? "Try adjusting your filters" 
                : "Start by adding leave requests"}
            </p>
            <Button onClick={handleAddLeaveRequest} className="bg-purple-600 hover:bg-purple-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Leave Request
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}