import React from "react";
import { useAuth } from "../../store/AuthContext";
import { AlertCircle, CheckCircle2 } from "lucide-react";
export default function SettingsDashboard() {
  const { user } = useAuth();
  const stats = [
    {
      title: "Total Team Members",
      value: "24",
      trend: "+2 this month",
      color: "border-blue-500",
    },
    {
      title: "Active Integrations",
      value: "8",
      trend: "Stable",
      color: "border-purple-500",
    },
    {
      title: "Pending Approvals",
      value: "3",
      trend: "-1 since yesterday",
      color: "border-pink-500",
    },
  ];
  const recentOps = [
    {
      op: "API Key Rotated",
      by: "John Doe",
      status: "Completed",
      date: "2026-07-09 08:30 AM",
    },
    {
      op: "User Role Updated",
      by: "Jane Smith",
      status: "Completed",
      date: "2026-07-08 14:15 PM",
    },
    {
      op: "Stripe Integration Sync",
      by: "System",
      status: "Processing",
      date: "2026-07-08 10:00 AM",
    },
    {
      op: "New Webhook Added",
      by: "Alice Jones",
      status: "Completed",
      date: "2026-07-07 16:45 PM",
    },
  ];
  return (
    <div className="space-y-6">
      {" "}
      {/* 3 Stat Cards */}{" "}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {" "}
        {stats.map((stat, i) => (
          <div key={i} className={`card border-l-4 ${stat.color} p-5`}>
            {" "}
            <div className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">
              {stat.title}
            </div>{" "}
            <div className="flex items-end justify-between">
              {" "}
              <div className="font-display text-3xl font-bold text-ink">
                {stat.value}
              </div>{" "}
              <div className="text-xs font-medium text-stone-500">
                {stat.trend}
              </div>{" "}
            </div>{" "}
          </div>
        ))}{" "}
      </div>{" "}
      {/* Recent Operations */}{" "}
      <div className="card p-0 overflow-hidden">
        {" "}
        <div className="p-5 border-b border-border bg-stone-50/50">
          <h2 className="font-bold text-ink">Recent Operations</h2>{" "}
        </div>{" "}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 text-xs font-semibold text-muted uppercase tracking-wider border-b border-border">
                <th className="px-5 py-3">Operation</th>{" "}
                <th className="px-5 py-3">Initiated By</th>{" "}
                <th className="px-5 py-3">Status</th>{" "}
                <th className="px-5 py-3">Date</th></tr></thead>{" "}
            <tbody className="text-sm">
              {recentOps.map((op, i) => (
                <tr
                  key={i}
                  className="border-b border-border/50 hover:bg-stone-50/50 transition-colors"
                >
                  <td className="px-5 py-3 font-medium text-ink">
                    {op.op}
                  </td>{" "}
                  <td className="px-5 py-3 text-muted">{op.by}</td>{" "}
                  <td className="px-5 py-3">
                    {op.status === "Completed" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 size={12} /> Completed{" "}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <AlertCircle size={12} /> Processing{" "}
                      </span>
                    )}{" "}
                  </td>{" "}
                  <td className="px-5 py-3 text-muted tabular-nums">
                    {op.date}
                  </td></tr>
              ))}</tbody></table>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
