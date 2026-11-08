
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Zap, 
  Search, 
  Filter, 
  Settings, 
  Check, 
  X, 
  AlertTriangle,
  ExternalLink,
  Plug,
  Shield,
  Clock,
  TrendingUp,
  Database,
  Cloud,
  Mail,
  MessageSquare,
  CreditCard,
  FileText,
  Building,
  Users,
  ShoppingCart,
  BarChart3,
  Globe,
  Smartphone,
  Layers,
  GitBranch,
  Key,
  RefreshCw 
} from "lucide-react";
import { motion } from "framer-motion";

const INTEGRATION_CATEGORIES = [
  { id: 'all', name: 'All Integrations', icon: Layers, count: 45 },
  { id: 'accounting', name: 'Accounting', icon: FileText, count: 8 },
  { id: 'payment', name: 'Payments', icon: CreditCard, count: 12 },
  { id: 'banking', name: 'Banking', icon: Building, count: 6 },
  { id: 'crm', name: 'CRM & Sales', icon: Users, count: 7 },
  { id: 'ecommerce', name: 'E-commerce', icon: ShoppingCart, count: 5 },
  { id: 'communication', name: 'Communication', icon: MessageSquare, count: 4 },
  { id: 'analytics', name: 'Analytics', icon: BarChart3, count: 3 }
];

const FEATURED_INTEGRATIONS = [
  {
    id: 'quickbooks',
    name: 'QuickBooks Online',
    category: 'accounting',
    description: 'Sync transactions, invoices, and financial data seamlessly',
    logo: '💼',
    status: 'available',
    popularity: 95,
    features: ['2-way sync', 'Real-time updates', 'Auto categorization'],
    setup_time: '5 minutes',
    pricing: 'Free'
  },
  {
    id: 'stripe',
    name: 'Stripe',
    category: 'payment',
    description: 'Accept payments and sync transaction data automatically',
    logo: '💳',
    status: 'available',
    popularity: 92,
    features: ['Payment processing', 'Webhook support', 'Dispute handling'],
    setup_time: '3 minutes',
    pricing: 'Free'
  },
  {
    id: 'xero',
    name: 'Xero',
    category: 'accounting',
    description: 'Comprehensive accounting software integration',
    logo: '📊',
    status: 'available',
    popularity: 88,
    features: ['Bank reconciliation', 'Invoice sync', 'Tax reporting'],
    setup_time: '7 minutes',
    pricing: 'Free'
  },
  {
    id: 'paypal',
    name: 'PayPal',
    category: 'payment',
    description: 'Sync PayPal transactions and payment data',
    logo: '🅿️',
    status: 'available',
    popularity: 85,
    features: ['Transaction sync', 'Multi-currency', 'Automatic reconciliation'],
    setup_time: '4 minutes',
    pricing: 'Free'
  },
  {
    id: 'shopify',
    name: 'Shopify',
    category: 'ecommerce',
    description: 'Connect your Shopify store for sales and inventory sync',
    logo: '🛍️',
    status: 'available',
    popularity: 90,
    features: ['Sales sync', 'Inventory tracking', 'Customer data'],
    setup_time: '6 minutes',
    pricing: 'Free'
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    category: 'crm',
    description: 'Sync leads, opportunities, and customer data',
    logo: '☁️',
    status: 'available',
    popularity: 87,
    features: ['Lead sync', 'Opportunity tracking', 'Custom fields'],
    setup_time: '10 minutes',
    pricing: 'Premium'
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    category: 'crm',
    description: 'Marketing, sales, and service platform integration',
    logo: '🧲',
    status: 'available',
    popularity: 83,
    features: ['Contact sync', 'Deal pipeline', 'Email tracking'],
    setup_time: '8 minutes',
    pricing: 'Free'
  },
  {
    id: 'slack',
    name: 'Slack',
    category: 'communication',
    description: 'Get financial alerts and notifications in Slack',
    logo: '💬',
    status: 'available',
    popularity: 89,
    features: ['Real-time alerts', 'Custom commands', 'Report sharing'],
    setup_time: '2 minutes',
    pricing: 'Free'
  },
  {
    id: 'square',
    name: 'Square',
    category: 'payment',
    description: 'Sync Square POS and payment processing data',
    logo: '⬜',
    status: 'available',
    popularity: 81,
    features: ['POS sync', 'Inventory tracking', 'Customer insights'],
    setup_time: '5 minutes',
    pricing: 'Free'
  },
  {
    id: 'woocommerce',
    name: 'WooCommerce',
    category: 'ecommerce',
    description: 'WordPress e-commerce platform integration',
    logo: '🔧',
    status: 'available',
    popularity: 79,
    features: ['Order sync', 'Product management', 'Customer data'],
    setup_time: '7 minutes',
    pricing: 'Free'
  }
];

