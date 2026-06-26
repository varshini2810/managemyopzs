import React, { useState, useEffect } from 'react';
import { ChevronRight, Search } from 'lucide-react';
import api from '../../services/api';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import useDebounce from '../../hooks/useDebounce';

export default function CollectionsQueue() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    setLoading(true);
    // Use invoices endpoint filtering for OVERDUE if possible, or just search
    api.get(`/invoices?page=${page}&size=20&search=${debouncedSearch}&status=PAYMENT_DUE`)
      .then(res => {
        setData(res.data.data?.content || []);
        setTotalElements(res.data.data?.totalElements || 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, debouncedSearch]);

  const columns = [
    { header: 'Invoice ID', cell: (row) => <span className="font-mono text-xs">{row.id}</span> },
    { header: 'Customer ID', cell: (row) => row.customerId },
    { header: 'Amount Due', cell: (row) => <span className="text-red-600 font-medium">${row.amountDue.toFixed(2)}</span> },
    { header: 'Status', cell: (row) => <StatusBadge status={row.status} /> }
  ];

  return (
    <div>
      <div className="module-header">
        <div className="breadcrumb">
          <span>Receivables</span>
          <ChevronRight size={12} className="breadcrumb-sep" />
          <span className="breadcrumb-current">Collections Queue</span>
        </div>
      </div>
      <div className="px-8 py-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="page-title">Collections Queue</h1>
            <p className="page-subtitle">Manage overdue invoices and collections efforts</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={14} />
            <input 
              type="text" 
              className="input pl-9 h-10 w-80 text-sm" 
              placeholder="Search by Customer Name or Invoice ID..." 
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            />
          </div>
        </div>
        
        <div className="bg-surface border border-gray-200 rounded-lg overflow-hidden">
          <DataTable 
            columns={columns}
            data={data}
            loading={loading}
            totalElements={totalElements}
            page={page}
            size={20}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
}
