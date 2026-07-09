import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import TopNavbar from './TopNavbar'; // Keeping for tenant switcher

export default function PageWrapper() {
  const [collapsed, setCollapsed] = useState(false);

  const env = import.meta.env.VITE_APP_ENV || 'test'; // Default to test for safety

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: '#F8F9FB' }}>
      {env === 'test' && (
        <div className="bg-amber-100 border-b border-amber-300 text-amber-900 text-center py-2 text-sm font-semibold shadow-sm z-50 shrink-0">
          ⚠️ TEST ENVIRONMENT — No real charges or live notifications will be sent
        </div>
      )}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} env={env} />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          <Topbar onMenuClick={() => setCollapsed(c => !c)} />
          {/* Tenant Switcher strip for admins */}
          <TopNavbar />
          <main className="flex-1 overflow-y-auto p-6 text-gray-800">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
