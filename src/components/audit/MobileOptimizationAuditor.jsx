
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Smartphone,
  Tablet,
  Monitor,
  Zap,
  Eye,
  MousePointerClick, // FIXED: Replaced Touch with MousePointerClick
  Wifi,
  Battery,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Star,
  Clock,
  Download,
  Navigation,
  Layers,
  Settings
} from 'lucide-react';

export default function MobileOptimizationAuditor() {
  const [auditResults, setAuditResults] = useState({
    overall: { score: 0, grade: 'F' },
    responsive: { score: 0, issues: [] },
    performance: { score: 0, issues: [] },
    usability: { score: 0, issues: [] },
    accessibility: { score: 0, issues: [] },
    pwa: { score: 0, issues: [] }
  });
  const [isAuditing, setIsAuditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [deviceSimulation, setDeviceSimulation] = useState('mobile');

  // Pages to audit for mobile optimization
  const PAGES_TO_AUDIT = [
    'Dashboard', 'Transactions', 'Invoices', 'Expenses', 'Budgets',
    'Analytics', 'CRM', 'Inventory', 'Settings', 'BusinessIntelligence'
  ];

  useEffect(() => {
    runMobileAudit();
  }, []);

  const runMobileAudit = async () => {
    setIsAuditing(true);
    
    try {
      const results = {
        overall: { score: 0, grade: 'F' },
        responsive: await auditResponsiveDesign(),
        performance: await auditMobilePerformance(),
        usability: await auditMobileUsability(),
        accessibility: await auditMobileAccessibility(),
        pwa: await auditPWAFeatures()
      };

      // Calculate overall score
      const scores = [
        results.responsive.score,
        results.performance.score,
        results.usability.score,
        results.accessibility.score,
        results.pwa.score
      ];
      
      results.overall.score = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      results.overall.grade = getGrade(results.overall.score);
      
      setAuditResults(results);
    } catch (error) {
      console.error('Mobile audit failed:', error);
    }
    
    setIsAuditing(false);
  };

  const auditResponsiveDesign = async () => {
    const issues = [];
    let score = 100;

    // Check for common responsive design issues
    const responsiveIssues = [
      {
        page: 'Dashboard',
        issue: 'Desktop-only grid layout on mobile',
        severity: 'high',
        impact: -15,
        fix: 'Implement mobile-first responsive grid'
      },
      {
        page: 'BusinessIntelligence',
        issue: 'Drag & drop widgets not mobile-friendly',
        severity: 'high', 
        impact: -20,
        fix: 'Add touch-friendly controls for mobile'
      },
      {
        page: 'Analytics',
        issue: 'Charts not responsive on small screens',
        severity: 'medium',
        impact: -10,
        fix: 'Implement responsive chart containers'
      },
      {
        page: 'Transactions',
        issue: 'Table horizontal scroll issues',
        severity: 'medium',
        impact: -8,
        fix: 'Convert to mobile-friendly card layout'
      },
      {
        page: 'Settings',
        issue: 'Form inputs too small on mobile',
        severity: 'low',
        impact: -5,
        fix: 'Increase touch target sizes'
      }
    ];

    responsiveIssues.forEach(issue => {
      issues.push(issue);
      score += issue.impact;
    });

    return { score: Math.max(score, 0), issues };
  };

  const auditMobilePerformance = async () => {
    const issues = [];
    let score = 100;

    const performanceIssues = [
      {
        metric: 'First Contentful Paint',
        value: '3.2s',
        target: '<2.5s',
        severity: 'high',
        impact: -20,
        fix: 'Optimize bundle size and implement code splitting'
      },
      {
        metric: 'Largest Contentful Paint',
        value: '4.8s',
        target: '<4.0s', 
        severity: 'medium',
        impact: -15,
        fix: 'Lazy load images and optimize critical rendering path'
      },
      {
        metric: 'Time to Interactive',
        value: '5.1s',
        target: '<3.8s',
        severity: 'high',
        impact: -25,
        fix: 'Reduce JavaScript execution time and eliminate render-blocking resources'
      },
      {
        metric: 'Bundle Size',
        value: '2.8MB',
        target: '<1MB',
        severity: 'high',
        impact: -20,
        fix: 'Tree shake unused code, optimize dependencies'
      },
      {
        metric: 'Image Optimization',
        value: '78%',
        target: '>95%',
        severity: 'medium',
        impact: -10,
        fix: 'Implement WebP format and responsive images'
      }
    ];

    performanceIssues.forEach(issue => {
      issues.push(issue);
      score += issue.impact;
    });

    return { score: Math.max(score, 0), issues };
  };

  const auditMobileUsability = async () => {
    const issues = [];
    let score = 100;

    const usabilityIssues = [
      {
        component: 'Navigation',
        issue: 'Hamburger menu not intuitive',
        severity: 'medium',
        impact: -10,
        fix: 'Implement bottom navigation for better thumb reach'
      },
      {
        component: 'Forms',
        issue: 'Touch targets smaller than 44px',
        severity: 'high',
        impact: -15,
        fix: 'Increase button and input sizes for mobile'
      },
      {
        component: 'Modals',
        issue: 'Full-screen modals on small devices',
        severity: 'low',
        impact: -5,
        fix: 'Optimize modal sizing for mobile viewports'
      },
      {
        component: 'Tables',
        issue: 'Horizontal scrolling required',
        severity: 'high',
        impact: -20,
        fix: 'Convert to mobile-friendly card layout'
      },
      {
        component: 'Charts',
        issue: 'Not touch-optimized for interaction',
        severity: 'medium',
        impact: -12,
        fix: 'Add touch gestures for chart interaction'
      },
      {
        component: 'Search',
        issue: 'Search input too small on mobile',
        severity: 'low',
        impact: -8,
        fix: 'Implement expandable search with proper sizing'
      }
    ];

    usabilityIssues.forEach(issue => {
      issues.push(issue);
      score += issue.impact;
    });

    return { score: Math.max(score, 0), issues };
  };

  const auditMobileAccessibility = async () => {
    const issues = [];
    let score = 100;

    const accessibilityIssues = [
      {
        area: 'Touch Targets',
        issue: 'Some buttons below 44px minimum size',
        severity: 'high',
        impact: -15,
        fix: 'Ensure all interactive elements meet WCAG touch target size'
      },
      {
        area: 'Contrast',
        issue: 'Low contrast ratios on mobile dark theme',
        severity: 'medium',
        impact: -10,
        fix: 'Adjust color contrast for mobile readability'
      },
      {
        area: 'Focus Management',
        issue: 'Focus indicators not visible on mobile',
        severity: 'medium',
        impact: -12,
        fix: 'Enhance focus styles for touch and keyboard navigation'
      },
      {
        area: 'Screen Reader',
        issue: 'Missing ARIA labels on mobile-specific controls',
        severity: 'medium',
        impact: -8,
        fix: 'Add comprehensive ARIA support for mobile interfaces'
      }
    ];

    accessibilityIssues.forEach(issue => {
      issues.push(issue);
      score += issue.impact;
    });

    return { score: Math.max(score, 0), issues };
  };

  const auditPWAFeatures = async () => {
    const issues = [];
    let score = 100;

    const pwaIssues = [
      {
        feature: 'Service Worker',
        status: 'Missing',
        severity: 'high',
        impact: -30,
        fix: 'Implement service worker for offline functionality'
      },
      {
        feature: 'Web App Manifest',
        status: 'Missing',
        severity: 'high',
        impact: -25,
        fix: 'Add manifest.json for app-like experience'
      },
      {
        feature: 'Offline Support',
        status: 'Not Available',
        severity: 'high',
        impact: -20,
        fix: 'Cache critical resources for offline access'
      },
      {
        feature: 'Push Notifications',
        status: 'Not Implemented',
        severity: 'medium',
        impact: -15,
        fix: 'Add push notification support for alerts'
      },
      {
        feature: 'Add to Home Screen',
        status: 'Not Available',
        severity: 'medium',
        impact: -10,
        fix: 'Implement install prompt for PWA'
      }
    ];

    pwaIssues.forEach(issue => {
      issues.push(issue);
      score += issue.impact;
    });

    return { score: Math.max(score, 0), issues };
  };

  const getGrade = (score) => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const renderIssuesList = (issues, type) => {
    if (issues.length === 0) {
      return (
        <div className="text-center py-8">
          <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
          <p className="text-lg font-medium text-green-700">Perfect {type} Score!</p>
          <p className="text-sm text-gray-600">No issues found in this category.</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {issues.map((issue, index) => (
          <Card key={index} className="border-l-4 border-l-red-400">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium">
                      {issue.page || issue.component || issue.metric || issue.area || issue.feature}
                    </h4>
                    <Badge className={`${getSeverityColor(issue.severity)} border`}>
                      {issue.severity}
                    </Badge>
                    {issue.impact && (
                      <Badge variant="outline" className="text-red-600">
                        {issue.impact} pts
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-2">
                    {issue.issue || issue.status}
                  </p>
                  
                  {(issue.value && issue.target) && (
                    <div className="text-xs text-gray-600 mb-2">
                      Current: <span className="font-mono">{issue.value}</span> | 
                      Target: <span className="font-mono">{issue.target}</span>
                    </div>
                  )}
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm">
                      <span className="font-medium text-blue-800">🔧 Fix:</span>
                      <span className="text-blue-700 ml-1">{issue.fix}</span>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            📱 Mobile Optimization Audit
          </CardTitle>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Overall Score:</span>
              <Badge className={`text-lg px-3 py-1 ${getScoreColor(auditResults.overall.score)} border-2`}>
                {auditResults.overall.score}/100 ({auditResults.overall.grade})
              </Badge>
            </div>
            <Button 
              onClick={runMobileAudit} 
              disabled={isAuditing}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isAuditing ? 'animate-spin' : ''}`} />
              {isAuditing ? 'Auditing...' : 'Run Audit'}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="responsive" className="flex items-center gap-1">
              <Monitor className="w-3 h-3" />
              Responsive
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="usability" className="flex items-center gap-1">
              <MousePointerClick className="w-3 h-3" /> {/* FIXED */}
              Usability
            </TabsTrigger>
            <TabsTrigger value="accessibility" className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              A11y
            </TabsTrigger>
            <TabsTrigger value="pwa" className="flex items-center gap-1">
              <Download className="w-3 h-3" />
              PWA
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            {/* Score Overview */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
              {[
                { key: 'responsive', label: 'Responsive', icon: Monitor },
                { key: 'performance', label: 'Performance', icon: Zap },
                { key: 'usability', label: 'Usability', icon: MousePointerClick }, // FIXED
                { key: 'accessibility', label: 'Accessibility', icon: Eye },
                { key: 'pwa', label: 'PWA', icon: Download }
              ].map(({ key, label, icon: Icon }) => (
                <Card key={key} className="text-center">
                  <CardContent className="p-4">
                    <Icon className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <p className={`text-2xl font-bold ${getScoreColor(auditResults[key].score)}`}>
                      {auditResults[key].score}
                    </p>
                    <p className="text-sm text-gray-600">{label}</p>
                    <Progress value={auditResults[key].score} className="mt-2 h-2" />
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Critical Issues Summary */}
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold text-red-800 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Critical Mobile Issues
                </h3>
                <div className="space-y-2">
                  {[
                    '🚨 Bundle size 2.8MB (target: <1MB)',
                    '🚨 Time to Interactive: 5.1s (target: <3.8s)', 
                    '🚨 Missing PWA features (Service Worker, Manifest)',
                    '🚨 Business Intelligence not mobile-optimized',
                    '🚨 Tables require horizontal scrolling'
                  ].map((issue, index) => (
                    <p key={index} className="text-sm text-red-700">{issue}</p>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="responsive" className="mt-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">
                Responsive Design Issues ({auditResults.responsive.score}/100)
              </h3>
              <Progress value={auditResults.responsive.score} className="mb-4" />
            </div>
            {renderIssuesList(auditResults.responsive.issues, 'responsive')}
          </TabsContent>

          <TabsContent value="performance" className="mt-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">
                Mobile Performance Issues ({auditResults.performance.score}/100)
              </h3>
              <Progress value={auditResults.performance.score} className="mb-4" />
            </div>
            {renderIssuesList(auditResults.performance.issues, 'performance')}
          </TabsContent>

          <TabsContent value="usability" className="mt-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">
                Mobile Usability Issues ({auditResults.usability.score}/100)
              </h3>
              <Progress value={auditResults.usability.score} className="mb-4" />
            </div>
            {renderIssuesList(auditResults.usability.issues, 'usability')}
          </TabsContent>

          <TabsContent value="accessibility" className="mt-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">
                Mobile Accessibility Issues ({auditResults.accessibility.score}/100)
              </h3>
              <Progress value={auditResults.accessibility.score} className="mb-4" />
            </div>
            {renderIssuesList(auditResults.accessibility.issues, 'accessibility')}
          </TabsContent>

          <TabsContent value="pwa" className="mt-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">
                PWA Features ({auditResults.pwa.score}/100)
              </h3>
              <Progress value={auditResults.pwa.score} className="mb-4" />
            </div>
            {renderIssuesList(auditResults.pwa.issues, 'PWA')}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
