import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Clock, 
  Play, 
  Pause, 
  Square,
  Calendar, 
  Search,
  Plus,
  Eye,
  Edit,
  CheckCircle,
  AlertTriangle,
  MapPin,
  Timer,
  BarChart3,
  Users,
  TrendingUp
} from "lucide-react";
import { motion } from "framer-motion";
import { format, isToday, differenceInHours, parseISO } from "date-fns";

export default function TimeTrackingPanel({ timeTracking = [], employees = [], onRefresh }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("today");
  const [employeeFilter, setEmployeeFilter] = useState("all");
  const [activeTimer, setActiveTimer] = useState(null);

  // Filter time tracking data
  const filteredTimeTracking = timeTracking
    .filter(entry => {
      const matchesSearch = !searchTerm || 
        entry.employee_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.task_description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || entry.status === statusFilter;
      const matchesEmployee = employeeFilter === "all" || entry.employee_id === employeeFilter;
      
      // Date filtering
      let matchesDate = true;
      if (dateFilter === "today") {
        matchesDate = isToday(new Date(entry.date));
      } else if (dateFilter === "week") {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        matchesDate = new Date(entry.date) >= weekAgo;
      }
      
      return matchesSearch && matchesStatus && matchesEmployee && matchesDate;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  // Calculate metrics
  const totalHours = filteredTimeTracking.reduce((sum, entry) => sum + (entry.total_hours || 0), 0);
  const regularHours = filteredTimeTracking.reduce((sum, entry) => sum + (entry.regular_hours || 0), 0);
  const overtimeHours = filteredTimeTracking.reduce((sum, entry) => sum + (entry.overtime_hours || 0), 0);
  const billableHours = filteredTimeTracking.filter(entry => entry.billable).reduce((sum, entry) => sum + (entry.total_hours || 0), 0);

  const getStatusColor = (status) => {
    const colors = {
      draft: "bg-gray-500/20 text-gray-300 border-gray-500/30",
      submitted: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      approved: "bg-green-500/20 text-green-300 border-green-500/30",
      rejected: "bg-red-500/20 text-red-300 border-red-500/30"
    };
    return colors[status] || colors.draft;
  };

  const getLocationColor = (location) => {
    const colors = {
      office: "bg-blue-500/20 text-blue-300",
      remote: "bg-green-500/20 text-green-300",
      client_site: "bg-purple-500/20 text-purple-300",
      other: "bg-gray-500/20 text-gray-300"
    };
    return colors[location] || colors.other;
  };

  const handleStartTimer = (employeeId) => {
    setActiveTimer(employeeId);
    // In real implementation, this would start a timer
  };

  const handleStopTimer = () => {
    setActiveTimer(null);
    // In real implementation, this would save the time entry
  };

  const handleAddTimeEntry = () => {
    alert("Add Time Entry functionality would open here!");
  };

  const handleViewEntry = (entry) => {
    alert(`View time entry for ${entry.employee_id}`);
  };

  const handleEditEntry = (entry) => {
    alert(`Edit time entry for ${entry.employee_id}`);
  };

  return (
    <div className="space-y-6">
      <style>{`
        .time-tracking-container {
          background: transparent;
        }
        
        .time-entry-card {
          background: linear-gradient(145deg, 
            rgba(15, 23, 42, 0.9) 0%,
            rgba(30, 41, 59, 0.8) 100%
          );
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          transition: all 0.3s ease;
        }
        
        .time-entry-card:hover {
          transform: translateY(-2px);
          border: 1px solid rgba(59, 130, 246, 0.3);
          box-shadow: 
            0 10px 25px rgba(0, 0, 0, 0.3),
            0 0 20px rgba(59, 130, 246, 0.1);
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
            0 0 30px rgba(59, 130, 246, 0.05);
        }
      `}</style>

      {/* Time Tracking Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="metric-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-slate-400">Total Hours</span>
            </div>
            <h3 className="text-2xl font-bold text-white">{totalHours.toFixed(1)}</h3>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <Timer className="w-5 h-5 text-green-400" />
              <span className="text-sm text-slate-400">Regular Hours</span>
            </div>
            <h3 className="text-2xl font-bold text-white">{regularHours.toFixed(1)}</h3>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-orange-400" />
              <span className="text-sm text-slate-400">Overtime</span>
            </div>
            <h3 className="text-2xl font-bold text-white">{overtimeHours.toFixed(1)}</h3>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-slate-400">Billable</span>
            </div>
            <h3 className="text-2xl font-bold text-white">{billableHours.toFixed(1)}</h3>
          </CardContent>
        </Card>
      </div>

      {/* Header and Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex gap-3 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search time entries..."
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
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-32 bg-slate-800/50 border-slate-700 text-white">
              <SelectValue placeholder="Date" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
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

        <div className="flex gap-2">
          {activeTimer ? (
            <Button 
              onClick={handleStopTimer}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Square className="w-4 h-4 mr-2" />
              Stop Timer
            </Button>
          ) : (
            <Button 
              onClick={() => handleStartTimer('current')}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Timer
            </Button>
          )}
          
          <Button onClick={handleAddTimeEntry} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Entry
          </Button>
        </div>
      </div>

      {/* Time Entries List */}
      <div className="time-tracking-container">
        {filteredTimeTracking.length > 0 ? (
          <div className="grid gap-4">
            {filteredTimeTracking.map((entry, index) => (
              <motion.div
                key={entry.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="time-entry-card p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-blue-500/20 rounded-full">
                        <Clock className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          Employee: {entry.employee_id}
                        </h3>
                        <p className="text-slate-400 text-sm">
                          {format(new Date(entry.date), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Timer className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-300">
                          {entry.clock_in_time} - {entry.clock_out_time || 'In Progress'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <BarChart3 className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-300">
                          {entry.total_hours?.toFixed(1) || 0}h total
                        </span>
                      </div>
                      
                      {entry.location && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          <Badge className={getLocationColor(entry.location)}>
                            {entry.location.replace('_', ' ')}
                          </Badge>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge className={getStatusColor(entry.status)}>
                        {(entry.status || 'draft').toUpperCase()}
                      </Badge>
                      
                      {entry.billable && (
                        <Badge className="bg-green-500/20 text-green-300">
                          💰 Billable
                        </Badge>
                      )}
                      
                      {entry.overtime_hours > 0 && (
                        <Badge className="bg-orange-500/20 text-orange-300">
                          ⏰ {entry.overtime_hours.toFixed(1)}h OT
                        </Badge>
                      )}
                      
                      {entry.project_id && (
                        <Badge className="bg-purple-500/20 text-purple-300">
                          📁 Project: {entry.project_id}
                        </Badge>
                      )}
                    </div>

                    {entry.task_description && (
                      <p className="text-slate-300 text-sm line-clamp-2 mb-3">
                        {entry.task_description}
                      </p>
                    )}

                    {/* Time breakdown */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="text-center p-2 bg-slate-800/30 rounded-lg">
                        <div className="text-lg font-bold text-blue-400">
                          {entry.regular_hours?.toFixed(1) || 0}h
                        </div>
                        <div className="text-xs text-slate-400">Regular</div>
                      </div>
                      
                      <div className="text-center p-2 bg-slate-800/30 rounded-lg">
                        <div className="text-lg font-bold text-orange-400">
                          {entry.overtime_hours?.toFixed(1) || 0}h
                        </div>
                        <div className="text-xs text-slate-400">Overtime</div>
                      </div>
                      
                      <div className="text-center p-2 bg-slate-800/30 rounded-lg">
                        <div className="text-lg font-bold text-yellow-400">
                          {entry.break_duration || 0}m
                        </div>
                        <div className="text-xs text-slate-400">Break</div>
                      </div>
                      
                      {entry.billing_rate && (
                        <div className="text-center p-2 bg-slate-800/30 rounded-lg">
                          <div className="text-lg font-bold text-green-400">
                            ${entry.billing_rate}
                          </div>
                          <div className="text-xs text-slate-400">Rate/hr</div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewEntry(entry)}
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditEntry(entry)}
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
            <Clock className="w-16 h-16 text-slate-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-300 mb-2">No time entries found</h3>
            <p className="text-slate-400 mb-6">
              {searchTerm || statusFilter !== "all" || employeeFilter !== "all"
                ? "Try adjusting your filters" 
                : "Start by adding time entries or start the timer"}
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => handleStartTimer('current')} className="bg-green-600 hover:bg-green-700 text-white">
                <Play className="w-4 h-4 mr-2" />
                Start Timer
              </Button>
              <Button onClick={handleAddTimeEntry} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Entry
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}