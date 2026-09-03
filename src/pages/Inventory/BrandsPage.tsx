import React, { useState } from 'react';
import { Plus, Award, Edit2, Trash2, Package, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { Brand, ProductVisibility } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';

export const BrandsPage: React.FC = () => {
  const { brands, categories, products, addBrand, updateBrand, deleteBrand } = useApp();
  const toast = useToast();

  const [isModalOpen, setModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState(categories[0]?.id || '');
  const [formVisibility, setFormVisibility] = useState<ProductVisibility>('Visible');

  const openAddModal = () => {
    setEditingBrand(null);
    setFormName('');
    setFormCategory(categories[0]?.id || '');
    setFormVisibility('Visible');
    setModalOpen(true);
  };

  const openEditModal = (b: Brand) => {
    setEditingBrand(b);
    setFormName(b.name);
    setFormCategory(b.categoryId);
    setFormVisibility(b.visibility);
    setModalOpen(true);
  };

  const handleSaveBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast.error('Brand name is required');
      return;
    }
    const cat = categories.find((c) => c.id === formCategory);
    const slug = formName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    if (editingBrand) {
      updateBrand(editingBrand.id, {
        name: formName,
        slug,
        categoryId: formCategory,
        categoryName: cat?.name || editingBrand.categoryName,
        visibility: formVisibility,
      });
      toast.success('Brand Updated', `Saved changes for "${formName}".`);
    } else {
      addBrand({
        name: formName,
        slug,
        categoryId: formCategory,
        categoryName: cat?.name || 'Cement',
        isActive: true,
        visibility: formVisibility,
      });
      toast.success('Brand Created', `Added manufacturer brand "${formName}".`);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Delete brand "${name}"?`)) {
      deleteBrand(id);
      toast.info('Brand Removed', `Deleted brand "${name}".`);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-concrete-200 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-charcoal-900 tracking-tight">
              Manufacturer Brands
            </h1>
            <Badge variant="yellow" size="sm">
              {brands.length} Brands
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
            Multi-brand cement (UltraTech, ACC, Ambuja, JK), steel and pipes hierarchy.
          </p>
        </div>

        <Button
          variant="yellow"
          size="sm"
          onClick={openAddModal}
          icon={<Plus className="w-4 h-4 stroke-[3]" />}
        >
          + Add Brand
        </Button>
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {brands.map((brand) => {
          const productCount = products.filter((p) => p.brandId === brand.id).length;

          return (
            <Card key={brand.id} hoverable className="p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-yellow-light border border-yellow-brand/30 flex items-center justify-center text-charcoal-950 font-bold">
                    <Award className="w-4 h-4 text-yellow-dark" />
                  </div>
                  <Badge variant={brand.visibility === 'Visible' ? 'visible' : 'hidden'} size="sm">
                    {brand.visibility}
                  </Badge>
                </div>

                <h3 className="text-sm font-bold text-charcoal-900">{brand.name}</h3>
                <p className="text-xs text-charcoal-500 mt-0.5">{brand.categoryName}</p>
              </div>

              <div className="pt-3 mt-3 border-t border-concrete-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-charcoal-700 flex items-center gap-1">
                  <Package className="w-3.5 h-3.5 text-charcoal-400" />
                  {productCount} SKUs
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(brand)}
                    className="p-1 text-charcoal-500 hover:text-charcoal-900 rounded hover:bg-concrete-100"
                    title="Edit Brand"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(brand.id, brand.name)}
                    className="p-1 text-charcoal-400 hover:text-red-600 rounded hover:bg-red-50"
                    title="Delete Brand"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Add / Edit Brand Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={editingBrand ? `Edit Brand: ${editingBrand.name}` : 'Add Manufacturer Brand'}
        subtitle="Brands power multi-brand cement and steel catalogs"
        maxWidth="md"
      >
        <form onSubmit={handleSaveBrand} className="space-y-4">
          <Input
            label="Brand Name"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="e.g. UltraTech Cement / Tata Tiscon"
            required
          />

          <Select
            label="Category Mapping"
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
            label="Public Website Visibility"
            value={formVisibility}
            onChange={(e) => setFormVisibility(e.target.value as ProductVisibility)}
          >
            <option value="Visible">Visible (Show brand pills on customer site)</option>
            <option value="Hidden">Hidden (Private in Admin Only)</option>
          </Select>

          <div className="flex justify-end gap-3 pt-4 border-t border-concrete-200">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="yellow">
              {editingBrand ? 'Update Brand' : 'Create Brand'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
