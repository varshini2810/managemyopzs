import React from "react";
import {
  Search,
  Bell,
  HelpCircle,
  LayoutGrid,
  ChevronDown,
  Lock,
} from "lucide-react";
import { useSuite } from "../../store/SuiteContext";
import { useAuth } from "../../store/AuthContext";

export default function Topbar() {
  return (
    <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-6 sticky top-0 z-20">
      <div className="flex items-center gap-4 flex-1">
        <SuiteSwitcher />
        <div className="relative w-64 ml-4">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            size={16}
          />
          <input
            type="text"
            placeholder="Search customers, invoices..."
            className="input !pl-9"
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="p-2 text-muted hover:text-ink hover:bg-stone-100 rounded-md transition-colors">
          <HelpCircle size={20} />
        </button>
        <button className="p-2 text-muted hover:text-ink hover:bg-stone-100 rounded-md transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full border-2 border-surface"></span>
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
    { id: "billing", name: "Chargebee Billing", permission: "BILLING_READ" },
    { id: "cpq", name: "Chargebee CPQ", permission: "CPQ_READ" },
    { id: "receivables", name: "Chargebee Receivables", permission: "RECEIVABLES_READ" },
    { id: "retention", name: "Chargebee Retention", permission: "RETENTION_READ" },
    { id: "revrec", name: "Chargebee RevRec", permission: "REVREC_READ" },
    { id: "payments", name: "Chargebee Payments", permission: "PAYMENTS_READ" },
    { id: "growth", name: "Chargebee Growth", permission: "GROWTH_READ" },
  ];

  const hasAccess = (permission, suiteId) => {
    if (!user) return false;
    if (user.role === "ULTRASUPERADMIN" || user.role === "SUPERADMIN") return true;
    const hasRolePermission = user.permissions?.includes(permission);
    if (!hasRolePermission) return false;
    if (user.grantedModules && user.grantedModules.length > 0) {
      const hasTenantSuiteAccess = user.grantedModules.some((mod) =>
        mod.startsWith(suiteId + ":"),
      );
      if (!hasTenantSuiteAccess) return false;
    }
    return true;
  };

  const activeSuite = suites.find((s) => s.id === currentSuite) || suites[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-stone-100 transition-colors"
      >
        <div className="w-6 h-6 bg-accent-light text-accent rounded flex items-center justify-center">
          <LayoutGrid size={14} />
        </div>
        <span className="font-medium text-sm text-ink">
          {activeSuite.name}
        </span>
        <ChevronDown size={14} className="text-muted" />
      </button>
      
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 w-56 bg-surface rounded-xl shadow-md border border-border py-1 z-20 animate-fade-in">
            {suites.map((suite) => {
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
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-colors ${canAccess ? "hover:bg-stone-50 text-ink cursor-pointer" : "text-muted cursor-not-allowed opacity-60"} ${currentSuite === suite.id ? "bg-stone-50 font-semibold" : "font-medium"}`}
                  title={!canAccess ? "No access — contact your admin." : ""}
                >
                  <span>{suite.name}</span>
                  {!canAccess && (
                    <Lock size={12} className="text-stone-300" />
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
