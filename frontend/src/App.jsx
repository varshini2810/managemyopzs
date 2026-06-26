import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './store/AuthContext';
import { SuiteProvider } from './store/SuiteContext';

// Layout
import PageWrapper from './components/layout/PageWrapper';
import ProtectedRoute from './components/layout/ProtectedRoute';
import RequirePermission from './components/layout/RequirePermission';

import LoginPage from './pages/Auth/LoginPage';
import SignupPage from './pages/Auth/SignupPage';
import AcceptInvitePage from './pages/Auth/AcceptInvitePage';
import Dashboard from './pages/Home/Dashboard';
import InvoiceManagement from './pages/InvoiceManagement/InvoiceManagement';
import ExpenseManagement from './pages/Expenses/Expenses';
import Analytics from './pages/Analytics/Analytics';
import TaxReports from './pages/TaxReports/TaxReports';

// Pages - Customers
import CustomersList from './pages/Customers/CustomersList';
import CustomerDetail from './pages/Customers/CustomerDetail';
import CustomerForm from './pages/Customers/CustomerForm';

// Pages - Subscriptions
import SubscriptionsList from './pages/Subscriptions/SubscriptionsList';
import SubscriptionDetail from './pages/Subscriptions/SubscriptionDetail';
import CreateSubscription from './pages/Subscriptions/CreateSubscription';

// Pages - Invoices
import InvoicesList from './pages/Invoices/InvoicesList';
import InvoiceDetail from './pages/Invoices/InvoiceDetail';
import InvoiceWizard from './pages/Invoices/InvoiceWizard';

// Pages - Product Catalog
import ProductFamiliesList from './pages/ProductCatalog/ProductFamilies/ProductFamiliesList';
import PlansList from './pages/ProductCatalog/Plans/PlansList';
import PlanDetail from './pages/ProductCatalog/Plans/PlanDetail';
import AddonsList from './pages/ProductCatalog/Addons/AddonsList';
import ChargesList from './pages/ProductCatalog/Charges/ChargesList';
import CouponsList from './pages/ProductCatalog/Coupons/CouponsList';
import CouponSetsList from './pages/ProductCatalog/Coupons/CouponSetsList';

// Pages - Logs
import LogsList from './pages/Logs/LogsList';

// Pages - Revenue Story
import Dashboards from './pages/RevenueStory/Dashboards';
import MetricExplorer from './pages/RevenueStory/MetricExplorer';
import CustomerInsights from './pages/RevenueStory/CustomerInsights';
import AccountingReports from './pages/RevenueStory/AccountingReports';
import AlertsAndGoals from './pages/RevenueStory/AlertsAndGoals';
import ReportBuilder from './pages/RevenueStory/ReportBuilder';

// Pages - Reports
import ClassicReports from './pages/Reports/ClassicReports';

// Pages - Apps
import AppsList from './pages/Apps/AppsList';

// Pages - Settings
import ConfigureOpz from './pages/Settings/ConfigureOpz';
import ThirdPartyConfigurations from './pages/Settings/ThirdPartyConfigurations';
import ImportExportData from './pages/Settings/ImportExportData';
import TeamMembers from './pages/Settings/TeamMembers/TeamMembers';
import OpzNotifications from './pages/Settings/OpzNotifications';
import Security from './pages/Settings/Security';

// Pages - Platform
import PlatformConsole from './pages/Platform/PlatformConsole';
import AddClientWizard from './pages/PlatformConsole/AddClientWizard';
import AllClients from './pages/PlatformConsole/AllClients';

// --- NEW SUITE PAGES ---
import Quotes from './pages/CPQ/Quotes';
import ApprovalWorkflow from './pages/CPQ/ApprovalWorkflow';
import ARDashboard from './pages/Receivables/ARDashboard';
import CollectionsQueue from './pages/Receivables/CollectionsQueue';
import PaymentReconciliation from './pages/Receivables/PaymentReconciliation';
import DisputeManagement from './pages/Receivables/DisputeManagement';
import BadDebtWriteOff from './pages/Receivables/BadDebtWriteOff';
import CancelFlows from './pages/Retention/CancelFlows';
import ChurnReasons from './pages/Retention/ChurnReasons';
import WinbackCampaigns from './pages/Retention/WinbackCampaigns';
import AtRiskSignals from './pages/Retention/AtRiskSignals';
import ActivityLog from './pages/Retention/ActivityLog';
import RevenueSchedules from './pages/RevRec/RevenueSchedules';
import RevenueWaterfall from './pages/RevRec/RevenueWaterfall';
import PerformanceObligations from './pages/RevRec/PerformanceObligations';
import ContractModifications from './pages/RevRec/ContractModifications';
import JournalEntries from './pages/RevRec/JournalEntries';
import AuditTrail from './pages/RevRec/AuditTrail';
import Transactions from './pages/Payments/Transactions';
import PaymentSources from './pages/Payments/PaymentSources';
import Refunds from './pages/Payments/Refunds';
import GatewayHealth from './pages/Payments/GatewayHealth';
import PayoutReconciliation from './pages/Payments/PayoutReconciliation';
import PricingExperiments from './pages/Growth/PricingExperiments';
import CheckoutOptimization from './pages/Growth/CheckoutOptimization';
import UpsellRules from './pages/Growth/UpsellRules';
import ReferralPrograms from './pages/Growth/ReferralPrograms';

