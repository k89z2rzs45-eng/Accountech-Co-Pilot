import React, { useState, useEffect } from "react";
import { FinancialAlert } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Clock,
  CheckCircle,
  X,
  Eye,
  MoreHorizontal,
  AlertCircle,
  XCircle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

export default function FinancialAlertsPanel() {
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("active"); // active, all, dismissed

  useEffect(() => {
    loadAlerts();
  }, [filter]);

  const loadAlerts = async () => {
    setIsLoading(true);
    try {
      const allAlerts = await FinancialAlert.list('-created_date', 50);
      const filteredAlerts = filter === "active" 
        ? allAlerts.filter(alert => alert.status === 'active')
        : filter === "dismissed"
        ? allAlerts.filter(alert => alert.status === 'dismissed')
        : allAlerts;
      
      setAlerts(filteredAlerts);
    } catch (error) {
      console.error('Error loading financial alerts:', error);
      setAlerts([]);
    }
    setIsLoading(false);
  };

  const handleAcknowledge = async (alert) => {
    try {
      await FinancialAlert.update(alert.id, {
        status: 'acknowledged',
        acknowledged_at: new Date().toISOString(),
        acknowledged_by: 'current_user' // Will be replaced with actual user
      });
      loadAlerts();
    } catch (error) {
      console.error('Error acknowledging alert:', error);
    }
  };

  const handleDismiss = async (alert) => {
    try {
      await FinancialAlert.update(alert.id, {
        status: 'dismissed'
      });
      loadAlerts();
    } catch (error) {
      console.error('Error dismissing alert:', error);
    }
  };

  const handleResolve = async (alert, notes = "") => {
    try {
      await FinancialAlert.update(alert.id, {
        status: 'resolved',
        resolution_notes: notes
      });
      loadAlerts();
    } catch (error) {
      console.error('Error resolving alert:', error);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'high': return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case 'medium': return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'low': return <TrendingUp className="w-4 h-4 text-blue-600" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getAlertTypeIcon = (type) => {
    switch (type) {
      case 'expense_spike': return <TrendingUp className="w-5 h-5" />;
      case 'unusual_transaction': return <AlertTriangle className="w-5 h-5" />;
      case 'vendor_anomaly': return <Users className="w-5 h-5" />;
      case 'frequency_anomaly': return <Clock className="w-5 h-5" />;
      default: return <DollarSign className="w-5 h-5" />;
    }
  };

  if (isLoading) {
    return (
      <Card className="neuro-card">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="neuro-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            Financial Alerts
            {alerts.length > 0 && (
              <Badge className="bg-red-100 text-red-800">
                {alerts.filter(a => a.status === 'active').length}
              </Badge>
            )}
          </CardTitle>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={filter === "active" ? "default" : "outline"}
              onClick={() => setFilter("active")}
              className="neuro-button text-xs"
            >
              Active
            </Button>
            <Button
              size="sm"
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
              className="neuro-button text-xs"
            >
              All
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <AnimatePresence>
          {alerts.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">All Clear!</h3>
              <p className="text-gray-600">No financial anomalies detected.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.slice(0, 5).map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {getAlertTypeIcon(alert.alert_type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">{alert.title}</h4>
                          <Badge className={`text-xs ${getSeverityColor(alert.severity)}`}>
                            {getSeverityIcon(alert.severity)}
                            <span className="ml-1">{(alert.severity || 'info').toUpperCase()}</span>
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{alert.message}</p>
                        
                        {alert.detected_value && alert.baseline_value && (
                          <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                            <span>Detected: ${alert.detected_value.toLocaleString()}</span>
                            <span>Normal: ${alert.baseline_value.toLocaleString()}</span>
                            {alert.deviation_percentage && (
                              <Badge variant="outline" className="text-xs">
                                +{alert.deviation_percentage.toFixed(1)}%
                              </Badge>
                            )}
                          </div>
                        )}

                        {alert.ai_confidence && (
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs text-gray-500">AI Confidence:</span>
                            <div className="w-16 h-2 bg-gray-200 rounded-full">
                              <div 
                                className="h-2 bg-blue-500 rounded-full" 
                                style={{ width: `${alert.ai_confidence}%` }}
                              />
                            </div>
                            <span className="text-xs font-semibold">{alert.ai_confidence}%</span>
                          </div>
                        )}

                        {alert.suggested_actions && alert.suggested_actions.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs font-medium text-gray-700 mb-1">Suggested Actions:</p>
                            <ul className="text-xs text-gray-600 list-disc list-inside space-y-1">
                              {alert.suggested_actions.slice(0, 2).map((action, i) => (
                                <li key={i}>{action}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <p className="text-xs text-gray-400 mt-2">
                          {format(new Date(alert.created_date), 'MMM dd, yyyy HH:mm')}
                        </p>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-gray-500">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {alert.status === 'active' && (
                          <>
                            <DropdownMenuItem onClick={() => handleAcknowledge(alert)}>
                              <Eye className="w-4 h-4 mr-2" />
                              Acknowledge
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleResolve(alert)}>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Mark Resolved
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuItem 
                          onClick={() => handleDismiss(alert)}
                          className="text-red-600"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Dismiss
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}