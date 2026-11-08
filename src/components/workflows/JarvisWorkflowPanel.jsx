import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Mic, 
  MicOff, 
  Brain, 
  Zap, 
  Play, 
  Pause,
  Settings,
  Lightbulb,
  MessageSquare,
  Workflow,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { jarvisWorkflowAI } from "@/api/functions";

export default function JarvisWorkflowPanel({ 
  workflows = [], 
  onCreateWorkflow, 
  onRunWorkflow, 
  businessData = {},
  userContext = {} 
}) {
  const [isListening, setIsListening] = useState(false);
  const [voiceInput, setVoiceInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [jarvisResponse, setJarvisResponse] = useState(null);
  const [textInput, setTextInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeTab, setActiveTab] = useState("voice");
  
  const recognition = useRef(null);
  const [speechSupported, setSpeechSupported] = useState(false);

  useEffect(() => {
    // Initialize speech recognition
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      recognition.current = new window.webkitSpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
      recognition.current.lang = 'en-US';
      
      recognition.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setVoiceInput(transcript);
        processVoiceCommand(transcript);
      };
      
      recognition.current.onend = () => {
        setIsListening(false);
      };
      
      recognition.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      setSpeechSupported(true);
    }

    // Load initial automation suggestions
    loadAutomationSuggestions();
  }, []);

  const startListening = () => {
    if (recognition.current && speechSupported) {
      setIsListening(true);
      setVoiceInput("");
      recognition.current.start();
    }
  };

  const stopListening = () => {
    if (recognition.current && isListening) {
      recognition.current.stop();
      setIsListening(false);
    }
  };

  const processVoiceCommand = async (command) => {
    setIsProcessing(true);
    try {
      const response = await jarvisWorkflowAI({
        command,
        action_type: 'voice_command',
        voice_input: command,
        existing_workflows: workflows,
        business_data: businessData,
        user_context: userContext
      });

      if (response.data && response.data.success !== false) {
        setJarvisResponse(response.data.data);
        
        // Execute actions based on AI response
        if (response.data.data.workflow_to_run) {
          const workflow = workflows.find(w => w.name.toLowerCase().includes(response.data.data.workflow_to_run.toLowerCase()));
          if (workflow && onRunWorkflow) {
            onRunWorkflow(workflow.id);
          }
        }
      }
    } catch (error) {
      console.error('Voice command processing failed:', error);
      setJarvisResponse({
        intent: "error",
        message: "I'm having trouble processing that command. Please try again.",
        suggestions: ["Try speaking more clearly", "Use simple commands"]
      });
    }
    setIsProcessing(false);
  };

  const createAIWorkflow = async (description) => {
    setIsProcessing(true);
    try {
      const response = await jarvisWorkflowAI({
        command: description,
        action_type: 'create_workflow',
        user_context: userContext,
        business_data: businessData
      });

      if (response.data && response.data.success !== false) {
        const workflowConfig = response.data.data;
        if (onCreateWorkflow) {
          await onCreateWorkflow(workflowConfig);
        }
        setJarvisResponse({
          intent: "workflow_created",
          message: `✅ I've created a new workflow: "${workflowConfig.name}"`,
          workflow: workflowConfig
        });
      }
    } catch (error) {
      console.error('AI workflow creation failed:', error);
      setJarvisResponse({
        intent: "error", 
        message: "I couldn't create that workflow. Please try again with more details."
      });
    }
    setIsProcessing(false);
  };

  const loadAutomationSuggestions = async () => {
    try {
      const response = await jarvisWorkflowAI({
        action_type: 'suggest_automations',
        business_data: businessData,
        existing_workflows: workflows
      });

      if (response.data && response.data.data.suggestions) {
        setSuggestions(response.data.data.suggestions);
      }
    } catch (error) {
      console.log('Could not load automation suggestions:', error);
    }
  };

  const optimizeWorkflows = async () => {
    setIsProcessing(true);
    try {
      const response = await jarvisWorkflowAI({
        command: "Analyze and optimize my existing workflows",
        action_type: 'optimize_workflow',
        existing_workflows: workflows
      });

      if (response.data && response.data.data) {
        setJarvisResponse({
          intent: "optimization",
          message: "🚀 I've analyzed your workflows and found optimization opportunities:",
          optimizations: response.data.data.optimizations || []
        });
      }
    } catch (error) {
      console.error('Workflow optimization failed:', error);
    }
    setIsProcessing(false);
  };

  return (
    <div className="space-y-6">
      {/* Jarvis Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-xl text-white"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full ${isProcessing ? 'animate-pulse bg-white/20' : 'bg-white/10'}`}>
              <Brain className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Jarvis AI Assistant</h2>
              <p className="text-indigo-100">
                Voice-controlled workflow automation and business intelligence
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-white/20 text-white">
            {workflows.length} Active Workflows
          </Badge>
        </div>
      </motion.div>

      {/* AI Response Display */}
      <AnimatePresence>
        {jarvisResponse && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 bg-blue-50 border border-blue-200 rounded-lg"
          >
            <div className="flex items-start gap-3">
              <MessageSquare className="w-5 h-5 text-blue-600 mt-1" />
              <div className="flex-1">
                <p className="text-blue-900 font-medium">{jarvisResponse.message}</p>
                {jarvisResponse.optimizations && (
                  <ul className="mt-3 space-y-1">
                    {jarvisResponse.optimizations.map((opt, index) => (
                      <li key={index} className="text-sm text-blue-800 flex items-center gap-2">
                        <CheckCircle className="w-3 h-3" />
                        {opt}
                      </li>
                    ))}
                  </ul>
                )}
                {jarvisResponse.suggestions && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {jarvisResponse.suggestions.map((suggestion, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {suggestion}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => setJarvisResponse(null)}
                className="text-blue-600"
              >
                ✕
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Control Panel */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="voice" className="flex items-center gap-2">
            <Mic className="w-4 h-4" />
            Voice Control
          </TabsTrigger>
          <TabsTrigger value="create" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            AI Creator
          </TabsTrigger>
          <TabsTrigger value="suggestions" className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Smart Suggestions
          </TabsTrigger>
          <TabsTrigger value="optimize" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Optimization
          </TabsTrigger>
        </TabsList>

        {/* Voice Control Tab */}
        <TabsContent value="voice" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="w-5 h-5 text-indigo-600" />
                Voice Commands
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {speechSupported ? (
                <>
                  <div className="text-center">
                    <Button
                      onClick={isListening ? stopListening : startListening}
                      disabled={isProcessing}
                      className={`w-24 h-24 rounded-full ${
                        isListening 
                          ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                          : 'bg-indigo-600 hover:bg-indigo-700'
                      }`}
                    >
                      {isListening ? (
                        <MicOff className="w-8 h-8" />
                      ) : isProcessing ? (
                        <Loader2 className="w-8 h-8 animate-spin" />
                      ) : (
                        <Mic className="w-8 h-8" />
                      )}
                    </Button>
                    <p className="mt-2 text-sm text-gray-600">
                      {isListening 
                        ? "🎤 Listening... Speak your command" 
                        : isProcessing 
                        ? "🤖 Processing your request..."
                        : "Click to start voice command"}
                    </p>
                  </div>

                  {voiceInput && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium">You said:</p>
                      <p className="text-gray-800">"{voiceInput}"</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-800">Workflow Control</h4>
                      <p className="text-sm text-green-700">"Run invoice reminder workflow"</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-800">Report Generation</h4>
                      <p className="text-sm text-blue-700">"Create expense report for December"</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <h4 className="font-semibold text-purple-800">Data Analysis</h4>
                      <p className="text-sm text-purple-700">"Analyze cash flow trends"</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center p-8">
                  <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                  <p className="text-gray-600">Voice recognition is not supported in your browser.</p>
                  <p className="text-sm text-gray-500">Please use Chrome or Edge for voice commands.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Workflow Creator Tab */}
        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-indigo-600" />
                AI Workflow Creator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Describe the workflow you need:
                </label>
                <Textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="E.g., 'Send email reminders for overdue invoices every week' or 'Create monthly expense reports automatically'"
                  rows={3}
                  className="w-full"
                />
              </div>
              <Button
                onClick={() => createAIWorkflow(textInput)}
                disabled={!textInput.trim() || isProcessing}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating AI Workflow...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Create Intelligent Workflow
                  </>
                )}
              </Button>

              <div className="space-y-2">
                <h4 className="font-semibold">Quick Templates:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {[
                    "Weekly financial summary emails",
                    "Automatic invoice follow-ups",
                    "Monthly expense categorization",
                    "Overdue payment alerts",
                    "Vendor payment scheduling",
                    "Revenue trend notifications"
                  ].map((template, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setTextInput(template)}
                      className="text-left justify-start"
                    >
                      {template}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Smart Suggestions Tab */}
        <TabsContent value="suggestions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-600" />
                AI-Recommended Automations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {suggestions.map((suggestion, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-semibold text-gray-900">{suggestion.title}</h4>
                      <Badge className={`${
                        suggestion.roi === 'High' ? 'bg-green-100 text-green-800' :
                        suggestion.roi === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {suggestion.roi} ROI
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{suggestion.problem}</p>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Time Savings:</span>
                        <p className="text-sm text-green-600 font-medium">{suggestion.time_savings}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Complexity:</span>
                        <p className="text-sm text-blue-600 font-medium">{suggestion.complexity}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">{suggestion.workflow}</p>
                    <Button
                      size="sm"
                      onClick={() => createAIWorkflow(suggestion.workflow)}
                      disabled={isProcessing}
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      <Zap className="w-3 h-3 mr-1" />
                      Create This Workflow
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Optimization Tab */}
        <TabsContent value="optimize" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Workflow Optimization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Let Jarvis analyze your existing workflows and suggest performance improvements.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Workflow className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-semibold">Active Workflows</h4>
                  <p className="text-2xl font-bold text-blue-600">{workflows.length}</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h4 className="font-semibold">Success Rate</h4>
                  <p className="text-2xl font-bold text-green-600">94%</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <TrendingUp className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                  <h4 className="font-semibold">Time Saved</h4>
                  <p className="text-2xl font-bold text-yellow-600">12h/wk</p>
                </div>
              </div>

              <Button
                onClick={optimizeWorkflows}
                disabled={isProcessing || workflows.length === 0}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing Workflows...
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Optimize My Workflows
                  </>
                )}
              </Button>

              {workflows.length === 0 && (
                <p className="text-center text-gray-500 italic">
                  Create some workflows first to enable optimization analysis.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}