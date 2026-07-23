import React, { useState } from "react";
import {
  Search,
  Plus,
  Filter,
  MoreVertical,
  Copy,
  Edit2,
  Trash2,
  Eye,
} from "lucide-react";
const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    name: "Welcome Email",
    subject: "Welcome to ManageMyOPZ",
    sender: "ManageMyOPZ Team",
    status: true,
  },
  {
    id: 2,
    name: "Trial Started",
    subject: "Your Trial Has Started",
    sender: "ManageMyOPZ Team",
    status: true,
  },
  {
    id: 3,
    name: "Trial Expiry Reminder",
    subject: "Trial Ending Soon",
    sender: "ManageMyOPZ Team",
    status: true,
  },
  {
    id: 4,
    name: "Subscription Activated",
    subject: "Subscription Activated Successfully",
    sender: "Billing Dept",
    status: false,
  },
  {
    id: 5,
    name: "Payment Received",
    subject: "Payment Confirmation",
    sender: "Billing Dept",
    status: true,
  },
];
export default function NotificationCategoryPage({
  categoryName,
  onBack,
  onEdit,
}) {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const handleToggle = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: !n.status } : n)),
    );
  };
  const filtered = notifications.filter((n) => {
    const matchesSearch =
      n.name.toLowerCase().includes(search.toLowerCase()) ||
      n.subject.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filterStatus === "all"
        ? true
        : filterStatus === "active"
          ? n.status
          : !n.status;
    return matchesSearch && matchesFilter;
  });
  return (
    <div className="p-8 max-w-7xl mx-auto font-sans">
      {" "}
      {/* Breadcrumb & Header */}{" "}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        {" "}
        <div>
          {" "}
          <nav className="flex text-sm text-stone-500 mb-2">
            {" "}
            <span
              className="hover:text-stone-800 cursor-pointer"
              onClick={onBack}
            >
              Configure OPZ
            </span>{" "}
            <span className="mx-2">/</span>{" "}
            <span
              className="hover:text-stone-800 cursor-pointer"
              onClick={onBack}
            >
              Email Notifications
            </span>{" "}
            <span className="mx-2">/</span>{" "}
            <span className="text-stone-900 font-medium">
              {categoryName}
            </span>{" "}
          </nav>{" "}
          <h1 className="text-2xl font-bold text-stone-900">
            {categoryName}
          </h1>{" "}
        </div>{" "}
        <button
          className="flex items-center gap-2 bg-[#2563EB] hover:bg-blue-700 text-white px-4 py-2 rounded-button font-medium shadow-sm transition-colors"
          onClick={() =>
            onEdit({
              name: "New Notification",
              subject: "",
              sender: "ManageMyOPZ Team",
              status: true,
            })
          }
        >
          {" "}
          <Plus size={18} /> Add Notification{" "}
        </button>{" "}
      </div>{" "}
      {/* Toolbar */}{" "}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {" "}
        <div className="relative flex-1 max-w-md">
          {" "}
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
          />{" "}
          <input
            type="text"
            placeholder="Search notifications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-card outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
          />{" "}
        </div>{" "}
        <div className="relative">
          {" "}
          <Filter
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
          />{" "}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="appearance-none pl-9 pr-8 py-2 border border-stone-300 rounded-card outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm bg-white cursor-pointer"
          >
            {" "}
            <option value="all">All Status</option>{" "}
            <option value="active">Active</option>{" "}
            <option value="inactive">Inactive</option>{" "}
          </select>{" "}
        </div>{" "}
      </div>{" "}
      {/* Data Table */}{" "}
      <div className="bg-white rounded-card shadow-sm border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-bg-main border-b border-stone-200 text-stone-600">
              <tr>
                <th className="px-6 py-3 font-medium">
                  Notification Name
                </th>{" "}
                <th className="px-6 py-3 font-medium">Email Subject</th>{" "}
                <th className="px-6 py-3 font-medium">Sender</th>{" "}
                <th className="px-6 py-3 font-medium">Status</th>{" "}
                <th className="px-6 py-3 font-medium text-right">
                  Actions
                </th></tr></thead>{" "}
            <tbody className="divide-y divide-stone-200 text-stone-800">
              {filtered.map((notif) => (
                <tr
                  key={notif.id}
                  className="hover:bg-bg-main transition-colors"
                >
                  <td className="px-6 py-4 font-medium">{notif.name}</td>{" "}
                  <td className="px-6 py-4">{notif.subject}</td>{" "}
                  <td className="px-6 py-4">{notif.sender}</td>{" "}
                  <td className="px-6 py-4">
                    {/* Toggle Switch */}{" "}
                    <button
                      onClick={() => handleToggle(notif.id)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${notif.status ? "bg-blue-600" : "bg-stone-300"}`}
                    >
                      {" "}
                      <span
                        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${notif.status ? "translate-x-4.5" : "translate-x-1"}`}
                      />{" "}
                    </button>{" "}
                    <span className="ml-2 text-xs text-stone-500 align-middle">
                      {notif.status ? "Active" : "Inactive"}{" "}
                    </span>{" "}
                  </td>{" "}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3 text-stone-400">
                      <button
                        onClick={() => onEdit(notif)}
                        className="hover:text-blue-600"
                        title="Edit"
                      >
                        {" "}
                        <Edit2 size={16} />{" "}
                      </button>{" "}
                      <button className="hover:text-blue-600" title="Preview">
                        {" "}
                        <Eye size={16} />{" "}
                      </button>{" "}
                      <button className="hover:text-blue-600" title="Duplicate">
                        {" "}
                        <Copy size={16} />{" "}
                      </button>{" "}
                      <button className="hover:text-red-600" title="Delete">
                        <Trash2 size={16} />{" "}
                      </button>{" "}
                    </div>{" "}
                  </td></tr>
              ))}{" "}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-8 text-center text-stone-500"
                  >
                    No notifications found.{" "}
                  </td></tr>
              )}</tbody></table>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
