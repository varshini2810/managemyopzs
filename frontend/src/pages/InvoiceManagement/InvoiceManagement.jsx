import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Plus, Search, X, ChevronLeft, ChevronRight, MoreVertical, Eye, Edit2, Send,
  Download, Copy, CreditCard, Trash2, FileText, CheckCircle, Clock, AlertTriangle,
  DollarSign, ChevronUp, ChevronDown, XCircle, Filter, RefreshCw, Printer,
  Mail, RotateCcw, TrendingUp, TrendingDown, BarChart2, Activity, Layers,
  SlidersHorizontal, Settings2, FileDown, FileUp, Star, Ban, Columns,
  ChevronRight as Chevron, Hash, User, Building2, Phone, Calendar, Tag, Percent,
  ArrowUpDown, Check, Minus
} from 'lucide-react';
import toast from 'react-hot-toast';

/* ══════════════════════════════════════════════════════════════════
   HELPERS & CONSTANTS
══════════════════════════════════════════════════════════════════ */
const fmt = (v, cur = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: cur, maximumFractionDigits: 2 }).format(v || 0);
const fmtNum = (v) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(v || 0);
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
const today = () => new Date().toISOString().slice(0, 10);
const addDays = (d, n) => { const dt = new Date(d); dt.setDate(dt.getDate() + n); return dt.toISOString().slice(0, 10); };
const uid = () => 'INV-' + String(Math.floor(Math.random() * 90000) + 10000);

const STATUSES = ['paid', 'pending', 'overdue', 'draft', 'cancelled', 'void'];
const PAYMENT_METHODS = ['Credit Card', 'Bank Transfer', 'Wire', 'PayPal', 'Cash', 'Cheque', 'Crypto'];
const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD', 'SGD'];

const STATUS_CFG = {
  paid:      { label: 'Paid',      bg: '#DCFCE7', color: '#15803D', dot: '#16A34A' },
  pending:   { label: 'Pending',   bg: '#FEF9C3', color: '#A16207', dot: '#CA8A04' },
  overdue:   { label: 'Overdue',   bg: '#FEE2E2', color: '#B91C1C', dot: '#DC2626' },
  draft:     { label: 'Draft',     bg: '#F3F4F6', color: '#374151', dot: '#6B7280' },
  cancelled: { label: 'Cancelled', bg: '#F1F5F9', color: '#475569', dot: '#94A3B8' },
  void:      { label: 'Void',      bg: '#FDF4FF', color: '#7E22CE', dot: '#9333EA' },
};

/* ══════════════════════════════════════════════════════════════════
   RICH SEED DATA  (20 records)
══════════════════════════════════════════════════════════════════ */
const mkItem = (desc, qty, price, tax = 18, disc = 0) => ({ desc, qty, price, tax, disc });
const SEED_INVOICES = [
  { id:'INV-10001', client:'Acme Corp',           company:'Acme Corporation',      email:'billing@acme.com',    phone:'+1-555-0101', issueDate:'2024-05-01', dueDate:'2024-05-31', status:'paid',      currency:'USD', payMethod:'Credit Card',   paidAmt:12400, subtotal:12400, tax:0,    disc:0,    shipping:0,  total:12400,  createdBy:'Alice Johnson', notes:'Monthly retainer Q2',    items:[mkItem('Strategy Consulting',40,310)] },
  { id:'INV-10002', client:'Globex Solutions',    company:'Globex Inc.',            email:'ap@globex.io',        phone:'+1-555-0102', issueDate:'2024-05-10', dueDate:'2024-06-10', status:'pending',   currency:'USD', payMethod:'Bank Transfer', paidAmt:0,     subtotal:5800,  tax:0,    disc:0,    shipping:0,  total:5800,   createdBy:'Bob Martinez',  notes:'',                       items:[mkItem('API Integration',20,290)] },
  { id:'INV-10003', client:'Initech LLC',         company:'Initech Technologies',  email:'finance@initech.com', phone:'+1-555-0103', issueDate:'2024-04-15', dueDate:'2024-05-15', status:'overdue',   currency:'USD', payMethod:'—',             paidAmt:0,     subtotal:3200,  tax:576,  disc:0,    shipping:0,  total:3776,   createdBy:'Alice Johnson', notes:'',                       items:[mkItem('Support Hours',10,320,18)] },
  { id:'INV-10004', client:'Umbrella Inc',        company:'Umbrella Incorporated', email:'billing@umbrella.co', phone:'+1-555-0104', issueDate:'2024-05-20', dueDate:'2024-06-20', status:'draft',     currency:'USD', payMethod:'—',             paidAmt:0,     subtotal:8900,  tax:0,    disc:500,  shipping:0,  total:8400,   createdBy:'Carol White',   notes:'Q2 Services package',    items:[mkItem('Development',40,222.5)] },
  { id:'INV-10005', client:'Massive Dynamic',     company:'Massive Dynamic Ltd.',  email:'ap@massivedyn.com',   phone:'+1-555-0105', issueDate:'2024-05-18', dueDate:'2024-06-18', status:'paid',      currency:'USD', payMethod:'Wire',          paidAmt:22750, subtotal:22750, tax:0,    disc:0,    shipping:0,  total:22750,  createdBy:'Bob Martinez',  notes:'Enterprise deal',         items:[mkItem('Enterprise License',1,22750)] },
  { id:'INV-10006', client:'Vandelay Industries', company:'Vandelay Ind.',         email:'v@vind.com',          phone:'+1-555-0106', issueDate:'2024-03-01', dueDate:'2024-04-01', status:'overdue',   currency:'USD', payMethod:'—',             paidAmt:0,     subtotal:1100,  tax:198,  disc:0,    shipping:50, total:1348,   createdBy:'Alice Johnson', notes:'',                       items:[mkItem('Design Sprint',4,275,18)] },
  { id:'INV-10007', client:'Dunder Mifflin',      company:'Dunder Mifflin Paper',  email:'michael@dm.com',      phone:'+1-555-0107', issueDate:'2024-05-25', dueDate:'2024-06-25', status:'pending',   currency:'USD', payMethod:'PayPal',        paidAmt:0,     subtotal:4500,  tax:0,    disc:0,    shipping:0,  total:4500,   createdBy:'Carol White',   notes:'',                       items:[mkItem('Paper Supply SaaS',12,375)] },
  { id:'INV-10008', client:'Pied Piper',          company:'Pied Piper LLC',        email:'richard@pp.com',      phone:'+1-555-0108', issueDate:'2024-05-22', dueDate:'2024-06-22', status:'paid',      currency:'USD', payMethod:'Credit Card',   paidAmt:16000, subtotal:16000, tax:0,    disc:0,    shipping:0,  total:16000,  createdBy:'Bob Martinez',  notes:'Compression platform',   items:[mkItem('Platform Subscription',1,16000)] },
  { id:'INV-10009', client:'Hooli Inc',           company:'Hooli Technologies',    email:'accounts@hooli.com',  phone:'+1-555-0109', issueDate:'2024-05-05', dueDate:'2024-05-20', status:'cancelled', currency:'USD', payMethod:'—',             paidAmt:0,     subtotal:9250,  tax:0,    disc:0,    shipping:0,  total:9250,   createdBy:'Alice Johnson', notes:'Client requested cancel', items:[mkItem('Analytics Module',5,1850)] },
  { id:'INV-10010', client:'Stark Industries',    company:'Stark Ind. Corp.',      email:'pepper@stark.io',     phone:'+1-555-0110', issueDate:'2024-05-28', dueDate:'2024-06-28', status:'pending',   currency:'USD', payMethod:'—',             paidAmt:0,     subtotal:34800, tax:6264, disc:1000, shipping:0,  total:40064,  createdBy:'Carol White',   notes:'Iron Man Phase 2',        items:[mkItem('R&D Services',120,290,18)] },
  { id:'INV-10011', client:'Wayne Enterprises',   company:'Wayne Ent.',            email:'lucius@wayne.com',    phone:'+1-555-0111', issueDate:'2024-04-01', dueDate:'2024-05-01', status:'overdue',   currency:'USD', payMethod:'—',             paidAmt:0,     subtotal:7600,  tax:0,    disc:0,    shipping:0,  total:7600,   createdBy:'Bob Martinez',  notes:'',                       items:[mkItem('Security Audit',8,950)] },
  { id:'INV-10012', client:'Oscorp',              company:'Oscorp Industries',     email:'norman@oscorp.io',    phone:'+1-555-0112', issueDate:'2024-05-15', dueDate:'2024-06-15', status:'paid',      currency:'USD', payMethod:'Bank Transfer', paidAmt:2980,  subtotal:2980,  tax:0,    disc:0,    shipping:0,  total:2980,   createdBy:'Alice Johnson', notes:'',                       items:[mkItem('Lab SaaS',4,745)] },
  { id:'INV-10013', client:'Cyberdyne Systems',   company:'Cyberdyne Sys.',        email:'miles@cyber.io',      phone:'+1-555-0113', issueDate:'2024-06-01', dueDate:'2024-06-30', status:'draft',     currency:'EUR', payMethod:'—',             paidAmt:0,     subtotal:18000, tax:3240, disc:500,  shipping:200,total:20940,  createdBy:'Carol White',   notes:'AI research project',    items:[mkItem('AI Consulting',60,300,18),mkItem('GPU Cluster',1,0)] },
  { id:'INV-10014', client:'Aperture Science',    company:'Aperture Science Inc.', email:'glados@aperture.com', phone:'+1-555-0114', issueDate:'2024-05-30', dueDate:'2024-06-29', status:'pending',   currency:'USD', payMethod:'Wire',          paidAmt:5000,  subtotal:15000, tax:2700, disc:0,    shipping:0,  total:17700,  createdBy:'Bob Martinez',  notes:'Portal tech license',     items:[mkItem('Portal Technology',3,5000,18)] },
  { id:'INV-10015', client:'Rekall Corporation',  company:'Rekall Corp.',          email:'quaid@rekall.com',    phone:'+1-555-0115', issueDate:'2024-04-20', dueDate:'2024-05-20', status:'void',      currency:'USD', payMethod:'—',             paidAmt:0,     subtotal:4200,  tax:0,    disc:0,    shipping:0,  total:4200,   createdBy:'Alice Johnson', notes:'Voided – duplicate',      items:[mkItem('Memory Implants',7,600)] },
  { id:'INV-10016', client:'Weyland Corp',        company:'Weyland Industries',    email:'vickers@weyland.co',  phone:'+1-555-0116', issueDate:'2024-06-05', dueDate:'2024-07-05', status:'pending',   currency:'GBP', payMethod:'Bank Transfer', paidAmt:0,     subtotal:28000, tax:5600, disc:2000, shipping:500,total:32100,  createdBy:'Carol White',   notes:'Prometheus project',      items:[mkItem('Deep Space Research',40,700,20),mkItem('Equipment Rental',1,0)] },
  { id:'INV-10017', client:'Tyrell Corporation',  company:'Tyrell Corp.',          email:'eldon@tyrell.corp',   phone:'+1-555-0117', issueDate:'2024-05-12', dueDate:'2024-06-12', status:'paid',      currency:'USD', payMethod:'Crypto',        paidAmt:66000, subtotal:60000, tax:6000, disc:0,    shipping:0,  total:66000,  createdBy:'Bob Martinez',  notes:'Replicant order batch',   items:[mkItem('Nexus-6 Units',6,10000,10)] },
  { id:'INV-10018', client:'OmniCorp',            company:'OmniCorp Global',       email:'ceo@omnicorp.com',    phone:'+1-555-0118', issueDate:'2024-06-10', dueDate:'2024-07-10', status:'draft',     currency:'USD', payMethod:'—',             paidAmt:0,     subtotal:9800,  tax:1764, disc:800,  shipping:0,  total:10764,  createdBy:'Alice Johnson', notes:'RoboCop maintenance',     items:[mkItem('Robotics Service',14,700,18)] },
  { id:'INV-10019', client:'Soylent Corp',        company:'Soylent Corporation',   email:'ap@soylent.green',    phone:'+1-555-0119', issueDate:'2024-03-15', dueDate:'2024-04-15', status:'overdue',   currency:'USD', payMethod:'—',             paidAmt:3000,  subtotal:8500,  tax:0,    disc:0,    shipping:0,  total:8500,   createdBy:'Carol White',   notes:'Partial payment received',items:[mkItem('Food Processing',17,500)] },
  { id:'INV-10020', client:'Initech LLC',         company:'Initech Technologies',  email:'finance@initech.com', phone:'+1-555-0103', issueDate:'2024-06-15', dueDate:'2024-07-15', status:'pending',   currency:'USD', payMethod:'—',             paidAmt:0,     subtotal:6400,  tax:1152, disc:0,    shipping:0,  total:7552,   createdBy:'Bob Martinez',  notes:'Follow-up contract',     items:[mkItem('Extended Support',20,320,18)] },
];

