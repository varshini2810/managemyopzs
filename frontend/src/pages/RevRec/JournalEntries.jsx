import React from "react";
import { ChevronRight } from "lucide-react";
export default function JournalEntries() {
  return (
    <div>
      {" "}
      <div className="module-header">
        {" "}
        <div className="breadcrumb">
          {" "}
          <span>RevRec</span>{" "}
          <ChevronRight size={12} className="breadcrumb-sep" />{" "}
          <span className="breadcrumb-current">Journal Entries</span>{" "}
        </div>{" "}
      </div>{" "}
      <div className="px-8 py-8 max-w-7xl mx-auto">
        {" "}
        <h1 className="page-title">Journal Entries</h1>{" "}
        <p className="page-subtitle">Manage your journal entries</p>{" "}
        <div className="mt-8 bg-surface border border-border rounded-card p-10 text-center">
          {" "}
          <p className="text-muted">
            This module is part of the new Chargebee RevRec suite.
          </p>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
