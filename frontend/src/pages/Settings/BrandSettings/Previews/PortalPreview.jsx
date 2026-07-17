import React from "react";
import { Home, CreditCard, FileText, Settings, User } from "lucide-react";
export default function PortalPreview({ logoUrl, accentColor }) {
  return (
    <div className="flex justify-center items-start w-full">
      {" "}
      <div className="bg-stone-50 shadow-md border border-stone-200 w-full max-w-4xl h-[500px] overflow-hidden flex font-sans rounded-lg">
        {" "}
        {/* Sidebar */}{" "}
        <div className="w-64 bg-white border-r border-stone-200 flex flex-col">
          {" "}
          <div className="h-16 flex items-center px-6 border-b border-stone-100">
            {" "}
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Logo"
                className="max-h-8 object-contain"
              />
            ) : (
              <div className="text-sm font-bold text-stone-800 tracking-widest">
                YOUR LOGO
              </div>
            )}{" "}
          </div>{" "}
          <div className="p-4 flex-1 space-y-1">
            {" "}
            <div
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium"
              style={{
                backgroundColor: `${accentColor || "#2196F3"}15`,
                color: accentColor || "#2196F3",
              }}
            >
              {" "}
              <Home size={18} /> <span>Overview</span>{" "}
            </div>{" "}
            <div className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-stone-600 hover:bg-stone-50">
              {" "}
              <CreditCard size={18} /> <span>Subscriptions</span>{" "}
            </div>{" "}
            <div className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-stone-600 hover:bg-stone-50">
              {" "}
              <FileText size={18} /> <span>Invoices</span>{" "}
            </div>{" "}
            <div className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-stone-600 hover:bg-stone-50">
              {" "}
              <Settings size={18} /> <span>Settings</span>{" "}
            </div>{" "}
          </div>{" "}
          <div className="p-4 border-t border-stone-100">
            {" "}
            <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-stone-600">
              {" "}
              <div className="w-8 h-8 rounded-lg bg-stone-200 flex items-center justify-center">
                {" "}
                <User size={16} className="text-stone-500" />{" "}
              </div>{" "}
              <div className="flex flex-col">
                {" "}
                <span className="text-stone-900 leading-tight">
                  Elon Musk
                </span>{" "}
                <span className="text-stone-500 text-xs">
                  elon@spacex.com
                </span>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
        {/* Main Content Area */}{" "}
        <div className="flex-1 p-8 overflow-y-auto">
          {" "}
          <h1 className="text-2xl font-semibold text-stone-900 mb-6">
            Welcome back, Elon
          </h1>{" "}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {" "}
            {/* Subscription Card */}{" "}
            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
              {" "}
              <div className="flex justify-between items-start mb-4">
                {" "}
                <div>
                  {" "}
                  <h3 className="text-stone-500 text-sm font-medium mb-1">
                    Current Plan
                  </h3>{" "}
                  <div className="text-xl font-bold text-stone-900">
                    Pro Plan
                  </div>{" "}
                </div>{" "}
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-100">
                  {" "}
                  Active{" "}
                </span>{" "}
              </div>{" "}
              <div className="text-sm text-stone-600 mb-6">
                {" "}
                Renews on Oct 26, 2023 for $49.00{" "}
              </div>{" "}
              <div className="flex gap-3">
                {" "}
                <button
                  className="px-4 py-2 rounded-md text-white text-sm font-medium"
                  style={{ backgroundColor: accentColor || "#2196F3" }}
                >
                  {" "}
                  Upgrade Plan{" "}
                </button>{" "}
                <button className="px-4 py-2 rounded-md text-stone-700 bg-white border border-stone-300 text-sm font-medium hover:bg-stone-50">
                  {" "}
                  Cancel{" "}
                </button>{" "}
              </div>{" "}
            </div>{" "}
            {/* Payment Method Card */}{" "}
            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
              {" "}
              <h3 className="text-stone-500 text-sm font-medium mb-4">
                Default Payment Method
              </h3>{" "}
              <div className="flex items-center gap-4 mb-6">
                {" "}
                <div className="w-12 h-8 bg-stone-100 border border-stone-200 rounded flex items-center justify-center font-bold text-stone-400 text-xs">
                  {" "}
                  VISA{" "}
                </div>{" "}
                <div>
                  {" "}
                  <div className="text-stone-900 font-medium text-sm">
                    Visa ending in 4242
                  </div>{" "}
                  <div className="text-stone-500 text-xs">
                    Expires 12/24
                  </div>{" "}
                </div>{" "}
              </div>{" "}
              <button
                className="text-sm font-medium hover:underline"
                style={{ color: accentColor || "#2196F3" }}
              >
                {" "}
                Update payment method{" "}
              </button>{" "}
            </div>{" "}
          </div>{" "}
          {/* Recent Invoices */}{" "}
          <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
            {" "}
            <div className="px-6 py-4 border-b border-stone-100 flex justify-between items-center">
              {" "}
              <h3 className="font-semibold text-stone-900">
                Recent Invoices
              </h3>{" "}
              <button className="text-sm text-stone-500 hover:text-stone-900">
                View all
              </button>{" "}
            </div>{" "}
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-stone-50 text-stone-500 border-b border-stone-100">
                  <th className="py-3 px-6 font-medium">Invoice</th>{" "}
                  <th className="py-3 px-6 font-medium">Amount</th>{" "}
                  <th className="py-3 px-6 font-medium">Date</th>{" "}
                  <th className="py-3 px-6 font-medium">Status</th>{" "}
                  <th className="py-3 px-6 font-medium text-right">
                    Action
                  </th></tr></thead>{" "}
              <tbody>
                <tr className="border-b border-stone-100 text-stone-700">
                  <td className="py-3 px-6">INV-2023-089</td>{" "}
                  <td className="py-3 px-6">$49.00</td>{" "}
                  <td className="py-3 px-6">Sep 26, 2023</td>{" "}
                  <td className="py-3 px-6">
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700">
                      Paid
                    </span>{" "}
                  </td>{" "}
                  <td className="py-3 px-6 text-right">
                    <button
                      style={{ color: accentColor || "#2196F3" }}
                      className="hover:underline"
                    >
                      Download
                    </button>{" "}
                  </td></tr></tbody></table>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
