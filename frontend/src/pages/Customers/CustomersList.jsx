import { useAuth } from '../../store/AuthContext';
import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Users, Building, Tag, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import useDebounce from '../../hooks/useDebounce';
import PageHeader from '../../components/ui/PageHeader';

export default function CustomersList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    setLoading(true);
    const resolvedStatus = showArchived ? 'ARCHIVED' : status;
    api.get(`/customers?page=${page}&size=20&search=${debouncedSearch}&status=${resolvedStatus}`)
      .then(res => {
        setCustomers(res.data.data?.content || []);
        setTotalElements(res.data.data?.totalElements || 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, debouncedSearch, status, showArchived]);

  const columns = [
    {
      header: 'NAME',
      cell: (row) => (
        <div 
          className="font-bold text-gray-900 cursor-pointer hover:text-indigo-600 transition-colors"
          onClick={() => navigate(`/customers/${row.id}`)}
        >
          {row.firstName} {row.lastName}
        </div>
      )
    },
    { header: 'EMAIL', accessor: 'email', className: 'text-gray-500 font-medium' },
    { header: 'COMPANY', accessor: 'companyName', className: 'text-gray-500 font-medium' },
    { 
      header: 'CREATED AT', 
      cell: (row) => (
        <span className="text-gray-500 font-medium tabular-nums">
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      )
    },
    { 
      header: 'STATUS', 
      cell: (row) => <StatusBadge status={row.status} /> 
    }
  ];

  const configModules = [
    { id: 'all_customers', label: 'All Customers', icon: Users, active: true },
    { id: 'companies', label: 'Companies (B2B)', icon: Building, active: false },
    { id: 'tags', label: 'Customer Tags', icon: Tag, active: false },
    { id: 'kyc', label: 'KYC & Verification', icon: ShieldCheck, active: false },
  ];

  return (
    <div className="max-w-[1400px] mx-auto">
      <PageHeader 
        title="Customer Directory"
        subtitle="Manage your client base and view their accounts."
        icon={Users}
        actionLabel="Add Customer"
        actionIcon={Plus}
        onAction={() => navigate('/customers/new')}
      />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column: Config Modules Menu */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sticky top-24">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">
              DNA CONFIG MODULES
            </div>
            <div className="space-y-1">
              {configModules.map(mod => (
                <button
                  key={mod.id}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    mod.active 
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <mod.icon size={16} />
                  {mod.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Data Directory */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 tracking-tight">All Customers</h2>
              <p className="text-xs text-gray-500 font-medium mt-1">Showing {totalElements} registered entities</p>
            </div>
            
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-600 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  checked={showArchived}
                  onChange={(e) => { setShowArchived(e.target.checked); setPage(0); }}
                />
                Show Archived
              </label>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  className="pl-9 pr-4 py-1.5 w-64 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow" 
                  placeholder="Search customers..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                />
              </div>
            </div>
          </div>
          
          <div className="p-0">
            <DataTable 
              columns={columns}
              data={customers}
              loading={loading}
              totalElements={totalElements}
              page={page}
              size={20}
              onPageChange={setPage}
              emptyStateMessage={
                <div className="text-center py-12">
                  <p className="italic text-gray-500 font-medium">No records found. Click add to create new data.</p>
                </div>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
