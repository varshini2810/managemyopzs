// Mock API Middleware for Vite Dev Server

let productFamilies = [
  { id: 'pf_1', name: 'Cloud Infrastructure', description: 'Core compute and storage resources', slug: 'cloud-infrastructure', createdAt: '2026-06-01T12:00:00Z' },
  { id: 'pf_2', name: 'SaaS Suite', description: 'Software application access', slug: 'saas-suite', createdAt: '2026-06-02T12:00:00Z' }
];

let plans = [
  { id: 'plan_1', name: 'Starter Plan', description: 'For small teams', slug: 'starter-plan', productFamilyId: 'pf_2', statementDescriptor: 'STARTER', trialPeriod: 14, trialPeriodUnit: 'DAYS', billingPeriod: 1, billingPeriodUnit: 'MONTHS', active: true, createdAt: '2026-06-03T12:00:00Z' },
  { id: 'plan_2', name: 'Enterprise Core', description: 'For scale', slug: 'enterprise-core', productFamilyId: 'pf_1', statementDescriptor: 'ENTERPRISE', trialPeriod: 0, trialPeriodUnit: 'DAYS', billingPeriod: 1, billingPeriodUnit: 'YEARS', active: true, createdAt: '2026-06-04T12:00:00Z' }
];

let pricePoints = {
  'plan_1': [
    { id: 'pp_1', name: 'Monthly Standard', handle: 'starter-monthly', pricingScheme: 'FLAT_FEE', price: 29.00, setupFee: 0, active: true },
  ],
  'plan_2': [
    { id: 'pp_2', name: 'Annual Enterprise', handle: 'enterprise-annual', pricingScheme: 'FLAT_FEE', price: 2400.00, setupFee: 500, active: true }
  ]
};

let addons = [
  { id: 'addon_1', name: 'Extra Storage 100GB', description: 'Additional disk space', slug: 'extra-storage-100gb', productFamilyId: 'pf_1', pricingScheme: 'FLAT_FEE', price: 10.00, billingPeriod: 1, billingPeriodUnit: 'MONTHS', active: true }
];

let charges = [
  { id: 'charge_1', name: 'Setup Fee', description: 'Initial onboarding charge', slug: 'setup-fee', productFamilyId: 'pf_2', pricingScheme: 'FLAT_FEE', price: 99.00, active: true }
];

let coupons = [
  { id: 'coupon_1', name: 'Summer Discount 20%', code: 'SUMMER20', discountType: 'PERCENTAGE', discountValue: 20.00, duration: 'FOREVER', active: true }
];

let couponSets = [];

let webhooks = [
  { id: 'wh_1', name: 'Production Webhook', url: 'https://api.mycompany.com/webhooks', events: ['subscription.created', 'invoice.paid'], active: true }
];

let teamMembers = [
  { id: 'tm_1', name: 'Sanjay Dev', email: 'sanjay@example.com', role: 'OWNER', status: 'ACTIVE' },
  { id: 'tm_2', name: 'Alice Smith', email: 'alice@example.com', role: 'ADMIN', status: 'ACTIVE' }
];

let apiKeys = [
  { id: 'key_1', name: 'Live Secret Key', prefix: 'sk_live_abc123...', createdAt: '2026-06-05T12:00:00Z', status: 'ACTIVE' }
];

let taxConfig = {
  taxEnabled: true,
  taxCalculationMode: 'AUTOMATIC',
  fallbackTaxRate: 15.00
};

let taxRegions = [
  { id: 'tr_1', country: 'United States', state: 'California', taxRate: 8.25, active: true }
];

let paymentGateways = [
  { id: 'gw_stripe', name: 'Stripe', status: 'ACTIVE', config: { publishableKey: 'pk_test_...', secretKey: 'sk_test_...' } },
  { id: 'gw_paypal', name: 'PayPal', status: 'INACTIVE', config: { clientId: '...', clientSecret: '...' } }
];

