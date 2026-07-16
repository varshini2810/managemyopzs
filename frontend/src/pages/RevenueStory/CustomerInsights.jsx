import React from "react";
import { Users, Filter } from "lucide-react";
export default function CustomerInsights() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {" "}
      <div className="page-header">
        {" "}
        <div>
          {" "}
          <h1 className="page-title">Customer Insights</h1>{" "}
          <p className="page-subtitle">
            Revenue analytics at the customer level.
          </p>{" "}
        </div>{" "}
        <div className="flex items-center gap-3">
          {" "}
          <button className="btn-secondary">
            <Filter size={14} /> Segment
          </button>{" "}
        </div>{" "}
      </div>{" "}
      <div className="card p-0">
        {" "}
        <div className="p-4 border-b border-border flex items-center gap-4 bg-stone-50">
          {" "}
          <input
            type="text"
            placeholder="Search customers..."
            className="input max-w-xs"
          />{" "}
          <select className="select max-w-[150px]">
            <option>All Plans</option>
          </select>{" "}
          <select className="select max-w-[150px]">
            <option>Active</option>
            <option>Churned</option>
          </select>{" "}
        </div>{" "}
        <div className="tbl-wrapper">
          <table className="tbl">
            <thead>
              <tr>
                <th>Customer Name</th> <th>Plan</th> <th>Status</th>{" "}
                <th>Health</th> <th className="text-right">Current MRR</th>{" "}
                <th className="text-right">LTV</th></tr></thead>{" "}
            <tbody>
              <tr>
                <td className="font-medium text-accent">Acme Corp</td>{" "}
                <td>Enterprise Annual</td>{" "}
                <td>
                  <span className="status-dot active">Active</span>
                </td>{" "}
                <td>Good</td> <td className="num">$1,200.00</td>{" "}
                <td className="num">$14,400.00</td></tr>{" "}
              <tr>
                <td className="font-medium text-accent">Globex</td>{" "}
                <td>Pro Monthly</td>{" "}
                <td>
                  <span className="status-dot expired">At-risk</span>
                </td>{" "}
                <td>Poor</td> <td className="num">$299.00</td>{" "}
                <td className="num">$2,392.00</td></tr></tbody></table>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
