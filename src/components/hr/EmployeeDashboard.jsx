import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Award, 
  Calendar, 
  Clock,
  AlertTriangle,
  CheckCircle,
  Brain,
  Target
} from "lucide-react";
import { motion } from "framer-motion";

export default function EmployeeDashboard({ 
  employees = [], 
  timeTracking = [], 
  leaveRequests = [], 
  performanceReviews = [], 
  metrics = {} 
}) {
  
  // Process data for charts
  const departmentDistribution = employees.reduce((acc, emp) => {
    const dept = emp.employment_details?.department || 'unknown';
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {});

  const departmentData = Object.entries(departmentDistribution).map(([dept, count]) => ({
    name: dept.replace('_', ' ').toUpperCase(),
    value: count,
    employees: count
  }));

  const performanceDistribution = performanceReviews.reduce((acc, review) => {
    const rating = Math.floor(review.overall_rating || 0);
    const label = rating === 5 ? 'Outstanding' : 
                  rating === 4 ? 'Exceeds' : 
                  rating === 3 ? 'Meets' : 
                  rating === 2 ? 'Below' : 'Needs Improvement';
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {});

  const performanceData = Object.entries(performanceDistribution).map(([rating, count]) => ({
    rating,
    count
  }));

  // Leave trends (last 6 months)
  const leaveTypes = leaveRequests.reduce((acc, leave) => {
    acc[leave.leave_type] = (acc[leave.leave_type] || 0) + 1;
    return acc;
  }, {});

  const leaveData = Object.entries(leaveTypes).map(([type, count]) => ({
    type: type.replace('_', ' ').toUpperCase(),
    count
  }));

  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'];

  // Recent activities (simplified)
  const recentActivities = [
    ...leaveRequests.slice(0, 3).map(leave => ({
      type: 'leave',
      title: `${leave.leave_type} request`,
      employee: leave.employee_id,
      date: leave.created_date,
      status: leave.status
    })),
    ...performanceReviews.slice(0, 2).map(review => ({
      type: 'review',
      title: 'Performance review',
      employee: review.employee_id,
      date: review.created_date,
      status: review.status
    }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  return (
    <div className="space-y-8">
      <style>{`
        .dashboard-card {
          background: linear-gradient(145deg, 
            rgba(15, 23, 42, 0.95) 0%,
            rgba(30, 41, 59, 0.9) 100%
          );
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          box-shadow: 
            0 10px 25px rgba(0, 0, 0, 0.3),
            0 0 30px rgba(16, 185, 129, 0.05);
        }
        
        .metric-highlight {
          background: linear-gradient(135deg, 
            rgba(16, 185, 129, 0.15) 0%,
            rgba(59, 130, 246, 0.1) 100%
          );
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: 12px;
        }
      `}</style>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="dashboard-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-500/20 rounded-full">
                <Users className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Workforce Overview</h3>
                <p className="text-sm text-slate-400">Current Status</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Active Employees</span>
              <span className="text-xl font-bold text-emerald-400">
                {metrics.activeEmployees || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">New Hires (30d)</span>
              <span className="text-lg font-semibold text-blue-400">
                {metrics.newHires || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Turnover Rate</span>
              <span className="text-lg font-semibold text-yellow-400">
                {metrics.turnoverRate || 0}%
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="dashboard-card p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-500/20 rounded-full">
              <Calendar className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Leave Summary</h3>
              <p className="text-sm text-slate-400">Current Period</p>
            </div>
          </div>
          
          <div className="space-y-3">
            {leaveData.slice(0, 4).map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-slate-300 text-sm">{item.type}</span>
                <Badge className="bg-blue-500/20 text-blue-300">
                  {item.count}
                </Badge>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="dashboard-card p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-500/20 rounded-full">
              <Award className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Performance Health</h3>
              <p className="text-sm text-slate-400">Review Status</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-300 text-sm">Avg Performance</span>
                <span className="text-sm font-semibold text-purple-400">
                  {metrics.averagePerformance || 0}/5
                </span>
              </div>
              <Progress 
                value={(metrics.averagePerformance || 0) * 20} 
                className="h-2"
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300 text-sm">Pending Reviews</span>
              <Badge className="bg-purple-500/20 text-purple-300">
                {metrics.upcomingReviews || 0}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300 text-sm">Employee Satisfaction</span>
              <span className="text-sm font-semibold text-green-400">
                {metrics.employeeSatisfaction || 0}/5
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Department Distribution Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="dashboard-card p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-6 h-6 text-emerald-400" />
            <h3 className="text-xl font-semibold text-white">Department Distribution</h3>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '8px',
                    color: '#ffffff'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Performance Distribution Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="dashboard-card p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <Award className="w-6 h-6 text-purple-400" />
            <h3 className="text-xl font-semibold text-white">Performance Distribution</h3>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis 
                  dataKey="rating" 
                  stroke="#94a3b8"
                  fontSize={12}
                />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '8px',
                    color: '#ffffff'
                  }}
                />
                <Bar 
                  dataKey="count" 
                  fill="url(#performanceGradient)"
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient id="performanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.6}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Recent Activities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="dashboard-card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-blue-400" />
            <h3 className="text-xl font-semibold text-white">Recent HR Activities</h3>
          </div>
          <Badge className="bg-blue-500/20 text-blue-300">
            {recentActivities.length} Recent
          </Badge>
        </div>
        
        <div className="space-y-4">
          {recentActivities.length > 0 ? (
            recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg">
                <div className="p-2 bg-blue-500/20 rounded-full">
                  {activity.type === 'leave' && <Calendar className="w-4 h-4 text-blue-400" />}
                  {activity.type === 'review' && <Award className="w-4 h-4 text-purple-400" />}
                  {activity.type === 'time' && <Clock className="w-4 h-4 text-green-400" />}
                </div>
                
                <div className="flex-1">
                  <h4 className="text-white font-medium">
                    {activity.title}
                  </h4>
                  <p className="text-slate-400 text-sm">
                    Employee ID: {activity.employee}
                  </p>
                </div>
                
                <div className="text-right">
                  <p className="text-slate-300 text-sm">
                    {new Date(activity.date).toLocaleDateString()}
                  </p>
                  <Badge 
                    className={
                      activity.status === 'approved' || activity.status === 'finalized'
                        ? "bg-green-500/20 text-green-300" 
                        : activity.status === 'rejected'
                        ? "bg-red-500/20 text-red-300"
                        : "bg-yellow-500/20 text-yellow-300"
                    }
                  >
                    {activity.status || 'pending'}
                  </Badge>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-slate-500 mx-auto mb-4" />
              <p className="text-slate-400">No recent HR activities found</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}