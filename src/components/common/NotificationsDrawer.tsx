import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  MessageSquare,
  Truck,
  CheckCircle2,
  Trash2,
  BellOff,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../ui/Button';

export const NotificationsDrawer: React.FC = () => {
  const {
    isNotificationsOpen,
    setNotificationsOpen,
    products,
    customerEnquiries,
    purchases,
    setActivePage,
    updateEnquiryStatus,
  } = useApp();

  const toast = useToast();

  // Track whether notifications were cleared in this session
  const [clearedSession, setClearedSession] = useState(false);

  if (!isNotificationsOpen) return null;

  const lowStockItems = clearedSession
    ? []
    : products.filter((p) => p.currentStock <= p.minimumStock);

  const pendingEnquiries = clearedSession
    ? []
    : customerEnquiries.filter((e) => e.status === 'New');

  const duePurchases = clearedSession
    ? []
    : purchases.filter((p) => p.paymentStatus !== 'Paid');

  const totalActiveNotifications = lowStockItems.length + pendingEnquiries.length + duePurchases.length;

  const handleNavigate = (page: any) => {
    setActivePage(page);
    setNotificationsOpen(false);
  };

  const handleClearAll = () => {
    // 1. Mark all pending customer enquiries as 'Contacted' in state
    pendingEnquiries.forEach((enq) => {
      updateEnquiryStatus(enq.id, 'Contacted', 'Marked as read from notification drawer');
    });

    // 2. Hide low stock & purchase alerts from current notification drawer session
    setClearedSession(true);

    toast.success(
      'Notifications Cleared',
      'All active alerts and quote notifications have been cleared successfully.'
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal-950/60 backdrop-blur-xs transition-opacity"
        onClick={() => setNotificationsOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-white border-l border-concrete-200 shadow-modal flex flex-col">
          
          {/* Header */}
          <div className="p-4 border-b border-concrete-200 flex items-center justify-between bg-concrete-50">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-charcoal-900">Notifications & Alerts</h3>
                {totalActiveNotifications > 0 && (
                  <span className="text-[10px] font-black bg-rose-500 text-white px-1.5 py-0.5 rounded-full">
                    {totalActiveNotifications}
                  </span>
                )}
              </div>
              <p className="text-xs text-charcoal-500 mt-0.5">
                Real-time inventory, website enquiries & payment alerts
              </p>
            </div>

            <div className="flex items-center gap-1">
              {totalActiveNotifications > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-xs font-bold text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-2 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                  title="Clear All Notifications"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Clear All</span>
                </button>
              )}

              <button
                onClick={() => setNotificationsOpen(false)}
                className="text-charcoal-400 hover:text-charcoal-700 p-1.5 rounded-lg hover:bg-concrete-200 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5">

            {/* Empty State when all notifications are cleared */}
            {totalActiveNotifications === 0 && (
              <div className="py-16 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                  <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-charcoal-900">All Notifications Cleared!</h4>
                  <p className="text-xs text-charcoal-500 max-w-xs mx-auto mt-1">
                    You're all caught up. No low-stock warnings or unread quote enquiries at this time.
                  </p>
                </div>
                {clearedSession && (
                  <button
                    onClick={() => setClearedSession(false)}
                    className="text-xs font-bold text-yellow-dark hover:underline pt-2"
                  >
                    Restore Alert Views
                  </button>
                )}
              </div>
            )}

            {/* Low Stock Alerts */}
            {lowStockItems.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    Low Stock Alerts ({lowStockItems.length})
                  </span>
                  <button
                    onClick={() => handleNavigate('low-stock')}
                    className="text-[11px] font-bold text-charcoal-700 hover:underline"
                  >
                    View Low Stock
                  </button>
                </div>
                <div className="space-y-2">
                  {lowStockItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-rose-50/80 border border-rose-200 rounded-xl flex items-center justify-between gap-2 shadow-2xs"
                    >
                      <div>
                        <p className="text-xs font-bold text-charcoal-900">{item.name}</p>
                        <p className="text-[11px] text-rose-800 mt-0.5">
                          Current: <span className="font-extrabold">{item.currentStock} {item.unit}</span> (Min: {item.minimumStock})
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleNavigate('new-purchase')}
                        className="text-[11px] py-1 px-2.5 border-rose-300 hover:bg-rose-100 text-rose-950 font-bold"
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
              <div className="space-y-2.5 pt-2 border-t border-concrete-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-amber-600" />
                    New Website Enquiries ({pendingEnquiries.length})
                  </span>
                  <button
                    onClick={() => handleNavigate('website-enquiries')}
                    className="text-[11px] font-bold text-charcoal-700 hover:underline"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-2">
                  {pendingEnquiries.map((enq) => (
                    <div
                      key={enq.id}
                      className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl space-y-2 shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-charcoal-950">{enq.customerName}</span>
                        <span className="text-[10px] text-charcoal-500 font-semibold">{enq.date.split(' ')[1]}</span>
                      </div>
                      <p className="text-xs text-charcoal-800 font-medium">
                        Requesting: <span className="font-extrabold text-charcoal-950">{enq.quantityRequested}</span> of {enq.productName}
                      </p>
                      <div className="flex items-center gap-2 pt-0.5">
                        <a
                          href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(enq.customerName)},%20Kishor%20Construction%20received%20your%20quote%20enquiry.`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-2.5 py-1 rounded-lg transition-colors border border-emerald-300/60"
                        >
                          WhatsApp Quote
                        </a>
                        <a
                          href={`tel:${enq.phone}`}
                          className="text-[11px] font-bold text-blue-800 bg-blue-100 hover:bg-blue-200 px-2.5 py-1 rounded-lg transition-colors border border-blue-300/60"
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
              <div className="space-y-2.5 pt-2 border-t border-concrete-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-charcoal-800 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-charcoal-600" />
                    Supplier Payments Due
                  </span>
                  <button
                    onClick={() => handleNavigate('purchases')}
                    className="text-[11px] font-bold text-charcoal-700 hover:underline"
                  >
                    View Bills
                  </button>
                </div>
                <div className="space-y-2">
                  {duePurchases.map((po) => (
                    <div
                      key={po.id}
                      className="p-3 bg-concrete-100/90 border border-concrete-200 rounded-xl flex items-center justify-between shadow-2xs"
                    >
                      <div>
                        <p className="text-xs font-bold text-charcoal-900">{po.supplierName}</p>
                        <p className="text-[10px] text-charcoal-600 font-semibold mt-0.5">
                          Bill: {po.billNo} • Due: <strong className="text-charcoal-900">₹{po.dueAmount.toLocaleString('en-IN')}</strong>
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleNavigate('purchases')}
                        className="text-[11px] py-1 px-3 font-bold"
                      >
                        Pay
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Footer Bar */}
          <div className="p-3.5 border-t border-concrete-200 bg-concrete-50 flex items-center justify-between">
            {totalActiveNotifications > 0 ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearAll}
                icon={<Trash2 className="w-3.5 h-3.5 text-rose-600" />}
                className="text-xs text-rose-700 border-rose-200 hover:bg-rose-50"
              >
                Clear All Notifications
              </Button>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>All clear</span>
              </div>
            )}

            <Button variant="outline" size="sm" onClick={() => setNotificationsOpen(false)}>
              Close Panel
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
};
