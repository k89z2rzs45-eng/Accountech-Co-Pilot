import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Download, 
  Upload, 
  FileText, 
  FileSpreadsheet, 
  File, 
  CheckCircle2, 
  AlertTriangle, 
  Info,
  Calendar,
  Filter,
  Settings,
  Zap,
  Star,
  ExternalLink,
  RefreshCw
} from "lucide-react";
import { UploadFile } from "@/api/integrations";
import { universalExporter } from "@/api/functions";
import { universalImporter } from "@/api/functions";

export default function ExportImportPanel({ 
  isOpen, 
  onClose, 
  entityType, 
  entityDisplayName,
  defaultTab = "export",
  onComplete 
}) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [exportSettings, setExportSettings] = useState({
    format: 'csv',
    dateRange: { start: '', end: '' },
    filters: {},
    includeDeleted: false,
    customFields: []
  });
  const [importSettings, setImportSettings] = useState({
    file: null,
    fileUrl: '',
    skipDuplicates: true,
    batchSize: 100,
    defaultCurrency: 'USD',
    mappings: {}
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState(null);
  const [availableFormats, setAvailableFormats] = useState({ common: [], specialized: [] });
  const [importTemplates, setImportTemplates] = useState({});
  const [fileAnalysis, setFileAnalysis] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadAvailableFormats();
      loadImportTemplates();
    }
  }, [isOpen, entityType]);

  const loadAvailableFormats = async () => {
    try {
      const { data } = await universalExporter({
        action: 'get_export_formats',
        entityType: entityType
      });
      setAvailableFormats(data);
    } catch (error) {
      console.error('Error loading formats:', error);
    }
  };

  const loadImportTemplates = async () => {
    try {
      const { data } = await universalImporter({
        action: 'get_import_templates',
        entityType: entityType
      });
      setImportTemplates(data);
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  };

  const handleExport = async () => {
    setIsProcessing(true);
    setProgress(0);
    setResults(null);

    try {
      // Validate export settings
      const validation = await universalExporter({
        action: 'validate_export',
        entityType: entityType,
        format: exportSettings.format,
        dateRange: exportSettings.dateRange,
        filters: exportSettings.filters
      });

      if (!validation.data.valid) {
        throw new Error(validation.data.errors.join(', '));
      }

      setProgress(25);

      // Perform export
      const exportResult = await universalExporter({
        action: 'export',
        entityType: entityType,
        format: exportSettings.format,
        dateRange: exportSettings.dateRange,
        filters: exportSettings.filters,
        customFields: exportSettings.customFields
      });

      setProgress(100);
      setResults({
        type: 'export',
        success: true,
        data: exportResult.data
      });

      // Trigger download
      downloadFile(exportResult.data);

    } catch (error) {
      console.error('Export error:', error);
      setResults({
        type: 'export',
        success: false,
        error: error.message
      });
    }

    setIsProcessing(false);
  };

  const downloadFile = (exportData) => {
    try {
      const blob = new Blob([exportData.content], { 
        type: exportData.contentType || 'text/plain' 
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = exportData.filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    setProgress(0);
    setFileAnalysis(null);

    try {
      // Upload file
      const { file_url } = await UploadFile({ file });
      setImportSettings(prev => ({ ...prev, file, fileUrl: file_url }));
      setProgress(50);

      // Analyze file
      const analysisResult = await universalImporter({
        action: 'analyze_file',
        file_url: file_url,
        entityType: entityType
      });

      setFileAnalysis(analysisResult.data);
      setImportSettings(prev => ({
        ...prev,
        mappings: analysisResult.data.suggested_mappings || {}
      }));
      setProgress(100);

    } catch (error) {
      console.error('File analysis error:', error);
      setResults({
        type: 'import',
        success: false,
        error: error.message
      });
    }

    setIsProcessing(false);
  };

  const handleImport = async () => {
    if (!importSettings.fileUrl) return;

    setIsProcessing(true);
    setProgress(0);
    setResults(null);

    try {
      // Validate import data
      const validation = await universalImporter({
        action: 'validate_import',
        file_url: importSettings.fileUrl,
        entityType: entityType,
        mappings: importSettings.mappings
      });

      if (!validation.data.valid) {
        throw new Error(validation.data.errors.join(', '));
      }

      setProgress(25);

      // Perform import
      const importResult = await universalImporter({
        action: 'import_data',
        file_url: importSettings.fileUrl,
        entityType: entityType,
        importSettings: importSettings,
        mappings: importSettings.mappings
      });

      setProgress(100);
      setResults({
        type: 'import',
        success: true,
        data: importResult.data
      });

      // Call completion callback
      if (onComplete) {
        onComplete({
          type: 'import',
          imported: importResult.data.imported_records,
          failed: importResult.data.failed_records
        });
      }

    } catch (error) {
      console.error('Import error:', error);
      setResults({
        type: 'import',
        success: false,
        error: error.message
      });
    }

    setIsProcessing(false);
  };

  const downloadTemplate = (template) => {
    const headers = template.headers.join(',');
    const sampleData = template.sample_data.map(row => row.join(',')).join('\n');
    const csvContent = `${headers}\n${sampleData}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = template.filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const FormatCard = ({ format, onSelect, selected }) => (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
        selected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
      }`}
      onClick={() => onSelect(format.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-semibold">{format.name}</h4>
              {format.recommended && (
                <Badge className="bg-green-100 text-green-800">
                  <Star className="w-3 h-3 mr-1" />
                  Recommended
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-2">{format.description}</p>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{format.extension}</Badge>
              <span className="text-xs text-gray-500">
                {format.popularity}% compatibility
              </span>
            </div>
          </div>
          {selected && <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" />}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileSpreadsheet className="w-6 h-6 text-blue-600" />
            Export & Import {entityDisplayName}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="export" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Data
            </TabsTrigger>
            <TabsTrigger value="import" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Import Data
            </TabsTrigger>
          </TabsList>

          <div className="mt-6 max-h-[70vh] overflow-y-auto">
            <TabsContent value="export" className="space-y-6">
              {/* Export Format Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Choose Export Format
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Common Formats */}
                    {availableFormats.common.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-3">Universal Formats</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {availableFormats.common.map((format) => (
                            <FormatCard
                              key={format.id}
                              format={format}
                              onSelect={(id) => setExportSettings(prev => ({ ...prev, format: id }))}
                              selected={exportSettings.format === format.id}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Specialized Formats */}
                    {availableFormats.specialized.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-3">Specialized Formats</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {availableFormats.specialized.map((format) => (
                            <FormatCard
                              key={format.id}
                              format={format}
                              onSelect={(id) => setExportSettings(prev => ({ ...prev, format: id }))}
                              selected={exportSettings.format === format.id}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Export Options */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Export Options
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Date Range */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Start Date</Label>
                      <Input
                        type="date"
                        value={exportSettings.dateRange.start}
                        onChange={(e) => setExportSettings(prev => ({
                          ...prev,
                          dateRange: { ...prev.dateRange, start: e.target.value }
                        }))}
                      />
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <Input
                        type="date"
                        value={exportSettings.dateRange.end}
                        onChange={(e) => setExportSettings(prev => ({
                          ...prev,
                          dateRange: { ...prev.dateRange, end: e.target.value }
                        }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Export Button */}
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button 
                  onClick={handleExport} 
                  disabled={isProcessing}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Export {entityDisplayName}
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="import" className="space-y-6">
              {/* Import Templates */}
              {Object.keys(importTemplates).length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Import Templates
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(importTemplates).map(([key, template]) => (
                        <Card key={key} className="cursor-pointer hover:shadow-md">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">{template.filename}</h4>
                                <p className="text-sm text-gray-600">
                                  {template.headers.length} columns
                                </p>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => downloadTemplate(template)}
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* File Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Upload File
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <FileSpreadsheet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-700 mb-2">
                      Choose file to import
                    </p>
                    <p className="text-gray-500 mb-4">
                      Supports CSV, Excel, and other formats
                    </p>
                    <Input
                      type="file"
                      accept=".csv,.xlsx,.xls,.txt,.tsv"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="import-file"
                    />
                    <Button asChild variant="outline">
                      <label htmlFor="import-file" className="cursor-pointer">
                        <Upload className="w-4 h-4 mr-2" />
                        Select File
                      </label>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* File Analysis Results */}
              {fileAnalysis && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      File Analysis Complete
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {fileAnalysis.file_info.total_rows}
                        </div>
                        <div className="text-sm text-gray-600">Total Rows</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {Object.keys(fileAnalysis.suggested_mappings).length}
                        </div>
                        <div className="text-sm text-gray-600">Mapped Fields</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {fileAnalysis.estimated_processing_time}s
                        </div>
                        <div className="text-sm text-gray-600">Est. Time</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {fileAnalysis.import_feasibility}%
                        </div>
                        <div className="text-sm text-gray-600">Success Rate</div>
                      </div>
                    </div>

                    {/* Column Mappings */}
                    {Object.keys(fileAnalysis.suggested_mappings).length > 0 && (
                      <div>
                        <h4 className="font-medium mb-3">Suggested Field Mappings</h4>
                        <div className="space-y-2">
                          {Object.entries(fileAnalysis.suggested_mappings).map(([field, mapping]) => (
                            <div key={field} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <span className="font-medium">{field}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-600">{mapping.suggested_column}</span>
                                <Badge 
                                  className={
                                    mapping.confidence >= 80 ? 'bg-green-100 text-green-800' :
                                    mapping.confidence >= 60 ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  }
                                >
                                  {mapping.confidence}%
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Import Button */}
              {fileAnalysis && (
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={onClose}>Cancel</Button>
                  <Button 
                    onClick={handleImport} 
                    disabled={isProcessing}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Importing...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Import {fileAnalysis.file_info.total_rows} Records
                      </>
                    )}
                  </Button>
                </div>
              )}
            </TabsContent>
          </div>

          {/* Processing Progress */}
          {isProcessing && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
                <span className="font-medium">
                  {activeTab === 'export' ? 'Exporting' : 'Importing'} Data...
                </span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {/* Results */}
          <AnimatePresence>
            {results && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-6"
              >
                <Alert className={results.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                  <div className="flex items-center gap-2">
                    {results.success ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium">
                        {results.success ? 'Success!' : 'Error'}
                      </h4>
                      <AlertDescription>
                        {results.success ? (
                          results.type === 'export' ? (
                            `Exported ${results.data.recordCount} records in ${results.data.format.toUpperCase()} format`
                          ) : (
                            `Successfully imported ${results.data.imported_records} out of ${results.data.total_records} records`
                          )
                        ) : (
                          results.error
                        )}
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}