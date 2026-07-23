import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useAuth } from '../../store/AuthContext';

export default function GlobalTenantGuard({ children, actionLabel = "perform this action", fallback = null }) {
  const { user } = useAuth();
  const selectedTenant = localStorage.getItem("adminSelectedTenant");
  const isGlobal = !selectedTenant || selectedTenant === "PLATFORM";

  // Only apply this guard to ULTRASUPERADMINs as they are the only ones who can view the Global Platform
  if (isGlobal && user?.role === 'ULTRASUPERADMIN') {
    if (fallback) {
      return fallback;
    }
    
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-card p-4 flex items-start gap-3 w-full">
        <AlertTriangle className="text-amber-500 mt-0.5 shrink-0" size={20} />
        <div>
          <h4 className="text-sm font-semibold text-amber-800">Tenant Selection Required</h4>
          <p className="text-sm text-amber-700 mt-1">
            Please select a specific client/tenant from the top dropdown to {actionLabel}. 
            You are currently viewing the Global Platform.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
