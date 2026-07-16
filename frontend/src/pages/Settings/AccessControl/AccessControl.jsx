import React, { useState, useEffect } from "react";
import {
  Shield,
  Search,
  Filter,
  Edit2,
  Trash2,
  Mail,
  Briefcase,
  User as UserIcon,
  Phone,
  Hash,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../../services/api";
import AccessControlModal from "./AccessControlModal";
import { useAuth } from "../../../store/AuthContext";
export default function AccessControl() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data.data);
    } catch (err) {
      toast.error("Failed to load access control users");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);
  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to remove this user from access control?",
      )
    )
      return;
    try {
      await api.delete(`/users/${id}`);
      toast.success("User removed from access control");
      fetchUsers();
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };
  const handleSaveUser = async (userData) => {
    await api.put(`/users/${selectedUser.id}`, userData);
    toast.success("Access settings updated");
    fetchUsers();
  };
  const openEditModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  }; // Filter users based on search const filteredUsers = users.filter(u => { const s = search.toLowerCase(); const profile = u.profile || {}; return ( (profile.fullName || '').toLowerCase().includes(s) || (profile.email || '').toLowerCase().includes(s) || (profile.employeeId || '').toLowerCase().includes(s) || (u.role || '').toLowerCase().includes(s) || (profile.department || '').toLowerCase().includes(s) ); }); const roleLabel = (role) => { const map = { SUPERADMIN: 'Super Admin', ADMIN: 'Admin', USER: 'User', ULTRASUPERADMIN: 'Ultra Admin' }; return map[role] || role; }; return ( <div className="space-y-6 animate-fade-in"> {/* Header */} <div className="flex flex-col md:flex-row md:items-center justify-between gap-4"> <div> <h2 className="text-base font-bold text-ink flex items-center gap-2"> <Shield size={16} className="text-accent" /> Access Control Users </h2> <p className="text-sm text-muted mt-0.5"> Manage roles, permissions, and account status. Employees are created via <strong>Personal Details</strong>. </p> </div> <div className="flex items-center gap-3"> <div className="relative"> <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" /> <input type="text" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-9 w-64" /> </div> <button className="btn-secondary px-3" title="Filter"> <Filter size={16} /> </button> </div> </div> {/* Stats row */} {!loading && users.length > 0 && ( <div className="flex items-center gap-6 text-sm text-muted"> <span><span className="font-semibold text-ink">{users.length}</span> total users</span> <span><span className="font-semibold text-emerald-600">{users.filter(u => u.profile?.status === 'Active').length}</span> active</span> <span><span className="font-semibold text-rose-500">{users.filter(u => u.profile?.status !== 'Active').length}</span> inactive</span> </div> )} {/* Grid */} {loading ? ( <div className="flex justify-center py-20"> <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-lg animate-spin"></div> </div> ) : filteredUsers.length === 0 ? ( <div className="text-center py-20 text-muted bg-surface-50 rounded-xl border border-border"> <Shield size={48} className="mx-auto text-stone-300 mb-4" /> <p className="font-medium text-ink">No users found</p> <p className="text-sm mt-1"> {search ? 'Try a different search term.' : 'Add employees via Settings → Personal Details.'} </p> </div> ) : ( <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> {filteredUsers.map(user => { const profile = user.profile || {}; const initials = profile.fullName ? profile.fullName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() : 'U'; const isActive = profile.status === 'Active'; const ROLE_WEIGHT = { 'ULTRASUPERADMIN': 4, 'SUPERADMIN': 3, 'ADMIN': 2, 'USER': 1 }; const myWeight = ROLE_WEIGHT[currentUser?.role] || 1; const targetWeight = ROLE_WEIGHT[user.role] || 1; const canManage = currentUser?.role === 'ULTRASUPERADMIN' || myWeight > targetWeight; return ( <div key={user.id} className="card p-0 overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-200"> <div className="p-5 flex-1 space-y-4"> {/* Card Header */} <div className="flex justify-between items-start"> <div className="flex items-center gap-3"> <div className="w-11 h-11 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-base shrink-0"> {initials} </div> <div className="min-w-0"> <h3 className="font-semibold text-ink line-clamp-1">{profile.fullName || 'Unknown User'}</h3> <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold mt-1 uppercase tracking-wide ${isActive ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}> <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-rose-500'}`} /> {profile.status || 'Unknown'} </span> </div> </div> <span className="px-2.5 py-1 bg-stone-100 text-stone-600 text-xs font-semibold rounded-md border border-stone-200 shrink-0"> {roleLabel(user.role)} </span> </div> {/* Card Body */} <div className="space-y-2 pt-3 border-t border-border/50"> {profile.employeeId && ( <div className="flex items-center gap-2 text-sm text-muted"> <Hash size={13} className="shrink-0" /> <span className="truncate">{profile.employeeId}</span> </div> )} <div className="flex items-center gap-2 text-sm text-muted"> <Mail size={13} className="shrink-0" /> <span className="truncate">{profile.email || 'No email'}</span> </div> {profile.phone && ( <div className="flex items-center gap-2 text-sm text-muted"> <Phone size={13} className="shrink-0" /> <span className="truncate">{profile.phone}</span> </div> )} <div className="flex items-center gap-2 text-sm text-muted"> <Briefcase size={13} className="shrink-0" /> <span className="truncate">{profile.jobTitle || profile.department || 'No department'}</span> </div> <div className="flex items-center gap-2 text-sm text-muted"> <UserIcon size={13} className="shrink-0" /> <span className="truncate"> {Object.values(user.permissions || {}).filter(Boolean).length} / {Object.keys(user.permissions || {}).length} permissions granted </span> </div> </div> </div> {/* Card Footer Actions */} <div className="grid grid-cols-2 border-t border-border bg-surface-50"> <button onClick={() => openEditModal(user)} disabled={!canManage} className={`py-2.5 flex items-center justify-center gap-2 text-sm font-medium border-r border-border ${canManage ? 'text-ink hover:bg-stone-100 hover:text-primary-600 transition-colors' : 'text-stone-300 cursor-not-allowed'}`} > <Edit2 size={14} /> Manage Access </button> <button onClick={() => handleDelete(user.id)} disabled={!canManage} className={`py-2.5 flex items-center justify-center gap-2 text-sm font-medium ${canManage ? 'text-rose-600 hover:bg-rose-50 transition-colors' : 'text-stone-300 cursor-not-allowed'}`} > <Trash2 size={14} /> Remove </button> </div> </div> ); })} </div> )} {/* Edit Modal */} <AccessControlModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} user={selectedUser} onSave={handleSaveUser} /> </div> );
}
