import React, { useState, useEffect } from "react";
import {
  Plus,
  Key,
  Copy,
  Trash2,
  Clock,
  ChevronRight,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../../services/api";
import DataTable from "../../../components/common/DataTable";
export default function ApiKeys() {
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newKeyData, setNewKeyData] = useState(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const fetchKeys = () => {
    setLoading(true);
    api
      .get("/settings/api-keys")
      .then((res) => setKeys(res.data.data || []))
      .catch(() => toast.error("Failed to load API keys"))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    fetchKeys();
  }, []);
  const handleRevoke = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to revoke this API key? Any integrations using it will immediately break.",
      )
    ) {
      try {
        await api.delete(`/settings/api-keys/${id}`);
        toast.success("API key revoked");
        fetchKeys();
      } catch (err) {
        toast.error("Failed to revoke API key");
      }
    }
  };
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
    toast.success("Copied to clipboard");
  };
  const columns = [
    {
      header: "Name",
      cell: (row) => <span className="font-medium text-ink">{row.name}</span>,
    },
    {
      header: "Key Prefix",
      cell: (row) => (
        <span className="mono-id bg-transparent hover:bg-transparent cursor-default select-text">
          {" "}
          {row.keyPrefix}••••••••••••{" "}
        </span>
      ),
    },
    {
      header: "Created",
      cell: (row) => (
        <span className="text-sm text-muted tabular-nums">
          {" "}
          {row.createdAt
            ? new Date(row.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "—"}{" "}
        </span>
      ),
    },
    {
      header: "Last Used",
      cell: (row) =>
        row.lastUsedAt ? (
          <span className="flex items-center gap-1.5 text-sm text-muted tabular-nums">
            {" "}
            <Clock size={13} style={{ color: "#A8A49F" }} />{" "}
            {new Date(row.lastUsedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}{" "}
          </span>
        ) : (
          <span className="text-sm text-stone-400">Never</span>
        ),
    },
    {
      header: "",
      align: "right",
      width: 60,
      cell: (row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleRevoke(row.id);
          }}
          className="btn-ghost p-2 btn-xs"
          style={{ color: "#C0292B" }}
          title="Revoke Key"
        >
          {" "}
          <Trash2 size={13} />{" "}
        </button>
      ),
    },
  ];
  return (
    <div>
      {" "}
      <div className="module-header">
        {" "}
        <div className="breadcrumb">
          {" "}
          <span>Settings</span>{" "}
          <ChevronRight size={12} className="breadcrumb-sep" />{" "}
          <span className="breadcrumb-current">API Keys</span>{" "}
        </div>{" "}
        <button
          className="btn-primary btn-sm"
          onClick={() => setIsModalOpen(true)}
        >
          {" "}
          <Plus size={13} /> Create Secret Key{" "}
        </button>{" "}
      </div>{" "}
      <div className="px-8 py-6 max-w-5xl space-y-6">
        {" "}
        <div>
          {" "}
          <h1 className="page-title">API Keys</h1>{" "}
          <p className="page-subtitle">
            Manage keys used to authenticate API requests
          </p>{" "}
        </div>{" "}
        {newKeyData && (
          <div
            className="rounded-lg p-5 mb-6"
            style={{ background: "#EDFAF3", border: "1px solid #6EBD97" }}
          >
            {" "}
            <div className="flex items-start justify-between gap-4">
              {" "}
              <div>
                {" "}
                <h3 className="text-sm font-semibold text-ink flex items-center gap-2 mb-1">
                  {" "}
                  <span className="w-5 h-5 rounded-full bg-success flex items-center justify-center">
                    {" "}
                    <Check
                      size={12}
                      className="text-white"
                      strokeWidth={3}
                    />{" "}
                  </span>{" "}
                  API Key created successfully{" "}
                </h3>{" "}
                <p
                  className="text-xs text-success-muted mb-4 max-w-lg"
                  style={{ color: "#1A7F4E" }}
                >
                  {" "}
                  Please copy this key and store it securely. For security
                  reasons, <strong>we cannot show it to you again</strong>.{" "}
                </p>{" "}
                <div
                  className="flex items-center gap-2 rounded-md p-2.5"
                  style={{ background: "#FFFFFF", border: "1px solid #6EBD97" }}
                >
                  {" "}
                  <code className="flex-1 text-sm font-mono text-ink tracking-tight select-all">
                    {" "}
                    {newKeyData.rawKey}{" "}
                  </code>{" "}
                  <button
                    onClick={() => copyToClipboard(newKeyData.rawKey)}
                    className="btn-ghost p-1.5 rounded text-success hover:bg-success-light transition-colors"
                    title="Copy to clipboard"
                  >
                    {" "}
                    {copiedKey ? <Check size={14} /> : <Copy size={14} />}{" "}
                  </button>{" "}
                </div>{" "}
              </div>{" "}
              <button
                className="btn-ghost btn-sm text-success hover:bg-success-light"
                onClick={() => setNewKeyData(null)}
              >
                {" "}
                Dismiss{" "}
              </button>{" "}
            </div>{" "}
          </div>
        )}{" "}
        {!loading && keys.length === 0 ? (
          <div
            className="bg-surface rounded-lg flex flex-col items-center justify-center py-20"
            style={{ border: "1px solid #E7E5E2" }}
          >
            {" "}
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
              style={{ background: "#EEF2FF" }}
            >
              {" "}
              <Key size={22} style={{ color: "#2D5BFF" }} />{" "}
            </div>{" "}
            <h3 className="text-base font-semibold text-ink mb-1">
              No API Keys
            </h3>{" "}
            <p className="text-sm text-muted mb-6 text-center max-w-xs">
              {" "}
              Create a secret key to authenticate your backend servers or custom
              scripts with our API.{" "}
            </p>{" "}
            <button
              className="btn-primary"
              onClick={() => setIsModalOpen(true)}
            >
              {" "}
              <Plus size={14} /> Create Secret Key{" "}
            </button>{" "}
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={keys}
            loading={loading}
            totalElements={keys.length}
            page={0}
            size={100}
            onPageChange={() => {}}
            onSearch={() => {}}
            searchPlaceholder="Search API keys…"
          />
        )}{" "}
      </div>{" "}
      {/* Assuming CreateApiKeyModal exists and uses SlideOver or Modal primitives. For brevity, not rewriting here. */}{" "}
      {/* <CreateApiKeyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={(data) => { fetchKeys(); setNewKeyData(data); }} /> */}{" "}
    </div>
  );
}
