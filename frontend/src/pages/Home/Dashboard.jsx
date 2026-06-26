import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

/* ─── Inline Sparkline (SVG, no recharts) ─────────────────────── */
function Sparkline({ data, color = '#2D5BFF', height = 32, width = 80 }) {
  if (!data || data.length < 2) return null;

  const vals = data.map(d => d.value);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const range = max - min || 1;

  const pts = vals.map((v, i) => {
    const x = (i / (vals.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const d = 'M' + pts.join(' L');

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
      <polyline
        points={pts.join(' ')}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ─── Ledger Metric Card (the signature element) ───────────────── */
function LedgerCard({ title, value, changePercent, sparkData, loading }) {
  const growing  = changePercent > 0.5;
  const stable   = Math.abs(changePercent) <= 0.5;
  const declining = changePercent < -0.5;

  const accentColor = growing ? '#1A7F4E' : declining ? '#B45309' : '#A8A49F';
  const sparkColor  = growing ? '#1A7F4E' : declining ? '#B45309' : '#2D5BFF';
  const changeColor = growing ? '#1A7F4E' : declining ? '#B45309' : '#6B6863';

  return (
    <div
      className="relative bg-surface flex-1 min-w-[200px] flex"
      style={{ border: '1px solid #E7E5E2' }}
    >
      {/* Ledger accent bar — left edge */}
      <div
        style={{
          width: 3,
          background: accentColor,
          borderRadius: '4px 0 0 4px',
          flexShrink: 0,
        }}
      />

      <div className="flex-1 px-5 py-5">
        {loading ? (
          <div className="space-y-2">
            <div className="skeleton h-3 w-24 rounded" style={{ background: '#E7E5E2' }} />
            <div className="skeleton h-8 w-32 rounded" style={{ background: '#E7E5E2' }} />
          </div>
        ) : (
          <>
            <div className="text-xs text-muted font-medium tracking-wide uppercase mb-2">
              {title}
            </div>
            <div className="flex items-end gap-4 justify-between">
              <div>
                <div
                  className="font-display font-semibold tabular-nums text-ink"
                  style={{ fontSize: 28, lineHeight: 1, letterSpacing: '-0.03em' }}
                >
                  {value}
                </div>
                <div
                  className="text-xs font-medium tabular-nums mt-1.5"
                  style={{ color: changeColor }}
                >
                  {changePercent > 0 ? '+' : ''}{changePercent?.toFixed(1)}% vs prev period
                </div>
              </div>
              {/* Inline sparkline — sits to the right of the number */}
              <Sparkline data={sparkData} color={sparkColor} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Full-size MetricChart using Recharts ─────────────────────── */
const RANGES = ['1d', '3m', '6m', '12m'];

function MetricChart({ title, metricType }) {
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
        <div className="bg-white border border-gray-200 rounded-md p-2 shadow-sm text-xs font-sans">
          <div className="text-gray-500 mb-1">{label}</div>
          <div className="font-semibold text-gray-900 tabular-nums">
            {fmtVal(payload[0].value)}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-surface rounded-lg" style={{ border: '1px solid #E7E5E2' }}>
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: '1px solid #E7E5E2' }}
      >
        <div className="text-sm font-medium text-ink">{title}</div>
        <div className="seg-control">
          {RANGES.map(r => (
            <button
              key={r}
              className={`seg-btn ${range === r ? 'active' : ''}`}
              onClick={() => setRange(r)}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 py-4 h-40">
        {loading ? (
          <div className="skeleton rounded h-full w-full" style={{ background: '#F0EFEC' }} />
        ) : data.length === 0 ? (
          <div className="flex items-center justify-center h-full text-sm text-muted">
            No data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id={`colorValue-${metricType}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2D5BFF" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#2D5BFF" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0EFEC" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#A8A49F' }} 
                minTickGap={30}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#A8A49F' }} 
                tickFormatter={fmtVal}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#2D5BFF" 
                strokeWidth={2}
                fillOpacity={1} 
                fill={`url(#colorValue-${metricType})`} 
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

/* ─── Dashboard Page ─────────────────────────────────────────────── */
export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [sparklines, setSparklines] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/dashboard/summary'),
      api.get('/dashboard/metrics?type=mrr&range=3m'),
      api.get('/dashboard/metrics?type=active_subscriptions&range=3m'),
      api.get('/dashboard/metrics?type=net_billing&range=3m'),
      api.get('/dashboard/metrics?type=net_payments&range=3m'),
      api.get('/dashboard/metrics?type=unpaid_invoices&range=3m'),
    ]).then(([sum, mrr, subs, bill, pay, unpaid]) => {
      setSummary(sum.data.data);
      setSparklines({
        mrr: mrr.data.data?.slice(-20),
        active_subscriptions: subs.data.data?.slice(-20),
        net_billing: bill.data.data?.slice(-20),
        net_payments: pay.data.data?.slice(-20),
        unpaid_invoices: unpaid.data.data?.slice(-20),
      });
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const fmtCurrency = (v) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v || 0);
  const fmtNum = (v) =>
    new Intl.NumberFormat('en-US').format(v || 0);

  const cards = [
    {
      key: 'mrr',
      title: 'Monthly Recurring Revenue',
      value: fmtCurrency(summary?.mrr?.value),
      changePercent: summary?.mrr?.changePercent || 0,
    },
    {
      key: 'active_subscriptions',
      title: 'Active Subscriptions',
      value: fmtNum(summary?.active_subscriptions?.value),
      changePercent: summary?.active_subscriptions?.changePercent || 0,
    },
    {
      key: 'net_billing',
      title: 'Net Billing',
      value: fmtCurrency(summary?.net_billing?.value),
      changePercent: summary?.net_billing?.changePercent || 0,
    },
    {
      key: 'net_payments',
      title: 'Net Payments',
      value: fmtCurrency(summary?.net_payments?.value),
      changePercent: summary?.net_payments?.changePercent || 0,
    },
    {
      key: 'unpaid_invoices',
      title: 'Unpaid Invoices',
      value: fmtCurrency(summary?.unpaid_invoices?.value),
      changePercent: summary?.unpaid_invoices?.changePercent || 0,
    },
  ];

  return (
    <div>
      {/* ── Module sub-header ── */}
      <div className="module-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="text-xs text-muted mt-0.5">Revenue and billing overview</p>
        </div>
      </div>

      <div className="px-8 py-8 space-y-8">
        {/* ── Ledger metric cards — horizontal scroll row ── */}
        <div
          className="flex gap-0 overflow-x-auto"
          style={{
            borderRadius: 8,
            border: '1px solid #E7E5E2',
            overflow: 'hidden',
          }}
        >
          {cards.map((card, i) => (
            <React.Fragment key={card.key}>
              <LedgerCard
                title={card.title}
                value={card.value}
                changePercent={card.changePercent}
                sparkData={sparklines[card.key]}
                loading={loading}
              />
              {i < cards.length - 1 && (
                <div style={{ width: 1, background: '#E7E5E2', flexShrink: 0 }} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* ── Charts grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MetricChart title="Monthly Recurring Revenue" metricType="mrr" />
          <MetricChart title="Active Subscriptions" metricType="active_subscriptions" />
          <MetricChart title="Net Billing" metricType="net_billing" />
          <MetricChart title="Net Payments" metricType="net_payments" />
          <MetricChart title="Unpaid Invoices" metricType="unpaid_invoices" />
        </div>
      </div>
    </div>
  );
}
