import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Lock, Mail, ArrowRight, Shield } from "lucide-react";
import { useAuth } from "../../store/AuthContext"; 

// Configuration for each role portal
const ROLE_CONFIG = {
  ULTRA_ADMIN: {
    label: "Ultra Admin",
    email: "ultraadmin@billingplatform.com",
    password: "Ultra@123",
    color: "#9333EA",
    portalName: "ultra-admin",
  },
  SUPER_ADMIN: {
    label: "Super Admin",
    email: "superadmin@billingplatform.com",
    password: "Super@123",
    color: "#DC2626",
    portalName: "super-admin",
  },
  ADMIN: {
    label: "Admin",
    email: "admin@billingplatform.com",
    password: "Admin@123",
    color: "#D97706",
    portalName: "admin",
  },
  USER: {
    label: "User",
    email: "user@billingplatform.com",
    password: "User@123",
    color: "#2563EB",
    portalName: "user",
  },
};
const ROLE_ORDER = ["ULTRA_ADMIN", "SUPER_ADMIN", "ADMIN", "USER"];

export default function PortalLoginPage({ portalType }) {
  // Determine initial role from route prop if provided, default to USER as requested 
  const getInitialRole = (type) => { 
    if (type === 'ultra-admin') return 'ULTRA_ADMIN'; 
    if (type === 'super-admin') return 'SUPER_ADMIN'; 
    if (type === 'admin') return 'ADMIN'; 
    return 'USER'; 
  }; 
  
  const [selectedRole, setSelectedRole] = useState(getInitialRole(portalType)); 
  const currentConfig = ROLE_CONFIG[selectedRole]; 
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({ 
    defaultValues: { email: currentConfig.email, password: currentConfig.password }, 
  }); 
  const [loading, setLoading] = useState(false); 
  const { login } = useAuth(); 
  const navigate = useNavigate(); 
  
  const onSubmit = async (data) => { 
    try { 
      setLoading(true); 
      const res = await login(data.email, data.password, currentConfig.portalName); 
      if (res.success) { 
        toast.success(`Welcome to the ${currentConfig.label} Portal`); 
        const role = res.user?.role; 
        if (role === 'ULTRASUPERADMIN') navigate('/platform-console'); 
        else if (role === 'USER') navigate('/portal'); 
        else navigate('/dashboard'); 
      } else { 
        toast.error(res.error || 'Login failed'); 
      } 
    } catch (error) { 
      toast.error('An unexpected error occurred.'); 
    } finally { 
      setLoading(false); 
    } 
  }; 
  
  return ( 
    <div className="min-h-screen flex" style={{ background: '#FAFAF9' }}> 
      {/* Left — illustration panel */} 
      <div className="hidden lg:flex w-[44%] flex-col justify-between p-14 relative overflow-hidden" style={{ background: '#14130F' }}> 
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '40px 40px' }} /> 
        {/* Logo */} 
        <div className="relative z-10 flex items-center gap-3"> 
          <svg width="28" height="28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"> 
            <path d="M50 15 L85 32.5 L85 67.5 L50 85 L15 67.5 L15 32.5 Z" stroke="#FFFFFF" strokeWidth="6" strokeLinejoin="round"/> 
            <circle cx="50" cy="15" r="10" fill="#0055FF"/> 
            <circle cx="50" cy="85" r="10" fill="#0055FF"/> 
            <circle cx="15" cy="50" r="10" fill="#0055FF"/> 
            <circle cx="85" cy="50" r="10" fill="#0055FF"/> 
            <rect x="30" y="50" width="10" height="20" fill="#0055FF"/> 
            <rect x="45" y="40" width="10" height="30" fill="#0055FF"/> 
            <rect x="60" y="30" width="10" height="40" fill="#0055FF"/> 
            <path d="M25 65 L40 55 L50 62 L70 42" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/> 
            <path d="M60 42 L70 42 L70 52" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/> 
          </svg> 
          <span className="font-display font-semibold text-white" style={{ letterSpacing: '-0.02em', fontSize: 15 }}>Opz</span> 
        </div> 
        {/* Hero copy */} 
        <div className="relative z-10"> 
          <h1 className="font-display font-semibold text-white mb-4" style={{ fontSize: 32, lineHeight: '38px', letterSpacing: '-0.03em' }}> 
            {currentConfig.label} Access.<br /> Secure Authentication. 
          </h1> 
          <p className="text-sm" style={{ color: '#79756E', lineHeight: '22px', maxWidth: 320 }}> 
            You are entering a secure gateway. Ensure you have the appropriate credentials for {currentConfig.label} access. 
          </p> 
        </div> 
        <div className="absolute bottom-8 left-8 text-xs font-medium text-muted"> 
          © 2026 Opz. All rights reserved. 
        </div> 
      </div> 
      {/* Right — login form */} 
      <div className="flex-1 flex flex-col justify-center items-center px-8 py-12"> 
        <div style={{ width: '100%', maxWidth: 380 }}> 
          <div className="flex items-center gap-2 mb-10"> 
            <Shield size={28} style={{ color: currentConfig.color }} /> 
            <div className="font-display font-semibold text-lg text-ink tracking-tight"> 
              {currentConfig.label} Login 
            </div> 
          </div> 
          <div className="mb-8"> 
            <h2 className="font-display font-semibold text-ink mb-1.5" style={{ fontSize: 22, letterSpacing: '-0.025em' }}> Sign in </h2> 
            <p className="text-sm text-muted"> Enter your credentials to access the {currentConfig.label} portal. </p> 
            {/* Autofill chips */} 
            <div className="mt-4"> 
              <p className="text-xs mb-2" style={{ color: '#A8A49F' }}>Quick fill:</p> 
              <div className="flex flex-wrap gap-2"> 
                {ROLE_ORDER.map((roleKey) => { 
                  const config = ROLE_CONFIG[roleKey]; 
                  const isActive = selectedRole === roleKey; 
                  return ( 
                    <button key={roleKey} type="button" onClick={() => { setSelectedRole(roleKey); setValue('email', config.email, { shouldValidate: true }); setValue('password', config.password, { shouldValidate: true }); }} style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, border: isActive ? `1px solid ${config.color}` : '1px solid #E5E2DC', background: isActive ? config.color : '#F5F4F1', color: isActive ? '#fff' : '#57534E', cursor: 'pointer', transition: 'all 0.15s', fontWeight: 500, }} onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = '#14130F'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#14130F'; } }} onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = '#F5F4F1'; e.currentTarget.style.color = '#57534E'; e.currentTarget.style.borderColor = '#E5E2DC'; } }} > 
                      {config.label} 
                    </button> 
                  ); 
                })} 
              </div> 
            </div> 
          </div> 
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate> 
            <div> 
              <label className="label">Email</label> 
              <div className="relative"> 
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#A8A49F' }} /> 
                <input type="email" autoComplete="email" placeholder="you@company.com" className={`input pl-9 ${errors.email ? 'input-error' : ''}`} {...register('email', { required: 'Email is required' })} /> 
              </div> 
              {errors.email && <p className="error-msg">{errors.email.message}</p>} 
            </div> 
            <div> 
              <div className="flex items-center justify-between mb-1.5"> 
                <label className="label mb-0">Password</label> 
              </div> 
              <div className="relative"> 
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#A8A49F' }} /> 
                <input type="password" autoComplete="current-password" placeholder="••••••••" className={`input pl-9 ${errors.password ? 'input-error' : ''}`} {...register('password', { required: 'Password is required' })} /> 
              </div> 
              {errors.password && <p className="error-msg">{errors.password.message}</p>} 
            </div> 
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center mt-2" style={{ height: 40 }}> 
              {loading ? ( 
                <> 
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> 
                  Signing in… 
                </> 
              ) : ( 
                <> 
                  Continue <ArrowRight size={14} /> 
                </> 
              )} 
            </button> 
          </form> 
        </div> 
      </div> 
    </div> 
  );
}
