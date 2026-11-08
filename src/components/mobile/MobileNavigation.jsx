import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  ArrowUpDown,
  FileText,
  Receipt,
  Users,
  Package,
  TrendingUp,
  Calculator,
  Zap,
  Bot,
  Menu,
  X,
  Bell,
  Settings
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MobileNavigation({ alertCount = 0 }) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: createPageUrl('Dashboard'), badge: null },
    { icon: ArrowUpDown, label: 'Transactions', href: createPageUrl('Transactions'), badge: null },
    { icon: FileText, label: 'Invoices', href: createPageUrl('Invoices'), badge: null },
    { icon: Receipt, label: 'Expenses', href: createPageUrl('Expenses'), badge: null },
    { icon: Users, label: 'CRM', href: createPageUrl('CRM'), badge: null },
    { icon: Package, label: 'Inventory', href: createPageUrl('Inventory'), badge: null },
    { icon: TrendingUp, label: 'Analytics', href: createPageUrl('Analytics'), badge: null },
    { icon: Calculator, label: 'Tax Reports', href: createPageUrl('TaxReports'), badge: null },
    { icon: Zap, label: 'Workflows', href: createPageUrl('Workflows'), badge: null },
    { icon: Bot, label: 'AI Assistant', href: createPageUrl('AIAssistant'), badge: null },
    { icon: Settings, label: 'Settings', href: createPageUrl('Settings'), badge: null }
  ];

  return (
    <>
      <style jsx>{`
        /* MOBILE NAVIGATION STYLES */
        .mobile-nav-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background: linear-gradient(135deg, 
            rgba(15, 23, 42, 0.98) 0%,
            rgba(30, 41, 59, 0.95) 100%
          );
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(59, 130, 246, 0.3);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .mobile-nav-header {
          display: flex;
          align-items: center;
          justify-content: between;
          padding: 1rem 1.5rem;
          height: 64px;
        }

        .mobile-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex: 1;
        }

        .mobile-logo-icon {
          width: 2rem;
          height: 2rem;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
        }

        .mobile-logo-text {
          font-weight: 800;
          font-size: 1.125rem;
          color: #ffffff;
          background: linear-gradient(45deg, #ffffff, #3b82f6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .mobile-nav-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .mobile-nav-button {
          width: 2.5rem;
          height: 2.5rem;
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          transition: all 0.3s ease;
          position: relative;
        }

        .mobile-nav-button:hover {
          background: rgba(59, 130, 246, 0.2);
          border: 1px solid rgba(59, 130, 246, 0.5);
          transform: translateY(-1px);
        }

        .mobile-nav-overlay {
          position: fixed;
          top: 64px;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          z-index: 999;
        }

        .mobile-nav-menu {
          position: fixed;
          top: 64px;
          left: 0;
          right: 0;
          background: linear-gradient(135deg, 
            rgba(15, 23, 42, 0.98) 0%,
            rgba(30, 41, 59, 0.95) 100%
          );
          backdrop-filter: blur(30px);
          border-bottom: 1px solid rgba(59, 130, 246, 0.3);
          max-height: calc(100vh - 64px);
          overflow-y: auto;
          z-index: 1000;
        }

        .mobile-nav-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.5rem;
          color: #cbd5e1;
          text-decoration: none;
          transition: all 0.3s ease;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .mobile-nav-item:hover,
        .mobile-nav-item.active {
          background: rgba(59, 130, 246, 0.1);
          color: #ffffff;
          border-left: 3px solid #3b82f6;
        }

        .mobile-nav-icon {
          width: 1.25rem;
          height: 1.25rem;
          color: #3b82f6;
        }

        .mobile-nav-item.active .mobile-nav-icon {
          color: #60a5fa;
        }

        .mobile-nav-label {
          flex: 1;
          font-weight: 600;
          font-size: 0.95rem;
        }

        .mobile-badge {
          background: rgba(239, 68, 68, 0.2);
          color: #fca5a5;
          border: 1px solid rgba(239, 68, 68, 0.4);
          padding: 0.125rem 0.5rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        /* BOTTOM NAVIGATION FOR MOBILE */
        .mobile-bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(135deg, 
            rgba(15, 23, 42, 0.98) 0%,
            rgba(30, 41, 59, 0.95) 100%
          );
          backdrop-filter: blur(20px);
          border-top: 1px solid rgba(59, 130, 246, 0.3);
          padding: 0.75rem 1rem;
          z-index: 1000;
          box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
        }

        .mobile-bottom-nav-items {
          display: flex;
          justify-content: space-around;
          align-items: center;
        }

        .mobile-bottom-nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          padding: 0.5rem;
          color: #94a3b8;
          text-decoration: none;
          transition: all 0.3s ease;
          border-radius: 8px;
          position: relative;
        }

        .mobile-bottom-nav-item.active {
          color: #3b82f6;
          background: rgba(59, 130, 246, 0.1);
        }

        .mobile-bottom-nav-icon {
          width: 1.25rem;
          height: 1.25rem;
        }

        .mobile-bottom-nav-label {
          font-size: 0.7rem;
          font-weight: 600;
        }

        @media (min-width: 768px) {
          .mobile-nav-container,
          .mobile-bottom-nav {
            display: none;
          }
        }
      `}</style>

      {/* Mobile Top Navigation */}
      <div className="mobile-nav-container md:hidden">
        <div className="mobile-nav-header">
          <div className="mobile-logo">
            <div className="mobile-logo-icon">
              <LayoutDashboard className="w-4 h-4 text-white" />
            </div>
            <span className="mobile-logo-text">AccounTech</span>
          </div>
          
          <div className="mobile-nav-actions">
            <button className="mobile-nav-button">
              <Bell className="w-4 h-4" />
              {alertCount > 0 && (
                <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                  {alertCount}
                </Badge>
              )}
            </button>
            
            <button 
              className="mobile-nav-button"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mobile-nav-overlay"
                onClick={() => setIsOpen(false)}
              />
              
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mobile-nav-menu"
              >
                {navigationItems.map((item, index) => {
                  const isActive = location.pathname === item.href;
                  
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={item.href}
                        className={`mobile-nav-item ${isActive ? 'active' : ''}`}
                        onClick={() => setIsOpen(false)}
                      >
                        <item.icon className="mobile-nav-icon" />
                        <span className="mobile-nav-label">{item.label}</span>
                        {item.badge && (
                          <Badge className="mobile-badge">{item.badge}</Badge>
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="mobile-bottom-nav md:hidden">
        <div className="mobile-bottom-nav-items">
          {navigationItems.slice(0, 5).map((item) => {
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`mobile-bottom-nav-item ${isActive ? 'active' : ''}`}
              >
                <item.icon className="mobile-bottom-nav-icon" />
                <span className="mobile-bottom-nav-label">{item.label}</span>
                {item.badge && (
                  <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}