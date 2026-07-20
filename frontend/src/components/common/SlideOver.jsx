import React, { useEffect } from "react";
import { X } from "lucide-react";
export default function SlideOver({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
}) {
  // ESC to close useEffect(() => { if (!isOpen) return; const handler = (e) => { if (e.key === 'Escape') onClose(); }; document.addEventListener('keydown', handler); return () => document.removeEventListener('keydown', handler); }, [isOpen, onClose]); // Prevent body scroll when open useEffect(() => { document.body.style.overflow = isOpen ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [isOpen]); if (!isOpen) return null; return ( <> {/* Overlay */} <div className="slideover-overlay" onClick={onClose} aria-hidden="true" /> {/* Panel */} <div className="slideover-panel" role="dialog" aria-modal="true" aria-label={title} > {/* Header */} <div className="slideover-header"> <div> <h2 className="text-base font-semibold text-ink font-display tracking-tight"> {title} </h2> {subtitle && ( <p className="text-xs text-muted mt-0.5">{subtitle}</p> )} </div> <button onClick={onClose} className="btn-ghost p-2 ml-4 rounded-button" aria-label="Close panel" > <X size={16} /> </button> </div> {/* Body */} <div className="slideover-body"> {children} </div> {/* Footer */} {footer && ( <div className="slideover-footer"> {footer} </div> )} </div> </> );
}
