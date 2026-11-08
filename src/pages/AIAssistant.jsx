
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
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Zap, 
  Sparkles,
  MessageSquare,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Bot,
  Target,
  TrendingUp,
  TrendingDown,
  Eye,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Settings,
  BarChart3,
  PieChart,
  Calendar,
  Clock,
  DollarSign,
  Users,
  FileText,
  Search,
  Filter,
  Star,
  Lightbulb,
  Shield,
  Cpu,
  Database,
  Network,
  Activity
} from "lucide-react";
import { motion } from "framer-motion";
import { askAI, getAIConfig, saveAIConfig, testAIConnection } from "@/api/aiService";

const AI_FEATURES = [
  {
    id: 'financial_advisor',
    name: '💰 Financial Advisor AI',
    description: 'Get personalized financial advice and investment recommendations',
    status: 'active',
    accuracy: 94,
    category: 'advisory',
    icon: TrendingUp,
    color: 'green'
  },
  {
    id: 'expense_predictor',
    name: '📊 Expense Predictor',
    description: 'Predict future expenses based on historical patterns',
    status: 'active',
    accuracy: 89,
    category: 'prediction',
    icon: BarChart3,
    color: 'blue'
  },
  {
    id: 'anomaly_detector',
    name: '🔍 Anomaly Detection',
    description: 'Automatically detect unusual transactions and potential fraud',
    status: 'active',
    accuracy: 96,
    category: 'security',
    icon: Shield,
    color: 'red'
  },
  {
    id: 'smart_categorizer',
    name: '🤖 Smart Categorization',
    description: 'AI-powered automatic transaction and expense categorization',
    status: 'active',
    accuracy: 92,
    category: 'automation',
    icon: Brain,
    color: 'purple'
  },
  {
    id: 'cash_flow_predictor',
    name: '💸 Cash Flow Predictor',
    description: 'Predict future cash flow and identify potential shortfalls',
    status: 'active',
    accuracy: 87,
    category: 'prediction',
    icon: DollarSign,
    color: 'yellow'
  },
  {
    id: 'customer_insights',
    name: '👥 Customer Analytics',
    description: 'AI-powered customer behavior analysis and segmentation',
    status: 'active',
    accuracy: 91,
    category: 'analytics',
    icon: Users,
    color: 'cyan'
  },
  {
    id: 'document_ai',
    name: '📄 Document Intelligence',
    description: 'Extract data from receipts, invoices, and financial documents',
    status: 'active',
    accuracy: 98,
    category: 'automation',
    icon: FileText,
    color: 'orange'
  },
  {
    id: 'voice_commander',
    name: '🎤 Voice Command AI',
    description: 'Execute complex financial tasks using natural voice commands',
    status: 'active',
    accuracy: 85,
    category: 'interface',
    icon: Mic,
    color: 'pink'
  }
];

const JARVIS_CAPABILITIES = [
  {
    category: 'Financial Analysis',
    commands: [
      "Analyze my spending patterns for the last 3 months",
      "Show me where I can cut costs to save money",
      "What's my projected cash flow for next quarter?",
      "Compare my revenue growth year over year"
    ]
  },
  {
    category: 'Automation & Tasks',
    commands: [
      "Create an invoice for $5000 for Acme Corp",
      "Set up automated payment reminders for overdue invoices",
      "Categorize all uncategorized transactions from last week",
      "Generate a monthly financial report and email it to my team"
    ]
  },
  {
    category: 'Predictions & Insights',
    commands: [
      "When will I hit my revenue target for this year?",
      "What expenses are likely to increase next month?",
      "Predict my tax liability for this quarter",
      "Show me my best performing revenue streams"
    ]
  },
  {
    category: 'Voice Control',
    commands: [
      "Add expense: lunch with client, $45, meals category",
      "How much did I spend on software subscriptions this month?",
      "Create a budget for marketing with $10,000 monthly limit",
      "Send payment reminder to Johnson & Associates"
    ]
  }
];

