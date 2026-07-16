import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./store/AuthContext";
import { SuiteProvider } from "./store/SuiteContext"; // Layout
import PageWrapper from "./components/layout/PageWrapper";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import PortalLoginPage from "./pages/Auth/PortalLoginPage";
import Dashboard from "./pages/Home/Dashboard";
import InvoiceManagement from "./pages/InvoiceManagement/InvoiceManagement";
import ExpenseManagement from "./pages/Expenses/Expenses";
import Analytics from "./pages/Analytics/Analytics";
import TaxReports from "./pages/TaxReports/TaxReports"; // Pages - Customers
import CustomersList from "./pages/Customers/CustomersList";
import CustomerDetail from "./pages/Customers/CustomerDetail";
import CustomerForm from "./pages/Customers/CustomerForm"; // Pages - Subscriptions
import SubscriptionsList from "./pages/Subscriptions/SubscriptionsList";
import SubscriptionDetail from "./pages/Subscriptions/SubscriptionDetail";
import CreateSubscription from "./pages/Subscriptions/CreateSubscription"; // Pages - Invoices
import InvoicesList from "./pages/Invoices/InvoicesList";
import InvoiceDetail from "./pages/Invoices/InvoiceDetail";
import InvoiceWizard from "./pages/Invoices/InvoiceWizard"; // Pages - Product Catalog
import ProductFamiliesList from "./pages/ProductCatalog/ProductFamilies/ProductFamiliesList";
import PlansList from "./pages/ProductCatalog/Plans/PlansList";
import PlanDetail from "./pages/ProductCatalog/Plans/PlanDetail";
import AddonsList from "./pages/ProductCatalog/Addons/AddonsList";
import ChargesList from "./pages/ProductCatalog/Charges/ChargesList";
import CouponsList from "./pages/ProductCatalog/Coupons/CouponsList";
import CouponSetsList from "./pages/ProductCatalog/Coupons/CouponSetsList"; // Pages - Logs
import LogsList from "./pages/Logs/LogsList"; // Pages - Revenue Story
import Dashboards from "./pages/RevenueStory/Dashboards";
import MetricExplorer from "./pages/RevenueStory/MetricExplorer";
import CustomerInsights from "./pages/RevenueStory/CustomerInsights";
import AccountingReports from "./pages/RevenueStory/AccountingReports";
import AlertsAndGoals from "./pages/RevenueStory/AlertsAndGoals";
import ReportBuilder from "./pages/RevenueStory/ReportBuilder"; // Pages - Reports
import ClassicReports from "./pages/Reports/ClassicReports"; // Pages - Apps
import AppsList from "./pages/Apps/AppsList"; // Pages - Settings
import SettingsLayout from "./pages/Settings/SettingsLayout";
import SettingsDashboard from "./pages/Settings/SettingsDashboard";
import ConfigureOpz from "./pages/Settings/ConfigureOpz";
import ThirdPartyConfigurations from "./pages/Settings/ThirdPartyConfigurations";
import ImportExportData from "./pages/Settings/ImportExportData";
import TeamMembers from "./pages/Settings/TeamMembers/TeamMembers";
import OpzNotifications from "./pages/Settings/OpzNotifications";
import Security from "./pages/Settings/Security";
import UserSettings from "./pages/Settings/User/UserSettings";
import AccessControl from "./pages/Settings/AccessControl/AccessControl";
import ClientDetails from "./pages/Settings/ClientDetails/ClientDetails"; // Pages - Platform
import PlatformConsole from "./pages/Platform/PlatformConsole";
import AddClientWizard from "./pages/PlatformConsole/AddClientWizard";
import AllClients from "./pages/PlatformConsole/AllClients"; // --- SUITE PAGES ---
import Quotes from "./pages/CPQ/Quotes";
import ApprovalWorkflow from "./pages/CPQ/ApprovalWorkflow";
import ARDashboard from "./pages/Receivables/ARDashboard";
import CollectionsQueue from "./pages/Receivables/CollectionsQueue";
import PaymentReconciliation from "./pages/Receivables/PaymentReconciliation";
import DisputeManagement from "./pages/Receivables/DisputeManagement";
import BadDebtWriteOff from "./pages/Receivables/BadDebtWriteOff";
import CancelFlows from "./pages/Retention/CancelFlows";
import ChurnReasons from "./pages/Retention/ChurnReasons";
import WinbackCampaigns from "./pages/Retention/WinbackCampaigns";
import AtRiskSignals from "./pages/Retention/AtRiskSignals";
import ActivityLog from "./pages/Retention/ActivityLog";
import RevenueSchedules from "./pages/RevRec/RevenueSchedules";
import RevenueWaterfall from "./pages/RevRec/RevenueWaterfall";
import PerformanceObligations from "./pages/RevRec/PerformanceObligations";
import ContractModifications from "./pages/RevRec/ContractModifications";
import JournalEntries from "./pages/RevRec/JournalEntries";
import AuditTrail from "./pages/RevRec/AuditTrail";
import Transactions from "./pages/Payments/Transactions";
import PaymentSources from "./pages/Payments/PaymentSources";
import Refunds from "./pages/Payments/Refunds";
import GatewayHealth from "./pages/Payments/GatewayHealth";
import PayoutReconciliation from "./pages/Payments/PayoutReconciliation";
import PricingExperiments from "./pages/Growth/PricingExperiments";
import CheckoutOptimization from "./pages/Growth/CheckoutOptimization";
import UpsellRules from "./pages/Growth/UpsellRules";
import ReferralPrograms from "./pages/Growth/ReferralPrograms";
export default function App() {
  return (
    <AuthProvider>
      {" "}
      <SuiteProvider>
        {" "}
        <BrowserRouter>
          {" "}
          <Toaster position="top-right" />{" "}
          <Routes>
            {" "}
            {/* PUBLIC AUTH ROUTES */}{" "}
            <Route
              path="/login/ultra-admin"
              element={<PortalLoginPage portalType="ultra-admin" />}
            />{" "}
            <Route
              path="/login/super-admin"
              element={<PortalLoginPage portalType="super-admin" />}
            />{" "}
            <Route
              path="/login/admin"
              element={<PortalLoginPage portalType="admin" />}
            />{" "}
            <Route
              path="/login/user"
              element={<PortalLoginPage portalType="user" />}
            />{" "}
            {/* PROTECTED LAYOUT */}{" "}
            <Route
              element={
                <ProtectedRoute>
                  <PageWrapper />
                </ProtectedRoute>
              }
            >
              {" "}
              {/* BILLING SUITE (Core) */}{" "}
              <Route path="/" element={<Dashboard />} />{" "}
              <Route path="/dashboard" element={<Dashboard />} />{" "}
              <Route
                path="/invoice-management"
                element={<InvoiceManagement />}
              />{" "}
              <Route path="/expenses" element={<ExpenseManagement />} />{" "}
              <Route path="/analytics" element={<Analytics />} />{" "}
              <Route path="/tax-reports" element={<TaxReports />} />{" "}
              <Route path="/customers" element={<CustomersList />} />{" "}
              <Route path="/customers/new" element={<CustomerForm />} />{" "}
              <Route path="/customers/:id" element={<CustomerDetail />} />{" "}
              <Route path="/customers/:id/edit" element={<CustomerForm />} />{" "}
              <Route path="/subscriptions" element={<SubscriptionsList />} />{" "}
              <Route
                path="/subscriptions/new"
                element={<CreateSubscription />}
              />{" "}
              <Route
                path="/subscriptions/:id"
                element={<SubscriptionDetail />}
              />{" "}
              <Route path="/invoices" element={<InvoicesList />} />{" "}
              <Route path="/invoices/new" element={<InvoiceWizard />} />{" "}
              <Route path="/invoices/:id" element={<InvoiceDetail />} />{" "}
              <Route
                path="/catalog/families"
                element={<ProductFamiliesList />}
              />{" "}
              <Route path="/catalog/plans" element={<PlansList />} />{" "}
              <Route path="/catalog/plans/:id" element={<PlanDetail />} />{" "}
              <Route path="/catalog/addons" element={<AddonsList />} />{" "}
              <Route path="/catalog/charges" element={<ChargesList />} />{" "}
              <Route path="/catalog/coupons" element={<CouponsList />} />{" "}
              <Route path="/catalog/coupon-sets" element={<CouponSetsList />} />{" "}
              <Route path="/logs" element={<LogsList />} />{" "}
              <Route
                path="/revenue-story/dashboards"
                element={<Dashboards />}
              />{" "}
              <Route
                path="/revenue-story/metric-explorer"
                element={<MetricExplorer />}
              />{" "}
              <Route path="/classic-reports" element={<ClassicReports />} />{" "}
              <Route path="/apps" element={<AppsList />} />{" "}
              <Route
                path="/revenue-story/customer-insights"
                element={<CustomerInsights />}
              />{" "}
              <Route
                path="/revenue-story/accounting-reports"
                element={<AccountingReports />}
              />{" "}
              <Route
                path="/revenue-story/alerts-goals"
                element={<AlertsAndGoals />}
              />{" "}
              <Route
                path="/revenue-story/report-builder"
                element={<ReportBuilder />}
              />{" "}
              {/* Settings */}{" "}
              <Route path="/settings" element={<SettingsLayout />}>
                {" "}
                <Route index element={<SettingsDashboard />} />{" "}
                <Route path="client-details" element={<ClientDetails />} />{" "}
                <Route path="user" element={<UserSettings />} />{" "}
                <Route path="configure-opz" element={<ConfigureOpz />} />{" "}
                <Route
                  path="third-party"
                  element={<ThirdPartyConfigurations />}
                />{" "}
                <Route path="import-export" element={<ImportExportData />} />{" "}
                <Route path="team-members" element={<TeamMembers />} />{" "}
                <Route path="access-control" element={<AccessControl />} />{" "}
                <Route path="notifications" element={<OpzNotifications />} />{" "}
                <Route path="security" element={<Security />} />{" "}
              </Route>{" "}
              {/* Platform Console */}{" "}
              <Route path="/platform-console" element={<PlatformConsole />} />{" "}
              <Route
                path="/platform-console/clients"
                element={<AllClients />}
              />{" "}
              <Route
                path="/platform-console/clients/new"
                element={<AddClientWizard />}
              />{" "}
              {/* CPQ SUITE */}{" "}
              <Route path="/cpq/quotes" element={<Quotes />} />{" "}
              <Route
                path="/cpq/settings/approval"
                element={<ApprovalWorkflow />}
              />{" "}
              {/* RECEIVABLES SUITE */}{" "}
              <Route path="/receivables/dashboard" element={<ARDashboard />} />{" "}
              <Route
                path="/receivables/collections-queue"
                element={<CollectionsQueue />}
              />{" "}
              <Route
                path="/receivables/reconciliation"
                element={<PaymentReconciliation />}
              />{" "}
              <Route
                path="/receivables/disputes"
                element={<DisputeManagement />}
              />{" "}
              <Route
                path="/receivables/write-off"
                element={<BadDebtWriteOff />}
              />{" "}
              {/* RETENTION SUITE */}{" "}
              <Route path="/retention/cancel-flows" element={<CancelFlows />} />{" "}
              <Route
                path="/retention/churn-reasons"
                element={<ChurnReasons />}
              />{" "}
              <Route path="/retention/winback" element={<WinbackCampaigns />} />{" "}
              <Route path="/retention/at-risk" element={<AtRiskSignals />} />{" "}
              <Route path="/retention/activity-log" element={<ActivityLog />} />{" "}
              {/* REVREC SUITE */}{" "}
              <Route path="/revrec/schedules" element={<RevenueSchedules />} />{" "}
              <Route path="/revrec/waterfall" element={<RevenueWaterfall />} />{" "}
              <Route
                path="/revrec/obligations"
                element={<PerformanceObligations />}
              />{" "}
              <Route
                path="/revrec/modifications"
                element={<ContractModifications />}
              />{" "}
              <Route
                path="/revrec/journal-entries"
                element={<JournalEntries />}
              />{" "}
              <Route path="/revrec/audit-trail" element={<AuditTrail />} />{" "}
              {/* PAYMENTS SUITE */}{" "}
              <Route path="/payments/transactions" element={<Transactions />} />{" "}
              <Route path="/payments/sources" element={<PaymentSources />} />{" "}
              <Route path="/payments/refunds" element={<Refunds />} />{" "}
              <Route
                path="/payments/gateway-health"
                element={<GatewayHealth />}
              />{" "}
              <Route
                path="/payments/payouts"
                element={<PayoutReconciliation />}
              />{" "}
              {/* GROWTH SUITE */}{" "}
              <Route
                path="/growth/pricing-experiments"
                element={<PricingExperiments />}
              />{" "}
              <Route
                path="/growth/checkout-optimization"
                element={<CheckoutOptimization />}
              />{" "}
              <Route path="/growth/upsell-rules" element={<UpsellRules />} />{" "}
              <Route path="/growth/referrals" element={<ReferralPrograms />} />{" "}
              <Route path="*" element={<Navigate to="/" replace />} />{" "}
            </Route>{" "}
          </Routes>{" "}
        </BrowserRouter>{" "}
      </SuiteProvider>{" "}
    </AuthProvider>
  );
}
