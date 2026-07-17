import React, { useState, useEffect } from "react";
import api from "../../services/api";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  LayoutDashboard,
  CreditCard,
  Users,
  Plus,
  PieChart,
  Activity,
  DollarSign,
  Calendar,
} from "lucide-react";
import { useAuth } from "../../store/AuthContext";
import SkeletonLoader from "../../components/common/SkeletonLoader";

function DashboardCard({
  icon: Icon,
  title,
  value,
  changePercent,
  sparkData,
  loading,
  chartData,
  chartType,
  actionLabel,
}) {
  const growing = changePercent > 0.5;
  const declining = changePercent < -0.5;
  const changeColor = growing
    ? "text-success"
    : declining
      ? "text-danger"
      : "text-muted";
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface border border-border rounded-lg p-2 shadow-sm text-xs">
          {" "}
          <div className="text-muted mb-1">{label}</div>{" "}
          <div className="font-semibold text-ink tabular-nums">
            {" "}
            {chartType === "currency" ? "$" : ""}
            {Number(payload[0].value).toLocaleString()}{" "}
          </div>{" "}
        </div>
      );
    }
    return null;
  };
  return (
    <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
      {" "}
      <div className="p-6 border-b border-border flex items-center gap-3 bg-stone-50/50">
        {" "}
        <div className="w-8 h-8 rounded-lg bg-accent-light text-accent flex items-center justify-center shrink-0">
          {" "}
          <Icon size={16} />{" "}
        </div>{" "}
        <h2 className="text-sm font-bold text-ink tracking-tight uppercase">
          {title}
        </h2>{" "}
      </div>{" "}
      <div className="p-6 flex-1 flex flex-col">
        {" "}
        {loading ? (
          <div className="space-y-4">
            <SkeletonLoader type="text" rows={1} className="w-1/3 h-10" />
            <div className="skeleton-block h-32 w-full mt-4"></div>
          </div>
        ) : (
          <>
            {" "}
            <div className="flex items-end justify-between mb-6">
              {" "}
              <div>
                {" "}
                <div className="font-display text-4xl font-bold text-ink tracking-tight tabular-nums">
                  {" "}
                  {value}{" "}
                </div>{" "}
                <div className={`text-xs font-semibold mt-1.5 ${changeColor}`}>
                  {" "}
                  {changePercent > 0 ? "+" : ""}
                  {changePercent?.toFixed(1)}% vs prev period{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
            <div className="flex-1 min-h-[140px]">
              {" "}
              {chartData && chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  {" "}
                  <AreaChart
                    data={chartData}
                    margin={{ top: 5, right: 0, left: -20, bottom: 0 }}
                  >
                    {" "}
                    <defs>
                      {" "}
                      <linearGradient
                        id={`color-${title}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        {" "}
                        <stop
                          offset="5%"
                          stopColor="#4F46E5"
                          stopOpacity={0.2}
                        />{" "}
                        <stop
                          offset="95%"
                          stopColor="#4F46E5"
                          stopOpacity={0}
                        />{" "}
                      </linearGradient>{" "}
                    </defs>{" "}
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#E7E5E2"
                    />{" "}
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: "#A8A49F" }}
                      minTickGap={30}
                    />{" "}
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: "#A8A49F" }}
                      tickFormatter={(v) =>
                        chartType === "currency" ? `$${v / 1000}k` : v
                      }
                    />{" "}
                    <Tooltip content={<CustomTooltip />} />{" "}
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#4F46E5"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill={`url(#color-${title})`}
                    />{" "}
                  </AreaChart>{" "}
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-sm text-muted">
                  No trend data available
                </div>
              )}{" "}
            </div>{" "}
          </>
        )}{" "}
      </div>{" "}
      {actionLabel && (
        <div className="p-4 bg-stone-50 border-t border-border mt-auto">
          {" "}
          <button className="w-full btn bg-accent-light text-accent hover:bg-accent hover:text-white border-transparent transition-colors justify-center rounded-lg py-2.5 font-semibold">
            {" "}
            <Plus size={16} /> {actionLabel}{" "}
          </button>{" "}
        </div>
      )}{" "}
    </div>
  );
}
export default function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [charts, setCharts] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    Promise.all([
      api.get("/dashboard/summary"),
      api.get("/dashboard/metrics?type=mrr&range=3m"),
      api.get("/dashboard/metrics?type=active_subscriptions&range=3m"),
      api.get("/dashboard/metrics?type=net_billing&range=3m"),
      api.get("/dashboard/metrics?type=net_payments&range=3m"),
    ])
      .then(([sum, mrr, subs, bill, pay]) => {
        setSummary(sum.data.data);
        setCharts({
          mrr: mrr.data.data || [],
          active_subscriptions: subs.data.data || [],
          net_billing: bill.data.data || [],
          net_payments: pay.data.data || [],
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);
  const fmtCurrency = (v) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(v || 0);
  const fmtNum = (v) => new Intl.NumberFormat("en-US").format(v || 0);
  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return "Good Morning";
    if (hr < 18) return "Good Afternoon";
    return "Good Evening";
  };
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {" "}
      {/* Greeting Header */}{" "}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        {" "}
        <div>
          {" "}
          <h1 className="text-3xl font-display font-bold text-ink tracking-tight flex items-center gap-2">
            {" "}
            {getGreeting()}, {user?.name?.split(" ")[0] || "Admin"}!{" "}
            <span className=""></span>{" "}
          </h1>{" "}
          <p className="text-muted mt-1.5">
            Here's what's happening with your platform today.
          </p>{" "}
        </div>{" "}
        <div className="flex items-center gap-3">
          {" "}
          <div className="flex items-center gap-2 bg-white border border-border px-3 py-1.5 rounded-lg text-xs font-semibold text-muted shadow-sm">
            {" "}
            <Calendar size={14} /> {currentDate}{" "}
          </div>{" "}
          <button className="btn-secondary rounded-lg font-semibold shadow-sm text-xs px-3 py-1.5">
            {" "}
            Customize Layout{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
      {/* Grid */}{" "}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {" "}
        <DashboardCard
          icon={Activity}
          title="Revenue & MRR"
          value={fmtCurrency(summary?.mrr?.value)}
          changePercent={summary?.mrr?.changePercent}
          loading={loading}
          chartData={charts.mrr}
          chartType="currency"
          actionLabel="View Revenue Story"
        />{" "}
        <DashboardCard
          icon={Users}
          title="Active Subscriptions"
          value={fmtNum(summary?.active_subscriptions?.value)}
          changePercent={summary?.active_subscriptions?.changePercent}
          loading={loading}
          chartData={charts.active_subscriptions}
          chartType="number"
          actionLabel="Create Subscription"
        />{" "}
        <DashboardCard
          icon={DollarSign}
          title="Net Billing"
          value={fmtCurrency(summary?.net_billing?.value)}
          changePercent={summary?.net_billing?.changePercent}
          loading={loading}
          chartData={charts.net_billing}
          chartType="currency"
          actionLabel="Create Invoice"
        />{" "}
        <DashboardCard
          icon={CreditCard}
          title="Net Payments"
          value={fmtCurrency(summary?.net_payments?.value)}
          changePercent={summary?.net_payments?.changePercent}
          loading={loading}
          chartData={charts.net_payments}
          chartType="currency"
          actionLabel="Record Payment"
        />{" "}
      </div>{" "}
    </div>
  );
}
