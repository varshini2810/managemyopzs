import {
  LayoutDashboard, Users, RefreshCcw, FileText, Package, ScrollText, 
  LineChart, PieChart, AppWindow, Settings, Blocks, BarChart3, ClipboardList, Banknote,
  Zap, Receipt, Ticket, Tag, CreditCard, Key, Webhook, 
  Database, Bell, Shield, Search, Target, FilePlus, ArrowRightLeft,
  FileCheck, FileSignature, Wallet, CheckSquare, Activity, AlertTriangle,
  RotateCcw, History, List, BarChart, FileSpreadsheet, Lock, CheckCircle,
  Link, DollarSign, ActivitySquare, Gift, TestTube, LineChart as ChartLineUp,
  Sliders
} from 'lucide-react';

const billingNavItems = [
  { id: 'home', label: 'Home', icon: LayoutDashboard, to: '/', end: true },
  { id: 'invoice-management', label: 'Invoices', icon: ClipboardList, to: '/invoice-management' },
  { id: 'expenses', label: 'Expenses', icon: Banknote, to: '/expenses' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, to: '/analytics' },
  { id: 'tax-reports', label: 'Tax Reports', icon: Receipt, to: '/tax-reports' },
  {
    id: 'settings', label: 'Settings', icon: Settings,
    subItems: [
      { label: 'Configure Opz', id: 'configure-opz', icon: Sliders, to: '/settings/configure-opz' },
      { label: 'Third Party Configurations', id: 'third-party', icon: Blocks, to: '/settings/third-party' },
      { label: 'Import and Export Data', id: 'import-export', icon: ArrowRightLeft, to: '/settings/import-export' },
      { label: 'Team Members', id: 'team-members', icon: Users, to: '/settings/team-members' },
      { label: 'System Notifications', id: 'notifications', icon: Bell, to: '/settings/notifications' },
      { label: 'Security', id: 'security', icon: Shield, to: '/settings/security' },
    ]
  }
];

const cpqNavItems = [
  { id: 'quotes', label: 'Quotes', icon: FileSignature, to: '/cpq/quotes' },
  {
    id: 'settings', label: 'Settings', icon: Settings,
    subItems: [
      { label: 'Approval Workflow', id: 'approval', icon: CheckSquare, to: '/cpq/settings/approval' },
    ]
  }
];

const receivablesNavItems = [
  { id: 'dashboard', label: 'AR Dashboard', icon: LayoutDashboard, to: '/receivables/dashboard' },
  { id: 'collections', label: 'Collections Queue', icon: List, to: '/receivables/collections-queue' },
  { id: 'reconciliation', label: 'Payment Reconciliation', icon: Link, to: '/receivables/reconciliation' },
  { id: 'disputes', label: 'Dispute Management', icon: AlertTriangle, to: '/receivables/disputes' },
  { id: 'write-off', label: 'Bad Debt Write-off', icon: FileCheck, to: '/receivables/write-off' },
];

const retentionNavItems = [
  { id: 'cancel-flows', label: 'Cancel Flows', icon: RotateCcw, to: '/retention/cancel-flows' },
  { id: 'churn-reasons', label: 'Churn Reasons', icon: PieChart, to: '/retention/churn-reasons' },
  { id: 'winback', label: 'Winback Campaigns', icon: ActivitySquare, to: '/retention/winback' },
  { id: 'at-risk', label: 'At-Risk Signals', icon: AlertTriangle, to: '/retention/at-risk' },
  { id: 'activity-log', label: 'Activity Log', icon: History, to: '/retention/activity-log' },
];

const revrecNavItems = [
  { id: 'schedules', label: 'Revenue Schedules', icon: FileSpreadsheet, to: '/revrec/schedules' },
  { id: 'waterfall', label: 'Revenue Waterfall', icon: ChartLineUp, to: '/revrec/waterfall' },
  { id: 'obligations', label: 'Performance Obligations', icon: CheckCircle, to: '/revrec/obligations' },
  { id: 'modifications', label: 'Contract Modifications', icon: ArrowRightLeft, to: '/revrec/modifications' },
  { id: 'journal-entries', label: 'Journal Entries', icon: FileText, to: '/revrec/journal-entries' },
  { id: 'audit-trail', label: 'Audit Trail', icon: Lock, to: '/revrec/audit-trail' },
];

