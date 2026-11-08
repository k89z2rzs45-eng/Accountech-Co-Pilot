import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  UserPlus, 
  Calendar, 
  Clock, 
  Award,
  Target,
  Activity,
  FileText,
  Settings,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Brain,
  DollarSign,
  BarChart3
} from "lucide-react";
import { motion } from "framer-motion";

// Import HR entities
import { Employee } from "@/api/entities";
import { TimeTracking } from "@/api/entities";
import { LeaveRequest } from "@/api/entities";
import { PerformanceReview } from "@/api/entities";

// Import HR components
import EmployeesList from "../components/hr/EmployeesList";
import EmployeeDashboard from "../components/hr/EmployeeDashboard";
import TimeTrackingPanel from "../components/hr/TimeTrackingPanel";
import LeaveManagement from "../components/hr/LeaveManagement";
import PerformanceManagement from "../components/hr/PerformanceManagement";
import PayrollOverview from "../components/hr/PayrollOverview";
import RecruitmentPanel from "../components/hr/RecruitmentPanel";

export default function HumanResources() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Data states
  const [employees, setEmployees] = useState([]);
  const [timeTrackingData, setTimeTrackingData] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [performanceReviews, setPerformanceReviews] = useState([]);

  // Metrics states
  const [hrMetrics, setHrMetrics] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    newHires: 0,
    pendingLeaves: 0,
    upcomingReviews: 0,
    averagePerformance: 0,
    turnoverRate: 0,
    employeeSatisfaction: 0
  });

  useEffect(() => {
    loadHRData();
  }, []);

  useEffect(() => {
    if (searchParams.get('tab') !== activeTab) {
      setSearchParams({ tab: activeTab });
    }
  }, [activeTab]);

  const loadHRData = async () => {
    setIsLoading(true);
    try {
      // Load all HR data
      const [
        employeesData,
        timeData,
        leavesData,
        reviewsData
      ] = await Promise.all([
        Employee.list('-created_date', 200).catch(() => []),
        TimeTracking.list('-date', 100).catch(() => []),
        LeaveRequest.list('-created_date', 50).catch(() => []),
        PerformanceReview.list('-created_date', 50).catch(() => [])
      ]);

      setEmployees(employeesData);
      setTimeTrackingData(timeData);
      setLeaveRequests(leavesData);
      setPerformanceReviews(reviewsData);

      // Calculate HR metrics
      calculateHRMetrics(employeesData, leavesData, reviewsData);

    } catch (error) {
      console.error('Error loading HR data:', error);
    }
    setIsLoading(false);
  };

  const calculateHRMetrics = (employeesData, leavesData, reviewsData) => {
    const totalEmployees = employeesData.length;
    const activeEmployees = employeesData.filter(emp => 
      emp.employment_details?.employment_status === 'active'
    ).length;

    // New hires in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newHires = employeesData.filter(emp => 
      emp.employment_details?.hire_date && 
      new Date(emp.employment_details.hire_date) >= thirtyDaysAgo
    ).length;

    const pendingLeaves = leavesData.filter(leave => leave.status === 'pending').length;
    
    const upcomingReviews = reviewsData.filter(review => {
      if (review.status === 'draft' || review.status === 'employee_self_assessment') {
        return true;
      }
      return false;
    }).length;

    const averagePerformance = reviewsData.length > 0 ? 
      reviewsData.reduce((sum, review) => sum + (review.overall_rating || 0), 0) / reviewsData.length : 0;

    // Calculate turnover rate (simplified)
    const terminatedEmployees = employeesData.filter(emp => 
      emp.employment_details?.employment_status === 'terminated'
    ).length;
    const turnoverRate = totalEmployees > 0 ? (terminatedEmployees / totalEmployees) * 100 : 0;

    // Employee satisfaction (mock data for now)
    const employeeSatisfaction = 4.2;

    setHrMetrics({
      totalEmployees,
      activeEmployees,
      newHires,
      pendingLeaves,
      upcomingReviews,
      averagePerformance: Math.round(averagePerformance * 10) / 10,
      turnoverRate: Math.round(turnoverRate * 10) / 10,
      employeeSatisfaction
    });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadHRData();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-400 mx-auto mb-4"></div>
          <p className="text-emerald-200 text-lg">Loading HR System...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-6">
      <style>{`
        /* ENTERPRISE HR SYSTEM STYLES */
        .hr-container {
          background: linear-gradient(145deg, 
            #0f172a 0%,
            #1e293b 25%,
            #334155 50%,
            #1e293b 75%,
            #0f172a 100%
          );
          background-size: 400% 400%;
          animation: hrGlow 25s ease-in-out infinite;
        }
        
        @keyframes hrGlow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .hr-metric-card {
          background: linear-gradient(145deg, 
            rgba(15, 23, 42, 0.95) 0%,
            rgba(30, 41, 59, 0.9) 100%
          );
          backdrop-filter: blur(20px);
          border: 2px solid transparent;
          border-image: linear-gradient(45deg, #10b981, #3b82f6, #8b5cf6) 1;
          border-radius: 16px;
          box-shadow: 
            0 15px 35px rgba(0, 0, 0, 0.3),
            0 0 40px rgba(16, 185, 129, 0.1);
          transition: all 0.3s ease;
        }
        
        .hr-metric-card:hover {
          transform: translateY(-5px) scale(1.02);
          border-image: linear-gradient(45deg, #3b82f6, #8b5cf6, #f59e0b) 1;
          box-shadow: 
            0 20px 45px rgba(0, 0, 0, 0.4),
            0 0 60px rgba(59, 130, 246, 0.2);
        }
        
        .hr-tab-button {
          background: linear-gradient(135deg, 
            rgba(15, 23, 42, 0.8) 0%,
            rgba(30, 41, 59, 0.7) 100%
          );
          border: 2px solid rgba(16, 185, 129, 0.3);
          border-radius: 12px;
          color: #94a3b8;
          transition: all 0.3s ease;
        }
        
        .hr-tab-button.active {
          background: linear-gradient(135deg, 
            rgba(16, 185, 129, 0.2) 0%,
            rgba(59, 130, 246, 0.15) 100%
          );
          border: 2px solid rgba(16, 185, 129, 0.6);
          color: #10b981;
          box-shadow: 0 0 25px rgba(16, 185, 129, 0.3);
        }
        
        .hr-section-card {
          background: linear-gradient(145deg, 
            rgba(15, 23, 42, 0.98) 0%,
            rgba(30, 41, 59, 0.95) 100%
          );
          backdrop-filter: blur(25px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          box-shadow: 
            0 15px 35px rgba(0, 0, 0, 0.3),
            0 0 60px rgba(16, 185, 129, 0.1);
        }
      `}</style>

      <div className="hr-container p-8 rounded-3xl">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              👥 Human Resources Management
            </h1>
            <p className="text-slate-400 text-lg">
              Complete employee lifecycle, performance tracking, and workforce analytics
            </p>
            <div className="flex items-center gap-4 mt-3">
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                <Users className="w-3 h-3 mr-1" />
                {hrMetrics.activeEmployees} Active Employees
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                <UserPlus className="w-3 h-3 mr-1" />
                {hrMetrics.newHires} New Hires This Month
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                <Award className="w-3 h-3 mr-1" />
                {hrMetrics.averagePerformance}/5 Avg Performance
              </Badge>
            </div>
          </div>

          <div className="flex gap-3 items-center">
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              disabled={refreshing}
              className="border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20"
            >
              <Activity className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </motion.div>

        {/* HR Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="hr-metric-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-500/20 rounded-full">
                <Users className="w-6 h-6 text-emerald-400" />
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-300">
                {hrMetrics.activeEmployees} Active
              </Badge>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {hrMetrics.totalEmployees}
            </h3>
            <p className="text-slate-400 text-sm">Total Employees</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="hr-metric-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-full">
                <Calendar className="w-6 h-6 text-blue-400" />
              </div>
              <Badge className="bg-blue-500/20 text-blue-300">
                {hrMetrics.pendingLeaves} Pending
              </Badge>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {hrMetrics.upcomingReviews}
            </h3>
            <p className="text-slate-400 text-sm">Upcoming Reviews</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="hr-metric-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/20 rounded-full">
                <Award className="w-6 h-6 text-purple-400" />
              </div>
              <Badge className="bg-purple-500/20 text-purple-300">
                Performance
              </Badge>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {hrMetrics.averagePerformance}/5
            </h3>
            <p className="text-slate-400 text-sm">Average Rating</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="hr-metric-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/20 rounded-full">
                <TrendingUp className="w-6 h-6 text-yellow-400" />
              </div>
              <Badge className="bg-yellow-500/20 text-yellow-300">
                {hrMetrics.turnoverRate}% Turnover
              </Badge>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {hrMetrics.employeeSatisfaction}/5
            </h3>
            <p className="text-slate-400 text-sm">Employee Satisfaction</p>
          </motion.div>
        </div>

        {/* HR Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-8">
          <TabsList className="grid w-full grid-cols-7 bg-transparent gap-2">
            <TabsTrigger 
              value="dashboard" 
              className={`hr-tab-button ${activeTab === 'dashboard' ? 'active' : ''}`}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            
            <TabsTrigger 
              value="employees" 
              className={`hr-tab-button ${activeTab === 'employees' ? 'active' : ''}`}
            >
              <Users className="w-4 h-4 mr-2" />
              Employees
            </TabsTrigger>
            
            <TabsTrigger 
              value="time-tracking" 
              className={`hr-tab-button ${activeTab === 'time-tracking' ? 'active' : ''}`}
            >
              <Clock className="w-4 h-4 mr-2" />
              Time
            </TabsTrigger>
            
            <TabsTrigger 
              value="leave" 
              className={`hr-tab-button ${activeTab === 'leave' ? 'active' : ''}`}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Leave
            </TabsTrigger>
            
            <TabsTrigger 
              value="performance" 
              className={`hr-tab-button ${activeTab === 'performance' ? 'active' : ''}`}
            >
              <Award className="w-4 h-4 mr-2" />
              Performance
            </TabsTrigger>
            
            <TabsTrigger 
              value="payroll" 
              className={`hr-tab-button ${activeTab === 'payroll' ? 'active' : ''}`}
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Payroll
            </TabsTrigger>

            <TabsTrigger 
              value="recruitment" 
              className={`hr-tab-button ${activeTab === 'recruitment' ? 'active' : ''}`}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Recruiting
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            <Card className="hr-section-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-3">
                  <BarChart3 className="w-6 h-6 text-emerald-400" />
                  HR Dashboard & Workforce Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EmployeeDashboard 
                  employees={employees}
                  timeTracking={timeTrackingData}
                  leaveRequests={leaveRequests}
                  performanceReviews={performanceReviews}
                  metrics={hrMetrics}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Employees Tab */}
          <TabsContent value="employees">
            <Card className="hr-section-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-3">
                  <Users className="w-6 h-6 text-emerald-400" />
                  Employee Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EmployeesList 
                  employees={employees}
                  onRefresh={loadHRData}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Time Tracking Tab */}
          <TabsContent value="time-tracking">
            <Card className="hr-section-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-3">
                  <Clock className="w-6 h-6 text-blue-400" />
                  Time Tracking & Attendance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TimeTrackingPanel 
                  timeTracking={timeTrackingData}
                  employees={employees}
                  onRefresh={loadHRData}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leave Management Tab */}
          <TabsContent value="leave">
            <Card className="hr-section-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-purple-400" />
                  Leave Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LeaveManagement 
                  leaveRequests={leaveRequests}
                  employees={employees}
                  onRefresh={loadHRData}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance">
            <Card className="hr-section-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-3">
                  <Award className="w-6 h-6 text-yellow-400" />
                  Performance Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PerformanceManagement 
                  performanceReviews={performanceReviews}
                  employees={employees}
                  onRefresh={loadHRData}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payroll Tab */}
          <TabsContent value="payroll">
            <Card className="hr-section-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-3">
                  <DollarSign className="w-6 h-6 text-green-400" />
                  Payroll Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PayrollOverview 
                  employees={employees}
                  onRefresh={loadHRData}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recruitment Tab */}
          <TabsContent value="recruitment">
            <Card className="hr-section-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-3">
                  <UserPlus className="w-6 h-6 text-pink-400" />
                  Recruitment & Onboarding
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RecruitmentPanel 
                  employees={employees}
                  onRefresh={loadHRData}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}