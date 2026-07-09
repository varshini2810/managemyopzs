import React from 'react';

export default function StatCardRow({ children }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {children}
    </div>
  );
}
