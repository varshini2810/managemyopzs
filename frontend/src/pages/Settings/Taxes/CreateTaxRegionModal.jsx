import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import api from "../../../services/api";
import Modal from "../../../components/common/Modal";
export default function CreateTaxRegionModal({ isOpen, onClose, onSuccess }) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();
  const country = watch("country");
  useEffect(() => {
    if (isOpen) reset();
  }, [isOpen, reset]);
  const onSubmit = async (data) => {
    try {
      await api.post("/settings/tax-regions", data);
      toast.success("Tax region created");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create tax region");
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Tax Region">
      {" "}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {" "}
        <div>
          {" "}
          <label className="label">
            Country (2-letter code) <span className="text-red-500">*</span>
          </label>{" "}
          <input
            type="text"
            className={`input ${errors.country ? "input-error" : ""} uppercase`}
            placeholder="e.g. US, GB, DE"
            maxLength={2}
            {...register("country", {
              required: "Country code is required",
              maxLength: 2,
              minLength: 2,
            })}
          />{" "}
          {errors.country && (
            <p className="error-msg">{errors.country.message}</p>
          )}{" "}
        </div>{" "}
        {country && country.toUpperCase() === "US" && (
          <div>
            {" "}
            <label className="label">State (2-letter code)</label>{" "}
            <input
              type="text"
              className="input uppercase"
              placeholder="e.g. CA, NY (Leave blank for all states)"
              maxLength={2}
              {...register("state")}
            />{" "}
          </div>
        )}{" "}
        <div>
          {" "}
          <label className="label">
            Tax Name <span className="text-red-500">*</span>
          </label>{" "}
          <input
            type="text"
            className={`input ${errors.taxName ? "input-error" : ""}`}
            placeholder="e.g. VAT, GST, Sales Tax"
            {...register("taxName", { required: "Tax name is required" })}
          />{" "}
          {errors.taxName && (
            <p className="error-msg">{errors.taxName.message}</p>
          )}{" "}
        </div>{" "}
        <div>
          {" "}
          <label className="label">
            Tax Rate (%) <span className="text-red-500">*</span>
          </label>{" "}
          <input
            type="number"
            step="0.01"
            className={`input ${errors.taxRate ? "input-error" : ""}`}
            placeholder="e.g. 20.00"
            {...register("taxRate", {
              required: "Tax rate is required",
              valueAsNumber: true,
            })}
          />{" "}
          {errors.taxRate && (
            <p className="error-msg">{errors.taxRate.message}</p>
          )}{" "}
        </div>{" "}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
          {" "}
          <button type="button" onClick={onClose} className="btn-secondary">
            {" "}
            Cancel{" "}
          </button>{" "}
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {" "}
            {isSubmitting ? "Adding..." : "Add Region"}{" "}
          </button>{" "}
        </div>{" "}
      </form>{" "}
    </Modal>
  );
}
