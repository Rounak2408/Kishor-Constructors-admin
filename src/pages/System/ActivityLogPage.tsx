import React, { useState, useMemo } from 'react';
import { ScrollText, Search, Filter, Clock, User, FileText, Settings, ShoppingCart, Package, Truck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ActivityLogItem } from '../../types';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

export const ActivityLogPage: React.FC = () => {
  const { activityLogs } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');

  const filteredLogs = useMemo(() => {
    return activityLogs.filter((log) => {
      if (moduleFilter !== 'all' && log.category !== moduleFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          log.action.toLowerCase().includes(q) ||
          log.user.toLowerCase().includes(q) ||
          log.category.toLowerCase().includes(q) ||
          log.details.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [activityLogs, searchQuery, moduleFilter]);

  const modules = useMemo(
    () => [...new Set(activityLogs.map((l) => l.category))],
    [activityLogs]
  );

  const getModuleIcon = (module: string) => {
    switch (module) {
      case 'Sales': return <ShoppingCart className="w-3.5 h-3.5 text-emerald-600" />;
      case 'Purchases': return <Package className="w-3.5 h-3.5 text-blue-600" />;
      case 'Inventory': return <Package className="w-3.5 h-3.5 text-amber-600" />;
      case 'Staff': return <User className="w-3.5 h-3.5 text-violet-600" />;
      case 'Fleet': return <Truck className="w-3.5 h-3.5 text-sky-600" />;
      case 'Finance': return <FileText className="w-3.5 h-3.5 text-rose-600" />;
      case 'Settings': return <Settings className="w-3.5 h-3.5 text-charcoal-600" />;
      default: return <ScrollText className="w-3.5 h-3.5 text-charcoal-500" />;
    }
  };

  const getActionBadgeVariant = (action: string): 'healthy' | 'blue' | 'partial' | 'due' | 'yellow' => {
    if (action.includes('Created') || action.includes('Added')) return 'healthy';
    if (action.includes('Updated') || action.includes('Edited')) return 'blue';
    if (action.includes('Deleted') || action.includes('Removed')) return 'due';
    if (action.includes('Paid') || action.includes('Completed')) return 'healthy';
    return 'yellow';
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-concrete-200 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-charcoal-900 tracking-tight">
              Activity Audit Trail
            </h1>
            <Badge variant="yellow" size="sm">
              {activityLogs.length} Events
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
            Chronological audit log of all admin actions across sales, purchases, inventory, staff, fleet & finance modules.
          </p>
        </div>
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
              placeholder="Search action, user, or module..."
              className="w-full text-xs rounded-lg border border-concrete-300 pl-9 pr-3 py-2 text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-charcoal-800/10 focus:border-charcoal-800"
            />
          </div>

          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="text-xs rounded-lg border border-concrete-300 px-3 py-2 text-charcoal-900 focus:outline-none focus:border-charcoal-800"
          >
            <option value="all">All Modules</option>
            {modules.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Activity Log Timeline */}
      <Card>
        <CardContent>
          <div className="space-y-0">
            {filteredLogs.map((log, idx) => (
              <div
                key={log.id}
                className={`flex items-start gap-3 py-3.5 px-2 ${
                  idx !== filteredLogs.length - 1 ? 'border-b border-concrete-100' : ''
                } hover:bg-concrete-50/50 rounded-lg transition-colors`}
              >
                {/* Module Icon */}
                <div className="w-8 h-8 rounded-lg bg-concrete-100 border border-concrete-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {getModuleIcon(log.category)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant={getActionBadgeVariant(log.action)} size="sm">
                          {log.action}
                        </Badge>
                        <span className="text-[10px] font-bold text-charcoal-500 bg-concrete-100 px-1.5 py-0.5 rounded">
                          {log.category}
                        </span>
                      </div>
                      <p className="text-xs text-charcoal-700 mt-1 leading-relaxed">{log.details}</p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="text-[10px] font-mono text-charcoal-500">{log.timestamp}</p>
                      <p className="text-[10px] font-bold text-charcoal-600 mt-0.5 flex items-center justify-end gap-1">
                        <User className="w-3 h-3 text-charcoal-400" />
                        {log.user}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
