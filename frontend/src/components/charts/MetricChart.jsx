import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../services/api';

const RANGES = [
  { label: 'Daily', value: '1d' },
  { label: '3 Months', value: '3m' },
  { label: '6 Months', value: '6m' },
  { label: '12 Months', value: '12m' },
];

export default function MetricChart({ title, metricType }) {
  const [range, setRange] = useState('3m');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/dashboard/metrics?type=${metricType}&range=${range}`)
      .then(res => setData(res.data.data))
      .catch(err => console.error("Failed to load metrics", err))
      .finally(() => setLoading(false));
  }, [metricType, range]);

  return (
    <div className="card h-96 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-slate-900">{title}</h3>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          {RANGES.map(r => (
            <button
              key={r.value}
              onClick={() => setRange(r.value)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                range === r.value ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex-1 relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
            <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`color-${metricType}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 12 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 12 }}
              tickFormatter={(val) => val >= 1000 ? `${(val/1000).toFixed(1)}k` : val}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
              itemStyle={{ color: '#0F172A', fontWeight: 500 }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#4F46E5" 
              strokeWidth={2}
              fillOpacity={1} 
              fill={`url(#color-${metricType})`} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
