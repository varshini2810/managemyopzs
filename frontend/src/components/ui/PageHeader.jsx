import React from 'react';

export default function PageHeader({ icon: Icon, iconColorClass = "text-indigo-600 bg-indigo-100", title, subtitle, actionLabel, onAction, actionIcon: ActionIcon, actionColorClass = "bg-indigo-600 hover:bg-indigo-700 text-white" }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        {Icon && (
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconColorClass}`}>
            <Icon size={24} />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight leading-tight">{title}</h1>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
      {actionLabel && (
        <button
          onClick={onAction}
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm shadow-sm transition-colors ${actionColorClass}`}
        >
          {ActionIcon && <ActionIcon size={16} />}
          {actionLabel}
        </button>
      )}
    </div>
  );
}
