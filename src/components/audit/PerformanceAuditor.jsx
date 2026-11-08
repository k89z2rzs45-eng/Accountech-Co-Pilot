import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Zap,
  Clock,
  Database,
  Image,
  Code,
  Network,
  Cpu,
  MemoryStick,
  HardDrive,
  Wifi,
  Smartphone,
  Monitor,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Activity,
  Gauge,
  FileCode,
  Package,
  Globe,
  Eye,
  Users,
  Settings
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function PerformanceAuditor() {
  const [performanceData, setPerformanceData] = useState({
    overall: { score: 0, grade: 'F' },
    metrics: {
      fcp: { value: 0, target: 1800, status: 'measuring' },
      lcp: { value: 0, target: 2500, status: 'measuring' },
      fid: { value: 0, target: 100, status: 'measuring' },
      cls: { value: 0, target: 0.1, status: 'measuring' },
      ttfb: { value: 0, target: 600, status: 'measuring' }
    },
    audits: {
      bundle: { status: 'pending', issues: [] },
      images: { status: 'pending', issues: [] },
      caching: { status: 'pending', issues: [] },
      database: { status: 'pending', issues: [] },
      api: { status: 'pending', issues: [] },
      rendering: { status: 'pending', issues: [] }
    },
    recommendations: [],
    trends: []
  });
  const [isAuditing, setIsAuditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');

  // Pages to audit for performance
  const CRITICAL_PAGES = [
    'Dashboard', 'Transactions', 'Invoices', 'BusinessIntelligence', 
    'Analytics', 'CRM', 'Inventory', 'Settings'
  ];

  // Performance thresholds
  const PERFORMANCE_THRESHOLDS = {
    excellent: { min: 90, color: 'green' },
    good: { min: 70, color: 'yellow' },
    needsImprovement: { min: 50, color: 'orange' },
    poor: { min: 0, color: 'red' }
  };

  useEffect(() => {
    runPerformanceAudit();
    setupPerformanceMonitoring();
  }, []);

  const runPerformanceAudit = async () => {
    setIsAuditing(true);
    console.log('🚀 Starting Performance Audit...');
    
    try {
      // Simulate performance measurements
      await measureCoreWebVitals();
      await auditBundleSize();
      await auditImageOptimization();
      await auditCacheStrategy();
      await auditDatabasePerformance();
      await auditAPIPerformance();
      await auditRenderingPerformance();
      
      // Generate recommendations
      const recommendations = await generatePerformanceRecommendations();
      
      // Calculate overall score
      const overallScore = calculateOverallScore();
      
      setPerformanceData(prev => ({
        ...prev,
        overall: {
          score: overallScore,
          grade: getPerformanceGrade(overallScore)
        },
        recommendations
      }));
      
      console.log('✅ Performance Audit Complete!');
      
    } catch (error) {
      console.error('❌ Performance audit failed:', error);
    }
    
    setIsAuditing(false);
  };

  const measureCoreWebVitals = async () => {
    // Simulate measuring Core Web Vitals
    const metrics = {
      fcp: { value: Math.random() * 3000 + 1000, target: 1800, status: 'measured' },
      lcp: { value: Math.random() * 4000 + 2000, target: 2500, status: 'measured' },
      fid: { value: Math.random() * 200 + 50, target: 100, status: 'measured' },
      cls: { value: Math.random() * 0.3, target: 0.1, status: 'measured' },
      ttfb: { value: Math.random() * 1000 + 400, target: 600, status: 'measured' }
    };
    
    setPerformanceData(prev => ({
      ...prev,
      metrics
    }));
  };

  const auditBundleSize = async () => {
    const bundleIssues = [
      {
        type: 'large_bundle',
        description: 'Main bundle size exceeds 1MB',
        currentValue: '2.8MB',
        targetValue: '< 1MB',
        severity: 'high',
        impact: 'Slow initial page load',
        solution: 'Implement code splitting and tree shaking'
      },
      {
        type: 'unused_dependencies',
        description: 'Unused npm packages detected',
        currentValue: '450KB',
        targetValue: '0KB',
        severity: 'medium',
        impact: 'Larger bundle size',
        solution: 'Remove unused dependencies with webpack-bundle-analyzer'
      },
      {
        type: 'duplicate_code',
        description: 'Duplicate code chunks found',
        currentValue: '320KB',
        targetValue: '< 50KB',
        severity: 'medium',
        impact: 'Inefficient bundling',
        solution: 'Use dynamic imports and shared chunks'
      }
    ];

    setPerformanceData(prev => ({
      ...prev,
      audits: {
        ...prev.audits,
        bundle: {
          status: 'completed',
          issues: bundleIssues,
          score: 45
        }
      }
    }));
  };

  const auditImageOptimization = async () => {
    const imageIssues = [
      {
        type: 'unoptimized_images',
        description: 'Large unoptimized images detected',
        currentValue: '15 images > 500KB',
        targetValue: 'All images < 100KB',
        severity: 'high',
        impact: 'Slow image loading',
        solution: 'Compress images and use WebP format'
      },
      {
        type: 'missing_lazy_loading',
        description: 'Images not lazy loaded',
        currentValue: '23 images',
        targetValue: 'All off-screen images',
        severity: 'medium',
        impact: 'Slower initial load',
        solution: 'Implement lazy loading for images'
      }
    ];

    setPerformanceData(prev => ({
      ...prev,
      audits: {
        ...prev.audits,
        images: {
          status: 'completed',
          issues: imageIssues,
          score: 62
        }
      }
    }));
  };

  const auditCacheStrategy = async () => {
    const cacheIssues = [
      {
        type: 'no_service_worker',
        description: 'Service Worker not implemented',
        currentValue: 'None',
        targetValue: 'Active Service Worker',
        severity: 'high',
        impact: 'No offline support, poor caching',
        solution: 'Implement Service Worker for caching strategy'
      },
      {
        type: 'poor_cache_headers',
        description: 'Inefficient cache headers',
        currentValue: 'Short TTL',
        targetValue: '1 year for static assets',
        severity: 'medium',
        impact: 'Frequent re-downloads',
        solution: 'Configure proper cache-control headers'
      }
    ];

    setPerformanceData(prev => ({
      ...prev,
      audits: {
        ...prev.audits,
        caching: {
          status: 'completed',
          issues: cacheIssues,
          score: 55
        }
      }
    }));
  };

  const auditDatabasePerformance = async () => {
    const dbIssues = [
      {
        type: 'missing_indexes',
        description: 'Missing database indexes on foreign keys',
        currentValue: '8 missing indexes',
        targetValue: 'All foreign keys indexed',
        severity: 'high',
        impact: 'Slow query performance',
        solution: 'Add indexes on frequently queried columns'
      },
      {
        type: 'n_plus_one',
        description: 'N+1 query problems detected',
        currentValue: '12 instances',
        targetValue: '0 instances',
        severity: 'high',
        impact: 'Excessive database calls',
        solution: 'Implement eager loading and query optimization'
      },
      {
        type: 'large_payloads',
        description: 'Large API response payloads',
        currentValue: 'Average 2.5MB',
        targetValue: '< 500KB',
        severity: 'medium',
        impact: 'Slow data transfer',
        solution: 'Implement pagination and field selection'
      }
    ];

    setPerformanceData(prev => ({
      ...prev,
      audits: {
        ...prev.audits,
        database: {
          status: 'completed',
          issues: dbIssues,
          score: 38
        }
      }
    }));
  };

  const auditAPIPerformance = async () => {
    const apiIssues = [
      {
        type: 'slow_endpoints',
        description: 'API endpoints with slow response times',
        currentValue: '8 endpoints > 2s',
        targetValue: 'All endpoints < 500ms',
        severity: 'high',
        impact: 'Poor user experience',
        solution: 'Optimize queries and add response caching'
      },
      {
        type: 'no_compression',
        description: 'API responses not compressed',
        currentValue: 'No compression',
        targetValue: 'Gzip/Brotli compression',
        severity: 'medium',
        impact: 'Larger payload sizes',
        solution: 'Enable response compression'
      }
    ];

    setPerformanceData(prev => ({
      ...prev,
      audits: {
        ...prev.audits,
        api: {
          status: 'completed',
          issues: apiIssues,
          score: 58
        }
      }
    }));
  };

  const auditRenderingPerformance = async () => {
    const renderingIssues = [
      {
        type: 'large_dom',
        description: 'Large DOM size on some pages',
        currentValue: '> 3000 elements',
        targetValue: '< 1500 elements',
        severity: 'medium',
        impact: 'Slower rendering and interactions',
        solution: 'Implement virtual scrolling and lazy rendering'
      },
      {
        type: 'layout_thrashing',
        description: 'Excessive layout recalculations',
        currentValue: '45ms avg',
        targetValue: '< 16ms',
        severity: 'high',
        impact: 'Janky animations and scrolling',
        solution: 'Use CSS transforms instead of layout properties'
      }
    ];

    setPerformanceData(prev => ({
      ...prev,
      audits: {
        ...prev.audits,
        rendering: {
          status: 'completed',
          issues: renderingIssues,
          score: 65
        }
      }
    }));
  };

  const generatePerformanceRecommendations = async () => {
    return [
      {
        priority: 'critical',
        category: 'Bundle Optimization',
        title: 'Implement Code Splitting',
        description: 'Split the main bundle into smaller chunks for faster loading',
        impact: 'high',
        effort: 'medium',
        savingsEstimate: '60% faster initial load',
        implementation: 'Use React.lazy() and dynamic imports for route-based splitting',
        timeline: '2-3 days'
      },
      {
        priority: 'high',
        category: 'Database Performance',
        title: 'Add Database Indexes',
        description: 'Create indexes on foreign key columns and frequently queried fields',
        impact: 'high',
        effort: 'low',
        savingsEstimate: '70% faster queries',
        implementation: 'CREATE INDEX statements on key columns',
        timeline: '1 day'
      },
      {
        priority: 'high',
        category: 'Caching Strategy',
        title: 'Implement Service Worker',
        description: 'Add Service Worker for aggressive caching and offline support',
        impact: 'high',
        effort: 'high',
        savingsEstimate: '80% faster repeat visits',
        implementation: 'Workbox for cache-first strategy on static assets',
        timeline: '3-5 days'
      },
      {
        priority: 'medium',
        category: 'Image Optimization',
        title: 'Optimize Image Assets',
        description: 'Compress images and implement lazy loading',
        impact: 'medium',
        effort: 'low',
        savingsEstimate: '40% faster image loading',
        implementation: 'WebP format + Intersection Observer API',
        timeline: '1-2 days'
      },
      {
        priority: 'medium',
        category: 'API Performance',
        title: 'Implement Response Caching',
        description: 'Cache frequently requested API responses',
        impact: 'medium',
        effort: 'medium',
        savingsEstimate: '50% fewer API calls',
        implementation: 'Redis cache with TTL strategy',
        timeline: '2-3 days'
      }
    ];
  };

  const calculateOverallScore = () => {
    const auditScores = Object.values(performanceData.audits)
      .filter(audit => audit.status === 'completed')
      .map(audit => audit.score);
    
    return auditScores.length > 0 
      ? Math.round(auditScores.reduce((a, b) => a + b, 0) / auditScores.length)
      : 0;
  };

  const getPerformanceGrade = (score) => {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    return 'F';
  };

  const getMetricStatus = (metric) => {
    const isGood = metric.value <= metric.target;
    return {
      status: isGood ? 'good' : 'poor',
      color: isGood ? 'text-green-500' : 'text-red-500',
      icon: isGood ? CheckCircle : XCircle
    };
  };

  const setupPerformanceMonitoring = () => {
    // Simulate real-time performance data
    const trendData = [];
    for (let i = 23; i >= 0; i--) {
      trendData.push({
        time: `${i}:00`,
        fcp: Math.random() * 1000 + 1500,
        lcp: Math.random() * 1500 + 2000,
        fid: Math.random() * 50 + 50,
        loadTime: Math.random() * 2000 + 3000
      });
    }
    
    setPerformanceData(prev => ({
      ...prev,
      trends: trendData
    }));
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      critical: 'bg-red-500 text-white',
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-blue-100 text-blue-800'
    };
    
    return (
      <Badge className={colors[priority] || 'bg-gray-100 text-gray-800'}>
        {priority}
      </Badge>
    );
  };

  const getImpactBadge = (impact) => {
    const colors = {
      high: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-blue-100 text-blue-800'
    };
    
    return (
      <Badge className={colors[impact] || 'bg-gray-100 text-gray-800'}>
        {impact} impact
      </Badge>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-500" />
            Performance Audit & Optimization
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              className={`text-lg px-4 py-2 ${
                performanceData.overall.score >= 90 ? 'bg-green-500' :
                performanceData.overall.score >= 70 ? 'bg-yellow-500' :
                'bg-red-500'
              } text-white`}
            >
              {performanceData.overall.grade} ({performanceData.overall.score})
            </Badge>
            <Button 
              onClick={runPerformanceAudit} 
              disabled={isAuditing}
              size="sm"
            >
              {isAuditing ? (
                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              {isAuditing ? 'Auditing...' : 'Run Audit'}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="vitals">Core Vitals</TabsTrigger>
            <TabsTrigger value="audits">Audits</TabsTrigger>
            <TabsTrigger value="recommendations">Fixes</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="monitoring">Monitor</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            {/* Performance Score Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="text-center">
                <CardContent className="p-4">
                  <Gauge className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <p className="text-3xl font-bold text-purple-600">
                    {performanceData.overall.score}
                  </p>
                  <p className="text-sm text-gray-600">Overall Score</p>
                  <div className="mt-2">
                    <Badge className={
                      performanceData.overall.score >= 90 ? 'bg-green-500 text-white' :
                      performanceData.overall.score >= 70 ? 'bg-yellow-500 text-white' :
                      'bg-red-500 text-white'
                    }>
                      Grade {performanceData.overall.grade}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="p-4">
                  <Package className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <p className="text-3xl font-bold text-blue-600">2.8MB</p>
                  <p className="text-sm text-gray-600">Bundle Size</p>
                  <Progress value={28} className="mt-2" /> {/* 2.8MB / 10MB * 100 */}
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="p-4">
                  <Database className="w-8 h-8 mx-auto mb-2 text-red-600" />
                  <p className="text-3xl font-bold text-red-600">
                    {performanceData.audits.database.score || 38}
                  </p>
                  <p className="text-sm text-gray-600">DB Performance</p>
                  <Progress value={performanceData.audits.database.score || 38} className="mt-2" />
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="p-4">
                  <Network className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <p className="text-3xl font-bold text-green-600">
                    {performanceData.audits.api.score || 58}
                  </p>
                  <p className="text-sm text-gray-600">API Performance</p>
                  <Progress value={performanceData.audits.api.score || 58} className="mt-2" />
                </CardContent>
              </Card>
            </div>

            {/* Critical Issues Alert */}
            {performanceData.overall.score < 50 && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <strong>Critical Performance Issues Detected!</strong> Your app is running significantly below optimal performance. Immediate action required to improve user experience.
                </AlertDescription>
              </Alert>
            )}

            {/* Quick Performance Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(performanceData.audits).map(([key, audit]) => {
                const icons = {
                  bundle: Package,
                  images: Image,
                  caching: HardDrive,
                  database: Database,
                  api: Network,
                  rendering: Monitor
                };
                
                const Icon = icons[key] || Activity;
                const score = audit.score || 0;
                
                return (
                  <Card key={key} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Icon className="w-5 h-5 text-gray-600" />
                      <div className={`text-sm font-medium ${
                        score >= 80 ? 'text-green-500' :
                        score >= 60 ? 'text-yellow-500' : 
                        'text-red-500'
                      }`}>
                        {score}%
                      </div>
                    </div>
                    <h4 className="font-medium capitalize mb-1">{key}</h4>
                    <Progress value={score} className="h-2" />
                    <p className="text-xs text-gray-600 mt-1">
                      {audit.issues?.length || 0} issues found
                    </p>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="vitals" className="mt-6">
            {/* Core Web Vitals */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
              {Object.entries(performanceData.metrics).map(([key, metric]) => {
                const status = getMetricStatus(metric);
                const IconComponent = status.icon;
                
                const labels = {
                  fcp: 'First Contentful Paint',
                  lcp: 'Largest Contentful Paint', 
                  fid: 'First Input Delay',
                  cls: 'Cumulative Layout Shift',
                  ttfb: 'Time to First Byte'
                };
                
                return (
                  <Card key={key} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium uppercase tracking-wide">{key}</h4>
                      <IconComponent className={`w-5 h-5 ${status.color}`} />
                    </div>
                    <p className="text-2xl font-bold mb-1">
                      {key === 'cls' ? metric.value.toFixed(3) : `${Math.round(metric.value)}ms`}
                    </p>
                    <p className="text-xs text-gray-600 mb-2">{labels[key]}</p>
                    <div className="text-xs">
                      <span className="text-gray-500">Target: </span>
                      <span className="font-medium">
                        {key === 'cls' ? metric.target.toFixed(1) : `${metric.target}ms`}
                      </span>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Core Web Vitals Chart */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Core Web Vitals Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData.trends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="fcp" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    name="First Contentful Paint (ms)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="lcp" 
                    stroke="#82ca9d" 
                    strokeWidth={2}
                    name="Largest Contentful Paint (ms)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="fid" 
                    stroke="#ffc658" 
                    strokeWidth={2}
                    name="First Input Delay (ms)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>

          <TabsContent value="audits" className="mt-6">
            <div className="space-y-6">
              {Object.entries(performanceData.audits).map(([auditType, audit]) => {
                if (audit.status !== 'completed') return null;
                
                const icons = {
                  bundle: Package,
                  images: Image,
                  caching: HardDrive,
                  database: Database,
                  api: Network,
                  rendering: Monitor
                };
                
                const Icon = icons[auditType] || Activity;
                
                return (
                  <Card key={auditType} className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Icon className="w-5 h-5" />
                        {auditType.charAt(0).toUpperCase() + auditType.slice(1)} Audit
                      </h3>
                      <div className="flex items-center gap-2">
                        <Badge className={
                          audit.score >= 80 ? 'bg-green-500 text-white' :
                          audit.score >= 60 ? 'bg-yellow-500 text-white' :
                          'bg-red-500 text-white'
                        }>
                          Score: {audit.score}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {audit.issues.map((issue, idx) => (
                        <div key={idx} className="border rounded-lg p-3 bg-gray-50">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium">{issue.type.replace('_', ' ').toUpperCase()}</h4>
                            <Badge className={
                              issue.severity === 'high' ? 'bg-red-100 text-red-800' :
                              issue.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }>
                              {issue.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">{issue.description}</p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-600">Current: </span>
                              <span className="text-red-600">{issue.currentValue}</span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-600">Target: </span>
                              <span className="text-green-600">{issue.targetValue}</span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-600">Impact: </span>
                              <span>{issue.impact}</span>
                            </div>
                          </div>
                          <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-200">
                            <p className="text-sm text-blue-800">
                              <strong>💡 Solution:</strong> {issue.solution}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="recommendations" className="mt-6">
            <div className="space-y-4">
              {performanceData.recommendations.map((rec, idx) => (
                <Card key={idx} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{rec.title}</h3>
                        {getPriorityBadge(rec.priority)}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{rec.category}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      {getImpactBadge(rec.impact)}
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Effort: </span>
                      <span>{rec.effort}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Timeline: </span>
                      <span>{rec.timeline}</span>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-3 rounded-lg border border-green-200 mb-3">
                    <p className="text-sm text-green-800">
                      <strong>📈 Expected Savings:</strong> {rec.savingsEstimate}
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800">
                      <strong>🔧 Implementation:</strong> {rec.implementation}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trends" className="mt-6">
            {/* Performance Trends Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-4">
                <h3 className="font-semibold mb-4">Load Time Trend (24 Hours)</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={performanceData.trends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="loadTime" 
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
              
              <Card className="p-4">
                <h3 className="font-semibold mb-4">Core Web Vitals Comparison</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={[
                    { name: 'FCP', current: performanceData.metrics.fcp.value, target: performanceData.metrics.fcp.target },
                    { name: 'LCP', current: performanceData.metrics.lcp.value, target: performanceData.metrics.lcp.target },
                    { name: 'FID', current: performanceData.metrics.fid.value, target: performanceData.metrics.fid.target },
                    { name: 'TTFB', current: performanceData.metrics.ttfb.value, target: performanceData.metrics.ttfb.target }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="current" fill="#ff7c7c" name="Current" />
                    <Bar dataKey="target" fill="#82ca9d" name="Target" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="monitoring" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {CRITICAL_PAGES.map(page => (
                <Card key={page} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{page}</h4>
                    <Badge className={
                      Math.random() > 0.7 ? 'bg-red-100 text-red-800' :
                      Math.random() > 0.4 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }>
                      {Math.random() > 0.7 ? 'Slow' : Math.random() > 0.4 ? 'OK' : 'Fast'}
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Load Time:</span>
                      <span>{(Math.random() * 3000 + 1000).toFixed(0)}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bundle Size:</span>
                      <span>{(Math.random() * 500 + 200).toFixed(0)}KB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>API Calls:</span>
                      <span>{Math.floor(Math.random() * 10 + 3)}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}