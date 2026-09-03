import React, { useState } from 'react';
import { CalendarCheck, Clock, UserCheck, AlertCircle, CheckCircle2, UserX } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { AttendanceStatus } from '../../types';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { StatCard } from '../../components/ui/StatCard';

export const AttendancePage: React.FC = () => {
  const { employees, attendance, clockInOutEmployee } = useApp();
  const toast = useToast();

  const [selectedDate, setSelectedDate] = useState('2026-09-03');

  const presentCount = attendance.filter((a) => a.date === selectedDate && a.status === 'Present').length;
  const totalStaff = employees.length;
  const totalHoursWorked = attendance
    .filter((a) => a.date === selectedDate)
    .reduce((acc, a) => acc + a.workingHours, 0);
  const totalOvertime = attendance
    .filter((a) => a.date === selectedDate)
    .reduce((acc, a) => acc + a.overtimeHours, 0);

  const handleQuickStatus = (empId: string, status: AttendanceStatus) => {
    if (status === 'Present') {
      clockInOutEmployee(empId, 'Present', '08:30', '18:00');
      toast.success('Attendance Logged', `Marked Present (9.5 hrs)`);
    } else if (status === 'Half Day') {
      clockInOutEmployee(empId, 'Half Day', '08:30', '13:00');
      toast.info('Attendance Logged', `Marked Half Day (4.5 hrs)`);
    } else {
      clockInOutEmployee(empId, 'Absent', undefined, undefined);
      toast.warning('Attendance Logged', `Marked Absent`);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-concrete-200 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-charcoal-900 tracking-tight">
              Staff Attendance & Working Hours
            </h1>
            <Badge variant="yellow" size="sm">
              {presentCount}/{totalStaff} Present Today
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
            Track daily check-in, check-out, working hours and overtime for yard workers, drivers & accountants.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="text-xs font-bold rounded-lg border border-concrete-300 px-3 py-2 text-charcoal-900 focus:outline-none focus:border-charcoal-800"
          />
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Present Today"
          value={`${presentCount} / ${totalStaff}`}
          trend="up"
          trendValue="96% Rate"
          comparison="Yard fully staffed"
          icon={<UserCheck className="w-4 h-4 text-emerald-700" />}
        />
        <StatCard
          label="Total Hours Clocked"
          value={`${totalHoursWorked.toFixed(1)} Hrs`}
          trend="neutral"
          trendValue="Normal"
          comparison="Average 9.8 hrs/staff"
          icon={<Clock className="w-4 h-4 text-blue-700" />}
        />
        <StatCard
          label="Overtime Generated"
          value={`${totalOvertime.toFixed(1)} Hrs`}
          trend="up"
          trendValue="Dispatch Shift"
          comparison="Truck loading overtime"
          icon={<Clock className="w-4 h-4 text-amber-700" />}
        />
        <StatCard
          label="On Approved Leave"
          value={`${totalStaff - presentCount} Staff`}
          trend="neutral"
          trendValue="1 Medical"
          comparison="Pre-authorized leave"
          icon={<AlertCircle className="w-4 h-4 text-charcoal-600" />}
        />
      </div>

      {/* Attendance Grid / Table */}
      <Card>
        <CardHeader
          title={`Daily Attendance Sheet — ${selectedDate}`}
          subtitle="Real-time check-in time and calculated overtime"
        />
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-concrete-200 bg-concrete-50/70 text-charcoal-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="px-5 py-3">Employee Name</th>
                <th className="px-4 py-3">Designation / Role</th>
                <th className="px-3 py-3 text-center">Check-In</th>
                <th className="px-3 py-3 text-center">Check-Out</th>
                <th className="px-3 py-3 text-right">Total Hours</th>
                <th className="px-3 py-3 text-right">Overtime</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Quick Mark</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-concrete-200">
              {employees.map((emp) => {
                const record = attendance.find(
                  (a) => a.employeeId === emp.id && a.date === selectedDate
                );
                const status = record?.status || 'Absent';
                const hours = record?.workingHours || 0;
                const overtime = record?.overtimeHours || 0;

                return (
                  <tr key={emp.id} className="hover:bg-concrete-50/60 transition-colors">
                    <td className="px-5 py-3 font-bold text-charcoal-900">{emp.name}</td>
                    <td className="px-4 py-3 text-charcoal-600 font-medium">
                      {emp.role} ({emp.department})
                    </td>
                    <td className="px-3 py-3 text-center font-mono text-charcoal-700">
                      {record?.checkIn || '—'}
                    </td>
                    <td className="px-3 py-3 text-center font-mono text-charcoal-700">
                      {record?.checkOut || '—'}
                    </td>
                    <td className="px-3 py-3 text-right font-mono font-bold text-charcoal-900">
                      {hours > 0 ? `${hours} hrs` : '0 hrs'}
                    </td>
                    <td className="px-3 py-3 text-right font-mono font-bold text-amber-700">
                      {overtime > 0 ? `+${overtime} hrs` : '—'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge
                        variant={
                          status === 'Present'
                            ? 'healthy'
                            : status === 'Half Day'
                            ? 'partial'
                            : status === 'Leave'
                            ? 'blue'
                            : 'due'
                        }
                        size="sm"
                      >
                        {status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleQuickStatus(emp.id, 'Present')}
                          className="px-2 py-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200"
                        >
                          Present
                        </button>
                        <button
                          onClick={() => handleQuickStatus(emp.id, 'Half Day')}
                          className="px-2 py-1 text-[11px] font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded border border-amber-200"
                        >
                          Half Day
                        </button>
                        <button
                          onClick={() => handleQuickStatus(emp.id, 'Absent')}
                          className="px-2 py-1 text-[11px] font-bold text-rose-800 bg-rose-50 hover:bg-rose-100 rounded border border-rose-200"
                        >
                          Absent
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
