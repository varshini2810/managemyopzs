import React, { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import PriceTypeModal from './PriceTypeModal';
import toast from 'react-hot-toast';

const STORAGE_KEY = 'tax_currency_price_types';

const DEFAULT_CURRENCIES = [
  { code: 'EUR', name: 'Euro', flag: '🇪🇺', symbol: '€' },
  { code: 'USD', name: 'US Dollar', flag: '🇺🇸', symbol: '$' },
];

function loadPriceTypes() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return { EUR: 'exclusive', USD: 'exclusive' };
}

function savePriceTypes(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

export default function ReviewCatalogPriceTypes({ onBack }) {
  const [priceTypes, setPriceTypes] = useState(loadPriceTypes);
  const [modal, setModal] = useState({ open: false, currency: null });

  const handleUpdate = (currency, type) => {
    const updated = { ...priceTypes, [currency]: type };
    setPriceTypes(updated);
    savePriceTypes(updated);
    toast.success(`${currency} price type updated to Tax ${type.charAt(0).toUpperCase() + type.slice(1)}`);
  };

  return (
    <div>
      {/* Breadcrumb Header */}
      <div className="module-header">
        <div className="breadcrumb">
          <span>Settings</span>
          <ChevronRight size={12} className="breadcrumb-sep" />
          <span>Configure Opz</span>
          <ChevronRight size={12} className="breadcrumb-sep" />
          <button
            onClick={onBack}
            className="hover:text-ink transition-colors"
          >
            Configure Tax
          </button>
          <ChevronRight size={12} className="breadcrumb-sep" />
          <span className="breadcrumb-current">Review Catalog Price Types</span>
        </div>
        <button
          id="back-to-configure-tax-btn"
          onClick={onBack}
          className="btn-ghost btn-sm flex items-center gap-1.5"
        >
          <ChevronLeft size={14} />
          Back
        </button>
      </div>

      {/* Content */}
      <div className="px-8 py-8 max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="page-title">Review Catalog Price Types</h1>
          <p className="page-subtitle mt-1">
            Select whether your prices for each currency are tax inclusive or tax exclusive.
          </p>
        </div>

        <div className="card p-0 overflow-hidden">
          {/* Table header */}
          <div className="px-5 py-3 bg-stone-50 border-b border-border grid grid-cols-3 text-2xs font-semibold text-muted uppercase tracking-widest">
            <span>Currency</span>
            <span>Price Type</span>
            <span />
          </div>

          {DEFAULT_CURRENCIES.map((cur, idx) => {
            const type = priceTypes[cur.code] || 'exclusive';
            return (
              <button
                key={cur.code}
                id={`currency-row-${cur.code}`}
                onClick={() => setModal({ open: true, currency: cur.code })}
                className={`w-full text-left grid grid-cols-3 items-center px-5 py-4 hover:bg-stone-50 transition-colors
                  ${idx !== DEFAULT_CURRENCIES.length - 1 ? 'border-b border-border' : ''}
                `}
              >
                {/* Currency info */}
                <div className="flex items-center gap-2.5">
                  <span className="text-xl leading-none">{cur.flag}</span>
                  <div>
                    <div className="text-sm font-medium text-ink">{cur.code}</div>
                    <div className="text-xs text-muted">{cur.name}</div>
                  </div>
                </div>

                {/* Type badge */}
                <div>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                      ${type === 'exclusive'
                        ? 'bg-stone-100 text-ink border border-border'
                        : 'bg-blue-50 text-accent border border-blue-200'
                      }`}
                  >
                    Tax {type.charAt(0).toUpperCase() + type.slice(1)}
                  </span>
                </div>

                {/* Arrow */}
                <div className="flex justify-end">
                  <ChevronRight size={15} className="text-muted" />
                </div>
              </button>
            );
          })}
        </div>

        <p className="text-xs text-muted mt-4">
          Click a currency to change its tax price type. Changes take effect immediately for new invoices.
        </p>
      </div>

      {/* Price Type Modal */}
      <PriceTypeModal
        isOpen={modal.open}
        onClose={() => setModal({ open: false, currency: null })}
        currency={modal.currency}
        currentType={modal.currency ? (priceTypes[modal.currency] || 'exclusive') : 'exclusive'}
        onUpdate={handleUpdate}
      />
    </div>
  );
}
