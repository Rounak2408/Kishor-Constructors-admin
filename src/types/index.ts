// Kishor Construction - Domain Type Definitions
// Single source of truth schema ready for future Supabase Postgres schema mapping

export type UserRole = 'OWNER' | 'ADMIN' | 'ACCOUNTANT' | 'STAFF';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  phone?: string;
  lastLogin?: string;
}

export type ProductVisibility = 'Visible' | 'Hidden';
export type ProductStatus = 'Active' | 'Inactive';
export type StockStatus = 'Healthy' | 'Low Stock' | 'Critical' | 'Out of Stock';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  itemCount: number;
  isActive: boolean;
  visibility: ProductVisibility;
  sortOrder: number;
  createdAt: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  categoryId: string; // e.g. Cement, Steel, Pipes
  categoryName: string;
  logoUrl?: string;
  isActive: boolean;
  visibility: ProductVisibility;
  productCount: number;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  categoryId: string;
  categoryName: string;
  brandId?: string;
  brandName?: string;
  type: string; // e.g. PPC, OPC 43, OPC 53, TMT 550D, CPVC, 20mm
  unit: string; // e.g. Bag, Ton, Metric Ton, Piece, CFT, Bundle
  weight: string; // e.g. "50 KG", "100 CFT", "12 MM"
  description: string;
  purchasePrice: number; // Cost price (for COGS calculation)
  sellingPrice: number; // Current selling price (synced to public website)
  currentStock: number;
  minimumStock: number;
  imageUrl: string;
  status: ProductStatus;
  visibility: ProductVisibility; // Controls visibility on customer website
  isFeatured: boolean; // Controls featured badge on public homepage
  lastUpdated: string;
  createdAt: string;
}

export type MovementType = 'PURCHASE' | 'SALE' | 'RETURN' | 'ADJUSTMENT';

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  categoryName: string;
  quantity: number; // Positive for IN (Purchase/Return), Negative for OUT (Sale)
  previousStock: number;
  newStock: number;
  type: MovementType;
  referenceId: string; // Invoice / PO / Adjustment Ref #
  date: string;
  notes?: string;
  performedBy: string;
}

export type PaymentMethod = 'Cash' | 'UPI' | 'Credit' | 'Bank Transfer' | 'Cheque';
export type PaymentStatus = 'Paid' | 'Partial' | 'Due';

export interface SaleItem {
  productId: string;
  productName: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  purchasePrice: number; // Snapshot of cost at time of sale for exact COGS calculation
  discount: number;
  total: number;
}

export interface Sale {
  id: string;
  invoiceNo: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  items: SaleItem[];
  subtotal: number;
  taxAmount: number; // GST 18% or 5% if applicable
  discountAmount: number;
  totalAmount: number;
  cogsTotal: number; // Total Cost of Goods Sold for this invoice
  grossProfit: number; // totalAmount - cogsTotal
  paidAmount: number;
  dueAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  notes?: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  totalPurchases: number;
  totalPaid: number;
  totalDue: number;
  creditLimit: number;
  lastPurchaseDate: string;
  status: 'Active' | 'Inactive' | 'Overdue';
  createdAt: string;
}

