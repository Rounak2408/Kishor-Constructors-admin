import React, { useState } from 'react';
import { Star, GripVertical, Eye, EyeOff, ShoppingBag } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const FeaturedProductsCMS: React.FC = () => {
  const { products, updateProduct } = useApp();
  const toast = useToast();

  const visibleProducts = products.filter((p) => p.visibility === 'Visible');
  const hiddenProducts = products.filter((p) => p.visibility === 'Hidden');

  const toggleVisibility = (productId: string, currentlyVisible: boolean) => {
    updateProduct(productId, { visibility: currentlyVisible ? 'Hidden' : 'Visible' });
    toast.success(
      currentlyVisible ? 'Product Hidden' : 'Product Featured',
      currentlyVisible
        ? 'Removed from customer website catalog.'
        : 'Now visible on customer website catalog.'
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-concrete-200 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-charcoal-900 tracking-tight">
              Featured Products CMS
            </h1>
            <Badge variant="yellow" size="sm">
              {visibleProducts.length} Live on Website
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
            Control which products appear on the customer-facing website. Toggle visibility to show/hide products from the public catalog.
          </p>
        </div>
      </div>

      {/* Visible Products */}
      <Card>
        <CardHeader
          title={`Visible on Customer Website (${visibleProducts.length})`}
          subtitle="These products are live and visible to customers browsing the public website"
        />
        <CardContent>
          <div className="space-y-2">
            {visibleProducts.map((product, idx) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-3 bg-emerald-50/40 rounded-xl border border-emerald-200/60 hover:border-emerald-300 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-bold text-charcoal-400 w-5 text-center">
                    {idx + 1}
                  </span>
                  <GripVertical className="w-4 h-4 text-charcoal-300 cursor-grab" />
                  <div>
                    <p className="text-xs font-bold text-charcoal-900">{product.name}</p>
                    <p className="text-[10px] text-charcoal-500">
                      {product.brandName} · {product.categoryName} · ₹{product.sellingPrice}/{product.unit}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="healthy" size="sm">
                    <Eye className="w-3 h-3 mr-1" />
                    Visible
                  </Badge>
                  <button
                    onClick={() => toggleVisibility(product.id, true)}
                    className="px-2 py-1 text-[11px] font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded border border-rose-200 transition-colors"
                  >
                    Hide
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Hidden Products */}
      <Card>
        <CardHeader
          title={`Hidden from Website (${hiddenProducts.length})`}
          subtitle="These products exist in inventory but are NOT shown on the public website"
        />
        <CardContent>
          <div className="space-y-2">
            {hiddenProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-3 bg-concrete-50 rounded-xl border border-concrete-200 hover:border-concrete-300 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <EyeOff className="w-4 h-4 text-charcoal-300" />
                  <div>
                    <p className="text-xs font-bold text-charcoal-700">{product.name}</p>
                    <p className="text-[10px] text-charcoal-500">
                      {product.brandName} · {product.categoryName} · ₹{product.sellingPrice}/{product.unit}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => toggleVisibility(product.id, false)}
                  className="px-2 py-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200 transition-colors"
                >
                  Show on Website
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
