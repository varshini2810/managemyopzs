import React, { useState, useEffect } from "react";
import { ChevronRight, CheckCircle, Circle } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../../services/api";
const GATEWAY_META = {
  stripe: {
    name: "Stripe",
    desc: "Accept cards, Google Pay, Apple Pay, SEPA and more",
    logo: (
      <svg
        viewBox="0 0 48 20"
        height="20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {" "}
        <path
          d="M6.4 7.2c0-.8.7-1.1 1.8-1.1 1.6 0 3.7.5 5.3 1.4V3.1C11.8 2.4 10 2 8.2 2 4.1 2 1.3 4.1 1.3 7.4c0 5.2 7.2 4.4 7.2 6.6 0 .9-.8 1.2-2 1.2-1.7 0-3.9-.7-5.6-1.7v4.5c1.9.8 3.8 1.2 5.6 1.2 4.2 0 7.1-2.1 7.1-5.4-.1-5.6-7.2-4.6-7.2-6.6zM28 2.3L24.2 18h-4.1l-2.2-9.3L15.6 18h-4.1L7.7 2.3h4.2l2.1 10.1 2.4-10.1h3.8l2.4 10.1L24.8 2.3H28zm7.9 0c-1.5 0-2.4.7-3 1.2L32.6 2H29v16h4.2v-8.9c.5-.6 1.3-1 2.2-1 1 0 1.4.5 1.4 1.5V18h4.2v-9.3C41 5 39.5 2.3 35.9 2.3zm11.2 0c-1.5 0-2.5.6-3 1.3V2.3h-4.2V18h4.2V9c.5-.6 1.2-1 2.1-1 1 0 1.5.5 1.5 1.5V18H48V9c0-3.7-1.5-6.7-4.9-6.7z"
          fill="#635BFF"
        />{" "}
      </svg>
    ),
  },
  paypal: {
    name: "PayPal",
    desc: "Accept PayPal balance, cards, and Buy Now Pay Later",
    logo: (
      <svg viewBox="0 0 64 20" height="20" fill="none">
        {" "}
        <text
          x="0"
          y="15"
          fontFamily="Arial"
          fontWeight="bold"
          fontSize="14"
          fill="#003087"
        >
          Pay
        </text>{" "}
        <text
          x="28"
          y="15"
          fontFamily="Arial"
          fontWeight="bold"
          fontSize="14"
          fill="#009cde"
        >
          Pal
        </text>{" "}
      </svg>
    ),
  },
  gocardless: {
    name: "GoCardless",
    desc: "Bank-to-bank Direct Debit payments in 30+ countries",
    logo: (
      <svg viewBox="0 0 90 20" height="20" fill="none">
        {" "}
        <rect width="20" height="20" rx="4" fill="#01B5A1" />{" "}
        <text
          x="26"
          y="15"
          fontFamily="Arial"
          fontWeight="600"
          fontSize="12"
          fill="#1A1A1A"
        >
          GoCardless
        </text>{" "}
      </svg>
    ),
  },
};
function GatewayCard({ meta, gateway, onToggle, onConnect }) {
  const isConnected = gateway !== null;
  const isActive = gateway?.status === "ACTIVE";
  return (
    <div
      className="bg-surface rounded-lg p-5 flex items-center justify-between gap-4"
      style={{ border: "1px solid #E7E5E2" }}
    >
      {" "}
      <div className="flex items-center gap-4">
        {" "}
        {/* Logo area */}{" "}
        <div
          className="flex items-center justify-center rounded shrink-0"
          style={{
            width: 56,
            height: 40,
            background: "#FAFAF9",
            border: "1px solid #E7E5E2",
          }}
        >
          {" "}
          {meta.logo}{" "}
        </div>{" "}
        <div>
          {" "}
          <div className="flex items-center gap-2">
            {" "}
            <span className="text-sm font-semibold text-ink">
              {meta.name}
            </span>{" "}
            {isConnected && (
              <span
                className="inline-flex items-center gap-1 text-2xs font-medium"
                style={{ color: isActive ? "#1A7F4E" : "#A8A49F" }}
              >
                {" "}
                <span style={{ fontSize: 7 }}>●</span>{" "}
                {isActive ? "Active" : "Inactive"}{" "}
              </span>
            )}{" "}
          </div>{" "}
          <div className="text-xs text-muted mt-0.5">{meta.desc}</div>{" "}
        </div>{" "}
      </div>{" "}
      <div className="flex items-center gap-2 shrink-0">
        {" "}
        {isConnected ? (
          <>
            {" "}
            <button
              onClick={() => onToggle(gateway)}
              className={
                isActive ? "btn-secondary btn-sm" : "btn-primary btn-sm"
              }
            >
              {" "}
              {isActive ? "Disable" : "Enable"}{" "}
            </button>{" "}
            <button
              className="btn-ghost btn-sm text-accent"
              style={{ color: "#2D5BFF" }}
            >
              {" "}
              Configure{" "}
            </button>{" "}
          </>
        ) : (
          <button className="btn-primary btn-sm" onClick={onConnect}>
            {" "}
            Connect{" "}
          </button>
        )}{" "}
      </div>{" "}
    </div>
  );
}
export default function PaymentGateways() {
  const [gateways, setGateways] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchGateways = () => {
    setLoading(true);
    api
      .get("/settings/payment-gateways")
      .then((res) => setGateways(res.data.data || []))
      .catch(() => toast.error("Failed to load gateways"))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    fetchGateways();
  }, []);
  const handleToggle = async (gateway) => {
    try {
      const newStatus = gateway.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      await api.put(`/settings/payment-gateways/${gateway.id}`, {
        status: newStatus,
      });
      toast.success(
        `${gateway.name} ${newStatus === "ACTIVE" ? "enabled" : "disabled"}`,
      );
      fetchGateways();
    } catch {
      toast.error("Failed to update gateway");
    }
  };
  const handleConnect = async (gwId, name) => {
    try {
      await api.post("/settings/payment-gateways", {
        name,
        status: "INACTIVE",
        config: {},
      });
      toast.success(`${name} connected`);
      fetchGateways();
    } catch {
      toast.error("Failed to connect gateway");
    }
  };
  return (
    <div>
      {" "}
      {/* Module sub-header */}{" "}
      <div className="module-header">
        {" "}
        <div className="breadcrumb">
          {" "}
          <span>Settings</span>{" "}
          <ChevronRight size={12} className="breadcrumb-sep" />{" "}
          <span className="breadcrumb-current">Payment Gateways</span>{" "}
        </div>{" "}
      </div>{" "}
      <div className="px-8 py-6 max-w-3xl">
        {" "}
        <div className="mb-6">
          {" "}
          <h1 className="page-title">Payment Gateways</h1>{" "}
          <p className="page-subtitle">
            Connect payment processors to accept customer payments
          </p>{" "}
        </div>{" "}
        {loading ? (
          <div className="space-y-3">
            {" "}
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-lg h-20 skeleton"
                style={{ background: "#E7E5E2" }}
              />
            ))}{" "}
          </div>
        ) : (
          <div className="space-y-3">
            {" "}
            {Object.entries(GATEWAY_META).map(([id, meta]) => {
              const gw = gateways.find(
                (g) =>
                  (g.id || "").toLowerCase() === `gw_${id}` ||
                  (g.name || "").toLowerCase() === id,
              );
              return (
                <GatewayCard
                  key={id}
                  meta={meta}
                  gateway={gw || null}
                  onToggle={handleToggle}
                  onConnect={() => handleConnect(id, meta.name)}
                />
              );
            })}{" "}
          </div>
        )}{" "}
        <div
          className="mt-8 p-4 rounded-lg text-xs text-muted"
          style={{ background: "#FAFAF9", border: "1px solid #E7E5E2" }}
        >
          {" "}
          <strong className="text-ink">PCI DSS compliance:</strong> Opz never
          stores raw card data. All payment credentials are managed by your
          chosen gateway. API keys are encrypted at rest with AES-256 and only
          displayed once at setup.{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
