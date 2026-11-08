
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Building, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Camera, 
  CheckCircle,
  ArrowRight,
  Palette,
  DollarSign
} from "lucide-react";
import { motion } from "framer-motion";
import { UploadFile } from "@/api/integrations";
import { Company } from "@/api/entities";
import { User } from "@/api/entities";

const COUNTRIES = [
  { code: "US", name: "United States", currency: "USD" },
  { code: "UK", name: "United Kingdom", currency: "GBP" },
  { code: "CA", name: "Canada", currency: "CAD" },
  { code: "MM", name: "Myanmar", currency: "MMK" },
  { code: "JP", name: "Japan", currency: "JPY" },
  { code: "CN", name: "China", currency: "CNY" },
  { code: "IN", name: "India", currency: "INR" },
  { code: "SG", name: "Singapore", currency: "SGD" },
  { code: "TH", name: "Thailand", currency: "THB" },
  { code: "KR", name: "South Korea", currency: "KRW" },
  { code: "MY", name: "Malaysia", currency: "MYR" },
  { code: "ID", name: "Indonesia", currency: "IDR" },
  { code: "PH", name: "Philippines", currency: "PHP" },
  { code: "VN", name: "Vietnam", currency: "VND" },
  { code: "HK", name: "Hong Kong", currency: "HKD" },
  { code: "TW", name: "Taiwan", currency: "TWD" },
  { code: "AE", name: "UAE", currency: "AED" }
];

const INDUSTRIES = [
  "Technology", "Healthcare", "Finance", "Education", "Retail", "Manufacturing",
  "Real Estate", "Consulting", "Marketing", "Construction", "Legal Services",
  "Hospitality", "Transportation", "Non-Profit", "Other"
];

const COMPANY_SIZES = [
  "1-10 employees", "11-50 employees", "51-200 employees", 
  "201-500 employees", "500+ employees"
];

