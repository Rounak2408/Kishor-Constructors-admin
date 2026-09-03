import React, { useState } from 'react';
import { Image, Plus, Calendar, Link2, Eye, EyeOff, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { WebsiteBanner } from '../../types';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';

export const BannersCMS: React.FC = () => {
  const { websiteBanners, addBanner, updateBanner, deleteBanner } = useApp();
  const toast = useToast();

  const [isModalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [ctaText, setCtaText] = useState('Shop Now');
  const [ctaLink, setCtaLink] = useState('/products');
  const [bgColor, setBgColor] = useState('#F5B700');
  const [startDate, setStartDate] = useState('2026-09-01');
  const [endDate, setEndDate] = useState('2026-09-30');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Banner title is required');
      return;
    }

    addBanner({
      title,
      subtitle,
      ctaText,
      ctaLink,
      bgColor,
      imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=1000&auto=format&fit=crop&q=80',
      startDate,
      endDate,
      isActive: true,
      sortOrder: websiteBanners.length + 1,
    });

    toast.success('Banner Created', `"${title}" is now live on the customer website.`);
    setModalOpen(false);
    setTitle('');
    setSubtitle('');
  };

  const toggleBanner = (id: string, currentlyActive: boolean) => {
    updateBanner(id, { isActive: !currentlyActive });
    toast.success(currentlyActive ? 'Banner Deactivated' : 'Banner Activated');
  };

  const removeBanner = (id: string) => {
    deleteBanner(id);
    toast.success('Banner Deleted');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-concrete-200 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-charcoal-900 tracking-tight">
              Promotional Banners Manager
            </h1>
            <Badge variant="yellow" size="sm">
              {websiteBanners.filter((b) => b.isActive).length} Active Banners
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
            Create seasonal sale banners, festive promotions and CTA links for the customer website hero section.
          </p>
        </div>

        <Button
          variant="yellow"
          size="sm"
          onClick={() => setModalOpen(true)}
          icon={<Plus className="w-4 h-4 stroke-[3]" />}
        >
          + Create Banner
        </Button>
      </div>

      {/* Banners List */}
      <div className="space-y-4">
        {websiteBanners.map((banner) => (
          <Card key={banner.id} className="overflow-hidden">
            <div className="flex flex-col sm:flex-row">
              {/* Banner Preview */}
              <div
                className="w-full sm:w-72 p-6 flex flex-col justify-center text-white flex-shrink-0"
                style={{ backgroundColor: banner.bgColor || '#F5B700' }}
              >
                <h3 className="text-base font-extrabold leading-tight">{banner.title}</h3>
                {banner.subtitle && (
                  <p className="text-xs opacity-90 mt-1">{banner.subtitle}</p>
                )}
                <span className="inline-block mt-3 px-3 py-1.5 bg-white/20 rounded-lg text-xs font-bold">
                  {banner.ctaText || 'Shop Now'}
                </span>
              </div>

              {/* Banner Details */}
              <div className="flex-1 p-5 flex items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Badge variant={banner.isActive ? 'healthy' : 'inactive'} size="sm">
                      {banner.isActive ? 'Active' : 'Paused'}
                    </Badge>
                    <span className="text-[10px] font-mono text-charcoal-500">
                      Position #{banner.sortOrder}
                    </span>
                  </div>
                  <p className="text-xs text-charcoal-600 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-charcoal-400" />
                    {banner.startDate} → {banner.endDate}
                  </p>
                  <p className="text-xs text-charcoal-500 flex items-center gap-1.5">
                    <Link2 className="w-3.5 h-3.5 text-charcoal-400" />
                    CTA Link: {banner.ctaLink || '/products'}
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => toggleBanner(banner.id, banner.isActive)}
                    className={`px-2.5 py-1.5 text-[11px] font-bold rounded border transition-colors ${
                      banner.isActive
                        ? 'text-amber-800 bg-amber-50 hover:bg-amber-100 border-amber-200'
                        : 'text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border-emerald-200'
                    }`}
                  >
                    {banner.isActive ? (
                      <span className="flex items-center gap-1">
                        <EyeOff className="w-3 h-3" /> Pause
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" /> Activate
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => removeBanner(banner.id)}
                    className="px-2 py-1.5 text-[11px] font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded border border-rose-200 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Banner Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Create Promotional Banner"
        subtitle="Displayed on the customer website hero carousel"
        maxWidth="md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Banner Headline"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Monsoon Sale — 15% Off on All Cement Bags!"
            required
          />

          <Input
            label="Subtitle / Description"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="e.g. Valid on UltraTech, ACC & Ambuja brands. Limited period offer."
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="CTA Button Text"
              value={ctaText}
              onChange={(e) => setCtaText(e.target.value)}
              placeholder="Shop Now"
            />
            <Input
              label="CTA Link URL"
              value={ctaLink}
              onChange={(e) => setCtaLink(e.target.value)}
              placeholder="/products"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                Background Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-8 h-8 rounded border border-concrete-300 cursor-pointer"
                />
                <span className="text-xs font-mono text-charcoal-600">{bgColor}</span>
              </div>
            </div>
            <Input
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
            <Input
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>

          {/* Preview */}
          <div className="rounded-xl overflow-hidden" style={{ backgroundColor: bgColor }}>
            <div className="p-6 text-white">
              <h3 className="text-base font-extrabold">{title || 'Banner Headline Preview'}</h3>
              {subtitle && <p className="text-xs opacity-90 mt-1">{subtitle}</p>}
              <span className="inline-block mt-2 px-3 py-1 bg-white/20 rounded text-xs font-bold">
                {ctaText || 'Shop Now'}
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-concrete-200">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="yellow">
              Publish Banner
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
