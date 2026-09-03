import React, { useState, useMemo } from 'react';
import {
  Wallet,
  TrendingUp,
  Plus,
  Search,
  IndianRupee,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { Expense, Income, ExpenseCategory, PaymentMethod } from '../../types';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';

export const IncomeExpensesPage: React.FC<{ defaultTab?: 'expenses' | 'income' }> = ({
  defaultTab = 'expenses',
}) => {
  const { expenses, incomes, addExpense, addIncome } = useApp();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState<'expenses' | 'income'>(defaultTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Add Expense Modal State
  const [isExpenseModalOpen, setExpenseModalOpen] = useState(false);
  const [expCategory, setExpCategory] = useState<ExpenseCategory>('Diesel');
  const [expAmount, setExpAmount] = useState('5000');
  const [expPaidTo, setExpPaidTo] = useState('');
  const [expPaymentMethod, setExpPaymentMethod] = useState<PaymentMethod>('UPI');
  const [expDescription, setExpDescription] = useState('');

  // Add Income Modal State
  const [isIncomeModalOpen, setIncomeModalOpen] = useState(false);
  const [incSource, setIncSource] = useState<Income['source']>('Product Sales');
  const [incAmount, setIncAmount] = useState('10000');
  const [incReceivedFrom, setIncReceivedFrom] = useState('');
  const [incPaymentMethod, setIncPaymentMethod] = useState<PaymentMethod>('UPI');
  const [incDescription, setIncDescription] = useState('');

  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          e.category.toLowerCase().includes(q) ||
          e.paidTo.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (selectedCategory !== 'all' && e.category !== selectedCategory) return false;
      return true;
    });
  }, [expenses, searchQuery, selectedCategory]);

  const filteredIncomes = useMemo(() => {
    return incomes.filter((inc) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          inc.source.toLowerCase().includes(q) ||
          inc.receivedFrom.toLowerCase().includes(q) ||
          inc.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [incomes, searchQuery]);

  const totalExpenseVal = useMemo(() => expenses.reduce((acc, e) => acc + e.amount, 0), [expenses]);
  const totalIncomeVal = useMemo(() => incomes.reduce((acc, i) => acc + i.amount, 0), [incomes]);

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(expAmount) || 0;
    const today = new Date().toISOString().split('T')[0];

    addExpense({
      date: today,
      category: expCategory,
      amount,
      paidTo: expPaidTo || 'Vendor',
      paymentMethod: expPaymentMethod,
      description: expDescription || `${expCategory} payment`,
    });

    toast.success('Expense Recorded', `₹${amount.toLocaleString('en-IN')} logged under ${expCategory}.`);
    setExpenseModalOpen(false);
  };

  const handleCreateIncome = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(incAmount) || 0;
    const today = new Date().toISOString().split('T')[0];

    addIncome({
      date: today,
      source: incSource,
      amount,
      receivedFrom: incReceivedFrom || 'Client',
      paymentMethod: incPaymentMethod,
      description: incDescription || `${incSource} received`,
    });

    toast.success('Income Recorded', `₹${amount.toLocaleString('en-IN')} logged under ${incSource}.`);
    setIncomeModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-concrete-200 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-charcoal-900 tracking-tight">
              Operating Expenses & Income Ledger
            </h1>
            <Badge variant="yellow" size="sm">
              Financial Records
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
            Total Logged Expenses: <strong className="text-rose-700">₹{totalExpenseVal.toLocaleString('en-IN')}</strong> | Other Income: <strong className="text-emerald-700">₹{totalIncomeVal.toLocaleString('en-IN')}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIncomeModalOpen(true)}
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            + Add Income
          </Button>
          <Button
            variant="yellow"
            size="sm"
            onClick={() => setExpenseModalOpen(true)}
            icon={<Plus className="w-4 h-4 stroke-[3]" />}
          >
            + Record Expense
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-concrete-200">
        <button
          onClick={() => setActiveTab('expenses')}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors ${
            activeTab === 'expenses'
              ? 'border-yellow-brand text-charcoal-950'
              : 'border-transparent text-charcoal-500 hover:text-charcoal-800'
          }`}
        >
          Operating Expenses ({expenses.length})
        </button>
        <button
          onClick={() => setActiveTab('income')}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors ${
            activeTab === 'income'
              ? 'border-yellow-brand text-charcoal-950'
              : 'border-transparent text-charcoal-500 hover:text-charcoal-800'
          }`}
        >
          Income & Collections ({incomes.length})
        </button>
      </div>

      {/* Filter Bar */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search description, beneficiary or reference..."
              className="w-full text-xs rounded-lg border border-concrete-300 pl-9 pr-3 py-2 text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-charcoal-800/10 focus:border-charcoal-800"
            />
          </div>

          {activeTab === 'expenses' && (
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Expense Categories</option>
              {[
                'Diesel',
                'Salary',
                'Electricity',
                'Rent',
                'Maintenance',
                'Transport & Freight',
                'Loading / Unloading',
                'Office & Admin',
                'Other',
              ].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          )}
        </div>
      </Card>

      {/* Expenses / Income Table */}
      <Card>
        {activeTab === 'expenses' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-concrete-200 bg-concrete-50/70 text-charcoal-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="px-5 py-3">Date</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-3 py-3 text-right">Amount (₹)</th>
                  <th className="px-4 py-3">Paid To (Beneficiary)</th>
                  <th className="px-3 py-3">Payment Method</th>
                  <th className="px-5 py-3">Description / Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-concrete-200">
                {filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-concrete-50/60 transition-colors">
                    <td className="px-5 py-3 font-mono text-charcoal-600 whitespace-nowrap">{exp.date}</td>
                    <td className="px-4 py-3">
                      <span className="inline-block text-[10px] font-bold bg-concrete-100 text-charcoal-800 px-2 py-0.5 rounded border border-concrete-200">
                        {exp.category}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right font-mono font-extrabold text-rose-700">
                      -₹{exp.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3 font-semibold text-charcoal-900">{exp.paidTo}</td>
                    <td className="px-3 py-3 text-charcoal-600 font-medium">{exp.paymentMethod}</td>
                    <td className="px-5 py-3 text-charcoal-600 truncate max-w-sm">{exp.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-concrete-200 bg-concrete-50/70 text-charcoal-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="px-5 py-3">Date</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-3 py-3 text-right">Amount (₹)</th>
                  <th className="px-4 py-3">Received From</th>
                  <th className="px-3 py-3">Payment Mode</th>
                  <th className="px-5 py-3">Description / Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-concrete-200">
                {filteredIncomes.map((inc) => (
                  <tr key={inc.id} className="hover:bg-concrete-50/60 transition-colors">
                    <td className="px-5 py-3 font-mono text-charcoal-600 whitespace-nowrap">{inc.date}</td>
                    <td className="px-4 py-3">
                      <span className="inline-block text-[10px] font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                        {inc.source}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right font-mono font-extrabold text-emerald-700">
                      +₹{inc.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3 font-semibold text-charcoal-900">{inc.receivedFrom}</td>
                    <td className="px-3 py-3 text-charcoal-600 font-medium">{inc.paymentMethod}</td>
                    <td className="px-5 py-3 text-charcoal-600 truncate max-w-sm">{inc.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Add Expense Modal */}
      <Modal
        isOpen={isExpenseModalOpen}
        onClose={() => setExpenseModalOpen(false)}
        title="Record Operating Expense"
        subtitle="Applies to Profit & Loss financial calculations"
        maxWidth="md"
      >
        <form onSubmit={handleCreateExpense} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Expense Category"
              value={expCategory}
              onChange={(e) => setExpCategory(e.target.value as ExpenseCategory)}
              required
            >
              {[
                'Diesel',
                'Salary',
                'Electricity',
                'Rent',
                'Maintenance',
                'Transport & Freight',
                'Loading / Unloading',
                'Office & Admin',
                'Other',
              ].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>

            <Input
              label="Amount (₹)"
              type="number"
              value={expAmount}
              onChange={(e) => setExpAmount(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Paid To (Vendor / Staff)"
              value={expPaidTo}
              onChange={(e) => setExpPaidTo(e.target.value)}
              placeholder="e.g. SBPDCL / Labour Group"
              required
            />
            <Select
              label="Payment Method"
              value={expPaymentMethod}
              onChange={(e) => setExpPaymentMethod(e.target.value as PaymentMethod)}
            >
              <option value="UPI">UPI</option>
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cheque">Cheque</option>
            </Select>
          </div>

          <Input
            label="Description / Purpose"
            value={expDescription}
            onChange={(e) => setExpDescription(e.target.value)}
            placeholder="e.g. Yard power bill for high-mast floodlights"
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-concrete-200">
            <Button type="button" variant="outline" onClick={() => setExpenseModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="yellow">
              Record Expense
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Income Modal */}
      <Modal
        isOpen={isIncomeModalOpen}
        onClose={() => setIncomeModalOpen(false)}
        title="Record Non-Sales / Other Income"
        subtitle="Scrap sales, freight charges collected, consulting fees"
        maxWidth="md"
      >
        <form onSubmit={handleCreateIncome} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Income Source"
              value={incSource}
              onChange={(e) => setIncSource(e.target.value as any)}
            >
              <option value="Freight / Delivery Charge">Freight Delivery Charge</option>
              <option value="Scrap Material Sale">Scrap Material Sale</option>
              <option value="Consulting & Site Service">Site Consultation</option>
              <option value="Product Sales">Direct Product Sale</option>
              <option value="Other">Other Revenue</option>
            </Select>

            <Input
              label="Amount (₹)"
              type="number"
              value={incAmount}
              onChange={(e) => setIncAmount(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Received From"
              value={incReceivedFrom}
              onChange={(e) => setIncReceivedFrom(e.target.value)}
              placeholder="e.g. Gupta Scrap Dealers"
              required
            />
            <Select
              label="Payment Method"
              value={incPaymentMethod}
              onChange={(e) => setIncPaymentMethod(e.target.value as PaymentMethod)}
            >
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </Select>
          </div>

          <Input
            label="Remarks / Description"
            value={incDescription}
            onChange={(e) => setIncDescription(e.target.value)}
            placeholder="e.g. Wooden pallet sale"
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-concrete-200">
            <Button type="button" variant="outline" onClick={() => setIncomeModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="yellow">
              Record Income
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