export default function CompanySetupForm({ isOpen, onComplete }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState(null);
  
  const [formData, setFormData] = useState({
    // Company Basic Info
    company_name: "",
    legal_name: "",
    tax_id: "",
    industry: "",
    company_size: "",
    
    // Address
    address: {
      street: "",
      city: "",
      state: "",
      zip_code: "",
      country: "US"
    },
    
    // Contact Info
    contact: {
      phone: "",
      email: ""
    },
    
    // Branding
    logo_url: "",
    brand_colors: {
      primary: "#667eea",
      secondary: "#764ba2",
      accent: "#f093fb"
    },
    
    // Business Settings
    invoice_settings: {
      template: "professional",
      payment_terms: "Net 30",
      footer_text: "Thank you for your business!",
      auto_numbering: true
    },
    
    // Payroll Settings
    payroll_settings: {
      pay_frequency: "monthly",
      overtime_threshold: 40,
      default_benefits: []
    }
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      
      // Pre-fill with user data if available
      setFormData(prev => ({
        ...prev,
        contact: {
          ...prev.contact,
          email: currentUser.email
        },
        address: {
          ...prev.address,
          country: currentUser.country || "US"
        }
      }));
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleInputChange = (section, field, value) => {
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const { file_url } = await UploadFile({ file });
      setFormData(prev => ({ ...prev, logo_url: file_url }));
    } catch (error) {
      console.error('Error uploading logo:', error);
      alert('Error uploading logo. Please try again.');
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Create company profile
      const company = await Company.create(formData);
      
      // Update user profile with company info and preferences
      const selectedCountry = COUNTRIES.find(c => c.code === formData.address.country);
      await User.updateMyUserData({
        company_name: formData.company_name,
        country: formData.address.country,
        preferred_currency: selectedCountry?.currency || "USD",
        department: "executive",
        permissions: [
          "view_dashboard", "manage_transactions", "create_invoices", 
          "manage_payroll", "view_reports", "view_forecasting", 
          "manage_users", "admin_settings"
        ],
        onboarding_completed: true
      });
      
      onComplete(company);
    } catch (error) {
      console.error('Error creating company:', error);
      alert('Error setting up your company. Please try again.');
    }
    setIsSubmitting(false);
  };

  const handleSkipOnboarding = async () => {
    setIsSubmitting(true);
    try {
      // Create minimal company profile with just required fields
      const minimalCompany = await Company.create({
        company_name: "My Business", // Default name
        industry: "other",
        address: {
          country: "US"
        },
        contact: {
          email: user?.email || ""
        },
        invoice_settings: {
          payment_terms: "Net 30",
          footer_text: "Thank you for your business!"
        }
      });
      
      // Update user with minimal setup
      await User.updateMyUserData({
        company_name: "My Business",
        country: "US",
        preferred_currency: "USD",
        department: "executive",
        permissions: [
          "view_dashboard", "manage_transactions", "create_invoices", 
          "manage_payroll", "view_reports", "view_forecasting", 
          "manage_users", "admin_settings"
        ],
        onboarding_completed: true
      });
      
      onComplete(minimalCompany);
    } catch (error) {
      console.error('Error skipping onboarding:', error);
      alert('Error setting up account. Please try again.');
    }
    setIsSubmitting(false);
  };

  const steps = [
    { number: 1, title: "Company Info", icon: Building },
    { number: 2, title: "Contact Details", icon: MapPin },
    { number: 3, title: "Branding", icon: Palette },
    { number: 4, title: "Business Settings", icon: DollarSign }
  ];

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
            currentStep >= step.number 
              ? 'bg-indigo-600 border-indigo-600 text-white' 
              : 'border-gray-300 text-gray-400'
          }`}>
            {currentStep > step.number ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <step.icon className="w-5 h-5" />
            )}
          </div>
          {index < steps.length - 1 && (
            <div className={`w-12 h-0.5 mx-2 transition-all ${
              currentStep > step.number ? 'bg-indigo-600' : 'bg-gray-300'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Company Information</h3>
        <p className="text-gray-600">Tell us about your business</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="company_name">Company Name *</Label>
          <Input
            id="company_name"
            value={formData.company_name}
            onChange={(e) => handleInputChange(null, 'company_name', e.target.value)}
            placeholder="Your Company Name"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="legal_name">Legal Name (Optional)</Label>
          <Input
            id="legal_name"
            value={formData.legal_name}
            onChange={(e) => handleInputChange(null, 'legal_name', e.target.value)}
            placeholder="Legal Business Name"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="industry">Industry *</Label>
          <Select onValueChange={(value) => handleInputChange(null, 'industry', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select your industry" />
            </SelectTrigger>
            <SelectContent>
              {INDUSTRIES.map((industry) => (
                <SelectItem key={industry} value={industry.toLowerCase()}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="company_size">Company Size (Optional)</Label>
          <Select onValueChange={(value) => handleInputChange(null, 'company_size', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select company size" />
            </SelectTrigger>
            <SelectContent>
              {COMPANY_SIZES.map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tax_id">Tax ID / Business Registration Number (Optional)</Label>
        <Input
          id="tax_id"
          value={formData.tax_id}
          onChange={(e) => handleInputChange(null, 'tax_id', e.target.value)}
          placeholder="Your tax identification number (can be added later)"
        />
        <p className="text-sm text-gray-500">
          💡 Don't worry - you can add this later in your settings
        </p>
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Contact & Address</h3>
        <p className="text-gray-600">Where can clients reach you?</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Business Address
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="street">Street Address</Label>
            <Input
              id="street"
              value={formData.address.street}
              onChange={(e) => handleInputChange('address', 'street', e.target.value)}
              placeholder="123 Business Street"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.address.city}
                onChange={(e) => handleInputChange('address', 'city', e.target.value)}
                placeholder="City"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State/Province</Label>
              <Input
                id="state"
                value={formData.address.state}
                onChange={(e) => handleInputChange('address', 'state', e.target.value)}
                placeholder="State"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="zip_code">ZIP/Postal Code</Label>
              <Input
                id="zip_code"
                value={formData.address.zip_code}
                onChange={(e) => handleInputChange('address', 'zip_code', e.target.value)}
                placeholder="12345"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Select 
                value={formData.address.country}
                onValueChange={(value) => handleInputChange('address', 'country', value)}
              >
                <SelectTrigger>
                  <SelectValue />
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
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.contact.phone}
                onChange={(e) => handleInputChange('contact', 'phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Business Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.contact.email}
                onChange={(e) => handleInputChange('contact', 'email', e.target.value)}
                placeholder="hello@yourcompany.com"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={formData.contact.website}
              onChange={(e) => handleInputChange('contact', 'website', e.target.value)}
              placeholder="https://yourcompany.com"
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Brand Your Business</h3>
        <p className="text-gray-600">Make your invoices and documents look professional</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Company Logo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
              {formData.logo_url ? (
                <img 
                  src={formData.logo_url} 
                  alt="Company Logo" 
                  className="w-full h-full object-contain rounded-lg"
                />
              ) : (
                <Camera className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
                id="logo-upload"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('logo-upload').click()}
              >
                Upload Logo
              </Button>
              <p className="text-sm text-gray-500 mt-2">
                Recommended: 200x200px, PNG or JPG
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Brand Colors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Primary Color</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.brand_colors.primary}
                  onChange={(e) => handleInputChange('brand_colors', 'primary', e.target.value)}
                  className="w-12 h-10 rounded border"
                />
                <Input
                  value={formData.brand_colors.primary}
                  onChange={(e) => handleInputChange('brand_colors', 'primary', e.target.value)}
                  placeholder="#667eea"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Secondary Color</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.brand_colors.secondary}
                  onChange={(e) => handleInputChange('brand_colors', 'secondary', e.target.value)}
                  className="w-12 h-10 rounded border"
                />
                <Input
                  value={formData.brand_colors.secondary}
                  onChange={(e) => handleInputChange('brand_colors', 'secondary', e.target.value)}
                  placeholder="#764ba2"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Accent Color</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.brand_colors.accent}
                  onChange={(e) => handleInputChange('brand_colors', 'accent', e.target.value)}
                  className="w-12 h-10 rounded border"
                />
                <Input
                  value={formData.brand_colors.accent}
                  onChange={(e) => handleInputChange('brand_colors', 'accent', e.target.value)}
                  placeholder="#f093fb"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderStep4 = () => {
    const selectedCountry = COUNTRIES.find(c => c.code === formData.address.country);
    
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Business Preferences</h3>
          <p className="text-gray-600">Configure your business settings</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Financial Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <p className="font-semibold">Default Currency</p>
                <p className="text-sm text-gray-600">Based on your country selection</p>
              </div>
              <Badge variant="secondary" className="text-lg">
                {selectedCountry?.currency || "USD"}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <Label>Default Payment Terms</Label>
              <Select 
                value={formData.invoice_settings.payment_terms}
                onValueChange={(value) => handleInputChange('invoice_settings', 'payment_terms', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Due on Receipt">Due on Receipt</SelectItem>
                  <SelectItem value="Net 15">Net 15 Days</SelectItem>
                  <SelectItem value="Net 30">Net 30 Days</SelectItem>
                  <SelectItem value="Net 45">Net 45 Days</SelectItem>
                  <SelectItem value="Net 60">Net 60 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Invoice Footer Text</Label>
              <Textarea
                value={formData.invoice_settings.footer_text}
                onChange={(e) => handleInputChange('invoice_settings', 'footer_text', e.target.value)}
                placeholder="Thank you for your business!"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Company:</span>
                <span className="font-semibold">{formData.company_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Industry:</span>
                <span className="font-semibold">{formData.industry}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Country:</span>
                <span className="font-semibold">{selectedCountry?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Currency:</span>
                <span className="font-semibold">{selectedCountry?.currency}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      default: return renderStep1();
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        // Only require company name and industry - tax ID is optional
        return formData.company_name && formData.industry;
      case 2:
        return formData.address.country;
      case 3:
        return true; // Optional step
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Welcome to AccounTech Co-Pilot! 🚀
          </DialogTitle>
          <p className="text-center text-gray-600">
            Let's set up your company profile to get started
          </p>
        </DialogHeader>

        <div className="mt-6">
          {renderStepIndicator()}
          {renderCurrentStep()}

          <div className="flex justify-between mt-8 pt-6 border-t">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              
              {/* Skip option for quick access */}
              <Button
                variant="ghost"
                onClick={handleSkipOnboarding}
                disabled={isSubmitting}
                className="text-gray-500 hover:text-gray-700"
              >
                Skip Setup (Use Later)
              </Button>
            </div>

            {currentStep < 4 ? (
              <Button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !isStepValid()}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? 'Setting up...' : 'Complete Setup'}
                <CheckCircle className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
