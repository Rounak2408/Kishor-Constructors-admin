import React, { useState } from 'react';
import { Calendar, Plus, UserCheck, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { HolidayLeave } from '../../types';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';

export const HolidaysLeavesPage: React.FC = () => {
  const { holidaysLeaves, employees, addHolidayLeave } = useApp();
  const toast = useToast();

  const [isModalOpen, setModalOpen] = useState(false);
  const [type, setType] = useState<'Holiday' | 'Employee Leave'>('Holiday');
  const [title, setTitle] = useState('');
  const [employeeId, setEmployeeId] = useState(employees[0]?.id || '');
  const [startDate, setStartDate] = useState('2026-09-17');
  const [endDate, setEndDate] = useState('2026-09-17');
  const [daysCount, setDaysCount] = useState('1');
  const [reason, setReason] = useState('');

  const holidays = holidaysLeaves.filter((h) => h.type === 'Holiday');
  const leaves = holidaysLeaves.filter((h) => h.type === 'Employee Leave');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }
    const emp = employees.find((e) => e.id === employeeId);

    addHolidayLeave({
      title,
      type,
      employeeId: type === 'Employee Leave' ? employeeId : undefined,
      employeeName: type === 'Employee Leave' ? emp?.name : undefined,
      startDate,
      endDate,
      daysCount: parseInt(daysCount) || 1,
      reason,
      status: 'Approved',
    });

    toast.success('Scheduled Successfully', `${title} logged in calendar.`);
    setModalOpen(false);
    setTitle('');
    setReason('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-concrete-200 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-charcoal-900 tracking-tight">
              Holidays & Employee Leaves Calendar
            </h1>
            <Badge variant="yellow" size="sm">
              Bihar Festival & Yard Schedule
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
            Manage official gazetted business holidays, festival shutdown dates, and staff leave approvals.
          </p>
        </div>

        <Button
          variant="yellow"
          size="sm"
          onClick={() => setModalOpen(true)}
          icon={<Plus className="w-4 h-4 stroke-[3]" />}
        >
          + Add Holiday / Leave
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Official Yard Holidays */}
        <Card>
          <CardHeader
            title="Official Gazetted & Festival Holidays"
            subtitle="Yard operations closed on these major festival dates"
          />
          <CardContent className="space-y-3">
            {holidays.map((h) => (
              <div
                key={h.id}
                className="p-4 bg-concrete-50 rounded-xl border border-concrete-200 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-charcoal-900">{h.title}</span>
                    <span className="text-[10px] font-bold text-yellow-dark bg-yellow-light px-2 py-0.2 rounded border border-yellow-brand/30">
                      {h.daysCount} {h.daysCount === 1 ? 'Day' : 'Days'}
                    </span>
                  </div>
                  <p className="text-xs text-charcoal-500 mt-1">{h.reason}</p>
                  <p className="text-[11px] font-mono font-semibold text-charcoal-700 mt-1.5 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-charcoal-400" />
                    {h.startDate} {h.startDate !== h.endDate ? `to ${h.endDate}` : ''}
                  </p>
                </div>
                <Badge variant="healthy" size="sm">
                  Approved
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Employee Leave Requests */}
        <Card>
          <CardHeader
            title="Staff Leaves & Absences"
            subtitle="Individual approved leave records"
          />
          <CardContent className="space-y-3">
            {leaves.map((l) => (
              <div
                key={l.id}
                className="p-4 bg-concrete-50 rounded-xl border border-concrete-200 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-charcoal-900">{l.employeeName}</span>
                    <span className="text-[10px] text-charcoal-500 font-medium">({l.daysCount} Days)</span>
                  </div>
                  <p className="text-xs text-charcoal-500 mt-0.5">{l.reason || l.title}</p>
                  <p className="text-[11px] font-mono font-semibold text-charcoal-700 mt-1.5 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-charcoal-400" />
                    {l.startDate} to {l.endDate}
                  </p>
                </div>
                <Badge variant="blue" size="sm">
                  {l.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Add Holiday / Leave Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Schedule Holiday or Staff Leave"
        subtitle="Applies to staff working days and automated salary computations"
        maxWidth="md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Select
            label="Entry Type"
            value={type}
            onChange={(e) => setType(e.target.value as any)}
          >
            <option value="Holiday">Official Business / Festival Holiday</option>
            <option value="Employee Leave">Employee Leave Request</option>
          </Select>

          <Input
            label={type === 'Holiday' ? 'Holiday Title / Festival' : 'Leave Reason Title'}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={type === 'Holiday' ? 'e.g. Chhath Puja' : 'e.g. Medical / Family Leave'}
            required
          />

          {type === 'Employee Leave' && (
            <Select
              label="Select Employee"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              required
            >
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.role})
                </option>
              ))}
            </Select>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
            <Input
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>

          <Input
            label="Total Days Count"
            type="number"
            min="1"
            value={daysCount}
            onChange={(e) => setDaysCount(e.target.value)}
            required
          />

          <Input
            label="Notes / Reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Authorized remarks..."
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-concrete-200">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="yellow">
              Schedule Entry
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
