import React, { useState, useEffect } from 'react';
import { LayoutDashboard, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import api from '../../services/api';

export default function Dashboards() {
  const [data, setData] = useState({ metrics: {}, chartData: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/revenue-story/dashboard')
      .then(res => setData(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const formatCurrency = (val) => {
    if (!val) return '$0.00';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  const metrics = [
    { label: 'Net Revenue (MRR)', val: formatCurrency(data.metrics.mrr), trend: '+12%', up: true },
    { label: 'Active Subscriptions', val: data.metrics.activeSubscriptions || 0, trend: '+5%', up: true },
    { label: 'Total Customers', val: data.metrics.totalCustomers || 0, trend: '+2%', up: true },
    { label: 'Churn Rate', val: data.metrics.churnRate || '0%', trend: '-1%', up: false },
    { label: 'Churned Revenue', val: '$3,400', trend: '+4%', up: false },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboards</h1>
          <p className="page-subtitle">Your key revenue metrics at a glance.</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="select w-48">
            <option>Last 30 Days</option>
            <option>Last Quarter</option>
            <option>Last 12 Months</option>
            <option>Custom Range</option>
          </select>
          <button className="btn-secondary">Customize Dashboard</button>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {metrics.map(m => (
          <div key={m.label} className="card-sm flex flex-col gap-2">
            <div className="text-2xs font-semibold text-muted uppercase tracking-widest">{m.label}</div>
            <div className="metric-num text-2xl">{loading ? '...' : m.val}</div>
            <div className={`text-xs font-medium flex items-center gap-1 ${m.up ? 'text-success' : 'text-danger'}`}>
              {m.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {m.trend}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="card h-80 flex flex-col">
          <div className="section-label">Revenue Trend (MRR)</div>
          <div className="flex-1 mt-4">
            {!loading && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.chartData}>
                  <defs>
                    <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2D5BFF" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#2D5BFF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E5E2" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#848281', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#848281', fontSize: 12}} dx={-10} tickFormatter={(val) => `$${val}`} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E7E5E2', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }} />
                  <Area type="monotone" dataKey="mrr" stroke="#2D5BFF" strokeWidth={2} fillOpacity={1} fill="url(#colorMrr)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
        <div className="card h-80 flex flex-col">
          <div className="section-label">Customers Growth</div>
          <div className="flex-1 mt-4">
            {!loading && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.chartData} barSize={30}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E5E2" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#848281', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#848281', fontSize: 12}} dx={-10} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E7E5E2', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }} cursor={{fill: '#F4F4F5'}} />
                  <Bar dataKey="customers" fill="#2D5BFF" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
