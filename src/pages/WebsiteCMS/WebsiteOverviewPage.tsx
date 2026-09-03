import React from 'react';
import {
  Globe,
  Eye,
  ShoppingBag,
  MessageSquare,
  Image,
  FileText,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { StatCard } from '../../components/ui/StatCard';

export const WebsiteOverviewPage: React.FC = () => {
  const { products, websiteBanners, customerEnquiries, setActivePage } = useApp();

  const visibleProducts = products.filter((p) => p.visibility === 'Visible').length;
  const activeBanners = websiteBanners.filter((b) => b.isActive).length;
  const newEnquiries = customerEnquiries.filter((e) => e.status === 'New').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-concrete-200 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-charcoal-900 tracking-tight">
              Customer Website CMS
            </h1>
            <Badge variant="healthy" size="sm">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse" />
              Live & Synced
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
            Manage product visibility, homepage content, banners & customer enquiries for the public-facing website.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const event = new CustomEvent('open-website-preview');
            window.dispatchEvent(event);
          }}
          icon={<ExternalLink className="w-4 h-4" />}
        >
          Preview Customer Website
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Products Visible"
          value={`${visibleProducts} / ${products.length}`}
          trend="up"
          trendValue="Live Catalog"
          comparison="Synced with inventory"
          icon={<ShoppingBag className="w-4 h-4 text-emerald-700" />}
        />
        <StatCard
          label="Active Banners"
          value={`${activeBanners} Banners`}
          trend="neutral"
          trendValue="Hero Section"
          comparison="Promotional slots"
          icon={<Image className="w-4 h-4 text-blue-700" />}
        />
        <StatCard
          label="New Enquiries"
          value={`${newEnquiries} Pending`}
          trend={newEnquiries > 0 ? 'up' : 'neutral'}
          trendValue="Customer Leads"
          comparison="Awaiting response"
          icon={<MessageSquare className="w-4 h-4 text-amber-700" />}
        />
        <StatCard
          label="Website Status"
          value="Active"
          trend="up"
          trendValue="100% Uptime"
          comparison="Real-time sync"
          icon={<Globe className="w-4 h-4 text-emerald-700" />}
        />
      </div>

      {/* CMS Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          {
            title: 'Homepage Content',
            description: 'Edit hero headline, subtitle, contact phone, WhatsApp number, business address & GST display.',
            page: 'website-homepage' as const,
            icon: <FileText className="w-5 h-5 text-yellow-dark" />,
            action: 'Edit Content',
          },
          {
            title: 'Featured Products',
            description: 'Select and reorder which products are featured prominently on the customer website landing page.',
            page: 'website-featured' as const,
            icon: <ShoppingBag className="w-5 h-5 text-yellow-dark" />,
            action: 'Manage Featured',
          },
          {
            title: 'Promotional Banners',
            description: 'Create and manage seasonal discount banners, festive sale promotions and CTA links.',
            page: 'website-banners' as const,
            icon: <Image className="w-5 h-5 text-yellow-dark" />,
            action: 'Manage Banners',
          },
          {
            title: 'Customer Enquiries',
            description: 'View and respond to customer quote requests, bulk enquiries and contact form submissions.',
            page: 'website-enquiries' as const,
            icon: <MessageSquare className="w-5 h-5 text-yellow-dark" />,
            action: 'View Enquiries',
          },
        ].map((item) => (
          <Card
            key={item.title}
            hoverable
            className="p-5 cursor-pointer"
            onClick={() => setActivePage(item.page)}
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-light border border-yellow-brand/30 flex items-center justify-center flex-shrink-0">
                {item.icon}
              </div>
              <div>
                <h3 className="text-sm font-bold text-charcoal-900">{item.title}</h3>
                <p className="text-xs text-charcoal-500 mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end">
              <span className="text-xs font-bold text-yellow-dark flex items-center gap-1 hover:underline">
                {item.action} <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Sync Status */}
      <Card className="p-5">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <div>
            <p className="text-xs font-bold text-charcoal-900">
              Real-Time CMS Sync Active
            </p>
            <p className="text-[11px] text-charcoal-500 mt-0.5">
              Product prices, stock visibility, banners and homepage content changes reflect instantly on the public customer website.
              Last synced: Just now.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
