import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';
import AdminBreadcrumb from './AdminBreadcrumb';
import { cn } from '@/lib/cn';

export default function AdminLayoutInner() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) setCollapsed(true);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50 dark:bg-neutral-950">
      <div className={cn('hidden lg:block', collapsed ? 'w-16' : 'w-64')}>
        <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="fixed left-0 top-0 h-full">
            <AdminSidebar collapsed={false} onToggle={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminNavbar onMenuToggle={() => setMobileOpen(!mobileOpen)} />
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 pt-4">
            <AdminBreadcrumb />
          </div>
          <div className="p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
