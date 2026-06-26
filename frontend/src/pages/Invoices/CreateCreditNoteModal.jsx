import React, { useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import Modal from '../../components/common/Modal';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function CreateCreditNoteModal({ isOpen, onClose, onSuccess }) {
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const selectedType = useWatch({ control, name: 'type', defaultValue: 'ADJUSTMENT' });
  const selectedExpenseType = useWatch({ control, name: 'expenseType', defaultValue: '' });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const payload = {
        customerId: data.customerId,
        type: data.type,
        expenseType: data.type === 'EXPENSE' ? data.expenseType : null,
        customExpenseLabel: data.expenseType === 'Other' ? data.customExpenseLabel : null,
        expenseCost: data.type === 'EXPENSE' ? parseFloat(data.expenseCost) : null,
        lineItems: data.type !== 'EXPENSE' ? [
          {
            description: data.description,
            quantity: 1,
            unitAmount: parseFloat(data.amount)
          }
        ] : []
      };
      await api.post('/credit-notes', payload);
      toast.success('Credit note created successfully');
      reset();
      onSuccess();
    } catch (e) {
      toast.error('Failed to create credit note');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Credit Note">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="label">Customer ID <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            className={`input ${errors.customerId ? 'input-error' : ''}`} 
            placeholder="cus-..."
            {...register('customerId', { required: 'Customer ID is required' })} 
          />
        </div>

        <div>
          <label className="label">Type</label>
          <select className="input" {...register('type')}>
            <option value="ADJUSTMENT">Adjustment</option>
            <option value="REFUNDABLE">Refundable</option>
            <option value="STORE_CREDIT">Store Credit</option>
            <option value="EXPENSE">Expense Recording</option>
          </select>
        </div>

        {selectedType === 'EXPENSE' ? (
          <>
            <div>
              <label className="label">Expense Category <span className="text-red-500">*</span></label>
              <select className="input" {...register('expenseType', { required: selectedType === 'EXPENSE' })}>
                <option value="">Select Category...</option>
                <option value="Salary">Salary / Payroll</option>
                <option value="Software">Software & Subscriptions</option>
                <option value="Marketing">Marketing & Ads</option>
                <option value="Hardware">Hardware & Equipment</option>
                <option value="Other">Other (Custom)</option>
              </select>
            </div>
            
            {selectedExpenseType === 'Other' && (
              <div>
                <label className="label">Custom Label <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  className="input" 
                  placeholder="e.g. Office Supplies"
                  {...register('customExpenseLabel', { required: selectedExpenseType === 'Other' })} 
                />
              </div>
            )}

            <div>
              <label className="label">Expense Cost ($) <span className="text-red-500">*</span></label>
              <input 
                type="number" 
                step="0.01" 
                className="input" 
                placeholder="0.00"
                {...register('expenseCost', { required: selectedType === 'EXPENSE' })} 
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="label">Description <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                className="input" 
                placeholder="Reason for credit"
                {...register('description', { required: selectedType !== 'EXPENSE' })} 
              />
            </div>

            <div>
              <label className="label">Amount ($) <span className="text-red-500">*</span></label>
              <input 
                type="number" 
                step="0.01" 
                className="input" 
                placeholder="0.00"
                {...register('amount', { required: selectedType !== 'EXPENSE' })} 
              />
            </div>
          </>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
