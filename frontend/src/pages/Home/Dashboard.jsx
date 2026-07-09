import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useAuth } from '../../store/AuthContext';
import { LayoutDashboard, Settings, Calendar, DollarSign, Users, CreditCard, FileText, ArrowUpRight } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import StatCardRow from '../../components/ui/StatCardRow';
import StatCard from '../../components/ui/StatCard';

const RANGES = ['1d', '3m', '6m', '12m'];

function MetricChart({ title, metricType, icon: Icon, colorClass }) {
  const [range, setRange] = useState('3m');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/dashboard/metrics?type=${metricType}&range=${range}`)
      .then(res => setData(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [metricType, range]);

  const fmtVal = (v) => {
    if (metricType === 'active_subscriptions') return Math.round(v).toLocaleString();
    return '$' + (v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v.toFixed(0));
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-100 rounded-lg p-3 shadow-lg text-sm">
          <div className="text-gray-500 mb-1 font-medium">{label}</div>
          <div className="font-bold text-gray-900 text-lg">
            {fmtVal(payload[0].value)}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorClass}`}>
              <Icon size={16} />
            </div>
          )}
          <div className="text-sm font-bold text-gray-900 tracking-wide uppercase">{title}</div>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-lg">
          {RANGES.map(r => (
            <button
              key={r}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${
                range === r ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setRange(r)}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 h-64 flex-1">
        {loading ? (
          <div className="animate-pulse bg-gray-50 rounded-lg h-full w-full" />
        ) : data.length === 0 ? (
          <div className="flex items-center justify-center h-full text-sm font-medium text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
            No data available for this period
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id={`colorValue-${metricType}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#F3F4F6" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: '#9CA3AF', fontWeight: 500 }} 
                minTickGap={30}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: '#9CA3AF', fontWeight: 500 }} 
                tickFormatter={fmtVal}
                dx={-10}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#4F46E5', strokeWidth: 1, strokeDasharray: '4 4' }} />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#4F46E5" 
                strokeWidth={3}
                fillOpacity={1} 
                fill={`url(#colorValue-${metricType})`} 
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
      <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-xl">
        <button className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-sm rounded-lg transition-colors flex justify-center items-center gap-2">
          View Detailed Report <ArrowUpRight size={16} />
        </button>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    api.get('/dashboard/summary')
      .then(res => setSummary(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const fmtCurrency = (v) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v || 0);
  const fmtNum = (v) =>
    new Intl.NumberFormat('en-US').format(v || 0);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formattedDate = currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {getGreeting()}, {user?.name?.split(' ')[0] || 'Admin'}! 👋
          </h1>
          <p className="text-gray-500 font-medium mt-1">Here's what's happening with your revenue today.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 shadow-sm">
            <Calendar size={16} className="text-indigo-500" />
            {formattedDate}
          </div>
          <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors shadow-sm">
            <Settings size={16} />
            Customize Layout
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-white rounded-xl border border-gray-100 animate-pulse" />)}
        </div>
      ) : (
        <StatCardRow>
          <StatCard
            title="Monthly Recurring Revenue"
            value={fmtCurrency(summary?.mrr?.value)}
            trend={summary?.mrr?.changePercent}
            trendLabel="vs last month"
            icon={DollarSign}
            colorClass="text-emerald-600 bg-emerald-100"
          />
          <StatCard
            title="Active Subscriptions"
            value={fmtNum(summary?.active_subscriptions?.value)}
            trend={summary?.active_subscriptions?.changePercent}
            trendLabel="vs last month"
            icon={Users}
            colorClass="text-blue-600 bg-blue-100"
          />
          <StatCard
            title="Net Billing"
            value={fmtCurrency(summary?.net_billing?.value)}
            trend={summary?.net_billing?.changePercent}
            trendLabel="vs last month"
            icon={FileText}
            colorClass="text-purple-600 bg-purple-100"
          />
          <StatCard
            title="Net Payments"
            value={fmtCurrency(summary?.net_payments?.value)}
            trend={summary?.net_payments?.changePercent}
            trendLabel="vs last month"
            icon={CreditCard}
            colorClass="text-amber-600 bg-amber-100"
          />
        </StatCardRow>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
        <MetricChart title="MRR Trend" metricType="mrr" icon={LayoutDashboard} colorClass="bg-indigo-100 text-indigo-600" />
        <MetricChart title="Subscription Growth" metricType="active_subscriptions" icon={Users} colorClass="bg-blue-100 text-blue-600" />
        <MetricChart title="Net Billing Performance" metricType="net_billing" icon={FileText} colorClass="bg-purple-100 text-purple-600" />
        <MetricChart title="Cash Flow (Payments)" metricType="net_payments" icon={CreditCard} colorClass="bg-amber-100 text-amber-600" />
      </div>
    </div>
  );
}
