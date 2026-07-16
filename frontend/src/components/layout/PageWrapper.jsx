import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";

export default function PageWrapper() {
  const [collapsed, setCollapsed] = useState(false);
  const env = import.meta.env.VITE_APP_ENV || "test";

  return (
    <div className="flex flex-col h-screen bg-bg">
      {env === 'test' && (
        <div
          className="bg-amber-100 border-b border-amber-300 text-amber-900 text-center py-2 text-sm font-semibold shadow-sm"
          style={{ zIndex: 20, position: 'relative' }}
        >
          ⚠️ TEST ENVIRONMENT — No real charges or live notifications will be sent
        </div>
      )}
      <div className="flex flex-1 min-h-0">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} env={env} />
        <div className="flex-1 flex flex-col min-w-0">
          <TopNavbar />
          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
