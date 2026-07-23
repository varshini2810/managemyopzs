import React, { useState } from "react";
import {
  CreditCard,
  Eye,
  EyeOff,
  SlidersHorizontal,
  ArrowDownRight,
  CircleDollarSign,
  Calendar,
} from "lucide-react";
import MonoId from "../../components/common/MonoId";
export default function PaymentStatementWidget({ fullPage = false }) {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const paymentsData = [
    {
      invoiceId: "INV-TEN-2026-000001",
      customerId: "CUST-100001",
      amount: 34.22,
      status: "Paid",
      date: "2026-06-19",
    },
    {
      invoiceId: "INV-TEN-2026-000002",
      customerId: "CUST-100002",
      amount: 2928.0,
      status: "Sent",
      date: "2026-06-15",
    },
    {
      invoiceId: "INV-TEN-2026-000003",
      customerId: "CUST-100003",
      amount: 12500.0,
      status: "Overdue",
      date: "2026-06-01",
    },
    {
      invoiceId: "INV-TEN-2026-000004",
      customerId: "CUST-100001",
      amount: 1500.0,
      status: "Paid",
      date: "2026-06-12",
    },
    {
      invoiceId: "INV-TEN-2026-000005",
      customerId: "CUST-100004",
      amount: 890.0,
      status: "Sent",
      date: "2026-06-18",
    },
    {
      invoiceId: "INV-TEN-2026-000006",
      customerId: "CUST-100002",
      amount: 450.0,
      status: "Overdue",
      date: "2026-05-25",
    },
  ]; // Filter records const filteredPayments = paymentsData.filter(pay => { if (selectedStatus === 'ALL') return true; return pay.status.toUpperCase() === selectedStatus; }); const getStatusColor = (status) => { const s = status.toUpperCase(); if (s === 'PAID') return { color: '#1A7F4E', bg: '#EAFDF3' }; if (s === 'SENT') return { color: '#2D5BFF', bg: '#EEF2FF' }; if (s === 'OVERDUE') return { color: '#B45309', bg: '#FFFBEB' }; return { color: '#6B6863', bg: '#F5F5F4' }; }; const fmtCurrency = (v) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v || 0); return ( <div className={`bg-surface rounded-input overflow-hidden transition-all duration-200 ${fullPage ? '' : 'mb-6'}`} style={{ border: fullPage ? 'none' : '1px solid #E7E5E2' }} > {/* Header bar — only shown in widget (non-fullPage) mode */} {!fullPage && ( <div className="flex items-center justify-between px-5 py-3.5 bg-bg-main/50" style={{ borderBottom: '1px solid #E7E5E2' }} > <div className="flex items-center gap-2"> <CircleDollarSign size={16} className="text-primary" /> <span className="text-sm font-semibold text-ink">Payment and Statement</span> <span className="text-3xs bg-primary/10 text-primary font-bold px-1.5 py-0.5 rounded-input tracking-wide uppercase"> Quick Audit </span> </div> <button onClick={() => setIsOpen(!isOpen)} className="text-xs text-muted hover:text-ink transition-colors flex items-center gap-1 font-medium" > {isOpen ? ( <> <EyeOff size={13} /> Collapse section </> ) : ( <> <Eye size={13} /> Expand section </> )} </button> </div> )} {/* Full-page header — only shown when used as a tab */} {fullPage && ( <div className="mb-6"> <div className="flex items-center gap-3 mb-1"> <CircleDollarSign size={22} className="text-primary" /> <h2 className="text-lg font-bold text-ink">Payment &amp; Statement</h2> </div> <p className="text-sm text-muted">Track all payment transactions, statuses, and audit your billing history.</p> </div> )} {/* Expanded Content */} {(fullPage || isOpen) && ( <div className="p-5 space-y-4 animate-slideDown"> {/* Filters Row */} <div className="flex items-center justify-between border-b border-border/60 pb-3"> <div className="flex items-center gap-1.5 text-xs text-muted"> <SlidersHorizontal size={12} /> <span>Filter payments:</span> </div> <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="input text-xs font-semibold" style={{ height: 28, width: 140, padding: '2px 8px' }} > <option value="ALL">All Statuses</option> <option value="SENT">Sent</option> <option value="PAID">Paid</option> <option value="OVERDUE">Overdue</option> </select> </div> {/* List layout */} <div className={`grid grid-cols-1 md:grid-cols-2 gap-3`} style={fullPage ? {} : { maxHeight: '220px', overflowY: 'auto' }} > {filteredPayments.length === 0 ? ( <div className="col-span-2 text-center text-xs text-muted py-6"> No matching payments found for this status. </div> ) : ( filteredPayments.map((pay, i) => { const styles = getStatusColor(pay.status); return ( <div key={i} className="flex justify-between items-center p-3 rounded-input bg-white hover:bg-bg-main/50 transition-colors" style={{ border: '1px solid #E7E5E2' }} > <div className="space-y-1"> <div className="flex items-center gap-2"> <span className="text-2xs text-muted font-medium">Invoice:</span> <MonoId id={pay.invoiceId} /> </div> <div className="flex items-center gap-2"> <span className="text-2xs text-muted font-medium">Customer:</span> <MonoId id={pay.customerId} /> </div> <div className="text-[10px] text-muted font-medium flex items-center gap-1"> <Calendar size={10} /> {pay.date} </div> </div> <div className="text-right space-y-1.5"> <span className="text-2xs font-bold px-2 py-0.5 rounded-input inline-block" style={{ color: styles.color, backgroundColor: styles.bg, border: `1px solid ${styles.color}20` }} > {pay.status} </span> <div className="text-sm font-bold text-ink tabular-nums block"> {fmtCurrency(pay.amount)} </div> </div> </div> ); }) )} </div> </div> )} </div> );
}
