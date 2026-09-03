import React, { useState } from 'react';
import { Plus, Layers, Edit2, Trash2, CheckCircle2, Eye, EyeOff, Package } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { Category, ProductVisibility } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';

export const CategoriesPage: React.FC = () => {
  const { categories, products, addCategory, updateCategory, deleteCategory } = useApp();
  const toast = useToast();

  const [isModalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formVisibility, setFormVisibility] = useState<ProductVisibility>('Visible');

  const openAddModal = () => {
    setEditingCategory(null);
    setFormName('');
    setFormSlug('');
    setFormDescription('');
    setFormVisibility('Visible');
    setModalOpen(true);
  };

  const openEditModal = (c: Category) => {
    setEditingCategory(c);
    setFormName(c.name);
    setFormSlug(c.slug);
    setFormDescription(c.description || '');
    setFormVisibility(c.visibility);
    setModalOpen(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast.error('Category name is required');
      return;
    }
    const slug = formSlug || formName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name: formName,
        slug,
        description: formDescription,
        visibility: formVisibility,
      });
      toast.success('Category Updated', `Saved changes for "${formName}".`);
    } else {
      addCategory({
        name: formName,
        slug,
        description: formDescription,
        isActive: true,
        visibility: formVisibility,
        sortOrder: categories.length + 1,
      });
      toast.success('Category Created', `Added new category "${formName}".`);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Delete category "${name}"?`)) {
      deleteCategory(id);
      toast.info('Category Removed', `Deleted category "${name}".`);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-concrete-200 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-charcoal-900 tracking-tight">
              Material Categories
            </h1>
            <Badge variant="yellow" size="sm">
              {categories.length} Categories
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
            Organize materials for ERP tracking and public customer website navigation.
          </p>
        </div>

        <Button
          variant="yellow"
          size="sm"
          onClick={openAddModal}
          icon={<Plus className="w-4 h-4 stroke-[3]" />}
        >
          + Add Category
        </Button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const productCount = products.filter((p) => p.categoryId === cat.id).length;

          return (
            <Card key={cat.id} hoverable className="flex flex-col justify-between p-5">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="w-9 h-9 rounded-lg bg-concrete-100 border border-concrete-200 flex items-center justify-center text-charcoal-700 font-bold">
                    <Layers className="w-4 h-4" />
                  </div>
                  <Badge variant={cat.visibility === 'Visible' ? 'visible' : 'hidden'} size="sm">
                    {cat.visibility}
                  </Badge>
                </div>

                <h3 className="text-sm font-bold text-charcoal-900">{cat.name}</h3>
                <p className="font-mono text-[10px] text-charcoal-400 mt-0.5">/{cat.slug}</p>
                <p className="text-xs text-charcoal-500 mt-2 line-clamp-2 leading-relaxed">
                  {cat.description || 'Standard construction material category.'}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-concrete-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-charcoal-700 flex items-center gap-1">
                  <Package className="w-3.5 h-3.5 text-charcoal-400" />
                  {productCount} Products
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="p-1 text-charcoal-500 hover:text-charcoal-900 rounded hover:bg-concrete-100"
                    title="Edit Category"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id, cat.name)}
                    className="p-1 text-charcoal-400 hover:text-red-600 rounded hover:bg-red-50"
                    title="Delete Category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Add / Edit Category Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCategory ? `Edit Category: ${editingCategory.name}` : 'Add New Category'}
        subtitle="Categories group products on both ERP & public website"
        maxWidth="lg"
      >
        <form onSubmit={handleSaveCategory} className="space-y-4">
          <Input
            label="Category Name"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="e.g. Sariya / Steel TMT"
            required
          />

          <Input
            label="URL Slug (Optional)"
            value={formSlug}
            onChange={(e) => setFormSlug(e.target.value)}
            placeholder="e.g. steel-sariya"
          />

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider">
              Description
            </label>
            <textarea
              rows={3}
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Describe materials included in this category..."
              className="w-full text-xs rounded-lg border border-concrete-300 p-3 text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-charcoal-800/10 focus:border-charcoal-800"
            />
          </div>

          <Select
            label="Public Website Visibility"
            value={formVisibility}
            onChange={(e) => setFormVisibility(e.target.value as ProductVisibility)}
          >
            <option value="Visible">Visible (Show in Customer Website Navigation)</option>
            <option value="Hidden">Hidden (Private in Admin Only)</option>
          </Select>

          <div className="flex justify-end gap-3 pt-4 border-t border-concrete-200">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="yellow">
              {editingCategory ? 'Update Category' : 'Create Category'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
