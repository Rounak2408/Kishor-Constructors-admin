import React, { useState, useMemo } from 'react';
import {
  ArrowLeftRight,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  FileText,
  User,
  Plus,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MovementType } from '../../types';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const StockMovementsPage: React.FC = () => {
  const { stockMovements, products, categories } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<string>('all');

  const filteredMovements = useMemo(() => {
    return stockMovements.filter((m) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          m.productName.toLowerCase().includes(q) ||
          m.referenceId.toLowerCase().includes(q) ||
          (m.notes && m.notes.toLowerCase().includes(q)) ||
          m.performedBy.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (selectedType !== 'all' && m.type !== selectedType) return false;
      if (selectedProduct !== 'all' && m.productId !== selectedProduct) return false;
      return true;
    });
  }, [stockMovements, searchQuery, selectedType, selectedProduct]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-concrete-200 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-charcoal-900 tracking-tight">
              Stock Movements & Traceability Ledger
            </h1>
            <Badge variant="yellow" size="sm">
              {stockMovements.length} Logs
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
            Complete audit trail of every purchase entry, sales dispatch, customer return, and yard adjustment.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reference #, product or user..."
              className="w-full text-xs rounded-lg border border-concrete-300 pl-9 pr-3 py-2 text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-charcoal-800/10 focus:border-charcoal-800"
            />
          </div>

          <Select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="all">All Movement Types</option>
            <option value="PURCHASE">PURCHASE (Incoming +)</option>
            <option value="SALE">SALE (Outgoing -)</option>
            <option value="RETURN">RETURN (Incoming +)</option>
            <option value="ADJUSTMENT">ADJUSTMENT</option>
          </Select>

          <Select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
          >
            <option value="all">All Products ({products.length})</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </Select>
        </div>
      </Card>

      {/* Movements Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-concrete-200 bg-concrete-50/70 text-charcoal-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="px-5 py-3">Timestamp</th>
                <th className="px-4 py-3">Product & Category</th>
                <th className="px-3 py-3 text-center">Movement Type</th>
                <th className="px-3 py-3 text-right">Quantity</th>
                <th className="px-3 py-3 text-right">Stock (Before &rarr; After)</th>
                <th className="px-4 py-3">Reference / Bill / PO #</th>
                <th className="px-4 py-3">Performed By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-concrete-200">
              {filteredMovements.map((m) => {
                const isIncoming = m.quantity > 0;

                return (
                  <tr key={m.id} className="hover:bg-concrete-50/60 transition-colors">
                    <td className="px-5 py-3 text-charcoal-500 whitespace-nowrap font-mono text-[11px]">
                      {m.date}
                    </td>

                    <td className="px-4 py-3">
                      <p className="font-bold text-charcoal-900">{m.productName}</p>
                      <p className="text-[10px] text-charcoal-500">{m.categoryName}</p>
                    </td>

                    <td className="px-3 py-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded ${
                          m.type === 'PURCHASE'
                            ? 'bg-blue-50 text-blue-800 border border-blue-200'
                            : m.type === 'SALE'
                            ? 'bg-amber-50 text-amber-900 border border-amber-200'
                            : m.type === 'RETURN'
                            ? 'bg-purple-50 text-purple-800 border border-purple-200'
                            : 'bg-concrete-100 text-charcoal-800 border border-concrete-300'
                        }`}
                      >
                        {isIncoming ? <ArrowDownLeft className="w-3 h-3 text-emerald-600" /> : <ArrowUpRight className="w-3 h-3 text-rose-600" />}
                        {m.type}
                      </span>
                    </td>

                    <td
                      className={`px-3 py-3 text-right font-mono font-extrabold ${
                        isIncoming ? 'text-emerald-700' : 'text-charcoal-900'
                      }`}
                    >
                      {isIncoming ? `+${m.quantity}` : m.quantity}
                    </td>

                    <td className="px-3 py-3 text-right font-mono text-charcoal-700">
                      <span className="text-charcoal-400">{m.previousStock}</span> &rarr;{' '}
                      <span className="font-bold text-charcoal-950">{m.newStock}</span>
                    </td>

                    <td className="px-4 py-3">
                      <p className="font-semibold text-charcoal-800 font-mono text-[11px]">{m.referenceId}</p>
                      {m.notes && <p className="text-[11px] text-charcoal-500 truncate max-w-xs">{m.notes}</p>}
                    </td>

                    <td className="px-4 py-3 text-charcoal-600 whitespace-nowrap">
                      {m.performedBy}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
