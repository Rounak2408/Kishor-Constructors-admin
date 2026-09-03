import React, { useState } from 'react';
import { Wrench, Plus, Search, IndianRupee, Calendar, Truck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { VehicleExpense } from '../../types';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';

export const VehicleExpensesPage: React.FC = () => {
  const { vehicleExpenses, vehicles, addVehicleExpense } = useApp();
  const toast = useToast();

  const [isModalOpen, setModalOpen] = useState(false);
  const [vehicleId, setVehicleId] = useState(vehicles[0]?.id || '');
  const [category, setCategory] = useState<VehicleExpense['category']>('Routine Service');
  const [amount, setAmount] = useState('12000');
  const [workshopName, setWorkshopName] = useState('Tata Authorized Commercial Workshop, Patna');
  const [invoiceNo, setInvoiceNo] = useState('WRK-2026-901');
  const [notes, setNotes] = useState('Engine oil, air filters & greasing');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount) || 0;
    const veh = vehicles.find((v) => v.id === vehicleId);
    const today = new Date().toISOString().split('T')[0];

    addVehicleExpense({
      vehicleId,
      vehicleNumber: veh?.vehicleNumber || 'BR-01-GB-4590',
      date: today,
      category,
      amount: amt,
      workshopName,
      invoiceNo,
      notes,
    });

    toast.success('Vehicle Expense Logged', `₹${amt.toLocaleString('en-IN')} recorded for ${veh?.vehicleNumber}.`);
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-concrete-200 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-charcoal-900 tracking-tight">
              Vehicle Maintenance & Repairs
            </h1>
            <Badge variant="yellow" size="sm">
              Fleet Upkeep
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
            Track routine servicing, tyre replacements, fitness certificate renewals, and garage workshop invoices.
          </p>
        </div>

        <Button
          variant="yellow"
          size="sm"
          onClick={() => setModalOpen(true)}
          icon={<Plus className="w-4 h-4 stroke-[3]" />}
        >
          + Record Service Expense
        </Button>
      </div>

      {/* Expenses Table */}
      <Card>
        <CardHeader
          title="Maintenance & Repair History"
          subtitle="All costs are integrated into operating expense accounting"
        />
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-concrete-200 bg-concrete-50/70 text-charcoal-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="px-5 py-3">Date</th>
                <th className="px-4 py-3">Vehicle #</th>
                <th className="px-3 py-3">Service Category</th>
                <th className="px-3 py-3 text-right">Amount (₹)</th>
                <th className="px-4 py-3">Workshop / Garage</th>
                <th className="px-4 py-3">Bill / Invoice #</th>
                <th className="px-4 py-3">Details / Parts Replaced</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-concrete-200">
              {vehicleExpenses.map((ve) => (
                <tr key={ve.id} className="hover:bg-concrete-50/60 transition-colors">
                  <td className="px-5 py-3 font-mono text-charcoal-600 whitespace-nowrap">{ve.date}</td>
                  <td className="px-4 py-3 font-mono font-bold text-charcoal-900">{ve.vehicleNumber}</td>
                  <td className="px-3 py-3">
                    <span className="inline-block text-[10px] font-bold bg-concrete-100 text-charcoal-800 px-2 py-0.5 rounded border border-concrete-300">
                      {ve.category}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right font-mono font-extrabold text-charcoal-950">
                    ₹{ve.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3 text-charcoal-700 font-medium">{ve.workshopName}</td>
                  <td className="px-4 py-3 font-mono text-charcoal-500">{ve.invoiceNo || '—'}</td>
                  <td className="px-4 py-3 text-charcoal-600 truncate max-w-xs">{ve.notes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Maintenance Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Record Vehicle Maintenance / Repair"
        subtitle="Applies to fleet maintenance ledger and operating expense accounts"
        maxWidth="md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Select
            label="Select Vehicle"
            value={vehicleId}
            onChange={(e) => setVehicleId(e.target.value)}
            required
          >
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.vehicleNumber} ({v.model})
              </option>
            ))}
          </Select>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Service Category"
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
            >
              <option value="Routine Service">Routine Engine Service</option>
              <option value="Tyre Replacement">Tyre Replacement</option>
              <option value="Insurance / Fitness">Fitness / Tax / Permit</option>
              <option value="Emergency Repair">Emergency Breakdown</option>
              <option value="Toll / Permit">Toll & Highway Permit</option>
            </Select>

            <Input
              label="Amount (₹)"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Workshop Name"
              value={workshopName}
              onChange={(e) => setWorkshopName(e.target.value)}
              required
            />
            <Input
              label="Workshop Invoice #"
              value={invoiceNo}
              onChange={(e) => setInvoiceNo(e.target.value)}
            />
          </div>

          <Input
            label="Work Remarks / Parts Replaced"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Engine oil 15W40, 2 radial tyres replaced..."
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-concrete-200">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="yellow">
              Record Maintenance
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