/* ══════════════════════════════════════════════════════════════════
   ANIMATED COUNTER HOOK
══════════════════════════════════════════════════════════════════ */
function useCounter(target, duration = 900) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0, step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(timer); }
      else setVal(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return val;
}

/* ══════════════════════════════════════════════════════════════════
   STATUS BADGE
══════════════════════════════════════════════════════════════════ */
function Badge({ status }) {
  const s = (status || '').toLowerCase();
  const c = STATUS_CFG[s] || { label: status, bg: '#F3F4F6', color: '#374151', dot: '#6B7280' };
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap"
      style={{ background: c.bg, color: c.color }}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: c.dot }} />
      {c.label}
    </span>
  );
}

/* ══════════════════════════════════════════════════════════════════
   STAT CARD WITH ANIMATED COUNTER
══════════════════════════════════════════════════════════════════ */
function StatCard({ title, rawValue, displayValue, icon: Icon, color, bg, trend, suffix = '' }) {
  const counted = useCounter(rawValue);
  const display = displayValue || (counted.toLocaleString() + suffix);
  return (
    <div className="bg-white rounded-2xl p-5 flex flex-col gap-3 transition-all duration-200 cursor-default group"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.04)', border: '1px solid #F1F5F9' }}>
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
          style={{ background: bg }}>
          <Icon size={20} style={{ color }} />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${trend >= 0 ? 'text-green-700 bg-green-50' : 'text-red-600 bg-red-50'}`}>
            {trend >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-900 tabular-nums leading-tight transition-all duration-200 group-hover:text-indigo-600">
          {display}
        </div>
        <div className="text-xs text-gray-500 mt-0.5 font-medium">{title}</div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   COLUMN VISIBILITY MENU
══════════════════════════════════════════════════════════════════ */
const ALL_COLS = [
  { key: 'id',        label: 'Invoice #' },
  { key: 'client',   label: 'Client' },
  { key: 'email',    label: 'Email' },
  { key: 'issueDate',label: 'Invoice Date' },
  { key: 'dueDate',  label: 'Due Date' },
  { key: 'currency', label: 'Currency' },
  { key: 'subtotal', label: 'Subtotal' },
  { key: 'tax',      label: 'Tax' },
  { key: 'disc',     label: 'Discount' },
  { key: 'total',    label: 'Total' },
  { key: 'paidAmt',  label: 'Paid' },
  { key: 'balance',  label: 'Balance' },
  { key: 'status',   label: 'Status' },
  { key: 'payMethod',label: 'Pay Method' },
  { key: 'createdBy',label: 'Created By' },
];

function ColVisMenu({ visible, onToggle, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h);
  }, [onClose]);
  return (
    <div ref={ref} className="absolute right-0 top-full mt-2 bg-white rounded-xl z-50 py-2"
      style={{ minWidth: 200, boxShadow: '0 8px 32px rgba(0,0,0,0.15)', border: '1px solid #E5E7EB' }}>
      <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100 mb-1">
        Toggle Columns
      </div>
      {ALL_COLS.map(col => (
        <button key={col.key} onClick={() => onToggle(col.key)}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
          <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-colors ${visible.has(col.key) ? 'bg-indigo-600' : 'border-2 border-gray-300'}`}>
            {visible.has(col.key) && <Check size={11} color="white" />}
          </div>
          {col.label}
        </button>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   ROW ACTIONS DROPDOWN
