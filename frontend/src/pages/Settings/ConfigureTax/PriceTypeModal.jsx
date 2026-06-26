import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function PriceTypeModal({ isOpen, onClose, currency, currentType, onUpdate }) {
  const [selected, setSelected] = useState(currentType || 'exclusive');

  useEffect(() => {
    if (isOpen) setSelected(currentType || 'exclusive');
  }, [isOpen, currentType]);

  if (!isOpen) return null;

  const handleUpdate = () => {
    onUpdate(currency, selected);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(20,19,15,0.45)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white rounded-xl border border-border shadow-lg w-full max-w-md overflow-hidden"
        style={{ animation: 'scaleIn 0.15s ease-out' }}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-stone-50">
          <h2 className="text-sm font-semibold text-ink">
            Are your {currency} prices tax inclusive/tax exclusive?
          </h2>
          <button
            id="price-type-modal-close"
            onClick={onClose}
            className="text-muted hover:text-ink transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Options */}
        <div className="p-6 space-y-3">
          {/* Exclusive */}
          <label
            id="price-type-exclusive"
            htmlFor="pt-exclusive"
            className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all
              ${selected === 'exclusive'
                ? 'border-accent bg-blue-50'
                : 'border-border hover:border-border-strong hover:bg-stone-50'
              }`}
          >
            <input
              type="radio"
              id="pt-exclusive"
              name="priceType"
              value="exclusive"
              checked={selected === 'exclusive'}
              onChange={() => setSelected('exclusive')}
              className="mt-0.5 shrink-0 accent-accent"
              style={{ accentColor: '#2D5BFF' }}
            />
            <div>
              <div className="text-sm font-medium text-ink">My prices are exclusive of the tax</div>
              <div className="text-xs text-muted mt-0.5 leading-relaxed">
                Pick this option if tax is not included in your catalog prices.
              </div>
            </div>
          </label>

          {/* Inclusive */}
          <label
            id="price-type-inclusive"
            htmlFor="pt-inclusive"
            className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all
              ${selected === 'inclusive'
                ? 'border-accent bg-blue-50'
                : 'border-border hover:border-border-strong hover:bg-stone-50'
              }`}
          >
            <input
              type="radio"
              id="pt-inclusive"
              name="priceType"
              value="inclusive"
              checked={selected === 'inclusive'}
              onChange={() => setSelected('inclusive')}
              className="mt-0.5 shrink-0"
              style={{ accentColor: '#2D5BFF' }}
            />
            <div>
              <div className="text-sm font-medium text-ink">My prices are inclusive of the tax</div>
              <div className="text-xs text-muted mt-0.5 leading-relaxed">
                Pick this option if tax is included in your catalog prices.
              </div>
            </div>
          </label>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-stone-50 flex justify-end gap-2">
          <button
            id="price-type-cancel-btn"
            type="button"
            onClick={onClose}
            className="btn-secondary btn-sm"
          >
            Cancel
          </button>
          <button
            id="price-type-update-btn"
            type="button"
            onClick={handleUpdate}
            className="btn-primary btn-sm"
          >
            Update
          </button>
        </div>
      </div>

      <style>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
