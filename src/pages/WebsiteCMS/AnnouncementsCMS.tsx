import React, { useState } from 'react';
import { Megaphone, Plus, Eye, EyeOff, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { WebsiteAnnouncement } from '../../types';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';

export const AnnouncementsCMS: React.FC = () => {
  const {
    websiteAnnouncements,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
  } = useApp();
  const toast = useToast();

  const [isModalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [priority, setPriority] = useState<WebsiteAnnouncement['priority']>('Normal');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error('Announcement message is required');
      return;
    }

    addAnnouncement({
      message,
      linkText: linkText || undefined,
      linkUrl: linkUrl || undefined,
      isActive: true,
      priority,
    });

    toast.success('Announcement Published', 'Ticker bar updated on customer website.');
    setModalOpen(false);
    setMessage('');
    setLinkText('');
    setLinkUrl('');
  };

  const toggleActive = (id: string, isActive: boolean) => {
    updateAnnouncement(id, { isActive: !isActive });
    toast.success(isActive ? 'Announcement Paused' : 'Announcement Activated');
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-concrete-200 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-charcoal-900 tracking-tight">
              Website Announcements Bar
            </h1>
            <Badge variant="yellow" size="sm">
              {websiteAnnouncements.filter((a) => a.isActive).length} Active
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
            Manage the scrolling announcement ticker displayed at the top of the customer website.
          </p>
        </div>

        <Button
          variant="yellow"
          size="sm"
          onClick={() => setModalOpen(true)}
          icon={<Plus className="w-4 h-4 stroke-[3]" />}
        >
          New Announcement
        </Button>
      </div>

      <Card>
        <CardHeader title="Active Announcements" subtitle="Shown in the website header ticker bar" />
        <CardContent className="space-y-3">
          {websiteAnnouncements.length === 0 ? (
            <p className="text-xs text-charcoal-500 py-4 text-center">No announcements yet.</p>
          ) : (
            websiteAnnouncements.map((ann) => (
              <div
                key={ann.id}
                className="flex items-center justify-between gap-4 p-4 rounded-xl border border-concrete-200 bg-concrete-50/50"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <Megaphone className="w-4 h-4 text-yellow-dark flex-shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <Badge
                        variant={ann.priority === 'Urgent' ? 'due' : ann.priority === 'Important' ? 'partial' : 'neutral'}
                        size="sm"
                      >
                        {ann.priority}
                      </Badge>
                      <Badge variant={ann.isActive ? 'healthy' : 'inactive'} size="sm">
                        {ann.isActive ? 'Live' : 'Paused'}
                      </Badge>
                    </div>
                    <p className="text-xs text-charcoal-800 font-medium">{ann.message}</p>
                    {ann.linkText && (
                      <p className="text-[10px] text-charcoal-500 mt-0.5">
                        Link: {ann.linkText} → {ann.linkUrl}
                      </p>
                    )}
                    <p className="text-[10px] text-charcoal-400 mt-0.5">Updated: {ann.updatedAt}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => toggleActive(ann.id, ann.isActive)}
                    className="px-2 py-1.5 text-[11px] font-bold rounded border border-concrete-300 bg-white hover:bg-concrete-100"
                  >
                    {ann.isActive ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </button>
                  <button
                    onClick={() => {
                      deleteAnnouncement(ann.id);
                      toast.success('Announcement Deleted');
                    }}
                    className="px-2 py-1.5 text-[11px] font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded border border-rose-200"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Publish Announcement"
        subtitle="Appears in the website header ticker"
        maxWidth="md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              required
              placeholder="e.g. Free site delivery on bulk cement orders above 200 bags this week!"
              className="w-full text-xs rounded-lg border border-concrete-300 px-3 py-2.5 text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-charcoal-800/10 focus:border-charcoal-800 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input label="Link Text (optional)" value={linkText} onChange={(e) => setLinkText(e.target.value)} />
            <Input label="Link URL (optional)" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} />
          </div>

          <Select
            label="Priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as WebsiteAnnouncement['priority'])}
            options={[
              { value: 'Normal', label: 'Normal' },
              { value: 'Important', label: 'Important' },
              { value: 'Urgent', label: 'Urgent' },
            ]}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-concrete-200">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="yellow">
              Publish
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
