import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  ArrowUpDown,
  FileText,
  Receipt,
  Calculator,
  PieChart,
  Package,
  TrendingUp,
  AlertTriangle,
  Users,
  UserCheck,
  Zap,
  Bot,
  Settings,
  Menu,
  X,
  Bell,
  Search,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MobileOptimizedNavigation({ alertCount = 0, className = "" }) {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  // Optimized mobile navigation items - prioritized for thumb reach
  const bottomNavItems = [
    {
      icon: LayoutDashboard,
      label: 'Home',
      href: createPageUrl('Dashboard'),
      badge: null
    },
    {
      icon: ArrowUpDown,
      label: 'Money',
      href: createPageUrl('Transactions'),
      badge: null
    },
    {
      icon: FileText,
      label: 'Bills',
      href: createPageUrl('Invoices'), 
      badge: null
    },
    {
      icon: AlertTriangle,
      label: 'Alerts',
      href: createPageUrl('Alerts'),
      badge: alertCount > 0 ? alertCount : null
    },
    {
      icon: Menu,
      label: 'More',
      action: () => setIsMenuOpen(true),
      badge: null
    }
  ];

  const allNavItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: createPageUrl('Dashboard') },
    { icon: ArrowUpDown, label: 'Transactions', href: createPageUrl('Transactions') },
    { icon: FileText, label: 'Invoices', href: createPageUrl('Invoices') },
    { icon: Receipt, label: 'Expenses', href: createPageUrl('Expenses') },
    { icon: Calculator, label: 'Tax Reports', href: createPageUrl('TaxReports') },
    { icon: PieChart, label: 'Budgets', href: createPageUrl('Budgets') },
    { icon: Package, label: 'Inventory', href: createPageUrl('Inventory') },
    { icon: TrendingUp, label: 'Analytics', href: createPageUrl('Analytics') },
    { icon: AlertTriangle, label: 'Alerts', href: createPageUrl('Alerts'), badge: alertCount },
    { icon: Users, label: 'CRM', href: createPageUrl('CRM'), isNew: true },
    { icon: UserCheck, label: 'HR', href: createPageUrl('HumanResources'), isNew: true },
    { icon: Zap, label: 'Workflows', href: createPageUrl('Workflows') },
    { icon: Bot, label: 'AI Assistant', href: createPageUrl('AIAssistant'), isNew: true },
    { icon: Settings, label: 'Settings', href: createPageUrl('Settings') }
  ];

  const isActive = (href) => location.pathname === href;

  return (
    <>
      <style jsx>{`
        .mobile-nav-bottom {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(135deg, 
            rgba(15, 23, 42, 0.98) 0%,
            rgba(30, 41, 59, 0.96) 100%
          );
          backdrop-filter: blur(20px);
          border-top: 1px solid rgba(0, 255, 136, 0.3);
          box-shadow: 
            0 -8px 32px rgba(0, 0, 0, 0.4),
            0 0 40px rgba(0, 255, 136, 0.1);
          z-index: 50;
          padding: env(safe-area-inset-bottom) 0 0;
        }

        .mobile-nav-top {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: linear-gradient(135deg, 
            rgba(15, 23, 42, 0.98) 0%,
            rgba(30, 41, 59, 0.96) 100%
          );
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(0, 255, 136, 0.3);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.4),
            0 0 40px rgba(0, 255, 136, 0.1);
          z-index: 50;
          padding: env(safe-area-inset-top) 0 0;
        }

        .nav-item-mobile {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0.75rem 0.5rem;
          color: rgba(255, 255, 255, 0.7);
          transition: all 0.3s ease;
          position: relative;
          min-height: 60px;
          touch-action: manipulation;
        }

        .nav-item-mobile.active {
          color: #00ff88;
          transform: scale(1.05);
        }

        .nav-item-mobile:hover {
          color: #00ffff;
          transform: translateY(-2px);
        }

        .nav-item-mobile .icon {
          width: 24px;
          height: 24px;
          margin-bottom: 0.25rem;
          filter: drop-shadow(0 0 8px rgba(0, 255, 136, 0.5));
        }

        .nav-item-mobile.active .icon {
          filter: drop-shadow(0 0 12px rgba(0, 255, 136, 0.8));
        }

        .nav-item-mobile .label {
          font-size: 0.75rem;
          font-weight: 600;
          text-align: center;
          line-height: 1;
        }

        .mobile-menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          z-index: 60;
        }

        .mobile-menu-panel {
          position: fixed;
          top: 0;
          right: 0;
          width: 280px;
          height: 100vh;
          background: linear-gradient(135deg, 
            rgba(15, 23, 42, 0.98) 0%,
            rgba(30, 41, 59, 0.96) 100%
          );
          backdrop-filter: blur(30px);
          border-left: 2px solid rgba(0, 255, 136, 0.3);
          box-shadow: -8px 0 32px rgba(0, 0, 0, 0.5);
          z-index: 70;
          overflow-y: auto;
          padding: env(safe-area-inset-top) 0 env(safe-area-inset-bottom);
        }

        .mobile-search-bar {
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 255, 255, 0.05) 100%
          );
          border: 1px solid rgba(0, 255, 136, 0.3);
          border-radius: 25px;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }

        .mobile-search-bar:focus-within {
          border-color: rgba(0, 255, 136, 0.6);
          box-shadow: 0 0 20px rgba(0, 255, 136, 0.2);
        }
      `}</style>

      {/* Top Navigation Bar */}
      <div className={`mobile-nav-top ${className}`}>
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-white">AccounTech</h1>
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
              Co-Pilot
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowSearch(!showSearch)}
              className="text-white hover:bg-white/10 p-2"
            >
              <Search className="w-5 h-5" />
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/10 p-2"
            >
              <Bell className={`w-5 h-5 ${alertCount > 0 ? 'text-red-400' : ''}`} />
              {alertCount > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[18px] h-[18px] rounded-full flex items-center justify-center p-0">
                  {alertCount > 9 ? '9+' : alertCount}
                </Badge>
              )}
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/10 p-2"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Expandable Search Bar */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-4 pb-3"
            >
              <div className="mobile-search-bar flex items-center px-4 py-2">
                <Search className="w-4 h-4 text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="Search transactions, invoices..."
                  className="flex-1 bg-transparent text-white placeholder-gray-400 text-sm focus:outline-none"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="mobile-nav-bottom">
        <div className="flex items-center justify-around px-2 py-1">
          {bottomNavItems.map((item, index) => {
            const IconComponent = item.icon;
            const active = item.href ? isActive(item.href) : false;
            
            return (
              <div key={index} className="relative">
                {item.href ? (
                  <Link 
                    to={item.href}
                    className={`nav-item-mobile ${active ? 'active' : ''}`}
                  >
                    <IconComponent className="icon" />
                    <span className="label">{item.label}</span>
                    {item.badge && (
                      <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[18px] h-[18px] rounded-full">
                        {item.badge > 9 ? '9+' : item.badge}
                      </Badge>
                    )}
                  </Link>
                ) : (
                  <button 
                    onClick={item.action}
                    className="nav-item-mobile"
                  >
                    <IconComponent className="icon" />
                    <span className="label">{item.label}</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Full Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mobile-menu-overlay"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ x: 280 }}
              animate={{ x: 0 }}
              exit={{ x: 280 }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="mobile-menu-panel"
            >
              <div className="p-4 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white">Menu</h2>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-white hover:bg-white/10"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              
              <div className="p-2">
                {allNavItems.map((item, index) => {
                  const IconComponent = item.icon;
                  const active = isActive(item.href);
                  
                  return (
                    <Link
                      key={index}
                      to={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        active 
                          ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                          : 'text-gray-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <Badge className="bg-red-500 text-white">
                          {item.badge}
                        </Badge>
                      )}
                      {item.isNew && (
                        <Badge className="bg-blue-500 text-white text-xs">
                          NEW
                        </Badge>
                      )}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}