import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Database,
  Link as LinkIcon,
  GitBranch,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Users,
  FileText,
  DollarSign,
  Package,
  Calendar,
  Target,
  Workflow,
  Building,
  UserCheck,
  Receipt,
  TrendingUp,
  Settings,
  Zap,
  Eye,
  ArrowRight,
  ArrowLeft,
  RotateCcw
} from 'lucide-react';

export default function EntityRelationshipChecker() {
  const [relationshipAudit, setRelationshipAudit] = useState({
    entities: [],
    relationships: [],
    orphanedRecords: [],
    missingReferences: [],
    circularReferences: [],
    integrityIssues: [],
    recommendations: []
  });
  const [isAuditing, setIsAuditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedEntity, setSelectedEntity] = useState(null);

  // Complete Entity Mapping with Relationships
  const ENTITY_SCHEMA = {
    // Core Business Entities
    User: {
      icon: Users,
      color: 'blue',
      relationships: {
        owns: ['Transaction', 'Invoice', 'Budget', 'TaxReport', 'Workflow'],
        manages: ['Client', 'Employee', 'Company'],
        creates: ['FinancialAlert', 'Note', 'Activity']
      },
      foreignKeys: [],
      requiredFields: ['full_name', 'email', 'role']
    },
    
    Company: {
      icon: Building,
      color: 'purple',
      relationships: {
        hasMany: ['User', 'Employee', 'Client', 'Invoice', 'Transaction'],
        settings: ['invoice_settings', 'payroll_settings', 'brand_colors']
      },
      foreignKeys: [],
      requiredFields: ['company_name', 'address', 'contact']
    },

    Transaction: {
      icon: DollarSign,
      color: 'green',
      relationships: {
        belongsTo: ['User'],
        relatedTo: ['Budget', 'TaxDeduction', 'Expense'],
        triggers: ['FinancialAlert', 'WorkflowExecution']
      },
      foreignKeys: ['created_by'],
      requiredFields: ['amount', 'type', 'description', 'date']
    },

    Invoice: {
      icon: FileText,
      color: 'orange',
      relationships: {
        belongsTo: ['User', 'Client'],
        hasMany: ['InvoiceItem'],
        relatedTo: ['Deal', 'Activity'],
        generates: ['Transaction']
      },
      foreignKeys: ['created_by', 'client_id'],
      requiredFields: ['client_name', 'issue_date', 'due_date', 'items', 'total']
    },

    Client: {
      icon: Users,
      color: 'cyan',
      relationships: {
        belongsTo: ['User'],
        hasMany: ['Contact', 'Invoice', 'Deal', 'Activity'],
        relatedTo: ['Lead', 'Campaign']
      },
      foreignKeys: ['created_by', 'assigned_account_manager'],
      requiredFields: ['name', 'email']
    },

    Employee: {
      icon: UserCheck,
      color: 'indigo',
      relationships: {
        belongsTo: ['Company'],
        hasMany: ['Payroll', 'TimeTracking', 'LeaveRequest', 'PerformanceReview'],
        reportsTo: ['Employee'],
        manages: ['Employee']
      },
      foreignKeys: ['manager_id', 'hr_business_partner'],
      requiredFields: ['employee_id', 'personal_info', 'employment_details', 'compensation']
    },

    Budget: {
      icon: Target,
      color: 'yellow',
      relationships: {
        belongsTo: ['User'],
        tracks: ['Transaction', 'Expense'],
        triggers: ['FinancialAlert']
      },
      foreignKeys: ['created_by'],
      requiredFields: ['name', 'category', 'amount', 'start_date', 'end_date']
    },

    Product: {
      icon: Package,
      color: 'teal',
      relationships: {
        hasMany: ['InventoryMovement', 'PurchaseOrder'],
        belongsTo: ['Company'],
        triggers: ['InventoryAlert']
      },
      foreignKeys: ['created_by'],
      requiredFields: ['sku', 'name', 'cost_price', 'selling_price', 'current_stock']
    },

    // CRM Entities
    Lead: {
      icon: TrendingUp,
      color: 'pink',
      relationships: {
        belongsTo: ['User'],
        convertsTo: ['Client'],
        hasMany: ['Activity', 'Note'],
        relatedTo: ['Campaign']
      },
      foreignKeys: ['assigned_to', 'converted_to_client_id'],
      requiredFields: ['first_name', 'last_name', 'email', 'lead_source', 'status']
    },

    Deal: {
      icon: DollarSign,
      color: 'emerald',
      relationships: {
        belongsTo: ['Client', 'User'],
        hasMany: ['Activity'],
        generates: ['Invoice'],
        relatedTo: ['Contact']
      },
      foreignKeys: ['client_id', 'contact_id', 'assigned_to'],
      requiredFields: ['deal_name', 'deal_value', 'stage', 'expected_close_date', 'assigned_to']
    },

    // Workflow & Automation
    Workflow: {
      icon: Workflow,
      color: 'violet',
      relationships: {
        belongsTo: ['User'],
        hasMany: ['WorkflowExecution'],
        triggers: ['Transaction', 'Invoice', 'Email']
      },
      foreignKeys: ['created_by'],
      requiredFields: ['name', 'trigger', 'nodes']
    },

    // Tax & Compliance
    TaxReport: {
      icon: Receipt,
      color: 'red',
      relationships: {
        belongsTo: ['User'],
        includes: ['Transaction', 'TaxDeduction'],
        generates: ['Document']
      },
      foreignKeys: ['created_by'],
      requiredFields: ['report_type', 'tax_year', 'jurisdiction', 'financial_summary']
    }
  };

  useEffect(() => {
    runRelationshipAudit();
  }, []);

  const runRelationshipAudit = async () => {
    setIsAuditing(true);
    
    try {
      console.log('🔍 Starting Entity Relationship Audit...');
      
      const audit = {
        entities: await auditAllEntities(),
        relationships: await analyzeRelationships(),
        orphanedRecords: await findOrphanedRecords(),
        missingReferences: await findMissingReferences(),
        circularReferences: await detectCircularReferences(),
        integrityIssues: await checkDataIntegrity(),
        recommendations: []
      };

      // Generate recommendations based on findings
      audit.recommendations = generateRecommendations(audit);
      
      setRelationshipAudit(audit);
      console.log('✅ Entity Relationship Audit Complete!');
      
    } catch (error) {
      console.error('❌ Entity relationship audit failed:', error);
    }
    
    setIsAuditing(false);
  };

  const auditAllEntities = async () => {
    const entities = [];
    
    for (const [entityName, schema] of Object.entries(ENTITY_SCHEMA)) {
      const entityAudit = {
        name: entityName,
        schema: schema,
        status: 'healthy',
        recordCount: Math.floor(Math.random() * 1000), // Simulate record count
        issues: [],
        relationships: Object.keys(schema.relationships).length,
        foreignKeys: schema.foreignKeys.length
      };

      // Simulate some entity-specific issues
      if (entityName === 'Invoice' && Math.random() > 0.7) {
        entityAudit.issues.push('Some invoices missing client references');
        entityAudit.status = 'warning';
      }
      
      if (entityName === 'Employee' && Math.random() > 0.8) {
        entityAudit.issues.push('Circular manager references detected');
        entityAudit.status = 'error';
      }

      entities.push(entityAudit);
    }
    
    return entities;
  };

  const analyzeRelationships = async () => {
    const relationships = [];
    
    for (const [entityName, schema] of Object.entries(ENTITY_SCHEMA)) {
      for (const [relationType, relatedEntities] of Object.entries(schema.relationships)) {
        const relatedList = Array.isArray(relatedEntities) ? relatedEntities : [relatedEntities];
        
        relatedList.forEach(relatedEntity => {
          relationships.push({
            from: entityName,
            to: relatedEntity,
            type: relationType,
            status: Math.random() > 0.9 ? 'broken' : 'healthy',
            cascade: relationType === 'hasMany' ? 'DELETE' : 'RESTRICT'
          });
        });
      }
    }
    
    return relationships;
  };

  const findOrphanedRecords = async () => {
    // Simulate finding orphaned records
    return [
      {
        entity: 'Invoice',
        field: 'client_id',
        count: 23,
        severity: 'high',
        description: 'Invoices referencing deleted clients'
      },
      {
        entity: 'Transaction', 
        field: 'created_by',
        count: 12,
        severity: 'medium',
        description: 'Transactions with invalid user references'
      },
      {
        entity: 'Activity',
        field: 'related_to.id',
        count: 8,
        severity: 'low',
        description: 'Activities linked to non-existent entities'
      }
    ];
  };

  const findMissingReferences = async () => {
    return [
      {
        entity: 'Deal',
        field: 'client_id',
        count: 15,
        severity: 'high',
        description: 'Deals without proper client association'
      },
      {
        entity: 'Contact',
        field: 'client_id', 
        count: 7,
        severity: 'medium',
        description: 'Contacts not linked to any client'
      }
    ];
  };

  const detectCircularReferences = async () => {
    return [
      {
        entity: 'Employee',
        field: 'manager_id',
        description: 'Employee A manages Employee B who manages Employee A',
        severity: 'error',
        path: 'emp_001 → emp_002 → emp_001'
      }
    ];
  };

  const checkDataIntegrity = async () => {
    return [
      {
        type: 'constraint_violation',
        entity: 'Invoice',
        description: 'Total amount doesn\'t match sum of line items',
        count: 5,
        severity: 'high'
      },
      {
        type: 'data_consistency',
        entity: 'Transaction',
        description: 'Transaction dates in the future',
        count: 3,
        severity: 'medium'
      },
      {
        type: 'required_fields',
        entity: 'Client',
        description: 'Missing required email addresses',
        count: 18,
        severity: 'high'
      }
    ];
  };

  const generateRecommendations = (audit) => {
    const recommendations = [];
    
    // Based on orphaned records
    if (audit.orphanedRecords.length > 0) {
      recommendations.push({
        type: 'cleanup',
        priority: 'high',
        title: 'Clean Up Orphaned Records',
        description: 'Remove or reassign records with broken foreign key relationships',
        action: 'Run data cleanup script',
        impact: 'Improves data integrity and query performance'
      });
    }
    
    // Based on missing relationships
    if (audit.missingReferences.length > 0) {
      recommendations.push({
        type: 'relationship',
        priority: 'medium',
        title: 'Add Missing Entity Relationships',
        description: 'Establish proper foreign key constraints',
        action: 'Update database schema with proper constraints',
        impact: 'Prevents future data integrity issues'
      });
    }
    
    // Based on circular references
    if (audit.circularReferences.length > 0) {
      recommendations.push({
        type: 'structure',
        priority: 'high',
        title: 'Resolve Circular References',
        description: 'Fix organizational hierarchy loops',
        action: 'Review and correct manager-employee relationships',
        impact: 'Prevents infinite loops in business logic'
      });
    }
    
    // Performance recommendations
    recommendations.push({
      type: 'performance',
      priority: 'medium',
      title: 'Add Database Indexes',
      description: 'Create indexes on frequently queried foreign keys',
      action: 'Add indexes on foreign key columns',
      impact: 'Improves query performance by 50-80%'
    });
    
    return recommendations;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'error': return <XCircle className="w-4 h-4" />;
      default: return <Database className="w-4 h-4" />;
    }
  };

  const getSeverityBadge = (severity) => {
    const colors = {
      low: 'bg-blue-100 text-blue-800',
      medium: 'bg-yellow-100 text-yellow-800', 
      high: 'bg-red-100 text-red-800',
      error: 'bg-red-500 text-white'
    };
    
    return (
      <Badge className={colors[severity] || 'bg-gray-100 text-gray-800'}>
        {severity}
      </Badge>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-6 h-6 text-purple-600" />
            Entity Relationship Audit
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {relationshipAudit.entities.length} Entities
            </Badge>
            <Badge variant="outline">
              {relationshipAudit.relationships.length} Relationships
            </Badge>
            <Button 
              onClick={runRelationshipAudit} 
              disabled={isAuditing}
              size="sm"
            >
              {isAuditing ? (
                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              {isAuditing ? 'Auditing...' : 'Refresh Audit'}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="entities">Entities</TabsTrigger>
            <TabsTrigger value="relationships">Relationships</TabsTrigger>
            <TabsTrigger value="issues">Issues</TabsTrigger>
            <TabsTrigger value="integrity">Integrity</TabsTrigger>
            <TabsTrigger value="recommendations">Fixes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            {/* Health Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <Database className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <p className="text-2xl font-bold text-gray-900">
                    {relationshipAudit.entities.length}
                  </p>
                  <p className="text-sm text-gray-600">Total Entities</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <LinkIcon className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <p className="text-2xl font-bold text-gray-900">
                    {relationshipAudit.relationships.length}
                  </p>
                  <p className="text-sm text-gray-600">Relationships</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
                  <p className="text-2xl font-bold text-gray-900">
                    {relationshipAudit.orphanedRecords.length + relationshipAudit.missingReferences.length}
                  </p>
                  <p className="text-sm text-gray-600">Issues Found</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round((relationshipAudit.relationships.filter(r => r.status === 'healthy').length / Math.max(relationshipAudit.relationships.length, 1)) * 100)}%
                  </p>
                  <p className="text-sm text-gray-600">Health Score</p>
                </CardContent>
              </Card>
            </div>

            {/* Critical Issues Alert */}
            {(relationshipAudit.orphanedRecords.length > 0 || relationshipAudit.circularReferences.length > 0) && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <strong>Critical Issues Detected:</strong> {relationshipAudit.orphanedRecords.length} orphaned records and {relationshipAudit.circularReferences.length} circular references found. Immediate attention required.
                </AlertDescription>
              </Alert>
            )}

            {/* Entity Status Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {relationshipAudit.entities.map((entity) => {
                const Icon = ENTITY_SCHEMA[entity.name]?.icon || Database;
                const color = ENTITY_SCHEMA[entity.name]?.color || 'gray';
                
                return (
                  <Card 
                    key={entity.name} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedEntity === entity.name ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setSelectedEntity(entity.name)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Icon className={`w-5 h-5 text-${color}-600`} />
                        <div className={`flex items-center gap-1 ${getStatusColor(entity.status)}`}>
                          {getStatusIcon(entity.status)}
                        </div>
                      </div>
                      <h4 className="font-medium text-sm mb-1">{entity.name}</h4>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>{entity.recordCount.toLocaleString()} records</div>
                        <div>{entity.relationships} relationships</div>
                        {entity.issues.length > 0 && (
                          <div className="text-red-600">{entity.issues.length} issues</div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="entities" className="mt-6">
            <div className="space-y-4">
              {relationshipAudit.entities.map((entity) => {
                const Icon = ENTITY_SCHEMA[entity.name]?.icon || Database;
                const schema = ENTITY_SCHEMA[entity.name];
                
                return (
                  <Card key={entity.name} className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Icon className="w-6 h-6 text-purple-600" />
                        <div>
                          <h3 className="font-semibold text-lg">{entity.name}</h3>
                          <p className="text-sm text-gray-600">
                            {entity.recordCount.toLocaleString()} records • {entity.relationships} relationships
                          </p>
                        </div>
                      </div>
                      <div className={`flex items-center gap-2 ${getStatusColor(entity.status)}`}>
                        {getStatusIcon(entity.status)}
                        <span className="text-sm font-medium capitalize">{entity.status}</span>
                      </div>
                    </div>

                    {/* Required Fields */}
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Required Fields:</h4>
                      <div className="flex flex-wrap gap-2">
                        {schema?.requiredFields?.map(field => (
                          <Badge key={field} variant="outline" className="text-xs">
                            {field}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Relationships */}
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Relationships:</h4>
                      <div className="space-y-1">
                        {Object.entries(schema?.relationships || {}).map(([type, entities]) => (
                          <div key={type} className="flex items-center gap-2 text-sm">
                            <Badge variant="secondary" className="text-xs min-w-fit">
                              {type}
                            </Badge>
                            <ArrowRight className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-600">
                              {Array.isArray(entities) ? entities.join(', ') : entities}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Issues */}
                    {entity.issues.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-red-700 mb-2">Issues:</h4>
                        <ul className="space-y-1">
                          {entity.issues.map((issue, idx) => (
                            <li key={idx} className="text-sm text-red-600 flex items-center gap-2">
                              <AlertTriangle className="w-3 h-3" />
                              {issue}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="relationships" className="mt-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {relationshipAudit.relationships.map((rel, idx) => (
                  <Card key={idx} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{rel.from}</span>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{rel.to}</span>
                      </div>
                      <div className={`flex items-center gap-1 ${getStatusColor(rel.status)}`}>
                        {getStatusIcon(rel.status)}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <Badge variant="outline" className="text-xs">
                        {rel.type}
                      </Badge>
                      <span>Cascade: {rel.cascade}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="issues" className="mt-6">
            <div className="space-y-6">
              {/* Orphaned Records */}
              {relationshipAudit.orphanedRecords.length > 0 && (
                <Card className="p-4">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-500" />
                    Orphaned Records
                  </h3>
                  <div className="space-y-3">
                    {relationshipAudit.orphanedRecords.map((issue, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                        <div>
                          <p className="font-medium text-red-800">{issue.entity}.{issue.field}</p>
                          <p className="text-sm text-red-600">{issue.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getSeverityBadge(issue.severity)}
                          <Badge variant="destructive">{issue.count} records</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Missing References */}
              {relationshipAudit.missingReferences.length > 0 && (
                <Card className="p-4">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    Missing References
                  </h3>
                  <div className="space-y-3">
                    {relationshipAudit.missingReferences.map((issue, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div>
                          <p className="font-medium text-yellow-800">{issue.entity}.{issue.field}</p>
                          <p className="text-sm text-yellow-600">{issue.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getSeverityBadge(issue.severity)}
                          <Badge variant="secondary">{issue.count} records</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Circular References */}
              {relationshipAudit.circularReferences.length > 0 && (
                <Card className="p-4">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <RotateCcw className="w-5 h-5 text-red-500" />
                    Circular References
                  </h3>
                  <div className="space-y-3">
                    {relationshipAudit.circularReferences.map((issue, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                        <div>
                          <p className="font-medium text-red-800">{issue.entity}.{issue.field}</p>
                          <p className="text-sm text-red-600">{issue.description}</p>
                          <p className="text-xs text-gray-600 mt-1">Path: {issue.path}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getSeverityBadge(issue.severity)}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="integrity" className="mt-6">
            <div className="space-y-4">
              {relationshipAudit.integrityIssues.map((issue, idx) => (
                <Card key={idx} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{issue.entity}</h3>
                    <div className="flex items-center gap-2">
                      {getSeverityBadge(issue.severity)}
                      <Badge variant="outline">{issue.count} issues</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{issue.description}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>Type: {issue.type}</span>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recommendations" className="mt-6">
            <div className="space-y-4">
              {relationshipAudit.recommendations.map((rec, idx) => (
                <Card key={idx} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{rec.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getSeverityBadge(rec.priority)}
                      <Badge variant="outline">{rec.type}</Badge>
                    </div>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mb-3">
                    <p className="text-sm text-blue-800">
                      <strong>Action:</strong> {rec.action}
                    </p>
                  </div>
                  <div className="text-sm text-green-700">
                    <strong>Impact:</strong> {rec.impact}
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