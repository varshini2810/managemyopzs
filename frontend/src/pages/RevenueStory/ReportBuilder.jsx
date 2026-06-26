import React from 'react';
import { Save, FilePlus, Mail, Plus } from 'lucide-react';

export default function ReportBuilder() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Report Builder</h1>
          <p className="page-subtitle">Create, preview, and save custom reports.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary"><Mail size={14} /> Save & Schedule</button>
          <button className="btn-primary"><Save size={14} /> Save Report</button>
        </div>
      </div>

      <div className="flex gap-6 h-[600px]">
        {/* Sidebar Configuration */}
        <div className="w-80 flex flex-col gap-6 overflow-y-auto">
          <div className="card p-4 space-y-4">
            <div>
              <label className="label">1. Data Source</label>
              <select className="select"><option>Subscriptions</option><option>Invoices</option><option>Customers</option></select>
            </div>
            <div className="divider" />
            <div>
              <label className="label">2. Columns</label>
              <div className="space-y-2 mt-2">
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> Customer ID</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> Plan Name</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> MRR</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" /> Status</label>
              </div>
            </div>
            <div className="divider" />
            <div>
              <label className="label">3. Filters</label>
              <button className="btn-ghost btn-sm w-full border border-dashed border-border mt-1"><Plus size={14} /> Add Filter</button>
            </div>
            <div className="divider" />
            <div>
              <label className="label">4. Aggregation</label>
              <select className="select"><option>None</option><option>Sum by Plan</option></select>
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="flex-1 card flex flex-col p-0 overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-stone-50 flex items-center justify-between">
            <span className="font-medium text-sm">Live Preview</span>
            <span className="text-2xs text-muted">Showing top 50 rows</span>
          </div>
          <div className="flex-1 overflow-auto bg-white p-4 flex items-center justify-center border-dashed border-2 border-border m-4 rounded">
            <span className="text-muted text-sm">Select data source and columns to preview</span>
          </div>
        </div>
      </div>
    </div>
  );
}
