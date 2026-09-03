import React, { useState, ReactNode, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { GlobalSearchModal } from '../common/GlobalSearchModal';
import { QuickAddModal } from '../common/QuickAddModal';
import { NotificationsDrawer } from '../common/NotificationsDrawer';
import { WebsitePreviewModal } from '../common/WebsitePreviewModal';
import { useApp } from '../../context/AppContext';

export const AdminLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { setWebsitePreviewOpen } = useApp();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const handlePreview = () => setWebsitePreviewOpen(true);
    window.addEventListener('open-website-preview', handlePreview);
    return () => window.removeEventListener('open-website-preview', handlePreview);
  }, [setWebsitePreviewOpen]);

  return (
    <div className="min-h-screen bg-concrete-100 flex flex-col antialiased text-charcoal-800">
      {/* Sidebar Navigation */}
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileNavOpen}
        setMobileOpen={setMobileNavOpen}
      />

      {/* Main Workspace Area (offset by sidebar width on desktop) */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'md:pl-20' : 'md:pl-72'
        }`}
      >
        {/* Top Header */}
        <Header onOpenMobileNav={() => setMobileNavOpen(true)} />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          {children}
        </main>
      </div>

      {/* Global Modals & Drawers */}
      <GlobalSearchModal />
      <QuickAddModal />
      <NotificationsDrawer />
      <WebsitePreviewModal />
    </div>
  );
};
