
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle, 
  TrendingUp, 
  DollarSign, 
  CheckCircle,
  RefreshCw,
  Brain,
  Shield,
  Lightbulb
} from "lucide-react";
import { motion } from "framer-motion";

export default function CashFlowAlerts({ predictions, isLoading, error, onRefresh }) {
  if (error) {
    return (
      <Card className="border-red-700 bg-red-950 text-red-100">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <div>
                <h3 className="font-semibold text-red-200">Prediction Error</h3>
                <p className="text-red-300">{error}</p>
              </div>
            </div>
            <Button onClick={onRefresh} variant="outline" className="border-red-700 text-red-200 hover:bg-red-900">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="border-blue-700 bg-blue-950 text-blue-100">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <Brain className="w-12 h-12 text-blue-400 mx-auto mb-4 animate-pulse" />
              <h3 className="font-semibold text-blue-200 mb-2">AI Analyzing Cash Flow</h3>
              <p className="text-blue-300 mb-4">Generating intelligent predictions...</p>
              <Progress value={75} className="w-64" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!predictions) {
    return null;
  }

  return (
    <div className="space-y-6">
      <style jsx>{`
        /* FUTURISTIC CASH FLOW ALERTS STYLES */
        .futuristic-alert-card {
          background: linear-gradient(145deg, 
            rgba(15, 23, 42, 0.98) 0%,
            rgba(30, 41, 59, 0.96) 25%,
            rgba(51, 65, 85, 0.94) 50%,
            rgba(30, 41, 59, 0.96) 75%,
            rgba(15, 23, 42, 0.98) 100%
          );
          backdrop-filter: blur(30px);
          border: 2px solid transparent;
          border-image: linear-gradient(45deg, #00ffff, #ff00ff, #00ff00, #00ffff) 1;
          border-radius: 20px;
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.4),
            0 0 80px rgba(0, 255, 255, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          position: relative;
          overflow: hidden;
          transition: all 0.4s ease;
        }
        
        .futuristic-alert-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg,
            transparent,
            rgba(0, 255, 255, 0.1),
            transparent
          );
          transition: left 0.6s ease;
          z-index: 1;
        }
        
        .futuristic-alert-card:hover::before {
          left: 100%;
        }
        
        .futuristic-alert-card:hover {
          transform: translateY(-4px);
          border-image: linear-gradient(45deg, #ff00ff, #00ff00, #ffff00, #ff00ff) 1;
          box-shadow: 
            0 25px 50px rgba(0, 0, 0, 0.5),
            0 0 100px rgba(255, 0, 255, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }
        
        .alert-content {
          position: relative;
          z-index: 2;
        }
        
        .alert-title {
          color: #f8fafc !important;
          font-weight: 700;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
        }
        
        .alert-text {
          color: #e2e8f0 !important;
          font-weight: 500;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
        }
        
        .alert-subtitle {
          color: #cbd5e1 !important;
          font-weight: 500;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
        }
        
        .health-score-large {
          background: linear-gradient(45deg, #00ffff, #ff00ff, #00ff00);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-size: 4rem;
          font-weight: 900;
          text-shadow: 0 0 40px rgba(0, 255, 255, 0.8);
          animation: scoreGlow 4s ease-in-out infinite;
        }
        
        @keyframes scoreGlow {
          0%, 100% { 
            filter: brightness(1) saturate(1);
            transform: scale(1);
          }
          50% { 
            filter: brightness(1.3) saturate(1.5);
            transform: scale(1.05);
          }
        }
        
        .risk-badge {
          font-weight: 700;
          padding: 0.5rem 1rem;
          border-radius: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          backdrop-filter: blur(10px);
        }
        
        .risk-high {
          background: linear-gradient(45deg, rgba(255, 0, 100, 0.3), rgba(255, 100, 0, 0.3));
          color: #ff6b9d !important;
          border: 1px solid #ff6b9d;
          box-shadow: 0 0 15px rgba(255, 107, 157, 0.4);
        }
        
        .risk-medium {
          background: linear-gradient(45deg, rgba(255, 200, 0, 0.3), rgba(255, 150, 0, 0.3));
          color: #ffd700 !important;
          border: 1px solid #ffd700;
          box-shadow: 0 0 15px rgba(255, 215, 0, 0.4);
        }
        
        .risk-low {
          background: linear-gradient(45deg, rgba(0, 255, 100, 0.3), rgba(100, 255, 0, 0.3));
          color: #00ff88 !important;
          border: 1px solid #00ff88;
          box-shadow: 0 0 15px rgba(0, 255, 136, 0.4);
        }
        
        .alert-item {
          background: linear-gradient(135deg, 
            rgba(51, 65, 85, 0.4) 0%,
            rgba(30, 41, 59, 0.3) 100%
          );
          border-radius: 12px;
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .alert-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg,
            transparent,
            rgba(255, 255, 255, 0.05),
            transparent
          );
          transition: left 0.5s ease;
        }
        
        .alert-item:hover::before {
          left: 100%;
        }
        
        .alert-item:hover {
          background: linear-gradient(135deg, 
            rgba(51, 65, 85, 0.6) 0%,
            rgba(30, 41, 59, 0.5) 100%
          );
          border: 1px solid rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
        }
        
        .alert-critical {
          border-left: 4px solid #ff6b9d;
          background: linear-gradient(135deg, 
            rgba(255, 0, 100, 0.1) 0%,
            rgba(51, 65, 85, 0.4) 100%
          );
        }
        
        .alert-high {
          border-left: 4px solid #ffd700;
          background: linear-gradient(135deg, 
            rgba(255, 200, 0, 0.1) 0%,
            rgba(51, 65, 85, 0.4) 100%
          );
        }
        
        .alert-medium {
          border-left: 4px solid #00ff88;
          background: linear-gradient(135deg, 
            rgba(0, 255, 100, 0.1) 0%,
            rgba(51, 65, 85, 0.4) 100%
          );
        }
        
        .analysis-info {
          background: linear-gradient(135deg, 
            rgba(15, 23, 42, 0.8) 0%,
            rgba(30, 41, 59, 0.6) 100%
          );
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
        }
        
        .analysis-text {
          color: #94a3b8 !important;
          font-size: 0.875rem;
          font-weight: 500;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
        }
      `}</style>

      {/* Shortage Alerts */}
      {predictions.shortage_alerts && predictions.shortage_alerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="futuristic-alert-card">
            <CardHeader>
              <CardTitle className="alert-title flex items-center gap-2 text-red-400">
                <AlertTriangle className="w-5 h-5" />
                Cash Shortage Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="alert-content">
              <div className="space-y-4">
                {predictions.shortage_alerts.map((alert, index) => (
                  <div key={index} className={`alert-item p-4 alert-${alert.severity}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="alert-title font-semibold">{alert.month}</h4>
                        <p className="alert-text mt-1">{alert.description}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={`risk-badge ${alert.severity === 'critical' ? 'risk-high' : 'risk-medium'}`}>
                          {alert.severity?.toUpperCase()}
                        </Badge>
                        <p className="text-lg font-bold text-red-400 mt-1">
                          ${alert.amount?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Surplus Opportunities */}
      {predictions.surplus_opportunities && predictions.surplus_opportunities.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="futuristic-alert-card">
            <CardHeader>
              <CardTitle className="alert-title flex items-center gap-2 text-green-400">
                <TrendingUp className="w-5 h-5" />
                Surplus Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent className="alert-content">
              <div className="space-y-4">
                {predictions.surplus_opportunities.map((opportunity, index) => (
                  <div key={index} className="alert-item p-4 alert-medium">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="alert-title font-semibold">{opportunity.month}</h4>
                        <p className="alert-text mt-1">{opportunity.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-400">
                          +${opportunity.amount?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Preventive Measures & Recommendations */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Preventive Measures */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="futuristic-alert-card">
            <CardHeader>
              <CardTitle className="alert-title flex items-center gap-2">
                <Shield className="w-5 h-5 text-cyan-400" />
                Preventive Measures
              </CardTitle>
            </CardHeader>
            <CardContent className="alert-content">
              <div className="space-y-3">
                {predictions.preventive_measures?.map((measure, index) => (
                  <div key={index} className="alert-item flex items-start gap-3 p-3">
                    <CheckCircle className="w-5 h-5 text-cyan-400 mt-0.5" />
                    <span className="alert-text">{measure}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recommended Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="futuristic-alert-card">
            <CardHeader>
              <CardTitle className="alert-title flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                AI Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="alert-content">
              <div className="space-y-4">
                {predictions.recommended_actions?.map((action, index) => (
                  <div key={index} className="alert-item p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="alert-title font-semibold">{action.action}</h4>
                      <Badge className={`risk-badge risk-${action.priority || 'medium'}`}>
                        {action.priority?.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="alert-text">Timeline: {action.timeline}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Analysis Info */}
      {predictions.data_points_analyzed && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="analysis-info">
            <CardContent className="p-4">
              <div className="flex items-center justify-between analysis-text">
                <span>AI Analysis Generated: {new Date(predictions.generated_at).toLocaleString()}</span>
                <div className="flex items-center gap-4">
                  <span>Transactions: {predictions.data_points_analyzed.transactions}</span>
                  <span>Invoices: {predictions.data_points_analyzed.pending_invoices}</span>
                  <span>Budgets: {predictions.data_points_analyzed.active_budgets}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
