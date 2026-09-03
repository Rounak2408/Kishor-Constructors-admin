import React from 'react';
import { AlertTriangle, ShoppingBag, Plus, RefreshCw, Package } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const LowStockPage: React.FC = () => {
  const { products, setActivePage } = useApp();

  const lowStockItems = products.filter((p) => p.currentStock <= p.minimumStock);
  const healthyItems = products.filter((p) => p.currentStock > p.minimumStock);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-concrete-200 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-charcoal-900 tracking-tight">
              Low Stock & Reorder Alerts
            </h1>
            <Badge variant={lowStockItems.length > 0 ? 'critical' : 'healthy'} size="sm">
              {lowStockItems.length} Low Stock SKUs
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
            Real-time replenishment alerts to prevent out-of-stock situations on high-demand building materials.
          </p>
        </div>

        <Button
          variant="yellow"
          size="sm"
          onClick={() => setActivePage('new-purchase')}
          icon={<ShoppingBag className="w-4 h-4" />}
        >
          Create Bulk Restock PO
        </Button>
      </div>

      {/* Low Stock Items Grid */}
      {lowStockItems.length === 0 ? (
        <Card className="p-8 text-center text-xs text-charcoal-500">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
            <Package className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-charcoal-900">All Stocks Healthy</h3>
          <p className="mt-1 max-w-sm mx-auto">
            Every product in your yard and warehouse has inventory above the minimum safety stock threshold.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lowStockItems.map((p) => {
            const isOut = p.currentStock === 0;
            const deficit = p.minimumStock - p.currentStock;

            return (
              <Card
                key={p.id}
                className="p-5 border-l-4 border-l-rose-500 flex flex-col justify-between shadow-card hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono text-charcoal-500 bg-concrete-100 px-2 py-0.5 rounded">
                      {p.sku}
                    </span>
                    <Badge variant={isOut ? 'out-of-stock' : 'critical'} size="sm">
                      {isOut ? 'OUT OF STOCK' : 'CRITICAL STOCK'}
                    </Badge>
                  </div>

                  <h3 className="text-sm font-bold text-charcoal-900 leading-snug">{p.name}</h3>
                  <p className="text-xs text-charcoal-500 mt-0.5">{p.categoryName} • {p.weight}</p>

                  <div className="mt-4 p-3 bg-rose-50/70 border border-rose-200 rounded-xl grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-rose-700">Current In Yard</span>
                      <p className="text-base font-extrabold text-charcoal-950 mt-0.5">
                        {p.currentStock} {p.unit}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-charcoal-500">Min Safety Level</span>
                      <p className="text-base font-extrabold text-charcoal-950 mt-0.5">
                        {p.minimumStock} {p.unit}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-concrete-100 flex items-center justify-between">
                  <span className="text-xs text-rose-800 font-semibold">
                    Reorder suggested: <strong className="text-charcoal-950">+{deficit * 3} {p.unit}</strong>
                  </span>
                  <Button
                    variant="yellow"
                    size="sm"
                    onClick={() => setActivePage('new-purchase')}
                    className="text-xs py-1.5"
                  >
                    Restock Now
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
