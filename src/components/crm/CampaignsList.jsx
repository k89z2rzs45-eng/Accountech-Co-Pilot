
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  Zap, 
  Search,
  Plus,
  Eye,
  Edit,
  Play,
  Pause,
  BarChart3,
  Target,
  DollarSign,
  Users,
  TrendingUp,
  Calendar,
  Mail,
  Facebook,
  Linkedin,
  Twitter,
  Globe,
  Phone
} from "lucide-react";
import { motion } from "framer-motion";
import { format, isAfter, isBefore } from "date-fns";

export default function CampaignsList({ campaigns = [], onRefresh }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Filter and sort campaigns
  const filteredCampaigns = campaigns
    .filter(campaign => {
      const matchesSearch = !searchTerm || 
        campaign.campaign_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.objective?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || campaign.status === statusFilter;
      const matchesType = typeFilter === "all" || campaign.campaign_type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    })
    .sort((a, b) => new Date(b.created_date) - new Date(a.created_date));

  const getStatusColor = (status) => {
    const colors = {
      draft: "bg-gray-500/20 text-gray-300 border-gray-500/30",
      scheduled: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      active: "bg-green-500/20 text-green-300 border-green-500/30",
      paused: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      completed: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      cancelled: "bg-red-500/20 text-red-300 border-red-500/30"
    };
    return colors[status] || colors.draft;
  };

  const getTypeIcon = (type) => {
    const icons = {
      email: Mail,
      social_media: Facebook,
      paid_ads: Target,
      content_marketing: Globe,
      webinar: Users,
      trade_show: Calendar,
      direct_mail: Mail,
      cold_calling: Phone,
      referral: TrendingUp,
      other: Zap
    };
    const IconComponent = icons[type] || icons.other;
    return <IconComponent className="w-4 h-4" />;
  };

  const getTypeIconColor = (type) => {
    const colors = {
      email: "text-blue-400",
      social_media: "text-pink-400",
      paid_ads: "text-green-400",
      content_marketing: "text-purple-400",
      webinar: "text-yellow-400",
      trade_show: "text-orange-400",
      direct_mail: "text-cyan-400",
      cold_calling: "text-red-400",
      referral: "text-emerald-400",
      other: "text-slate-400"
    };
    return colors[type] || colors.other;
  };

  const getCampaignProgress = (campaign) => {
    const today = new Date();
    const startDate = new Date(campaign.start_date);
    const endDate = new Date(campaign.end_date);
    
    if (isBefore(today, startDate)) return 0; // Not started
    if (isAfter(today, endDate)) return 100; // Completed
    
    const totalDuration = endDate - startDate;
    const elapsed = today - startDate;
    return Math.max(0, Math.min(100, (elapsed / totalDuration) * 100));
  };

  const calculateROI = (campaign) => {
    const spent = campaign.budget?.spent_budget || 0;
    const revenue = campaign.actual_metrics?.revenue_generated || 0;
    if (spent === 0) return 0;
    return ((revenue - spent) / spent) * 100;
  };

  const handleAddCampaign = () => {
    alert("Add New Campaign functionality would open here!");
  };

  const handleViewCampaign = (campaign) => {
    alert(`View ${campaign.campaign_name} details`);
  };

  const handleEditCampaign = (campaign) => {
    alert(`Edit ${campaign.campaign_name}`);
  };

  const handleToggleCampaign = (campaign) => {
    const newStatus = campaign.status === 'active' ? 'paused' : 'active';
    alert(`${newStatus === 'active' ? 'Resume' : 'Pause'} ${campaign.campaign_name}`);
  };

  return (
    <div className="space-y-6">
      <style>{`
        .campaigns-container {
          background: transparent;
        }
        
        .campaign-card {
          background: linear-gradient(145deg, 
            rgba(15, 23, 42, 0.9) 0%,
            rgba(30, 41, 59, 0.8) 100%
          );
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .campaign-card:hover {
          transform: translateY(-2px);
          border: 1px solid rgba(0, 255, 255, 0.3);
          box-shadow: 
            0 15px 35px rgba(0, 0, 0, 0.3),
            0 0 30px rgba(0, 255, 255, 0.1);
        }
        
        .campaign-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg,
            transparent,
            rgba(0, 255, 255, 0.05),
            transparent
          );
          transition: left 0.6s ease;
        }
        
        .campaign-card:hover::before {
          left: 100%;
        }
      `}</style>

      {/* Header and Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex gap-3 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 bg-slate-800/50 border-slate-700 text-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40 bg-slate-800/50 border-slate-700 text-white">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="social_media">Social Media</SelectItem>
              <SelectItem value="paid_ads">Paid Ads</SelectItem>
              <SelectItem value="content_marketing">Content Marketing</SelectItem>
              <SelectItem value="webinar">Webinar</SelectItem>
              <SelectItem value="trade_show">Trade Show</SelectItem>
              <SelectItem value="direct_mail">Direct Mail</SelectItem>
              <SelectItem value="cold_calling">Cold Calling</SelectItem>
              <SelectItem value="referral">Referral</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleAddCampaign} className="bg-pink-600 hover:bg-pink-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      {/* Campaigns Grid */}
      <div className="campaigns-container">
        {filteredCampaigns.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {filteredCampaigns.map((campaign, index) => {
              const progress = getCampaignProgress(campaign);
              const roi = calculateROI(campaign);
              
              return (
                <motion.div
                  key={campaign.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="campaign-card p-6"
                >
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`p-3 bg-slate-700/50 rounded-full ${getTypeIconColor(campaign.campaign_type)}`}>
                            {getTypeIcon(campaign.campaign_type)}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white">
                              {campaign.campaign_name}
                            </h3>
                            <p className="text-slate-400 capitalize">
                              {campaign.campaign_type?.replace('_', ' ')} • {campaign.objective?.replace('_', ' ')}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge className={getStatusColor(campaign.status)}>
                            {campaign.status?.toUpperCase()}
                          </Badge>
                          
                          {campaign.budget && (
                            <Badge className="bg-green-500/20 text-green-300">
                              Budget: {campaign.budget.currency} {campaign.budget.total_budget?.toLocaleString()}
                            </Badge>
                          )}

                          {campaign.actual_metrics?.leads_generated > 0 && (
                            <Badge className="bg-blue-500/20 text-blue-300">
                              {campaign.actual_metrics.leads_generated} leads
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        {(campaign.status === 'active' || campaign.status === 'paused') && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleCampaign(campaign)}
                            className="border-slate-600 text-slate-300 hover:bg-slate-700"
                          >
                            {campaign.status === 'active' ? 
                              <Pause className="w-4 h-4" /> : 
                              <Play className="w-4 h-4" />
                            }
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewCampaign(campaign)}
                          className="border-slate-600 text-slate-300 hover:bg-slate-700"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditCampaign(campaign)}
                          className="border-slate-600 text-slate-300 hover:bg-slate-700"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Campaign Progress */}
                    {campaign.start_date && campaign.end_date && (
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-slate-400">Campaign Progress</span>
                          <span className="text-sm text-slate-300">{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                        <div className="flex justify-between items-center mt-1 text-xs text-slate-500">
                          <span>{format(new Date(campaign.start_date), 'MMM d')}</span>
                          <span>{format(new Date(campaign.end_date), 'MMM d')}</span>
                        </div>
                      </div>
                    )}

                    {/* Campaign Metrics */}
                    {campaign.actual_metrics && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        {campaign.actual_metrics.impressions > 0 && (
                          <div className="text-center p-3 bg-slate-800/30 rounded-lg">
                            <div className="text-lg font-bold text-cyan-400">
                              {campaign.actual_metrics.impressions.toLocaleString()}
                            </div>
                            <div className="text-xs text-slate-400">Impressions</div>
                          </div>
                        )}

                        {campaign.actual_metrics.clicks > 0 && (
                          <div className="text-center p-3 bg-slate-800/30 rounded-lg">
                            <div className="text-lg font-bold text-blue-400">
                              {campaign.actual_metrics.clicks.toLocaleString()}
                            </div>
                            <div className="text-xs text-slate-400">Clicks</div>
                          </div>
                        )}

                        {campaign.actual_metrics.leads_generated > 0 && (
                          <div className="text-center p-3 bg-slate-800/30 rounded-lg">
                            <div className="text-lg font-bold text-green-400">
                              {campaign.actual_metrics.leads_generated}
                            </div>
                            <div className="text-xs text-slate-400">Leads</div>
                          </div>
                        )}

                        {campaign.actual_metrics.conversions > 0 && (
                          <div className="text-center p-3 bg-slate-800/30 rounded-lg">
                            <div className="text-lg font-bold text-purple-400">
                              {campaign.actual_metrics.conversions}
                            </div>
                            <div className="text-xs text-slate-400">Conversions</div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Performance Summary */}
                    <div className="flex justify-between items-center p-4 bg-slate-800/30 rounded-lg">
                      <div className="flex gap-6">
                        {campaign.actual_metrics?.conversion_rate > 0 && (
                          <div className="text-center">
                            <div className="text-sm font-semibold text-yellow-400">
                              {campaign.actual_metrics.conversion_rate.toFixed(1)}%
                            </div>
                            <div className="text-xs text-slate-400">Conversion</div>
                          </div>
                        )}

                        {campaign.actual_metrics?.cost_per_lead > 0 && (
                          <div className="text-center">
                            <div className="text-sm font-semibold text-orange-400">
                              {campaign.budget?.currency} {campaign.actual_metrics.cost_per_lead.toFixed(0)}
                            </div>
                            <div className="text-xs text-slate-400">Cost/Lead</div>
                          </div>
                        )}

                        {roi !== 0 && (
                          <div className="text-center">
                            <div className={`text-sm font-semibold ${roi >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {roi >= 0 ? '+' : ''}{roi.toFixed(1)}%
                            </div>
                            <div className="text-xs text-slate-400">ROI</div>
                          </div>
                        )}
                      </div>

                      {campaign.budget && (
                        <div className="text-right">
                          <div className="text-sm font-semibold text-slate-300">
                            {campaign.budget.currency} {(campaign.budget.spent_budget || 0).toLocaleString()} / {campaign.budget.total_budget?.toLocaleString()}
                          </div>
                          <div className="text-xs text-slate-400">Spent / Budget</div>
                        </div>
                      )}
                    </div>

                    {/* AI Insights */}
                    {campaign.ai_insights && (
                      <div className="mt-4 p-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-lg border border-pink-500/20">
                        <div className="flex items-center gap-2 mb-3">
                          <BarChart3 className="w-4 h-4 text-pink-400" />
                          <span className="text-sm font-medium text-pink-400">AI Campaign Insights</span>
                        </div>
                        
                        {campaign.ai_insights.performance_analysis && (
                          <p className="text-xs text-slate-300 mb-2">
                            <span className="text-pink-400">Performance:</span> {campaign.ai_insights.performance_analysis}
                          </p>
                        )}

                        {campaign.ai_insights.optimization_suggestions && campaign.ai_insights.optimization_suggestions.length > 0 && (
                          <div className="text-xs">
                            <span className="text-pink-400">Suggestions:</span>
                            <ul className="mt-1 ml-4 space-y-1">
                              {campaign.ai_insights.optimization_suggestions.slice(0, 2).map((suggestion, i) => (
                                <li key={i} className="text-slate-300">• {suggestion}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Zap className="w-16 h-16 text-slate-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-300 mb-2">No campaigns found</h3>
            <p className="text-slate-400 mb-6">
              {searchTerm || statusFilter !== "all" || typeFilter !== "all"
                ? "Try adjusting your filters" 
                : "Start by creating your first marketing campaign"}
            </p>
            <Button onClick={handleAddCampaign} className="bg-pink-600 hover:bg-pink-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Campaign
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
