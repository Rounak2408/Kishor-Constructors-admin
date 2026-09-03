import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  IndianRupee,
  ShoppingBag,
  ShoppingCart,
  Boxes,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Layers,
  Truck,
  Users,
  Building2,
  Receipt,
  UserCheck,
  Fuel,
  ArrowRight,
  Plus,
  RefreshCw,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/ui/StatCard';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const DashboardPage: React.FC = () => {
  const {
    currentUser,
    dateFilter,
    setDateFilter,
    summaryMetrics,
    products,
    stockMovements,
    sales,
    purchases,
    customers,
    suppliers,
    employees,
    attendance,
    setActivePage,
    setQuickAddOpen,
    setQuickAddType,
  } = useApp();

  const [chartMetric, setChartMetric] = useState<'revenue' | 'grossProfit' | 'netProfit' | 'expenses'>('revenue');
  const [chartRange, setChartRange] = useState<'7D' | '30D' | '3M' | '6M' | '1Y'>('30D');

  // Sync dateFilter from top header with chartRange
  React.useEffect(() => {
    if (dateFilter === 'Today' || dateFilter === 'Yesterday' || dateFilter === 'This Week') {
      setChartRange('7D');
    } else if (dateFilter === 'This Month') {
      setChartRange('30D');
    } else if (dateFilter === 'This Year') {
      setChartRange('1Y');
    }
  }, [dateFilter]);

  // Dynamic KPI metrics based on active dateFilter
  const activeMetrics = useMemo(() => {
    switch (dateFilter) {
      case 'Yesterday':
        return {
          salesLabel: "Yesterday's Sales",
          salesValue: '₹1,81,800',
          salesTrend: '+62.3%',
          salesComp: 'vs 01 Sep',
          purchasesLabel: "Yesterday's Purchases",
          purchasesValue: '₹1,45,000',
          purchasesTrend: '2 Lots',
          purchasesComp: 'Tata TMT & ACC',
          grossProfitLabel: 'Gross Profit (Yesterday)',
          grossProfitValue: '₹13,950',
          grossProfitTrend: '7.7%',
          grossProfitComp: 'Gross margin',
          expensesLabel: "Yesterday's Expenses",
          expensesValue: '₹6,026',
          expensesTrend: 'Diesel / Fleet',
          expensesComp: 'Truck fuel log',
        };
      case 'This Week':
        return {
          salesLabel: "This Week's Sales",
          salesValue: '₹4,78,200',
          salesTrend: '+18.5%',
          salesComp: 'vs last week',
          purchasesLabel: "This Week's Purchases",
          purchasesValue: '₹3,85,000',
          purchasesTrend: '5 Lots',
          purchasesComp: 'Inward stock',
          grossProfitLabel: 'Gross Profit (Week)',
          grossProfitValue: '₹64,700',
          grossProfitTrend: '13.5%',
          grossProfitComp: 'Gross margin',
          expensesLabel: "This Week's Expenses",
          expensesValue: '₹1,45,091',
          expensesTrend: 'Salaries & Fuel',
          expensesComp: 'Staff payroll week',
        };
      case 'This Month':
        return {
          salesLabel: "This Month's Sales",
          salesValue: '₹24,80,000',
          salesTrend: '+24.8%',
          salesComp: 'vs last month',
          purchasesLabel: "This Month's Purchases",
          purchasesValue: '₹20,10,000',
          purchasesTrend: '18 POs',
          purchasesComp: 'Cement & TMT',
          grossProfitLabel: 'Gross Profit (Month)',
          grossProfitValue: '₹3,90,000',
          grossProfitTrend: '15.7%',
          grossProfitComp: 'Monthly margin',
          expensesLabel: "This Month's Expenses",
          expensesValue: '₹1,92,000',
          expensesTrend: 'Salaries/Ops',
          expensesComp: 'Monthly OPEX',
        };
      case 'This Year':
        return {
          salesLabel: "This Year's Sales",
          salesValue: '₹1.85 Crore',
          salesTrend: '+32.1%',
          salesComp: 'vs FY25',
          purchasesLabel: "This Year's Purchases",
          purchasesValue: '₹1.52 Crore',
          purchasesTrend: '142 Orders',
          purchasesComp: 'Annual inward',
          grossProfitLabel: 'Gross Profit (Year)',
          grossProfitValue: '₹28.90 Lakh',
          grossProfitTrend: '15.6%',
          grossProfitComp: 'Annual margin',
          expensesLabel: "This Year's Expenses",
          expensesValue: '₹14.20 Lakh',
          expensesTrend: 'Full OPEX',
          expensesComp: 'Annual expenses',
        };
      case 'Today':
      default:
        return {
          salesLabel: "Today's Sales",
          salesValue: `₹${summaryMetrics.todaySales.toLocaleString('en-IN')}`,
          salesTrend: '+12.4%',
          salesComp: 'vs yesterday',
          purchasesLabel: "Today's Purchases",
          purchasesValue: `₹${summaryMetrics.todayPurchases.toLocaleString('en-IN')}`,
          purchasesTrend: 'PO Cleared',
          purchasesComp: '1 lot received',
          grossProfitLabel: 'Gross Profit',
          grossProfitValue: `₹${summaryMetrics.todayGrossProfit.toLocaleString('en-IN')}`,
          grossProfitTrend: '12.9%',
          grossProfitComp: 'Gross margin',
          expensesLabel: "Today's Expenses",
          expensesValue: `₹${summaryMetrics.todayExpenses.toLocaleString('en-IN')}`,
          expensesTrend: 'Diesel / Ops',
          expensesComp: 'Vehicle fuel & loading',
        };
    }
  }, [dateFilter, summaryMetrics]);

  // Business Performance Trend Data
  const performanceData = useMemo(() => {
    if (chartRange === '7D') {
      return [
        { date: '28 Aug', revenue: 64000, cogs: 52000, grossProfit: 12000, expenses: 3200, netProfit: 8800 },
        { date: '29 Aug', revenue: 78000, cogs: 63000, grossProfit: 15000, expenses: 2500, netProfit: 12500 },
        { date: '30 Aug', revenue: 92000, cogs: 76000, grossProfit: 16000, expenses: 4100, netProfit: 11900 },
        { date: '31 Aug', revenue: 84000, cogs: 68000, grossProfit: 16000, expenses: 3900, netProfit: 12100 },
        { date: '01 Sep', revenue: 112000, cogs: 91000, grossProfit: 21000, expenses: 128000, netProfit: -107000 },
        { date: '02 Sep', revenue: 181800, cogs: 167850, grossProfit: 13950, expenses: 6026, netProfit: 7924 },
        { date: '03 Sep', revenue: 52300, cogs: 45550, grossProfit: 6750, expenses: 7065, netProfit: -315 },
      ];
    }
    if (chartRange === '3M') {
      return [
        { date: 'Jun W1', revenue: 420000, grossProfit: 78000, expenses: 45000, netProfit: 33000 },
        { date: 'Jun W3', revenue: 490000, grossProfit: 92000, expenses: 48000, netProfit: 44000 },
        { date: 'Jul W1', revenue: 540000, grossProfit: 104000, expenses: 52000, netProfit: 52000 },
        { date: 'Jul W3', revenue: 610000, grossProfit: 118000, expenses: 54000, netProfit: 64000 },
        { date: 'Aug W1', revenue: 680000, grossProfit: 132000, expenses: 165000, netProfit: -33000 },
        { date: 'Aug W3', revenue: 740000, grossProfit: 145000, expenses: 59000, netProfit: 86000 },
        { date: 'Sep Current', revenue: 234100, grossProfit: 20700, expenses: 135091, netProfit: -114391 },
      ];
    }
    if (chartRange === '6M') {
      return [
        { date: 'Apr 26', revenue: 1450000, grossProfit: 230000, expenses: 135000, netProfit: 95000 },
        { date: 'May 26', revenue: 1680000, grossProfit: 270000, expenses: 145000, netProfit: 125000 },
        { date: 'Jun 26', revenue: 1920000, grossProfit: 310000, expenses: 162000, netProfit: 148000 },
        { date: 'Jul 26', revenue: 2150000, grossProfit: 340000, expenses: 178000, netProfit: 162000 },
        { date: 'Aug 26', revenue: 2480000, grossProfit: 390000, expenses: 198000, netProfit: 192000 },
        { date: 'Sep 26', revenue: 320000, grossProfit: 48000, expenses: 142000, netProfit: -94000 },
      ];
    }
    if (chartRange === '1Y') {
      return [
        { date: 'Q3 FY25', revenue: 4200000, grossProfit: 640000, expenses: 380000, netProfit: 260000 },
        { date: 'Q4 FY25', revenue: 4850000, grossProfit: 730000, expenses: 410000, netProfit: 320000 },
        { date: 'Q1 FY26', revenue: 5050000, grossProfit: 810000, expenses: 442000, netProfit: 368000 },
        { date: 'Q2 FY26', revenue: 4400000, grossProfit: 710000, expenses: 518000, netProfit: 192000 },
      ];
    }
    // Default 30D
    return [
      { date: '05 Aug', revenue: 45000, grossProfit: 8500, expenses: 2200, netProfit: 6300 },
      { date: '10 Aug', revenue: 72000, grossProfit: 13500, expenses: 4100, netProfit: 9400 },
      { date: '15 Aug', revenue: 95000, grossProfit: 18000, expenses: 16500, netProfit: 1500 },
      { date: '20 Aug', revenue: 68000, grossProfit: 12800, expenses: 3800, netProfit: 9000 },
      { date: '25 Aug', revenue: 110000, grossProfit: 21500, expenses: 5400, netProfit: 16100 },
      { date: '30 Aug', revenue: 84000, grossProfit: 16000, expenses: 3900, netProfit: 12100 },
      { date: '01 Sep', revenue: 112000, grossProfit: 21000, expenses: 128000, netProfit: -107000 },
      { date: '03 Sep', revenue: 52300, grossProfit: 6750, expenses: 7065, netProfit: -315 },
    ];
  }, [chartRange]);

  // Payment method breakdown data
  const paymentBreakdown = [
    { name: 'UPI (QR / App)', value: 48, color: '#10B981' },
    { name: 'Direct Cash', value: 32, color: '#F5B700' },
    { name: 'Credit (Khata)', value: 20, color: '#3B82F6' },
  ];

  // Top selling products list
  const topProducts = [
    {
      name: 'UltraTech PPC Cement',
      category: 'Cement',
      units: '170 Bags',
      revenue: 66300,
      profit: 7650,
      trend: '+14%',
    },
    {
      name: 'Sone River Coarse Sand (Pili Ballu)',
      category: 'Ballu / Sand',
      units: '500 CFT (5 Brass)',
      revenue: 25500,
      profit: 4500,
      trend: '+22%',
    },
    {
      name: 'Tata Tiscon 550D TMT Rebars 12mm',
      category: 'Sariya / Steel TMT',
      units: '2.5 Tons',
      revenue: 174500,
      profit: 13250,
      trend: '+8%',
    },
    {
      name: 'ACC Gold Water Shield Cement',
      category: 'Cement',
      units: '100 Bags',
      revenue: 40000,
      profit: 4500,
      trend: '+11%',
    },
    {
      name: 'Red Clay Kiln Bricks (Class 1)',
      category: 'Bricks & AAC Blocks',
      units: '5,000 Pcs',
      revenue: 49000,
      profit: 8000,
      trend: '+5%',
    },
  ];

  // Low stock items
  const lowStockProducts = products.filter((p) => p.currentStock <= p.minimumStock);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Greetings */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-concrete-200 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-charcoal-900 tracking-tight">
              Good Morning, {currentUser?.name?.split(' ')[0] || 'Kishor'}
            </h1>
            <span className="text-[10px] font-extrabold bg-yellow-brand text-charcoal-950 px-2 py-0.5 rounded uppercase tracking-wider">
              {currentUser?.role || 'OWNER'} PORTAL
            </span>
            <Badge variant="blue" size="sm" className="hidden sm:inline-flex">
              Active: {dateFilter}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
            Showing performance & inventory summary for <strong className="text-charcoal-800">Kishor Construction ({dateFilter})</strong>.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="yellow"
            size="sm"
            onClick={() => setActivePage('new-sale')}
            icon={<ShoppingCart className="w-4 h-4" />}
          >
            + POS New Sale
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActivePage('new-purchase')}
            icon={<ShoppingBag className="w-4 h-4" />}
          >
            + New Purchase
          </Button>
        </div>
      </div>

      {/* Main KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          label={activeMetrics.salesLabel}
          value={activeMetrics.salesValue}
          trend="up"
          trendValue={activeMetrics.salesTrend}
          comparison={activeMetrics.salesComp}
          icon={<ShoppingCart className="w-4 h-4 text-emerald-700" />}
          onClick={() => setActivePage('sales')}
        />

        <StatCard
          label={activeMetrics.purchasesLabel}
          value={activeMetrics.purchasesValue}
          trend="neutral"
          trendValue={activeMetrics.purchasesTrend}
          comparison={activeMetrics.purchasesComp}
          icon={<ShoppingBag className="w-4 h-4 text-blue-700" />}
          onClick={() => setActivePage('purchases')}
        />

        <StatCard
          label={activeMetrics.grossProfitLabel}
          value={activeMetrics.grossProfitValue}
          trend="up"
          trendValue={activeMetrics.grossProfitTrend}
          comparison={activeMetrics.grossProfitComp}
          icon={<TrendingUp className="w-4 h-4 text-emerald-700" />}
          onClick={() => setActivePage('profit-loss')}
        />

        <StatCard
          label={activeMetrics.expensesLabel}
          value={activeMetrics.expensesValue}
          trend="neutral"
          trendValue={activeMetrics.expensesTrend}
          comparison={activeMetrics.expensesComp}
          icon={<Receipt className="w-4 h-4 text-rose-700" />}
          onClick={() => setActivePage('expenses')}
        />

        <StatCard
          label="Total Stock Value"
          value={`₹${(summaryMetrics.totalStockValue / 100000).toFixed(2)} Lakh`}
          trend="neutral"
          trendValue={`${products.length} SKU`}
          comparison="Yard inventory value"
          icon={<Boxes className="w-4 h-4 text-amber-700" />}
          accent
          onClick={() => setActivePage('products')}
        />

        <StatCard
          label="Receivables Due"
          value={`₹${(summaryMetrics.totalReceivables / 1000).toFixed(0)}k`}
          trend="down"
          trendValue="4 Parties"
          comparison="Customer khata dues"
          icon={<Users className="w-4 h-4 text-blue-700" />}
          onClick={() => setActivePage('customers')}
        />
      </div>

      {/* Middle Section: Business Performance Chart + Payment Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Large Business Performance Chart */}
        <Card className="lg:col-span-2">
          <CardHeader
            title={
              <div className="flex items-center gap-2">
                <span>Business Performance</span>
                <Badge variant="yellow" size="sm">
                  Accounting Compliant
                </Badge>
              </div>
            }
            subtitle="Revenue, Cost of Goods Sold & Net Profit Trend"
            action={
              <div className="flex items-center gap-2">
                {/* Metric toggle */}
                <div className="hidden sm:flex items-center bg-concrete-100 p-0.5 rounded-lg border border-concrete-200 text-xs font-semibold">
                  <button
                    onClick={() => setChartMetric('revenue')}
                    className={`px-2 py-1 rounded-md transition-colors ${
                      chartMetric === 'revenue' ? 'bg-white shadow-2xs text-charcoal-900' : 'text-charcoal-500'
                    }`}
                  >
                    Revenue
                  </button>
                  <button
                    onClick={() => setChartMetric('grossProfit')}
                    className={`px-2 py-1 rounded-md transition-colors ${
                      chartMetric === 'grossProfit' ? 'bg-white shadow-2xs text-charcoal-900' : 'text-charcoal-500'
                    }`}
                  >
                    Gross Profit
                  </button>
                  <button
                    onClick={() => setChartMetric('netProfit')}
                    className={`px-2 py-1 rounded-md transition-colors ${
                      chartMetric === 'netProfit' ? 'bg-white shadow-2xs text-charcoal-900' : 'text-charcoal-500'
                    }`}
                  >
                    Net Profit
                  </button>
                </div>

                {/* Range switcher */}
                <div className="flex items-center bg-concrete-100 p-0.5 rounded-lg border border-concrete-200 text-xs font-semibold">
                  {(['7D', '30D', '3M', '6M', '1Y'] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setChartRange(r)}
                      className={`px-2 py-1 rounded-md transition-colors ${
                        chartRange === r ? 'bg-charcoal-900 text-white' : 'text-charcoal-500 hover:text-charcoal-900'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            }
          />

          <CardContent className="pt-4">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={
                          chartMetric === 'revenue'
                            ? '#F5B700'
                            : chartMetric === 'grossProfit'
                            ? '#10B981'
                            : '#3B82F6'
                        }
                        stopOpacity={0.4}
                      />
                      <stop
                        offset="95%"
                        stopColor={
                          chartMetric === 'revenue'
                            ? '#F5B700'
                            : chartMetric === 'grossProfit'
                            ? '#10B981'
                            : '#3B82F6'
                        }
                        stopOpacity={0.0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8E7E1" vertical={false} />
                  <XAxis dataKey="date" stroke="#777777" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="#777777"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#171717',
                      borderColor: '#333333',
                      borderRadius: '8px',
                      color: '#FFFFFF',
                      fontSize: '12px',
                    }}
                    formatter={(val: number) => [`₹${val.toLocaleString('en-IN')}`, 'Amount']}
                  />
                  <Area
                    type="monotone"
                    dataKey={chartMetric}
                    stroke={
                      chartMetric === 'revenue'
                        ? '#D99B00'
                        : chartMetric === 'grossProfit'
                        ? '#059669'
                        : '#2563EB'
                    }
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorMetric)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-concrete-200 mt-2 text-center text-xs">
              <div className="p-2 rounded-lg bg-concrete-50">
                <p className="text-[10px] uppercase font-bold text-charcoal-500">Period Revenue</p>
                <p className="text-sm font-extrabold text-charcoal-900 mt-0.5">₹5.84 Lakh</p>
              </div>
              <div className="p-2 rounded-lg bg-concrete-50">
                <p className="text-[10px] uppercase font-bold text-charcoal-500">Gross Margin</p>
                <p className="text-sm font-extrabold text-emerald-700 mt-0.5">14.2%</p>
              </div>
              <div className="p-2 rounded-lg bg-concrete-50">
                <p className="text-[10px] uppercase font-bold text-charcoal-500">Avg Daily Sale</p>
                <p className="text-sm font-extrabold text-charcoal-900 mt-0.5">₹73,000</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods & Daily Counter Metrics */}
        <Card className="flex flex-col justify-between">
          <CardHeader
            title="Payment Method Breakdown"
            subtitle="Cash vs UPI vs Credit Collections"
          />
          <CardContent className="space-y-4">
            <div className="h-44 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {paymentBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: number) => [`${val}%`, 'Share']}
                    contentStyle={{
                      backgroundColor: '#171717',
                      borderColor: '#333333',
                      borderRadius: '8px',
                      color: '#FFFFFF',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2">
              {paymentBreakdown.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="font-semibold text-charcoal-800">{item.name}</span>
                  </div>
                  <span className="font-mono font-bold text-charcoal-900">{item.value}%</span>
                </div>
              ))}
            </div>

            <div className="p-3 bg-concrete-100 rounded-xl border border-concrete-200 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-charcoal-600">Total Customer Receivables:</span>
                <span className="font-bold text-charcoal-950">
                  ₹{summaryMetrics.totalReceivables.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-600">Supplier Payables Balance:</span>
                <span className="font-bold text-rose-700">
                  ₹{summaryMetrics.totalPayables.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lower Section: Top Selling Products & Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Selling Products */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Top Selling Materials & Fast Movers"
            subtitle="Ranked by sales volume & gross contribution"
            action={
              <button
                onClick={() => setActivePage('products')}
                className="text-xs font-bold text-charcoal-700 hover:text-charcoal-950 flex items-center gap-1 hover:underline"
              >
                View Inventory <ArrowRight className="w-3.5 h-3.5" />
              </button>
            }
          />
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-concrete-200 bg-concrete-50/70 text-charcoal-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="px-5 py-3">Product Name</th>
                  <th className="px-3 py-3">Category</th>
                  <th className="px-3 py-3 text-right">Units Sold</th>
                  <th className="px-3 py-3 text-right">Revenue</th>
                  <th className="px-3 py-3 text-right">Gross Profit</th>
                  <th className="px-4 py-3 text-center">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-concrete-200">
                {topProducts.map((p) => (
                  <tr key={p.name} className="hover:bg-concrete-50/60 transition-colors">
                    <td className="px-5 py-3 font-semibold text-charcoal-900">{p.name}</td>
                    <td className="px-3 py-3 text-charcoal-600">{p.category}</td>
                    <td className="px-3 py-3 text-right font-medium text-charcoal-700">{p.units}</td>
                    <td className="px-3 py-3 text-right font-bold text-charcoal-900">
                      ₹{p.revenue.toLocaleString('en-IN')}
                    </td>
                    <td className="px-3 py-3 text-right font-bold text-emerald-700">
                      +₹{p.profit.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
                        {p.trend}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Low Stock Alerts & Quick Action */}
        <Card>
          <CardHeader
            title={
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Low Stock Watchlist</span>
              </div>
            }
            subtitle={`${lowStockProducts.length} items below minimum threshold`}
            action={
              <button
                onClick={() => setActivePage('low-stock')}
                className="text-xs font-bold text-charcoal-700 hover:underline"
              >
                See All
              </button>
            }
          />
          <CardContent className="space-y-3">
            {lowStockProducts.length === 0 ? (
              <div className="p-6 text-center text-xs text-charcoal-500">
                All inventory items are currently at healthy stock levels.
              </div>
            ) : (
              lowStockProducts.slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  className="p-3 bg-concrete-50 rounded-xl border border-concrete-200 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-charcoal-900 truncate">{p.name}</p>
                    <p className="text-[11px] text-rose-700 font-semibold mt-0.5">
                      Stock: <span className="font-bold">{p.currentStock} {p.unit}</span> (Min: {p.minimumStock})
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActivePage('new-purchase')}
                    className="text-[11px] py-1 px-2.5 border-rose-300 text-rose-900 hover:bg-rose-50 flex-shrink-0"
                  >
                    Restock PO
                  </Button>
                </div>
              ))
            )}

            <div className="pt-2 border-t border-concrete-200 flex items-center justify-between text-xs">
              <span className="text-charcoal-500 font-medium">Yard Space Capacity</span>
              <span className="font-bold text-charcoal-800">76% Utilized</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section: Traceable Stock Movements & Staff / Fleet Quick Glance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Stock Movements */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Recent Traceable Stock Movements"
            subtitle="Real-time audit log of purchases, customer dispatches & adjustments"
            action={
              <button
                onClick={() => setActivePage('stock-movements')}
                className="text-xs font-bold text-charcoal-700 hover:underline flex items-center gap-1"
              >
                Movement Ledger <ArrowRight className="w-3.5 h-3.5" />
              </button>
            }
          />
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-concrete-200 bg-concrete-50/70 text-charcoal-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="px-5 py-3">Date & Time</th>
                  <th className="px-3 py-3">Product</th>
                  <th className="px-3 py-3">Movement Type</th>
                  <th className="px-3 py-3 text-right">Quantity</th>
                  <th className="px-3 py-3 text-right">New Stock</th>
                  <th className="px-4 py-3">Reference / Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-concrete-200">
                {stockMovements.slice(0, 5).map((m) => (
                  <tr key={m.id} className="hover:bg-concrete-50/60 transition-colors">
                    <td className="px-5 py-3 text-charcoal-500 whitespace-nowrap">{m.date}</td>
                    <td className="px-3 py-3 font-semibold text-charcoal-900">{m.productName}</td>
                    <td className="px-3 py-3">
                      <span
                        className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded ${
                          m.type === 'PURCHASE'
                            ? 'bg-blue-50 text-blue-800 border border-blue-200'
                            : m.type === 'SALE'
                            ? 'bg-amber-50 text-amber-900 border border-amber-200'
                            : 'bg-concrete-100 text-charcoal-800 border border-concrete-300'
                        }`}
                      >
                        {m.type}
                      </span>
                    </td>
                    <td
                      className={`px-3 py-3 text-right font-bold ${
                        m.quantity > 0 ? 'text-emerald-700' : 'text-charcoal-900'
                      }`}
                    >
                      {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
                    </td>
                    <td className="px-3 py-3 text-right font-mono font-medium text-charcoal-700">
                      {m.newStock}
                    </td>
                    <td className="px-4 py-3 text-charcoal-500 truncate max-w-xs">{m.referenceId} ({m.notes})</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Staff & Fleet Quick Overview */}
        <Card className="flex flex-col justify-between">
          <CardHeader
            title="Operations & Fleet Pulse"
            subtitle="Yard staff attendance & commercial vehicles"
          />
          <CardContent className="space-y-4">
            {/* Staff Attendance Pulse */}
            <div className="p-3.5 bg-concrete-50 rounded-xl border border-concrete-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-charcoal-900 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  Staff Present Today
                </span>
                <span className="font-extrabold text-charcoal-950">
                  {summaryMetrics.presentStaffCount} / {summaryMetrics.totalStaffCount} Active
                </span>
              </div>
              <div className="w-full bg-concrete-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{
                    width: `${(summaryMetrics.presentStaffCount / (summaryMetrics.totalStaffCount || 1)) * 100}%`,
                  }}
                />
              </div>
              <p className="text-[11px] text-charcoal-500">
                Supervisors, drivers & loaders currently clocked in at yard.
              </p>
            </div>

            {/* Vehicle Fleet Status */}
            <div className="p-3.5 bg-concrete-50 rounded-xl border border-concrete-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-charcoal-900 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-yellow-dark" />
                  Fleet Dispatch
                </span>
                <span className="font-extrabold text-charcoal-950">4 Vehicles Operating</span>
              </div>
              <div className="flex items-center justify-between text-xs text-charcoal-600 pt-1">
                <span>Tata Signa Tipper (10W)</span>
                <span className="text-emerald-700 font-bold">On Route (Danapur)</span>
              </div>
              <div className="flex items-center justify-between text-xs text-charcoal-600">
                <span>Mahindra Bolero Pickup</span>
                <span className="text-emerald-700 font-bold">In Yard (Ready)</span>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setActivePage('fuel')}
              className="w-full text-xs"
              icon={<Fuel className="w-3.5 h-3.5 text-yellow-dark" />}
            >
              View Diesel Consumption Logs
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
