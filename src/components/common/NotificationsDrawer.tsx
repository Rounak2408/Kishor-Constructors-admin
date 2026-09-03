import React from 'react';
import { X, AlertTriangle, MessageSquare, IndianRupee, Truck, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';

export const NotificationsDrawer: React.FC = () => {
  const {
    isNotificationsOpen,
    setNotificationsOpen,
    products,
    customerEnquiries,
    purchases,
    setActivePage,
  } = useApp();

  if (!isNotificationsOpen) return null;

  const lowStockItems = products.filter((p) => p.currentStock <= p.minimumStock);
  const pendingEnquiries = customerEnquiries.filter((e) => e.status === 'New');
  const duePurchases = purchases.filter((p) => p.paymentStatus !== 'Paid');

  const handleNavigate = (page: any) => {
    setActivePage(page);
    setNotificationsOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal-950/50 backdrop-blur-xs transition-opacity"
        onClick={() => setNotificationsOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-concrete-200 shadow-modal flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-concrete-200 flex items-center justify-between bg-concrete-50">
            <div>
              <h3 className="text-base font-bold text-charcoal-900">Notifications & Alerts</h3>
              <p className="text-xs text-charcoal-500">Real-time business inventory & inquiry events</p>
            </div>
            <button
              onClick={() => setNotificationsOpen(false)}
              className="text-charcoal-400 hover:text-charcoal-700 p-1 rounded-lg hover:bg-concrete-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Low Stock Alerts */}
            {lowStockItems.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Low Stock Alerts ({lowStockItems.length})
                  </span>
                  <button
                    onClick={() => handleNavigate('low-stock')}
                    className="text-[11px] font-semibold text-charcoal-700 hover:underline"
                  >
                    View Low Stock
                  </button>
                </div>
                <div className="space-y-1.5">
                  {lowStockItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-rose-50/70 border border-rose-200 rounded-lg flex items-center justify-between gap-2"
                    >
                      <div>
                        <p className="text-xs font-bold text-charcoal-900">{item.name}</p>
                        <p className="text-[11px] text-rose-700">
                          Current: <span className="font-bold">{item.currentStock} {item.unit}</span> (Min: {item.minimumStock})
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleNavigate('new-purchase')}
                        className="text-[11px] py-1 px-2 border-rose-300 hover:bg-rose-100 text-rose-900"
                      >
                        Restock
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pending Customer Enquiries */}
            {pendingEnquiries.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-concrete-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" />
                    New Website Enquiries ({pendingEnquiries.length})
                  </span>
                  <button
                    onClick={() => handleNavigate('website-enquiries')}
                    className="text-[11px] font-semibold text-charcoal-700 hover:underline"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-1.5">
                  {pendingEnquiries.map((enq) => (
                    <div
                      key={enq.id}
                      className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-charcoal-900">{enq.customerName}</span>
                        <span className="text-[10px] text-charcoal-500">{enq.date.split(' ')[1]}</span>
                      </div>
                      <p className="text-xs text-charcoal-700 font-medium">
                        Requesting: <span className="font-bold text-charcoal-950">{enq.quantityRequested}</span> of {enq.productName}
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        <a
                          href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(enq.customerName)},%20Kishor%20Construction%20received%20your%20quote%20enquiry.`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-2 py-0.5 rounded transition-colors"
                        >
                          WhatsApp Quote
                        </a>
                        <a
                          href={`tel:${enq.phone}`}
                          className="text-[11px] font-bold text-blue-800 bg-blue-100 hover:bg-blue-200 px-2 py-0.5 rounded transition-colors"
                        >
                          Call ({enq.phone})
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Outstanding Supplier Bills */}
            {duePurchases.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-concrete-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-charcoal-700 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5" />
                    Supplier Payments Due
                  </span>
                  <button
                    onClick={() => handleNavigate('purchases')}
                    className="text-[11px] font-semibold text-charcoal-700 hover:underline"
                  >
                    View Bills
                  </button>
                </div>
                <div className="space-y-1.5">
                  {duePurchases.map((po) => (
                    <div
                      key={po.id}
                      className="p-3 bg-concrete-100 border border-concrete-200 rounded-lg flex items-center justify-between"
                    >
                      <div>
                        <p className="text-xs font-bold text-charcoal-900">{po.supplierName}</p>
                        <p className="text-[10px] text-charcoal-500">Bill: {po.billNo} • Due: ₹{po.dueAmount.toLocaleString('en-IN')}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleNavigate('purchases')}
                        className="text-[11px] py-1 px-2"
                      >
                        Pay
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-concrete-200 bg-concrete-50 text-right">
            <Button variant="outline" size="sm" onClick={() => setNotificationsOpen(false)}>
              Close Panel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
