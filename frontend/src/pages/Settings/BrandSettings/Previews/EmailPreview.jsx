import React from "react";
export default function EmailPreview({ logoUrl, accentColor }) {
  return (
    <div className="flex justify-center items-start w-full">
      {" "}
      <div className="bg-white shadow-lg rounded-xl border border-stone-200 w-full max-w-lg overflow-hidden flex flex-col font-sans">
        {" "}
        {/* Header */}{" "}
        <div className="bg-stone-50 py-6 px-8 flex justify-center border-b border-stone-100">
          {" "}
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="max-h-12 object-contain" />
          ) : (
            <div className="text-sm font-bold text-stone-400 tracking-widest">
              YOUR LOGO GOES HERE
            </div>
          )}{" "}
        </div>{" "}
        {/* Body */}{" "}
        <div className="p-8">
          {" "}
          <h2 className="text-2xl font-bold text-stone-900 mb-6">
            Don't Forget to Slay the Monsters!
          </h2>{" "}
          <p className="text-stone-700 mb-4 text-base">Hey Elon,</p>{" "}
          <p className="text-stone-700 mb-6 text-base leading-relaxed">
            {" "}
            Your monthly subscription for the{" "}
            <strong className="font-semibold text-stone-900">
              Pro Plan
            </strong>{" "}
            is due soon. Please make sure your payment method is up to date to
            avoid any interruptions to your service.{" "}
          </p>{" "}
          <div className="bg-stone-50 rounded-lg p-4 mb-8 border border-stone-100">
            {" "}
            <div className="flex justify-between items-center mb-2">
              {" "}
              <span className="text-stone-500 text-sm">Invoice #</span>{" "}
              <span className="text-stone-900 font-medium text-sm">
                INV-2023-089
              </span>{" "}
            </div>{" "}
            <div className="flex justify-between items-center">
              {" "}
              <span className="text-stone-500 text-sm">Amount Due</span>{" "}
              <span className="text-stone-900 font-bold text-lg">
                $49.00
              </span>{" "}
            </div>{" "}
          </div>{" "}
          <div className="flex justify-center mb-6">
            {" "}
            <button
              className="px-8 py-3 rounded-md text-white font-medium transition-opacity hover:opacity-90 shadow-sm"
              style={{ backgroundColor: accentColor || "#2196F3" }}
            >
              {" "}
              Pay Now{" "}
            </button>{" "}
          </div>{" "}
        </div>{" "}
        {/* Footer */}{" "}
        <div className="bg-stone-50 py-4 text-center border-t border-stone-100">
          {" "}
          <p className="text-xs text-stone-400">Powered by Opz</p>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
