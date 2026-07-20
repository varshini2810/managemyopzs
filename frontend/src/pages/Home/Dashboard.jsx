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
    </div>
  );
}
