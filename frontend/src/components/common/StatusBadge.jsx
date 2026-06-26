import React from 'react';

// Compact status dot: "● Active" pattern
// status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED' | 'EXPIRED' | 'active' | etc.
export default function StatusDot({ status }) {
  const s = (status || '').toLowerCase();

  let label = status;
  let color = '#A8A49F'; // neutral gray

  if (['active', 'live', 'connected', 'enabled', 'success', 'paid'].includes(s)) {
    label = s === 'connected' ? 'Connected' : s === 'enabled' ? 'Enabled' : s === 'success' ? 'Success' : s === 'paid' ? 'Paid' : 'Active';
    color = '#1A7F4E';
  } else if (['inactive', 'disconnected', 'disabled'].includes(s)) {
    label = s === 'disconnected' ? 'Disconnected' : s === 'disabled' ? 'Disabled' : 'Inactive';
    color = '#A8A49F';
  } else if (['archived', 'deleted', 'voided'].includes(s)) {
    label = s === 'voided' ? 'Voided' : 'Archived';
    color = '#A8A49F';
  } else if (['expired', 'past_due', 'overdue', 'failed'].includes(s)) {
    label = s === 'failed' ? 'Failed' : s === 'overdue' ? 'Overdue' : 'Expired';
    color = '#B45309';
  } else if (['pending', 'invited', 'draft', 'payment_due', 'posted'].includes(s)) {
    label = s === 'invited' ? 'Invited' : s === 'draft' ? 'Draft' : s === 'payment_due' ? 'Payment Due' : s === 'posted' ? 'Posted' : 'Pending';
    color = '#2D5BFF';
  }

  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-medium tabular-nums"
      style={{ color }}
    >
      <span style={{ fontSize: 8, lineHeight: 1 }}>●</span>
      {label}
    </span>
  );
}
