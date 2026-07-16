import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Save,
  Shield,
  CheckCircle,
  User,
  Mail,
  Briefcase,
  Hash,
  Phone,
} from "lucide-react";
import toast from "react-hot-toast";
import Toggle from "../../../components/common/Toggle";
const PERMISSIONS = [
  {
    key: "dashboard",
    label: "Dashboard Access",
    description: "View the main dashboard and analytics overview",
  },
  {
    key: "employeeManagement",
    label: "Employee Management",
    description: "Add, edit, and manage employee records",
  },
  {
    key: "attendance",
    label: "Attendance",
    description: "View and manage attendance records",
  },
  {
    key: "payroll",
    label: "Payroll",
    description: "Access payroll processing and history",
  },
  {
    key: "leaveManagement",
    label: "Leave Management",
    description: "Manage leave requests and balances",
  },
  {
    key: "reports",
    label: "Reports",
    description: "Generate and export system reports",
  },
  {
    key: "settings",
    label: "Settings",
    description: "Access system configuration and settings",
  },
];
export default function AccessControlModal({ isOpen, onClose, user, onSave }) {
  const [status, setStatus] = useState("Active");
  const [loginEnabled, setLoginEnabled] = useState(true);
  const [role, setRole] = useState("USER");
  const [password, setPassword] = useState("");
  const [permissions, setPermissions] = useState({
    dashboard: true,
    employeeManagement: false,
    attendance: false,
    payroll: false,
    leaveManagement: false,
    reports: false,
    settings: false,
  });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (user) {
      setStatus(user.profile?.status || "Active");
      setLoginEnabled(user.profile?.loginEnabled !== false);
      setRole(user.role || "USER");
      setPassword("");
      setPermissions({
        dashboard: user.permissions?.dashboard || false,
        employeeManagement: user.permissions?.employeeManagement || false,
        attendance: user.permissions?.attendance || false,
        payroll: user.permissions?.payroll || false,
        leaveManagement: user.permissions?.leaveManagement || false,
        reports: user.permissions?.reports || false,
        settings: user.permissions?.settings || false,
      });
    }
  }, [user, isOpen]);
  if (!isOpen || !user) return null;
  const profile = user.profile || {};
  const handleTogglePerm = (key) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave({
        profile: { ...profile, status, loginEnabled },
        role,
        password: password || undefined,
        permissions,
      });
      onClose();
    } catch (error) {
      toast.error("Failed to save access settings");
    } finally {
      setLoading(false);
    }
  };
  const initials = profile.fullName
    ? profile.fullName
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";
  const roleLabel = (role) => {
    const map = {
      SUPERADMIN: "Super Admin",
      ADMIN: "Admin",
      USER: "User",
      ULTRASUPERADMIN: "Ultra Admin",
    };
    return map[role] || role;
  };
  const grantedCount = Object.values(permissions).filter(Boolean).length; // Scroll-lock while open useEffect(() => { const prev = document.body.style.overflow; document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = prev; }; }, []); // Close on Escape useEffect(() => { const handler = (e) => { if (e.key === 'Escape') onClose(); }; document.addEventListener('keydown', handler); return () => document.removeEventListener('keydown', handler); }, [onClose]); return createPortal( <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 animate-fade-in px-4" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}> <div className="bg-surface rounded-xl shadow-xl w-full max-w-xl max-h-[90vh] flex flex-col"> {/* Header */} <div className="flex justify-between items-center p-6 border-b border-border"> <div className="flex items-center gap-3"> <div className="w-10 h-10 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center font-bold shrink-0"> {initials} </div> <div> <h2 className="text-base font-semibold text-ink">{profile.fullName || 'User'}</h2> <p className="text-xs text-muted mt-0.5">Manage access settings &amp; permissions</p> </div> </div> <button onClick={onClose} className="text-muted hover:text-ink transition-colors p-1 rounded"> <X size={18} /> </button> </div> {/* Body */} <div className="p-6 overflow-y-auto custom-scrollbar"> <form id="ac-edit-form" onSubmit={handleSubmit} className="space-y-6"> {/* Read-only profile info */} <div className="bg-surface-50 border border-border rounded-lg p-4 space-y-2"> <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3 flex items-center gap-1.5"> <User size={12} /> Employee Info <span className="font-normal normal-case">(from Personal Details)</span> </p> <div className="grid grid-cols-1 gap-2 text-sm"> {profile.employeeId && ( <div className="flex items-center gap-2 text-muted"> <Hash size={13} className="shrink-0 text-stone-400" /> <span className="text-ink font-medium">{profile.employeeId}</span> </div> )} <div className="flex items-center gap-2 text-muted"> <Mail size={13} className="shrink-0 text-stone-400" /> <span className="text-ink">{profile.email || '—'}</span> </div> {profile.phone && ( <div className="flex items-center gap-2 text-muted"> <Phone size={13} className="shrink-0 text-stone-400" /> <span className="text-ink">{profile.phone}</span> </div> )} <div className="flex items-center gap-2 text-muted"> <Briefcase size={13} className="shrink-0 text-stone-400" /> <span className="text-ink">{profile.jobTitle || profile.department || '—'}</span> </div> <div className="flex items-center gap-2 text-muted"> <Shield size={13} className="shrink-0 text-stone-400" /> <span className="text-ink">{roleLabel(user.role)}</span> </div> </div> </div> {/* Account Settings */} <div className="space-y-4"> <h3 className="font-semibold text-ink text-sm">Account Settings</h3> <div className="grid grid-cols-2 gap-4"> <div> <label className="label text-xs">Portal Type (Role)</label> <select value={role} onChange={(e) => setRole(e.target.value)} className="input w-full bg-surface" > <option value="USER">User</option> <option value="ADMIN">Admin</option> <option value="SUPERADMIN">Super Admin</option> <option value="ULTRASUPERADMIN">Ultra Admin</option> </select> </div> <div> <label className="label text-xs">Reset Password</label> <input type="password" placeholder="Leave blank to keep current" value={password} onChange={(e) => setPassword(e.target.value)} className="input w-full" /> </div> </div> <div className="flex flex-col gap-3 mt-4"> <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-surface-50"> <div> <p className="font-semibold text-ink text-sm">Login Enabled</p> <p className="text-xs text-muted mt-0.5">Allow this user to log in</p> </div> <Toggle checked={loginEnabled} onChange={setLoginEnabled} /> </div> <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-surface-50"> <div> <p className="font-semibold text-ink text-sm">Account Status</p> <p className="text-xs text-muted mt-0.5">Active users can be assigned records</p> </div> <div className="flex items-center gap-2"> <span className={`text-xs font-semibold ${status === 'Active' ? 'text-emerald-600' : 'text-rose-500'}`}> {status} </span> <Toggle checked={status === 'Active'} onChange={(checked) => setStatus(checked ? 'Active' : 'Inactive')} /> </div> </div> </div> </div> {/* Permissions */} <div> <div className="flex items-center justify-between mb-3"> <h3 className="text-sm font-semibold text-ink flex items-center gap-1.5"> <CheckCircle size={14} className="text-primary-500" /> Permissions </h3> <span className="text-xs text-muted">{grantedCount} / {PERMISSIONS.length} granted</span> </div> <div className="space-y-2"> {PERMISSIONS.map(p => ( <label key={p.key} className="flex items-start gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-surface-50 transition-colors" > <input type="checkbox" className="mt-0.5 w-4 h-4 text-primary-600 rounded border-stone-300 focus:ring-primary-500 shrink-0" checked={permissions[p.key]} onChange={() => handleTogglePerm(p.key)} /> <div> <p className="text-sm font-medium text-ink">{p.label}</p> <p className="text-xs text-muted mt-0.5">{p.description}</p> </div> </label> ))} </div> </div> </form> </div> {/* Footer */} <div className="p-5 border-t border-border flex justify-end gap-3 bg-surface-50 rounded-b-xl"> <button type="button" onClick={onClose} className="btn-secondary"> Cancel </button> <button type="submit" form="ac-edit-form" disabled={loading} className="btn-primary flex items-center gap-2" > {loading ? ( <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> ) : ( <Save size={15} /> )} Save Access Settings </button> </div> </div> </div>, document.body );
}
