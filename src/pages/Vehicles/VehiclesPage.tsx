import React, { useState } from 'react';
import { Truck, Plus, Gauge, Fuel, Wrench, UserCheck, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { Vehicle } from '../../types';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';

export const VehiclesPage: React.FC = () => {
  const { vehicles, employees, addVehicle, setActivePage } = useApp();
  const toast = useToast();

  const [isModalOpen, setModalOpen] = useState(false);
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [model, setModel] = useState('');
  const [type, setType] = useState<Vehicle['type']>('Tipper');
  const [driverId, setDriverId] = useState(employees[1]?.id || '');
  const [fuelCapacity, setFuelCapacity] = useState('200');
  const [efficiency, setEfficiency] = useState('4.0');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleNumber.trim()) {
      toast.error('Vehicle Number is required');
      return;
    }
    const driver = employees.find((e) => e.id === driverId);

    addVehicle({
      vehicleNumber,
      model: model || `${type} Transport Unit`,
      type,
      driverId,
      driverName: driver?.name,
      status: 'Active',
      totalKm: 10000,
      currentOdometer: 10000,
      fuelCapacityLitres: parseFloat(fuelCapacity) || 100,
      averageFuelEfficiencyKmPerL: parseFloat(efficiency) || 4.0,
      lastServiceDate: new Date().toISOString().split('T')[0],
    });

    toast.success('Vehicle Registered', `${vehicleNumber} added to fleet.`);
    setModalOpen(false);
    setVehicleNumber('');
    setModel('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-concrete-200 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-charcoal-900 tracking-tight">
              Fleet & Commercial Transport Management
            </h1>
            <Badge variant="yellow" size="sm">
              {vehicles.length} Commercial Units
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
            Heavy dumpers, tippers, pickup trucks, and tractors for sand, stone & cement delivery dispatch.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActivePage('fuel')}
            icon={<Fuel className="w-4 h-4 text-yellow-dark" />}
          >
            Diesel Logs
          </Button>
          <Button
            variant="yellow"
            size="sm"
            onClick={() => setModalOpen(true)}
            icon={<Plus className="w-4 h-4 stroke-[3]" />}
          >
            + Add Vehicle
          </Button>
        </div>
      </div>

      {/* Fleet Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {vehicles.map((v) => (
          <Card key={v.id} hoverable className="p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="w-9 h-9 rounded-lg bg-yellow-light border border-yellow-brand/30 flex items-center justify-center text-charcoal-950 font-bold">
                  <Truck className="w-4 h-4 text-yellow-dark" />
                </div>
                <Badge variant={v.status === 'Active' ? 'healthy' : 'partial'} size="sm">
                  {v.status}
                </Badge>
              </div>

              <h3 className="text-sm font-extrabold text-charcoal-900 font-mono tracking-tight">{v.vehicleNumber}</h3>
              <p className="text-xs text-charcoal-500 mt-0.5 font-medium">{v.model}</p>
              <span className="inline-block text-[10px] bg-concrete-100 font-bold text-charcoal-600 px-2 py-0.5 rounded mt-1.5">
                {v.type}
              </span>

              <div className="mt-4 p-3 bg-concrete-50 rounded-xl border border-concrete-200 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-charcoal-500">Current Odometer:</span>
                  <span className="font-bold text-charcoal-900 font-mono">{v.currentOdometer.toLocaleString()} KM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-500">Avg Mileage:</span>
                  <span className="font-bold text-emerald-700 font-mono">{v.averageFuelEfficiencyKmPerL} KM/L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-500">Assigned Driver:</span>
                  <span className="font-semibold text-charcoal-800">{v.driverName || 'Rotational'}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-concrete-100 flex items-center justify-between text-xs">
              <span className="text-charcoal-500 text-[11px]">Tank: {v.fuelCapacityLitres}L</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActivePage('fuel')}
                className="text-[11px] py-1 px-2"
              >
                Log Fuel
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Vehicle Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Commercial Vehicle / Machinery"
        subtitle="Track logistics trips, diesel expenses and maintenance intervals"
        maxWidth="md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Vehicle Registration Number"
            value={vehicleNumber}
            onChange={(e) => setVehicleNumber(e.target.value)}
            placeholder="e.g. BR-01-GB-4590"
            required
          />

          <Input
            label="Make & Model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="e.g. Tata Signa 2823.K Tipper (10 Wheeler)"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Vehicle Category"
              value={type}
              onChange={(e) => setType(e.target.value as any)}
            >
              <option value="Tipper">Heavy Tipper (10W/12W)</option>
              <option value="Pickup 4x4">Pickup (Bolero/Maxi)</option>
              <option value="Tractor Trailer">Tractor Trailer</option>
              <option value="Site Loader">JCB / Site Loader</option>
              <option value="Heavy Truck">Heavy Truck</option>
            </Select>

            <Select
              label="Default Driver"
              value={driverId}
              onChange={(e) => setDriverId(e.target.value)}
            >
              <option value="">-- Rotational / Unassigned --</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.role})
                </option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Fuel Tank Capacity (L)"
              type="number"
              value={fuelCapacity}
              onChange={(e) => setFuelCapacity(e.target.value)}
            />
            <Input
              label="Avg Efficiency (KM/L)"
              type="number"
              step="0.1"
              value={efficiency}
              onChange={(e) => setEfficiency(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-concrete-200">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="yellow">
              Register Vehicle
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
