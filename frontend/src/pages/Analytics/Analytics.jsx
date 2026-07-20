import React, { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileText,
  CreditCard,
  Users,
  Download,
  RefreshCw,
  Calendar,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  BarChart2,
  PieChart as PieIcon,
  Activity,
  Target,
  Zap,
  Award,
  ChevronDown,
  Eye,
  Printer,
} from "lucide-react";
import toast from "react-hot-toast";
const T = {
  primary: "#2563EB",
  navy: "#0F172A",
  teal: "#14B8A6",
  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
  purple: "#8B5CF6",
  pink: "#EC4899",
  bg: "#F8FAFC",
  card: "#FFFFFF",
  border: "#E2E8F0",
  textPri: "#1E293B",
  textSec: "#64748B",
};
const CHART_COLORS = [
  T.primary,
  T.teal,
  T.success,
  T.warning,
  T.purple,
  T.pink,
  T.danger,
];
const MONTHLY = [
  {
    month: "Jan",
    revenue: 42000,
    expenses: 28000,
    profit: 14000,
    invoices: 38,
    collections: 89,
  },
  {
    month: "Feb",
    revenue: 51000,
    expenses: 31000,
    profit: 20000,
    invoices: 45,
    collections: 92,
  },
  {
    month: "Mar",
    revenue: 47000,
    expenses: 29500,
    profit: 17500,
    invoices: 41,
    collections: 87,
  },
  {
    month: "Apr",
    revenue: 63000,
    expenses: 34000,
    profit: 29000,
    invoices: 56,
    collections: 94,
  },
  {
    month: "May",
    revenue: 58000,
    expenses: 32000,
    profit: 26000,
    invoices: 52,
    collections: 91,
  },
  {
    month: "Jun",
    revenue: 72000,
    expenses: 38000,
    profit: 34000,
    invoices: 67,
    collections: 96,
  },
  {
    month: "Jul",
    revenue: 68000,
    expenses: 36000,
    profit: 32000,
    invoices: 61,
    collections: 93,
  },
  {
    month: "Aug",
    revenue: 79000,
    expenses: 41000,
    profit: 38000,
    invoices: 72,
    collections: 95,
  },
  {
    month: "Sep",
    revenue: 74000,
    expenses: 39000,
    profit: 35000,
    invoices: 68,
    collections: 92,
  },
  {
    month: "Oct",
    revenue: 88000,
    expenses: 44000,
    profit: 44000,
    invoices: 80,
    collections: 97,
  },
  {
    month: "Nov",
    revenue: 93000,
    expenses: 47000,
    profit: 46000,
    invoices: 85,
    collections: 96,
  },
  {
    month: "Dec",
    revenue: 105000,
    expenses: 52000,
    profit: 53000,
    invoices: 96,
    collections: 98,
  },
];
const YEARLY = [
  {
    month: "2019",
    revenue: 420000,
    expenses: 280000,
    profit: 140000,
    invoices: 380,
    collections: 87,
  },
  {
    month: "2020",
    revenue: 390000,
    expenses: 310000,
    profit: 80000,
    invoices: 340,
    collections: 82,
  },
  {
    month: "2021",
    revenue: 560000,
    expenses: 320000,
    profit: 240000,
    invoices: 490,
    collections: 90,
  },
  {
    month: "2022",
    revenue: 720000,
    expenses: 380000,
    profit: 340000,
    invoices: 630,
    collections: 93,
  },
  {
    month: "2023",
    revenue: 880000,
    expenses: 430000,
    profit: 450000,
    invoices: 770,
    collections: 95,
  },
  {
    month: "2024",
    revenue: 1060000,
    expenses: 500000,
    profit: 560000,
    invoices: 930,
    collections: 97,
  },
];
const EXPENSE_CATEGORIES = [
  { name: "Software", value: 42000, pct: 26 },
  { name: "Marketing", value: 38000, pct: 23 },
  { name: "Salary & Benefits", value: 28000, pct: 17 },
  { name: "Rent & Utilities", value: 22000, pct: 14 },
  { name: "Travel", value: 15000, pct: 9 },
  { name: "Professional Svc", value: 11000, pct: 7 },
  { name: "Other", value: 6000, pct: 4 },
];
const TOP_CUSTOMERS = [
  {
    name: "Tyrell Corporation",
    revenue: 66000,
    invoices: 6,
    status: "paid",
    growth: 18,
  },
  {
    name: "Stark Industries",
    revenue: 40064,
    invoices: 4,
    status: "pending",
    growth: 12,
  },
  {
    name: "Massive Dynamic",
    revenue: 22750,
    invoices: 3,
    status: "paid",
    growth: 25,
  },
  {
    name: "Weyland Corp",
    revenue: 32100,
    invoices: 5,
    status: "pending",
    growth: -4,
  },
  {
    name: "Pied Piper",
    revenue: 16000,
    invoices: 2,
    status: "paid",
    growth: 31,
  },
  {
    name: "Aperture Science",
    revenue: 17700,
    invoices: 3,
    status: "partial",
    growth: 7,
  },
];
const INVOICE_STATUS = [
  { name: "Paid", value: 9, color: T.success },
  { name: "Pending", value: 5, color: T.warning },
  { name: "Overdue", value: 4, color: T.danger },
  { name: "Draft", value: 3, color: "#94A3B8" },
  { name: "Cancelled", value: 1, color: T.purple },
];
const PAYMENT_METHODS = [
  { method: "Credit Card", pct: 38, amount: 401400 },
  { method: "Bank Transfer", pct: 31, amount: 327700 },
  { method: "Wire", pct: 18, amount: 190200 },
  { method: "PayPal", pct: 8, amount: 84600 },
  { method: "Other", pct: 5, amount: 52900 },
];
const fmt = (v) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(v || 0);
const fmtK = (v) =>
  v >= 1000000
    ? "$" + (v / 1000000).toFixed(1) + "M"
    : v >= 1000
      ? "$" + (v / 1000).toFixed(0) + "k"
      : "$" + v;
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-card py-3 px-4"
      style={{
        background: T.navy,
        border: "none",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        minWidth: 160,
      }}
    >
      {" "}
      <p className="text-xs font-semibold mb-2" style={{ color: "#94A3B8" }}>
        {" "}
        {label}{" "}
      </p>{" "}
      {payload.map((p, i) => (
        <div
          key={i}
          className="flex items-center justify-between gap-4 text-xs"
        >
          {" "}
          <span
            className="flex items-center gap-1.5"
            style={{ color: "#CBD5E1" }}
          >
            {" "}
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: p.color || p.fill }}
            />{" "}
            {p.name}{" "}
          </span>{" "}
          <span className="font-bold tabular-nums" style={{ color: "#F1F5F9" }}>
            {" "}
            {typeof p.value === "number" && p.value > 1000
              ? fmtK(p.value)
              : p.value}{" "}
          </span>{" "}
        </div>
      ))}{" "}
    </div>
  );
}
function KpiCard({
  title,
  value,
  subValue,
  change,
  changeLabel,
  icon: Icon,
  gradient,
  trend,
}) {
  const isUp = change >= 0;
  return (
    <div
      className="rounded-2xl p-6 flex flex-col gap-4 group cursor-default transition-all duration-200 .5"
      style={{
        background: T.card,
        border: "1px solid " + T.border,
        boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
      }}
    >
      {" "}
      <div className="flex items-start justify-between">
        {" "}
        <div className="flex flex-col gap-0.5">
          {" "}
          <span className="text-sm font-semibold" style={{ color: T.textSec }}>
            {" "}
            {title}{" "}
          </span>{" "}
          <span
            className="text-3xl font-bold tabular-nums leading-tight transition-colors duration-200 group-hover:text-blue-600"
            style={{ color: T.textPri, fontFamily: "'Inter', sans-serif" }}
          >
            {" "}
            {value}{" "}
          </span>{" "}
          {subValue && (
            <span className="text-xs" style={{ color: T.textSec }}>
              {" "}
              {subValue}{" "}
            </span>
          )}{" "}
        </div>{" "}
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
          style={{ background: gradient }}
        >
          {" "}
          <Icon size={22} color="white" />{" "}
        </div>{" "}
      </div>{" "}
      <div className="flex items-center gap-2">
        {" "}
        <div
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${isUp ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}
        >
          {" "}
          {isUp ? (
            <ArrowUpRight size={12} />
          ) : (
            <ArrowDownRight size={12} />
          )}{" "}
          {Math.abs(change)}%{" "}
        </div>{" "}
        <span className="text-xs" style={{ color: T.textSec }}>
          {" "}
          {changeLabel}{" "}
        </span>{" "}
      </div>{" "}
    </div>
  );
}
function Card({ children, title, subtitle, action, className = "" }) {
  return (
    <div
      className={`rounded-2xl p-6 ${className}`}
      style={{
        background: T.card,
        border: "1px solid " + T.border,
        boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
      }}
    >
      {" "}
      {(title || action) && (
        <div className="flex items-center justify-between mb-5">
          {" "}
          <div>
            {" "}
            {title && (
              <h3 className="font-bold text-base" style={{ color: T.textPri }}>
                {" "}
                {title}{" "}
              </h3>
            )}{" "}
            {subtitle && (
              <p className="text-xs mt-0.5" style={{ color: T.textSec }}>
                {" "}
                {subtitle}{" "}
              </p>
            )}{" "}
          </div>{" "}
          {action}{" "}
        </div>
      )}{" "}
      {children}{" "}
    </div>
  );
}
function PeriodToggle({ value, onChange }) {
  return (
    <div
      className="flex items-center p-1 rounded-card"
      style={{ background: "#F1F5F9", border: "1px solid " + T.border }}
    >
      {" "}
      {["Monthly", "Yearly"].map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className="px-4 py-1.5 rounded-card text-sm font-semibold transition-all duration-200"
          style={{
            background: value === opt ? T.primary : "transparent",
            color: value === opt ? "#fff" : T.textSec,
            boxShadow: value === opt ? "0 2px 8px rgba(37,99,235,0.3)" : "none",
          }}
        >
          {" "}
          {opt}{" "}
        </button>
      ))}{" "}
    </div>
  );
}
const renderPieLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  name,
  pct,
}) => {
  if (pct < 7) return null;
  const RADIAN = Math.PI / 180;
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={11}
      fontWeight="700"
    >
      {" "}
      {pct}%{" "}
    </text>
  );
};
function CustBadge({ status }) {
  const map = {
    paid: { bg: "#DCFCE7", c: "#15803D" },
    pending: { bg: "#FEF9C3", c: "#A16207" },
    partial: { bg: "#DBEAFE", c: "#1D4ED8" },
  };
  const s = map[status] || map.pending;
  return (
    <span
      className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
      style={{ background: s.bg, color: s.c }}
    >
      {" "}
      {status.charAt(0).toUpperCase() + status.slice(1)}{" "}
    </span>
  );
}
function exportData(data, filename) {
  const headers = Object.keys(data[0]);
  const csv = [headers, ...data.map((r) => headers.map((h) => r[h]))]
    .map((row) => row.join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename + ".csv";
  a.click();
  URL.revokeObjectURL(url);
}
export default function Analytics() {
  const [period, setPeriod] = useState("Monthly");
  const [dateRange, setDateRange] = useState("Last 12 Months");
  const [activeChart, setActiveChart] = useState("revenue");
  const data = period === "Yearly" ? YEARLY : MONTHLY;
  const totals = useMemo(
    () => ({
      revenue: data.reduce((s, d) => s + d.revenue, 0),
      expenses: data.reduce((s, d) => s + d.expenses, 0),
      profit: data.reduce((s, d) => s + d.profit, 0),
      invoices: data.reduce((s, d) => s + d.invoices, 0),
      avgInvoice:
        data.reduce((s, d) => s + d.revenue, 0) /
        data.reduce((s, d) => s + d.invoices, 0),
      collection: Math.round(
        data.reduce((s, d) => s + d.collections, 0) / data.length,
      ),
      margin: Math.round(
        (data.reduce((s, d) => s + d.profit, 0) /
          data.reduce((s, d) => s + d.revenue, 0)) *
          100,
      ),
    }),
    [period],
  );
  const chartKeys = {
    revenue: [{ key: "revenue", name: "Revenue", color: T.primary }],
    expenses: [{ key: "expenses", name: "Expenses", color: T.danger }],
    profit: [{ key: "profit", name: "Net Profit", color: T.success }],
    all: [
      { key: "revenue", name: "Revenue", color: T.primary },
      { key: "expenses", name: "Expenses", color: T.danger },
      { key: "profit", name: "Net Profit", color: T.success },
    ],
  };
  const areaKeys = chartKeys[activeChart] || chartKeys.all;
  return (
    <div
      className="min-h-full"
      style={{ background: T.bg, fontFamily: "'Inter', 'Poppins', sans-serif" }}
    >
      {" "}
      {}{" "}
      <div className="px-8 pt-8 pb-6">
        {" "}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {" "}
          <div>
            {" "}
            <h1
              className="font-bold"
              style={{
                fontSize: 30,
                letterSpacing: "-0.025em",
                color: T.textPri,
              }}
            >
              {" "}
              Analytics &amp; Reports{" "}
            </h1>{" "}
            <p className="text-sm mt-1" style={{ color: T.textSec }}>
              {" "}
              Real-time financial intelligence and performance insights{" "}
            </p>{" "}
          </div>{" "}
          <div className="flex items-center gap-3 flex-wrap">
            {" "}
            {}{" "}
            <div className="relative">
              {" "}
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="appearance-none pl-9 pr-8 py-2.5 text-sm font-semibold rounded-card cursor-pointer focus:outline-none"
                style={{
                  background: T.card,
                  border: "1px solid " + T.border,
                  color: T.textPri,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                }}
              >
                {" "}
                {[
                  "Last 3 Months",
                  "Last 6 Months",
                  "Last 12 Months",
                  "This Year",
                  "All Time",
                ].map((r) => (
                  <option key={r}>{r}</option>
                ))}{" "}
              </select>{" "}
              <Calendar
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: T.textSec }}
              />{" "}
              <ChevronDown
                size={13}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: T.textSec }}
              />{" "}
            </div>{" "}
            {} <PeriodToggle value={period} onChange={setPeriod} /> {}{" "}
            <button
              onClick={() => toast.success("Data refreshed")}
              className="w-10 h-10 flex items-center justify-center rounded-card transition-all hover:scale-105"
              style={{
                background: T.card,
                border: "1px solid " + T.border,
                color: T.textSec,
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              }}
            >
              {" "}
              <RefreshCw size={16} />{" "}
            </button>{" "}
            {}{" "}
            <button
              onClick={() => {
                exportData(data, "analytics-report");
                toast.success("Report exported");
              }}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-card transition-all hover:opacity-90"
              style={{
                background: T.primary,
                color: "#fff",
                boxShadow: "0 4px 14px rgba(37,99,235,0.35)",
              }}
            >
              {" "}
              <Download size={15} /> Export Report{" "}
            </button>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      <div className="px-8 pb-10 space-y-6">
        {" "}
        {}{" "}
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          {" "}
          <div className="col-span-2 lg:col-span-1 xl:col-span-1">
            {" "}
            <KpiCard
              title="Total Revenue"
              value={fmtK(totals.revenue)}
              subValue={period + " total"}
              change={14.2}
              changeLabel="vs prior period"
              icon={TrendingUp}
              gradient="linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)"
            />{" "}
          </div>{" "}
          <div className="col-span-2 lg:col-span-1 xl:col-span-1">
            {" "}
            <KpiCard
              title="Total Expenses"
              value={fmtK(totals.expenses)}
              change={-6.8}
              changeLabel="vs prior period"
              icon={CreditCard}
              gradient="linear-gradient(135deg, #EF4444 0%, #F97316 100%)"
            />{" "}
          </div>{" "}
          <div className="col-span-2 lg:col-span-1 xl:col-span-1">
            {" "}
            <KpiCard
              title="Net Profit"
              value={fmtK(totals.profit)}
              subValue={"Margin " + totals.margin + "%"}
              change={21.5}
              changeLabel="vs prior period"
              icon={DollarSign}
              gradient="linear-gradient(135deg, #22C55E 0%, #16A34A 100%)"
            />{" "}
          </div>{" "}
          <div className="col-span-2 lg:col-span-1 xl:col-span-1">
            {" "}
            <KpiCard
              title="Total Invoices"
              value={totals.invoices.toLocaleString()}
              change={9.3}
              changeLabel="vs prior period"
              icon={FileText}
              gradient="linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)"
            />{" "}
          </div>{" "}
          <div className="col-span-2 lg:col-span-1 xl:col-span-1">
            {" "}
            <KpiCard
              title="Avg Invoice Value"
              value={fmtK(Math.round(totals.avgInvoice))}
              change={4.7}
              changeLabel="vs prior period"
              icon={BarChart2}
              gradient="linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)"
            />{" "}
          </div>{" "}
          <div className="col-span-2 lg:col-span-1 xl:col-span-1">
            {" "}
            <KpiCard
              title="Collection Rate"
              value={totals.collection + "%"}
              change={1.8}
              changeLabel="vs prior period"
              icon={Target}
              gradient="linear-gradient(135deg, #F59E0B 0%, #D97706 100%)"
            />{" "}
          </div>{" "}
          <div className="col-span-2 lg:col-span-1 xl:col-span-1">
            {" "}
            <KpiCard
              title="Profit Margin"
              value={totals.margin + "%"}
              change={3.2}
              changeLabel="vs prior period"
              icon={Award}
              gradient="linear-gradient(135deg, #EC4899 0%, #DB2777 100%)"
            />{" "}
          </div>{" "}
        </div>{" "}
        {}{" "}
        <Card
          title="Revenue Trend"
          subtitle={`${period} performance overview — ${dateRange}`}
          action={
            <div className="flex items-center gap-2 flex-wrap">
              {" "}
              {[
                { id: "revenue", label: "Revenue", color: T.primary },
                { id: "expenses", label: "Expenses", color: T.danger },
                { id: "profit", label: "Net Profit", color: T.success },
                { id: "all", label: "All", color: T.textSec },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setActiveChart(opt.id)}
                  className="px-3 py-1.5 rounded-card text-xs font-semibold transition-all duration-200"
                  style={{
                    background:
                      activeChart === opt.id ? opt.color + "18" : "transparent",
                    color: activeChart === opt.id ? opt.color : T.textSec,
                    border:
                      activeChart === opt.id
                        ? "1.5px solid " + opt.color + "60"
                        : "1.5px solid transparent",
                  }}
                >
                  {" "}
                  {opt.label}{" "}
                </button>
              ))}{" "}
              <button
                onClick={() => {
                  exportData(data, "revenue-trend");
                  toast.success("Chart exported");
                }}
                className="ml-2 px-3 py-1.5 rounded-card text-xs font-semibold flex items-center gap-1.5 transition-all hover:bg-gray-100"
                style={{ color: T.textSec, border: "1px solid " + T.border }}
              >
                {" "}
                <Download size={12} /> Export{" "}
              </button>{" "}
            </div>
          }
        >
          {" "}
          <ResponsiveContainer width="100%" height={320}>
            {" "}
            <AreaChart
              data={data}
              margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
            >
              {" "}
              <defs>
                {" "}
                {areaKeys.map((k) => (
                  <linearGradient
                    key={k.key}
                    id={"grad_" + k.key}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    {" "}
                    <stop
                      offset="0%"
                      stopColor={k.color}
                      stopOpacity={0.18}
                    />{" "}
                    <stop
                      offset="95%"
                      stopColor={k.color}
                      stopOpacity={0}
                    />{" "}
                  </linearGradient>
                ))}{" "}
              </defs>{" "}
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#F1F5F9"
                vertical={false}
              />{" "}
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: T.textSec }}
                axisLine={false}
                tickLine={false}
              />{" "}
              <YAxis
                tickFormatter={fmtK}
                tick={{ fontSize: 11, fill: T.textSec }}
                axisLine={false}
                tickLine={false}
                width={52}
              />{" "}
              <Tooltip content={<ChartTooltip />} />{" "}
              <Legend
                wrapperStyle={{
                  fontSize: 12,
                  color: T.textSec,
                  paddingTop: 12,
                }}
              />{" "}
              {areaKeys.map((k) => (
                <Area
                  key={k.key}
                  type="monotone"
                  dataKey={k.key}
                  name={k.name}
                  stroke={k.color}
                  strokeWidth={2.5}
                  fill={"url(#grad_" + k.key + ")"}
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff" }}
                />
              ))}{" "}
            </AreaChart>{" "}
          </ResponsiveContainer>{" "}
        </Card>{" "}
        {}{" "}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {" "}
          {}{" "}
          <div className="lg:col-span-3">
            {" "}
            <Card
              title="Revenue vs Expenses"
              subtitle="Side-by-side comparison by period"
              action={
                <button
                  onClick={() => {
                    exportData(data, "revenue-vs-expenses");
                    toast.success("Exported");
                  }}
                  className="px-3 py-1.5 rounded-card text-xs font-semibold flex items-center gap-1.5 transition-all hover:bg-gray-100"
                  style={{ color: T.textSec, border: "1px solid " + T.border }}
                >
                  {" "}
                  <Download size={12} /> Export{" "}
                </button>
              }
            >
              {" "}
              <ResponsiveContainer width="100%" height={280}>
                {" "}
                <BarChart
                  data={data}
                  margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                  barCategoryGap="30%"
                >
                  {" "}
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#F1F5F9"
                    vertical={false}
                  />{" "}
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: T.textSec }}
                    axisLine={false}
                    tickLine={false}
                  />{" "}
                  <YAxis
                    tickFormatter={fmtK}
                    tick={{ fontSize: 11, fill: T.textSec }}
                    axisLine={false}
                    tickLine={false}
                    width={48}
                  />{" "}
                  <Tooltip content={<ChartTooltip />} />{" "}
                  <Legend
                    wrapperStyle={{
                      fontSize: 12,
                      color: T.textSec,
                      paddingTop: 10,
                    }}
                  />{" "}
                  <Bar
                    dataKey="revenue"
                    name="Revenue"
                    fill={T.primary}
                    radius={[4, 4, 0, 0]}
                  />{" "}
                  <Bar
                    dataKey="expenses"
                    name="Expenses"
                    fill="#FCA5A5"
                    radius={[4, 4, 0, 0]}
                  />{" "}
                </BarChart>{" "}
              </ResponsiveContainer>{" "}
            </Card>{" "}
          </div>{" "}
          {}{" "}
          <div className="lg:col-span-2">
            {" "}
            <Card title="Expense Breakdown" subtitle="By category · All time">
              {" "}
              <ResponsiveContainer width="100%" height={200}>
                {" "}
                <PieChart>
                  {" "}
                  <Pie
                    data={EXPENSE_CATEGORIES}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    dataKey="value"
                    nameKey="name"
                    labelLine={false}
                    label={renderPieLabel}
                  >
                    {" "}
                    {EXPENSE_CATEGORIES.map((_, i) => (
                      <Cell
                        key={i}
                        fill={CHART_COLORS[i % CHART_COLORS.length]}
                      />
                    ))}{" "}
                  </Pie>{" "}
                  <Tooltip content={<ChartTooltip />} />{" "}
                </PieChart>{" "}
              </ResponsiveContainer>{" "}
              <div className="mt-2 space-y-2">
                {" "}
                {EXPENSE_CATEGORIES.slice(0, 5).map((cat, i) => (
                  <div
                    key={cat.name}
                    className="flex items-center justify-between"
                  >
                    {" "}
                    <div className="flex items-center gap-2">
                      {" "}
                      <div
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{
                          background: CHART_COLORS[i % CHART_COLORS.length],
                        }}
                      />{" "}
                      <span className="text-xs" style={{ color: T.textSec }}>
                        {" "}
                        {cat.name}{" "}
                      </span>{" "}
                    </div>{" "}
                    <div className="flex items-center gap-3">
                      {" "}
                      <div
                        className="w-20 h-1.5 rounded-full overflow-hidden"
                        style={{ background: "#F1F5F9" }}
                      >
                        {" "}
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: cat.pct + "%",
                            background: CHART_COLORS[i % CHART_COLORS.length],
                          }}
                        />{" "}
                      </div>{" "}
                      <span
                        className="text-xs font-bold tabular-nums w-8 text-right"
                        style={{ color: T.textPri }}
                      >
                        {" "}
                        {cat.pct}%{" "}
                      </span>{" "}
                    </div>{" "}
                  </div>
                ))}{" "}
              </div>{" "}
            </Card>{" "}
          </div>{" "}
        </div>{" "}
        {}{" "}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {" "}
          {}{" "}
          <Card title="Invoice Status" subtitle="Current breakdown">
            {" "}
            <ResponsiveContainer width="100%" height={180}>
              {" "}
              <PieChart>
                {" "}
                <Pie
                  data={INVOICE_STATUS}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  dataKey="value"
                  nameKey="name"
                  paddingAngle={3}
                >
                  {" "}
                  {INVOICE_STATUS.map((d, i) => (
                    <Cell key={i} fill={d.color} />
                  ))}{" "}
                </Pie>{" "}
                <Tooltip content={<ChartTooltip />} />{" "}
              </PieChart>{" "}
            </ResponsiveContainer>{" "}
            <div className="grid grid-cols-2 gap-2 mt-3">
              {" "}
              {INVOICE_STATUS.map((s) => (
                <div key={s.name} className="flex items-center gap-2">
                  {" "}
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: s.color }}
                  />{" "}
                  <span className="text-xs" style={{ color: T.textSec }}>
                    {" "}
                    {s.name}{" "}
                  </span>{" "}
                  <span
                    className="text-xs font-bold ml-auto tabular-nums"
                    style={{ color: T.textPri }}
                  >
                    {" "}
                    {s.value}{" "}
                  </span>{" "}
                </div>
              ))}{" "}
            </div>{" "}
          </Card>{" "}
          {}{" "}
          <Card title="Payment Methods" subtitle="By transaction volume">
            {" "}
            <div className="space-y-4 mt-1">
              {" "}
              {PAYMENT_METHODS.map((pm, i) => (
                <div key={pm.method}>
                  {" "}
                  <div className="flex justify-between items-center mb-1.5">
                    {" "}
                    <span
                      className="text-sm font-medium"
                      style={{ color: T.textPri }}
                    >
                      {" "}
                      {pm.method}{" "}
                    </span>{" "}
                    <div className="flex items-center gap-3">
                      {" "}
                      <span className="text-xs" style={{ color: T.textSec }}>
                        {" "}
                        {fmtK(pm.amount)}{" "}
                      </span>{" "}
                      <span
                        className="text-xs font-bold w-8 text-right tabular-nums"
                        style={{ color: T.textPri }}
                      >
                        {" "}
                        {pm.pct}%{" "}
                      </span>{" "}
                    </div>{" "}
                  </div>{" "}
                  <div
                    className="h-2 rounded-full overflow-hidden"
                    style={{ background: "#F1F5F9" }}
                  >
                    {" "}
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: pm.pct + "%",
                        background: CHART_COLORS[i % CHART_COLORS.length],
                      }}
                    />{" "}
                  </div>{" "}
                </div>
              ))}{" "}
            </div>{" "}
          </Card>{" "}
          {}{" "}
          <Card
            title="Collection Rate"
            subtitle="% of invoices collected on time"
          >
            {" "}
            <ResponsiveContainer width="100%" height={180}>
              {" "}
              <LineChart
                data={data}
                margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
              >
                {" "}
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#F1F5F9"
                  vertical={false}
                />{" "}
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 10, fill: T.textSec }}
                  axisLine={false}
                  tickLine={false}
                />{" "}
                <YAxis
                  domain={[75, 100]}
                  tick={{ fontSize: 10, fill: T.textSec }}
                  axisLine={false}
                  tickLine={false}
                />{" "}
                <Tooltip content={<ChartTooltip />} />{" "}
                <Line
                  type="monotone"
                  dataKey="collections"
                  name="Collection %"
                  stroke={T.teal}
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{
                    r: 5,
                    strokeWidth: 2,
                    stroke: "#fff",
                    fill: T.teal,
                  }}
                />{" "}
              </LineChart>{" "}
            </ResponsiveContainer>{" "}
            <div
              className="flex justify-between items-center mt-3 pt-3"
              style={{ borderTop: "1px solid " + T.border }}
            >
              {" "}
              <div className="text-center">
                {" "}
                <div
                  className="text-xl font-bold tabular-nums"
                  style={{ color: T.teal }}
                >
                  {" "}
                  {totals.collection}%{" "}
                </div>{" "}
                <div className="text-xs mt-0.5" style={{ color: T.textSec }}>
                  {" "}
                  Average{" "}
                </div>{" "}
              </div>{" "}
              <div className="text-center">
                {" "}
                <div
                  className="text-xl font-bold tabular-nums"
                  style={{ color: T.success }}
                >
                  {" "}
                  {Math.max(...data.map((d) => d.collections))}%{" "}
                </div>{" "}
                <div className="text-xs mt-0.5" style={{ color: T.textSec }}>
                  {" "}
                  Best Month{" "}
                </div>{" "}
              </div>{" "}
              <div className="text-center">
                {" "}
                <div
                  className="text-xl font-bold tabular-nums"
                  style={{ color: T.warning }}
                >
                  {" "}
                  {Math.min(...data.map((d) => d.collections))}%{" "}
                </div>{" "}
                <div className="text-xs mt-0.5" style={{ color: T.textSec }}>
                  {" "}
                  Lowest{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </Card>{" "}
        </div>{" "}
        {}{" "}
        <Card
          title="Top Customers by Revenue"
          subtitle="Ranked by total billed amount"
          action={
            <button
              onClick={() => {
                exportData(TOP_CUSTOMERS, "top-customers");
                toast.success("Customer report exported");
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-card transition-all hover:opacity-90"
              style={{
                background: T.primary + "12",
                color: T.primary,
                border: "1px solid " + T.primary + "30",
              }}
            >
              {" "}
              <Download size={13} /> Export{" "}
            </button>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid " + T.border }}>
                  {[
                    "#",
                    "Customer",
                    "Total Revenue",
                    "Invoices",
                    "Avg Invoice",
                    "Status",
                    "Growth",
                  ].map((h) => (
                    <th
                      key={h}
                      className="pb-3 text-left text-xs font-semibold uppercase tracking-wider"
                      style={{ color: T.textSec }}
                    >
                      {h}{" "}
                    </th>
                  ))}</tr></thead>{" "}
              <tbody>
                {TOP_CUSTOMERS.map((c, i) => (
                  <tr
                    key={c.name}
                    className="group transition-colors duration-150"
                    style={{
                      borderBottom:
                        i < TOP_CUSTOMERS.length - 1
                          ? "1px solid " + T.border
                          : "none",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#F8FAFC")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <td className="py-4">
                      <span
                        className="w-7 h-7 rounded-card text-xs font-bold flex items-center justify-center"
                        style={{
                          background: i < 3 ? T.primary + "12" : "#F1F5F9",
                          color: i < 3 ? T.primary : T.textSec,
                        }}
                      >
                        {i + 1}{" "}
                      </span>{" "}
                    </td>{" "}
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-card flex items-center justify-center text-xs font-bold text-white"
                          style={{
                            background: `hsl(${(c.name.charCodeAt(0) * 37) % 360}, 55%, 52%)`,
                          }}
                        >
                          {" "}
                          {c.name.charAt(0)}{" "}
                        </div>{" "}
                        <span
                          className="text-sm font-semibold"
                          style={{ color: T.textPri }}
                        >
                          {c.name}{" "}
                        </span>{" "}
                      </div>{" "}
                    </td>{" "}
                    <td className="py-4 pr-4">
                      <span
                        className="text-sm font-bold tabular-nums"
                        style={{ color: T.textPri }}
                      >
                        {fmt(c.revenue)}{" "}
                      </span>{" "}
                    </td>{" "}
                    <td className="py-4 pr-4">
                      <span
                        className="text-sm tabular-nums"
                        style={{ color: T.textSec }}
                      >
                        {c.invoices}{" "}
                      </span>{" "}
                    </td>{" "}
                    <td className="py-4 pr-4">
                      <span
                        className="text-sm tabular-nums font-medium"
                        style={{ color: T.textPri }}
                      >
                        {fmt(Math.round(c.revenue / c.invoices))}{" "}
                      </span>{" "}
                    </td>{" "}
                    <td className="py-4 pr-4">
                      <CustBadge status={c.status} />{" "}
                    </td>{" "}
                    <td className="py-4">
                      <div
                        className={`flex items-center gap-1 text-sm font-bold tabular-nums ${c.growth >= 0 ? "text-green-600" : "text-red-500"}`}
                      >
                        {c.growth >= 0 ? (
                          <ArrowUpRight size={14} />
                        ) : (
                          <ArrowDownRight size={14} />
                        )}{" "}
                        {Math.abs(c.growth)}%{" "}
                      </div>{" "}
                    </td></tr>
                ))}</tbody></table>{" "}
          </div>{" "}
        </Card>{" "}
        {}{" "}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {}{" "}
          <div className="lg:col-span-2">
            {" "}
            <Card
              title="Net Profit Trend"
              subtitle="Profit trajectory and growth"
            >
              {" "}
              <ResponsiveContainer width="100%" height={220}>
                {" "}
                <AreaChart
                  data={data}
                  margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                >
                  {" "}
                  <defs>
                    {" "}
                    <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                      {" "}
                      <stop
                        offset="0%"
                        stopColor={T.success}
                        stopOpacity={0.2}
                      />{" "}
                      <stop
                        offset="95%"
                        stopColor={T.success}
                        stopOpacity={0}
                      />{" "}
                    </linearGradient>{" "}
                  </defs>{" "}
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#F1F5F9"
                    vertical={false}
                  />{" "}
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: T.textSec }}
                    axisLine={false}
                    tickLine={false}
                  />{" "}
                  <YAxis
                    tickFormatter={fmtK}
                    tick={{ fontSize: 11, fill: T.textSec }}
                    axisLine={false}
                    tickLine={false}
                    width={52}
                  />{" "}
                  <Tooltip content={<ChartTooltip />} />{" "}
                  <Area
                    type="monotone"
                    dataKey="profit"
                    name="Net Profit"
                    stroke={T.success}
                    strokeWidth={2.5}
                    fill="url(#profitGrad)"
                    dot={false}
                    activeDot={{
                      r: 5,
                      strokeWidth: 2,
                      stroke: "#fff",
                      fill: T.success,
                    }}
                  />{" "}
                </AreaChart>{" "}
              </ResponsiveContainer>{" "}
            </Card>{" "}
          </div>{" "}
          {}{" "}
          <div className="lg:col-span-1">
            {" "}
            <Card
              title="Quick Stats"
              subtitle="Key financial highlights"
              className="h-full"
            >
              {" "}
              <div className="space-y-4">
                {" "}
                {[
                  {
                    label: "Highest Revenue Month",
                    value: fmtK(Math.max(...data.map((d) => d.revenue))),
                    icon: TrendingUp,
                    color: T.primary,
                  },
                  {
                    label: "Highest Expense Month",
                    value: fmtK(Math.max(...data.map((d) => d.expenses))),
                    icon: TrendingDown,
                    color: T.danger,
                  },
                  {
                    label: "Best Profit Month",
                    value: fmtK(Math.max(...data.map((d) => d.profit))),
                    icon: Award,
                    color: T.success,
                  },
                  {
                    label: "Avg Monthly Revenue",
                    value: fmtK(Math.round(totals.revenue / data.length)),
                    icon: BarChart2,
                    color: T.teal,
                  },
                  {
                    label: "Total Invoices Raised",
                    value: totals.invoices.toLocaleString(),
                    icon: FileText,
                    color: T.purple,
                  },
                  {
                    label: "Profit Margin",
                    value: totals.margin + "%",
                    icon: Activity,
                    color: T.warning,
                  },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="flex items-center gap-3 group">
                    {" "}
                    <div
                      className="w-9 h-9 rounded-card flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                      style={{ background: color + "15" }}
                    >
                      {" "}
                      <Icon size={16} style={{ color }} />{" "}
                    </div>{" "}
                    <div className="flex-1 min-w-0">
                      {" "}
                      <div
                        className="text-xs truncate"
                        style={{ color: T.textSec }}
                      >
                        {" "}
                        {label}{" "}
                      </div>{" "}
                      <div
                        className="text-sm font-bold tabular-nums"
                        style={{ color: T.textPri }}
                      >
                        {" "}
                        {value}{" "}
                      </div>{" "}
                    </div>{" "}
                  </div>
                ))}{" "}
              </div>{" "}
            </Card>{" "}
          </div>{" "}
        </div>{" "}
        {}{" "}
        <Card
          title={`${period} Performance Breakdown`}
          subtitle="Detailed period-by-period financial summary"
          action={
            <button
              onClick={() => {
                exportData(data, "performance-breakdown");
                toast.success("Table exported");
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-card transition-all hover:opacity-90"
              style={{
                background: T.primary + "12",
                color: T.primary,
                border: "1px solid " + T.primary + "30",
              }}
            >
              {" "}
              <Download size={13} /> Export{" "}
            </button>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid " + T.border }}>
                  {[
                    "Period",
                    "Revenue",
                    "Expenses",
                    "Net Profit",
                    "Invoices",
                    "Collection %",
                    "Margin",
                  ].map((h) => (
                    <th
                      key={h}
                      className="pb-3 text-left text-xs font-semibold uppercase tracking-wider"
                      style={{ color: T.textSec }}
                    >
                      {h}{" "}
                    </th>
                  ))}</tr></thead>{" "}
              <tbody>
                {data.map((row, i) => {
                  const margin = Math.round((row.profit / row.revenue) * 100);
                  const isLast = i === data.length - 1;
                  return (
                    <tr
                      key={row.month}
                      style={{
                        borderBottom: !isLast
                          ? "1px solid " + T.border
                          : "none",
                        background: i % 2 === 0 ? "#fff" : "#FAFBFD",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#EFF6FF")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background =
                          i % 2 === 0 ? "#fff" : "#FAFBFD")
                      }
                    >
                      <td
                        className="py-3.5 font-semibold"
                        style={{ color: T.textPri }}
                      >
                        {row.month}{" "}
                      </td>{" "}
                      <td
                        className="py-3.5 tabular-nums font-medium"
                        style={{ color: T.primary }}
                      >
                        {fmtK(row.revenue)}{" "}
                      </td>{" "}
                      <td
                        className="py-3.5 tabular-nums"
                        style={{ color: T.danger }}
                      >
                        {fmtK(row.expenses)}{" "}
                      </td>{" "}
                      <td
                        className="py-3.5 tabular-nums font-bold"
                        style={{ color: T.success }}
                      >
                        {fmtK(row.profit)}{" "}
                      </td>{" "}
                      <td
                        className="py-3.5 tabular-nums"
                        style={{ color: T.textSec }}
                      >
                        {row.invoices}{" "}
                      </td>{" "}
                      <td className="py-3.5">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-16 h-1.5 rounded-full overflow-hidden"
                            style={{ background: "#F1F5F9" }}
                          >
                            {" "}
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: row.collections + "%",
                                background:
                                  row.collections >= 95
                                    ? T.success
                                    : row.collections >= 90
                                      ? T.teal
                                      : T.warning,
                              }}
                            />{" "}
                          </div>{" "}
                          <span
                            className="tabular-nums text-xs font-semibold"
                            style={{
                              color:
                                row.collections >= 95 ? T.success : T.textSec,
                            }}
                          >
                            {row.collections}%{" "}
                          </span>{" "}
                        </div>{" "}
                      </td>{" "}
                      <td className="py-3.5">
                        <span
                          className="px-2.5 py-1 rounded-full text-xs font-bold tabular-nums"
                          style={{
                            background:
                              margin >= 45
                                ? T.success + "18"
                                : margin >= 30
                                  ? T.teal + "18"
                                  : T.warning + "18",
                            color:
                              margin >= 45
                                ? T.success
                                : margin >= 30
                                  ? T.teal
                                  : T.warning,
                          }}
                        >
                          {margin}%{" "}
                        </span>{" "}
                      </td></tr>
                  );
                })}</tbody>{" "}
              {}{" "}
              <tfoot>
                <tr
                  style={{
                    borderTop: "2px solid " + T.border,
                    background: "#EFF6FF",
                  }}
                >
                  <td className="py-4 font-bold" style={{ color: T.textPri }}>
                    TOTAL{" "}
                  </td>{" "}
                  <td
                    className="py-4 tabular-nums font-bold"
                    style={{ color: T.primary }}
                  >
                    {fmtK(totals.revenue)}{" "}
                  </td>{" "}
                  <td
                    className="py-4 tabular-nums font-bold"
                    style={{ color: T.danger }}
                  >
                    {fmtK(totals.expenses)}{" "}
                  </td>{" "}
                  <td
                    className="py-4 tabular-nums font-bold"
                    style={{ color: T.success }}
                  >
                    {fmtK(totals.profit)}{" "}
                  </td>{" "}
                  <td
                    className="py-4 tabular-nums font-bold"
                    style={{ color: T.textPri }}
                  >
                    {totals.invoices}{" "}
                  </td>{" "}
                  <td
                    className="py-4 tabular-nums font-bold"
                    style={{ color: T.teal }}
                  >
                    {totals.collection}%{" "}
                  </td>{" "}
                  <td className="py-4">
                    <span
                      className="px-2.5 py-1 rounded-full text-xs font-bold"
                      style={{ background: T.primary + "18", color: T.primary }}
                    >
                      {totals.margin}%{" "}
                    </span>{" "}
                  </td></tr></tfoot></table>{" "}
          </div>{" "}
        </Card>{" "}
      </div>{" "}
    </div>
  );
}
