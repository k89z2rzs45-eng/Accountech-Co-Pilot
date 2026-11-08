import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Activity, 
  Phone, 
  Mail, 
  Calendar, 
  Search,
  Plus,
  Eye,
  Edit,
  Clock,
  Users,
  FileText,
  Video,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { format, isToday, isYesterday, isFuture } from "date-fns";

export default function ActivitiesList({ 
  activities = [], 
  leads = [], 
  clients = [], 
  deals = [], 
  contacts = [], 
  onRefresh 
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [relatedFilter, setRelatedFilter] = useState("all");

  // Filter and sort activities
  const filteredActivities = activities
    .filter(activity => {
      const matchesSearch = !searchTerm || 
        activity.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.related_to?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = typeFilter === "all" || activity.activity_type === typeFilter;
      const matchesStatus = statusFilter === "all" || activity.status === statusFilter;
      const matchesRelated = relatedFilter === "all" || activity.related_to?.type === relatedFilter;
      
      return matchesSearch && matchesType && matchesStatus && matchesRelated;
    })
    .sort((a, b) => new Date(b.activity_date) - new Date(a.activity_date));

  const getActivityIcon = (type) => {
    const icons = {
      call: Phone,
      email: Mail,
      meeting: Users,
      demo: Video,
      proposal: FileText,
      follow_up: Clock,
      note: MessageSquare,
      task: CheckCircle,
      other: Activity
    };
    const IconComponent = icons[type] || icons.other;
    return <IconComponent className="w-4 h-4" />;
  };

  const getActivityIconColor = (type) => {
    const colors = {
      call: "text-blue-400",
      email: "text-green-400",
      meeting: "text-purple-400",
      demo: "text-yellow-400",
      proposal: "text-orange-400",
      follow_up: "text-pink-400",
      note: "text-cyan-400",
      task: "text-emerald-400",
      other: "text-slate-400"
    };
    return colors[type] || colors.other;
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: "bg-green-500/20 text-green-300 border-green-500/30",
      scheduled: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      cancelled: "bg-red-500/20 text-red-300 border-red-500/30",
      no_show: "bg-orange-500/20 text-orange-300 border-orange-500/30"
    };
    return colors[status] || colors.completed;
  };

  const getOutcomeColor = (outcome) => {
    const colors = {
      successful: "bg-green-500/20 text-green-300",
      neutral: "bg-yellow-500/20 text-yellow-300",
      unsuccessful: "bg-red-500/20 text-red-300",
      follow_up_needed: "bg-purple-500/20 text-purple-300",
      decision_pending: "bg-blue-500/20 text-blue-300"
    };
    return colors[outcome] || colors.neutral;
  };

  const getDateLabel = (date) => {
    const activityDate = new Date(date);
    if (isToday(activityDate)) return "Today";
    if (isYesterday(activityDate)) return "Yesterday";
    if (isFuture(activityDate)) return "Upcoming";
    return format(activityDate, 'MMM d, yyyy');
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'urgent':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      case 'high':
        return <AlertCircle className="w-4 h-4 text-orange-400" />;
      case 'medium':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'low':
        return <Clock className="w-4 h-4 text-green-400" />;
      default:
        return null;
    }
  };

  const handleAddActivity = () => {
    alert("Add New Activity functionality would open here!");
  };

  const handleViewActivity = (activity) => {
    alert(`View ${activity.subject} details`);
  };

  const handleEditActivity = (activity) => {
    alert(`Edit ${activity.subject}`);
  };

  // Group activities by date
  const groupedActivities = filteredActivities.reduce((groups, activity) => {
    const dateLabel = getDateLabel(activity.activity_date);
    if (!groups[dateLabel]) {
      groups[dateLabel] = [];
    }
    groups[dateLabel].push(activity);
    return groups;
  }, {});

  return (
    <div className="space-y-6">
      <style>{`
        .activities-container {
          background: transparent;
        }
        
        .activity-card {
          background: linear-gradient(145deg, 
            rgba(15, 23, 42, 0.9) 0%,
            rgba(30, 41, 59, 0.8) 100%
          );
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          transition: all 0.3s ease;
        }
        
        .activity-card:hover {
          transform: translateY(-2px);
          border: 1px solid rgba(0, 255, 255, 0.3);
          box-shadow: 
            0 10px 25px rgba(0, 0, 0, 0.3),
            0 0 20px rgba(0, 255, 255, 0.1);
        }
        
        .activity-group-header {
          background: linear-gradient(135deg, 
            rgba(15, 23, 42, 0.8) 0%,
            rgba(30, 41, 59, 0.7) 100%
          );
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          backdrop-filter: blur(15px);
        }
      `}</style>

      {/* Header and Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex gap-3 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400"
            />
          </div>
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40 bg-slate-800/50 border-slate-700 text-white">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="call">Calls</SelectItem>
              <SelectItem value="email">Emails</SelectItem>
              <SelectItem value="meeting">Meetings</SelectItem>
              <SelectItem value="demo">Demos</SelectItem>
              <SelectItem value="proposal">Proposals</SelectItem>
              <SelectItem value="follow_up">Follow-ups</SelectItem>
              <SelectItem value="note">Notes</SelectItem>
              <SelectItem value="task">Tasks</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 bg-slate-800/50 border-slate-700 text-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="no_show">No Show</SelectItem>
            </SelectContent>
          </Select>

          <Select value={relatedFilter} onValueChange={setRelatedFilter}>
            <SelectTrigger className="w-40 bg-slate-800/50 border-slate-700 text-white">
              <SelectValue placeholder="Related To" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="lead">Leads</SelectItem>
              <SelectItem value="client">Clients</SelectItem>
              <SelectItem value="deal">Deals</SelectItem>
              <SelectItem value="contact">Contacts</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleAddActivity} className="bg-yellow-600 hover:bg-yellow-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Log New Activity
        </Button>
      </div>

      {/* Activities Timeline */}
      <div className="activities-container">
        {Object.keys(groupedActivities).length > 0 ? (
          <div className="space-y-6">
            {Object.entries(groupedActivities).map(([dateLabel, dayActivities]) => (
              <div key={dateLabel} className="space-y-3">
                {/* Date Header */}
                <div className="activity-group-header p-3">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-yellow-400" />
                    {dateLabel}
                    <Badge className="bg-yellow-500/20 text-yellow-300">
                      {dayActivities.length} activit{dayActivities.length === 1 ? 'y' : 'ies'}
                    </Badge>
                  </h3>
                </div>

                {/* Activities for this date */}
                <div className="space-y-3 ml-4">
                  {dayActivities.map((activity, index) => (
                    <motion.div
                      key={activity.id || index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="activity-card p-5"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`p-2 bg-slate-700/50 rounded-full ${getActivityIconColor(activity.activity_type)}`}>
                              {getActivityIcon(activity.activity_type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-lg font-semibold text-white">
                                  {activity.subject || 'Untitled Activity'}
                                </h4>
                                {activity.priority && getPriorityIcon(activity.priority)}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-slate-400">
                                <span className="capitalize">
                                  {activity.activity_type?.replace('_', ' ')}
                                </span>
                                {activity.duration_minutes && (
                                  <>
                                    <span>•</span>
                                    <span>{activity.duration_minutes} min</span>
                                  </>
                                )}
                                <span>•</span>
                                <span>
                                  {format(new Date(activity.activity_date), 'h:mm a')}
                                </span>
                              </div>
                            </div>
                          </div>

                          {activity.description && (
                            <p className="text-slate-300 text-sm mb-3 line-clamp-2">
                              {activity.description}
                            </p>
                          )}

                          <div className="flex flex-wrap gap-2 mb-3">
                            <Badge className={getStatusColor(activity.status)}>
                              {activity.status?.replace('_', ' ').toUpperCase() || 'COMPLETED'}
                            </Badge>

                            {activity.outcome && (
                              <Badge className={getOutcomeColor(activity.outcome)}>
                                {activity.outcome.replace('_', ' ')}
                              </Badge>
                            )}

                            {activity.related_to && (
                              <Badge className="bg-purple-500/20 text-purple-300">
                                {activity.related_to.type}: {activity.related_to.name}
                              </Badge>
                            )}

                            {activity.assigned_to && (
                              <Badge className="bg-cyan-500/20 text-cyan-300">
                                👤 {activity.assigned_to}
                              </Badge>
                            )}
                          </div>

                          {/* Participants */}
                          {activity.participants && activity.participants.length > 0 && (
                            <div className="text-xs text-slate-400 mb-2">
                              Participants: {activity.participants.map(p => p.name).join(', ')}
                            </div>
                          )}

                          {/* Follow-up required */}
                          {activity.follow_up_required && activity.follow_up_date && (
                            <div className="flex items-center gap-2 text-xs text-orange-300 bg-orange-500/10 px-2 py-1 rounded mt-2">
                              <Clock className="w-3 h-3" />
                              Follow-up: {format(new Date(activity.follow_up_date), 'MMM d, yyyy')}
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2 ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewActivity(activity)}
                            className="border-slate-600 text-slate-300 hover:bg-slate-700"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditActivity(activity)}
                            className="border-slate-600 text-slate-300 hover:bg-slate-700"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* AI Insights */}
                      {activity.ai_insights && (
                        <div className="mt-4 p-3 bg-slate-800/50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Activity className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm font-medium text-yellow-400">AI Insights</span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            {activity.ai_insights.sentiment && (
                              <div className="flex items-center gap-2">
                                <span className="text-slate-400">Sentiment:</span>
                                <Badge className={
                                  activity.ai_insights.sentiment === 'positive' ? 'bg-green-500/20 text-green-300' :
                                  activity.ai_insights.sentiment === 'negative' ? 'bg-red-500/20 text-red-300' :
                                  'bg-yellow-500/20 text-yellow-300'
                                }>
                                  {activity.ai_insights.sentiment}
                                </Badge>
                              </div>
                            )}
                            
                            {activity.ai_insights.engagement_score && (
                              <div className="text-slate-300">
                                Engagement Score: {activity.ai_insights.engagement_score}/100
                              </div>
                            )}
                          </div>

                          {activity.ai_insights.key_topics && activity.ai_insights.key_topics.length > 0 && (
                            <div className="mt-2">
                              <span className="text-slate-400 text-xs">Key Topics: </span>
                              <span className="text-slate-300 text-xs">
                                {activity.ai_insights.key_topics.join(', ')}
                              </span>
                            </div>
                          )}

                          {activity.ai_insights.next_best_action && (
                            <div className="mt-2 p-2 bg-blue-500/10 rounded text-xs">
                              <span className="text-blue-400 font-medium">Recommended: </span>
                              <span className="text-blue-300">{activity.ai_insights.next_best_action}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Activity className="w-16 h-16 text-slate-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-300 mb-2">No activities found</h3>
            <p className="text-slate-400 mb-6">
              {searchTerm || typeFilter !== "all" || statusFilter !== "all" || relatedFilter !== "all"
                ? "Try adjusting your filters" 
                : "Start by logging your first customer activity"}
            </p>
            <Button onClick={handleAddActivity} className="bg-yellow-600 hover:bg-yellow-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Log Your First Activity
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}