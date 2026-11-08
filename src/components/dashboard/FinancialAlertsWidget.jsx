import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, AlertTriangle, TrendingUp, DollarSign, Brain } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FinancialAlertsWidget({ alerts, onDismiss }) {
  if (!alerts || alerts.length === 0) {
    return null;
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      default: return 'border-blue-500 bg-blue-50';
    }
  };

  const getSeverityIcon = (alertType) => {
    switch (alertType) {
      case 'expense_spike':
      case 'unusual_transaction':
        return <AlertTriangle className="w-5 h-5" />;
      case 'revenue_drop':
        return <TrendingUp className="w-5 h-5" />;
      default:
        return <DollarSign className="w-5 h-5" />;
    }
  };

  return (
    <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-red-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-orange-800">
          <Brain className="w-5 h-5" />
          AI Financial Alerts
          <Badge className="bg-orange-200 text-orange-800">
            {alerts.length} Active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <AnimatePresence>
            {alerts.slice(0, 3).map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border-l-4 ${getSeverityColor(alert.severity)}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <div className={`mt-1 ${
                      alert.severity === 'critical' ? 'text-red-600' :
                      alert.severity === 'high' ? 'text-orange-600' :
                      'text-yellow-600'
                    }`}>
                      {getSeverityIcon(alert.alert_type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{alert.title}</h4>
                        <Badge className={`text-xs ${
                          alert.severity === 'critical' ? 'bg-red-600 text-white' :
                          alert.severity === 'high' ? 'bg-orange-600 text-white' :
                          'bg-yellow-600 text-white'
                        }`}>
                          {(alert.severity || 'info').toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{alert.message}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Amount: ${alert.detected_value?.toLocaleString()}</span>
                        <span>Confidence: {alert.ai_confidence}%</span>
                        {alert.deviation_percentage && (
                          <span>Deviation: {alert.deviation_percentage.toFixed(1)}%</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDismiss(alert.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* AI Suggested Actions */}
                {alert.suggested_actions && alert.suggested_actions.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <h5 className="text-xs font-semibold text-gray-600 mb-2">AI Suggestions:</h5>
                    <div className="flex flex-wrap gap-1">
                      {alert.suggested_actions.slice(0, 2).map((action, actionIndex) => (
                        <Badge key={actionIndex} variant="outline" className="text-xs">
                          {action}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          
          {alerts.length > 3 && (
            <div className="text-center pt-2">
              <Button variant="link" className="text-sm text-orange-600">
                View {alerts.length - 3} more alerts →
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}