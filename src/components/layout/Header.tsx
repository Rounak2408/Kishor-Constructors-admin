import React, { useState } from 'react';
import {
  Search,
  Plus,
  Bell,
  Globe,
  ChevronRight,
  User,
  Shield,
  ExternalLink,
  ChevronDown,
  ShoppingCart,
  ShoppingBag,
  Package,
  Wallet,
  UserPlus,
  Fuel,
  Menu,
} from 'lucide-react';
import { useApp, DateFilter } from '../../context/AppContext';
import { Button } from '../ui/Button';
import { UserRole } from '../../types';

export const Header: React.FC<{
  onOpenMobileNav: () => void;
}> = ({ onOpenMobileNav }) => {
  const {
    breadcrumbs,
    dateFilter,
    setDateFilter,
    setGlobalSearchOpen,
    setQuickAddOpen,
    setQuickAddType,
    setWebsitePreviewOpen,
    setNotificationsOpen,
    customerEnquiries,
    summaryMetrics,
    currentUser,
    switchRole,
  } = useApp();

  const [isQuickAddDropdownOpen, setQuickAddDropdownOpen] = useState(false);
  const [isRoleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const newEnquiryCount = customerEnquiries.filter((e) => e.status === 'New').length;
  const lowStockCount = summaryMetrics.lowStockCount;
  const totalNotifications = newEnquiryCount + (lowStockCount > 0 ? 1 : 0);

  const dateFilterOptions: DateFilter[] = ['Today', 'Yesterday', 'This Week', 'This Month', 'This Year'];

  const handleQuickAction = (type: 'product' | 'sale' | 'purchase' | 'expense' | 'employee' | 'fuel') => {
    setQuickAddType(type);
    setQuickAddOpen(true);
    setQuickAddDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-concrete-200 px-4 sm:px-6 flex items-center justify-between gap-4 shadow-subtle">
      {/* Left: Mobile hamburger + Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileNav}
          className="md:hidden text-charcoal-700 hover:text-charcoal-950 p-1.5 rounded-lg hover:bg-concrete-100"
          aria-label="Open Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5 text-xs text-charcoal-500 font-medium">
          <span className="text-charcoal-400">{breadcrumbs[0]}</span>
          <ChevronRight className="w-3.5 h-3.5 text-charcoal-300" />
          <span className="text-charcoal-900 font-bold truncate">{breadcrumbs[1]}</span>
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <div className="hidden lg:flex flex-1 max-w-md mx-4">
        <button
          onClick={() => setGlobalSearchOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-1.5 bg-concrete-100/90 hover:bg-concrete-200/70 border border-concrete-200 rounded-lg text-xs text-charcoal-500 transition-colors group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-charcoal-400 group-hover:text-charcoal-700" />
            <span>Search products, customers, suppliers, invoices...</span>
          </div>
          <kbd className="hidden sm:inline-block font-mono text-[10px] bg-white border border-concrete-300 px-1.5 py-0.5 rounded text-charcoal-500 shadow-2xs">
            Ctrl + K
          </kbd>
        </button>
      </div>

      {/* Mobile Search Icon Button */}
      <button
        onClick={() => setGlobalSearchOpen(true)}
        className="lg:hidden text-charcoal-700 hover:text-charcoal-950 p-2 rounded-lg hover:bg-concrete-100 transition-colors"
        title="Search"
      >
        <Search className="w-4 h-4 text-charcoal-700" />
      </button>

      {/* Right Controls: Date Filter, Preview Website, Quick Add, Notifications, User & Role */}
      <div className="flex items-center gap-1.5 sm:gap-3">
        {/* Mobile Date Filter Select */}
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value as DateFilter)}
          className="xl:hidden text-xs font-semibold rounded-lg border border-concrete-300 px-2 py-1 bg-concrete-50 text-charcoal-900 focus:outline-none"
        >
          {dateFilterOptions.map((filter) => (
            <option key={filter} value={filter}>
              {filter}
            </option>
          ))}
        </select>

        {/* Date Filter Pills (Desktop) */}
        <div className="hidden xl:flex items-center bg-concrete-100 p-0.5 rounded-lg border border-concrete-200">
          {dateFilterOptions.map((filter) => (
            <button
              key={filter}
              onClick={() => setDateFilter(filter)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                dateFilter === filter
                  ? 'bg-white text-charcoal-950 shadow-2xs border border-concrete-200'
                  : 'text-charcoal-500 hover:text-charcoal-900'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Website Live Preview Modal Trigger */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setWebsitePreviewOpen(true)}
          className="hidden sm:inline-flex border-concrete-300 text-charcoal-800 hover:border-yellow-brand hover:bg-yellow-light/40"
          icon={<Globe className="w-3.5 h-3.5 text-yellow-dark" />}
        >
          <span>Preview Website</span>
        </Button>

        {/* Quick Add Dropdown */}
        <div className="relative">
          <Button
            variant="yellow"
            size="sm"
            onClick={() => setQuickAddDropdownOpen(!isQuickAddDropdownOpen)}
            icon={<Plus className="w-4 h-4 stroke-[3]" />}
          >
            <span className="hidden sm:inline">Quick Add</span>
            <ChevronDown className="w-3.5 h-3.5 ml-0.5 opacity-75" />
          </Button>

          {isQuickAddDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setQuickAddDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-concrete-200 shadow-modal z-50 py-1.5 animate-fade-in divide-y divide-concrete-100">
                <div className="py-1">
                  <button
                    onClick={() => handleQuickAction('sale')}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-charcoal-800 hover:bg-concrete-100 text-left transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4 text-emerald-600" />
                    <span>+ New Sale / Invoice</span>
                  </button>
                  <button
                    onClick={() => handleQuickAction('purchase')}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-charcoal-800 hover:bg-concrete-100 text-left transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4 text-blue-600" />
                    <span>+ New Purchase PO</span>
                  </button>
                  <button
                    onClick={() => handleQuickAction('product')}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-charcoal-800 hover:bg-concrete-100 text-left transition-colors"
                  >
                    <Package className="w-4 h-4 text-amber-600" />
                    <span>+ Add New Product</span>
                  </button>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => handleQuickAction('expense')}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-charcoal-800 hover:bg-concrete-100 text-left transition-colors"
                  >
                    <Wallet className="w-4 h-4 text-rose-600" />
                    <span>+ Record Expense</span>
                  </button>
                  <button
                    onClick={() => handleQuickAction('fuel')}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-charcoal-800 hover:bg-concrete-100 text-left transition-colors"
                  >
                    <Fuel className="w-4 h-4 text-yellow-dark" />
                    <span>+ Log Vehicle Diesel</span>
                  </button>
                  <button
                    onClick={() => handleQuickAction('employee')}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-charcoal-800 hover:bg-concrete-100 text-left transition-colors"
                  >
                    <UserPlus className="w-4 h-4 text-purple-600" />
                    <span>+ Register Employee</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Notifications Icon */}
        <button
          onClick={() => setNotificationsOpen(true)}
          className="relative p-2 text-charcoal-600 hover:text-charcoal-950 rounded-lg hover:bg-concrete-100 transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {totalNotifications > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
          )}
        </button>

        {/* Role Switcher & User Profile */}
        <div className="relative">
          <button
            onClick={() => setRoleDropdownOpen(!isRoleDropdownOpen)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-concrete-100 transition-colors border border-transparent hover:border-concrete-200"
          >
            <div className="w-7 h-7 rounded-full bg-charcoal-800 text-yellow-brand font-extrabold text-xs flex items-center justify-center border border-charcoal-900">
              KS
            </div>
            <div className="hidden md:block text-left text-xs">
              <div className="font-bold text-charcoal-900 flex items-center gap-1">
                <span>{currentUser?.name?.split(' ')[0] || 'Owner'}</span>
                <ChevronDown className="w-3 h-3 text-charcoal-400" />
              </div>
              <p className="text-[10px] text-charcoal-500 font-semibold">{currentUser?.role || 'OWNER'}</p>
            </div>
          </button>

          {isRoleDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setRoleDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl border border-concrete-200 shadow-modal z-50 p-2 animate-fade-in">
                <div className="px-3 py-2 border-b border-concrete-100">
                  <p className="text-xs font-bold text-charcoal-900">{currentUser?.name}</p>
                  <p className="text-[11px] text-charcoal-500">{currentUser?.email}</p>
                </div>

                <div className="py-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400 px-3 mb-1.5">
                    Switch Active Role Preview
                  </p>
                  {(['OWNER', 'ADMIN', 'ACCOUNTANT', 'STAFF'] as UserRole[]).map((role) => (
                    <button
                      key={role}
                      onClick={() => {
                        switchRole(role);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-1.5 text-xs rounded-lg transition-colors ${
                        currentUser?.role === role
                          ? 'bg-yellow-light text-charcoal-900 font-bold border border-yellow-brand/40'
                          : 'text-charcoal-700 hover:bg-concrete-100'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Shield className="w-3.5 h-3.5 text-charcoal-400" />
                        <span>{role}</span>
                      </div>
                      {currentUser?.role === role && (
                        <span className="text-[10px] bg-yellow-brand text-charcoal-950 px-1.5 py-0.2 rounded font-bold">
                          Active
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
