import React, { useState } from 'react';
import { UserCheck, Plus, Search, Phone, Mail, IndianRupee, Shield, Edit2, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { Employee } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';

export const EmployeesPage: React.FC = () => {
  const { employees, addEmployee } = useApp();
  const toast = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [role, setRole] = useState('Yard Assistant & Loader');
  const [department, setDepartment] = useState<'Operations' | 'Sales' | 'Logistics' | 'Finance' | 'Warehouse'>('Warehouse');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [basicSalary, setBasicSalary] = useState('18000');

  const filteredEmployees = employees.filter((e) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return e.name.toLowerCase().includes(q) || e.role.toLowerCase().includes(q) || e.phone.includes(q);
    }
    return true;
  });

  const totalMonthlyPayroll = employees.reduce((acc, e) => acc + e.basicSalary, 0);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Employee name is required');
      return;
    }
    const base = parseFloat(basicSalary) || 16000;
    const today = new Date().toISOString().split('T')[0];

    addEmployee({
      name,
      role,
      department,
      phone: phone || '+91 90000 00000',
      email,
      basicSalary: base,
      dailyWageRate: Math.round(base / 30),
      joinDate: today,
      status: 'Active',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    });

    toast.success('Employee Registered', `${name} added to staff directory.`);
    setModalOpen(false);
    setName('');
    setPhone('');
    setEmail('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-concrete-200 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-charcoal-900 tracking-tight">
              Staff & Employee Directory
            </h1>
            <Badge variant="yellow" size="sm">
              {employees.length} Staff
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
            Total Monthly Payroll Commitment: <strong className="text-charcoal-950">₹{totalMonthlyPayroll.toLocaleString('en-IN')}</strong> / month
          </p>
        </div>

        <Button
          variant="yellow"
          size="sm"
          onClick={() => setModalOpen(true)}
          icon={<Plus className="w-4 h-4 stroke-[3]" />}
        >
          + Add Employee
        </Button>
      </div>

      {/* Employees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEmployees.map((emp) => (
          <Card key={emp.id} hoverable className="p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <img
                    src={emp.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                    alt={emp.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-yellow-brand shadow-xs"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-charcoal-900">{emp.name}</h3>
                    <p className="text-xs text-charcoal-500 font-semibold">{emp.role}</p>
                    <span className="inline-block text-[10px] bg-concrete-100 font-semibold text-charcoal-600 px-1.5 py-0.2 rounded mt-0.5">
                      {emp.department}
                    </span>
                  </div>
                </div>

                <Badge variant={emp.status === 'Active' ? 'active' : 'inactive'} size="sm">
                  {emp.status}
                </Badge>
              </div>

              <div className="mt-3 p-3 bg-concrete-50 rounded-xl border border-concrete-200 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-charcoal-500">Base Salary:</span>
                  <span className="font-bold text-charcoal-900 font-mono">₹{emp.basicSalary.toLocaleString('en-IN')}/mo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-500">Daily Wage Equivalent:</span>
                  <span className="font-mono text-charcoal-700">₹{emp.dailyWageRate}/day</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-500">Joined:</span>
                  <span className="text-charcoal-700">{emp.joinDate}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-concrete-100 flex items-center justify-between text-xs">
              <a
                href={`tel:${emp.phone}`}
                className="inline-flex items-center gap-1 text-charcoal-700 hover:text-charcoal-950 font-semibold"
              >
                <Phone className="w-3.5 h-3.5 text-charcoal-400" />
                <span>{emp.phone}</span>
              </a>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Verified
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Employee Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Register New Employee / Staff Member"
        subtitle="Adds employee to monthly payroll, daily attendance & yard shifts"
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Ramesh Yadav"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Designation / Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Heavy Truck Driver (Tata Signa)"
              required
            />
            <Select
              label="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value as any)}
            >
              <option value="Logistics">Logistics & Fleet</option>
              <option value="Sales">Sales & Operations</option>
              <option value="Warehouse">Warehouse & Yard</option>
              <option value="Finance">Finance & Accounts</option>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 94312 33445"
              required
            />
            <Input
              label="Email (Optional)"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="staff@kishorconstruction.com"
            />
          </div>

          <Input
            label="Monthly Base Salary (₹)"
            type="number"
            value={basicSalary}
            onChange={(e) => setBasicSalary(e.target.value)}
            required
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-concrete-200">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="yellow">
              Register Employee
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
