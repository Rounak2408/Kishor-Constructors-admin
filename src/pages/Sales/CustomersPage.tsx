import React, { useState, useMemo } from 'react';
import {
  Users,
  Plus,
  Search,
  Phone,
  MessageSquare,
  IndianRupee,
  Receipt,
  FileText,
  Building,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { Customer } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';

export const CustomersPage: React.FC = () => {
  const { customers, sales, addCustomer } = useApp();
  const toast = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomerForLedger, setSelectedCustomerForLedger] = useState<Customer | null>(null);

  // Add Customer Modal
  const [isModalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Patna, Bihar');
  const [creditLimit, setCreditLimit] = useState('100000');

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          c.address.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [customers, searchQuery]);

  const totalReceivables = useMemo(
    () => customers.reduce((acc, c) => acc + c.totalDue, 0),
    [customers]
  );

  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Customer name is required');
      return;
    }

    addCustomer({
      name,
      phone: phone || '+91 90000 00000',
      email,
      address,
      city,
      creditLimit: parseFloat(creditLimit) || 50000,
      status: 'Active',
    });

    toast.success('Customer Registered', `Created account ledger for ${name}.`);
    setModalOpen(false);
    setName('');
    setPhone('');
    setEmail('');
    setAddress('');
  };

  // Customer Invoices for ledger modal
  const customerInvoices = useMemo(() => {
    if (!selectedCustomerForLedger) return [];
    return sales.filter((s) => s.customerId === selectedCustomerForLedger.id);
  }, [sales, selectedCustomerForLedger]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-concrete-200 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-charcoal-900 tracking-tight">
              Customer Accounts & Credit Khata
            </h1>
            <Badge variant="yellow" size="sm">
              {customers.length} Accounts
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
            Total Outstanding Receivables Across Accounts: <strong className="text-rose-700">₹{totalReceivables.toLocaleString('en-IN')}</strong>
          </p>
        </div>

        <Button
          variant="yellow"
          size="sm"
          onClick={() => setModalOpen(true)}
          icon={<Plus className="w-4 h-4 stroke-[3]" />}
        >
          + Add Customer Account
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
            placeholder="Search customer name, contact phone, site location..."
            className="w-full text-xs rounded-lg border border-concrete-300 pl-9 pr-3 py-2 text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-charcoal-800/10 focus:border-charcoal-800"
          />
        </div>
      </Card>

      {/* Customers Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-concrete-200 bg-concrete-50/70 text-charcoal-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="px-5 py-3">Customer Name</th>
                <th className="px-4 py-3">Location & Address</th>
                <th className="px-3 py-3 text-right">Lifetime Volume</th>
                <th className="px-3 py-3 text-right">Total Paid</th>
                <th className="px-3 py-3 text-right">Outstanding Due</th>
                <th className="px-3 py-3 text-right">Credit Limit</th>
                <th className="px-4 py-3 text-right">Quick Contact & Ledger</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-concrete-200">
              {filteredCustomers.map((c) => {
                const isOverdue = c.totalDue > 0;

                return (
                  <tr key={c.id} className="hover:bg-concrete-50/60 transition-colors">
                    <td className="px-5 py-3">
                      <p className="font-bold text-charcoal-900">{c.name}</p>
                      <p className="text-[10px] text-charcoal-500 font-mono">{c.phone}</p>
                    </td>

                    <td className="px-4 py-3 text-charcoal-600">
                      <p className="truncate max-w-xs">{c.address}</p>
                      <p className="text-[10px] text-charcoal-400">{c.city}</p>
                    </td>

                    <td className="px-3 py-3 text-right font-mono font-medium text-charcoal-800">
                      ₹{c.totalPurchases.toLocaleString('en-IN')}
                    </td>

                    <td className="px-3 py-3 text-right font-mono font-medium text-emerald-700">
                      ₹{c.totalPaid.toLocaleString('en-IN')}
                    </td>

                    <td className="px-3 py-3 text-right font-mono font-extrabold text-rose-700">
                      ₹{c.totalDue.toLocaleString('en-IN')}
                    </td>

                    <td className="px-3 py-3 text-right font-mono text-charcoal-600">
                      ₹{c.creditLimit.toLocaleString('en-IN')}
                    </td>

                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`https://wa.me/${c.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(c.name)},%20this%20is%20Kishor%20Construction.%20Your%20current%20khata%20balance%20is%20₹${c.totalDue.toLocaleString('en-IN')}.`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors"
                          title="WhatsApp Balance Reminder"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={`tel:${c.phone}`}
                          className="p-1.5 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                          title="Call Customer"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedCustomerForLedger(c)}
                          className="text-xs py-1 px-2"
                        >
                          Ledger
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Customer Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Register New Customer / Contractor Account"
        subtitle="Enables Khata ledger tracking, delivery receipts & credit limits"
        maxWidth="lg"
      >
        <form onSubmit={handleSaveCustomer} className="space-y-4">
          <Input
            label="Customer / Company Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Raj Developers (Er. Rajesh Verma)"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Contact Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 94310 98765"
              required
            />
            <Input
              label="Email (Optional)"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contractor@domain.com"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Site / Office Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Bailey Road, Near Saguna More"
            />
            <Input
              label="City / District"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Patna, Bihar"
            />
          </div>

          <Input
            label="Khata Credit Limit (₹)"
            type="number"
            value={creditLimit}
            onChange={(e) => setCreditLimit(e.target.value)}
            placeholder="150000"
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-concrete-200">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="yellow">
              Register Customer
            </Button>
          </div>
        </form>
      </Modal>

      {/* Customer Ledger Statement Modal */}
      {selectedCustomerForLedger && (
        <Modal
          isOpen={Boolean(selectedCustomerForLedger)}
          onClose={() => setSelectedCustomerForLedger(null)}
          title={`Khata Statement: ${selectedCustomerForLedger.name}`}
          subtitle={`Contact: ${selectedCustomerForLedger.phone} • ${selectedCustomerForLedger.city}`}
          maxWidth="2xl"
          footer={
            <Button variant="outline" size="sm" onClick={() => setSelectedCustomerForLedger(null)}>
              Close
            </Button>
          }
        >
          <div className="space-y-4 text-xs font-sans">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-concrete-50 rounded-xl border border-concrete-200">
                <span className="text-[10px] uppercase font-bold text-charcoal-500">Total Billed</span>
                <p className="text-base font-extrabold text-charcoal-900 mt-0.5">
                  ₹{selectedCustomerForLedger.totalPurchases.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-[10px] uppercase font-bold text-emerald-700">Total Collected</span>
                <p className="text-base font-extrabold text-emerald-800 mt-0.5">
                  ₹{selectedCustomerForLedger.totalPaid.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
                <span className="text-[10px] uppercase font-bold text-rose-700">Current Balance Due</span>
                <p className="text-base font-extrabold text-rose-800 mt-0.5">
                  ₹{selectedCustomerForLedger.totalDue.toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            <div className="border border-concrete-200 rounded-xl overflow-hidden">
              <div className="px-3 py-2 bg-concrete-50 font-bold uppercase text-[10px] text-charcoal-600">
                Invoice History
              </div>
              {customerInvoices.length === 0 ? (
                <div className="p-6 text-center text-charcoal-500">
                  No invoices recorded yet under this customer account.
                </div>
              ) : (
                <div className="divide-y divide-concrete-100">
                  {customerInvoices.map((inv) => (
                    <div key={inv.id} className="p-3 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-charcoal-900 font-mono">{inv.invoiceNo}</p>
                        <p className="text-[11px] text-charcoal-500">{inv.createdAt} • {inv.paymentMethod}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-charcoal-900 font-mono">₹{inv.totalAmount.toLocaleString('en-IN')}</p>
                        <p className="text-[10px] text-rose-600 font-semibold">Due: ₹{inv.dueAmount.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
