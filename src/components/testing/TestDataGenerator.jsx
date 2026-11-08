import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Database, 
  Zap, 
  Trash2, 
  Download, 
  Upload,
  CheckCircle2,
  AlertTriangle,
  Users,
  Receipt,
  FileText,
  DollarSign,
  Package,
  Target,
  Settings,
  Play,
  Pause,
  RefreshCw
} from "lucide-react";
import { Transaction } from "@/api/entities";
import { Expense } from "@/api/entities";
import { Invoice } from "@/api/entities";
import { Client } from "@/api/entities";
import { Product } from "@/api/entities";
import { Budget } from "@/api/entities";

const TEST_DATA_TEMPLATES = {
  transactions: {
    icon: Receipt,
    name: "Transactions",
    description: "Financial transactions (income/expenses)",
    fields: ["amount", "description", "type", "category", "date", "currency"]
  },
  expenses: {
    icon: DollarSign,
    name: "Expenses",
    description: "Business expense records",
    fields: ["amount", "description", "category", "vendor", "date"]
  },
  invoices: {
    icon: FileText,
    name: "Invoices",
    description: "Client invoices and billing",
    fields: ["client_name", "amount", "items", "status", "due_date"]
  },
  clients: {
    icon: Users,
    name: "Clients",
    description: "Customer and client records",
    fields: ["name", "email", "phone", "address", "status"]
  },
  products: {
    icon: Package,
    name: "Products/Inventory",
    description: "Product catalog and stock",
    fields: ["name", "sku", "price", "cost", "stock", "category"]
  },
  budgets: {
    icon: Target,
    name: "Budgets",
    description: "Budget planning and tracking",
    fields: ["name", "amount", "category", "period", "start_date"]
  }
};

const SAMPLE_DATA = {
  transactions: [
    { type: "income", amount: 5000, description: "Consulting Services - Q4", category: "consulting", currency: "USD" },
    { type: "expense", amount: 1200, description: "Office Rent - December", category: "rent", currency: "USD" },
    { type: "income", amount: 3500, description: "Web Development Project", category: "sales", currency: "USD" },
    { type: "expense", amount: 450, description: "Adobe Creative Suite", category: "software", currency: "USD" },
    { type: "expense", amount: 89, description: "Business Lunch with Client", category: "meals", currency: "USD" }
  ],
  expenses: [
    { amount: 2500, description: "Marketing Campaign - Google Ads", category: "marketing", vendor: "Google" },
    { amount: 890, description: "Professional Photography", category: "professional_services", vendor: "Studio Pro" },
    { amount: 156, description: "Office Supplies - Staples", category: "office_supplies", vendor: "Staples" },
    { amount: 750, description: "Legal Consultation", category: "legal", vendor: "Law Firm ABC" }
  ],
  clients: [
    { name: "TechStart Inc", email: "hello@techstart.com", phone: "+1-555-0123", status: "active" },
    { name: "Creative Agency", email: "info@creative.agency", phone: "+1-555-0456", status: "active" },
    { name: "E-commerce Store", email: "support@ecommerce.store", phone: "+1-555-0789", status: "active" },
    { name: "Local Restaurant", email: "manager@restaurant.local", phone: "+1-555-0321", status: "inactive" }
  ],
  products: [
    { name: "Premium Widget", sku: "PW-001", selling_price: 299, cost_price: 150, current_stock: 50, category: "electronics" },
    { name: "Basic Service Package", sku: "BSP-002", selling_price: 99, cost_price: 30, current_stock: 0, category: "other" },
    { name: "Deluxe Kit", sku: "DK-003", selling_price: 459, cost_price: 200, current_stock: 25, category: "electronics" }
  ]
};

