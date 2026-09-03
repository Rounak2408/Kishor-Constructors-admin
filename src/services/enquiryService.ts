import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { CustomerEnquiry } from '../types';

export const enquiryService = {
  // Fetch enquiries
  async getAll(): Promise<CustomerEnquiry[] | null> {
    if (!isSupabaseConfigured || !supabase) return null;
    try {
      const { data, error } = await supabase
        .from('customer_enquiries')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as unknown as CustomerEnquiry[];
    } catch (err) {
      console.warn('Supabase fetch enquiries error, using local state:', err);
      return null;
    }
  },

  // Update enquiry status
  async updateStatus(id: string, status: CustomerEnquiry['status'], notes?: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const { error } = await supabase
        .from('customer_enquiries')
        .update({ status, notes })
        .eq('id', id);
      return !error;
    } catch (err) {
      console.warn('Supabase update enquiry error:', err);
      return false;
    }
  },

  // Subscribe to real-time new incoming enquiries from website
  subscribe(onNewEnquiry: (enquiry: CustomerEnquiry) => void) {
    if (!isSupabaseConfigured || !supabase) return () => {};
    const client = supabase;
    const channel = client
      .channel('public:customer_enquiries')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'customer_enquiries' },
        (payload) => {
          onNewEnquiry(payload.new as CustomerEnquiry);
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  },
};
