import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Calendar,
  Filter,
  BarChart3,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';

type ReportType =
  | 'sales'
  | 'purchases'
  | 'stock'
  | 'attendance'
  | 'payroll'
  | 'fleet'
  | 'expenses'
  | 'profit-loss';

const REPORT_TYPES: { key: ReportType; label: string; description: string }[] = [
  { key: 'sales', label: 'Sales Report', description: 'All invoices, revenue by customer, and payment methods.' },
  { key: 'purchases', label: 'Purchases Report', description: 'Supplier purchase orders, cost and payables.' },
  { key: 'stock', label: 'Stock & Inventory Report', description: 'Current stock, low stock items, and movement log.' },
  { key: 'attendance', label: 'Attendance Report', description: 'Staff attendance, working hours and overtime.' },
  { key: 'payroll', label: 'Payroll Report', description: 'Monthly salary disbursements and deductions.' },
  { key: 'fleet', label: 'Fleet & Fuel Report', description: 'Diesel consumption, cost/km, and maintenance costs.' },
  { key: 'expenses', label: 'Operating Expenses Report', description: 'Category-wise operating expense breakdown.' },
  { key: 'profit-loss', label: 'Profit & Loss Statement', description: 'Revenue − COGS = Gross Profit; OPEX deductions.' },
];

