-- =====================================================================
-- KISHOR CONSTRUCTION - COMPLETE SUPABASE POSTGRESQL DATABASE SCHEMA
-- Compatible with Admin ERP & Customer Public Website
-- =====================================================================

-- 1. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BRANDS TABLE
CREATE TABLE IF NOT EXISTS brands (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  logo TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PRODUCTS TABLE (Synced with Public Website)
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  sku TEXT UNIQUE NOT NULL,
  category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
  brand_id TEXT REFERENCES brands(id) ON DELETE SET NULL,
  description TEXT,
  unit TEXT NOT NULL, -- 'Bag', 'Ton', 'CFT', 'Piece', 'Litre'
  purchase_price NUMERIC(12, 2) NOT NULL DEFAULT 0, -- Private to Admin ERP
  selling_price NUMERIC(12, 2) NOT NULL DEFAULT 0,  -- Public on Website
  current_stock NUMERIC(12, 2) NOT NULL DEFAULT 0,
  minimum_stock NUMERIC(12, 2) NOT NULL DEFAULT 10,
  is_featured BOOLEAN DEFAULT FALSE,
  is_visible_on_website BOOLEAN DEFAULT TRUE,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. STOCK MOVEMENTS AUDIT LOG
CREATE TABLE IF NOT EXISTS stock_movements (
  id TEXT PRIMARY KEY,
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'Inward', 'Outward', 'Adjustment', 'Damage'
  quantity NUMERIC(12, 2) NOT NULL,
  previous_stock NUMERIC(12, 2) NOT NULL,
  new_stock NUMERIC(12, 2) NOT NULL,
  reference_id TEXT, -- Invoice # or PO #
  notes TEXT,
  performed_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CUSTOMERS TABLE (Khata Ledger)
CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT,
  city TEXT DEFAULT 'Patna, Bihar',
  total_purchases NUMERIC(12, 2) DEFAULT 0,
  total_paid NUMERIC(12, 2) DEFAULT 0,
  total_due NUMERIC(12, 2) DEFAULT 0,
  credit_limit NUMERIC(12, 2) DEFAULT 100000,
  status TEXT DEFAULT 'Active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SALES & INVOICES TABLE
CREATE TABLE IF NOT EXISTS sales (
  id TEXT PRIMARY KEY,
  invoice_no TEXT UNIQUE NOT NULL,
  customer_id TEXT REFERENCES customers(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0,
  tax_amount NUMERIC(12, 2) DEFAULT 0,
  discount_amount NUMERIC(12, 2) DEFAULT 0,
  total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  cogs_total NUMERIC(12, 2) NOT NULL DEFAULT 0, -- Cost of Goods Sold
  gross_profit NUMERIC(12, 2) NOT NULL DEFAULT 0,
  paid_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  due_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  payment_method TEXT NOT NULL, -- 'Cash', 'UPI', 'Credit', 'Bank Transfer'
  payment_status TEXT NOT NULL, -- 'Paid', 'Partial', 'Due'
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. SUPPLIERS TABLE
CREATE TABLE IF NOT EXISTS suppliers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  company_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  gstin TEXT,
  address TEXT,
  total_purchases NUMERIC(12, 2) DEFAULT 0,
  total_paid NUMERIC(12, 2) DEFAULT 0,
  total_due NUMERIC(12, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. PURCHASES & INWARD ORDERS TABLE
CREATE TABLE IF NOT EXISTS purchases (
  id TEXT PRIMARY KEY,
  purchase_order_no TEXT UNIQUE NOT NULL,
  bill_no TEXT,
  supplier_id TEXT REFERENCES suppliers(id) ON DELETE SET NULL,
  supplier_name TEXT NOT NULL,
  supplier_phone TEXT,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  paid_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  due_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  payment_status TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. EMPLOYEES & STAFF TABLE
CREATE TABLE IF NOT EXISTS employees (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  designation TEXT NOT NULL,
  department TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  monthly_salary NUMERIC(12, 2) NOT NULL DEFAULT 0,
  joining_date DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'Active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. DAILY ATTENDANCE
CREATE TABLE IF NOT EXISTS attendance (
  id TEXT PRIMARY KEY,
  employee_id TEXT REFERENCES employees(id) ON DELETE CASCADE,
  employee_name TEXT NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  status TEXT NOT NULL, -- 'Present', 'Absent', 'Half Day'
  check_in TEXT,
  check_out TEXT,
  working_hours NUMERIC(4, 2) DEFAULT 8.0,
  overtime_hours NUMERIC(4, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. FLEET VEHICLES
CREATE TABLE IF NOT EXISTS vehicles (
  id TEXT PRIMARY KEY,
  registration_no TEXT UNIQUE NOT NULL,
  model TEXT NOT NULL,
  type TEXT NOT NULL, -- 'Tipper Truck', 'Tractor', 'Transit Mixer', 'Pickup'
  driver_name TEXT,
  driver_phone TEXT,
  total_km NUMERIC(10, 2) DEFAULT 0,
  status TEXT DEFAULT 'Active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. DIESEL & FUEL LOGS
CREATE TABLE IF NOT EXISTS fuel_entries (
  id TEXT PRIMARY KEY,
  vehicle_id TEXT REFERENCES vehicles(id) ON DELETE CASCADE,
  registration_no TEXT NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  litres NUMERIC(8, 2) NOT NULL,
  rate_per_litre NUMERIC(8, 2) NOT NULL,
  total_cost NUMERIC(10, 2) NOT NULL,
  odometer_reading NUMERIC(10, 2) NOT NULL,
  petrol_pump_name TEXT,
  payment_mode TEXT DEFAULT 'Cash',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. OPERATING EXPENSES
CREATE TABLE IF NOT EXISTS expenses (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL, -- 'Salaries', 'Diesel', 'Maintenance', 'Rent', 'Electricity', 'Loading/Labour', 'Admin'
  title TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  payment_method TEXT DEFAULT 'Cash',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. CUSTOMER WEBSITE CMS - HERO & CONTACT CONTENT
CREATE TABLE IF NOT EXISTS website_content (
  id TEXT PRIMARY KEY DEFAULT 'main',
  hero_title TEXT NOT NULL,
  hero_subtitle TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT NOT NULL,
  gstin TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. CUSTOMER WEBSITE CMS - PROMOTIONAL BANNERS
CREATE TABLE IF NOT EXISTS website_banners (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  cta_text TEXT,
  link_url TEXT,
  bg_gradient TEXT DEFAULT 'from-amber-600 to-yellow-500',
  is_active BOOLEAN DEFAULT TRUE,
  priority INTEGER DEFAULT 1,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. CUSTOMER WEBSITE CMS - INCOMING QUOTE ENQUIRIES
CREATE TABLE IF NOT EXISTS customer_enquiries (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  material_needed TEXT NOT NULL,
  quantity TEXT,
  delivery_location TEXT NOT NULL,
  status TEXT DEFAULT 'New', -- 'New', 'Contacted', 'In Progress', 'Completed'
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_enquiries ENABLE ROW LEVEL SECURITY;

-- Allow Public (Website) to read active products, banners, and website content
CREATE POLICY "Public Read Active Products" ON products FOR SELECT USING (is_visible_on_website = true);
CREATE POLICY "Public Read Website Content" ON website_content FOR SELECT USING (true);
CREATE POLICY "Public Read Website Banners" ON website_banners FOR SELECT USING (is_active = true);

-- Allow Public (Website) to submit new quote enquiries
CREATE POLICY "Public Insert Enquiry" ON customer_enquiries FOR INSERT WITH CHECK (true);

-- Allow Authenticated / Service Role full access
CREATE POLICY "Admin Full Access Products" ON products FOR ALL USING (true);
CREATE POLICY "Admin Full Access Website Content" ON website_content FOR ALL USING (true);
CREATE POLICY "Admin Full Access Website Banners" ON website_banners FOR ALL USING (true);
CREATE POLICY "Admin Full Access Enquiries" ON customer_enquiries FOR ALL USING (true);

-- =====================================================================
-- DEFAULT SEED DATA
-- =====================================================================
INSERT INTO website_content (id, hero_title, hero_subtitle, phone, whatsapp, email, address, gstin)
VALUES (
  'main',
  'Bihar’s Leading Building Materials & Construction Supplies',
  'Wholesale & Retail: UltraTech Cement, Tata Tiscon TMT, Sone Sand & Kiln Bricks with direct on-site fleet delivery across Patna & Bihar.',
  '+91 98350 12345',
  '+91 98350 12345',
  'sales@kishorconstruction.com',
  'NH-30, Near Fatuha Bypass, Patna, Bihar 800001',
  '10AABCK1234F1Z5'
) ON CONFLICT (id) DO NOTHING;
