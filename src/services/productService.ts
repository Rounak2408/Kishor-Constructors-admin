import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Product } from '../types';

export const productService = {
  // Fetch all products from Supabase (or fallback to local)
  async getAll(): Promise<Product[] | null> {
    if (!isSupabaseConfigured || !supabase) return null;
    try {
      const { data, error } = await supabase.from('products').select('*').order('name');
      if (error) throw error;
      return data as Product[];
    } catch (err) {
      console.warn('Supabase fetch products error, using local state:', err);
      return null;
    }
  },

  // Save / Update product
  async save(product: Product): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const { error } = await supabase.from('products').upsert({
        id: product.id,
        name: product.name,
        sku: product.sku,
        category_id: product.categoryId,
        brand_id: product.brandId,
        description: product.description,
        unit: product.unit,
        purchase_price: product.purchasePrice,
        selling_price: product.sellingPrice,
        current_stock: product.currentStock,
        minimum_stock: product.minimumStock,
        is_featured: product.isFeatured,
        is_visible_on_website: product.visibility === 'Visible',
        updated_at: new Date().toISOString(),
      });
      return !error;
    } catch (err) {
      console.warn('Supabase save product error:', err);
      return false;
    }
  },

  // Delete product
  async delete(id: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      return !error;
    } catch (err) {
      console.warn('Supabase delete product error:', err);
      return false;
    }
  },
};
