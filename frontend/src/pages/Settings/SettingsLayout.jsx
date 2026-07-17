import React from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  Building2,
  User,
  Sliders,
  Blocks,
  ArrowRightLeft,
  Users,
  Key,
  Bell,
  Shield,
  ActivitySquare,
} from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import { useAuth } from "../../store/AuthContext";
export default function SettingsLayout() {
  const { user } = useAuth();
  const location = useLocation();
  const isRoot = location.pathname === "/settings";
  const menuItems = [
    {
      label: "Client Details",
      to: "/settings/client-details",
      icon: Building2,
      ultraOnly: true,
    },
    { label: "Personal Details", to: "/settings/user", icon: User },
    { label: "Configure Opz", to: "/settings/configure-opz", icon: Sliders },
    { label: "Third Party", to: "/settings/third-party", icon: Blocks },
    {
      label: "Import/Export",
      to: "/settings/import-export",
      icon: ArrowRightLeft,
    },
    { label: "Team Members", to: "/settings/team-members", icon: Users },
    { label: "Access Control", to: "/settings/access-control", icon: Key },
    { label: "Notifications", to: "/settings/notifications", icon: Bell },
    { label: "Security", to: "/settings/security", icon: Shield },
  ].filter((item) => !(item.ultraOnly && user?.role !== "ULTRASUPERADMIN"));
  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in">
      {" "}
      <PageHeader
        icon={SettingsIcon}
        title="Settings & Configuration"
        subtitle="Manage your platform preferences, team access, and integrations."
      />{" "}
      <div className="flex flex-col lg:flex-row gap-6 items-start mt-6">
        {" "}
        {/* Left column: config modules vertical menu */}{" "}
        <div className="card w-full lg:w-64 shrink-0 p-4">
          {" "}
          <div className="section-label px-2">Config Modules</div>{" "}
          <div className="space-y-1 mt-2">
            {" "}
            <NavLink
              to="/settings"
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive ? "bg-accent text-white shadow-sm" : "text-muted hover:bg-stone-50 hover:text-ink"}`
              }
            >
              {" "}
              <ActivitySquare size={16} /> Overview{" "}
            </NavLink>{" "}
            {menuItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive ? "bg-accent text-white shadow-sm" : "text-muted hover:bg-stone-50 hover:text-ink"}`
                }
              >
                {" "}
                <item.icon size={16} /> {item.label}{" "}
              </NavLink>
            ))}{" "}
          </div>{" "}
        </div>{" "}
        {/* Right column: wider content area */}{" "}
        <div className="flex-1 w-full min-w-0">
          {" "}
          <Outlet />{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
function SettingsIcon({ size }) {
  return <Sliders size={size} />;
}
