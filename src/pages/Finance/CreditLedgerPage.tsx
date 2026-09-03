import React, { useMemo } from 'react';
import { CreditCard, Users, Building2, IndianRupee, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { StatCard } from '../../components/ui/StatCard';

export const CreditLedgerPage: React.FC = () => {
  const { customers, suppliers, summaryMetrics } = useApp();

  const overdueCustomers = useMemo(
    () => customers.filter((c) => c.totalDue > 0).sort((a, b) => b.totalDue - a.totalDue),
    [customers]
  );

  const dueSuppliers = useMemo(
    () => suppliers.filter((s) => s.totalDue > 0).sort((a, b) => b.totalDue - a.totalDue),
    [suppliers]
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-concrete-200 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-charcoal-900 tracking-tight">
              Credit & Payments Ledger
            </h1>
            <Badge variant="yellow" size="sm">
              Receivables & Payables
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
            Track customer credit dues (receivables) and supplier outstanding bills (payables).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          label="Total Receivables"
          value={`₹${summaryMetrics.totalReceivables.toLocaleString('en-IN')}`}
          trend="up"
          trendValue="Customer Credit"
          comparison={`${overdueCustomers.length} accounts with dues`}
          icon={<Users className="w-4 h-4 text-emerald-700" />}
        />
        <StatCard
          label="Total Payables"
          value={`₹${summaryMetrics.totalPayables.toLocaleString('en-IN')}`}
          trend="down"
          trendValue="Supplier Bills"
          comparison={`${dueSuppliers.length} suppliers pending`}
          icon={<Building2 className="w-4 h-4 text-rose-700" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Customer Receivables" subtitle="Outstanding sales credit / partial payments" />
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-concrete-200 text-charcoal-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="pb-2">Customer</th>
                    <th className="pb-2 text-right">Due Amount</th>
                    <th className="pb-2 text-right">Credit Limit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-concrete-100">
                  {overdueCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-6 text-center text-charcoal-500">
                        No outstanding customer dues
                      </td>
                    </tr>
                  ) : (
                    overdueCustomers.map((c) => (
                      <tr key={c.id} className="hover:bg-concrete-50/60">
                        <td className="py-2.5">
                          <p className="font-bold text-charcoal-900">{c.name}</p>
                          <p className="text-[10px] text-charcoal-500 font-mono">{c.phone}</p>
                        </td>
                        <td className="py-2.5 text-right font-mono font-bold text-rose-700">
                          ₹{c.totalDue.toLocaleString('en-IN')}
                        </td>
                        <td className="py-2.5 text-right font-mono text-charcoal-600">
                          ₹{c.creditLimit.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Supplier Payables" subtitle="Unpaid purchase bills and consignment dues" />
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-concrete-200 text-charcoal-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="pb-2">Supplier</th>
                    <th className="pb-2 text-right">Due Amount</th>
                    <th className="pb-2 text-right">Last Purchase</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-concrete-100">
                  {dueSuppliers.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-6 text-center text-charcoal-500">
                        No outstanding supplier payables
                      </td>
                    </tr>
                  ) : (
                    dueSuppliers.map((s) => (
                      <tr key={s.id} className="hover:bg-concrete-50/60">
                        <td className="py-2.5">
                          <p className="font-bold text-charcoal-900">{s.name}</p>
                          <p className="text-[10px] text-charcoal-500">{s.companyName}</p>
                        </td>
                        <td className="py-2.5 text-right font-mono font-bold text-amber-700">
                          ₹{s.totalDue.toLocaleString('en-IN')}
                        </td>
                        <td className="py-2.5 text-right font-mono text-charcoal-600">{s.lastPurchaseDate}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {(overdueCustomers.length > 0 || dueSuppliers.length > 0) && (
        <Card className="p-4 border-amber-200 bg-amber-50/50">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-charcoal-900">Net Working Capital Position</p>
              <p className="text-[11px] text-charcoal-600 mt-0.5">
                Net position: ₹{(summaryMetrics.totalReceivables - summaryMetrics.totalPayables).toLocaleString('en-IN')}
                {' '}(Receivables − Payables). Follow up on overdue customer accounts and schedule supplier payments.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
