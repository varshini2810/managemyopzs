import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'USER' && user.isCustomer) return <Navigate to="/portal" replace />;
  
  return <Outlet />;
}
