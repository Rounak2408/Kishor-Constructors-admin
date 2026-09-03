import React, { useState } from 'react';
import { FileText, Save, Globe, Phone, MessageCircle, MapPin, Building } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';

export const HomepageContentCMS: React.FC = () => {
  const { websiteHero, updateWebsiteHero } = useApp();
  const toast = useToast();

  const [headline, setHeadline] = useState(websiteHero.headline);
  const [subtitle, setSubtitle] = useState(websiteHero.subheadline);
  const [phoneNumber, setPhoneNumber] = useState(websiteHero.phonePrimary);
  const [whatsappNumber, setWhatsappNumber] = useState(websiteHero.whatsappNumber);
  const [address, setAddress] = useState(websiteHero.addressDisplay);
  const [gstNumber, setGstNumber] = useState(websiteHero.gstNumber);

  const handleSave = () => {
    updateWebsiteHero({
      headline,
      subheadline: subtitle,
      phonePrimary: phoneNumber,
      whatsappNumber,
      addressDisplay: address,
      gstNumber,
    });
    toast.success('Homepage Updated', 'Changes saved and synced to the live customer website.');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-concrete-200 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-charcoal-900 tracking-tight">
              Homepage Content Editor
            </h1>
            <Badge variant="healthy" size="sm">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse" />
              Live Synced
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
            Edit the hero section, business contact details, and footer content displayed on the public customer website.
          </p>
        </div>

        <Button
          variant="yellow"
          size="sm"
          onClick={handleSave}
          icon={<Save className="w-4 h-4" />}
        >
          Save & Publish Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hero Content Editor */}
        <Card>
          <CardHeader
            title="Hero Section Content"
            subtitle="Main landing page headline and subtext visible to all visitors"
          />
          <CardContent className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                Hero Headline
              </label>
              <textarea
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                rows={2}
                className="w-full text-sm font-bold rounded-lg border border-concrete-300 px-3 py-2.5 text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-charcoal-800/10 focus:border-charcoal-800 resize-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                Hero Subtitle / Description
              </label>
              <textarea
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                rows={3}
                className="w-full text-xs rounded-lg border border-concrete-300 px-3 py-2.5 text-charcoal-700 focus:outline-none focus:ring-2 focus:ring-charcoal-800/10 focus:border-charcoal-800 resize-none"
              />
            </div>

            {/* Preview */}
            <div className="mt-4 p-4 bg-charcoal-900 rounded-xl text-white">
              <p className="text-[10px] uppercase tracking-wider text-charcoal-400 font-bold mb-2">
                Live Preview
              </p>
              <h2 className="text-lg font-extrabold leading-tight">{headline}</h2>
              <p className="text-xs text-charcoal-300 mt-1.5 leading-relaxed">{subtitle}</p>
            </div>
          </CardContent>
        </Card>

        {/* Business Contact Details */}
        <Card>
          <CardHeader
            title="Business Contact & Legal Info"
            subtitle="Displayed in the website header, footer, and contact sections"
          />
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-1.5 text-[11px] font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                  <Phone className="w-3.5 h-3.5 text-charcoal-400" />
                  Business Phone
                </label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full text-xs rounded-lg border border-concrete-300 px-3 py-2.5 text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-charcoal-800/10 focus:border-charcoal-800"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-[11px] font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  WhatsApp Number
                </label>
                <input
                  type="text"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="w-full text-xs rounded-lg border border-concrete-300 px-3 py-2.5 text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-charcoal-800/10 focus:border-charcoal-800"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-[11px] font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                <MapPin className="w-3.5 h-3.5 text-charcoal-400" />
                Business Address
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={2}
                className="w-full text-xs rounded-lg border border-concrete-300 px-3 py-2.5 text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-charcoal-800/10 focus:border-charcoal-800 resize-none"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-[11px] font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                <Building className="w-3.5 h-3.5 text-charcoal-400" />
                GST Registration Number
              </label>
              <input
                type="text"
                value={gstNumber}
                onChange={(e) => setGstNumber(e.target.value)}
                className="w-full text-xs font-mono rounded-lg border border-concrete-300 px-3 py-2.5 text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-charcoal-800/10 focus:border-charcoal-800"
              />
            </div>

            {/* Contact Preview */}
            <div className="mt-4 p-4 bg-concrete-50 rounded-xl border border-concrete-200">
              <p className="text-[10px] uppercase tracking-wider text-charcoal-400 font-bold mb-2">
                Footer Contact Preview
              </p>
              <p className="text-xs font-bold text-charcoal-900">KISHOR CONSTRUCTION</p>
              <p className="text-[11px] text-charcoal-600 mt-0.5">{address}</p>
              <p className="text-[11px] text-charcoal-600 mt-0.5">
                📞 {phoneNumber} · 💬 WhatsApp: {whatsappNumber}
              </p>
              <p className="text-[10px] text-charcoal-500 mt-1 font-mono">GSTIN: {gstNumber}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
