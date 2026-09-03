import React, { useState, useMemo } from 'react';
import {
  ShoppingBag,
  Plus,
  Trash2,
  Truck,
  Building2,
  ArrowRight,
  Boxes,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { PurchaseItem, PaymentMethod, PaymentStatus } from '../../types';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const NewPurchasePage: React.FC = () => {
  const { suppliers, products, addPurchase, setActivePage } = useApp();
  const toast = useToast();

  const [supplierId, setSupplierId] = useState<string>(suppliers[0]?.id || '');
  const [billNo, setBillNo] = useState(`UTC/BIL/${Math.floor(1000 + Math.random() * 9000)}`);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Multi-item purchase lines
  const [items, setItems] = useState<PurchaseItem[]>([
    {
      productId: products[0]?.id || 'prod-001',
      productName: products[0]?.name || 'UltraTech PPC Cement',
      unit: 'Bag',
      quantity: 100,
      unitPrice: 345,
      total: 34500,
    },
  ]);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Bank Transfer');
  const [paidAmount, setPaidAmount] = useState<number>(34500);
  const [notes, setNotes] = useState('');

  const handleProductSelect = (index: number, prodId: string) => {
    const prod = products.find((p) => p.id === prodId);
    if (!prod) return;
    setItems((prev) =>
      prev.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            productId: prod.id,
            productName: prod.name,
            unit: prod.unit,
            unitPrice: prod.purchasePrice,
            total: item.quantity * prod.purchasePrice,
          };
        }
        return item;
      })
    );
  };

  const updateItemQty = (index: number, quantity: number) => {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            quantity,
            total: quantity * item.unitPrice,
          };
        }
        return item;
      })
    );
  };

  const updateItemPrice = (index: number, unitPrice: number) => {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            unitPrice,
            total: item.quantity * unitPrice,
          };
        }
        return item;
      })
    );
  };

  const addNewItem = () => {
    const prod = products[0];
    setItems((prev) => [
      ...prev,
      {
        productId: prod?.id || 'prod-001',
        productName: prod?.name || 'Product',
        unit: prod?.unit || 'Bag',
        quantity: 50,
        unitPrice: prod?.purchasePrice || 340,
        total: 50 * (prod?.purchasePrice || 340),
      },
    ]);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const totalAmount = useMemo(() => items.reduce((acc, it) => acc + it.total, 0), [items]);
  const dueAmount = Math.max(0, totalAmount - paidAmount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error('Add at least one material line item');
      return;
    }
    const sup = suppliers.find((s) => s.id === supplierId);
    const supplierName = sup?.name || 'Supplier Depot';
    const supplierPhone = sup?.phone || '+91 612 0000000';

    const po = addPurchase({
      billNo,
      supplierId,
      supplierName,
      supplierPhone,
      items,
      totalAmount,
      paidAmount,
      dueAmount,
      paymentStatus: dueAmount === 0 ? 'Paid' : paidAmount === 0 ? 'Due' : 'Partial',
      paymentMethod,
      date,
      notes,
    });

    toast.success('Purchase Consignment Logged', `${po.purchaseOrderNo} received. Inventory increased.`);
    setActivePage('purchases');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-concrete-200 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-charcoal-900 tracking-tight">
              Log Inward Purchase Consignment
            </h1>
            <Badge variant="yellow" size="sm">
              Stock Inward PO
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
            Receives factory / mining lot deliveries into Kishor Construction yard and updates payable accounts.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={() => setActivePage('purchases')}>
          View Purchases List
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Supplier / C&F Depot"
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
              required
            >
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.companyName})
                </option>
              ))}
            </Select>

            <Input
              label="Supplier Invoice / Challan #"
              value={billNo}
              onChange={(e) => setBillNo(e.target.value)}
              placeholder="e.g. UTC/PAT/8821"
              required
            />

            <Input
              label="Received Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* Line Items Table */}
          <div className="border border-concrete-200 rounded-xl overflow-hidden mt-4">
            <div className="px-4 py-3 bg-concrete-50 flex items-center justify-between border-b border-concrete-200">
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal-700">
                Consignment Materials ({items.length})
              </span>
              <Button type="button" variant="outline" size="sm" onClick={addNewItem} icon={<Plus className="w-3.5 h-3.5" />}>
                Add Material Line
              </Button>
            </div>

            <div className="divide-y divide-concrete-100 p-2">
              {items.map((item, idx) => (
                <div key={idx} className="p-3 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center text-xs">
                  {/* Product Picker */}
                  <div className="sm:col-span-5">
                    <label className="block text-[10px] font-bold text-charcoal-500 uppercase mb-1">
                      Material Item
                    </label>
                    <Select
                      value={item.productId}
                      onChange={(e) => handleProductSelect(idx, e.target.value)}
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.weight})
                        </option>
                      ))}
                    </Select>
                  </div>

                  {/* Quantity */}
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-charcoal-500 uppercase mb-1">
                      Inward Qty ({item.unit})
                    </label>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItemQty(idx, parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  {/* Unit Purchase Cost */}
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-charcoal-500 uppercase mb-1">
                      Unit Cost (₹)
                    </label>
                    <Input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => updateItemPrice(idx, parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  {/* Line Total */}
                  <div className="sm:col-span-2 text-right">
                    <label className="block text-[10px] font-bold text-charcoal-500 uppercase mb-1">
                      Line Total
                    </label>
                    <span className="font-mono font-bold text-sm text-charcoal-900 block pt-2">
                      ₹{item.total.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Remove */}
                  <div className="sm:col-span-1 text-right pt-4">
                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      disabled={items.length === 1}
                      className="text-charcoal-400 hover:text-red-600 disabled:opacity-30 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment & Dues Calculation */}
          <div className="p-4 bg-concrete-50 rounded-xl border border-concrete-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-charcoal-500 block">Total Purchase Value:</span>
              <span className="text-xl font-extrabold text-charcoal-950 font-mono mt-1 block">
                ₹{totalAmount.toLocaleString('en-IN')}
              </span>
            </div>

            <div>
              <Select
                label="Payment Method"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              >
                <option value="Bank Transfer">Bank Transfer (RTGS / NEFT)</option>
                <option value="Cheque">Cheque</option>
                <option value="UPI">UPI</option>
                <option value="Cash">Cash</option>
              </Select>
            </div>

            <div>
              <Input
                label="Amount Paid Immediately (₹)"
                type="number"
                value={paidAmount}
                onChange={(e) => setPaidAmount(parseFloat(e.target.value) || 0)}
              />
              {dueAmount > 0 && (
                <p className="text-[11px] text-rose-700 font-bold mt-1">
                  Payable Due to Supplier: ₹{dueAmount.toLocaleString('en-IN')}
                </p>
              )}
            </div>
          </div>

          <Input
            placeholder="Unloading bay, transport truck number, quality inspection remarks..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-concrete-200">
            <Button type="button" variant="outline" onClick={() => setActivePage('purchases')}>
              Cancel
            </Button>
            <Button type="submit" variant="yellow" size="lg">
              Confirm Inward Consignment & Increase Stock (₹{totalAmount.toLocaleString('en-IN')})
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
};
