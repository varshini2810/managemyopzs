import React, { useState, useMemo } from 'react';
import {
  BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  Download, RefreshCw, Calendar, ChevronDown, TrendingUp, TrendingDown,
  FileText, CheckCircle, Clock, AlertTriangle, XCircle, DollarSign,
  Filter, Search, ChevronUp, ArrowUpRight, ArrowDownRight,
  Printer, Send, Eye, RotateCcw, Percent, Building2, Globe,
  ShieldCheck, BookOpen, ClipboardList, BadgePercent, Landmark, Receipt,
  BarChart2
} from 'lucide-react';
import toast from 'react-hot-toast';

/* ══════════════════════════════════════════════════════════════════
   THEME
══════════════════════════════════════════════════════════════════ */
const T = {
  primary:  '#2563EB',
  navy:     '#0F172A',
  teal:     '#14B8A6',
  success:  '#22C55E',
  warning:  '#F59E0B',
  danger:   '#EF4444',
  purple:   '#8B5CF6',
  indigo:   '#6366F1',
  bg:       '#F8FAFC',
  card:     '#FFFFFF',
  border:   '#E2E8F0',
  textPri:  '#1E293B',
  textSec:  '#64748B',
};

const CHART_COLORS = [T.primary, T.teal, T.success, T.warning, T.purple, T.indigo, T.danger];

/* ══════════════════════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════════════════════ */
const QUARTERLY_DATA = [
  { period: 'Q1 2024', taxable: 136000, tax: 24480, gst: 9520, vat: 8160, incomeTax: 6800, collected: 22100, pending: 2380, filed: true  },
  { period: 'Q2 2024', taxable: 193000, tax: 34740, gst: 13510, vat: 11580, incomeTax: 9650, collected: 34740, pending: 0,    filed: true  },
  { period: 'Q3 2024', taxable: 221000, tax: 39780, gst: 15470, vat: 13260, incomeTax: 11050, collected: 36100, pending: 3680, filed: false },
  { period: 'Q4 2024', taxable: 286000, tax: 51480, gst: 20020, vat: 17160, incomeTax: 14300, collected: 0,     pending: 51480, filed: false },
];

const MONTHLY_DATA = [
  { period: 'Jan', taxable: 42000, tax: 7560, gst: 2940, vat: 2520, incomeTax: 2100, collected: 7560, pending: 0 },
  { period: 'Feb', taxable: 51000, tax: 9180, gst: 3570, vat: 3060, incomeTax: 2550, collected: 9180, pending: 0 },
  { period: 'Mar', taxable: 43000, tax: 7740, gst: 3010, vat: 2580, incomeTax: 2150, collected: 5360, pending: 2380 },
  { period: 'Apr', taxable: 63000, tax: 11340, gst: 4410, vat: 3780, incomeTax: 3150, collected: 11340, pending: 0 },
  { period: 'May', taxable: 58000, tax: 10440, gst: 4060, vat: 3480, incomeTax: 2900, collected: 10440, pending: 0 },
  { period: 'Jun', taxable: 72000, tax: 12960, gst: 5040, vat: 4320, incomeTax: 3600, collected: 12960, pending: 0 },
  { period: 'Jul', taxable: 68000, tax: 12240, gst: 4760, vat: 4080, incomeTax: 3400, collected: 12240, pending: 0 },
  { period: 'Aug', taxable: 79000, tax: 14220, gst: 5530, vat: 4740, incomeTax: 3950, collected: 10540, pending: 3680 },
  { period: 'Sep', taxable: 74000, tax: 13320, gst: 5180, vat: 4440, incomeTax: 3700, collected: 13320, pending: 0 },
  { period: 'Oct', taxable: 88000, tax: 15840, gst: 6160, vat: 5280, incomeTax: 4400, collected: 0, pending: 15840 },
  { period: 'Nov', taxable: 93000, tax: 16740, gst: 6510, vat: 5580, incomeTax: 4650, collected: 0, pending: 16740 },
  { period: 'Dec', taxable: 105000, tax: 18900, gst: 7350, vat: 6300, incomeTax: 5250, collected: 0, pending: 18900 },
];

const YEARLY_DATA = [
  { period: '2019', taxable: 420000, tax: 75600, gst: 29400, vat: 25200, incomeTax: 21000, collected: 75600, pending: 0 },
  { period: '2020', taxable: 390000, tax: 70200, gst: 27300, vat: 23400, incomeTax: 19500, collected: 68000, pending: 2200 },
  { period: '2021', taxable: 560000, tax: 100800, gst: 39200, vat: 33600, incomeTax: 28000, collected: 100800, pending: 0 },
  { period: '2022', taxable: 720000, tax: 129600, gst: 50400, vat: 43200, incomeTax: 36000, collected: 129600, pending: 0 },
  { period: '2023', taxable: 880000, tax: 158400, gst: 61600, vat: 52800, incomeTax: 44000, collected: 151200, pending: 7200 },
  { period: '2024', taxable: 836000, tax: 150480, gst: 58520, vat: 50160, incomeTax: 41800, collected: 93140, pending: 57340 },
];

const TAX_TYPES = [
  { name: 'GST / Sales Tax',    pct: 38, amount: 57140, color: T.primary  },
  { name: 'VAT',                pct: 33, amount: 49610, color: T.teal     },
  { name: 'Income Tax (TDS)',   pct: 22, amount: 33110, color: T.success  },
  { name: 'Service Tax',        pct: 5,  amount: 7530,  color: T.warning  },
  { name: 'Other Levies',       pct: 2,  amount: 3010,  color: T.purple   },
];

