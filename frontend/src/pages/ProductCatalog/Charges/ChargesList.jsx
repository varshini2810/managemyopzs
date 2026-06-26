import React, { useState, useEffect } from 'react';
import { Plus, Receipt, Edit2, Trash2, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../services/api';
import DataTable from '../../../components/common/DataTable';
import MonoId from '../../../components/common/MonoId';
import CreateChargeModal from './CreateChargeModal';

export default function ChargesList() {
  const [charges, setCharges] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCharge, setEditingCharge] = useState(null);

  const fetchCharges = () => {
    setLoading(true);
    api.get(`/charges?page=${page}&size=20&search=${search}`)
      .then(res => {
        setCharges(res.data.data?.content || []);
        setTotalElements(res.data.data?.totalElements || 0);
      })
      .catch(() => toast.error('Failed to load charges'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCharges(); }, [page, search]);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this charge?')) {
      try {
        await api.delete(`/charges/${id}`);
        toast.success('Charge deleted');
        fetchCharges();
      } catch { toast.error('Failed to delete charge'); }
    }
  };

  const columns = [
    {
      header: 'Charge Name',
      cell: (row) => (
        <div>
          <div className="text-sm font-medium text-ink">{row.name}</div>
          <MonoId value={row.id} label="Charge ID" />
        </div>
      ),
    },
    {
      header: 'Pricing Model',
      cell: (row) => (
        <span className="text-sm text-muted capitalize">{row.pricingModel?.replace('_', ' ') || '—'}</span>
      ),
    },
    {
      header: 'Price',
      align: 'right',
      cell: (row) => (
        <span className="text-sm font-medium text-ink tabular-nums">
          {new Intl.NumberFormat('en-US', { style: 'currency', currency: row.currency || 'USD' }).format(row.price ?? 0)}
        </span>
      ),
    },
    {
      header: '',
      align: 'right',
      width: 80,
      cell: (row) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); setEditingCharge(row); setIsModalOpen(true); }}
            className="btn-ghost p-2 btn-xs"
            title="Edit"
          >
            <Edit2 size={13} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleDelete(row.id); }}
            className="btn-ghost p-2 btn-xs"
            style={{ color: '#C0292B' }}
            title="Delete"
          >
            <Trash2 size={13} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="module-header">
        <div className="breadcrumb">
          <span>Product Catalog</span>
          <ChevronRight size={12} className="breadcrumb-sep" />
          <span className="breadcrumb-current">Charges</span>
        </div>
        <button className="btn-primary btn-sm" onClick={() => { setEditingCharge(null); setIsModalOpen(true); }}>
          <Plus size={13} /> Create Charge
        </button>
      </div>

      <div className="px-8 py-6 space-y-6">
        <div>
          <h1 className="page-title">Charges</h1>
          <p className="page-subtitle">Configure ad-hoc and one-time charges</p>
        </div>

        {!loading && charges.length === 0 && search === '' ? (
          <div className="bg-surface rounded-lg flex flex-col items-center justify-center py-20" style={{ border: '1px solid #E7E5E2' }}>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ background: '#EEF2FF' }}>
              <Receipt size={22} style={{ color: '#2D5BFF' }} />
            </div>
            <h3 className="text-base font-semibold text-ink mb-1">No Charges Configured</h3>
            <p className="text-sm text-muted mb-6 text-center max-w-xs">
              Charges allow you to bill customers for one-off services like setup fees, consulting, or hardware.
            </p>
            <button className="btn-primary" onClick={() => { setEditingCharge(null); setIsModalOpen(true); }}>
              <Plus size={14} /> Create Charge
            </button>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={charges}
            loading={loading}
            totalElements={totalElements}
            page={page}
            size={20}
            onPageChange={setPage}
            onSearch={setSearch}
            searchPlaceholder="Search charges…"
          />
        )}
      </div>

      <CreateChargeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => { fetchCharges(); setIsModalOpen(false); }}
        initialData={editingCharge}
      />
    </div>
  );
}
