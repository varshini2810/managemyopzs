import { useAuth } from '../../store/AuthContext';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, XCircle, RotateCcw } from 'lucide-react';
import api from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';
import MonoId from '../../components/common/MonoId';
import toast from 'react-hot-toast';

export default function SubscriptionDetail() {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [sub, setSub] = useState(null);
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [subRes, evtRes] = await Promise.all([
        api.get(`/subscriptions/${id}`),
        api.get(`/subscriptions/${id}/events`)
      ]);
      setSub(subRes.data.data);
      setEvents(evtRes.data.data || []);
    } catch (e) {
      toast.error('Failed to load subscription');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleAction = async (action) => {
    try {
      await api.post(`/subscriptions/${id}/${action}`);
      toast.success(`Subscription ${action}ed`);
      fetchData();
    } catch {
      toast.error(`Failed to ${action} subscription`);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!sub) return <div className="p-8">Subscription not found</div>;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'addons', label: 'Addons' },
    { id: 'invoices', label: 'Invoices' },
    { id: 'events', label: 'Event Log' }
  ];

  return (
    <div>
      {/* Header */}
      <div className="bg-surface px-8 py-6 border-b border-gray-200">
        <button 
          onClick={() => navigate('/subscriptions')}
          className="flex items-center gap-1 text-sm text-muted hover:text-ink mb-4 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Subscriptions
        </button>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-display font-semibold text-ink flex items-center gap-2">
                <MonoId id={sub.id} />
              </h1>
              <StatusBadge status={sub.status} />
            </div>
            <div className="flex items-center gap-4 text-sm text-muted">
              <span>Customer: <MonoId id={sub.customerId} /></span>
              <span>Plan: <MonoId id={sub.planId} /></span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {sub.status === 'ACTIVE' && (
              <>
                <button className="btn-ghost text-orange-600 hover:bg-orange-50" onClick={() => handleAction('pause')}>
                  <Pause size={14} /> Pause
                </button>
                <button className="btn-ghost text-red-600 hover:bg-red-50" onClick={() => handleAction('cancel')}>
                  <XCircle size={14} /> Cancel
                </button>
              </>
            )}
            {sub.status === 'PAUSED' && (
              <button className="btn-primary" onClick={() => handleAction('resume')}>
                <Play size={14} /> Resume
              </button>
            )}
            {sub.status === 'CANCELLED' && (
              <button className="btn-primary" onClick={() => handleAction('reactivate')}>
                <RotateCcw size={14} /> Reactivate
              </button>
            )}
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex items-center gap-6 mt-8">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === t.id ? 'border-accent text-ink' : 'border-transparent text-muted hover:text-ink'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-8 max-w-5xl">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-2 gap-8">
            <div className="card p-6">
              <h3 className="text-base font-semibold text-ink mb-4">Subscription Terms</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between"><dt className="text-muted">Current Term Start</dt><dd className="font-medium">{new Date(sub.currentTermStart).toLocaleDateString()}</dd></div>
                <div className="flex justify-between"><dt className="text-muted">Current Term End</dt><dd className="font-medium">{new Date(sub.currentTermEnd).toLocaleDateString()}</dd></div>
                <div className="flex justify-between"><dt className="text-muted">Next Billing At</dt><dd className="font-medium text-blue-600">{new Date(sub.nextBillingAt).toLocaleDateString()}</dd></div>
              </dl>
            </div>
            
            <div className="card p-6">
              <h3 className="text-base font-semibold text-ink mb-4">Pricing Link</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between"><dt className="text-muted">Plan</dt><dd className="font-medium"><MonoId id={sub.planId} /></dd></div>
                <div className="flex justify-between"><dt className="text-muted">Price Point</dt><dd className="font-medium"><MonoId id={sub.pricePointId} /></dd></div>
              </dl>
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="card p-6">
            <h3 className="text-base font-semibold text-ink mb-4">Activity Timeline</h3>
            <div className="space-y-4">
              {events.map(evt => (
                <div key={evt.id} className="flex gap-4">
                  <div className="w-24 text-xs text-muted pt-0.5">{new Date(evt.eventDate).toLocaleDateString()}</div>
                  <div>
                    <div className="font-medium text-sm text-ink">{evt.eventType}</div>
                    <div className="text-xs text-muted font-mono bg-gray-50 p-2 rounded mt-1">{evt.details}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'addons' && (
           <div className="card p-12 flex flex-col items-center justify-center text-center">
             <p className="text-sm text-ink font-medium">No Addons configured</p>
           </div>
        )}
        
        {activeTab === 'invoices' && (
           <div className="card p-12 flex flex-col items-center justify-center text-center">
             <p className="text-sm text-ink font-medium">Coming soon in Phase 4</p>
           </div>
        )}
      </div>
    </div>
  );
}
