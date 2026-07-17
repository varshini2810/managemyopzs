import React, { useState, useEffect } from "react";
import {
  Activity,
  Database,
  Users,
  Cpu,
  ShieldAlert,
  Plus,
  Link,
  Copy,
  Server,
  Zap,
  PieChart,
} from "lucide-react";
import api from "../../services/api";
import toast from "react-hot-toast";
export default function PlatformConsole() {
  const [health, setHealth] = useState(null);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    companyName: "",
    subdomain: "",
    adminEmail: "",
  });
  const [inviteLink, setInviteLink] = useState("");
  const fetchData = () => {
    Promise.all([
      api.get("/health").catch(err => (err?.response?.status === 404 ? { data: { data: { status: "unknown" } } } : Promise.reject(err))),
      api.get("/admin/tenants").catch(err => (err?.response?.status === 404 ? { data: { data: [] } } : Promise.reject(err)))
    ])
      .then(([healthRes, tenantsRes]) => {
        setHealth(healthRes.data.data);
        setTenants(tenantsRes.data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);
  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/admin/tenants/invite", inviteForm);
      setInviteLink(res.data.data.inviteLink);
      toast.success("Tenant invited successfully");
      fetchData(); /* refresh list */
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to invite tenant");
    }
  };
  const copyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    toast.success("Invite link copied to clipboard!");
  };
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {" "}
      {/* Dark Hero Banner */}{" "}
      <div className="bg-ink text-white rounded-xl p-8 flex flex-col md:flex-row justify-between items-center md:items-end shadow-lg relative overflow-hidden">
        {" "}
        <div className="relative z-10 w-full md:w-auto mb-6 md:mb-0">
          {" "}
          <div className="flex items-center gap-3 text-indigo-400 mb-2">
            {" "}
            <ShieldAlert size={20} />{" "}
            <span className="font-semibold uppercase tracking-wide text-xs">
              {" "}
              Global Overview{" "}
            </span>{" "}
          </div>{" "}
          <h1 className="text-4xl font-display font-bold tracking-tight">
            {" "}
            Platform Management{" "}
          </h1>{" "}
          <p className="text-stone-400 mt-2 max-w-lg">
            {" "}
            Monitor multi-tenant infrastructure, system health, and overall
            adoption across all environments.{" "}
          </p>{" "}
        </div>{" "}
        <div className="relative z-10 w-full md:w-auto">
          {" "}
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="w-full md:w-auto bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2.5 px-6 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            {" "}
            <Plus size={18} /> Invite Tenant{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {" "}
        {/* Specific Stat Cards (Left column, takes 8 columns) */}{" "}
        <div className="col-span-1 md:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {" "}
          <div className="card p-5 border-l-4 border-l-emerald-500">
            {" "}
            <div className="flex items-center gap-2 text-muted text-xs font-semibold uppercase tracking-wider mb-2">
              {" "}
              <Users size={14} /> Active Tenants{" "}
            </div>{" "}
            <div className="text-3xl font-display font-bold text-ink">
              {" "}
              {loading ? (
                <span className="skeleton w-12 h-8 block"></span>
              ) : (
                (health?.active_tenants ?? "0")
              )}{" "}
            </div>{" "}
          </div>{" "}
          <div className="card p-5 border-l-4 border-l-blue-500">
            {" "}
            <div className="flex items-center gap-2 text-muted text-xs font-semibold uppercase tracking-wider mb-2">
              {" "}
              <Database size={14} /> Database{" "}
            </div>{" "}
            <div className="text-3xl font-display font-bold text-ink truncate">
              {" "}
              {loading ? (
                <span className="skeleton w-24 h-8 block"></span>
              ) : (
                health?.db || "UNKNOWN"
              )}{" "}
            </div>{" "}
          </div>{" "}
          <div className="card p-5 border-l-4 border-l-amber-500">
            {" "}
            <div className="flex items-center gap-2 text-muted text-xs font-semibold uppercase tracking-wider mb-2">
              {" "}
              <Cpu size={14} /> Memory{" "}
            </div>{" "}
            <div className="text-3xl font-display font-bold text-ink">
              {" "}
              {loading ? (
                <span className="skeleton w-20 h-8 block"></span>
              ) : (
                health?.memory_usage || "0 MB"
              )}{" "}
            </div>{" "}
          </div>{" "}
          <div className="card p-5 border-l-4 border-l-purple-500">
            {" "}
            <div className="flex items-center gap-2 text-muted text-xs font-semibold uppercase tracking-wider mb-2">
              {" "}
              <Zap size={14} /> API Requests{" "}
            </div>{" "}
            <div className="text-3xl font-display font-bold text-ink">
              {" "}
              24.5k{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
        {/* Live Data Card (Right column, takes 4 columns) */}{" "}
        <div className="col-span-1 md:col-span-4 card p-6 bg-stone-50 border-border shadow-inner">
          {" "}
          <h2 className="font-semibold text-ink mb-4 flex items-center gap-2">
            {" "}
            <Server size={18} className="text-emerald-500" /> System Status{" "}
          </h2>{" "}
          <div className="space-y-4">
            {" "}
            <div className="flex justify-between items-center">
              {" "}
              <span className="text-sm font-medium text-muted">
                {" "}
                Environment{" "}
              </span>{" "}
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-700">
                {" "}
                LIVE{" "}
              </span>{" "}
            </div>{" "}
            <div className="flex justify-between items-center">
              {" "}
              <span className="text-sm font-medium text-muted">
                {" "}
                Core Services{" "}
              </span>{" "}
              {loading ? (
                <span className="skeleton w-16 h-4 block"></span>
              ) : (
                <span
                  className={`text-sm font-bold ${health?.status === "UP" ? "text-emerald-600" : "text-danger"}`}
                >
                  {" "}
                  {health?.status || "UNKNOWN"}{" "}
                </span>
              )}{" "}
            </div>{" "}
            <div className="flex justify-between items-center">
              {" "}
              <span className="text-sm font-medium text-muted">
                {" "}
                Last Backup{" "}
              </span>{" "}
              <span className="text-sm font-semibold text-ink">
                {" "}
                2 hours ago{" "}
              </span>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {" "}
        {/* All Tenants Table */}{" "}
        <div className="lg:col-span-2 card p-0 overflow-hidden">
          {" "}
          <div className="p-5 border-b border-border bg-stone-50/50 flex justify-between items-center">
            <h2 className="font-bold text-ink">Provisioned Tenants</h2>{" "}
          </div>{" "}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-stone-50 text-xs font-semibold text-muted uppercase tracking-wider border-b border-border">
                <tr>
                  <th className="px-5 py-3">Tenant ID</th>{" "}
                  <th className="px-5 py-3">Company</th>{" "}
                  <th className="px-5 py-3">Status</th>{" "}
                  <th className="px-5 py-3">Created</th></tr></thead>{" "}
              <tbody className="divide-y divide-border/50">
                {loading ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-5 py-4 text-center text-muted"
                    >
                      Loading tenants...{" "}
                    </td></tr>
                ) : tenants.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-5 py-4 text-center text-muted"
                    >
                      No tenants found{" "}
                    </td></tr>
                ) : (
                  tenants.map((t) => (
                    <tr
                      key={t.id}
                      className="hover:bg-stone-50/50 transition-colors"
                    >
                      <td className="px-5 py-3 font-mono text-xs text-muted">
                        {t.id}{" "}
                      </td>{" "}
                      <td className="px-5 py-3 font-semibold text-ink">
                        {t.name}{" "}
                      </td>{" "}
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${t.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}
                        >
                          {t.status}{" "}
                        </span>{" "}
                      </td>{" "}
                      <td className="px-5 py-3 text-muted">
                        {new Date(t.createdAt).toLocaleDateString()}{" "}
                      </td></tr>
                  ))
                )}</tbody></table>{" "}
          </div>{" "}
        </div>{" "}
        {/* Adoption Progress Bars */}{" "}
        <div className="lg:col-span-1 card p-6 flex flex-col">
          <div className="flex items-center gap-2 font-bold text-ink mb-6">
            {" "}
            <PieChart size={18} className="text-accent" /> Module Adoption{" "}
          </div>{" "}
          <div className="space-y-5 flex-1">
            {" "}
            {[
              { label: "Billing Engine", percent: 92, color: "bg-indigo-500" },
              { label: "Revenue Rec", percent: 64, color: "bg-emerald-500" },
              { label: "CPQ Suite", percent: 45, color: "bg-blue-500" },
              { label: "Collections", percent: 38, color: "bg-purple-500" },
            ].map((mod) => (
              <div key={mod.label}>
                {" "}
                <div className="flex justify-between text-sm mb-1.5">
                  {" "}
                  <span className="font-medium text-ink">{mod.label}</span>{" "}
                  <span className="font-bold text-muted">
                    {" "}
                    {mod.percent}%{" "}
                  </span>{" "}
                </div>{" "}
                <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                  {" "}
                  <div
                    className={`h-full ${mod.color} rounded-full`}
                    style={{ width: `${mod.percent}%` }}
                  ></div>{" "}
                </div>{" "}
              </div>
            ))}{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      {/* Invite Modal */}{" "}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm animate-fade-in px-4">
          {" "}
          <div className="bg-surface p-8 rounded-2xl shadow-xl max-w-md w-full relative border border-border">
            {" "}
            <h2 className="text-2xl font-display font-bold mb-6 text-ink tracking-tight">
              {" "}
              Invite New Tenant{" "}
            </h2>{" "}
            {inviteLink ? (
              <div className="space-y-6">
                {" "}
                <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-xl">
                  {" "}
                  <h3 className="font-bold text-emerald-800 mb-2">
                    {" "}
                    Invitation Generated!{" "}
                  </h3>{" "}
                  <p className="text-sm text-emerald-600 mb-4">
                    {" "}
                    Share this secure link with the Tenant Admin to complete
                    their setup.{" "}
                  </p>{" "}
                  <div className="flex gap-2">
                    {" "}
                    <input
                      type="text"
                      readOnly
                      value={inviteLink}
                      className="input flex-1 text-xs font-mono bg-white border-emerald-200"
                    />{" "}
                    <button
                      onClick={copyLink}
                      className="btn-secondary px-3 bg-white border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                    >
                      {" "}
                      <Copy size={16} />{" "}
                    </button>{" "}
                  </div>{" "}
                </div>{" "}
                <button
                  onClick={() => {
                    setIsInviteModalOpen(false);
                    setInviteLink("");
                    setInviteForm({
                      companyName: "",
                      subdomain: "",
                      adminEmail: "",
                    });
                  }}
                  className="btn-primary w-full py-2.5"
                >
                  {" "}
                  Done{" "}
                </button>{" "}
              </div>
            ) : (
              <form onSubmit={handleInvite} className="space-y-5">
                {" "}
                <div>
                  {" "}
                  <label className="label">Company Name</label>{" "}
                  <input
                    type="text"
                    required
                    className="input w-full"
                    value={inviteForm.companyName}
                    onChange={(e) =>
                      setInviteForm({
                        ...inviteForm,
                        companyName: e.target.value,
                      })
                    }
                    placeholder="e.g. Acme Corp"
                  />{" "}
                </div>{" "}
                <div>
                  {" "}
                  <label className="label">Subdomain</label>{" "}
                  <div className="flex items-center">
                    {" "}
                    <input
                      type="text"
                      required
                      className="input rounded-r-none border-r-0 flex-1 z-10 focus:border-accent"
                      value={inviteForm.subdomain}
                      onChange={(e) =>
                        setInviteForm({
                          ...inviteForm,
                          subdomain: e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9-]/g, ""),
                        })
                      }
                      placeholder="acme"
                    />{" "}
                    <span className="bg-stone-50 border border-border border-l-0 px-3 py-[9px] rounded-r-lg text-muted text-sm whitespace-nowrap">
                      {" "}
                      .billingplatform.com{" "}
                    </span>{" "}
                  </div>{" "}
                </div>{" "}
                <div>
                  {" "}
                  <label className="label">Admin Email</label>{" "}
                  <input
                    type="email"
                    required
                    className="input w-full"
                    value={inviteForm.adminEmail}
                    onChange={(e) =>
                      setInviteForm({
                        ...inviteForm,
                        adminEmail: e.target.value,
                      })
                    }
                    placeholder="admin@company.com"
                  />{" "}
                </div>{" "}
                <div className="flex gap-3 justify-end mt-8">
                  {" "}
                  <button
                    type="button"
                    onClick={() => setIsInviteModalOpen(false)}
                    className="btn-secondary px-5 py-2.5"
                  >
                    {" "}
                    Cancel{" "}
                  </button>{" "}
                  <button type="submit" className="btn-primary px-5 py-2.5">
                    {" "}
                    Send Invitation{" "}
                  </button>{" "}
                </div>{" "}
              </form>
            )}{" "}
          </div>{" "}
        </div>
      )}{" "}
    </div>
  );
}
