import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  BarChart3,
  PieChart as PieIcon,
  IndianRupee,
  Layers,
  Truck,
  Users,
  Boxes,
  Calendar,
  Download,
  AlertCircle,
  Percent,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/ui/StatCard';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const AnalyticsPage: React.FC = () => {
  const { summaryMetrics, products, employees, vehicles, expenses, dateFilter } = useApp();
  const [timeRange, setTimeRange] = useState<'7D' | '30D' | '3M' | '6M' | '1Y'>('30D');

  // Sync dateFilter from top header with timeRange
  React.useEffect(() => {
    if (dateFilter === 'Today' || dateFilter === 'Yesterday' || dateFilter === 'This Week') {
      setTimeRange('7D');
    } else if (dateFilter === 'This Month') {
      setTimeRange('30D');
    } else if (dateFilter === 'This Year') {
      setTimeRange('1Y');
    }
  }, [dateFilter]);

  // Dynamic Monthly / Period Trends based on timeRange
  const trendData = useMemo(() => {
    switch (timeRange) {
      case '7D':
        return [
          { month: '28 Aug', revenue: 64000, cogs: 52000, grossProfit: 12000, netProfit: 8800 },
          { month: '29 Aug', revenue: 78000, cogs: 63000, grossProfit: 15000, netProfit: 12500 },
          { month: '30 Aug', revenue: 92000, cogs: 76000, grossProfit: 16000, netProfit: 11900 },
          { month: '31 Aug', revenue: 84000, cogs: 68000, grossProfit: 16000, netProfit: 12100 },
          { month: '01 Sep', revenue: 112000, cogs: 91000, grossProfit: 21000, netProfit: -107000 },
          { month: '02 Sep', revenue: 181800, cogs: 167850, grossProfit: 13950, netProfit: 7924 },
          { month: '03 Sep', revenue: 52300, cogs: 45550, grossProfit: 6750, netProfit: -315 },
        ];
      case '3M':
        return [
          { month: 'Jun W1', revenue: 420000, cogs: 342000, grossProfit: 78000, netProfit: 33000 },
          { month: 'Jun W3', revenue: 490000, cogs: 398000, grossProfit: 92000, netProfit: 44000 },
          { month: 'Jul W1', revenue: 540000, cogs: 436000, grossProfit: 104000, netProfit: 52000 },
          { month: 'Jul W3', revenue: 610000, cogs: 492000, grossProfit: 118000, netProfit: 64000 },
          { month: 'Aug W1', revenue: 680000, cogs: 548000, grossProfit: 132000, netProfit: -33000 },
          { month: 'Aug W3', revenue: 740000, cogs: 595000, grossProfit: 145000, netProfit: 86000 },
          { month: 'Sep (MTD)', revenue: 234100, cogs: 213400, grossProfit: 20700, netProfit: -114391 },
        ];
      case '6M':
        return [
          { month: 'Apr 2026', revenue: 1450000, cogs: 1220000, grossProfit: 230000, netProfit: 95000 },
          { month: 'May 2026', revenue: 1680000, cogs: 1410000, grossProfit: 270000, netProfit: 125000 },
          { month: 'Jun 2026', revenue: 1920000, cogs: 1610000, grossProfit: 310000, netProfit: 148000 },
          { month: 'Jul 2026', revenue: 2150000, cogs: 1810000, grossProfit: 340000, netProfit: 162000 },
          { month: 'Aug 2026', revenue: 2480000, cogs: 2090000, grossProfit: 390000, netProfit: 192000 },
          { month: 'Sep (MTD)', revenue: 320000, cogs: 272000, grossProfit: 48000, netProfit: 22000 },
        ];
      case '1Y':
        return [
          { month: 'Q3 FY25', revenue: 4200000, cogs: 3560000, grossProfit: 640000, netProfit: 260000 },
          { month: 'Q4 FY25', revenue: 4850000, cogs: 4120000, grossProfit: 730000, netProfit: 320000 },
          { month: 'Q1 FY26', revenue: 5050000, cogs: 4240000, grossProfit: 810000, netProfit: 368000 },
          { month: 'Q2 FY26', revenue: 4400000, cogs: 3690000, grossProfit: 710000, netProfit: 192000 },
        ];
      case '30D':
      default:
        return [
          { month: '05 Aug', revenue: 45000, cogs: 36500, grossProfit: 8500, netProfit: 6300 },
          { month: '10 Aug', revenue: 72000, cogs: 58500, grossProfit: 13500, netProfit: 9400 },
          { month: '15 Aug', revenue: 95000, cogs: 77000, grossProfit: 18000, netProfit: 1500 },
          { month: '20 Aug', revenue: 68000, cogs: 55200, grossProfit: 12800, netProfit: 9000 },
          { month: '25 Aug', revenue: 110000, cogs: 88500, grossProfit: 21500, netProfit: 16100 },
          { month: '30 Aug', revenue: 84000, cogs: 68000, grossProfit: 16000, netProfit: 12100 },
          { month: '01 Sep', revenue: 112000, cogs: 91000, grossProfit: 21000, netProfit: -107000 },
          { month: '03 Sep', revenue: 52300, cogs: 45550, grossProfit: 6750, netProfit: -315 },
        ];
    }
  }, [timeRange]);

  // Dynamic KPI Metrics per time range
  const dynamicKpis = useMemo(() => {
    switch (timeRange) {
      case '7D':
        return {
          revenue: '₹4.78 Lakh',
          revenueTrend: '+18.5%',
          revenueComp: 'vs previous 7 days',
          grossProfit: '₹64.7k',
          grossMargin: '13.5%',
          netProfit: '₹42.5k',
          netMargin: '8.8%',
          dailyBilling: '₹68,300',
          dailyTrend: '28 Txns/Day',
        };
      case '3M':
        return {
          revenue: '₹65.5 Lakh',
          revenueTrend: '+22.4%',
          revenueComp: 'vs previous quarter',
          grossProfit: '₹10.4 Lakh',
          grossMargin: '15.8%',
          netProfit: '₹5.2 Lakh',
          netMargin: '7.9%',
          dailyBilling: '₹72,700',
          dailyTrend: '31 Txns/Day',
        };
      case '6M':
        return {
          revenue: '₹1.00 Crore',
          revenueTrend: '+28.1%',
          revenueComp: 'H1 Performance',
          grossProfit: '₹15.9 Lakh',
          grossMargin: '15.9%',
          netProfit: '₹7.4 Lakh',
          netMargin: '7.4%',
          dailyBilling: '₹55,500',
          dailyTrend: '26 Txns/Day',
        };
      case '1Y':
        return {
          revenue: '₹1.85 Crore',
          revenueTrend: '+32.1%',
          revenueComp: 'vs FY25 Annual',
          grossProfit: '₹28.9 Lakh',
          grossMargin: '15.6%',
          netProfit: '₹14.2 Lakh',
          netMargin: '7.6%',
          dailyBilling: '₹51,300',
          dailyTrend: '24 Txns/Day',
        };
      case '30D':
      default:
        return {
          revenue: '₹24.8 Lakh',
          revenueTrend: '+15.3%',
          revenueComp: 'vs prior month',
          grossProfit: '₹3.90 Lakh',
          grossMargin: '15.7%',
          netProfit: '₹1.92 Lakh',
          netMargin: '7.7%',
          dailyBilling: '₹82,600',
          dailyTrend: '34 Txns/Day',
        };
    }
  }, [timeRange]);

  // Category Revenue Share
  const categoryShare = [
    { name: 'Cement (UltraTech / ACC / Ambuja)', value: 42, color: '#F5B700' },
    { name: 'Sariya / Steel TMT (Tata Tiscon)', value: 28, color: '#3B82F6' },
    { name: 'Ballu / Sand (Sone River)', value: 16, color: '#10B981' },
    { name: 'Chhar / Gitti / Aggregates', value: 8, color: '#8B5CF6' },
    { name: 'Bricks & Waterproofing', value: 6, color: '#F97316' },
  ];

  // Expense Distribution Data
  const expenseBreakdown = [
    { name: 'Staff Salaries', value: 121020, percentage: '68%' },
    { name: 'Diesel / Fleet Fuel', value: 28500, percentage: '16%' },
    { name: 'Vehicle Servicing & Tyres', value: 14500, percentage: '8%' },
    { name: 'Yard Electricity & Water', value: 6450, percentage: '4%' },
    { name: 'Office / Logistics Admin', value: 7200, percentage: '4%' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-concrete-200 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-charcoal-900 tracking-tight">
              Business Intelligence & Analytics
            </h1>
            <Badge variant="yellow" size="sm">
              Period: {timeRange}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
            Financial, inventory turnover, fleet cost & operational metrics for Kishor Construction ({timeRange}).
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Time range pills */}
          <div className="flex items-center bg-concrete-100 p-0.5 rounded-lg border border-concrete-200 text-xs font-semibold">
            {(['7D', '30D', '3M', '6M', '1Y'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  timeRange === r ? 'bg-charcoal-900 text-white shadow-2xs' : 'text-charcoal-500 hover:text-charcoal-900'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 1. REVENUE & PROFITABILITY KPI CARDS */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-charcoal-500 mb-3">
          1. Revenue & Profitability Breakdown ({timeRange})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Gross Revenue"
            value={dynamicKpis.revenue}
            trend="up"
            trendValue={dynamicKpis.revenueTrend}
            comparison={dynamicKpis.revenueComp}
            icon={<IndianRupee className="w-4 h-4 text-emerald-700" />}
          />
          <StatCard
            label="Gross Profit (Revenue - COGS)"
            value={dynamicKpis.grossProfit}
            trend="up"
            trendValue={dynamicKpis.grossMargin}
            comparison="Gross Margin %"
            icon={<TrendingUp className="w-4 h-4 text-emerald-700" />}
          />
          <StatCard
            label="Net Profit (After All Expenses)"
            value={dynamicKpis.netProfit}
            trend="up"
            trendValue={dynamicKpis.netMargin}
            comparison="Net Profit Margin"
            icon={<Percent className="w-4 h-4 text-blue-700" />}
            accent
          />
          <StatCard
            label="Average Daily Billing"
            value={dynamicKpis.dailyBilling}
            trend="up"
            trendValue={dynamicKpis.dailyTrend}
            comparison="Counter + Site delivery"
            icon={<BarChart3 className="w-4 h-4 text-amber-700" />}
          />
        </div>
      </div>

      {/* Monthly Trends Chart */}
      <Card>
        <CardHeader
          title="Revenue vs COGS vs Net Profit Over Time"
          subtitle="Accurate Cost of Goods Sold accounting tracking margin expansion"
        />
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E7E1" vertical={false} />
                <XAxis dataKey="month" stroke="#777777" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#777777"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`}
                />
                <Tooltip
                  formatter={(val: number) => [`₹${val.toLocaleString('en-IN')}`, '']}
                  contentStyle={{
                    backgroundColor: '#171717',
                    borderColor: '#333333',
                    borderRadius: '8px',
                    color: '#FFFFFF',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="revenue" name="Gross Revenue" fill="#F5B700" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cogs" name="COGS (Material Cost)" fill="#D4D4D4" radius={[4, 4, 0, 0]} />
                <Bar dataKey="grossProfit" name="Gross Profit" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="netProfit" name="Net Profit" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 2. CATEGORY SHARE & EXPENSE DISTRIBUTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Share */}
        <Card>
          <CardHeader
            title="Revenue Share by Material Category"
            subtitle="Cement & Steel make up 70% of total wholesale volume"
          />
          <CardContent className="space-y-4">
            <div className="h-56 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryShare}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryShare.map((entry, index) => (
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
              {categoryShare.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="font-semibold text-charcoal-800">{item.name}</span>
                  </div>
                  <span className="font-bold text-charcoal-950">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Operating Expenses Breakdown */}
        <Card>
          <CardHeader
            title="Operating Expenses Distribution"
            subtitle="Total monthly operating overheads: ₹1,77,670"
          />
          <CardContent className="space-y-3">
            {expenseBreakdown.map((exp) => (
              <div
                key={exp.name}
                className="p-3 bg-concrete-50 rounded-xl border border-concrete-200 flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-bold text-charcoal-900">{exp.name}</p>
                  <p className="text-[11px] text-charcoal-500 font-medium">{exp.percentage} of total operating overhead</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-extrabold text-charcoal-900">₹{exp.value.toLocaleString('en-IN')}</p>
                </div>
              </div>
            ))}

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center gap-2.5 text-xs text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0" />
              <span>Diesel and Staff payroll form 84% of overheads. Fuel efficiency directly drives net profitability.</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. INVENTORY & FLEET EFFICIENCY METRICS */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-charcoal-500 mb-3">
          2. Inventory Turnover & Fleet Logistics Efficiency
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 space-y-1.5">
            <span className="text-[11px] font-bold text-charcoal-500 uppercase tracking-wider">Inventory Turnover</span>
            <div className="text-2xl font-extrabold text-charcoal-900">4.8x / Year</div>
            <p className="text-xs text-emerald-700 font-semibold">Fast moving cement stock turns every 6 days</p>
          </Card>

          <Card className="p-4 space-y-1.5">
            <span className="text-[11px] font-bold text-charcoal-500 uppercase tracking-wider">Dead / Slow Stock</span>
            <div className="text-2xl font-extrabold text-charcoal-900">₹42,000 (1.8%)</div>
            <p className="text-xs text-charcoal-500">Pipes & specialty chemicals aging &gt; 60 days</p>
          </Card>

          <Card className="p-4 space-y-1.5">
            <span className="text-[11px] font-bold text-charcoal-500 uppercase tracking-wider">Fleet Diesel Cost / KM</span>
            <div className="text-2xl font-extrabold text-charcoal-900">₹24.80 / KM</div>
            <p className="text-xs text-charcoal-500">Across 10W Tipper, Pickup & Tractor runs</p>
          </Card>

          <Card className="p-4 space-y-1.5">
            <span className="text-[11px] font-bold text-charcoal-500 uppercase tracking-wider">Staff Attendance Rate</span>
            <div className="text-2xl font-extrabold text-emerald-700">96.2%</div>
            <p className="text-xs text-charcoal-500">Average 9.6 hrs/day across 6 permanent staff</p>
          </Card>
        </div>
      </div>
    </div>
  );
};
