import React, { useState } from 'react';
import {
  LayoutDashboard,
  BarChart3,
  Package,
  Layers,
  Award,
  Boxes,
  ArrowLeftRight,
  AlertTriangle,
  ShoppingCart,
  Receipt,
  Users,
  ShoppingBag,
  Truck,
  Building2,
  UserCheck,
  CalendarCheck,
  Clock,
  Calendar,
  IndianRupee,
  Fuel,
  Wrench,
  TrendingUp,
  Wallet,
  CreditCard,
  PieChart,
  Globe,
  Star,
  Eye,
  FileText,
  Image as ImageIcon,
  Megaphone,
  MessageSquare,
  FileSpreadsheet,
  Settings,
  History,
  LogOut,
  ChevronRight,
  ChevronDown,
  Building,
  Menu,
  X,
} from 'lucide-react';
import { useApp, ActivePage } from '../../context/AppContext';
import { Badge } from '../ui/Badge';

interface NavItem {
  id: ActivePage;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
  badgeVariant?: 'low-stock' | 'critical' | 'yellow' | 'blue' | 'neutral';
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<{
  collapsed: boolean;
  setCollapsed: (c: boolean) => void;
  mobileOpen?: boolean;
  setMobileOpen?: (o: boolean) => void;
}> = ({ collapsed, setCollapsed, mobileOpen = false, setMobileOpen }) => {
  const { activePage, setActivePage, summaryMetrics, customerEnquiries, logout, currentUser } = useApp();

  // Collapsible sections state
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    OVERVIEW: true,
    INVENTORY: true,
    SALES: true,
    PURCHASE: true,
    STAFF: true,
    VEHICLES: true,
    FINANCE: true,
    'CUSTOMER WEBSITE': true,
    REPORTS: false,
    SYSTEM: true,
  });

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const newEnquiriesCount = customerEnquiries.filter((e) => e.status === 'New').length;

  const sections: NavSection[] = [
    {
      title: 'OVERVIEW',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'analytics', label: 'Business Analytics', icon: BarChart3 },
      ],
    },
    {
      title: 'INVENTORY',
      items: [
        { id: 'products', label: 'Products', icon: Package },
        { id: 'categories', label: 'Categories', icon: Layers },
        { id: 'brands', label: 'Brands', icon: Award },
        { id: 'stock', label: 'Stock Status', icon: Boxes },
        { id: 'stock-movements', label: 'Stock Movements', icon: ArrowLeftRight },
        {
          id: 'low-stock',
          label: 'Low Stock',
          icon: AlertTriangle,
          badge: summaryMetrics.lowStockCount > 0 ? summaryMetrics.lowStockCount : undefined,
          badgeVariant: 'critical',
        },
      ],
    },
    {
      title: 'SALES',
      items: [
        { id: 'new-sale', label: 'New Sale / POS', icon: ShoppingCart },
        { id: 'sales', label: 'Sales Invoices', icon: Receipt },
        { id: 'customers', label: 'Customers', icon: Users },
      ],
    },
    {
      title: 'PURCHASE',
      items: [
        { id: 'new-purchase', label: 'New Purchase', icon: ShoppingBag },
        { id: 'purchases', label: 'Purchases', icon: Truck },
        { id: 'suppliers', label: 'Suppliers', icon: Building2 },
      ],
    },
    {
      title: 'STAFF',
      items: [
        { id: 'employees', label: 'Employees', icon: UserCheck },
        {
          id: 'attendance',
          label: 'Attendance',
          icon: CalendarCheck,
          badge: `${summaryMetrics.presentStaffCount}/${summaryMetrics.totalStaffCount}`,
          badgeVariant: 'neutral',
        },
        { id: 'working-hours', label: 'Working Hours', icon: Clock },
        { id: 'holidays', label: 'Holidays & Leave', icon: Calendar },
        { id: 'salary', label: 'Salary & Payments', icon: IndianRupee },
      ],
    },
    {
      title: 'VEHICLES',
      items: [
        { id: 'vehicles', label: 'Vehicles', icon: Truck },
        { id: 'fuel', label: 'Fuel / Diesel', icon: Fuel },
        { id: 'vehicle-expenses', label: 'Vehicle Expenses', icon: Wrench },
      ],
    },
    {
      title: 'FINANCE',
      items: [
        { id: 'income', label: 'Income', icon: TrendingUp },
        { id: 'expenses', label: 'Expenses', icon: Wallet },
        { id: 'payments', label: 'Credit Ledger', icon: CreditCard },
        { id: 'profit-loss', label: 'Profit & Loss', icon: PieChart },
      ],
    },
    {
      title: 'CUSTOMER WEBSITE',
      items: [
        { id: 'website-overview', label: 'Website Overview', icon: Globe },
        { id: 'website-featured', label: 'Featured Products', icon: Star },
        { id: 'website-visibility', label: 'Product Visibility', icon: Eye },
        { id: 'website-homepage', label: 'Homepage Content', icon: FileText },
        { id: 'website-banners', label: 'Banners', icon: ImageIcon },
        { id: 'website-announcements', label: 'Announcements', icon: Megaphone },
        {
          id: 'website-enquiries',
          label: 'Customer Enquiries',
          icon: MessageSquare,
          badge: newEnquiriesCount > 0 ? newEnquiriesCount : undefined,
          badgeVariant: 'yellow',
        },
      ],
    },
    {
      title: 'REPORTS',
      items: [{ id: 'reports', label: 'Reports Hub', icon: FileSpreadsheet }],
    },
    {
      title: 'SYSTEM',
      items: [
        { id: 'settings', label: 'Settings', icon: Settings },
        { id: 'activity-log', label: 'Activity Log', icon: History },
      ],
    },
  ];

  const handleNavClick = (pageId: ActivePage) => {
    setActivePage(pageId);
    if (setMobileOpen) setMobileOpen(false);
  };

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 z-40 bg-charcoal-900 text-white flex flex-col border-r border-charcoal-800 transition-all duration-300 ease-in-out ${
        collapsed ? 'w-20' : 'w-72'
      } ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-charcoal-800 bg-charcoal-950/60">
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-brand text-charcoal-950 flex items-center justify-center font-extrabold shadow-sm flex-shrink-0">
              <Building className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm tracking-wider text-white truncate">
                  KISHOR
                </span>
                <span className="text-[10px] font-bold bg-yellow-brand/20 text-yellow-brand border border-yellow-brand/40 px-1 py-0.2 rounded">
                  ERP
                </span>
              </div>
              <p className="text-[11px] font-semibold text-concrete-400 tracking-wider uppercase truncate">
                CONSTRUCTION
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full flex justify-center">
            <div className="w-10 h-10 rounded-xl bg-yellow-brand text-charcoal-950 flex items-center justify-center font-extrabold shadow-sm">
              <Building className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
        )}

        {/* Desktop Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex text-concrete-400 hover:text-white p-1.5 rounded-lg hover:bg-charcoal-800 transition-colors"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Mobile Close Button */}
        {setMobileOpen && (
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden text-concrete-400 hover:text-white p-1.5 rounded-lg hover:bg-charcoal-800"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Scrollable Area */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {sections.map((section) => (
          <div key={section.title} className="space-y-1">
            {!collapsed && (
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-concrete-400 px-3 py-1 hover:text-concrete-200 transition-colors"
              >
                <span>{section.title}</span>
                {openSections[section.title] ? (
                  <ChevronDown className="w-3.5 h-3.5 text-concrete-500" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-concrete-500" />
                )}
              </button>
            )}

            {(collapsed || openSections[section.title]) && (
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activePage === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      title={collapsed ? item.label : undefined}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 relative group ${
                        isActive
                          ? 'bg-yellow-brand text-charcoal-950 font-bold shadow-sm'
                          : 'text-concrete-300 hover:bg-charcoal-800 hover:text-white'
                      } ${collapsed ? 'justify-center' : ''}`}
                    >
                      <Icon
                        className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-105 ${
                          isActive ? 'text-charcoal-950 stroke-[2.5]' : 'text-concrete-400'
                        }`}
                      />

                      {!collapsed && (
                        <>
                          <span className="truncate flex-1 text-left">{item.label}</span>
                          {item.badge !== undefined && (
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                                isActive
                                  ? 'bg-charcoal-900 text-yellow-brand'
                                  : item.badgeVariant === 'critical'
                                  ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                                  : item.badgeVariant === 'yellow'
                                  ? 'bg-yellow-brand/20 text-yellow-brand border border-yellow-brand/40'
                                  : 'bg-charcoal-700 text-concrete-300'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom Profile & Role Bar */}
      <div className="p-3 border-t border-charcoal-800 bg-charcoal-950/80">
        {!collapsed ? (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-concrete-700 border border-concrete-600 flex items-center justify-center font-bold text-xs text-yellow-brand flex-shrink-0">
                KS
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{currentUser?.name || 'Kishor Keshri'}</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-semibold text-yellow-brand uppercase tracking-wider">
                    {currentUser?.role || 'OWNER'}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="text-concrete-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-charcoal-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              onClick={logout}
              title="Sign Out"
              className="text-concrete-400 hover:text-red-400 p-2 rounded-lg hover:bg-charcoal-800"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
