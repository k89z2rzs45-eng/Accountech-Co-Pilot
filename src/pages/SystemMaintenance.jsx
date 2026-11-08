import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Settings, 
  Database, 
  Shield, 
  Zap, 
  CheckCircle, 
  AlertTriangle,
  Gauge,
  Bug,
  Wrench,
  Server,
  Activity,
  FileText
} from 'lucide-react';
import { motion } from 'framer-motion';

// Import our production components
import ProductionReadyChecker from '../components/utils/ProductionReadyChecker';
import PerformanceMonitor from '../components/utils/PerformanceMonitor';
import SystemHealthCheck from '../components/audit/SystemHealthCheck';
import DuplicateDetector from '../components/audit/DuplicateDetector';
import FunctionAuditor from '../components/audit/FunctionAuditor';
import EntityRelationshipChecker from '../components/audit/EntityRelationshipChecker';
import MobileOptimizationAuditor from '../components/audit/MobileOptimizationAuditor';
import PerformanceAuditor from '../components/audit/PerformanceAuditor';

export default function SystemMaintenance() {
  const [activeTab, setActiveTab] = useState('production');

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      <style jsx>{`
        .maintenance-container {
          background: linear-gradient(135deg, 
            #0f172a 0%,
            #1e293b 25%,
            #334155 50%,
            #1e293b 75%,
            #0f172a 100%
          );
          min-height: 100vh;
          padding: 2rem;
        }
        
        .maintenance-header {
          background: linear-gradient(45deg, #ff6b35, #f7931e, #ffd700);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-size: 3rem;
          font-weight: 900;
          text-align: center;
          animation: headerGlow 3s ease-in-out infinite;
        }
        
        @keyframes headerGlow {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.2); }
        }
      `}</style>

      <div className="maintenance-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="maintenance-header mb-4">
            🔧 System Maintenance Center
          </h1>
          <p className="text-gray-400 text-lg">
            Production readiness, performance monitoring, and system diagnostics
          </p>
          <Badge className="mt-4 bg-red-600 text-white px-4 py-2">
            🚨 DEVELOPER MODE ONLY
          </Badge>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-7 bg-gray-800 border-gray-700">
              <TabsTrigger value="production" className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Production Ready
              </TabsTrigger>
              <TabsTrigger value="performance" className="flex items-center gap-2">
                <Gauge className="w-4 h-4" />
                Performance
              </TabsTrigger>
              <TabsTrigger value="health" className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                System Health
              </TabsTrigger>
              <TabsTrigger value="functions" className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Functions
              </TabsTrigger>
              <TabsTrigger value="entities" className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                Entities
              </TabsTrigger>
              <TabsTrigger value="mobile" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Mobile
              </TabsTrigger>
              <TabsTrigger value="audit" className="flex items-center gap-2">
                <Bug className="w-4 h-4" />
                Audit
              </TabsTrigger>
            </TabsList>

            {/* Production Readiness Check */}
            <TabsContent value="production">
              <Card className="border-gray-800 bg-gray-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    Production Readiness Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ProductionReadyChecker />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Performance Monitoring */}
            <TabsContent value="performance">
              <Card className="border-gray-800 bg-gray-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Gauge className="w-6 h-6 text-blue-400" />
                    Real-Time Performance Monitoring
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <PerformanceMonitor />
                </CardContent>
              </Card>
            </TabsContent>

            {/* System Health */}
            <TabsContent value="health">
              <Card className="border-gray-800 bg-gray-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Activity className="w-6 h-6 text-green-400" />
                    System Health Check
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SystemHealthCheck />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Functions Audit */}
            <TabsContent value="functions">
              <Card className="border-gray-800 bg-gray-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Zap className="w-6 h-6 text-yellow-400" />
                    Backend Functions Audit
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FunctionAuditor />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Entity Relationships */}
            <TabsContent value="entities">
              <Card className="border-gray-800 bg-gray-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Database className="w-6 h-6 text-purple-400" />
                    Entity Relationships & Data Integrity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <EntityRelationshipChecker />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Mobile Optimization */}
            <TabsContent value="mobile">
              <Card className="border-gray-800 bg-gray-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Settings className="w-6 h-6 text-cyan-400" />
                    Mobile Optimization Audit
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MobileOptimizationAuditor />
                </CardContent>
              </Card>
            </TabsContent>

            {/* General Audit */}
            <TabsContent value="audit">
              <div className="space-y-6">
                <Card className="border-gray-800 bg-gray-900">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Bug className="w-6 h-6 text-red-400" />
                      Duplicate Code Detection
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DuplicateDetector />
                  </CardContent>
                </Card>

                <Card className="border-gray-800 bg-gray-900">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Gauge className="w-6 h-6 text-orange-400" />
                      Performance Audit
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PerformanceAuditor />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Card className="border-blue-500 bg-blue-900/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-200">
                <Wrench className="w-5 h-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button 
                  onClick={() => window.location.reload()} 
                  className="bg-green-600 hover:bg-green-700"
                >
                  🔄 Refresh App
                </Button>
                <Button 
                  onClick={() => localStorage.clear()} 
                  className="bg-yellow-600 hover:bg-yellow-700"
                >
                  🗑️ Clear Cache
                </Button>
                <Button 
                  onClick={() => console.clear()} 
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  🧹 Clear Console
                </Button>
                <Button 
                  onClick={() => setActiveTab('production')} 
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  ✅ Check Production
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Developer Warning */}
        <Alert className="bg-red-900/20 border-red-500 mt-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-red-200">
            <strong>⚠️ Developer Mode:</strong> This maintenance center is only accessible to admin users in development mode. 
            All sensitive operations are logged and monitored. Use with caution in production environments.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}