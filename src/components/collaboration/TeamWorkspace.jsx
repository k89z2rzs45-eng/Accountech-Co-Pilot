import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  MessageCircle, 
  Bell, 
  Eye, 
  Edit, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  UserPlus,
  Settings,
  Send,
  Paperclip,
  ThumbsUp,
  Reply,
  MoreHorizontal,
  Activity,
  Calendar,
  FileText,
  Zap,
  Receipt,
  BarChart3,
  Video,
  Phone,
  Share2,
  Filter,
  Search,
  TrendingUp,
  Building,
  Globe,
  Shield,
  Star,
  Target
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

export default function TeamWorkspace() {
  const [activeUsers, setActiveUsers] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [teamChat, setTeamChat] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    loadActiveUsers();
    loadRecentActivity();
    loadTeamChat();
    loadNotifications();
    
    const interval = setInterval(() => {
      updateRealTimeData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const loadActiveUsers = () => {
    const mockUsers = [
      {
        id: 1,
        name: "Sarah Johnson",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
        status: "online",
        currentPage: "Financial Dashboard",
        lastSeen: new Date(),
        role: "Finance Director",
        department: "Finance",
        productivity: 94,
        tasksCompleted: 12,
        location: "New York, NY"
      },
      {
        id: 2,
        name: "Michael Chen",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        status: "online",
        currentPage: "Invoice Management",
        lastSeen: new Date(),
        role: "Senior Accountant",
        department: "Accounting",
        productivity: 89,
        tasksCompleted: 8,
        location: "San Francisco, CA"
      },
      {
        id: 3,
        name: "Lisa Rodriguez",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
        status: "away",
        currentPage: "CRM Dashboard",
        lastSeen: new Date(Date.now() - 5 * 60 * 1000),
        role: "Sales Director",
        department: "Sales",
        productivity: 92,
        tasksCompleted: 15,
        location: "Austin, TX"
      },
      {
        id: 4,
        name: "James Wilson",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
        status: "busy",
        currentPage: "Analytics Center",
        lastSeen: new Date(),
        role: "Business Analyst",
        department: "Analytics",
        productivity: 96,
        tasksCompleted: 10,
        location: "Chicago, IL"
      },
      {
        id: 5,
        name: "Emma Thompson",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
        status: "online",
        currentPage: "HR Portal",
        lastSeen: new Date(),
        role: "HR Manager",
        department: "Human Resources",
        productivity: 88,
        tasksCompleted: 7,
        location: "Boston, MA"
      }
    ];
    setActiveUsers(mockUsers);
  };

  const loadRecentActivity = () => {
    const mockActivity = [
      {
        id: 1,
        user: "Sarah Johnson",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
        action: "approved",
        target: "Q4 Budget Proposal",
        timestamp: new Date(Date.now() - 2 * 60 * 1000),
        type: "approval",
        importance: "high",
        department: "Finance",
        amount: "$2.4M"
      },
      {
        id: 2,
        user: "Michael Chen",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        action: "generated",
        target: "Monthly Financial Report",
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        type: "report",
        importance: "high",
        department: "Accounting"
      },
      {
        id: 3,
        user: "Lisa Rodriguez",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
        action: "closed",
        target: "TechCorp Solutions Deal",
        timestamp: new Date(Date.now() - 8 * 60 * 1000),
        type: "deal",
        importance: "critical",
        department: "Sales",
        amount: "$850K"
      },
      {
        id: 4,
        user: "James Wilson",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
        action: "published",
        target: "Revenue Forecast Analysis",
        timestamp: new Date(Date.now() - 12 * 60 * 1000),
        type: "analytics",
        importance: "high",
        department: "Analytics"
      },
      {
        id: 5,
        user: "Emma Thompson",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
        action: "completed",
        target: "Employee Performance Reviews",
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        type: "hr",
        importance: "normal",
        department: "HR"
      }
    ];
    setRecentActivity(mockActivity);
  };

  const loadTeamChat = () => {
    const mockChat = [
      {
        id: 1,
        user: "Sarah Johnson",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
        message: "The Q4 financial projections are ahead of schedule. Revenue is up 23% YoY! 📈",
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        reactions: [{ emoji: "🎉", count: 4, users: ["Michael Chen", "Lisa Rodriguez", "James Wilson", "Emma Thompson"] }],
        type: "announcement"
      },
      {
        id: 2,
        user: "Michael Chen",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        message: "Bank reconciliation complete for all accounts. Everything balanced perfectly ✅",
        timestamp: new Date(Date.now() - 8 * 60 * 1000),
        reactions: [{ emoji: "👍", count: 3, users: ["Sarah Johnson", "Lisa Rodriguez", "James Wilson"] }],
        type: "update"
      },
      {
        id: 3,
        user: "Lisa Rodriguez",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
        message: "Just secured the TechCorp deal! $850K ARR locked in. Team celebration tonight! 🥳",
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        reactions: [{ emoji: "🔥", count: 5, users: ["Sarah Johnson", "Michael Chen", "James Wilson", "Emma Thompson", "Alex Kim"] }],
        type: "achievement"
      },
      {
        id: 4,
        user: "James Wilson",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
        message: "Analytics dashboard shows customer satisfaction at 96%. New retention model is working!",
        timestamp: new Date(Date.now() - 2 * 60 * 1000),
        reactions: [{ emoji: "📊", count: 2, users: ["Sarah Johnson", "Michael Chen"] }],
        type: "insight"
      }
    ];
    setTeamChat(mockChat);
  };

  const loadNotifications = () => {
    const mockNotifications = [
      {
        id: 1,
        type: "mention",
        message: "Sarah Johnson mentioned you in Budget Review #BUD-2024-Q4",
        timestamp: new Date(Date.now() - 3 * 60 * 1000),
        read: false,
        priority: "high",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
        department: "Finance"
      },
      {
        id: 2,
        type: "approval",
        message: "Expense report #EXP-2024-001 requires your approval",
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        read: false,
        priority: "medium",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        department: "Accounting",
        amount: "$2,847"
      },
      {
        id: 3,
        type: "system",
        message: "Weekly performance report is ready for review",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        read: true,
        priority: "low",
        department: "System"
      },
      {
        id: 4,
        type: "deal",
        message: "New high-value opportunity in your pipeline",
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        read: false,
        priority: "high",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
        department: "Sales",
        amount: "$1.2M"
      }
    ];
    setNotifications(mockNotifications);
  };

  const updateRealTimeData = () => {
    const randomUser = activeUsers[Math.floor(Math.random() * activeUsers.length)];
    if (randomUser) {
      const actions = ["reviewed", "updated", "created", "approved", "completed"];
      const targets = ["Financial Report", "Client Proposal", "Budget Analysis", "Team Meeting", "Project Milestone"];
      
      const newActivity = {
        id: Date.now(),
        user: randomUser.name,
        avatar: randomUser.avatar,
        action: actions[Math.floor(Math.random() * actions.length)],
        target: targets[Math.floor(Math.random() * targets.length)],
        timestamp: new Date(),
        type: ["report", "client", "budget", "meeting", "project"][Math.floor(Math.random() * 5)],
        importance: ["normal", "high"][Math.floor(Math.random() * 2)],
        department: randomUser.department
      };
      
      setRecentActivity(prev => [newActivity, ...prev.slice(0, 9)]);
    }
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        user: "You",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
        message: newMessage,
        timestamp: new Date(),
        reactions: [],
        type: "message"
      };
      setTeamChat(prev => [...prev, message]);
      setNewMessage("");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-emerald-500 border-emerald-400';
      case 'away': return 'bg-amber-500 border-amber-400';
      case 'busy': return 'bg-red-500 border-red-400';
      default: return 'bg-gray-500 border-gray-400';
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'approval': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'report': return <BarChart3 className="w-4 h-4 text-blue-400" />;
      case 'deal': return <Target className="w-4 h-4 text-purple-400" />;
      case 'analytics': return <TrendingUp className="w-4 h-4 text-indigo-400" />;
      case 'hr': return <Users className="w-4 h-4 text-pink-400" />;
      default: return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  const getDepartmentColor = (department) => {
    const colors = {
      'Finance': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'Accounting': 'bg-blue-100 text-blue-800 border-blue-200',
      'Sales': 'bg-purple-100 text-purple-800 border-purple-200',
      'Analytics': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'HR': 'bg-pink-100 text-pink-800 border-pink-200',
      'Human Resources': 'bg-pink-100 text-pink-800 border-pink-200'
    };
    return colors[department] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-green-100 text-green-800 border-green-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Professional Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Team Workspace</h1>
                <p className="text-slate-600 mt-1">Real-time collaboration and business intelligence</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 px-4 py-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
                {activeUsers.filter(u => u.status === 'online').length} Active Users
              </Badge>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
                <Video className="w-4 h-4 mr-2" />
                Start Meeting
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Professional Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white rounded-xl shadow-sm border border-slate-200 p-2">
            <TabsTrigger 
              value="overview" 
              className="px-6 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="team" 
              className="px-6 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              <Users className="w-4 h-4 mr-2" />
              Team
            </TabsTrigger>
            <TabsTrigger 
              value="activity" 
              className="px-6 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              <Activity className="w-4 h-4 mr-2" />
              Activity
            </TabsTrigger>
            <TabsTrigger 
              value="communication" 
              className="px-6 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Communication
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Team Performance Metrics */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="bg-white shadow-sm border-slate-200 hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-slate-900">
                      <TrendingUp className="w-5 h-5 text-emerald-500 mr-2" />
                      Team Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl">
                        <div className="text-2xl font-bold text-emerald-600">94%</div>
                        <div className="text-sm text-emerald-700">Avg Productivity</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                        <div className="text-2xl font-bold text-blue-600">52</div>
                        <div className="text-sm text-blue-700">Tasks Completed</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {activeUsers.slice(0, 3).map((user) => (
                        <div key={user.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={user.avatar} />
                              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs">
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium text-slate-700">{user.name.split(' ')[0]}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="text-sm font-semibold text-slate-900">{user.productivity}%</div>
                            <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-300"
                                style={{ width: `${user.productivity}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-white shadow-sm border-slate-200 hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-slate-900">
                      <Activity className="w-5 h-5 text-blue-500 mr-2" />
                      Recent Activity
                      <Badge className="ml-auto bg-blue-100 text-blue-800">Live</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 max-h-80 overflow-y-auto">
                      <AnimatePresence>
                        {recentActivity.slice(0, 5).map((activity) => (
                          <motion.div
                            key={activity.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="flex items-start space-x-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                          >
                            <Avatar className="w-8 h-8 flex-shrink-0">
                              <AvatarImage src={activity.avatar} />
                              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs">
                                {activity.user.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                {getActivityIcon(activity.type)}
                                <Badge className={`text-xs ${getDepartmentColor(activity.department)}`}>
                                  {activity.department}
                                </Badge>
                                {activity.importance === 'high' && (
                                  <Badge className="bg-orange-100 text-orange-800 text-xs">High</Badge>
                                )}
                              </div>
                              <p className="text-sm text-slate-900">
                                <span className="font-semibold">{activity.user.split(' ')[0]}</span>
                                <span className="text-slate-600"> {activity.action} </span>
                                <span className="font-medium">{activity.target}</span>
                              </p>
                              <div className="flex items-center justify-between mt-1">
                                <p className="text-xs text-slate-500">
                                  {format(activity.timestamp, 'HH:mm')} • {format(activity.timestamp, 'MMM dd')}
                                </p>
                                {activity.amount && (
                                  <Badge className="bg-emerald-100 text-emerald-800 text-xs font-semibold">
                                    {activity.amount}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Priority Notifications */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="bg-white shadow-sm border-slate-200 hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-slate-900">
                      <Bell className="w-5 h-5 text-amber-500 mr-2" />
                      Priority Notifications
                      <Badge className="ml-auto bg-red-100 text-red-800">
                        {notifications.filter(n => !n.read).length} New
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 rounded-xl border transition-all hover:shadow-sm ${
                            !notification.read 
                              ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200' 
                              : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            {notification.avatar && (
                              <Avatar className="w-8 h-8 flex-shrink-0">
                                <AvatarImage src={notification.avatar} />
                                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs">
                                  {notification.message.split(' ')[0][0]}
                                </AvatarFallback>
                              </Avatar>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-2">
                                <Badge className={`text-xs ${getPriorityColor(notification.priority)}`}>
                                  {notification.priority}
                                </Badge>
                                {notification.department !== 'System' && (
                                  <Badge className={`text-xs ${getDepartmentColor(notification.department)}`}>
                                    {notification.department}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm font-medium text-slate-900 mb-1">
                                {notification.message}
                              </p>
                              <div className="flex items-center justify-between">
                                <p className="text-xs text-slate-500">
                                  {format(notification.timestamp, 'HH:mm')} • {format(notification.timestamp, 'MMM dd')}
                                </p>
                                {notification.amount && (
                                  <Badge className="bg-emerald-100 text-emerald-800 text-xs font-semibold">
                                    {notification.amount}
                                  </Badge>
                                )}
                              </div>
                              {!notification.read && (
                                <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {activeUsers.map((user) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="bg-white shadow-sm border-slate-200 hover:shadow-lg transition-all cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="relative">
                          <Avatar className="w-16 h-16">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${getStatusColor(user.status)}`}></div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 mb-1">{user.name}</h3>
                          <p className="text-sm text-slate-600 mb-2">{user.role}</p>
                          <Badge className={`text-xs mb-3 ${getDepartmentColor(user.department)}`}>
                            {user.department}
                          </Badge>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-600">Productivity</span>
                              <span className="font-semibold text-slate-900">{user.productivity}%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-300"
                                style={{ width: `${user.productivity}%` }}
                              ></div>
                            </div>
                            <div className="flex items-center justify-between text-sm pt-2">
                              <span className="text-slate-600">Tasks: {user.tasksCompleted}</span>
                              <span className="text-slate-600">📍 {user.location}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-slate-100">
                        <Button size="sm" variant="ghost" className="flex-1">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Message
                        </Button>
                        <Button size="sm" variant="ghost" className="flex-1">
                          <Phone className="w-4 h-4 mr-2" />
                          Call
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card className="bg-white shadow-sm border-slate-200">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-slate-900">
                    <Activity className="w-5 h-5 text-blue-500 mr-2" />
                    Team Activity Feed
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  <AnimatePresence>
                    {recentActivity.map((activity) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex items-start space-x-4 p-4 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100"
                      >
                        <Avatar className="w-10 h-10 flex-shrink-0">
                          <AvatarImage src={activity.avatar} />
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm">
                            {activity.user.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            {getActivityIcon(activity.type)}
                            <Badge className={`text-xs ${getDepartmentColor(activity.department)}`}>
                              {activity.department}
                            </Badge>
                            <Badge className={`text-xs ${getPriorityColor(activity.importance)}`}>
                              {activity.importance}
                            </Badge>
                            {activity.amount && (
                              <Badge className="bg-emerald-100 text-emerald-800 text-xs font-semibold">
                                {activity.amount}
                              </Badge>
                            )}
                          </div>
                          <p className="text-slate-900 mb-2">
                            <span className="font-semibold">{activity.user}</span>
                            <span className="text-slate-600"> {activity.action} </span>
                            <span className="font-medium">{activity.target}</span>
                          </p>
                          <p className="text-sm text-slate-500">
                            {format(activity.timestamp, 'EEEE, MMMM do, yyyy')} at {format(activity.timestamp, 'HH:mm')}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Communication Tab */}
          <TabsContent value="communication" className="space-y-6">
            <Card className="bg-white shadow-sm border-slate-200">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-slate-900">
                  <MessageCircle className="w-5 h-5 text-purple-500 mr-2" />
                  Team Communication
                  <Badge className="ml-auto bg-purple-100 text-purple-800">
                    {teamChat.length} Messages
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-80 overflow-y-auto mb-4">
                  {teamChat.map((message) => (
                    <div key={message.id} className="flex items-start space-x-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                      <Avatar className="w-10 h-10 flex-shrink-0">
                        <AvatarImage src={message.avatar} />
                        <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-600 text-white text-sm">
                          {message.user.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="font-semibold text-slate-900">{message.user}</span>
                          <Badge className={`text-xs ${
                            message.type === 'announcement' ? 'bg-blue-100 text-blue-800' :
                            message.type === 'achievement' ? 'bg-emerald-100 text-emerald-800' :
                            message.type === 'insight' ? 'bg-indigo-100 text-indigo-800' :
                            'bg-slate-100 text-slate-800'
                          }`}>
                            {message.type}
                          </Badge>
                          <span className="text-xs text-slate-500">
                            {format(message.timestamp, 'HH:mm')} • {format(message.timestamp, 'MMM dd')}
                          </span>
                        </div>
                        <p className="text-slate-800 mb-2">{message.message}</p>
                        {message.reactions.length > 0 && (
                          <div className="flex items-center space-x-2">
                            {message.reactions.map((reaction, index) => (
                              <button
                                key={index}
                                className="flex items-center space-x-1 px-2 py-1 bg-white rounded-full border border-slate-200 hover:bg-slate-50 transition-colors text-xs"
                              >
                                <span>{reaction.emoji}</span>
                                <span className="font-medium text-slate-700">{reaction.count}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Message Input */}
                <div className="flex items-center space-x-3 pt-4 border-t border-slate-200">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs">
                      YU
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 flex items-center space-x-2">
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      className="border-slate-300 focus:border-purple-500 focus:ring-purple-500"
                    />
                    <Button
                      onClick={sendMessage}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}