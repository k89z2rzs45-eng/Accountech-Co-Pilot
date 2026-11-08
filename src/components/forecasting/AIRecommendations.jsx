
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Lightbulb, AlertTriangle, Target } from "lucide-react";

export default function AIRecommendations({ assumptions, risks, recommendations }) {
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <style jsx>{`
        .futuristic-insights-card {
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
        
        .insights-title {
          color: #f8fafc !important;
          font-weight: 700;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
        }
        
        .insights-content {
          position: relative;
          z-index: 2;
        }
        
        .insight-item {
          background: linear-gradient(135deg, 
            rgba(51, 65, 85, 0.4) 0%,
            rgba(30, 41, 59, 0.3) 100%
          );
          border-radius: 12px;
          padding: 0.75rem;
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          transition: all 0.3s ease;
        }
        
        .insight-item:hover {
          background: linear-gradient(135deg, 
            rgba(51, 65, 85, 0.6) 0%,
            rgba(30, 41, 59, 0.5) 100%
          );
          border: 1px solid rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
        }
        
        .insight-text {
          color: #e2e8f0 !important;
          font-weight: 500;
          font-size: 0.875rem;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
        }
        
        .no-insights-text {
          color: #94a3b8 !important;
          font-weight: 500;
          font-size: 0.875rem;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
        }
        
        .assumptions-card {
          border-image: linear-gradient(45deg, #7c3aed, #a855f7, #7c3aed) 1;
        }
        
        .risks-card {
          border-image: linear-gradient(45deg, #ef4444, #f87171, #ef4444) 1;
        }
        
        .recommendations-card {
          border-image: linear-gradient(45deg, #10b981, #34d399, #10b981) 1;
        }
      `}</style>

      {/* Assumptions */}
      <Card className="futuristic-insights-card assumptions-card">
        <CardHeader>
          <CardTitle className="insights-title text-lg font-semibold flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-400" />
            Key Assumptions
          </CardTitle>
        </CardHeader>
        <CardContent className="insights-content">
          <div className="space-y-3">
            {assumptions && assumptions.length > 0 ? (
              assumptions.map((assumption, index) => (
                <div key={index} className="insight-item">
                  <p className="insight-text">{assumption}</p>
                </div>
              ))
            ) : (
              <p className="no-insights-text">No assumptions available</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Risks */}
      <Card className="futuristic-insights-card risks-card">
        <CardHeader>
          <CardTitle className="insights-title text-lg font-semibold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            Potential Risks
          </CardTitle>
        </CardHeader>
        <CardContent className="insights-content">
          <div className="space-y-3">
            {risks && risks.length > 0 ? (
              risks.map((risk, index) => (
                <div key={index} className="insight-item">
                  <p className="insight-text">{risk}</p>
                </div>
              ))
            ) : (
              <p className="no-insights-text">No risks identified</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="futuristic-insights-card recommendations-card">
        <CardHeader>
          <CardTitle className="insights-title text-lg font-semibold flex items-center gap-2">
            <Target className="w-5 h-5 text-green-400" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="insights-content">
          <div className="space-y-3">
            {recommendations && recommendations.length > 0 ? (
              recommendations.map((recommendation, index) => (
                <div key={index} className="insight-item">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <p className="insight-text">{recommendation}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-insights-text">No recommendations available</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
