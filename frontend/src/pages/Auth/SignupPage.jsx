import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Lock, Mail, ArrowRight, Building, Globe } from 'lucide-react';
import api from '../../services/api';

export default function SignupPage() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [subdomainStatus, setSubdomainStatus] = useState(null); // null | 'checking' | 'available' | 'taken'
  const navigate = useNavigate();
  const subdomainValue = watch('subdomain');

  useEffect(() => {
    if (!subdomainValue || subdomainValue.length < 3) {
      setSubdomainStatus(null);
      return;
    }

    const checkSubdomain = async () => {
      setSubdomainStatus('checking');
      try {
        const res = await api.get(`/public/check-subdomain?name=${subdomainValue}`);
        if (res.data.data === true) {
          setSubdomainStatus('available');
        } else {
          setSubdomainStatus('taken');
        }
      } catch (err) {
        setSubdomainStatus('taken');
      }
    };

    const timer = setTimeout(checkSubdomain, 500);
    return () => clearTimeout(timer);
  }, [subdomainValue]);

  const onSubmit = async (data) => {
    if (subdomainStatus === 'taken') {
      toast.error('Subdomain is already taken');
      return;
    }
    
    try {
      setLoading(true);
      await api.post('/public/signup', data);
      toast.success('Signup successful! Please log in.');
      navigate('/login');
    } catch (error) {
      const msg = typeof error.response?.data === 'string' 
        ? error.response.data 
        : error.response?.data?.message || 'Error creating account';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#FAFAF9' }}>
      <div className="flex-1 flex flex-col justify-center items-center px-8 py-12">
        <div style={{ width: '100%', maxWidth: 380 }}>
          <div className="flex items-center gap-2 mb-10">
            <div className="font-display font-semibold text-lg text-ink tracking-tight">
              Opz Billing
            </div>
          </div>

          <div className="mb-8">
            <h2 className="font-display font-semibold text-ink mb-1.5" style={{ fontSize: 22, letterSpacing: '-0.025em' }}>
              Create an account
            </h2>
            <p className="text-sm text-muted">Set up your tenant workspace.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
              <label className="label">Company Name</label>
              <div className="relative">
                <Building size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#A8A49F' }} />
                <input
                  type="text"
                  placeholder="Acme Corp"
                  className={`input pl-9 ${errors.companyName ? 'input-error' : ''}`}
                  {...register('companyName', { required: 'Company name is required' })}
                />
              </div>
              {errors.companyName && <p className="error-msg">{errors.companyName.message}</p>}
            </div>

            <div>
              <label className="label">Subdomain</label>
              <div className="relative">
                <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#A8A49F' }} />
                <input
                  type="text"
                  placeholder="acme"
                  className={`input pl-9 ${errors.subdomain || subdomainStatus === 'taken' ? 'input-error' : ''}`}
                  {...register('subdomain', { required: 'Subdomain is required', pattern: { value: /^[a-z0-9-]+$/, message: 'Alphanumeric and dashes only' } })}
                />
              </div>
              {subdomainValue && (
                <div className="text-xs mt-1 text-muted">
                  Preview: {subdomainValue}.opzbilling.com
                  {subdomainStatus === 'checking' && <span className="ml-2 text-blue-500">Checking...</span>}
                  {subdomainStatus === 'available' && <span className="ml-2 text-green-600">Available</span>}
                  {subdomainStatus === 'taken' && <span className="ml-2 text-red-600">Taken</span>}
                </div>
              )}
              {errors.subdomain && <p className="error-msg">{errors.subdomain.message}</p>}
            </div>

            <div>
              <label className="label">Admin Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#A8A49F' }} />
                <input
                  type="email"
                  placeholder="admin@acme.com"
                  className={`input pl-9 ${errors.email ? 'input-error' : ''}`}
                  {...register('email', { required: 'Email is required' })}
                />
              </div>
              {errors.email && <p className="error-msg">{errors.email.message}</p>}
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#A8A49F' }} />
                <input
                  type="password"
                  placeholder="••••••••"
                  className={`input pl-9 ${errors.password ? 'input-error' : ''}`}
                  {...register('password', { required: 'Password is required' })}
                />
              </div>
              {errors.password && <p className="error-msg">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={loading || subdomainStatus === 'taken'} className="btn-primary w-full justify-center mt-2" style={{ height: 40 }}>
              {loading ? 'Creating...' : <>Sign Up <ArrowRight size={14} /></>}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Already have an account? <Link to="/login" className="text-accent hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
