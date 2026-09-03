import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Monitor,
  ExternalLink,
  Phone,
  MapPin,
  CheckCircle,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';
import { getPublicWebsiteUrl } from '../../lib/supabase';

export const WebsitePreviewModal: React.FC = () => {
  const {
    isWebsitePreviewOpen,
    setWebsitePreviewOpen,
    websiteHero,
    websiteBanners,
    websiteAnnouncements,
    products,
    categories,
    brands,
  } = useApp();

  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>('all');
  const [selectedBrandId, setSelectedBrandId] = useState<string>('all');

  if (!isWebsitePreviewOpen) return null;

  // Filter only VISIBLE products for the public website
  const visibleProducts = products.filter((p) => p.visibility === 'Visible' && p.status === 'Active');

  const filteredProducts = visibleProducts.filter((p) => {
    if (selectedCategorySlug !== 'all') {
      const cat = categories.find((c) => c.slug === selectedCategorySlug);
      if (cat && p.categoryId !== cat.id) return false;
    }
    if (selectedBrandId !== 'all') {
      if (p.brandId !== selectedBrandId) return false;
    }
    return true;
  });

  const featuredProducts = visibleProducts.filter((p) => p.isFeatured);
  const activeBanners = websiteBanners.filter((b) => b.isActive);
  const activeAnnouncements = websiteAnnouncements.filter((a) => a.isActive);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-2 sm:p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal-950/80 backdrop-blur-md transition-opacity"
        onClick={() => setWebsitePreviewOpen(false)}
      />

      {/* Main Preview Container */}
      <div className="relative bg-charcoal-900 border border-charcoal-700 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[96vh] flex flex-col z-10 overflow-hidden text-charcoal-900">
        {/* Preview Top Toolbar */}
        <div className="px-4 py-3 bg-charcoal-950 border-b border-charcoal-800 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-charcoal-800 rounded-md border border-charcoal-700 text-xs text-concrete-300 font-mono">
              <span className="truncate max-w-[240px]">{getPublicWebsiteUrl()}</span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950 px-1 py-0.2 rounded font-sans">LIVE SYNC</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Viewport switcher */}
            <div className="flex items-center bg-charcoal-800 p-0.5 rounded-lg border border-charcoal-700">
              <button
                onClick={() => setDeviceMode('desktop')}
                className={`p-1.5 rounded-md transition-colors ${
                  deviceMode === 'desktop' ? 'bg-charcoal-700 text-yellow-brand' : 'text-concrete-400 hover:text-white'
                }`}
                title="Desktop View (1200px)"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeviceMode('mobile')}
                className={`p-1.5 rounded-md transition-colors ${
                  deviceMode === 'mobile' ? 'bg-charcoal-700 text-yellow-brand' : 'text-concrete-400 hover:text-white'
                }`}
                title="Mobile View (375px)"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>

            {/* Open in new tab */}
            <button
              onClick={() => window.open(getPublicWebsiteUrl(), '_blank', 'noopener,noreferrer')}
              className="text-concrete-300 hover:text-white p-1.5 rounded-lg hover:bg-charcoal-800 transition-colors flex items-center gap-1 text-xs font-semibold bg-charcoal-800 border border-charcoal-700"
              title="Open Public Website in New Tab"
            >
              <ExternalLink className="w-3.5 h-3.5 text-yellow-brand" />
              <span className="hidden md:inline">Open Live</span>
            </button>

            <button
              onClick={() => setWebsitePreviewOpen(false)}
              className="text-concrete-400 hover:text-white p-1.5 rounded-lg hover:bg-charcoal-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Preview Frame Wrapper */}
        <div className="flex-1 overflow-y-auto bg-concrete-200 p-2 sm:p-6 flex justify-center">
          <div
            className={`bg-white transition-all duration-300 shadow-2xl rounded-xl overflow-hidden border border-concrete-300 ${
              deviceMode === 'mobile' ? 'w-[380px] min-h-[640px]' : 'w-full'
            }`}
          >
            {/* Public Website Header */}
            {activeAnnouncements.length > 0 && (
              <div className="bg-charcoal-900 text-concrete-200 px-4 py-1.5 text-xs flex items-center justify-between border-b border-charcoal-800">
                <div className="flex items-center gap-2 truncate">
                  <span className="w-2 h-2 rounded-full bg-yellow-brand animate-ping" />
                  <span className="truncate">{activeAnnouncements[0].message}</span>
                </div>
                <div className="hidden sm:flex items-center gap-3 text-[11px] text-concrete-400 font-medium">
                  <span>GST: {websiteHero.gstNumber}</span>
                  <a href={`tel:${websiteHero.phonePrimary}`} className="text-yellow-brand hover:underline font-bold">
                    {websiteHero.phonePrimary}
                  </a>
                </div>
              </div>
            )}

            {/* Public Navbar */}
            <header className="px-5 py-4 border-b border-concrete-200 bg-white sticky top-0 z-20 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-yellow-brand text-charcoal-950 flex items-center justify-center font-extrabold shadow-sm">
                  KC
                </div>
                <div>
                  <h1 className="text-sm font-extrabold tracking-wider text-charcoal-950">KISHOR CONSTRUCTION</h1>
                  <p className="text-[10px] text-charcoal-500 uppercase tracking-widest font-semibold">
                    Building Materials Depot
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={`https://wa.me/${websiteHero.whatsappNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>WhatsApp Quote</span>
                </a>
              </div>
            </header>

            {/* Public Hero Banner */}
            <div className="relative bg-charcoal-950 text-white px-6 py-12 sm:py-16 overflow-hidden">
              <div
                className="absolute inset-0 opacity-25 bg-cover bg-center"
                style={{ backgroundImage: `url(${websiteHero.heroImageUrl})` }}
              />
              <div className="relative z-10 max-w-2xl">
                <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest bg-yellow-brand text-charcoal-950 px-2.5 py-0.5 rounded mb-3">
                  {websiteHero.badgeText}
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                  {websiteHero.headline}
                </h2>
                <p className="text-xs sm:text-sm text-concrete-300 mt-3 max-w-xl leading-relaxed">
                  {websiteHero.subheadline}
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <a
                    href="#catalog"
                    className="bg-yellow-brand hover:bg-yellow-hover text-charcoal-950 font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-colors"
                  >
                    <span>{websiteHero.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Promotional Active Banner */}
            {activeBanners.length > 0 && (
              <div className="bg-yellow-light border-y border-yellow-brand/40 px-5 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-center sm:text-left">
                  <Sparkles className="w-5 h-5 text-yellow-dark flex-shrink-0" />
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-yellow-dark bg-yellow-brand/20 px-1.5 py-0.2 rounded mr-2">
                      {activeBanners[0].badgeText || 'Special Offer'}
                    </span>
                    <span className="text-xs font-bold text-charcoal-900">{activeBanners[0].title}</span>
                    <p className="text-[11px] text-charcoal-600">{activeBanners[0].subtitle}</p>
                  </div>
                </div>
                <a
                  href={activeBanners[0].ctaLink}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap"
                >
                  {activeBanners[0].ctaText}
                </a>
              </div>
            )}

            {/* Featured Categories Pills */}
            <div className="p-5 bg-concrete-50 border-b border-concrete-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-charcoal-700">
                  Shop By Category
                </h3>
                <span className="text-[11px] text-charcoal-500">{visibleProducts.length} Products Active</span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <button
                  onClick={() => {
                    setSelectedCategorySlug('all');
                    setSelectedBrandId('all');
                  }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap transition-colors ${
                    selectedCategorySlug === 'all'
                      ? 'bg-charcoal-900 text-white'
                      : 'bg-white border border-concrete-300 text-charcoal-700 hover:bg-concrete-100'
                  }`}
                >
                  All Products
                </button>
                {categories
                  .filter((c) => c.visibility === 'Visible')
                  .map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategorySlug(cat.slug);
                        setSelectedBrandId('all');
                      }}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap transition-colors ${
                        selectedCategorySlug === cat.slug
                          ? 'bg-charcoal-900 text-white'
                          : 'bg-white border border-concrete-300 text-charcoal-700 hover:bg-concrete-100'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
              </div>
            </div>

            {/* Cement Brands Sub-filters (if Cement is selected or All) */}
            {(selectedCategorySlug === 'cement' || selectedCategorySlug === 'all') && (
              <div className="px-5 py-2.5 bg-white border-b border-concrete-200 flex items-center gap-2 overflow-x-auto">
                <span className="text-[11px] font-bold text-charcoal-500 uppercase tracking-wider whitespace-nowrap">
                  Cement Brands:
                </span>
                <button
                  onClick={() => setSelectedBrandId('all')}
                  className={`text-xs px-2.5 py-1 rounded-md font-semibold transition-colors ${
                    selectedBrandId === 'all' ? 'bg-yellow-brand text-charcoal-950' : 'text-charcoal-600 hover:bg-concrete-100'
                  }`}
                >
                  All Brands
                </button>
                {brands
                  .filter((b) => b.categoryName === 'Cement')
                  .map((brand) => (
                    <button
                      key={brand.id}
                      onClick={() => setSelectedBrandId(brand.id)}
                      className={`text-xs px-2.5 py-1 rounded-md font-semibold transition-colors ${
                        selectedBrandId === brand.id
                          ? 'bg-yellow-brand text-charcoal-950 font-bold'
                          : 'text-charcoal-600 hover:bg-concrete-100'
                      }`}
                    >
                      {brand.name}
                    </button>
                  ))}
              </div>
            )}

            {/* Products Grid */}
            <div id="catalog" className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-charcoal-900">
                  Materials Catalog ({filteredProducts.length})
                </h3>
                <span className="text-xs text-charcoal-500">Live Prices from Kishor Construction Yard</span>
              </div>

              <div
                className={`grid gap-4 ${
                  deviceMode === 'mobile' ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                }`}
              >
                {filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white border border-concrete-300 rounded-xl overflow-hidden shadow-card hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="h-40 bg-concrete-100 relative overflow-hidden">
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                        {p.isFeatured && (
                          <span className="absolute top-2 left-2 bg-yellow-brand text-charcoal-950 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded shadow-sm">
                            Featured
                          </span>
                        )}
                        <span
                          className={`absolute bottom-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm ${
                            p.currentStock > 0 ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                          }`}
                        >
                          {p.currentStock > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>

                      <div className="p-4 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] text-charcoal-500">
                          <span>{p.categoryName}</span>
                          {p.brandName && <span className="font-semibold text-charcoal-700">{p.brandName}</span>}
                        </div>
                        <h4 className="text-sm font-bold text-charcoal-900 leading-snug">{p.name}</h4>
                        <p className="text-xs text-charcoal-500 line-clamp-2">{p.description}</p>
                        <p className="text-[11px] font-semibold text-charcoal-700">Spec: {p.weight}</p>
                      </div>
                    </div>

                    <div className="p-4 pt-0 border-t border-concrete-100 bg-concrete-50/50 flex items-center justify-between mt-2">
                      <div>
                        <span className="text-[10px] text-charcoal-500 uppercase font-semibold">Price / {p.unit}</span>
                        <div className="text-lg font-extrabold text-charcoal-900">
                          ₹{p.sellingPrice.toLocaleString('en-IN')}
                        </div>
                      </div>
                      <a
                        href={`https://wa.me/${websiteHero.whatsappNumber.replace(/[^0-9]/g, '')}?text=Hello%20Kishor%20Construction,%20I%20want%20to%20order%20${encodeURIComponent(p.name)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-charcoal-900 hover:bg-yellow-brand hover:text-charcoal-950 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                      >
                        Enquire Rate
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Public Footer */}
            <footer className="bg-charcoal-950 text-white p-6 border-t border-charcoal-800 text-xs">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-extrabold text-sm text-yellow-brand">KISHOR CONSTRUCTION</h4>
                  <p className="text-concrete-400 mt-1 max-w-md">{websiteHero.addressDisplay}</p>
                </div>
                <div className="text-center sm:text-right">
                  <p className="text-concrete-400">Direct Booking & Logistics Helpline:</p>
                  <p className="text-sm font-bold text-white mt-0.5">{websiteHero.phonePrimary}</p>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};