══════════════════════════════════════════════════════════════════ */
function ActionMenu({ row, onView, onEdit, onDuplicate, onPrint, onEmail, onRecordPayment, onMarkPaid, onVoid, onDelete }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h);
  }, [open]);

  const groups = [
    [
      { label: 'View Invoice',    icon: Eye,          fn: onView,          color: 'text-gray-700' },
      { label: 'Edit Invoice',    icon: Edit2,        fn: onEdit,          color: 'text-gray-700' },
      { label: 'Duplicate',       icon: Copy,         fn: onDuplicate,     color: 'text-gray-700' },
    ],
    [
      { label: 'Print',           icon: Printer,      fn: onPrint,         color: 'text-gray-700' },
      { label: 'Download PDF',    icon: Download,     fn: () => { toast.success('PDF downloaded'); setOpen(false); }, color: 'text-gray-700' },
      { label: 'Send Email',      icon: Mail,         fn: onEmail,         color: 'text-gray-700' },
    ],
    [
      { label: 'Record Payment',  icon: CreditCard,   fn: onRecordPayment, color: 'text-green-700' },
      { label: 'Mark as Paid',    icon: CheckCircle,  fn: onMarkPaid,      color: 'text-green-700' },
      { label: 'Void Invoice',    icon: Ban,          fn: onVoid,          color: 'text-orange-600' },
    ],
    [
      { label: 'Delete',          icon: Trash2,       fn: onDelete,        color: 'text-red-600' },
    ],
  ];

  return (
    <div className="relative" ref={ref} onClick={e => e.stopPropagation()}>
      <button onClick={() => setOpen(v => !v)}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all">
        <MoreVertical size={16} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white rounded-xl z-50 py-1.5"
          style={{ minWidth: 190, boxShadow: '0 8px 32px rgba(0,0,0,0.15)', border: '1px solid #E5E7EB' }}>
          {groups.map((group, gi) => (
            <React.Fragment key={gi}>
              {gi > 0 && <div className="my-1 border-t border-gray-100" />}
              {group.map(({ label, icon: Ic, fn, color }) => (
                <button key={label} onClick={() => { fn?.(row); setOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${color}`}>
                  <Ic size={14} className="flex-shrink-0" />{label}
                </button>
              ))}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   SORT HEADER
══════════════════════════════════════════════════════════════════ */
function SortTh({ label, field, sort, onSort, className = '' }) {
  const active = sort.field === field;
  return (
    <th onClick={() => onSort(field)}
      className={`px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap cursor-pointer select-none group ${className}`}
      style={{ background: '#F8FAFC' }}>
      <span className="inline-flex items-center gap-1 group-hover:text-indigo-600 transition-colors">
        {label}
        <span className="inline-flex flex-col opacity-60">
          <ChevronUp size={9} style={{ color: active && sort.dir === 'asc' ? '#4F46E5' : '#CBD5E1', display: 'block' }} />
          <ChevronDown size={9} style={{ color: active && sort.dir === 'desc' ? '#4F46E5' : '#CBD5E1', display: 'block', marginTop: -2 }} />
        </span>
      </span>
    </th>
  );
}

/* ══════════════════════════════════════════════════════════════════
   LINE ITEM ROW (inside create/edit modal)
══════════════════════════════════════════════════════════════════ */
function LineItemRow({ item, index, onChange, onRemove, canRemove }) {
  const lineTotal = (Number(item.qty) || 0) * (Number(item.price) || 0);
  const discAmt = lineTotal * ((Number(item.disc) || 0) / 100);
  const taxAmt = (lineTotal - discAmt) * ((Number(item.tax) || 0) / 100);
  const total = lineTotal - discAmt + taxAmt;

  return (
    <tr style={{ borderTop: '1px solid #F1F5F9' }}>
      <td className="px-3 py-2" style={{ minWidth: 180 }}>
        <input className="w-full text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          value={item.desc} onChange={e => onChange(index, 'desc', e.target.value)} placeholder="Item description" />
      </td>
      <td className="px-3 py-2" style={{ width: 70 }}>
        <input type="number" min="1" className="w-full text-sm text-right border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          value={item.qty} onChange={e => onChange(index, 'qty', e.target.value)} />
      </td>
      <td className="px-3 py-2" style={{ width: 100 }}>
        <input type="number" min="0" step="0.01" className="w-full text-sm text-right border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          value={item.price} onChange={e => onChange(index, 'price', e.target.value)} />
      </td>
      <td className="px-3 py-2" style={{ width: 70 }}>
        <input type="number" min="0" max="100" className="w-full text-sm text-right border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          value={item.tax} onChange={e => onChange(index, 'tax', e.target.value)} />
      </td>
      <td className="px-3 py-2" style={{ width: 70 }}>
        <input type="number" min="0" max="100" className="w-full text-sm text-right border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          value={item.disc} onChange={e => onChange(index, 'disc', e.target.value)} />
      </td>
      <td className="px-3 py-2 text-right text-sm font-semibold text-gray-800 tabular-nums whitespace-nowrap">
        {fmt(total)}
      </td>
      <td className="px-3 py-2 text-center">
        {canRemove && (
          <button onClick={() => onRemove(index)} className="w-6 h-6 flex items-center justify-center rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-all mx-auto">
            <X size={13} />
          </button>
        )}
      </td>
    </tr>
  );
}

/* ══════════════════════════════════════════════════════════════════
   CREATE / EDIT MODAL
══════════════════════════════════════════════════════════════════ */
const BLANK_ITEM = { desc: '', qty: 1, price: 0, tax: 0, disc: 0 };

function InvoiceFormModal({ open, initial, onClose, onSave }) {
  const isEdit = !!initial?.id;
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [activeSection, setActiveSection] = useState('client');

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setActiveSection('client');
    setForm({
      id: uid(), client: '', company: '', email: '', phone: '',
      billingAddr: '', shippingAddr: '', gst: '', currency: 'USD',
      paymentTerms: 'Net 30', salesRep: '', issueDate: today(),
      dueDate: addDays(today(), 30), refNum: '', poNum: '', status: 'draft',
      payMethod: '', notes: '', internalNotes: '', terms: 'Payment due within 30 days.',
      shipping: 0, extraCharge: 0, roundOff: 0,
      items: [{ ...BLANK_ITEM }],
      ...initial,
      items: initial?.items?.map(i => ({ ...i })) || [{ ...BLANK_ITEM }],
    });
  }, [open, initial]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setItem = (i, k, v) => {
    const items = [...form.items];
    items[i] = { ...items[i], [k]: v };
    setForm(f => ({ ...f, items }));
  };
  const addItem = () => setForm(f => ({ ...f, items: [...f.items, { ...BLANK_ITEM }] }));
  const removeItem = i => setForm(f => ({ ...f, items: f.items.filter((_, idx) => idx !== i) }));

  const totals = useMemo(() => {
    const subtotal = (form.items || []).reduce((s, it) => {
      const line = (Number(it.qty) || 0) * (Number(it.price) || 0);
      const disc = line * ((Number(it.disc) || 0) / 100);
      const tax = (line - disc) * ((Number(it.tax) || 0) / 100);
      return s + line - disc + tax;
    }, 0);
    const shipping = Number(form.shipping) || 0;
    const extra = Number(form.extraCharge) || 0;
    const roundOff = Number(form.roundOff) || 0;
    const grandTotal = subtotal + shipping + extra + roundOff;
    return { subtotal, shipping, extra, roundOff, grandTotal };
  }, [form.items, form.shipping, form.extraCharge, form.roundOff]);

  const validate = () => {
    const e = {};
    if (!form.client?.trim()) e.client = 'Client name is required';
    if (!form.email?.trim()) e.email = 'Email is required';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
    if (!form.issueDate) e.issueDate = 'Required';
    if (!form.dueDate) e.dueDate = 'Required';
    (form.items || []).forEach((it, i) => { if (!it.desc?.trim()) e['item_' + i] = 'Required'; });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = (asDraft) => {
    if (!validate()) { toast.error('Please fix validation errors'); return; }
    onSave({
      ...form, subtotal: totals.subtotal, total: totals.grandTotal,
      tax: (form.items || []).reduce((s, it) => { const l = (Number(it.qty)||0)*(Number(it.price)||0); const d = l*((Number(it.disc)||0)/100); return s + (l-d)*((Number(it.tax)||0)/100); }, 0),
      disc: (form.items || []).reduce((s, it) => { const l = (Number(it.qty)||0)*(Number(it.price)||0); return s + l*((Number(it.disc)||0)/100); }, 0),
      status: asDraft ? 'draft' : (initial?.status || 'pending'),
      paidAmt: initial?.paidAmt || 0,
    }, asDraft ? 'draft' : 'save');
  };

  if (!open) return null;

  const sections = [
    { id: 'client', label: 'Client Info' },
    { id: 'invoice', label: 'Invoice Info' },
    { id: 'items', label: 'Line Items' },
    { id: 'notes', label: 'Notes & Terms' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(15,20,40,0.55)' }}>
      <div className="bg-white rounded-2xl flex flex-col" style={{ width: '100%', maxWidth: 860, maxHeight: '95vh', boxShadow: '0 32px 80px rgba(0,0,0,0.25)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{isEdit ? 'Edit Invoice' : 'Create Invoice'}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{isEdit ? ('Editing ' + initial?.id) : 'Fill in the details to create a new invoice'}</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all">
            <X size={18} />
          </button>
        </div>

        {/* Section Tabs */}
        <div className="flex border-b border-gray-100 px-7 gap-1">
          {sections.map(s => (
            <button key={s.id} onClick={() => setActiveSection(s.id)}
              className={`px-4 py-3 text-sm font-medium transition-all border-b-2 ${activeSection === s.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
              {s.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-7 py-6">
          {/* Client Info */}
          {activeSection === 'client' && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Client Name *</label>
                  <input className={'w-full text-sm border rounded-xl px-3.5 py-2.5 focus:outline-none transition-all ' + (errors.client ? 'border-red-400 focus:ring-2 focus:ring-red-100' : 'border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100')}
                    value={form.client || ''} onChange={e => set('client', e.target.value)} placeholder="Full name" />
                  {errors.client && <p className="text-xs text-red-500 mt-1">{errors.client}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Company</label>
                  <input className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                    value={form.company || ''} onChange={e => set('company', e.target.value)} placeholder="Company name" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email *</label>
                  <input type="email" className={'w-full text-sm border rounded-xl px-3.5 py-2.5 focus:outline-none transition-all ' + (errors.email ? 'border-red-400 focus:ring-2 focus:ring-red-100' : 'border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100')}
                    value={form.email || ''} onChange={e => set('email', e.target.value)} placeholder="email@company.com" />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Phone</label>
                  <input className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                    value={form.phone || ''} onChange={e => set('phone', e.target.value)} placeholder="+1-555-0000" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Billing Address</label>
                  <textarea rows={3} className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 resize-none"
                    value={form.billingAddr || ''} onChange={e => set('billingAddr', e.target.value)} placeholder="Street, City, State, ZIP" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Shipping Address</label>
                  <textarea rows={3} className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 resize-none"
                    value={form.shippingAddr || ''} onChange={e => set('shippingAddr', e.target.value)} placeholder="Same as billing" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">GST / VAT Number</label>
                  <input className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                    value={form.gst || ''} onChange={e => set('gst', e.target.value)} placeholder="GST123456" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Payment Terms</label>
                  <select className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 bg-white"
                    value={form.paymentTerms || 'Net 30'} onChange={e => set('paymentTerms', e.target.value)}>
                    {['Net 7','Net 15','Net 30','Net 45','Net 60','Due on Receipt'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Sales Representative</label>
                  <input className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                    value={form.salesRep || ''} onChange={e => set('salesRep', e.target.value)} placeholder="Rep name" />
                </div>
              </div>
            </div>
          )}

          {/* Invoice Info */}
          {activeSection === 'invoice' && (
            <div className="space-y-5">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Invoice Number</label>
                  <input className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 font-mono"
                    value={form.id || ''} onChange={e => set('id', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Invoice Date *</label>
                  <input type="date" className={'w-full text-sm border rounded-xl px-3.5 py-2.5 focus:outline-none transition-all ' + (errors.issueDate ? 'border-red-400' : 'border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100')}
                    value={form.issueDate || ''} onChange={e => set('issueDate', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Due Date *</label>
                  <input type="date" className={'w-full text-sm border rounded-xl px-3.5 py-2.5 focus:outline-none transition-all ' + (errors.dueDate ? 'border-red-400' : 'border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100')}
                    value={form.dueDate || ''} onChange={e => set('dueDate', e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Currency</label>
                  <select className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-400 bg-white"
                    value={form.currency || 'USD'} onChange={e => set('currency', e.target.value)}>
                    {CURRENCIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Reference Number</label>
                  <input className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                    value={form.refNum || ''} onChange={e => set('refNum', e.target.value)} placeholder="REF-001" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">PO Number</label>
                  <input className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                    value={form.poNum || ''} onChange={e => set('poNum', e.target.value)} placeholder="PO-2024-001" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Shipping Charge</label>
                  <input type="number" min="0" className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                    value={form.shipping || 0} onChange={e => set('shipping', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Additional Charges</label>
                  <input type="number" min="0" className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                    value={form.extraCharge || 0} onChange={e => set('extraCharge', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Round Off</label>
                  <input type="number" step="0.01" className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                    value={form.roundOff || 0} onChange={e => set('roundOff', e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* Line Items */}
          {activeSection === 'items' && (
            <div className="space-y-4">
              <div className="rounded-xl overflow-hidden border border-gray-100">
                <table className="w-full">
                  <thead>
                    <tr style={{ background: '#F8FAFC' }}>
                      {['Description', 'Qty', 'Unit Price', 'Tax %', 'Disc %', 'Line Total', ''].map(h => (
                        <th key={h} className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(form.items || []).map((item, i) => (
                      <LineItemRow key={i} item={item} index={i}
                        onChange={setItem} onRemove={removeItem}
                        canRemove={(form.items || []).length > 1} />
                    ))}
                  </tbody>
                </table>
              </div>
              <button onClick={addItem}
                className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors px-1">
                <Plus size={16} />Add Line Item
              </button>

              {/* Totals Summary */}
              <div className="flex justify-end mt-4">
                <div className="w-72 space-y-2 text-sm">
                  {[
                    ['Subtotal', fmt(totals.subtotal, form.currency)],
                    ['Shipping', fmt(totals.shipping, form.currency)],
                    ['Additional', fmt(totals.extra, form.currency)],
                    ['Round Off', fmt(totals.roundOff, form.currency)],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between text-gray-500">
                      <span>{k}</span><span className="tabular-nums font-medium text-gray-700">{v}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-200">
                    <span>Grand Total</span>
                    <span className="tabular-nums text-indigo-700">{fmt(totals.grandTotal, form.currency)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notes & Terms */}
          {activeSection === 'notes' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Customer Notes</label>
                <textarea rows={3} className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 resize-none"
                  value={form.notes || ''} onChange={e => set('notes', e.target.value)} placeholder="Notes visible to the customer…" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Internal Notes</label>
                <textarea rows={3} className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 resize-none"
                  value={form.internalNotes || ''} onChange={e => set('internalNotes', e.target.value)} placeholder="Internal team notes (not visible to client)…" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Terms & Conditions</label>
                <textarea rows={4} className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 resize-none"
                  value={form.terms || ''} onChange={e => set('terms', e.target.value)} placeholder="Payment terms, late fees, etc." />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-7 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            Cancel
          </button>
          <div className="flex items-center gap-3">
            <button onClick={() => handleSave(true)}
              className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2"
              style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.06)' }}>
              <FileText size={15} />Save Draft
            </button>
            <button onClick={() => handleSave(false)}
              className="px-6 py-2.5 text-sm font-semibold text-white rounded-xl flex items-center gap-2 transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)', boxShadow: '0 4px 14px rgba(79,70,229,0.35)' }}>
              <Send size={15} />{isEdit ? 'Save Changes' : 'Create Invoice'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   VIEW INVOICE MODAL
══════════════════════════════════════════════════════════════════ */
function ViewModal({ open, invoice: inv, onClose, onEdit, onRecordPayment }) {
  if (!open || !inv) return null;
  const balance = (inv.total || 0) - (inv.paidAmt || 0);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(15,20,40,0.55)' }}>
      <div className="bg-white rounded-2xl flex flex-col" style={{ width: '100%', maxWidth: 680, maxHeight: '90vh', boxShadow: '0 32px 80px rgba(0,0,0,0.25)' }}>
        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
              <FileText size={20} className="text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 font-mono">{inv.id}</h2>
              <Badge status={inv.status} />
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 transition-all"><X size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-7 py-6 space-y-6">
          {/* Client & Invoice Info */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Client Information</p>
              {[['Client', inv.client],['Company', inv.company||'—'],['Email', inv.email||'—'],['Phone', inv.phone||'—']].map(([k,v]) => (
                <div key={k}><p className="text-xs text-gray-400">{k}</p><p className="text-sm font-semibold text-gray-800">{v}</p></div>
              ))}
            </div>
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Invoice Details</p>
              {[['Invoice Date', fmtDate(inv.issueDate)],['Due Date', fmtDate(inv.dueDate)],['Currency', inv.currency||'USD'],['Payment Method', inv.payMethod||'—']].map(([k,v]) => (
                <div key={k}><p className="text-xs text-gray-400">{k}</p><p className="text-sm font-semibold text-gray-800">{v}</p></div>
              ))}
            </div>
          </div>

          {/* Items */}
          {inv.items?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Line Items</p>
              <div className="rounded-xl overflow-hidden border border-gray-100">
                <table className="w-full text-sm">
                  <thead style={{ background: '#F8FAFC' }}>
                    <tr>{['Description','Qty','Price','Tax','Disc','Total'].map(h => (
                      <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody>
                    {inv.items.map((it, i) => {
                      const line = (it.qty||0)*(it.price||0);
                      const discAmt = line*((it.disc||0)/100);
                      const taxAmt = (line-discAmt)*((it.tax||0)/100);
                      return (
                        <tr key={i} style={{ borderTop: '1px solid #F1F5F9' }}>
                          <td className="px-4 py-2.5">{it.desc}</td>
                          <td className="px-4 py-2.5 tabular-nums">{it.qty}</td>
                          <td className="px-4 py-2.5 tabular-nums">{fmt(it.price)}</td>
                          <td className="px-4 py-2.5 tabular-nums">{it.tax||0}%</td>
                          <td className="px-4 py-2.5 tabular-nums">{it.disc||0}%</td>
                          <td className="px-4 py-2.5 tabular-nums font-semibold">{fmt(line-discAmt+taxAmt)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2 text-sm">
              {[['Subtotal', fmt(inv.subtotal||0, inv.currency)],['Tax', fmt(inv.tax||0, inv.currency)],['Discount', '-' + fmt(inv.disc||0, inv.currency)],
                ['Shipping', fmt(inv.shipping||0, inv.currency)]].map(([k,v]) => (
                <div key={k} className="flex justify-between text-gray-500"><span>{k}</span><span className="tabular-nums text-gray-700">{v}</span></div>
              ))}
              <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-200 text-base">
                <span>Total</span><span className="tabular-nums text-indigo-700">{fmt(inv.total||0, inv.currency)}</span>
              </div>
              <div className="flex justify-between text-green-600 font-medium"><span>Paid</span><span className="tabular-nums">{fmt(inv.paidAmt||0, inv.currency)}</span></div>
              <div className="flex justify-between font-bold text-red-600 text-base border-t border-gray-200 pt-2">
                <span>Balance Due</span><span className="tabular-nums">{fmt(Math.max(0, balance), inv.currency)}</span>
              </div>
            </div>
          </div>

          {inv.notes && <div><p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Notes</p><p className="text-sm text-gray-700">{inv.notes}</p></div>}
          {inv.terms && <div><p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Terms & Conditions</p><p className="text-sm text-gray-500">{inv.terms}</p></div>}
        </div>
        <div className="flex items-center justify-between px-7 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <div className="flex gap-2">
            <button onClick={() => { toast.success('PDF downloaded'); onClose(); }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
              <Download size={14} />PDF
            </button>
            <button onClick={() => { toast.success('Sent to ' + inv.email); onClose(); }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
              <Mail size={14} />Email
            </button>
          </div>
          <div className="flex gap-2">
            {balance > 0 && (
              <button onClick={() => { onClose(); onRecordPayment(); }}
                className="px-4 py-2 text-sm font-semibold text-white rounded-xl flex items-center gap-2 transition-all"
                style={{ background: '#16A34A' }}>
                <CreditCard size={14} />Record Payment
              </button>
            )}
            <button onClick={() => { onClose(); onEdit(); }}
              className="px-5 py-2 text-sm font-semibold text-white rounded-xl flex items-center gap-2"
              style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)' }}>
              <Edit2 size={14} />Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   RECORD PAYMENT MODAL
══════════════════════════════════════════════════════════════════ */
function PaymentModal({ open, invoice: inv, onClose, onConfirm }) {
  const [method, setMethod] = useState('Bank Transfer');
  const [date, setDate] = useState(today());
  const [amount, setAmount] = useState('');
  const [txRef, setTxRef] = useState('');
  const balance = inv ? Math.max(0, (inv.total || 0) - (inv.paidAmt || 0)) : 0;

  useEffect(() => { if (open && inv) setAmount(String(balance)); }, [open, inv]);

  if (!open || !inv) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(15,20,40,0.55)' }}>
      <div className="bg-white rounded-2xl" style={{ width: '100%', maxWidth: 440, boxShadow: '0 32px 80px rgba(0,0,0,0.25)' }}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Record Payment</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 transition-all"><X size={16} /></button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="rounded-xl p-4" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Invoice</span><span className="font-mono font-semibold">{inv.id}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-500">Client</span><span className="font-semibold">{inv.client}</span>
            </div>
            <div className="flex justify-between text-base mt-2 pt-2 border-t border-green-100">
              <span className="font-semibold text-gray-700">Balance Due</span>
              <span className="font-bold text-green-700 tabular-nums">{fmt(balance, inv.currency)}</span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Payment Amount</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">$</span>
              <input type="number" min="0" max={balance} step="0.01"
                className="w-full text-sm border border-gray-200 rounded-xl pl-8 pr-3.5 py-2.5 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                value={amount} onChange={e => setAmount(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Payment Method</label>
            <select className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-400 bg-white"
              value={method} onChange={e => setMethod(e.target.value)}>
              {PAYMENT_METHODS.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Payment Date</label>
            <input type="date" className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              value={date} onChange={e => setDate(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Transaction Reference</label>
            <input className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              value={txRef} onChange={e => setTxRef(e.target.value)} placeholder="TXN-12345" />
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900">Cancel</button>
          <button onClick={() => onConfirm({ method, date, amount: Number(amount), ref: txRef })}
            className="px-6 py-2.5 text-sm font-semibold text-white rounded-xl flex items-center gap-2 hover:opacity-90 transition-all"
            style={{ background: '#16A34A', boxShadow: '0 4px 14px rgba(22,163,74,0.3)' }}>
            <CheckCircle size={15} />Confirm Payment
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   DELETE MODAL
══════════════════════════════════════════════════════════════════ */
function DeleteModal({ open, invoice: inv, onClose, onConfirm }) {
  const [confirm, setConfirm] = useState('');
  if (!open || !inv) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(15,20,40,0.55)' }}>
      <div className="bg-white rounded-2xl" style={{ width: '100%', maxWidth: 420, boxShadow: '0 32px 80px rgba(0,0,0,0.25)' }}>
        <div className="px-6 py-7 text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: '#FEF2F2' }}>
            <Trash2 size={26} className="text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Delete Invoice?</h2>
          <p className="text-sm text-gray-500 mb-4">
            This will permanently delete <strong className="text-gray-800">{inv.id}</strong> for <strong className="text-gray-800">{inv.client}</strong>. This action cannot be undone.
          </p>
          <div className="text-left">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Type <span className="font-mono text-red-500">{inv.id}</span> to confirm
            </label>
            <input className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 font-mono"
              value={confirm} onChange={e => setConfirm(e.target.value)} placeholder={inv.id} />
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900">Cancel</button>
          <button disabled={confirm !== inv.id} onClick={onConfirm}
            className="px-6 py-2.5 text-sm font-semibold text-white rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: '#DC2626', boxShadow: confirm === inv.id ? '0 4px 14px rgba(220,38,38,0.3)' : 'none' }}>
            Delete Invoice
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   EXPORT HELPER
══════════════════════════════════════════════════════════════════ */
function exportCSV(data) {
  const headers = ['Invoice #', 'Client', 'Company', 'Email', 'Issue Date', 'Due Date', 'Currency', 'Subtotal', 'Tax', 'Discount', 'Total', 'Paid', 'Balance', 'Status', 'Pay Method', 'Created By'];
  const rows = data.map(r => [r.id, r.client, r.company, r.email, r.issueDate, r.dueDate, r.currency, r.subtotal, r.tax||0, r.disc||0, r.total, r.paidAmt||0, Math.max(0, (r.total||0)-(r.paidAmt||0)), r.status, r.payMethod, r.createdBy]);
  const csv = [headers, ...rows].map(row => row.map(v => '"' + String(v||'').replace(/"/g, '""') + '"').join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'invoices.csv'; a.click();
  URL.revokeObjectURL(url);
}

/* ══════════════════════════════════════════════════════════════════
   SKELETON ROW
══════════════════════════════════════════════════════════════════ */
function SkeletonRows({ count = 8, cols = 10 }) {
  return Array.from({ length: count }).map((_, i) => (
    <tr key={i} className="border-b border-gray-50">
      {Array.from({ length: cols }).map((__, ci) => (
        <td key={ci} className="px-4 py-4">
          <div className="h-3 rounded-full animate-pulse" style={{ width: ci === 0 ? 24 : ci === 1 ? '70%' : '55%', background: '#E5E7EB', animationDelay: `${i * 80}ms` }} />
        </td>
      ))}
    </tr>
  ));
}

/* ══════════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════════ */
const PAGE_SIZE = 10;

export default function InvoiceManagement() {
  const [invoices, setInvoices] = useState(SEED_INVOICES);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [payMethodFilter, setPayMethodFilter] = useState('');
  const [currencyFilter, setCurrencyFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState({ field: 'issueDate', dir: 'desc' });
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(new Set());
  const [visibleCols, setVisibleCols] = useState(new Set(ALL_COLS.map(c => c.key)));
  const [showColMenu, setShowColMenu] = useState(false);

  // Modals
  const [createOpen, setCreateOpen] = useState(false);
  const [editInvoice, setEditInvoice] = useState(null);
  const [viewInvoice, setViewInvoice] = useState(null);
  const [payInvoice, setPayInvoice] = useState(null);
  const [deleteInvoice, setDeleteInvoice] = useState(null);

  // Initial load simulation
  useEffect(() => { const t = setTimeout(() => setLoading(false), 800); return () => clearTimeout(t); }, []);

  // Reset page on filter changes
  useEffect(() => { setPage(0); setSelected(new Set()); }, [search, statusFilter, dateFrom, dateTo, payMethodFilter, currencyFilter]);

  /* ── Filter + Sort ── */
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return invoices.filter(inv =>
      (!q || [inv.id, inv.client, inv.company, inv.email, inv.phone].some(v => (v||'').toLowerCase().includes(q))) &&
      (!statusFilter || inv.status === statusFilter) &&
      (!dateFrom || inv.issueDate >= dateFrom) &&
      (!dateTo || inv.issueDate <= dateTo) &&
      (!payMethodFilter || inv.payMethod === payMethodFilter) &&
      (!currencyFilter || inv.currency === currencyFilter)
    );
  }, [invoices, search, statusFilter, dateFrom, dateTo, payMethodFilter, currencyFilter]);

  const sorted = useMemo(() => [...filtered].sort((a, b) => {
    let av = a[sort.field], bv = b[sort.field];
    if (['total','subtotal','paidAmt','tax','disc'].includes(sort.field)) { av = Number(av||0); bv = Number(bv||0); }
    if (av < bv) return sort.dir === 'asc' ? -1 : 1;
    if (av > bv) return sort.dir === 'asc' ?  1 : -1;
    return 0;
  }), [filtered, sort]);

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const pageData = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const onSort = f => setSort(s => ({ field: f, dir: s.field === f && s.dir === 'asc' ? 'desc' : 'asc' }));

  /* ── Stats ── */
  const stats = useMemo(() => ({
    total: invoices.length,
    paid: invoices.filter(i => i.status === 'paid').length,
    pending: invoices.filter(i => i.status === 'pending').length,
    overdue: invoices.filter(i => i.status === 'overdue').length,
    draft: invoices.filter(i => i.status === 'draft').length,
    cancelled: invoices.filter(i => i.status === 'cancelled').length,
    revenue: invoices.filter(i => i.status === 'paid').reduce((s, i) => s + (i.total||0), 0),
    outstanding: invoices.filter(i => !['paid','cancelled','void'].includes(i.status)).reduce((s, i) => s + Math.max(0, (i.total||0)-(i.paidAmt||0)), 0),
    avgValue: invoices.length ? invoices.reduce((s, i) => s + (i.total||0), 0) / invoices.length : 0,
  }), [invoices]);

  /* ── CRUD ── */
  const handleSave = (inv) => {
    setInvoices(prev => {
      const idx = prev.findIndex(x => x.id === inv.id);
      if (idx >= 0) { const next = [...prev]; next[idx] = inv; return next; }
      return [inv, ...prev];
    });
    setCreateOpen(false); setEditInvoice(null);
    toast.success(inv.status === 'draft' ? '📋 Invoice saved as draft' : '✅ Invoice ' + inv.id + ' created successfully');
  };

  const handleDelete = () => {
    const id = deleteInvoice.id;
    setInvoices(prev => prev.filter(i => i.id !== id));
    toast.success('🗑️ Invoice ' + id + ' deleted');
    setDeleteInvoice(null);
  };

  const handleDuplicate = (inv) => {
    const dup = { ...inv, id: uid(), status: 'draft', issueDate: today(), dueDate: addDays(today(), 30), paidAmt: 0 };
    setInvoices(prev => [dup, ...prev]);
    toast.success('Invoice duplicated as ' + dup.id);
  };

  const handlePayment = (data) => {
    const newPaid = (payInvoice.paidAmt || 0) + data.amount;
    const newStatus = newPaid >= payInvoice.total ? 'paid' : payInvoice.status;
    setInvoices(prev => prev.map(i => i.id === payInvoice.id ? { ...i, paidAmt: newPaid, status: newStatus, payMethod: data.method } : i));
    toast.success('💰 Payment of ' + fmt(data.amount) + ' recorded');
    setPayInvoice(null);
  };

  const handleMarkPaid = (inv) => {
    setInvoices(prev => prev.map(i => i.id === inv.id ? { ...i, status: 'paid', paidAmt: i.total } : i));
    toast.success('✅ ' + inv.id + ' marked as paid');
  };

  const handleVoid = (inv) => {
    setInvoices(prev => prev.map(i => i.id === inv.id ? { ...i, status: 'void' } : i));
    toast.success('Invoice ' + inv.id + ' voided');
  };

  /* ── Selection ── */
  const toggleRow = id => setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleAll = () => selected.size === pageData.length ? setSelected(new Set()) : setSelected(new Set(pageData.map(r => r.id)));
  const handleBulkDelete = () => { setInvoices(prev => prev.filter(i => !selected.has(i.id))); toast.success('Deleted ' + selected.size + ' invoice(s)'); setSelected(new Set()); };
  const handleBulkExport = () => { exportCSV(sorted.filter(i => selected.has(i.id))); toast.success('Exported ' + selected.size + ' invoice(s)'); };
  const handleBulkEmail = () => { toast.success('Emails queued for ' + selected.size + ' invoice(s)'); setSelected(new Set()); };
  const handleBulkMarkPaid = () => { setInvoices(prev => prev.map(i => selected.has(i.id) ? { ...i, status: 'paid', paidAmt: i.total } : i)); toast.success('Marked ' + selected.size + ' as paid'); setSelected(new Set()); };

  const toggleCol = k => setVisibleCols(prev => { const n = new Set(prev); n.has(k) ? n.delete(k) : n.add(k); return n; });

  const hasFilters = search || statusFilter || dateFrom || dateTo || payMethodFilter || currencyFilter;
  const resetFilters = () => { setSearch(''); setStatusFilter(''); setDateFrom(''); setDateTo(''); setPayMethodFilter(''); setCurrencyFilter(''); };

  const colVisible = k => visibleCols.has(k);

  /* ══════════════════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-full" style={{ background: 'linear-gradient(160deg, #EEF2FF 0%, #F0F9FF 50%, #F5F3FF 100%)' }}>
      {/* ── Page Header ── */}
      <div className="px-8 pt-8 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold text-gray-900" style={{ fontSize: 32, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              <span style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Invoices
              </span>
            </h1>
            <p className="text-gray-500 mt-1 text-sm">Manage, track and send all your customer invoices</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 600); }}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 bg-white border border-gray-200 hover:bg-gray-50 transition-all"
              style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.07)' }}>
              <RefreshCw size={15} />
            </button>
            <button onClick={() => exportCSV(sorted)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
              style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.07)' }}>
              <FileDown size={15} />Export
            </button>
            <button onClick={() => setCreateOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-xl transition-all hover:opacity-90 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)', boxShadow: '0 4px 14px rgba(79,70,229,0.40)' }}>
              <Plus size={16} />Create Invoice
            </button>
          </div>
        </div>
      </div>

      <div className="px-8 pb-8 space-y-6">
        {/* ── Stats Cards ── */}
        <div className="grid grid-cols-3 lg:grid-cols-5 xl:grid-cols-9 gap-3">
          {[
            { title: 'Total Invoices',   rawValue: stats.total,       displayValue: String(stats.total),       icon: Layers,       color: '#4F46E5', bg: '#EEF2FF', trend: 12 },
            { title: 'Paid',             rawValue: stats.paid,        displayValue: String(stats.paid),         icon: CheckCircle,  color: '#16A34A', bg: '#F0FDF4', trend: 8  },
            { title: 'Pending',          rawValue: stats.pending,     displayValue: String(stats.pending),      icon: Clock,        color: '#D97706', bg: '#FFFBEB', trend: -3 },
            { title: 'Overdue',          rawValue: stats.overdue,     displayValue: String(stats.overdue),      icon: AlertTriangle,color: '#DC2626', bg: '#FEF2F2', trend: -5 },
            { title: 'Draft',            rawValue: stats.draft,       displayValue: String(stats.draft),        icon: FileText,     color: '#6B7280', bg: '#F3F4F6'           },
            { title: 'Cancelled',        rawValue: stats.cancelled,   displayValue: String(stats.cancelled),    icon: XCircle,      color: '#9333EA', bg: '#FDF4FF'           },
            { title: 'Total Revenue',    rawValue: Math.round(stats.revenue),    displayValue: '$' + (stats.revenue/1000).toFixed(1) + 'k',   icon: DollarSign,  color: '#16A34A', bg: '#F0FDF4', trend: 15 },
            { title: 'Outstanding',      rawValue: Math.round(stats.outstanding),displayValue: '$' + (stats.outstanding/1000).toFixed(1) + 'k',icon: TrendingDown,color: '#DC2626', bg: '#FEF2F2', trend: -8 },
            { title: 'Avg Invoice',      rawValue: Math.round(stats.avgValue),   displayValue: '$' + (stats.avgValue/1000).toFixed(1) + 'k',  icon: BarChart2,    color: '#4F46E5', bg: '#EEF2FF', trend: 4  },
          ].map(card => <StatCard key={card.title} {...card} />)}
        </div>

        {/* ── Search & Filter Bar ── */}
        <div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.04)', border: '1px solid #F1F5F9' }}>
          <div className="flex flex-wrap gap-3 items-center">
            {/* Search */}
            <div className="relative flex-1" style={{ minWidth: 260 }}>
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                className="w-full text-sm pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                placeholder="Search invoices, clients, emails, phone…" />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Status */}
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-400 bg-white cursor-pointer"
              style={{ minWidth: 140 }}>
              <option value="">All Status</option>
              {STATUSES.map(s => <option key={s} value={s}>{STATUS_CFG[s]?.label || s}</option>)}
            </select>

            {/* Filter Toggle */}
            <button onClick={() => setShowFilters(v => !v)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl border transition-all ${showFilters ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              <SlidersHorizontal size={14} />Filters {hasFilters && <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-bold">{[statusFilter,dateFrom,dateTo,payMethodFilter,currencyFilter].filter(Boolean).length}</span>}
            </button>

            {/* Column Visibility */}
            <div className="relative">
              <button onClick={() => setShowColMenu(v => !v)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-all">
                <Columns size={14} />Columns
              </button>
              {showColMenu && <ColVisMenu visible={visibleCols} onToggle={toggleCol} onClose={() => setShowColMenu(false)} />}
            </div>

            {hasFilters && (
              <button onClick={resetFilters}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl text-red-600 bg-red-50 hover:bg-red-100 transition-all">
                <XCircle size={14} />Reset
              </button>
            )}

            <div className="ml-auto text-sm text-gray-400 font-medium tabular-nums">
              {sorted.length} result{sorted.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">From</label>
                <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                  className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" style={{ width: 148 }} />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">To</label>
                <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                  className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" style={{ width: 148 }} />
              </div>
              <select value={payMethodFilter} onChange={e => setPayMethodFilter(e.target.value)}
                className="text-sm border border-gray-200 rounded-xl px-3.5 py-2 focus:outline-none focus:border-indigo-400 bg-white cursor-pointer" style={{ minWidth: 160 }}>
                <option value="">All Pay Methods</option>
                {PAYMENT_METHODS.map(m => <option key={m}>{m}</option>)}
              </select>
              <select value={currencyFilter} onChange={e => setCurrencyFilter(e.target.value)}
                className="text-sm border border-gray-200 rounded-xl px-3.5 py-2 focus:outline-none focus:border-indigo-400 bg-white cursor-pointer" style={{ minWidth: 120 }}>
                <option value="">All Currencies</option>
                {CURRENCIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          )}
        </div>

        {/* ── Table ── */}
        <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.04)', border: '1px solid #F1F5F9' }}>
          {/* Table Toolbar */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-700">All Invoices</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold text-indigo-700 bg-indigo-50">{sorted.length}</span>
            </div>
            {selected.size > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">{selected.size} selected</span>
                <div className="w-px h-4 bg-gray-200" />
                <button onClick={handleBulkMarkPaid} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-all"><CheckCircle size={12} />Mark Paid</button>
                <button onClick={handleBulkEmail} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all"><Mail size={12} />Email</button>
                <button onClick={handleBulkExport} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"><FileDown size={12} />Export</button>
                <button onClick={handleBulkDelete} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-all"><Trash2 size={12} />Delete</button>
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-max">
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #F1F5F9' }}>
                  <th className="px-4 py-3.5 w-10 sticky left-0" style={{ background: '#F8FAFC' }}>
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center cursor-pointer transition-all ${pageData.length > 0 && selected.size === pageData.length ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 hover:border-indigo-400'}`}
                      onClick={toggleAll}>
                      {pageData.length > 0 && selected.size === pageData.length && <Check size={10} color="white" />}
                      {selected.size > 0 && selected.size < pageData.length && <Minus size={10} color="#4F46E5" />}
                    </div>
                  </th>
                  {colVisible('id')         && <SortTh label="Invoice #"    field="id"         sort={sort} onSort={onSort} />}
                  {colVisible('client')     && <SortTh label="Client"       field="client"     sort={sort} onSort={onSort} />}
                  {colVisible('email')      && <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap" style={{ background: '#F8FAFC' }}>Email</th>}
                  {colVisible('issueDate')  && <SortTh label="Issue Date"   field="issueDate"  sort={sort} onSort={onSort} />}
                  {colVisible('dueDate')    && <SortTh label="Due Date"     field="dueDate"    sort={sort} onSort={onSort} />}
                  {colVisible('currency')   && <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap" style={{ background: '#F8FAFC' }}>Currency</th>}
                  {colVisible('subtotal')   && <SortTh label="Subtotal"     field="subtotal"   sort={sort} onSort={onSort} className="text-right" />}
                  {colVisible('tax')        && <SortTh label="Tax"          field="tax"        sort={sort} onSort={onSort} className="text-right" />}
                  {colVisible('disc')       && <SortTh label="Disc"         field="disc"       sort={sort} onSort={onSort} className="text-right" />}
                  {colVisible('total')      && <SortTh label="Total"        field="total"      sort={sort} onSort={onSort} className="text-right" />}
                  {colVisible('paidAmt')    && <SortTh label="Paid"         field="paidAmt"    sort={sort} onSort={onSort} className="text-right" />}
                  {colVisible('balance')    && <th className="px-4 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap" style={{ background: '#F8FAFC' }}>Balance</th>}
                  {colVisible('status')     && <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap" style={{ background: '#F8FAFC' }}>Status</th>}
                  {colVisible('payMethod')  && <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap" style={{ background: '#F8FAFC' }}>Pay Method</th>}
                  {colVisible('createdBy')  && <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap" style={{ background: '#F8FAFC' }}>Created By</th>}
                  <th className="px-4 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider" style={{ background: '#F8FAFC', width: 50 }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <SkeletonRows count={PAGE_SIZE} cols={visibleCols.size + 2} />
                ) : pageData.length === 0 ? (
                  <tr>
                    <td colSpan={visibleCols.size + 2} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center">
                          <FileText size={28} className="text-indigo-400" />
                        </div>
                        <div>
                          <p className="text-base font-semibold text-gray-700 mb-1">No invoices found</p>
                          <p className="text-sm text-gray-400">{hasFilters ? 'Try adjusting your search or filters' : 'Create your first invoice to get started'}</p>
                        </div>
                        {!hasFilters && (
                          <button onClick={() => setCreateOpen(true)}
                            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-xl mt-1"
                            style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)' }}>
                            <Plus size={15} />Create Invoice
                          </button>
                        )}
                        {hasFilters && (
                          <button onClick={resetFilters} className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-all">
                            <RefreshCw size={14} />Clear Filters
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : pageData.map((row, ri) => {
                  const balance = Math.max(0, (row.total || 0) - (row.paidAmt || 0));
                  const isSelected = selected.has(row.id);
                  return (
                    <tr key={row.id}
                      className="border-b border-gray-50 cursor-pointer transition-all duration-100"
                      style={{ background: isSelected ? '#EEF2FF' : ri % 2 === 0 ? '#FFFFFF' : '#FAFBFC' }}
                      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = '#F5F8FF'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = isSelected ? '#EEF2FF' : ri % 2 === 0 ? '#FFFFFF' : '#FAFBFC'; }}
                      onClick={() => setViewInvoice(row)}>

                      <td className="px-4 py-3.5 w-10" onClick={e => { e.stopPropagation(); toggleRow(row.id); }}>
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center cursor-pointer transition-all ${isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 hover:border-indigo-400'}`}>
                          {isSelected && <Check size={10} color="white" />}
                        </div>
                      </td>

                      {colVisible('id') && (
                        <td className="px-4 py-3.5">
                          <span className="font-mono text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg">{row.id}</span>
                        </td>
                      )}
                      {colVisible('client') && (
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                              style={{ background: `hsl(${row.client.charCodeAt(0) * 37 % 360}, 60%, 55%)` }}>
                              {row.client.charAt(0)}
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-800 whitespace-nowrap">{row.client}</div>
                              <div className="text-xs text-gray-400">{row.company}</div>
                            </div>
                          </div>
                        </td>
                      )}
                      {colVisible('email') && <td className="px-4 py-3.5 text-xs text-gray-500 whitespace-nowrap">{row.email}</td>}
                      {colVisible('issueDate') && <td className="px-4 py-3.5 text-sm text-gray-600 whitespace-nowrap tabular-nums">{fmtDate(row.issueDate)}</td>}
                      {colVisible('dueDate') && (
                        <td className="px-4 py-3.5 text-sm whitespace-nowrap tabular-nums">
                          <span className={balance > 0 && row.dueDate < today() && row.status !== 'paid' ? 'text-red-600 font-semibold' : 'text-gray-600'}>
                            {fmtDate(row.dueDate)}
                          </span>
                        </td>
                      )}
                      {colVisible('currency') && <td className="px-4 py-3.5"><span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">{row.currency}</span></td>}
                      {colVisible('subtotal') && <td className="px-4 py-3.5 text-sm text-right tabular-nums text-gray-600">{fmt(row.subtotal, row.currency)}</td>}
                      {colVisible('tax') && <td className="px-4 py-3.5 text-sm text-right tabular-nums text-gray-500">{fmt(row.tax||0, row.currency)}</td>}
                      {colVisible('disc') && <td className="px-4 py-3.5 text-sm text-right tabular-nums text-orange-500">{row.disc > 0 ? '-' + fmt(row.disc, row.currency) : '—'}</td>}
                      {colVisible('total') && <td className="px-4 py-3.5 text-sm text-right tabular-nums font-bold text-gray-900">{fmt(row.total, row.currency)}</td>}
                      {colVisible('paidAmt') && <td className="px-4 py-3.5 text-sm text-right tabular-nums text-green-600 font-medium">{row.paidAmt > 0 ? fmt(row.paidAmt, row.currency) : '—'}</td>}
                      {colVisible('balance') && (
                        <td className="px-4 py-3.5 text-sm text-right tabular-nums font-semibold" style={{ color: balance > 0 ? '#DC2626' : '#16A34A' }}>
                          {balance > 0 ? fmt(balance, row.currency) : <span className="text-green-600 text-xs font-semibold">Settled</span>}
                        </td>
                      )}
                      {colVisible('status') && <td className="px-4 py-3.5"><Badge status={row.status} /></td>}
                      {colVisible('payMethod') && <td className="px-4 py-3.5 text-xs text-gray-500">{row.payMethod || '—'}</td>}
                      {colVisible('createdBy') && <td className="px-4 py-3.5 text-xs text-gray-500 whitespace-nowrap">{row.createdBy}</td>}

                      <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                        <ActionMenu
                          row={row}
                          onView={() => setViewInvoice(row)}
                          onEdit={() => setEditInvoice(row)}
                          onDuplicate={() => handleDuplicate(row)}
                          onPrint={() => { toast.success('Printing ' + row.id + '…'); window.print(); }}
                          onEmail={() => toast.success('Email sent to ' + row.email)}
                          onRecordPayment={() => setPayInvoice(row)}
                          onMarkPaid={() => handleMarkPaid(row)}
                          onVoid={() => handleVoid(row)}
                          onDelete={() => setDeleteInvoice(row)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && sorted.length > 0 && (
            <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
              <span className="text-sm text-gray-500 tabular-nums">
                Showing <strong className="text-gray-800">{page * PAGE_SIZE + 1}–{Math.min((page+1)*PAGE_SIZE, sorted.length)}</strong> of <strong className="text-gray-800">{sorted.length}</strong>
              </span>
              <div className="flex items-center gap-1.5">
                <button disabled={page === 0} onClick={() => setPage(p => p-1)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-sm text-gray-500 border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                  <ChevronLeft size={14} />
                </button>
                {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                  const p = totalPages <= 7 ? i : page < 4 ? i : page > totalPages - 5 ? totalPages - 7 + i : page - 3 + i;
                  return (
                    <button key={p} onClick={() => setPage(p)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-all"
                      style={{ background: page === p ? '#4F46E5' : 'transparent', color: page === p ? '#fff' : '#6B7280', border: page === p ? 'none' : '1px solid #E5E7EB' }}>
                      {p + 1}
                    </button>
                  );
                })}
                <button disabled={page >= totalPages-1} onClick={() => setPage(p => p+1)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-sm text-gray-500 border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Modals ── */}
      <InvoiceFormModal
        open={createOpen || !!editInvoice}
        initial={editInvoice}
        onClose={() => { setCreateOpen(false); setEditInvoice(null); }}
        onSave={handleSave}
      />
      <ViewModal
        open={!!viewInvoice} invoice={viewInvoice}
        onClose={() => setViewInvoice(null)}
        onEdit={() => { const inv = viewInvoice; setViewInvoice(null); setEditInvoice(inv); }}
        onRecordPayment={() => { const inv = viewInvoice; setViewInvoice(null); setPayInvoice(inv); }}
      />
      <PaymentModal
        open={!!payInvoice} invoice={payInvoice}
        onClose={() => setPayInvoice(null)} onConfirm={handlePayment}
      />
      <DeleteModal
        open={!!deleteInvoice} invoice={deleteInvoice}
        onClose={() => setDeleteInvoice(null)} onConfirm={handleDelete}
      />
    </div>
  );
}