export interface PurchaseItem {
  productId: string;
  productName: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Purchase {
  id: string;
  purchaseOrderNo: string;
  billNo: string;
  supplierId: string;
  supplierName: string;
  supplierPhone: string;
  items: PurchaseItem[];
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  date: string;
  notes?: string;
  createdAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  companyName: string;
  phone: string;
  email?: string;
  address: string;
  gstNumber?: string;
  totalPurchases: number;
  totalPaid: number;
  totalDue: number;
  lastPurchaseDate: string;
  rating?: number;
  status: 'Active' | 'Inactive';
}

export type EmployeeStatus = 'Active' | 'On Leave' | 'Inactive';
export type AttendanceStatus = 'Present' | 'Absent' | 'Half Day' | 'Leave' | 'Holiday';

export interface Employee {
  id: string;
  name: string;
  role: string; // e.g. Site Supervisor, Sales Manager, Heavy Truck Driver, Loader, Accountant
  department: 'Operations' | 'Sales' | 'Logistics' | 'Finance' | 'Warehouse';
  phone: string;
  email?: string;
  joinDate: string;
  basicSalary: number; // Monthly base
  dailyWageRate?: number;
  status: EmployeeStatus;
  avatarUrl?: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  role: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  checkIn?: string; // HH:mm
  checkOut?: string; // HH:mm
  workingHours: number; // Decimal hours e.g. 8.5
  overtimeHours: number;
  notes?: string;
}

export interface HolidayLeave {
  id: string;
  title: string;
  type: 'Holiday' | 'Employee Leave';
  employeeId?: string;
  employeeName?: string;
  startDate: string;
  endDate: string;
  daysCount: number;
  reason?: string;
  status: 'Approved' | 'Pending' | 'Rejected';
}

export interface SalaryPayment {
  id: string;
  month: string; // e.g. "2026-08"
  employeeId: string;
  employeeName: string;
  role: string;
  basicSalary: number;
  workingDays: number;
  presentDays: number;
  overtimeHours: number;
  overtimePay: number;
  advanceDeduction: number;
  bonus: number;
  finalPay: number;
  status: 'Paid' | 'Pending' | 'Draft';
  paymentDate?: string;
  paymentMethod?: PaymentMethod;
}

export interface Vehicle {
  id: string;
  vehicleNumber: string; // e.g. "BR-01-GB-4590"
  model: string; // e.g. "Tata Signa 2823 Tipper (10 Wheeler)"
  type: 'Heavy Truck' | 'Tipper' | 'Pickup 4x4' | 'Tractor Trailer' | 'Site Loader';
  driverId?: string;
  driverName?: string;
  status: 'Active' | 'In Maintenance' | 'Idle';
  totalKm: number;
  currentOdometer: number;
  fuelCapacityLitres: number;
  averageFuelEfficiencyKmPerL: number; // KM/L
  lastServiceDate: string;
}

export interface FuelEntry {
  id: string;
  vehicleId: string;
  vehicleNumber: string;
  date: string;
  litres: number;
  fuelRatePerLitre: number;
  totalCost: number;
  odometerReading: number;
  distanceCoveredKm: number;
  fuelStation: string;
  purpose: string; // e.g. "Site Delivery to Danapur Project"
  filledByDriver: string;
}

export interface VehicleExpense {
  id: string;
  vehicleId: string;
  vehicleNumber: string;
  date: string;
  category: 'Routine Service' | 'Tyre Replacement' | 'Insurance / Fitness' | 'Emergency Repair' | 'Toll / Permit';
  amount: number;
  workshopName: string;
  invoiceNo?: string;
  notes?: string;
}

export type ExpenseCategory =
  | 'Diesel'
  | 'Salary'
  | 'Electricity'
  | 'Rent'
  | 'Maintenance'
  | 'Transport & Freight'
  | 'Loading / Unloading'
  | 'Office & Admin'
  | 'Marketing & Promo'
  | 'Other';

export interface Expense {
  id: string;
  date: string;
  category: ExpenseCategory;
  amount: number;
  paidTo: string;
  paymentMethod: PaymentMethod;
  referenceNo?: string;
  description: string;
  receiptUrl?: string;
}

export interface Income {
  id: string;
  date: string;
  source: 'Product Sales' | 'Freight / Delivery Charge' | 'Scrap Material Sale' | 'Consulting & Site Service' | 'Other';
  amount: number;
  receivedFrom: string;
  paymentMethod: PaymentMethod;
  referenceNo?: string;
  description: string;
}

// Financial P&L summary breakdown
export interface FinancialStatement {
  period: string;
  grossRevenue: number;
  cogs: number; // Cost of Goods Sold
  grossProfit: number; // grossRevenue - cogs
  grossMarginPercentage: number;
  operatingExpenses: {
    salary: number;
    diesel: number;
    vehicleMaintenance: number;
    rent: number;
    electricity: number;
    loadingUnloading: number;
    officeAdmin: number;
    other: number;
    total: number;
  };
  netOperatingProfit: number; // grossProfit - totalOperatingExpenses
  otherIncome: number;
  netProfit: number;
  netMarginPercentage: number;
}

// Website CMS & Public Website Sync
export interface WebsiteHeroContent {
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaLink: string;
  heroImageUrl: string;
  badgeText: string;
  phonePrimary: string;
  whatsappNumber: string;
  addressDisplay: string;
  gstNumber: string;
}

export interface WebsiteBanner {
  id: string;
  title: string;
  subtitle: string;
  badgeText?: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  sortOrder: number;
  bgColor?: string;
}

export interface WebsiteAnnouncement {
  id: string;
  message: string;
  linkText?: string;
  linkUrl?: string;
  isActive: boolean;
  priority: 'Normal' | 'Important' | 'Urgent';
  updatedAt: string;
}

export type EnquiryStatus = 'New' | 'Contacted' | 'In Progress' | 'Completed' | 'Cancelled';

export interface CustomerEnquiry {
  id: string;
  customerName: string;
  phone: string;
  email?: string;
  location: string;
  productName: string;
  quantityRequested: string;
  message: string;
  date: string;
  status: EnquiryStatus;
  notes?: string;
}

export interface ActivityLogItem {
  id: string;
  action: string;
  category: 'Inventory' | 'Sales' | 'Purchase' | 'Staff' | 'Vehicles' | 'Finance' | 'Website CMS' | 'System';
  details: string;
  user: string;
  timestamp: string;
}
