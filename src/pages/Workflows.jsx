import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Zap, 
  Plus, 
  Play, 
  Pause, 
  Square,
  Settings,
  Clock,
  Mail,
  MessageSquare,
  FileText,
  DollarSign,
  Users,
  Calendar,
  Database,
  Brain,
  Workflow,
  ArrowRight,
  Eye,
  Edit,
  Trash2,
  Copy,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Mic,
  Bot,
  Sparkles,
  Target,
  TrendingUp,
  Filter,
  Search
} from "lucide-react";
import { motion } from "framer-motion";
import { Workflow as WorkflowEntity } from "@/api/entities";
import { WorkflowExecution } from "@/api/entities";
import { workflowExecutor } from "@/api/functions";
import { jarvisWorkflowAI } from "@/api/functions";

const TRIGGER_TYPES = [
  { 
    id: 'schedule', 
    name: 'Schedule', 
    icon: Clock, 
    description: 'Run on a time-based schedule',
    color: 'blue'
  },
  { 
    id: 'webhook', 
    name: 'Webhook', 
    icon: Zap, 
    description: 'Trigger via external API call',
    color: 'green'
  },
  { 
    id: 'transaction_created', 
    name: 'New Transaction', 
    icon: DollarSign, 
    description: 'When a transaction is created',
    color: 'purple'
  },
  { 
    id: 'invoice_sent', 
    name: 'Invoice Sent', 
    icon: FileText, 
    description: 'When an invoice is sent to client',
    color: 'orange'
  },
  { 
    id: 'email', 
    name: 'Email Received', 
    icon: Mail, 
    description: 'When specific email is received',
    color: 'red'
  },
  { 
    id: 'voice_command', 
    name: 'Voice Command', 
    icon: Mic, 
    description: 'Triggered by Jarvis voice command',
    color: 'cyan'
  },
  { 
    id: 'manual', 
    name: 'Manual', 
    icon: Play, 
    description: 'Run manually by user',
    color: 'gray'
  }
];

const ACTION_TYPES = [
  { 
    id: 'send_email', 
    name: 'Send Email', 
    icon: Mail, 
    description: 'Send automated email notification',
    category: 'communication'
  },
  { 
    id: 'slack_message', 
    name: 'Slack Message', 
    icon: MessageSquare, 
    description: 'Send message to Slack channel',
    category: 'communication'
  },
  { 
    id: 'create_invoice', 
    name: 'Create Invoice', 
    icon: FileText, 
    description: 'Generate and send invoice',
    category: 'finance'
  },
  { 
    id: 'update_budget', 
    name: 'Update Budget', 
    icon: Target, 
    description: 'Modify budget allocations',
    category: 'finance'
  },
  { 
    id: 'categorize_transaction', 
    name: 'AI Categorize', 
    icon: Brain, 
    description: 'Use AI to categorize transactions',
    category: 'ai'
  },
  { 
    id: 'generate_report', 
    name: 'Generate Report', 
    icon: TrendingUp, 
    description: 'Create financial reports',
    category: 'reporting'
  },
  { 
    id: 'sync_quickbooks', 
    name: 'Sync QuickBooks', 
    icon: Database, 
    description: 'Synchronize with QuickBooks',
    category: 'integration'
  },
  { 
    id: 'create_task', 
    name: 'Create Task', 
    icon: CheckCircle, 
    description: 'Create task for team member',
    category: 'management'
  }
];

const WORKFLOW_TEMPLATES = [
  {
    id: 'invoice_automation',
    name: '📧 Invoice Automation',
    description: 'Automatically send invoices and follow up on overdue payments',
    trigger: 'schedule',
    actions: ['create_invoice', 'send_email', 'slack_message'],
    category: 'finance',
    popularity: 95
  },
  {
    id: 'expense_categorization',
    name: '🤖 Smart Expense Categorization',
    description: 'Use AI to automatically categorize all incoming expenses',
    trigger: 'transaction_created',
    actions: ['categorize_transaction', 'update_budget'],
    category: 'ai',
    popularity: 88
  },
  {
    id: 'monthly_reports',
    name: '📊 Monthly Financial Reports',
    description: 'Generate and distribute monthly financial reports',
    trigger: 'schedule',
    actions: ['generate_report', 'send_email', 'sync_quickbooks'],
    category: 'reporting',
    popularity: 76
  },
  {
    id: 'payment_reminders',
    name: '🔔 Payment Reminders',
    description: 'Automatically remind clients about overdue invoices',
    trigger: 'schedule',
    actions: ['send_email', 'create_task'],
    category: 'communication',
    popularity: 82
  },
  {
    id: 'voice_expense_entry',
    name: '🎤 Voice Expense Entry',
    description: 'Add expenses using voice commands with Jarvis AI',
    trigger: 'voice_command',
    actions: ['categorize_transaction', 'send_email'],
    category: 'ai',
    popularity: 91
  }
];

