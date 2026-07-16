import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import api from "../../../services/api";
import Modal from "../../../components/common/Modal";
export default function CreateFamilyModal({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();
  const isEditing = !!initialData;
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setValue("name", initialData.name);
        setValue("id", initialData.id);
        setValue("description", initialData.description || "");
      } else {
        reset();
      }
    }
  }, [isOpen, initialData, setValue, reset]);
  const onSubmit = async (data) => {
    try {
      if (isEditing) {
        await api.put(`/product-families/${initialData.id}`, data);
        toast.success("Product family updated");
      } else {
        await api.post("/product-families", data);
        toast.success("Product family created");
      }
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to save product family",
      );
    }
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Product Family" : "Create Product Family"}
    >
      {" "}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {" "}
        <div>
          {" "}
          <label className="label">
            Product Family Name <span className="text-red-500">*</span>
          </label>{" "}
          <input
            type="text"
            className={`input ${errors.name ? "input-error" : ""}`}
            placeholder="e.g. Acme CRM"
            {...register("name", { required: "Name is required" })}
          />{" "}
          {errors.name && (
            <p className="error-msg">{errors.name.message}</p>
          )}{" "}
        </div>{" "}
        <div>
          {" "}
          <label className="label">Product Family ID</label>{" "}
          <input
            type="text"
            className="input"
            placeholder="Leave blank to auto-generate from name"
            disabled={isEditing}
            {...register("id")}
          />{" "}
          <p className="text-xs text-slate-500 mt-1">
            {" "}
            Unique identifier used in API integrations. Can only contain
            lowercase letters, numbers, and hyphens.{" "}
          </p>{" "}
        </div>{" "}
        <div>
          {" "}
          <label className="label">Description</label>{" "}
          <textarea
            className="textarea h-24"
            placeholder="Optional description"
            {...register("description")}
          ></textarea>{" "}
        </div>{" "}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
          {" "}
          <button type="button" onClick={onClose} className="btn-secondary">
            {" "}
            Dismiss{" "}
          </button>{" "}
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {" "}
            {isSubmitting
              ? "Saving..."
              : isEditing
                ? "Save Changes"
                : "Create"}{" "}
          </button>{" "}
        </div>{" "}
      </form>{" "}
    </Modal>
  );
}
