import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  BarChart3,
  PieChart,
  TrendingUp,
  Calendar,
  Filter,
  Download,
  Share2,
  Settings,
  Eye,
  Edit3,
  Plus,
  Layers,
  Target,
  Zap,
  Brain,
  Star,
  Globe,
  Building,
  Users,
  DollarSign,
  Activity,
  Clock,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Maximize2,
  RefreshCw,
  FileText,
  Move,
  Trash2,
  Copy,
  Layout,
  Grid,
  LineChart,
  Save,
  Sparkles,
  Cpu,
  Database,
  Monitor
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from "recharts";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

// Import entities and functions
import { Transaction } from "@/api/entities";
import { Invoice } from "@/api/entities";
import { Client } from "@/api/entities";
import { User } from "@/api/entities";
import { analyticsEngine } from "@/api/functions";
import { biReportGenerator } from "@/api/functions";

// Widget Types Configuration
const WIDGET_TYPES = {
  kpi: {
    name: "KPI Card",
    icon: Target,
    defaultSize: { width: 1, height: 1 },
    description: "Key Performance Indicator display"
  },
  chart_bar: {
    name: "Bar Chart",
    icon: BarChart3,
    defaultSize: { width: 2, height: 2 },
    description: "Vertical bar chart visualization"
  },
  chart_line: {
    name: "Line Chart", 
    icon: LineChart,
    defaultSize: { width: 2, height: 2 },
    description: "Time series line chart"
  },
  chart_pie: {
    name: "Pie Chart",
    icon: PieChart,
    defaultSize: { width: 2, height: 2 },
    description: "Circular pie chart"
  },
  chart_area: {
    name: "Area Chart",
    icon: Activity,
    defaultSize: { width: 2, height: 2 },
    description: "Filled area chart"
  },
  table: {
    name: "Data Table",
    icon: Grid,
    defaultSize: { width: 3, height: 2 },
    description: "Tabular data display"
  },
  metric: {
    name: "Metric Display",
    icon: Monitor,
    defaultSize: { width: 1, height: 1 },
    description: "Large number display"
  }
};

const COLORS = ['#00ffff', '#ff00ff', '#00ff00', '#ffff00', '#ff6600', '#6600ff', '#ff0066', '#66ff00'];

