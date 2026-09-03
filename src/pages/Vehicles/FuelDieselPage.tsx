import React, { useState, useMemo } from 'react';
import { Fuel, Plus, Search, IndianRupee, Gauge, Calendar, Truck, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { FuelEntry } from '../../types';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { StatCard } from '../../components/ui/StatCard';
import { Modal } from '../../components/ui/Modal';

export const FuelDieselPage: React.FC = () => {
  const { fuelEntries, vehicles, addFuelEntry } = useApp();
  const toast = useToast();

  const [isModalOpen, setModalOpen] = useState(false);
  const [vehicleId, setVehicleId] = useState(vehicles[0]?.id || '');
  const [litres, setLitres] = useState('75');
  const [fuelRate, setFuelRate] = useState('94.20');
  const [odometer, setOdometer] = useState('48500');
  const [fuelStation, setFuelStation] = useState('Indian Oil Dealer, Saguna More');
  const [purpose, setPurpose] = useState('Sand transport from Koilwar & site deliveries');

  const totalLitres = useMemo(() => fuelEntries.reduce((acc, f) => acc + f.litres, 0), [fuelEntries]);
  const totalFuelCost = useMemo(() => fuelEntries.reduce((acc, f) => acc + f.totalCost, 0), [fuelEntries]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const l = parseFloat(litres) || 0;
    const rate = parseFloat(fuelRate) || 94.2;
    const odo = parseFloat(odometer) || 0;
    const totalCost = l * rate;
    const veh = vehicles.find((v) => v.id === vehicleId);
    const today = new Date().toISOString().split('T')[0];

    addFuelEntry({
      vehicleId,
      vehicleNumber: veh?.vehicleNumber || 'BR-01-GB-4590',
      date: today,
      litres: l,
      fuelRatePerLitre: rate,
      totalCost,
      odometerReading: odo,
      distanceCoveredKm: 250,
      fuelStation,
      purpose,
      filledByDriver: veh?.driverName || 'Driver',
    });

    toast.success('Diesel Entry Recorded', `Logged ${l}L (₹${totalCost.toLocaleString('en-IN')}) for ${veh?.vehicleNumber}.`);
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-concrete-200 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-charcoal-900 tracking-tight">
              Diesel & Fuel Management Logs
            </h1>
            <Badge variant="yellow" size="sm">
              Logistics Fuel Ledger
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
            Track litres filled, pump rates, odometer readings, and cost per KM across delivery fleet.
          </p>
        </div>

        <Button
          variant="yellow"
          size="sm"
          onClick={() => setModalOpen(true)}
          icon={<Plus className="w-4 h-4 stroke-[3]" />}
        >
          + Log Diesel Entry
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Diesel Consumed"
          value={`${totalLitres.toFixed(0)} Litres`}
          trend="neutral"
          trendValue="Active Logs"
          comparison="Heavy transport fleet"
          icon={<Fuel className="w-4 h-4 text-yellow-dark" />}
        />
        <StatCard
          label="Total Diesel Expense"
          value={`₹${totalFuelCost.toLocaleString('en-IN')}`}
          trend="neutral"
          trendValue="₹94.20 / Litre"
          comparison="Auto-synced to P&L"
          icon={<IndianRupee className="w-4 h-4 text-rose-700" />}
        />
        <StatCard
          label="Average Cost / KM"
          value="₹24.80 / KM"
          trend="down"
          trendValue="Efficient"
          comparison="Tipper & pickup average"
          icon={<Gauge className="w-4 h-4 text-emerald-700" />}
        />
        <StatCard
          label="Trips Covered"
          value="18 Delivery Runs"
          trend="up"
          trendValue="+4 Trips"
          comparison="Patna & Danapur routes"
          icon={<Truck className="w-4 h-4 text-blue-700" />}
        />
      </div>

      {/* Fuel Entries Table */}
      <Card>
        <CardHeader
          title="Fleet Fuel Fill-Up Log Book"
          subtitle="Detailed audit log of pump slips & odometer checkpoints"
        />
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-concrete-200 bg-concrete-50/70 text-charcoal-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="px-5 py-3">Date</th>
                <th className="px-4 py-3">Vehicle</th>
                <th className="px-3 py-3 text-right">Diesel Filled</th>
                <th className="px-3 py-3 text-right">Fuel Rate</th>
                <th className="px-3 py-3 text-right">Total Cost</th>
                <th className="px-3 py-3 text-right">Odometer KM</th>
                <th className="px-4 py-3">Petrol Pump / Station</th>
                <th className="px-4 py-3">Trip Purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-concrete-200">
              {fuelEntries.map((f) => (
                <tr key={f.id} className="hover:bg-concrete-50/60 transition-colors">
                  <td className="px-5 py-3 font-mono text-charcoal-600 whitespace-nowrap">{f.date}</td>

                  <td className="px-4 py-3 font-mono font-bold text-charcoal-900">{f.vehicleNumber}</td>

                  <td className="px-3 py-3 text-right font-mono font-bold text-charcoal-900">
                    {f.litres} L
                  </td>

                  <td className="px-3 py-3 text-right font-mono text-charcoal-600">
                    ₹{f.fuelRatePerLitre.toFixed(2)}
                  </td>

                  <td className="px-3 py-3 text-right font-mono font-extrabold text-charcoal-950">
                    ₹{f.totalCost.toLocaleString('en-IN')}
                  </td>

                  <td className="px-3 py-3 text-right font-mono text-charcoal-700">
                    {f.odometerReading.toLocaleString()} KM
                  </td>

                  <td className="px-4 py-3 text-charcoal-700 truncate max-w-xs">{f.fuelStation}</td>

                  <td className="px-4 py-3 text-charcoal-600 truncate max-w-xs">
                    {f.purpose} ({f.filledByDriver})
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Fuel Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Record Diesel / Fuel Fill-Up"
        subtitle="Automatically logs operating expense and updates vehicle odometer"
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            <Input
              label="Current Odometer (KM)"
              type="number"
              value={odometer}
              onChange={(e) => setOdometer(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Litres Filled"
              type="number"
              value={litres}
              onChange={(e) => setLitres(e.target.value)}
              required
            />
            <Input
              label="Rate / Litre (₹)"
              type="number"
              step="0.01"
              value={fuelRate}
              onChange={(e) => setFuelRate(e.target.value)}
              required
            />
            <div className="bg-concrete-100 p-2.5 rounded-lg border border-concrete-200 flex flex-col justify-center text-xs">
              <span className="text-[10px] uppercase font-bold text-charcoal-500">Calculated Cost</span>
              <span className="text-base font-extrabold text-charcoal-950 font-mono">
                ₹{((parseFloat(litres) || 0) * (parseFloat(fuelRate) || 0)).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Fuel Pump / Station"
              value={fuelStation}
              onChange={(e) => setFuelStation(e.target.value)}
            />
            <Input
              label="Trip Purpose / Route"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-concrete-200">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="yellow">
              Record Fuel Entry
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