export default function Workflows() {
  const [workflows, setWorkflows] = useState([]);
  const [executions, setExecutions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("workflows");

  // New workflow form state
  const [newWorkflow, setNewWorkflow] = useState({
    name: "",
    description: "",
    trigger: { type: "", config: {} },
    nodes: [],
    connections: [],
    jarvis_enabled: true
  });

  useEffect(() => {
    loadWorkflows();
    loadExecutions();
  }, []);

  const loadWorkflows = async () => {
    setIsLoading(true);
    try {
      const workflowData = await WorkflowEntity.list('-updated_date', 100);
      setWorkflows(workflowData || []);
    } catch (error) {
      console.error('Error loading workflows:', error);
      setWorkflows([]);
    }
    setIsLoading(false);
  };

  const loadExecutions = async () => {
    try {
      const executionData = await WorkflowExecution.list('-start_time', 50);
      setExecutions(executionData || []);
    } catch (error) {
      console.error('Error loading executions:', error);
      setExecutions([]);
    }
  };

  const handleCreateWorkflow = async () => {
    if (!newWorkflow.name || !newWorkflow.trigger.type) {
      alert('Please provide a name and trigger type for the workflow');
      return;
    }

    try {
      await WorkflowEntity.create({
        ...newWorkflow,
        status: 'inactive'
      });
      
      setShowCreateModal(false);
      setNewWorkflow({
        name: "",
        description: "",
        trigger: { type: "", config: {} },
        nodes: [],
        connections: [],
        jarvis_enabled: true
      });
      
      await loadWorkflows();
      alert('✅ Workflow created successfully!');
    } catch (error) {
      console.error('Error creating workflow:', error);
      alert('❌ Error creating workflow. Please try again.');
    }
  };

  const handleToggleWorkflow = async (workflowId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await WorkflowEntity.update(workflowId, { status: newStatus });
      await loadWorkflows();
      
      if (newStatus === 'active') {
        alert('🚀 Workflow activated and running!');
      } else {
        alert('⏸️ Workflow paused.');
      }
    } catch (error) {
      console.error('Error toggling workflow:', error);
      alert('❌ Error updating workflow status.');
    }
  };

  const handleRunWorkflow = async (workflow) => {
    try {
      const { data } = await workflowExecutor({
        workflow_id: workflow.id,
        trigger_data: { manual: true, user_initiated: true }
      });

      await loadExecutions();
      alert(`🚀 Workflow "${workflow.name}" executed successfully!`);
    } catch (error) {
      console.error('Error running workflow:', error);
      alert('❌ Error running workflow. Please try again.');
    }
  };

  const handleCreateFromTemplate = async (template) => {
    try {
      const workflowData = {
        name: template.name,
        description: template.description,
        trigger: { 
          type: template.trigger,
          config: getDefaultTriggerConfig(template.trigger)
        },
        nodes: template.actions.map((action, index) => ({
          id: `node_${index}`,
          type: action,
          name: ACTION_TYPES.find(a => a.id === action)?.name || action,
          config: {},
          position: { x: index * 200, y: 100 }
        })),
        connections: template.actions.slice(0, -1).map((_, index) => ({
          from: `node_${index}`,
          to: `node_${index + 1}`,
          condition: 'success'
        })),
        jarvis_enabled: template.trigger === 'voice_command',
        status: 'inactive'
      };

      await WorkflowEntity.create(workflowData);
      await loadWorkflows();
      alert(`✅ Workflow "${template.name}" created from template!`);
    } catch (error) {
      console.error('Error creating workflow from template:', error);
      alert('❌ Error creating workflow from template.');
    }
  };

  const handleJarvisCommand = async (command) => {
    try {
      const { data } = await jarvisWorkflowAI({
        command: command,
        context: 'workflow_management'
      });

      if (data.action === 'create_workflow') {
        await WorkflowEntity.create(data.workflow_data);
        await loadWorkflows();
        alert(`🤖 Jarvis created workflow: "${data.workflow_data.name}"`);
      } else if (data.action === 'execute_workflow') {
        await handleRunWorkflow(data.workflow);
      }
    } catch (error) {
      console.error('Error processing Jarvis command:', error);
      alert('❌ Jarvis could not process that command.');
    }
  };

  const getDefaultTriggerConfig = (triggerType) => {
    switch (triggerType) {
      case 'schedule':
        return { frequency: 'daily', time: '09:00' };
      case 'webhook':
        return { endpoint: '/webhook/trigger', method: 'POST' };
      case 'email':
        return { from_filter: '', subject_filter: '' };
      default:
        return {};
    }
  };

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = !searchTerm || 
      workflow.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workflow.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || workflow.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    const colors = {
      active: "bg-green-500/20 text-green-300 border-green-500/30",
      inactive: "bg-gray-500/20 text-gray-300 border-gray-500/30",
      error: "bg-red-500/20 text-red-300 border-red-500/30"
    };
    return colors[status] || colors.inactive;
  };

  const getTriggerIcon = (triggerType) => {
    const trigger = TRIGGER_TYPES.find(t => t.id === triggerType);
    return trigger ? trigger.icon : Zap;
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-6">
      <style>{`
        .workflow-container {
          background: linear-gradient(135deg, 
            #0a0a0a 0%,
            #1a1a2e 25%,
            #16213e 50%,
            #0f0f23 75%,
            #000000 100%
          );
          min-height: 100vh;
          padding: 2rem;
        }
        
        .workflow-card {
          background: linear-gradient(145deg, 
            rgba(15, 23, 42, 0.9) 0%,
            rgba(30, 41, 59, 0.8) 100%
          );
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          transition: all 0.3s ease;
        }
        
        .workflow-card:hover {
          transform: translateY(-4px);
          border: 1px solid rgba(59, 130, 246, 0.3);
          box-shadow: 
            0 10px 25px rgba(0, 0, 0, 0.3),
            0 0 20px rgba(59, 130, 246, 0.1);
        }

        .template-card {
          background: linear-gradient(145deg, 
            rgba(15, 23, 42, 0.95) 0%,
            rgba(30, 41, 59, 0.9) 100%
          );
          backdrop-filter: blur(25px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          transition: all 0.3s ease;
        }
        
        .template-card:hover {
          transform: translateY(-2px);
          border: 1px solid rgba(16, 185, 129, 0.3);
          box-shadow: 
            0 8px 20px rgba(0, 0, 0, 0.3),
            0 0 15px rgba(16, 185, 129, 0.1);
        }

        .execution-row {
          background: rgba(15, 23, 42, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          transition: all 0.2s ease;
        }
        
        .execution-row:hover {
          background: rgba(30, 41, 59, 0.8);
          border: 1px solid rgba(59, 130, 246, 0.2);
        }
      `}</style>

      <div className="workflow-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8"
        >
          <div>
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 tracking-tight">
              ⚡ Workflow Automation
            </h1>
            <p className="text-gray-400 mt-2 text-xl">Build powerful automations with AI assistance</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => loadWorkflows()}
              variant="outline"
              className="bg-slate-800/50 border-slate-600 text-gray-300"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Workflow
            </Button>
          </div>
        </motion.div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="workflows" className="data-[state=active]:bg-purple-600">
              <Workflow className="w-4 h-4 mr-2" />
              My Workflows ({filteredWorkflows.length})
            </TabsTrigger>
            <TabsTrigger value="templates" className="data-[state=active]:bg-green-600">
              <Sparkles className="w-4 h-4 mr-2" />
              Templates ({WORKFLOW_TEMPLATES.length})
            </TabsTrigger>
            <TabsTrigger value="executions" className="data-[state=active]:bg-blue-600">
              <TrendingUp className="w-4 h-4 mr-2" />
              Executions ({executions.length})
            </TabsTrigger>
            <TabsTrigger value="jarvis" className="data-[state=active]:bg-cyan-600">
              <Bot className="w-4 h-4 mr-2" />
              Jarvis AI
            </TabsTrigger>
          </TabsList>

          {/* My Workflows Tab */}
          <TabsContent value="workflows" className="space-y-6">
            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row gap-4 p-4 rounded-xl bg-slate-800/30 border border-slate-700"
            >
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search workflows..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-800/50 border-slate-600"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 bg-slate-800/50 border-slate-600">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>

            {/* Workflows Grid */}
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-400">Loading workflows...</p>
              </div>
            ) : filteredWorkflows.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Workflow className="w-24 h-24 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">No Workflows Yet</h3>
                <p className="text-gray-400 mb-6">Create your first workflow to automate your business processes</p>
                <Button 
                  onClick={() => setShowCreateModal(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Workflow
                </Button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredWorkflows.map((workflow, index) => {
                  const TriggerIcon = getTriggerIcon(workflow.trigger?.type);
                  
                  return (
                    <motion.div
                      key={workflow.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="workflow-card p-6"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-purple-600/20">
                            <TriggerIcon className="w-5 h-5 text-purple-400" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white text-lg">{workflow.name}</h3>
                            <p className="text-sm text-gray-400">
                              {workflow.trigger?.type || 'No trigger'}
                            </p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(workflow.status)}>
                          {workflow.status}
                        </Badge>
                      </div>

                      <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                        {workflow.description || 'No description provided'}
                      </p>

                      <div className="flex items-center gap-2 mb-4">
                        <Badge variant="outline" className="text-xs">
                          {workflow.nodes?.length || 0} actions
                        </Badge>
                        {workflow.jarvis_enabled && (
                          <Badge className="bg-cyan-600/20 text-cyan-300 text-xs">
                            <Bot className="w-3 h-3 mr-1" />
                            Jarvis
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {workflow.run_count || 0} runs
                        </Badge>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleToggleWorkflow(workflow.id, workflow.status)}
                          size="sm"
                          variant={workflow.status === 'active' ? 'destructive' : 'default'}
                          className="flex-1"
                        >
                          {workflow.status === 'active' ? (
                            <>
                              <Pause className="w-4 h-4 mr-1" />
                              Pause
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 mr-1" />
                              Activate
                            </>
                          )}
                        </Button>
                        
                        <Button
                          onClick={() => handleRunWorkflow(workflow)}
                          size="sm"
                          variant="outline"
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                        
                        <Button
                          onClick={() => setSelectedWorkflow(workflow)}
                          size="sm"
                          variant="ghost"
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <h2 className="text-2xl font-bold text-white mb-2">Workflow Templates</h2>
              <p className="text-gray-400">Start with proven automation patterns</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {WORKFLOW_TEMPLATES.map((template, index) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="template-card p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-white text-lg mb-1">{template.name}</h3>
                      <Badge className="bg-green-600/20 text-green-300 text-xs">
                        {template.popularity}% popular
                      </Badge>
                    </div>
                    <div className="text-2xl">{template.category === 'ai' ? '🤖' : 
                                                template.category === 'finance' ? '💰' :
                                                template.category === 'communication' ? '📧' : '📊'}</div>
                  </div>

                  <p className="text-gray-300 text-sm mb-4">{template.description}</p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {template.actions.slice(0, 3).map(action => (
                      <Badge key={action} variant="outline" className="text-xs">
                        {ACTION_TYPES.find(a => a.id === action)?.name || action}
                      </Badge>
                    ))}
                    {template.actions.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{template.actions.length - 3} more
                      </Badge>
                    )}
                  </div>

                  <Button
                    onClick={() => handleCreateFromTemplate(template)}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Use Template
                  </Button>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Executions Tab */}
          <TabsContent value="executions" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <h2 className="text-2xl font-bold text-white mb-2">Workflow Executions</h2>
              <p className="text-gray-400">Monitor automation performance</p>
            </motion.div>

            <div className="space-y-3">
              {executions.length === 0 ? (
                <div className="text-center py-12">
                  <TrendingUp className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-300 mb-2">No Executions Yet</h3>
                  <p className="text-gray-400">Workflow executions will appear here</p>
                </div>
              ) : (
                executions.map((execution, index) => (
                  <motion.div
                    key={execution.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="execution-row p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${
                        execution.status === 'completed' ? 'bg-green-600/20' :
                        execution.status === 'failed' ? 'bg-red-600/20' :
                        execution.status === 'running' ? 'bg-blue-600/20' :
                        'bg-gray-600/20'
                      }`}>
                        {execution.status === 'completed' ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : execution.status === 'failed' ? (
                          <XCircle className="w-4 h-4 text-red-400" />
                        ) : execution.status === 'running' ? (
                          <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
                        ) : (
                          <Clock className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      
                      <div>
                        <p className="text-white font-medium">
                          {workflows.find(w => w.id === execution.workflow_id)?.name || 'Unknown Workflow'}
                        </p>
                        <p className="text-sm text-gray-400">
                          {new Date(execution.start_time).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <Badge className={
                        execution.status === 'completed' ? 'bg-green-600/20 text-green-300' :
                        execution.status === 'failed' ? 'bg-red-600/20 text-red-300' :
                        execution.status === 'running' ? 'bg-blue-600/20 text-blue-300' :
                        'bg-gray-600/20 text-gray-300'
                      }>
                        {execution.status}
                      </Badge>
                      
                      {execution.jarvis_triggered && (
                        <Badge className="bg-cyan-600/20 text-cyan-300">
                          <Bot className="w-3 h-3 mr-1" />
                          Jarvis
                        </Badge>
                      )}

                      <Button size="sm" variant="ghost">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </TabsContent>

          {/* Jarvis AI Tab */}
          <TabsContent value="jarvis" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <div className="text-6xl mb-4">🤖</div>
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-2">
                Jarvis Workflow AI
              </h2>
              <p className="text-gray-400 text-xl">Create and manage workflows with voice commands</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-2xl mx-auto space-y-6"
            >
              {/* Voice Command Examples */}
              <Card className="bg-slate-800/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Mic className="w-5 h-5 text-cyan-400" />
                    Voice Command Examples
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {[
                      "Create a workflow to send invoice reminders every week",
                      "Set up automation to categorize all expenses with AI",
                      "Make a workflow that generates monthly reports",
                      "Create automation for Slack notifications on new transactions",
                      "Set up workflow to sync data with QuickBooks daily"
                    ].map((command, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                        <div className="text-cyan-400">💬</div>
                        <p className="text-gray-300 flex-1">{command}</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleJarvisCommand(command)}
                          className="text-cyan-400 hover:text-cyan-300"
                        >
                          Try
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Jarvis Capabilities */}
              <Card className="bg-slate-800/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-400" />
                    AI Capabilities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { icon: Zap, title: 'Smart Creation', desc: 'Create workflows from natural language' },
                      { icon: Settings, title: 'Auto-Configure', desc: 'Automatically set up triggers and actions' },
                      { icon: Brain, title: 'Context Aware', desc: 'Understands your business processes' },
                      { icon: Mic, title: 'Voice Control', desc: 'Execute workflows with voice commands' }
                    ].map((capability, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg">
                        <capability.icon className="w-5 h-5 text-cyan-400 mt-0.5" />
                        <div>
                          <h4 className="text-white font-medium">{capability.title}</h4>
                          <p className="text-sm text-gray-400">{capability.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Create Workflow Modal */}
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogContent className="max-w-2xl bg-slate-800 border-slate-600">
            <DialogHeader>
              <DialogTitle className="text-white text-xl">Create New Workflow</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div>
                <Label htmlFor="workflow-name" className="text-gray-300">Workflow Name *</Label>
                <Input
                  id="workflow-name"
                  placeholder="e.g., Monthly Invoice Automation"
                  value={newWorkflow.name}
                  onChange={(e) => setNewWorkflow(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1 bg-slate-700 border-slate-600"
                />
              </div>

              <div>
                <Label htmlFor="workflow-description" className="text-gray-300">Description</Label>
                <Textarea
                  id="workflow-description"
                  placeholder="Describe what this workflow does..."
                  value={newWorkflow.description}
                  onChange={(e) => setNewWorkflow(prev => ({ ...prev, description: e.target.value }))}
                  className="mt-1 bg-slate-700 border-slate-600"
                  rows={3}
                />
              </div>

              <div>
                <Label className="text-gray-300">Trigger Type *</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                  {TRIGGER_TYPES.map(trigger => (
                    <div
                      key={trigger.id}
                      onClick={() => setNewWorkflow(prev => ({ 
                        ...prev, 
                        trigger: { type: trigger.id, config: getDefaultTriggerConfig(trigger.id) }
                      }))}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        newWorkflow.trigger.type === trigger.id
                          ? `border-${trigger.color}-500 bg-${trigger.color}-500/10`
                          : 'border-slate-600 hover:border-slate-500'
                      }`}
                    >
                      <div className="text-center">
                        <trigger.icon className={`w-6 h-6 mx-auto mb-2 ${
                          newWorkflow.trigger.type === trigger.id ? `text-${trigger.color}-400` : 'text-gray-400'
                        }`} />
                        <p className={`text-sm font-medium ${
                          newWorkflow.trigger.type === trigger.id ? 'text-white' : 'text-gray-300'
                        }`}>
                          {trigger.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                <div>
                  <Label className="text-gray-300">Enable Jarvis AI Control</Label>
                  <p className="text-sm text-gray-400">Allow voice commands to control this workflow</p>
                </div>
                <Switch
                  checked={newWorkflow.jarvis_enabled}
                  onCheckedChange={(checked) => setNewWorkflow(prev => ({ ...prev, jarvis_enabled: checked }))}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-600">
                <Button 
                  variant="outline" 
                  onClick={() => setShowCreateModal(false)}
                  className="border-slate-600 text-gray-300"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateWorkflow}
                  className="bg-purple-600 hover:bg-purple-700"
                  disabled={!newWorkflow.name || !newWorkflow.trigger.type}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Workflow
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}