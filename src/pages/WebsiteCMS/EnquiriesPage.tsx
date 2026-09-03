import React, { useState, useMemo } from 'react';
import {
  MessageSquare,
  Phone,
  MessageCircle,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  Eye,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { CustomerEnquiry } from '../../types';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { StatCard } from '../../components/ui/StatCard';
import { Modal } from '../../components/ui/Modal';

export const EnquiriesPage: React.FC = () => {
  const { customerEnquiries, updateEnquiryStatus } = useApp();
  const toast = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState<CustomerEnquiry | null>(null);

  const filtered = useMemo(() => {
    return customerEnquiries.filter((e) => {
      if (statusFilter !== 'all' && e.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          e.customerName.toLowerCase().includes(q) ||
          e.productName.toLowerCase().includes(q) ||
          e.phone.includes(q)
        );
      }
      return true;
    });
  }, [customerEnquiries, searchQuery, statusFilter]);

  const newCount = customerEnquiries.filter((e) => e.status === 'New').length;
  const contactedCount = customerEnquiries.filter((e) => e.status === 'Contacted').length;
  const inProgressCount = customerEnquiries.filter((e) => e.status === 'In Progress').length;
  const completedCount = customerEnquiries.filter((e) => e.status === 'Completed').length;

  const handleStatusChange = (id: string, newStatus: CustomerEnquiry['status']) => {
    updateEnquiryStatus(id, newStatus);
    toast.success('Status Updated', `Enquiry moved to ${newStatus}.`);
    if (selectedEnquiry?.id === id) {
      setSelectedEnquiry((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-concrete-200 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-charcoal-900 tracking-tight">
              Customer Enquiries & Quote Requests
            </h1>
            <Badge variant="yellow" size="sm">
              {newCount} New
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
            Bulk material quotation requests, site delivery enquiries and contact form submissions from the customer website.
          </p>
        </div>
      </div>

      {/* Status KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'New', count: newCount, color: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200' },
          { label: 'Contacted', count: contactedCount, color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' },
          { label: 'In Progress', count: inProgressCount, color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
          { label: 'Completed', count: completedCount, color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
        ].map((s) => (
          <button
            key={s.label}
            onClick={() => setStatusFilter(statusFilter === s.label ? 'all' : s.label)}
            className={`p-3 rounded-xl border text-left transition-all ${s.bg} ${s.border} ${statusFilter === s.label ? 'ring-2 ring-charcoal-800/20' : ''}`}
          >
            <span className={`text-xl font-extrabold ${s.color} font-mono`}>{s.count}</span>
            <p className="text-[10px] font-bold text-charcoal-600 uppercase tracking-wider mt-0.5">{s.label}</p>
          </button>
        ))}
      </div>

      {/* Filter Bar */}
      <Card className="p-4">
        <div className="relative">
          <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name, subject, or phone..."
            className="w-full text-xs rounded-lg border border-concrete-300 pl-9 pr-3 py-2 text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-charcoal-800/10 focus:border-charcoal-800"
          />
        </div>
      </Card>

      {/* Enquiries Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-concrete-200 bg-concrete-50/70 text-charcoal-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="px-5 py-3">Date</th>
                <th className="px-4 py-3">Customer Name</th>
                <th className="px-4 py-3">Subject / Products</th>
                <th className="px-3 py-3">Phone</th>
                <th className="px-3 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-concrete-200">
              {filtered.map((enq) => (
                <tr key={enq.id} className="hover:bg-concrete-50/60 transition-colors">
                  <td className="px-5 py-3 font-mono text-charcoal-600 whitespace-nowrap">{enq.date}</td>
                  <td className="px-4 py-3">
                    <p className="font-bold text-charcoal-900">{enq.customerName}</p>
                    {enq.email && <p className="text-[10px] text-charcoal-500">{enq.email}</p>}
                  </td>
                  <td className="px-4 py-3 text-charcoal-700 truncate max-w-xs font-medium">{enq.productName}</td>
                  <td className="px-3 py-3 font-mono text-charcoal-700">{enq.phone}</td>
                  <td className="px-3 py-3 text-center">
                    <Badge
                      variant={
                        enq.status === 'New'
                          ? 'due'
                          : enq.status === 'Contacted'
                          ? 'blue'
                          : enq.status === 'In Progress'
                          ? 'partial'
                          : 'healthy'
                      }
                      size="sm"
                    >
                      {enq.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <a
                        href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2 py-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200"
                      >
                        <MessageCircle className="w-3 h-3 inline mr-0.5" />
                        WhatsApp
                      </a>
                      <a
                        href={`tel:${enq.phone}`}
                        className="px-2 py-1 text-[11px] font-bold text-blue-800 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200"
                      >
                        <Phone className="w-3 h-3 inline mr-0.5" />
                        Call
                      </a>
                      <button
                        onClick={() => setSelectedEnquiry(enq)}
                        className="px-2 py-1 text-[11px] font-bold text-charcoal-700 bg-concrete-100 hover:bg-concrete-200 rounded border border-concrete-300"
                      >
                        <Eye className="w-3 h-3 inline mr-0.5" />
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Enquiry Detail Modal */}
      {selectedEnquiry && (
        <Modal
          isOpen={Boolean(selectedEnquiry)}
          onClose={() => setSelectedEnquiry(null)}
          title="Customer Enquiry Details"
          subtitle={`Submitted: ${selectedEnquiry.date}`}
          maxWidth="md"
        >
          <div className="space-y-4">
            <div className="p-4 bg-concrete-50 rounded-xl border border-concrete-200 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-charcoal-500 font-bold">Customer:</span>
                <span className="font-bold text-charcoal-900">{selectedEnquiry.customerName}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-charcoal-500 font-bold">Phone:</span>
                <span className="font-mono text-charcoal-800">{selectedEnquiry.phone}</span>
              </div>
              {selectedEnquiry.email && (
                <div className="flex justify-between text-xs">
                  <span className="text-charcoal-500 font-bold">Email:</span>
                  <span className="text-charcoal-800">{selectedEnquiry.email}</span>
                </div>
              )}
              <div className="flex justify-between text-xs">
                <span className="text-charcoal-500 font-bold">Status:</span>
                <Badge
                  variant={
                    selectedEnquiry.status === 'New' ? 'due' : selectedEnquiry.status === 'Completed' ? 'healthy' : 'partial'
                  }
                  size="sm"
                >
                  {selectedEnquiry.status}
                </Badge>
              </div>
            </div>

            <div>
              <p className="text-[11px] font-bold text-charcoal-700 uppercase tracking-wider mb-1">Subject</p>
              <p className="text-xs text-charcoal-900 font-medium">{selectedEnquiry.productName}</p>
              {selectedEnquiry.quantityRequested && (
                <p className="text-[10px] text-charcoal-500 mt-0.5">Qty: {selectedEnquiry.quantityRequested}</p>
              )}
            </div>

            <div>
              <p className="text-[11px] font-bold text-charcoal-700 uppercase tracking-wider mb-1">Message</p>
              <p className="text-xs text-charcoal-700 leading-relaxed bg-concrete-50 p-3 rounded-lg border border-concrete-200">
                {selectedEnquiry.message}
              </p>
            </div>

            {/* Status Update Buttons */}
            <div className="pt-3 border-t border-concrete-200">
              <p className="text-[11px] font-bold text-charcoal-700 uppercase tracking-wider mb-2">
                Update Status
              </p>
              <div className="flex flex-wrap gap-2">
                {(['New', 'Contacted', 'In Progress', 'Completed'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(selectedEnquiry.id, status)}
                    disabled={selectedEnquiry.status === status}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors ${
                      selectedEnquiry.status === status
                        ? 'bg-charcoal-900 text-white border-charcoal-900'
                        : 'bg-concrete-50 text-charcoal-700 border-concrete-300 hover:bg-concrete-100'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