const FILING_STATUS = [
  { id: 'GST-2024-Q1', name: 'GST Return Q1 2024',    dueDate: '2024-04-30', filedDate: '2024-04-22', amount: 14700, status: 'filed',   penalty: 0     },
  { id: 'GST-2024-Q2', name: 'GST Return Q2 2024',    dueDate: '2024-07-31', filedDate: '2024-07-28', amount: 18930, status: 'filed',   penalty: 0     },
  { id: 'TDS-2024-Q1', name: 'TDS Return Q1 2024',    dueDate: '2024-05-31', filedDate: '2024-05-15', amount: 6800,  status: 'filed',   penalty: 0     },
  { id: 'TDS-2024-Q2', name: 'TDS Return Q2 2024',    dueDate: '2024-08-31', filedDate: '2024-08-10', amount: 9650,  status: 'filed',   penalty: 0     },
  { id: 'GST-2024-Q3', name: 'GST Return Q3 2024',    dueDate: '2024-10-31', filedDate: null,         amount: 28710, status: 'pending', penalty: 0     },
  { id: 'TDS-2024-Q3', name: 'TDS Return Q3 2024',    dueDate: '2024-11-30', filedDate: null,         amount: 11050, status: 'pending', penalty: 0     },
  { id: 'GST-2024-Q4', name: 'GST Return Q4 2024',    dueDate: '2025-01-31', filedDate: null,         amount: 37180, status: 'upcoming', penalty: 0    },
  { id: 'INCOME-2024', name: 'Annual Income Tax 2024', dueDate: '2025-03-31', filedDate: null,         amount: 41800, status: 'upcoming', penalty: 0    },
  { id: 'VAT-2024-Q1', name: 'VAT Return Q1 2024',    dueDate: '2024-04-20', filedDate: '2024-04-19', amount: 8160,  status: 'filed',   penalty: 0     },
  { id: 'VAT-2024-Q2', name: 'VAT Return Q2 2024',    dueDate: '2024-07-20', filedDate: '2024-07-25', amount: 11580, status: 'overdue', penalty: 450   },
  { id: 'VAT-2024-Q3', name: 'VAT Return Q3 2024',    dueDate: '2024-10-20', filedDate: null,         amount: 13260, status: 'pending', penalty: 0     },
];

const INVOICE_TAX = [
  { id: 'INV-10005', client: 'Tyrell Corporation',  date: '2024-05-12', taxable: 60000, taxRate: 10, taxAmt: 6000,  type: 'GST', status: 'paid'    },
  { id: 'INV-10010', client: 'Stark Industries',    date: '2024-05-28', taxable: 34800, taxRate: 18, taxAmt: 6264,  type: 'GST', status: 'pending' },
  { id: 'INV-10016', client: 'Weyland Corp',        date: '2024-06-05', taxable: 28000, taxRate: 20, taxAmt: 5600,  type: 'VAT', status: 'pending' },
  { id: 'INV-10003', client: 'Initech LLC',         date: '2024-04-15', taxable: 3200,  taxRate: 18, taxAmt: 576,   type: 'GST', status: 'overdue' },
  { id: 'INV-10018', client: 'OmniCorp',            date: '2024-06-10', taxable: 9800,  taxRate: 18, taxAmt: 1764,  type: 'GST', status: 'draft'   },
  { id: 'INV-10020', client: 'Initech LLC',         date: '2024-06-15', taxable: 6400,  taxRate: 18, taxAmt: 1152,  type: 'GST', status: 'pending' },
  { id: 'INV-10009', client: 'Aperture Science',    date: '2024-05-30', taxable: 15000, taxRate: 18, taxAmt: 2700,  type: 'GST', status: 'partial' },
  { id: 'INV-10017', client: 'Tyrell Corporation',  date: '2024-05-12', taxable: 60000, taxRate: 10, taxAmt: 6000,  type: 'TDS', status: 'paid'    },
  { id: 'INV-10006', client: 'Vandelay Ind.',       date: '2024-03-01', taxable: 1100,  taxRate: 18, taxAmt: 198,   type: 'VAT', status: 'overdue' },
  { id: 'INV-10013', client: 'Aperture Science',    date: '2024-06-01', taxable: 18000, taxRate: 18, taxAmt: 3240,  type: 'GST', status: 'draft'   },
];

const PERIOD_OPTIONS = ['Monthly', 'Quarterly', 'Yearly'];

/* ══════════════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════════════ */
const fmt = (v) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v || 0);
const fmtK = (v) => v >= 1000000 ? '$' + (v/1000000).toFixed(1) + 'M' : v >= 1000 ? '$' + (v/1000).toFixed(1) + 'k' : '$' + (v || 0);
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

/* ══════════════════════════════════════════════════════════════════
   CUSTOM TOOLTIP
══════════════════════════════════════════════════════════════════ */
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl py-3 px-4" style={{ background: T.navy, boxShadow: '0 8px 32px rgba(0,0,0,0.3)', minWidth: 170 }}>
      <p className="text-xs font-semibold mb-2.5" style={{ color: '#94A3B8' }}>{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center justify-between gap-4 text-xs mb-1">
          <span className="flex items-center gap-1.5" style={{ color: '#CBD5E1' }}>
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color || p.fill }} />
            {p.name}
          </span>
          <span className="font-bold tabular-nums" style={{ color: '#F1F5F9' }}>
            {typeof p.value === 'number' && p.value > 500 ? fmtK(p.value) : (p.value + (p.name?.includes('%') ? '%' : ''))}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   PERIOD TOGGLE
