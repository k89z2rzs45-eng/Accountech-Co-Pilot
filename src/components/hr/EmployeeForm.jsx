import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  UserPlus, 
  X, 
  Save,
  User,
  Briefcase,
  DollarSign,
  Shield,
  MapPin,
  Phone,
  Mail,
  Calendar
} from "lucide-react";
import { motion } from "framer-motion";
import { Employee } from "@/api/entities";

export default function EmployeeForm({ isOpen, onClose, employee = null, onSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  
  // Form state
  const [formData, setFormData] = useState({
    // Personal Information
    personal_info: {
      first_name: employee?.personal_info?.first_name || "",
      middle_name: employee?.personal_info?.middle_name || "",
      last_name: employee?.personal_info?.last_name || "",
      preferred_name: employee?.personal_info?.preferred_name || "",
      email: employee?.personal_info?.email || "",
      personal_email: employee?.personal_info?.personal_email || "",
      phone: employee?.personal_info?.phone || "",
      mobile: employee?.personal_info?.mobile || "",
      date_of_birth: employee?.personal_info?.date_of_birth || "",
      gender: employee?.personal_info?.gender || "",
      marital_status: employee?.personal_info?.marital_status || "",
      nationality: employee?.personal_info?.nationality || ""
    },
    // Address
    address: {
      street: employee?.address?.street || "",
      city: employee?.address?.city || "",
      state: employee?.address?.state || "",
      zip_code: employee?.address?.zip_code || "",
      country: employee?.address?.country || "US"
    },
    // Employment Details
    employment_details: {
      job_title: employee?.employment_details?.job_title || "",
      department: employee?.employment_details?.department || "",
      location: employee?.employment_details?.location || "",
      employment_type: employee?.employment_details?.employment_type || "full_time",
      employment_status: employee?.employment_details?.employment_status || "active",
      hire_date: employee?.employment_details?.hire_date || "",
      start_date: employee?.employment_details?.start_date || "",
      probation_end_date: employee?.employment_details?.probation_end_date || ""
    },
    // Compensation
    compensation: {
      salary_type: employee?.compensation?.salary_type || "salary",
      base_salary: employee?.compensation?.base_salary || "",
      hourly_rate: employee?.compensation?.hourly_rate || "",
      currency: employee?.compensation?.currency || "USD",
      pay_frequency: employee?.compensation?.pay_frequency || "biweekly",
      overtime_eligible: employee?.compensation?.overtime_eligible ?? true
    },
    // Emergency Contact
    emergency_contact: {
      name: employee?.emergency_contact?.name || "",
      relationship: employee?.emergency_contact?.relationship || "",
      phone: employee?.emergency_contact?.phone || "",
      email: employee?.emergency_contact?.email || ""
    }
  });

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Generate employee ID if creating new employee
      const employeeData = {
        ...formData,
        employee_id: employee?.employee_id || `EMP-${Date.now()}`
      };

      let result;
      if (employee) {
        result = await Employee.update(employee.id, employeeData);
      } else {
        result = await Employee.create(employeeData);
      }

      if (onSuccess) {
        onSuccess(result);
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving employee:', error);
      alert('Error saving employee. Please try again.');
    }
    
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-full">
              <UserPlus className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                {employee ? 'Edit Employee' : 'Add New Employee'}
              </h2>
              <p className="text-slate-400">
                {employee ? 'Update employee information' : 'Complete employee details'}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-slate-800">
              <TabsTrigger value="personal" className="data-[state=active]:bg-emerald-600">
                <User className="w-4 h-4 mr-2" />
                Personal
              </TabsTrigger>
              <TabsTrigger value="employment" className="data-[state=active]:bg-emerald-600">
                <Briefcase className="w-4 h-4 mr-2" />
                Employment
              </TabsTrigger>
              <TabsTrigger value="compensation" className="data-[state=active]:bg-emerald-600">
                <DollarSign className="w-4 h-4 mr-2" />
                Compensation
              </TabsTrigger>
              <TabsTrigger value="contact" className="data-[state=active]:bg-emerald-600">
                <Phone className="w-4 h-4 mr-2" />
                Emergency
              </TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit}>
              {/* Personal Information Tab */}
              <TabsContent value="personal" className="space-y-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <User className="w-5 h-5 text-emerald-400" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-slate-300">First Name *</Label>
                        <Input
                          value={formData.personal_info.first_name}
                          onChange={(e) => handleInputChange('personal_info', 'first_name', e.target.value)}
                          className="bg-slate-800 border-slate-600 text-white"
                          required
                        />
                      </div>
                      <div>
                        <Label className="text-slate-300">Middle Name</Label>
                        <Input
                          value={formData.personal_info.middle_name}
                          onChange={(e) => handleInputChange('personal_info', 'middle_name', e.target.value)}
                          className="bg-slate-800 border-slate-600 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-300">Last Name *</Label>
                        <Input
                          value={formData.personal_info.last_name}
                          onChange={(e) => handleInputChange('personal_info', 'last_name', e.target.value)}
                          className="bg-slate-800 border-slate-600 text-white"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-slate-300">Work Email *</Label>
                        <Input
                          type="email"
                          value={formData.personal_info.email}
                          onChange={(e) => handleInputChange('personal_info', 'email', e.target.value)}
                          className="bg-slate-800 border-slate-600 text-white"
                          required
                        />
                      </div>
                      <div>
                        <Label className="text-slate-300">Personal Email</Label>
                        <Input
                          type="email"
                          value={formData.personal_info.personal_email}
                          onChange={(e) => handleInputChange('personal_info', 'personal_email', e.target.value)}
                          className="bg-slate-800 border-slate-600 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-slate-300">Phone</Label>
                        <Input
                          value={formData.personal_info.phone}
                          onChange={(e) => handleInputChange('personal_info', 'phone', e.target.value)}
                          className="bg-slate-800 border-slate-600 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-300">Mobile</Label>
                        <Input
                          value={formData.personal_info.mobile}
                          onChange={(e) => handleInputChange('personal_info', 'mobile', e.target.value)}
                          className="bg-slate-800 border-slate-600 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-slate-300">Date of Birth</Label>
                        <Input
                          type="date"
                          value={formData.personal_info.date_of_birth}
                          onChange={(e) => handleInputChange('personal_info', 'date_of_birth', e.target.value)}
                          className="bg-slate-800 border-slate-600 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-300">Gender</Label>
                        <Select
                          value={formData.personal_info.gender}
                          onValueChange={(value) => handleInputChange('personal_info', 'gender', value)}
                        >
                          <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700">
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="non_binary">Non-binary</SelectItem>
                            <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-slate-300">Marital Status</Label>
                        <Select
                          value={formData.personal_info.marital_status}
                          onValueChange={(value) => handleInputChange('personal_info', 'marital_status', value)}
                        >
                          <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700">
                            <SelectItem value="single">Single</SelectItem>
                            <SelectItem value="married">Married</SelectItem>
                            <SelectItem value="divorced">Divorced</SelectItem>
                            <SelectItem value="widowed">Widowed</SelectItem>
                            <SelectItem value="separated">Separated</SelectItem>
                            <SelectItem value="domestic_partnership">Domestic Partnership</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Address Section */}
                    <div className="pt-4 border-t border-slate-700">
                      <h4 className="text-white font-medium mb-4 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-emerald-400" />
                        Home Address
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-slate-300">Street Address</Label>
                          <Input
                            value={formData.address.street}
                            onChange={(e) => handleInputChange('address', 'street', e.target.value)}
                            className="bg-slate-800 border-slate-600 text-white"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <Label className="text-slate-300">City</Label>
                            <Input
                              value={formData.address.city}
                              onChange={(e) => handleInputChange('address', 'city', e.target.value)}
                              className="bg-slate-800 border-slate-600 text-white"
                            />
                          </div>
                          <div>
                            <Label className="text-slate-300">State</Label>
                            <Input
                              value={formData.address.state}
                              onChange={(e) => handleInputChange('address', 'state', e.target.value)}
                              className="bg-slate-800 border-slate-600 text-white"
                            />
                          </div>
                          <div>
                            <Label className="text-slate-300">ZIP Code</Label>
                            <Input
                              value={formData.address.zip_code}
                              onChange={(e) => handleInputChange('address', 'zip_code', e.target.value)}
                              className="bg-slate-800 border-slate-600 text-white"
                            />
                          </div>
                          <div>
                            <Label className="text-slate-300">Country</Label>
                            <Input
                              value={formData.address.country}
                              onChange={(e) => handleInputChange('address', 'country', e.target.value)}
                              className="bg-slate-800 border-slate-600 text-white"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Employment Details Tab */}
              <TabsContent value="employment" className="space-y-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-emerald-400" />
                      Employment Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-slate-300">Job Title *</Label>
                        <Input
                          value={formData.employment_details.job_title}
                          onChange={(e) => handleInputChange('employment_details', 'job_title', e.target.value)}
                          className="bg-slate-800 border-slate-600 text-white"
                          required
                        />
                      </div>
                      <div>
                        <Label className="text-slate-300">Department *</Label>
                        <Select
                          value={formData.employment_details.department}
                          onValueChange={(value) => handleInputChange('employment_details', 'department', value)}
                        >
                          <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700">
                            <SelectItem value="accounting">Accounting</SelectItem>
                            <SelectItem value="sales">Sales</SelectItem>
                            <SelectItem value="marketing">Marketing</SelectItem>
                            <SelectItem value="operations">Operations</SelectItem>
                            <SelectItem value="hr">Human Resources</SelectItem>
                            <SelectItem value="executive">Executive</SelectItem>
                            <SelectItem value="engineering">Engineering</SelectItem>
                            <SelectItem value="customer_service">Customer Service</SelectItem>
                            <SelectItem value="legal">Legal</SelectItem>
                            <SelectItem value="finance">Finance</SelectItem>
                            <SelectItem value="it">IT</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-slate-300">Location</Label>
                        <Input
                          value={formData.employment_details.location}
                          onChange={(e) => handleInputChange('employment_details', 'location', e.target.value)}
                          className="bg-slate-800 border-slate-600 text-white"
                          placeholder="Office location or Remote"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-300">Employment Type</Label>
                        <Select
                          value={formData.employment_details.employment_type}
                          onValueChange={(value) => handleInputChange('employment_details', 'employment_type', value)}
                        >
                          <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700">
                            <SelectItem value="full_time">Full Time</SelectItem>
                            <SelectItem value="part_time">Part Time</SelectItem>
                            <SelectItem value="contract">Contract</SelectItem>
                            <SelectItem value="intern">Intern</SelectItem>
                            <SelectItem value="temporary">Temporary</SelectItem>
                            <SelectItem value="consultant">Consultant</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-slate-300">Hire Date *</Label>
                        <Input
                          type="date"
                          value={formData.employment_details.hire_date}
                          onChange={(e) => handleInputChange('employment_details', 'hire_date', e.target.value)}
                          className="bg-slate-800 border-slate-600 text-white"
                          required
                        />
                      </div>
                      <div>
                        <Label className="text-slate-300">Start Date</Label>
                        <Input
                          type="date"
                          value={formData.employment_details.start_date}
                          onChange={(e) => handleInputChange('employment_details', 'start_date', e.target.value)}
                          className="bg-slate-800 border-slate-600 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-300">Employment Status</Label>
                        <Select
                          value={formData.employment_details.employment_status}
                          onValueChange={(value) => handleInputChange('employment_details', 'employment_status', value)}
                        >
                          <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700">
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="terminated">Terminated</SelectItem>
                            <SelectItem value="on_leave">On Leave</SelectItem>
                            <SelectItem value="probation">Probation</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Compensation Tab */}
              <TabsContent value="compensation" className="space-y-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-emerald-400" />
                      Compensation Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-slate-300">Salary Type</Label>
                        <Select
                          value={formData.compensation.salary_type}
                          onValueChange={(value) => handleInputChange('compensation', 'salary_type', value)}
                        >
                          <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700">
                            <SelectItem value="salary">Salary</SelectItem>
                            <SelectItem value="hourly">Hourly</SelectItem>
                            <SelectItem value="commission">Commission</SelectItem>
                            <SelectItem value="contract">Contract</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-slate-300">Currency</Label>
                        <Select
                          value={formData.compensation.currency}
                          onValueChange={(value) => handleInputChange('compensation', 'currency', value)}
                        >
                          <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700">
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="GBP">GBP</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                            <SelectItem value="CAD">CAD</SelectItem>
                            <SelectItem value="JPY">JPY</SelectItem>
                            <SelectItem value="CNY">CNY</SelectItem>
                            <SelectItem value="INR">INR</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {formData.compensation.salary_type === 'salary' ? (
                      <div>
                        <Label className="text-slate-300">Base Salary (Annual)</Label>
                        <Input
                          type="number"
                          value={formData.compensation.base_salary}
                          onChange={(e) => handleInputChange('compensation', 'base_salary', parseFloat(e.target.value) || 0)}
                          className="bg-slate-800 border-slate-600 text-white"
                          placeholder="50000"
                        />
                      </div>
                    ) : (
                      <div>
                        <Label className="text-slate-300">Hourly Rate</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={formData.compensation.hourly_rate}
                          onChange={(e) => handleInputChange('compensation', 'hourly_rate', parseFloat(e.target.value) || 0)}
                          className="bg-slate-800 border-slate-600 text-white"
                          placeholder="25.00"
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-slate-300">Pay Frequency</Label>
                        <Select
                          value={formData.compensation.pay_frequency}
                          onValueChange={(value) => handleInputChange('compensation', 'pay_frequency', value)}
                        >
                          <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700">
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="biweekly">Bi-weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-2 pt-6">
                        <input
                          type="checkbox"
                          id="overtime"
                          checked={formData.compensation.overtime_eligible}
                          onChange={(e) => handleInputChange('compensation', 'overtime_eligible', e.target.checked)}
                          className="rounded"
                        />
                        <Label htmlFor="overtime" className="text-slate-300">
                          Overtime Eligible
                        </Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Emergency Contact Tab */}
              <TabsContent value="contact" className="space-y-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Phone className="w-5 h-5 text-emerald-400" />
                      Emergency Contact
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-slate-300">Contact Name</Label>
                        <Input
                          value={formData.emergency_contact.name}
                          onChange={(e) => handleInputChange('emergency_contact', 'name', e.target.value)}
                          className="bg-slate-800 border-slate-600 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-300">Relationship</Label>
                        <Input
                          value={formData.emergency_contact.relationship}
                          onChange={(e) => handleInputChange('emergency_contact', 'relationship', e.target.value)}
                          className="bg-slate-800 border-slate-600 text-white"
                          placeholder="Spouse, Parent, Sibling, etc."
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-slate-300">Phone Number</Label>
                        <Input
                          value={formData.emergency_contact.phone}
                          onChange={(e) => handleInputChange('emergency_contact', 'phone', e.target.value)}
                          className="bg-slate-800 border-slate-600 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-300">Email</Label>
                        <Input
                          type="email"
                          value={formData.emergency_contact.email}
                          onChange={(e) => handleInputChange('emergency_contact', 'email', e.target.value)}
                          className="bg-slate-800 border-slate-600 text-white"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </form>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-slate-700 bg-slate-900/50">
          <div className="text-sm text-slate-400">
            * Required fields
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {employee ? 'Update Employee' : 'Create Employee'}
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}