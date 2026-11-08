import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  UserPlus, 
  TrendingUp, 
  DollarSign, 
  Phone, 
  Mail, 
  Calendar,
  Target,
  Activity,
  FileText,
  Settings,
  Filter,
  Search,
  Plus,
  BarChart3,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";

// Import CRM entities
import { Lead } from "@/api/entities";
import { Deal } from "@/api/entities";
import { Contact } from "@/api/entities";
import { Activity as ActivityEntity } from "@/api/entities";
import { Task } from "@/api/entities";
import { Campaign } from "@/api/entities";
import { Client } from "@/api/entities";

// Import CRM components
import LeadsList from "../components/crm/LeadsList";
import DealsPipeline from "../components/crm/DealsPipeline";
import ContactsList from "../components/crm/ContactsList";
import ActivitiesList from "../components/crm/ActivitiesList";
import CRMDashboard from "../components/crm/CRMDashboard";
import CampaignsList from "../components/crm/CampaignsList";

export default function CRM() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Data states
  const [leads, setLeads] = useState([]);
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [activities, setActivities] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [clients, setClients] = useState([]);

  // Metrics states
  const [crmMetrics, setCrmMetrics] = useState({
    totalLeads: 0,
    totalDeals: 0,
    totalClients: 0,
    pipelineValue: 0,
    conversionRate: 0,
    avgDealSize: 0,
    activeCampaigns: 0,
    overdueActivities: 0
  });

  useEffect(() => {
    loadCRMData();
  }, []);

  useEffect(() => {
    if (searchParams.get('tab') !== activeTab) {
      setSearchParams({ tab: activeTab });
    }
  }, [activeTab]);

  const loadCRMData = async () => {
    setIsLoading(true);
    try {
      // Load all CRM data
      const [
        leadsData,
        dealsData,
        contactsData,
        activitiesData,
        tasksData,
        campaignsData,
        clientsData
      ] = await Promise.all([
        Lead.list('-created_date', 100).catch(() => []),
        Deal.list('-created_date', 100).catch(() => []),
        Contact.list('-created_date', 100).catch(() => []),
        ActivityEntity.list('-activity_date', 100).catch(() => []),
        Task.list('-created_date', 100).catch(() => []),
        Campaign.list('-created_date', 50).catch(() => []),
        Client.list('-created_date', 100).catch(() => [])
      ]);

      setLeads(leadsData);
      setDeals(dealsData);
      setContacts(contactsData);
      setActivities(activitiesData);
      setTasks(tasksData);
      setCampaigns(campaignsData);
      setClients(clientsData);

      // Calculate CRM metrics
      calculateCRMMetrics(leadsData, dealsData, clientsData, activitiesData, campaignsData);

    } catch (error) {
      console.error('Error loading CRM data:', error);
    }
    setIsLoading(false);
  };

  const calculateCRMMetrics = (leadsData, dealsData, clientsData, activitiesData, campaignsData) => {
    const totalLeads = leadsData.length;
    const totalDeals = dealsData.length;
    const totalClients = clientsData.length;
    
    const pipelineValue = dealsData
      .filter(deal => !['closed_won', 'closed_lost'].includes(deal.stage))
      .reduce((sum, deal) => sum + (deal.deal_value || 0), 0);

    const wonDeals = dealsData.filter(deal => deal.stage === 'closed_won').length;
    const conversionRate = totalLeads > 0 ? ((wonDeals / totalLeads) * 100) : 0;

    const avgDealSize = wonDeals > 0 ? 
      dealsData
        .filter(deal => deal.stage === 'closed_won')
        .reduce((sum, deal) => sum + (deal.deal_value || 0), 0) / wonDeals 
      : 0;

    const activeCampaigns = campaignsData.filter(campaign => campaign.status === 'active').length;

    const today = new Date();
    const overdueActivities = activitiesData.filter(activity => {
      if (activity.status === 'scheduled' && activity.activity_date) {
        return new Date(activity.activity_date) < today;
      }
      return false;
    }).length;

    setCrmMetrics({
      totalLeads,
      totalDeals,
      totalClients,
      pipelineValue,
      conversionRate: Math.round(conversionRate * 10) / 10,
      avgDealSize: Math.round(avgDealSize),
      activeCampaigns,
      overdueActivities
    });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadCRMData();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-cyan-200 text-lg">Loading CRM System...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-6">
      <style>{`
        /* SICK CRM FUTURE DESIGN STYLES */
        .crm-container {
          background: linear-gradient(145deg, 
            #0f172a 0%,
            #1e293b 25%,
            #334155 50%,
            #1e293b 75%,
            #0f172a 100%
          );
          background-size: 400% 400%;
          animation: crmGlow 20s ease-in-out infinite;
        }
        
        @keyframes crmGlow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .crm-metric-card {
          background: linear-gradient(145deg, 
            rgba(15, 23, 42, 0.95) 0%,
            rgba(30, 41, 59, 0.9) 100%
          );
          backdrop-filter: blur(20px);
          border: 2px solid transparent;
          border-image: linear-gradient(45deg, #00ffff, #ff00ff, #00ff00) 1;
          border-radius: 16px;
          box-shadow: 
            0 15px 35px rgba(0, 0, 0, 0.3),
            0 0 40px rgba(0, 255, 255, 0.1);
          transition: all 0.3s ease;
        }
        
        .crm-metric-card:hover {
          transform: translateY(-5px) scale(1.02);
          border-image: linear-gradient(45deg, #ff00ff, #00ff00, #ffff00) 1;
          box-shadow: 
            0 20px 45px rgba(0, 0, 0, 0.4),
            0 0 60px rgba(255, 0, 255, 0.2);
        }
        
        .crm-tab-button {
          background: linear-gradient(135deg, 
            rgba(15, 23, 42, 0.8) 0%,
            rgba(30, 41, 59, 0.7) 100%
          );
          border: 2px solid rgba(0, 255, 255, 0.3);
          border-radius: 12px;
          color: #94a3b8;
          transition: all 0.3s ease;
        }
        
        .crm-tab-button.active {
          background: linear-gradient(135deg, 
            rgba(0, 255, 255, 0.2) 0%,
            rgba(0, 255, 136, 0.15) 100%
          );
          border: 2px solid rgba(0, 255, 255, 0.6);
          color: #00ffff;
          box-shadow: 0 0 25px rgba(0, 255, 255, 0.3);
        }
        
        .crm-section-card {
          background: linear-gradient(145deg, 
            rgba(15, 23, 42, 0.98) 0%,
            rgba(30, 41, 59, 0.95) 100%
          );
          backdrop-filter: blur(25px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          box-shadow: 
            0 15px 35px rgba(0, 0, 0, 0.3),
            0 0 60px rgba(37, 99, 235, 0.1);
        }
      `}</style>

      <div className="crm-container p-8 rounded-3xl">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-green-400 bg-clip-text text-transparent mb-2">
              🚀 Customer Relationship Management
            </h1>
            <p className="text-slate-400 text-lg">
              Complete sales pipeline, lead management, and customer intelligence
            </p>
            <div className="flex items-center gap-4 mt-3">
              <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                <Activity className="w-3 h-3 mr-1" />
                {crmMetrics.totalLeads} Active Leads
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                <Target className="w-3 h-3 mr-1" />
                ${crmMetrics.pipelineValue.toLocaleString()} Pipeline
              </Badge>
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                <TrendingUp className="w-3 h-3 mr-1" />
                {crmMetrics.conversionRate}% Conversion
              </Badge>
            </div>
          </div>

          <div className="flex gap-3 items-center">
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              disabled={refreshing}
              className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20"
            >
              <Activity className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </motion.div>

        {/* CRM Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="crm-metric-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-cyan-500/20 rounded-full">
                <UserPlus className="w-6 h-6 text-cyan-400" />
              </div>
              <Badge className="bg-cyan-500/20 text-cyan-300">
                +{Math.round(crmMetrics.totalLeads * 0.15)} This Month
              </Badge>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {crmMetrics.totalLeads}
            </h3>
            <p className="text-slate-400 text-sm">Total Leads</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="crm-metric-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/20 rounded-full">
                <Target className="w-6 h-6 text-purple-400" />
              </div>
              <Badge className="bg-purple-500/20 text-purple-300">
                {crmMetrics.totalDeals} Active
              </Badge>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              ${crmMetrics.pipelineValue.toLocaleString()}
            </h3>
            <p className="text-slate-400 text-sm">Pipeline Value</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="crm-metric-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-full">
                <Users className="w-6 h-6 text-green-400" />
              </div>
              <Badge className="bg-green-500/20 text-green-300">
                {crmMetrics.totalClients} Active
              </Badge>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {crmMetrics.conversionRate}%
            </h3>
            <p className="text-slate-400 text-sm">Conversion Rate</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="crm-metric-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/20 rounded-full">
                <DollarSign className="w-6 h-6 text-yellow-400" />
              </div>
              <Badge className="bg-yellow-500/20 text-yellow-300">
                Average Deal
              </Badge>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              ${crmMetrics.avgDealSize.toLocaleString()}
            </h3>
            <p className="text-slate-400 text-sm">Avg Deal Size</p>
          </motion.div>
        </div>

        {/* CRM Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-8">
          <TabsList className="grid w-full grid-cols-6 bg-transparent gap-2">
            <TabsTrigger 
              value="dashboard" 
              className={`crm-tab-button ${activeTab === 'dashboard' ? 'active' : ''}`}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            
            <TabsTrigger 
              value="leads" 
              className={`crm-tab-button ${activeTab === 'leads' ? 'active' : ''}`}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Leads
            </TabsTrigger>
            
            <TabsTrigger 
              value="deals" 
              className={`crm-tab-button ${activeTab === 'deals' ? 'active' : ''}`}
            >
              <Target className="w-4 h-4 mr-2" />
              Deals
            </TabsTrigger>
            
            <TabsTrigger 
              value="contacts" 
              className={`crm-tab-button ${activeTab === 'contacts' ? 'active' : ''}`}
            >
              <Users className="w-4 h-4 mr-2" />
              Contacts
            </TabsTrigger>
            
            <TabsTrigger 
              value="activities" 
              className={`crm-tab-button ${activeTab === 'activities' ? 'active' : ''}`}
            >
              <Activity className="w-4 h-4 mr-2" />
              Activities
            </TabsTrigger>
            
            <TabsTrigger 
              value="campaigns" 
              className={`crm-tab-button ${activeTab === 'campaigns' ? 'active' : ''}`}
            >
              <Zap className="w-4 h-4 mr-2" />
              Campaigns
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            <Card className="crm-section-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-3">
                  <BarChart3 className="w-6 h-6 text-cyan-400" />
                  CRM Dashboard & Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CRMDashboard 
                  leads={leads}
                  deals={deals}
                  clients={clients}
                  activities={activities}
                  campaigns={campaigns}
                  metrics={crmMetrics}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leads Tab */}
          <TabsContent value="leads">
            <Card className="crm-section-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-3">
                  <UserPlus className="w-6 h-6 text-cyan-400" />
                  Lead Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LeadsList 
                  leads={leads}
                  onRefresh={loadCRMData}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Deals Tab */}
          <TabsContent value="deals">
            <Card className="crm-section-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-3">
                  <Target className="w-6 h-6 text-purple-400" />
                  Sales Pipeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DealsPipeline 
                  deals={deals}
                  onRefresh={loadCRMData}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contacts Tab */}
          <TabsContent value="contacts">
            <Card className="crm-section-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-3">
                  <Users className="w-6 h-6 text-green-400" />
                  Contact Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ContactsList 
                  contacts={contacts}
                  clients={clients}
                  leads={leads}
                  onRefresh={loadCRMData}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activities Tab */}
          <TabsContent value="activities">
            <Card className="crm-section-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-3">
                  <Activity className="w-6 h-6 text-yellow-400" />
                  Customer Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ActivitiesList 
                  activities={activities}
                  leads={leads}
                  clients={clients}
                  deals={deals}
                  contacts={contacts}
                  onRefresh={loadCRMData}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns">
            <Card className="crm-section-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-3">
                  <Zap className="w-6 h-6 text-pink-400" />
                  Marketing Campaigns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CampaignsList 
                  campaigns={campaigns}
                  onRefresh={loadCRMData}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}