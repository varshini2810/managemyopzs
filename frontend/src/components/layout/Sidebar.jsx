import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import { useSuite } from '../../store/SuiteContext';
import { getNavigationForRole } from '../../utils/navigation';

export default function Sidebar({ collapsed, onToggle, env }) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { currentSuite } = useSuite();

  const [expandedGroups, setExpandedGroups] = useState({
    'Product Catalog': location.pathname.startsWith('/catalog'),
    'Settings': location.pathname.startsWith('/settings'),
    'Revenue Story': location.pathname.startsWith('/revenue-story'),
  });

  const toggleGroup = (label) => {
    if (collapsed) onToggle();
    setExpandedGroups(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const initial = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  const finalNavItems = getNavigationForRole(
    user?.role, 
    currentSuite, 
    user?.grantedModules || []
  );

  return (
    <aside
      className="flex flex-col shrink-0 h-screen sticky top-0 bg-white relative"
      style={{
        width: collapsed ? 72 : 280,
        borderRight: '1px solid #E5E7EB',
        transition: 'width 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'visible',
      }}
    >
      {/* Toggle Button Floating on Border */}
      <button
        onClick={onToggle}
        className="absolute top-6 -right-3.5 w-7 h-7 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-indigo-600 hover:border-indigo-200 shadow-sm transition-colors z-50"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Logo Area */}
      <div className="flex items-center px-4 pt-6 pb-4 shrink-0 overflow-hidden">
        <div className="shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 w-10 h-10 shadow-inner">
          <svg width="20" height="20" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 15 L85 32.5 L85 67.5 L50 85 L15 67.5 L15 32.5 Z" stroke="#FFFFFF" strokeWidth="6" strokeLinejoin="round"/>
            <circle cx="50" cy="50" r="15" fill="#FFFFFF"/>
          </svg>
        </div>

        <div
          className="ml-3 overflow-hidden transition-all duration-200"
          style={{ width: collapsed ? 0 : 180, opacity: collapsed ? 0 : 1 }}
        >
          <div className="whitespace-nowrap font-bold text-gray-900 text-lg tracking-tight flex items-center gap-2 leading-none mb-1">
            ManageMyFinance
            {env === 'live' && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 border border-green-200">
                LIVE
              </span>
            )}
          </div>
          <div className="text-xs text-gray-500 font-medium leading-none">
            Personal Finance OS
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 space-y-6" style={{ scrollbarWidth: 'none' }}>
        <div className="space-y-1">
          {finalNavItems.map((item, index) => {
            // Check if we should insert a section label (for demo purposes we group them if label contains specific words or just as an example)
            const isSettings = item.label === 'Settings' || item.label === 'Access Control';
            const showSection = index === 0 ? "FINANCE TOOLS" : (isSettings && finalNavItems[index - 1]?.label !== 'Settings' ? "PLATFORM MANAGEMENT" : null);

            if (item.subItems) {
              const isExpanded = expandedGroups[item.label];
              const isChildActive = item.subItems.some(sub => location.pathname.startsWith(sub.to));
              
              return (
                <div key={item.label} className="flex flex-col mb-1">
                  {showSection && !collapsed && <div className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 mt-4">{showSection}</div>}
                  <div
                    onClick={() => toggleGroup(item.label)}
                    className={`flex items-center px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                      isChildActive && !isExpanded 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}
                  >
                    <item.icon size={18} className="shrink-0" />
                    {!collapsed && (
                      <>
                        <span className="truncate text-sm font-medium flex-1 ml-3 text-left">
                          {item.label}
                        </span>
                        <ChevronDown
                          size={16}
                          style={{
                            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s'
                          }}
                        />
                      </>
                    )}
                  </div>
                  
                  {/* Nested Items */}
                  {!collapsed && isExpanded && (
                    <div className="mt-1 space-y-1 ml-9">
                      {item.subItems.map((sub) => (
                        <NavLink
                          key={sub.to}
                          to={sub.to}
                          className={({ isActive }) => `flex items-center px-3 py-2 rounded-lg transition-colors ${
                            isActive ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {({ isActive }) => (
                            <>
                              <sub.icon size={16} className="shrink-0" />
                              <span className="truncate text-sm ml-3">
                                {sub.label}
                              </span>
                            </>
                          )}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <React.Fragment key={item.to}>
                {showSection && !collapsed && <div className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 mt-4">{showSection}</div>}
                <NavLink
                  to={item.to}
                  end={item.end}
                  title={collapsed ? item.label : undefined}
                  className={({ isActive }) => `flex items-center px-3 py-2.5 rounded-lg transition-colors mb-1 ${
                    isActive ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}
                >
                  <item.icon size={18} className="shrink-0" />
                  {!collapsed && (
                    <span className="truncate text-sm font-medium ml-3">
                      {item.label}
                    </span>
                  )}
                </NavLink>
              </React.Fragment>
            );
          })}
        </div>
      </nav>

      {/* Pinned User Card */}
      <div className="p-4 border-t border-gray-200 bg-gray-50/50">
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} gap-3`}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div
              className="shrink-0 flex items-center justify-center rounded-full text-xs font-bold text-indigo-700 bg-indigo-100"
              style={{ width: 36, height: 36 }}
            >
              {initial}
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <div className="text-sm font-bold text-gray-900 truncate">{user?.name || 'Admin User'}</div>
                <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider truncate">{user?.role || 'SYSTEM ADMIN'}</div>
              </div>
            )}
          </div>
          {!collapsed && (
            <button
              onClick={logout}
              title="Sign out"
              className="shrink-0 p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
