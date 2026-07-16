import React, { useState, useRef, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  LogOut,
  ChevronDown,
  ActivitySquare,
  Settings,
  User,
  KeyRound,
  ArrowRightLeft,
} from "lucide-react";
import ChangePortalModal from "./ChangePortalModal";
import { useAuth } from "../../store/AuthContext";
import { useSuite } from "../../store/SuiteContext";
import { getNavigationForRole } from "../../utils/navigation";
export default function Sidebar({ collapsed, onToggle, env }) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { currentSuite } = useSuite();
  const navigate = useNavigate();
  const [expandedGroups, setExpandedGroups] = useState({
    "Product Catalog": location.pathname.startsWith("/catalog"),
    Settings: location.pathname.startsWith("/settings"),
    "Revenue Story": location.pathname.startsWith("/revenue-story"),
  });
  const toggleGroup = (label) => {
    if (collapsed) onToggle();
    setExpandedGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };
  const initial = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";
  const finalNavItems = getNavigationForRole(
    user?.role,
    currentSuite,
    user?.grantedModules || [],
  );
  return (
    <aside
      className="flex flex-col shrink-0 h-screen sticky top-0 bg-surface border-r border-border relative"
      style={{
        width: collapsed ? 64 : 280,
        transition: "width 0.2s cubic-bezier(0.16,1,0.3,1)",
        zIndex: 10,
      }}
    >
      {" "}
      {/* Floating Toggle Button */}{" "}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-6 w-6 h-6 bg-white border border-border rounded-full flex items-center justify-center text-muted hover:text-ink hover:border-border-strong shadow-sm z-20"
      >
        {" "}
        {collapsed ? (
          <ChevronRight size={14} />
        ) : (
          <ChevronLeft size={14} />
        )}{" "}
      </button>{" "}
      {/* Header */}{" "}
      <div
        className="flex items-center px-4 shrink-0 border-b border-border"
        style={{ height: 64 }}
      >
        {" "}
        <div
          className="shrink-0 flex items-center justify-center rounded-lg overflow-hidden shadow-sm"
          style={{ width: 32, height: 32, background: "#1E293B" }}
        >
          {" "}
          <svg
            width="20"
            height="20"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {" "}
            <path
              d="M50 15 L85 32.5 L85 67.5 L50 85 L15 67.5 L15 32.5 Z"
              stroke="#FFFFFF"
              strokeWidth="8"
              strokeLinejoin="round"
            />{" "}
            <circle cx="50" cy="50" r="12" fill="#FFFFFF" />{" "}
          </svg>{" "}
        </div>{" "}
        <div
          className="ml-3 overflow-hidden transition-all duration-200"
          style={{ width: collapsed ? 0 : 180, opacity: collapsed ? 0 : 1 }}
        >
          {" "}
          <div className="font-display font-bold text-ink text-sm tracking-tight flex items-center gap-2 whitespace-nowrap">
            {" "}
            Opz Billing OS{" "}
            {env === "live" && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700">
                LIVE
              </span>
            )}{" "}
          </div>{" "}
          <div className="text-2xs text-muted whitespace-nowrap uppercase tracking-wider">
            {" "}
            Finance OS{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      {/* Navigation */}{" "}
      <nav
        className="flex-1 overflow-y-auto px-3 py-6"
        style={{ scrollbarWidth: "none" }}
      >
        {" "}
        {/* Platform Console (ULTRASUPERADMIN ONLY) */}{" "}
        {user?.role === "ULTRASUPERADMIN" && (
          <div className="mb-8">
            {" "}
            {!collapsed && (
              <div className="nav-group-label px-2 mb-2">
                Platform Management
              </div>
            )}{" "}
            <NavLink
              to="/platform-console/clients"
              title={collapsed ? "Client Management" : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all relative overflow-hidden ${isActive ? "bg-accent/10 text-accent font-semibold" : "text-muted hover:bg-stone-50 hover:text-ink"}`
              }
              style={{ justifyContent: collapsed ? "center" : "flex-start" }}
            >
              {({ isActive }) => (
                <>
                  {isActive && <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-accent rounded-r-full" />}
                  <ActivitySquare size={18} className="shrink-0" />
                  {!collapsed && (
                    <span className="truncate">Client Management</span>
                  )}
                </>
              )}
            </NavLink>
          </div>
        )}{" "}
        <div className="mb-6">
          {" "}
          {!collapsed && (
            <div className="nav-group-label px-2 mb-2">Finance Tools</div>
          )}{" "}
          <div className="space-y-1">
            {" "}
            {finalNavItems.map((item) => {
              if (item.subItems) {
                const isExpanded = expandedGroups[item.label];
                const isChildActive = item.subItems.some((sub) =>
                  location.pathname.startsWith(sub.to),
                );
                return (
                  <div key={item.label} className="flex flex-col">
                    {" "}
                    <button
                      onClick={() => toggleGroup(item.label)}
                      className={`flex w-full items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isChildActive && !isExpanded ? "bg-accent text-white shadow-sm" : "text-muted hover:bg-stone-50 hover:text-ink"}`}
                      style={{
                        justifyContent: collapsed ? "center" : "flex-start",
                      }}
                      title={collapsed ? item.label : undefined}
                    >
                      {" "}
                      <item.icon size={18} className="shrink-0" />{" "}
                      {!collapsed && (
                        <>
                          {" "}
                          <span className="truncate flex-1 text-left">
                            {item.label}
                          </span>{" "}
                          <ChevronDown
                            size={14}
                            style={{
                              transform: isExpanded
                                ? "rotate(180deg)"
                                : "rotate(0deg)",
                              transition: "transform 0.2s",
                            }}
                          />{" "}
                        </>
                      )}{" "}
                    </button>{" "}
                    {/* Nested Items */}{" "}
                    {!collapsed && isExpanded && (
                      <div className="mt-1 space-y-1 pl-9 pr-1">
                        {" "}
                        {item.subItems.map((sub) => (
                          <NavLink
                            key={sub.to}
                            to={sub.to}
                            className={({ isActive }) =>
                              `block px-3 py-1.5 text-xs font-medium rounded transition-colors ${isActive ? "text-accent bg-accent-light" : "text-muted hover:text-ink hover:bg-stone-50"}`
                            }
                          >
                            {" "}
                            <span className="truncate">{sub.label}</span>{" "}
                          </NavLink>
                        ))}{" "}
                      </div>
                    )}{" "}
                  </div>
                );
              }
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  title={collapsed ? item.label : undefined}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all relative overflow-hidden ${isActive ? "bg-accent/10 text-accent font-semibold" : "text-muted hover:bg-stone-50 hover:text-ink"}`
                  }
                  style={{
                    justifyContent: collapsed ? "center" : "flex-start",
                  }}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-accent rounded-r-full" />}
                      <item.icon size={18} className="shrink-0" />
                      {!collapsed && (
                        <span className="truncate">{item.label}</span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}{" "}
          </div>{" "}
        </div>{" "}
      </nav>{" "}
      {/* Pinned User Footer */}{" "}
      <ProfileFooter
        user={user}
        initial={initial}
        collapsed={collapsed}
        logout={logout}
        navigate={navigate}
      />{" "}
    </aside>
  );
}
const PORTAL_TYPE_MAP = {
  ULTRASUPERADMIN: { label: "Platform Owner" },
  SUPERADMIN: { label: "System Admin" },
  ADMIN: { label: "Admin" },
  USER: { label: "User" },
};
function ProfileFooter({ user, initial, collapsed, logout, navigate }) {
  const [open, setOpen] = useState(false);
  const [changePortalOpen, setChangePortalOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);
  const portalInfo = PORTAL_TYPE_MAP[user?.role] || PORTAL_TYPE_MAP["USER"];
  return (
    <>
      {" "}
      <div ref={ref} className="p-4 border-t border-border relative">
        {" "}
        {open && !collapsed && (
          <div className="absolute bottom-full left-4 right-4 mb-2 bg-surface border border-border rounded-xl shadow-tooltip overflow-hidden z-50 animate-fade-in">
            {" "}
            <div className="py-1">
              {" "}
              <MenuItem
                icon={User}
                label="My Profile"
                onClick={() => {
                  setOpen(false);
                  navigate("/settings/user");
                }}
              />{" "}
              <MenuItem
                icon={KeyRound}
                label="Security"
                onClick={() => {
                  setOpen(false);
                  navigate("/settings/security");
                }}
              />{" "}
              {user?.role === "ULTRASUPERADMIN" && (
                <MenuItem
                  icon={ArrowRightLeft}
                  label="Change Portal"
                  highlight
                  onClick={() => {
                    setOpen(false);
                    setChangePortalOpen(true);
                  }}
                />
              )}{" "}
            </div>{" "}
            <div className="border-t border-border py-1">
              {" "}
              <MenuItem
                icon={LogOut}
                label="Sign Out"
                danger
                onClick={() => {
                  setOpen(false);
                  logout();
                }}
              />{" "}
            </div>{" "}
          </div>
        )}{" "}
        <div
          className={`flex items-center gap-3 cursor-pointer select-none rounded-xl transition-colors hover:bg-stone-50 ${collapsed ? "justify-center p-2" : "p-2 -mx-2"}`}
          onClick={() => setOpen((v) => !v)}
          title={collapsed ? user?.name || "Profile" : undefined}
        >
          {" "}
          <div className="shrink-0 flex items-center justify-center rounded-full text-xs font-semibold text-white bg-accent w-8 h-8 shadow-sm">
            {" "}
            {initial}{" "}
          </div>{" "}
          {!collapsed && (
            <div className="flex-1 min-w-0">
              {" "}
              <div className="text-sm font-bold text-ink truncate">
                {user?.name || "Admin"}
              </div>{" "}
              <div className="text-[10px] text-muted uppercase tracking-wider font-semibold truncate">
                {portalInfo.label}
              </div>{" "}
            </div>
          )}{" "}
          {!collapsed && (
            <LogOut size={14} className="text-muted shrink-0" />
          )}{" "}
        </div>{" "}
      </div>{" "}
      {user?.role === "ULTRASUPERADMIN" && (
        <ChangePortalModal
          isOpen={changePortalOpen}
          onClose={() => setChangePortalOpen(false)}
        />
      )}{" "}
    </>
  );
}
function MenuItem({ icon: Icon, label, onClick, danger, highlight }) {
  const color = danger
    ? "text-danger"
    : highlight
      ? "text-accent"
      : "text-muted";
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2 text-left text-sm font-medium transition-colors hover:bg-stone-50 ${color} hover:text-ink`}
    >
      {" "}
      <Icon
        size={14}
        className={
          danger ? "text-danger" : highlight ? "text-accent" : "text-muted"
        }
      />{" "}
      {label}{" "}
    </button>
  );
}
