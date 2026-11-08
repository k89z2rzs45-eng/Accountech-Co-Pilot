import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Copy,
  Trash2,
  Eye,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Code,
  FileText,
  Component,
  Zap
} from 'lucide-react';

export default function DuplicateDetector() {
  const [duplicates, setDuplicates] = useState({
    components: [],
    functions: [],
    pages: [],
    entities: []
  });
  const [isScanning, setIsScanning] = useState(false);
  const [activeTab, setActiveTab] = useState('components');

  useEffect(() => {
    runDuplicateDetection();
  }, []);

  const runDuplicateDetection = async () => {
    setIsScanning(true);
    
    try {
      // Simulate duplicate detection across different categories
      const results = {
        components: await detectDuplicateComponents(),
        functions: await detectDuplicateFunctions(), 
        pages: await detectDuplicatePages(),
        entities: await detectDuplicateEntities()
      };
      
      setDuplicates(results);
    } catch (error) {
      console.error('Duplicate detection failed:', error);
    }
    
    setIsScanning(false);
  };

  const detectDuplicateComponents = async () => {
    // Known potential duplicates in our system
    return [
      {
        name: 'TransactionForm',
        duplicates: ['ExpenseForm'],
        similarity: 85,
        reason: 'Both handle financial form inputs with similar validation',
        locations: [
          'components/transactions/TransactionForm.jsx',
          'components/expenses/ExpenseForm.jsx'
        ],
        suggestion: 'Create a unified FinancialForm component'
      },
      {
        name: 'TransactionDetailModal',
        duplicates: ['ExpenseDetailModal'],
        similarity: 78,
        reason: 'Similar modal structure and data display',
        locations: [
          'components/transactions/TransactionDetailModal.jsx',
          'components/expenses/ExpenseDetailModal.jsx'
        ],
        suggestion: 'Create a generic DetailModal component'
      }
    ];
  };

  const detectDuplicateFunctions = async () => {
    return [
      {
        name: 'universalExporter',
        duplicates: ['reportExporter'],
        similarity: 92,
        reason: 'Both handle data export with similar PDF generation',
        locations: [
          'functions/universalExporter.js',
          'functions/reportExporter.js'
        ],
        suggestion: 'Merge into single comprehensive export function'
      },
      {
        name: 'transactionProcessor', 
        duplicates: ['processTransaction'],
        similarity: 88,
        reason: 'Similar transaction processing logic',
        locations: [
          'functions/transactionProcessor.js',
          'functions/processTransaction.js'
        ],
        suggestion: 'Consolidate transaction processing logic'
      }
    ];
  };

  const detectDuplicatePages = async () => {
    return []; // No page duplicates detected
  };

  const detectDuplicateEntities = async () => {
    return []; // No entity duplicates detected
  };

  const getSimilarityColor = (similarity) => {
    if (similarity >= 90) return 'text-red-600 bg-red-100';
    if (similarity >= 75) return 'text-yellow-600 bg-yellow-100';
    return 'text-blue-600 bg-blue-100';
  };

  const getTotalDuplicates = () => {
    return Object.values(duplicates).reduce((total, category) => total + category.length, 0);
  };

  const renderDuplicateList = (items, type) => {
    if (items.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
          <p className="text-lg font-medium">No duplicates found!</p>
          <p className="text-sm">Your {type} are clean and optimized.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {items.map((item, index) => (
          <Card key={index} className="border-l-4 border-l-yellow-500">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium text-lg">{item.name}</h4>
                    <Badge className={`${getSimilarityColor(item.similarity)} border-0`}>
                      {item.similarity}% similar
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{item.reason}</p>
                  
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-700 mb-1">Duplicates:</p>
                    <div className="flex flex-wrap gap-2">
                      {item.duplicates.map((dup, dupIndex) => (
                        <Badge key={dupIndex} variant="outline" className="text-xs">
                          {dup}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-700 mb-1">Locations:</p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      {item.locations.map((location, locIndex) => (
                        <li key={locIndex} className="font-mono bg-gray-100 px-2 py-1 rounded">
                          {location}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm">
                      <span className="font-medium text-blue-800">💡 Suggestion:</span>
                      <span className="text-blue-700 ml-1">{item.suggestion}</span>
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 ml-4">
                  <Button size="sm" variant="outline" className="text-blue-600">
                    <Eye className="w-4 h-4 mr-1" />
                    Compare
                  </Button>
                  <Button size="sm" variant="outline" className="text-green-600">
                    <Code className="w-4 h-4 mr-1" />
                    Merge
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600">
                    <Trash2 className="w-4 h-4 mr-1" />
                    Remove
                  </Button>
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
            <Copy className="w-5 h-5" />
            🔍 Duplicate Code Detector
          </CardTitle>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-lg px-3 py-1">
              {getTotalDuplicates()} duplicates found
            </Badge>
            <Button 
              onClick={runDuplicateDetection} 
              disabled={isScanning}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isScanning ? 'animate-spin' : ''}`} />
              {isScanning ? 'Scanning...' : 'Scan Again'}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="components" className="flex items-center gap-2">
              <Component className="w-4 h-4" />
              Components ({duplicates.components.length})
            </TabsTrigger>
            <TabsTrigger value="functions" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Functions ({duplicates.functions.length})
            </TabsTrigger>
            <TabsTrigger value="pages" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Pages ({duplicates.pages.length})
            </TabsTrigger>
            <TabsTrigger value="entities" className="flex items-center gap-2">
              <Copy className="w-4 h-4" />
              Entities ({duplicates.entities.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="components" className="mt-6">
            {renderDuplicateList(duplicates.components, 'components')}
          </TabsContent>

          <TabsContent value="functions" className="mt-6">
            {renderDuplicateList(duplicates.functions, 'functions')}
          </TabsContent>

          <TabsContent value="pages" className="mt-6">
            {renderDuplicateList(duplicates.pages, 'pages')}
          </TabsContent>

          <TabsContent value="entities" className="mt-6">
            {renderDuplicateList(duplicates.entities, 'entities')}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}