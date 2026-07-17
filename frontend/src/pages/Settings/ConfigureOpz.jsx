import React, { useState } from "react";
import BusinessProfile from "./BusinessProfile/BusinessProfile";
import PaymentGateways from "./PaymentGateways/PaymentGateways";
import Taxes from "./Taxes/Taxes";
import ApiKeys from "./ApiKeys/ApiKeys";
import Webhooks from "./Webhooks/Webhooks";
import ProductCatalog from "./ProductCatalog/ProductCatalog";
import CheckoutPortalDashboard from "./CheckoutPortal/CheckoutPortalDashboard";
import BrandSettingsDashboard from "./BrandSettings/BrandSettingsDashboard";
import EmailNotificationsRouter from "./EmailNotifications/EmailNotificationsRouter";
export default function ConfigureOpz() {
  const [activeTab, setActiveTab] = useState("checkout-portal");
  const tabs = [
    {
      id: "profile",
      label: "Business Profile",
      component: <BusinessProfile />,
    },
    {
      id: "brand",
      label: "Brand Settings",
      component: <BrandSettingsDashboard />,
    },
    {
      id: "email-notifications",
      label: "Email Notifications",
      component: <EmailNotificationsRouter />,
    },
    {
      id: "product-catalog",
      label: "Product Catalog",
      component: <ProductCatalog />,
    },
    {
      id: "checkout-portal",
      label: "Checkout & Self-Profile",
      component: <CheckoutPortalDashboard />,
    },
    {
      id: "gateways",
      label: "Payment Gateways",
      component: <PaymentGateways />,
    },
    { id: "taxes", label: "Taxes", component: <Taxes /> },
    { id: "apikeys", label: "API Keys", component: <ApiKeys /> },
    { id: "webhooks", label: "Webhooks", component: <Webhooks /> },
  ];
  return (
    <div className="space-y-4 animate-fade-in">
      {" "}
      <div className="mb-2">
        {" "}
        <h2 className="text-base font-bold text-ink">Configure Opz</h2>{" "}
        <p className="text-sm text-muted mt-0.5">
          Manage billing, taxes, gateways, and integrations.
        </p>{" "}
      </div>{" "}
      {/* Horizontal tab strip */}{" "}
      <div className="flex flex-wrap gap-1 bg-stone-100 p-1 rounded-xl">
        {" "}
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${activeTab === tab.id ? "bg-white text-ink shadow-sm" : "text-muted hover:text-ink"}`}
          >
            {" "}
            {tab.label}{" "}
          </button>
        ))}{" "}
      </div>{" "}
      {/* Content */}{" "}
      <div className="min-h-64">
        {" "}
        {tabs.find((t) => t.id === activeTab)?.component}{" "}
      </div>{" "}
    </div>
  );
}
