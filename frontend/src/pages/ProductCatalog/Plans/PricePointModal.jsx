import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../../../services/api';
import Modal from '../../../components/common/Modal';

export default function PricePointModal({ isOpen, onClose, planId, onSuccess }) {
  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm();
  const hasTrial = watch('hasTrial');

  useEffect(() => {
    if (isOpen) reset();
  }, [isOpen, reset]);

  const onSubmit = async (data) => {
    try {
      await api.post(`/plans/${planId}/price-points`, data);
      toast.success('Price point created');
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create price point');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Price Point" maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 space-y-4">
            <h4 className="font-semibold text-slate-800 text-sm uppercase tracking-wider">Basic Info</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">External Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  className={`input ${errors.externalName ? 'input-error' : ''}`}
                  placeholder="e.g. Monthly Pro"
                  {...register('externalName', { required: 'External name is required' })}
                />
                <p className="text-xs text-slate-500 mt-1">Shown to customers on checkout</p>
                {errors.externalName && <p className="error-msg">{errors.externalName.message}</p>}
              </div>

              <div>
                <label className="label">Internal Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  className={`input ${errors.internalName ? 'input-error' : ''}`}
                  placeholder="e.g. Pro Plan - Monthly Base"
                  {...register('internalName', { required: 'Internal name is required' })}
                />
                <p className="text-xs text-slate-500 mt-1">For internal dashboard use</p>
                {errors.internalName && <p className="error-msg">{errors.internalName.message}</p>}
              </div>
            </div>
            
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="checkbox" {...register('hasTrial')} />
                <span className="text-sm font-medium text-slate-900">This plan has a trial period</span>
              </label>
            </div>

            {hasTrial && (
              <div className="w-1/2">
                <label className="label">Trial Period (Days)</label>
                <input 
                  type="number" 
                  className="input"
                  min="1"
                  {...register('trialPeriodDays', { valueAsNumber: true })}
                />
              </div>
            )}
          </div>

          <div className="md:col-span-2 space-y-4 pt-4 border-t border-slate-100">
            <h4 className="font-semibold text-slate-800 text-sm uppercase tracking-wider">Pricing Configuration</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Pricing Model</label>
                <select className="select" {...register('pricingModel')}>
                  <option value="flat_fee">Flat Fee</option>
                  <option value="per_unit">Per Unit</option>
                  <option value="tiered">Tiered</option>
                  <option value="volume">Volume</option>
                  <option value="stairstep">Stairstep</option>
                  <option value="usage_based">Usage-Based</option>
                </select>
              </div>

              <div>
                <label className="label">Billing Cycle</label>
                <select className="select" {...register('billingCycle')}>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="semi_annual">Semi-Annual</option>
                  <option value="annual">Annual</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div>
                <label className="label">Price <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-slate-500 sm:text-sm">$</span>
                  </div>
                  <input 
                    type="number" 
                    step="0.01"
                    className={`input pl-7 ${errors.price ? 'input-error' : ''}`}
                    placeholder="0.00"
                    {...register('price', { required: 'Price is required', valueAsNumber: true })}
                  />
                </div>
                {errors.price && <p className="error-msg">{errors.price.message}</p>}
              </div>

              <div>
                <label className="label">Currency</label>
                <select className="select" {...register('currency')}>
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="INR">INR - Indian Rupee</option>
                </select>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-4 pt-4 border-t border-slate-100">
            <h4 className="font-semibold text-slate-800 text-sm uppercase tracking-wider">Visibility</h4>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="checkbox" {...register('displaySelfServe')} />
                <span className="text-sm text-slate-700">Display in Self-Serve Portal</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="checkbox" {...register('displayCheckout')} />
                <span className="text-sm text-slate-700">Display in Checkout</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
          <button type="button" onClick={onClose} className="btn-secondary">
            Dismiss
          </button>
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? 'Creating...' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
