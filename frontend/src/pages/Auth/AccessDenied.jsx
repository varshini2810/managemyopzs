import React from "react";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../store/AuthContext";
export default function AccessDenied() {
  const navigate = useNavigate();
  const { user } = useAuth();
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 p-6">
      {" "}
      <div className="max-w-md w-full bg-surface rounded-2xl shadow-sm border border-border p-8 text-center space-y-6">
        {" "}
        <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-2">
          {" "}
          <ShieldAlert size={32} className="text-rose-500" />{" "}
        </div>{" "}
        <div className="space-y-2">
          {" "}
          <h1 className="text-2xl font-bold text-ink">Access Denied</h1>{" "}
          <p className="text-muted text-sm">
            {" "}
            You don't have permission to access this page. If you believe this
            is an error, please contact your administrator.{" "}
          </p>{" "}
        </div>{" "}
        <div className="pt-4 flex flex-col gap-3">
          {" "}
          <button
            onClick={() => navigate(user?.role === "USER" ? "/portal" : "/")}
            className="btn-primary w-full justify-center py-2.5"
          >
            {" "}
            <ArrowLeft size={16} className="mr-2" /> Return to Dashboard{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
