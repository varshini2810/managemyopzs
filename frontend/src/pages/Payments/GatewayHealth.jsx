import React from "react";
import { ChevronRight } from "lucide-react";
export default function GatewayHealth() {
  return (
    <div>
      {" "}
      <div className="module-header">
        {" "}
        <div className="breadcrumb">
          {" "}
          <span>Payments</span>{" "}
          <ChevronRight size={12} className="breadcrumb-sep" />{" "}
          <span className="breadcrumb-current">Gateway Health</span>{" "}
        </div>{" "}
      </div>{" "}
      <div className="px-8 py-8 max-w-7xl mx-auto">
        {" "}
        <h1 className="page-title">Gateway Health</h1>{" "}
        <p className="page-subtitle">Manage your gateway health</p>{" "}
        <div className="mt-8 bg-surface border border-border rounded-lg p-10 text-center">
          {" "}
          <p className="text-muted">
            This module is part of the new Chargebee Payments suite.
          </p>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