const paymentsNavItems = [
  { id: 'transactions', label: 'Transactions', icon: DollarSign, to: '/payments/transactions' },
  { id: 'sources', label: 'Payment Sources', icon: Wallet, to: '/payments/sources' },
  { id: 'refunds', label: 'Refunds', icon: RotateCcw, to: '/payments/refunds' },
  { id: 'gateway-health', label: 'Gateway Health', icon: Activity, to: '/payments/gateway-health' },
  { id: 'payouts', label: 'Payout Reconciliation', icon: Link, to: '/payments/payouts' },
];

const growthNavItems = [
  { id: 'pricing-experiments', label: 'Pricing Experiments', icon: TestTube, to: '/growth/pricing-experiments' },
  { id: 'checkout-optimization', label: 'Checkout Optimization', icon: LineChart, to: '/growth/checkout-optimization' },
  { id: 'upsell-rules', label: 'Upsell/Cross-sell Rules', icon: ArrowRightLeft, to: '/growth/upsell-rules' },
  { id: 'referrals', label: 'Referral Programs', icon: Gift, to: '/growth/referrals' },
];

const suiteNavigations = {
  'billing': billingNavItems,
  'cpq': cpqNavItems,
  'receivables': receivablesNavItems,
  'retention': retentionNavItems,
  'revrec': revrecNavItems,
  'payments': paymentsNavItems,
  'growth': growthNavItems,
};

export function getNavigationForRole(role, currentSuite, grantedModules = []) {
  const baseItems = suiteNavigations[currentSuite] || billingNavItems;
  const upperRole = role ? role.toUpperCase() : '';
  const isSuper = upperRole === 'ULTRASUPERADMIN' || upperRole === 'SUPERADMIN';

  // Helper to check if an item is explicitly granted via its backend module key e.g. "CUSTOMER"
  const isGranted = (itemId) => {
    if (!itemId) return false;
    const keyMap = {
      'customers': 'CUSTOMER',
      'subscription': 'SUBSCRIPTION',
      'invoices': 'INVOICE',
      'catalog': 'CATALOG', // Wait, catalog has subItems like plans, addons.
      'families': 'PRODUCT_FAMILY',
      'plans': 'PLAN',
      'addons': 'ADDON',
      'charges': 'CHARGE',
      'coupons': 'COUPON',
      'coupon-sets': 'COUPON_SET',
      'logs': 'LOGS',
      'revenue-story': 'REVENUE_STORY',
      'classic-reports': 'REPORTS',
      'apps': 'APPS',
      'configure-opz': 'SETTINGS_CONFIGURE',
      'third-party': 'SETTINGS_THIRD_PARTY',
      'import-export': 'SETTINGS_IMPORT_EXPORT',
      'team-members': 'SETTINGS_TEAM_MEMBERS',
      'notifications': 'SETTINGS_NOTIFICATIONS',
      'security': 'SETTINGS_SECURITY'
    };
    const backendKey = keyMap[itemId] || itemId.toUpperCase();
    return grantedModules.includes(backendKey);
  };

  // Filter the navigation items based on the user's role hierarchy
  return baseItems.map(item => {
    // Clone item to avoid mutating global arrays
    let processedItem = { ...item };

    if (upperRole === 'ULTRASUPERADMIN') {
      // Sees everything in standard nav, no restrictions.
      return processedItem;
    }

    if (upperRole === 'SUPERADMIN') {
      // Sees everything in standard nav, no restrictions.
      return processedItem;
    }

    if (upperRole === 'ADMIN') {
      // Scoped explicitly to granted modules
      if (processedItem.id === 'home') return processedItem; // Home usually always visible

      if (processedItem.subItems) {
        // If it has subItems, only keep the ones that are explicitly granted
        processedItem.subItems = processedItem.subItems.filter(sub => {
          // Check if parent or specific sub item is granted
          return isGranted(processedItem.id) || isGranted(sub.id);
        });
        
        if (processedItem.subItems.length === 0 && !isGranted(processedItem.id)) {
          return null; // Don't show parent if no subItems and parent itself isn't granted
        }
      } else {
        if (!isGranted(processedItem.id)) return null;
      }
      return processedItem;
    }

    if (upperRole === 'USER') {
      // LEVEL 4 — USER (most restricted, read-only or self-serve)
      // Read-only access to Customers, Subscription, and Invoices & Credit Notes only
      if (currentSuite === 'billing') {
        const allowedIds = ['home', 'customers', 'subscription', 'invoices'];
        if (!allowedIds.includes(processedItem.id)) return null;
        return processedItem;
      }
      // For other suites, let's assume they don't have access unless it's their Home
      if (processedItem.id === 'home' || processedItem.id === 'dashboard') return processedItem;
      return null;
    }

    return null;
  }).filter(Boolean);
}
