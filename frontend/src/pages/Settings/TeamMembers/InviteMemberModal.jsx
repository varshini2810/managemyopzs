import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import api from "../../../services/api";
import Modal from "../../../components/common/Modal";
const AVAILABLE_PERMISSIONS = [
  { id: "BILLING_READ", label: "Chargebee Billing" },
  { id: "CPQ_READ", label: "Chargebee CPQ" },
  { id: "RECEIVABLES_READ", label: "Chargebee Receivables" },
  { id: "RETENTION_READ", label: "Chargebee Retention" },
  { id: "REVREC_READ", label: "Chargebee RevRec" },
  { id: "PAYMENTS_READ", label: "Chargebee Payments" },
  { id: "GROWTH_READ", label: "Chargebee Growth" },
];
export default function InviteMemberModal({ isOpen, onClose, onSuccess }) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { role: "USER" } });
  const [selectedPerms, setSelectedPerms] = useState([]);
  const selectedRole = watch("role");
  useEffect(() => {
    if (isOpen) {
      reset();
      setSelectedPerms([]);
    }
  }, [isOpen, reset]);
  const togglePerm = (id) => {
    setSelectedPerms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };
  const onSubmit = async (data) => {
    try {
      const res = await api.post("/settings/team-members", data);
      /*  changed from invite to root per prompt  */ if (
        data.role === "ADMIN" &&
        selectedPerms.length > 0
      ) {
        await api.put(
          `/settings/team-members/${res.data.data.id}/permissions`,
          { permissions: selectedPerms },
        );
      }
      toast.success("Invitation sent");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send invitation");
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Invite Team Member">
      {" "}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {" "}
        <div>
          {" "}
          <label className="label">
            Full Name <span className="text-red-500">*</span>
          </label>{" "}
          <input
            type="text"
            className={`input ${errors.name ? "input-error" : ""}`}
            placeholder="e.g. Jane Doe"
            {...register("name", { required: "Name is required" })}
          />{" "}
          {errors.name && (
            <p className="error-msg">{errors.name.message}</p>
          )}{" "}
        </div>{" "}
        <div>
          {" "}
          <label className="label">
            Email Address <span className="text-red-500">*</span>
          </label>{" "}
          <input
            type="email"
            className={`input ${errors.email ? "input-error" : ""}`}
            placeholder="jane@company.com"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "invalid email address",
              },
            })}
          />{" "}
          {errors.email && (
            <p className="error-msg">{errors.email.message}</p>
          )}{" "}
        </div>{" "}
        <div>
          {" "}
          <label className="label">Role</label>{" "}
          <select className="select" {...register("role")}>
            {" "}
            <option value="SUPERADMIN">Superadmin (Full Access)</option>{" "}
            <option value="ADMIN">Admin (Scoped Access)</option>{" "}
            <option value="USER">User (Read Only / Portal)</option>{" "}
          </select>{" "}
          <p className="text-xs text-slate-500 mt-1">
            {" "}
            Determines what the user can see and do within the platform.{" "}
          </p>{" "}
        </div>{" "}
        {selectedRole === "ADMIN" && (
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 mt-2">
            {" "}
            <label className="label mb-2">Module Access</label>{" "}
            <div className="space-y-2">
              {" "}
              {AVAILABLE_PERMISSIONS.map((perm) => (
                <label
                  key={perm.id}
                  className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer"
                >
                  {" "}
                  <input
                    type="checkbox"
                    checked={selectedPerms.includes(perm.id)}
                    onChange={() => togglePerm(perm.id)}
                    className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                  />{" "}
                  {perm.label}{" "}
                </label>
              ))}{" "}
            </div>{" "}
          </div>
        )}{" "}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
          {" "}
          <button type="button" onClick={onClose} className="btn-secondary">
            {" "}
            Cancel{" "}
          </button>{" "}
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {" "}
            {isSubmitting ? "Sending..." : "Send Invitation"}{" "}
          </button>{" "}
        </div>{" "}
      </form>{" "}
    </Modal>
  );
}