export default function Integrations() {
  const [integrations, setIntegrations] = useState(FEATURED_INTEGRATIONS);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [connectedIntegrations, setConnectedIntegrations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadConnectedIntegrations();
  }, []);

  const loadConnectedIntegrations = async () => {
    // In a real app, this would load from an API
    setConnectedIntegrations(['quickbooks', 'stripe', 'slack']);
  };

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = !searchTerm || 
      integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || integration.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleConnect = async (integration) => {
    setSelectedIntegration(integration);
    setShowSetupModal(true);
  };

  const handleSetupComplete = async (integrationId, credentials) => {
    setIsLoading(true);
    try {
      // Simulate API call to connect integration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setConnectedIntegrations(prev => [...prev, integrationId]);
      setShowSetupModal(false);
      setSelectedIntegration(null);
      
      alert(`✅ Successfully connected ${selectedIntegration?.name}!`);
    } catch (error) {
      alert('❌ Connection failed. Please try again.');
    }
    setIsLoading(false);
  };

  const isConnected = (integrationId) => {
    return connectedIntegrations.includes(integrationId);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-6">
      <style>{`
        /* INTEGRATIONS CONTAINER - IMPROVED READABILITY */
        .integrations-container {
          background: linear-gradient(135deg, 
            #0a0a0a 0%,
            #1a1a2e 25%,
            #16213e 50%,
            #0f0f23 75%,
            #000000 100%
          );
          min-height: 100vh;
          padding: 2rem;
        }
        
        /* INTEGRATION CARDS - MUCH BETTER CONTRAST */
        .integration-card {
          background: linear-gradient(145deg, 
            rgba(30, 41, 59, 0.95) 0%,
            rgba(51, 65, 85, 0.9) 100%
          );
          backdrop-filter: blur(20px);
          border: 1px solid rgba(148, 163, 184, 0.3);
          border-radius: 16px;
          transition: all 0.3s ease;
        }
        
        .integration-card:hover {
          transform: translateY(-4px);
          border: 1px solid rgba(59, 130, 246, 0.6);
          box-shadow: 
            0 10px 25px rgba(0, 0, 0, 0.3),
            0 0 20px rgba(59, 130, 246, 0.2);
        }

        /* CATEGORY BUTTONS - IMPROVED VISIBILITY */
        .category-button {
          background: rgba(30, 41, 59, 0.9);
          border: 1px solid rgba(148, 163, 184, 0.3);
          border-radius: 12px;
          transition: all 0.3s ease;
          color: #f1f5f9 !important;
        }
        
        .category-button:hover,
        .category-button.active {
          background: rgba(59, 130, 246, 0.3);
          border: 1px solid rgba(59, 130, 246, 0.7);
          color: #ffffff !important;
        }

        /* INTEGRATION CARD TEXT - HIGH CONTRAST */
        .integration-name {
          color: #f1f5f9 !important;
          font-weight: 700;
          font-size: 1.25rem;
          margin-bottom: 0.5rem;
        }

        .integration-description {
          color: #cbd5e1 !important;
          font-size: 0.9rem;
          line-height: 1.5;
          margin-bottom: 1rem;
        }

        .integration-features {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .feature-badge {
          background: rgba(59, 130, 246, 0.2) !important;
          color: #93c5fd !important;
          border: 1px solid rgba(59, 130, 246, 0.4);
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
        }

        .integration-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          font-size: 0.8rem;
        }

        .setup-time {
          color: #94a3b8 !important;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .pricing-badge {
          background: rgba(16, 185, 129, 0.2) !important;
          color: #6ee7b7 !important;
          border: 1px solid rgba(16, 185, 129, 0.4);
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          font-weight: 600;
        }

        .status-badge {
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          font-weight: 600;
        }

        .status-available {
          background: rgba(16, 185, 129, 0.2) !important;
          color: #6ee7b7 !important;
          border: 1px solid rgba(16, 185, 129, 0.4);
        }

        .status-coming-soon {
          background: rgba(245, 158, 11, 0.2) !important;
          color: #fcd34d !important;
          border: 1px solid rgba(245, 158, 11, 0.4);
        }

        .popularity-score {
          color: #10b981 !important;
          font-weight: 700;
          font-size: 0.9rem;
        }

        /* CONNECT BUTTONS - HIGH VISIBILITY */
        .connect-button {
          width: 100%;
          padding: 0.75rem;
          border-radius: 8px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .connect-button-available {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%) !important;
          color: white !important;
          border: none;
        }

        .connect-button-available:hover {
          background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%) !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }

        .connect-button-connected {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
          color: white !important;
          border: none;
        }

        .connect-button-connected:hover {
          background: linear-gradient(135deg, #059669 0%, #047857 100%) !important;
        }
      `}</style>

      <div className="integrations-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-4">
            🔗 Integrations Hub
          </h1>
          <p className="text-gray-400 text-xl mb-6">
            Connect AccounTech with your favorite business tools
          </p>
          <div className="flex justify-center gap-4 text-sm text-gray-500">
            <span>✨ 45+ Integrations</span>
            <span>🔒 Enterprise Security</span>
            <span>⚡ Real-time Sync</span>
            <span>🆓 Most integrations free</span>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col md:flex-row gap-6 mb-8"
        >
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search integrations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 bg-slate-800/50 border-slate-600 text-white"
            />
          </div>

          {/* Connected Count */}
          <div className="flex items-center gap-2">
            <Badge className="bg-green-600/20 text-green-300">
              {connectedIntegrations.length} Connected
            </Badge>
            <Button variant="outline" size="sm" className="bg-slate-800/50 border-slate-600">
              <RefreshCw className="w-4 h-4 mr-2" />
              Sync All
            </Button>
          </div>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-3 mb-8"
        >
          {INTEGRATION_CATEGORIES.map((category, index) => (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              onClick={() => setSelectedCategory(category.id)}
              className={`category-button px-4 py-2 flex items-center gap-2 text-sm font-medium transition-all ${
                selectedCategory === category.id ? 'active' : ''
              }`}
            >
              <category.icon className="w-4 h-4" />
              <span className="text-white">{category.name}</span>
              <Badge variant="secondary" className="text-xs">
                {category.count}
              </Badge>
            </motion.button>
          ))}
        </motion.div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIntegrations.map((integration, index) => (
            <motion.div
              key={integration.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="integration-card p-6"
            >
              {/* Integration Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{integration.logo}</div>
                  <div>
                    <h3 className="integration-name">{integration.name}</h3>
                    <Badge className={`status-badge ${integration.status === 'available' ? 'status-available' : 'status-coming-soon'}`}>
                      {integration.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400 mb-1">Popularity</div>
                  <div className="popularity-score">{integration.popularity}%</div>
                </div>
              </div>

              {/* Description */}
              <p className="integration-description">
                {integration.description}
              </p>

              {/* Features */}
              <div className="integration-features">
                {integration.features.slice(0, 3).map(feature => (
                  <Badge key={feature} className="feature-badge">
                    {feature}
                  </Badge>
                ))}
              </div>

              {/* Setup Info */}
              <div className="integration-meta">
                <span className="setup-time">
                  <Clock className="w-3 h-3" />
                  {integration.setup_time}
                </span>
                <Badge className="pricing-badge">
                  {integration.pricing}
                </Badge>
              </div>

              {/* Action Button */}
              <Button
                onClick={() => handleConnect(integration)}
                disabled={isConnected(integration.id)}
                className={`connect-button ${
                  isConnected(integration.id) ? 'connect-button-connected' : 'connect-button-available'
                }`}
              >
                {isConnected(integration.id) ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Connected
                  </>
                ) : (
                  <>
                    <Plug className="w-4 h-4 mr-2" />
                    Connect
                  </>
                )}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Setup Modal */}
        {showSetupModal && selectedIntegration && (
          <IntegrationSetupModal
            integration={selectedIntegration}
            isOpen={showSetupModal}
            onClose={() => {
              setShowSetupModal(false);
              setSelectedIntegration(null);
            }}
            onComplete={handleSetupComplete}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
}

// Integration Setup Modal Component
function IntegrationSetupModal({ integration, isOpen, onClose, onComplete, isLoading }) {
  const [credentials, setCredentials] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    onComplete(integration.id, credentials);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-slate-800 border-slate-600">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <span className="text-2xl">{integration.logo}</span>
            Connect {integration.name}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="text-sm text-gray-300 mb-4">
            {integration.description}
          </div>

          {/* Common integration fields */}
          <div>
            <Label className="text-gray-300">API Key</Label>
            <Input
              type="password"
              placeholder="Enter your API key..."
              className="bg-slate-700 border-slate-600 text-white"
              onChange={(e) => setCredentials(prev => ({ ...prev, api_key: e.target.value }))}
            />
          </div>

          <div>
            <Label className="text-gray-300">Organization ID (Optional)</Label>
            <Input
              placeholder="Enter organization ID..."
              className="bg-slate-700 border-slate-600 text-white"
              onChange={(e) => setCredentials(prev => ({ ...prev, org_id: e.target.value }))}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="auto-sync" />
            <Label htmlFor="auto-sync" className="text-sm text-gray-300">
              Enable automatic synchronization
            </Label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Connecting...
                </>
              ) : (
                <>
                  <Plug className="w-4 h-4 mr-2" />
                  Connect
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
