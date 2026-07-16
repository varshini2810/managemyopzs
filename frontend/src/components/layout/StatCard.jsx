import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function StatCard({
  icon: Icon,
  value,
  label,
  trend, // e.g., { value: 12, label: 'vs last month' } or undefined
  iconColor = "text-accent",
  iconBg = "bg-accent-light",
  className = "",
}) {
  const isPositive = trend?.value >= 0;
  
  return (
    <div className={`card flex flex-col gap-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-9 h-9 rounded-lg ${iconBg} ${iconColor} flex items-center justify-center shrink-0`}>
            <Icon size={18} />
          </div>
          <span className="label !mb-0">{label}</span>
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-semibold ${isPositive ? 'text-success' : 'text-danger'}`}>
            {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
      
      <div>
        <div className="metric-num">
          {value}
        </div>
        {trend && trend.label && (
          <div className="text-xs text-muted mt-1">{trend.label}</div>
        )}
      </div>
    </div>
  );
}
