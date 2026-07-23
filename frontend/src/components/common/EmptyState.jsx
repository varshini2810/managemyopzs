import React from 'react';
import { File } from 'lucide-react';

export default function EmptyState({ 
  icon: Icon = File, 
  title = "No records found", 
  message = "Try adjusting your filters or create a new record.", 
  actionLabel, 
  onAction 
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-12 h-12 rounded-full bg-bg-main flex items-center justify-center mb-4 border border-stone-200 shadow-sm">
        <Icon className="text-stone-400" size={24} />
      </div>
      <h3 className="text-sm font-semibold text-ink mb-1">{title}</h3>
      <p className="text-sm text-muted max-w-sm mx-auto">{message}</p>
      
      {actionLabel && onAction && (
        <button 
          onClick={onAction} 
          className="mt-6 btn-secondary btn-sm"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
