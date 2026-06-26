import React, { useState } from 'react';
import BusinessProfile from './BusinessProfile/BusinessProfile';
import PaymentGateways from './PaymentGateways/PaymentGateways';
import Taxes from './Taxes/Taxes';
import ApiKeys from './ApiKeys/ApiKeys';
import Webhooks from './Webhooks/Webhooks';
import ProductCatalog from './ProductCatalog/ProductCatalog';
import CheckoutPortalDashboard from './CheckoutPortal/CheckoutPortalDashboard';
import BrandSettingsDashboard from './BrandSettings/BrandSettingsDashboard';
import EmailNotificationsRouter from './EmailNotifications/EmailNotificationsRouter';

export default function ConfigureOpz() {
  const [activeTab, setActiveTab] = useState('checkout-portal');

  const tabs = [
    { id: 'profile', label: 'Business Profile', component: <BusinessProfile /> },
    { id: 'brand', label: 'Brand Settings', component: <BrandSettingsDashboard /> },
    { id: 'email-notifications', label: 'Email Notifications', component: <EmailNotificationsRouter /> },
    { id: 'product-catalog', label: 'Product Catalog', component: <ProductCatalog /> },
    { id: 'checkout-portal', label: 'Checkout & Self-Profile', component: <CheckoutPortalDashboard /> },
    { id: 'gateways', label: 'Payment Gateways', component: <PaymentGateways /> },
    { id: 'taxes', label: 'Taxes', component: <Taxes /> },
    { id: 'apikeys', label: 'API Keys', component: <ApiKeys /> },
    { id: 'webhooks', label: 'Webhooks', component: <Webhooks /> },
  ];

  return (
    <div className="flex h-full animate-fade-in bg-stone-50">
      {/* Internal Navigation */}
      <div className="w-64 border-r border-border bg-surface shrink-0 h-[calc(100vh-56px)] overflow-y-auto">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-ink text-base">Configure Opz</h2>
          <p className="text-2xs text-muted mt-1">Manage billing, taxes, and integrations.</p>
        </div>
        <nav className="p-3 space-y-0.5">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-3 py-2 text-sm font-medium rounded transition-colors ${
                activeTab === tab.id ? 'bg-stone-100 text-ink' : 'text-muted hover:text-ink hover:bg-stone-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-0 relative">
        <div className="absolute inset-0">
          {tabs.find(t => t.id === activeTab)?.component}
        </div>
      </div>
    </div>
  );
}