let customers = [
  {
    id: 'CUST-100001',
    firstName: 'Priya', lastName: 'Mehta',
    email: 'priya.mehta@cloudventures.in',
    companyName: 'Cloud Ventures Pvt Ltd',
    phone: '9123456789',
    billingLine1: '12 MG Road', billingCity: 'Bengaluru', billingState: 'Karnataka', billingZip: '560001',
    vatNumber: '29AABCV1234A1ZR',
    status: 'ACTIVE',
    createdAt: '2026-01-15T10:00:00Z'
  },
  {
    id: 'CUST-100002',
    firstName: 'Arjun', lastName: 'Kapoor',
    email: 'arjun@scalepay.io',
    companyName: 'ScalePay Technologies',
    phone: '9988776655',
    billingLine1: '88 Bandra West', billingCity: 'Mumbai', billingState: 'Maharashtra', billingZip: '400050',
    vatNumber: '27AABCS5678B1ZS',
    status: 'ACTIVE',
    createdAt: '2026-02-20T10:00:00Z'
  },
  {
    id: 'CUST-100003',
    firstName: 'Sneha', lastName: 'Reddy',
    email: 'sneha.reddy@databridge.com',
    companyName: 'DataBridge Analytics',
    phone: '8765432190',
    billingLine1: '22 Jubilee Hills', billingCity: 'Hyderabad', billingState: 'Telangana', billingZip: '500033',
    vatNumber: '36AABCD9012C1ZT',
    status: 'ACTIVE',
    createdAt: '2026-03-05T10:00:00Z'
  }
];

let subscriptions = [
  {
    id: 'SUB-100001',
    customerId: 'CUST-100001',
    planId: 'plan_1',
    status: 'ACTIVE',
    startDate: '2026-01-15T10:00:00Z',
    nextBillingAt: '2026-07-15T10:00:00Z',
    createdAt: '2026-01-15T10:00:00Z'
  },
  {
    id: 'SUB-100002',
    customerId: 'CUST-100002',
    planId: 'plan_2',
    status: 'ACTIVE',
    startDate: '2026-02-20T10:00:00Z',
    nextBillingAt: '2027-02-20T10:00:00Z',
    createdAt: '2026-02-20T10:00:00Z'
  }
];

let invoices = [
  {
    id: 'INV-TEN-2026-000001',
    customerId: 'CUST-100001',
    status: 'PAID',
    paymentStatus: 'PAID',
    issueDate: '2026-01-15T10:00:00Z',
    dueDate: '2026-02-14T10:00:00Z',
    subtotal: 29.00, total: 34.22, amountDue: 0, amountPaid: 34.22,
    lineItems: [
      { description: 'Starter Plan - Monthly', quantity: 1, unitAmount: 29.00, itemType: 'PRODUCT' }
    ],
    createdAt: '2026-01-15T10:00:00Z'
  },
  {
    id: 'INV-TEN-2026-000002',
    customerId: 'CUST-100002',
    status: 'POSTED',
    paymentStatus: 'PAYMENT_DUE',
    issueDate: '2026-02-20T10:00:00Z',
    dueDate: '2026-03-22T10:00:00Z',
    subtotal: 2400.00, total: 2928.00, amountDue: 2928.00, amountPaid: 0,
    lineItems: [
      { description: 'Enterprise Core - Annual', quantity: 1, unitAmount: 2400.00, itemType: 'PRODUCT' }
    ],
    createdAt: '2026-02-20T10:00:00Z'
  }
];

function getRequestBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });
}

function sendJson(res, data, status = 200) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    success: status >= 200 && status < 300,
    data: data,
    timestamp: new Date().toISOString()
  }));
}