export const ReportsHubPage: React.FC = () => {
  const {
    sales,
    purchases,
    products,
    attendance,
    salaryPayments,
    fuelEntries,
    expenses,
  } = useApp();
  const toast = useToast();

  const [selectedReport, setSelectedReport] = useState<ReportType>('sales');
  const [fromDate, setFromDate] = useState('2026-08-01');
  const [toDate, setToDate] = useState('2026-08-31');

  const handleExportCSV = () => {
    let csvContent = '';
    const report = REPORT_TYPES.find((r) => r.key === selectedReport);

    switch (selectedReport) {
      case 'sales':
        csvContent = 'Invoice #,Date,Customer,Total,Payment Method,Status\n';
        sales.forEach((s) => {
          csvContent += `${s.invoiceNo},${s.createdAt.split(' ')[0]},"${s.customerName}",${s.totalAmount},${s.paymentMethod},${s.paymentStatus}\n`;
        });
        break;
      case 'purchases':
        csvContent = 'Bill #,Date,Supplier,Total,Payment Status\n';
        purchases.forEach((p) => {
          csvContent += `${p.billNo},${p.date},"${p.supplierName}",${p.totalAmount},${p.paymentStatus}\n`;
        });
        break;
      case 'stock':
        csvContent = 'Product,Brand,Category,Stock,Unit,Purchase Price,Selling Price\n';
        products.forEach((p) => {
          csvContent += `"${p.name}","${p.brandName}","${p.categoryName}",${p.currentStock},${p.unit},${p.purchasePrice},${p.sellingPrice}\n`;
        });
        break;
      case 'attendance':
        csvContent = 'Date,Employee,Status,Check-In,Check-Out,Hours,Overtime\n';
        attendance.forEach((a) => {
          csvContent += `${a.date},"${a.employeeName}",${a.status},${a.checkIn || '-'},${a.checkOut || '-'},${a.workingHours},${a.overtimeHours}\n`;
        });
        break;
      case 'payroll':
        csvContent = 'Month,Employee,Role,Basic,OT Pay,Deductions,Bonus,Final Pay,Status\n';
        salaryPayments.forEach((s) => {
          csvContent += `${s.month},"${s.employeeName}","${s.role}",${s.basicSalary},${s.overtimePay},${s.advanceDeduction},${s.bonus},${s.finalPay},${s.status}\n`;
        });
        break;
      case 'fleet':
        csvContent = 'Date,Vehicle,Litres,Rate,Total Cost,Odometer,Station\n';
        fuelEntries.forEach((f) => {
          csvContent += `${f.date},${f.vehicleNumber},${f.litres},${f.fuelRatePerLitre},${f.totalCost},${f.odometerReading},"${f.fuelStation}"\n`;
        });
        break;
      case 'expenses':
        csvContent = 'Date,Category,Amount,Paid To,Payment Method,Description\n';
        expenses.forEach((e) => {
          csvContent += `${e.date},"${e.category}",${e.amount},"${e.paidTo}",${e.paymentMethod},"${e.description}"\n`;
        });
        break;
      default:
        csvContent = 'Report not yet available for export.';
    }

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kishor_construction_${selectedReport}_report_${fromDate}_${toDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV Exported', `${report?.label} downloaded successfully.`);
  };

  const handlePrint = () => {
    window.print();
    toast.info('Print Triggered', 'Use browser print dialog to save as PDF or send to printer.');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-concrete-200 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-charcoal-900 tracking-tight">
              Reports Hub — Export & Print Center
            </h1>
            <Badge variant="yellow" size="sm">
              8 Report Types
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
            Generate, filter and export business reports as CSV or print as PDF for accounting and compliance.
          </p>
        </div>
      </div>

      {/* Report Type Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {REPORT_TYPES.map((rt) => (
          <button
            key={rt.key}
            onClick={() => setSelectedReport(rt.key)}
            className={`p-4 rounded-xl border text-left transition-all ${
              selectedReport === rt.key
                ? 'bg-charcoal-900 text-white border-charcoal-900 shadow-lg'
                : 'bg-white text-charcoal-900 border-concrete-200 hover:border-charcoal-400'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className={`w-4 h-4 ${selectedReport === rt.key ? 'text-yellow-brand' : 'text-charcoal-400'}`} />
              <span className="text-xs font-bold">{rt.label}</span>
            </div>
            <p className={`text-[10px] leading-relaxed ${selectedReport === rt.key ? 'text-charcoal-300' : 'text-charcoal-500'}`}>
              {rt.description}
            </p>
          </button>
        ))}
      </div>

      {/* Filters & Actions */}
      <Card className="p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
          <div className="grid grid-cols-2 gap-3 flex-1">
            <Input
              label="From Date"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
            <Input
              label="To Date"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              icon={<Printer className="w-4 h-4" />}
            >
              Print / PDF
            </Button>
            <Button
              variant="yellow"
              size="sm"
              onClick={handleExportCSV}
              icon={<Download className="w-4 h-4" />}
            >
              Export CSV
            </Button>
          </div>
        </div>
      </Card>

      {/* Report Preview */}
      <Card className="print-only">
        <CardHeader
          title={REPORT_TYPES.find((r) => r.key === selectedReport)?.label || 'Report'}
          subtitle={`KISHOR CONSTRUCTION — Period: ${fromDate} to ${toDate}`}
        />
        <CardContent>
          <div className="p-6 bg-concrete-50 rounded-xl border border-concrete-200 text-center">
            <FileSpreadsheet className="w-12 h-12 text-charcoal-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-charcoal-800">
              {REPORT_TYPES.find((r) => r.key === selectedReport)?.label}
            </p>
            <p className="text-xs text-charcoal-500 mt-1 max-w-md mx-auto">
              {REPORT_TYPES.find((r) => r.key === selectedReport)?.description}
            </p>
            <div className="mt-4 text-xs text-charcoal-600">
              <p>
                Records available:{' '}
                <strong>
                  {selectedReport === 'sales'
                    ? sales.length
                    : selectedReport === 'purchases'
                    ? purchases.length
                    : selectedReport === 'stock'
                    ? products.length
                    : selectedReport === 'attendance'
                    ? attendance.length
                    : selectedReport === 'payroll'
                    ? salaryPayments.length
                    : selectedReport === 'fleet'
                    ? fuelEntries.length
                    : selectedReport === 'expenses'
                    ? expenses.length
                    : '—'}
                </strong>{' '}
                entries
              </p>
            </div>
            <div className="mt-4 flex items-center justify-center gap-3">
              <Button variant="yellow" size="sm" onClick={handleExportCSV} icon={<Download className="w-4 h-4" />}>
                Download CSV
              </Button>
              <Button variant="outline" size="sm" onClick={handlePrint} icon={<Printer className="w-4 h-4" />}>
                Print / PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
