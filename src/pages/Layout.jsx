
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User } from "@/api/entities";
import { Company } from "@/api/entities";
import { FinancialAlert } from "@/api/entities";
import OnboardingCheck from "../components/onboarding/OnboardingCheck";
import ErrorBoundary from "../components/utils/ErrorBoundary";
import {
  AlertTriangle,
  ArrowUpDown,
  BarChart3,
  Bell,
  Bot,
  Brain,
  Calculator,
  DollarSign,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  PieChart,
  Receipt,
  Settings,
  Settings2,
  Sparkles,
  TrendingUp,
  TrendingUpDown,
  UserCheck,
  UserCircle,
  Users,
  X,
  Zap,
  Wrench
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { motion } from "framer-motion";
import MobileNavigation from "../components/mobile/MobileNavigation";
import FloatingCoPilot from "../components/layout/FloatingCoPilot";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [alertsBadge, setAlertsBadge] = useState(0);
  const [invoicesBadge, setInvoicesBadge] = useState(null);
  const [inventoryBadge, setInventoryBadge] = useState(null);
  const [crmBadge, setCrmBadge] = useState(null);
  const [hrBadge, setHrBadge] = useState(null);
  const [company, setCompany] = useState(null);
  const [timeOfDay, setTimeOfDay] = useState('');

  // Dynamic greeting based on time
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('Good Morning');
    else if (hour < 17) setTimeOfDay('Good Afternoon');
    else setTimeOfDay('Good Evening');
  }, []);

  // NAVIGATION ITEMS
  const navigationItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      href: createPageUrl('Dashboard'),
      badge: null,
      description: "Your financial overview"
    },
    {
      icon: ArrowUpDown,
      label: 'Transactions',
      href: createPageUrl('Transactions'),
      badge: null,
      description: "Track money flow"
    },
    {
      icon: FileText,
      label: 'Invoices',
      href: createPageUrl('Invoices'),
      badge: invoicesBadge,
      description: "Send & track bills"
    },
    {
      icon: Receipt,
      label: 'Expenses',
      href: createPageUrl('Expenses'),
      badge: null,
      description: "Manage spending"
    },
    {
      icon: Calculator,
      label: 'Tax Reports',
      href: createPageUrl('TaxReports'),
      badge: null,
      description: "Compliance & filing"
    },
    {
      icon: PieChart,
      label: 'Budgets',
      href: createPageUrl('Budgets'),
      badge: null,
      description: "Financial planning"
    },
    {
      icon: Package,
      label: 'Inventory',
      href: createPageUrl('Inventory'),
      badge: inventoryBadge,
      description: "Stock management"
    },
    {
      icon: TrendingUp,
      label: 'Analytics',
      href: createPageUrl('Analytics'),
      badge: null,
      description: "Business insights"
    },
    {
      icon: TrendingUpDown,
      label: 'Forecasting',
      href: createPageUrl('Forecasting'),
      badge: null,
      description: "AI predictions"
    },
    {
      icon: BarChart3,
      label: '📊 Business Intelligence',
      href: createPageUrl('BusinessIntelligence'),
      badge: null,
      isNew: true,
      description: "Advanced reporting & BI"
    },
    {
      icon: AlertTriangle,
      label: 'Alerts',
      href: createPageUrl('Alerts'),
      badge: alertsBadge,
      description: "Critical financial notifications"
    },
    {
      icon: Users,
      label: '🚀 CRM System',
      href: createPageUrl('CRM'),
      badge: crmBadge,
      isNew: true,
      description: "Complete CRM system"
    },
    {
      icon: UserCheck,
      label: '👥 HR Management',
      href: createPageUrl('HumanResources'),
      badge: hrBadge,
      isNew: true,
      description: "HR management"
    },
    {
      icon: Users,
      label: '🤝 Team Workspace',
      href: createPageUrl('Collaboration'),
      badge: null,
      isNew: true,
      description: "Real-time collaboration"
    },
    {
      icon: Zap,
      label: 'Workflows',
      href: createPageUrl('Workflows'),
      badge: null,
      description: "Automation engine"
    },
    {
      icon: Bot,
      label: '🤖 AI Assistant',
      href: createPageUrl('AIAssistant'),
      badge: null,
      isNew: true,
      description: "AI co-pilot"
    },
    {
      icon: Settings2,
      label: 'Integrations',
      href: createPageUrl('Integrations'),
      badge: null,
      description: "Connect your tools"
    },
    {
      icon: DollarSign,
      label: '💎 Upgrade Plan',
      href: createPageUrl('Pricing'),
      badge: null,
      isNew: true,
      description: "View subscription plans"
    }
  ];

  const isDeveloper = user?.role === 'admin' && (window.location.hostname === 'localhost' || window.location.search.includes('dev=true'));
  
  const developerItems = isDeveloper ? [
    {
      icon: Wrench,
      label: '🔧 System Maintenance',
      href: createPageUrl('SystemMaintenance'),
      badge: null,
      isDeveloper: true,
      description: "Developer tools & debugging"
    }
  ] : [];

  useEffect(() => {
    loadUser();
    loadAlertsBadge();
    loadCompany();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      console.log("User not authenticated");
    }
  };

  const loadAlertsBadge = async () => {
    try {
      const alerts = await FinancialAlert.list('-created_date', 50);
      const activeAlerts = alerts.filter((alert) => alert.status === 'active');
      setAlertsBadge(activeAlerts.length);
    } catch (error) {
      console.log('Could not load alert count:', error);
    }
  };

  const loadCompany = async () => {
    try {
      const companies = await Company.list();
      const userCompany = companies[0] || null;
      setCompany(userCompany);
    } catch (error) {
      console.log('Could not load company logo:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await User.logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <OnboardingCheck>
      <ErrorBoundary>
        <div className="app-layout">
          <style jsx>{`
            /* FIXED PROFESSIONAL LAYOUT */
            .app-layout {
              display: flex;
              height: 100vh;
              width: 100vw;
              overflow: hidden;
            }

            /* SIDEBAR STYLES */
            .fixed-sidebar {
              width: 280px;
              height: 100vh;
              position: fixed;
              top: 0;
              left: 0;
              z-index: 50;
              background: linear-gradient(145deg, 
                #0f172a 0%,
                #1e293b 25%,
                #334155 50%,
                #1e293b 75%,
                #0f172a 100%
              );
              backdrop-filter: blur(30px);
              border-right: 2px solid rgba(0, 255, 136, 0.3);
              overflow-y: auto;
              overflow-x: hidden;
            }

            /* MAIN CONTENT AREA */
            .main-content-area {
              flex: 1;
              margin-left: 280px;
              height: 100vh;
              overflow-y: auto;
              overflow-x: hidden;
              background: linear-gradient(135deg, #0f172a, #1e293b);
            }

            /* NAVIGATION STYLES */
            .nav-item {
              display: flex;
              align-items: center;
              gap: 12px;
              padding: 12px 16px;
              margin: 4px 8px;
              border-radius: 12px;
              color: #e2e8f0;
              text-decoration: none;
              transition: all 0.2s ease;
              border: 1px solid transparent;
            }

            .nav-item:hover {
              background: rgba(30, 41, 59, 0.5);
              border-color: rgba(0, 255, 136, 0.3);
              transform: translateX(4px);
            }

            .nav-item.active {
              background: rgba(0, 255, 136, 0.1);
              border-color: rgba(0, 255, 136, 0.5);
              color: #00ff88;
            }

            .nav-icon {
              width: 20px;
              height: 20px;
              flex-shrink: 0;
            }

            .nav-label {
              font-weight: 600;
              font-size: 14px;
              white-space: nowrap;
            }

            .nav-badge {
              margin-left: auto;
              background: rgba(239, 68, 68, 0.2);
              color: #ef4444;
              border: 1px solid rgba(239, 68, 68, 0.4);
              padding: 2px 8px;
              border-radius: 12px;
              font-size: 11px;
              font-weight: 600;
            }

            .new-badge {
              background: linear-gradient(135deg, #10b981, #3b82f6);
              color: white;
              padding: 2px 6px;
              border-radius: 8px;
              font-size: 10px;
              font-weight: bold;
              animation: pulse 2s infinite;
            }

            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.7; }
            }

            /* MOBILE STYLES */
            @media (max-width: 768px) {
              .fixed-sidebar {
                display: none;
              }
              
              .main-content-area {
                margin-left: 0;
                width: 100vw;
              }
            }

            /* SCROLLBAR STYLES */
            .fixed-sidebar::-webkit-scrollbar {
              width: 6px;
            }

            .fixed-sidebar::-webkit-scrollbar-track {
              background: rgba(15, 23, 42, 0.5);
            }

            .fixed-sidebar::-webkit-scrollbar-thumb {
              background: linear-gradient(135deg, #00ffff, #ff00ff);
              border-radius: 3px;
            }
          `}</style>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <MobileNavigation alertCount={alertsBadge} />
          </div>

          {/* Desktop Sidebar */}
          <div className="fixed-sidebar hidden md:block">
            {/* Header */}
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Calculator className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">
                    {company?.company_name || 'AccounTech'}
                  </h2>
                  <p className="text-sm text-gray-400">Co-Pilot</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="py-4">
              {navigationItems.map((item, index) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                  >
                    <item.icon className="nav-icon" />
                    <span className="nav-label">{item.label}</span>
                    {item.badge !== null && item.badge !== undefined && (
                      <span className="nav-badge">{item.badge}</span>
                    )}
                    {item.isNew && (
                      <span className="new-badge">NEW</span>
                    )}
                  </Link>
                );
              })}

              {developerItems.length > 0 && (
                <>
                  <div className="border-t border-gray-700 mx-4 my-4"></div>
                  {developerItems.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        className={`nav-item ${isActive ? 'active' : ''}`}
                        style={{ borderColor: '#ef4444' }}
                      >
                        <item.icon className="nav-icon text-red-400" />
                        <span className="nav-label text-red-300">{item.label}</span>
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">DEV</span>
                      </Link>
                    );
                  })}
                </>
              )}
            </div>

            {/* Footer */}
            <div className="mt-auto p-4 border-t border-gray-700">
              {user && (
                <div className="mb-4 p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {user.full_name ? user.full_name.split(' ').map(n => n[0]).join('').substring(0, 2) : 'U'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {user.full_name || 'User'}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Link to={createPageUrl('Settings')} className="nav-item">
                  <Settings className="nav-icon" />
                  <span className="nav-label">Settings</span>
                </Link>
                <button onClick={handleLogout} className="nav-item w-full text-left">
                  <LogOut className="nav-icon" />
                  <span className="nav-label">Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="main-content-area">
            {children}
          </div>

          {/* Floating AI Co-Pilot Button */}
          <FloatingCoPilot />
        </div>
      </ErrorBoundary>
    </OnboardingCheck>
  );
}
