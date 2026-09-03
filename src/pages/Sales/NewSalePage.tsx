import React, { useState, useMemo } from 'react';
import {
  ShoppingCart,
  Plus,
  Trash2,
  Search,
  CheckCircle2,
  Printer,
  CreditCard,
  Building,
  Phone,
  User,
  IndianRupee,
  ArrowRight,
  Package,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { SaleItem, PaymentMethod, Sale } from '../../types';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';

export const NewSalePage: React.FC = () => {
  const { products, customers, addSale, setActivePage } = useApp();
  const toast = useToast();

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || 'walk-in');
  const [walkInName, setWalkInName] = useState('Walk-in Cash Customer');
  const [walkInPhone, setWalkInPhone] = useState('+91 98000 00000');

  // Search product in catalog picker
  const [productSearch, setProductSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Multi-item cart
  const [cart, setCart] = useState<SaleItem[]>([
    {
      productId: 'prod-001',
      productName: 'UltraTech PPC Cement',
      unit: 'Bag',
      quantity: 50,
      unitPrice: 390,
      purchasePrice: 345,
      discount: 0,
      total: 19500,
    },
  ]);

  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [paidAmount, setPaidAmount] = useState<number>(19500);
  const [notes, setNotes] = useState('');

  // Generated completed invoice state for receipt modal
  const [generatedSale, setGeneratedSale] = useState<Sale | null>(null);
  const [isReceiptOpen, setReceiptOpen] = useState(false);

  // Filter available products
  const availableProducts = useMemo(() => {
    return products.filter((p) => {
      if (productSearch.trim()) {
        const q = productSearch.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.sku.toLowerCase().includes(q)) return false;
      }
      if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) return false;
      return true;
    });
  }, [products, productSearch, selectedCategory]);

  const addToCart = (prod: (typeof products)[0]) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === prod.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === prod.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                total: (item.quantity + 1) * item.unitPrice - item.discount,
              }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: prod.id,
          productName: prod.name,
          unit: prod.unit,
          quantity: 1,
          unitPrice: prod.sellingPrice,
          purchasePrice: prod.purchasePrice,
          discount: 0,
          total: prod.sellingPrice,
        },
      ];
    });
  };

  const updateCartItem = (index: number, updates: Partial<SaleItem>) => {
    setCart((prev) =>
      prev.map((item, i) => {
        if (i === index) {
          const updated = { ...item, ...updates };
          updated.total = updated.quantity * updated.unitPrice - (updated.discount || 0);
          return updated;
        }
        return item;
      })
    );
  };

  const removeCartItem = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  // Totals calculations
  const subtotal = useMemo(() => cart.reduce((acc, item) => acc + item.total, 0), [cart]);
  const finalTotal = Math.max(0, subtotal - discountAmount);
  const cogsTotal = useMemo(
    () => cart.reduce((acc, item) => acc + item.quantity * item.purchasePrice, 0),
    [cart]
  );
  const calculatedGrossProfit = finalTotal - cogsTotal;
  const calculatedDue = Math.max(0, finalTotal - paidAmount);

  const handleCompleteSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      toast.error('Cart is empty', 'Add at least one item to proceed.');
      return;
    }

    const selectedCust = customers.find((c) => c.id === selectedCustomerId);
    const customerName = selectedCustomerId === 'walk-in' ? walkInName : selectedCust?.name || 'Walk-in Customer';
    const customerPhone = selectedCustomerId === 'walk-in' ? walkInPhone : selectedCust?.phone || '+91 90000 00000';

    const saleRecord = addSale({
      customerId: selectedCustomerId,
      customerName,
      customerPhone,
      items: cart,
      subtotal,
      taxAmount: 0,
      discountAmount,
      totalAmount: finalTotal,
      cogsTotal,
      grossProfit: calculatedGrossProfit,
      paidAmount,
      dueAmount: calculatedDue,
      paymentMethod,
      paymentStatus: calculatedDue === 0 ? 'Paid' : paidAmount === 0 ? 'Due' : 'Partial',
      notes,
    });

    setGeneratedSale(saleRecord);
    setReceiptOpen(true);
    toast.success('Sale Completed!', `Invoice ${saleRecord.invoiceNo} generated for ${customerName}.`);

    // Reset Cart
    setCart([]);
    setDiscountAmount(0);
    setNotes('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-concrete-200 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-charcoal-900 tracking-tight">
              POS Counter / New Sale Billing
            </h1>
            <Badge variant="yellow" size="sm">
              Live Billing Terminal
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
            Instantly deducts yard inventory, computes COGS & profit, and records customer ledger accounts.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={() => setActivePage('sales')}>
          View All Invoices
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Catalog Item Picker) */}
        <div className="lg:col-span-6 space-y-4">
          <Card className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Scan SKU or type cement / steel / sand..."
                  className="w-full text-xs rounded-lg border border-concrete-300 pl-9 pr-3 py-2 text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-charcoal-800/10 focus:border-charcoal-800"
                />
              </div>
            </div>

            {/* Product Quick Add Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[500px] overflow-y-auto p-1">
              {availableProducts.map((prod) => (
                <button
                  key={prod.id}
                  type="button"
                  onClick={() => addToCart(prod)}
                  className="p-3 bg-white hover:bg-yellow-light/40 border border-concrete-200 hover:border-yellow-brand rounded-xl text-left transition-all duration-150 flex flex-col justify-between shadow-2xs group"
                >
                  <div>
                    <span className="text-[10px] font-bold text-charcoal-500 uppercase tracking-wider block">
                      {prod.categoryName}
                    </span>
                    <h4 className="text-xs font-bold text-charcoal-900 mt-1 line-clamp-2 leading-snug group-hover:text-charcoal-950">
                      {prod.name}
                    </h4>
                    <p className="text-[11px] text-charcoal-500 mt-0.5">{prod.weight}</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-concrete-100 flex items-center justify-between">
                    <span className="text-xs font-extrabold text-charcoal-900">
                      ₹{prod.sellingPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] font-semibold text-charcoal-500 bg-concrete-100 px-1.5 py-0.2 rounded">
                      {prod.currentStock} {prod.unit}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column (Cart, Billing Form & Final Invoice Summary) */}
        <div className="lg:col-span-6 space-y-4">
          <form onSubmit={handleCompleteSale}>
            <Card className="p-5 space-y-4 shadow-md border-concrete-300">
              {/* Customer Selector */}
              <div>
                <Select
                  label="Select Customer Account"
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  required
                >
                  <option value="walk-in">⚡ Walk-in Counter Customer (Cash / UPI)</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.phone}) — Due: ₹{c.totalDue.toLocaleString('en-IN')}
                    </option>
                  ))}
                </Select>

                {selectedCustomerId === 'walk-in' && (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Input
                      placeholder="Customer Name"
                      value={walkInName}
                      onChange={(e) => setWalkInName(e.target.value)}
                    />
                    <Input
                      placeholder="Phone (Optional)"
                      value={walkInPhone}
                      onChange={(e) => setWalkInPhone(e.target.value)}
                    />
                  </div>
                )}
              </div>

              {/* Cart Items Table */}
              <div className="border border-concrete-200 rounded-xl overflow-hidden">
                <div className="px-3 py-2 bg-concrete-50 text-[11px] font-bold uppercase tracking-wider text-charcoal-500 flex justify-between">
                  <span>Cart Items ({cart.length})</span>
                  <span>Rate / Unit</span>
                </div>

                <div className="divide-y divide-concrete-100 max-h-60 overflow-y-auto">
                  {cart.length === 0 ? (
                    <div className="p-6 text-center text-xs text-charcoal-400">
                      No materials selected. Click any product on the left catalog to add.
                    </div>
                  ) : (
                    cart.map((item, idx) => (
                      <div key={item.productId} className="p-3 flex items-center justify-between gap-3 text-xs bg-white">
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-charcoal-900 truncate">{item.productName}</p>
                          <p className="text-[11px] text-charcoal-500">
                            Unit: {item.unit} • Cost: ₹{item.purchasePrice}
                          </p>
                        </div>

                        {/* Quantity input */}
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min="0.1"
                            step="any"
                            value={item.quantity}
                            onChange={(e) =>
                              updateCartItem(idx, { quantity: parseFloat(e.target.value) || 0 })
                            }
                            className="w-16 rounded border border-concrete-300 p-1 text-center font-bold text-charcoal-900 text-xs"
                          />
                          <span className="text-[11px] text-charcoal-500">{item.unit}</span>
                        </div>

                        {/* Unit Price */}
                        <div className="w-20 text-right font-mono font-bold text-charcoal-900">
                          ₹{item.total.toLocaleString('en-IN')}
                        </div>

                        <button
                          type="button"
                          onClick={() => removeCartItem(idx)}
                          className="text-charcoal-400 hover:text-red-600 p-1 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Payment Details */}
              <div className="p-4 bg-concrete-50 rounded-xl border border-concrete-200 space-y-3 text-xs">
                <div className="flex justify-between font-semibold text-charcoal-700">
                  <span>Subtotal Amount:</span>
                  <span className="font-mono font-bold text-charcoal-900">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="font-semibold text-charcoal-700">Discount (₹):</span>
                  <input
                    type="number"
                    value={discountAmount}
                    onChange={(e) => {
                      const d = parseFloat(e.target.value) || 0;
                      setDiscountAmount(d);
                      setPaidAmount(Math.max(0, subtotal - d));
                    }}
                    className="w-24 rounded border border-concrete-300 p-1 text-right text-xs font-mono"
                  />
                </div>

                <div className="flex justify-between font-extrabold text-sm text-charcoal-950 pt-2 border-t border-concrete-200">
                  <span>Net Payable Amount:</span>
                  <span className="font-mono text-base text-charcoal-950">₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>

                {/* Gross profit preview for owner */}
                <div className="flex justify-between text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded">
                  <span>Estimated Gross Margin on this bill:</span>
                  <span className="font-mono font-bold">+₹{calculatedGrossProfit.toLocaleString('en-IN')}</span>
                </div>

                {/* Payment Method & Amount Paid */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Select
                    label="Payment Method"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  >
                    <option value="UPI">UPI (QR / PhonePe / GPay)</option>
                    <option value="Cash">Cash Counter</option>
                    <option value="Credit">Credit (Khata Balance)</option>
                    <option value="Bank Transfer">Bank Transfer (NEFT)</option>
                  </Select>

                  <Input
                    label="Amount Received (₹)"
                    type="number"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(parseFloat(e.target.value) || 0)}
                  />
                </div>

                {calculatedDue > 0 && (
                  <div className="flex justify-between text-xs text-rose-700 font-bold bg-rose-50 p-2 rounded">
                    <span>Outstanding Due Balance (Added to Khata):</span>
                    <span>₹{calculatedDue.toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>

              <Input
                placeholder="Dispatch notes, driver name, vehicle number..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />

              <Button
                type="submit"
                variant="yellow"
                size="lg"
                className="w-full text-sm font-bold shadow-md"
                disabled={cart.length === 0}
              >
                <span>Complete Sale & Generate Invoice (₹{finalTotal.toLocaleString('en-IN')})</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Card>
          </form>
        </div>
      </div>

      {/* Printable Invoice Receipt Modal */}
      {generatedSale && (
        <Modal
          isOpen={isReceiptOpen}
          onClose={() => setReceiptOpen(false)}
          title="Tax Invoice / Delivery Challan"
          subtitle={`Invoice #${generatedSale.invoiceNo} — Kishor Construction`}
          maxWidth="2xl"
          footer={
            <div className="flex items-center justify-between w-full">
              <Button variant="outline" size="sm" onClick={() => setReceiptOpen(false)}>
                Close
              </Button>
              <Button
                variant="yellow"
                size="sm"
                onClick={() => window.print()}
                icon={<Printer className="w-4 h-4" />}
              >
                Print Invoice Receipt
              </Button>
            </div>
          }
        >
          <div className="p-6 bg-white border border-concrete-300 rounded-xl space-y-5 text-xs text-charcoal-900 font-sans print-only">
            {/* Invoice Header */}
            <div className="flex items-start justify-between border-b border-concrete-300 pb-4">
              <div>
                <h2 className="text-base font-extrabold tracking-wider text-charcoal-950">KISHOR CONSTRUCTION</h2>
                <p className="text-charcoal-600 font-medium">Wholesale Building Materials Depot</p>
                <p className="text-charcoal-500 text-[11px] mt-1">NH-30 Main Road, Danapur Cantt, Patna, Bihar</p>
                <p className="text-charcoal-500 text-[11px]">Phone: +91 98353 92558 • GSTIN: 10AABCK4891Q1Z8</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-extrabold text-charcoal-950 block">{generatedSale.invoiceNo}</span>
                <span className="text-charcoal-500 font-mono text-[11px]">{generatedSale.createdAt}</span>
                <span className="inline-block text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 mt-1">
                  {generatedSale.paymentStatus} ({generatedSale.paymentMethod})
                </span>
              </div>
            </div>

            {/* Customer Details */}
            <div className="bg-concrete-50 p-3 rounded-lg border border-concrete-200">
              <span className="text-[10px] uppercase font-bold text-charcoal-500 block">Billed To / Delivery:</span>
              <p className="font-bold text-charcoal-900 text-sm mt-0.5">{generatedSale.customerName}</p>
              <p className="text-charcoal-600">{generatedSale.customerPhone}</p>
            </div>

            {/* Line Items */}
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-concrete-300 bg-concrete-100 font-bold uppercase text-[10px] text-charcoal-600">
                  <th className="py-2 px-2">#</th>
                  <th className="py-2 px-2">Material Description</th>
                  <th className="py-2 px-2 text-right">Qty</th>
                  <th className="py-2 px-2 text-right">Rate</th>
                  <th className="py-2 px-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-concrete-200">
                {generatedSale.items.map((item, i) => (
                  <tr key={i}>
                    <td className="py-2 px-2 text-charcoal-400">{i + 1}</td>
                    <td className="py-2 px-2 font-bold text-charcoal-900">{item.productName}</td>
                    <td className="py-2 px-2 text-right font-medium">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="py-2 px-2 text-right font-mono">₹{item.unitPrice}</td>
                    <td className="py-2 px-2 text-right font-mono font-bold">₹{item.total.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="border-t border-concrete-300 pt-3 space-y-1.5 text-right font-semibold">
              <div className="flex justify-between">
                <span className="text-charcoal-500">Subtotal:</span>
                <span className="font-mono">₹{generatedSale.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {generatedSale.discountAmount > 0 && (
                <div className="flex justify-between text-rose-600">
                  <span>Discount:</span>
                  <span className="font-mono">-₹{generatedSale.discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-extrabold text-charcoal-950 pt-1 border-t border-concrete-200">
                <span>Grand Total:</span>
                <span className="font-mono text-base">₹{generatedSale.totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-charcoal-600">
                <span>Paid via {generatedSale.paymentMethod}:</span>
                <span className="font-mono font-bold text-emerald-700">₹{generatedSale.paidAmount.toLocaleString('en-IN')}</span>
              </div>
              {generatedSale.dueAmount > 0 && (
                <div className="flex justify-between text-rose-700 font-bold">
                  <span>Balance Due:</span>
                  <span className="font-mono">₹{generatedSale.dueAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
            </div>

            {/* Footer Sign */}
            <div className="pt-6 border-t border-concrete-300 flex items-center justify-between text-[11px] text-charcoal-500">
              <p>Thank you for your business! Goods once sold subject to Kishor Construction yard terms.</p>
              <div className="text-center">
                <div className="w-32 border-b border-charcoal-400 mb-1" />
                <span className="font-bold text-charcoal-800">Authorized Signatory</span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
