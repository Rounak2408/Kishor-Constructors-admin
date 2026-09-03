import React, { useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  IndianRupee,
  Printer,
  Calendar,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { StatCard } from '../../components/ui/StatCard';

export const ProfitLossPage: React.FC = () => {
  const { sales, purchases, expenses, incomes, fuelEntries, salaryPayments, vehicleExpenses } = useApp();

  // ─── Revenue Calculations ───
  const grossRevenue = useMemo(
    () => sales.reduce((acc, s) => acc + s.totalAmount, 0),
    [sales]
  );

  // COGS: Sum of (quantity × purchasePrice) for every sold line item
  const cogs = useMemo(
    () =>
      sales.reduce(
        (acc, s) =>
          acc +
          s.items.reduce(
            (itemAcc, item) => itemAcc + item.quantity * item.purchasePrice,
            0
          ),
        0
      ),
    [sales]
  );

  const grossProfit = grossRevenue - cogs;
  const grossMarginPct = grossRevenue > 0 ? ((grossProfit / grossRevenue) * 100).toFixed(1) : '0.0';

  // ─── Operating Expense Breakdown ───
  const dieselExpenses = useMemo(
    () => fuelEntries.reduce((acc, f) => acc + f.totalCost, 0),
    [fuelEntries]
  );
  const salaryExpenses = useMemo(
    () => salaryPayments.reduce((acc, s) => acc + s.finalPay, 0),
    [salaryPayments]
  );
  const vehicleMaintenanceExpenses = useMemo(
    () => vehicleExpenses.reduce((acc, v) => acc + v.amount, 0),
    [vehicleExpenses]
  );
  const otherOperatingExpenses = useMemo(
    () =>
      expenses
        .filter((e) => !['Diesel', 'Salary'].includes(e.category))
        .reduce((acc, e) => acc + e.amount, 0),
    [expenses]
  );

  const totalOperatingExpenses =
    dieselExpenses + salaryExpenses + vehicleMaintenanceExpenses + otherOperatingExpenses;

  const netProfit = grossProfit - totalOperatingExpenses;
  const netMarginPct = grossRevenue > 0 ? ((netProfit / grossRevenue) * 100).toFixed(1) : '0.0';

  // ─── Other Income ───
  const otherIncome = useMemo(
    () => incomes.reduce((acc, i) => acc + i.amount, 0),
    [incomes]
  );

  const netProfitAfterOtherIncome = netProfit + otherIncome;

  const fmtINR = (val: number) => `₹${Math.abs(val).toLocaleString('en-IN')}`;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-concrete-200 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-charcoal-900 tracking-tight">
              Profit & Loss Financial Statement
            </h1>
            <Badge variant="yellow" size="sm">
              FY 2026-27
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
            KISHOR CONSTRUCTION — Income Statement conforming to Revenue − COGS = Gross Profit; Gross Profit − OPEX = Net Profit
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => window.print()}
          icon={<Printer className="w-4 h-4" />}
        >
          Print Statement
        </Button>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Gross Revenue"
          value={fmtINR(grossRevenue)}
          trend="up"
          trendValue="Total Invoiced"
          comparison="All confirmed sales"
          icon={<IndianRupee className="w-4 h-4 text-emerald-700" />}
        />
        <StatCard
          label="Cost of Goods Sold"
          value={fmtINR(cogs)}
          trend="neutral"
          trendValue="Material Cost"
          comparison="Purchase price × qty sold"
          icon={<BarChart3 className="w-4 h-4 text-rose-700" />}
        />
        <StatCard
          label="Gross Profit"
          value={fmtINR(grossProfit)}
          trend={grossProfit >= 0 ? 'up' : 'down'}
          trendValue={`${grossMarginPct}% Margin`}
          comparison="Revenue minus COGS"
          icon={<TrendingUp className="w-4 h-4 text-emerald-700" />}
        />
        <StatCard
          label="Net Profit / (Loss)"
          value={`${netProfitAfterOtherIncome >= 0 ? '' : '('}${fmtINR(netProfitAfterOtherIncome)}${netProfitAfterOtherIncome < 0 ? ')' : ''}`}
          trend={netProfitAfterOtherIncome >= 0 ? 'up' : 'down'}
          trendValue={`${netMarginPct}% Net Margin`}
          comparison="After all expenses & income"
          icon={
            netProfitAfterOtherIncome >= 0 ? (
              <ArrowUpRight className="w-4 h-4 text-emerald-700" />
            ) : (
              <ArrowDownRight className="w-4 h-4 text-rose-700" />
            )
          }
        />
      </div>

      {/* Financial Statement Table */}
      <Card className="print-only">
        <CardHeader
          title="Detailed Income Statement"
          subtitle="KISHOR CONSTRUCTION — Period: Current Financial Year"
        />
        <CardContent>
          <div className="border border-concrete-200 rounded-xl overflow-hidden">
            {/* Revenue Section */}
            <div className="bg-emerald-50/50 border-b border-concrete-200">
              <div className="px-6 py-3 flex items-center justify-between">
                <span className="text-xs font-extrabold text-emerald-900 uppercase tracking-wider">
                  A. GROSS REVENUE
                </span>
                <span className="text-sm font-extrabold text-emerald-900 font-mono">
                  {fmtINR(grossRevenue)}
                </span>
              </div>
              <div className="px-6 pb-3">
                <div className="flex justify-between text-xs text-charcoal-700 py-1.5 border-b border-concrete-100">
                  <span className="pl-4">Product Sales (Building Materials)</span>
                  <span className="font-mono font-semibold">{fmtINR(grossRevenue)}</span>
                </div>
              </div>
            </div>

            {/* COGS Section */}
            <div className="bg-rose-50/40 border-b border-concrete-200">
              <div className="px-6 py-3 flex items-center justify-between">
                <span className="text-xs font-extrabold text-rose-900 uppercase tracking-wider">
                  B. COST OF GOODS SOLD (COGS)
                </span>
                <span className="text-sm font-extrabold text-rose-900 font-mono">
                  ({fmtINR(cogs)})
                </span>
              </div>
              <div className="px-6 pb-3">
                <div className="flex justify-between text-xs text-charcoal-700 py-1.5 border-b border-concrete-100">
                  <span className="pl-4">Direct Material Cost (Purchase Price × Quantity Sold)</span>
                  <span className="font-mono font-semibold">{fmtINR(cogs)}</span>
                </div>
              </div>
            </div>

            {/* Gross Profit */}
            <div className="bg-charcoal-50 border-b-2 border-charcoal-300">
              <div className="px-6 py-3.5 flex items-center justify-between">
                <span className="text-xs font-extrabold text-charcoal-950 uppercase tracking-wider">
                  C. GROSS PROFIT (A − B)
                </span>
                <div className="text-right">
                  <span className={`text-base font-extrabold font-mono ${grossProfit >= 0 ? 'text-emerald-800' : 'text-rose-800'}`}>
                    {grossProfit >= 0 ? fmtINR(grossProfit) : `(${fmtINR(grossProfit)})`}
                  </span>
                  <span className="block text-[10px] font-bold text-charcoal-500 mt-0.5">
                    Gross Margin: {grossMarginPct}%
                  </span>
                </div>
              </div>
            </div>

            {/* Operating Expenses */}
            <div className="bg-white border-b border-concrete-200">
              <div className="px-6 py-3 flex items-center justify-between border-b border-concrete-100">
                <span className="text-xs font-extrabold text-charcoal-800 uppercase tracking-wider">
                  D. OPERATING EXPENSES (OPEX)
                </span>
                <span className="text-sm font-extrabold text-rose-800 font-mono">
                  ({fmtINR(totalOperatingExpenses)})
                </span>
              </div>
              <div className="px-6 py-2 space-y-0.5">
                {[
                  { label: 'Staff Salaries & Wages', value: salaryExpenses },
                  { label: 'Diesel & Fleet Fuel', value: dieselExpenses },
                  { label: 'Vehicle Maintenance & Repairs', value: vehicleMaintenanceExpenses },
                  { label: 'Electricity, Rent & Admin', value: otherOperatingExpenses },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex justify-between text-xs text-charcoal-700 py-1.5 border-b border-concrete-50"
                  >
                    <span className="pl-4">{item.label}</span>
                    <span className="font-mono font-semibold text-rose-700">{fmtINR(item.value)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Net Operating Profit */}
            <div className="bg-charcoal-50 border-b border-concrete-200">
              <div className="px-6 py-3.5 flex items-center justify-between">
                <span className="text-xs font-extrabold text-charcoal-950 uppercase tracking-wider">
                  E. NET OPERATING PROFIT (C − D)
                </span>
                <span className={`text-base font-extrabold font-mono ${netProfit >= 0 ? 'text-emerald-800' : 'text-rose-800'}`}>
                  {netProfit >= 0 ? fmtINR(netProfit) : `(${fmtINR(netProfit)})`}
                </span>
              </div>
            </div>

            {/* Other Income */}
            <div className="bg-emerald-50/30 border-b border-concrete-200">
              <div className="px-6 py-3 flex items-center justify-between">
                <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider">
                  F. OTHER INCOME
                </span>
                <span className="text-sm font-extrabold text-emerald-800 font-mono">
                  +{fmtINR(otherIncome)}
                </span>
              </div>
              <div className="px-6 pb-3">
                <div className="flex justify-between text-xs text-charcoal-700 py-1.5">
                  <span className="pl-4">Freight Charges, Scrap Sales, Site Consulting</span>
                  <span className="font-mono font-semibold">{fmtINR(otherIncome)}</span>
                </div>
              </div>
            </div>

            {/* Final Net Profit */}
            <div className={`${netProfitAfterOtherIncome >= 0 ? 'bg-emerald-100/60' : 'bg-rose-100/60'}`}>
              <div className="px-6 py-4 flex items-center justify-between">
                <span className="text-sm font-extrabold text-charcoal-950 uppercase tracking-wider">
                  G. NET PROFIT AFTER OTHER INCOME (E + F)
                </span>
                <div className="text-right">
                  <span
                    className={`text-xl font-extrabold font-mono ${
                      netProfitAfterOtherIncome >= 0 ? 'text-emerald-900' : 'text-rose-900'
                    }`}
                  >
                    {netProfitAfterOtherIncome >= 0
                      ? fmtINR(netProfitAfterOtherIncome)
                      : `(${fmtINR(netProfitAfterOtherIncome)})`}
                  </span>
                  <span className="block text-[11px] font-bold text-charcoal-600 mt-0.5">
                    Net Margin: {netMarginPct}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Compliance Note */}
          <div className="mt-4 p-3 bg-concrete-50 rounded-lg border border-concrete-200 text-[11px] text-charcoal-500">
            <strong className="text-charcoal-700">Accounting Note:</strong> COGS is calculated as Purchase Price × Quantity Sold (not total purchases).
            This ensures accurate gross profit computation per unit economics, not bulk procurement cost.
            Operating expenses include staff salaries, diesel fuel, vehicle maintenance, electricity, rent and administrative costs.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
