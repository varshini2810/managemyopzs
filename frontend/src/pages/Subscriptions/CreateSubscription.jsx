import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { ArrowLeft } from 'lucide-react';

export default function CreateSubscription() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await api.post('/subscriptions', data);
      toast.success('Subscription created');
      navigate(`/subscriptions/${res.data.data.id}`);
    } catch (e) {
      toast.error('Failed to create subscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="module-header border-b border-gray-200">
        <div>
          <button 
            onClick={() => navigate('/subscriptions')}
            className="flex items-center gap-1 text-sm text-muted hover:text-ink mb-2 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Subscriptions
          </button>
          <h1 className="page-title">Create a New Subscription</h1>
        </div>
      </div>

      <div className="px-8 py-8 max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="card p-6 space-y-4">
            <h3 className="text-base font-semibold text-ink border-b border-gray-100 pb-2">Subscription Details</h3>
            
            <div>
              <label className="label">Customer ID <span className="text-red-500">*</span></label>
              <input type="text" className={`input ${errors.customerId ? 'input-error' : ''}`} placeholder="cus-..."
                {...register('customerId', { required: 'Customer ID is required' })} />
              {errors.customerId && <p className="error-msg">{errors.customerId.message}</p>}
              <p className="text-xs text-muted mt-1">ID of the customer this subscription belongs to.</p>
            </div>

            <div>
              <label className="label">Plan ID <span className="text-red-500">*</span></label>
              <input type="text" className={`input ${errors.planId ? 'input-error' : ''}`} placeholder="pln-..."
                {...register('planId', { required: 'Plan ID is required' })} />
            </div>

            <div>
              <label className="label">Price Point ID <span className="text-red-500">*</span></label>
              <input type="text" className={`input ${errors.pricePointId ? 'input-error' : ''}`} placeholder="ppp-..."
                {...register('pricePointId', { required: 'Price Point ID is required' })} />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button type="button" className="btn-ghost" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Subscription'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
