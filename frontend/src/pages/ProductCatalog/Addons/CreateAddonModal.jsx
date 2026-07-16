import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import api from "../../../services/api";
import Modal from "../../../components/common/Modal";
export default function CreateAddonModal({
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
  const [families, setFamilies] = useState([]);
  const [customFields, setCustomFields] = useState([]);
  const [customFieldValues, setCustomFieldValues] = useState({});
  const isEditing = !!initialData;
  useEffect(() => {
    if (isOpen) {
      api
        .get("/product-families/all")
        .then((res) => setFamilies(res.data.data))
        .catch(() => toast.error("Failed to load product families"));
      api
        .get("/custom-fields?entityType=addon")
        .then((res) => setCustomFields(res.data.data))
        .catch(() => {});
      if (initialData) {
        Object.keys(initialData).forEach((key) =>
          setValue(key, initialData[key]),
        );
      } else {
        reset();
        setCustomFieldValues({});
      }
    }
  }, [isOpen, initialData, setValue, reset]);
  const onSubmit = async (data) => {
    try {
      const formattedCustomFields = Object.keys(customFieldValues).map(
        (key) => ({ fieldId: key, fieldValue: customFieldValues[key] }),
      );
      const payload = { ...data, customFieldValues: formattedCustomFields };
      if (isEditing) {
        await api.put(`/addons/${initialData.id}`, payload);
        toast.success("Addon updated");
      } else {
        await api.post("/addons", payload);
        toast.success("Addon created");
      }
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save addon");
    }
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Addon" : "Create Addon"}
      maxWidth="max-w-2xl"
    >
      {" "}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {" "}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {" "}
          <div className="md:col-span-2 space-y-4">
            {" "}
            <h4 className="font-semibold text-slate-800 text-sm uppercase tracking-wider">
              Basic Info
            </h4>{" "}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {" "}
              <div>
                {" "}
                <label className="label">
                  Addon Name <span className="text-red-500">*</span>
                </label>{" "}
                <input
                  type="text"
                  className={`input ${errors.name ? "input-error" : ""}`}
                  placeholder="e.g. Extra Storage 10GB"
                  {...register("name", { required: "Name is required" })}
                />{" "}
                {errors.name && (
                  <p className="error-msg">{errors.name.message}</p>
                )}{" "}
              </div>{" "}
              <div>
                {" "}
                <label className="label">Addon ID</label>{" "}
                <input
                  type="text"
                  className="input"
                  placeholder="Leave blank to auto-generate"
                  disabled={isEditing}
                  {...register("id")}
                />{" "}
              </div>{" "}
              <div className="md:col-span-2">
                {" "}
                <label className="label">Product Family</label>{" "}
                <select className="select" {...register("productFamilyId")}>
                  {" "}
                  <option value="">Applicable to all families</option>{" "}
                  {families.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}{" "}
                </select>{" "}
              </div>{" "}
              <div className="md:col-span-2">
                {" "}
                <label className="label">Description</label>{" "}
                <textarea
                  className="textarea h-20"
                  {...register("description")}
                ></textarea>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          <div className="md:col-span-2 space-y-4 pt-4 border-t border-slate-100">
            {" "}
            <h4 className="font-semibold text-slate-800 text-sm uppercase tracking-wider">
              Pricing
            </h4>{" "}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {" "}
              <div>
                {" "}
                <label className="label">Pricing Model</label>{" "}
                <select className="select" {...register("pricingModel")}>
                  {" "}
                  <option value="flat_fee">Flat Fee</option>{" "}
                  <option value="per_unit">Per Unit</option>{" "}
                  <option value="tiered">Tiered</option>{" "}
                  <option value="volume">Volume</option>{" "}
                </select>{" "}
              </div>{" "}
              <div>
                {" "}
                <label className="label">Charge Type</label>{" "}
                <select className="select" {...register("chargeType")}>
                  {" "}
                  <option value="recurring">
                    Recurring (billed with plan)
                  </option>{" "}
                  <option value="one_time">One-Time</option>{" "}
                </select>{" "}
              </div>{" "}
              <div>
                {" "}
                <label className="label">
                  Price <span className="text-red-500">*</span>
                </label>{" "}
                <div className="relative">
                  {" "}
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {" "}
                    <span className="text-slate-500 sm:text-sm">$</span>{" "}
                  </div>{" "}
                  <input
                    type="number"
                    step="0.01"
                    className={`input pl-7 ${errors.price ? "input-error" : ""}`}
                    placeholder="0.00"
                    {...register("price", {
                      required: "Price is required",
                      valueAsNumber: true,
                    })}
                  />{" "}
                </div>{" "}
                {errors.price && (
                  <p className="error-msg">{errors.price.message}</p>
                )}{" "}
              </div>{" "}
              <div>
                {" "}
                <label className="label">Currency</label>{" "}
                <select className="select" {...register("currency")}>
                  {" "}
                  <option value="USD">USD</option>{" "}
                  <option value="EUR">EUR</option>{" "}
                  <option value="GBP">GBP</option>{" "}
                </select>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          <div className="md:col-span-2 space-y-4 pt-4 border-t border-slate-100">
            {" "}
            <h4 className="font-semibold text-slate-800 text-sm uppercase tracking-wider">
              Visibility
            </h4>{" "}
            <div className="flex gap-6">
              {" "}
              <label className="flex items-center gap-2 cursor-pointer">
                {" "}
                <input
                  type="checkbox"
                  className="checkbox"
                  {...register("displaySelfServe")}
                />{" "}
                <span className="text-sm text-slate-700">
                  Display in Self-Serve Portal
                </span>{" "}
              </label>{" "}
              <label className="flex items-center gap-2 cursor-pointer">
                {" "}
                <input
                  type="checkbox"
                  className="checkbox"
                  {...register("displayCheckout")}
                />{" "}
                <span className="text-sm text-slate-700">
                  Display in Checkout
                </span>{" "}
              </label>{" "}
            </div>{" "}
          </div>{" "}
          <div className="md:col-span-2 space-y-4 pt-4 border-t border-slate-100">
            {" "}
            <h4 className="font-semibold text-slate-800 text-sm uppercase tracking-wider">
              Custom Fields
            </h4>{" "}
            <div className="grid grid-cols-1 gap-4">
              {" "}
              {customFields.length === 0 ? (
                <p className="text-sm text-muted">
                  No custom fields defined for Addons.
                </p>
              ) : (
                customFields.map((cf) => (
                  <div key={cf.id}>
                    {" "}
                    <label className="label">
                      {cf.fieldName}{" "}
                      {cf.isRequired && (
                        <span style={{ color: "#C0292B" }}>*</span>
                      )}
                    </label>{" "}
                    <input
                      type="text"
                      className="input w-full md:w-1/2"
                      value={customFieldValues[cf.id] || ""}
                      onChange={(e) =>
                        setCustomFieldValues({
                          ...customFieldValues,
                          [cf.id]: e.target.value,
                        })
                      }
                    />{" "}
                  </div>
                ))
              )}{" "}
            </div>{" "}
          </div>{" "}
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