export default function App() {
  return (
    <AuthProvider>
      <SuiteProvider>
        <BrowserRouter>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/accept-invite" element={<AcceptInvitePage />} />
            <Route path="/portal" element={<div className="p-8 text-center"><h1 className="text-2xl font-bold">Customer Portal</h1><p>Self-serve portal coming soon.</p><button onClick={() => { localStorage.clear(); window.location.href='/login'; }} className="mt-4 text-blue-600 underline">Logout</button></div>} />
            
            <Route element={<ProtectedRoute />}>
              <Route element={<PageWrapper />}>
                
                {/* BILLING SUITE (Core) */}
                <Route path="/" element={<Dashboard />} />
                <Route path="/invoice-management" element={<InvoiceManagement />} />
                <Route path="/expenses" element={<ExpenseManagement />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/tax-reports" element={<TaxReports />} />
                <Route path="/customers" element={<CustomersList />} />
                <Route path="/customers/new" element={<CustomerForm />} />
                <Route path="/customers/:id" element={<CustomerDetail />} />
                <Route path="/customers/:id/edit" element={<CustomerForm />} />
                <Route path="/subscriptions" element={<SubscriptionsList />} />
                <Route path="/subscriptions/new" element={<CreateSubscription />} />
                <Route path="/subscriptions/:id" element={<SubscriptionDetail />} />
                <Route path="/invoices" element={<InvoicesList />} />
                <Route path="/invoices/new" element={<InvoiceWizard />} />
                <Route path="/invoices/:id" element={<InvoiceDetail />} />
                <Route path="/catalog/families" element={<ProductFamiliesList />} />
                <Route path="/catalog/plans" element={<PlansList />} />
                <Route path="/catalog/plans/:id" element={<PlanDetail />} />
                <Route path="/catalog/addons" element={<AddonsList />} />
                <Route path="/catalog/charges" element={<ChargesList />} />
                <Route path="/catalog/coupons" element={<CouponsList />} />
                <Route path="/catalog/coupon-sets" element={<CouponSetsList />} />
                <Route path="/logs" element={<LogsList />} />
                <Route path="/revenue-story/dashboards" element={<Dashboards />} />
                <Route path="/revenue-story/metric-explorer" element={<MetricExplorer />} />
                <Route path="/classic-reports" element={<ClassicReports />} />
                <Route path="/apps" element={<AppsList />} />
                <Route path="/revenue-story/customer-insights" element={<CustomerInsights />} />
                <Route path="/revenue-story/accounting-reports" element={<AccountingReports />} />
                <Route path="/revenue-story/alerts-goals" element={<AlertsAndGoals />} />
                <Route path="/revenue-story/report-builder" element={<ReportBuilder />} />

                {/* Settings (Superadmin only for most, except maybe Configure Opz) */}
                <Route path="/settings/configure-opz" element={<ConfigureOpz />} />
                <Route path="/settings/third-party" element={<ThirdPartyConfigurations />} />
                <Route path="/settings/import-export" element={<ImportExportData />} />
                <Route path="/settings/team-members" element={<RequirePermission role="SUPERADMIN"><TeamMembers /></RequirePermission>} />
                <Route path="/settings/notifications" element={<RequirePermission role="SUPERADMIN"><OpzNotifications /></RequirePermission>} />
                <Route path="/settings/security" element={<RequirePermission role="SUPERADMIN"><Security /></RequirePermission>} />

                {/* Platform (Ultrasuperadmin only) */}
                <Route path="/platform-console" element={<RequirePermission role="ULTRASUPERADMIN"><PlatformConsole /></RequirePermission>} />
                <Route path="/platform-console/clients" element={<RequirePermission role="ULTRASUPERADMIN"><AllClients /></RequirePermission>} />
                <Route path="/platform-console/clients/new" element={<RequirePermission role="ULTRASUPERADMIN"><AddClientWizard /></RequirePermission>} />
                
                {/* CPQ SUITE */}
                <Route path="/cpq/quotes" element={<RequirePermission permission="CPQ_READ"><Quotes /></RequirePermission>} />
                <Route path="/cpq/settings/approval" element={<RequirePermission permission="CPQ_READ"><ApprovalWorkflow /></RequirePermission>} />

                {/* RECEIVABLES SUITE */}
                <Route path="/receivables/dashboard" element={<RequirePermission permission="RECEIVABLES_READ"><ARDashboard /></RequirePermission>} />
                <Route path="/receivables/collections-queue" element={<RequirePermission permission="RECEIVABLES_READ"><CollectionsQueue /></RequirePermission>} />
                <Route path="/receivables/reconciliation" element={<RequirePermission permission="RECEIVABLES_READ"><PaymentReconciliation /></RequirePermission>} />
                <Route path="/receivables/disputes" element={<RequirePermission permission="RECEIVABLES_READ"><DisputeManagement /></RequirePermission>} />
                <Route path="/receivables/write-off" element={<RequirePermission permission="RECEIVABLES_READ"><BadDebtWriteOff /></RequirePermission>} />

                {/* RETENTION SUITE */}
                <Route path="/retention/cancel-flows" element={<RequirePermission permission="RETENTION_READ"><CancelFlows /></RequirePermission>} />
                <Route path="/retention/churn-reasons" element={<RequirePermission permission="RETENTION_READ"><ChurnReasons /></RequirePermission>} />
                <Route path="/retention/winback" element={<RequirePermission permission="RETENTION_READ"><WinbackCampaigns /></RequirePermission>} />
                <Route path="/retention/at-risk" element={<RequirePermission permission="RETENTION_READ"><AtRiskSignals /></RequirePermission>} />
                <Route path="/retention/activity-log" element={<RequirePermission permission="RETENTION_READ"><ActivityLog /></RequirePermission>} />

                {/* REVREC SUITE */}
                <Route path="/revrec/schedules" element={<RequirePermission permission="REVREC_READ"><RevenueSchedules /></RequirePermission>} />
                <Route path="/revrec/waterfall" element={<RequirePermission permission="REVREC_READ"><RevenueWaterfall /></RequirePermission>} />
                <Route path="/revrec/obligations" element={<RequirePermission permission="REVREC_READ"><PerformanceObligations /></RequirePermission>} />
                <Route path="/revrec/modifications" element={<RequirePermission permission="REVREC_READ"><ContractModifications /></RequirePermission>} />
                <Route path="/revrec/journal-entries" element={<RequirePermission permission="REVREC_READ"><JournalEntries /></RequirePermission>} />
                <Route path="/revrec/audit-trail" element={<RequirePermission permission="REVREC_READ"><AuditTrail /></RequirePermission>} />

                {/* PAYMENTS SUITE */}
                <Route path="/payments/transactions" element={<RequirePermission permission="PAYMENTS_READ"><Transactions /></RequirePermission>} />
                <Route path="/payments/sources" element={<RequirePermission permission="PAYMENTS_READ"><PaymentSources /></RequirePermission>} />
                <Route path="/payments/refunds" element={<RequirePermission permission="PAYMENTS_READ"><Refunds /></RequirePermission>} />
                <Route path="/payments/gateway-health" element={<RequirePermission permission="PAYMENTS_READ"><GatewayHealth /></RequirePermission>} />
                <Route path="/payments/payouts" element={<RequirePermission permission="PAYMENTS_READ"><PayoutReconciliation /></RequirePermission>} />

                {/* GROWTH SUITE */}
                <Route path="/growth/pricing-experiments" element={<RequirePermission permission="GROWTH_READ"><PricingExperiments /></RequirePermission>} />
                <Route path="/growth/checkout-optimization" element={<RequirePermission permission="GROWTH_READ"><CheckoutOptimization /></RequirePermission>} />
                <Route path="/growth/upsell-rules" element={<RequirePermission permission="GROWTH_READ"><UpsellRules /></RequirePermission>} />
                <Route path="/growth/referrals" element={<RequirePermission permission="GROWTH_READ"><ReferralPrograms /></RequirePermission>} />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </SuiteProvider>
    </AuthProvider>
  );
}
