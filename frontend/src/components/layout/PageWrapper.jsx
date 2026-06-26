import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';

export default function PageWrapper() {
  const [collapsed, setCollapsed] = useState(false);

  const env = import.meta.env.VITE_APP_ENV || 'test'; // Default to test for safety

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: '#FAFAF9' }}>
      {env === 'test' && (
        <div className="bg-amber-100 border-b border-amber-300 text-amber-900 text-center py-2 text-sm font-semibold shadow-sm z-50">
          ⚠️ TEST ENVIRONMENT — No real charges or live notifications will be sent
        </div>
      )}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} env={env} />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          <TopNavbar />
          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