const ML_MODELS = [
  {
    id: 'revenue_forecasting',
    name: 'Revenue Forecasting Model',
    type: 'Time Series',
    accuracy: 94.2,
    status: 'training',
    last_trained: '2024-01-15',
    predictions: '12-month revenue forecast',
    data_points: 15420
  },
  {
    id: 'expense_classification',
    name: 'Expense Classification Model',
    type: 'Classification',
    accuracy: 96.8,
    status: 'active',
    last_trained: '2024-01-12',
    predictions: 'Automatic expense categorization',
    data_points: 8930
  },
  {
    id: 'fraud_detection',
    name: 'Fraud Detection Model',
    type: 'Anomaly Detection',
    accuracy: 98.1,
    status: 'active',
    last_trained: '2024-01-10',
    predictions: 'Suspicious transaction alerts',
    data_points: 23100
  },
  {
    id: 'customer_lifetime_value',
    name: 'Customer LTV Model',
    type: 'Regression',
    accuracy: 89.5,
    status: 'active',
    last_trained: '2024-01-08',
    predictions: 'Customer value predictions',
    data_points: 5670
  },
  {
    id: 'churn_prediction',
    name: 'Customer Churn Model',
    type: 'Classification',
    accuracy: 91.3,
    status: 'training',
    last_trained: '2024-01-05',
    predictions: 'Customer retention insights',
    data_points: 4250
  }
];

