import React from 'react';
import { Search, Bell, HelpCircle, LayoutGrid, ChevronDown, Lock } from 'lucide-react';
import { useSuite } from '../../store/SuiteContext';
import { useAuth } from '../../store/AuthContext';

export default function Topbar() {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-20">
      <div className="flex items-center gap-4 flex-1">
        <SuiteSwitcher />
        <div className="relative w-64 ml-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search customers, invoices..." 
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
          <HelpCircle size={20} />
        </button>
        <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      </div>
    </header>
  );
}

function SuiteSwitcher() {
  const { currentSuite, setCurrentSuite } = useSuite();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);

  const suites = [
    { id: 'billing', name: 'Chargebee Billing', permission: 'BILLING_READ' },
    { id: 'cpq', name: 'Chargebee CPQ', permission: 'CPQ_READ' },
    { id: 'receivables', name: 'Chargebee Receivables', permission: 'RECEIVABLES_READ' },
    { id: 'retention', name: 'Chargebee Retention', permission: 'RETENTION_READ' },
    { id: 'revrec', name: 'Chargebee RevRec', permission: 'REVREC_READ' },
    { id: 'payments', name: 'Chargebee Payments', permission: 'PAYMENTS_READ' },
    { id: 'growth', name: 'Chargebee Growth', permission: 'GROWTH_READ' }
  ];

  const hasAccess = (permission, suiteId) => {
    if (!user) return false;
    if (user.role === 'ULTRASUPERADMIN' || user.role === 'SUPERADMIN') return true;
    
    // Check if the role grants the permission
    const hasRolePermission = user.permissions?.includes(permission);
    if (!hasRolePermission) return false;

    // Additionally check if the tenant itself has been granted at least one module in this suite
    if (user.grantedModules && user.grantedModules.length > 0) {
      const hasTenantSuiteAccess = user.grantedModules.some(mod => mod.startsWith(suiteId + ':'));
      if (!hasTenantSuiteAccess) return false;
    }

    return true;
  };

  const activeSuite = suites.find(s => s.id === currentSuite) || suites[0];

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-slate-100 transition-colors"
      >
        <div className="w-6 h-6 bg-primary-100 text-primary-600 rounded flex items-center justify-center">
          <LayoutGrid size={14} />
        </div>
        <span className="font-medium text-sm text-slate-700">{activeSuite.name}</span>
        <ChevronDown size={14} className="text-slate-400" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20">
            {suites.map(suite => {
              const canAccess = hasAccess(suite.permission, suite.id);
              return (
                <button
                  key={suite.id}
                  onClick={() => {
                    if (canAccess) {
                      setCurrentSuite(suite.id);
                      setIsOpen(false);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm text-left ${
                    canAccess ? 'hover:bg-slate-50 text-slate-700 cursor-pointer' : 'text-slate-400 cursor-not-allowed opacity-60'
                  } ${currentSuite === suite.id ? 'bg-slate-50 font-medium' : ''}`}
                  title={!canAccess ? 'No access — contact your admin.' : ''}
                >
                  <span>{suite.name}</span>
                  {!canAccess && <Lock size={12} className="text-slate-400" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
