import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain, 
  Send, 
  Mic, 
  MicOff, 
  Zap, 
  Sparkles, 
  TrendingUp, 
  AlertTriangle,
  Lightbulb,
  Target,
  Calculator,
  FileText,
  BarChart3,
  DollarSign,
  Users,
  Settings,
  Minimize2,
  Maximize2,
  X
} from "lucide-react";
import { askAI } from "@/api/aiService";
import AISettingsModal from "./AISettingsModal";

const AI_SUGGESTIONS = [
  { icon: Calculator, text: "Analyze this month's expenses", action: "analyze_expenses" },
  { icon: TrendingUp, text: "Show revenue trends", action: "revenue_trends" },
  { icon: FileText, text: "Generate tax report", action: "tax_report" },
  { icon: BarChart3, text: "Create budget forecast", action: "budget_forecast" },
  { icon: AlertTriangle, text: "Find unusual transactions", action: "anomaly_detection" },
  { icon: Target, text: "Set financial goals", action: "set_goals" }
];

export default function AICoPilot({ 
  isMinimized = false,
  onToggleMinimize,
  onClose,
  transactions = [],
  invoices = [],
  expenses = [],
  currency = "USD"
}) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "👋 Hey there! I'm your AI financial co-pilot. I can help you analyze your finances, create reports, and optimize your business. What would you like to explore today?",
      timestamp: new Date(),
      suggestions: AI_SUGGESTIONS.slice(0, 3)
    }
  ]);
  
  const [inputValue, setInputValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiStatus, setAiStatus] = useState("ready"); // ready, thinking, responding
  const [showAISettings, setShowAISettings] = useState(false);
  const messagesEndRef = useRef(null);
  const recognition = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize speech recognition if available
    if ('webkitSpeechRecognition' in window) {
      recognition.current = new window.webkitSpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
      recognition.current.lang = 'en-US';

      recognition.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
      };

      recognition.current.onerror = () => {
        setIsListening(false);
      };

      recognition.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleVoiceInput = () => {
    if (!recognition.current) {
      alert("Speech recognition not supported in this browser");
      return;
    }

    if (isListening) {
      recognition.current.stop();
      setIsListening(false);
    } else {
      recognition.current.start();
      setIsListening(true);
    }
  };

  const generateAIResponse = async (userMessage, action = null) => {
    setAiStatus("thinking");
    
    let response = "";
    let suggestions = [];
    
    try {
      if (action) {
        const actionPrompts = {
          analyze_expenses: "Analyze my expenses, break down spending patterns, and give 3 cost-saving suggestions.",
          revenue_trends: "Analyze my revenue trends, top revenue drivers, and future growth opportunities.",
          tax_report: "Analyze my deductible business expenses and summarize potential tax write-offs.",
          budget_forecast: "Examine my budgets and project whether I am staying within target.",
          anomaly_detection: "Check my recent transactions for unusual amounts, duplicates, or anomalies.",
          set_goals: "Suggest realistic revenue and profit goals based on current financial performance."
        };
        const query = actionPrompts[action] || userMessage;
        response = await askAI(query, messages);
        suggestions = AI_SUGGESTIONS.slice(0, 3);
      } else {
        response = await askAI(userMessage, messages);
        suggestions = AI_SUGGESTIONS.slice(1, 4);
      }
    } catch (err) {
      console.error("AI Generation error:", err);
      response = `⚠️ Error generating AI response: ${err.message}. Please verify your AI settings.`;
      suggestions = AI_SUGGESTIONS.slice(0, 3);
    }
    
    setAiStatus("responding");
    await new Promise(resolve => setTimeout(resolve, 300));
    setAiStatus("ready");
    
    return { response, suggestions };
  };

  const handleSendMessage = async (message = inputValue, action = null) => {
    if (!message.trim() && !action) return;
    
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsProcessing(true);
    setAiStatus("thinking");
    
    try {
      const { response, suggestions } = await generateAIResponse(message, action);
      
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: response,
        timestamp: new Date(),
        suggestions: suggestions || []
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI response error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: "Sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
        suggestions: []
      };
      setMessages(prev => [...prev, errorMessage]);
    }
    
    setIsProcessing(false);
    setAiStatus("ready");
  };

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion.text, suggestion.action);
  };

  const MessageComponent = ({ message }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      {message.type === 'ai' && (
        <div className="ai-avatar">
          <Brain className="w-5 h-5 text-purple-400" />
        </div>
      )}
      
      <div className={`message-bubble ${message.type === 'user' ? 'user-message' : 'ai-message'}`}>
        <div className="message-content">
          {message.content}
        </div>
        <div className="message-timestamp">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
        
        {message.suggestions && message.suggestions.length > 0 && (
          <div className="suggestions-container">
            <p className="suggestions-label">💡 Try these:</p>
            <div className="suggestions-grid">
              {message.suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  variant="outline"
                  size="sm"
                  className="suggestion-button"
                >
                  <suggestion.icon className="w-4 h-4 mr-2" />
                  {suggestion.text}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {message.type === 'user' && (
        <div className="user-avatar">
          <Users className="w-5 h-5 text-blue-400" />
        </div>
      )}
    </motion.div>
  );

  if (isMinimized) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="ai-copilot-minimized"
        onClick={onToggleMinimize}
      >
        <style jsx>{`
          .ai-copilot-minimized {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 
              0 8px 25px rgba(139, 92, 246, 0.4),
              0 0 40px rgba(124, 58, 237, 0.3);
            transition: all 0.3s ease;
            z-index: 1000;
            animation: aiPulse 3s ease-in-out infinite;
          }
          
          .ai-copilot-minimized:hover {
            transform: scale(1.1);
            box-shadow: 
              0 12px 35px rgba(139, 92, 246, 0.6),
              0 0 60px rgba(124, 58, 237, 0.5);
          }
          
          @keyframes aiPulse {
            0%, 100% { 
              box-shadow: 
                0 8px 25px rgba(139, 92, 246, 0.4),
                0 0 40px rgba(124, 58, 237, 0.3);
            }
            50% { 
              box-shadow: 
                0 12px 35px rgba(139, 92, 246, 0.6),
                0 0 60px rgba(124, 58, 237, 0.5);
            }
          }
        `}</style>
        
        <Brain className="w-7 h-7 text-white" />
        
        {aiStatus === "thinking" && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full animate-pulse" />
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="ai-copilot-container"
    >
      <style jsx>{`
        .ai-copilot-container {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 400px;
          height: 600px;
          background: linear-gradient(145deg, 
            rgba(15, 23, 42, 0.98) 0%,
            rgba(30, 41, 59, 0.96) 50%,
            rgba(51, 65, 85, 0.94) 100%
          );
          border: 2px solid transparent;
          border-image: linear-gradient(45deg, #8b5cf6, #7c3aed, #6d28d9) 1;
          border-radius: 20px;
          backdrop-filter: blur(30px);
          box-shadow: 
            0 25px 50px rgba(0, 0, 0, 0.5),
            0 0 80px rgba(139, 92, 246, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          z-index: 1000;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        
        .ai-header {
          background: linear-gradient(135deg, 
            rgba(139, 92, 246, 0.1) 0%,
            rgba(124, 58, 237, 0.08) 100%
          );
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding: 1rem;
          flex-shrink: 0;
        }
        
        .ai-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: rgba(139, 92, 246, 0.8);
          margin-top: 0.25rem;
        }
        
        .status-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          transition: all 0.3s ease;
        }
        
        .status-indicator.ready {
          background: #10b981;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
        }
        
        .status-indicator.thinking {
          background: #f59e0b;
          animation: statusPulse 1s ease-in-out infinite;
        }
        
        .status-indicator.responding {
          background: #3b82f6;
          animation: statusPulse 0.8s ease-in-out infinite;
        }
        
        @keyframes statusPulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        
        .messages-container {
          flex: 1;
          padding: 1rem;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        
        .messages-scroll {
          flex: 1;
          overflow-y: auto;
          padding-right: 0.5rem;
        }
        
        .message-bubble {
          max-width: 80%;
          padding: 0.75rem 1rem;
          border-radius: 16px;
          margin-bottom: 1rem;
          position: relative;
        }
        
        .ai-message {
          background: linear-gradient(135deg, 
            rgba(139, 92, 246, 0.1) 0%,
            rgba(124, 58, 237, 0.08) 100%
          );
          border: 1px solid rgba(139, 92, 246, 0.2);
          color: #e2e8f0;
          margin-right: auto;
        }
        
        .user-message {
          background: linear-gradient(135deg, 
            rgba(59, 130, 246, 0.15) 0%,
            rgba(37, 99, 235, 0.1) 100%
          );
          border: 1px solid rgba(59, 130, 246, 0.3);
          color: #e2e8f0;
          margin-left: auto;
        }
        
        .message-content {
          white-space: pre-wrap;
          line-height: 1.5;
          font-size: 0.875rem;
        }
        
        .message-timestamp {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.5);
          margin-top: 0.5rem;
          text-align: right;
        }
        
        .ai-avatar, .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 0.5rem;
        }
        
        .ai-avatar {
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
          box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
        }
        
        .user-avatar {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
        }
        
        .suggestions-container {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .suggestions-label {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 0.5rem;
          font-weight: 600;
        }
        
        .suggestions-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        
        .suggestion-button {
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.08) 0%,
            rgba(255, 255, 255, 0.04) 100%
          );
          border: 1px solid rgba(139, 92, 246, 0.3);
          color: #e2e8f0;
          font-size: 0.75rem;
          padding: 0.5rem 0.75rem;
          border-radius: 8px;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }
        
        .suggestion-button:hover {
          background: linear-gradient(135deg, 
            rgba(139, 92, 246, 0.2) 0%,
            rgba(124, 58, 237, 0.15) 100%
          );
          border: 1px solid rgba(139, 92, 246, 0.5);
          transform: translateY(-1px);
        }
        
        .input-container {
          padding: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          flex-shrink: 0;
        }
        
        .input-wrapper {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }
        
        .ai-input {
          flex: 1;
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.08) 0%,
            rgba(255, 255, 255, 0.04) 100%
          );
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          color: #e2e8f0;
          padding: 0.75rem 1rem;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }
        
        .ai-input:focus {
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.12) 0%,
            rgba(255, 255, 255, 0.08) 100%
          );
          border: 1px solid rgba(139, 92, 246, 0.5);
          box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
          outline: none;
        }
        
        .ai-input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }
        
        .voice-button {
          background: linear-gradient(135deg, 
            rgba(239, 68, 68, 0.2) 0%,
            rgba(220, 38, 38, 0.15) 100%
          );
          border: 1px solid rgba(239, 68, 68, 0.4);
          color: #ef4444;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
        
        .voice-button.listening {
          background: linear-gradient(135deg, 
            rgba(239, 68, 68, 0.4) 0%,
            rgba(220, 38, 38, 0.3) 100%
          );
          animation: voicePulse 1s ease-in-out infinite;
        }
        
        .voice-button:hover {
          background: linear-gradient(135deg, 
            rgba(239, 68, 68, 0.3) 0%,
            rgba(220, 38, 38, 0.2) 100%
          );
          transform: scale(1.05);
        }
        
        @keyframes voicePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        .send-button {
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
          border: none;
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
        }
        
        .send-button:hover {
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(139, 92, 246, 0.6);
        }
        
        .send-button:disabled {
          background: linear-gradient(135deg, #6b7280, #4b5563);
          box-shadow: none;
          transform: none;
          opacity: 0.6;
        }
        
        .thinking-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.875rem;
          padding: 1rem;
        }
        
        .thinking-dots {
          display: flex;
          gap: 0.25rem;
        }
        
        .thinking-dot {
          width: 6px;
          height: 6px;
          background: #8b5cf6;
          border-radius: 50%;
          animation: thinkingBounce 1.4s ease-in-out infinite both;
        }
        
        .thinking-dot:nth-child(1) { animation-delay: -0.32s; }
        .thinking-dot:nth-child(2) { animation-delay: -0.16s; }
        
        @keyframes thinkingBounce {
          0%, 80%, 100% { 
            transform: scale(0);
            opacity: 0.5;
          } 
          40% { 
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
      
      <Card className="h-full flex flex-col bg-transparent border-none">
        {/* Header */}
        <div className="ai-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">AI Co-Pilot</h3>
                <div className="ai-status">
                  <div className={`status-indicator ${aiStatus}`} />
                  {aiStatus === 'ready' && 'Ready to help'}
                  {aiStatus === 'thinking' && 'Analyzing...'}
                  {aiStatus === 'responding' && 'Generating response...'}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={() => setShowAISettings(true)} 
                size="sm" 
                variant="ghost"
                className="text-gray-400 hover:text-white"
                title="AI Brain Configuration"
              >
                <Settings className="w-4 h-4" />
              </Button>
              <Button 
                onClick={onToggleMinimize} 
                size="sm" 
                variant="ghost"
                className="text-gray-400 hover:text-white"
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
              <Button 
                onClick={onClose} 
                size="sm" 
                variant="ghost"
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="messages-container">
          <ScrollArea className="messages-scroll">
            <AnimatePresence>
              {messages.map((message) => (
                <MessageComponent key={message.id} message={message} />
              ))}
            </AnimatePresence>
            
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="thinking-indicator"
              >
                <Brain className="w-5 h-5 text-purple-400" />
                <span>AI is thinking</span>
                <div className="thinking-dots">
                  <div className="thinking-dot" />
                  <div className="thinking-dot" />
                  <div className="thinking-dot" />
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </ScrollArea>
        </div>

        {/* Input */}
        <div className="input-container">
          <div className="input-wrapper">
            <Button
              onClick={handleVoiceInput}
              className={`voice-button ${isListening ? 'listening' : ''}`}
              disabled={isProcessing}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
            
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              placeholder="Ask me about your finances..."
              className="ai-input"
              disabled={isProcessing}
            />
            
            <Button
              onClick={() => handleSendMessage()}
              className="send-button"
              disabled={!inputValue.trim() || isProcessing}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      <AISettingsModal 
        isOpen={showAISettings} 
        onClose={() => setShowAISettings(false)} 
      />
    </motion.div>
  );
}