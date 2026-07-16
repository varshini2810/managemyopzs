import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  ChevronDown,
  Lock,
  Check,
  ArrowRightLeft,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../../store/AuthContext";
import api from "../../services/api";
import toast from "react-hot-toast"; // ─── Portal metadata ───────────────────────────────────────────────────────────
const PORTAL_OPTIONS = [
  {
    role: "ULTRASUPERADMIN",
    label: "Ultra Admin",
    value: "ultra-admin",
    color: "#9333EA",
    bg: "rgba(147,51,234,0.15)",
  },
  {
    role: "SUPERADMIN",
    label: "Super Admin",
    value: "super-admin",
    color: "#6366F1",
    bg: "rgba(99,102,241,0.15)",
  },
  {
    role: "ADMIN",
    label: "Admin",
    value: "admin",
    color: "#2D5BFF",
    bg: "rgba(45,91,255,0.15)",
  },
  {
    role: "USER",
    label: "User",
    value: "user",
    color: "#10B981",
    bg: "rgba(16,185,129,0.15)",
  },
];
const PORTAL_PERMISSIONS = {
  ULTRASUPERADMIN: [
    "Full platform access",
    "Client Management",
    "User Management",
    "Settings & Configuration",
    "Security Controls",
    "Analytics & Reporting",
    "Billing Management",
    "Access Control",
  ],
  SUPERADMIN: [
    "Client Management",
    "Employee Management",
    "Reports & Analytics",
    "Invoices",
    "Expenses",
  ],
  ADMIN: [
    "Employee Management",
    "Attendance Tracking",
    "Payroll Processing",
    "Reports",
  ],
  USER: ["Dashboard", "Personal Profile", "Assigned Modules"],
};
const ROLE_TO_PORTAL_LABEL = {
  ULTRASUPERADMIN: "Ultra Admin",
  SUPERADMIN: "Super Admin",
  ADMIN: "Admin",
  USER: "User",
}; // ─── Component ─────────────────────────────────────────────────────────────────
export default function ChangePortalModal({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const [selectedRole, setSelectedRole] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState(""); // Reset form when modal opens/closes useEffect(() => { if (isOpen) { setSelectedRole(''); setPassword(''); setPasswordError(''); setDropdownOpen(false); } }, [isOpen]); // Close dropdown on outside click useEffect(() => { if (!dropdownOpen) return; const handler = (e) => { if (!e.target.closest('[data-portal-dropdown]')) setDropdownOpen(false); }; document.addEventListener('mousedown', handler); return () => document.removeEventListener('mousedown', handler); }, [dropdownOpen]); // Lock body scroll when open useEffect(() => { if (!isOpen) return; const prev = document.body.style.overflow; const prevPad = document.body.style.paddingRight; // Measure scrollbar width to prevent layout shift const scrollbarW = window.innerWidth - document.documentElement.clientWidth; document.body.style.overflow = 'hidden'; if (scrollbarW > 0) document.body.style.paddingRight = `${scrollbarW}px`; return () => { document.body.style.overflow = prev; document.body.style.paddingRight = prevPad; }; }, [isOpen]); if (!isOpen) return null; const currentPortalInfo = PORTAL_OPTIONS.find(p => p.role === user?.role) || PORTAL_OPTIONS[0]; const selectedPortalInfo = PORTAL_OPTIONS.find(p => p.role === selectedRole); const permissions = selectedRole ? PORTAL_PERMISSIONS[selectedRole] : []; const isSamePortal = selectedRole === user?.role; const canSubmit = selectedRole && password.length > 0 && !isSamePortal && !loading; const availableOptions = PORTAL_OPTIONS.filter(p => p.role !== user?.role); const handleSwitch = async () => { if (!canSubmit) return; setPasswordError(''); setLoading(true); try { await api.post('/auth/change-portal', { newPortalRole: selectedRole, password, }); toast.success('Portal changed successfully.'); // Small delay for the toast to show, then logout + redirect setTimeout(() => { const portalPath = selectedPortalInfo?.value || 'user'; localStorage.removeItem('opz_token'); localStorage.removeItem('opz_refresh_token'); localStorage.removeItem('adminSelectedTenant'); window.location.href = `/login/${portalPath}`; }, 1200); } catch (err) { const msg = err.response?.data?.message || 'Failed to change portal. Please check your password.'; if (msg.toLowerCase().includes('password')) { setPasswordError(msg); } else { toast.error(msg); } } finally { setLoading(false); } }; const handleBackdropClick = (e) => { if (e.target === e.currentTarget) onClose(); }; return createPortal( <> {/* Backdrop */} <div onClick={handleBackdropClick} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', zIndex: 9998, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'cpModalFadeIn 0.18s ease', }} > {/* Modal */} <div onClick={e => e.stopPropagation()} style={{ position: 'relative', zIndex: 9999, background: '#1C1A16', border: '1px solid #2A2620', borderRadius: 16, width: '100%', maxWidth: 480, maxHeight: '90vh', margin: '0 16px', boxShadow: '0 24px 64px rgba(0,0,0,0.6)', animation: 'cpModalSlideUp 0.22s cubic-bezier(0.16,1,0.3,1)', overflow: 'hidden', display: 'flex', flexDirection: 'column', }} > {/* Header */} <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '20px 24px 16px', borderBottom: '1px solid #2A2620', flexShrink: 0, }} > <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}> <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(147,51,234,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, }} > <ArrowRightLeft size={16} color="#9333EA" /> </div> <div> <div style={{ fontSize: 14, fontWeight: 600, color: '#FFFFFF', letterSpacing: '-0.015em' }}> Change Portal </div> <div style={{ fontSize: 11, color: '#79756E', marginTop: 2 }}> Switch your current login portal. </div> </div> </div> <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#57534E', padding: 4, borderRadius: 6, display: 'flex', alignItems: 'center', transition: 'color 0.15s', }} onMouseEnter={e => e.currentTarget.style.color = '#A8A49F'} onMouseLeave={e => e.currentTarget.style.color = '#57534E'} > <X size={16} /> </button> </div> {/* Body — scrollable */} <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}> {/* Current Info Section */} <div style={{ background: '#14130F', border: '1px solid #2A2620', borderRadius: 10, padding: '14px 16px', marginBottom: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, }} > <div> <div style={{ fontSize: 10, color: '#57534E', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}> Current Portal </div> <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: currentPortalInfo.bg, color: currentPortalInfo.color, }} > <span style={{ width: 5, height: 5, borderRadius: '50%', background: currentPortalInfo.color }} /> {currentPortalInfo.label} </span> </div> <div> <div style={{ fontSize: 10, color: '#57534E', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}> Username </div> <div style={{ fontSize: 12, color: '#D6D3CF', fontWeight: 500 }}> {user?.name || '—'} </div> </div> <div style={{ gridColumn: '1 / -1' }}> <div style={{ fontSize: 10, color: '#57534E', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}> Email Address </div> <div style={{ fontSize: 12, color: '#D6D3CF', fontWeight: 500 }}> {user?.email || '—'} </div> </div> </div> {/* Select Portal Dropdown */} <div style={{ marginBottom: 16 }}> <label style={{ fontSize: 11, fontWeight: 600, color: '#A8A49F', display: 'block', marginBottom: 6, letterSpacing: '0.03em' }}> SELECT PORTAL </label> <div style={{ position: 'relative' }} data-portal-dropdown> <button onClick={() => setDropdownOpen(v => !v)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px', background: '#14130F', border: `1px solid ${dropdownOpen ? '#9333EA' : '#2A2620'}`, borderRadius: 8, cursor: 'pointer', color: selectedPortalInfo ? selectedPortalInfo.color : '#57534E', fontSize: 13, fontWeight: 500, transition: 'border-color 0.15s', }} > <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}> {selectedPortalInfo ? ( <> <span style={{ width: 7, height: 7, borderRadius: '50%', background: selectedPortalInfo.color, flexShrink: 0, }} /> {selectedPortalInfo.label} </> ) : ( <span style={{ color: '#57534E' }}>Choose a portal…</span> )} </div> <ChevronDown size={14} style={{ color: '#57534E', transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', }} /> </button> {dropdownOpen && ( <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: '#1C1A16', border: '1px solid #2A2620', borderRadius: 8, overflow: 'hidden', zIndex: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.4)', }} > {availableOptions.map(opt => ( <button key={opt.role} onClick={() => { setSelectedRole(opt.role); setDropdownOpen(false); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', background: selectedRole === opt.role ? 'rgba(147,51,234,0.08)' : 'transparent', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: opt.color, textAlign: 'left', transition: 'background 0.12s', }} onMouseEnter={e => { if (selectedRole !== opt.role) e.currentTarget.style.background = '#2A2620'; }} onMouseLeave={e => { if (selectedRole !== opt.role) e.currentTarget.style.background = 'transparent'; }} > <span style={{ width: 7, height: 7, borderRadius: '50%', background: opt.color, flexShrink: 0 }} /> {opt.label} {selectedRole === opt.role && <Check size={12} style={{ marginLeft: 'auto', color: opt.color }} />} </button> ))} </div> )} </div> </div> {/* Permissions Preview */} {selectedRole && permissions.length > 0 && ( <div style={{ background: '#14130F', border: `1px solid ${selectedPortalInfo?.color ? selectedPortalInfo.color + '30' : '#2A2620'}`, borderRadius: 8, padding: '12px 14px', marginBottom: 16, animation: 'fadeIn 0.18s ease', }} > <div style={{ fontSize: 10, color: '#57534E', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}> Permissions for {selectedPortalInfo?.label} </div> <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px 8px' }}> {permissions.map((perm) => ( <span key={perm} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#A8A49F', padding: '2px 0', }} > <Check size={10} color={selectedPortalInfo?.color} /> {perm} </span> ))} </div> </div> )} {/* Password Field */} <div style={{ marginBottom: 20 }}> <label style={{ fontSize: 11, fontWeight: 600, color: '#A8A49F', display: 'block', marginBottom: 6, letterSpacing: '0.03em' }}> CONFIRM YOUR PASSWORD </label> <div style={{ position: 'relative' }}> <Lock size={13} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#57534E', pointerEvents: 'none', }} /> <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => { setPassword(e.target.value); setPasswordError(''); }} placeholder="Enter your current password" style={{ width: '100%', background: '#14130F', border: `1px solid ${passwordError ? '#EF4444' : '#2A2620'}`, borderRadius: 8, padding: '9px 12px 9px 32px', color: '#FFFFFF', fontSize: 13, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s', }} onFocus={e => { if (!passwordError) e.currentTarget.style.borderColor = '#9333EA'; }} onBlur={e => { if (!passwordError) e.currentTarget.style.borderColor = '#2A2620'; }} onKeyDown={e => { if (e.key === 'Enter' && canSubmit) handleSwitch(); }} /> </div> {passwordError && ( <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 5, color: '#EF4444', fontSize: 11 }}> <AlertCircle size={11} /> {passwordError} </div> )} </div> {/* Warning notice */} {selectedRole && ( <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 8, padding: '10px 12px', marginBottom: 20, }} > <AlertCircle size={13} color="#F59E0B" style={{ flexShrink: 0, marginTop: 1 }} /> <div style={{ fontSize: 11, color: '#D6C080', lineHeight: '16px' }}> You will be logged out and redirected to the <strong>{selectedPortalInfo?.label}</strong> login page. Please log back in with your credentials. </div> </div> )} {/* Actions */} <div style={{ display: 'flex', gap: 10 }}> <button onClick={onClose} disabled={loading} style={{ flex: 1, padding: '9px 16px', background: 'transparent', border: '1px solid #2A2620', borderRadius: 8, color: '#A8A49F', fontSize: 13, fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.15s', }} onMouseEnter={e => { if (!loading) { e.currentTarget.style.borderColor = '#3A3730'; e.currentTarget.style.color = '#D6D3CF'; }}} onMouseLeave={e => { e.currentTarget.style.borderColor = '#2A2620'; e.currentTarget.style.color = '#A8A49F'; }} > Cancel </button> <button onClick={handleSwitch} disabled={!canSubmit} style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '9px 16px', background: canSubmit ? '#9333EA' : '#2A2620', border: 'none', borderRadius: 8, color: canSubmit ? '#FFFFFF' : '#57534E', fontSize: 13, fontWeight: 600, cursor: canSubmit ? 'pointer' : 'not-allowed', transition: 'all 0.18s', }} onMouseEnter={e => { if (canSubmit) e.currentTarget.style.background = '#7E22CE'; }} onMouseLeave={e => { if (canSubmit) e.currentTarget.style.background = '#9333EA'; }} > {loading ? ( <> <span style={{ width: 13, height: 13, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block', }} /> Switching… </> ) : ( <> <ArrowRightLeft size={13} /> Switch Portal </> )} </button> </div> </div> </div> </div> {/* Keyframe styles */} <style>{` @keyframes cpModalFadeIn { from { opacity: 0 } to { opacity: 1 } } @keyframes cpModalSlideUp { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: translateY(0) } } @keyframes spin { to { transform: rotate(360deg) } } `}</style> </>, document.body );
}
