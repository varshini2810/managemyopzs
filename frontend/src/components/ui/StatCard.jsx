import React from 'react';

export default function StatCard({ title, value, icon: Icon, colorClass = "text-indigo-600 bg-indigo-50", trend, trendLabel }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col relative overflow-hidden group">
      <div className="flex items-start justify-between mb-4">
        {Icon && (
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}>
            <Icon size={20} />
          </div>
        )}
        {trend && (
          <div className={`text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 ${
            trend > 0 ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'
          }`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </div>
        )}
      </div>
      
      <div>
        <div className="text-3xl font-bold text-gray-900 tracking-tight mb-1">{value}</div>
        <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{title}</div>
        {trendLabel && (
          <div className="text-xs text-gray-400 mt-2">{trendLabel}</div>
        )}
      </div>
    </div>
  );
}
