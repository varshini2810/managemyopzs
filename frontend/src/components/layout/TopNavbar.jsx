import React, { useState, useEffect } from 'react';
import { useAuth } from '../../store/AuthContext';
import api from '../../services/api';
import { ChevronDown, Building2, AlertCircle } from 'lucide-react';

export default function TopNavbar() {
  const { user } = useAuth();
  const [clients, setClients] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState(localStorage.getItem('adminSelectedTenant') || '');

  useEffect(() => {
    if (user?.role === 'ULTRASUPERADMIN') {
      api.get('/admin/clients')
        .then(res => {
          setClients(res.data.data || []);
        })
        .catch(console.error);
    }
  }, [user]);

  const handleSelectTenant = (e) => {
    const val = e.target.value;
    setSelectedTenant(val);
    if (val) {
      localStorage.setItem('adminSelectedTenant', val);
    } else {
      localStorage.removeItem('adminSelectedTenant');
    }
    // Reload to apply the tenant context to all queries seamlessly
    window.location.reload();
  };

  if (user?.role !== 'ULTRASUPERADMIN') return null;

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shrink-0 h-14 z-40">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1.5 rounded-md border border-gray-200">
          <Building2 size={16} className="text-gray-500" />
          <span>Tenant Context:</span>
          <select 
            value={selectedTenant}
            onChange={handleSelectTenant}
            className="bg-transparent border-none outline-none text-blue-600 font-semibold cursor-pointer pl-1 pr-6 hover:text-blue-700"
          >
            <option value="">-- No Tenant Selected --</option>
            {clients.map(c => (
              <option key={c.tenantId} value={c.tenantId}>{c.clientName} ({c.tenantId})</option>
            ))}
          </select>
        </div>
        {!selectedTenant && (
          <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
            <AlertCircle size={14} />
            Viewing Platform Global. Creation of tenant-scoped records is disabled.
          </div>
        )}
      </div>
    </div>
  );
}
