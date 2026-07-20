import React, { useState } from "react";
import { Target, Bell, Plus } from "lucide-react";
export default function AlertsAndGoals() {
  const [tab, setTab] = useState("alerts");
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {" "}
      <div className="page-header">
        {" "}
        <div>
          {" "}
          <h1 className="page-title">Alerts & Goals</h1>{" "}
          <p className="page-subtitle">
            Track your targets and get notified of anomalies.
          </p>{" "}
        </div>{" "}
        <div className="flex items-center gap-3">
          {" "}
          <button className="btn-primary">
            {" "}
            <Plus size={14} />{" "}
            {tab === "alerts" ? "Create Alert" : "Create Goal"}{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
      <div className="flex items-center gap-6 border-b border-border">
        {" "}
        <button
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${tab === "alerts" ? "border-primary text-primary" : "border-transparent text-muted hover:text-ink"}`}
          onClick={() => setTab("alerts")}
        >
          {" "}
          Alerts{" "}
        </button>{" "}
        <button
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${tab === "goals" ? "border-primary text-primary" : "border-transparent text-muted hover:text-ink"}`}
          onClick={() => setTab("goals")}
        >
          {" "}
          Goals{" "}
        </button>{" "}
      </div>{" "}
      {tab === "alerts" ? (
        <div className="card p-0">
          <div className="tbl-wrapper">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Alert Name</th> <th>Metric</th> <th>Condition</th>{" "}
                  <th>Status</th> <th>Last Triggered</th></tr></thead>{" "}
              <tbody>
                <tr>
                  <td className="font-medium text-ink">
                    High Churn Warning
                  </td>{" "}
                  <td>Churn Rate</td> <td>Increases by &gt; 5%</td>{" "}
                  <td>
                    <span className="status-dot active">Active</span>
                  </td>{" "}
                  <td className="text-muted">Yesterday</td></tr></tbody></table>{" "}
          </div>{" "}
        </div>
      ) : (
        <div className="card p-0">
          <div className="tbl-wrapper">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Goal Name</th> <th>Target Metric</th> <th>Progress</th>{" "}
                  <th>Deadline</th> <th>Status</th></tr></thead>{" "}
              <tbody>
                <tr>
                  <td className="font-medium text-ink">
                    Q3 Revenue Target
                  </td>{" "}
                  <td>MRR ($500k)</td>{" "}
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-bg-main rounded-full overflow-hidden">
                        <div className="h-full bg-success w-[80%]" />{" "}
                      </div>{" "}
                      <span className="text-2xs text-muted tabular-nums">
                        80%
                      </span>{" "}
                    </div>{" "}
                  </td>{" "}
                  <td>Sep 30, 2026</td>{" "}
                  <td>
                    <span className="status-dot active">On Track</span>
                  </td></tr></tbody></table>{" "}
          </div>{" "}
        </div>
      )}{" "}
    </div>
  );
}
