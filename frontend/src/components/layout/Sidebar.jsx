import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, LogOut, ChevronDown, ActivitySquare, Settings } from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import { useSuite } from '../../store/SuiteContext';
import { getNavigationForRole } from '../../utils/navigation';

export default function Sidebar({ collapsed, onToggle, env }) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { currentSuite } = useSuite();
  const navigate = useNavigate();

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

  // Consume our new single source of truth for navigation
  const finalNavItems = getNavigationForRole(
    user?.role, 
    currentSuite, 
    user?.grantedModules || []
  );

  return (
    <aside
      className="flex flex-col shrink-0 h-screen sticky top-0"
      style={{
        width: collapsed ? 56 : 240,
        background: '#14130F',
        borderRight: '1px solid #2A2620',
        transition: 'width 0.18s cubic-bezier(0.16,1,0.3,1)',
        overflow: 'hidden',
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center px-3 shrink-0"
        style={{
          height: 56,
          borderBottom: '1px solid #2A2620',
          minWidth: 0,
        }}
      >
        <div className="shrink-0 flex items-center justify-center rounded">
          <svg width="28" height="28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 15 L85 32.5 L85 67.5 L50 85 L15 67.5 L15 32.5 Z" stroke="#000000" strokeWidth="6" strokeLinejoin="round"/>
            <circle cx="50" cy="15" r="10" fill="#0055FF"/>
            <circle cx="50" cy="85" r="10" fill="#0055FF"/>
            <circle cx="15" cy="50" r="10" fill="#0055FF"/>
            <circle cx="85" cy="50" r="10" fill="#0055FF"/>
            <rect x="30" y="50" width="10" height="20" fill="#0055FF"/>
            <rect x="45" y="40" width="10" height="30" fill="#0055FF"/>
            <rect x="60" y="30" width="10" height="40" fill="#0055FF"/>
            <path d="M25 65 L40 55 L50 62 L70 42" stroke="#000000" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M60 42 L70 42 L70 52" stroke="#000000" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div
          className="ml-2.5 overflow-hidden transition-all duration-150"
          style={{ width: collapsed ? 0 : 140, opacity: collapsed ? 0 : 1 }}
        >
          <div
            className="whitespace-nowrap font-display font-semibold text-sm text-white tracking-tight flex items-center gap-2"
            style={{ letterSpacing: '-0.02em' }}
          >
            Opz
            {env === 'live' && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/30">
                LIVE
              </span>
            )}
          </div>
          <div className="text-2xs" style={{ color: '#57534E' }}>
            Billing Platform
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3" style={{ scrollbarWidth: 'none' }}>
        
        {/* Platform Console (ULTRASUPERADMIN ONLY - ALWAYS TOP) */}
        {user?.role === 'ULTRASUPERADMIN' && (
          <div className="mb-6">
            {!collapsed && (
              <div className="px-5 mb-2 flex items-center gap-2">
                <Settings size={12} className="text-slate-500" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Platform Console
                </span>
              </div>
            )}
            <div className="px-2 space-y-0.5">
              <NavLink
                to="/platform-console/clients"
                title={collapsed ? "Client Management" : undefined}
                className={({ isActive }) => `nav-item relative ${isActive ? 'active' : ''}`}
                style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-0 top-1 bottom-1 w-0.5 rounded-r" style={{ background: '#2D5BFF' }} />
                    )}
                    <ActivitySquare size={15} className="shrink-0" style={{ color: isActive ? '#FFFFFF' : '#79756E' }} />
                    {!collapsed && (
                      <span className="truncate text-sm" style={{ color: isActive ? '#FFFFFF' : '#A8A49F' }}>
                        Client Management
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            </div>
          </div>
        )}

        <div className="px-2 space-y-0.5">
          {finalNavItems.map((item) => {
            if (item.subItems) {
              const isExpanded = expandedGroups[item.label];
              const isChildActive = item.subItems.some(sub => location.pathname.startsWith(sub.to));
              
              return (
                <div key={item.label} className="flex flex-col">
                  <div
                    onClick={() => toggleGroup(item.label)}
                    className={`nav-item relative ${isChildActive && !isExpanded ? 'active' : ''}`}
                    style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}
                  >
                    {isChildActive && collapsed && (
                      <span className="absolute left-0 top-1 bottom-1 w-0.5 rounded-r" style={{ background: '#2D5BFF' }} />
                    )}
                    <item.icon size={15} className="shrink-0" style={{ color: isChildActive ? '#FFFFFF' : '#79756E' }} />
                    {!collapsed && (
                      <>
                        <span className="truncate text-sm flex-1 text-left" style={{ color: isChildActive ? '#FFFFFF' : '#A8A49F' }}>
                          {item.label}
                        </span>
                        <ChevronDown
                          size={14}
                          style={{
                            color: '#79756E',
                            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s'
                          }}
                        />
                      </>
                    )}
                  </div>
                  
                  {/* Nested Items */}
                  {!collapsed && isExpanded && (
                    <div className="mt-0.5 space-y-0.5 ml-6">
                      {item.subItems.map((sub) => (
                        <NavLink
                          key={sub.to}
                          to={sub.to}
                          className={({ isActive }) => `nav-item relative !py-1.5 ${isActive ? 'active' : ''}`}
                        >
                          {({ isActive }) => (
                            <>
                              {isActive && (
                                <span className="absolute -left-6 top-1 bottom-1 w-0.5 rounded-r" style={{ background: '#2D5BFF' }} />
                              )}
                              <sub.icon size={14} className="shrink-0" style={{ color: isActive ? '#FFFFFF' : '#79756E' }} />
                              <span className="truncate text-xs" style={{ color: isActive ? '#FFFFFF' : '#A8A49F' }}>
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
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) => `nav-item relative ${isActive ? 'active' : ''}`}
                style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-0 top-1 bottom-1 w-0.5 rounded-r" style={{ background: '#2D5BFF' }} />
                    )}
                    <item.icon size={15} className="shrink-0" style={{ color: isActive ? '#FFFFFF' : '#79756E' }} />
                    {!collapsed && (
                      <span className="truncate text-sm" style={{ color: isActive ? '#FFFFFF' : '#A8A49F' }}>
                        {item.label}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div style={{ borderTop: '1px solid #2A2620' }}>
        <div className="flex items-center gap-2.5 px-3 py-3" style={{ minWidth: 0 }}>
          <div
            className="shrink-0 flex items-center justify-center rounded-full text-xs font-semibold text-white"
            style={{ width: 28, height: 28, background: '#2D5BFF', letterSpacing: '-0.01em' }}
          >
            {initial}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-white truncate">{user?.name || 'Admin'}</div>
              <div className="text-2xs truncate" style={{ color: '#57534E' }}>{user?.email || ''}</div>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={logout}
              title="Sign out"
              className="shrink-0 p-1 rounded transition-colors hover:bg-sidebar-hover"
              style={{ color: '#57534E' }}
            >
              <LogOut size={13} />
            </button>
          )}
        </div>

        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center py-2.5 transition-colors hover:bg-sidebar-hover"
          style={{ color: '#57534E', borderTop: '1px solid #2A2620' }}
        >
          {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
        </button>
      </div>
    </aside>
  );
}
