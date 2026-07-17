import React, { useState } from "react";
import { Bell, Edit2, Plus } from "lucide-react";
export default function OpzNotifications() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "Payment Failed",
      channel: "Email",
      status: true,
      recipients: "Customer, Admin",
    },
    {
      id: 2,
      type: "Subscription Renewed",
      channel: "Email",
      status: true,
      recipients: "Customer",
    },
    {
      id: 3,
      type: "Invoice Generated",
      channel: "Email",
      status: true,
      recipients: "Customer, Billing",
    },
    {
      id: 4,
      type: "Dunning Triggered",
      channel: "Email",
      status: false,
      recipients: "Admin",
    },
  ]);
  const toggleStatus = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: !n.status } : n)),
    );
  };
  return (
    <div className="space-y-6 animate-fade-in">
      {" "}
      <div className="flex items-start justify-between mb-2">
        {" "}
        <div>
          {" "}
          <h2 className="text-base font-bold text-ink">
            System Notifications
          </h2>{" "}
          <p className="text-sm text-muted mt-0.5">
            Manage system events and notification templates.
          </p>{" "}
        </div>{" "}
        <button className="btn-primary">
          <Plus size={14} /> Create Custom Notification
        </button>{" "}
      </div>{" "}
      <div className="card p-0">
        <div className="tbl-wrapper">
          <table className="tbl">
            <thead>
              <tr>
                <th>Notification Type</th> <th>Channel</th> <th>Recipients</th>{" "}
                <th>Status</th> <th className="text-right">Actions</th></tr></thead>{" "}
            <tbody>
              {notifications.map((n) => (
                <tr key={n.id}>
                  <td className="font-medium text-ink flex items-center gap-2">
                    <Bell size={14} className="text-muted" /> {n.type}{" "}
                  </td>{" "}
                  <td>{n.channel}</td> <td>{n.recipients}</td>{" "}
                  <td>
                    <button
                      onClick={() => toggleStatus(n.id)}
                      className={`toggle ${n.status ? "on" : ""}`}
                    >
                      <span className="toggle-thumb" />{" "}
                    </button>{" "}
                  </td>{" "}
                  <td className="text-right">
                    <button className="btn-ghost btn-sm text-accent">
                      <Edit2 size={14} /> Configure
                    </button>{" "}
                  </td></tr>
              ))}</tbody></table>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
