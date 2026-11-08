import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { Save, X, Users, Mail, Phone, MapPin, Building } from "lucide-react";

const CLIENT_STATUSES = ["active", "inactive", "archived"];
const COUNTRIES = [
  "United States", "Canada", "United Kingdom", "Australia", "Germany", "France", 
  "Japan", "South Korea", "Singapore", "Thailand", "Malaysia", "Philippines",
  "India", "China", "Myanmar", "Vietnam", "Indonesia", "Other"
];

export default function ClientForm({ 
  client, 
  onSubmit, 
  onCancel, 
  onDelete 
}) {
  const [formData, setFormData] = useState(client || {
    name: "",
    contact_person: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zip_code: "",
      country: ""
    },
    status: "active",
    notes: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (client) {
      setFormData({
        ...client,
        address: client.address || {
          street: "",
          city: "",
          state: "",
          zip_code: "",
          country: ""
        }
      });
    }
  }, [client]);

  const handleChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Validation
    if (!formData.name.trim()) {
      alert("Please enter client name");
      return;
    }
    if (!formData.email.trim()) {
      alert("Please enter client email");
      return;
    }
    if (!isValidEmail(formData.email)) {
      alert("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Client submission error:', error);
      alert('Failed to save client. Please try again.');
    }
    setIsSubmitting(false);
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="revolutionary-client-form w-full max-w-3xl max-h-[90vh] overflow-hidden"
        >
          <style jsx>{`
            .revolutionary-client-form {
              background: linear-gradient(145deg, 
                rgba(15, 23, 42, 0.98) 0%,
                rgba(30, 41, 59, 0.96) 50%,
                rgba(51, 65, 85, 0.94) 100%
              );
              border: 2px solid transparent;
              border-image: linear-gradient(45deg, #8b5cf6, #06b6d4, #10b981) 1;
              border-radius: 24px;
              backdrop-filter: blur(30px);
              box-shadow: 
                0 25px 50px rgba(0, 0, 0, 0.5),
                0 0 80px rgba(139, 92, 246, 0.2),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
              position: relative;
              overflow: hidden;
            }
            
            .form-header-enhanced {
              background: linear-gradient(135deg, 
                rgba(139, 92, 246, 0.1) 0%,
                rgba(6, 182, 212, 0.08) 50%,
                rgba(16, 185, 129, 0.1) 100%
              );
              border-bottom: 1px solid rgba(255, 255, 255, 0.1);
              padding: 1.5rem;
              position: relative;
              z-index: 10;
            }
            
            .form-content-enhanced {
              position: relative;
              z-index: 10;
              max-height: 60vh;
              overflow-y: auto;
              padding: 1.5rem;
            }
            
            .enhanced-input {
              background: linear-gradient(135deg, 
                rgba(255, 255, 255, 0.08) 0%,
                rgba(255, 255, 255, 0.04) 100%
              );
              border: 1px solid rgba(255, 255, 255, 0.2);
              border-radius: 12px;
              color: rgba(255, 255, 255, 0.9);
              padding: 0.75rem 1rem;
              backdrop-filter: blur(10px);
              transition: all 0.3s ease;
            }
            
            .enhanced-input:focus {
              background: linear-gradient(135deg, 
                rgba(255, 255, 255, 0.12) 0%,
                rgba(255, 255, 255, 0.08) 100%
              );
              border: 1px solid rgba(139, 92, 246, 0.5);
              box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
              transform: translateY(-1px);
              outline: none;
            }
            
            .enhanced-label {
              color: rgba(255, 255, 255, 0.9);
              font-weight: 600;
              font-size: 0.875rem;
              margin-bottom: 0.5rem;
              display: block;
            }
            
            .section-card {
              background: linear-gradient(135deg, 
                rgba(51, 65, 85, 0.4) 0%,
                rgba(30, 41, 59, 0.3) 100%
              );
              border: 1px solid rgba(255, 255, 255, 0.08);
              border-radius: 16px;
              backdrop-filter: blur(15px);
              padding: 1.5rem;
              margin-bottom: 1.5rem;
            }
            
            .section-title {
              color: #ffffff;
              font-weight: 700;
              font-size: 1.125rem;
              margin-bottom: 1rem;
              display: flex;
              align-items: center;
              gap: 0.5rem;
            }
          `}</style>

          {/* Header */}
          <div className="form-header-enhanced">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {client ? 'Edit Client' : 'Add New Client'}
                </h2>
                <p className="text-sm text-gray-300">
                  Manage your client relationships and contact information
                </p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit}>
            <div className="form-content-enhanced">
              {/* Basic Information */}
              <div className="section-card">
                <h3 className="section-title">
                  <Building className="w-5 h-5 text-purple-400" />
                  Basic Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="enhanced-label">Client/Company Name *</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className="enhanced-input"
                      placeholder="Enter client or company name"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label className="enhanced-label">Contact Person</Label>
                    <Input
                      value={formData.contact_person}
                      onChange={(e) => handleChange('contact_person', e.target.value)}
                      className="enhanced-input"
                      placeholder="Primary contact name"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="section-card">
                <h3 className="section-title">
                  <Mail className="w-5 h-5 text-cyan-400" />
                  Contact Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="enhanced-label">Email Address *</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="enhanced-input"
                      placeholder="client@example.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label className="enhanced-label">Phone Number</Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className="enhanced-input"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="section-card">
                <h3 className="section-title">
                  <MapPin className="w-5 h-5 text-green-400" />
                  Address Information
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <Label className="enhanced-label">Street Address</Label>
                    <Input
                      value={formData.address.street}
                      onChange={(e) => handleChange('address.street', e.target.value)}
                      className="enhanced-input"
                      placeholder="123 Main Street, Suite 100"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="enhanced-label">City</Label>
                      <Input
                        value={formData.address.city}
                        onChange={(e) => handleChange('address.city', e.target.value)}
                        className="enhanced-input"
                        placeholder="City"
                      />
                    </div>
                    
                    <div>
                      <Label className="enhanced-label">State/Province</Label>
                      <Input
                        value={formData.address.state}
                        onChange={(e) => handleChange('address.state', e.target.value)}
                        className="enhanced-input"
                        placeholder="State or Province"
                      />
                    </div>
                    
                    <div>
                      <Label className="enhanced-label">ZIP/Postal Code</Label>
                      <Input
                        value={formData.address.zip_code}
                        onChange={(e) => handleChange('address.zip_code', e.target.value)}
                        className="enhanced-input"
                        placeholder="12345"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="enhanced-label">Country</Label>
                    <Select 
                      value={formData.address.country} 
                      onValueChange={(value) => handleChange('address.country', value)}
                    >
                      <SelectTrigger className="enhanced-input">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {COUNTRIES.map(country => (
                          <SelectItem key={country} value={country}>{country}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="section-card">
                <h3 className="section-title">
                  <Phone className="w-5 h-5 text-yellow-400" />
                  Additional Information
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <Label className="enhanced-label">Client Status</Label>
                    <Select 
                      value={formData.status} 
                      onValueChange={(value) => handleChange('status', value)}
                    >
                      <SelectTrigger className="enhanced-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {CLIENT_STATUSES.map(status => (
                          <SelectItem key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="enhanced-label">Notes</Label>
                    <Textarea
                      value={formData.notes}
                      onChange={(e) => handleChange('notes', e.target.value)}
                      className="enhanced-input min-h-24"
                      placeholder="Internal notes about this client..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-700 flex justify-between items-center">
              {client && onDelete && (
                <Button 
                  type="button" 
                  onClick={() => onDelete(client)} 
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <X className="w-4 h-4 mr-2" />
                  Delete Client
                </Button>
              )}
              <div className="flex gap-3 ml-auto">
                <Button 
                  type="button" 
                  onClick={onCancel} 
                  variant="outline"
                  className="bg-transparent border-gray-600 text-gray-400 hover:bg-gray-700"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSubmitting ? 'Saving...' : client ? 'Update Client' : 'Create Client'}
                </Button>
              </div>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}