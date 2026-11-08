import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  UserPlus, 
  Search,
  Plus,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Users,
  Star,
  MapPin,
  Briefcase,
  GraduationCap,
  Phone,
  Mail,
  FileText,
  TrendingUp,
  Target
} from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

export default function RecruitmentPanel({ employees = [], onRefresh }) {
  const [activeTab, setActiveTab] = useState("candidates");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [positionFilter, setPositionFilter] = useState("all");

  // Mock recruitment data (in real app, this would come from dedicated entities)
  const jobOpenings = [
    {
      id: 1,
      title: "Senior Software Engineer",
      department: "engineering",
      location: "Remote",
      type: "full_time",
      status: "open",
      applications: 24,
      posted_date: "2024-01-15",
      salary_range: { min: 90000, max: 120000, currency: "USD" }
    },
    {
      id: 2,
      title: "Marketing Manager",
      department: "marketing",
      location: "New York",
      type: "full_time",
      status: "open",
      applications: 18,
      posted_date: "2024-01-10",
      salary_range: { min: 70000, max: 90000, currency: "USD" }
    },
    {
      id: 3,
      title: "Sales Representative",
      department: "sales",
      location: "Chicago",
      type: "full_time",
      status: "closed",
      applications: 45,
      posted_date: "2024-01-05",
      salary_range: { min: 50000, max: 70000, currency: "USD" }
    }
  ];

  const candidates = [
    {
      id: 1,
      first_name: "Sarah",
      last_name: "Johnson",
      email: "sarah.johnson@email.com",
      phone: "+1-555-0123",
      position_applied: "Senior Software Engineer",
      status: "interview_scheduled",
      stage: "technical_interview",
      rating: 4.5,
      experience_years: 7,
      education: "MS Computer Science",
      location: "San Francisco, CA",
      applied_date: "2024-01-20",
      resume_url: "https://example.com/resume1.pdf",
      notes: "Strong technical background, excellent communication skills"
    },
    {
      id: 2,
      first_name: "Michael",
      last_name: "Chen",
      email: "michael.chen@email.com",
      phone: "+1-555-0124",
      position_applied: "Marketing Manager",
      status: "under_review",
      stage: "phone_screening",
      rating: 4.2,
      experience_years: 5,
      education: "MBA Marketing",
      location: "New York, NY",
      applied_date: "2024-01-18",
      resume_url: "https://example.com/resume2.pdf",
      notes: "Creative thinker with digital marketing expertise"
    },
    {
      id: 3,
      first_name: "Emily",
      last_name: "Rodriguez",
      email: "emily.rodriguez@email.com",
      phone: "+1-555-0125",
      position_applied: "Sales Representative",
      status: "offer_extended",
      stage: "offer_negotiation",
      rating: 4.8,
      experience_years: 3,
      education: "BA Business Administration",
      location: "Chicago, IL",
      applied_date: "2024-01-22",
      resume_url: "https://example.com/resume3.pdf",
      notes: "Exceptional sales track record, great cultural fit"
    }
  ];

  // Filter candidates
  const filteredCandidates = candidates
    .filter(candidate => {
      const matchesSearch = !searchTerm || 
        candidate.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.position_applied?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || candidate.status === statusFilter;
      const matchesPosition = positionFilter === "all" || candidate.position_applied === positionFilter;
      
      return matchesSearch && matchesStatus && matchesPosition;
    });

  // Calculate recruitment metrics
  const totalCandidates = candidates.length;
  const activeInterviews = candidates.filter(c => c.status === 'interview_scheduled').length;
  const offersPending = candidates.filter(c => c.status === 'offer_extended').length;
  const avgRating = candidates.length > 0 ? 
    candidates.reduce((sum, c) => sum + c.rating, 0) / candidates.length : 0;

  const getStatusColor = (status) => {
    const colors = {
      applied: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      under_review: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      interview_scheduled: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      offer_extended: "bg-green-500/20 text-green-300 border-green-500/30",
      hired: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      rejected: "bg-red-500/20 text-red-300 border-red-500/30",
      withdrawn: "bg-gray-500/20 text-gray-300 border-gray-500/30"
    };
    return colors[status] || colors.applied;
  };

  const getStageColor = (stage) => {
    const colors = {
      application_review: "bg-blue-500/20 text-blue-300",
      phone_screening: "bg-yellow-500/20 text-yellow-300",
      technical_interview: "bg-purple-500/20 text-purple-300",
      final_interview: "bg-orange-500/20 text-orange-300",
      offer_negotiation: "bg-green-500/20 text-green-300",
      background_check: "bg-cyan-500/20 text-cyan-300"
    };
    return colors[stage] || colors.application_review;
  };

  const getRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 text-yellow-400" />);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-slate-400" />);
    }
    
    return stars;
  };

  const handleAddJobOpening = () => {
    alert("Add Job Opening functionality would open here!");
  };

  const handleViewCandidate = (candidate) => {
    alert(`View ${candidate.first_name} ${candidate.last_name} details`);
  };

  const handleScheduleInterview = (candidate) => {
    alert(`Schedule interview for ${candidate.first_name} ${candidate.last_name}`);
  };

  const handleMakeOffer = (candidate) => {
    alert(`Make offer to ${candidate.first_name} ${candidate.last_name}`);
  };

  const handleRejectCandidate = (candidate) => {
    alert(`Reject ${candidate.first_name} ${candidate.last_name}`);
  };

  return (
    <div className="space-y-6">
      <style>{`
        .recruitment-container {
          background: transparent;
        }
        
        .candidate-card {
          background: linear-gradient(145deg, 
            rgba(15, 23, 42, 0.9) 0%,
            rgba(30, 41, 59, 0.8) 100%
          );
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          transition: all 0.3s ease;
        }
        
        .candidate-card:hover {
          transform: translateY(-2px);
          border: 1px solid rgba(236, 72, 153, 0.3);
          box-shadow: 
            0 10px 25px rgba(0, 0, 0, 0.3),
            0 0 20px rgba(236, 72, 153, 0.1);
        }

        .job-card {
          background: linear-gradient(145deg, 
            rgba(15, 23, 42, 0.9) 0%,
            rgba(30, 41, 59, 0.8) 100%
          );
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          transition: all 0.3s ease;
        }
        
        .job-card:hover {
          transform: translateY(-2px);
          border: 1px solid rgba(59, 130, 246, 0.3);
          box-shadow: 
            0 10px 25px rgba(0, 0, 0, 0.3),
            0 0 20px rgba(59, 130, 246, 0.1);
        }

        .metric-card {
          background: linear-gradient(145deg, 
            rgba(15, 23, 42, 0.95) 0%,
            rgba(30, 41, 59, 0.9) 100%
          );
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          box-shadow: 
            0 10px 25px rgba(0, 0, 0, 0.3),
            0 0 30px rgba(236, 72, 153, 0.05);
        }
      `}</style>

      {/* Recruitment Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="metric-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-pink-400" />
              <span className="text-sm text-slate-400">Total Candidates</span>
            </div>
            <h3 className="text-2xl font-bold text-white">{totalCandidates}</h3>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-slate-400">Interviews</span>
            </div>
            <h3 className="text-2xl font-bold text-white">{activeInterviews}</h3>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-sm text-slate-400">Offers</span>
            </div>
            <h3 className="text-2xl font-bold text-white">{offersPending}</h3>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="text-sm text-slate-400">Avg Rating</span>
            </div>
            <h3 className="text-2xl font-bold text-white">{avgRating.toFixed(1)}/5</h3>
          </CardContent>
        </Card>
      </div>

      {/* Recruitment Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-transparent gap-2">
          <TabsTrigger 
            value="candidates" 
            className={`bg-slate-800/50 border border-slate-700 text-slate-300 data-[state=active]:bg-pink-500/20 data-[state=active]:text-pink-300 data-[state=active]:border-pink-500/30`}
          >
            <Users className="w-4 h-4 mr-2" />
            Candidates
          </TabsTrigger>
          
          <TabsTrigger 
            value="jobs" 
            className={`bg-slate-800/50 border border-slate-700 text-slate-300 data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300 data-[state=active]:border-blue-500/30`}
          >
            <Briefcase className="w-4 h-4 mr-2" />
            Job Openings
          </TabsTrigger>
        </TabsList>

        {/* Candidates Tab */}
        <TabsContent value="candidates">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
            <div className="flex gap-3 flex-wrap">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search candidates..."
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
                  <SelectItem value="applied">Applied</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="interview_scheduled">Interview Scheduled</SelectItem>
                  <SelectItem value="offer_extended">Offer Extended</SelectItem>
                  <SelectItem value="hired">Hired</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <Select value={positionFilter} onValueChange={setPositionFilter}>
                <SelectTrigger className="w-48 bg-slate-800/50 border-slate-700 text-white">
                  <SelectValue placeholder="Position" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all">All Positions</SelectItem>
                  {jobOpenings.map(job => (
                    <SelectItem key={job.id} value={job.title}>{job.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Candidates List */}
          <div className="recruitment-container">
            {filteredCandidates.length > 0 ? (
              <div className="grid gap-4">
                {filteredCandidates.map((candidate, index) => (
                  <motion.div
                    key={candidate.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="candidate-card p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-pink-500/20 rounded-full">
                            <UserPlus className="w-5 h-5 text-pink-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white">
                              {candidate.first_name} {candidate.last_name}
                            </h3>
                            <p className="text-slate-400 text-sm">
                              Applied for {candidate.position_applied}
                            </p>
                          </div>
                          <div className="flex ml-4">
                            {getRatingStars(candidate.rating)}
                            <span className="ml-2 text-sm text-slate-300">{candidate.rating}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-300">{candidate.email}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-300">{candidate.phone}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-300">{candidate.location}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge className={getStatusColor(candidate.status)}>
                            {candidate.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                          
                          <Badge className={getStageColor(candidate.stage)}>
                            {candidate.stage.replace('_', ' ')}
                          </Badge>
                          
                          <Badge className="bg-blue-500/20 text-blue-300">
                            <Briefcase className="w-3 h-3 mr-1" />
                            {candidate.experience_years}y exp
                          </Badge>
                          
                          <Badge className="bg-purple-500/20 text-purple-300">
                            <GraduationCap className="w-3 h-3 mr-1" />
                            {candidate.education}
                          </Badge>
                        </div>

                        {candidate.notes && (
                          <p className="text-slate-300 text-sm line-clamp-2 mb-3">
                            <strong>Notes:</strong> {candidate.notes}
                          </p>
                        )}

                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <span>Applied: {format(new Date(candidate.applied_date), 'MMM d, yyyy')}</span>
                          {candidate.resume_url && (
                            <a href={candidate.resume_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                              <FileText className="w-4 h-4 inline mr-1" />
                              View Resume
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        {candidate.status === 'under_review' && (
                          <Button
                            size="sm"
                            onClick={() => handleScheduleInterview(candidate)}
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                          >
                            <Calendar className="w-4 h-4" />
                          </Button>
                        )}
                        
                        {candidate.status === 'interview_scheduled' && (
                          <Button
                            size="sm"
                            onClick={() => handleMakeOffer(candidate)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewCandidate(candidate)}
                          className="border-slate-600 text-slate-300 hover:bg-slate-700"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        
                        <Button
                          size="sm"
                          onClick={() => handleRejectCandidate(candidate)}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-300 mb-2">No candidates found</h3>
                <p className="text-slate-400 mb-6">
                  {searchTerm || statusFilter !== "all" || positionFilter !== "all"
                    ? "Try adjusting your filters" 
                    : "Candidates will appear here as they apply to job openings"}
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Job Openings Tab */}
        <TabsContent value="jobs">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-white">Job Openings</h3>
            <Button onClick={handleAddJobOpening} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Post New Job
            </Button>
          </div>

          <div className="grid gap-4">
            {jobOpenings.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="job-card p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-blue-500/20 rounded-full">
                        <Briefcase className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{job.title}</h3>
                        <p className="text-slate-400 text-sm">{job.department} • {job.location}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-300">{job.applications} applications</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-300">Posted {format(new Date(job.posted_date), 'MMM d, yyyy')}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Target className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-300">
                          {job.salary_range.currency} {job.salary_range.min.toLocaleString()} - {job.salary_range.max.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge className={job.status === 'open' ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'}>
                        {job.status.toUpperCase()}
                      </Badge>
                      
                      <Badge className="bg-blue-500/20 text-blue-300">
                        {job.type.replace('_', ' ')}
                      </Badge>
                      
                      <Badge className="bg-purple-500/20 text-purple-300">
                        {job.department}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}