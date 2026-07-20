import React from "react";
import { Check } from "lucide-react";
export default function CheckoutPreview({ logoUrl, accentColor }) {
  return (
    <div className="flex justify-center items-start w-full">
      {" "}
      <div className="bg-white shadow-xl rounded-card border border-stone-200 w-full max-w-3xl overflow-hidden flex flex-col md:flex-row font-sans">
        {" "}
        {/* Left Side - Product Summary */}{" "}
        <div className="w-full md:w-1/2 p-8 bg-bg-main border-r border-stone-100 flex flex-col">
          {" "}
          <div className="mb-8">
            {" "}
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Logo"
                className="max-h-8 object-contain"
              />
            ) : (
              <div className="text-xs font-bold text-stone-400 tracking-widest">
                YOUR LOGO
              </div>
            )}{" "}
          </div>{" "}
          <div className="flex-1">
            {" "}
            <h2 className="text-xl font-semibold text-stone-900 mb-2">
              Subscribe to Pro Plan
            </h2>{" "}
            <div className="flex items-baseline gap-2 mb-6">
              {" "}
              <span className="text-3xl font-bold text-stone-900">
                $49
              </span>{" "}
              <span className="text-stone-500">/month</span>{" "}
            </div>{" "}
            <div className="space-y-3">
              {" "}
              <div className="flex items-start gap-2">
                {" "}
                <Check
                  size={18}
                  style={{ color: accentColor || "#2196F3" }}
                  className="mt-0.5"
                />{" "}
                <span className="text-sm text-stone-600">
                  Unlimited projects
                </span>{" "}
              </div>{" "}
              <div className="flex items-start gap-2">
                {" "}
                <Check
                  size={18}
                  style={{ color: accentColor || "#2196F3" }}
                  className="mt-0.5"
                />{" "}
                <span className="text-sm text-stone-600">
                  Priority support
                </span>{" "}
              </div>{" "}
              <div className="flex items-start gap-2">
                {" "}
                <Check
                  size={18}
                  style={{ color: accentColor || "#2196F3" }}
                  className="mt-0.5"
                />{" "}
                <span className="text-sm text-stone-600">
                  Custom domains
                </span>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          <div className="mt-8 pt-6 border-t border-stone-200">
            {" "}
            <div className="flex justify-between text-sm font-medium text-stone-900">
              {" "}
              <span>Total due today</span> <span>$49.00</span>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
        {/* Right Side - Payment */}{" "}
        <div className="w-full md:w-1/2 p-8 bg-white">
          {" "}
          <h3 className="text-lg font-medium text-stone-900 mb-6">
            Payment Details
          </h3>{" "}
          <div className="space-y-4">
            {" "}
            <div>
              {" "}
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Email
              </label>{" "}
              <input
                type="email"
                placeholder="elon@spacex.com"
                className="w-full p-2 border border-stone-300 rounded-input text-sm outline-none focus:ring-1"
                style={{ "--tw-ring-color": accentColor || "#2196F3" }}
              />{" "}
            </div>{" "}
            <div>
              {" "}
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Card Information
              </label>{" "}
              <div
                className="border border-stone-300 rounded-card overflow-hidden focus-within:ring-1"
                style={{ "--tw-ring-color": accentColor || "#2196F3" }}
              >
                {" "}
                <input
                  type="text"
                  placeholder="Card number"
                  className="w-full p-2 text-sm outline-none border-b border-stone-200"
                />{" "}
                <div className="flex">
                  {" "}
                  <input
                    type="text"
                    placeholder="MM / YY"
                    className="w-1/2 p-2 text-sm outline-none border-r border-stone-200"
                  />{" "}
                  <input
                    type="text"
                    placeholder="CVC"
                    className="w-1/2 p-2 text-sm outline-none"
                  />{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
            <div>
              {" "}
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Name on card
              </label>{" "}
              <input
                type="text"
                placeholder="Elon Musk"
                className="w-full p-2 border border-stone-300 rounded-input text-sm outline-none focus:ring-1"
                style={{ "--tw-ring-color": accentColor || "#2196F3" }}
              />{" "}
            </div>{" "}
            <button
              className="w-full py-3 rounded-button text-white font-medium mt-4 shadow-sm hover:opacity-90 transition-opacity"
              style={{ backgroundColor: accentColor || "#2196F3" }}
            >
              {" "}
              Subscribe{" "}
            </button>{" "}
            <p className="text-xs text-center text-stone-400 mt-4">
              {" "}
              By confirming your subscription, you allow Acme Corp to charge you
              for future payments in accordance with their terms.{" "}
            </p>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
