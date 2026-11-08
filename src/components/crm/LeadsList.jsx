import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  UserPlus, 
  Phone, 
  Mail, 
  Calendar, 
  TrendingUp, 
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Target
} from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

export default function LeadsList({ leads = [], onRefresh }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [sortBy, setSortBy] = useState("created_date");

  // Filter and sort leads
  const filteredLeads = leads
    .filter(lead => {
      const matchesSearch = !searchTerm || 
        lead.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
      const matchesSource = sourceFilter === "all" || lead.lead_source === sourceFilter;
      
      return matchesSearch && matchesStatus && matchesSource;
    })
    .sort((a, b) => {
      if (sortBy === "created_date") {
        return new Date(b.created_date) - new Date(a.created_date);
      }
      if (sortBy === "lead_score") {
        return (b.lead_score || 0) - (a.lead_score || 0);
      }
      if (sortBy === "name") {
        return `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`);
      }
      return 0;
    });

  const getStatusColor = (status) => {
    const colors = {
      new: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      contacted: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      qualified: "bg-green-500/20 text-green-300 border-green-500/30",
      unqualified: "bg-red-500/20 text-red-300 border-red-500/30",
      nurturing: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      converted: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
      lost: "bg-gray-500/20 text-gray-300 border-gray-500/30"
    };
    return colors[status] || "bg-slate-500/20 text-slate-300 border-slate-500/30";
  };

  const getInterestColor = (level) => {
    const colors = {
      hot: "bg-red-500/20 text-red-300",
      warm: "bg-orange-500/20 text-orange-300",
      cold: "bg-blue-500/20 text-blue-300"
    };
    return colors[level] || "bg-slate-500/20 text-slate-300";
  };

  const handleAddLead = () => {
    // This would open a lead creation modal/form
    alert("Add New Lead functionality would open here!");
  };

  const handleViewLead = (lead) => {
    // This would open lead details modal/page
    alert(`View ${lead.first_name} ${lead.last_name} details`);
  };

  const handleEditLead = (lead) => {
    // This would open lead edit modal/form
    alert(`Edit ${lead.first_name} ${lead.last_name}`);
  };

  return (
    <div className="space-y-6">
      <style>{`
        .leads-container {
          background: transparent;
        }
        
        .lead-card {
          background: linear-gradient(145deg, 
            rgba(15, 23, 42, 0.9) 0%,
            rgba(30, 41, 59, 0.8) 100%
          );
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          transition: all 0.3s ease;
        }
        
        .lead-card:hover {
          transform: translateY(-2px);
          border: 1px solid rgba(0, 255, 255, 0.3);
          box-shadow: 
            0 10px 25px rgba(0, 0, 0, 0.3),
            0 0 20px rgba(0, 255, 255, 0.1);
        }
      `}</style>

      {/* Header and Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search leads..."
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
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="qualified">Qualified</SelectItem>
              <SelectItem value="unqualified">Unqualified</SelectItem>
              <SelectItem value="nurturing">Nurturing</SelectItem>
              <SelectItem value="converted">Converted</SelectItem>
              <SelectItem value="lost">Lost</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-40 bg-slate-800/50 border-slate-700 text-white">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="website">Website</SelectItem>
              <SelectItem value="referral">Referral</SelectItem>
              <SelectItem value="social_media">Social Media</SelectItem>
              <SelectItem value="cold_call">Cold Call</SelectItem>
              <SelectItem value="email_campaign">Email Campaign</SelectItem>
              <SelectItem value="trade_show">Trade Show</SelectItem>
              <SelectItem value="advertisement">Advertisement</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40 bg-slate-800/50 border-slate-700 text-white">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="created_date">Latest</SelectItem>
              <SelectItem value="lead_score">Lead Score</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleAddLead} className="bg-cyan-600 hover:bg-cyan-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add New Lead
        </Button>
      </div>

      {/* Leads Grid */}
      <div className="leads-container">
        {filteredLeads.length > 0 ? (
          <div className="grid gap-4">
            {filteredLeads.map((lead, index) => (
              <motion.div
                key={lead.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="lead-card p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-cyan-500/20 rounded-full">
                        <UserPlus className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {lead.first_name} {lead.last_name}
                        </h3>
                        {lead.company_name && (
                          <p className="text-slate-400 text-sm">{lead.company_name}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-300">{lead.email || 'No email'}</span>
                      </div>
                      
                      {lead.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-300">{lead.phone}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-300">
                          {lead.created_date ? format(new Date(lead.created_date), 'MMM d, yyyy') : 'Unknown'}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge className={getStatusColor(lead.status)}>
                        {lead.status?.replace('_', ' ').toUpperCase() || 'NEW'}
                      </Badge>
                      
                      {lead.interest_level && (
                        <Badge className={getInterestColor(lead.interest_level)}>
                          🔥 {lead.interest_level.toUpperCase()}
                        </Badge>
                      )}
                      
                      {lead.lead_source && (
                        <Badge className="bg-purple-500/20 text-purple-300">
                          {lead.lead_source.replace('_', ' ')}
                        </Badge>
                      )}
                      
                      {lead.lead_score && (
                        <Badge className="bg-yellow-500/20 text-yellow-300">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Score: {lead.lead_score}
                        </Badge>
                      )}
                    </div>

                    {lead.needs_description && (
                      <p className="text-slate-300 text-sm line-clamp-2 mb-3">
                        {lead.needs_description}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewLead(lead)}
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditLead(lead)}
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* AI Insights */}
                {lead.ai_insights && (
                  <div className="mt-4 p-3 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4 text-cyan-400" />
                      <span className="text-sm font-medium text-cyan-400">AI Insights</span>
                    </div>
                    {lead.ai_insights.conversion_probability && (
                      <p className="text-xs text-slate-300">
                        Conversion Probability: {lead.ai_insights.conversion_probability}%
                      </p>
                    )}
                    {lead.ai_insights.recommended_actions && lead.ai_insights.recommended_actions.length > 0 && (
                      <p className="text-xs text-slate-300 mt-1">
                        Next: {lead.ai_insights.recommended_actions[0]}
                      </p>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <UserPlus className="w-16 h-16 text-slate-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-300 mb-2">No leads found</h3>
            <p className="text-slate-400 mb-6">
              {searchTerm || statusFilter !== "all" || sourceFilter !== "all" 
                ? "Try adjusting your filters" 
                : "Start by adding your first lead"}
            </p>
            <Button onClick={handleAddLead} className="bg-cyan-600 hover:bg-cyan-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Lead
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}