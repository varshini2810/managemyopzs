import React, { useState, useEffect, useRef } from "react";
import {
  Building2,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Mail,
  Phone,
  Globe,
  MapPin,
  Calendar,
  Users,
  Package,
  ChevronLeft,
  ChevronRight,
  X,
  Save,
  Upload,
  Check,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCcw,
  Download,
  Hash,
  Smartphone,
  Shield,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../../services/api";
import EmptyState from "../../../components/common/EmptyState";
import SkeletonLoader from "../../../components/common/SkeletonLoader";
const SUBSCRIPTION_PLANS = [
  "Starter",
  "Growth",
  "Professional",
  "Enterprise",
  "Custom",
];
const BUSINESS_TYPES = [
  "Private Limited",
  "Public Limited",
  "Partnership",
  "Sole Proprietorship",
  "LLP",
  "NGO",
  "Government",
  "Other",
];
const INDUSTRIES = [
  "Technology",
  "Finance & Banking",
  "Healthcare",
  "Retail & E-commerce",
  "Manufacturing",
  "Education",
  "Real Estate",
  "Media & Entertainment",
  "Logistics",
  "Consulting",
  "Other",
];
const COUNTRIES = [
  "India",
  "United States",
  "United Kingdom",
  "United Arab Emirates",
  "Singapore",
  "Australia",
  "Canada",
  "Germany",
  "France",
  "Other",
];
const STATUS_CONFIG = {
  Active: {
    color: "text-emerald-600",
    bg: "bg-emerald-500/10",
    dot: "bg-emerald-500",
  },
  Inactive: {
    color: "text-stone-500",
    bg: "bg-stone-100",
    dot: "bg-stone-400",
  },
  Suspended: {
    color: "text-amber-600",
    bg: "bg-amber-500/10",
    dot: "bg-amber-500",
  },
  Expired: { color: "text-rose-600", bg: "bg-rose-500/10", dot: "bg-rose-500" },
};
const EMPTY_FORM = {};
function generateClientCode(name) {
  const prefix =
    name
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 4) || "CLT";
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${suffix}`;
}
export default function ClientDetails() {
  const [view, setView] = useState("list");
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingClient, setEditingClient] = useState(null);
  const [viewingClient, setViewingClient] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPlan, setFilterPlan] = useState("");
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");
  const PAGE_SIZE = 10;
  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await api.get("/clients");
      setClients(res.data.data || []);
    } catch {
      toast.error("Failed to load clients");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchClients();
  }, []);
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this client? This action cannot be undone."))
      return;
    try {
      await api.delete(`/clients/${id}`);
      toast.success("Client deleted");
      fetchClients();
    } catch {
      toast.error("Failed to delete client");
    }
  };
  const openCreate = () => {
    setEditingClient(null);
    setView("form");
  };
  const openEdit = (c) => {
    setEditingClient(c);
    setView("form");
  };
  const openView = (c) => {
    setViewingClient(c);
    setView("view");
  };
  const handleFormSave = async (data, isEdit) => {
    if (isEdit) {
      await api.put(`/clients/${editingClient.id}`, data);
      toast.success("Client updated successfully");
    } else {
      await api.post("/clients", data);
      toast.success("Client created successfully");
    }
    fetchClients();
    setView("list");
  };
  const filtered = clients
    .filter((c) => {
      const s = search.toLowerCase();
      const matchSearch =
        !s ||
        (c.companyName || "").toLowerCase().includes(s) ||
        (c.companyCode || "").toLowerCase().includes(s) ||
        (c.contactName || "").toLowerCase().includes(s) ||
        (c.email || "").toLowerCase().includes(s);
      const matchStatus = !filterStatus || c.accountStatus === filterStatus;
      const matchPlan = !filterPlan || c.subscriptionPlan === filterPlan;
      return matchSearch && matchStatus && matchPlan;
    })
    .sort((a, b) => {
      const v = (x) => x[sortBy] || "";
      return sortDir === "asc"
        ? v(a).localeCompare(v(b))
        : v(b).localeCompare(v(a));
    });
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const toggleSort = (field) => {
    if (sortBy === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortBy(field);
      setSortDir("asc");
    }
  };
  if (view === "form") {
    return (
      <ClientForm
        client={editingClient}
        onSave={handleFormSave}
        onCancel={() => setView("list")}
      />
    );
  }
  if (view === "view") {
    return (
      <ClientViewDetail
        client={viewingClient}
        onBack={() => setView("list")}
        onEdit={() => {
          setEditingClient(viewingClient);
          setView("form");
        }}
      />
    );
  }
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {" "}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-5">
        {" "}
        <div>
          {" "}
          <h1 className="page-title flex items-center gap-2">
            {" "}
            <Building2 className="text-primary-500" size={22} /> Client
            Details{" "}
          </h1>{" "}
          <p className="page-subtitle mt-1">
            {" "}
            Register and manage all client organizations using the Billing
            Platform.{" "}
          </p>{" "}
        </div>{" "}
        <button
          onClick={openCreate}
          className="btn-primary flex items-center gap-2 shrink-0"
        >
          {" "}
          <Plus size={16} /> Add New Client{" "}
        </button>{" "}
      </div>{" "}
      {!loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {" "}
          {[
            {
              label: "Total Clients",
              value: clients.length,
              color: "text-ink",
            },
            {
              label: "Active",
              value: clients.filter((c) => c.accountStatus === "Active").length,
              color: "text-emerald-600",
            },
            {
              label: "Inactive",
              value: clients.filter((c) => c.accountStatus === "Inactive")
                .length,
              color: "text-stone-500",
            },
            {
              label: "Suspended",
              value: clients.filter(
                (c) =>
                  c.subscriptionStatus === "Suspended" ||
                  c.subscriptionStatus === "Expired",
              ).length,
              color: "text-amber-600",
            },
          ].map((s) => (
            <div key={s.label} className="card px-4 py-3">
              {" "}
              <p className="text-xs text-muted">{s.label}</p>{" "}
              <p className={`text-2xl font-bold mt-0.5 ${s.color}`}>
                {s.value}
              </p>{" "}
            </div>
          ))}{" "}
        </div>
      )}{" "}
      <div className="flex flex-wrap gap-3 items-center">
        {" "}
        <div className="relative flex-1 min-w-52">
          {" "}
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />{" "}
          <input
            type="text"
            placeholder="Search clients..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            className="input pl-9 w-full"
          />{" "}
        </div>{" "}
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setPage(0);
          }}
          className="input w-40"
        >
          {" "}
          <option value="">All Statuses</option>{" "}
          <option value="Active">Active</option>{" "}
          <option value="Inactive">Inactive</option>{" "}
          <option value="Suspended">Suspended</option>{" "}
        </select>{" "}
        <select
          value={filterPlan}
          onChange={(e) => {
            setFilterPlan(e.target.value);
            setPage(0);
          }}
          className="input w-44"
        >
          {" "}
          <option value="">All Plans</option>{" "}
          {SUBSCRIPTION_PLANS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}{" "}
        </select>{" "}
        {(search || filterStatus || filterPlan) && (
          <button
            onClick={() => {
              setSearch("");
              setFilterStatus("");
              setFilterPlan("");
              setPage(0);
            }}
            className="btn-secondary px-3 flex items-center gap-1.5 text-sm"
          >
            {" "}
            <X size={13} /> Clear{" "}
          </button>
        )}{" "}
      </div>{" "}
      {loading ? (
        <div className="flex justify-center py-20">
          {" "}
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-lg animate-spin" />{" "}
        </div>
      ) : paginated.length === 0 ? (
        <div className="card mt-4 p-0">
          <EmptyState 
            icon={Building2}
            title="No clients found"
            message={search || filterStatus || filterPlan ? "Try adjusting your filters." : 'Click "Add New Client" to register your first client.'}
          />
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-50">
                  {[
                    { key: "companyName", label: "Company" },
                    { key: "contactName", label: "Contact" },
                    { key: "subscriptionPlan", label: "Plan" },
                    { key: "subscriptionStatus", label: "Subscription" },
                    { key: "accountStatus", label: "Account" },
                    { key: "createdAt", label: "Created" },
                  ].map((col) => (
                    <th
                      key={col.key}
                      onClick={() => toggleSort(col.key)}
                      className="text-left px-4 py-3 font-semibold text-muted uppercase text-[10px] tracking-wider cursor-pointer select-none hover:text-ink transition-colors"
                    >
                      <span className="flex items-center gap-1">
                        {" "}
                        {col.label}{" "}
                        {sortBy === col.key && (
                          <span className="text-primary-500">
                            {sortDir === "asc" ? "↑" : "↓"}
                          </span>
                        )}{" "}
                      </span>{" "}
                    </th>
                  ))}{" "}
                  <th className="px-4 py-3 text-right text-[10px] font-semibold text-muted uppercase tracking-wider">
                    Actions
                  </th></tr></thead>{" "}
              <tbody className="divide-y divide-border">
                {paginated.map((client) => {
                  const accCfg =
                    STATUS_CONFIG[client.accountStatus] ||
                    STATUS_CONFIG.Inactive;
                  const subCfg =
                    STATUS_CONFIG[client.subscriptionStatus] ||
                    STATUS_CONFIG.Inactive;
                  return (
                    <tr
                      key={client.id}
                      className="hover:bg-surface-50 transition-colors group"
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <ClientAvatar client={client} size="sm" />{" "}
                          <div>
                            <p className="font-semibold text-ink">
                              {client.companyName}
                            </p>{" "}
                            <p className="text-xs text-muted font-mono">
                              {client.companyCode}
                            </p>{" "}
                          </div>{" "}
                        </div>{" "}
                      </td>{" "}
                      <td className="px-4 py-3.5">
                        <p className="text-ink font-medium">
                          {client.contactName}
                        </p>{" "}
                        <p className="text-xs text-muted">
                          {client.email}
                        </p>{" "}
                      </td>{" "}
                      <td className="px-4 py-3.5">
                        <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-200">
                          {client.subscriptionPlan}{" "}
                        </span>{" "}
                      </td>{" "}
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${subCfg.bg} ${subCfg.color}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${subCfg.dot}`}
                          />{" "}
                          {client.subscriptionStatus}{" "}
                        </span>{" "}
                      </td>{" "}
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${accCfg.bg} ${accCfg.color}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${accCfg.dot}`}
                          />{" "}
                          {client.accountStatus}{" "}
                        </span>{" "}
                      </td>{" "}
                      <td className="px-4 py-3.5 text-muted text-xs">
                        {client.createdAt
                          ? new Date(client.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )
                          : "—"}{" "}
                      </td>{" "}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <ActionBtn
                            icon={Eye}
                            title="View"
                            onClick={() => openView(client)}
                          />{" "}
                          <ActionBtn
                            icon={Edit2}
                            title="Edit"
                            onClick={() => openEdit(client)}
                            color="text-primary-600"
                          />{" "}
                          <ActionBtn
                            icon={Trash2}
                            title="Delete"
                            onClick={() => handleDelete(client.id)}
                            color="text-rose-600"
                          />{" "}
                        </div>{" "}
                      </td></tr>
                  );
                })}</tbody></table>{" "}
          </div>{" "}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-surface-50">
              <p className="text-xs text-muted">
                Showing {page * PAGE_SIZE + 1}–
                {Math.min((page + 1) * PAGE_SIZE, filtered.length)} of{" "}
                {filtered.length}{" "}
              </p>{" "}
              <div className="flex items-center gap-1">
                {" "}
                <button
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                  className="p-1.5 rounded-lg disabled:opacity-40 hover:bg-stone-100 transition-colors"
                >
                  {" "}
                  <ChevronLeft size={14} />{" "}
                </button>{" "}
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`w-7 h-7 text-xs font-medium rounded-lg transition-colors ${i === page ? "bg-primary-600 text-white" : "hover:bg-stone-100 text-muted"}`}
                  >
                    {" "}
                    {i + 1}{" "}
                  </button>
                ))}{" "}
                <button
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                  className="p-1.5 rounded-lg disabled:opacity-40 hover:bg-stone-100 transition-colors"
                >
                  {" "}
                  <ChevronRight size={14} />{" "}
                </button>{" "}
              </div>{" "}
            </div>
          )}{" "}
        </div>
      )}{" "}
    </div>
  );
}
function ClientAvatar({ client, size = "md" }) {
  const dim = size === "sm" ? "w-9 h-9 text-sm" : "w-14 h-14 text-xl";
  const initials = (client.companyName || "C")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  if (client.logoUrl) {
    return (
      <img
        src={client.logoUrl}
        alt={client.companyName}
        className={`${dim} rounded-lg object-cover border border-border shrink-0`}
      />
    );
  }
  return (
    <div
      className={`${dim} rounded-lg bg-slate-900 text-white font-bold flex items-center justify-center shrink-0`}
    >
      {" "}
      {initials}{" "}
    </div>
  );
}
function ActionBtn({ icon: Icon, title, onClick, color = "text-muted" }) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`p-1.5 rounded-lg hover:bg-stone-100 ${color} transition-colors`}
    >
      {" "}
      <Icon size={14} />{" "}
    </button>
  );
}
function ClientForm({ client, onSave, onCancel }) {
  const isEdit = !!client;
  const [form, setForm] = useState(isEdit ? { ...client } : { ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState("company");
  const [errors, setErrors] = useState({});
  const fileRef = useRef();
  const set = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));
  const handleCompanyNameBlur = () => {
    if (!isEdit && form.companyName && !form.companyCode) {
      set("companyCode", generateClientCode(form.companyName));
    }
  };
  const validate = () => {
    const e = {};
    if (!form.companyName?.trim()) e.companyName = "Required";
    if (!form.contactName?.trim()) e.contactName = "Required";
    if (!form.email?.trim()) e.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    if (!form.phone?.trim()) e.phone = "Required";
    if (!form.addressLine1?.trim()) e.addressLine1 = "Required";
    if (!form.city?.trim()) e.city = "Required";
    if (!form.country?.trim()) e.country = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the errors below");
      return;
    }
    setSaving(true);
    try {
      await onSave(form, isEdit);
    } catch {
      toast.error("Failed to save client");
    } finally {
      setSaving(false);
    }
  };
  const sections = [
    { id: "company", label: "Company Info", icon: Building2 },
    { id: "contact", label: "Contact Info", icon: Mail },
    { id: "address", label: "Address", icon: MapPin },
    { id: "subscription", label: "Subscription", icon: Package },
  ];
  const Err = ({ field }) =>
    errors[field] ? (
      <p className="text-xs text-rose-500 mt-1">{errors[field]}</p>
    ) : null;
  return (
    <div className="p-8 max-w-5xl mx-auto animate-fade-in">
      {" "}
      <div className="flex items-center justify-between mb-6 pb-5 border-b border-border">
        {" "}
        <div>
          {" "}
          <h1 className="page-title flex items-center gap-2">
            {" "}
            <Building2 className="text-primary-500" size={20} />{" "}
            {isEdit ? "Edit Client" : "Add New Client"}{" "}
          </h1>{" "}
          <p className="page-subtitle mt-1">
            {" "}
            {isEdit
              ? `Updating details for ${client.companyName}`
              : "Register a new client company on the platform."}{" "}
          </p>{" "}
        </div>{" "}
        <button
          onClick={onCancel}
          className="btn-secondary flex items-center gap-2"
        >
          {" "}
          <X size={15} /> Cancel{" "}
        </button>{" "}
      </div>{" "}
      <div className="flex gap-6">
        {" "}
        <div className="w-52 shrink-0 space-y-1">
          {" "}
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors text-left ${activeSection === s.id ? "bg-primary-50 text-primary-700 border border-primary-200" : "text-muted hover:text-ink hover:bg-stone-50"}`}
            >
              {" "}
              <s.icon size={15} /> {s.label}{" "}
            </button>
          ))}{" "}
        </div>{" "}
        <form
          id="client-form"
          onSubmit={handleSubmit}
          className="flex-1 space-y-6"
        >
          {" "}
          {activeSection === "company" && (
            <div className="card p-6 space-y-5 animate-fade-in">
              {" "}
              <SectionTitle icon={Building2} title="Company Information" />{" "}
              <div>
                {" "}
                <label className="label">Company Logo</label>{" "}
                <div className="flex items-center gap-4 mt-1">
                  {" "}
                  <div className="w-16 h-16 rounded-xl border-2 border-dashed border-border flex items-center justify-center bg-surface-50 overflow-hidden">
                    {" "}
                    {form.logoUrl ? (
                      <img
                        src={form.logoUrl}
                        alt="logo"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Building2 size={24} className="text-stone-300" />
                    )}{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="btn-secondary text-sm flex items-center gap-2"
                    >
                      {" "}
                      <Upload size={14} /> Upload Logo{" "}
                    </button>{" "}
                    <p className="text-xs text-muted mt-1">
                      PNG, JPG up to 2MB
                    </p>{" "}
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) =>
                            set("logoUrl", ev.target.result);
                          reader.readAsDataURL(file);
                        }
                      }}
                    />{" "}
                  </div>{" "}
                  {form.logoUrl && (
                    <button
                      type="button"
                      onClick={() => set("logoUrl", "")}
                      className="text-rose-500 hover:text-rose-700 text-xs"
                    >
                      Remove
                    </button>
                  )}{" "}
                </div>{" "}
              </div>{" "}
              <div className="grid grid-cols-2 gap-4">
                {" "}
                <div className="col-span-2 md:col-span-1">
                  {" "}
                  <label className="label">
                    Company Name <span className="text-rose-500">*</span>
                  </label>{" "}
                  <input
                    type="text"
                    className={`input w-full ${errors.companyName ? "input-error" : ""}`}
                    placeholder="Acme Corp Pvt Ltd"
                    value={form.companyName || ""}
                    onChange={(e) => set("companyName", e.target.value)}
                    onBlur={handleCompanyNameBlur}
                  />{" "}
                  <Err field="companyName" />{" "}
                </div>{" "}
                <div>
                  {" "}
                  <label className="label">Company Code</label>{" "}
                  <div className="flex gap-2">
                    {" "}
                    <input
                      type="text"
                      className="input w-full font-mono"
                      placeholder="ACME-1234"
                      value={form.companyCode || ""}
                      onChange={(e) =>
                        set("companyCode", e.target.value.toUpperCase())
                      }
                    />{" "}
                    <button
                      type="button"
                      title="Auto-generate"
                      onClick={() =>
                        set(
                          "companyCode",
                          generateClientCode(form.companyName || "CLT"),
                        )
                      }
                      className="btn-secondary px-3"
                    >
                      {" "}
                      <RefreshCcw size={13} />{" "}
                    </button>{" "}
                  </div>{" "}
                </div>{" "}
                <div>
                  {" "}
                  <label className="label">Business Type</label>{" "}
                  <select
                    className="input w-full"
                    value={form.businessType || ""}
                    onChange={(e) => set("businessType", e.target.value)}
                  >
                    {" "}
                    <option value="">Select type</option>{" "}
                    {BUSINESS_TYPES.map((t) => (
                      <option key={t}>{t}</option>
                    ))}{" "}
                  </select>{" "}
                </div>{" "}
                <div>
                  {" "}
                  <label className="label">Industry</label>{" "}
                  <select
                    className="input w-full"
                    value={form.industry || ""}
                    onChange={(e) => set("industry", e.target.value)}
                  >
                    {" "}
                    <option value="">Select industry</option>{" "}
                    {INDUSTRIES.map((i) => (
                      <option key={i}>{i}</option>
                    ))}{" "}
                  </select>{" "}
                </div>{" "}
                <div>
                  {" "}
                  <label className="label">GST / VAT Number</label>{" "}
                  <input
                    type="text"
                    className="input w-full font-mono"
                    placeholder="29AABCV1234A1ZR"
                    value={form.gstNumber || ""}
                    onChange={(e) => set("gstNumber", e.target.value)}
                  />{" "}
                </div>{" "}
                <div>
                  {" "}
                  <label className="label">Tax Registration Number</label>{" "}
                  <input
                    type="text"
                    className="input w-full font-mono"
                    placeholder="TAN/EIN"
                    value={form.taxRegNumber || ""}
                    onChange={(e) => set("taxRegNumber", e.target.value)}
                  />{" "}
                </div>{" "}
                <div>
                  {" "}
                  <label className="label">
                    Company Registration Number
                  </label>{" "}
                  <input
                    type="text"
                    className="input w-full font-mono"
                    placeholder="CIN / Company No."
                    value={form.companyRegNumber || ""}
                    onChange={(e) => set("companyRegNumber", e.target.value)}
                  />{" "}
                </div>{" "}
                <div>
                  {" "}
                  <label className="label">Account Status</label>{" "}
                  <select
                    className="input w-full"
                    value={form.accountStatus || "Active"}
                    onChange={(e) => set("accountStatus", e.target.value)}
                  >
                    {" "}
                    <option>Active</option> <option>Inactive</option>{" "}
                  </select>{" "}
                </div>{" "}
              </div>{" "}
            </div>
          )}{" "}
          {activeSection === "contact" && (
            <div className="card p-6 space-y-5 animate-fade-in">
              {" "}
              <SectionTitle icon={Mail} title="Contact Information" />{" "}
              <div className="grid grid-cols-2 gap-4">
                {" "}
                <div className="col-span-2">
                  {" "}
                  <label className="label">
                    Contact Person Name <span className="text-rose-500">*</span>
                  </label>{" "}
                  <input
                    type="text"
                    className={`input w-full ${errors.contactName ? "input-error" : ""}`}
                    placeholder="John Smith"
                    value={form.contactName || ""}
                    onChange={(e) => set("contactName", e.target.value)}
                  />{" "}
                  <Err field="contactName" />{" "}
                </div>{" "}
                <div>
                  {" "}
                  <label className="label">
                    Email Address <span className="text-rose-500">*</span>
                  </label>{" "}
                  <input
                    type="email"
                    className={`input w-full ${errors.email ? "input-error" : ""}`}
                    placeholder="contact@company.com"
                    value={form.email || ""}
                    onChange={(e) => set("email", e.target.value)}
                  />{" "}
                  <Err field="email" />{" "}
                </div>{" "}
                <div>
                  {" "}
                  <label className="label">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>{" "}
                  <input
                    type="tel"
                    className={`input w-full ${errors.phone ? "input-error" : ""}`}
                    placeholder="+91 98765 43210"
                    value={form.phone || ""}
                    onChange={(e) => set("phone", e.target.value)}
                  />{" "}
                  <Err field="phone" />{" "}
                </div>{" "}
                <div>
                  {" "}
                  <label className="label">Mobile Number</label>{" "}
                  <input
                    type="tel"
                    className="input w-full"
                    placeholder="+91 99999 00000"
                    value={form.mobile || ""}
                    onChange={(e) => set("mobile", e.target.value)}
                  />{" "}
                </div>{" "}
                <div>
                  {" "}
                  <label className="label">Website</label>{" "}
                  <input
                    type="url"
                    className="input w-full"
                    placeholder="https://company.com"
                    value={form.website || ""}
                    onChange={(e) => set("website", e.target.value)}
                  />{" "}
                </div>{" "}
              </div>{" "}
            </div>
          )}{" "}
          {activeSection === "address" && (
            <div className="card p-6 space-y-5 animate-fade-in">
              {" "}
              <SectionTitle icon={MapPin} title="Address" />{" "}
              <div className="grid grid-cols-2 gap-4">
                {" "}
                <div className="col-span-2">
                  {" "}
                  <label className="label">
                    Address Line 1 <span className="text-rose-500">*</span>
                  </label>{" "}
                  <input
                    type="text"
                    className={`input w-full ${errors.addressLine1 ? "input-error" : ""}`}
                    placeholder="Street, Building, Suite"
                    value={form.addressLine1 || ""}
                    onChange={(e) => set("addressLine1", e.target.value)}
                  />{" "}
                  <Err field="addressLine1" />{" "}
                </div>{" "}
                <div className="col-span-2">
                  {" "}
                  <label className="label">Address Line 2</label>{" "}
                  <input
                    type="text"
                    className="input w-full"
                    placeholder="Floor, Landmark"
                    value={form.addressLine2 || ""}
                    onChange={(e) => set("addressLine2", e.target.value)}
                  />{" "}
                </div>{" "}
                <div>
                  {" "}
                  <label className="label">
                    City <span className="text-rose-500">*</span>
                  </label>{" "}
                  <input
                    type="text"
                    className={`input w-full ${errors.city ? "input-error" : ""}`}
                    placeholder="Mumbai"
                    value={form.city || ""}
                    onChange={(e) => set("city", e.target.value)}
                  />{" "}
                  <Err field="city" />{" "}
                </div>{" "}
                <div>
                  {" "}
                  <label className="label">State / Province</label>{" "}
                  <input
                    type="text"
                    className="input w-full"
                    placeholder="Maharashtra"
                    value={form.state || ""}
                    onChange={(e) => set("state", e.target.value)}
                  />{" "}
                </div>{" "}
                <div>
                  {" "}
                  <label className="label">
                    Country <span className="text-rose-500">*</span>
                  </label>{" "}
                  <select
                    className="input w-full"
                    value={form.country || ""}
                    onChange={(e) => set("country", e.target.value)}
                  >
                    {" "}
                    <option value="">Select country</option>{" "}
                    {COUNTRIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}{" "}
                  </select>{" "}
                  <Err field="country" />{" "}
                </div>{" "}
                <div>
                  {" "}
                  <label className="label">ZIP / Postal Code</label>{" "}
                  <input
                    type="text"
                    className="input w-full font-mono"
                    placeholder="400001"
                    value={form.zipCode || ""}
                    onChange={(e) => set("zipCode", e.target.value)}
                  />{" "}
                </div>{" "}
              </div>{" "}
            </div>
          )}{" "}
          {activeSection === "subscription" && (
            <div className="card p-6 space-y-5 animate-fade-in">
              {" "}
              <SectionTitle icon={Package} title="Subscription Details" />{" "}
              <div className="grid grid-cols-2 gap-4">
                {" "}
                <div>
                  {" "}
                  <label className="label">Subscription Plan</label>{" "}
                  <select
                    className="input w-full"
                    value={form.subscriptionPlan || ""}
                    onChange={(e) => set("subscriptionPlan", e.target.value)}
                  >
                    {" "}
                    <option value="">Select Plan</option>{" "}
                    {SUBSCRIPTION_PLANS.map((p) => (
                      <option key={p}>{p}</option>
                    ))}{" "}
                  </select>{" "}
                </div>{" "}
                <div>
                  {" "}
                  <label className="label">Number of Users</label>{" "}
                  <input
                    type="number"
                    min={1}
                    className="input w-full"
                    value={form.numberOfUsers || 1}
                    onChange={(e) =>
                      set("numberOfUsers", parseInt(e.target.value) || 1)
                    }
                  />{" "}
                </div>{" "}
                <div>
                  {" "}
                  <label className="label">Start Date</label>{" "}
                  <input
                    type="date"
                    className="input w-full"
                    value={form.startDate || ""}
                    onChange={(e) => set("startDate", e.target.value)}
                  />{" "}
                </div>{" "}
                <div>
                  {" "}
                  <label className="label">Expiry Date</label>{" "}
                  <input
                    type="date"
                    className="input w-full"
                    value={form.expiryDate || ""}
                    onChange={(e) => set("expiryDate", e.target.value)}
                  />{" "}
                </div>{" "}
                <div className="col-span-2">
                  {" "}
                  <label className="label">Subscription Status</label>{" "}
                  <div className="flex gap-3 flex-wrap mt-1">
                    {" "}
                    {["Active", "Suspended", "Expired"].map((s) => {
                      const cfg = STATUS_CONFIG[s];
                      const sel = form.subscriptionStatus === s;
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => set("subscriptionStatus", s)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${sel ? `${cfg.bg} ${cfg.color} border-current` : "border-border text-muted hover:bg-stone-50"}`}
                        >
                          {" "}
                          {sel && <Check size={13} />} {s}{" "}
                        </button>
                      );
                    })}{" "}
                  </div>{" "}
                </div>{" "}
              </div>{" "}
            </div>
          )}{" "}
          <div className="flex justify-between items-center pt-2">
            {" "}
            <div className="flex gap-2"> {} </div>{" "}
            <div className="flex gap-3 ml-auto">
              {" "}
              <button
                type="button"
                onClick={onCancel}
                className="btn-secondary"
              >
                Cancel
              </button>{" "}
              {activeSection !== sections[sections.length - 1].id ? (
                <button
                  type="button"
                  onClick={() => {
                    const idx = sections.findIndex(
                      (s) => s.id === activeSection,
                    );
                    setActiveSection(sections[idx + 1].id);
                  }}
                  className="btn-primary"
                >
                  {" "}
                  Next →{" "}
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary flex items-center gap-2"
                >
                  {" "}
                  {saving ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Save size={15} />
                  )}{" "}
                  {isEdit ? "Update Client" : "Save Client"}{" "}
                </button>
              )}{" "}
            </div>{" "}
          </div>{" "}
        </form>{" "}
      </div>{" "}
    </div>
  );
}
function ClientViewDetail({ client, onBack, onEdit }) {
  const accCfg = STATUS_CONFIG[client.accountStatus] || STATUS_CONFIG.Inactive;
  const subCfg =
    STATUS_CONFIG[client.subscriptionStatus] || STATUS_CONFIG.Inactive;
  return (
    <div className="p-8 max-w-5xl mx-auto animate-fade-in space-y-6">
      {" "}
      <div className="flex items-start justify-between gap-4">
        {" "}
        <div className="flex items-center gap-4">
          {" "}
          <ClientAvatar client={client} size="lg" />{" "}
          <div>
            {" "}
            <h1 className="page-title">{client.companyName}</h1>{" "}
            <p className="text-muted text-sm font-mono">{client.companyCode}</p>{" "}
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {" "}
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${accCfg.bg} ${accCfg.color}`}
              >
                {" "}
                <span
                  className={`w-1.5 h-1.5 rounded-full ${accCfg.dot}`}
                />{" "}
                {client.accountStatus}{" "}
              </span>{" "}
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${subCfg.bg} ${subCfg.color}`}
              >
                {" "}
                <span
                  className={`w-1.5 h-1.5 rounded-full ${subCfg.dot}`}
                />{" "}
                {client.subscriptionStatus} Subscription{" "}
              </span>{" "}
              {client.subscriptionPlan && (
                <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-200">
                  {" "}
                  {client.subscriptionPlan} Plan{" "}
                </span>
              )}{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
        <div className="flex gap-2 shrink-0">
          {" "}
          <button
            onClick={onBack}
            className="btn-secondary flex items-center gap-2"
          >
            {" "}
            <ChevronLeft size={15} /> Back{" "}
          </button>{" "}
          <button
            onClick={onEdit}
            className="btn-primary flex items-center gap-2"
          >
            {" "}
            <Edit2 size={15} /> Edit{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {" "}
        <InfoCard title="Company Information" icon={Building2}>
          {" "}
          <InfoRow label="Business Type" value={client.businessType} />{" "}
          <InfoRow label="Industry" value={client.industry} />{" "}
          <InfoRow label="GST / VAT No." value={client.gstNumber} mono />{" "}
          <InfoRow label="Tax Reg. No." value={client.taxRegNumber} mono />{" "}
          <InfoRow
            label="Company Reg. No."
            value={client.companyRegNumber}
            mono
          />{" "}
        </InfoCard>{" "}
        <InfoCard title="Contact Information" icon={Mail}>
          {" "}
          <InfoRow label="Contact Person" value={client.contactName} />{" "}
          <InfoRow label="Email" value={client.email} />{" "}
          <InfoRow label="Phone" value={client.phone} />{" "}
          <InfoRow label="Mobile" value={client.mobile} />{" "}
          <InfoRow label="Website" value={client.website} link />{" "}
        </InfoCard>{" "}
        <InfoCard title="Address" icon={MapPin}>
          {" "}
          <InfoRow
            label="Address"
            value={[client.addressLine1, client.addressLine2]
              .filter(Boolean)
              .join(", ")}
          />{" "}
          <InfoRow label="City" value={client.city} />{" "}
          <InfoRow label="State" value={client.state} />{" "}
          <InfoRow label="Country" value={client.country} />{" "}
          <InfoRow label="ZIP Code" value={client.zipCode} mono />{" "}
        </InfoCard>{" "}
        <InfoCard title="Subscription" icon={Package}>
          {" "}
          <InfoRow label="Plan" value={client.subscriptionPlan} />{" "}
          <InfoRow
            label="Max Users"
            value={
              client.numberOfUsers ? `${client.numberOfUsers} users` : undefined
            }
          />{" "}
          <InfoRow
            label="Start Date"
            value={
              client.startDate
                ? new Date(client.startDate).toLocaleDateString("en-IN")
                : undefined
            }
          />{" "}
          <InfoRow
            label="Expiry Date"
            value={
              client.expiryDate
                ? new Date(client.expiryDate).toLocaleDateString("en-IN")
                : undefined
            }
          />{" "}
          <InfoRow
            label="Created"
            value={
              client.createdAt
                ? new Date(client.createdAt).toLocaleString("en-IN")
                : undefined
            }
          />{" "}
        </InfoCard>{" "}
      </div>{" "}
      <div className="card px-4 py-3 flex items-center gap-3">
        {" "}
        <Hash size={14} className="text-muted shrink-0" />{" "}
        <span className="text-xs text-muted">Client ID:</span>{" "}
        <span className="font-mono text-sm text-ink font-semibold">
          {client.id}
        </span>{" "}
      </div>{" "}
    </div>
  );
}
function InfoCard({ title, icon: Icon, children }) {
  return (
    <div className="card p-5 space-y-3">
      {" "}
      <h3 className="text-sm font-semibold text-ink flex items-center gap-2 pb-2 border-b border-border">
        {" "}
        <Icon size={14} className="text-primary-500" /> {title}{" "}
      </h3>{" "}
      <div className="space-y-2">{children}</div>{" "}
    </div>
  );
}
function InfoRow({ label, value, mono, link }) {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between gap-2">
      {" "}
      <span className="text-xs text-muted shrink-0">{label}</span>{" "}
      {link ? (
        <a
          href={value}
          target="_blank"
          rel="noreferrer"
          className={`text-xs text-right text-primary-600 hover:underline ${mono ? "font-mono" : ""}`}
        >
          {" "}
          {value}{" "}
        </a>
      ) : (
        <span
          className={`text-xs text-ink text-right ${mono ? "font-mono" : "font-medium"}`}
        >
          {" "}
          {value}{" "}
        </span>
      )}{" "}
    </div>
  );
}
function SectionTitle({ icon: Icon, title }) {
  return (
    <h2 className="text-sm font-semibold text-ink flex items-center gap-2 pb-3 border-b border-border">
      {" "}
      <Icon size={15} className="text-primary-500" /> {title}{" "}
    </h2>
  );
}
