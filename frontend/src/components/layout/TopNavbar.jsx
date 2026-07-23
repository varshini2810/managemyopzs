import { hasMinRole } from '../../utils/rbac';
import React, { useState, useEffect } from "react";
import { useAuth } from "../../store/AuthContext";
import api from "../../services/api";
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  Building2,
  AlertCircle,
} from "lucide-react";
export default function TopNavbar() {
  const { user } = useAuth();
  const [clients, setClients] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState(
    localStorage.getItem("adminSelectedTenant") || "",
  );
  const [theme, setTheme] = useState("light");
  const [showNotifications, setShowNotifications] = useState(false);
  useEffect(() => {
    if (hasMinRole(user?.role, "ULTRASUPERADMIN")) {
      api
        .get("/admin/clients")
        .then((res) => {
          setClients(res.data.data || []);
        })
        .catch((err) => {
          // Silently ignore 404 - endpoint may not be available in this deployment
          if (err?.response?.status !== 404) {
            console.error(err);
          }
        });
    }
  }, [user]);
  const handleSelectTenant = (e) => {
    const val = e.target.value;
    setSelectedTenant(val);
    if (val) {
      localStorage.setItem("adminSelectedTenant", val);
    } else {
      localStorage.removeItem("adminSelectedTenant");
    }
    window.location.reload();
  };
  const initial = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";
  const roleLabel =
    hasMinRole(user?.role, "ULTRASUPERADMIN")
      ? "Platform Owner"
      : user?.role === "SUPERADMIN"
        ? "System Admin"
        : user?.role === "ADMIN"
          ? "Admin"
          : "User";
  return (
    <header className="bg-surface h-16 border-b border-border flex items-center justify-between px-6 shrink-0 sticky top-0 z-40">
      {" "}
      <div className="flex items-center gap-4 flex-1">
        {" "}
        <button className="text-muted hover:text-ink lg:hidden">
          {" "}
          <Menu size={20} />{" "}
        </button>{" "}
        {/* Search */}{" "}
        <div className="relative w-full max-w-md hidden md:block">
          {" "}
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-subtle"
          />{" "}
          <input
            type="text"
            placeholder="Search everything..."
            className="w-full bg-bg-main border border-border rounded-input pl-9 pr-12 py-1.5 text-sm focus:outline-none focus:border-primary focus:bg-surface transition-colors"
          />{" "}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-surface border border-border text-subtle text-[10px] font-mono px-1.5 py-0.5 rounded-card shadow-sm">
            {" "}
            ⌘K{" "}
          </div>{" "}
        </div>{" "}
        {/* ULTRASUPERADMIN Tenant Toggle */}{" "}
        {hasMinRole(user?.role, "ULTRASUPERADMIN") && (
          <div className="ml-4 flex items-center gap-2 text-xs font-medium text-muted bg-bg-main px-3 py-1.5 rounded-card border border-border">
            {" "}
            <Building2 size={14} className="text-muted" />{" "}
            <select
              value={selectedTenant}
              onChange={handleSelectTenant}
              className="bg-transparent border-none outline-none text-ink font-semibold cursor-pointer pl-1 hover:text-primary"
            >
              {" "}
              <option value="">Global Platform</option>{" "}
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.companyName}
                </option>
              ))}{" "}
            </select>{" "}
            {!selectedTenant && (
              <AlertCircle
                size={14}
                className="text-warning ml-2"
                title="Viewing Platform Global. Creation of tenant-scoped records is disabled."
              />
            )}{" "}
          </div>
        )}{" "}
      </div>{" "}
      <div className="flex items-center gap-4 shrink-0">
        {" "}
        <div className="relative">
          {" "}
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative text-muted hover:text-ink transition-colors"
          >
            {" "}
            <Bell size={18} />{" "}
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-danger rounded-full border border-surface"></span>{" "}
          </button>{" "}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-100 z-50 overflow-hidden">
              {" "}
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                {" "}
                <h3 className="font-semibold text-gray-900">
                  Notifications
                </h3>{" "}
                <span className="text-xs text-indigo-600 font-medium cursor-pointer hover:text-indigo-700">
                  Mark all as read
                </span>{" "}
              </div>{" "}
              <div className="max-h-96 overflow-y-auto">
                {" "}
                <div className="p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors bg-indigo-50/30">
                  {" "}
                  <div className="flex gap-3">
                    {" "}
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                      {" "}
                      <AlertCircle size={16} className="text-indigo-600" />{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">System Alert</span>: PDF
                        Generation successfully updated.
                      </p>{" "}
                      <p className="text-xs text-gray-500 mt-1">
                        Just now
                      </p>{" "}
                    </div>{" "}
                  </div>{" "}
                </div>{" "}
                <div className="p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                  {" "}
                  <div className="flex gap-3">
                    {" "}
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      {" "}
                      <Building2 size={16} className="text-green-600" />{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">New Client</span>: Initech
                        LLC added to platform.
                      </p>{" "}
                      <p className="text-xs text-gray-500 mt-1">
                        2 hours ago
                      </p>{" "}
                    </div>{" "}
                  </div>{" "}
                </div>{" "}
              </div>{" "}
              <div className="p-3 text-center border-t border-gray-100">
                {" "}
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                >
                  Close
                </button>{" "}
              </div>{" "}
            </div>
          )}{" "}
        </div>{" "}
        <button
          onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
          className="text-muted hover:text-ink transition-colors"
        >
          {" "}
          {theme === "light" ? <Sun size={18} /> : <Moon size={18} />}{" "}
        </button>{" "}
        <div className="w-px h-5 bg-border mx-1"></div>{" "}
        <button className="flex items-center gap-2.5 hover:bg-bg-main py-1 px-1.5 rounded-button transition-colors">
          {" "}
          <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shadow-sm">
            {" "}
            {initial}{" "}
          </div>{" "}
          <div className="hidden sm:block text-left">
            {" "}
            <div className="text-2xs font-semibold text-muted uppercase tracking-wide">
              {roleLabel}
            </div>{" "}
          </div>{" "}
          <ChevronDown size={14} className="text-subtle ml-1" />{" "}
        </button>{" "}
      </div>{" "}
    </header>
  );
}
