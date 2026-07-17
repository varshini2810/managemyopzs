import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Lock, Mail, ArrowRight } from "lucide-react";
import { useAuth } from "../../store/AuthContext";
export default function LoginPage() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const user = await login(data.email, data.password);
      toast.success("Welcome back");
      if (user.role === "ULTRASUPERADMIN") {
        navigate("/platform-console");
      } else if (user.role === "USER") {
        navigate("/portal");
      } else {
        navigate("/");
      }
    } catch (error) {
      const msg =
        typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.message || "Invalid credentials";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex" style={{ background: "#FAFAF9" }}>
      {" "}
      {/* Left — illustration panel */}{" "}
      <div
        className="hidden lg:flex w-[44%] flex-col justify-between p-14 relative overflow-hidden"
        style={{ background: "#14130F" }}
      >
        {" "}
        {/* Subtle grid texture */}{" "}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />{" "}
        {/* Logo */}{" "}
        <div className="relative z-10 flex items-center gap-3">
          {" "}
          <svg
            width="28"
            height="28"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {" "}
            <path
              d="M50 15 L85 32.5 L85 67.5 L50 85 L15 67.5 L15 32.5 Z"
              stroke="#FFFFFF"
              strokeWidth="6"
              strokeLinejoin="round"
            />{" "}
            <circle cx="50" cy="15" r="10" fill="#0055FF" />{" "}
            <circle cx="50" cy="85" r="10" fill="#0055FF" />{" "}
            <circle cx="15" cy="50" r="10" fill="#0055FF" />{" "}
            <circle cx="85" cy="50" r="10" fill="#0055FF" />{" "}
            <rect x="30" y="50" width="10" height="20" fill="#0055FF" />{" "}
            <rect x="45" y="40" width="10" height="30" fill="#0055FF" />{" "}
            <rect x="60" y="30" width="10" height="40" fill="#0055FF" />{" "}
            <path
              d="M25 65 L40 55 L50 62 L70 42"
              stroke="#FFFFFF"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />{" "}
            <path
              d="M60 42 L70 42 L70 52"
              stroke="#FFFFFF"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />{" "}
          </svg>{" "}
          <span
            className="font-display font-semibold text-white"
            style={{ letterSpacing: "-0.02em", fontSize: 15 }}
          >
            {" "}
            Opz{" "}
          </span>{" "}
        </div>{" "}
        {/* Hero copy */}{" "}
        <div className="relative z-10">
          {" "}
          <h1
            className="font-display font-semibold text-white mb-4"
            style={{
              fontSize: 32,
              lineHeight: "38px",
              letterSpacing: "-0.03em",
            }}
          >
            {" "}
            Revenue clarity.
            <br /> Built for billing teams.{" "}
          </h1>{" "}
          <p
            className="text-sm"
            style={{ color: "#79756E", lineHeight: "22px", maxWidth: 320 }}
          >
            {" "}
            Manage subscriptions, plans, pricing, and revenue metrics from a
            single enterprise-grade dashboard.{" "}
          </p>{" "}
          {/* Ledger sample decoration */}{" "}
          <div
            className="mt-10 rounded-lg p-5 space-y-3"
            style={{ background: "#1E1C17", border: "1px solid #2A2620" }}
          >
            {" "}
            {[
              {
                label: "Monthly Recurring Revenue",
                val: "$15,450",
                pct: "+5.4%",
                up: true,
              },
              {
                label: "Active Subscriptions",
                val: "128",
                pct: "+1.2%",
                up: true,
              },
              {
                label: "Unpaid Invoices",
                val: "$1,330",
                pct: "–15.4%",
                up: false,
              },
            ].map((m, i) => (
              <div key={i} className="flex items-center justify-between">
                {" "}
                <div className="flex items-center gap-3">
                  {" "}
                  <div
                    style={{
                      width: 3,
                      height: 28,
                      borderRadius: 2,
                      background: m.up ? "#1A7F4E" : "#B45309",
                    }}
                  />{" "}
                  <div>
                    {" "}
                    <div className="text-2xs" style={{ color: "#57534E" }}>
                      {m.label}
                    </div>{" "}
                    <div
                      className="font-display font-semibold tabular-nums"
                      style={{
                        color: "#FFFFFF",
                        fontSize: 16,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {" "}
                      {m.val}{" "}
                    </div>{" "}
                  </div>{" "}
                </div>{" "}
                <span
                  className="text-xs font-medium tabular-nums"
                  style={{ color: m.up ? "#1A7F4E" : "#B45309" }}
                >
                  {" "}
                  {m.pct}{" "}
                </span>{" "}
              </div>
            ))}{" "}
          </div>{" "}
        </div>{" "}
        <div className="absolute bottom-8 left-8 text-xs font-medium text-muted">
          {" "}
          © 2026 Opz. All rights reserved.{" "}
        </div>{" "}
      </div>{" "}
      {/* Right — login form */}{" "}
      <div className="flex-1 flex flex-col justify-center items-center px-8 py-12">
        {" "}
        <div style={{ width: "100%", maxWidth: 380 }}>
          {" "}
          {/* Mobile logo */}{" "}
          <div className="flex items-center gap-2 mb-10">
            {" "}
            <svg
              width="28"
              height="28"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {" "}
              <path
                d="M50 15 L85 32.5 L85 67.5 L50 85 L15 67.5 L15 32.5 Z"
                stroke="#000000"
                strokeWidth="6"
                strokeLinejoin="round"
              />{" "}
              <circle cx="50" cy="15" r="10" fill="#0055FF" />{" "}
              <circle cx="50" cy="85" r="10" fill="#0055FF" />{" "}
              <circle cx="15" cy="50" r="10" fill="#0055FF" />{" "}
              <circle cx="85" cy="50" r="10" fill="#0055FF" />{" "}
              <rect x="30" y="50" width="10" height="20" fill="#0055FF" />{" "}
              <rect x="45" y="40" width="10" height="30" fill="#0055FF" />{" "}
              <rect x="60" y="30" width="10" height="40" fill="#0055FF" />{" "}
              <path
                d="M25 65 L40 55 L50 62 L70 42"
                stroke="#000000"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />{" "}
              <path
                d="M60 42 L70 42 L70 52"
                stroke="#000000"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />{" "}
            </svg>{" "}
            <div className="font-display font-semibold text-lg text-ink tracking-tight">
              {" "}
              Opz{" "}
            </div>{" "}
          </div>{" "}
          <div className="mb-8">
            {" "}
            <h2
              className="font-display font-semibold text-ink mb-1.5"
              style={{ fontSize: 22, letterSpacing: "-0.025em" }}
            >
              {" "}
              Sign in{" "}
            </h2>{" "}
            <p className="text-sm text-muted">
              {" "}
              Enter your credentials to access the platform.{" "}
            </p>{" "}
            {/* Quick-fill credential chips */}{" "}
            <div className="mt-4">
              {" "}
              <p
                className="text-xs text-muted mb-2"
                style={{ color: "#A8A49F" }}
              >
                Quick fill:
              </p>{" "}
              <div className="flex flex-wrap gap-2">
                {" "}
                {[
                  {
                    label: "Admin",
                    email: "admin@billingplatform.com",
                    password: "Admin@123",
                  },
                  {
                    label: "Super Admin",
                    email: "superadmin@billingplatform.com",
                    password: "Super@123",
                  },
                  {
                    label: "Ultra Admin",
                    email: "ultraadmin@billingplatform.com",
                    password: "Ultra@123",
                  },
                  {
                    label: "User",
                    email: "user@billingplatform.com",
                    password: "User@123",
                  },
                ].map((cred) => (
                  <button
                    key={cred.label}
                    type="button"
                    onClick={() => {
                      setValue("email", cred.email, { shouldValidate: true });
                      setValue("password", cred.password, {
                        shouldValidate: true,
                      });
                    }}
                    style={{
                      fontSize: 11,
                      padding: "3px 10px",
                      borderRadius: 20,
                      border: "1px solid #E5E2DC",
                      background: "#F5F4F1",
                      color: "#57534E",
                      cursor: "pointer",
                      transition: "all 0.15s",
                      fontWeight: 500,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#14130F";
                      e.currentTarget.style.color = "#fff";
                      e.currentTarget.style.borderColor = "#14130F";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#F5F4F1";
                      e.currentTarget.style.color = "#57534E";
                      e.currentTarget.style.borderColor = "#E5E2DC";
                    }}
                  >
                    {" "}
                    {cred.label}{" "}
                  </button>
                ))}{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            {" "}
            {/* Email */}{" "}
            <div>
              {" "}
              <label className="label">Email</label>{" "}
              <div className="relative">
                {" "}
                <Mail
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "#A8A49F" }}
                />{" "}
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  className={`input pl-9 ${errors.email ? "input-error" : ""}`}
                  {...register("email", { required: "Email is required" })}
                />{" "}
              </div>{" "}
              {errors.email && (
                <p className="error-msg">{errors.email.message}</p>
              )}{" "}
            </div>{" "}
            {/* Password */}{" "}
            <div>
              {" "}
              <div className="flex items-center justify-between mb-1.5">
                {" "}
                <label className="label mb-0">Password</label>{" "}
                <a
                  href="#"
                  className="text-xs text-accent hover:text-accent-hover transition-colors"
                >
                  {" "}
                  Forgot password?{" "}
                </a>{" "}
              </div>{" "}
              <div className="relative">
                {" "}
                <Lock
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "#A8A49F" }}
                />{" "}
                <input
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className={`input pl-9 ${errors.password ? "input-error" : ""}`}
                  {...register("password", {
                    required: "Password is required",
                  })}
                />{" "}
              </div>{" "}
              {errors.password && (
                <p className="error-msg">{errors.password.message}</p>
              )}{" "}
            </div>{" "}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center mt-2"
              style={{ height: 40 }}
            >
              {" "}
              {loading ? (
                <>
                  {" "}
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                  Signing in…{" "}
                </>
              ) : (
                <>
                  {" "}
                  Continue <ArrowRight size={14} />{" "}
                </>
              )}{" "}
            </button>{" "}
          </form>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
