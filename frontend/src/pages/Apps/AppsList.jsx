import React, { useState, useEffect } from "react";
import {
  CreditCard,
  Calculator,
  Users,
  Settings2,
  Link2,
  Link2Off,
} from "lucide-react";
import api from "../../services/api";
import toast from "react-hot-toast";
export default function AppsList() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchApps = () => {
    setLoading(true);
    api
      .get("/apps")
      .then((res) => setApps(res.data.data))
      .catch(() => toast.error("Failed to load apps"))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    fetchApps();
  }, []);
  const toggleConnection = async (app) => {
    try {
      const endpoint =
        app.status === "CONNECTED"
          ? `/apps/${app.appId}/disconnect`
          : `/apps/${app.appId}/connect`;
      await api.post(endpoint);
      toast.success(
        `${app.appName} ${app.status === "CONNECTED" ? "disconnected" : "connected"} successfully`,
      );
      fetchApps();
    } catch (err) {
      toast.error(`Failed to modify connection for ${app.appName}`);
    }
  };
  const getIcon = (appId) => {
    if (appId === "stripe")
      return <CreditCard size={24} className="text-indigo-600" />;
    if (appId === "xero")
      return <Calculator size={24} className="text-sky-500" />;
    if (appId === "quickbooks")
      return <Calculator size={24} className="text-green-600" />;
    if (appId === "salesforce")
      return <Users size={24} className="text-blue-500" />;
    return <Settings2 size={24} className="text-slate-500" />;
  };
  const getDescription = (appId) => {
    if (appId === "stripe")
      return "Process payments, handle refunds, and manage disputes natively.";
    if (appId === "xero")
      return "Sync invoices, credit notes, and payments seamlessly into Xero.";
    if (appId === "quickbooks")
      return "Keep your Quickbooks Online ledger up to date automatically.";
    if (appId === "salesforce")
      return "Sync customers and subscription states directly into Salesforce CRM.";
    return "Extend billing functionality with this integration.";
  };
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {" "}
      <div className="page-header">
        {" "}
        <div>
          {" "}
          <h1 className="page-title">Apps & Integrations</h1>{" "}
          <p className="page-subtitle">
            Connect third-party tools to extend your billing workflows.
          </p>{" "}
        </div>{" "}
      </div>{" "}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {" "}
        {loading ? (
          <p className="text-muted text-sm">Loading marketplace...</p>
        ) : (
          apps.map((app) => (
            <div
              key={app.id}
              className="card p-6 flex flex-col h-full border border-gray-200"
            >
              {" "}
              <div className="flex items-center justify-between mb-4">
                {" "}
                <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center border border-gray-100">
                  {" "}
                  {getIcon(app.appId)}{" "}
                </div>{" "}
                {app.status === "CONNECTED" ? (
                  <span className="badge badge-success flex items-center gap-1">
                    {" "}
                    <Link2 size={12} /> Connected{" "}
                  </span>
                ) : (
                  <span className="badge bg-slate-100 text-slate-500 flex items-center gap-1">
                    {" "}
                    <Link2Off size={12} /> Disconnected{" "}
                  </span>
                )}{" "}
              </div>{" "}
              <h3 className="font-semibold text-ink text-lg">{app.appName}</h3>{" "}
              <p className="text-sm text-muted mt-2 flex-1">
                {" "}
                {getDescription(app.appId)}{" "}
              </p>{" "}
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                {" "}
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  {app.category}
                </span>{" "}
                <button
                  onClick={() => toggleConnection(app)}
                  className={
                    app.status === "CONNECTED"
                      ? "btn-secondary text-red-600 hover:bg-red-50 hover:border-red-200"
                      : "btn-secondary"
                  }
                >
                  {" "}
                  {app.status === "CONNECTED" ? "Disconnect" : "Connect"}{" "}
                </button>{" "}
              </div>{" "}
            </div>
          ))
        )}{" "}
      </div>{" "}
    </div>
  );
}
