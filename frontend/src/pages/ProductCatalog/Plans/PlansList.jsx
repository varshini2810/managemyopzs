import React, { useState, useEffect } from 'react';
import { Plus, BarChart3, ArrowRight, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../../services/api';
import DataTable from '../../../components/common/DataTable';
import SlideOver from '../../../components/common/SlideOver';
import StatusBadge from '../../../components/common/StatusBadge';
import MonoId from '../../../components/common/MonoId';
import CreatePlanModal from './CreatePlanModal';

// Module sub-header
function ModuleHeader({ breadcrumb, action }) {
  return (
    <div className="module-header">
      <div className="breadcrumb">
        <span>Product Catalog</span>
        <ChevronRight size={12} className="breadcrumb-sep" />
        <span className="breadcrumb-current">Plans</span>
      </div>
      {action}
    </div>
  );
}

export default function PlansList() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const fetchPlans = () => {
    setLoading(true);
    api.get(`/plans?page=${page}&size=20&search=${encodeURIComponent(search)}`)
      .then(res => {
        setPlans(res.data.data?.content || []);
        setTotalElements(res.data.data?.totalElements || 0);
      })
      .catch(() => toast.error('Failed to load plans'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPlans(); }, [page, search]);

  const columns = [
    {
      header: 'Name',
      accessor: 'name',
      cell: (row) => (
        <div>
          <div className="text-sm font-medium text-ink">{row.name}</div>
          <MonoId value={row.id} label="Plan ID" />
        </div>
      ),
    },
    {
      header: 'Status',
      cell: (row) => <StatusBadge status={row.active ? 'ACTIVE' : 'INACTIVE'} />,
    },
    {
      header: 'Billing',
      cell: (row) => (
        <span className="text-sm text-muted">
          {row.billingPeriod} {row.billingPeriodUnit?.toLowerCase()}
        </span>
      ),
    },
    {
      header: 'Trial',
      cell: (row) => (
        <span className="text-sm text-muted tabular-nums">
          {row.trialPeriod > 0 ? `${row.trialPeriod} ${row.trialPeriodUnit?.toLowerCase()}` : '—'}
        </span>
      ),
    },
    {
      header: 'Created',
      cell: (row) => (
        <span className="text-sm text-muted tabular-nums">
          {row.createdAt ? new Date(row.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
        </span>
      ),
    },
    {
      header: '',
      width: 40,
      align: 'right',
      cell: (row) => (
        <button
          onClick={(e) => { e.stopPropagation(); navigate(`/catalog/plans/${row.id}`); }}
          className="btn-ghost btn-xs flex items-center gap-1"
          style={{ color: '#2D5BFF' }}
        >
          View <ArrowRight size={12} />
        </button>
      ),
    },
  ];

  return (
    <div>
      <ModuleHeader
        action={
          <button className="btn-primary btn-sm" onClick={() => setIsCreateOpen(true)}>
            <Plus size={13} /> Create Plan
          </button>
        }
      />

      <div className="px-8 py-6 space-y-6">
        <div>
          <h1 className="page-title">Plans</h1>
          <p className="page-subtitle">Subscription plans with billing frequency and trial periods</p>
        </div>

        {!loading && plans.length === 0 && search === '' ? (
          /* Empty state */
          <div
            className="bg-surface rounded-lg flex flex-col items-center justify-center py-20"
            style={{ border: '1px solid #E7E5E2' }}
          >
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
              style={{ background: '#EEF2FF' }}
            >
              <BarChart3 size={22} style={{ color: '#2D5BFF' }} />
            </div>
            <h3 className="text-base font-semibold text-ink mb-1">No plans yet</h3>
            <p className="text-sm text-muted mb-6 text-center max-w-xs">
              Plans define your subscription offerings. Create your first plan to get started.
            </p>
            <button className="btn-primary" onClick={() => setIsCreateOpen(true)}>
              <Plus size={14} /> Create your first plan
            </button>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={plans}
            loading={loading}
            totalElements={totalElements}
            page={page}
            size={20}
            onPageChange={setPage}
            onSearch={setSearch}
            searchPlaceholder="Search plans…"
            onRowClick={(row) => navigate(`/catalog/plans/${row.id}`)}
          />
        )}
      </div>

      {/* Create Plan — full-page multi-step handled in CreatePlanModal */}
      <CreatePlanModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={(newPlan) => {
          fetchPlans();
          setIsCreateOpen(false);
          navigate(`/catalog/plans/${newPlan.id}`);
        }}
      />
    </div>
  );
}