export default function AIAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [aiInsights, setAiInsights] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [selectedModel, setSelectedModel] = useState(null);

  useEffect(() => {
    loadAIInsights();
    initializeJarvis();
  }, []);

  const loadAIInsights = async () => {
    setIsLoading(true);
    try {
      console.log('Loading AI insights...');
      
      let response;
      const requestData = {
        analysis_type: 'comprehensive',
        time_range: '90_days'
      };

      // Method 1: Try the direct function import (if available)
      try {
        const smartInsightsModule = await import('@/api/functions');
        if (smartInsightsModule && smartInsightsModule.smartInsights) {
          console.log('Using direct function import');
          const result = await smartInsightsModule.smartInsights(requestData);
          if (result.data) {
            setAiInsights(result.data.insights || []);
            setIsLoading(false);
            return;
          }
        }
      } catch (importError) {
        console.log('Direct import failed, trying HTTP call:', importError.message);
      }

      // Method 2: Try different URL patterns
      const urlsToTry = [
        '/functions/smartInsights',
        '/api/functions/smartInsights',
        '@/api/functions',
        'functions/smartInsights'
      ];

      for (const url of urlsToTry) {
        try {
          console.log(`Trying URL: ${url}`);
          response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token') || 'demo-token'}`
            },
            body: JSON.stringify(requestData)
          });

          console.log(`Response for ${url}:`, response.status, response.statusText);

          if (response.ok) {
            const result = await response.json();
            if (result.success) {
              setAiInsights(result.data.insights || []);
              setIsLoading(false);
              return;
            }
          }
        } catch (urlError) {
          console.log(`URL ${url} failed:`, urlError.message);
          continue;
        }
      }

      // If all methods fail, throw an error
      throw new Error('All connection methods failed');

    } catch (error) {
      console.error('Error loading AI insights:', error);
      // Always provide default insights
      setAiInsights([
        {
          title: "AI Assistant Ready",
          category: "System Status",
          priority: "high",
          description: "Your AI assistant is ready to help with financial analysis and business insights.",
          action_items: [
            "Ask questions about your finances using the chat",
            "Use voice commands for quick actions",
            "Explore AI-powered workflows and automation"
          ],
          impact: "positive",
          confidence: 100
        },
        {
          title: "Smart Analytics Available",
          category: "AI Capabilities",
          priority: "medium", 
          description: "Advanced AI models are ready to analyze your business data and provide intelligent recommendations.",
          action_items: [
            "Add more transaction data for better insights",
            "Connect integrations for comprehensive analysis",
            "Enable automated reporting and alerts"
          ],
          impact: "positive",
          confidence: 95
        },
        {
          title: "Machine Learning Models Active",
          category: "Predictions",
          priority: "medium",
          description: "Predictive models are running to forecast cash flow, expenses, and revenue trends.",
          action_items: [
            "Review cash flow predictions",
            "Set up budget alerts and monitoring",
            "Enable predictive expense categorization"
          ],
          impact: "positive",
          confidence: 88
        },
        {
          title: "Voice Assistant Enabled",
          category: "Interface",
          priority: "low",
          description: "Jarvis voice commands are ready to execute complex financial tasks hands-free.",
          action_items: [
            'Try saying "Show me my expenses this month"',
            'Use voice to create invoices and transactions',
            'Ask for financial reports and analysis'
          ],
          impact: "positive",
          confidence: 85
        }
      ]);
    }
    setIsLoading(false);
  };

  const initializeJarvis = () => {
    // Add welcome message
    setChatMessages([
      {
        id: 1,
        type: 'ai',
        message: "👋 Hi! I'm Jarvis, your AI financial assistant. I can help you analyze finances, create reports, manage transactions, and much more. Try asking me something or use voice commands!",
        timestamp: new Date().toISOString(),
        confidence: 100
      }
    ]);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      message: inputMessage,
      timestamp: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    try {
      const reply = await askAI(userMessage.message, chatMessages);
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        message: reply,
        timestamp: new Date().toISOString(),
        confidence: 96,
        actions: ["Review Ledger", "Export Insights", "Optimize Expenses"],
        data: {}
      };
      setChatMessages(prev => [...prev, aiResponse]);
    } catch (e) {
      const errorResponse = {
        id: Date.now() + 1,
        type: 'ai',
        message: `⚠️ Error generating response: ${e.message}`,
        timestamp: new Date().toISOString(),
        confidence: 0,
        actions: []
      };
      setChatMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceCommand = async () => {
    if (!voiceEnabled) return;

    setIsListening(true);
    
    try {
      // Simulate voice recognition for demo
      setTimeout(() => {
        setInputMessage("Show me my recent expenses");
        setIsListening(false);
      }, 2000);
    } catch (error) {
      console.error('Voice recognition error:', error);
      setIsListening(false);
    }
  };

  const speakResponse = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const handleModelRetrain = async (modelId) => {
    try {
      setIsLoading(true);
      // Simulate model retraining
      setTimeout(() => {
        alert(`✅ Model "${modelId}" retrained successfully!`);
        setIsLoading(false);
      }, 3000);
    } catch (error) {
      console.error('Model retraining error:', error);
      alert('❌ Error retraining model. Please try again.');
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      active: "bg-green-500/20 text-green-300 border-green-500/30",
      training: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      inactive: "bg-gray-500/20 text-gray-300 border-gray-500/30",
      error: "bg-red-500/20 text-red-300 border-red-500/30"
    };
    return colors[status] || colors.inactive;
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-6">
      <style>{`
        .ai-container {
          background: linear-gradient(135deg, 
            #0a0a0a 0%,
            #1a1a2e 25%,
            #16213e 50%,
            #0f0f23 75%,
            #000000 100%
          );
          min-height: 100vh;
          padding: 2rem;
          position: relative;
        }
        
        .ai-container::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.1) 0%, transparent 50%);
          animation: aiGlow 15s ease-in-out infinite;
          z-index: 1;
          pointer-events: none;
        }
        
        @keyframes aiGlow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
        
        .ai-card {
          background: linear-gradient(145deg, 
            rgba(15, 23, 42, 0.95) 0%,
            rgba(30, 41, 59, 0.9) 100%
          );
          backdrop-filter: blur(25px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          position: relative;
          z-index: 10;
          box-shadow: 
            0 15px 35px rgba(0, 0, 0, 0.3),
            0 0 60px rgba(59, 130, 246, 0.1);
        }
        
        .ai-card:hover {
          border: 1px solid rgba(59, 130, 246, 0.3);
          box-shadow: 
            0 20px 45px rgba(0, 0, 0, 0.4),
            0 0 80px rgba(59, 130, 246, 0.15);
          transform: translateY(-2px);
        }
        
        .chat-message-user {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: white;
          margin-left: 20%;
          border-radius: 18px 18px 4px 18px;
        }
        
        .chat-message-ai {
          background: linear-gradient(135deg, 
            rgba(15, 23, 42, 0.9) 0%,
            rgba(30, 41, 59, 0.8) 100%
          );
          border: 1px solid rgba(59, 130, 246, 0.3);
          color: white;
          margin-right: 20%;
          border-radius: 18px 18px 18px 4px;
        }
        
        .feature-card {
          background: linear-gradient(135deg, 
            rgba(15, 23, 42, 0.8) 0%,
            rgba(30, 41, 59, 0.7) 100%
          );
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg,
            transparent,
            rgba(59, 130, 246, 0.1),
            transparent
          );
          transition: left 0.6s ease;
        }
        
        .feature-card:hover::before {
          left: 100%;
        }
        
        .feature-card:hover {
          transform: translateY(-4px);
          border: 1px solid rgba(59, 130, 246, 0.4);
          box-shadow: 0 10px 30px rgba(59, 130, 246, 0.2);
        }
        
        .model-card {
          background: linear-gradient(135deg, 
            rgba(15, 23, 42, 0.9) 0%,
            rgba(30, 41, 59, 0.8) 100%
          );
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          transition: all 0.3s ease;
        }
        
        .model-card:hover {
          border: 1px solid rgba(147, 51, 234, 0.4);
          box-shadow: 0 8px 25px rgba(147, 51, 234, 0.2);
        }
        
        .voice-button {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border: none;
          border-radius: 50%;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
        }
        
        .voice-button:hover {
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.6);
        }
        
        .voice-button.listening {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          animation: pulse 1.5s infinite;
        }
        
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
      `}</style>

      <div className="ai-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8"
        >
          <div>
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 tracking-tight">
              🤖 AI Assistant & Machine Learning
            </h1>
            <p className="text-gray-400 mt-2 text-xl">Your intelligent financial co-pilot powered by advanced AI</p>
          </div>
          <div className="flex gap-3 items-center">
            <div className="flex items-center gap-2">
              <Label className="text-gray-300">Voice</Label>
              <Switch
                checked={voiceEnabled}
                onCheckedChange={setVoiceEnabled}
              />
            </div>
            <Button 
              onClick={() => loadAIInsights()}
              variant="outline"
              className="bg-slate-800/50 border-slate-600 text-gray-300"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </motion.div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="chat" className="data-[state=active]:bg-blue-600">
              <MessageSquare className="w-4 h-4 mr-2" />
              Jarvis Chat
            </TabsTrigger>
            <TabsTrigger value="features" className="data-[state=active]:bg-purple-600">
              <Brain className="w-4 h-4 mr-2" />
              AI Features ({AI_FEATURES.length})
            </TabsTrigger>
            <TabsTrigger value="models" className="data-[state=active]:bg-green-600">
              <Cpu className="w-4 h-4 mr-2" />
              ML Models ({ML_MODELS.length})
            </TabsTrigger>
            <TabsTrigger value="insights" className="data-[state=active]:bg-orange-600">
              <Lightbulb className="w-4 h-4 mr-2" />
              Smart Insights
            </TabsTrigger>
          </TabsList>

          {/* Jarvis Chat Tab */}
          <TabsContent value="chat" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Chat Interface */}
              <div className="lg:col-span-2">
                <Card className="ai-card h-96">
                  <CardHeader className="border-b border-slate-700">
                    <CardTitle className="text-white flex items-center gap-2">
                      <Bot className="w-5 h-5 text-blue-400" />
                      Jarvis AI Assistant
                      <Badge className="bg-green-600/20 text-green-300 ml-auto">
                        <Activity className="w-3 h-3 mr-1" />
                        Online
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 flex flex-col h-full">
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {chatMessages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`p-3 max-w-xs ${
                            message.type === 'user' ? 'chat-message-user ml-auto' : 'chat-message-ai'
                          }`}
                        >
                          {message.type === 'ai' && (
                            <div className="flex items-center gap-2 mb-2">
                              <Bot className="w-4 h-4 text-blue-400" />
                              <span className="text-xs text-gray-400">
                                Jarvis {message.confidence && `• ${message.confidence}% confident`}
                              </span>
                            </div>
                          )}
                          <p className="text-sm">{message.message}</p>
                          {message.actions && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {message.actions.map((action, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {action}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      ))}
                      {isLoading && (
                        <div className="chat-message-ai p-3">
                          <div className="flex items-center gap-2">
                            <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
                            <span className="text-sm">Jarvis is thinking...</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Input */}
                    <div className="border-t border-slate-700 p-4">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Ask Jarvis anything about your finances..."
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          className="bg-slate-700 border-slate-600"
                        />
                        <button
                          onClick={handleVoiceCommand}
                          className={`voice-button ${isListening ? 'listening' : ''}`}
                          disabled={!voiceEnabled}
                        >
                          {isListening ? (
                            <MicOff className="w-6 h-6 text-white" />
                          ) : (
                            <Mic className="w-6 h-6 text-white" />
                          )}
                        </button>
                        <Button
                          onClick={handleSendMessage}
                          disabled={!inputMessage.trim() || isLoading}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Send
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Voice Commands Guide */}
              <div className="space-y-6">
                <Card className="ai-card">
                  <CardHeader>
                    <CardTitle className="text-white text-lg flex items-center gap-2">
                      <Mic className="w-5 h-5 text-green-400" />
                      Voice Commands
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {JARVIS_CAPABILITIES.map((category, index) => (
                      <div key={index}>
                        <h4 className="text-white font-medium mb-2">{category.category}</h4>
                        <div className="space-y-2">
                          {category.commands.slice(0, 2).map((command, cmdIndex) => (
                            <div key={cmdIndex} className="text-xs text-gray-400 p-2 bg-slate-700/50 rounded">
                              "{command}"
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* AI Features Tab */}
          <TabsContent value="features" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <h2 className="text-2xl font-bold text-white mb-2">AI-Powered Features</h2>
              <p className="text-gray-400">Advanced artificial intelligence tools for your business</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {AI_FEATURES.map((feature, index) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="feature-card p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-${feature.color}-600/20`}>
                      <feature.icon className={`w-6 h-6 text-${feature.color}-400`} />
                    </div>
                    <Badge className={getStatusColor(feature.status)}>
                      {feature.status}
                    </Badge>
                  </div>

                  <h3 className="font-semibold text-white text-lg mb-2">{feature.name}</h3>
                  <p className="text-gray-300 text-sm mb-4">{feature.description}</p>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Accuracy</span>
                        <span className="text-white">{feature.accuracy}%</span>
                      </div>
                      <Progress value={feature.accuracy} className="h-2" />
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Settings className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* ML Models Tab */}
          <TabsContent value="models" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <h2 className="text-2xl font-bold text-white mb-2">Machine Learning Models</h2>
              <p className="text-gray-400">Advanced models powering your AI features</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {ML_MODELS.map((model, index) => (
                <motion.div
                  key={model.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="model-card p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-white text-lg">{model.name}</h3>
                      <p className="text-sm text-gray-400">{model.type}</p>
                    </div>
                    <Badge className={getStatusColor(model.status)}>
                      {model.status}
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Model Accuracy</span>
                        <span className="text-white">{model.accuracy}%</span>
                      </div>
                      <Progress value={model.accuracy} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Last Trained</span>
                        <p className="text-white">{model.last_trained}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Data Points</span>
                        <p className="text-white">{model.data_points.toLocaleString()}</p>
                      </div>
                    </div>

                    <div>
                      <span className="text-gray-400 text-sm">Use Case</span>
                      <p className="text-white text-sm">{model.predictions}</p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleModelRetrain(model.id)}
                        disabled={model.status === 'training'}
                        className="flex-1"
                      >
                        {model.status === 'training' ? (
                          <>
                            <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                            Training
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-3 h-3 mr-1" />
                            Retrain
                          </>
                        )}
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Eye className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Smart Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <h2 className="text-2xl font-bold text-white mb-2">AI-Generated Insights</h2>
              <p className="text-gray-400">Intelligent analysis of your financial data</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aiInsights.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <Lightbulb className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-300 mb-2">No Insights Yet</h3>
                  <p className="text-gray-400 mb-4">AI insights will appear here as you use the system</p>
                  <Button onClick={() => loadAIInsights()} className="bg-orange-600 hover:bg-orange-700">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Insights
                  </Button>
                </div>
              ) : (
                aiInsights.map((insight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="ai-card p-6"
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-orange-600/20">
                        <Lightbulb className="w-5 h-5 text-orange-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{insight.title}</h3>
                        <p className="text-sm text-gray-400">{insight.category}</p>
                      </div>
                      <Badge className="bg-orange-600/20 text-orange-300">
                        <Star className="w-3 h-3 mr-1" />
                        {insight.priority}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-300 text-sm mb-4">{insight.description}</p>
                    
                    {insight.action_items && (
                      <div className="space-y-2">
                        <span className="text-xs text-gray-400 uppercase tracking-wide">Recommendations</span>
                        {insight.action_items.map((item, itemIndex) => (
                          <div key={itemIndex} className="text-xs text-gray-300 p-2 bg-slate-700/50 rounded">
                            • {item}
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
