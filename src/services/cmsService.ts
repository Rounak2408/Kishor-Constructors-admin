import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { WebsiteHeroContent, WebsiteBanner } from '../types';

export const cmsService = {
  // Fetch website hero
  async getHero(): Promise<WebsiteHeroContent | null> {
    if (!isSupabaseConfigured || !supabase) return null;
    try {
      const { data, error } = await supabase.from('website_content').select('*').eq('id', 'main').single();
      if (error) throw error;
      return {
        headline: data.hero_title,
        subheadline: data.hero_subtitle,
        ctaText: 'Request Wholesale Quote',
        ctaLink: '#quote',
        heroImageUrl: '',
        badgeText: 'Bihar’s #1 Building Material Supplier',
        phonePrimary: data.phone,
        whatsappNumber: data.whatsapp,
        addressDisplay: data.address,
        gstNumber: data.gstin,
      };
    } catch (err) {
      console.warn('Supabase fetch CMS hero error:', err);
      return null;
    }
  },

  // Save website hero
  async saveHero(hero: WebsiteHeroContent): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const { error } = await supabase.from('website_content').upsert({
        id: 'main',
        hero_title: hero.headline,
        hero_subtitle: hero.subheadline,
        phone: hero.phonePrimary,
        whatsapp: hero.whatsappNumber,
        email: 'sales@kishorconstruction.com',
        address: hero.addressDisplay,
        gstin: hero.gstNumber,
        updated_at: new Date().toISOString(),
      });
      return !error;
    } catch (err) {
      console.warn('Supabase save CMS hero error:', err);
      return false;
    }
  },

  // Fetch banners
  async getBanners(): Promise<WebsiteBanner[] | null> {
    if (!isSupabaseConfigured || !supabase) return null;
    try {
      const { data, error } = await supabase.from('website_banners').select('*').order('priority');
      if (error) throw error;
      return data as WebsiteBanner[];
    } catch (err) {
      console.warn('Supabase fetch banners error:', err);
      return null;
    }
  },
};
