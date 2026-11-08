import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Award, 
  Search,
  Plus,
  Eye,
  Edit,
  TrendingUp,
  TrendingDown,
  Target,
  Star,
  Calendar,
  User,
  BarChart3,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { format, differenceInDays } from "date-fns";

export default function PerformanceManagement({ performanceReviews = [], employees = [], onRefresh }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [employeeFilter, setEmployeeFilter] = useState("all");

  // Filter performance reviews
  const filteredReviews = performanceReviews
    .filter(review => {
      const matchesSearch = !searchTerm || 
        review.employee_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.review_type?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || review.status === statusFilter;
      const matchesType = typeFilter === "all" || review.review_type === typeFilter;
      const matchesEmployee = employeeFilter === "all" || review.employee_id === employeeFilter;
      
      return matchesSearch && matchesStatus && matchesType && matchesEmployee;
    })
    .sort((a, b) => new Date(b.created_date) - new Date(a.created_date));

  // Calculate performance metrics
  const totalReviews = performanceReviews.length;
  const completedReviews = performanceReviews.filter(review => review.status === 'finalized').length;
  const pendingReviews = performanceReviews.filter(review => ['draft', 'employee_self_assessment', 'manager_review'].includes(review.status)).length;
  const averageRating = totalReviews > 0 ? 
    performanceReviews.reduce((sum, review) => sum + (review.overall_rating || 0), 0) / totalReviews : 0;

  const getStatusColor = (status) => {
    const colors = {
      draft: "bg-gray-500/20 text-gray-300 border-gray-500/30",
      employee_self_assessment: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      manager_review: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      calibration: "bg-orange-500/20 text-orange-300 border-orange-500/30",
      finalized: "bg-green-500/20 text-green-300 border-green-500/30",
      acknowledged: "bg-purple-500/20 text-purple-300 border-purple-500/30"
    };
    return colors[status] || colors.draft;
  };

  const getReviewTypeColor = (type) => {
    const colors = {
      annual: "bg-blue-500/20 text-blue-300",
      semi_annual: "bg-purple-500/20 text-purple-300",
      quarterly: "bg-green-500/20 text-green-300",
      probationary: "bg-yellow-500/20 text-yellow-300",
      "360": "bg-pink-500/20 text-pink-300",
      project_based: "bg-cyan-500/20 text-cyan-300",
      promotion: "bg-orange-500/20 text-orange-300",
      pip: "bg-red-500/20 text-red-300"
    };
    return colors[type] || colors.annual;
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

  const getEmployee = (employeeId) => {
    return employees.find(emp => emp.id === employeeId) || { personal_info: { first_name: 'Unknown', last_name: 'Employee' } };
  };

  const handleAddReview = () => {
    alert("Add Performance Review functionality would open here!");
  };

  const handleViewReview = (review) => {
    alert(`View performance review for ${review.employee_id}`);
  };

  const handleEditReview = (review) => {
    alert(`Edit performance review for ${review.employee_id}`);
  };

  const handleFinalizeReview = (review) => {
    alert(`Finalize performance review for ${review.employee_id}`);
  };

  return (
    <div className="space-y-6">
      <style>{`
        .performance-container {
          background: transparent;
        }
        
        .review-card {
          background: linear-gradient(145deg, 
            rgba(15, 23, 42, 0.9) 0%,
            rgba(30, 41, 59, 0.8) 100%
          );
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          transition: all 0.3s ease;
        }
        
        .review-card:hover {
          transform: translateY(-2px);
          border: 1px solid rgba(251, 191, 36, 0.3);
          box-shadow: 
            0 10px 25px rgba(0, 0, 0, 0.3),
            0 0 20px rgba(251, 191, 36, 0.1);
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
            0 0 30px rgba(251, 191, 36, 0.05);
        }
      `}</style>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="metric-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <Award className="w-5 h-5 text-yellow-400" />
              <span className="text-sm text-slate-400">Total Reviews</span>
            </div>
            <h3 className="text-2xl font-bold text-white">{totalReviews}</h3>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-sm text-slate-400">Completed</span>
            </div>
            <h3 className="text-2xl font-bold text-white">{completedReviews}</h3>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-slate-400">Pending</span>
            </div>
            <h3 className="text-2xl font-bold text-white">{pendingReviews}</h3>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="text-sm text-slate-400">Avg Rating</span>
            </div>
            <h3 className="text-2xl font-bold text-white">{averageRating.toFixed(1)}/5</h3>
          </CardContent>
        </Card>
      </div>

      {/* Header and Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex gap-3 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search reviews..."
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
              <SelectItem value="employee_self_assessment">Self Assessment</SelectItem>
              <SelectItem value="manager_review">Manager Review</SelectItem>
              <SelectItem value="calibration">Calibration</SelectItem>
              <SelectItem value="finalized">Finalized</SelectItem>
              <SelectItem value="acknowledged">Acknowledged</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-32 bg-slate-800/50 border-slate-700 text-white">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="annual">Annual</SelectItem>
              <SelectItem value="semi_annual">Semi-Annual</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="probationary">Probationary</SelectItem>
              <SelectItem value="360">360 Review</SelectItem>
              <SelectItem value="project_based">Project Based</SelectItem>
              <SelectItem value="promotion">Promotion</SelectItem>
              <SelectItem value="pip">PIP</SelectItem>
            </SelectContent>
          </Select>

          <Select value={employeeFilter} onValueChange={setEmployeeFilter}>
            <SelectTrigger className="w-40 bg-slate-800/50 border-slate-700 text-white">
              <SelectValue placeholder="Employee" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="all">All Employees</SelectItem>
              {employees.slice(0, 10).map(emp => (
                <SelectItem key={emp.id} value={emp.id}>
                  {emp.personal_info?.first_name} {emp.personal_info?.last_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleAddReview} className="bg-yellow-600 hover:bg-yellow-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Review
        </Button>
      </div>

      {/* Performance Reviews List */}
      <div className="performance-container">
        {filteredReviews.length > 0 ? (
          <div className="grid gap-4">
            {filteredReviews.map((review, index) => {
              const employee = getEmployee(review.employee_id);
              const reviewPeriodStart = review.review_period?.start_date;
              const reviewPeriodEnd = review.review_period?.end_date;
              
              return (
                <motion.div
                  key={review.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="review-card p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-yellow-500/20 rounded-full">
                          <Award className="w-5 h-5 text-yellow-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {employee.personal_info?.first_name} {employee.personal_info?.last_name}
                          </h3>
                          <p className="text-slate-400 text-sm">
                            {review.review_type?.replace('_', ' ')} Performance Review
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {reviewPeriodStart && reviewPeriodEnd && (
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-300">
                              {format(new Date(reviewPeriodStart), 'MMM d')} - {format(new Date(reviewPeriodEnd), 'MMM d, yyyy')}
                            </span>
                          </div>
                        )}
                        
                        {review.overall_rating && (
                          <div className="flex items-center gap-2 text-sm">
                            <div className="flex">
                              {getRatingStars(review.overall_rating)}
                            </div>
                            <span className="text-slate-300">
                              {review.overall_rating.toFixed(1)}/5
                            </span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 text-sm">
                          <User className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-300">
                            Reviewer: {review.reviewer_id || 'Not Assigned'}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge className={getStatusColor(review.status)}>
                          {(review.status || 'draft').replace('_', ' ').toUpperCase()}
                        </Badge>
                        
                        <Badge className={getReviewTypeColor(review.review_type)}>
                          {review.review_type?.replace('_', ' ')}
                        </Badge>
                        
                        {review.overall_rating && (
                          <Badge className="bg-yellow-500/20 text-yellow-300">
                            ⭐ {review.overall_rating.toFixed(1)} Rating
                          </Badge>
                        )}
                      </div>

                      {/* Goals Progress */}
                      {review.goals?.previous_goals && review.goals.previous_goals.length > 0 && (
                        <div className="bg-slate-800/50 rounded-lg p-3 mb-4">
                          <h4 className="text-sm font-semibold text-yellow-400 mb-2">Goal Progress</h4>
                          <div className="space-y-2">
                            {review.goals.previous_goals.slice(0, 3).map((goal, goalIndex) => (
                              <div key={goalIndex} className="space-y-1">
                                <div className="flex justify-between items-center text-xs">
                                  <span className="text-slate-300 truncate">{goal.goal}</span>
                                  <span className="text-slate-400">{goal.completion_percentage || 0}%</span>
                                </div>
                                <Progress value={goal.completion_percentage || 0} className="h-1" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Achievements */}
                      {review.achievements && review.achievements.length > 0 && (
                        <div className="mb-3">
                          <h4 className="text-sm font-semibold text-green-400 mb-1">Key Achievements</h4>
                          <ul className="text-xs text-slate-300 space-y-1">
                            {review.achievements.slice(0, 2).map((achievement, achIndex) => (
                              <li key={achIndex}>• {achievement.achievement}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Development Areas */}
                      {review.development_areas && review.development_areas.length > 0 && (
                        <div className="mb-3">
                          <h4 className="text-sm font-semibold text-blue-400 mb-1">Development Areas</h4>
                          <div className="flex flex-wrap gap-1">
                            {review.development_areas.slice(0, 3).map((area, areaIndex) => (
                              <Badge key={areaIndex} className="bg-blue-500/20 text-blue-300 text-xs">
                                {area.area}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Compensation Discussion */}
                      {review.compensation_discussion && (
                        <div className="bg-green-500/10 rounded-lg p-3">
                          <h4 className="text-sm font-semibold text-green-400 mb-2">Compensation Notes</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300">
                            {review.compensation_discussion.salary_increase_recommended && (
                              <div className="flex items-center gap-1">
                                <TrendingUp className="w-3 h-3 text-green-400" />
                                <span>Salary increase: {review.compensation_discussion.increase_percentage}%</span>
                              </div>
                            )}
                            {review.compensation_discussion.bonus_recommended && (
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-400" />
                                <span>Bonus: ${review.compensation_discussion.bonus_amount}</span>
                              </div>
                            )}
                            {review.compensation_discussion.promotion_recommended && (
                              <div className="flex items-center gap-1">
                                <Award className="w-3 h-3 text-purple-400" />
                                <span>Promotion recommended</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      {review.status === 'draft' && (
                        <Button
                          size="sm"
                          onClick={() => handleFinalizeReview(review)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewReview(review)}
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditReview(review)}
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Award className="w-16 h-16 text-slate-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-300 mb-2">No performance reviews found</h3>
            <p className="text-slate-400 mb-6">
              {searchTerm || statusFilter !== "all" || typeFilter !== "all" || employeeFilter !== "all"
                ? "Try adjusting your filters" 
                : "Start by creating performance reviews for your team"}
            </p>
            <Button onClick={handleAddReview} className="bg-yellow-600 hover:bg-yellow-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create Performance Review
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}