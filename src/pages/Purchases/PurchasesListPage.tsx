import React, { useState, useMemo } from 'react';
import { Truck, Plus, Search, Filter, IndianRupee, FileText, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Purchase } from '../../types';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';

export const PurchasesListPage: React.FC = () => {
  const { purchases, setActivePage } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredPurchases = useMemo(() => {
    return purchases.filter((p) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          p.purchaseOrderNo.toLowerCase().includes(q) ||
          p.billNo.toLowerCase().includes(q) ||
          p.supplierName.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (statusFilter !== 'all' && p.paymentStatus !== statusFilter) return false;
      return true;
    });
  }, [purchases, searchQuery, statusFilter]);

  const totalPurchaseVolume = useMemo(
    () => purchases.reduce((acc, p) => acc + p.totalAmount, 0),
    [purchases]
  );
  const totalDueToSuppliers = useMemo(
    () => purchases.reduce((acc, p) => acc + p.dueAmount, 0),
    [purchases]
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-concrete-200 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-charcoal-900 tracking-tight">
              Supplier Purchases & Inward Bills
            </h1>
            <Badge variant="yellow" size="sm">
              {purchases.length} Purchase Consignments
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
            Total Purchase Volume: <strong className="text-charcoal-950">₹{totalPurchaseVolume.toLocaleString('en-IN')}</strong> (Outstanding Payables: <span className="text-rose-700 font-bold">₹{totalDueToSuppliers.toLocaleString('en-IN')}</span>)
          </p>
        </div>

        <Button
          variant="yellow"
          size="sm"
          onClick={() => setActivePage('new-purchase')}
          icon={<Plus className="w-4 h-4 stroke-[3]" />}
        >
          + New Purchase PO
        </Button>
      </div>

      {/* Filter Bar */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search PO #, supplier bill or manufacturer..."
              className="w-full text-xs rounded-lg border border-concrete-300 pl-9 pr-3 py-2 text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-charcoal-800/10 focus:border-charcoal-800"
            />
          </div>

          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Payment Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Partial">Partial</option>
            <option value="Due">Due</option>
          </Select>
        </div>
      </Card>

      {/* Purchases Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-concrete-200 bg-concrete-50/70 text-charcoal-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="px-5 py-3">PO & Bill #</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Supplier / C&F</th>
                <th className="px-3 py-3">Items Intake</th>
                <th className="px-3 py-3 text-right">Bill Total</th>
                <th className="px-3 py-3 text-right">Amount Paid</th>
                <th className="px-3 py-3 text-right">Balance Due</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-concrete-200">
              {filteredPurchases.map((p) => (
                <tr key={p.id} className="hover:bg-concrete-50/60 transition-colors">
                  <td className="px-5 py-3 font-mono">
                    <p className="font-bold text-charcoal-900">{p.purchaseOrderNo}</p>
                    <p className="text-[10px] text-charcoal-500">{p.billNo}</p>
                  </td>

                  <td className="px-4 py-3 text-charcoal-600 whitespace-nowrap">
                    {p.date}
                  </td>

                  <td className="px-4 py-3">
                    <p className="font-bold text-charcoal-900">{p.supplierName}</p>
                    <p className="text-[10px] text-charcoal-500">{p.supplierPhone}</p>
                  </td>

                  <td className="px-3 py-3 text-charcoal-700">
                    {p.items.map((i) => `${i.quantity} ${i.unit} ${i.productName.split(' ')[0]}`).join(', ')}
                  </td>

                  <td className="px-3 py-3 text-right font-mono font-extrabold text-charcoal-950">
                    ₹{p.totalAmount.toLocaleString('en-IN')}
                  </td>

                  <td className="px-3 py-3 text-right font-mono font-medium text-emerald-700">
                    ₹{p.paidAmount.toLocaleString('en-IN')}
                  </td>

                  <td className="px-3 py-3 text-right font-mono font-bold text-rose-700">
                    ₹{p.dueAmount.toLocaleString('en-IN')}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <Badge
                      variant={p.paymentStatus === 'Paid' ? 'paid' : p.paymentStatus === 'Partial' ? 'partial' : 'due'}
                      size="sm"
                    >
                      {p.paymentStatus}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
