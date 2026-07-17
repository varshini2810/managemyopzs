import React, { useState } from "react";
import { Copy, Check } from "lucide-react"; // Monospace ID chip with copy-to-clipboard
export default function MonoId({ value, label }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(value || "").then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };
  if (!value) return <span className="text-muted text-xs">—</span>; // Truncate long IDs const display = value.length > 22 ? value.slice(0, 10) + '…' + value.slice(-6) : value; return ( <span className="mono-id group" onClick={handleCopy} title={`${label ? label + ': ' : ''}${value} — click to copy`} > <span>{display}</span> <span className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#A8A49F' }}> {copied ? <Check size={10} style={{ color: '#1A7F4E' }} /> : <Copy size={10} />} </span> </span> );
}
