import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

export default function MetricCard({ title, value, changePercent, data = [] }) {
  const isPositive = changePercent >= 0;

  return (
    <div className="card card-hover flex flex-col justify-between h-36">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-slate-500">{title}</h3>
          <div className="text-2xl font-bold text-slate-900 mt-1">{value}</div>
        </div>
        <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
          isPositive ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'
        }`}>
          {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {Math.abs(changePercent)}%
        </div>
      </div>
      
      {/* Mini sparkline chart */}
      <div className="h-10 mt-4 w-full opacity-60">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={isPositive ? '#10b981' : '#ef4444'} 
              fill={`url(#gradient-${title})`} 
              strokeWidth={2}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
