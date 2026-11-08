import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  Plus,
  Eye,
  Edit,
  Clock,
  Users,
  FileText,
  Phone,
  Mail
} from "lucide-react";
import { motion } from "framer-motion";
import { format, isAfter } from "date-fns";

export default function DealsPipeline({ deals = [], onRefresh }) {
  const [selectedStage, setSelectedStage] = useState("all");

  const stages = [
    { key: "prospecting", name: "Prospecting", color: "bg-blue-500/20 text-blue-300" },
    { key: "qualification", name: "Qualification", color: "bg-purple-500/20 text-purple-300" },
    { key: "needs_analysis", name: "Needs Analysis", color: "bg-yellow-500/20 text-yellow-300" },
    { key: "proposal", name: "Proposal", color: "bg-orange-500/20 text-orange-300" },
    { key: "negotiation", name: "Negotiation", color: "bg-red-500/20 text-red-300" },
    { key: "closed_won", name: "Closed Won", color: "bg-green-500/20 text-green-300" },
    { key: "closed_lost", name: "Closed Lost", color: "bg-gray-500/20 text-gray-300" }
  ];

  // Group deals by stage
  const dealsByStage = stages.reduce((acc, stage) => {
    acc[stage.key] = deals.filter(deal => deal.stage === stage.key);
    return acc;
  }, {});

  // Filter deals based on selected stage
  const filteredDeals = selectedStage === "all" ? deals : dealsByStage[selectedStage] || [];

  // Calculate pipeline metrics
  const activePipelineValue = deals
    .filter(deal => !['closed_won', 'closed_lost'].includes(deal.stage))
    .reduce((sum, deal) => sum + (deal.deal_value || 0), 0);

  const wonDealsValue = deals
    .filter(deal => deal.stage === 'closed_won')
    .reduce((sum, deal) => sum + (deal.deal_value || 0), 0);

  const totalDealsValue = deals.reduce((sum, deal) => sum + (deal.deal_value || 0), 0);

  const getDealPriorityColor = (deal) => {
    const today = new Date();
    const closeDate = new Date(deal.expected_close_date);
    const daysToClose = Math.ceil((closeDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysToClose < 0) return "border-red-500 bg-red-500/10";
    if (daysToClose <= 7) return "border-orange-500 bg-orange-500/10";
    if (daysToClose <= 30) return "border-yellow-500 bg-yellow-500/10";
    return "border-slate-600 bg-slate-800/50";
  };

  const handleAddDeal = () => {
    alert("Add New Deal functionality would open here!");
  };

  const handleViewDeal = (deal) => {
    alert(`View ${deal.deal_name} details`);
  };

  const handleEditDeal = (deal) => {
    alert(`Edit ${deal.deal_name}`);
  };

  return (
    <div className="space-y-6">
      <style>{`
        .pipeline-container {
          background: transparent;
        }
        
        .stage-card {
          background: linear-gradient(145deg, 
            rgba(15, 23, 42, 0.9) 0%,
            rgba(30, 41, 59, 0.8) 100%
          );
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          min-height: 300px;
        }
        
        .deal-card {
          background: linear-gradient(145deg, 
            rgba(15, 23, 42, 0.8) 0%,
            rgba(30, 41, 59, 0.7) 100%
          );
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .deal-card:hover {
          transform: translateY(-2px);
          border: 1px solid rgba(0, 255, 255, 0.3);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
        }
      `}</style>

      {/* Pipeline Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Sales Pipeline</h2>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-cyan-400" />
              <span className="text-slate-300 text-sm">
                Pipeline Value: <span className="font-semibold text-cyan-400">${activePipelineValue.toLocaleString()}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-slate-300 text-sm">
                Won This Quarter: <span className="font-semibold text-green-400">${wonDealsValue.toLocaleString()}</span>
              </span>
            </div>
          </div>
        </div>
        
        <Button onClick={handleAddDeal} className="bg-purple-600 hover:bg-purple-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add New Deal
        </Button>
      </div>

      {/* Stage Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => setSelectedStage("all")}
          variant={selectedStage === "all" ? "default" : "outline"}
          size="sm"
          className={selectedStage === "all" ? "bg-cyan-600 text-white" : "border-slate-600 text-slate-300"}
        >
          All Stages ({deals.length})
        </Button>
        {stages.map(stage => {
          const count = dealsByStage[stage.key]?.length || 0;
          return (
            <Button
              key={stage.key}
              onClick={() => setSelectedStage(stage.key)}
              variant={selectedStage === stage.key ? "default" : "outline"}
              size="sm"
              className={selectedStage === stage.key ? 
                "bg-purple-600 text-white" : 
                "border-slate-600 text-slate-300"
              }
            >
              {stage.name} ({count})
            </Button>
          );
        })}
      </div>

      {/* Pipeline Kanban View */}
      <div className="pipeline-container">
        {selectedStage === "all" ? (
          /* Kanban Board View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            {stages.map(stage => {
              const stageDeals = dealsByStage[stage.key] || [];
              const stageValue = stageDeals.reduce((sum, deal) => sum + (deal.deal_value || 0), 0);
              
              return (
                <motion.div
                  key={stage.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="stage-card p-4"
                >
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-white text-sm">{stage.name}</h3>
                      <Badge className={stage.color}>
                        {stageDeals.length}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400">
                      ${stageValue.toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {stageDeals.map((deal, index) => (
                      <motion.div
                        key={deal.id || index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className={`deal-card p-3 ${getDealPriorityColor(deal)}`}
                        onClick={() => handleViewDeal(deal)}
                      >
                        <div className="mb-2">
                          <h4 className="text-sm font-medium text-white line-clamp-1">
                            {deal.deal_name}
                          </h4>
                          {deal.client_id && (
                            <p className="text-xs text-slate-400">Client ID: {deal.client_id}</p>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-green-400">
                            ${(deal.deal_value || 0).toLocaleString()}
                          </span>
                          {deal.probability && (
                            <Badge className="text-xs bg-blue-500/20 text-blue-300">
                              {deal.probability}%
                            </Badge>
                          )}
                        </div>
                        
                        {deal.expected_close_date && (
                          <div className="flex items-center gap-1 text-xs text-slate-400">
                            <Calendar className="w-3 h-3" />
                            <span>{format(new Date(deal.expected_close_date), 'MMM d')}</span>
                          </div>
                        )}
                      </motion.div>
                    ))}
                    
                    {stageDeals.length === 0 && (
                      <div className="text-center py-8">
                        <Target className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                        <p className="text-xs text-slate-500">No deals in this stage</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* List View for Selected Stage */
          <div className="grid gap-4">
            {filteredDeals.length > 0 ? (
              filteredDeals.map((deal, index) => (
                <motion.div
                  key={deal.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`deal-card p-6 ${getDealPriorityColor(deal)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-purple-500/20 rounded-full">
                          <Target className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {deal.deal_name}
                          </h3>
                          {deal.deal_type && (
                            <p className="text-slate-400 text-sm capitalize">
                              {deal.deal_type.replace('_', ' ')}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-green-400" />
                          <span className="text-lg font-semibold text-green-400">
                            ${(deal.deal_value || 0).toLocaleString()}
                          </span>
                        </div>
                        
                        {deal.probability && (
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-blue-400" />
                            <span className="text-slate-300">
                              {deal.probability}% probability
                            </span>
                          </div>
                        )}
                        
                        {deal.expected_close_date && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-300">
                              {format(new Date(deal.expected_close_date), 'MMM d, yyyy')}
                            </span>
                            {isAfter(new Date(), new Date(deal.expected_close_date)) && (
                              <Badge className="bg-red-500/20 text-red-300 text-xs">
                                Overdue
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge className={stages.find(s => s.key === deal.stage)?.color || "bg-slate-500/20 text-slate-300"}>
                          {deal.stage?.replace('_', ' ').toUpperCase()}
                        </Badge>
                        
                        {deal.assigned_to && (
                          <Badge className="bg-cyan-500/20 text-cyan-300">
                            <Users className="w-3 h-3 mr-1" />
                            {deal.assigned_to}
                          </Badge>
                        )}
                      </div>

                      {deal.deal_requirements && (
                        <p className="text-slate-300 text-sm line-clamp-2 mb-3">
                          {deal.deal_requirements}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewDeal(deal)}
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditDeal(deal)}
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Deal Progress */}
                  {deal.probability && (
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-slate-400">Deal Progress</span>
                        <span className="text-xs text-slate-400">{deal.probability}%</span>
                      </div>
                      <Progress value={deal.probability} className="h-2" />
                    </div>
                  )}
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12">
                <Target className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-300 mb-2">
                  No deals in {stages.find(s => s.key === selectedStage)?.name || 'this stage'}
                </h3>
                <p className="text-slate-400 mb-6">
                  Start by adding a new deal to this stage
                </p>
                <Button onClick={handleAddDeal} className="bg-purple-600 hover:bg-purple-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Deal
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}