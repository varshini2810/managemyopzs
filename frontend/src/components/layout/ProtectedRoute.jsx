import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../store/AuthContext";
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 h-screen">
        Loading session...
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login/user" state={{ from: location }} replace />;
  }
  return children;
}
