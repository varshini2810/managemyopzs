import React from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import Modal from '../../components/common/Modal';

export default function MarkAsPaidModal({ isOpen, onClose, onConfirm, loading }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      paymentDate: new Date().toISOString().split('T')[0],
    }
  });

  const submit = (data) => {
    onConfirm(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Mark as Paid">
      <form onSubmit={handleSubmit(submit)} className="space-y-4">
        <div>
          <label className="label">Payment Method *</label>
          <select 
            className="input" 
            {...register('paymentMethod', { required: 'Payment Method is required' })}
          >
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Cash">Cash</option>
            <option value="UPI">UPI</option>
            <option value="Cheque">Cheque</option>
            <option value="Gateway">Gateway</option>
            <option value="Other">Other</option>
          </select>
          {errors.paymentMethod && <p className="error-msg">{errors.paymentMethod.message}</p>}
        </div>

        <div>
          <label className="label">Payment Reference Number</label>
          <input 
            type="text" 
            className="input" 
            placeholder="e.g. UTR or Check Number"
            {...register('referenceNumber')} 
          />
        </div>

        <div>
          <label className="label">Payment Date *</label>
          <input 
            type="date" 
            className="input" 
            {...register('paymentDate', { required: 'Date is required' })} 
          />
          {errors.paymentDate && <p className="error-msg">{errors.paymentDate.message}</p>}
        </div>

        <div>
          <label className="label">Notes</label>
          <textarea 
            className="input min-h-[80px]" 
            placeholder="Optional internal notes..."
            {...register('notes')}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="btn-primary bg-green-600 hover:bg-green-700 border-green-600" disabled={loading}>
            {loading ? 'Confirming...' : 'Confirm Paid'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
