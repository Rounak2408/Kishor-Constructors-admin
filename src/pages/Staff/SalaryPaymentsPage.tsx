import React, { useState, useMemo } from 'react';
import {
  IndianRupee,
  CheckCircle2,
  Printer,
  Calendar,
  UserCheck,
  Building,
  CreditCard,
  FileSpreadsheet,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { SalaryPayment } from '../../types';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Select } from '../../components/ui/Select';

export const SalaryPaymentsPage: React.FC = () => {
  const { salaryPayments, paySalary, employees } = useApp();
  const toast = useToast();

  const [selectedMonth, setSelectedMonth] = useState('2026-08');
  const [selectedPayslip, setSelectedPayslip] = useState<SalaryPayment | null>(null);

  const filteredSalaries = useMemo(() => {
    return salaryPayments.filter((s) => s.month === selectedMonth);
  }, [salaryPayments, selectedMonth]);

  const totalDisbursed = useMemo(
    () => filteredSalaries.reduce((acc, s) => acc + s.finalPay, 0),
    [filteredSalaries]
  );
  const totalOvertimePaid = useMemo(
    () => filteredSalaries.reduce((acc, s) => acc + s.overtimePay, 0),
    [filteredSalaries]
  );

  const handleMarkPaid = (id: string, empName: string) => {
    paySalary(id, 'Bank Transfer');
    toast.success('Salary Paid', `Disbursed August salary for ${empName}.`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-concrete-200 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-charcoal-900 tracking-tight">
              Monthly Salary & Payroll Management
            </h1>
            <Badge variant="yellow" size="sm">
              Month: {selectedMonth}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
            Total Disbursed Payroll: <strong className="text-charcoal-950">₹{totalDisbursed.toLocaleString('en-IN')}</strong> (Overtime: <span className="text-emerald-700 font-bold">₹{totalOvertimePaid.toLocaleString('en-IN')}</span>)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="2026-08">August 2026 Payroll</option>
            <option value="2026-07">July 2026 Payroll</option>
            <option value="2026-06">June 2026 Payroll</option>
          </Select>
        </div>
      </div>

      {/* Salary Table */}
      <Card>
        <CardHeader
          title={`Staff Payroll Sheet — ${selectedMonth}`}
          subtitle="Basic + Overtime - Advance Deductions = Net Final Pay"
        />
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-concrete-200 bg-concrete-50/70 text-charcoal-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="px-5 py-3">Employee Name</th>
                <th className="px-3 py-3">Role</th>
                <th className="px-3 py-3 text-right">Base Salary</th>
                <th className="px-3 py-3 text-center">Days (Pres/Tot)</th>
                <th className="px-3 py-3 text-right">OT Pay</th>
                <th className="px-3 py-3 text-right">Advance Ded.</th>
                <th className="px-3 py-3 text-right">Bonus</th>
                <th className="px-3 py-3 text-right">Final Pay</th>
                <th className="px-3 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Payslip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-concrete-200">
              {filteredSalaries.map((sal) => (
                <tr key={sal.id} className="hover:bg-concrete-50/60 transition-colors">
                  <td className="px-5 py-3 font-bold text-charcoal-900">{sal.employeeName}</td>
                  <td className="px-3 py-3 text-charcoal-600">{sal.role}</td>
                  <td className="px-3 py-3 text-right font-mono font-medium text-charcoal-700">
                    ₹{sal.basicSalary.toLocaleString('en-IN')}
                  </td>
                  <td className="px-3 py-3 text-center font-mono">
                    <span className="font-bold text-charcoal-900">{sal.presentDays}</span>/{sal.workingDays}
                  </td>
                  <td className="px-3 py-3 text-right font-mono font-bold text-emerald-700">
                    {sal.overtimePay > 0 ? `+₹${sal.overtimePay}` : '₹0'}
                  </td>
                  <td className="px-3 py-3 text-right font-mono font-bold text-rose-600">
                    {sal.advanceDeduction > 0 ? `-₹${sal.advanceDeduction}` : '₹0'}
                  </td>
                  <td className="px-3 py-3 text-right font-mono font-medium text-charcoal-700">
                    {sal.bonus > 0 ? `+₹${sal.bonus}` : '₹0'}
                  </td>
                  <td className="px-3 py-3 text-right font-mono font-extrabold text-charcoal-950 text-sm">
                    ₹{sal.finalPay.toLocaleString('en-IN')}
                  </td>
                  <td className="px-3 py-3 text-center">
                    <Badge variant={sal.status === 'Paid' ? 'paid' : 'due'} size="sm">
                      {sal.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      {sal.status !== 'Paid' && (
                        <button
                          onClick={() => handleMarkPaid(sal.id, sal.employeeName)}
                          className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-[11px]"
                        >
                          Mark Paid
                        </button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedPayslip(sal)}
                        className="text-xs py-1 px-2"
                      >
                        Payslip
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Printable Payslip Modal */}
      {selectedPayslip && (
        <Modal
          isOpen={Boolean(selectedPayslip)}
          onClose={() => setSelectedPayslip(null)}
          title="Staff Salary Voucher / Payslip"
          subtitle={`Disbursement Month: ${selectedPayslip.month}`}
          maxWidth="lg"
          footer={
            <div className="flex items-center justify-between w-full">
              <Button variant="outline" size="sm" onClick={() => setSelectedPayslip(null)}>
                Close
              </Button>
              <Button
                variant="yellow"
                size="sm"
                onClick={() => window.print()}
                icon={<Printer className="w-4 h-4" />}
              >
                Print Salary Voucher
              </Button>
            </div>
          }
        >
          <div className="p-6 bg-white border border-concrete-300 rounded-xl space-y-4 text-xs font-sans print-only text-charcoal-900">
            <div className="flex items-start justify-between border-b border-concrete-300 pb-3">
              <div>
                <h3 className="font-extrabold text-sm text-charcoal-950">KISHOR CONSTRUCTION</h3>
                <p className="text-charcoal-500">Employee Salary Slip — {selectedPayslip.month}</p>
              </div>
              <div className="text-right">
                <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {selectedPayslip.status} ({selectedPayslip.paymentMethod || 'NEFT'})
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 bg-concrete-50 rounded-lg border border-concrete-200">
              <div>
                <span className="text-[10px] text-charcoal-500 uppercase font-bold block">Employee</span>
                <p className="font-bold text-charcoal-900 text-sm mt-0.5">{selectedPayslip.employeeName}</p>
                <p className="text-charcoal-600">{selectedPayslip.role}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-charcoal-500 uppercase font-bold block">Days Clocked</span>
                <p className="font-bold text-charcoal-900 text-sm mt-0.5">
                  {selectedPayslip.presentDays} / {selectedPayslip.workingDays} Days
                </p>
                <p className="text-charcoal-600">OT: {selectedPayslip.overtimeHours} Hours</p>
              </div>
            </div>

            <div className="border border-concrete-200 rounded-lg overflow-hidden">
              <div className="grid grid-cols-2 p-2.5 bg-concrete-100 font-bold uppercase text-[10px] text-charcoal-600">
                <span>Earnings / Deductions</span>
                <span className="text-right">Amount (₹)</span>
              </div>
              <div className="p-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-charcoal-700">Basic Monthly Base Salary:</span>
                  <span className="font-mono font-semibold">₹{selectedPayslip.basicSalary.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Overtime Pay ({selectedPayslip.overtimeHours} hrs):</span>
                  <span className="font-mono">+₹{selectedPayslip.overtimePay.toLocaleString('en-IN')}</span>
                </div>
                {selectedPayslip.bonus > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Performance Incentive / Bonus:</span>
                    <span className="font-mono">+₹{selectedPayslip.bonus.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {selectedPayslip.advanceDeduction > 0 && (
                  <div className="flex justify-between text-rose-600 font-semibold">
                    <span>Advance Taken Deduction:</span>
                    <span className="font-mono">-₹{selectedPayslip.advanceDeduction.toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>
              <div className="p-3 bg-concrete-50 border-t border-concrete-200 flex justify-between font-extrabold text-sm text-charcoal-950">
                <span>Net Disbursed Pay:</span>
                <span className="font-mono text-base">₹{selectedPayslip.finalPay.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="pt-8 flex items-center justify-between text-[11px] text-charcoal-500">
              <div>
                <div className="w-28 border-b border-charcoal-400 mb-1" />
                <span>Employee Signature</span>
              </div>
              <div className="text-right">
                <div className="w-28 border-b border-charcoal-400 mb-1 ml-auto" />
                <span>Kishor Construction Cashier</span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