export default function BusinessIntelligence() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [dashboards, setDashboards] = useState([]);
  const [selectedDashboard, setSelectedDashboard] = useState(null);
  const [widgets, setWidgets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showWidgetLibrary, setShowWidgetLibrary] = useState(false);
  const [showCreateDashboard, setShowCreateDashboard] = useState(false);
  const [newDashboardName, setNewDashboardName] = useState("");
  const [analyticsData, setAnalyticsData] = useState({});
  const [dateRange, setDateRange] = useState("last_12_months");
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [executiveSummary, setExecutiveSummary] = useState(null);

  useEffect(() => {
    loadDashboards();
    loadAnalyticsData();
  }, []);

  const loadDashboards = async () => {
    setIsLoading(true);
    try {
      // Sample dashboards with drag-and-drop widgets
      const sampleDashboards = [
        {
          id: "exec-overview",
          name: "Executive Overview",
          description: "C-Level strategic metrics and KPIs",
          type: "executive",
          category: "Strategic",
          isDefault: true,
          createdAt: new Date(),
          widgets: [
            {
              id: "widget-1",
              type: "kpi",
              title: "Total Revenue",
              position: { x: 0, y: 0 },
              size: { width: 1, height: 1 },
              config: { metric: "total_revenue", format: "currency" },
              data: { value: 2450000, change: 12.5, trend: "up" }
            },
            {
              id: "widget-2", 
              type: "kpi",
              title: "Net Profit",
              position: { x: 1, y: 0 },
              size: { width: 1, height: 1 },
              config: { metric: "net_profit", format: "currency" },
              data: { value: 450000, change: 8.3, trend: "up" }
            },
            {
              id: "widget-3",
              type: "kpi", 
              title: "Profit Margin",
              position: { x: 2, y: 0 },
              size: { width: 1, height: 1 },
              config: { metric: "profit_margin", format: "percentage" },
              data: { value: 18.4, change: -1.2, trend: "down" }
            },
            {
              id: "widget-4",
              type: "chart_line",
              title: "Revenue Trend",
              position: { x: 0, y: 1 },
              size: { width: 2, height: 2 },
              config: { dataSource: "revenue_monthly" },
              data: generateRevenueData()
            },
            {
              id: "widget-5",
              type: "chart_pie",
              title: "Revenue by Category",
              position: { x: 2, y: 1 },
              size: { width: 1, height: 2 },
              config: { dataSource: "revenue_categories" },
              data: generateCategoryData()
            }
          ]
        },
        {
          id: "financial-deep",
          name: "Financial Deep Dive", 
          description: "Comprehensive financial analysis and metrics",
          type: "financial",
          category: "Financial",
          isDefault: false,
          createdAt: new Date(),
          widgets: []
        },
        {
          id: "sales-performance",
          name: "Sales Performance",
          description: "Sales metrics, pipeline, and conversion analytics", 
          type: "sales",
          category: "Sales",
          isDefault: false,
          createdAt: new Date(),
          widgets: []
        }
      ];

      setDashboards(sampleDashboards);
      setSelectedDashboard(sampleDashboards[0]);
      setWidgets(sampleDashboards[0].widgets);
      
    } catch (error) {
      console.error('Error loading dashboards:', error);
    }
    setIsLoading(false);
  };

  const loadAnalyticsData = async () => {
    try {
      // Load real data from entities
      const [transactions, invoices, clients] = await Promise.all([
        Transaction.list('-date', 500).catch(() => []),
        Invoice.list('-created_date', 200).catch(() => []),
        Client.list('-created_date', 100).catch(() => [])
      ]);

      setAnalyticsData({
        transactions,
        invoices,
        clients,
        totalRevenue: transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + (t.amount || 0), 0),
        totalExpenses: transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + (t.amount || 0), 0),
        activeClients: clients.filter(c => c.status === 'active').length
      });
      
    } catch (error) {
      console.error('Error loading analytics data:', error);
    }
  };

  // Generate sample data functions
  function generateRevenueData() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map(month => ({
      month,
      revenue: Math.floor(Math.random() * 300000) + 150000,
      profit: Math.floor(Math.random() * 100000) + 50000,
      expenses: Math.floor(Math.random() * 200000) + 100000
    }));
  }

  function generateCategoryData() {
    return [
      { name: 'Consulting', value: 45, amount: 1102500 },
      { name: 'Software', value: 30, amount: 735000 },
      { name: 'Training', value: 15, amount: 367500 },
      { name: 'Other', value: 10, amount: 245000 }
    ];
  }

  // Drag and Drop Handler
  const handleDragEnd = (result) => {
    if (!result.destination || !isEditMode) return;

    const { source, destination, draggableId } = result;
    
    if (source.droppableId === 'widget-library' && destination.droppableId === 'dashboard-grid') {
      // Adding new widget from library
      addWidgetToDashboard(draggableId, destination.index);
    } else if (source.droppableId === 'dashboard-grid' && destination.droppableId === 'dashboard-grid') {
      // Reordering widgets on dashboard
      reorderDashboardWidgets(source.index, destination.index);
    }
  };

  const addWidgetToDashboard = (widgetType, position) => {
    const newWidget = {
      id: `widget-${Date.now()}`,
      type: widgetType,
      title: `New ${WIDGET_TYPES[widgetType].name}`,
      position: { x: position % 3, y: Math.floor(position / 3) },
      size: WIDGET_TYPES[widgetType].defaultSize,
      config: {},
      data: widgetType === 'kpi' ? { value: 0, change: 0, trend: 'neutral' } : []
    };

    setWidgets(prev => [...prev, newWidget]);
    setShowWidgetLibrary(false);
  };

  const reorderDashboardWidgets = (sourceIndex, destIndex) => {
    const reorderedWidgets = Array.from(widgets);
    const [removed] = reorderedWidgets.splice(sourceIndex, 1);
    reorderedWidgets.splice(destIndex, 0, removed);
    setWidgets(reorderedWidgets);
  };

  const removeWidget = (widgetId) => {
    setWidgets(prev => prev.filter(w => w.id !== widgetId));
  };

  const duplicateWidget = (widgetId) => {
    const widget = widgets.find(w => w.id === widgetId);
    if (widget) {
      const newWidget = {
        ...widget,
        id: `widget-${Date.now()}`,
        title: `${widget.title} (Copy)`,
        position: { x: (widget.position.x + 1) % 3, y: widget.position.y }
      };
      setWidgets(prev => [...prev, newWidget]);
    }
  };

  const createNewDashboard = async () => {
    if (!newDashboardName.trim()) return;

    const newDashboard = {
      id: `dashboard-${Date.now()}`,
      name: newDashboardName,
      description: "Custom dashboard",
      type: "custom",
      category: "Custom",
      isDefault: false,
      createdAt: new Date(),
      widgets: []
    };

    setDashboards(prev => [...prev, newDashboard]);
    setSelectedDashboard(newDashboard);
    setWidgets([]);
    setNewDashboardName("");
    setShowCreateDashboard(false);
    setIsEditMode(true);
  };

  const generateExecutiveSummary = async () => {
    setIsGeneratingReport(true);
    try {
      // Simulate AI report generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setExecutiveSummary({
        period: "Q4 2024",
        keyInsights: [
          "Revenue grew 12.5% compared to last quarter, driven by strong consulting demand",
          "Profit margins improved by 2.1% due to operational efficiency gains",
          "Client retention rate reached 94%, the highest in company history",
          "New market expansion contributed 18% of total revenue growth"
        ],
        recommendations: [
          "Increase investment in consulting team to meet growing demand",
          "Optimize pricing strategy for software products",
          "Expand into emerging markets identified in Q3 analysis",
          "Implement advanced automation to further improve margins"
        ],
        riskFactors: [
          "Economic uncertainty may impact Q1 2025 bookings",
          "Increased competition in core consulting markets",
          "Talent acquisition challenges in specialized areas"
        ],
        forecast: {
          nextQuarterRevenue: 2750000,
          confidence: 87,
          growthRate: 15.2
        }
      });
    } catch (error) {
      console.error('Error generating executive summary:', error);
    }
    setIsGeneratingReport(false);
  };

  // Widget Rendering Components
  const renderWidget = (widget) => {
    const { type, title, data, size } = widget;

    switch (type) {
      case 'kpi':
        return (
          <Card className="h-full bg-gradient-to-br from-slate-900/95 to-slate-800/95 border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-300">
            <CardContent className="p-6 flex flex-col justify-center h-full">
              <div className="text-center">
                <h3 className="text-sm font-medium text-gray-400 mb-2">{title}</h3>
                <div className="text-3xl font-bold text-white mb-2">
                  {data.format === 'currency' ? `$${(data.value / 1000).toFixed(0)}K` :
                   data.format === 'percentage' ? `${data.value}%` :
                   data.value.toLocaleString()}
                </div>
                <div className={`flex items-center justify-center text-sm ${
                  data.trend === 'up' ? 'text-green-400' : 
                  data.trend === 'down' ? 'text-red-400' : 'text-gray-400'
                }`}>
                  {data.trend === 'up' ? <ArrowUpRight className="w-4 h-4 mr-1" /> :
                   data.trend === 'down' ? <ArrowDownRight className="w-4 h-4 mr-1" /> : null}
                  {data.change > 0 ? '+' : ''}{data.change}%
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'chart_line':
        return (
          <Card className="h-full bg-gradient-to-br from-slate-900/95 to-slate-800/95 border-purple-500/30 hover:border-purple-400/50 transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="text-white text-lg">{title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#00ffff" 
                    strokeWidth={2}
                    dot={{ fill: '#00ffff', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="profit" 
                    stroke="#00ff00" 
                    strokeWidth={2}
                    dot={{ fill: '#00ff00', strokeWidth: 2, r: 4 }}
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        );

      case 'chart_pie':
        return (
          <Card className="h-full bg-gradient-to-br from-slate-900/95 to-slate-800/95 border-green-500/30 hover:border-green-400/50 transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="text-white text-lg">{title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      border: '1px solid rgba(34, 197, 94, 0.3)',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        );

      default:
        return (
          <Card className="h-full bg-gradient-to-br from-slate-900/95 to-slate-800/95 border-gray-500/30">
            <CardContent className="p-6 flex items-center justify-center h-full">
              <div className="text-center text-gray-400">
                <Layout className="w-8 h-8 mx-auto mb-2" />
                <p>Widget: {title}</p>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="business-intelligence-platform min-h-screen">
      <style jsx>{`
        .business-intelligence-platform {
          background: linear-gradient(135deg, 
            #0a0a0a 0%,
            #1a1a2e 25%,
            #16213e 50%,
            #0f0f23 75%,
            #000000 100%
          );
          background-attachment: fixed;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          min-height: 400px;
        }

        .widget-library-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .widget-library-item {
          padding: 1rem;
          border: 2px dashed rgba(99, 102, 241, 0.3);
          border-radius: 12px;
          text-align: center;
          cursor: grab;
          transition: all 0.3s ease;
        }

        .widget-library-item:hover {
          border-color: rgba(99, 102, 241, 0.6);
          background: rgba(99, 102, 241, 0.1);
        }

        .widget-library-item:active {
          cursor: grabbing;
        }

        .dashboard-widget {
          position: relative;
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .dashboard-widget:hover .widget-actions {
          opacity: 1;
        }

        .widget-actions {
          position: absolute;
          top: 8px;
          right: 8px;
          opacity: 0;
          display: flex;
          gap: 4px;
          z-index: 10;
        }

        .widget-action-btn {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .widget-action-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        @media (max-width: 768px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
          
          .widget-library-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Revolutionary Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
            🚀 Business Intelligence Platform
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Revolutionary AI-powered analytics with drag-and-drop dashboard builder
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2">
              <Cpu className="w-4 h-4 mr-2" />
              AI-Powered
            </Badge>
            <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2">
              <Layout className="w-4 h-4 mr-2" />
              Drag & Drop
            </Badge>
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2">
              <Database className="w-4 h-4 mr-2" />
              Real-time Data
            </Badge>
          </div>
        </motion.div>

        {/* Dashboard Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <Select value={selectedDashboard?.id || ""} onValueChange={(value) => {
                const dashboard = dashboards.find(d => d.id === value);
                setSelectedDashboard(dashboard);
                setWidgets(dashboard?.widgets || []);
              }}>
                <SelectTrigger className="w-64 bg-slate-800 border-slate-600">
                  <SelectValue placeholder="Select Dashboard" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  {dashboards.map(dashboard => (
                    <SelectItem key={dashboard.id} value={dashboard.id}>
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        {dashboard.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedDashboard && (
                <Badge variant="outline" className="border-cyan-500 text-cyan-400">
                  {selectedDashboard.category}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={() => setIsEditMode(!isEditMode)}
                className={`${isEditMode ? 'bg-green-600 hover:bg-green-700' : 'bg-slate-700 hover:bg-slate-600'}`}
              >
                <Edit3 className="w-4 h-4 mr-2" />
                {isEditMode ? 'Exit Edit' : 'Edit Mode'}
              </Button>

              <Dialog open={showCreateDashboard} onOpenChange={setShowCreateDashboard}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    New Dashboard
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-900 border-slate-700">
                  <DialogHeader>
                    <DialogTitle className="text-white">Create New Dashboard</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Dashboard name..."
                      value={newDashboardName}
                      onChange={(e) => setNewDashboardName(e.target.value)}
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                    <Button onClick={createNewDashboard} className="w-full bg-blue-600 hover:bg-blue-700">
                      Create Dashboard
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Button onClick={generateExecutiveSummary} disabled={isGeneratingReport} className="bg-purple-600 hover:bg-purple-700">
                <Brain className="w-4 h-4 mr-2" />
                {isGeneratingReport ? 'Generating...' : 'AI Summary'}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Main Dashboard Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
              {/* Widget Library Sidebar (Only in Edit Mode) */}
              <AnimatePresence>
                {isEditMode && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="xl:col-span-1"
                  >
                    <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <Layers className="w-5 h-5" />
                          Widget Library
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Droppable droppableId="widget-library">
                          {(provided) => (
                            <div 
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className="widget-library-grid"
                            >
                              {Object.entries(WIDGET_TYPES).map(([type, config], index) => (
                                <Draggable key={type} draggableId={type} index={index}>
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className={`widget-library-item ${snapshot.isDragging ? 'opacity-50' : ''}`}
                                    >
                                      <config.icon className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                                      <p className="text-sm text-white font-medium">{config.name}</p>
                                      <p className="text-xs text-gray-400 mt-1">{config.description}</p>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Main Dashboard Grid */}
              <div className={`${isEditMode ? 'xl:col-span-3' : 'xl:col-span-4'}`}>
                <Droppable droppableId="dashboard-grid">
                  {(provided, snapshot) => (
                    <div 
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`dashboard-grid ${snapshot.isDraggingOver ? 'bg-slate-800/20 border-2 border-dashed border-cyan-500 rounded-lg' : ''}`}
                    >
                      {widgets.map((widget, index) => (
                        <Draggable key={widget.id} draggableId={widget.id} index={index} isDragDisabled={!isEditMode}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`dashboard-widget ${snapshot.isDragging ? 'opacity-75 rotate-3 scale-105' : ''}`}
                              style={{
                                gridColumn: `span ${widget.size.width}`,
                                gridRow: `span ${widget.size.height}`,
                                ...provided.draggableProps.style
                              }}
                            >
                              {renderWidget(widget)}
                              
                              {/* Widget Actions (Edit Mode Only) */}
                              {isEditMode && (
                                <div className="widget-actions">
                                  <div className="widget-action-btn" onClick={() => duplicateWidget(widget.id)}>
                                    <Copy className="w-3 h-3" />
                                  </div>
                                  <div className="widget-action-btn" onClick={() => removeWidget(widget.id)}>
                                    <Trash2 className="w-3 h-3" />
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      
                      {/* Empty State */}
                      {widgets.length === 0 && (
                        <div className="col-span-3 flex flex-col items-center justify-center py-20 text-center">
                          <Layout className="w-16 h-16 text-gray-500 mb-4" />
                          <h3 className="text-xl font-semibold text-gray-300 mb-2">
                            {isEditMode ? 'Drag widgets here to build your dashboard' : 'No widgets added yet'}
                          </h3>
                          <p className="text-gray-500">
                            {isEditMode ? 'Choose from the widget library on the left' : 'Enable edit mode to add widgets'}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          </DragDropContext>
        </motion.div>

        {/* Executive Summary Modal */}
        <Dialog open={!!executiveSummary} onOpenChange={() => setExecutiveSummary(null)}>
          <DialogContent className="max-w-4xl bg-slate-900 border-slate-700 max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                AI Executive Summary - {executiveSummary?.period}
              </DialogTitle>
            </DialogHeader>
            
            {executiveSummary && (
              <div className="space-y-6 text-white">
                {/* Key Insights */}
                <div>
                  <h3 className="text-lg font-semibold text-green-400 mb-3">Key Insights</h3>
                  <div className="space-y-2">
                    {executiveSummary.keyInsights.map((insight, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-300">{insight}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div>
                  <h3 className="text-lg font-semibold text-blue-400 mb-3">Strategic Recommendations</h3>
                  <div className="space-y-2">
                    {executiveSummary.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg">
                        <Target className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-300">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Risk Factors */}
                <div>
                  <h3 className="text-lg font-semibold text-red-400 mb-3">Risk Factors</h3>
                  <div className="space-y-2">
                    {executiveSummary.riskFactors.map((risk, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-300">{risk}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Forecast */}
                <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-purple-400 mb-3">Next Quarter Forecast</h3>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-white">
                        ${(executiveSummary.forecast.nextQuarterRevenue / 1000000).toFixed(1)}M
                      </p>
                      <p className="text-gray-400">Projected Revenue</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-green-400">
                        {executiveSummary.forecast.confidence}%
                      </p>
                      <p className="text-gray-400">AI Confidence</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-blue-400">
                        +{executiveSummary.forecast.growthRate}%
                      </p>
                      <p className="text-gray-400">Growth Rate</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-slate-700">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Download className="w-4 h-4 mr-2" />
                    Export PDF
                  </Button>
                  <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-700">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Report
                  </Button>
                  <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-700">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Report
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}