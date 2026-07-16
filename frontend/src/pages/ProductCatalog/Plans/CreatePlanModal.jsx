import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Check, X } from "lucide-react";
import api from "../../../services/api";
import Toggle from "../../../components/common/Toggle"; /* ── Step Rail ──────────────────────────────────────────────────── */
const STEPS = [
  { id: "basic", label: "Basic Info", desc: "Name & family" },
  { id: "customer", label: "Customer Facing", desc: "Visibility settings" },
  { id: "billing", label: "Billing Cycle", desc: "Period & trial" },
  { id: "custom", label: "Custom Fields", desc: "Additional data" },
  { id: "review", label: "Review", desc: "Confirm & create" },
];
function StepRail({ current, completed }) {
  const currentIdx = STEPS.findIndex((s) => s.id === current);
  return (
    <div className="step-rail w-52 shrink-0">
      {" "}
      {STEPS.map((step, i) => {
        const done = completed.has(step.id);
        const active = step.id === current;
        const past = i < currentIdx;
        return (
          <div key={step.id} className="step-item">
            {" "}
            {i < STEPS.length - 1 && <div className="step-connector" />}{" "}
            <div
              className={`step-dot ${done || past ? "complete" : active ? "active" : "pending"}`}
            >
              {" "}
              {done || past ? (
                <Check size={12} strokeWidth={2.5} />
              ) : (
                i + 1
              )}{" "}
            </div>{" "}
            <div className="pt-0.5">
              {" "}
              <div
                className={`text-sm font-medium ${active ? "text-ink" : past || done ? "text-muted" : "text-stone-400"}`}
              >
                {" "}
                {step.label}{" "}
              </div>{" "}
              <div className="text-xs text-muted mt-0.5">{step.desc}</div>{" "}
            </div>{" "}
          </div>
        );
      })}{" "}
    </div>
  );
} /* ── Full-page multi-step Create Plan form ─────────────────────── */
export default function CreatePlanModal({ isOpen, onClose, onSuccess }) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      displaySelfServe: false,
      displayCheckout: false,
      trialPeriod: 0,
      billingPeriod: 1,
      billingPeriodUnit: "MONTHS",
    },
  });
  const [step, setStep] = useState("basic");
  const [completed, setCompleted] = useState(new Set());
  const [families, setFamilies] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [selfServe, setSelfServe] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [customFields, setCustomFields] = useState([]);
  const [customFieldValues, setCustomFieldValues] = useState({});
  const formData = watch();
  useEffect(() => {
    if (isOpen) {
      reset();
      setStep("basic");
      setCompleted(new Set());
      setSelfServe(false);
      setCheckout(false);
      api
        .get("/product-families/all")
        .then((res) => setFamilies(res.data.data || []))
        .catch(() => {});
      api
        .get("/custom-fields?entityType=plan")
        .then((res) => setCustomFields(res.data.data || []))
        .catch(() => {});
    }
  }, [isOpen, reset]);
  if (!isOpen) return null;
  const advance = (from) => {
    setCompleted((prev) => new Set([...prev, from]));
    const idx = STEPS.findIndex((s) => s.id === from);
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1].id);
  };
  const goTo = (id) => {
    const idx = STEPS.findIndex((s) => s.id === id);
    const curIdx = STEPS.findIndex((s) => s.id === step);
    if (idx < curIdx || completed.has(id)) setStep(id);
  };
  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      const formattedCustomFields = Object.keys(customFieldValues).map(
        (key) => ({ fieldId: key, fieldValue: customFieldValues[key] }),
      );
      const payload = {
        ...data,
        displaySelfServe: selfServe,
        displayCheckout: checkout,
        customFieldValues: formattedCustomFields,
      };
      const res = await api.post("/plans", payload);
      toast.success("Plan created");
      onSuccess(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create plan");
    } finally {
      setSubmitting(false);
    }
  };
  const billingUnit = formData.billingPeriodUnit || "MONTHS";
  const trialPeriod = formData.trialPeriod || 0;
  return (
    /* Full-screen overlay */ <div
      className="fixed inset-0 z-50 flex items-stretch"
      style={{ background: "rgba(28,27,26,0.4)" }}
    >
      {" "}
      <div
        className="m-auto bg-surface rounded-lg w-full max-w-3xl flex overflow-hidden"
        style={{
          border: "1px solid #E7E5E2",
          height: "calc(100vh - 80px)",
          maxHeight: 680,
        }}
      >
        {" "}
        {/* Left — step rail */}{" "}
        <div
          className="shrink-0 flex flex-col"
          style={{
            width: 220,
            background: "#FAFAF9",
            borderRight: "1px solid #E7E5E2",
            padding: "32px 24px",
          }}
        >
          {" "}
          <div className="mb-8">
            {" "}
            <div className="text-base font-semibold font-display text-ink tracking-tight">
              Create Plan
            </div>{" "}
            <div className="text-xs text-muted mt-1">
              Set up a new subscription plan
            </div>{" "}
          </div>{" "}
          <StepRail current={step} completed={completed} />{" "}
        </div>{" "}
        {/* Right — form content */}{" "}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col flex-1 min-w-0"
        >
          {" "}
          {/* Header */}{" "}
          <div
            className="flex items-center justify-between px-8 py-5 shrink-0"
            style={{ borderBottom: "1px solid #E7E5E2" }}
          >
            {" "}
            <div>
              {" "}
              <h2 className="text-base font-semibold text-ink font-display">
                {" "}
                {STEPS.find((s) => s.id === step)?.label}{" "}
              </h2>{" "}
              <p className="text-xs text-muted mt-0.5">
                {STEPS.find((s) => s.id === step)?.desc}
              </p>{" "}
            </div>{" "}
            <button type="button" onClick={onClose} className="btn-ghost p-2">
              {" "}
              <X size={16} />{" "}
            </button>{" "}
          </div>{" "}
          {/* Step content */}{" "}
          <div className="flex-1 overflow-y-auto px-8 py-7">
            {" "}
            {/* ── Step 1: Basic Info ── */}{" "}
            {step === "basic" && (
              <div className="space-y-5 max-w-lg">
                {" "}
                <div>
                  {" "}
                  <label className="label">
                    Product Family <span style={{ color: "#C0292B" }}>*</span>
                  </label>{" "}
                  <select
                    className={`select ${errors.productFamilyId ? "input-error" : ""}`}
                    {...register("productFamilyId", {
                      required: "Select a product family",
                    })}
                  >
                    {" "}
                    <option value="">Select family…</option>{" "}
                    {families.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}{" "}
                  </select>{" "}
                  {errors.productFamilyId && (
                    <p className="error-msg">
                      {errors.productFamilyId.message}
                    </p>
                  )}{" "}
                </div>{" "}
                <div>
                  {" "}
                  <label className="label">
                    Internal Name <span style={{ color: "#C0292B" }}>*</span>
                  </label>{" "}
                  <input
                    type="text"
                    className={`input ${errors.name ? "input-error" : ""}`}
                    placeholder="e.g. Pro Monthly"
                    {...register("name", { required: "Name is required" })}
                  />{" "}
                  {errors.name && (
                    <p className="error-msg">{errors.name.message}</p>
                  )}{" "}
                  <p className="text-xs text-muted mt-1.5">
                    Visible to admins only, not to customers
                  </p>{" "}
                </div>{" "}
                <div>
                  {" "}
                  <label className="label">Description</label>{" "}
                  <textarea
                    className="textarea"
                    style={{ height: 80 }}
                    placeholder="Internal notes about this plan…"
                    {...register("description")}
                  />{" "}
                </div>{" "}
              </div>
            )}{" "}
            {/* ── Step 2: Customer Facing ── */}{" "}
            {step === "customer" && (
              <div className="space-y-4 max-w-lg">
                {" "}
                <p className="text-sm text-muted">
                  Control where customers can discover and select this plan.
                </p>{" "}
                {[
                  {
                    key: "selfServe",
                    val: selfServe,
                    set: setSelfServe,
                    label: "Display in Self-Serve Portal",
                    desc: "Allow existing customers to switch to this plan independently",
                  },
                  {
                    key: "checkout",
                    val: checkout,
                    set: setCheckout,
                    label: "Display in Checkout",
                    desc: "Allow new customers to purchase via hosted checkout page",
                  },
                ].map((opt) => (
                  <div
                    key={opt.key}
                    className="flex items-start justify-between gap-4 p-4 rounded-lg cursor-pointer"
                    style={{ border: "1px solid #E7E5E2" }}
                    onClick={() => opt.set((v) => !v)}
                  >
                    {" "}
                    <div>
                      {" "}
                      <div className="text-sm font-medium text-ink">
                        {opt.label}
                      </div>{" "}
                      <div className="text-xs text-muted mt-0.5">
                        {opt.desc}
                      </div>{" "}
                    </div>{" "}
                    <Toggle checked={opt.val} onChange={opt.set} />{" "}
                  </div>
                ))}{" "}
              </div>
            )}{" "}
            {/* ── Step 3: Billing Cycle ── */}{" "}
            {step === "billing" && (
              <div className="space-y-5 max-w-lg">
                {" "}
                <div>
                  {" "}
                  <label className="label">Billing Period</label>{" "}
                  <div className="flex gap-3">
                    {" "}
                    <input
                      type="number"
                      min="1"
                      className="input"
                      style={{ width: 90 }}
                      {...register("billingPeriod", { min: 1 })}
                    />{" "}
                    <select
                      className="select flex-1"
                      {...register("billingPeriodUnit")}
                    >
                      {" "}
                      {["DAYS", "WEEKS", "MONTHS", "YEARS"].map((u) => (
                        <option key={u} value={u}>
                          {u.charAt(0) + u.slice(1).toLowerCase()}
                        </option>
                      ))}{" "}
                    </select>{" "}
                  </div>{" "}
                </div>{" "}
                <div>
                  {" "}
                  <label className="label">Trial Period</label>{" "}
                  <div className="flex gap-3 items-center">
                    {" "}
                    <input
                      type="number"
                      min="0"
                      className="input"
                      style={{ width: 90 }}
                      {...register("trialPeriod", { min: 0 })}
                    />{" "}
                    <select
                      className="select flex-1"
                      {...register("trialPeriodUnit")}
                    >
                      {" "}
                      {["DAYS", "WEEKS", "MONTHS"].map((u) => (
                        <option key={u} value={u}>
                          {u.charAt(0) + u.slice(1).toLowerCase()}
                        </option>
                      ))}{" "}
                    </select>{" "}
                  </div>{" "}
                  <p className="text-xs text-muted mt-1.5">
                    Set to 0 for no trial period
                  </p>{" "}
                </div>{" "}
              </div>
            )}{" "}
            {/* ── Step 4: Custom Fields ── */}{" "}
            {step === "custom" && (
              <div className="space-y-5 max-w-lg">
                {" "}
                {customFields.length === 0 ? (
                  <p className="text-sm text-muted">
                    No custom fields defined for Plans.
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
                        className="input"
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
              </div>
            )}{" "}
            {/* ── Step 5: Review ── */}{" "}
            {step === "review" && (
              <div className="max-w-lg space-y-5">
                {" "}
                <div
                  className="rounded-lg p-5 space-y-3"
                  style={{ background: "#FAFAF9", border: "1px solid #E7E5E2" }}
                >
                  {" "}
                  <div className="section-label">Plan Summary</div>{" "}
                  {[
                    ["Name", formData.name || "—"],
                    [
                      "Family",
                      families.find((f) => f.id === formData.productFamilyId)
                        ?.name || "—",
                    ],
                    ["Description", formData.description || "—"],
                    [
                      "Billing",
                      `${formData.billingPeriod} ${billingUnit.toLowerCase()}`,
                    ],
                    [
                      "Trial",
                      trialPeriod > 0
                        ? `${trialPeriod} ${(formData.trialPeriodUnit || "DAYS").toLowerCase()}`
                        : "No trial",
                    ],
                    ["Self-Serve", selfServe ? "Visible" : "Hidden"],
                    ["Checkout", checkout ? "Visible" : "Hidden"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between text-sm">
                      {" "}
                      <span className="text-muted">{k}</span>{" "}
                      <span className="text-ink font-medium">{v}</span>{" "}
                    </div>
                  ))}{" "}
                </div>{" "}
                <p className="text-xs text-muted">
                  {" "}
                  You can add price points after creating the plan.{" "}
                </p>{" "}
              </div>
            )}{" "}
          </div>{" "}
          {/* Footer nav */}{" "}
          <div
            className="flex items-center justify-between px-8 py-4 shrink-0"
            style={{ borderTop: "1px solid #E7E5E2", background: "#FAFAF9" }}
          >
            {" "}
            <button
              type="button"
              className="btn-ghost btn-sm"
              onClick={() => {
                const idx = STEPS.findIndex((s) => s.id === step);
                if (idx > 0) setStep(STEPS[idx - 1].id);
              }}
              disabled={step === STEPS[0].id}
            >
              {" "}
              Back{" "}
            </button>{" "}
            <div className="flex items-center gap-2">
              {" "}
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary btn-sm"
              >
                Cancel
              </button>{" "}
              {step !== "review" ? (
                <button
                  type="button"
                  className="btn-primary btn-sm"
                  onClick={() => advance(step)}
                >
                  {" "}
                  Continue{" "}
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn-primary btn-sm"
                  disabled={submitting}
                >
                  {" "}
                  {submitting ? "Creating…" : "Create Plan"}{" "}
                </button>
              )}{" "}
            </div>{" "}
          </div>{" "}
        </form>{" "}
      </div>{" "}
    </div>
  );
}
