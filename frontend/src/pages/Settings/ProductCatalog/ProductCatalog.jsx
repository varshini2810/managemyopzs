import React, { useState, useEffect } from "react";
import {
  Package2,
  ChevronRight,
  ToggleLeft,
  ToggleRight,
  Calendar,
  ArrowRight,
  Check,
  Plus,
  X,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast"; // ────────────────────────────────────────────────────────────
// Billing Frequency Manager Page
// ────────────────────────────────────────────────────────────
const PRESET_FREQUENCIES = [
  { id: "daily", label: "Daily", unit: "day", value: 1 },
  { id: "weekly", label: "Weekly", unit: "week", value: 1 },
  { id: "monthly", label: "Monthly", unit: "month", value: 1 },
  { id: "yearly", label: "Yearly", unit: "year", value: 1 },
];
function BillingFrequencyManager({ onBack }) {
  const storageKey = "billing_frequencies";
  const selectedKey = "billing_frequencies_selected";
  const [selected, setSelected] = useState(() => {
    try {
      return (
        JSON.parse(localStorage.getItem(selectedKey)) ||
        PRESET_FREQUENCIES.map((f) => f.id)
      );
    } catch {
      return PRESET_FREQUENCIES.map((f) => f.id);
    }
  });
  const [customs, setCustoms] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey)) || [];
    } catch {
      return [];
    }
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [customValue, setCustomValue] = useState("");
  const [customUnit, setCustomUnit] = useState("day");
  const allFrequencies = [...PRESET_FREQUENCIES, ...customs];
  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };
  const handleAddCustom = () => {
    const v = parseInt(customValue, 10);
    if (!v || v <= 0) {
      toast.error("Enter a valid number greater than 0");
      return;
    }
    const label = `Every ${v} ${customUnit}${v > 1 ? "s" : ""}`;
    const id = `custom_${Date.now()}`;
    const newFreq = { id, label, unit: customUnit, value: v, isCustom: true };
    const updated = [...customs, newFreq];
    setCustoms(updated);
    setSelected((prev) => [...prev, id]);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setCustomValue("");
    setCustomUnit("day");
    setShowAddForm(false);
    toast.success(`"${label}" added`);
  };
  const handleDeleteCustom = (id) => {
    const updated = customs.filter((c) => c.id !== id);
    setCustoms(updated);
    setSelected((prev) => prev.filter((x) => x !== id));
    localStorage.setItem(storageKey, JSON.stringify(updated));
    toast.success("Custom frequency removed");
  };
  const handleApply = () => {
    localStorage.setItem(selectedKey, JSON.stringify(selected));
    toast.success("Billing frequencies saved successfully!");
  };
  return (
    <div>
      {" "}
      {/* Header */}{" "}
      <div className="module-header">
        {" "}
        <div className="breadcrumb">
          {" "}
          <span>Settings</span>{" "}
          <ChevronRight size={12} className="breadcrumb-sep" />{" "}
          <span>Product Catalog</span>{" "}
          <ChevronRight size={12} className="breadcrumb-sep" />{" "}
          <span className="breadcrumb-current">
            Setup Billing Frequency
          </span>{" "}
        </div>{" "}
      </div>{" "}
      <div className="px-8 py-8 max-w-3xl mx-auto space-y-6">
        {" "}
        <div>
          {" "}
          <h1 className="page-title">Setup Billing Frequency</h1>{" "}
          <p className="page-subtitle">
            {" "}
            Configure billing cycles available when creating plans and
            subscriptions.{" "}
          </p>{" "}
        </div>{" "}
        {/* Frequency list */}{" "}
        <div className="card space-y-0 p-0 overflow-hidden">
          {" "}
          <div className="px-5 py-3 border-b border-border bg-stone-50 flex items-center justify-between">
            {" "}
            <span className="text-2xs font-semibold text-muted uppercase tracking-wide">
              {" "}
              Available Frequencies{" "}
            </span>{" "}
            <span className="text-2xs text-muted">
              {selected.length} selected
            </span>{" "}
          </div>{" "}
          <div className="divide-y divide-border">
            {" "}
            {allFrequencies.map((freq) => {
              const isSelected = selected.includes(freq.id);
              return (
                <div
                  key={freq.id}
                  className={`flex items-center justify-between px-5 py-3.5 transition-colors ${isSelected ? "bg-accent/[0.03]" : "hover:bg-stone-50"}`}
                >
                  {" "}
                  <div className="flex items-center gap-3">
                    {" "}
                    <button
                      onClick={() => toggleSelect(freq.id)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors shrink-0 ${isSelected ? "bg-accent border-accent text-white" : "border-border bg-surface hover:border-accent"}`}
                    >
                      {" "}
                      {isSelected && <Check size={11} strokeWidth={3} />}{" "}
                    </button>{" "}
                    <div>
                      {" "}
                      <span className="text-sm font-medium text-ink">
                        {freq.label}
                      </span>{" "}
                      {freq.isCustom && (
                        <span className="ml-2 text-2xs bg-stone-100 text-muted border border-border px-1.5 py-0.5 rounded">
                          {" "}
                          Custom{" "}
                        </span>
                      )}{" "}
                    </div>{" "}
                  </div>{" "}
                  <div className="flex items-center gap-2">
                    {" "}
                    <span className="text-xs text-muted font-mono">
                      {" "}
                      {freq.value} {freq.unit}
                      {freq.value > 1 ? "s" : ""}{" "}
                    </span>{" "}
                    {freq.isCustom && (
                      <button
                        onClick={() => handleDeleteCustom(freq.id)}
                        className="ml-2 p-1 text-muted hover:text-danger transition-colors rounded"
                        title="Remove"
                      >
                        {" "}
                        <Trash2 size={13} />{" "}
                      </button>
                    )}{" "}
                  </div>{" "}
                </div>
              );
            })}{" "}
          </div>{" "}
          {/* Add custom row */}{" "}
          <div className="border-t border-border bg-stone-50 px-5 py-3">
            {" "}
            {!showAddForm ? (
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 text-sm text-accent hover:text-accent-hover font-medium transition-colors"
              >
                {" "}
                <Plus size={14} /> Add Custom Frequency{" "}
              </button>
            ) : (
              <div className="flex items-center gap-2">
                {" "}
                <div className="relative">
                  {" "}
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 3"
                    value={customValue}
                    onChange={(e) => setCustomValue(e.target.value)}
                    className="input w-24 text-center"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddCustom();
                    }}
                  />{" "}
                </div>{" "}
                <select
                  value={customUnit}
                  onChange={(e) => setCustomUnit(e.target.value)}
                  className="select w-28"
                >
                  {" "}
                  <option value="day">Day(s)</option>{" "}
                  <option value="week">Week(s)</option>{" "}
                  <option value="month">Month(s)</option>{" "}
                  <option value="year">Year(s)</option>{" "}
                </select>{" "}
                <button
                  onClick={handleAddCustom}
                  className="btn-primary btn-sm"
                >
                  {" "}
                  Add{" "}
                </button>{" "}
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setCustomValue("");
                  }}
                  className="btn-ghost btn-sm"
                >
                  {" "}
                  <X size={14} />{" "}
                </button>{" "}
              </div>
            )}{" "}
          </div>{" "}
        </div>{" "}
        {/* Apply button */}{" "}
        <div className="flex justify-end">
          {" "}
          <button onClick={handleApply} className="btn-primary">
            {" "}
            <Check size={14} /> Apply Changes{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
} // ────────────────────────────────────────────────────────────
// Product Catalog Main Page
// ────────────────────────────────────────────────────────────
export default function ProductCatalog() {
  const [productFamilyEnabled, setProductFamilyEnabled] = useState(
    () => localStorage.getItem("product_family_enabled") === "true",
  );
  const [page, setPage] = useState("main"); // 'main' | 'billing-frequency' const toggleProductFamily = () => { const next = !productFamilyEnabled; setProductFamilyEnabled(next); localStorage.setItem('product_family_enabled', String(next)); toast.success(`Product Family ${next ? 'enabled' : 'disabled'}`); }; if (page === 'billing-frequency') { return <BillingFrequencyManager onBack={() => setPage('main')} />; } return ( <div> {/* Header */} <div className="module-header"> <div className="breadcrumb"> <span>Settings</span> <ChevronRight size={12} className="breadcrumb-sep" /> <span className="breadcrumb-current">Product Catalog</span> </div> </div> <div className="px-8 py-8 max-w-3xl mx-auto space-y-6"> <div> <h1 className="page-title">Product Catalog</h1> <p className="page-subtitle"> Configure product families and billing frequencies for your plans. </p> </div> {/* Enable Product Family */} <div className="card"> <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-border"> <Package2 size={16} style={{ color: '#6B6863' }} /> <div className="section-label mb-0">Product Family</div> </div> <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"> <div> <h3 className="text-sm font-semibold text-ink">Enable Product Family</h3> <p className="text-xs text-muted mt-0.5 max-w-sm"> Group plans and add-ons under product families for better organization and reporting. </p> <div className="mt-2 flex items-center gap-1.5"> <span className={`w-1.5 h-1.5 rounded-full ${productFamilyEnabled ? 'bg-success' : 'bg-stone-300'}`} /> <span className={`text-xs font-medium ${productFamilyEnabled ? 'text-success' : 'text-muted'}`}> {productFamilyEnabled ? 'Enabled' : 'Disabled'} </span> </div> </div> <button onClick={toggleProductFamily} className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 ${ productFamilyEnabled ? 'bg-accent' : 'bg-stone-300' }`} role="switch" aria-checked={productFamilyEnabled} > <span className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${ productFamilyEnabled ? 'translate-x-5' : 'translate-x-0' }`} /> </button> </div> </div> {/* Setup Billing Frequency */} <div className="card"> <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-border"> <Calendar size={16} style={{ color: '#6B6863' }} /> <div className="section-label mb-0">Billing Frequency</div> </div> <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"> <div> <h3 className="text-sm font-semibold text-ink">Setup Billing Frequency</h3> <p className="text-xs text-muted mt-0.5 max-w-sm"> Define the billing cycles available for your plans — Daily, Weekly, Monthly, Yearly, or custom intervals. </p> <div className="mt-3 flex flex-wrap gap-1.5"> {['Daily', 'Weekly', 'Monthly', 'Yearly'].map(f => ( <span key={f} className="inline-flex items-center px-2 py-0.5 rounded text-2xs font-medium bg-stone-100 text-muted border border-border" > {f} </span> ))} <span className="inline-flex items-center px-2 py-0.5 rounded text-2xs font-medium bg-accent/10 text-accent border border-accent/20"> + Custom </span> </div> </div> <button onClick={() => setPage('billing-frequency')} className="btn-secondary btn-sm flex items-center gap-1.5 whitespace-nowrap" > Manage <ArrowRight size={13} /> </button> </div> </div> </div> </div> );
}
