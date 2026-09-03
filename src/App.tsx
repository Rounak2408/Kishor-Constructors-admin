import React from 'react';
import { AppProvider, useApp, ActivePage } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';
import { AdminLayout } from './components/layout/AdminLayout';
import { Login } from './pages/Auth/Login';
import { DashboardPage } from './pages/Dashboard/DashboardPage';
import { AnalyticsPage } from './pages/Analytics/AnalyticsPage';
import { ProductsPage } from './pages/Inventory/ProductsPage';
import { CategoriesPage } from './pages/Inventory/CategoriesPage';
import { BrandsPage } from './pages/Inventory/BrandsPage';
import { StockMovementsPage } from './pages/Inventory/StockMovementsPage';
import { LowStockPage } from './pages/Inventory/LowStockPage';
import { NewSalePage } from './pages/Sales/NewSalePage';
import { SalesListPage } from './pages/Sales/SalesListPage';
import { CustomersPage } from './pages/Sales/CustomersPage';
import { NewPurchasePage } from './pages/Purchases/NewPurchasePage';
import { PurchasesListPage } from './pages/Purchases/PurchasesListPage';
import { SuppliersPage } from './pages/Purchases/SuppliersPage';
import { EmployeesPage } from './pages/Staff/EmployeesPage';
import { AttendancePage } from './pages/Staff/AttendancePage';
import { HolidaysLeavesPage } from './pages/Staff/HolidaysLeavesPage';
import { SalaryPaymentsPage } from './pages/Staff/SalaryPaymentsPage';
import { VehiclesPage } from './pages/Vehicles/VehiclesPage';
import { FuelDieselPage } from './pages/Vehicles/FuelDieselPage';
import { VehicleExpensesPage } from './pages/Vehicles/VehicleExpensesPage';
import { IncomeExpensesPage } from './pages/Finance/IncomeExpensesPage';
import { ProfitLossPage } from './pages/Finance/ProfitLossPage';
import { CreditLedgerPage } from './pages/Finance/CreditLedgerPage';
import { WebsiteOverviewPage } from './pages/WebsiteCMS/WebsiteOverviewPage';
import { FeaturedProductsCMS } from './pages/WebsiteCMS/FeaturedProductsCMS';
import { HomepageContentCMS } from './pages/WebsiteCMS/HomepageContentCMS';
import { BannersCMS } from './pages/WebsiteCMS/BannersCMS';
import { AnnouncementsCMS } from './pages/WebsiteCMS/AnnouncementsCMS';
import { EnquiriesPage } from './pages/WebsiteCMS/EnquiriesPage';
import { ReportsHubPage } from './pages/Reports/ReportsHubPage';
import { ActivityLogPage } from './pages/System/ActivityLogPage';
import { SettingsPage } from './pages/System/SettingsPage';

const PageRouter: React.FC = () => {
  const { activePage } = useApp();

  const pages: Record<ActivePage, React.ReactNode> = {
    dashboard: <DashboardPage />,
    analytics: <AnalyticsPage />,
    products: <ProductsPage />,
    categories: <CategoriesPage />,
    brands: <BrandsPage />,
    stock: <ProductsPage />,
    'stock-movements': <StockMovementsPage />,
    'low-stock': <LowStockPage />,
    'new-sale': <NewSalePage />,
    sales: <SalesListPage />,
    customers: <CustomersPage />,
    'new-purchase': <NewPurchasePage />,
    purchases: <PurchasesListPage />,
    suppliers: <SuppliersPage />,
    employees: <EmployeesPage />,
    attendance: <AttendancePage />,
    'working-hours': <AttendancePage />,
    holidays: <HolidaysLeavesPage />,
    salary: <SalaryPaymentsPage />,
    vehicles: <VehiclesPage />,
    fuel: <FuelDieselPage />,
    'vehicle-expenses': <VehicleExpensesPage />,
    income: <IncomeExpensesPage defaultTab="income" />,
    expenses: <IncomeExpensesPage defaultTab="expenses" />,
    payments: <CreditLedgerPage />,
    'profit-loss': <ProfitLossPage />,
    'website-overview': <WebsiteOverviewPage />,
    'website-featured': <FeaturedProductsCMS />,
    'website-visibility': <FeaturedProductsCMS />,
    'website-homepage': <HomepageContentCMS />,
    'website-banners': <BannersCMS />,
    'website-announcements': <AnnouncementsCMS />,
    'website-enquiries': <EnquiriesPage />,
    reports: <ReportsHubPage />,
    'activity-log': <ActivityLogPage />,
    settings: <SettingsPage />,
  };

  return <>{pages[activePage] ?? <DashboardPage />}</>;
};

const AppContent: React.FC = () => {
  const { currentUser } = useApp();

  if (!currentUser) {
    return <Login />;
  }

  return (
    <AdminLayout>
      <PageRouter />
    </AdminLayout>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AppProvider>
  );
};

export default App;
