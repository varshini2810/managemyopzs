import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import {
  Plus,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Eye,
  Edit2,
  Trash2,
  Download,
  Copy,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  ChevronUp,
  ChevronDown,
  Filter,
  RefreshCw,
  Printer,
  Mail,
  SlidersHorizontal,
  Columns,
  Check,
  Minus,
  FileDown,
  FileUp,
  BarChart2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Tag,
  Paperclip,
  Upload,
  Image,
  Star,
  Ban,
  RotateCcw,
  ShoppingBag,
  Car,
  Home,
  Cpu,
  Megaphone,
  Briefcase,
  Wrench,
  Coffee,
  Package,
  Layers,
  Users,
  Building2,
  CreditCard,
  Receipt,
  Banknote,
  PieChart,
  Activity,
} from "lucide-react";
import toast from "react-hot-toast";
const fmt = (v, cur = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: cur,
    maximumFractionDigits: 2,
  }).format(v || 0);
const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";
const today = () => new Date().toISOString().slice(0, 10);
const uid = () => "EXP-" + String(Math.floor(Math.random() * 90000) + 10000);
const PAYMENT_METHODS = [
  "Credit Card",
  "Debit Card",
  "Bank Transfer",
  "Cash",
  "Cheque",
  "UPI",
  "Wire",
  "PayPal",
];
const CURRENCIES = ["USD", "EUR", "GBP", "INR", "CAD", "AUD", "SGD"];
const DEPARTMENTS = [
  "Engineering",
  "Marketing",
  "Sales",
  "HR",
  "Finance",
  "Operations",
  "Design",
  "Legal",
];
const EMPLOYEES = [
  "Alice Johnson",
  "Bob Martinez",
  "Carol White",
  "David Lee",
  "Emma Davis",
  "Frank Wilson",
];
const CATEGORIES = [
  {
    id: "office",
    label: "Office Supplies",
    icon: ShoppingBag,
    color: "#4F46E5",
    bg: "#EEF2FF",
  },
  { id: "travel", label: "Travel", icon: Car, color: "#0891B2", bg: "#ECFEFF" },
  { id: "rent", label: "Rent", icon: Home, color: "#059669", bg: "#ECFDF5" },
  {
    id: "software",
    label: "Software",
    icon: Cpu,
    color: "#7C3AED",
    bg: "#F5F3FF",
  },
  {
    id: "marketing",
    label: "Marketing",
    icon: Megaphone,
    color: "#DB2777",
    bg: "#FDF2F8",
  },
  {
    id: "professional",
    label: "Professional Services",
    icon: Briefcase,
    color: "#D97706",
    bg: "#FFFBEB",
  },
  {
    id: "maintenance",
    label: "Maintenance",
    icon: Wrench,
    color: "#DC2626",
    bg: "#FEF2F2",
  },
  {
    id: "food",
    label: "Food & Dining",
    icon: Coffee,
    color: "#EA580C",
    bg: "#FFF7ED",
  },
  {
    id: "utilities",
    label: "Utilities",
    icon: Layers,
    color: "#0D9488",
    bg: "#F0FDFA",
  },
  {
    id: "salary",
    label: "Salary",
    icon: Users,
    color: "#16A34A",
    bg: "#F0FDF4",
  },
  {
    id: "transport",
    label: "Transportation",
    icon: Package,
    color: "#2563EB",
    bg: "#EFF6FF",
  },
  { id: "other", label: "Other", icon: Star, color: "#6B7280", bg: "#F9FAFB" },
];
const STATUS_CFG = {
  approved: {
    label: "Approved",
    color: "#15803D",
    bg: "#DCFCE7",
    dot: "#16A34A",
  },
  pending: {
    label: "Pending",
    color: "#A16207",
    bg: "#FEF9C3",
    dot: "#CA8A04",
  },
  rejected: {
    label: "Rejected",
    color: "#B91C1C",
    bg: "#FEE2E2",
    dot: "#DC2626",
  },
  reimbursed: {
    label: "Reimbursed",
    color: "#1D4ED8",
    bg: "#DBEAFE",
    dot: "#2563EB",
  },
  draft: { label: "Draft", color: "#374151", bg: "#F3F4F6", dot: "#6B7280" },
};
const mkExp = (
  id,
  cat,
  desc,
  vendor,
  emp,
  dept,
  amt,
  tax,
  pm,
  date,
  status,
  notes = "",
  receipt = false,
  tags = [],
) => ({
  id,
  category: cat,
  description: desc,
  vendor,
  employee: emp,
  department: dept,
  amount: amt,
  tax,
  currency: "USD",
  paymentMethod: pm,
  date,
  status,
  notes,
  receipt,
  tags,
  invoiceNum: "",
  createdDate: date,
  recurring: false,
  approvedBy: status === "approved" ? "Finance Manager" : "",
  auditLog: [
    { action: "Created", by: emp, at: date, note: "Expense submitted" },
  ],
});
const SEED = [
  mkExp(
    "EXP-10001",
    "office",
    "Printer Cartridges & Paper",
    "Staples Inc.",
    "Alice Johnson",
    "Engineering",
    250.0,
    0,
    "Credit Card",
    "2024-06-01",
    "approved",
    "Q2 office restock",
    true,
    ["q2", "office"],
  ),
  mkExp(
    "EXP-10002",
    "travel",
    "Flight to NYC Conference",
    "Delta Airlines",
    "Bob Martinez",
    "Sales",
    1420.0,
    0,
    "Credit Card",
    "2024-06-03",
    "approved",
    "SaaS Summit 2024",
    true,
    ["conference", "travel"],
  ),
  mkExp(
    "EXP-10003",
    "software",
    "Figma Annual License",
    "Figma Inc.",
    "Carol White",
    "Design",
    576.0,
    103.68,
    "Bank Transfer",
    "2024-06-05",
    "approved",
    "Team license renewal",
    false,
    ["software", "design"],
  ),
  mkExp(
    "EXP-10004",
    "food",
    "Client Dinner - Q2 Review",
    "The Capital Grille",
    "David Lee",
    "Sales",
    342.5,
    0,
    "Credit Card",
    "2024-06-07",
    "pending",
    "Client entertainment",
    true,
    ["client", "entertainment"],
  ),
  mkExp(
    "EXP-10005",
    "marketing",
    "Google Ads Campaign",
    "Google LLC",
    "Emma Davis",
    "Marketing",
    3200.0,
    576,
    "Credit Card",
    "2024-06-08",
    "approved",
    "Summer campaign spend",
    false,
    ["ads", "q2"],
  ),
  mkExp(
    "EXP-10006",
    "rent",
    "Office Rent - June",
    "Regus Workspaces",
    "Alice Johnson",
    "Finance",
    4500.0,
    0,
    "Bank Transfer",
    "2024-06-01",
    "approved",
    "Monthly office rent",
    true,
    ["rent", "monthly"],
  ),
  mkExp(
    "EXP-10007",
    "travel",
    "Hotel - NYC Stay 3 nights",
    "Marriott Hotels",
    "Bob Martinez",
    "Sales",
    820.0,
    0,
    "Credit Card",
    "2024-06-04",
    "approved",
    "3 nights for conference",
    true,
    ["hotel", "conference"],
  ),
  mkExp(
    "EXP-10008",
    "professional",
    "Legal Consultation",
    "Smith & Co. Law",
    "Frank Wilson",
    "Legal",
    1800.0,
    324,
    "Bank Transfer",
    "2024-06-10",
    "pending",
    "Contract review",
    false,
    ["legal"],
  ),
  mkExp(
    "EXP-10009",
    "software",
    "AWS EC2 Monthly Bill",
    "Amazon Web Services",
    "Carol White",
    "Engineering",
    2340.0,
    421.2,
    "Credit Card",
    "2024-06-01",
    "reimbursed",
    "Monthly cloud spend",
    true,
    ["aws", "cloud", "monthly"],
  ),
  mkExp(
    "EXP-10010",
    "utilities",
    "Internet & Phone Bill",
    "AT&T",
    "Alice Johnson",
    "Operations",
    290.0,
    0,
    "Bank Transfer",
    "2024-06-02",
    "approved",
    "Monthly utilities",
    false,
    ["utilities", "monthly"],
  ),
  mkExp(
    "EXP-10011",
    "transport",
    "Cab Reimbursements - June",
    "Uber Business",
    "Emma Davis",
    "Marketing",
    180.5,
    0,
    "Cash",
    "2024-06-15",
    "pending",
    "Team cabs for event",
    false,
    ["transport"],
  ),
  mkExp(
    "EXP-10012",
    "maintenance",
    "HVAC Repair & Service",
    "CoolAir Systems",
    "Frank Wilson",
    "Operations",
    1150.0,
    207,
    "Cheque",
    "2024-06-12",
    "approved",
    "Annual AC service",
    true,
    ["maintenance"],
  ),
  mkExp(
    "EXP-10013",
    "marketing",
    "LinkedIn Ads",
    "LinkedIn Corp.",
    "Emma Davis",
    "Marketing",
    950.0,
    171,
    "Credit Card",
    "2024-06-09",
    "approved",
    "B2B targeting campaign",
    false,
    ["ads", "linkedin"],
  ),
  mkExp(
    "EXP-10014",
    "food",
    "Team Lunch - Sprint Planning",
    "Chipotle",
    "David Lee",
    "Engineering",
    145.8,
    0,
    "Cash",
    "2024-06-18",
    "pending",
    "Sprint kickoff lunch",
    false,
    ["team", "food"],
  ),
  mkExp(
    "EXP-10015",
    "office",
    "Ergonomic Chairs (x3)",
    "Herman Miller",
    "Alice Johnson",
    "Engineering",
    1890.0,
    0,
    "Credit Card",
    "2024-06-20",
    "rejected",
    "Over budget limit",
    false,
    ["furniture"],
  ),
  mkExp(
    "EXP-10016",
    "software",
    "Slack Premium Annual",
    "Slack Technologies",
    "Carol White",
    "Engineering",
    768.0,
    138.24,
    "Credit Card",
    "2024-05-01",
    "reimbursed",
    "Team comms tool",
    true,
    ["software", "monthly"],
  ),
  mkExp(
    "EXP-10017",
    "travel",
    "Train Pass - Monthly",
    "Amtrak",
    "Bob Martinez",
    "Sales",
    120.0,
    0,
    "Debit Card",
    "2024-06-01",
    "approved",
    "Commuter pass",
    false,
    ["transport", "monthly"],
  ),
  mkExp(
    "EXP-10018",
    "professional",
    "Accountant Fees - Q2",
    "Deloitte LLP",
    "Frank Wilson",
    "Finance",
    5500.0,
    990,
    "Bank Transfer",
    "2024-06-25",
    "pending",
    "Q2 audit & tax filing",
    false,
    ["accounting", "q2"],
  ),
  mkExp(
    "EXP-10019",
    "marketing",
    "Trade Show Booth Rental",
    "ExpoCenter",
    "Emma Davis",
    "Marketing",
    2800.0,
    504,
    "Bank Transfer",
    "2024-06-14",
    "approved",
    "TechSummit booth",
    true,
    ["event", "marketing"],
  ),
  mkExp(
    "EXP-10020",
    "software",
    "Notion Team Plan",
    "Notion Labs",
    "Carol White",
    "Design",
    192.0,
    34.56,
    "Credit Card",
    "2024-06-01",
    "approved",
    "Annual team plan",
    false,
    ["software", "productivity"],
  ),
];
function useCounter(target, duration = 800) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0,
      step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setVal(target);
        clearInterval(timer);
      } else setVal(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return val;
}
function StatusBadge({ status }) {
  const s = (status || "").toLowerCase();
  const c = STATUS_CFG[s] || {
    label: status,
    color: "#374151",
    bg: "#F3F4F6",
    dot: "#6B7280",
  };
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap"
      style={{ background: c.bg, color: c.color }}
    >
      {" "}
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: c.dot }}
      />{" "}
      {c.label}{" "}
    </span>
  );
}
function CatBadge({ categoryId }) {
  const cat =
    CATEGORIES.find((c) => c.id === categoryId) ||
    CATEGORIES[CATEGORIES.length - 1];
  const Icon = cat.icon;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold whitespace-nowrap"
      style={{ background: cat.bg, color: cat.color }}
    >
      {" "}
      <Icon size={11} /> {cat.label}{" "}
    </span>
  );
}
function SummaryMetric({ label, value, color, icon: Icon }) {
  const rawNum = parseFloat(value.replace(/[^0-9.]/g, "")) || 0;
  const counted = useCounter(rawNum * 100) / 100;
  const display = value.startsWith("$")
    ? fmt(counted)
    : counted.toLocaleString();
  return (
    <div className="flex flex-col gap-1.5">
      {" "}
      <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
        {" "}
        <Icon size={13} style={{ color }} /> {label}{" "}
      </div>{" "}
      <div
        className="text-2xl font-bold tabular-nums leading-tight"
        style={{ color }}
      >
        {" "}
        {display}{" "}
      </div>{" "}
    </div>
  );
}
function MiniBarChart({ data, color = "#4F46E5", height = 60 }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data.map((d) => d.value), 1);
  const w = 100 / data.length;
  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 100 ${height}`}
      preserveAspectRatio="none"
    >
      {" "}
      {data.map((d, i) => {
        const barH = (d.value / max) * (height - 8);
        return (
          <g key={i}>
            {" "}
            <rect
              x={i * w + w * 0.1}
              y={height - barH - 4}
              width={w * 0.8}
              height={barH}
              fill={color}
              rx="2"
              opacity="0.85"
            />{" "}
          </g>
        );
      })}{" "}
    </svg>
  );
}
function SortTh({ label, field, sort, onSort, align = "left" }) {
  const active = sort.field === field;
  return (
    <th
      onClick={() => onSort(field)}
      style={{ textAlign: align, background: "#F8FAFC" }}
      className="px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap cursor-pointer select-none group hover:bg-indigo-50 transition-colors"
    >
      <span className="inline-flex items-center gap-1 group-hover:text-indigo-600 transition-colors">
        {" "}
        {label}{" "}
        <span className="inline-flex flex-col">
          {" "}
          <ChevronUp
            size={9}
            style={{
              display: "block",
              color: active && sort.dir === "asc" ? "#4F46E5" : "#CBD5E1",
            }}
          />{" "}
          <ChevronDown
            size={9}
            style={{
              display: "block",
              marginTop: -2,
              color: active && sort.dir === "desc" ? "#4F46E5" : "#CBD5E1",
            }}
          />{" "}
        </span>{" "}
      </span>{" "}
    </th>
  );
}
function ActionMenu({
  row,
  onView,
  onEdit,
  onDuplicate,
  onApprove,
  onReject,
  onDelete,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const h = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);
  const items = [
    { label: "View Details", icon: Eye, fn: onView, cls: "text-gray-700" },
    { label: "Edit", icon: Edit2, fn: onEdit, cls: "text-gray-700" },
    { label: "Duplicate", icon: Copy, fn: onDuplicate, cls: "text-gray-700" },
    null,
    {
      label: "Approve",
      icon: CheckCircle,
      fn: onApprove,
      cls: "text-green-700",
    },
    { label: "Reject", icon: Ban, fn: onReject, cls: "text-orange-600" },
    null,
    {
      label: "Download PDF",
      icon: Download,
      fn: () => toast.success("PDF downloaded"),
      cls: "text-gray-700",
    },
    {
      label: "Print",
      icon: Printer,
      fn: () => window.print(),
      cls: "text-gray-700",
    },
    null,
    { label: "Delete", icon: Trash2, fn: onDelete, cls: "text-red-600" },
  ];
  return (
    <div className="relative" ref={ref} onClick={(e) => e.stopPropagation()}>
      {" "}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
      >
        {" "}
        <MoreVertical size={15} />{" "}
      </button>{" "}
      {open && (
        <div
          className="absolute right-0 top-full mt-1 bg-white rounded-xl z-50 py-1.5"
          style={{
            minWidth: 180,
            boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
            border: "1px solid #E5E7EB",
          }}
        >
          {" "}
          {items.map((item, i) =>
            item === null ? (
              <div key={i} className="my-1 border-t border-gray-100" />
            ) : (
              <button
                key={item.label}
                onClick={() => {
                  item.fn?.(row);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${item.cls}`}
              >
                {" "}
                <item.icon size={13} /> {item.label}{" "}
              </button>
            ),
          )}{" "}
        </div>
      )}{" "}
    </div>
  );
}
function ExpenseModal({ open, initial, onClose, onSave, onSaveAnother }) {
  const isEdit = !!initial?.id;
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [receiptPreview, setReceiptPreview] = useState(null);
  const fileRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    setErrors({});
    setReceiptPreview(null);
    setForm({
      id: uid(),
      category: "office",
      vendor: "",
      employee: "Alice Johnson",
      department: "Engineering",
      amount: "",
      tax: "0",
      currency: "USD",
      paymentMethod: "Credit Card",
      date: today(),
      invoiceNum: "",
      description: "",
      notes: "",
      tags: "",
      status: "pending",
      recurring: false,
      receipt: false,
      receiptUrl: "",
      ...initial,
      tags: Array.isArray(initial?.tags)
        ? initial.tags.join(", ")
        : initial?.tags || "",
    });
  }, [open, initial]);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large. Max 5MB.");
      return;
    }
    const url = URL.createObjectURL(file);
    setReceiptPreview({ url, name: file.name, type: file.type });
    set("receipt", true);
    toast.success("Receipt uploaded: " + file.name);
  };
  const validate = () => {
    const e = {};
    if (!form.category) e.category = "Required";
    if (!form.description?.trim()) e.description = "Required";
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0)
      e.amount = "Enter a valid amount";
    if (Number(form.amount) > 100000)
      e.amount = "Amount exceeds limit ($100,000)";
    if (!form.date) e.date = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const buildExpense = (asDraft) => ({
    ...form,
    amount: Number(form.amount),
    tax: Number(form.tax) || 0,
    status: asDraft ? "draft" : form.status || "pending",
    tags: form.tags
      ? form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [],
    createdDate: initial?.createdDate || today(),
    auditLog: [
      ...(initial?.auditLog || []),
      {
        action: isEdit ? "Updated" : "Created",
        by: form.employee,
        at: today(),
        note: isEdit ? "Expense edited" : "Expense submitted",
      },
    ],
  });
  if (!open) return null;
  const totalWithTax = (Number(form.amount) || 0) + (Number(form.tax) || 0);
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(15,20,40,0.55)" }}
    >
      {" "}
      <div
        className="bg-white rounded-2xl flex flex-col"
        style={{
          width: "100%",
          maxWidth: 760,
          maxHeight: "94vh",
          boxShadow: "0 32px 80px rgba(0,0,0,0.25)",
        }}
      >
        {" "}
        {}{" "}
        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100">
          {" "}
          <div className="flex items-center gap-3">
            {" "}
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)",
              }}
            >
              {" "}
              <Banknote size={20} className="text-white" />{" "}
            </div>{" "}
            <div>
              {" "}
              <h2 className="text-xl font-bold text-gray-900">
                {" "}
                {isEdit ? "Edit Expense" : "Add Expense"}{" "}
              </h2>{" "}
              <p className="text-sm text-gray-500 mt-0.5">
                {" "}
                {isEdit
                  ? "Update expense details"
                  : "Fill in the details to record a new expense"}{" "}
              </p>{" "}
            </div>{" "}
          </div>{" "}
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 transition-all"
          >
            {" "}
            <X size={18} />{" "}
          </button>{" "}
        </div>{" "}
        {}{" "}
        <div className="flex-1 overflow-y-auto px-7 py-6">
          {" "}
          <div className="grid grid-cols-2 gap-5">
            {" "}
            {}{" "}
            <div>
              {" "}
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                {" "}
                Expense Category *{" "}
              </label>{" "}
              <select
                className={
                  "w-full text-sm border rounded-xl px-3.5 py-2.5 focus:outline-none bg-white transition-all " +
                  (errors.category
                    ? "border-red-400"
                    : "border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100")
                }
                value={form.category || ""}
                onChange={(e) => set("category", e.target.value)}
              >
                {" "}
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {" "}
                    {c.label}{" "}
                  </option>
                ))}{" "}
              </select>{" "}
              {errors.category && (
                <p className="text-xs text-red-500 mt-1">{errors.category}</p>
              )}{" "}
            </div>{" "}
            {}{" "}
            <div>
              {" "}
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                {" "}
                Vendor / Merchant{" "}
              </label>{" "}
              <input
                className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                value={form.vendor || ""}
                onChange={(e) => set("vendor", e.target.value)}
                placeholder="Vendor name"
              />{" "}
            </div>{" "}
            {}{" "}
            <div>
              {" "}
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                {" "}
                Employee{" "}
              </label>{" "}
              <select
                className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-400 bg-white"
                value={form.employee || ""}
                onChange={(e) => set("employee", e.target.value)}
              >
                {" "}
                {EMPLOYEES.map((e) => (
                  <option key={e}>{e}</option>
                ))}{" "}
              </select>{" "}
            </div>{" "}
            {}{" "}
            <div>
              {" "}
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                {" "}
                Department{" "}
              </label>{" "}
              <select
                className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-400 bg-white"
                value={form.department || ""}
                onChange={(e) => set("department", e.target.value)}
              >
                {" "}
                {DEPARTMENTS.map((d) => (
                  <option key={d}>{d}</option>
                ))}{" "}
              </select>{" "}
            </div>{" "}
            {}{" "}
            <div>
              {" "}
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                {" "}
                Amount *{" "}
              </label>{" "}
              <div className="relative">
                {" "}
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm">
                  {" "}
                  ${" "}
                </span>{" "}
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className={
                    "w-full text-sm border rounded-xl pl-8 pr-3.5 py-2.5 focus:outline-none transition-all " +
                    (errors.amount
                      ? "border-red-400 focus:ring-2 focus:ring-red-100"
                      : "border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100")
                  }
                  value={form.amount || ""}
                  onChange={(e) => set("amount", e.target.value)}
                  placeholder="0.00"
                />{" "}
              </div>{" "}
              {errors.amount && (
                <p className="text-xs text-red-500 mt-1">{errors.amount}</p>
              )}{" "}
            </div>{" "}
            {}{" "}
            <div>
              {" "}
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                {" "}
                Tax Amount{" "}
              </label>{" "}
              <div className="relative">
                {" "}
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm">
                  {" "}
                  ${" "}
                </span>{" "}
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full text-sm border border-gray-200 rounded-xl pl-8 pr-3.5 py-2.5 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  value={form.tax || ""}
                  onChange={(e) => set("tax", e.target.value)}
                  placeholder="0.00"
                />{" "}
              </div>{" "}
            </div>{" "}
            {}{" "}
            <div>
              {" "}
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                {" "}
                Currency{" "}
              </label>{" "}
              <select
                className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-400 bg-white"
                value={form.currency || "USD"}
                onChange={(e) => set("currency", e.target.value)}
              >
                {" "}
                {CURRENCIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}{" "}
              </select>{" "}
            </div>{" "}
            {}{" "}
            <div>
              {" "}
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                {" "}
                Payment Method{" "}
              </label>{" "}
              <select
                className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-400 bg-white"
                value={form.paymentMethod || ""}
                onChange={(e) => set("paymentMethod", e.target.value)}
              >
                {" "}
                {PAYMENT_METHODS.map((m) => (
                  <option key={m}>{m}</option>
                ))}{" "}
              </select>{" "}
            </div>{" "}
            {}{" "}
            <div>
              {" "}
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                {" "}
                Expense Date *{" "}
              </label>{" "}
              <input
                type="date"
                className={
                  "w-full text-sm border rounded-xl px-3.5 py-2.5 focus:outline-none transition-all " +
                  (errors.date
                    ? "border-red-400"
                    : "border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100")
                }
                value={form.date || ""}
                onChange={(e) => set("date", e.target.value)}
              />{" "}
              {errors.date && (
                <p className="text-xs text-red-500 mt-1">{errors.date}</p>
              )}{" "}
            </div>{" "}
            {}{" "}
            <div>
              {" "}
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                {" "}
                Invoice Number{" "}
              </label>{" "}
              <input
                className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                value={form.invoiceNum || ""}
                onChange={(e) => set("invoiceNum", e.target.value)}
                placeholder="INV-001"
              />{" "}
            </div>{" "}
            {}{" "}
            <div>
              {" "}
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                {" "}
                Status{" "}
              </label>{" "}
              <select
                className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-400 bg-white"
                value={form.status || "pending"}
                onChange={(e) => set("status", e.target.value)}
              >
                {" "}
                {Object.entries(STATUS_CFG).map(([k, v]) => (
                  <option key={k} value={k}>
                    {" "}
                    {v.label}{" "}
                  </option>
                ))}{" "}
              </select>{" "}
            </div>{" "}
            {}{" "}
            <div>
              {" "}
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                {" "}
                Tags (comma-separated){" "}
              </label>{" "}
              <input
                className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                value={form.tags || ""}
                onChange={(e) => set("tags", e.target.value)}
                placeholder="q2, marketing, travel"
              />{" "}
            </div>{" "}
          </div>{" "}
          {}{" "}
          <div className="mt-5">
            {" "}
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              {" "}
              Description *{" "}
            </label>{" "}
            <textarea
              rows={2}
              className={
                "w-full text-sm border rounded-xl px-3.5 py-2.5 focus:outline-none resize-none transition-all " +
                (errors.description
                  ? "border-red-400 focus:ring-2 focus:ring-red-100"
                  : "border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100")
              }
              value={form.description || ""}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Brief description of this expense…"
            />{" "}
            {errors.description && (
              <p className="text-xs text-red-500 mt-1">{errors.description}</p>
            )}{" "}
          </div>{" "}
          {}{" "}
          <div className="mt-5">
            {" "}
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              {" "}
              Internal Notes{" "}
            </label>{" "}
            <textarea
              rows={2}
              className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 resize-none"
              value={form.notes || ""}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Notes for internal use only…"
            />{" "}
          </div>{" "}
          {}{" "}
          <div className="mt-5">
            {" "}
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              {" "}
              Receipt / Attachment{" "}
            </label>{" "}
            <div
              className="border-2 border-dashed border-gray-200 rounded-xl p-5 text-center cursor-pointer hover:border-indigo-300 hover:bg-indigo-50 transition-all"
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files?.[0];
                if (file) {
                  const dt = new DataTransfer();
                  dt.items.add(file);
                  fileRef.current.files = dt.files;
                  handleFile({ target: { files: dt.files } });
                }
              }}
            >
              {" "}
              {receiptPreview ? (
                <div className="flex items-center justify-center gap-3">
                  {" "}
                  <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                    {" "}
                    <CheckCircle size={20} className="text-green-600" />{" "}
                  </div>{" "}
                  <div className="text-left">
                    {" "}
                    <p className="text-sm font-semibold text-gray-700">
                      {" "}
                      {receiptPreview.name}{" "}
                    </p>{" "}
                    <p className="text-xs text-gray-400">
                      {" "}
                      Click to replace{" "}
                    </p>{" "}
                  </div>{" "}
                </div>
              ) : form.receipt ? (
                <div className="flex items-center justify-center gap-3">
                  {" "}
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                    {" "}
                    <Paperclip size={20} className="text-indigo-600" />{" "}
                  </div>{" "}
                  <div className="text-left">
                    {" "}
                    <p className="text-sm font-semibold text-gray-700">
                      {" "}
                      Receipt attached{" "}
                    </p>{" "}
                    <p className="text-xs text-gray-400">
                      {" "}
                      Click to replace{" "}
                    </p>{" "}
                  </div>{" "}
                </div>
              ) : (
                <div>
                  {" "}
                  <Upload
                    size={24}
                    className="mx-auto text-gray-400 mb-2"
                  />{" "}
                  <p className="text-sm font-medium text-gray-600">
                    {" "}
                    Drop file here or{" "}
                    <span className="text-indigo-600">browse</span>{" "}
                  </p>{" "}
                  <p className="text-xs text-gray-400 mt-1">
                    {" "}
                    PNG, JPEG, PDF — max 5MB{" "}
                  </p>{" "}
                </div>
              )}{" "}
              <input
                ref={fileRef}
                type="file"
                accept=".png,.jpg,.jpeg,.pdf"
                className="hidden"
                onChange={handleFile}
              />{" "}
            </div>{" "}
          </div>{" "}
          {}{" "}
          <div className="mt-5 flex items-center justify-between">
            {" "}
            <label className="flex items-center gap-2.5 cursor-pointer">
              {" "}
              <div
                onClick={() => set("recurring", !form.recurring)}
                className={`w-10 h-5.5 rounded-full transition-all flex items-center px-0.5 ${form.recurring ? "bg-indigo-600" : "bg-gray-200"}`}
                style={{ width: 40, height: 22 }}
              >
                {" "}
                <div
                  className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${form.recurring ? "translate-x-4.5" : "translate-x-0"}`}
                  style={{
                    transform: form.recurring
                      ? "translateX(18px)"
                      : "translateX(1px)",
                  }}
                />{" "}
              </div>{" "}
              <span className="text-sm font-medium text-gray-700">
                {" "}
                Recurring Expense{" "}
              </span>{" "}
            </label>{" "}
            {Number(form.amount) > 0 && (
              <div className="text-right">
                {" "}
                <p className="text-xs text-gray-400">Total with Tax</p>{" "}
                <p className="text-xl font-bold text-indigo-700 tabular-nums">
                  {" "}
                  {fmt(totalWithTax, form.currency)}{" "}
                </p>{" "}
              </div>
            )}{" "}
          </div>{" "}
        </div>{" "}
        {}{" "}
        <div className="flex items-center justify-between px-7 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          {" "}
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            {" "}
            Cancel{" "}
          </button>{" "}
          <div className="flex items-center gap-3">
            {" "}
            {!isEdit && (
              <button
                onClick={() => {
                  if (!validate()) return;
                  onSaveAnother(buildExpense(true));
                }}
                className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
                style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.06)" }}
              >
                {" "}
                Save & Add Another{" "}
              </button>
            )}{" "}
            <button
              onClick={() => {
                if (!validate()) return;
                onSave(buildExpense(true));
              }}
              className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
              style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.06)" }}
            >
              {" "}
              <FileText size={14} className="inline mr-1.5" /> Save Draft{" "}
            </button>{" "}
            <button
              onClick={() => {
                if (!validate()) return;
                onSave(buildExpense(false));
              }}
              className="px-6 py-2.5 text-sm font-semibold text-white rounded-xl flex items-center gap-2 transition-all hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)",
                boxShadow: "0 4px 14px rgba(79,70,229,0.35)",
              }}
            >
              {" "}
              <CheckCircle size={15} />{" "}
              {isEdit ? "Save Changes" : "Save Expense"}{" "}
            </button>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
function ViewModal({
  open,
  expense: exp,
  onClose,
  onEdit,
  onApprove,
  onReject,
}) {
  if (!open || !exp) return null;
  const cat =
    CATEGORIES.find((c) => c.id === exp.category) ||
    CATEGORIES[CATEGORIES.length - 1];
  const Icon = cat.icon;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(15,20,40,0.55)" }}
    >
      {" "}
      <div
        className="bg-white rounded-2xl flex flex-col"
        style={{
          width: "100%",
          maxWidth: 620,
          maxHeight: "90vh",
          boxShadow: "0 32px 80px rgba(0,0,0,0.25)",
        }}
      >
        {" "}
        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100">
          {" "}
          <div className="flex items-center gap-3">
            {" "}
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ background: cat.bg }}
            >
              {" "}
              <Icon size={22} style={{ color: cat.color }} />{" "}
            </div>{" "}
            <div>
              {" "}
              <div className="flex items-center gap-2.5">
                {" "}
                <h2 className="text-lg font-bold text-gray-900 font-mono">
                  {" "}
                  {exp.id}{" "}
                </h2>{" "}
                <StatusBadge status={exp.status} />{" "}
              </div>{" "}
              <p className="text-sm text-gray-500 mt-0.5">{cat.label}</p>{" "}
            </div>{" "}
          </div>{" "}
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 transition-all"
          >
            {" "}
            <X size={18} />{" "}
          </button>{" "}
        </div>{" "}
        <div className="flex-1 overflow-y-auto px-7 py-6 space-y-5">
          {" "}
          {}{" "}
          <div
            className="rounded-2xl p-5 text-center"
            style={{
              background: "linear-gradient(135deg, #EEF2FF 0%, #F5F3FF 100%)",
              border: "1px solid #E0E7FF",
            }}
          >
            {" "}
            <p className="text-sm text-indigo-500 font-medium mb-1">
              {" "}
              Total Amount{" "}
            </p>{" "}
            <p className="text-4xl font-bold text-indigo-800 tabular-nums">
              {" "}
              {fmt(exp.amount, exp.currency)}{" "}
            </p>{" "}
            {exp.tax > 0 && (
              <p className="text-sm text-indigo-400 mt-1">
                {" "}
                + {fmt(exp.tax)} tax = {fmt((exp.amount || 0) + (exp.tax || 0))}{" "}
                total{" "}
              </p>
            )}{" "}
          </div>{" "}
          {}{" "}
          <div className="grid grid-cols-2 gap-4">
            {" "}
            {[
              ["Description", exp.description],
              ["Vendor", exp.vendor || "—"],
              ["Employee", exp.employee],
              ["Department", exp.department],
              ["Expense Date", fmtDate(exp.date)],
              ["Created Date", fmtDate(exp.createdDate)],
              ["Payment Method", exp.paymentMethod || "—"],
              ["Currency", exp.currency || "USD"],
              ["Invoice #", exp.invoiceNum || "—"],
              ["Approved By", exp.approvedBy || "—"],
            ].map(([k, v]) => (
              <div key={k} className="bg-gray-50 rounded-xl p-3">
                {" "}
                <p className="text-xs text-gray-400 font-medium mb-0.5">
                  {" "}
                  {k}{" "}
                </p>{" "}
                <p className="text-sm font-semibold text-gray-800">{v}</p>{" "}
              </div>
            ))}{" "}
          </div>{" "}
          {}{" "}
          <div
            className="flex items-center gap-3 p-3 rounded-xl"
            style={{
              background: exp.receipt ? "#F0FDF4" : "#F9FAFB",
              border: "1px solid " + (exp.receipt ? "#BBF7D0" : "#E5E7EB"),
            }}
          >
            {" "}
            {exp.receipt ? (
              <>
                {" "}
                <CheckCircle
                  size={16}
                  className="text-green-600 flex-shrink-0"
                />{" "}
                <span className="text-sm font-semibold text-green-700">
                  {" "}
                  Receipt attached{" "}
                </span>{" "}
                <button
                  className="ml-auto text-xs font-medium text-green-600 hover:underline"
                  onClick={() => toast.success("Downloading receipt…")}
                >
                  {" "}
                  Download{" "}
                </button>{" "}
              </>
            ) : (
              <>
                {" "}
                <Paperclip
                  size={16}
                  className="text-gray-400 flex-shrink-0"
                />{" "}
                <span className="text-sm text-gray-400">
                  {" "}
                  No receipt attached{" "}
                </span>{" "}
              </>
            )}{" "}
          </div>{" "}
          {}{" "}
          {exp.tags?.length > 0 && (
            <div>
              {" "}
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                {" "}
                Tags{" "}
              </p>{" "}
              <div className="flex flex-wrap gap-1.5">
                {" "}
                {exp.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-50 text-indigo-700"
                  >
                    {" "}
                    #{t}{" "}
                  </span>
                ))}{" "}
              </div>{" "}
            </div>
          )}{" "}
          {}{" "}
          {exp.notes && (
            <div>
              {" "}
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                {" "}
                Internal Notes{" "}
              </p>{" "}
              <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3">
                {" "}
                {exp.notes}{" "}
              </p>{" "}
            </div>
          )}{" "}
          {}{" "}
          {exp.auditLog?.length > 0 && (
            <div>
              {" "}
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                {" "}
                Audit Log{" "}
              </p>{" "}
              <div className="space-y-2">
                {" "}
                {exp.auditLog.map((log, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    {" "}
                    <div className="w-2 h-2 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />{" "}
                    <div>
                      {" "}
                      <span className="font-semibold text-gray-700">
                        {" "}
                        {log.action}{" "}
                      </span>{" "}
                      <span className="text-gray-400"> by {log.by}</span>{" "}
                      <span className="text-gray-400">
                        {" "}
                        · {fmtDate(log.at)}{" "}
                      </span>{" "}
                      {log.note && (
                        <p className="text-xs text-gray-400">{log.note}</p>
                      )}{" "}
                    </div>{" "}
                  </div>
                ))}{" "}
              </div>{" "}
            </div>
          )}{" "}
        </div>{" "}
        <div className="flex items-center justify-between px-7 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          {" "}
          <div className="flex gap-2">
            {" "}
            {exp.status === "pending" && (
              <>
                {" "}
                <button
                  onClick={() => {
                    onApprove(exp);
                    onClose();
                  }}
                  className="px-4 py-2 text-sm font-semibold text-green-700 bg-green-50 rounded-xl hover:bg-green-100 flex items-center gap-1.5 transition-all"
                >
                  {" "}
                  <CheckCircle size={14} /> Approve{" "}
                </button>{" "}
                <button
                  onClick={() => {
                    onReject(exp);
                    onClose();
                  }}
                  className="px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 flex items-center gap-1.5 transition-all"
                >
                  {" "}
                  <Ban size={14} /> Reject{" "}
                </button>{" "}
              </>
            )}{" "}
          </div>{" "}
          <div className="flex gap-2">
            {" "}
            <button
              onClick={() => toast.success("PDF downloaded")}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 flex items-center gap-1.5 transition-all"
            >
              {" "}
              <Download size={14} /> PDF{" "}
            </button>{" "}
            <button
              onClick={() => {
                onClose();
                onEdit(exp);
              }}
              className="px-5 py-2 text-sm font-semibold text-white rounded-xl flex items-center gap-2"
              style={{
                background: "linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)",
              }}
            >
              {" "}
              <Edit2 size={14} /> Edit{" "}
            </button>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
function DeleteModal({ open, expense: exp, onClose, onConfirm }) {
  if (!open || !exp) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(15,20,40,0.55)" }}
    >
      {" "}
      <div
        className="bg-white rounded-2xl"
        style={{
          width: "100%",
          maxWidth: 400,
          boxShadow: "0 32px 80px rgba(0,0,0,0.25)",
        }}
      >
        {" "}
        <div className="px-6 py-8 text-center">
          {" "}
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "#FEF2F2" }}
          >
            {" "}
            <Trash2 size={26} className="text-red-500" />{" "}
          </div>{" "}
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            {" "}
            Delete Expense?{" "}
          </h2>{" "}
          <p className="text-sm text-gray-500 mb-1">
            {" "}
            You're about to delete{" "}
            <strong className="text-gray-800">{exp.id}</strong>{" "}
          </p>{" "}
          <p className="text-sm font-semibold text-gray-700 mb-4">
            {" "}
            {exp.description}{" "}
          </p>{" "}
          <div className="bg-red-50 rounded-xl p-3 text-sm text-red-700 mb-4 font-medium">
            {" "}
            Amount: {fmt(exp.amount, exp.currency)} · {fmtDate(exp.date)}{" "}
          </div>{" "}
          <p className="text-xs text-gray-400">
            {" "}
            This action cannot be undone.{" "}
          </p>{" "}
        </div>{" "}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          {" "}
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            {" "}
            Cancel{" "}
          </button>{" "}
          <button
            onClick={onConfirm}
            className="px-6 py-2.5 text-sm font-semibold text-white rounded-xl hover:opacity-90 transition-all"
            style={{
              background: "#DC2626",
              boxShadow: "0 4px 14px rgba(220,38,38,0.3)",
            }}
          >
            {" "}
            Delete Expense{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
function exportCSV(data) {
  const headers = [
    "ID",
    "Category",
    "Description",
    "Vendor",
    "Employee",
    "Department",
    "Amount",
    "Tax",
    "Total",
    "Currency",
    "Payment Method",
    "Date",
    "Status",
    "Receipt",
    "Notes",
  ];
  const rows = data.map((r) => [
    r.id,
    r.category,
    r.description,
    r.vendor,
    r.employee,
    r.department,
    r.amount,
    r.tax || 0,
    (r.amount || 0) + (r.tax || 0),
    r.currency,
    r.paymentMethod,
    r.date,
    r.status,
    r.receipt ? "Yes" : "No",
    r.notes,
  ]);
  const csv = [headers, ...rows]
    .map((row) =>
      row.map((v) => '"' + String(v || "").replace(/"/g, '""') + '"').join(","),
    )
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "expenses.csv";
  a.click();
  URL.revokeObjectURL(url);
}
function SkeletonRows({ count = 8 }) {
  return Array.from({ length: count }).map((_, i) => (
    <tr key={i} className="border-b border-gray-50">
      {Array.from({ length: 9 }).map((__, ci) => (
        <td key={ci} className="px-4 py-4">
          <div
            className="h-3 rounded-full animate-pulse"
            style={{
              width: ci === 0 ? 24 : ci === 1 ? "80%" : "60%",
              background: "#E5E7EB",
              animationDelay: `${i * 80}ms`,
            }}
          />{" "}
        </td>
      ))}</tr>
  ));
}
const PAGE_SIZE = 10;
export default function ExpenseManagement() {
  const [expenses, setExpenses] = useState(SEED);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [amountMin, setAmountMin] = useState("");
  const [amountMax, setAmountMax] = useState("");
  const [pmFilter, setPmFilter] = useState("");
  const [empFilter, setEmpFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState({ field: "date", dir: "desc" });
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(new Set());
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [editExp, setEditExp] = useState(null);
  const [viewExp, setViewExp] = useState(null);
  const [deleteExp, setDeleteExp] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    setPage(0);
    setSelected(new Set());
  }, [
    search,
    catFilter,
    statusFilter,
    dateFrom,
    dateTo,
    amountMin,
    amountMax,
    pmFilter,
    empFilter,
  ]);
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return expenses.filter(
      (exp) =>
        (!q ||
          [
            exp.description,
            exp.category,
            exp.vendor,
            String(exp.amount),
            exp.notes,
            exp.employee,
          ].some((v) => (v || "").toLowerCase().includes(q))) &&
        (!catFilter || exp.category === catFilter) &&
        (!statusFilter || exp.status === statusFilter) &&
        (!dateFrom || exp.date >= dateFrom) &&
        (!dateTo || exp.date <= dateTo) &&
        (!amountMin || exp.amount >= Number(amountMin)) &&
        (!amountMax || exp.amount <= Number(amountMax)) &&
        (!pmFilter || exp.paymentMethod === pmFilter) &&
        (!empFilter || exp.employee === empFilter),
    );
  }, [
    expenses,
    search,
    catFilter,
    statusFilter,
    dateFrom,
    dateTo,
    amountMin,
    amountMax,
    pmFilter,
    empFilter,
  ]);
  const sorted = useMemo(
    () =>
      [...filtered].sort((a, b) => {
        let av = a[sort.field],
          bv = b[sort.field];
        if (["amount", "tax"].includes(sort.field)) {
          av = Number(av || 0);
          bv = Number(bv || 0);
        }
        if (av < bv) return sort.dir === "asc" ? -1 : 1;
        if (av > bv) return sort.dir === "asc" ? 1 : -1;
        return 0;
      }),
    [filtered, sort],
  );
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const pageData = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const onSort = (f) =>
    setSort((s) => ({
      field: f,
      dir: s.field === f && s.dir === "asc" ? "desc" : "asc",
    }));
  const stats = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    const wStr = weekStart.toISOString().slice(0, 10);
    const monthStr = now.toISOString().slice(0, 7);
    const yearStr = now.getFullYear().toString();
    return {
      total: expenses.reduce((s, e) => s + (e.amount || 0), 0),
      today: expenses
        .filter((e) => e.date === todayStr)
        .reduce((s, e) => s + (e.amount || 0), 0),
      week: expenses
        .filter((e) => e.date >= wStr)
        .reduce((s, e) => s + (e.amount || 0), 0),
      month: expenses
        .filter((e) => e.date.startsWith(monthStr))
        .reduce((s, e) => s + (e.amount || 0), 0),
      year: expenses
        .filter((e) => e.date.startsWith(yearStr))
        .reduce((s, e) => s + (e.amount || 0), 0),
      count: expenses.length,
      approved: expenses.filter((e) => e.status === "approved").length,
      pending: expenses.filter((e) => e.status === "pending").length,
    };
  }, [expenses]);
  const analytics = useMemo(() => {
    const byCat = CATEGORIES.map((cat) => ({
      label: cat.label,
      value: expenses
        .filter((e) => e.category === cat.id)
        .reduce((s, e) => s + (e.amount || 0), 0),
      color: cat.color,
    }))
      .filter((c) => c.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const byMonth = months.map((m, i) => ({
      label: m,
      value: expenses
        .filter((e) => new Date(e.date).getMonth() === i)
        .reduce((s, e) => s + (e.amount || 0), 0),
    }));
    return { byCat, byMonth };
  }, [expenses]);
  const handleSave = (exp) => {
    setExpenses((prev) => {
      const idx = prev.findIndex((x) => x.id === exp.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = exp;
        return next;
      }
      return [exp, ...prev];
    });
    setAddOpen(false);
    setEditExp(null);
    toast.success(
      exp.status === "draft"
        ? "📋 Draft saved"
        : "✅ Expense " + exp.id + " recorded",
    );
  };
  const handleSaveAndAdd = (exp) => {
    setExpenses((prev) => [exp, ...prev]);
    toast.success("✅ Saved! Add another expense.");
    setTimeout(() => setAddOpen(true), 50);
  };
  const handleDelete = () => {
    const id = deleteExp.id;
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    toast.success("🗑️ Expense " + id + " deleted");
    setDeleteExp(null);
    const undoTimer = setTimeout(() => {}, 4000);
    toast("Undo?", {
      duration: 4000,
      icon: "↩️",
      onClick: () => {
        clearTimeout(undoTimer);
      },
    });
  };
  const handleApprove = (exp) => {
    setExpenses((prev) =>
      prev.map((e) =>
        e.id === exp.id
          ? {
              ...e,
              status: "approved",
              approvedBy: "Finance Manager",
              auditLog: [
                ...(e.auditLog || []),
                {
                  action: "Approved",
                  by: "Finance Manager",
                  at: today(),
                  note: "Expense approved",
                },
              ],
            }
          : e,
      ),
    );
    toast.success("✅ Expense approved: " + exp.id);
  };
  const handleReject = (exp) => {
    setExpenses((prev) =>
      prev.map((e) =>
        e.id === exp.id
          ? {
              ...e,
              status: "rejected",
              auditLog: [
                ...(e.auditLog || []),
                {
                  action: "Rejected",
                  by: "Finance Manager",
                  at: today(),
                  note: "Expense rejected",
                },
              ],
            }
          : e,
      ),
    );
    toast.error("Expense rejected: " + exp.id);
  };
  const handleDuplicate = (exp) => {
    const dup = {
      ...exp,
      id: uid(),
      status: "draft",
      date: today(),
      createdDate: today(),
      auditLog: [
        {
          action: "Duplicated",
          by: exp.employee,
          at: today(),
          note: "Duplicated from " + exp.id,
        },
      ],
    };
    setExpenses((prev) => [dup, ...prev]);
    toast.success("Duplicated as " + dup.id);
  };
  const toggleRow = (id) =>
    setSelected((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  const toggleAll = () =>
    selected.size === pageData.length
      ? setSelected(new Set())
      : setSelected(new Set(pageData.map((r) => r.id)));
  const bulkDelete = () => {
    setExpenses((prev) => prev.filter((e) => !selected.has(e.id)));
    toast.success("Deleted " + selected.size + " expense(s)");
    setSelected(new Set());
  };
  const bulkApprove = () => {
    setExpenses((prev) =>
      prev.map((e) => (selected.has(e.id) ? { ...e, status: "approved" } : e)),
    );
    toast.success("Approved " + selected.size + " expense(s)");
    setSelected(new Set());
  };
  const bulkExport = () => {
    exportCSV(sorted.filter((e) => selected.has(e.id)));
    toast.success("Exported " + selected.size + " expense(s)");
  };
  const hasFilters =
    search ||
    catFilter ||
    statusFilter ||
    dateFrom ||
    dateTo ||
    amountMin ||
    amountMax ||
    pmFilter ||
    empFilter;
  const resetFilters = () => {
    setSearch("");
    setCatFilter("");
    setStatusFilter("");
    setDateFrom("");
    setDateTo("");
    setAmountMin("");
    setAmountMax("");
    setPmFilter("");
    setEmpFilter("");
  };
  return (
    <div
      className="min-h-full"
      style={{
        background:
          "linear-gradient(160deg, #EEF2FF 0%, #F0F9FF 50%, #ECFDF5 100%)",
      }}
    >
      {" "}
      {}{" "}
      <div className="px-8 pt-8 pb-4">
        {" "}
        <div className="flex items-center justify-between">
          {" "}
          <div>
            {" "}
            <h1
              className="font-bold text-gray-900"
              style={{
                fontSize: 32,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
              }}
            >
              {" "}
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #4F46E5 0%, #0891B2 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {" "}
                Expenses{" "}
              </span>{" "}
            </h1>{" "}
            <p className="text-gray-500 mt-1 text-sm">
              {" "}
              Track, manage and approve all business expenses{" "}
            </p>{" "}
          </div>{" "}
          <div className="flex items-center gap-3">
            {" "}
            <button
              onClick={() => setShowAnalytics((v) => !v)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl border transition-all ${showAnalytics ? "bg-indigo-50 border-indigo-300 text-indigo-700" : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"}`}
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.07)" }}
            >
              {" "}
              <BarChart2 size={15} /> Analytics{" "}
            </button>{" "}
            <button
              onClick={() => {
                setLoading(true);
                setTimeout(() => setLoading(false), 500);
              }}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 bg-white border border-gray-200 hover:bg-gray-50 transition-all"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.07)" }}
            >
              {" "}
              <RefreshCw size={15} />{" "}
            </button>{" "}
            <button
              onClick={() => exportCSV(sorted)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.07)" }}
            >
              {" "}
              <FileDown size={15} /> Export{" "}
            </button>{" "}
            <button
              onClick={() => setAddOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-xl transition-all hover:opacity-90 active:scale-95"
              style={{
                background: "linear-gradient(135deg, #4F46E5 0%, #0891B2 100%)",
                boxShadow: "0 4px 14px rgba(79,70,229,0.40)",
              }}
            >
              {" "}
              <Plus size={16} /> Add Expense{" "}
            </button>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      <div className="px-8 pb-8 space-y-6">
        {" "}
        {}{" "}
        <div
          className="bg-white rounded-2xl p-6"
          style={{
            boxShadow:
              "0 1px 3px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.04)",
            border: "1px solid #F1F5F9",
          }}
        >
          {" "}
          <div className="flex flex-wrap gap-8 items-start">
            {" "}
            <SummaryMetric
              label="Total Expenses"
              value={"$" + stats.total.toFixed(2)}
              color="#4F46E5"
              icon={DollarSign}
            />{" "}
            <div className="w-px bg-gray-100 self-stretch hidden sm:block" />{" "}
            <SummaryMetric
              label="Today"
              value={"$" + stats.today.toFixed(2)}
              color="#0891B2"
              icon={Calendar}
            />{" "}
            <div className="w-px bg-gray-100 self-stretch hidden sm:block" />{" "}
            <SummaryMetric
              label="This Week"
              value={"$" + stats.week.toFixed(2)}
              color="#7C3AED"
              icon={Activity}
            />{" "}
            <div className="w-px bg-gray-100 self-stretch hidden sm:block" />{" "}
            <SummaryMetric
              label="This Month"
              value={"$" + stats.month.toFixed(2)}
              color="#059669"
              icon={TrendingUp}
            />{" "}
            <div className="w-px bg-gray-100 self-stretch hidden sm:block" />{" "}
            <SummaryMetric
              label="This Year"
              value={"$" + stats.year.toFixed(2)}
              color="#D97706"
              icon={BarChart2}
            />{" "}
            <div className="ml-auto flex items-center gap-6 pl-6 border-l border-gray-100">
              {" "}
              <div className="text-center">
                {" "}
                <div className="text-2xl font-bold text-gray-800 tabular-nums">
                  {" "}
                  {stats.approved}{" "}
                </div>{" "}
                <div className="text-xs text-green-600 font-medium mt-0.5">
                  {" "}
                  Approved{" "}
                </div>{" "}
              </div>{" "}
              <div className="text-center">
                {" "}
                <div className="text-2xl font-bold text-gray-800 tabular-nums">
                  {" "}
                  {stats.pending}{" "}
                </div>{" "}
                <div className="text-xs text-amber-600 font-medium mt-0.5">
                  {" "}
                  Pending{" "}
                </div>{" "}
              </div>{" "}
              <div className="text-center">
                {" "}
                <div className="text-2xl font-bold text-gray-800 tabular-nums">
                  {" "}
                  {stats.count}{" "}
                </div>{" "}
                <div className="text-xs text-gray-500 font-medium mt-0.5">
                  {" "}
                  Total{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
        {}{" "}
        {showAnalytics && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {" "}
            {}{" "}
            <div
              className="bg-white rounded-2xl p-6"
              style={{
                boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
                border: "1px solid #F1F5F9",
              }}
            >
              {" "}
              <div className="flex items-center justify-between mb-4">
                {" "}
                <h3 className="font-bold text-gray-800">Monthly Spend</h3>{" "}
                <span className="text-xs text-gray-400 font-medium">
                  {" "}
                  Jan – Jun 2024{" "}
                </span>{" "}
              </div>{" "}
              <div className="flex items-end gap-2 h-28">
                {" "}
                {analytics.byMonth.map((m, i) => {
                  const maxV = Math.max(
                    ...analytics.byMonth.map((d) => d.value),
                    1,
                  );
                  const h = Math.round((m.value / maxV) * 100);
                  return (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center gap-1.5 group"
                    >
                      {" "}
                      <div
                        className="relative w-full flex items-end justify-center"
                        style={{ height: 80 }}
                      >
                        {" "}
                        <div
                          className="w-full rounded-t-lg transition-all duration-300 group-hover:opacity-80"
                          style={{
                            height: h + "%",
                            minHeight: m.value > 0 ? 4 : 0,
                            background:
                              "linear-gradient(180deg, #4F46E5 0%, #6366F1 100%)",
                          }}
                        />{" "}
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-indigo-600 opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap">
                          {" "}
                          {fmt(m.value)}{" "}
                        </div>{" "}
                      </div>{" "}
                      <span className="text-xs text-gray-400 font-medium">
                        {" "}
                        {m.label}{" "}
                      </span>{" "}
                    </div>
                  );
                })}{" "}
              </div>{" "}
            </div>{" "}
            {}{" "}
            <div
              className="bg-white rounded-2xl p-6"
              style={{
                boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
                border: "1px solid #F1F5F9",
              }}
            >
              {" "}
              <div className="flex items-center justify-between mb-4">
                {" "}
                <h3 className="font-bold text-gray-800">By Category</h3>{" "}
                <span className="text-xs text-gray-400 font-medium">
                  {" "}
                  All time{" "}
                </span>{" "}
              </div>{" "}
              <div className="space-y-3">
                {" "}
                {analytics.byCat.slice(0, 5).map((cat, i) => {
                  const maxV = analytics.byCat[0]?.value || 1;
                  const pct = Math.round((cat.value / maxV) * 100);
                  return (
                    <div key={i} className="flex items-center gap-3">
                      {" "}
                      <span className="text-xs font-medium text-gray-600 w-28 truncate">
                        {" "}
                        {cat.label}{" "}
                      </span>{" "}
                      <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                        {" "}
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: pct + "%", background: cat.color }}
                        />{" "}
                      </div>{" "}
                      <span className="text-xs font-bold text-gray-700 tabular-nums w-20 text-right">
                        {" "}
                        {fmt(cat.value)}{" "}
                      </span>{" "}
                    </div>
                  );
                })}{" "}
              </div>{" "}
            </div>{" "}
          </div>
        )}{" "}
        {}{" "}
        <div
          className="bg-white rounded-2xl p-4"
          style={{
            boxShadow:
              "0 1px 3px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.04)",
            border: "1px solid #F1F5F9",
          }}
        >
          {" "}
          <div className="flex flex-wrap gap-3 items-center">
            {" "}
            <div className="relative flex-1" style={{ minWidth: 240 }}>
              {" "}
              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />{" "}
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-sm pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                placeholder="Search expenses, vendors, descriptions…"
              />{" "}
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {" "}
                  <X size={14} />{" "}
                </button>
              )}{" "}
            </div>{" "}
            <select
              value={catFilter}
              onChange={(e) => setCatFilter(e.target.value)}
              className="text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-400 bg-white cursor-pointer"
              style={{ minWidth: 160 }}
            >
              {" "}
              <option value="">All Categories</option>{" "}
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {" "}
                  {c.label}{" "}
                </option>
              ))}{" "}
            </select>{" "}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-400 bg-white cursor-pointer"
              style={{ minWidth: 140 }}
            >
              {" "}
              <option value="">All Status</option>{" "}
              {Object.entries(STATUS_CFG).map(([k, v]) => (
                <option key={k} value={k}>
                  {" "}
                  {v.label}{" "}
                </option>
              ))}{" "}
            </select>{" "}
            <button
              onClick={() => setShowFilters((v) => !v)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl border transition-all ${showFilters ? "bg-indigo-50 border-indigo-300 text-indigo-700" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"}`}
            >
              {" "}
              <SlidersHorizontal size={14} /> More Filters{" "}
              {hasFilters &&
                [
                  dateFrom,
                  dateTo,
                  amountMin,
                  amountMax,
                  pmFilter,
                  empFilter,
                ].filter(Boolean).length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-bold">
                    {" "}
                    {
                      [
                        dateFrom,
                        dateTo,
                        amountMin,
                        amountMax,
                        pmFilter,
                        empFilter,
                      ].filter(Boolean).length
                    }{" "}
                  </span>
                )}{" "}
            </button>{" "}
            {hasFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl text-red-600 bg-red-50 hover:bg-red-100 transition-all"
              >
                {" "}
                <XCircle size={14} /> Reset{" "}
              </button>
            )}{" "}
            <div className="ml-auto text-sm text-gray-400 font-medium tabular-nums">
              {" "}
              {sorted.length} expense{sorted.length !== 1 ? "s" : ""}{" "}
            </div>{" "}
          </div>{" "}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-3">
              {" "}
              <div className="flex items-center gap-2">
                {" "}
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  {" "}
                  From{" "}
                </label>{" "}
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  style={{ width: 148 }}
                />{" "}
              </div>{" "}
              <div className="flex items-center gap-2">
                {" "}
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  {" "}
                  To{" "}
                </label>{" "}
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  style={{ width: 148 }}
                />{" "}
              </div>{" "}
              <div className="flex items-center gap-2">
                {" "}
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  {" "}
                  Min ${" "}
                </label>{" "}
                <input
                  type="number"
                  value={amountMin}
                  onChange={(e) => setAmountMin(e.target.value)}
                  className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  style={{ width: 100 }}
                  placeholder="0"
                />{" "}
              </div>{" "}
              <div className="flex items-center gap-2">
                {" "}
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  {" "}
                  Max ${" "}
                </label>{" "}
                <input
                  type="number"
                  value={amountMax}
                  onChange={(e) => setAmountMax(e.target.value)}
                  className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  style={{ width: 100 }}
                  placeholder="∞"
                />{" "}
              </div>{" "}
              <select
                value={pmFilter}
                onChange={(e) => setPmFilter(e.target.value)}
                className="text-sm border border-gray-200 rounded-xl px-3.5 py-2 focus:outline-none focus:border-indigo-400 bg-white cursor-pointer"
                style={{ minWidth: 160 }}
              >
                {" "}
                <option value="">All Pay Methods</option>{" "}
                {PAYMENT_METHODS.map((m) => (
                  <option key={m}>{m}</option>
                ))}{" "}
              </select>{" "}
              <select
                value={empFilter}
                onChange={(e) => setEmpFilter(e.target.value)}
                className="text-sm border border-gray-200 rounded-xl px-3.5 py-2 focus:outline-none focus:border-indigo-400 bg-white cursor-pointer"
                style={{ minWidth: 160 }}
              >
                {" "}
                <option value="">All Employees</option>{" "}
                {EMPLOYEES.map((e) => (
                  <option key={e}>{e}</option>
                ))}{" "}
              </select>{" "}
            </div>
          )}{" "}
        </div>{" "}
        {}{" "}
        <div
          className="bg-white rounded-2xl overflow-hidden"
          style={{
            boxShadow:
              "0 1px 3px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.04)",
            border: "1px solid #F1F5F9",
          }}
        >
          {" "}
          {}{" "}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
            {" "}
            <div className="flex items-center gap-2">
              {" "}
              <span className="text-sm font-semibold text-gray-700">
                {" "}
                Expense List{" "}
              </span>{" "}
              <span className="px-2 py-0.5 rounded-full text-xs font-bold text-indigo-700 bg-indigo-50">
                {" "}
                {sorted.length}{" "}
              </span>{" "}
            </div>{" "}
            {selected.size > 0 && (
              <div className="flex items-center gap-2">
                {" "}
                <span className="text-sm text-gray-500">
                  {" "}
                  {selected.size} selected{" "}
                </span>{" "}
                <div className="w-px h-4 bg-gray-200" />{" "}
                <button
                  onClick={bulkApprove}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-all"
                >
                  {" "}
                  <CheckCircle size={12} /> Approve{" "}
                </button>{" "}
                <button
                  onClick={bulkExport}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
                >
                  {" "}
                  <FileDown size={12} /> Export{" "}
                </button>{" "}
                <button
                  onClick={bulkDelete}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-all"
                >
                  {" "}
                  <Trash2 size={12} /> Delete{" "}
                </button>{" "}
              </div>
            )}{" "}
          </div>{" "}
          <div className="overflow-x-auto">
            <table className="w-full min-w-max">
              <thead>
                <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
                  <th
                    className="px-4 py-3.5 w-10"
                    style={{ background: "#F8FAFC" }}
                  >
                    <div
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center cursor-pointer transition-all ${pageData.length > 0 && selected.size === pageData.length ? "bg-indigo-600 border-indigo-600" : "border-gray-300 hover:border-indigo-400"}`}
                      onClick={toggleAll}
                    >
                      {" "}
                      {pageData.length > 0 &&
                        selected.size === pageData.length && (
                          <Check size={10} color="white" />
                        )}{" "}
                      {selected.size > 0 && selected.size < pageData.length && (
                        <Minus size={10} color="#4F46E5" />
                      )}{" "}
                    </div>{" "}
                  </th>{" "}
                  <SortTh label="ID" field="id" sort={sort} onSort={onSort} />{" "}
                  <SortTh
                    label="Category"
                    field="category"
                    sort={sort}
                    onSort={onSort}
                  />{" "}
                  <SortTh
                    label="Description"
                    field="description"
                    sort={sort}
                    onSort={onSort}
                  />{" "}
                  <SortTh
                    label="Vendor"
                    field="vendor"
                    sort={sort}
                    onSort={onSort}
                  />{" "}
                  <SortTh
                    label="Employee"
                    field="employee"
                    sort={sort}
                    onSort={onSort}
                  />{" "}
                  <SortTh
                    label="Date"
                    field="date"
                    sort={sort}
                    onSort={onSort}
                  />{" "}
                  <SortTh
                    label="Amount"
                    field="amount"
                    sort={sort}
                    onSort={onSort}
                    align="right"
                  />{" "}
                  <th
                    className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                    style={{ background: "#F8FAFC" }}
                  >
                    Status{" "}
                  </th>{" "}
                  <th
                    className="px-4 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                    style={{ background: "#F8FAFC", width: 50 }}
                  >
                    Rcpt{" "}
                  </th>{" "}
                  <th
                    className="px-4 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider"
                    style={{ background: "#F8FAFC", width: 50 }}
                  >
                    Actions{" "}
                  </th></tr></thead>{" "}
              <tbody>
                {loading ? (
                  <SkeletonRows count={PAGE_SIZE} />
                ) : pageData.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center">
                          <Banknote
                            size={28}
                            className="text-indigo-400"
                          />{" "}
                        </div>{" "}
                        <div>
                          {" "}
                          <p className="text-base font-semibold text-gray-700 mb-1">
                            {" "}
                            No expenses found{" "}
                          </p>{" "}
                          <p className="text-sm text-gray-400">
                            {" "}
                            {hasFilters
                              ? "Try adjusting your filters"
                              : "Add your first expense to get started"}{" "}
                          </p>{" "}
                        </div>{" "}
                        {!hasFilters && (
                          <button
                            onClick={() => setAddOpen(true)}
                            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-xl"
                            style={{
                              background:
                                "linear-gradient(135deg, #4F46E5 0%, #0891B2 100%)",
                            }}
                          >
                            <Plus size={15} /> Add Expense{" "}
                          </button>
                        )}{" "}
                      </div>{" "}
                    </td></tr>
                ) : (
                  pageData.map((row, ri) => {
                    const isSelected = selected.has(row.id);
                    return (
                      <tr
                        key={row.id}
                        className="border-b border-gray-50 cursor-pointer transition-all duration-100"
                        style={{
                          background: isSelected
                            ? "#EEF2FF"
                            : ri % 2 === 0
                              ? "#FFFFFF"
                              : "#FAFBFC",
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected)
                            e.currentTarget.style.background = "#F5F8FF";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = isSelected
                            ? "#EEF2FF"
                            : ri % 2 === 0
                              ? "#FFFFFF"
                              : "#FAFBFC";
                        }}
                        onClick={() => setViewExp(row)}
                      >
                        <td
                          className="px-4 py-3.5 w-10"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleRow(row.id);
                          }}
                        >
                          {" "}
                          <div
                            className={`w-4 h-4 rounded border-2 flex items-center justify-center cursor-pointer transition-all ${isSelected ? "bg-indigo-600 border-indigo-600" : "border-gray-300 hover:border-indigo-400"}`}
                          >
                            {isSelected && (
                              <Check size={10} color="white" />
                            )}{" "}
                          </div>{" "}
                        </td>{" "}
                        <td className="px-4 py-3.5">
                          <span className="font-mono text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg">
                            {row.id}{" "}
                          </span>{" "}
                        </td>{" "}
                        <td className="px-4 py-3.5">
                          <CatBadge categoryId={row.category} />{" "}
                        </td>{" "}
                        <td className="px-4 py-3.5">
                          <div className="text-sm font-semibold text-gray-800 max-w-[200px] truncate">
                            {row.description}{" "}
                          </div>{" "}
                          {row.department && (
                            <div className="text-xs text-gray-400">
                              {row.department}{" "}
                            </div>
                          )}{" "}
                        </td>{" "}
                        <td className="px-4 py-3.5 text-sm text-gray-600 whitespace-nowrap">
                          {row.vendor || "—"}{" "}
                        </td>{" "}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                              style={{
                                background: `hsl(${((row.employee || "").charCodeAt(0) * 47) % 360}, 55%, 52%)`,
                              }}
                            >
                              {" "}
                              {(row.employee || "U").charAt(0)}{" "}
                            </div>{" "}
                            <span className="text-sm text-gray-700 whitespace-nowrap">
                              {row.employee}{" "}
                            </span>{" "}
                          </div>{" "}
                        </td>{" "}
                        <td className="px-4 py-3.5 text-sm text-gray-500 tabular-nums whitespace-nowrap">
                          {fmtDate(row.date)}{" "}
                        </td>{" "}
                        <td className="px-4 py-3.5 text-right">
                          <div className="text-sm font-bold text-gray-900 tabular-nums">
                            {fmt(row.amount, row.currency)}{" "}
                          </div>{" "}
                          {row.tax > 0 && (
                            <div className="text-xs text-gray-400 tabular-nums">
                              +{fmt(row.tax)} tax{" "}
                            </div>
                          )}{" "}
                        </td>{" "}
                        <td className="px-4 py-3.5">
                          <StatusBadge status={row.status} />{" "}
                        </td>{" "}
                        <td className="px-4 py-3.5 text-center">
                          {row.receipt ? (
                            <span title="Receipt attached">
                              <Paperclip
                                size={15}
                                className="text-green-500 mx-auto"
                              />{" "}
                            </span>
                          ) : (
                            <span className="text-gray-200">—</span>
                          )}{" "}
                        </td>{" "}
                        <td
                          className="px-4 py-3.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ActionMenu
                            row={row}
                            onView={() => setViewExp(row)}
                            onEdit={() => setEditExp(row)}
                            onDuplicate={() => handleDuplicate(row)}
                            onApprove={() => handleApprove(row)}
                            onReject={() => handleReject(row)}
                            onDelete={() => setDeleteExp(row)}
                          />{" "}
                        </td></tr>
                    );
                  })
                )}</tbody></table>{" "}
          </div>{" "}
          {}{" "}
          {!loading && sorted.length > 0 && (
            <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
              <span className="text-sm text-gray-500 tabular-nums">
                {" "}
                Showing{" "}
                <strong className="text-gray-800">
                  {" "}
                  {page * PAGE_SIZE + 1}–{" "}
                  {Math.min((page + 1) * PAGE_SIZE, sorted.length)}{" "}
                </strong>{" "}
                of{" "}
                <strong className="text-gray-800">{sorted.length}</strong>{" "}
              </span>{" "}
              <div className="flex items-center gap-1.5">
                {" "}
                <button
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-sm text-gray-500 border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  {" "}
                  <ChevronLeft size={14} />{" "}
                </button>{" "}
                {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                  const p =
                    totalPages <= 7
                      ? i
                      : page < 4
                        ? i
                        : page > totalPages - 5
                          ? totalPages - 7 + i
                          : page - 3 + i;
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-all"
                      style={{
                        background: page === p ? "#4F46E5" : "transparent",
                        color: page === p ? "#fff" : "#6B7280",
                        border: page === p ? "none" : "1px solid #E5E7EB",
                      }}
                    >
                      {" "}
                      {p + 1}{" "}
                    </button>
                  );
                })}{" "}
                <button
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-sm text-gray-500 border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  {" "}
                  <ChevronRight size={14} />{" "}
                </button>{" "}
              </div>{" "}
            </div>
          )}{" "}
        </div>{" "}
      </div>{" "}
      {}{" "}
      <ExpenseModal
        open={addOpen || !!editExp}
        initial={editExp}
        onClose={() => {
          setAddOpen(false);
          setEditExp(null);
        }}
        onSave={handleSave}
        onSaveAnother={handleSaveAndAdd}
      />{" "}
      <ViewModal
        open={!!viewExp}
        expense={viewExp}
        onClose={() => setViewExp(null)}
        onEdit={(e) => {
          setViewExp(null);
          setEditExp(e);
        }}
        onApprove={handleApprove}
        onReject={handleReject}
      />{" "}
      <DeleteModal
        open={!!deleteExp}
        expense={deleteExp}
        onClose={() => setDeleteExp(null)}
        onConfirm={handleDelete}
      />{" "}
    </div>
  );
}
