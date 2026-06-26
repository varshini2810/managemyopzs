import React, { useState, useEffect } from 'react';
import { Users, Plus, Shield, Copy } from 'lucide-react';
import api from '../../../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../../store/AuthContext';

export default function TeamMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({ name: '', email: '', roleName: 'Tenant Admin' });
  const [inviteLink, setInviteLink] = useState('');
  const { user } = useAuth();

  const fetchMembers = () => {
    api.get('/tenant/team-members')
      .then(res => setMembers(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/tenant/team-members/invite', inviteForm);
      setInviteLink(res.data.data.inviteLink);
      toast.success('Team member invited successfully');
      fetchMembers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to invite team member');
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    toast.success('Invite link copied!');
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="page-header border-b border-border pb-4 flex justify-between items-end">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Users className="text-indigo-500" /> Team Members
          </h1>
          <p className="page-subtitle">Manage users with access to this tenant workspace</p>
        </div>
        <button className="btn btn-primary flex items-center gap-2" onClick={() => setIsInviteModalOpen(true)}>
          <Plus size={16} /> Invite Member
        </button>
      </div>

      <div className="card mt-8">
        <div className="p-4 border-b border-border bg-surface-50 font-semibold flex justify-between">
          <span>Active Team Members</span>
          <span className="text-muted text-sm font-normal">Tenant: {user?.tenant?.name}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-100 text-muted">
              <tr>
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Role</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan="4" className="p-4 text-center text-muted">Loading team...</td></tr>
              ) : members.length === 0 ? (
                <tr><td colSpan="4" className="p-4 text-center text-muted">No team members found</td></tr>
              ) : (
                members.map(m => (
                  <tr key={m.id} className="hover:bg-surface-50">
                    <td className="p-4 font-semibold">{m.name}</td>
                    <td className="p-4">{m.email}</td>
                    <td className="p-4">
                      {/* Typically we'd fetch assignments here or include role in response. Assume backend can inject it later, but showing placeholders for now */}
                      <span className="flex items-center gap-1 text-xs text-muted">
                        <Shield size={12}/> Tenant Member
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${m.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
                        {m.status}
                      </span>
                    </td>
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
            <h2 className="text-xl font-display font-semibold mb-4">Invite Team Member</h2>
            
            {inviteLink ? (
              <div className="space-y-4">
                <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                  <h3 className="font-semibold text-indigo-600 mb-2">Member Invited!</h3>
                  <p className="text-sm text-muted mb-4">Please share this secure link with the team member to complete their setup and password creation.</p>
                  <div className="flex gap-2">
                    <input type="text" readOnly value={inviteLink} className="input flex-1 text-xs font-mono" />
                    <button onClick={copyLink} className="btn btn-secondary px-3"><Copy size={16}/></button>
                  </div>
                </div>
                <button onClick={() => { setIsInviteModalOpen(false); setInviteLink(''); setInviteForm({name: '', email: '', roleName: 'Tenant Admin'}); }} className="btn btn-primary w-full">Done</button>
              </div>
            ) : (
              <form onSubmit={handleInvite} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input type="text" required className="input w-full" value={inviteForm.name} onChange={e => setInviteForm({...inviteForm, name: e.target.value})} placeholder="Jane Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input type="email" required className="input w-full" value={inviteForm.email} onChange={e => setInviteForm({...inviteForm, email: e.target.value})} placeholder="jane@company.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <select className="input w-full" value={inviteForm.roleName} onChange={e => setInviteForm({...inviteForm, roleName: e.target.value})}>
                    <option value="Tenant Admin">Tenant Admin</option>
                    <option value="Tenant User">Tenant User</option>
                  </select>
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
