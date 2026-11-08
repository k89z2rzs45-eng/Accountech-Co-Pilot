import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Volume2, VolumeX, Brain, Zap, Sparkles, X } from "lucide-react";

const VOICE_COMMANDS = {
  // Navigation
  'open dashboard': { action: 'navigate', target: 'Dashboard' },
  'show transactions': { action: 'navigate', target: 'Transactions' },
  'open invoices': { action: 'navigate', target: 'Invoices' },
  'view budgets': { action: 'navigate', target: 'Budgets' },
  'show analytics': { action: 'navigate', target: 'Analytics' },
  
  // Quick actions
  'add expense': { action: 'modal', target: 'expense_form' },
  'create invoice': { action: 'modal', target: 'invoice_form' },
  'new transaction': { action: 'modal', target: 'transaction_form' },
  'add client': { action: 'modal', target: 'client_form' },
  
  // Financial queries
  'show revenue': { action: 'query', target: 'revenue_summary' },
  'total expenses': { action: 'query', target: 'expense_summary' },
  'profit this month': { action: 'query', target: 'monthly_profit' },
  'cash flow': { action: 'query', target: 'cash_flow' },
  
  // AI analysis
  'analyze expenses': { action: 'ai_analysis', target: 'expense_analysis' },
  'find anomalies': { action: 'ai_analysis', target: 'anomaly_detection' },
  'budget forecast': { action: 'ai_analysis', target: 'budget_forecast' },
  'tax optimization': { action: 'ai_analysis', target: 'tax_optimization' },
  
  // System
  'help': { action: 'help' },
  'what can you do': { action: 'capabilities' },
  'jarvis stop': { action: 'stop' },
  'cancel': { action: 'cancel' }
};