══════════════════════════════════════════════════════════════════ */
function PeriodToggle({ value, options, onChange }) {
  return (
    <div className="flex items-center p-1 rounded-xl" style={{ background: '#F1F5F9', border: '1px solid ' + T.border }}>
      {options.map(opt => (
        <button key={opt} onClick={() => onChange(opt)}
          className="px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap"
          style={{
            background: value === opt ? T.primary : 'transparent',
            color: value === opt ? '#fff' : T.textSec,
            boxShadow: value === opt ? '0 2px 8px rgba(37,99,235,0.3)' : 'none',
          }}>
          {opt}
        </button>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   KPI CARD
══════════════════════════════════════════════════════════════════ */
function KpiCard({ title, value, sub, change, changeLabel, icon: Icon, gradient }) {
  const isUp = change >= 0;
  return (
    <div className="rounded-2xl p-5 flex flex-col gap-3 group cursor-default transition-all duration-200 hover:-translate-y-0.5"
      style={{ background: T.card, border: '1px solid ' + T.border, boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)' }}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: T.textSec }}>{title}</span>
          <span className="text-2xl font-bold tabular-nums leading-tight transition-colors group-hover:text-blue-600"
            style={{ color: T.textPri }}>
            {value}
          </span>
          {sub && <span className="text-xs" style={{ color: T.textSec }}>{sub}</span>}
        </div>
        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
          style={{ background: gradient }}>
          <Icon size={20} color="white" />
        </div>
      </div>
      {change !== undefined && (
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${isUp ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
            {isUp ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
            {Math.abs(change)}%
          </div>
          <span className="text-xs" style={{ color: T.textSec }}>{changeLabel}</span>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   CARD WRAPPER
══════════════════════════════════════════════════════════════════ */
function Card({ children, title, subtitle, action, className = '' }) {
  return (
    <div className={`rounded-2xl p-6 ${className}`}
      style={{ background: T.card, border: '1px solid ' + T.border, boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)' }}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
          <div>
            {title && <h3 className="font-bold text-base" style={{ color: T.textPri }}>{title}</h3>}
            {subtitle && <p className="text-xs mt-0.5" style={{ color: T.textSec }}>{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   FILING STATUS BADGE
══════════════════════════════════════════════════════════════════ */
const FILING_CFG = {
  filed:    { label: 'Filed',    bg: '#DCFCE7', color: '#15803D', icon: CheckCircle },
  pending:  { label: 'Pending',  bg: '#FEF9C3', color: '#A16207', icon: Clock       },
  overdue:  { label: 'Overdue',  bg: '#FEE2E2', color: '#B91C1C', icon: AlertTriangle},
  upcoming: { label: 'Upcoming', bg: '#DBEAFE', color: '#1D4ED8', icon: Calendar    },
  partial:  { label: 'Partial',  bg: '#F5F3FF', color: '#7C3AED', icon: Clock       },
};

function FilingBadge({ status }) {
  const c = FILING_CFG[status] || FILING_CFG.pending;
  const Ic = c.icon;
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap"
      style={{ background: c.bg, color: c.color }}>
      <Ic size={11} />
      {c.label}
    </span>
  );
}

/* ══════════════════════════════════════════════════════════════════
   INVOICE STATUS BADGE
══════════════════════════════════════════════════════════════════ */
const INV_STATUS = {
  paid:    { bg: '#DCFCE7', color: '#15803D' },
  pending: { bg: '#FEF9C3', color: '#A16207' },
  overdue: { bg: '#FEE2E2', color: '#B91C1C' },
  draft:   { bg: '#F3F4F6', color: '#374151' },
  partial: { bg: '#DBEAFE', color: '#1D4ED8' },
};
function InvBadge({ status }) {
  const c = INV_STATUS[status] || INV_STATUS.pending;
  return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ background: c.bg, color: c.color }}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
}

/* ══════════════════════════════════════════════════════════════════
   TAX TYPE BADGE
══════════════════════════════════════════════════════════════════ */
const TAX_TYPE_CFG = {
  GST: { bg: '#EFF6FF', color: '#2563EB' },
  VAT: { bg: '#F0FDFA', color: '#0D9488' },
  TDS: { bg: '#F5F3FF', color: '#7C3AED' },
};
function TaxTypeBadge({ type }) {
  const c = TAX_TYPE_CFG[type] || { bg: '#F3F4F6', color: '#374151' };
  return <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold" style={{ background: c.bg, color: c.color }}>{type}</span>;
}

/* ══════════════════════════════════════════════════════════════════
   PIE LABEL
══════════════════════════════════════════════════════════════════ */
const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, pct }) => {
  if (pct < 8) return null;
  const RADIAN = Math.PI / 180;
  const r = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="700">{pct}%</text>;
};

/* ══════════════════════════════════════════════════════════════════
   EXPORT CSV
══════════════════════════════════════════════════════════════════ */
function exportCSV(data, filename) {
  const headers = Object.keys(data[0]);
  const csv = [headers, ...data.map(r => headers.map(h => r[h]))].map(row => row.map(v => '"' + String(v ?? '').replace(/"/g, '""') + '"').join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename + '.csv'; a.click();
  URL.revokeObjectURL(url);
}

/* ══════════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════════ */
export default function TaxReports() {
  const [period, setPeriod] = useState('Monthly');
  const [fiscalYear, setFiscalYear] = useState('2024');
  const [activeTab, setActiveTab] = useState('overview'); // overview | filings | invoices
  const [searchFiling, setSearchFiling] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [sortField, setSortField] = useState('date');
  const [sortDir, setSortDir] = useState('desc');

  const data = period === 'Quarterly' ? QUARTERLY_DATA : period === 'Yearly' ? YEARLY_DATA : MONTHLY_DATA;

  /* KPI Totals */
  const totals = useMemo(() => {
    const t = {
      taxable:   data.reduce((s, d) => s + (d.taxable || 0), 0),
      total:     data.reduce((s, d) => s + (d.tax || 0), 0),
      collected: data.reduce((s, d) => s + (d.collected || 0), 0),
      pending:   data.reduce((s, d) => s + (d.pending || 0), 0),
      gst:       data.reduce((s, d) => s + (d.gst || 0), 0),
      vat:       data.reduce((s, d) => s + (d.vat || 0), 0),
      income:    data.reduce((s, d) => s + (d.incomeTax || 0), 0),
    };
    t.effective = t.taxable > 0 ? ((t.total / t.taxable) * 100).toFixed(1) : 0;
    t.collectionRate = t.total > 0 ? Math.round((t.collected / t.total) * 100) : 0;
    return t;
  }, [data]);

  /* Filing filters */
  const filteredFilings = useMemo(() => FILING_STATUS.filter(f =>
    (!searchFiling || [f.name, f.id].some(v => v.toLowerCase().includes(searchFiling.toLowerCase()))) &&
    (!statusFilter || f.status === statusFilter)
  ), [searchFiling, statusFilter]);

  /* Invoice filters */
  const filteredInvoices = useMemo(() => {
    let rows = [...INVOICE_TAX];
    if (typeFilter) rows = rows.filter(r => r.type === typeFilter);
    rows.sort((a, b) => {
      const av = a[sortField] ?? '', bv = b[sortField] ?? '';
      return sortDir === 'asc' ? (av < bv ? -1 : 1) : (av > bv ? -1 : 1);
    });
    return rows;
  }, [typeFilter, sortField, sortDir]);

  const onSort = (f) => setSortField(p => { if (p === f) setSortDir(d => d === 'asc' ? 'desc' : 'asc'); return f; });

  const tabs = [
    { id: 'overview', label: 'Overview',       icon: BarChart2 },
    { id: 'filings',  label: 'Tax Filings',    icon: ClipboardList },
    { id: 'invoices', label: 'Invoice-Level Tax', icon: FileText },
  ];

  return (
    <div className="min-h-full" style={{ background: T.bg, fontFamily: "'Inter', 'Poppins', sans-serif" }}>
      {/* ── Page Header ── */}
      <div className="px-8 pt-8 pb-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)' }}>
                <Receipt size={20} color="white" />
              </div>
              <h1 className="font-bold" style={{ fontSize: 28, letterSpacing: '-0.025em', color: T.textPri }}>Tax Reports</h1>
            </div>
            <p className="text-sm ml-13" style={{ color: T.textSec, marginLeft: 52 }}>
              Comprehensive tax analytics, filings tracker and compliance dashboard
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {/* Fiscal Year */}
            <div className="relative">
              <select value={fiscalYear} onChange={e => setFiscalYear(e.target.value)}
                className="appearance-none pl-9 pr-8 py-2.5 text-sm font-semibold rounded-xl cursor-pointer focus:outline-none"
                style={{ background: T.card, border: '1px solid ' + T.border, color: T.textPri, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                {['2024', '2023', '2022', '2021'].map(y => <option key={y}>FY {y}</option>)}
              </select>
              <Landmark size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: T.textSec }} />
              <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: T.textSec }} />
            </div>
            {/* Period Toggle */}
            <PeriodToggle value={period} options={PERIOD_OPTIONS} onChange={setPeriod} />
            {/* Refresh */}
            <button onClick={() => toast.success('Tax data refreshed')}
              className="w-10 h-10 flex items-center justify-center rounded-xl transition-all hover:scale-105"
              style={{ background: T.card, border: '1px solid ' + T.border, color: T.textSec, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              <RefreshCw size={16} />
            </button>
            {/* Export */}
            <button onClick={() => { exportCSV(data, 'tax-report-' + period.toLowerCase()); toast.success('Tax report exported'); }}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all hover:opacity-90"
              style={{ background: T.primary, color: '#fff', boxShadow: '0 4px 14px rgba(37,99,235,0.35)' }}>
              <Download size={15} />Export Report
            </button>
          </div>
        </div>
      </div>

      <div className="px-8 pb-10 space-y-6">
        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
          {[
            { title: 'Total Tax Collected',   value: fmtK(totals.collected),    sub: period + ' · ' + fiscalYear, change: 12.4, changeLabel: 'vs prior',  icon: ShieldCheck,   gradient: 'linear-gradient(135deg,#22C55E,#16A34A)' },
            { title: 'Tax Liability (Total)', value: fmtK(totals.total),         sub: 'Gross liability',            change: 9.1,  changeLabel: 'vs prior',  icon: DollarSign,    gradient: 'linear-gradient(135deg,#2563EB,#1D4ED8)' },
            { title: 'Tax Pending',           value: fmtK(totals.pending),       sub: 'Yet to remit',               change: -4.2, changeLabel: 'vs prior',  icon: Clock,         gradient: 'linear-gradient(135deg,#F59E0B,#D97706)' },
            { title: 'Taxable Revenue',       value: fmtK(totals.taxable),       sub: 'Gross taxable amount',       change: 14.7, changeLabel: 'vs prior',  icon: TrendingUp,    gradient: 'linear-gradient(135deg,#14B8A6,#0D9488)' },
            { title: 'GST / Sales Tax',       value: fmtK(totals.gst),           sub: 'Goods & Services Tax',       change: 11.3, changeLabel: 'vs prior',  icon: Globe,         gradient: 'linear-gradient(135deg,#6366F1,#4F46E5)' },
            { title: 'VAT',                   value: fmtK(totals.vat),           sub: 'Value Added Tax',            change: 8.6,  changeLabel: 'vs prior',  icon: BadgePercent,  gradient: 'linear-gradient(135deg,#EC4899,#DB2777)' },
            { title: 'Income Tax (TDS)',       value: fmtK(totals.income),        sub: 'Direct tax deducted',        change: 6.9,  changeLabel: 'vs prior',  icon: Building2,     gradient: 'linear-gradient(135deg,#8B5CF6,#7C3AED)' },
            { title: 'Effective Tax Rate',    value: totals.effective + '%',      sub: 'Avg across all invoices',    change: -0.3, changeLabel: 'vs prior',  icon: Percent,       gradient: 'linear-gradient(135deg,#EF4444,#DC2626)' },
          ].map((c, i) => (
            <div key={i} className="col-span-1">
              <KpiCard {...c} />
            </div>
          ))}
        </div>

        {/* ── Collection Rate Bar ── */}
        <div className="rounded-2xl p-5 flex items-center gap-6"
          style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #1D4ED8 50%, #2563EB 100%)', boxShadow: '0 4px 24px rgba(37,99,235,0.3)' }}>
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-base mb-0.5">Tax Collection Rate</p>
            <p className="text-blue-200 text-sm">
              {fmt(totals.collected)} collected out of {fmt(totals.total)} total tax liability
              · <span className="text-white font-bold">{fmt(totals.pending)}</span> still pending
            </p>
          </div>
          <div className="flex-shrink-0 text-right">
            <span className="text-5xl font-black text-white tabular-nums">{totals.collectionRate}%</span>
            <p className="text-blue-200 text-xs mt-0.5">collected</p>
          </div>
          <div className="flex-1 min-w-0 max-w-xs">
            <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.2)' }}>
              <div className="h-full rounded-full transition-all duration-1000"
                style={{ width: totals.collectionRate + '%', background: 'linear-gradient(90deg, #4ADE80, #22C55E)' }} />
            </div>
            <div className="flex justify-between text-blue-200 text-xs mt-1">
              <span>0%</span><span>50%</span><span>100%</span>
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex items-center gap-1 p-1 rounded-xl self-start" style={{ background: '#F1F5F9', border: '1px solid ' + T.border, width: 'fit-content' }}>
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
                style={{
                  background: activeTab === tab.id ? T.primary : 'transparent',
                  color: activeTab === tab.id ? '#fff' : T.textSec,
                  boxShadow: activeTab === tab.id ? '0 2px 8px rgba(37,99,235,0.3)' : 'none',
                }}>
                <Icon size={14} />{tab.label}
              </button>
            );
          })}
        </div>

        {/* ════════════════════════════════════════════════════════
            TAB: OVERVIEW
        ════════════════════════════════════════════════════════ */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Row 1: Tax Trend + Type Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Tax Trend Area Chart */}
              <div className="lg:col-span-3">
                <Card title="Tax Collection Trend" subtitle={`${period} breakdown · Collected vs Pending`}
                  action={
                    <button onClick={() => { exportCSV(data, 'tax-trend'); toast.success('Exported'); }}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:bg-gray-100"
                      style={{ color: T.textSec, border: '1px solid ' + T.border }}>
                      <Download size={12} />Export
                    </button>
                  }>
                  <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                      <defs>
                        <linearGradient id="collectedGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={T.success} stopOpacity={0.2} />
                          <stop offset="95%" stopColor={T.success} stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="pendingGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={T.warning} stopOpacity={0.2} />
                          <stop offset="95%" stopColor={T.warning} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                      <XAxis dataKey="period" tick={{ fontSize: 11, fill: T.textSec }} axisLine={false} tickLine={false} />
                      <YAxis tickFormatter={fmtK} tick={{ fontSize: 10, fill: T.textSec }} axisLine={false} tickLine={false} width={52} />
                      <Tooltip content={<ChartTooltip />} />
                      <Legend wrapperStyle={{ fontSize: 12, color: T.textSec, paddingTop: 10 }} />
                      <Area type="monotone" dataKey="collected" name="Collected" stroke={T.success} strokeWidth={2.5} fill="url(#collectedGrad)" dot={false} activeDot={{ r: 5, stroke: '#fff', strokeWidth: 2 }} />
                      <Area type="monotone" dataKey="pending" name="Pending" stroke={T.warning} strokeWidth={2.5} fill="url(#pendingGrad)" dot={false} activeDot={{ r: 5, stroke: '#fff', strokeWidth: 2 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </Card>
              </div>

              {/* Tax Type Pie */}
              <div className="lg:col-span-2">
                <Card title="Tax by Type" subtitle="Proportional breakdown">
                  <ResponsiveContainer width="100%" height={185}>
                    <PieChart>
                      <Pie data={TAX_TYPES} cx="50%" cy="50%" innerRadius={45} outerRadius={82}
                        dataKey="amount" nameKey="name" paddingAngle={2} labelLine={false} label={renderLabel}>
                        {TAX_TYPES.map((d, i) => <Cell key={i} fill={d.color} />)}
                      </Pie>
                      <Tooltip content={<ChartTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-2 space-y-2.5">
                    {TAX_TYPES.map(t => (
                      <div key={t.name} className="flex items-center gap-2.5">
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: t.color }} />
                        <span className="text-xs flex-1" style={{ color: T.textSec }}>{t.name}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: '#F1F5F9' }}>
                            <div className="h-full rounded-full" style={{ width: t.pct + '%', background: t.color }} />
                          </div>
                          <span className="text-xs font-bold tabular-nums w-20 text-right" style={{ color: T.textPri }}>{fmtK(t.amount)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>

            {/* Row 2: GST vs VAT vs Income Tax Bar + Effective Rate Line */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Stacked Tax Component Bar */}
              <div className="lg:col-span-2">
                <Card title="Tax Component Comparison" subtitle="GST · VAT · Income Tax breakdown per period">
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }} barCategoryGap="25%">
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                      <XAxis dataKey="period" tick={{ fontSize: 10, fill: T.textSec }} axisLine={false} tickLine={false} />
                      <YAxis tickFormatter={fmtK} tick={{ fontSize: 10, fill: T.textSec }} axisLine={false} tickLine={false} width={48} />
                      <Tooltip content={<ChartTooltip />} />
                      <Legend wrapperStyle={{ fontSize: 11, color: T.textSec, paddingTop: 10 }} />
                      <Bar dataKey="gst"       name="GST"         fill={T.primary} stackId="tax" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="vat"       name="VAT"         fill={T.teal}    stackId="tax" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="incomeTax" name="Income Tax"  fill={T.success} stackId="tax" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </div>

              {/* Quick Tax Stats */}
              <div className="lg:col-span-1">
                <Card title="Tax Summary" subtitle={`FY ${fiscalYear} highlights`} className="h-full">
                  <div className="space-y-4">
                    {[
                      { label: 'Highest Tax Month', value: fmtK(Math.max(...data.map(d => d.tax || 0))), color: T.primary, icon: TrendingUp },
                      { label: 'Lowest Tax Month',  value: fmtK(Math.min(...data.map(d => d.tax || 0).filter(v => v > 0))), color: T.teal, icon: TrendingDown },
                      { label: 'Total GST',         value: fmtK(totals.gst),    color: T.primary, icon: Globe },
                      { label: 'Total VAT',         value: fmtK(totals.vat),    color: T.teal,    icon: BadgePercent },
                      { label: 'Total Income Tax',  value: fmtK(totals.income), color: T.purple,  icon: Building2 },
                      { label: 'Effective Rate',    value: totals.effective + '%', color: T.warning, icon: Percent },
                      { label: 'Pending Filings',   value: filteredFilings.filter(f => f.status === 'pending').length + ' returns', color: T.danger, icon: AlertTriangle },
                      { label: 'On-time Filing Rate', value: Math.round((FILING_STATUS.filter(f => f.status === 'filed').length / FILING_STATUS.length) * 100) + '%', color: T.success, icon: ShieldCheck },
                    ].map(({ label, value, color, icon: Icon }) => (
                      <div key={label} className="flex items-center gap-3 group">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                          style={{ background: color + '15' }}>
                          <Icon size={15} style={{ color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs" style={{ color: T.textSec }}>{label}</div>
                          <div className="text-sm font-bold tabular-nums" style={{ color: T.textPri }}>{value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>

            {/* Row 3: Taxable Revenue vs Tax Table */}
            <Card title={`${period} Tax Report · FY ${fiscalYear}`} subtitle="Full breakdown: taxable revenue, tax components, collection status"
              action={
                <button onClick={() => { exportCSV(data, 'tax-detail-' + period); toast.success('Exported'); }}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all hover:opacity-90"
                  style={{ background: T.primary + '12', color: T.primary, border: '1px solid ' + T.primary + '30' }}>
                  <Download size={13} />Export
                </button>
              }>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: '2px solid ' + T.border }}>
                      {['Period', 'Taxable Revenue', 'GST', 'VAT', 'Income Tax', 'Total Tax', 'Collected', 'Pending', 'Rate'].map(h => (
                        <th key={h} className="pb-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: T.textSec }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row, i) => {
                      const rate = row.taxable > 0 ? ((row.tax / row.taxable) * 100).toFixed(1) : 0;
                      const isLast = i === data.length - 1;
                      return (
                        <tr key={row.period}
                          style={{ borderBottom: !isLast ? '1px solid ' + T.border : 'none', background: i % 2 === 0 ? '#fff' : '#FAFBFD' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#EFF6FF'}
                          onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? '#fff' : '#FAFBFD'}>
                          <td className="py-3.5 font-semibold" style={{ color: T.textPri }}>{row.period}</td>
                          <td className="py-3.5 tabular-nums" style={{ color: T.textSec }}>{fmtK(row.taxable)}</td>
                          <td className="py-3.5 tabular-nums font-medium" style={{ color: T.primary }}>{fmtK(row.gst)}</td>
                          <td className="py-3.5 tabular-nums font-medium" style={{ color: T.teal }}>{fmtK(row.vat)}</td>
                          <td className="py-3.5 tabular-nums font-medium" style={{ color: T.purple }}>{fmtK(row.incomeTax)}</td>
                          <td className="py-3.5 tabular-nums font-bold" style={{ color: T.textPri }}>{fmtK(row.tax)}</td>
                          <td className="py-3.5 tabular-nums font-medium" style={{ color: T.success }}>{fmtK(row.collected)}</td>
                          <td className="py-3.5 tabular-nums font-medium" style={{ color: row.pending > 0 ? T.warning : T.textSec }}>{row.pending > 0 ? fmtK(row.pending) : '—'}</td>
                          <td className="py-3.5">
                            <span className="px-2 py-0.5 rounded-full text-xs font-bold tabular-nums"
                              style={{ background: T.primary + '12', color: T.primary }}>{rate}%</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr style={{ borderTop: '2px solid ' + T.border, background: '#EFF6FF' }}>
                      <td className="py-4 font-bold" style={{ color: T.textPri }}>TOTAL</td>
                      <td className="py-4 font-bold tabular-nums" style={{ color: T.textSec }}>{fmtK(totals.taxable)}</td>
                      <td className="py-4 font-bold tabular-nums" style={{ color: T.primary }}>{fmtK(totals.gst)}</td>
                      <td className="py-4 font-bold tabular-nums" style={{ color: T.teal }}>{fmtK(totals.vat)}</td>
                      <td className="py-4 font-bold tabular-nums" style={{ color: T.purple }}>{fmtK(totals.income)}</td>
                      <td className="py-4 font-bold tabular-nums" style={{ color: T.textPri }}>{fmtK(totals.total)}</td>
                      <td className="py-4 font-bold tabular-nums" style={{ color: T.success }}>{fmtK(totals.collected)}</td>
                      <td className="py-4 font-bold tabular-nums" style={{ color: totals.pending > 0 ? T.warning : T.success }}>{fmtK(totals.pending)}</td>
                      <td className="py-4">
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: T.primary + '18', color: T.primary }}>{totals.effective}%</span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════
            TAB: TAX FILINGS
        ════════════════════════════════════════════════════════ */}
        {activeTab === 'filings' && (
          <div className="space-y-5">
            {/* Filing Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Filings',   value: FILING_STATUS.length, color: T.primary,  bg: T.primary + '12'  },
                { label: 'Filed On Time',   value: FILING_STATUS.filter(f => f.status === 'filed').length,    color: T.success, bg: T.success + '12' },
                { label: 'Pending',         value: FILING_STATUS.filter(f => f.status === 'pending').length,  color: T.warning, bg: T.warning + '12' },
                { label: 'Overdue',         value: FILING_STATUS.filter(f => f.status === 'overdue').length,  color: T.danger,  bg: T.danger  + '12' },
              ].map(s => (
                <div key={s.label} className="rounded-2xl p-5 flex items-center gap-4"
                  style={{ background: T.card, border: '1px solid ' + T.border, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                  <div className="text-4xl font-black tabular-nums" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-sm font-semibold" style={{ color: T.textSec }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Filters */}
            <Card>
              <div className="flex flex-wrap gap-3 items-center">
                <div className="relative flex-1" style={{ minWidth: 220 }}>
                  <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: T.textSec }} />
                  <input value={searchFiling} onChange={e => setSearchFiling(e.target.value)}
                    className="w-full text-sm pl-9 pr-4 py-2.5 rounded-xl focus:outline-none transition-all"
                    style={{ border: '1px solid ' + T.border, color: T.textPri, background: '#F8FAFC' }}
                    placeholder="Search filing name or ID…" />
                </div>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                  className="text-sm rounded-xl px-3.5 py-2.5 focus:outline-none cursor-pointer"
                  style={{ border: '1px solid ' + T.border, color: T.textPri, background: T.card, minWidth: 150 }}>
                  <option value="">All Status</option>
                  {['filed', 'pending', 'overdue', 'upcoming'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
                <button onClick={() => { exportCSV(FILING_STATUS, 'tax-filings'); toast.success('Filings exported'); }}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all hover:opacity-90"
                  style={{ background: T.primary + '12', color: T.primary, border: '1px solid ' + T.primary + '30' }}>
                  <Download size={14} />Export
                </button>
                <span className="text-sm ml-auto tabular-nums" style={{ color: T.textSec }}>{filteredFilings.length} filings</span>
              </div>
            </Card>

            {/* Filings Table */}
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: '2px solid ' + T.border }}>
                      {['Filing ID', 'Return Name', 'Due Date', 'Filed Date', 'Amount', 'Penalty', 'Status', 'Actions'].map(h => (
                        <th key={h} className="pb-3.5 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: T.textSec }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFilings.length === 0 ? (
                      <tr><td colSpan={8} className="py-12 text-center" style={{ color: T.textSec }}>No filings found</td></tr>
                    ) : filteredFilings.map((f, i) => (
                      <tr key={f.id}
                        style={{ borderBottom: i < filteredFilings.length - 1 ? '1px solid ' + T.border : 'none', background: i % 2 === 0 ? '#fff' : '#FAFBFD' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#EFF6FF'}
                        onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? '#fff' : '#FAFBFD'}>
                        <td className="py-3.5">
                          <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-lg" style={{ background: T.primary + '10', color: T.primary }}>{f.id}</span>
                        </td>
                        <td className="py-3.5 font-semibold" style={{ color: T.textPri }}>{f.name}</td>
                        <td className="py-3.5 tabular-nums" style={{ color: f.status === 'overdue' ? T.danger : T.textSec }}>
                          {fmtDate(f.dueDate)}
                        </td>
                        <td className="py-3.5 tabular-nums" style={{ color: T.success }}>{f.filedDate ? fmtDate(f.filedDate) : '—'}</td>
                        <td className="py-3.5 tabular-nums font-bold" style={{ color: T.textPri }}>{fmt(f.amount)}</td>
                        <td className="py-3.5 tabular-nums font-medium" style={{ color: f.penalty > 0 ? T.danger : T.textSec }}>
                          {f.penalty > 0 ? fmt(f.penalty) : '—'}
                        </td>
                        <td className="py-3.5"><FilingBadge status={f.status} /></td>
                        <td className="py-3.5">
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => toast.success('Viewing ' + f.id)}
                              className="w-7 h-7 flex items-center justify-center rounded-lg transition-all hover:scale-110"
                              style={{ background: T.primary + '12', color: T.primary }}><Eye size={13} /></button>
                            <button onClick={() => toast.success('Downloading ' + f.id)}
                              className="w-7 h-7 flex items-center justify-center rounded-lg transition-all hover:scale-110"
                              style={{ background: T.teal + '12', color: T.teal }}><Download size={13} /></button>
                            {(f.status === 'pending' || f.status === 'upcoming') && (
                              <button onClick={() => toast.success('Marked ' + f.id + ' as filed')}
                                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all hover:opacity-90"
                                style={{ background: T.success + '12', color: T.success }}>
                                <CheckCircle size={11} />File Now
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════
            TAB: INVOICE-LEVEL TAX
        ════════════════════════════════════════════════════════ */}
        {activeTab === 'invoices' && (
          <div className="space-y-5">
            {/* Filter Bar */}
            <Card>
              <div className="flex flex-wrap gap-3 items-center">
                <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
                  className="text-sm rounded-xl px-3.5 py-2.5 focus:outline-none cursor-pointer"
                  style={{ border: '1px solid ' + T.border, color: T.textPri, background: T.card, minWidth: 150 }}>
                  <option value="">All Tax Types</option>
                  {['GST', 'VAT', 'TDS'].map(t => <option key={t}>{t}</option>)}
                </select>
                <button onClick={() => { exportCSV(filteredInvoices, 'invoice-tax'); toast.success('Invoice tax report exported'); }}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all hover:opacity-90"
                  style={{ background: T.primary + '12', color: T.primary, border: '1px solid ' + T.primary + '30' }}>
                  <Download size={14} />Export
                </button>
                <span className="ml-auto text-sm tabular-nums" style={{ color: T.textSec }}>
                  {filteredInvoices.length} invoices · Total tax: <strong style={{ color: T.textPri }}>{fmt(filteredInvoices.reduce((s, r) => s + r.taxAmt, 0))}</strong>
                </span>
              </div>
            </Card>

            {/* Invoice Tax Table */}
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: '2px solid ' + T.border }}>
                      {[
                        { label: 'Invoice #', field: 'id' },
                        { label: 'Client',    field: 'client' },
                        { label: 'Date',      field: 'date' },
                        { label: 'Tax Type',  field: 'type' },
                        { label: 'Taxable',   field: 'taxable' },
                        { label: 'Tax Rate',  field: 'taxRate' },
                        { label: 'Tax Amt',   field: 'taxAmt' },
                        { label: 'Status',    field: 'status' },
                      ].map(({ label, field }) => (
                        <th key={field} onClick={() => onSort(field)}
                          className="pb-3.5 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer select-none group hover:opacity-70 transition-opacity"
                          style={{ color: T.textSec }}>
                          <span className="flex items-center gap-1">
                            {label}
                            <span className="flex flex-col">
                              <ChevronUp size={9} style={{ display: 'block', color: sortField === field && sortDir === 'asc' ? T.primary : '#CBD5E1' }} />
                              <ChevronDown size={9} style={{ display: 'block', marginTop: -2, color: sortField === field && sortDir === 'desc' ? T.primary : '#CBD5E1' }} />
                            </span>
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInvoices.map((row, i) => (
                      <tr key={row.id}
                        style={{ borderBottom: i < filteredInvoices.length - 1 ? '1px solid ' + T.border : 'none', background: i % 2 === 0 ? '#fff' : '#FAFBFD' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#EFF6FF'}
                        onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? '#fff' : '#FAFBFD'}>
                        <td className="py-3.5">
                          <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-lg" style={{ background: T.primary + '10', color: T.primary }}>{row.id}</span>
                        </td>
                        <td className="py-3.5 font-semibold" style={{ color: T.textPri }}>{row.client}</td>
                        <td className="py-3.5 tabular-nums" style={{ color: T.textSec }}>{fmtDate(row.date)}</td>
                        <td className="py-3.5"><TaxTypeBadge type={row.type} /></td>
                        <td className="py-3.5 tabular-nums" style={{ color: T.textSec }}>{fmt(row.taxable)}</td>
                        <td className="py-3.5">
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: T.primary + '10', color: T.primary }}>{row.taxRate}%</span>
                        </td>
                        <td className="py-3.5 tabular-nums font-bold" style={{ color: T.primary }}>{fmt(row.taxAmt)}</td>
                        <td className="py-3.5"><InvBadge status={row.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{ borderTop: '2px solid ' + T.border, background: '#EFF6FF' }}>
                      <td colSpan={4} className="py-4 font-bold" style={{ color: T.textPri }}>TOTAL</td>
                      <td className="py-4 font-bold tabular-nums" style={{ color: T.textSec }}>{fmt(filteredInvoices.reduce((s, r) => s + r.taxable, 0))}</td>
                      <td className="py-4" />
                      <td className="py-4 font-bold tabular-nums" style={{ color: T.primary }}>{fmt(filteredInvoices.reduce((s, r) => s + r.taxAmt, 0))}</td>
                      <td className="py-4" />
                    </tr>
                  </tfoot>
                </table>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
