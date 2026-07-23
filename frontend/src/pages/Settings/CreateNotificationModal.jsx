import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "../../components/common/Modal";

export default function CreateNotificationModal({ isOpen, onClose, onSuccess }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { type: "", channel: "Email", recipients: "", status: true } });

  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const onSubmit = (data) => {
    // For now, we update the local state since backend is not connected.
    onSuccess(data);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Custom Notification">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink mb-1">
            Notification Type
          </label>
          <input
            {...register("type", { required: "Type is required" })}
            className="input w-full"
            placeholder="e.g. Test Alert"
          />
          {errors.type && (
            <p className="text-danger text-xs mt-1">{errors.type.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-1">
            Channel
          </label>
          <select {...register("channel")} className="input w-full">
            <option value="Email">Email</option>
            <option value="SMS">SMS</option>
            <option value="Webhook">Webhook</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-1">
            Recipients
          </label>
          <input
            {...register("recipients", { required: "Recipients are required" })}
            className="input w-full"
            placeholder="e.g. Admin, Customer"
          />
          {errors.recipients && (
            <p className="text-danger text-xs mt-1">
              {errors.recipients.message}
            </p>
          )}
        </div>
        
        <div>
          <label className="flex items-center gap-2">
            <input type="checkbox" {...register("status")} className="rounded-input text-primary focus:ring-accent" />
            <span className="text-sm font-medium text-ink">Enabled</span>
          </label>
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-gray-border">
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost"
          >
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
}
