import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Save, 
  Play, 
  Pause, 
  Plus, 
  Trash2, 
  Settings, 
  Zap, 
  Brain,
  Clock,
  Mail,
  Webhook,
  Database,
  Calculator,
  FileText,
  Send,
  Filter,
  ArrowRight,
  Eye,
  Edit,
  Copy,
  MoreHorizontal
} from "lucide-react";

const TRIGGER_TYPES = [
  { value: "schedule", label: "⏰ Schedule", description: "Run on a time-based schedule" },
  { value: "webhook", label: "🔗 Webhook", description: "Triggered by external HTTP calls" },
  { value: "manual", label: "👆 Manual", description: "Run manually when needed" },
  { value: "voice_command", label: "🎤 Voice Command", description: "Triggered by voice command" },
  { value: "email", label: "📧 Email", description: "Triggered by email events" },
  { value: "transaction_created", label: "💰 Transaction Created", description: "When a new transaction is added" },
  { value: "invoice_sent", label: "📄 Invoice Sent", description: "When an invoice is sent to client" }
];

const NODE_TYPES = [
  { value: "condition", label: "🔀 Condition", description: "If/then logic branching" },
  { value: "action", label: "⚡ Action", description: "Perform an action" },
  { value: "email", label: "📧 Send Email", description: "Send email notification" },
  { value: "webhook", label: "🔗 Call Webhook", description: "Make HTTP request" },
  { value: "database", label: "🗄️ Database Query", description: "Read/write database" },
  { value: "calculation", label: "🧮 Calculate", description: "Perform calculations" },
  { value: "ai_analysis", label: "🧠 AI Analysis", description: "Use AI for analysis" },
  { value: "delay", label: "⏱️ Delay", description: "Wait for specified time" },
  { value: "approval", label: "✅ Approval", description: "Wait for human approval" }
];

