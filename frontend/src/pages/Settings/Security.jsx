import React, { useState } from "react";
import { Shield, Key, History, Globe } from "lucide-react";
export default function Security() {
  const [activeTab, setActiveTab] = useState("auth");
  return (
    <div className="space-y-6 animate-fade-in">
      {" "}
      <div className="mb-2">
        {" "}
        <h2 className="text-base font-bold text-ink">Security</h2>{" "}
        <p className="text-sm text-muted mt-0.5">
          Configure platform security, authentication, and access controls.
        </p>{" "}
      </div>{" "}
      <div className="flex items-center gap-6 border-b border-border mb-6">
        {" "}
        {[
          { id: "auth", label: "Authentication", icon: Shield },
          { id: "api", label: "API Security", icon: Key },
          { id: "audit", label: "Audit Logs", icon: History },
          { id: "ip", label: "IP Allowlisting", icon: Globe },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-muted hover:text-ink"}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {" "}
            <tab.icon size={16} /> {tab.label}{" "}
          </button>
        ))}{" "}
      </div>{" "}
      {activeTab === "auth" && (
        <div className="card max-w-3xl space-y-6">
          {" "}
          <div>
            {" "}
            <h3 className="font-semibold text-ink text-base">
              Password Policy
            </h3>{" "}
            <p className="text-sm text-muted mt-1 mb-4">
              Enforce minimum standards for user passwords.
            </p>{" "}
            <div className="grid grid-cols-2 gap-4">
              {" "}
              <div>
                {" "}
                <label className="label">Minimum Length</label>{" "}
                <input type="number" defaultValue={12} className="input" />{" "}
              </div>{" "}
              <div>
                {" "}
                <label className="label">Complexity</label>{" "}
                <select className="select">
                  <option>Require Numbers & Symbols</option>
                  <option>Alphanumeric</option>
                </select>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          <div className="divider" />{" "}
          <div className="flex items-center justify-between">
            {" "}
            <div>
              {" "}
              <h3 className="font-semibold text-ink text-base">
                MFA Enforcement
              </h3>{" "}
              <p className="text-sm text-muted mt-1">
                Require Multi-Factor Authentication for all Admin roles.
              </p>{" "}
            </div>{" "}
            <button className="toggle on">
              <span className="toggle-thumb" />
            </button>{" "}
          </div>{" "}
          <div className="divider" />{" "}
          <div>
            {" "}
            <label className="label">Session Timeout (Minutes)</label>{" "}
            <input
              type="number"
              defaultValue={30}
              className="input max-w-[200px]"
            />{" "}
          </div>{" "}
          <button className="btn-primary">Save Changes</button>{" "}
        </div>
      )}{" "}
      {activeTab === "audit" && (
        <div className="card p-0">
          {" "}
          <div className="p-4 border-b border-border flex items-center gap-4 bg-bg-main justify-between">
            {" "}
            <input
              type="text"
              placeholder="Search logs..."
              className="input max-w-xs"
            />{" "}
            <button className="btn-secondary">Export CSV</button>{" "}
          </div>{" "}
          <div className="tbl-wrapper">
            <table className="tbl">
              <thead>
                <tr>
                  <th>User</th> <th>Action</th> <th>Entity</th>{" "}
                  <th>IP Address</th> <th>Timestamp</th></tr></thead>{" "}
              <tbody>
                <tr>
                  <td className="font-medium text-ink">
                    admin@billing.com
                  </td>{" "}
                  <td>UPDATE_PLAN_PRICE</td>{" "}
                  <td className="font-mono-sm bg-bg-main px-1 py-0.5 rounded-card">
                    plan_8a92b
                  </td>{" "}
                  <td>192.168.1.105</td>{" "}
                  <td className="text-muted">Just now</td></tr>{" "}
                <tr>
                  <td className="font-medium text-ink">system</td>{" "}
                  <td>GENERATE_INVOICE</td>{" "}
                  <td className="font-mono-sm bg-bg-main px-1 py-0.5 rounded-card">
                    inv_3391c
                  </td>{" "}
                  <td>10.0.0.1</td>{" "}
                  <td className="text-muted">2 hours ago</td></tr></tbody></table>{" "}
          </div>{" "}
        </div>
      )}{" "}
      {/* Placeholders for API and IP tabs */}{" "}
      {(activeTab === "api" || activeTab === "ip") && (
        <div className="card p-8 text-center flex flex-col items-center">
          {" "}
          <Globe size={32} className="text-stone-300 mb-3" />{" "}
          <p className="font-medium">
            {activeTab === "api"
              ? "API Security Configuration"
              : "IP Allowlisting Configuration"}
          </p>{" "}
          <p className="text-sm text-muted mt-1">
            Settings load successfully.
          </p>{" "}
        </div>
      )}{" "}
    </div>
  );
}
