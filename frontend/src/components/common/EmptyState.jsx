import React from 'react';

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-dashed border-slate-300">
      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
        <Icon size={32} className="text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 text-center max-w-sm mb-6">{description}</p>
      {action && (
        <div>{action}</div>
      )}
    </div>
  );
}
