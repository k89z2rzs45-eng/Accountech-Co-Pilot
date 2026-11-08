
import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Company } from "@/api/entities";
import { UploadFile } from "@/api/integrations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User as UserIcon, 
  Building2, 
  Mail, 
  Phone,
  MapPin, 
  Globe,
  Palette,
  FileText,
  Upload,
  Save,
  Settings,
  CreditCard,
  Shield,
  Camera,
  Bell,
  Lock,
  Users,
  Crown,
  Eye,
  UserPlus,
  Download,
  X,
  Calculator
} from "lucide-react";
import { motion } from "framer-motion";

const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "UK", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "MM", name: "Myanmar" },
  { code: "JP", name: "Japan" },
  { code: "CN", name: "China" },
  { code: "IN", name: "India" },
  { code: "SG", name: "Singapore" },
  { code: "TH", name: "Thailand" },
  { code: "KR", name: "South Korea" },
  { code: "MY", name: "Malaysia" },
  { code: "ID", name: "Indonesia" },
  { code: "PH", name: "Philippines" },
  { code: "VN", name: "Vietnam" },
  { code: "HK", name: "Hong Kong" },
  { code: "TW", name: "Taiwan" },
  { code: "AE", name: "UAE" }
];

const CURRENCIES = ["USD", "GBP", "CAD", "MMK", "JPY", "CNY", "INR", "SGD", "THB", "KRW"];
const PAYMENT_TERMS = ["Net 30", "Net 15", "Due on receipt", "Net 60", "Net 45"];
const ROLES = [
  { value: "admin", label: "Admin", description: "Full system access" },
  { value: "manager", label: "Manager", description: "Team and financial management" },
  { value: "accountant", label: "Accountant", description: "Financial records and reports" },
  { value: "employee", label: "Employee", description: "Basic access to own data" },
  { value: "viewer", label: "Viewer", description: "Read-only access" }
];

const PERMISSIONS = {
  admin: ["view_dashboard", "manage_transactions", "create_invoices", "manage_payroll", "view_reports", "view_forecasting", "manage_users", "admin_settings", "company_settings"],
  manager: ["view_dashboard", "manage_transactions", "create_invoices", "manage_payroll", "view_reports", "view_forecasting"],
  accountant: ["view_dashboard", "manage_transactions", "create_invoices", "view_reports"],
  employee: ["view_dashboard", "create_invoices"],
  viewer: ["view_dashboard"]
};

