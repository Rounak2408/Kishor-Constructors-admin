import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Filter,
  Eye,
  EyeOff,
  Star,
  Edit2,
  Copy,
  Trash2,
  Package,
  Layers,
  Award,
  Upload,
  ExternalLink,
  CheckCircle2,
  Boxes,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { Product, ProductVisibility, ProductStatus } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { EmptyState } from '../../components/ui/EmptyState';

export const ProductsPage: React.FC = () => {
  const {
    products,
    categories,
    brands,
    addProduct,
    updateProduct,
    deleteProduct,
    duplicateProduct,
    toggleProductVisibility,
    toggleProductFeatured,
    setWebsitePreviewOpen,
  } = useApp();
  const toast = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedVisibility, setSelectedVisibility] = useState<string>('all');

  // Add / Edit Modal State
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formBrand, setFormBrand] = useState('');
  const [formType, setFormType] = useState('');
  const [formUnit, setFormUnit] = useState('Bag');
  const [formWeight, setFormWeight] = useState('50 KG');
  const [formPurchasePrice, setFormPurchasePrice] = useState('340');
  const [formSellingPrice, setFormSellingPrice] = useState('390');
  const [formStock, setFormStock] = useState('100');
  const [formMinStock, setFormMinStock] = useState('30');
  const [formDescription, setFormDescription] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formVisibility, setFormVisibility] = useState<ProductVisibility>('Visible');
  const [formFeatured, setFormFeatured] = useState(false);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q) ||
          (p.brandName && p.brandName.toLowerCase().includes(q));
        if (!matches) return false;
      }
      if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) return false;
      if (selectedBrand !== 'all' && p.brandId !== selectedBrand) return false;
      if (selectedVisibility !== 'all' && p.visibility !== selectedVisibility) return false;
      return true;
    });
  }, [products, searchQuery, selectedCategory, selectedBrand, selectedVisibility]);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormCategory(categories[0]?.id || '');
    setFormBrand(brands[0]?.id || '');
    setFormType('PPC Cement');
    setFormUnit('Bag');
    setFormWeight('50 KG');
    setFormPurchasePrice('340');
    setFormSellingPrice('390');
    setFormStock('100');
    setFormMinStock('30');
    setFormDescription('High performance construction material for structural durability.');
    setFormImageUrl('https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&auto=format&fit=crop&q=80');
    setFormVisibility('Visible');
    setFormFeatured(false);
    setModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormCategory(p.categoryId);
    setFormBrand(p.brandId || '');
    setFormType(p.type);
    setFormUnit(p.unit);
    setFormWeight(p.weight);
    setFormPurchasePrice(p.purchasePrice.toString());
    setFormSellingPrice(p.sellingPrice.toString());
    setFormStock(p.currentStock.toString());
    setFormMinStock(p.minimumStock.toString());
    setFormDescription(p.description);
    setFormImageUrl(p.imageUrl);
    setFormVisibility(p.visibility);
    setFormFeatured(p.isFeatured);
    setModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast.error('Product Name is required');
      return;
    }
    const cat = categories.find((c) => c.id === formCategory);
    const br = brands.find((b) => b.id === formBrand);

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: formName,
        categoryId: formCategory,
        categoryName: cat?.name || editingProduct.categoryName,
        brandId: br?.id,
        brandName: br?.name,
        type: formType,
        unit: formUnit,
        weight: formWeight,
        purchasePrice: parseFloat(formPurchasePrice) || 0,
        sellingPrice: parseFloat(formSellingPrice) || 0,
        currentStock: parseFloat(formStock) || 0,
        minimumStock: parseFloat(formMinStock) || 0,
        description: formDescription,
        imageUrl: formImageUrl,
        visibility: formVisibility,
        isFeatured: formFeatured,
      });
      toast.success('Product Updated', `Updated "${formName}". Public website price & stock synced.`);
    } else {
      addProduct({
        name: formName,
        sku: `KC-${formName.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
        categoryId: formCategory,
        categoryName: cat?.name || 'General',
        brandId: br?.id,
        brandName: br?.name,
        type: formType,
        unit: formUnit,
        weight: formWeight,
        description: formDescription,
        purchasePrice: parseFloat(formPurchasePrice) || 0,
        sellingPrice: parseFloat(formSellingPrice) || 0,
        currentStock: parseFloat(formStock) || 0,
        minimumStock: parseFloat(formMinStock) || 0,
        imageUrl: formImageUrl,
        status: 'Active',
        visibility: formVisibility,
        isFeatured: formFeatured,
      });
      toast.success('Product Added', `Added "${formName}" to inventory.`);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteProduct(id);
      toast.info('Product Deleted', `Removed "${name}" from inventory.`);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-concrete-200 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-charcoal-900 tracking-tight">
              Product Catalog & Inventory
            </h1>
            <Badge variant="yellow" size="sm">
              {products.length} Products
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
            Manage cement brands, aggregates, steel rebars, stock pricing, and website visibility.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setWebsitePreviewOpen(true)}
            icon={<Eye className="w-4 h-4 text-yellow-dark" />}
          >
            Preview Customer Sync
          </Button>
          <Button
            variant="yellow"
            size="sm"
            onClick={openAddModal}
            icon={<Plus className="w-4 h-4 stroke-[3]" />}
          >
            + Add Product
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, SKU or brand..."
              className="w-full text-xs rounded-lg border border-concrete-300 pl-9 pr-3 py-2 text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-charcoal-800/10 focus:border-charcoal-800"
            />
          </div>

          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories ({categories.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>

          <Select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
          >
            <option value="all">All Brands ({brands.length})</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.categoryName})
              </option>
            ))}
          </Select>

          <Select
            value={selectedVisibility}
            onChange={(e) => setSelectedVisibility(e.target.value)}
          >
            <option value="all">All Visibility States</option>
            <option value="Visible">Visible on Customer Site</option>
            <option value="Hidden">Hidden (Private Only)</option>
          </Select>
        </div>
      </Card>

      {/* Products Table */}
      <Card>
        {filteredProducts.length === 0 ? (
          <EmptyState
            icon={<Package className="w-6 h-6" />}
            title="No Products Found"
            description="Try changing your search keywords or filter options, or create a new product item."
            actionText="+ Add Product"
            onAction={openAddModal}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-concrete-200 bg-concrete-50/70 text-charcoal-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="px-4 py-3">Product / SKU</th>
                  <th className="px-3 py-3">Category & Brand</th>
                  <th className="px-3 py-3">Spec / Weight</th>
                  <th className="px-3 py-3 text-right">Cost Price</th>
                  <th className="px-3 py-3 text-right">Selling Price</th>
                  <th className="px-3 py-3 text-right">Stock Qty</th>
                  <th className="px-3 py-3 text-center">Visibility</th>
                  <th className="px-3 py-3 text-center">Featured</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-concrete-200">
                {filteredProducts.map((p) => {
                  const isLow = p.currentStock > 0 && p.currentStock <= p.minimumStock;
                  const isOut = p.currentStock === 0;

                  return (
                    <tr key={p.id} className="hover:bg-concrete-50/60 transition-colors group">
                      {/* Product Name + Image */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover border border-concrete-200 flex-shrink-0 bg-concrete-100"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-charcoal-900 truncate">{p.name}</p>
                            <span className="font-mono text-[10px] text-charcoal-500">{p.sku}</span>
                          </div>
                        </div>
                      </td>

                      {/* Category & Brand */}
                      <td className="px-3 py-3">
                        <p className="font-semibold text-charcoal-800">{p.categoryName}</p>
                        <p className="text-[10px] text-charcoal-500">{p.brandName || '—'}</p>
                      </td>

                      {/* Spec / Weight */}
                      <td className="px-3 py-3 text-charcoal-700 font-medium">
                        {p.weight} ({p.type})
                      </td>

                      {/* Cost Price */}
                      <td className="px-3 py-3 text-right font-mono font-medium text-charcoal-600">
                        ₹{p.purchasePrice.toLocaleString('en-IN')}
                      </td>

                      {/* Selling Price */}
                      <td className="px-3 py-3 text-right font-mono font-extrabold text-charcoal-950">
                        ₹{p.sellingPrice.toLocaleString('en-IN')}
                        <span className="text-[10px] text-charcoal-400 block font-sans font-normal">/{p.unit}</span>
                      </td>

                      {/* Stock Qty */}
                      <td className="px-3 py-3 text-right">
                        <span
                          className={`font-mono font-bold ${
                            isOut
                              ? 'text-red-600'
                              : isLow
                              ? 'text-amber-700'
                              : 'text-charcoal-900'
                          }`}
                        >
                          {p.currentStock} {p.unit}
                        </span>
                        {isLow && (
                          <span className="block text-[10px] font-bold text-amber-700">Low Stock</span>
                        )}
                        {isOut && (
                          <span className="block text-[10px] font-bold text-red-700">Out of Stock</span>
                        )}
                      </td>

                      {/* Visibility Toggle */}
                      <td className="px-3 py-3 text-center">
                        <button
                          onClick={() => toggleProductVisibility(p.id)}
                          title={`Click to ${p.visibility === 'Visible' ? 'Hide' : 'Show'} on Customer Website`}
                          className="inline-flex items-center"
                        >
                          <Badge variant={p.visibility === 'Visible' ? 'visible' : 'hidden'} size="sm">
                            {p.visibility}
                          </Badge>
                        </button>
                      </td>

                      {/* Featured Toggle */}
                      <td className="px-3 py-3 text-center">
                        <button
                          onClick={() => toggleProductFeatured(p.id)}
                          className={`p-1 rounded-md transition-colors ${
                            p.isFeatured
                              ? 'text-yellow-brand bg-yellow-light/60 hover:bg-yellow-light'
                              : 'text-charcoal-300 hover:text-charcoal-600'
                          }`}
                          title={p.isFeatured ? 'Featured on Homepage' : 'Click to feature on homepage'}
                        >
                          <Star className="w-4 h-4 fill-current" />
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-1.5 text-charcoal-500 hover:text-charcoal-900 rounded-md hover:bg-concrete-200 transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => duplicateProduct(p.id)}
                            className="p-1.5 text-charcoal-500 hover:text-charcoal-900 rounded-md hover:bg-concrete-200 transition-colors"
                            title="Duplicate Product"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id, p.name)}
                            className="p-1.5 text-charcoal-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Add / Edit Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProduct ? `Edit Product: ${editingProduct.name}` : 'Add New Product to Catalog'}
        subtitle="Changes are automatically reflected on the Customer Website based on Visibility"
        maxWidth="3xl"
      >
        <form onSubmit={handleSaveProduct} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Material Category"
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value)}
              required
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>

            <Select
              label="Manufacturer Brand"
              value={formBrand}
              onChange={(e) => setFormBrand(e.target.value)}
            >
              <option value="">-- None / General Grade --</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.categoryName})
                </option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Product Full Name"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. UltraTech Super Weather Plus"
              required
            />
            <Input
              label="Grade / Spec Type"
              value={formType}
              onChange={(e) => setFormType(e.target.value)}
              placeholder="e.g. Water Shield PPC / 16mm Fe550D"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Input
              label="Sales Unit"
              value={formUnit}
              onChange={(e) => setFormUnit(e.target.value)}
              placeholder="Bag / Ton / CFT"
            />
            <Input
              label="Packaging Weight"
              value={formWeight}
              onChange={(e) => setFormWeight(e.target.value)}
              placeholder="50 KG"
            />
            <Input
              label="Purchase Price (₹)"
              type="number"
              value={formPurchasePrice}
              onChange={(e) => setFormPurchasePrice(e.target.value)}
              required
            />
            <Input
              label="Selling Price (₹)"
              type="number"
              value={formSellingPrice}
              onChange={(e) => setFormSellingPrice(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Current Stock Quantity"
              type="number"
              value={formStock}
              onChange={(e) => setFormStock(e.target.value)}
              required
            />
            <Input
              label="Low Stock Warning Level"
              type="number"
              value={formMinStock}
              onChange={(e) => setFormMinStock(e.target.value)}
              required
            />
          </div>

          <Input
            label="Product Image URL (Supabase Storage Ready)"
            value={formImageUrl}
            onChange={(e) => setFormImageUrl(e.target.value)}
            placeholder="https://images.unsplash.com/photo-..."
          />

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider">
              Product Description / Technical Specifications
            </label>
            <textarea
              rows={3}
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Enter product qualities, ISI certification, application for casting or masonry..."
              className="w-full text-xs rounded-lg border border-concrete-300 p-3 text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-charcoal-800/10 focus:border-charcoal-800"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-concrete-200">
            <Select
              label="Public Website Visibility"
              value={formVisibility}
              onChange={(e) => setFormVisibility(e.target.value as ProductVisibility)}
            >
              <option value="Visible">Visible (Published on Customer Website)</option>
              <option value="Hidden">Hidden (Private in Admin Only)</option>
            </Select>

            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="isFeaturedModal"
                checked={formFeatured}
                onChange={(e) => setFormFeatured(e.target.checked)}
                className="w-4 h-4 rounded border-concrete-300 text-yellow-brand focus:ring-yellow-brand cursor-pointer"
              />
              <label htmlFor="isFeaturedModal" className="text-xs font-semibold text-charcoal-800 cursor-pointer">
                Feature on Public Website Homepage (Featured Carousel)
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-concrete-200">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="yellow">
              {editingProduct ? 'Update Product' : 'Save Product'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
