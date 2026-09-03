import React, { useState, useMemo } from 'react';
import {
  Receipt,
  Search,
  Filter,
  Eye,
  Printer,
  Plus,
  ArrowRight,
  IndianRupee,
  Calendar,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Sale, PaymentStatus } from '../../types';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';

export const SalesListPage: React.FC = () => {
  const { sales, setActivePage } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  const filteredSales = useMemo(() => {
    return sales.filter((s) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          s.invoiceNo.toLowerCase().includes(q) ||
          s.customerName.toLowerCase().includes(q) ||
          s.customerPhone.includes(q);
        if (!match) return false;
      }
      if (statusFilter !== 'all' && s.paymentStatus !== statusFilter) return false;
      return true;
    });
  }, [sales, searchQuery, statusFilter]);

  const totalSalesRevenue = useMemo(() => sales.reduce((acc, s) => acc + s.totalAmount, 0), [sales]);
  const totalGrossProfit = useMemo(() => sales.reduce((acc, s) => acc + s.grossProfit, 0), [sales]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-concrete-200 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-charcoal-900 tracking-tight">
              Sales Invoices & Billing Ledger
            </h1>
            <Badge variant="yellow" size="sm">
              {sales.length} Invoices
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
            Total Invoiced Volume: <strong className="text-charcoal-950">₹{totalSalesRevenue.toLocaleString('en-IN')}</strong> (Gross Margin: <span className="text-emerald-700 font-bold">₹{totalGrossProfit.toLocaleString('en-IN')}</span>)
          </p>
        </div>

        <Button
          variant="yellow"
          size="sm"
          onClick={() => setActivePage('new-sale')}
          icon={<Plus className="w-4 h-4 stroke-[3]" />}
        >
          + POS New Sale
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
              placeholder="Search invoice number, customer name or phone..."
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

      {/* Sales Invoices Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-concrete-200 bg-concrete-50/70 text-charcoal-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="px-5 py-3">Invoice #</th>
                <th className="px-4 py-3">Date & Time</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-3 py-3">Items Summary</th>
                <th className="px-3 py-3 text-right">Invoice Total</th>
                <th className="px-3 py-3 text-right">Gross Profit</th>
                <th className="px-3 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-concrete-200">
              {filteredSales.map((s) => (
                <tr key={s.id} className="hover:bg-concrete-50/60 transition-colors">
                  <td className="px-5 py-3 font-mono font-bold text-charcoal-900">
                    {s.invoiceNo}
                  </td>
                  <td className="px-4 py-3 text-charcoal-500 whitespace-nowrap">
                    {s.createdAt}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-bold text-charcoal-900">{s.customerName}</p>
                    <p className="text-[10px] text-charcoal-500">{s.customerPhone}</p>
                  </td>
                  <td className="px-3 py-3 text-charcoal-700">
                    {s.items.length} items ({s.items.map((i) => `${i.quantity} ${i.unit} ${i.productName.split(' ')[0]}`).slice(0, 2).join(', ')})
                  </td>
                  <td className="px-3 py-3 text-right font-mono font-extrabold text-charcoal-950">
                    ₹{s.totalAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="px-3 py-3 text-right font-mono font-bold text-emerald-700">
                    +₹{s.grossProfit.toLocaleString('en-IN')}
                  </td>
                  <td className="px-3 py-3 text-center">
                    <Badge
                      variant={s.paymentStatus === 'Paid' ? 'paid' : s.paymentStatus === 'Partial' ? 'partial' : 'due'}
                      size="sm"
                    >
                      {s.paymentStatus}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedSale(s)}
                      className="text-xs py-1 px-2.5"
                      icon={<Eye className="w-3.5 h-3.5" />}
                    >
                      Invoice
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Invoice Detail & Print Modal */}
      {selectedSale && (
        <Modal
          isOpen={Boolean(selectedSale)}
          onClose={() => setSelectedSale(null)}
          title={`Invoice ${selectedSale.invoiceNo}`}
          subtitle="Tax Invoice & Counter Receipt"
          maxWidth="xl"
          footer={
            <div className="flex items-center justify-between w-full">
              <Button variant="outline" size="sm" onClick={() => setSelectedSale(null)}>
                Close
              </Button>
              <Button
                variant="yellow"
                size="sm"
                onClick={() => window.print()}
                icon={<Printer className="w-4 h-4" />}
              >
                Print Invoice
              </Button>
            </div>
          }
        >
          <div className="space-y-4 text-xs font-sans">
            <div className="flex justify-between border-b border-concrete-200 pb-3">
              <div>
                <p className="font-bold text-charcoal-900 text-sm">KISHOR CONSTRUCTION</p>
                <p className="text-charcoal-500">NH-30 Main Road, Danapur, Patna</p>
                <p className="text-charcoal-500">GST: 10AABCK4891Q1Z8</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-charcoal-950 font-mono text-sm">{selectedSale.invoiceNo}</p>
                <p className="text-charcoal-500">{selectedSale.createdAt}</p>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded inline-block mt-1">
                  {selectedSale.paymentStatus} ({selectedSale.paymentMethod})
                </span>
              </div>
            </div>

            <div className="p-3 bg-concrete-50 rounded-lg border border-concrete-200">
              <span className="text-[10px] uppercase font-bold text-charcoal-500">Customer:</span>
              <p className="font-bold text-charcoal-900">{selectedSale.customerName}</p>
              <p className="text-charcoal-600">{selectedSale.customerPhone}</p>
            </div>

            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-concrete-200 bg-concrete-100 uppercase text-[10px] text-charcoal-600 font-bold">
                  <th className="py-1.5 px-2">Item</th>
                  <th className="py-1.5 px-2 text-right">Qty</th>
                  <th className="py-1.5 px-2 text-right">Rate</th>
                  <th className="py-1.5 px-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-concrete-100">
                {selectedSale.items.map((item, i) => (
                  <tr key={i}>
                    <td className="py-2 px-2 font-semibold text-charcoal-900">{item.productName}</td>
                    <td className="py-2 px-2 text-right">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="py-2 px-2 text-right font-mono">₹{item.unitPrice}</td>
                    <td className="py-2 px-2 text-right font-mono font-bold">₹{item.total.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="border-t border-concrete-200 pt-3 space-y-1 text-right font-semibold">
              <div className="flex justify-between">
                <span className="text-charcoal-500">Total Invoice Amount:</span>
                <span className="font-mono text-sm font-bold text-charcoal-950">₹{selectedSale.totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>Amount Paid:</span>
                <span className="font-mono">₹{selectedSale.paidAmount.toLocaleString('en-IN')}</span>
              </div>
              {selectedSale.dueAmount > 0 && (
                <div className="flex justify-between text-rose-700 font-bold">
                  <span>Balance Due:</span>
                  <span className="font-mono">₹{selectedSale.dueAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