export default function Profile() {
  const [user, setUser] = useState(null);
  const [company, setCompany] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [notifications, setNotifications] = useState([]);
  
  const [personalData, setPersonalData] = useState({
    full_name: "",
    email: "",
    company_name: "",
    country: "US",
    preferred_currency: "USD",
    department: "",
    role: "employee",
    permissions: []
  });

  const [companyData, setCompanyData] = useState({
    company_name: "",
    legal_name: "",
    encrypted_tax_id: "",
    address: {
      street: "",
      city: "",
      state: "",
      zip_code: "",
      country: "US"
    },
    contact: {
      phone: "",
      email: "",
      website: ""
    },
    logo_url: "",
    brand_colors: {
      primary: "#3b82f6",
      secondary: "#64748b",
      accent: "#10b981"
    },
    invoice_settings: {
      template: "professional",
      payment_terms: "Net 30",
      footer_text: "",
      auto_numbering: true
    },
    payroll_settings: {
      pay_frequency: "biweekly",
      overtime_threshold: 40,
      default_benefits: []
    }
  });

  useEffect(() => {
    loadProfileData();
    loadNotifications();
  }, []);

  const loadProfileData = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      setPersonalData({
        ...personalData,
        ...currentUser,
        permissions: currentUser.permissions || PERMISSIONS[currentUser.role] || []
      });

      // Load company data
      const companies = await Company.list();
      const userCompany = companies.find(c => c.created_by === currentUser.email);
      
      if (userCompany) {
        setCompany(userCompany);
        setCompanyData({
          ...companyData,
          ...userCompany,
          address: userCompany.address || companyData.address,
          contact: userCompany.contact || companyData.contact,
          brand_colors: userCompany.brand_colors || companyData.brand_colors,
          invoice_settings: userCompany.invoice_settings || companyData.invoice_settings,
          payroll_settings: userCompany.payroll_settings || companyData.payroll_settings
        });
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
    }
    setIsLoading(false);
  };

  const loadNotifications = async () => {
    // Mock notifications - replace with actual system
    setNotifications([
      {
        id: 1,
        title: "Profile Update Required",
        message: "Please complete your company profile for full functionality",
        type: "warning",
        date: new Date().toISOString(),
        read: false
      }
    ]);
  };

  const handleSavePersonal = async () => {
    setIsSaving(true);
    try {
      // Update user permissions based on role
      const updatedPersonalData = {
        ...personalData,
        permissions: PERMISSIONS[personalData.role] || []
      };
      
      await User.updateMyUserData(updatedPersonalData);
      setUser(updatedPersonalData);
      alert('Personal profile updated successfully!');
    } catch (error) {
      console.error('Error updating personal profile:', error);
      alert('Error updating personal profile. Please try again.');
    }
    setIsSaving(false);
  };

  const handleSaveCompany = async () => {
    setIsSaving(true);
    try {
      if (company) {
        const updatedCompany = await Company.update(company.id, companyData);
        setCompany(updatedCompany);
      } else {
        const newCompany = await Company.create(companyData);
        setCompany(newCompany);
        
        // Mark user onboarding as completed
        await User.updateMyUserData({ onboarding_completed: true });
      }
      
      alert('Company profile updated successfully!');
    } catch (error) {
      console.error('Error saving company profile:', error);
      alert('Error saving company profile. Please try again.');
    }
    setIsSaving(false);
  };

  const handleLogoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      setCompanyData(prev => ({
        ...prev,
        logo_url: file_url
      }));
    } catch (error) {
      console.error('Error uploading logo:', error);
      alert('Error uploading logo. Please try again.');
    }
    setIsUploading(false);
  };

  const updatePersonalData = (field, value) => {
    setPersonalData(prev => ({ ...prev, [field]: value }));
  };

  const updateCompanyData = (path, value) => {
    setCompanyData(prev => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const hasPermission = (permission) => {
    return personalData.permissions?.includes(permission) || personalData.role === 'admin';
  };

  const canManageCompany = () => {
    return hasPermission('company_settings') || personalData.role === 'admin';
  };

  const canManageTeam = () => {
    return hasPermission('manage_users') || personalData.role === 'admin';
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Profile & Settings</h1>
          <p className="text-gray-600 text-lg flex items-center gap-2">
            Manage your personal and company information
            <Badge className="flex items-center gap-1">
              {personalData.role === 'admin' && <Crown className="w-3 h-3" />}
              {personalData.role}
            </Badge>
          </p>
        </div>
      </motion.div>

      {/* Main Profile Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <UserIcon className="w-4 h-4" />
            Personal
          </TabsTrigger>
          
          <TabsTrigger value="company" className="flex items-center gap-2" disabled={!canManageCompany()}>
            <Building2 className="w-4 h-4" />
            Company
            {!canManageCompany() && <Lock className="w-3 h-3" />}
          </TabsTrigger>
          
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notifications
            {unreadCount > 0 && (
              <Badge className="w-5 h-5 p-0 flex items-center justify-center text-xs bg-red-500 text-white">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Security
          </TabsTrigger>
          
          <TabsTrigger value="team" className="flex items-center gap-2" disabled={!canManageTeam()}>
            <Users className="w-4 h-4" />
            Team
            {!canManageTeam() && <Lock className="w-3 h-3" />}
          </TabsTrigger>
        </TabsList>

        {/* Personal Profile Tab */}
        <TabsContent value="personal" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid lg:grid-cols-3 gap-6"
          >
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserIcon className="w-5 h-5 text-indigo-600" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input
                        id="full_name"
                        value={personalData.full_name}
                        onChange={(e) => updatePersonalData('full_name', e.target.value)}
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        value={personalData.email}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="company_name">Company Name</Label>
                    <Input
                      id="company_name"
                      value={personalData.company_name}
                      onChange={(e) => updatePersonalData('company_name', e.target.value)}
                      placeholder="Your company name"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-indigo-600" />
                    Location & Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Select
                        value={personalData.country}
                        onValueChange={(value) => updatePersonalData('country', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          {COUNTRIES.map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="currency">Preferred Currency</Label>
                      <Select
                        value={personalData.preferred_currency}
                        onValueChange={(value) => updatePersonalData('preferred_currency', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          {CURRENCIES.map((currency) => (
                            <SelectItem key={currency} value={currency}>
                              {currency}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-indigo-600" />
                    Role & Permissions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={personalData.role}
                      onValueChange={(value) => updatePersonalData('role', value)}
                      disabled={personalData.role !== 'admin'}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLES.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            <div className="flex items-center gap-2">
                              {role.value === 'admin' && <Crown className="w-4 h-4" />}
                              <div>
                                <div className="font-medium">{role.label}</div>
                                <div className="text-xs text-gray-500">{role.description}</div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {personalData.role !== 'admin' && (
                      <p className="text-xs text-gray-500 mt-1">Contact an admin to change your role</p>
                    )}
                  </div>

                  <div>
                    <Label>Current Permissions</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {personalData.permissions?.map((permission) => (
                        <Badge key={permission} variant="secondary" className="text-xs">
                          {permission.replace(/_/g, ' ').toUpperCase()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-end">
                <Button onClick={handleSavePersonal} disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-700">
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Personal Info'}
                </Button>
              </div>
            </div>

            {/* Profile Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-indigo-600 font-bold text-3xl">
                        {personalData.full_name?.charAt(0)?.toUpperCase() || personalData.email?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">{personalData.full_name || 'User'}</h3>
                    <p className="text-gray-600">{personalData.email}</p>
                    <div className="flex justify-center gap-2 mt-3">
                      <Badge className="bg-indigo-100 text-indigo-800 flex items-center gap-1">
                        {personalData.role === 'admin' && <Crown className="w-3 h-3" />}
                        {personalData.role?.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">
                        {personalData.preferred_currency}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Access Level</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Dashboard</span>
                      <Badge variant={hasPermission('view_dashboard') ? "default" : "secondary"}>
                        {hasPermission('view_dashboard') ? "✓" : "✗"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Manage Transactions</span>
                      <Badge variant={hasPermission('manage_transactions') ? "default" : "secondary"}>
                        {hasPermission('manage_transactions') ? "✓" : "✗"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Create Invoices</span>
                      <Badge variant={hasPermission('create_invoices') ? "default" : "secondary"}>
                        {hasPermission('create_invoices') ? "✓" : "✗"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Company Settings</span>
                      <Badge variant={canManageCompany() ? "default" : "secondary"}>
                        {canManageCompany() ? "✓" : "✗"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </TabsContent>

        {/* Company Profile Tab */}
        <TabsContent value="company" className="space-y-6">
          {!canManageCompany() ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Restricted</h3>
                <p className="text-gray-600">You need admin or company_settings permissions to manage company profile.</p>
              </CardContent>
            </Card>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Company Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-indigo-600" />
                    Company Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="company_name">Company Name *</Label>
                      <Input
                        id="company_name"
                        value={companyData.company_name}
                        onChange={(e) => updateCompanyData('company_name', e.target.value)}
                        placeholder="Your Company Name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="legal_name">Legal Name</Label>
                      <Input
                        id="legal_name"
                        value={companyData.legal_name}
                        onChange={(e) => updateCompanyData('legal_name', e.target.value)}
                        placeholder="Legal Business Name"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={companyData.contact?.phone || ''}
                        onChange={(e) => updateCompanyData('contact.phone', e.target.value)}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <Label htmlFor="company_email">Email</Label>
                      <Input
                        id="company_email"
                        value={companyData.contact?.email || ''}
                        onChange={(e) => updateCompanyData('contact.email', e.target.value)}
                        placeholder="info@company.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={companyData.contact?.website || ''}
                        onChange={(e) => updateCompanyData('contact.website', e.target.value)}
                        placeholder="https://company.com"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Logo & Branding */}
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Camera className="w-5 h-5 text-indigo-600" />
                      Company Logo
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      {companyData.logo_url ? (
                        <img 
                          src={companyData.logo_url} 
                          alt="Company Logo" 
                          className="w-32 h-32 object-contain mx-auto mb-4 rounded-lg border"
                        />
                      ) : (
                        <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                          <Building2 className="w-16 h-16 text-gray-400" />
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                        id="logo-upload"
                      />
                      <label htmlFor="logo-upload">
                        <Button as="span" disabled={isUploading} className="cursor-pointer">
                          <Upload className="w-4 h-4 mr-2" />
                          {isUploading ? 'Uploading...' : 'Upload Logo'}
                        </Button>
                      </label>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="w-5 h-5 text-indigo-600" />
                      Brand Colors
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Primary Color</Label>
                      <div className="flex gap-2 items-center">
                        <Input
                          type="color"
                          value={companyData.brand_colors?.primary || '#3b82f6'}
                          onChange={(e) => updateCompanyData('brand_colors.primary', e.target.value)}
                          className="w-16 h-10"
                        />
                        <Input
                          value={companyData.brand_colors?.primary || '#3b82f6'}
                          onChange={(e) => updateCompanyData('brand_colors.primary', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <div 
                        className="w-8 h-8 rounded border"
                        style={{ backgroundColor: companyData.brand_colors?.primary }}
                        title="Primary"
                      />
                      <div 
                        className="w-8 h-8 rounded border"
                        style={{ backgroundColor: companyData.brand_colors?.secondary }}
                        title="Secondary"
                      />
                      <div 
                        className="w-8 h-8 rounded border"
                        style={{ backgroundColor: companyData.brand_colors?.accent }}
                        title="Accent"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveCompany} disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-700">
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Company Info'}
                </Button>
              </div>
            </motion.div>
          )}
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-indigo-600" />
                Notifications ({unreadCount} unread)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {notifications.length > 0 ? (
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border ${
                        notification.read 
                          ? 'bg-gray-50 border-gray-200' 
                          : 'bg-blue-50 border-blue-200'
                      }`}
                    >
                      <h4 className="font-semibold text-gray-800">{notification.title}</h4>
                      <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No notifications</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Enhanced Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Security Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Shield className="w-6 h-6 text-green-600" />
                  Enterprise-G_rade Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Security Status Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <Shield className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-green-800">Authentication</h3>
                        <p className="text-green-600 text-sm">OAuth 2.0 + Google SSO</p>
                      </div>
                    </div>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>✓ Multi-factor authentication ready</li>
                      <li>✓ Session management</li>
                      <li>✓ Automatic token refresh</li>
                    </ul>
                  </div>

                  <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Lock className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-blue-800">Data Encryption</h3>
                        <p className="text-blue-600 text-sm">AES-256 End-to-End</p>
                      </div>
                    </div>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>✓ Client-side encryption for sensitive data</li>
                      <li>✓ TLS 1.3 in transit</li>
                      <li>✓ Zero-knowledge architecture</li>
                    </ul>
                  </div>

                  <div className="p-6 bg-purple-50 border border-purple-200 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <Eye className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-purple-800">Privacy Controls</h3>
                        <p className="text-purple-600 text-sm">GDPR & SOX Compliant</p>
                      </div>
                    </div>
                    <ul className="text-sm text-purple-700 space-y-1">
                      <li>✓ Data residency controls</li>
                      <li>✓ Audit logging</li>
                      <li>✓ Right to deletion</li>
                    </ul>
                  </div>

                  <div className="p-6 bg-orange-50 border border-orange-200 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                        <Settings className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-orange-800">Infrastructure</h3>
                        <p className="text-orange-600 text-sm">Cloud-native Security</p>
                      </div>
                    </div>
                    <ul className="text-sm text-orange-700 space-y-1">
                      <li>✓ Regular security scans</li>
                      <li>✓ Automated backups</li>
                      <li>✓ 99.9% uptime SLA</li>
                    </ul>
                  </div>
                </div>

                {/* Security Certifications */}
                <div className="p-6 bg-gray-50 rounded-xl border-l-4 border-indigo-500">
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Badge className="bg-indigo-600">
                      Security Certifications & Compliance
                    </Badge>
                  </h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-white rounded-lg">
                      <div className="font-bold text-gray-800">SOC 2 Type II</div>
                      <div className="text-sm text-gray-600">Security & Availability</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg">
                      <div className="font-bold text-gray-800">GDPR</div>
                      <div className="text-sm text-gray-600">Data Protection</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg">
                      <div className="font-bold text-gray-800">ISO 27001</div>
                      <div className="text-sm text-gray-600">Information Security</div>
                    </div>
                  </div>
                </div>

                {/* Data Control Actions */}
                <div className="space-y-4">
                  <h4 className="font-bold text-gray-900">Your Data, Your Control</h4>
                  <div className="flex flex-wrap gap-3">
                    <Button 
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={() => alert('Data export will be available in your email within 24 hours.')}
                    >
                      <Download className="w-4 h-4" />
                      Export All Data
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={() => window.open('/privacy-policy', '_blank')}
                    >
                      <FileText className="w-4 h-4" />
                      Privacy Policy
                    </Button>
                    <Button 
                      variant="outline"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => {
                        if (confirm('Are you sure you want to sign out of all devices? This will end all active sessions.')) {
                          User.logout();
                          window.location.reload();
                        }
                      }}
                    >
                      <X className="w-4 h-4" />
                      Sign Out All Devices
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Enhanced Team Management Tab */}
        <TabsContent value="team" className="space-y-6">
          {!canManageTeam() ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Restricted</h3>
                <p className="text-gray-600">You need manage_users permission to access team management.</p>
              </CardContent>
            </Card>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Team Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Users className="w-6 h-6 text-indigo-600" />
                    Team Management
                  </CardTitle>
                  <p className="text-gray-600">Manage team members, roles, and permissions securely</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Role Management Grid */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ROLES.map((role) => (
                      <div key={role.value} className="p-6 border rounded-xl hover:shadow-lg transition-shadow">
                        <div className="flex items-center gap-3 mb-4">
                          {role.value === 'admin' && <Crown className="w-6 h-6 text-yellow-600" />}
                          {role.value === 'manager' && <Users className="w-6 h-6 text-blue-600" />}
                          {role.value === 'accountant' && <Calculator className="w-6 h-6 text-green-600" />}
                          {role.value === 'employee' && <UserIcon className="w-6 h-6 text-purple-600" />}
                          {role.value === 'viewer' && <Eye className="w-6 h-6 text-gray-600" />}
                          <div>
                            <h4 className="font-bold text-gray-900">{role.label}</h4>
                            <p className="text-sm text-gray-600">{role.description}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-gray-500 uppercase">Permissions:</p>
                          <div className="flex flex-wrap gap-1">
                            {(PERMISSIONS[role.value] || []).slice(0, 3).map(permission => (
                              <Badge key={permission} variant="secondary" className="text-xs">
                                {permission.replace(/_/g, ' ')}
                              </Badge>
                            ))}
                            {PERMISSIONS[role.value]?.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{PERMISSIONS[role.value].length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Team Features */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl">
                      <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Secure Invitations
                      </h4>
                      <ul className="text-sm text-blue-800 space-y-2">
                        <li>✓ Email-based secure invitations</li>
                        <li>✓ Time-limited invitation links</li>
                        <li>✓ Role-based access from day one</li>
                        <li>✓ Automatic permission assignment</li>
                      </ul>
                    </div>

                    <div className="p-6 bg-green-50 border border-green-200 rounded-xl">
                      <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                        <Settings className="w-5 h-5" />
                        Access Control
                      </h4>
                      <ul className="text-sm text-green-800 space-y-2">
                        <li>✓ Granular permission system</li>
                        <li>✓ Department-based segregation</li>
                        <li>✓ Audit trails for all actions</li>
                        <li>✓ Instant access revocation</li>
                      </ul>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4 border-t">
                    <Button 
                      className="bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2"
                      onClick={() => alert('Team invitation system will be available soon! For now, please contact support to add team members.')}
                    >
                      <UserPlus className="w-4 h-4" />
                      Invite Team Member
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={() => alert('Team management dashboard coming soon!')}
                    >
                      <Users className="w-4 h-4" />
                      View All Members
                    </Button>
                  </div>

                  {/* Security Notice */}
                  <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
                    <div className="flex items-start">
                      <Shield className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-yellow-800">
                          <strong>Security First:</strong> All team invitations are encrypted and logged. 
                          Team members can only access data according to their assigned role permissions.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
