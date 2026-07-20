import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import api from "../../services/api";
import { ArrowLeft } from "lucide-react";
export default function CustomerForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = id && id !== "new";
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (isEdit) {
      api.get(`/customers/${id}`).then((res) => {
        const c = res.data.data;
        Object.keys(c).forEach((key) => setValue(key, c[key]));
      });
    }
  }, [id, isEdit, setValue]);
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      if (isEdit) {
        await api.put(`/customers/${id}`, data);
        toast.success("Customer updated");
        navigate(`/customers/${id}`);
      } else {
        const res = await api.post("/customers", data);
        toast.success("Customer created");
        navigate(`/customers/${res.data.data.id}`);
      }
    } catch (e) {
      toast.error("Failed to save customer");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      {" "}
      <div className="module-header border-b border-gray-200">
        {" "}
        <div>
          {" "}
          <button
            onClick={() => navigate("/customers")}
            className="flex items-center gap-1 text-sm text-muted hover:text-ink mb-2 transition-colors"
          >
            {" "}
            <ArrowLeft size={14} /> Back to Customers{" "}
          </button>{" "}
          <h1 className="page-title">
            {isEdit ? "Edit Customer" : "Create a New Customer"}
          </h1>{" "}
        </div>{" "}
      </div>{" "}
      <div className="px-8 py-8 max-w-3xl">
        {" "}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {" "}
          {/* Basic Info */}{" "}
          <div className="card p-6 space-y-4">
            {" "}
            <h3 className="text-base font-semibold text-ink border-b border-gray-100 pb-2">
              Basic Info
            </h3>{" "}
            <div className="grid grid-cols-2 gap-4">
              {" "}
              <div>
                {" "}
                <label className="label">First Name</label>{" "}
                <input
                  type="text"
                  className="input"
                  {...register("firstName")}
                />{" "}
              </div>{" "}
              <div>
                {" "}
                <label className="label">Last Name</label>{" "}
                <input
                  type="text"
                  className="input"
                  {...register("lastName")}
                />{" "}
              </div>{" "}
              <div>
                {" "}
                <label className="label">
                  Email <span className="text-red-500">*</span>
                </label>{" "}
                <input
                  type="email"
                  className={`input ${errors.email ? "input-error" : ""}`}
                  {...register("email", { required: "Email is required" })}
                />{" "}
                {errors.email && (
                  <p className="error-msg">{errors.email.message}</p>
                )}{" "}
              </div>{" "}
              <div>
                {" "}
                <label className="label">Company Name</label>{" "}
                <input
                  type="text"
                  className="input"
                  {...register("companyName")}
                />{" "}
              </div>{" "}
              <div>
                {" "}
                <label className="label">Phone</label>{" "}
                <input
                  type="text"
                  className="input"
                  {...register("phone")}
                />{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          {/* Billing Address */}{" "}
          <div className="card p-6 space-y-4">
            {" "}
            <h3 className="text-base font-semibold text-ink border-b border-gray-100 pb-2">
              Billing Address
            </h3>{" "}
            <div className="grid grid-cols-2 gap-4">
              {" "}
              <div className="col-span-2">
                {" "}
                <label className="label">Address Line 1</label>{" "}
                <input
                  type="text"
                  className="input"
                  {...register("billingLine1")}
                />{" "}
              </div>{" "}
              <div className="col-span-2">
                {" "}
                <label className="label">Address Line 2</label>{" "}
                <input
                  type="text"
                  className="input"
                  {...register("billingLine2")}
                />{" "}
              </div>{" "}
              <div>
                {" "}
                <label className="label">City</label>{" "}
                <input
                  type="text"
                  className="input"
                  {...register("billingCity")}
                />{" "}
              </div>{" "}
              <div>
                {" "}
                <label className="label">State/Province</label>{" "}
                <input
                  type="text"
                  className="input"
                  {...register("billingState")}
                />{" "}
              </div>{" "}
              <div>
                {" "}
                <label className="label">Zip/Postal Code</label>{" "}
                <input
                  type="text"
                  className="input"
                  {...register("billingZip")}
                />{" "}
              </div>{" "}
              <div>
                {" "}
                <label className="label">Country</label>{" "}
                <input
                  type="text"
                  className="input"
                  {...register("billingCountry")}
                />{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          {/* Tax Information */}{" "}
          <div className="card p-6 space-y-4">
            {" "}
            <h3 className="text-base font-semibold text-ink border-b border-gray-100 pb-2">
              Tax & Currency
            </h3>{" "}
            <div className="grid grid-cols-2 gap-4">
              {" "}
              <div>
                {" "}
                <label className="label">VAT Number</label>{" "}
                <input
                  type="text"
                  className="input"
                  {...register("vatNumber")}
                />{" "}
              </div>{" "}
              <div>
                {" "}
                <label className="label">Preferred Currency</label>{" "}
                <select className="input" {...register("preferredCurrency")}>
                  {" "}
                  <option value="USD">USD - US Dollar</option>{" "}
                  <option value="EUR">EUR - Euro</option>{" "}
                  <option value="GBP">GBP - British Pound</option>{" "}
                </select>{" "}
              </div>{" "}
              <div className="col-span-2 flex items-center gap-2 mt-2">
                {" "}
                <input
                  type="checkbox"
                  id="taxExempt"
                  {...register("taxExempt")}
                  className="rounded-input border-gray-300 text-primary focus:ring-accent"
                />{" "}
                <label htmlFor="taxExempt" className="text-sm text-ink">
                  This customer is tax exempt
                </label>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            {" "}
            <button
              type="button"
              className="btn-ghost"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>{" "}
            <button type="submit" className="btn-primary" disabled={loading}>
              {" "}
              {loading
                ? "Saving..."
                : isEdit
                  ? "Update Customer"
                  : "Create Customer"}{" "}
            </button>{" "}
          </div>{" "}
        </form>{" "}
      </div>{" "}
    </div>
  );
}
