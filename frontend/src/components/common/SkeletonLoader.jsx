import React from 'react';

export default function SkeletonLoader({ type = 'text', rows = 1, className = '' }) {
  if (type === 'table') {
    return (
      <div className={`w-full space-y-4 ${className}`}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="skeleton-text w-1/4"></div>
            <div className="skeleton-text w-1/4"></div>
            <div className="skeleton-text w-1/4"></div>
            <div className="skeleton-text w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div className={`card p-6 flex flex-col gap-4 ${className}`}>
        <div className="flex items-center gap-3">
          <div className="skeleton-circle w-10 h-10"></div>
          <div className="skeleton-text w-1/3"></div>
        </div>
        <div className="skeleton-text w-1/2 h-8 mt-2"></div>
        <div className="skeleton-text w-1/4 mt-1"></div>
      </div>
    );
  }

  // Default is 'text'
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div 
          key={i} 
          className="skeleton-text" 
          style={{ width: i === rows - 1 && rows > 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  );
}
