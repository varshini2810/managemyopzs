import React from "react";

export default function StatusBadge({ status, className = "" }) {
  const s = (status || "").toLowerCase();
  
  let label = status;
  let bgClass = "bg-stone-100 text-stone-600 border-stone-200";
  let dotClass = "bg-stone-400";
  
  if (['active', 'live', 'connected', 'enabled', 'success', 'paid'].includes(s)) { 
    label = s === 'connected' ? 'Connected' : s === 'enabled' ? 'Enabled' : s === 'success' ? 'Success' : s === 'paid' ? 'Paid' : 'Active'; 
    bgClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
    dotClass = "bg-emerald-500";
  } else if (['inactive', 'disconnected', 'disabled'].includes(s)) { 
    label = s === 'disconnected' ? 'Disconnected' : s === 'disabled' ? 'Disabled' : 'Inactive'; 
    bgClass = "bg-stone-100 text-stone-600 border-stone-200";
    dotClass = "bg-stone-400";
  } else if (['archived', 'deleted', 'voided'].includes(s)) { 
    label = s === 'voided' ? 'Voided' : 'Archived'; 
    bgClass = "bg-stone-100 text-stone-600 border-stone-200";
    dotClass = "bg-stone-400";
  } else if (['expired', 'past_due', 'overdue', 'failed'].includes(s)) { 
    label = s === 'failed' ? 'Failed' : s === 'overdue' ? 'Overdue' : 'Expired'; 
    bgClass = "bg-rose-50 text-rose-700 border-rose-200";
    dotClass = "bg-rose-500";
  } else if (['pending', 'invited', 'draft', 'payment_due', 'posted'].includes(s)) { 
    label = s === 'invited' ? 'Invited' : s === 'draft' ? 'Draft' : s === 'payment_due' ? 'Payment Due' : s === 'posted' ? 'Posted' : 'Pending'; 
    bgClass = "bg-blue-50 text-blue-700 border-blue-200";
    dotClass = "bg-blue-500";
  }
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${bgClass} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
      {label}
    </span>
  );
}
