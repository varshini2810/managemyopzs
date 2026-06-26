import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../../../services/api';
import Modal from '../../../components/common/Modal';

export default function CreateWebhookModal({ isOpen, onClose, onSuccess, initialData }) {
  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm();
  const isEditing = !!initialData;

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setValue('url', initialData.url);
        setValue('secret', initialData.secret || '');
        
        try {
          const events = JSON.parse(initialData.subscribedEvents || '[]');
          setValue('events', events.join(', '));
        } catch {
          setValue('events', '');
        }
      } else {
        reset();
      }
    }
  }, [isOpen, initialData, setValue, reset]);

  const onSubmit = async (data) => {
    try {
      // Process comma-separated events into JSON array string
      const eventsList = data.events 
        ? data.events.split(',').map(e => e.trim()).filter(e => e)
        : [];
      
      const payload = {
        url: data.url,
        subscribedEvents: JSON.stringify(eventsList),
        secret: data.secret
      };

      if (isEditing) {
        await api.put(`/settings/webhooks/${initialData.id}`, payload);
        toast.success('Webhook updated');
      } else {
        await api.post('/settings/webhooks', payload);
        toast.success('Webhook created');
      }
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save webhook');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Webhook' : 'Add Webhook Endpoint'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        <div>
          <label className="label">Endpoint URL <span className="text-red-500">*</span></label>
          <input 
            type="url" 
            className={`input ${errors.url ? 'input-error' : ''}`}
            placeholder="https://your-server.com/webhooks"
            {...register('url', { required: 'URL is required' })}
          />
          {errors.url && <p className="error-msg">{errors.url.message}</p>}
        </div>

        <div>
          <label className="label">Events to send</label>
          <input 
            type="text" 
            className="input"
            placeholder="e.g. customer.created, subscription.renewed"
            {...register('events')}
          />
          <p className="text-xs text-slate-500 mt-1">
            Comma-separated list of event names. Leave blank to receive all events.
          </p>
        </div>

        <div>
          <label className="label">Signing Secret (Optional)</label>
          <input 
            type="password" 
            className="input"
            placeholder="Used to sign webhook payloads"
            {...register('secret')}
          />
          <p className="text-xs text-slate-500 mt-1">
            If provided, we will include a signature in the X-Webhook-Signature header.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Endpoint'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
