import React, { useState } from "react";
import {
  ChevronRight,
  Globe,
  DollarSign,
  MapPin,
  Landmark,
  Wrench,
  Link2,
  BadgePercent,
  Tag,
} from "lucide-react";
import ConfigureTaxDashboard from "./ConfigureTaxDashboard";
const TAX_OPTIONS = [
  {
    id: "general-tax",
    icon: Globe,
    label: "General Tax",
    description:
      "Set up fundamental tax rules, price types, and global tax behavior for your billing.",
  },
  {
    id: "us-tax",
    icon: MapPin,
    label: "US Tax",
    description:
      "Configure federal, state, and local tax rates for United States sales tax compliance.",
  },
  {
    id: "canada-tax",
    icon: MapPin,
    label: "Canada Tax",
    description:
      "Manage GST, HST, and PST rates across Canadian provinces and territories.",
  },
  {
    id: "eu-vat",
    icon: Landmark,
    label: "European Union Value Added Tax (EU VAT)",
    description:
      "Handle VAT obligations, OSS registrations, and reverse charge mechanisms for EU sales.",
  },
  {
    id: "custom-tax",
    icon: Wrench,
    label: "Custom Tax Options",
    description:
      "Define bespoke tax rules for specialized products, services, or jurisdictions.",
  },
  {
    id: "third-party",
    icon: Link2,
    label: "Third-Party Tax Integrations (Avalara, TaxJar)",
    description:
      "Connect to automated tax calculation engines for real-time, address-level accuracy.",
  },
  {
    id: "exemptions",
    icon: BadgePercent,
    label: "Exempting Taxes",
    description:
      "Configure customer and product-level tax exemptions and manage exemption certificates.",
  },
  {
    id: "price-types",
    icon: Tag,
    label: "Price Types",
    description:
      "Choose whether your catalog prices are tax-inclusive or tax-exclusive per currency.",
  },
];
export default function ConfigureTax() {
  const [showDashboard, setShowDashboard] = useState(false);
  if (showDashboard) {
    return <ConfigureTaxDashboard onBack={() => setShowDashboard(false)} />;
  }
  return (
    <div>
      {" "}
      {/* Breadcrumb / Module Header */}{" "}
      <div className="module-header">
        {" "}
        <div className="breadcrumb">
          {" "}
          <span>Settings</span>{" "}
          <ChevronRight size={12} className="breadcrumb-sep" />{" "}
          <span>Configure Opz</span>{" "}
          <ChevronRight size={12} className="breadcrumb-sep" />{" "}
          <span className="breadcrumb-current">Configure Tax</span>{" "}
        </div>{" "}
        <button
          id="configure-tax-btn"
          onClick={() => setShowDashboard(true)}
          className="btn-primary btn-sm"
        >
          {" "}
          Configure Tax{" "}
        </button>{" "}
      </div>{" "}
      {/* Main Content */}{" "}
      <div className="px-8 py-8 max-w-4xl mx-auto">
        {" "}
        {/* Page Header */}{" "}
        <div className="mb-8">
          {" "}
          <h1 className="page-title">Configure Tax</h1>{" "}
          <p className="page-subtitle mt-1">
            {" "}
            If you collect tax on your sales, use the tax options here to
            configure them.{" "}
          </p>{" "}
        </div>{" "}
        {/* Options List */}{" "}
        <div className="card p-0 overflow-hidden">
          {" "}
          {TAX_OPTIONS.map((option, idx) => {
            const Icon = option.icon;
            return (
              <button
                key={option.id}
                id={`tax-option-${option.id}`}
                onClick={() => setShowDashboard(true)}
                className={`w-full text-left flex items-center gap-4 px-6 py-4 group transition-colors hover:bg-stone-50 ${idx !== TAX_OPTIONS.length - 1 ? "border-b border-border" : ""} `}
              >
                {" "}
                {/* Icon */}{" "}
                <div
                  className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ background: "#EEF2FF" }}
                >
                  {" "}
                  <Icon size={16} style={{ color: "#2D5BFF" }} />{" "}
                </div>{" "}
                {/* Text */}{" "}
                <div className="flex-1 min-w-0">
                  {" "}
                  <div className="text-sm font-medium text-ink">
                    {option.label}
                  </div>{" "}
                  <div className="text-xs text-muted mt-0.5 leading-relaxed">
                    {option.description}
                  </div>{" "}
                </div>{" "}
                {/* Arrow */}{" "}
                <ChevronRight
                  size={15}
                  className="shrink-0 text-muted group-hover:text-ink transition-colors"
                />{" "}
              </button>
            );
          })}{" "}
        </div>{" "}
        {/* Info note */}{" "}
        <p className="text-xs text-muted mt-4 flex items-center gap-1.5">
          {" "}
          <DollarSign size={12} /> Tax configuration changes apply to new
          invoices and subscriptions immediately after saving.{" "}
        </p>{" "}
      </div>{" "}
    </div>
  );
}