export default function TestDataGenerator() {
  const [selectedEntity, setSelectedEntity] = useState("transactions");
  const [recordCount, setRecordCount] = useState(25);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationLog, setGenerationLog] = useState([]);
  const [lastGenerated, setLastGenerated] = useState(null);

  const addLogEntry = (message, type = 'info') => {
    const entry = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toLocaleTimeString()
    };
    setGenerationLog(prev => [entry, ...prev.slice(0, 9)]); // Keep last 10 entries
  };

  const generateRandomData = (entity, count) => {
    const data = [];
    const baseData = SAMPLE_DATA[entity] || [];
    
    for (let i = 0; i < count; i++) {
      const baseRecord = baseData[i % baseData.length];
      let randomizedRecord = { ...baseRecord };
      
      // Add randomization based on entity type
      switch (entity) {
        case 'transactions':
          randomizedRecord.amount = Math.floor(Math.random() * 5000) + 100;
          randomizedRecord.date = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          randomizedRecord.description = `${randomizedRecord.description} #${i + 1}`;
          break;
          
        case 'expenses':
          randomizedRecord.amount = Math.floor(Math.random() * 2000) + 50;
          randomizedRecord.date = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          randomizedRecord.description = `${randomizedRecord.description} ${i + 1}`;
          break;
          
        case 'clients':
          randomizedRecord.name = `${randomizedRecord.name} ${i + 1}`;
          randomizedRecord.email = randomizedRecord.email.replace('@', `+${i}@`);
          break;
          
        case 'products':
          randomizedRecord.name = `${randomizedRecord.name} v${i + 1}`;
          randomizedRecord.sku = `${randomizedRecord.sku.split('-')[0]}-${String(i + 1).padStart(3, '0')}`;
          randomizedRecord.current_stock = Math.floor(Math.random() * 100);
          break;
          
        case 'budgets':
          const categories = ['office_supplies', 'marketing', 'travel', 'software', 'meals'];
          const periods = ['monthly', 'quarterly', 'yearly'];
          randomizedRecord = {
            name: `${categories[i % categories.length].replace('_', ' ')} Budget ${i + 1}`,
            amount: Math.floor(Math.random() * 10000) + 1000,
            category: categories[i % categories.length],
            period: periods[i % periods.length],
            currency: 'USD',
            start_date: new Date().toISOString().split('T')[0],
            end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          };
          break;
      }
      
      data.push(randomizedRecord);
    }
    
    return data;
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    addLogEntry(`Starting generation of ${recordCount} ${selectedEntity} records`, 'info');

    try {
      const data = generateRandomData(selectedEntity, recordCount);
      const batchSize = 10; // Process in batches to avoid overwhelming the system
      let processed = 0;

      for (let i = 0; i < data.length; i += batchSize) {
        const batch = data.slice(i, i + batchSize);
        
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Create records based on entity type
        try {
          switch (selectedEntity) {
            case 'transactions':
              await Promise.all(batch.map(record => Transaction.create(record)));
              break;
            case 'expenses':
              await Promise.all(batch.map(record => Expense.create(record)));
              break;
            case 'invoices':
              // Generate invoice structure
              const invoices = batch.map(record => ({
                client_name: `Test Client ${Math.floor(Math.random() * 100)}`,
                client_email: `client${Math.floor(Math.random() * 100)}@example.com`,
                issue_date: new Date().toISOString().split('T')[0],
                due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                currency: 'USD',
                items: [{
                  description: "Test Service",
                  quantity: 1,
                  rate: Math.floor(Math.random() * 1000) + 100,
                  amount: Math.floor(Math.random() * 1000) + 100
                }],
                total: Math.floor(Math.random() * 5000) + 500,
                status: ['draft', 'sent', 'paid'][Math.floor(Math.random() * 3)]
              }));
              await Promise.all(invoices.map(record => Invoice.create(record)));
              break;
            case 'clients':
              await Promise.all(batch.map(record => Client.create(record)));
              break;
            case 'products':
              await Promise.all(batch.map(record => Product.create(record)));
              break;
            case 'budgets':
              await Promise.all(batch.map(record => Budget.create(record)));
              break;
          }
          
          processed += batch.length;
          const progress = Math.round((processed / data.length) * 100);
          setGenerationProgress(progress);
          addLogEntry(`Processed ${processed}/${data.length} records`, 'success');
          
        } catch (error) {
          addLogEntry(`Error processing batch: ${error.message}`, 'error');
        }
      }

      setLastGenerated({
        entity: selectedEntity,
        count: processed,
        timestamp: new Date()
      });
      
      addLogEntry(`✅ Successfully generated ${processed} ${selectedEntity} records`, 'success');
      
    } catch (error) {
      addLogEntry(`❌ Generation failed: ${error.message}`, 'error');
    }

    setIsGenerating(false);
    setGenerationProgress(0);
  };

  const handleClearData = async (entityType) => {
    if (!confirm(`Are you sure you want to delete ALL ${entityType} data? This cannot be undone!`)) {
      return;
    }

    addLogEntry(`🗑️ Clearing all ${entityType} data...`, 'info');

    try {
      // In a real implementation, you'd call a bulk delete function
      // For now, we'll just log it since we can't actually delete via the SDK
      addLogEntry(`⚠️ Clear operation simulated for ${entityType}`, 'warning');
      addLogEntry('Note: Use the dashboard to actually delete records', 'info');
      
    } catch (error) {
      addLogEntry(`❌ Clear failed: ${error.message}`, 'error');
    }
  };

  const getEntityIcon = (entityType) => {
    const template = TEST_DATA_TEMPLATES[entityType];
    return template ? template.icon : Database;
  };

  return (
    <div className="space-y-6">
      <style jsx>{`
        .test-data-container {
          background: linear-gradient(145deg, 
            rgba(15, 23, 42, 0.98) 0%,
            rgba(30, 41, 59, 0.96) 50%,
            rgba(51, 65, 85, 0.94) 100%
          );
          border: 2px solid transparent;
          border-image: linear-gradient(45deg, #f59e0b, #ef4444, #8b5cf6) 1;
          border-radius: 20px;
          backdrop-filter: blur(30px);
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.4),
            0 0 80px rgba(245, 158, 11, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          position: relative;
          overflow: hidden;
        }
        
        .entity-selector {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }
        
        .entity-option {
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.05) 0%,
            rgba(255, 255, 255, 0.02) 100%
          );
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
        }
        
        .entity-option:hover {
          border-color: rgba(245, 158, 11, 0.5);
          background: linear-gradient(135deg, 
            rgba(245, 158, 11, 0.1) 0%,
            rgba(245, 158, 11, 0.05) 100%
          );
          transform: translateY(-2px);
        }
        
        .entity-option.selected {
          border-color: rgba(245, 158, 11, 0.8);
          background: linear-gradient(135deg, 
            rgba(245, 158, 11, 0.2) 0%,
            rgba(245, 158, 11, 0.1) 100%
          );
        }
        
        .log-entry {
          padding: 0.5rem 1rem;
          border-radius: 8px;
          margin-bottom: 0.5rem;
          font-family: monospace;
          font-size: 0.875rem;
          border-left: 4px solid;
        }
        
        .log-entry.info {
          background: rgba(59, 130, 246, 0.1);
          border-color: #3b82f6;
          color: #93c5fd;
        }
        
        .log-entry.success {
          background: rgba(16, 185, 129, 0.1);
          border-color: #10b981;
          color: #6ee7b7;
        }
        
        .log-entry.warning {
          background: rgba(245, 158, 11, 0.1);
          border-color: #f59e0b;
          color: #fcd34d;
        }
        
        .log-entry.error {
          background: rgba(239, 68, 68, 0.1);
          border-color: #ef4444;
          color: #fca5a5;
        }
        
        .generation-controls {
          background: linear-gradient(135deg, 
            rgba(59, 130, 246, 0.1) 0%,
            rgba(37, 99, 235, 0.08) 100%
          );
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }
      `}</style>

      {/* Header */}
      <Card className="test-data-container">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Database className="w-6 h-6 text-orange-400" />
              <CardTitle className="text-xl text-white">Test Data Generator</CardTitle>
            </div>
            <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">
              Development Tool
            </Badge>
          </div>
          <p className="text-gray-400">Generate realistic test data for development and testing</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Entity Selection */}
          <div>
            <Label className="text-white font-semibold mb-3 block">Select Data Type</Label>
            <div className="entity-selector">
              {Object.entries(TEST_DATA_TEMPLATES).map(([key, template]) => {
                const IconComponent = template.icon;
                return (
                  <div
                    key={key}
                    onClick={() => setSelectedEntity(key)}
                    className={`entity-option ${selectedEntity === key ? 'selected' : ''}`}
                  >
                    <IconComponent className="w-8 h-8 mx-auto mb-2 text-orange-400" />
                    <h4 className="font-semibold text-white mb-1">{template.name}</h4>
                    <p className="text-xs text-gray-400 mb-2">{template.description}</p>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {template.fields.slice(0, 3).map(field => (
                        <Badge key={field} className="text-xs bg-gray-700/50 text-gray-300">
                          {field}
                        </Badge>
                      ))}
                      {template.fields.length > 3 && (
                        <Badge className="text-xs bg-gray-700/50 text-gray-300">
                          +{template.fields.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Generation Controls */}
          <div className="generation-controls">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1">
                <Label className="text-white font-medium mb-2 block">Number of Records</Label>
                <Input
                  type="number"
                  value={recordCount}
                  onChange={(e) => setRecordCount(Math.max(1, Math.min(1000, parseInt(e.target.value) || 1)))}
                  min="1"
                  max="1000"
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <p className="text-xs text-gray-400 mt-1">Maximum: 1000 records per generation</p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Generate Data
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => handleClearData(selectedEntity)}
                  variant="outline"
                  className="border-red-500 text-red-400 hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Data
                </Button>
              </div>
            </div>

            {/* Progress Bar */}
            {isGenerating && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-white text-sm">Progress</Label>
                  <span className="text-sm text-gray-300">{generationProgress}%</span>
                </div>
                <Progress value={generationProgress} className="h-2" />
              </div>
            )}

            {/* Last Generation Info */}
            {lastGenerated && (
              <Alert className="bg-green-500/10 border-green-500/30">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                <AlertDescription className="text-green-300">
                  Last generated: {lastGenerated.count} {lastGenerated.entity} records at{' '}
                  {lastGenerated.timestamp.toLocaleTimeString()}
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Generation Log */}
          <div>
            <Label className="text-white font-semibold mb-3 block">Generation Log</Label>
            <div className="max-h-64 overflow-y-auto bg-gray-900/50 rounded-lg p-4">
              {generationLog.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No generation activity yet</p>
              ) : (
                <AnimatePresence>
                  {generationLog.map((entry) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`log-entry ${entry.type}`}
                    >
                      <span className="text-gray-400 mr-2">[{entry.timestamp}]</span>
                      {entry.message}
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>

          {/* Warning */}
          <Alert className="bg-yellow-500/10 border-yellow-500/30">
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
            <AlertDescription className="text-yellow-300">
              <strong>Development Tool:</strong> This generator is for testing purposes only. 
              Generated data is not suitable for production use and should be cleared before going live.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}