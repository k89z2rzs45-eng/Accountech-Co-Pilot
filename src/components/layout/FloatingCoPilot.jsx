import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  BarChart3,
  Target,
  Lightbulb,
  X,
  Minimize2,
  Maximize2,
  Mic,
  Settings,
  Sparkles,
} from "lucide-react";
import VoiceAssistant from "../ai/VoiceAssistant";
import AISettingsModal from "../ai/AISettingsModal";

export default function FloatingCoPilot({
  transactions = [],
  expenses = [],
  budgets = [],
  invoices = [],
  currency = "USD",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);
  const [activeInsights, setActiveInsights] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [aiStatus, setAiStatus] = useState("ready");
  const [showAISettings, setShowAISettings] = useState(false);

  useEffect(() => {
    generateInsights();
    const interval = setInterval(generateInsights, 30000);
    return () => clearInterval(interval);
  }, [transactions, expenses, invoices, budgets, currency]);

  const generateInsights = () => {
    const insights = [];

    try {
      const totalRevenue = (transactions || [])
        .filter((t) => t?.type === "income")
        .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

      const totalExpenses = [...(transactions || []).filter((t) => t?.type === "expense"), ...(expenses || [])]
        .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

      const netProfit = totalRevenue - totalExpenses;
      const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

      if (profitMargin > 20) {
        insights.push({
          id: "high_profit_margin",
          type: "success",
          icon: TrendingUp,
          title: "Excellent Profit Margin",
          message: `Your profit margin is ${profitMargin.toFixed(1)}% - well above industry average!`,
          action: "View detailed analysis",
          priority: "medium",
        });
      } else if (profitMargin < 5) {
        insights.push({
          id: "low_profit_margin",
          type: "warning",
          icon: AlertTriangle,
          title: "Low Profit Margin Alert",
          message: `Profit margin is only ${profitMargin.toFixed(1)}%. Consider cost optimization.`,
          action: "Optimize expenses",
          priority: "high",
        });
      }

      const pendingInvoices = (invoices || [])
        .filter((i) => ["sent", "overdue"].includes(i?.status))
        .reduce((sum, i) => sum + (Number(i.total) || 0), 0);

      if (pendingInvoices > totalRevenue * 0.3) {
        insights.push({
          id: "pending_invoices",
          type: "info",
          icon: DollarSign,
          title: "Outstanding Invoices",
          message: `${currency} ${pendingInvoices.toLocaleString()} in pending payments`,
          action: "Follow up on invoices",
          priority: "medium",
        });
      }

      (budgets || []).forEach((budget) => {
        const spent = (expenses || [])
          .filter((e) => e.category === budget.category)
          .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

        const usage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;

        if (usage > 90) {
          insights.push({
            id: `budget_exceeded_${budget.id}`,
            type: "error",
            icon: Target,
            title: "Budget Exceeded",
            message: `${(budget.category || "budget").replace("_", " ")} budget is ${usage.toFixed(0)}% used`,
            action: "Adjust budget",
            priority: "high",
          });
        } else if (usage > 75) {
          insights.push({
            id: `budget_warning_${budget.id}`,
            type: "warning",
            icon: Target,
            title: "Budget Warning",
            message: `${(budget.category || "budget").replace("_", " ")} budget is ${usage.toFixed(0)}% used`,
            action: "Monitor spending",
            priority: "medium",
          });
        }
      });

      const potentialDeductions = (expenses || [])
        .filter(
          (e) =>
            !e.tax_deductible &&
            ["office_supplies", "software", "professional_services"].includes(e.category)
        )
        .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

      if (potentialDeductions > 1000) {
        insights.push({
          id: "tax_optimization",
          type: "info",
          icon: Lightbulb,
          title: "Tax Optimization Opportunity",
          message: `${currency} ${potentialDeductions.toLocaleString()} in potential deductions found`,
          action: "Review tax deductions",
          priority: "medium",
        });
      }

      setActiveInsights(insights);
      setNotificationCount(insights.filter((i) => i.priority === "high").length);
      setAiStatus(insights.length > 0 ? "analyzing" : "ready");
    } catch (error) {
      console.error("Error generating insights:", error);
      setAiStatus("ready");
    }
  };

  const handleInsightAction = (insight) => {
    console.log("Handling insight action:", insight);
    setActiveInsights((prev) => prev.filter((i) => i.id !== insight.id));
    setNotificationCount((prev) => Math.max(0, prev - (insight.priority === "high" ? 1 : 0)));
  };

  const getInsightColor = (type) => {
    switch (type) {
      case "success":
        return "border-green-500 bg-green-500/10";
      case "warning":
        return "border-yellow-500 bg-yellow-500/10";
      case "error":
        return "border-red-500 bg-red-500/10";
      case "info":
      default:
        return "border-blue-500 bg-blue-500/10";
    }
  };

  const getInsightIconColor = (type) => {
    switch (type) {
      case "success":
        return "text-green-400";
      case "warning":
        return "text-yellow-400";
      case "error":
        return "text-red-400";
      case "info":
      default:
        return "text-blue-400";
    }
  };

  if (!isOpen && !showVoiceAssistant) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed bottom-6 right-6 z-[1000] flex h-20 w-20 cursor-pointer items-center justify-center rounded-full border-2 border-white/20 bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-700 shadow-[0_12px_30px_rgba(139,92,246,0.4),0_0_60px_rgba(124,58,237,0.3)] transition-all duration-300 hover:scale-110"
        onClick={() => setIsOpen(true)}
      >
        <Brain className="h-8 w-8 text-white drop-shadow-lg" />
        {notificationCount > 0 && (
          <div className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-slate-900 bg-gradient-to-r from-red-500 to-red-600 px-1 text-[10px] font-bold text-white">
            {notificationCount > 9 ? "9+" : notificationCount}
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 400 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: 400 }}
            className="fixed bottom-6 right-6 z-[1000] flex h-[600px] w-[420px] flex-col overflow-hidden rounded-[24px] border border-violet-500/30 bg-slate-900/95 shadow-[0_25px_50px_rgba(0,0,0,0.5),0_0_100px_rgba(139,92,246,0.3)] backdrop-blur-xl"
          >
            <div className="border-b border-white/10 bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-indigo-500/10 p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-indigo-600">
                    <Brain className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">AI Co-Pilot</h3>
                    <p className="text-sm text-violet-300">Your financial assistant</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => setShowAISettings(true)}
                    size="sm"
                    variant="ghost"
                    className="text-gray-400 hover:text-white"
                    title="AI Settings"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => setIsMinimized(!isMinimized)}
                    size="sm"
                    variant="ghost"
                    className="text-gray-400 hover:text-white"
                  >
                    {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                  </Button>
                  <Button
                    onClick={() => setIsOpen(false)}
                    size="sm"
                    variant="ghost"
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      aiStatus === "ready"
                        ? "bg-green-400"
                        : aiStatus === "analyzing"
                          ? "bg-yellow-400 animate-pulse"
                          : "bg-blue-400 animate-pulse"
                    }`}
                  />
                  <span className="text-sm capitalize text-gray-300">{aiStatus}</span>
                </div>

                <div className="flex gap-1">
                  <Badge className="border-violet-500/30 bg-violet-500/20 text-violet-300">
                    {activeInsights.length} insights
                  </Badge>
                </div>
              </div>
            </div>

            {!isMinimized && (
              <div className="flex flex-1 flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="mb-4">
                    <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-300">
                      <Sparkles className="h-4 w-4 text-violet-400" />
                      Smart Insights
                    </h4>

                    {activeInsights.length === 0 ? (
                      <div className="py-8 text-center text-gray-400">
                        <BarChart3 className="mx-auto mb-3 h-12 w-12 opacity-50" />
                        <p>No insights available</p>
                        <p className="text-sm">Add more financial data to get AI recommendations</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {activeInsights.map((insight, index) => {
                          const IconComponent = insight.icon;
                          return (
                            <motion.div
                              key={insight.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              onClick={() => handleInsightAction(insight)}
                              className={`cursor-pointer rounded-xl border p-4 backdrop-blur-md transition-all hover:-translate-y-0.5 hover:shadow-lg ${getInsightColor(insight.type)}`}
                            >
                              <div className="flex items-start gap-3">
                                <IconComponent className={`mt-0.5 h-5 w-5 flex-shrink-0 ${getInsightIconColor(insight.type)}`} />
                                <div className="flex-1">
                                  <h5 className="mb-1 font-semibold text-white">{insight.title}</h5>
                                  <p className="mb-2 text-sm text-gray-300">{insight.message}</p>
                                  <div className="flex items-center justify-between">
                                    <Badge
                                      className={`text-xs ${
                                        insight.priority === "high"
                                          ? "border-red-500/30 bg-red-500/20 text-red-300"
                                          : insight.priority === "medium"
                                            ? "border-yellow-500/30 bg-yellow-500/20 text-yellow-300"
                                            : "border-blue-500/30 bg-blue-500/20 text-blue-300"
                                      }`}
                                    >
                                      {insight.priority} priority
                                    </Badge>
                                    <span className="text-xs text-violet-300">{insight.action}</span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-white/10 p-4">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => setShowVoiceAssistant(true)}
                      className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
                    >
                      <Mic className="h-4 w-4" />
                      Voice Assistant
                    </Button>

                    <Button
                      onClick={() => console.log("Open full AI chat")}
                      className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
                    >
                      <Brain className="h-4 w-4" />
                      Full Chat
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {showVoiceAssistant && (
          <VoiceAssistant
            isActive={showVoiceAssistant}
            onToggle={setShowVoiceAssistant}
            onClose={() => setShowVoiceAssistant(false)}
            transactions={transactions}
            expenses={expenses}
            invoices={invoices}
            currency={currency}
          />
        )}
      </AnimatePresence>

      <AISettingsModal
        isOpen={showAISettings}
        onClose={() => setShowAISettings(false)}
      />
    </>
  );
}
