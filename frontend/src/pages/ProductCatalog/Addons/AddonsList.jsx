import React, { useState, useEffect } from 'react';
import { Plus, Zap, Edit2, Trash2, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../services/api';
import DataTable from '../../../components/common/DataTable';
import SlideOver from '../../../components/common/SlideOver';
import StatusBadge from '../../../components/common/StatusBadge';
import MonoId from '../../../components/common/MonoId';
import CreateAddonModal from './CreateAddonModal';

export default function AddonsList() {
  const [addons, setAddons] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddon, setEditingAddon] = useState(null);

  const fetchAddons = () => {
    setLoading(true);
    api.get(`/addons?page=${page}&size=20&search=${encodeURIComponent(search)}`)
      .then(res => {
        setAddons(res.data.data?.content || []);
        setTotalElements(res.data.data?.totalElements || 0);
      })
      .catch(() => toast.error('Failed to load addons'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAddons(); }, [page, search]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/addons/${id}`);
      toast.success('Addon deleted');
      fetchAddons();
    } catch { toast.error('Failed to delete addon'); }
  };

  const fmtCurrency = (v, currency = 'USD') =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(v || 0);

  const columns = [
    {
      header: 'Name',
      cell: (row) => (
        <div>
          <div className="text-sm font-medium text-ink">{row.name}</div>
          <MonoId value={row.id} label="Addon ID" />
        </div>
      ),
    },
    {
      header: 'Pricing',
      cell: (row) => (
        <span className="text-sm text-muted capitalize">{(row.pricingScheme || '').replace('_', ' ').toLowerCase()}</span>
      ),
    },
    {
      header: 'Price',
      align: 'right',
      cell: (row) => (
        <span className="text-sm font-medium text-ink tabular-nums">{fmtCurrency(row.price)}</span>
      ),
    },
    {
      header: 'Status',
      cell: (row) => <StatusBadge status={row.active ? 'ACTIVE' : 'INACTIVE'} />,
    },
    {
      header: '',
      align: 'right',
      width: 80,
      cell: (row) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); setEditingAddon(row); setIsModalOpen(true); }}
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
          <span className="breadcrumb-current">Add-ons</span>
        </div>
        <button className="btn-primary btn-sm" onClick={() => { setEditingAddon(null); setIsModalOpen(true); }}>
          <Plus size={13} /> Create Add-on
        </button>
      </div>

      <div className="px-8 py-6 space-y-6">
        <div>
          <h1 className="page-title">Add-ons</h1>
          <p className="page-subtitle">Optional products or services customers can add to their subscriptions</p>
        </div>

        {!loading && addons.length === 0 && search === '' ? (
          <div className="bg-surface rounded-lg flex flex-col items-center justify-center py-20" style={{ border: '1px solid #E7E5E2' }}>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ background: '#EEF2FF' }}>
              <Zap size={22} style={{ color: '#2D5BFF' }} />
            </div>
            <h3 className="text-base font-semibold text-ink mb-1">No add-ons yet</h3>
            <p className="text-sm text-muted mb-6 text-center max-w-xs">
              Add-ons let customers augment their subscriptions with optional extras.
            </p>
            <button className="btn-primary" onClick={() => { setEditingAddon(null); setIsModalOpen(true); }}>
              <Plus size={14} /> Create first add-on
            </button>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={addons}
            loading={loading}
            totalElements={totalElements}
            page={page}
            size={20}
            onPageChange={setPage}
            onSearch={setSearch}
            searchPlaceholder="Search add-ons…"
          />
        )}
      </div>

      <CreateAddonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => { fetchAddons(); setIsModalOpen(false); }}
        initialData={editingAddon}
      />
    </div>
  );
}
