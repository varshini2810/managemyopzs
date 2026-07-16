import React from "react";
export default function InvoicePreview({ logoUrl, accentColor }) {
  return (
    <div className="flex justify-center items-start w-full">
      {" "}
      <div className="bg-white shadow-lg rounded-sm border border-stone-200 w-full max-w-2xl p-8 font-sans">
        {" "}
        {/* Header */}{" "}
        <div className="flex justify-between items-start mb-8">
          {" "}
          <div>
            {" "}
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Logo"
                className="max-h-10 object-contain mb-4"
              />
            ) : (
              <div className="text-xs font-bold text-stone-400 tracking-widest mb-4">
                YOUR LOGO GOES HERE
              </div>
            )}{" "}
            <h1
              className="text-2xl font-light text-stone-900"
              style={{ color: accentColor || "#2196F3" }}
            >
              INVOICE
            </h1>{" "}
            <p className="text-sm text-stone-500 mt-1">#INV-2023-089</p>{" "}
          </div>{" "}
          <div className="text-right text-sm text-stone-500">
            {" "}
            <p className="font-semibold text-stone-700">Acme Corp</p>{" "}
            <p>123 Business Rd</p> <p>Suite 100</p>{" "}
            <p>Tech City, TC 90210</p>{" "}
          </div>{" "}
        </div>{" "}
        {/* Info row */}{" "}
        <div className="flex justify-between mb-8 pb-6 border-b border-stone-100">
          {" "}
          <div className="text-sm">
            {" "}
            <p className="text-stone-400 mb-1">Billed To:</p>{" "}
            <p className="font-semibold text-stone-700">Elon Musk</p>{" "}
            <p className="text-stone-500">elon@spacex.com</p>{" "}
            <p className="text-stone-500">Mars Base Alpha</p>{" "}
          </div>{" "}
          <div className="text-sm text-right flex flex-col gap-2">
            {" "}
            <div>
              {" "}
              <p className="text-stone-400 inline-block w-24">
                Issue Date:
              </p>{" "}
              <p className="text-stone-700 inline-block font-medium">
                Oct 12, 2023
              </p>{" "}
            </div>{" "}
            <div>
              {" "}
              <p className="text-stone-400 inline-block w-24">Due Date:</p>{" "}
              <p className="text-stone-700 inline-block font-medium">
                Oct 26, 2023
              </p>{" "}
            </div>{" "}
            <div className="mt-2">
              {" "}
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-semibold"
                style={{
                  backgroundColor: `${accentColor || "#2196F3"}20`,
                  color: accentColor || "#2196F3",
                }}
              >
                {" "}
                UNPAID{" "}
              </span>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
        {/* Table */}{" "}
        <div className="mb-8">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-stone-200">
                <th className="py-2 font-medium text-stone-500">
                  Description
                </th>{" "}
                <th className="py-2 font-medium text-stone-500 text-right">
                  Qty
                </th>{" "}
                <th className="py-2 font-medium text-stone-500 text-right">
                  Price
                </th>{" "}
                <th className="py-2 font-medium text-stone-500 text-right">
                  Amount
                </th></tr></thead>{" "}
            <tbody className="text-stone-700">
              <tr className="border-b border-stone-100">
                <td className="py-3">Pro Plan Subscription (Monthly)</td>{" "}
                <td className="py-3 text-right">1</td>{" "}
                <td className="py-3 text-right">$49.00</td>{" "}
                <td className="py-3 text-right font-medium">$49.00</td></tr></tbody></table>{" "}
        </div>{" "}
        {/* Totals */}{" "}
        <div className="flex justify-end mb-8">
          <div className="w-64 text-sm">
            <div className="flex justify-between py-1 text-stone-500">
              {" "}
              <span>Subtotal</span> <span>$49.00</span>{" "}
            </div>{" "}
            <div className="flex justify-between py-1 text-stone-500 border-b border-stone-200 pb-2">
              {" "}
              <span>Tax (0%)</span> <span>$0.00</span>{" "}
            </div>{" "}
            <div className="flex justify-between py-2 font-bold text-stone-900 text-base">
              {" "}
              <span>Total</span> <span>$49.00</span>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
        {/* Footer */}{" "}
        <div className="text-center text-xs text-stone-400 mt-12 pt-4 border-t border-stone-100">
          {" "}
          <p>Thank you for your business.</p>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
