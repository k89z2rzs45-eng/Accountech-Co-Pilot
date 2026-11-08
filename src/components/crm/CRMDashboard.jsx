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
  Target, 
  DollarSign, 
  Activity,
  Calendar,
  Phone,
  Mail,
  FileText
} from "lucide-react";
import { motion } from "framer-motion";

export default function CRMDashboard({ 
  leads = [], 
  deals = [], 
  clients = [], 
  activities = [], 
  campaigns = [], 
  metrics = {} 
}) {
  
  // Process data for charts
  const leadsBySource = leads.reduce((acc, lead) => {
    acc[lead.lead_source] = (acc[lead.lead_source] || 0) + 1;
    return acc;
  }, {});

  const leadSourceData = Object.entries(leadsBySource).map(([source, count]) => ({
    name: source.replace('_', ' ').toUpperCase(),
    value: count,
    leads: count
  }));

  const dealsByStage = deals.reduce((acc, deal) => {
    acc[deal.stage] = (acc[deal.stage] || 0) + 1;
    return acc;
  }, {});

  const pipelineData = Object.entries(dealsByStage).map(([stage, count]) => ({
    stage: stage.replace('_', ' ').toUpperCase(),
    deals: count,
    value: deals
      .filter(deal => deal.stage === stage)
      .reduce((sum, deal) => sum + (deal.deal_value || 0), 0)
  }));

  const activityTypes = activities.reduce((acc, activity) => {
    acc[activity.activity_type] = (acc[activity.activity_type] || 0) + 1;
    return acc;
  }, {});

  const activityData = Object.entries(activityTypes).map(([type, count]) => ({
    type: type.replace('_', ' ').toUpperCase(),
    count
  }));

  // Recent activity timeline (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentActivities = activities
    .filter(activity => new Date(activity.activity_date) >= thirtyDaysAgo)
    .slice(0, 10);

  const COLORS = ['#00ffff', '#ff00ff', '#00ff00', '#ffff00', '#ff6b9d', '#6366f1'];

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
            0 0 30px rgba(0, 255, 255, 0.05);
        }
        
        .metric-highlight {
          background: linear-gradient(135deg, 
            rgba(0, 255, 255, 0.15) 0%,
            rgba(255, 0, 255, 0.1) 100%
          );
          border: 1px solid rgba(0, 255, 255, 0.3);
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
              <div className="p-3 bg-cyan-500/20 rounded-full">
                <TrendingUp className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Sales Performance</h3>
                <p className="text-sm text-slate-400">This Quarter</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Pipeline Value</span>
              <span className="text-xl font-bold text-cyan-400">
                ${metrics.pipelineValue?.toLocaleString() || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Conversion Rate</span>
              <span className="text-lg font-semibold text-green-400">
                {metrics.conversionRate || 0}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Avg Deal Size</span>
              <span className="text-lg font-semibold text-purple-400">
                ${metrics.avgDealSize?.toLocaleString() || 0}
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
            <div className="p-3 bg-purple-500/20 rounded-full">
              <Activity className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Activity Summary</h3>
              <p className="text-sm text-slate-400">Last 7 Days</p>
            </div>
          </div>
          
          <div className="space-y-3">
            {activityData.slice(0, 4).map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-slate-300 text-sm">{item.type}</span>
                <Badge className="bg-purple-500/20 text-purple-300">
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
            <div className="p-3 bg-green-500/20 rounded-full">
              <Target className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Pipeline Health</h3>
              <p className="text-sm text-slate-400">Deal Distribution</p>
            </div>
          </div>
          
          <div className="space-y-3">
            {pipelineData.slice(0, 4).map((stage, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 text-sm">{stage.stage}</span>
                  <span className="text-sm font-semibold text-green-400">
                    {stage.deals} deals
                  </span>
                </div>
                <Progress 
                  value={(stage.deals / Math.max(...pipelineData.map(s => s.deals), 1)) * 100} 
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Lead Sources Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="dashboard-card p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-6 h-6 text-cyan-400" />
            <h3 className="text-xl font-semibold text-white">Lead Sources</h3>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={leadSourceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {leadSourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(0, 255, 255, 0.3)',
                    borderRadius: '8px',
                    color: '#ffffff'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Sales Pipeline Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="dashboard-card p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="w-6 h-6 text-green-400" />
            <h3 className="text-xl font-semibold text-white">Sales Pipeline</h3>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis 
                  dataKey="stage" 
                  stroke="#94a3b8"
                  fontSize={12}
                />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(0, 255, 255, 0.3)',
                    borderRadius: '8px',
                    color: '#ffffff'
                  }}
                />
                <Bar 
                  dataKey="deals" 
                  fill="url(#pipelineGradient)"
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient id="pipelineGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ffff" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#0891b2" stopOpacity={0.6}/>
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
            <Activity className="w-6 h-6 text-yellow-400" />
            <h3 className="text-xl font-semibold text-white">Recent Activities</h3>
          </div>
          <Badge className="bg-yellow-500/20 text-yellow-300">
            {recentActivities.length} This Month
          </Badge>
        </div>
        
        <div className="space-y-4">
          {recentActivities.length > 0 ? (
            recentActivities.map((activity, index) => (
              <div key={activity.id || index} className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg">
                <div className="p-2 bg-yellow-500/20 rounded-full">
                  {activity.activity_type === 'call' && <Phone className="w-4 h-4 text-yellow-400" />}
                  {activity.activity_type === 'email' && <Mail className="w-4 h-4 text-yellow-400" />}
                  {activity.activity_type === 'meeting' && <Calendar className="w-4 h-4 text-yellow-400" />}
                  {!['call', 'email', 'meeting'].includes(activity.activity_type) && <FileText className="w-4 h-4 text-yellow-400" />}
                </div>
                
                <div className="flex-1">
                  <h4 className="text-white font-medium">
                    {activity.subject || 'Activity'}
                  </h4>
                  <p className="text-slate-400 text-sm">
                    {activity.activity_type?.replace('_', ' ')} • {activity.related_to?.name || 'Unknown'}
                  </p>
                </div>
                
                <div className="text-right">
                  <p className="text-slate-300 text-sm">
                    {new Date(activity.activity_date).toLocaleDateString()}
                  </p>
                  <Badge 
                    className={
                      activity.status === 'completed' 
                        ? "bg-green-500/20 text-green-300" 
                        : "bg-blue-500/20 text-blue-300"
                    }
                  >
                    {activity.status || 'pending'}
                  </Badge>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-slate-500 mx-auto mb-4" />
              <p className="text-slate-400">No recent activities found</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}