export default function WorkflowBuilder({ 
  workflow, 
  onSave, 
  onCancel,
  onDelete,
  workflows = []
}) {
  const [workflowData, setWorkflowData] = useState(workflow || {
    name: "",
    description: "",
    trigger: {
      type: "manual",
      config: {}
    },
    nodes: [],
    connections: [],
    status: "inactive",
    jarvis_enabled: true
  });

  const [selectedNode, setSelectedNode] = useState(null);
  const [draggedNode, setDraggedNode] = useState(null);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResults, setExecutionResults] = useState(null);

  useEffect(() => {
    if (workflow) {
      setWorkflowData(workflow);
    }
  }, [workflow]);

  const handleChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setWorkflowData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setWorkflowData(prev => ({ ...prev, [field]: value }));
    }
  };

  const addNode = (nodeType) => {
    const newNode = {
      id: `node_${Date.now()}`,
      type: nodeType.value,
      name: nodeType.label.replace(/[^\w\s]/g, '').trim(),
      config: {},
      position: {
        x: Math.random() * 300 + 100,
        y: Math.random() * 200 + 100
      }
    };

    setWorkflowData(prev => ({
      ...prev,
      nodes: [...prev.nodes, newNode]
    }));
  };

  const updateNode = (nodeId, updates) => {
    setWorkflowData(prev => ({
      ...prev,
      nodes: prev.nodes.map(node => 
        node.id === nodeId ? { ...node, ...updates } : node
      )
    }));
  };

  const deleteNode = (nodeId) => {
    setWorkflowData(prev => ({
      ...prev,
      nodes: prev.nodes.filter(node => node.id !== nodeId),
      connections: prev.connections.filter(conn => 
        conn.from !== nodeId && conn.to !== nodeId
      )
    }));
    setSelectedNode(null);
  };

  const addConnection = (fromId, toId) => {
    const newConnection = {
      from: fromId,
      to: toId,
      condition: ""
    };

    setWorkflowData(prev => ({
      ...prev,
      connections: [...prev.connections, newConnection]
    }));
  };

  const executeWorkflow = async () => {
    setIsExecuting(true);
    try {
      // Simulate workflow execution
      setExecutionResults({
        status: "success",
        steps: workflowData.nodes.map(node => ({
          nodeId: node.id,
          name: node.name,
          status: "completed",
          duration: Math.random() * 1000 + 200,
          result: "Success"
        }))
      });
    } catch (error) {
      setExecutionResults({
        status: "error",
        error: error.message
      });
    }
    setIsExecuting(false);
  };

  const handleSave = async () => {
    try {
      await onSave(workflowData);
    } catch (error) {
      console.error('Workflow save error:', error);
      alert('Failed to save workflow. Please try again.');
    }
  };

  const NodeComponent = ({ node }) => {
    const nodeType = NODE_TYPES.find(t => t.value === node.type);
    
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`workflow-node ${selectedNode?.id === node.id ? 'selected' : ''}`}
        style={{
          position: 'absolute',
          left: node.position.x,
          top: node.position.y
        }}
        onClick={() => setSelectedNode(node)}
      >
        <div className="node-header">
          <div className="node-icon">
            {nodeType?.label.split(' ')[0] || '⚡'}
          </div>
          <div className="node-title">{node.name}</div>
        </div>
        <div className="node-body">
          <p className="node-description">{nodeType?.description}</p>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="workflow-builder-container">
      <style jsx>{`
        .workflow-builder-container {
          background: linear-gradient(145deg, 
            rgba(15, 23, 42, 0.98) 0%,
            rgba(30, 41, 59, 0.95) 100%
          );
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 20px;
          backdrop-filter: blur(25px);
          position: relative;
          overflow: hidden;
          min-height: 80vh;
        }
        
        .workflow-builder-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, 
            transparent 40%,
            rgba(139, 92, 246, 0.03) 50%,
            transparent 60%
          );
          animation: workflowGlow 8s ease-in-out infinite;
          z-index: 1;
        }
        
        @keyframes workflowGlow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
        
        .workflow-header {
          position: relative;
          z-index: 10;
          background: linear-gradient(135deg, 
            rgba(139, 92, 246, 0.1) 0%,
            rgba(124, 58, 237, 0.08) 100%
          );
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding: 1.5rem;
        }
        
        .workflow-content {
          position: relative;
          z-index: 10;
          display: grid;
          grid-template-columns: 300px 1fr 300px;
          height: calc(100vh - 200px);
        }
        
        .workflow-sidebar {
          background: linear-gradient(145deg, 
            rgba(51, 65, 85, 0.4) 0%,
            rgba(30, 41, 59, 0.3) 100%
          );
          border-right: 1px solid rgba(255, 255, 255, 0.08);
          padding: 1.5rem;
        }
        
        .workflow-canvas {
          position: relative;
          background: linear-gradient(135deg, 
            rgba(30, 41, 59, 0.2) 0%,
            rgba(51, 65, 85, 0.1) 100%
          );
          background-image: 
            radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.05) 1px, transparent 0);
          background-size: 20px 20px;
          overflow: hidden;
        }
        
        .workflow-properties {
          background: linear-gradient(145deg, 
            rgba(51, 65, 85, 0.4) 0%,
            rgba(30, 41, 59, 0.3) 100%
          );
          border-left: 1px solid rgba(255, 255, 255, 0.08);
          padding: 1.5rem;
        }
        
        .node-palette {
          display: grid;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }
        
        .node-palette-item {
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.08) 0%,
            rgba(255, 255, 255, 0.04) 100%
          );
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 8px;
          padding: 0.75rem;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }
        
        .node-palette-item:hover {
          background: linear-gradient(135deg, 
            rgba(139, 92, 246, 0.15) 0%,
            rgba(124, 58, 237, 0.1) 100%
          );
          border: 1px solid rgba(139, 92, 246, 0.4);
          transform: translateY(-2px) scale(1.02);
        }
        
        .workflow-node {
          background: linear-gradient(145deg, 
            rgba(51, 65, 85, 0.9) 0%,
            rgba(30, 41, 59, 0.8) 100%
          );
          border: 2px solid rgba(139, 92, 246, 0.3);
          border-radius: 12px;
          backdrop-filter: blur(20px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
          cursor: pointer;
          transition: all 0.3s ease;
          width: 200px;
          min-height: 80px;
        }
        
        .workflow-node:hover {
          border: 2px solid rgba(139, 92, 246, 0.6);
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
        }
        
        .workflow-node.selected {
          border: 2px solid rgba(139, 92, 246, 1);
          box-shadow: 
            0 15px 35px rgba(0, 0, 0, 0.4),
            0 0 40px rgba(139, 92, 246, 0.5);
        }
        
        .node-header {
          padding: 0.75rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .node-icon {
          font-size: 1.2rem;
        }
        
        .node-title {
          color: white;
          font-weight: 600;
          font-size: 0.9rem;
        }
        
        .node-body {
          padding: 0.75rem;
        }
        
        .node-description {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.75rem;
          line-height: 1.3;
        }
        
        .trigger-config {
          background: linear-gradient(135deg, 
            rgba(16, 185, 129, 0.1) 0%,
            rgba(5, 150, 105, 0.08) 100%
          );
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: 12px;
          padding: 1rem;
          margin-bottom: 1.5rem;
        }
        
        .execution-results {
          background: linear-gradient(135deg, 
            rgba(59, 130, 246, 0.1) 0%,
            rgba(37, 99, 235, 0.08) 100%
          );
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 12px;
          padding: 1rem;
          margin-top: 1.5rem;
        }
        
        .execution-step {
          display: flex;
          align-items: center;
          justify-content: between;
          padding: 0.5rem;
          margin-bottom: 0.5rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 6px;
        }
        
        .form-section {
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.05) 0%,
            rgba(255, 255, 255, 0.02) 100%
          );
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 1rem;
          margin-bottom: 1.5rem;
        }
        
        .enhanced-input {
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.08) 0%,
            rgba(255, 255, 255, 0.04) 100%
          );
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.9);
          padding: 0.75rem;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }
        
        .enhanced-input:focus {
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.12) 0%,
            rgba(255, 255, 255, 0.08) 100%
          );
          border: 1px solid rgba(139, 92, 246, 0.5);
          box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
          outline: none;
        }
      `}</style>

      {/* Header */}
      <div className="workflow-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {workflow ? 'Edit Workflow' : 'Create Workflow'}
              </h2>
              <p className="text-sm text-gray-300">
                Build intelligent automation workflows with AI integration
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {workflowData.status === 'active' && (
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                Active
              </Badge>
            )}
            {workflowData.jarvis_enabled && (
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 flex items-center gap-1">
                <Brain className="w-3 h-3" />
                Jarvis Enabled
              </Badge>
            )}
            <Button
              onClick={executeWorkflow}
              disabled={isExecuting}
              variant="outline"
              className="border-green-600 text-green-400 hover:bg-green-600/20"
            >
              <Play className="w-4 h-4 mr-2" />
              {isExecuting ? 'Running...' : 'Test Run'}
            </Button>
          </div>
        </div>
      </div>

      <div className="workflow-content">
        {/* Left Sidebar - Tools */}
        <div className="workflow-sidebar">
          <ScrollArea className="h-full">
            {/* Basic Settings */}
            <div className="form-section">
              <h3 className="text-lg font-semibold text-white mb-3">Workflow Settings</h3>
              <div className="space-y-3">
                <div>
                  <Label className="text-gray-300 font-semibold">Name</Label>
                  <Input
                    value={workflowData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="enhanced-input"
                    placeholder="My Automation Workflow"
                  />
                </div>
                <div>
                  <Label className="text-gray-300 font-semibold">Description</Label>
                  <Textarea
                    value={workflowData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    className="enhanced-input h-20"
                    placeholder="Describe what this workflow does..."
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={workflowData.status === 'active'}
                    onCheckedChange={(checked) => handleChange('status', checked ? 'active' : 'inactive')}
                  />
                  <Label className="text-gray-300">Active</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={workflowData.jarvis_enabled}
                    onCheckedChange={(checked) => handleChange('jarvis_enabled', checked)}
                  />
                  <Label className="text-gray-300">Enable Jarvis AI Control</Label>
                </div>
              </div>
            </div>

            {/* Trigger Configuration */}
            <div className="trigger-config">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5 text-green-400" />
                Trigger
              </h3>
              <Select 
                value={workflowData.trigger.type} 
                onValueChange={(value) => handleChange('trigger.type', value)}
              >
                <SelectTrigger className="enhanced-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {TRIGGER_TYPES.map(trigger => (
                    <SelectItem key={trigger.value} value={trigger.value}>
                      <div>
                        <div className="font-medium">{trigger.label}</div>
                        <div className="text-xs text-gray-500">{trigger.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Node Palette */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Add Components</h3>
              <div className="node-palette">
                {NODE_TYPES.map(nodeType => (
                  <div
                    key={nodeType.value}
                    className="node-palette-item"
                    onClick={() => addNode(nodeType)}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span>{nodeType.label.split(' ')[0]}</span>
                      <span className="text-sm font-medium text-white">
                        {nodeType.label.substring(nodeType.label.indexOf(' ') + 1)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">{nodeType.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Center - Canvas */}
        <div className="workflow-canvas">
          <AnimatePresence>
            {workflowData.nodes.map(node => (
              <NodeComponent key={node.id} node={node} />
            ))}
          </AnimatePresence>

          {/* Canvas Instructions */}
          {workflowData.nodes.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <Zap className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Build Your Workflow</h3>
                <p>Add components from the left sidebar to get started</p>
              </div>
            </div>
          )}

          {/* Execution Results Overlay */}
          {executionResults && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="execution-results absolute top-4 right-4 w-80"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-white">Execution Results</h4>
                <Button
                  onClick={() => setExecutionResults(null)}
                  size="sm"
                  variant="ghost"
                  className="text-gray-400"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {executionResults.steps?.map((step, index) => (
                  <div key={step.nodeId} className="execution-step">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-white">{step.name}</div>
                      <div className="text-xs text-gray-400">
                        {step.duration}ms • {step.result}
                      </div>
                    </div>
                    <Badge className="bg-green-500/20 text-green-300">
                      {step.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Sidebar - Properties */}
        <div className="workflow-properties">
          <ScrollArea className="h-full">
            {selectedNode ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Node Properties</h3>
                  <Button
                    onClick={() => deleteNode(selectedNode.id)}
                    size="sm"
                    variant="destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="form-section">
                  <div className="space-y-3">
                    <div>
                      <Label className="text-gray-300 font-semibold">Name</Label>
                      <Input
                        value={selectedNode.name}
                        onChange={(e) => updateNode(selectedNode.id, { name: e.target.value })}
                        className="enhanced-input"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 font-semibold">Type</Label>
                      <div className="text-white bg-gray-800 p-2 rounded text-sm">
                        {NODE_TYPES.find(t => t.value === selectedNode.type)?.label || selectedNode.type}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Type-specific configuration */}
                {selectedNode.type === 'email' && (
                  <div className="form-section">
                    <h4 className="font-semibold text-white mb-3">Email Configuration</h4>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-gray-300">To</Label>
                        <Input
                          value={selectedNode.config?.to || ''}
                          onChange={(e) => updateNode(selectedNode.id, {
                            config: { ...selectedNode.config, to: e.target.value }
                          })}
                          className="enhanced-input"
                          placeholder="recipient@example.com"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Subject</Label>
                        <Input
                          value={selectedNode.config?.subject || ''}
                          onChange={(e) => updateNode(selectedNode.id, {
                            config: { ...selectedNode.config, subject: e.target.value }
                          })}
                          className="enhanced-input"
                          placeholder="Email subject"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Body</Label>
                        <Textarea
                          value={selectedNode.config?.body || ''}
                          onChange={(e) => updateNode(selectedNode.id, {
                            config: { ...selectedNode.config, body: e.target.value }
                          })}
                          className="enhanced-input h-24"
                          placeholder="Email content..."
                        />
                      </div>
                    </div>
                  </div>
                )}

                {selectedNode.type === 'condition' && (
                  <div className="form-section">
                    <h4 className="font-semibold text-white mb-3">Condition Logic</h4>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-gray-300">Field</Label>
                        <Input
                          value={selectedNode.config?.field || ''}
                          onChange={(e) => updateNode(selectedNode.id, {
                            config: { ...selectedNode.config, field: e.target.value }
                          })}
                          className="enhanced-input"
                          placeholder="e.g., amount, category"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Operator</Label>
                        <Select
                          value={selectedNode.config?.operator || 'equals'}
                          onValueChange={(value) => updateNode(selectedNode.id, {
                            config: { ...selectedNode.config, operator: value }
                          })}
                        >
                          <SelectTrigger className="enhanced-input">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700">
                            <SelectItem value="equals">Equals</SelectItem>
                            <SelectItem value="greater_than">Greater Than</SelectItem>
                            <SelectItem value="less_than">Less Than</SelectItem>
                            <SelectItem value="contains">Contains</SelectItem>
                            <SelectItem value="not_equals">Not Equals</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-gray-300">Value</Label>
                        <Input
                          value={selectedNode.config?.value || ''}
                          onChange={(e) => updateNode(selectedNode.id, {
                            config: { ...selectedNode.config, value: e.target.value }
                          })}
                          className="enhanced-input"
                          placeholder="Comparison value"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {selectedNode.type === 'ai_analysis' && (
                  <div className="form-section">
                    <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                      <Brain className="w-4 h-4 text-purple-400" />
                      AI Analysis
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-gray-300">Analysis Type</Label>
                        <Select
                          value={selectedNode.config?.analysis_type || 'categorization'}
                          onValueChange={(value) => updateNode(selectedNode.id, {
                            config: { ...selectedNode.config, analysis_type: value }
                          })}
                        >
                          <SelectTrigger className="enhanced-input">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700">
                            <SelectItem value="categorization">Smart Categorization</SelectItem>
                            <SelectItem value="anomaly_detection">Anomaly Detection</SelectItem>
                            <SelectItem value="sentiment_analysis">Sentiment Analysis</SelectItem>
                            <SelectItem value="forecast">Financial Forecasting</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-gray-300">Confidence Threshold</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={selectedNode.config?.confidence_threshold || '80'}
                          onChange={(e) => updateNode(selectedNode.id, {
                            config: { ...selectedNode.config, confidence_threshold: e.target.value }
                          })}
                          className="enhanced-input"
                          placeholder="80"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500 mt-8">
                <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No Node Selected</h3>
                <p>Click on a workflow node to edit its properties</p>
              </div>
            )}
          </ScrollArea>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">
            {workflowData.nodes.length} nodes • {workflowData.connections.length} connections
          </span>
          {workflowData.jarvis_enabled && (
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 flex items-center gap-1">
              <Brain className="w-3 h-3" />
              AI-Powered
            </Badge>
          )}
        </div>
        
        <div className="flex gap-3">
          <Button onClick={onCancel} variant="outline" className="border-gray-600 text-gray-400 hover:bg-gray-700">
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700 text-white">
            <Save className="w-4 h-4 mr-2" />
            Save Workflow
          </Button>
        </div>
      </div>
    </div>
  );
}