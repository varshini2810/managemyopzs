import React from "react";
import { FileText, Download, Mail } from "lucide-react";
import toast from "react-hot-toast";
export default function AccountingReports() {
  const handleGenerate = (reportName) => {
    const blob = new Blob([`Simulated report data for ${reportName}`], {
      type: "text/csv",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${reportName.replace(/\s+/g, "_")}_Report.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success(`Generated ${reportName}`);
  };
  const reports = [
    {
      name: "Revenue Recognition",
      desc: "Deferred vs recognized revenue schedules.",
    },
    { name: "A/R Aging", desc: "Accounts receivable aging by 30/60/90 days." },
    { name: "Tax Liability", desc: "Collected taxes broken down by region." },
    {
      name: "Invoice Summary",
      desc: "Detailed line items for all generated invoices.",
    },
  ];
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6 animate-fade-in">
      {" "}
      <div className="page-header">
        {" "}
        <div>
          {" "}
          <h1 className="page-title">Accounting Reports</h1>{" "}
          <p className="page-subtitle">
            Pre-built financial reports for accounting and compliance.
          </p>{" "}
        </div>{" "}
      </div>{" "}
      <div className="grid grid-cols-1 gap-4">
        {" "}
        {reports.map((r) => (
          <div key={r.name} className="card flex items-center justify-between">
            {" "}
            <div className="flex items-center gap-4">
              {" "}
              <div className="w-10 h-10 rounded-card bg-bg-main flex items-center justify-center text-muted">
                {" "}
                <FileText size={20} />{" "}
              </div>{" "}
              <div>
                {" "}
                <div className="font-semibold text-ink text-base">
                  {r.name}
                </div>{" "}
                <div className="text-sm text-muted">{r.desc}</div>{" "}
              </div>{" "}
            </div>{" "}
            <div className="flex items-center gap-3">
              {" "}
              <select className="select w-36">
                <option>Last Month</option>
                <option>This Month</option>
              </select>{" "}
              <button className="btn-secondary">
                <Mail size={14} /> Schedule
              </button>{" "}
              <button
                className="btn-primary"
                onClick={() => handleGenerate(r.name)}
              >
                {" "}
                <Download size={14} /> Generate{" "}
              </button>{" "}
            </div>{" "}
          </div>
        ))}{" "}
      </div>{" "}
    </div>
  );
}
