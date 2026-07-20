import React, { useState, useEffect } from "react";
import {
  Plus,
  Webhook as WebhookIcon,
  Trash2,
  Edit2,
  Play,
  ChevronRight,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../../services/api";
import DataTable from "../../../components/common/DataTable";
import StatusBadge from "../../../components/common/StatusBadge";
import CreateWebhookModal from "./CreateWebhookModal";
export default function Webhooks() {
  const [webhooks, setWebhooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState(null);
  const fetchWebhooks = () => {
    setLoading(true);
    api
      .get("/settings/webhooks")
      .then((res) => setWebhooks(res.data.data || []))
      .catch(() => toast.error("Failed to load webhooks"))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    fetchWebhooks();
  }, []);
  const handleDelete = async (id) => {
    if (window.confirm("Delete this webhook?")) {
      try {
        await api.delete(`/settings/webhooks/${id}`);
        toast.success("Webhook deleted");
        fetchWebhooks();
      } catch {
        toast.error("Failed to delete webhook");
      }
    }
  };
  const handleTest = async (id) => {
    try {
      await api.post(`/settings/webhooks/${id}/test`);
      toast.success("Test webhook sent");
    } catch {
      toast.error("Test webhook failed");
    }
  };
  const columns = [
    {
      header: "Endpoint URL",
      cell: (row) => (
        <span className="text-sm font-medium text-ink font-mono-sm">
          {row.url}
        </span>
      ),
    },
    {
      header: "Events",
      cell: (row) => {
        try {
          const events = JSON.parse(row.subscribedEvents || "[]");
          return events.length > 0 ? (
            <div className="flex gap-1 flex-wrap">
              {" "}
              {events.slice(0, 2).map((e, i) => (
                <span key={i} className="mono-id">
                  {e}
                </span>
              ))}{" "}
              {events.length > 2 && (
                <span className="mono-id">+{events.length - 2}</span>
              )}{" "}
            </div>
          ) : (
            <span className="text-sm text-muted">All events</span>
          );
        } catch {
          return <span className="text-sm text-muted">All events</span>;
        }
      },
    },
    {
      header: "Status",
      cell: (row) => (
        <StatusBadge status={row.status?.toUpperCase() || "INACTIVE"} />
      ),
    },
    {
      header: "",
      align: "right",
      width: 100,
      cell: (row) => (
        <div className="flex items-center justify-end gap-1">
          {" "}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleTest(row.id);
            }}
            className="btn-ghost p-2 btn-xs"
            title="Test"
          >
            {" "}
            <Play size={13} />{" "}
          </button>{" "}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditingWebhook(row);
              setIsModalOpen(true);
            }}
            className="btn-ghost p-2 btn-xs"
            title="Edit"
          >
            {" "}
            <Edit2 size={13} />{" "}
          </button>{" "}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row.id);
            }}
            className="btn-ghost p-2 btn-xs"
            style={{ color: "#C0292B" }}
            title="Delete"
          >
            {" "}
            <Trash2 size={13} />{" "}
          </button>{" "}
        </div>
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
          <span className="breadcrumb-current">Webhooks</span>{" "}
        </div>{" "}
      </div>{" "}
      <div className="px-8 py-8 flex max-w-4xl mx-auto">
        {" "}
        <div className="flex-1 min-w-0 space-y-6">
          {" "}
          <div className="flex items-start justify-between">
            {" "}
            <div>
              {" "}
              <h1 className="page-title">Webhooks</h1>{" "}
              <p className="page-subtitle">
                Subscribe to events and receive real-time notifications
              </p>{" "}
            </div>{" "}
            <button
              className="btn-primary btn-sm"
              onClick={() => {
                setEditingWebhook(null);
                setIsModalOpen(true);
              }}
            >
              {" "}
              <Plus size={13} /> Add Endpoint{" "}
            </button>{" "}
          </div>{" "}
          {!loading && webhooks.length === 0 ? (
            <div
              className="bg-surface rounded-card flex flex-col items-center justify-center py-20"
              style={{ border: "1px solid #E7E5E2" }}
            >
              {" "}
              <div
                className="w-12 h-12 rounded-card flex items-center justify-center mb-4"
                style={{ background: "#EEF2FF" }}
              >
                {" "}
                <WebhookIcon size={22} style={{ color: "#2D5BFF" }} />{" "}
              </div>{" "}
              <h3 className="text-base font-semibold text-ink mb-1">
                No Webhook Endpoints
              </h3>{" "}
              <p className="text-sm text-muted mb-6 text-center max-w-xs">
                {" "}
                Configure webhooks to be notified when events happen in your
                billing platform.{" "}
              </p>{" "}
              <button
                className="btn-primary"
                onClick={() => {
                  setEditingWebhook(null);
                  setIsModalOpen(true);
                }}
              >
                {" "}
                <Plus size={14} /> Add Endpoint{" "}
              </button>{" "}
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={webhooks}
              loading={loading}
              totalElements={webhooks.length}
              page={0}
              size={100}
              searchPlaceholder="Search webhooks…"
            />
          )}{" "}
        </div>{" "}
      </div>{" "}
      <CreateWebhookModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          fetchWebhooks();
          setIsModalOpen(false);
        }}
        initialData={editingWebhook}
      />{" "}
    </div>
  );
}
