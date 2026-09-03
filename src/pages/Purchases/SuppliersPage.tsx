import React, { useState, useMemo } from 'react';
import {
  Building2,
  Plus,
  Search,
  Phone,
  IndianRupee,
  FileText,
  Star,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { Supplier } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';

export const SuppliersPage: React.FC = () => {
  const { suppliers, addSupplier } = useApp();
  const toast = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [gstNumber, setGstNumber] = useState('');

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((s) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          s.name.toLowerCase().includes(q) ||
          s.companyName.toLowerCase().includes(q) ||
          s.phone.includes(q) ||
          (s.gstNumber && s.gstNumber.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [suppliers, searchQuery]);

  const totalPayables = useMemo(
    () => suppliers.reduce((acc, s) => acc + s.totalDue, 0),
    [suppliers]
  );

  const handleSaveSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Supplier name is required');
      return;
    }

    addSupplier({
      name,
      companyName: companyName || name,
      phone: phone || '+91 612 0000000',
      email,
      address: address || 'Patna, Bihar',
      gstNumber,
      lastPurchaseDate: 'None',
      rating: 4.8,
      status: 'Active',
    });

    toast.success('Supplier Added', `Registered supplier "${name}".`);
    setModalOpen(false);
    setName('');
    setCompanyName('');
    setPhone('');
    setEmail('');
    setAddress('');
    setGstNumber('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-concrete-200 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-charcoal-900 tracking-tight">
              Suppliers & C&F Manufacturers
            </h1>
            <Badge variant="yellow" size="sm">
              {suppliers.length} Suppliers
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
            Total Outstanding Payables to Suppliers: <strong className="text-rose-700">₹{totalPayables.toLocaleString('en-IN')}</strong>
          </p>
        </div>

        <Button
          variant="yellow"
          size="sm"
          onClick={() => setModalOpen(true)}
          icon={<Plus className="w-4 h-4 stroke-[3]" />}
        >
          + Add Supplier
        </Button>
      </div>

      {/* Filter Bar */}
      <Card className="p-4">
        <div className="relative">
          <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search supplier, company depot, GSTIN or phone..."
            className="w-full text-xs rounded-lg border border-concrete-300 pl-9 pr-3 py-2 text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-charcoal-800/10 focus:border-charcoal-800"
          />
        </div>
      </Card>

      {/* Suppliers Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-concrete-200 bg-concrete-50/70 text-charcoal-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="px-5 py-3">Supplier / Depot Name</th>
                <th className="px-4 py-3">Location & Address</th>
                <th className="px-3 py-3">GSTIN Number</th>
                <th className="px-3 py-3 text-right">Lifetime POs</th>
                <th className="px-3 py-3 text-right">Total Paid</th>
                <th className="px-3 py-3 text-right">Payable Due</th>
                <th className="px-4 py-3 text-right">Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-concrete-200">
              {filteredSuppliers.map((s) => (
                <tr key={s.id} className="hover:bg-concrete-50/60 transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-bold text-charcoal-900">{s.name}</p>
                    <p className="text-[10px] text-charcoal-500">{s.companyName}</p>
                  </td>

                  <td className="px-4 py-3 text-charcoal-600">
                    <p className="truncate max-w-xs">{s.address}</p>
                  </td>

                  <td className="px-3 py-3 font-mono text-[11px] text-charcoal-700">
                    {s.gstNumber || 'Unregistered'}
                  </td>

                  <td className="px-3 py-3 text-right font-mono font-medium text-charcoal-800">
                    ₹{s.totalPurchases.toLocaleString('en-IN')}
                  </td>

                  <td className="px-3 py-3 text-right font-mono font-medium text-emerald-700">
                    ₹{s.totalPaid.toLocaleString('en-IN')}
                  </td>

                  <td className="px-3 py-3 text-right font-mono font-extrabold text-rose-700">
                    ₹{s.totalDue.toLocaleString('en-IN')}
                  </td>

                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <a
                      href={`tel:${s.phone}`}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-charcoal-800 bg-concrete-100 hover:bg-concrete-200 rounded-lg transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-charcoal-500" />
                      <span>{s.phone}</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Supplier Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Material Supplier / Factory Depot"
        subtitle="Manage wholesale vendor procurement & credit terms"
        maxWidth="lg"
      >
        <form onSubmit={handleSaveSupplier} className="space-y-4">
          <Input
            label="Supplier / Distributor Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. UltraTech Cement Regional Depot"
            required
          />

          <Input
            label="Company Legal Entity"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="e.g. UltraTech Cement Ltd (Patna C&F)"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Contact Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 612 2234567"
              required
            />
            <Input
              label="GST Number"
              value={gstNumber}
              onChange={(e) => setGstNumber(e.target.value)}
              placeholder="10AAACU1234F1Z5"
            />
          </div>

          <Input
            label="Yard / Depot Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Fatuha Industrial Area, Patna"
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-concrete-200">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="yellow">
              Save Supplier
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
