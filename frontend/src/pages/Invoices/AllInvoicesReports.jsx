import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import { Search } from 'lucide-react';
import useDebounce from '../../hooks/useDebounce';
import toast from 'react-hot-toast';

export default function AllInvoicesReports() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    setLoading(true);
    api.get(`/invoices/all-reports?search=${debouncedSearch}`)
      .then(res => setData(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [debouncedSearch]);

  const columns = [
    { header: 'Type', cell: (row) => row.type },
    { header: 'Document Number', cell: (row) => <span className="font-mono">{row.number}</span> },
    { header: 'Amount', cell: (row) => <span className="font-medium">${row.amount.toFixed(2)}</span> },
    { header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
  ];

  const handleExport = () => {
    if (!data.length) {
      toast.error('No data to export');
      return;
    }
    const header = ['Type', 'Document Number', 'Amount', 'Status'];
    const csvRows = [header.join(',')];
    data.forEach(row => {
      csvRows.push([row.type, row.number, row.amount, row.status].join(','));
    });
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Master_Ledger_Export.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success('Exported to CSV');
  };

  return (
    <div className="bg-surface rounded-lg border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6 gap-4">
        <h2 className="text-lg font-semibold whitespace-nowrap">Master Ledger: Invoices & Credit Notes</h2>
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input 
            type="text" 
            className="input pl-9 w-full" 
            placeholder="Search by ID, Customer, GST, Amount, Expense Type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 shrink-0">
          <button className="btn-secondary btn-sm" onClick={handleExport}>Export CSV</button>
        </div>
      </div>
      <DataTable columns={columns} data={data} loading={loading} />
    </div>
  );
}
