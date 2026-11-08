import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Zap, Target, AlertTriangle } from "lucide-react";

export default function MetricCard({ 
  title,
  value,
  change,
  changeType = 'percentage',
  trend = 'up',
  currency = 'USD',
  icon: Icon,
  color = 'blue',
  onClick,
  loading = false,
  subtitle,
  target,
  alert,
  animated = true
}) {
  const colorClasses = {
    blue: {
      gradient: 'from-blue-500 to-indigo-600',
      border: 'border-blue-500/30',
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
      iconBg: 'bg-blue-500/20'
    },
    green: {
      gradient: 'from-green-500 to-emerald-600',
      border: 'border-green-500/30',
      bg: 'bg-green-500/10',
      text: 'text-green-400',
      iconBg: 'bg-green-500/20'
    },
    red: {
      gradient: 'from-red-500 to-rose-600',
      border: 'border-red-500/30',
      bg: 'bg-red-500/10',
      text: 'text-red-400',
      iconBg: 'bg-red-500/20'
    },
    purple: {
      gradient: 'from-purple-500 to-violet-600',
      border: 'border-purple-500/30',
      bg: 'bg-purple-500/10',
      text: 'text-purple-400',
      iconBg: 'bg-purple-500/20'
    },
    orange: {
      gradient: 'from-orange-500 to-amber-600',
      border: 'border-orange-500/30',
      bg: 'bg-orange-500/10',
      text: 'text-orange-400',
      iconBg: 'bg-orange-500/20'
    }
  };

  const colors = colorClasses[color] || colorClasses.blue;

  // 🔥 PROFESSIONAL NUMBER FORMATTING FUNCTION
  const formatValue = (val) => {
    if (typeof val === 'number') {
      // Format large numbers properly
      if (val >= 1000000) {
        return `${(val / 1000000).toFixed(2)}M`;
      }
      if (val >= 1000) {
        return `${(val / 1000).toFixed(1)}K`;
      }
      // Always show 2 decimal places for currency
      return val.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }
    return val;
  };

  // 🔥 PROFESSIONAL CURRENCY FORMATTING
  const formatCurrencyValue = (val, curr) => {
    if (typeof val === 'number') {
      // For large numbers, show abbreviated form
      if (val >= 1000000) {
        return `${curr} ${(val / 1000000).toFixed(2)}M`;
      }
      if (val >= 100000) {
        return `${curr} ${(val / 1000).toFixed(0)}K`;
      }
      if (val >= 1000) {
        return `${curr} ${(val / 1000).toFixed(1)}K`;
      }
      // For smaller numbers, show full amount with proper formatting
      return `${curr} ${val.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`;
    }
    return `${curr} 0.00`;
  };

  const formatChange = (val) => {
    if (!val && val !== 0) return null;
    const sign = val >= 0 ? '+' : '';
    if (changeType === 'percentage') {
      return `${sign}${val.toFixed(1)}%`;
    }
    return `${sign}${currency} ${Math.abs(val).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const getTrendIcon = () => {
    if (trend === 'up') return <ArrowUpRight className="w-4 h-4" />;
    if (trend === 'down') return <ArrowDownRight className="w-4 h-4" />;
    return <TrendingUp className="w-4 h-4" />;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-400';
    if (trend === 'down') return 'text-red-400';
    return 'text-blue-400';
  };

  if (loading) {
    return (
      <Card className="revolutionary-metric-card loading">
        <style jsx>{`
          .revolutionary-metric-card {
            background: linear-gradient(145deg, 
              rgba(15, 23, 42, 0.98) 0%,
              rgba(30, 41, 59, 0.96) 50%,
              rgba(51, 65, 85, 0.94) 100%
            );
            border: 2px solid transparent;
            border-image: linear-gradient(45deg, #374151, #4b5563, #374151) 1;
            border-radius: 20px;
            backdrop-filter: blur(30px);
            box-shadow: 
              0 20px 40px rgba(0, 0, 0, 0.4),
              0 0 80px rgba(75, 85, 99, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
            position: relative;
            overflow: hidden;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
            min-height: 180px; /* INCREASED HEIGHT FOR BETTER VISIBILITY */
          }
          
          .loading-skeleton {
            background: linear-gradient(90deg,
              rgba(51, 65, 85, 0.5) 0%,
              rgba(71, 85, 105, 0.7) 50%,
              rgba(51, 65, 85, 0.5) 100%
            );
            background-size: 200% 100%;
            animation: skeletonLoading 1.5s ease-in-out infinite;
            border-radius: 8px;
          }
          
          @keyframes skeletonLoading {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}</style>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="loading-skeleton w-6 h-6 rounded-full"></div>
              <div className="loading-skeleton w-16 h-4 rounded"></div>
            </div>
            <div className="loading-skeleton w-32 h-8 rounded"></div>
            <div className="loading-skeleton w-24 h-4 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={animated ? { opacity: 0, y: 20, scale: 0.95 } : false}
      animate={animated ? { opacity: 1, y: 0, scale: 1 } : false}
      whileHover={{ 
        y: -8, 
        scale: 1.02,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="revolutionary-metric-card-container w-full"
    >
      <Card className={`revolutionary-metric-card ${colors.bg} ${colors.border} w-full`}>
        <style jsx>{`
          .revolutionary-metric-card-container {
            position: relative;
            cursor: ${onClick ? 'pointer' : 'default'};
            width: 100% !important;
          }
          
          .revolutionary-metric-card {
            background: linear-gradient(145deg, 
              rgba(15, 23, 42, 0.98) 0%,
              rgba(30, 41, 59, 0.96) 25%,
              rgba(51, 65, 85, 0.94) 50%,
              rgba(30, 41, 59, 0.96) 75%,
              rgba(15, 23, 42, 0.98) 100%
            );
            backdrop-filter: blur(30px);
            border: 2px solid transparent;
            border-radius: 20px;
            box-shadow: 
              0 20px 40px rgba(0, 0, 0, 0.4),
              0 0 80px rgba(0, 255, 255, 0.15),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
            position: relative;
            overflow: hidden;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            min-height: 180px; /* INCREASED HEIGHT FOR PROPER VISIBILITY */
            width: 100% !important;
          }
          
          .revolutionary-metric-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg,
              transparent,
              rgba(255, 255, 255, 0.1),
              transparent
            );
            transition: left 0.6s ease;
            z-index: 1;
          }
          
          .revolutionary-metric-card:hover::before {
            left: 100%;
          }
          
          .revolutionary-metric-card:hover {
            border-image: linear-gradient(45deg, #ff00ff, #00ff00, #ffff00, #ff00ff) 1;
            box-shadow: 
              0 30px 60px rgba(0, 0, 0, 0.5),
              0 0 120px rgba(255, 0, 255, 0.25),
              inset 0 1px 0 rgba(255, 255, 255, 0.15);
          }
          
          .metric-content {
            position: relative;
            z-index: 10;
          }
          
          .metric-icon-container {
            width: 3.5rem;
            height: 3.5rem;
            background: linear-gradient(135deg,
              rgba(0, 255, 255, 0.2) 0%,
              rgba(255, 0, 255, 0.15) 100%
            );
            border: 2px solid rgba(0, 255, 255, 0.4);
            border-radius: 16px;
            backdrop-filter: blur(15px);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
            box-shadow: 
              0 8px 25px rgba(0, 255, 255, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.2);
          }
          
          .revolutionary-metric-card:hover .metric-icon-container {
            background: linear-gradient(135deg,
              rgba(0, 255, 255, 0.3) 0%,
              rgba(255, 0, 255, 0.25) 100%
            );
            border: 2px solid rgba(0, 255, 255, 0.8);
            transform: rotateY(15deg) scale(1.1);
            box-shadow: 
              0 12px 35px rgba(0, 255, 255, 0.4),
              inset 0 2px 0 rgba(255, 255, 255, 0.3);
          }
          
          .metric-value {
            color: #f8fafc !important;
            font-weight: 900;
            font-size: 2rem; /* INCREASED FONT SIZE FOR BETTER VISIBILITY */
            text-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
            background: linear-gradient(45deg, #f8fafc, #e2e8f0, #cbd5e1);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            line-height: 1.2;
            word-break: break-word; /* PREVENT TEXT CUTOFF */
            overflow-wrap: break-word; /* ENSURE FULL VISIBILITY */
          }
          
          .metric-title {
            color: #94a3b8 !important;
            font-weight: 600;
            font-size: 0.875rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
            margin-top: 0.5rem;
          }
          
          .metric-change {
            font-weight: 700;
            font-size: 0.875rem;
            padding: 0.25rem 0.75rem;
            border-radius: 12px;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
          }
          
          .metric-change.positive {
            background: linear-gradient(45deg, rgba(0, 255, 136, 0.2), rgba(0, 200, 100, 0.2));
            color: #00ff88 !important;
            border: 1px solid rgba(0, 255, 136, 0.3);
          }
          
          .metric-change.negative {
            background: linear-gradient(45deg, rgba(255, 107, 157, 0.2), rgba(255, 50, 100, 0.2));
            color: #ff6b9d !important;
            border: 1px solid rgba(255, 107, 157, 0.3);
          }
          
          .metric-change.neutral {
            background: linear-gradient(45deg, rgba(156, 163, 175, 0.2), rgba(107, 114, 128, 0.2));
            color: #9ca3af !important;
            border: 1px solid rgba(156, 163, 175, 0.3);
          }
        `}</style>
        
        <CardContent className="p-6 metric-content w-full">
          {alert && (
            <div className="absolute top-3 right-3">
              <Badge className="alert-badge flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Alert
              </Badge>
            </div>
          )}
          
          <div className="flex items-center justify-between mb-4">
            <div className="metric-icon-container">
              {Icon && <Icon className={`w-6 h-6 ${colors.text}`} />}
            </div>
            
            {change !== null && change !== undefined && (
              <div className={`metric-change flex items-center gap-1 ${
                change > 0 ? 'positive' : change < 0 ? 'negative' : 'neutral'
              }`}>
                <span className={getTrendColor()}>
                  {getTrendIcon()}
                </span>
                {formatChange(change)}
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            {/* 🔥 PROPERLY FORMATTED VALUE WITH FULL VISIBILITY */}
            <div className="metric-value">
              {typeof value === 'number' && currency ? 
                formatCurrencyValue(value, currency) : 
                formatValue(value)
              }
            </div>
            
            <div className="space-y-1">
              <div className="metric-title">{title}</div>
              {subtitle && (
                <p className="text-sm text-gray-400">{subtitle}</p>
              )}
            </div>
            
            {target && (
              <div className="flex items-center gap-2 mt-3">
                <Target className="w-4 h-4 text-purple-400" />
                <span className="target-indicator">
                  Target: {formatCurrencyValue(target, currency)}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}