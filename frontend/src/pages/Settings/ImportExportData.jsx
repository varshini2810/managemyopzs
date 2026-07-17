import React from "react";
import { UploadCloud, Download } from "lucide-react";
export default function ImportExportData() {
  return (
    <div className="space-y-6 animate-fade-in">
      {" "}
      <div className="mb-2">
        {" "}
        <h2 className="text-base font-bold text-ink">
          Import &amp; Export Data
        </h2>{" "}
        <p className="text-sm text-muted mt-0.5">
          Move bulk data in and out of the platform.
        </p>{" "}
      </div>{" "}
      <div className="grid grid-cols-2 gap-8">
        {" "}
        <div className="card flex flex-col gap-6">
          {" "}
          <div>
            {" "}
            <div className="flex items-center gap-3 text-lg font-semibold text-ink">
              {" "}
              <UploadCloud className="text-accent" /> Bulk Import{" "}
            </div>{" "}
            <p className="text-sm text-muted mt-2">
              Import customers, subscriptions, or plans via CSV.
            </p>{" "}
          </div>{" "}
          <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-border rounded p-8 text-center bg-stone-50">
            {" "}
            <UploadCloud size={32} className="text-stone-300 mb-3" />{" "}
            <p className="text-sm font-medium text-ink">
              Drag and drop CSV files here
            </p>{" "}
            <p className="text-xs text-muted mt-1">
              or click to browse from your computer
            </p>{" "}
            <button className="btn-secondary mt-4">Select File</button>{" "}
          </div>{" "}
        </div>{" "}
        <div className="card flex flex-col gap-6">
          {" "}
          <div>
            {" "}
            <div className="flex items-center gap-3 text-lg font-semibold text-ink">
              {" "}
              <Download className="text-accent" /> Bulk Export{" "}
            </div>{" "}
            <p className="text-sm text-muted mt-2">
              Export your platform data securely.
            </p>{" "}
          </div>{" "}
          <div className="space-y-4">
            {" "}
            <div>
              {" "}
              <label className="label">Select Entity to Export</label>{" "}
              <select className="select">
                {" "}
                <option>Customers</option> <option>Subscriptions</option>{" "}
                <option>Invoices</option> <option>Transactions</option>{" "}
              </select>{" "}
            </div>{" "}
            <div className="grid grid-cols-2 gap-4">
              {" "}
              <div>
                {" "}
                <label className="label">Date Range</label>{" "}
                <select className="select">
                  <option>All Time</option>
                  <option>Last 30 Days</option>
                </select>{" "}
              </div>{" "}
              <div>
                {" "}
                <label className="label">Format</label>{" "}
                <select className="select">
                  <option>CSV</option>
                  <option>JSON</option>
                </select>{" "}
              </div>{" "}
            </div>{" "}
            <button className="btn-primary w-full mt-2">
              <Download size={16} /> Generate Export
            </button>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
