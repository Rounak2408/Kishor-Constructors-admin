import React, { useState, useMemo, useEffect } from 'react';
import { Search, Package, Users, Building2, Receipt, Truck, ArrowRight, X } from 'lucide-react';
import { useApp, ActivePage } from '../../context/AppContext';

export const GlobalSearchModal: React.FC = () => {
  const {
    isGlobalSearchOpen,
    setGlobalSearchOpen,
    products,
    customers,
    suppliers,
    sales,
    purchases,
    setActivePage,
  } = useApp();

  const [query, setQuery] = useState('');

  // Keyboard shortcut Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setGlobalSearchOpen(!isGlobalSearchOpen);
      }
      if (e.key === 'Escape' && isGlobalSearchOpen) {
        setGlobalSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGlobalSearchOpen, setGlobalSearchOpen]);

  const searchResults = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.toLowerCase();

    const matchedProducts = products
      .filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.categoryName.toLowerCase().includes(q))
      .slice(0, 4);

    const matchedCustomers = customers
      .filter((c) => c.name.toLowerCase().includes(q) || c.phone.includes(q))
      .slice(0, 3);

    const matchedSuppliers = suppliers
      .filter((s) => s.name.toLowerCase().includes(q) || s.companyName.toLowerCase().includes(q))
      .slice(0, 3);

    const matchedSales = sales
      .filter((s) => s.invoiceNo.toLowerCase().includes(q) || s.customerName.toLowerCase().includes(q))
      .slice(0, 3);

    return {
      products: matchedProducts,
      customers: matchedCustomers,
      suppliers: matchedSuppliers,
      sales: matchedSales,
    };
  }, [query, products, customers, suppliers, sales]);

  const handleNavigate = (page: ActivePage) => {
    setActivePage(page);
    setGlobalSearchOpen(false);
    setQuery('');
  };

  if (!isGlobalSearchOpen) return null;

  const totalFound =
    (searchResults?.products.length || 0) +
    (searchResults?.customers.length || 0) +
    (searchResults?.suppliers.length || 0) +
    (searchResults?.sales.length || 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-start justify-center pt-20 p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal-950/60 backdrop-blur-xs transition-opacity"
        onClick={() => setGlobalSearchOpen(false)}
      />

      {/* Search Dialog Box */}
      <div className="relative bg-white rounded-2xl border border-concrete-300 shadow-modal w-full max-w-2xl overflow-hidden z-10">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-concrete-200">
          <Search className="w-5 h-5 text-charcoal-400 mr-3 flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products (Cement, Sand, Sariya), customers, suppliers, invoices..."
            className="w-full text-sm font-medium text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none bg-transparent"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-charcoal-400 hover:text-charcoal-700 p-1 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!query.trim() ? (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-charcoal-400 mb-2">
                Quick Navigation Shortcuts
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { label: 'Products Catalog', page: 'products' as ActivePage, icon: Package },
                  { label: 'POS New Sale', page: 'new-sale' as ActivePage, icon: Receipt },
                  { label: 'Purchases PO', page: 'purchases' as ActivePage, icon: Truck },
                  { label: 'Customers Ledger', page: 'customers' as ActivePage, icon: Users },
                  { label: 'Suppliers Ledger', page: 'suppliers' as ActivePage, icon: Building2 },
                  { label: 'P&L Statement', page: 'profit-loss' as ActivePage, icon: Receipt },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.page}
                      onClick={() => handleNavigate(item.page)}
                      className="flex items-center gap-2 p-2.5 rounded-lg border border-concrete-200 hover:border-charcoal-400 hover:bg-concrete-50 text-xs font-semibold text-charcoal-800 transition-colors text-left"
                    >
                      <Icon className="w-4 h-4 text-charcoal-500" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : totalFound === 0 ? (
            <div className="py-8 text-center text-xs text-charcoal-500">
              No results matching "<span className="font-semibold text-charcoal-800">{query}</span>" found across inventory, sales, or accounts.
            </div>
          ) : (
            <div className="space-y-4">
              {/* Products */}
              {searchResults?.products && searchResults.products.length > 0 && (
                <div>
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-charcoal-400 mb-1.5">
                    <span>Products ({searchResults.products.length})</span>
                    <button
                      onClick={() => handleNavigate('products')}
                      className="text-charcoal-700 hover:underline flex items-center gap-0.5"
                    >
                      View all <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="space-y-1">
                    {searchResults.products.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => handleNavigate('products')}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-concrete-100 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <Package className="w-4 h-4 text-amber-600" />
                          <div>
                            <p className="text-xs font-semibold text-charcoal-900">{p.name}</p>
                            <p className="text-[10px] text-charcoal-500">{p.categoryName} • {p.weight}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-charcoal-900">₹{p.sellingPrice.toLocaleString('en-IN')}</p>
                          <p className="text-[10px] text-charcoal-500">Stock: {p.currentStock} {p.unit}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Customers */}
              {searchResults?.customers && searchResults.customers.length > 0 && (
                <div>
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-charcoal-400 mb-1.5">
                    <span>Customers ({searchResults.customers.length})</span>
                    <button
                      onClick={() => handleNavigate('customers')}
                      className="text-charcoal-700 hover:underline flex items-center gap-0.5"
                    >
                      View all <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="space-y-1">
                    {searchResults.customers.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => handleNavigate('customers')}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-concrete-100 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <Users className="w-4 h-4 text-blue-600" />
                          <div>
                            <p className="text-xs font-semibold text-charcoal-900">{c.name}</p>
                            <p className="text-[10px] text-charcoal-500">{c.phone} • {c.city}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-charcoal-900">Total: ₹{c.totalPurchases.toLocaleString('en-IN')}</p>
                          <p className="text-[10px] text-rose-600 font-semibold">Due: ₹{c.totalDue.toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sales Invoices */}
              {searchResults?.sales && searchResults.sales.length > 0 && (
                <div>
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-charcoal-400 mb-1.5">
                    <span>Invoices ({searchResults.sales.length})</span>
                    <button
                      onClick={() => handleNavigate('sales')}
                      className="text-charcoal-700 hover:underline flex items-center gap-0.5"
                    >
                      View all <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="space-y-1">
                    {searchResults.sales.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => handleNavigate('sales')}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-concrete-100 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <Receipt className="w-4 h-4 text-emerald-600" />
                          <div>
                            <p className="text-xs font-semibold text-charcoal-900">{s.invoiceNo} — {s.customerName}</p>
                            <p className="text-[10px] text-charcoal-500">{s.createdAt} • {s.paymentMethod}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-charcoal-900">₹{s.totalAmount.toLocaleString('en-IN')}</p>
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded">
                            {s.paymentStatus}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-concrete-50 border-t border-concrete-200 text-[11px] text-charcoal-500 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>Press <kbd className="font-mono bg-white border border-concrete-300 px-1 py-0.5 rounded text-charcoal-700">ESC</kbd> to close</span>
          </div>
          <span className="font-semibold text-charcoal-700">Kishor Construction ERP</span>
        </div>
      </div>
    </div>
  );
};
