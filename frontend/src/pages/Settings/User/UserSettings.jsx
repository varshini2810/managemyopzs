import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  Building,
  Save,
  Hash,
} from "lucide-react";
import api from "../../../services/api";
const EMPTY_FORM = {
  fullName: "",
  employeeId: "",
  email: "",
  role: "USER",
  phone: "",
  dob: "",
  jobTitle: "",
  department: "",
  companyInfo: "",
  status: "Active",
};
export default function UserSettings() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: EMPTY_FORM });
  const [loading, setLoading] = useState(false);
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post("/employees", data);
      toast.success("Employee saved and synced to Access Control.");
      reset(EMPTY_FORM);
    } catch (error) {
      const msg =
        error.response?.data?.error || error.response?.data?.data?.error;
      toast.error(msg || "Failed to save employee");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="space-y-6 animate-fade-in">
      {" "}
      <div className="mb-2">
        {" "}
        <h2 className="text-base font-bold text-ink">Personal Details</h2>{" "}
        <p className="text-sm text-muted mt-0.5">
          {" "}
          Add employees here. Each saved employee is automatically added to{" "}
          <strong>Settings → Access Control</strong>.{" "}
        </p>{" "}
      </div>{" "}
      <div className="card">
        {" "}
        <div className="flex items-center gap-2 border-b border-border pb-4 mb-6">
          {" "}
          <User className="text-accent" size={20} />{" "}
          <h2 className="font-semibold text-ink text-lg tracking-tight">
            Add New Employee
          </h2>{" "}
        </div>{" "}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
          noValidate
        >
          {" "}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {" "}
            {/* Full Name */}{" "}
            <div>
              {" "}
              <label className="label">
                Full Name <span className="text-rose-500">*</span>
              </label>{" "}
              <div className="relative">
                {" "}
                <User
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                />{" "}
                <input
                  type="text"
                  placeholder="e.g. Jane Doe"
                  className={`input pl-9 ${errors.fullName ? "input-error" : ""}`}
                  {...register("fullName", {
                    required: "Full name is required",
                  })}
                />{" "}
              </div>{" "}
              {errors.fullName && (
                <p className="error-msg">{errors.fullName.message}</p>
              )}{" "}
            </div>{" "}
            {/* Employee ID */}{" "}
            <div>
              {" "}
              <label className="label">
                Employee ID <span className="text-rose-500">*</span>
              </label>{" "}
              <div className="relative">
                {" "}
                <Hash
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                />{" "}
                <input
                  type="text"
                  placeholder="EMP-001"
                  className={`input pl-9 ${errors.employeeId ? "input-error" : ""}`}
                  {...register("employeeId", {
                    required: "Employee ID is required",
                  })}
                />{" "}
              </div>{" "}
              {errors.employeeId && (
                <p className="error-msg">{errors.employeeId.message}</p>
              )}{" "}
            </div>{" "}
            {/* Email */}{" "}
            <div>
              {" "}
              <label className="label">
                Email Address <span className="text-rose-500">*</span>
              </label>{" "}
              <div className="relative">
                {" "}
                <Mail
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                />{" "}
                <input
                  type="email"
                  placeholder="jane@company.com"
                  className={`input pl-9 ${errors.email ? "input-error" : ""}`}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email address",
                    },
                  })}
                />{" "}
              </div>{" "}
              {errors.email && (
                <p className="error-msg">{errors.email.message}</p>
              )}{" "}
            </div>{" "}
            {/* Role */}{" "}
            <div>
              {" "}
              <label className="label">
                Role <span className="text-rose-500">*</span>
              </label>{" "}
              <div className="relative">
                {" "}
                <User
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                />{" "}
                <select
                  className={`input pl-9 bg-white ${errors.role ? "input-error" : ""}`}
                  {...register("role", { required: "Role is required" })}
                >
                  {" "}
                  <option value="USER">User</option>{" "}
                  <option value="ADMIN">Admin</option>{" "}
                  <option value="SUPERADMIN">Super Admin</option>{" "}
                  <option value="ULTRASUPERADMIN">Ultra Admin</option>{" "}
                </select>{" "}
              </div>{" "}
              {errors.role && (
                <p className="error-msg">{errors.role.message}</p>
              )}{" "}
            </div>{" "}
            {/* Phone */}{" "}
            <div>
              {" "}
              <label className="label">Phone Number</label>{" "}
              <div className="relative">
                {" "}
                <Phone
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                />{" "}
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  className="input pl-9"
                  {...register("phone")}
                />{" "}
              </div>{" "}
            </div>{" "}
            {/* Date of Birth */}{" "}
            <div>
              {" "}
              <label className="label">Date of Birth</label>{" "}
              <div className="relative">
                {" "}
                <Calendar
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                />{" "}
                <input
                  type="date"
                  className="input pl-9"
                  {...register("dob")}
                />{" "}
              </div>{" "}
            </div>{" "}
            {/* Job Title */}{" "}
            <div>
              {" "}
              <label className="label">Designation / Job Title</label>{" "}
              <div className="relative">
                {" "}
                <Briefcase
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                />{" "}
                <input
                  type="text"
                  placeholder="e.g. Billing Manager"
                  className="input pl-9"
                  {...register("jobTitle")}
                />{" "}
              </div>{" "}
            </div>{" "}
            {/* Department */}{" "}
            <div>
              {" "}
              <label className="label">Department</label>{" "}
              <div className="relative">
                {" "}
                <Briefcase
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                />{" "}
                <input
                  type="text"
                  placeholder="e.g. Finance"
                  className="input pl-9"
                  {...register("department")}
                />{" "}
              </div>{" "}
            </div>{" "}
            {/* Company Info */}{" "}
            <div className="md:col-span-2">
              {" "}
              <label className="label">Company Information</label>{" "}
              <div className="relative">
                {" "}
                <Building
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                />{" "}
                <input
                  type="text"
                  placeholder="Company Name"
                  className="input pl-9"
                  {...register("companyInfo")}
                />{" "}
              </div>{" "}
            </div>{" "}
            {/* Employment Status */}{" "}
            <div>
              {" "}
              <label className="label">Employment Status</label>{" "}
              <div className="relative">
                {" "}
                <User
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                />{" "}
                <select className="input pl-9 bg-white" {...register("status")}>
                  {" "}
                  <option value="Active">Active</option>{" "}
                  <option value="Inactive">Inactive</option>{" "}
                </select>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          <div className="pt-4 border-t border-border flex justify-end">
            {" "}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center gap-2"
            >
              {" "}
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save size={16} />
              )}{" "}
              {loading ? "Saving..." : "Save Changes"}{" "}
            </button>{" "}
          </div>{" "}
        </form>{" "}
      </div>{" "}
    </div>
  );
}
