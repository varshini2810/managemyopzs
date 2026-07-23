import React, { useState, useEffect } from "react";
import api from "../../services/api";
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

function DashboardCard({
  icon: Icon,
  title,
  value,
  colorScheme,
}) {
  // Mapping colorScheme to specific background, text, and border classes based on the template
  const colorMap = {
    primary: "bg-primary/10 text-primary border-primary/20",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-250",
    amber: "bg-amber-50 text-amber-600 border-amber-250",
    purple: "bg-purple-50 text-purple-600 border-purple-250",
    blue: "bg-blue-50 text-blue-600 border-blue-200",
  };
  
  const iconClasses = colorMap[colorScheme] || colorMap.primary;

  return (
    <div className="bg-white rounded-card shadow-card border border-gray-border overflow-hidden transition-all duration-200 hover:scale-[1.02] hover:shadow-md cursor-pointer">
      <div className="p-5 flex items-center justify-between">
        <div>
          <p className="text-[7px] font-bold text-gray-500 uppercase tracking-wider">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 mt-2 font-sans tracking-tight">
            {value}
          </p>
        </div>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center border shrink-0 ${iconClasses}`}>
          <Icon size={20} />
        </div>
      </div>
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
    <div className="p-8 max-w-7xl mx-auto space-y-6">
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
          <div className="flex items-center gap-2 bg-white border border-border px-3 py-1.5 rounded-card text-xs font-semibold text-muted shadow-sm">
            {" "}
            <Calendar size={14} /> {currentDate}{" "}
          </div>{" "}
          <button className="btn-secondary rounded-button font-semibold shadow-sm text-xs px-3 py-1.5">
            {" "}
            Customize Layout{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          icon={Activity}
          title="Revenue & MRR"
          value={loading ? "-" : fmtCurrency(summary?.mrr?.value)}
          colorScheme="emerald"
        />
        <DashboardCard
          icon={Users}
          title="Active Subscriptions"
          value={loading ? "-" : fmtNum(summary?.active_subscriptions?.value)}
          colorScheme="blue"
        />
        <DashboardCard
          icon={DollarSign}
          title="Net Billing"
          value={loading ? "-" : fmtCurrency(summary?.net_billing?.value)}
          colorScheme="amber"
        />
        <DashboardCard
          icon={CreditCard}
          title="Net Payments"
          value={loading ? "-" : fmtCurrency(summary?.net_payments?.value)}
          colorScheme="purple"
        />
      </div>

      {/* --- PHASE 1 DASHBOARD EXPANSION --- */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Financial Overview & KPI */}
        <div className="lg:col-span-2 space-y-6">

          <div className="bg-white p-6 rounded-card shadow-card border border-gray-border">
            <h2 className="text-lg font-bold text-ink mb-4">KPI Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-border">
                <p className="text-xs text-muted font-medium mb-1">Total Customers</p>
                <p className="text-2xl font-bold text-ink">{loading ? "-" : summary?.kpi?.total_customers}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-border">
                <p className="text-xs text-muted font-medium mb-1">Average Invoice Value</p>
                <p className="text-2xl font-bold text-ink">{loading ? "-" : fmtCurrency(summary?.kpi?.average_invoice)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-border">
                <p className="text-xs text-muted font-medium mb-1">Collection Rate</p>
                <p className="text-2xl font-bold text-ink">{loading ? "-" : summary?.kpi?.collection_rate + "%"}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-card shadow-card border border-gray-border">
            <h2 className="text-lg font-bold text-ink mb-4">Financial Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-muted font-medium mb-1">Receivables (Current)</p>
                <p className="text-xl font-bold text-emerald-600">{loading ? "-" : fmtCurrency(summary?.receivables?.current)}</p>
              </div>
              <div>
                <p className="text-xs text-muted font-medium mb-1">Receivables (Overdue)</p>
                <p className="text-xl font-bold text-amber-600">{loading ? "-" : fmtCurrency(summary?.receivables?.overdue)}</p>
              </div>
              <div>
                <p className="text-xs text-muted font-medium mb-1">Payables (Current)</p>
                <p className="text-xl font-bold text-blue-600">{loading ? "-" : (summary?.payables === null ? <span className="text-sm font-medium">Pending Module</span> : fmtCurrency(summary?.payables?.current))}</p>
              </div>
              <div>
                <p className="text-xs text-muted font-medium mb-1">Payables (Overdue)</p>
                <p className="text-xl font-bold text-purple-600">{loading ? "-" : (summary?.payables === null ? <span className="text-sm font-medium">Pending Module</span> : fmtCurrency(summary?.payables?.overdue))}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-card shadow-card border border-gray-border">
              <h2 className="text-lg font-bold text-ink mb-4">Revenue Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-border bg-emerald-50 p-2 rounded">
                  <span className="text-sm font-bold text-emerald-800">Total Paid Revenue</span>
                  <span className="text-sm font-bold text-emerald-600">{loading ? "-" : fmtCurrency(summary?.revenue_summary?.total)}</span>
                </div>
                <div className="pt-2">
                  <p className="text-xs text-muted font-medium mb-3 uppercase tracking-wider">Top Contributors</p>
                  {loading ? <p className="text-sm text-muted">Loading...</p> : (
                    summary?.revenue_summary?.top_customers?.length > 0 ? (
                      <div className="space-y-3">
                        {summary.revenue_summary.top_customers.map((cust, i) => (
                          <div key={i} className="flex justify-between items-center">
                            <span className="text-sm font-medium text-ink">{cust.name}</span>
                            <span className="text-sm font-semibold">{fmtCurrency(cust.amount)}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted italic">No revenue data yet.</p>
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-card shadow-card border border-gray-border">
              <h2 className="text-lg font-bold text-ink mb-4">Expense Summary</h2>
              <div className="flex items-center justify-center h-32 bg-gray-50 rounded-lg border border-dashed border-border">
                <div className="text-center">
                  <span className="text-sm font-bold text-muted block mb-1">Pending Module</span>
                  <span className="text-xs text-muted">Requires Purchase Management</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-card shadow-card border border-gray-border">
            <h2 className="text-lg font-bold text-ink mb-4">Profit & Loss Snapshot</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-border">
                <span className="text-sm font-medium text-muted">Total Revenue</span>
                <span className="text-sm font-semibold">{loading ? "-" : fmtCurrency(summary?.pnl_snapshot?.revenue)}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-border">
                <span className="text-sm font-medium text-muted">COGS</span>
                <span className="text-sm font-semibold text-rose-600">{loading ? "-" : (summary?.pnl_snapshot?.cogs === null ? "Pending Module" : "-" + fmtCurrency(summary?.pnl_snapshot?.cogs))}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-border bg-gray-50 p-2 rounded">
                <span className="text-sm font-bold text-ink">Gross Profit</span>
                <span className="text-sm font-bold">{loading ? "-" : (summary?.pnl_snapshot?.gross_profit === null ? "Pending Module" : fmtCurrency(summary?.pnl_snapshot?.gross_profit))}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-border">
                <span className="text-sm font-medium text-muted">Operating Expenses</span>
                <span className="text-sm font-semibold text-rose-600">{loading ? "-" : (summary?.pnl_snapshot?.operating_expenses === null ? "Pending Module" : "-" + fmtCurrency(summary?.pnl_snapshot?.operating_expenses))}</span>
              </div>
              <div className="flex justify-between items-center pt-2 bg-emerald-50/50 p-2 rounded">
                <span className="text-base font-bold text-emerald-800">Net Profit</span>
                <span className="text-base font-bold text-emerald-600">{loading ? "-" : (summary?.pnl_snapshot?.net_profit === null ? "Pending Module" : fmtCurrency(summary?.pnl_snapshot?.net_profit))}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-card shadow-card border border-gray-border">
            <h2 className="text-lg font-bold text-ink mb-4">Recent Transactions</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-muted border-b border-border">
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Description</th>
                    <th className="pb-3 font-medium text-right">Amount</th>
                    <th className="pb-3 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {!loading && summary?.recent_transactions?.map((trx) => (
                    <tr key={trx.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 text-muted">{new Date(trx.date).toLocaleDateString()}</td>
                      <td className="py-3 font-medium">{trx.description}</td>
                      <td className={`py-3 text-right font-bold ${trx.type === 'CREDIT' ? 'text-emerald-600' : 'text-ink'}`}>
                        {trx.type === 'CREDIT' ? '+' : '-'}{fmtCurrency(trx.amount)}
                      </td>
                      <td className="py-3 text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${trx.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {trx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {loading && <tr><td colSpan="4" className="py-4 text-center text-muted">Loading transactions...</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar panels */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-card shadow-card border border-gray-border">
            <h2 className="text-lg font-bold text-ink mb-4 flex items-center justify-between">
              Cash Flow
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">30 Days</span>
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted mb-1">Inflow</p>
                <div className="flex items-end justify-between">
                  <p className="text-xl font-bold text-emerald-600">{loading ? "-" : fmtCurrency(summary?.cash_flow?.inflow)}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted mb-1">Outflow</p>
                <div className="flex items-end justify-between">
                  <p className="text-xl font-bold text-rose-600">{loading ? "-" : (summary?.cash_flow?.outflow === null ? <span className="text-sm font-medium">Pending Module</span> : fmtCurrency(summary?.cash_flow?.outflow))}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted mb-1">Net Cash Flow</p>
                <p className="text-2xl font-bold text-ink">{loading ? "-" : (summary?.cash_flow?.net === null ? <span className="text-base font-medium">Pending Module</span> : fmtCurrency(summary?.cash_flow?.net))}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-card shadow-card border border-gray-border">
            <h2 className="text-lg font-bold text-ink mb-4">Notifications & Alerts</h2>
            <div className="space-y-3">
              {!loading && summary?.notifications?.map((notif) => (
                <div key={notif.id} className={`p-3 rounded-lg border-l-4 ${notif.type === 'WARNING' ? 'bg-amber-50 border-amber-500' : notif.type === 'SUCCESS' ? 'bg-emerald-50 border-emerald-500' : 'bg-blue-50 border-blue-500'}`}>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`text-sm font-bold ${notif.type === 'WARNING' ? 'text-amber-800' : notif.type === 'SUCCESS' ? 'text-emerald-800' : 'text-blue-800'}`}>{notif.title}</h3>
                    <span className="text-[10px] text-muted">{new Date(notif.date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-muted">{notif.message}</p>
                </div>
              ))}
              {loading && <p className="text-sm text-muted text-center py-4">Loading alerts...</p>}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
