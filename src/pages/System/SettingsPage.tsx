import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Save,
  Building,
  User,
  Shield,
  Bell,
  Globe,
  Palette,
  Database,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Link,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { UserRole } from '../../types';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { getPublicWebsiteUrl, setPublicWebsiteUrl, isSupabaseConfigured } from '../../lib/supabase';

export const SettingsPage: React.FC = () => {
  const { currentUser, switchRole } = useApp();
  const toast = useToast();

  const [businessName, setBusinessName] = useState('KISHOR CONSTRUCTION');
  const [businessType, setBusinessType] = useState('Building Materials & Construction Supplies');
  const [gstNumber, setGstNumber] = useState('10AABCK1234F1Z5');
  const [ownerName, setOwnerName] = useState('Kishor Keshri');
  const [phone, setPhone] = useState('+91 98353 92558');
  const [email, setEmail] = useState('admin@kishorconstruction.com');
  const [address, setAddress] = useState('NH-30, Near Fatuha Bypass, Patna, Bihar 800001');

  // Customer website URL configuration
  const [websiteUrl, setWebsiteUrlState] = useState(getPublicWebsiteUrl());

  const [lowStockThreshold, setLowStockThreshold] = useState('10');
  const [notifyLowStock, setNotifyLowStock] = useState(true);
  const [notifyNewEnquiry, setNotifyNewEnquiry] = useState(true);
  const [notifyDueBills, setNotifyDueBills] = useState(true);

  const handleSave = () => {
    setPublicWebsiteUrl(websiteUrl);
    toast.success('Settings Saved', 'Business profile, website URL, and preferences updated successfully.');
  };

  const handleOpenWebsite = () => {
    window.open(websiteUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-concrete-200 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-charcoal-900 tracking-tight">
              System Settings & Integrations
            </h1>
            <Badge variant="yellow" size="sm">
              Admin Panel
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
            Business profile, customer website URL, Supabase PostgreSQL backend, and role configurations.
          </p>
        </div>

        <Button
          variant="yellow"
          size="sm"
          onClick={handleSave}
          icon={<Save className="w-4 h-4" />}
        >
          Save All Changes
        </Button>
      </div>

      {/* Customer Website URL & Supabase Connection Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Public Customer Website URL Configuration */}
        <Card className="border-amber-200 bg-gradient-to-br from-white to-amber-50/30">
          <CardHeader
            title={
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-amber-600" />
                <span>Customer Website Public URL</span>
              </div>
            }
            subtitle="Link to your customer-facing frontend website"
          />
          <CardContent className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                Client / Public Website URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrlState(e.target.value)}
                  placeholder="https://kishorconstruction.com or http://localhost:5174"
                  className="w-full text-xs font-semibold rounded-xl border border-concrete-300 px-3.5 py-2.5 text-charcoal-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleOpenWebsite}
                  icon={<ExternalLink className="w-4 h-4" />}
                >
                  Test Link
                </Button>
              </div>
              <p className="text-[11px] text-charcoal-500 mt-2">
                This URL is used by the <strong>"🌐 Preview Website"</strong> header button and for syncing customer quote leads.
              </p>
            </div>

            <div className="p-3.5 bg-concrete-100/80 rounded-xl border border-concrete-200 text-xs text-charcoal-700 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <Link className="w-3.5 h-3.5 text-amber-600" /> Current Connected Target:
              </p>
              <p className="font-mono text-[11px] text-amber-900 bg-white px-2 py-1 rounded border border-concrete-300 break-all">
                {websiteUrl || 'https://kishorconstruction.com'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 2. Supabase Backend Database Status */}
        <Card className="border-concrete-200">
          <CardHeader
            title={
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-600" />
                <span>Supabase PostgreSQL Backend</span>
              </div>
            }
            subtitle="Real-time database sync for products, sales & enquiries"
          />
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-xl border bg-concrete-50">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${isSupabaseConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                <div>
                  <p className="text-xs font-bold text-charcoal-900">
                    {isSupabaseConfigured ? 'Connected to Supabase PostgreSQL' : 'Local Storage Mode (Ready for Supabase)'}
                  </p>
                  <p className="text-[11px] text-charcoal-500">
                    {isSupabaseConfigured
                      ? 'Live bidirectional sync with Customer Website is active.'
                      : 'Running safely with local state. Add Supabase keys to `.env` anytime.'}
                  </p>
                </div>
              </div>
              <Badge variant={isSupabaseConfigured ? 'healthy' : 'yellow'} size="sm">
                {isSupabaseConfigured ? 'LIVE SYNC' : 'OFFLINE SAFE'}
              </Badge>
            </div>

            <div className="text-xs text-charcoal-600 space-y-1.5 bg-concrete-50 p-3 rounded-xl border border-concrete-200">
              <p className="font-bold text-charcoal-800">📁 Supabase Database Files Created:</p>
              <p className="font-mono text-[11px] text-charcoal-700">
                • <code>supabase/schema.sql</code> (1-Click SQL Migration Script)
              </p>
              <p className="font-mono text-[11px] text-charcoal-700">
                • <code>.env</code> (VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Business Profile */}
        <Card>
          <CardHeader title="Business Profile" subtitle="Legal entity & registration details" />
          <CardContent className="space-y-4">
            <Input
              label="Business / Firm Name"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />
            <Input
              label="Business Type"
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
            />
            <Input
              label="GST Registration Number"
              value={gstNumber}
              onChange={(e) => setGstNumber(e.target.value)}
            />
            <Input
              label="Owner / Proprietor Name"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <Input
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                Registered Address
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={2}
                className="w-full text-xs rounded-lg border border-concrete-300 px-3 py-2.5 text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-charcoal-800/10 focus:border-charcoal-800 resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Role-Based Access Control */}
        <Card>
          <CardHeader
            title="Role-Based Access Control (RBAC)"
            subtitle="Switch active role to test permission-based UI visibility"
          />
          <CardContent>
            <div className="mb-4 p-4 bg-concrete-50 rounded-xl border border-concrete-200">
              <p className="text-[11px] font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                Current Active Role
              </p>
              <p className="text-sm font-extrabold text-charcoal-900">{currentUser?.name || 'Kishor Keshri'}</p>
              <Badge variant="yellow" size="sm" className="mt-1">
                {currentUser?.role || 'OWNER'}
              </Badge>
            </div>

            <div className="space-y-2">
              {[
                {
                  role: 'OWNER' as const,
                  label: 'Owner (Kishor Keshri - Full Access)',
                  description: 'Complete ERP access including finance, P&L, settings, and CMS.',
                },
                {
                  role: 'ADMIN' as const,
                  label: 'Administrator (Amit Kumar)',
                  description: 'Full operational access. Cannot modify system settings or user roles.',
                },
                {
                  role: 'ACCOUNTANT' as const,
                  label: 'Accountant (Sunil Singh)',
                  description: 'Finance, expenses, salary, reports. No inventory or CMS access.',
                },
                {
                  role: 'STAFF' as const,
                  label: 'Staff (Suresh Paswan)',
                  description: 'Attendance, basic sales POS. Read-only dashboard access.',
                },
              ].map((r) => (
                <button
                  key={r.role}
                  onClick={() => {
                    switchRole(r.role);
                    toast.success('Role Switched', `Now viewing as ${r.label}.`);
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    currentUser?.role === r.role
                      ? 'bg-charcoal-900 text-white border-charcoal-900'
                      : 'bg-white text-charcoal-900 border-concrete-200 hover:border-charcoal-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Shield className={`w-4 h-4 ${currentUser?.role === r.role ? 'text-yellow-brand' : 'text-charcoal-400'}`} />
                    <span className="text-xs font-bold">{r.label}</span>
                  </div>
                  <p className={`text-[10px] mt-0.5 ml-6 ${currentUser?.role === r.role ? 'text-charcoal-300' : 'text-charcoal-500'}`}>
                    {r.description}
                  </p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <CardHeader title="Notification Preferences" subtitle="Control real-time alert triggers" />
          <CardContent className="space-y-3">
            {[
              { label: 'Low Stock Alerts', desc: 'Notify when product stock falls below threshold', checked: notifyLowStock, setter: setNotifyLowStock },
              { label: 'New Customer Enquiry', desc: 'Alert when a new quote request is submitted from customer website', checked: notifyNewEnquiry, setter: setNotifyNewEnquiry },
              { label: 'Overdue Bills / Payables', desc: 'Remind about unpaid supplier or customer dues', checked: notifyDueBills, setter: setNotifyDueBills },
            ].map((n) => (
              <div
                key={n.label}
                className="flex items-center justify-between p-3 bg-concrete-50 rounded-xl border border-concrete-200"
              >
                <div>
                  <p className="text-xs font-bold text-charcoal-900">{n.label}</p>
                  <p className="text-[10px] text-charcoal-500 mt-0.5">{n.desc}</p>
                </div>
                <button
                  onClick={() => n.setter(!n.checked)}
                  className={`w-10 h-5 rounded-full relative transition-colors ${
                    n.checked ? 'bg-emerald-500' : 'bg-concrete-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      n.checked ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            ))}

            <div className="mt-3">
              <Input
                label="Low Stock Threshold (Units)"
                type="number"
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Invoice / Brand Config */}
        <Card>
          <CardHeader title="Invoice & Branding" subtitle="Document header customization" />
          <CardContent className="space-y-3">
            <div className="p-4 bg-concrete-50 rounded-xl border border-concrete-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-charcoal-950 flex items-center justify-center text-yellow-brand font-extrabold text-lg">
                  KC
                </div>
                <div>
                  <p className="text-sm font-extrabold text-charcoal-900">{businessName}</p>
                  <p className="text-[10px] text-charcoal-500">{businessType}</p>
                </div>
              </div>
              <p className="text-[11px] text-charcoal-600">{address}</p>
              <p className="text-[11px] text-charcoal-600 mt-0.5">📞 {phone} | ✉️ {email}</p>
              <p className="text-[10px] font-mono text-charcoal-500 mt-1">GSTIN: {gstNumber}</p>
            </div>
            <p className="text-[10px] text-charcoal-500">
              This branding appears on all generated invoices, purchase orders, salary slips, and printed reports.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
