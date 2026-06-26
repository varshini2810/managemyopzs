import React, { useState, useEffect } from 'react';
import { Activity, Database, Users, Cpu, ShieldAlert, Plus, Link, Copy } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function PlatformConsole() {
  const [health, setHealth] = useState(null);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({ companyName: '', subdomain: '', adminEmail: '' });
  const [inviteLink, setInviteLink] = useState('');

  const fetchData = () => {
    Promise.all([
      api.get('/health'),
      api.get('/admin/tenants')
    ])
    .then(([healthRes, tenantsRes]) => {
      setHealth(healthRes.data.data);
      setTenants(tenantsRes.data.data);
    })
    .catch(console.error)
    .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/tenants/invite', inviteForm);
      setInviteLink(res.data.data.inviteLink);
      toast.success('Tenant invited successfully');
      fetchData(); // refresh list
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to invite tenant');
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    toast.success('Invite link copied to clipboard!');
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="page-header border-b border-border pb-4 flex justify-between items-end">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <ShieldAlert className="text-red-500" /> Platform Console
          </h1>
          <p className="page-subtitle">Ultrasuperadmin Global Overview</p>
        </div>
        <button className="btn btn-primary flex items-center gap-2" onClick={() => setIsInviteModalOpen(true)}>
          <Plus size={16} /> Invite Tenant
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="card p-5 border-t-4 border-t-blue-500">
          <div className="flex items-center gap-2 text-muted text-xs font-semibold uppercase tracking-wider mb-2">
            <Activity size={14} /> System Status
          </div>
          <div className="text-2xl font-display font-semibold">
            {loading ? <span className="skeleton w-16 h-8 block"></span> : health?.status || 'UNKNOWN'}
          </div>
        </div>
        
        <div className="card p-5 border-t-4 border-t-indigo-500">
          <div className="flex items-center gap-2 text-muted text-xs font-semibold uppercase tracking-wider mb-2">
            <Database size={14} /> Database
          </div>
          <div className="text-2xl font-display font-semibold">
            {loading ? <span className="skeleton w-24 h-8 block"></span> : health?.db || 'UNKNOWN'}
          </div>
        </div>

        <div className="card p-5 border-t-4 border-t-emerald-500">
          <div className="flex items-center gap-2 text-muted text-xs font-semibold uppercase tracking-wider mb-2">
            <Users size={14} /> Active Tenants
          </div>
          <div className="text-2xl font-display font-semibold">
            {loading ? <span className="skeleton w-12 h-8 block"></span> : health?.active_tenants ?? '0'}
          </div>
        </div>

        <div className="card p-5 border-t-4 border-t-amber-500">
          <div className="flex items-center gap-2 text-muted text-xs font-semibold uppercase tracking-wider mb-2">
            <Cpu size={14} /> Memory Usage
          </div>
          <div className="text-2xl font-display font-semibold">
            {loading ? <span className="skeleton w-20 h-8 block"></span> : health?.memory_usage || '0 MB'}
          </div>
        </div>
      </div>

      <div className="card mt-8">
        <div className="p-4 border-b border-border bg-surface-50 font-semibold">All Tenants</div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-100 text-muted">
              <tr>
                <th className="p-4 font-medium">Tenant ID</th>
                <th className="p-4 font-medium">Company Name</th>
                <th className="p-4 font-medium">Subdomain</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan="5" className="p-4 text-center text-muted">Loading tenants...</td></tr>
              ) : tenants.length === 0 ? (
                <tr><td colSpan="5" className="p-4 text-center text-muted">No tenants found</td></tr>
              ) : (
                tenants.map(t => (
                  <tr key={t.id} className="hover:bg-surface-50">
                    <td className="p-4 font-mono text-xs">{t.id}</td>
                    <td className="p-4 font-semibold">{t.name}</td>
                    <td className="p-4">{t.domain}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${t.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="p-4 text-muted">{new Date(t.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
          <div className="bg-surface p-6 rounded-xl shadow-xl max-w-md w-full relative">
            <h2 className="text-xl font-display font-semibold mb-4">Invite New Tenant</h2>
            
            {inviteLink ? (
              <div className="space-y-4">
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                  <h3 className="font-semibold text-emerald-600 mb-2">Tenant Successfully Invited!</h3>
                  <p className="text-sm text-muted mb-4">Please share this secure link with the new Tenant Admin to complete their setup and password creation.</p>
                  <div className="flex gap-2">
                    <input type="text" readOnly value={inviteLink} className="input flex-1 text-xs font-mono" />
                    <button onClick={copyLink} className="btn btn-secondary px-3"><Copy size={16}/></button>
                  </div>
                </div>
                <button onClick={() => { setIsInviteModalOpen(false); setInviteLink(''); setInviteForm({companyName: '', subdomain: '', adminEmail: ''}); }} className="btn btn-primary w-full">Done</button>
              </div>
            ) : (
              <form onSubmit={handleInvite} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Company Name</label>
                  <input type="text" required className="input w-full" value={inviteForm.companyName} onChange={e => setInviteForm({...inviteForm, companyName: e.target.value})} placeholder="Acme Corp" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Subdomain</label>
                  <div className="flex items-center">
                    <input type="text" required className="input rounded-r-none border-r-0 flex-1" value={inviteForm.subdomain} onChange={e => setInviteForm({...inviteForm, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')})} placeholder="acme" />
                    <span className="bg-surface-100 border border-border px-3 py-2 rounded-r-md text-muted text-sm whitespace-nowrap">.billingplatform.com</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Admin Email</label>
                  <input type="email" required className="input w-full" value={inviteForm.adminEmail} onChange={e => setInviteForm({...inviteForm, adminEmail: e.target.value})} placeholder="admin@acmecorp.com" />
                </div>
                <div className="flex gap-3 justify-end mt-6">
                  <button type="button" onClick={() => setIsInviteModalOpen(false)} className="btn btn-secondary">Cancel</button>
                  <button type="submit" className="btn btn-primary">Send Invitation</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