export default function mockApiPlugin() {
  return {
    name: 'mock-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api')) {
          return next();
        }

        const url = new URL(req.url, `http://${req.headers.host}`);
        const path = url.pathname;
        const method = req.method;

        // Auth endpoints
        if (path === '/api/auth/login' && method === 'POST') {
          const body = await getRequestBody(req);
          // Return 401 if no email provided (basic guard)
          if (!body.email) return sendJson(res, { message: 'Email is required' }, 401);
          return sendJson(res, {
            accessToken: 'mock_access_token_12345',
            refreshToken: 'mock_refresh_token_67890',
            user: {
              id: 1,
              name: 'Admin User',
              email: body.email,
              role: 'ULTRASUPERADMIN',
              tenantId: 'tenant_demo'
            }
          });
        }
        if (path === '/api/auth/me' && method === 'GET') {
          return sendJson(res, {
            id: 1,
            name: 'Admin User',
            email: 'admin@billingplatform.com',
            role: 'ULTRASUPERADMIN',
            tenantId: 'tenant_demo'
          });
        }
        if (path === '/api/auth/refresh' && method === 'POST') {
          return sendJson(res, { accessToken: 'mock_access_token_new_12345' });
        }

        // Dashboard endpoints
        if (path === '/api/dashboard/summary' && method === 'GET') {
          return sendJson(res, {
            mrr: { value: 15450.00, changePercent: 5.4 },
            active_subscriptions: { value: 128, changePercent: 1.2 },
            net_billing: { value: 18230.00, changePercent: -2.3 },
            net_payments: { value: 16900.00, changePercent: 8.1 },
            unpaid_invoices: { value: 1330.00, changePercent: -15.4 }
          });
        }
        if (path === '/api/dashboard/metrics' && method === 'GET') {
          const type = url.searchParams.get('type') || 'mrr';
          const points = [];
          const now = new Date();
          let baseVal = type === 'mrr' ? 14000 : type === 'active_subscriptions' ? 100 : type === 'unpaid_invoices' ? 1000 : 12000;
          for (let i = 29; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(now.getDate() - i);
            const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
            points.push({
              date: formattedDate,
              value: Math.round((baseVal + (Math.sin(i / 2) * (baseVal * 0.05)) + (Math.random() * (baseVal * 0.02))) * 100) / 100
            });
          }
          return sendJson(res, points);
        }

        // Product Family endpoints
        if (path === '/api/product-families/all' && method === 'GET') {
          return sendJson(res, productFamilies);
        }
        if (path === '/api/product-families' && method === 'GET') {
          return sendJson(res, { content: productFamilies, totalElements: productFamilies.length });
        }
        if (path === '/api/product-families' && method === 'POST') {
          const body = await getRequestBody(req);
          const newFamily = { id: 'pf_' + (productFamilies.length + 1), ...body, createdAt: new Date().toISOString() };
          productFamilies.push(newFamily);
          return sendJson(res, newFamily);
        }
        if (path.startsWith('/api/product-families/') && method === 'PUT') {
          const id = path.split('/').pop();
          const body = await getRequestBody(req);
          const idx = productFamilies.findIndex(p => p.id === id);
          if (idx !== -1) {
            productFamilies[idx] = { ...productFamilies[idx], ...body };
            return sendJson(res, productFamilies[idx]);
          }
          return sendJson(res, { message: 'Not found' }, 404);
        }
        if (path.startsWith('/api/product-families/') && method === 'DELETE') {
          const id = path.split('/').pop();
          productFamilies = productFamilies.filter(p => p.id !== id);
          return sendJson(res, { message: 'Deleted' });
        }

        // Plan endpoints
        if (path === '/api/plans' && method === 'GET') {
          return sendJson(res, { content: plans, totalElements: plans.length });
        }
        if (path === '/api/plans' && method === 'POST') {
          const body = await getRequestBody(req);
          const newPlan = { id: 'plan_' + (plans.length + 1), ...body, active: true, createdAt: new Date().toISOString() };
          plans.push(newPlan);
          pricePoints[newPlan.id] = [];
          return sendJson(res, newPlan);
        }
        if (path.startsWith('/api/plans/') && path.endsWith('/price-points') && method === 'POST') {
          const planId = path.split('/')[3];
          const body = await getRequestBody(req);
          if (!pricePoints[planId]) pricePoints[planId] = [];
          const newPp = { id: 'pp_' + Math.random().toString(36).substr(2, 5), ...body, active: true };
          pricePoints[planId].push(newPp);
          return sendJson(res, newPp);
        }
        if (path.startsWith('/api/plans/') && path.endsWith('/price-points') && method === 'GET') {
          const planId = path.split('/')[3];
          return sendJson(res, pricePoints[planId] || []);
        }
        if (path.startsWith('/api/plans/') && method === 'GET') {
          const id = path.split('/').pop();
          const plan = plans.find(p => p.id === id);
          if (plan) return sendJson(res, plan);
          return sendJson(res, { message: 'Not found' }, 404);
        }
        if (path.startsWith('/api/plans/') && method === 'DELETE') {
          const id = path.split('/').pop();
          plans = plans.filter(p => p.id !== id);
          return sendJson(res, { message: 'Deleted' });
        }

        // Addons endpoints
        if (path === '/api/addons' && method === 'GET') {
          return sendJson(res, { content: addons, totalElements: addons.length });
        }
        if (path === '/api/addons' && method === 'POST') {
          const body = await getRequestBody(req);
          const newAddon = { id: 'addon_' + (addons.length + 1), ...body, active: true };
          addons.push(newAddon);
          return sendJson(res, newAddon);
        }
        if (path.startsWith('/api/addons/') && method === 'PUT') {
          const id = path.split('/').pop();
          const body = await getRequestBody(req);
          const idx = addons.findIndex(a => a.id === id);
          if (idx !== -1) {
            addons[idx] = { ...addons[idx], ...body };
            return sendJson(res, addons[idx]);
          }
          return sendJson(res, { message: 'Not found' }, 404);
        }
        if (path.startsWith('/api/addons/') && method === 'DELETE') {
          const id = path.split('/').pop();
          addons = addons.filter(a => a.id !== id);
          return sendJson(res, { message: 'Deleted' });
        }

        // Charges endpoints
        if (path === '/api/charges' && method === 'GET') {
          return sendJson(res, { content: charges, totalElements: charges.length });
        }
        if (path === '/api/charges' && method === 'POST') {
          const body = await getRequestBody(req);
          const newCharge = { id: 'charge_' + (charges.length + 1), ...body, active: true };
          charges.push(newCharge);
          return sendJson(res, newCharge);
        }
        if (path.startsWith('/api/charges/') && method === 'PUT') {
          const id = path.split('/').pop();
          const body = await getRequestBody(req);
          const idx = charges.findIndex(c => c.id === id);
          if (idx !== -1) {
            charges[idx] = { ...charges[idx], ...body };
            return sendJson(res, charges[idx]);
          }
          return sendJson(res, { message: 'Not found' }, 404);
        }
        if (path.startsWith('/api/charges/') && method === 'DELETE') {
          const id = path.split('/').pop();
          charges = charges.filter(c => c.id !== id);
          return sendJson(res, { message: 'Deleted' });
        }

        // Coupons endpoints
        if (path === '/api/coupons' && method === 'GET') {
          return sendJson(res, { content: coupons, totalElements: coupons.length });
        }
        if (path === '/api/coupons' && method === 'POST') {
          const body = await getRequestBody(req);
          const newCoupon = { id: 'coupon_' + (coupons.length + 1), ...body, active: true };
          coupons.push(newCoupon);
          return sendJson(res, newCoupon);
        }
        if (path.startsWith('/api/coupons/') && path.endsWith('/clone') && method === 'POST') {
          const id = path.split('/')[3];
          const cop = coupons.find(c => c.id === id);
          if (cop) {
            const clone = { ...cop, id: 'coupon_' + Math.random().toString(36).substr(2, 5), code: cop.code + '_CLONE' };
            coupons.push(clone);
            return sendJson(res, clone);
          }
          return sendJson(res, { message: 'Not found' }, 404);
        }
        if (path.startsWith('/api/coupons/') && method === 'PUT') {
          const id = path.split('/').pop();
          const body = await getRequestBody(req);
          const idx = coupons.findIndex(c => c.id === id);
          if (idx !== -1) {
            coupons[idx] = { ...coupons[idx], ...body };
            return sendJson(res, coupons[idx]);
          }
          return sendJson(res, { message: 'Not found' }, 404);
        }
        if (path.startsWith('/api/coupons/') && method === 'DELETE') {
          const id = path.split('/').pop();
          coupons = coupons.filter(c => c.id !== id);
          return sendJson(res, { message: 'Deleted' });
        }

        // Coupon Sets endpoints
        if (path === '/api/coupons/sets' && method === 'GET') {
          return sendJson(res, { content: couponSets, totalElements: couponSets.length });
        }
        if (path === '/api/coupons/sets' && method === 'POST') {
          const body = await getRequestBody(req);
          const newSet = { id: 'set_' + (couponSets.length + 1), ...body };
          couponSets.push(newSet);
          return sendJson(res, newSet);
        }
        if (path.startsWith('/api/coupons/sets/') && method === 'DELETE') {
          const id = path.split('/').pop();
          couponSets = couponSets.filter(s => s.id !== id);
          return sendJson(res, { message: 'Deleted' });
        }

        // Webhooks endpoints
        if (path === '/api/settings/webhooks' && method === 'GET') {
          return sendJson(res, webhooks);
        }
        if (path === '/api/settings/webhooks' && method === 'POST') {
          const body = await getRequestBody(req);
          const newWh = { id: 'wh_' + (webhooks.length + 1), ...body, active: true };
          webhooks.push(newWh);
          return sendJson(res, newWh);
        }
        if (path.startsWith('/api/settings/webhooks/') && path.endsWith('/test') && method === 'POST') {
          return sendJson(res, { status: 'Success', responseCode: 200, message: 'Webhook trigger successful' });
        }
        if (path.startsWith('/api/settings/webhooks/') && method === 'PUT') {
          const id = path.split('/').pop();
          const body = await getRequestBody(req);
          const idx = webhooks.findIndex(w => w.id === id);
          if (idx !== -1) {
            webhooks[idx] = { ...webhooks[idx], ...body };
            return sendJson(res, webhooks[idx]);
          }
          return sendJson(res, { message: 'Not found' }, 404);
        }
        if (path.startsWith('/api/settings/webhooks/') && method === 'DELETE') {
          const id = path.split('/').pop();
          webhooks = webhooks.filter(w => w.id !== id);
          return sendJson(res, { message: 'Deleted' });
        }

        // Team members endpoints
        if (path.startsWith('/api/settings/team-members') && method === 'GET') {
          return sendJson(res, { content: teamMembers, totalElements: teamMembers.length });
        }
        if (path === '/api/settings/team-members/invite' && method === 'POST') {
          const body = await getRequestBody(req);
          const newMember = { id: 'tm_' + (teamMembers.length + 1), ...body, status: 'INVITED' };
          teamMembers.push(newMember);
          return sendJson(res, newMember);
        }
        if (path.startsWith('/api/settings/team-members/') && method === 'DELETE') {
          const id = path.split('/').pop();
          teamMembers = teamMembers.filter(t => t.id !== id);
          return sendJson(res, { message: 'Deleted' });
        }

        // API keys endpoints
        if (path === '/api/settings/api-keys' && method === 'GET') {
          return sendJson(res, apiKeys);
        }
        if (path === '/api/settings/api-keys' && method === 'POST') {
          const body = await getRequestBody(req);
          const newKey = { id: 'key_' + (apiKeys.length + 1), name: body.name, prefix: 'sk_live_' + Math.random().toString(36).substr(2, 8) + '...', createdAt: new Date().toISOString(), status: 'ACTIVE' };
          apiKeys.push(newKey);
          return sendJson(res, newKey);
        }
        if (path.startsWith('/api/settings/api-keys/') && method === 'DELETE') {
          const id = path.split('/').pop();
          apiKeys = apiKeys.filter(k => k.id !== id);
          return sendJson(res, { message: 'Deleted' });
        }

        // Tax endpoints
        if (path === '/api/settings/tax-config' && method === 'GET') {
          return sendJson(res, taxConfig);
        }
        if (path === '/api/settings/tax-regions' && method === 'GET') {
          return sendJson(res, taxRegions);
        }
        if (path === '/api/settings/tax-config' && method === 'PUT') {
          const body = await getRequestBody(req);
          taxConfig = { ...taxConfig, ...body };
          return sendJson(res, taxConfig);
        }
        if (path === '/api/settings/tax-regions' && method === 'POST') {
          const body = await getRequestBody(req);
          const newTr = { id: 'tr_' + (taxRegions.length + 1), ...body, active: true };
          taxRegions.push(newTr);
          return sendJson(res, newTr);
        }
        if (path.startsWith('/api/settings/tax-regions/') && method === 'DELETE') {
          const id = path.split('/').pop();
          taxRegions = taxRegions.filter(t => t.id !== id);
          return sendJson(res, { message: 'Deleted' });
        }

        // Payment gateway endpoints
        if (path === '/api/settings/payment-gateways' && method === 'GET') {
          return sendJson(res, paymentGateways);
        }
        if (path === '/api/settings/payment-gateways' && method === 'POST') {
          const body = await getRequestBody(req);
          const newGw = { id: 'gw_' + body.name.toLowerCase(), ...body, status: 'INACTIVE' };
          paymentGateways.push(newGw);
          return sendJson(res, newGw);
        }
        if (path.startsWith('/api/settings/payment-gateways/') && method === 'PUT') {
          const id = path.split('/').pop();
          const body = await getRequestBody(req);
          const idx = paymentGateways.findIndex(g => g.id === id);
          if (idx !== -1) {
            paymentGateways[idx] = { ...paymentGateways[idx], ...body };
            return sendJson(res, paymentGateways[idx]);
          }
          return sendJson(res, { message: 'Not found' }, 404);
        }

        // Customers endpoints
        if (path === '/api/customers' && method === 'GET') {
          const search = url.searchParams.get('search') || '';
          const status = url.searchParams.get('status') || '';
          let filtered = customers;
          if (search) {
            const s = search.toLowerCase();
            filtered = filtered.filter(c =>
              (c.firstName || '').toLowerCase().includes(s) ||
              (c.lastName || '').toLowerCase().includes(s) ||
              (c.companyName || '').toLowerCase().includes(s) ||
              (c.email || '').toLowerCase().includes(s) ||
              (c.vatNumber || '').toLowerCase().includes(s) ||
              (c.id || '').toLowerCase().includes(s)
            );
          }
          if (status) filtered = filtered.filter(c => c.status === status);
          
          const page = parseInt(url.searchParams.get('page') || '0', 10);
          const size = parseInt(url.searchParams.get('size') || '20', 10);
          const paged = filtered.slice(page * size, (page + 1) * size);
          
          return sendJson(res, { content: paged, totalElements: filtered.length });
        }
        if (path === '/api/customers' && method === 'POST') {
          const body = await getRequestBody(req);
          const newCust = {
            id: 'CUST-' + Math.floor(100000 + Math.random() * 900000),
            ...body,
            status: 'ACTIVE',
            createdAt: new Date().toISOString()
          };
          customers.push(newCust);
          return sendJson(res, newCust);
        }
        if (path.startsWith('/api/customers/') && !path.includes('/subscriptions') && !path.includes('/invoices') && method === 'GET') {
          const id = path.split('/')[3];
          const cust = customers.find(c => c.id === id);
          if (cust) return sendJson(res, cust);
          return sendJson(res, { message: 'Not found' }, 404);
        }
        if (path.startsWith('/api/customers/') && path.includes('/subscriptions') && method === 'GET') {
          const custId = path.split('/')[3];
          const custSubs = subscriptions.filter(s => s.customerId === custId);
          return sendJson(res, { content: custSubs, totalElements: custSubs.length });
        }
        if (path.startsWith('/api/customers/') && path.includes('/invoices') && method === 'GET') {
          const custId = path.split('/')[3];
          const custInvs = invoices.filter(i => i.customerId === custId);
          return sendJson(res, { content: custInvs, totalElements: custInvs.length });
        }

        // Invoices endpoints
        if (path === '/api/invoices' && method === 'GET') {
          const search = url.searchParams.get('search') || '';
          const status = url.searchParams.get('status') || '';
          let filtered = invoices;
          if (search) {
            const s = search.toLowerCase();
            const matchingCustIds = customers
              .filter(c =>
                (c.companyName || '').toLowerCase().includes(s) ||
                (c.firstName || '').toLowerCase().includes(s) ||
                (c.lastName || '').toLowerCase().includes(s) ||
                (c.vatNumber || '').toLowerCase().includes(s)
              )
              .map(c => c.id);
            filtered = filtered.filter(i =>
              i.id.toLowerCase().includes(s) || matchingCustIds.includes(i.customerId)
            );
          }
          if (status) filtered = filtered.filter(i => i.status === status);
          
          const page = parseInt(url.searchParams.get('page') || '0', 10);
          const size = parseInt(url.searchParams.get('size') || '20', 10);
          const paged = filtered.slice(page * size, (page + 1) * size);
          
          return sendJson(res, { content: paged, totalElements: filtered.length });
        }
        if (path.startsWith('/api/invoices/') && path.endsWith('/notifications') && method === 'GET') {
          return sendJson(res, [
            { id: 'notif_1', type: 'INVOICE_GENERATED_EMAIL', status: 'SENT', scheduledFor: new Date().toISOString(), sentAt: new Date().toISOString() },
            { id: 'notif_2', type: 'INVOICE_GENERATED_WHATSAPP', status: 'SENT', scheduledFor: new Date().toISOString(), sentAt: new Date().toISOString() }
          ]);
        }
        if (path.startsWith('/api/invoices/') && method === 'GET') {
          const id = path.split('/')[3];
          const invoice = invoices.find(i => i.id === id);
          if (invoice) return sendJson(res, invoice);
          return sendJson(res, { id: id, customerId: 'CUST-100001', status: 'POSTED', paymentStatus: 'PAYMENT_DUE', amountDue: 100, amountPaid: 0, total: 100, subtotal: 100, taxTotal: 0, issueDate: new Date().toISOString(), dueDate: new Date(Date.now() + 30*86400000).toISOString(), lineItems: [] });
        }
        if (path === '/api/invoices' && method === 'POST') {
          const body = await getRequestBody(req);
          const nextNum = String(invoices.length + 1).padStart(6, '0');
          const subtotal = body.subtotal || (body.lineItems || []).reduce((s, i) => s + (i.unitAmount * i.quantity), 0);
          const taxTotal = subtotal * 0.18;
          const total = subtotal + taxTotal;
          const newInv = {
            id: `INV-TEN-2026-${nextNum}`,
            ...body,
            status: 'POSTED',
            paymentStatus: 'PAYMENT_DUE',
            subtotal,
            taxTotal,
            total,
            amountDue: total,
            amountPaid: 0,
            issueDate: new Date().toISOString(),
            createdAt: new Date().toISOString()
          };
          invoices.push(newInv);
          return sendJson(res, newInv);
        }

        // Subscriptions endpoints
        if (path === '/api/subscriptions' && method === 'GET') {
          const search = url.searchParams.get('search') || '';
          const status = url.searchParams.get('status') || '';
          let filtered = subscriptions;
          if (search) {
            const s = search.toLowerCase();
            filtered = filtered.filter(sub =>
              sub.id.toLowerCase().includes(s) || sub.customerId.toLowerCase().includes(s)
            );
          }
          if (status) filtered = filtered.filter(sub => sub.status === status);
          
          const page = parseInt(url.searchParams.get('page') || '0', 10);
          const size = parseInt(url.searchParams.get('size') || '20', 10);
          const paged = filtered.slice(page * size, (page + 1) * size);
          
          return sendJson(res, { content: paged, totalElements: filtered.length });
        }
        if (path === '/api/subscriptions' && method === 'POST') {
          const body = await getRequestBody(req);
          const nextNum = String(subscriptions.length + 1).padStart(6, '0');
          const newSub = {
            id: `SUB-${nextNum}`,
            ...body,
            status: 'ACTIVE',
            startDate: new Date().toISOString(),
            nextBillingAt: new Date(Date.now() + 30*86400000).toISOString(),
            createdAt: new Date().toISOString()
          };
          subscriptions.push(newSub);
          return sendJson(res, newSub);
        }
        if (path.startsWith('/api/subscriptions/') && method === 'GET') {
          const id = path.split('/')[3];
          const sub = subscriptions.find(s => s.id === id);
          if (sub) return sendJson(res, sub);
          return sendJson(res, { message: 'Not found' }, 404);
        }

        // Tax Lookup
        if (path.startsWith('/api/tax-lookup/') && method === 'GET') {
          return sendJson(res, { hsnOrSacCode: '998311', description: 'IT Services', gstRate: 18.00 });
        }

        // If route matches /api but not handled above, return 404 JSON
        return sendJson(res, { message: `Route ${method} ${path} not mocked` }, 404);
      });
    }
  };
}