export default function VoiceAssistant({
  isActive = false,
  onToggle,
  onCommand,
  onClose,
  transactions = [],
  expenses = [],
  invoices = [],
  currency = "USD"
}) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [lastCommand, setLastCommand] = useState(null);
  const [response, setResponse] = useState("");
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  
  const recognition = useRef(null);
  const synthesis = useRef(null);

  useEffect(() => {
    initializeVoiceServices();
    return () => {
      cleanup();
    };
  }, []);

  useEffect(() => {
    if (isActive && !isListening) {
      startListening();
    } else if (!isActive && isListening) {
      stopListening();
    }
  }, [isActive]);

  const initializeVoiceServices = () => {
    // Initialize Speech Recognition
    if ('webkitSpeechRecognition' in window) {
      recognition.current = new window.webkitSpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.interimResults = true;
      recognition.current.lang = 'en-US';
      recognition.current.maxAlternatives = 3;

      recognition.current.onstart = () => {
        console.log('Voice recognition started');
      };

      recognition.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          const confidence = event.results[i][0].confidence;

          if (event.results[i].isFinal) {
            finalTranscript += transcript;
            setConfidence(confidence);
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript || interimTranscript);
        
        if (finalTranscript) {
          processVoiceCommand(finalTranscript.toLowerCase().trim());
        }
      };

      recognition.current.onerror = (event) => {
        console.error('Voice recognition error:', event.error);
        if (event.error === 'not-allowed') {
          speak("I need microphone permission to work. Please enable it in your browser settings.");
        }
      };

      recognition.current.onend = () => {
        if (isActive) {
          // Restart listening if we're still active
          setTimeout(startListening, 1000);
        }
      };
    }

    // Initialize Speech Synthesis
    if ('speechSynthesis' in window) {
      synthesis.current = window.speechSynthesis;
    }
  };

  const cleanup = () => {
    if (recognition.current) {
      recognition.current.stop();
    }
    if (synthesis.current) {
      synthesis.current.cancel();
    }
  };

  const startListening = () => {
    if (recognition.current && !isListening) {
      try {
        recognition.current.start();
        setIsListening(true);
        setTranscript("");
      } catch (error) {
        console.error('Error starting recognition:', error);
      }
    }
  };

  const stopListening = () => {
    if (recognition.current && isListening) {
      recognition.current.stop();
      setIsListening(false);
    }
  };

  const speak = (text) => {
    if (!voiceEnabled || !synthesis.current) return;

    // Cancel any ongoing speech
    synthesis.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthesis.current.speak(utterance);
    setResponse(text);
  };

  const processVoiceCommand = async (command) => {
    console.log('Processing command:', command);
    
    // Find matching command
    let matchedCommand = null;
    let bestMatch = '';
    
    for (const [key, value] of Object.entries(VOICE_COMMANDS)) {
      if (command.includes(key.toLowerCase()) || key.toLowerCase().includes(command)) {
        if (key.length > bestMatch.length) {
          matchedCommand = value;
          bestMatch = key;
        }
      }
    }

    if (matchedCommand) {
      setLastCommand({ command: bestMatch, ...matchedCommand });
      await executeCommand(matchedCommand);
    } else {
      // Try AI interpretation
      await handleUnrecognizedCommand(command);
    }
  };

  const executeCommand = async (command) => {
    let responseText = '';

    switch (command.action) {
      case 'navigate':
        responseText = `Opening ${command.target.replace(/([A-Z])/g, ' $1').toLowerCase()}`;
        speak(responseText);
        if (onCommand) {
          onCommand('navigate', { target: command.target });
        }
        break;

      case 'modal':
        responseText = `Opening ${command.target.replace(/_/g, ' ')} form`;
        speak(responseText);
        if (onCommand) {
          onCommand('modal', { target: command.target });
        }
        break;

      case 'query':
        responseText = await handleFinancialQuery(command.target);
        speak(responseText);
        break;

      case 'ai_analysis':
        responseText = `Starting ${command.target.replace(/_/g, ' ')} analysis`;
        speak(responseText);
        if (onCommand) {
          onCommand('ai_analysis', { target: command.target });
        }
        break;

      case 'help':
        responseText = "I can help you navigate the app, create transactions and invoices, analyze your finances, and answer questions about your business. Try saying things like 'show revenue', 'add expense', or 'analyze my spending'.";
        speak(responseText);
        break;

      case 'capabilities':
        responseText = "I can navigate pages, create records, analyze financial data, generate reports, and answer questions about your business. I understand natural language, so speak naturally!";
        speak(responseText);
        break;

      case 'stop':
      case 'cancel':
        responseText = "Voice assistant stopping";
        speak(responseText);
        setTimeout(() => onToggle(false), 2000);
        break;

      default:
        responseText = "I'm not sure how to handle that command yet.";
        speak(responseText);
    }
  };

  const handleFinancialQuery = async (queryType) => {
    const totalRevenue = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + (t.amount || 0), 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + (t.amount || 0), 0) + 
      expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    
    const netProfit = totalRevenue - totalExpenses;
    const pendingInvoices = invoices
      .filter(i => i.status === 'sent' || i.status === 'overdue')
      .reduce((sum, i) => sum + (i.total || 0), 0);

    switch (queryType) {
      case 'revenue_summary':
        return `Your total revenue is ${currency} ${totalRevenue.toLocaleString()}. This includes ${transactions.filter(t => t.type === 'income').length} income transactions.`;
      
      case 'expense_summary':
        return `Your total expenses are ${currency} ${totalExpenses.toLocaleString()}. This includes ${transactions.filter(t => t.type === 'expense').length} expense transactions and ${expenses.length} recorded expenses.`;
      
      case 'monthly_profit':
        return `Your current profit is ${currency} ${netProfit.toLocaleString()}. That's a ${netProfit >= 0 ? 'profit' : 'loss'} of ${Math.abs(netProfit)} this period.`;
      
      case 'cash_flow':
        return `Your cash flow shows ${currency} ${totalRevenue.toLocaleString()} in revenue and ${currency} ${totalExpenses.toLocaleString()} in expenses, with ${currency} ${pendingInvoices.toLocaleString()} in pending invoices.`;
      
      default:
        return "I couldn't find that financial information. Please try being more specific.";
    }
  };

  const handleUnrecognizedCommand = async (command) => {
    // Simple AI-like interpretation for common patterns
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('revenue') || lowerCommand.includes('income') || lowerCommand.includes('sales')) {
      await executeCommand({ action: 'query', target: 'revenue_summary' });
    } else if (lowerCommand.includes('expense') || lowerCommand.includes('spend') || lowerCommand.includes('cost')) {
      await executeCommand({ action: 'query', target: 'expense_summary' });
    } else if (lowerCommand.includes('profit') || lowerCommand.includes('margin')) {
      await executeCommand({ action: 'query', target: 'monthly_profit' });
    } else if (lowerCommand.includes('invoice')) {
      await executeCommand({ action: 'navigate', target: 'Invoices' });
    } else if (lowerCommand.includes('dashboard') || lowerCommand.includes('home')) {
      await executeCommand({ action: 'navigate', target: 'Dashboard' });
    } else {
      const responseText = `I heard "${command}" but I'm not sure what you want me to do. Try saying something like "show revenue" or "add expense".`;
      speak(responseText);
    }
  };

  if (!isActive) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="voice-assistant-overlay"
      >
        <style jsx>{`
          .voice-assistant-overlay {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 2000;
            width: 400px;
            background: linear-gradient(145deg, 
              rgba(15, 23, 42, 0.98) 0%,
              rgba(30, 41, 59, 0.96) 50%,
              rgba(51, 65, 85, 0.94) 100%
            );
            border: 2px solid transparent;
            border-image: linear-gradient(45deg, #ef4444, #f97316, #eab308) 1;
            border-radius: 24px;
            backdrop-filter: blur(30px);
            box-shadow: 
              0 25px 50px rgba(0, 0, 0, 0.5),
              0 0 100px rgba(239, 68, 68, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
            padding: 2rem;
            text-align: center;
          }
          
          .voice-visualizer {
            width: 120px;
            height: 120px;
            margin: 0 auto 2rem;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            transition: all 0.3s ease;
          }
          
          .voice-visualizer.listening {
            background: linear-gradient(135deg, 
              rgba(239, 68, 68, 0.2) 0%,
              rgba(249, 115, 22, 0.15) 50%,
              rgba(234, 179, 8, 0.2) 100%
            );
            border: 3px solid rgba(239, 68, 68, 0.5);
            animation: voiceListening 2s ease-in-out infinite;
          }
          
          .voice-visualizer.speaking {
            background: linear-gradient(135deg, 
              rgba(34, 197, 94, 0.2) 0%,
              rgba(59, 130, 246, 0.15) 50%,
              rgba(168, 85, 247, 0.2) 100%
            );
            border: 3px solid rgba(34, 197, 94, 0.5);
            animation: voiceSpeaking 1s ease-in-out infinite;
          }
          
          .voice-visualizer.idle {
            background: linear-gradient(135deg, 
              rgba(107, 114, 128, 0.2) 0%,
              rgba(75, 85, 99, 0.15) 100%
            );
            border: 3px solid rgba(107, 114, 128, 0.3);
          }
          
          @keyframes voiceListening {
            0%, 100% { 
              transform: scale(1);
              box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
            }
            50% { 
              transform: scale(1.05);
              box-shadow: 0 0 0 20px rgba(239, 68, 68, 0);
            }
          }
          
          @keyframes voiceSpeaking {
            0%, 100% { 
              transform: scale(1);
              box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
            }
            50% { 
              transform: scale(1.1);
              box-shadow: 0 0 0 15px rgba(34, 197, 94, 0);
            }
          }
          
          .voice-waves {
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
          
          .voice-wave {
            position: absolute;
            border: 2px solid;
            border-radius: 50%;
            opacity: 0;
          }
          
          .voice-wave:nth-child(1) {
            width: 100%;
            height: 100%;
            border-color: rgba(239, 68, 68, 0.6);
            animation: voiceWave 2s ease-out infinite;
          }
          
          .voice-wave:nth-child(2) {
            width: 80%;
            height: 80%;
            top: 10%;
            left: 10%;
            border-color: rgba(249, 115, 22, 0.5);
            animation: voiceWave 2s ease-out infinite 0.5s;
          }
          
          .voice-wave:nth-child(3) {
            width: 60%;
            height: 60%;
            top: 20%;
            left: 20%;
            border-color: rgba(234, 179, 8, 0.4);
            animation: voiceWave 2s ease-out infinite 1s;
          }
          
          @keyframes voiceWave {
            0% {
              transform: scale(0.8);
              opacity: 1;
            }
            100% {
              transform: scale(1.2);
              opacity: 0;
            }
          }
          
          .voice-status {
            font-size: 1.25rem;
            font-weight: 700;
            color: #f1f5f9;
            margin-bottom: 0.5rem;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
          }
          
          .voice-transcript {
            background: linear-gradient(135deg, 
              rgba(255, 255, 255, 0.05) 0%,
              rgba(255, 255, 255, 0.02) 100%
            );
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 1rem;
            margin: 1.5rem 0;
            min-height: 3rem;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .transcript-text {
            color: #e2e8f0;
            font-size: 0.875rem;
            line-height: 1.5;
            text-align: center;
          }
          
          .transcript-placeholder {
            color: rgba(255, 255, 255, 0.5);
            font-style: italic;
          }
          
          .voice-response {
            background: linear-gradient(135deg, 
              rgba(59, 130, 246, 0.1) 0%,
              rgba(37, 99, 235, 0.08) 100%
            );
            border: 1px solid rgba(59, 130, 246, 0.3);
            border-radius: 12px;
            padding: 1rem;
            margin-bottom: 1.5rem;
            color: #e2e8f0;
            font-size: 0.875rem;
            line-height: 1.5;
          }
          
          .voice-controls {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin-top: 2rem;
          }
          
          .voice-control-button {
            background: linear-gradient(135deg, 
              rgba(255, 255, 255, 0.08) 0%,
              rgba(255, 255, 255, 0.04) 100%
            );
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: #e2e8f0;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
          }
          
          .voice-control-button:hover {
            background: linear-gradient(135deg, 
              rgba(255, 255, 255, 0.15) 0%,
              rgba(255, 255, 255, 0.1) 100%
            );
            transform: scale(1.05);
          }
          
          .voice-control-button.active {
            background: linear-gradient(135deg, #ef4444, #dc2626);
            border: 1px solid rgba(239, 68, 68, 0.5);
            color: white;
          }
          
          .confidence-meter {
            margin-top: 1rem;
          }
          
          .confidence-bar {
            width: 100%;
            height: 4px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 2px;
            overflow: hidden;
          }
          
          .confidence-fill {
            height: 100%;
            background: linear-gradient(90deg, #ef4444, #f97316, #eab308);
            border-radius: 2px;
            transition: width 0.3s ease;
          }
          
          .command-suggestions {
            margin-top: 1.5rem;
            text-align: left;
          }
          
          .suggestions-title {
            color: #94a3b8;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 0.75rem;
            text-align: center;
          }
          
          .suggestions-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.5rem;
            font-size: 0.75rem;
            color: rgba(255, 255, 255, 0.7);
          }
          
          .suggestion-item {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 6px;
            padding: 0.5rem;
            text-align: center;
            transition: all 0.3s ease;
          }
          
          .suggestion-item:hover {
            background: rgba(255, 255, 255, 0.1);
            color: #e2e8f0;
          }
        `}</style>

        <Card className="bg-transparent border-none">
          <CardContent className="p-0">
            {/* Close button */}
            <div className="flex justify-end mb-4">
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Voice Visualizer */}
            <div className={`voice-visualizer ${
              isSpeaking ? 'speaking' : isListening ? 'listening' : 'idle'
            }`}>
              {isListening && (
                <div className="voice-waves">
                  <div className="voice-wave"></div>
                  <div className="voice-wave"></div>
                  <div className="voice-wave"></div>
                </div>
              )}
              
              <div className="relative z-10">
                {isSpeaking ? (
                  <Volume2 className="w-8 h-8 text-green-400" />
                ) : isListening ? (
                  <Mic className="w-8 h-8 text-red-400" />
                ) : (
                  <Brain className="w-8 h-8 text-gray-400" />
                )}
              </div>
            </div>

            {/* Status */}
            <div className="voice-status">
              {isSpeaking ? 'Speaking...' : 
               isListening ? 'Listening...' : 
               'Voice Assistant Ready'}
            </div>

            {/* Transcript */}
            <div className="voice-transcript">
              {transcript ? (
                <div className="transcript-text">{transcript}</div>
              ) : (
                <div className="transcript-placeholder">
                  {isListening ? 'Say something...' : 'Press microphone to start'}
                </div>
              )}
            </div>

            {/* Confidence Meter */}
            {confidence > 0 && (
              <div className="confidence-meter">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-400">Confidence</span>
                  <Badge variant="outline" className="text-xs">
                    {Math.round(confidence * 100)}%
                  </Badge>
                </div>
                <div className="confidence-bar">
                  <div 
                    className="confidence-fill" 
                    style={{ width: `${confidence * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Response */}
            {response && (
              <div className="voice-response">
                <div className="flex items-start gap-2">
                  <Brain className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>{response}</div>
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="voice-controls">
              <Button
                onClick={() => setIsListening(!isListening)}
                className={`voice-control-button ${isListening ? 'active' : ''}`}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </Button>
              
              <Button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`voice-control-button ${voiceEnabled ? 'active' : ''}`}
              >
                {voiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </Button>
            </div>

            {/* Command Suggestions */}
            <div className="command-suggestions">
              <div className="suggestions-title">Try saying:</div>
              <div className="suggestions-grid">
                <div className="suggestion-item">"Show revenue"</div>
                <div className="suggestion-item">"Add expense"</div>
                <div className="suggestion-item">"Open dashboard"</div>
                <div className="suggestion-item">"Create invoice"</div>
                <div className="suggestion-item">"Analyze expenses"</div>
                <div className="suggestion-item">"Help"</div>
              </div>
            </div>

            {/* Last Command */}
            {lastCommand && (
              <div className="mt-4 text-center">
                <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                  Last: {lastCommand.command}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}