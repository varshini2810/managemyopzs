import React from "react";
import { ChevronRight } from "lucide-react";
export default function ARDashboard() {
  return (
    <div>
      {" "}
      <div className="module-header">
        {" "}
        <div className="breadcrumb">
          {" "}
          <span>Receivables</span>{" "}
          <ChevronRight size={12} className="breadcrumb-sep" />{" "}
          <span className="breadcrumb-current">A R Dashboard</span>{" "}
        </div>{" "}
      </div>{" "}
      <div className="px-8 py-8 max-w-7xl mx-auto">
        {" "}
        <h1 className="page-title">A R Dashboard</h1>{" "}
        <p className="page-subtitle">Manage your a r dashboard</p>{" "}
        <div className="mt-8 bg-surface border border-border rounded-card p-10 text-center">
          {" "}
          <p className="text-muted">
            This module is part of the new Chargebee Receivables suite.
          </p>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
