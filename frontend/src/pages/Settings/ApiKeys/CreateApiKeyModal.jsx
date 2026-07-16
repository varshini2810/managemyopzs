import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import api from "../../../services/api";
import Modal from "../../../components/common/Modal";
export default function CreateApiKeyModal({ isOpen, onClose, onSuccess }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();
  useEffect(() => {
    if (isOpen) reset();
  }, [isOpen, reset]);
  const onSubmit = async (data) => {
    try {
      const res = await api.post("/settings/api-keys", data);
      onSuccess(res.data.data);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create API key");
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Secret Key">
      {" "}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {" "}
        <div>
          {" "}
          <label className="label">
            Key Name <span className="text-red-500">*</span>
          </label>{" "}
          <input
            type="text"
            className={`input ${errors.name ? "input-error" : ""}`}
            placeholder="e.g. Production ERP Integration"
            {...register("name", { required: "Name is required" })}
          />{" "}
          <p className="text-xs text-slate-500 mt-1">
            {" "}
            Give this key a recognizable name to easily identify it later.{" "}
          </p>{" "}
          {errors.name && (
            <p className="error-msg">{errors.name.message}</p>
          )}{" "}
        </div>{" "}
        <div>
          {" "}
          <label className="label">Permissions</label>{" "}
          <select className="select" {...register("permissions")}>
            {" "}
            <option value='{"role":"admin"}'>Full Access (Admin)</option>{" "}
            <option value='{"role":"readonly"}'>Read-Only Access</option>{" "}
          </select>{" "}
        </div>{" "}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
          {" "}
          <button type="button" onClick={onClose} className="btn-secondary">
            {" "}
            Cancel{" "}
          </button>{" "}
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {" "}
            {isSubmitting ? "Creating..." : "Create Key"}{" "}
          </button>{" "}
        </div>{" "}
      </form>{" "}
    </Modal>
  );
}
