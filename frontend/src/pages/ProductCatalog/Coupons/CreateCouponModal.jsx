import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../../../services/api';
import Modal from '../../../components/common/Modal';

export default function CreateCouponModal({ isOpen, onClose, onSuccess, initialData }) {
  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { discountType: 'percentage', duration: 'forever' }
  });
  
  const discountType = watch('discountType');
  const duration = watch('duration');
  const isEditing = !!initialData;

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        Object.keys(initialData).forEach(key => setValue(key, initialData[key]));
      } else {
        reset();
      }
    }
  }, [isOpen, initialData, setValue, reset]);

  const onSubmit = async (data) => {
    try {
      if (isEditing) {
        await api.put(`/coupons/${initialData.id}`, data);
        toast.success('Coupon updated');
      } else {
        await api.post('/coupons', data);
        toast.success('Coupon created');
      }
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save coupon');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Coupon' : 'Create Coupon'} maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 space-y-4">
            <h4 className="font-semibold text-slate-800 text-sm uppercase tracking-wider">Basic Info</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Coupon Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  className={`input ${errors.name ? 'input-error' : ''}`}
                  placeholder="e.g. Summer Sale 20%"
                  {...register('name', { required: 'Name is required' })}
                />
                {errors.name && <p className="error-msg">{errors.name.message}</p>}
              </div>

              <div>
                <label className="label">Coupon ID</label>
                <input 
                  type="text" 
                  className="input"
                  placeholder="Leave blank to auto-generate"
                  disabled={isEditing}
                  {...register('id')}
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-4 pt-4 border-t border-slate-100">
            <h4 className="font-semibold text-slate-800 text-sm uppercase tracking-wider">Discount Details</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Discount Type</label>
                <select className="select" {...register('discountType')}>
                  <option value="percentage">Percentage</option>
                  <option value="fixed_amount">Fixed Amount</option>
                </select>
              </div>

              {discountType === 'percentage' ? (
                <div>
                  <label className="label">Percentage (%) <span className="text-red-500">*</span></label>
                  <input 
                    type="number" 
                    step="0.01"
                    className={`input ${errors.discountPercentage ? 'input-error' : ''}`}
                    placeholder="20"
                    {...register('discountPercentage', { required: 'Required', valueAsNumber: true })}
                  />
                </div>
              ) : (
                <div>
                  <label className="label">Amount <span className="text-red-500">*</span></label>
                  <input 
                    type="number" 
                    step="0.01"
                    className={`input ${errors.discountAmount ? 'input-error' : ''}`}
                    placeholder="50.00"
                    {...register('discountAmount', { required: 'Required', valueAsNumber: true })}
                  />
                </div>
              )}

              <div>
                <label className="label">Duration</label>
                <select className="select" {...register('duration')}>
                  <option value="forever">Forever</option>
                  <option value="once">Once</option>
                  <option value="multiple_months">Multiple Months</option>
                </select>
              </div>

              {duration === 'multiple_months' && (
                <div>
                  <label className="label">Number of Months</label>
                  <input 
                    type="number" 
                    className="input"
                    {...register('durationMonthCount', { valueAsNumber: true })}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-2 space-y-4 pt-4 border-t border-slate-100">
            <h4 className="font-semibold text-slate-800 text-sm uppercase tracking-wider">Limits</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Redemption Limit</label>
                <input 
                  type="number" 
                  className="input"
                  placeholder="Unlimited"
                  {...register('maxRedemptions', { valueAsNumber: true })}
                />
              </div>

              <div>
                <label className="label">Valid Till</label>
                <input 
                  type="datetime-local" 
                  className="input"
                  {...register('validTill')}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
          <button type="button" onClick={onClose} className="btn-secondary">
            Dismiss
          </button>
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
