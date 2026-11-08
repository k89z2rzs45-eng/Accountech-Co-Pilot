import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  Phone, 
  Mail, 
  Calendar, 
  Search,
  Plus,
  Eye,
  Edit,
  UserCheck,
  Building,
  Linkedin,
  Twitter
} from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

export default function ContactsList({ contacts = [], clients = [], leads = [], onRefresh }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  // Filter and sort contacts
  const filteredContacts = contacts
    .filter(contact => {
      const matchesSearch = !searchTerm || 
        contact.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.job_title?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || contact.status === statusFilter;
      const matchesRole = roleFilter === "all" || contact.role_in_company === roleFilter;
      
      return matchesSearch && matchesStatus && matchesRole;
    })
    .sort((a, b) => new Date(b.created_date) - new Date(a.created_date));

  const getRelatedEntity = (contact) => {
    if (contact.client_id) {
      const client = clients.find(c => c.id === contact.client_id);
      return { type: 'Client', name: client?.name || 'Unknown Client', entity: client };
    }
    if (contact.lead_id) {
      const lead = leads.find(l => l.id === contact.lead_id);
      return { type: 'Lead', name: `${lead?.first_name || ''} ${lead?.last_name || ''}`.trim() || 'Unknown Lead', entity: lead };
    }
    return null;
  };

  const getRoleColor = (role) => {
    const colors = {
      decision_maker: "bg-red-500/20 text-red-300 border-red-500/30",
      influencer: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      champion: "bg-green-500/20 text-green-300 border-green-500/30",
      gatekeeper: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      end_user: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      other: "bg-slate-500/20 text-slate-300 border-slate-500/30"
    };
    return colors[role] || colors.other;
  };

  const getStatusColor = (status) => {
    const colors = {
      active: "bg-green-500/20 text-green-300 border-green-500/30",
      inactive: "bg-gray-500/20 text-gray-300 border-gray-500/30",
      do_not_contact: "bg-red-500/20 text-red-300 border-red-500/30"
    };
    return colors[status] || colors.active;
  };

  const handleAddContact = () => {
    alert("Add New Contact functionality would open here!");
  };

  const handleViewContact = (contact) => {
    alert(`View ${contact.first_name} ${contact.last_name} details`);
  };

  const handleEditContact = (contact) => {
    alert(`Edit ${contact.first_name} ${contact.last_name}`);
  };

  return (
    <div className="space-y-6">
      <style>{`
        .contacts-container {
          background: transparent;
        }
        
        .contact-card {
          background: linear-gradient(145deg, 
            rgba(15, 23, 42, 0.9) 0%,
            rgba(30, 41, 59, 0.8) 100%
          );
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          transition: all 0.3s ease;
        }
        
        .contact-card:hover {
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
              placeholder="Search contacts..."
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
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="do_not_contact">Do Not Contact</SelectItem>
            </SelectContent>
          </Select>

          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-40 bg-slate-800/50 border-slate-700 text-white">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="decision_maker">Decision Maker</SelectItem>
              <SelectItem value="influencer">Influencer</SelectItem>
              <SelectItem value="champion">Champion</SelectItem>
              <SelectItem value="gatekeeper">Gatekeeper</SelectItem>
              <SelectItem value="end_user">End User</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleAddContact} className="bg-green-600 hover:bg-green-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add New Contact
        </Button>
      </div>

      {/* Contacts Grid */}
      <div className="contacts-container">
        {filteredContacts.length > 0 ? (
          <div className="grid gap-4">
            {filteredContacts.map((contact, index) => {
              const relatedEntity = getRelatedEntity(contact);
              
              return (
                <motion.div
                  key={contact.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="contact-card p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-green-500/20 rounded-full">
                          <UserCheck className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {contact.first_name} {contact.last_name}
                            {contact.is_primary && (
                              <Badge className="ml-2 bg-yellow-500/20 text-yellow-300 text-xs">
                                Primary
                              </Badge>
                            )}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-slate-400">
                            {contact.job_title && (
                              <>
                                <span>{contact.job_title}</span>
                                {contact.department && <span>• {contact.department}</span>}
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-300">{contact.email || 'No email'}</span>
                        </div>
                        
                        {contact.phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-300">{contact.phone}</span>
                          </div>
                        )}
                        
                        {relatedEntity && (
                          <div className="flex items-center gap-2 text-sm">
                            <Building className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-300">
                              {relatedEntity.type}: {relatedEntity.name}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge className={getStatusColor(contact.status)}>
                          {contact.status?.replace('_', ' ').toUpperCase() || 'ACTIVE'}
                        </Badge>
                        
                        {contact.role_in_company && (
                          <Badge className={getRoleColor(contact.role_in_company)}>
                            {contact.role_in_company.replace('_', ' ')}
                          </Badge>
                        )}
                        
                        {contact.preferred_communication && (
                          <Badge className="bg-blue-500/20 text-blue-300">
                            Prefers {contact.preferred_communication}
                          </Badge>
                        )}

                        {contact.authority_level && contact.authority_level !== 'unknown' && (
                          <Badge className="bg-purple-500/20 text-purple-300">
                            {contact.authority_level} Authority
                          </Badge>
                        )}
                      </div>

                      {/* Social Profiles */}
                      {(contact.linkedin_url || contact.twitter_handle) && (
                        <div className="flex gap-2 mb-3">
                          {contact.linkedin_url && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-blue-600 text-blue-300 hover:bg-blue-600/20 p-2"
                              onClick={() => window.open(contact.linkedin_url, '_blank')}
                            >
                              <Linkedin className="w-4 h-4" />
                            </Button>
                          )}
                          {contact.twitter_handle && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-sky-600 text-sky-300 hover:bg-sky-600/20 p-2"
                              onClick={() => window.open(`https://twitter.com/${contact.twitter_handle}`, '_blank')}
                            >
                              <Twitter className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      )}

                      {/* Last Contact Info */}
                      {contact.last_contact_date && (
                        <div className="text-xs text-slate-400 mb-2">
                          Last contacted: {format(new Date(contact.last_contact_date), 'MMM d, yyyy')}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewContact(contact)}
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditContact(contact)}
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* AI Insights */}
                  {contact.ai_insights && (
                    <div className="mt-4 p-3 bg-slate-800/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4 text-green-400" />
                        <span className="text-sm font-medium text-green-400">Contact Insights</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                        {contact.ai_insights.engagement_score && (
                          <div className="text-slate-300">
                            Engagement: {contact.ai_insights.engagement_score}/100
                          </div>
                        )}
                        {contact.ai_insights.response_rate && (
                          <div className="text-slate-300">
                            Response Rate: {contact.ai_insights.response_rate}%
                          </div>
                        )}
                        {contact.ai_insights.influence_score && (
                          <div className="text-slate-300">
                            Influence: {contact.ai_insights.influence_score}/100
                          </div>
                        )}
                      </div>
                      {contact.ai_insights.recommended_approach && (
                        <p className="text-xs text-slate-300 mt-2">
                          Recommended: {contact.ai_insights.recommended_approach}
                        </p>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-slate-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-300 mb-2">No contacts found</h3>
            <p className="text-slate-400 mb-6">
              {searchTerm || statusFilter !== "all" || roleFilter !== "all" 
                ? "Try adjusting your filters" 
                : "Start by adding your first contact"}
            </p>
            <Button onClick={handleAddContact} className="bg-green-600 hover:bg-green-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Contact
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}