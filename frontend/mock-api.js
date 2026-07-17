// Mock API Middleware for Vite Dev Server

let clients = [
  {
    id: 'CLT-001',
    companyName: 'TechVision Solutions Pvt Ltd',
    companyCode: 'TECH-7821',
    businessType: 'Private Limited',
    industry: 'Technology',
    contactName: 'Rahul Mehta',
    email: 'rahul@techvision.in',
    phone: '+91 98765 43210',
    mobile: '+91 99999 11111',
    website: 'https://techvision.in',
    gstNumber: '27AABCV1234A1ZS',
    taxRegNumber: 'TRN-27001',
    companyRegNumber: 'CIN-U72200MH2020PTC12345',
    addressLine1: '401, Solitaire Corporate Park',
    addressLine2: 'Chakala, Andheri East',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    zipCode: '400093',
    subscriptionPlan: 'Enterprise',
    numberOfUsers: 100,
    startDate: '2026-01-01',
    expiryDate: '2026-12-31',
    subscriptionStatus: 'Active',
    accountStatus: 'Active',
    logoUrl: '',
    createdAt: '2026-01-01T09:00:00Z',
    updatedAt: '2026-01-01T09:00:00Z'
  },
  {
    id: 'CLT-002',
    companyName: 'ScalePay Technologies',
    companyCode: 'SCAL-4392',
    businessType: 'Private Limited',
    industry: 'Finance & Banking',
    contactName: 'Arjun Kapoor',
    email: 'arjun@scalepay.io',
    phone: '+91 88001 22334',
    mobile: '',
    website: 'https://scalepay.io',
    gstNumber: '29AABCV5678B2ZT',
    taxRegNumber: '',
    companyRegNumber: 'CIN-U65100KA2021PTC67890',
    addressLine1: '88 Bandra West',
    addressLine2: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    zipCode: '400050',
    subscriptionPlan: 'Professional',
    numberOfUsers: 50,
    startDate: '2026-02-15',
    expiryDate: '2027-02-14',
    subscriptionStatus: 'Active',
    accountStatus: 'Active',
    logoUrl: '',
    createdAt: '2026-02-15T10:00:00Z',
    updatedAt: '2026-02-15T10:00:00Z'
  },
  {
    id: 'CLT-003',
    companyName: 'DataBridge Analytics',
    companyCode: 'DATA-9012',
    businessType: 'LLP',
    industry: 'Technology',
    contactName: 'Sneha Reddy',
    email: 'sneha@databridge.com',
    phone: '+91 87654 32190',
    mobile: '',
    website: '',
    gstNumber: '36AABCD9012C1ZT',
    taxRegNumber: '',
    companyRegNumber: '',
    addressLine1: '22 Jubilee Hills',
    addressLine2: '',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    zipCode: '500033',
    subscriptionPlan: 'Growth',
    numberOfUsers: 25,
    startDate: '2025-12-01',
    expiryDate: '2026-11-30',
    subscriptionStatus: 'Suspended',
    accountStatus: 'Inactive',
    logoUrl: '',
    createdAt: '2025-12-01T08:00:00Z',
    updatedAt: '2026-06-01T08:00:00Z'
  }
];

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

// ─────────────────────────────────────────────────────────────────────────────
// RBAC HELPERS
// ─────────────────────────────────────────────────────────────────────────────

// Map role → portalType string used in login URL
const ROLE_TO_PORTAL = {
  ULTRASUPERADMIN: 'ultra-admin',
  SUPERADMIN: 'super-admin',
  ADMIN: 'admin',
  USER: 'user',
};

const PORTAL_TO_ROLE = {
  'ultra-admin': 'ULTRASUPERADMIN',
  'super-admin': 'SUPERADMIN',
  'admin': 'ADMIN',
  'user': 'USER',
};

function calculatePermissions(role) {
  const isUltra = role === 'ULTRASUPERADMIN';
  const isSuper = role === 'SUPERADMIN' || isUltra;
  const isAdmin = role === 'ADMIN';
  return {
    dashboard: true,
    employeeManagement: isSuper,
    attendance: isSuper || isAdmin,
    payroll: isSuper,
    leaveManagement: isSuper || isAdmin,
    reports: isSuper || isAdmin,
    settings: isSuper,
    invoices: true,
    expenses: isSuper || isAdmin,
    analytics: isSuper || isAdmin,
    taxReports: isSuper,
    brandSettings: isSuper,
    checkoutPortal: isSuper,
    clientManagement: isUltra,
    platformConsole: isUltra,
    accessControl: isSuper,
    teamMembers: isSuper,
  };
}

function buildGrantedModules(role) {
  const isUltra = role === 'ULTRASUPERADMIN';
  const isSuper = role === 'SUPERADMIN' || isUltra;
  const isAdmin = role === 'ADMIN';
  const modules = ['INVOICE', 'CUSTOMER', 'SUBSCRIPTION', 'CATALOG'];
  if (isSuper || isAdmin) modules.push('ANALYTICS', 'EXPENSE', 'LOGS');
  if (isSuper) modules.push(
    'TAX_REPORT', 'SETTINGS_CONFIGURE', 'SETTINGS_THIRD_PARTY',
    'SETTINGS_IMPORT_EXPORT', 'SETTINGS_TEAM_MEMBERS', 'SETTINGS_ACCESS_CONTROL',
    'SETTINGS_NOTIFICATIONS', 'SETTINGS_SECURITY', 'REVENUE_STORY', 'REPORTS', 'APPS'
  );
  if (isUltra) modules.push('CLIENT_MANAGEMENT', 'PLATFORM_CONSOLE', 'SETTINGS_CLIENT_DETAILS');
  return modules;
}

const DEFAULT_USERS = [
  {
    id: 1,
    role: 'ULTRASUPERADMIN',
    profile: {
      fullName: 'Ultra Admin',
      email: 'ultraadmin@billingplatform.com',
      password: 'Ultra@123',
      status: 'Active',
      loginEnabled: true,
      employeeId: 'EMP-001',
      department: 'Platform',
    },
  },
  {
    id: 2,
    role: 'SUPERADMIN',
    profile: {
      fullName: 'Super Admin',
      email: 'superadmin@billingplatform.com',
      password: 'Super@123',
      status: 'Active',
      loginEnabled: true,
      employeeId: 'EMP-002',
      department: 'Management',
    },
  },
  {
    id: 3,
    role: 'ADMIN',
    profile: {
      fullName: 'Admin User',
      email: 'admin@billingplatform.com',
      password: 'Admin@123',
      status: 'Active',
      loginEnabled: true,
      employeeId: 'EMP-003',
      department: 'Operations',
    },
  },
  {
    id: 4,
    role: 'USER',
    profile: {
      fullName: 'Regular User',
      email: 'user@billingplatform.com',
      password: 'User@123',
      status: 'Active',
      loginEnabled: true,
      employeeId: 'EMP-004',
      department: 'Support',
    },
  },
];

function seedDefaultUsers() {
  if (!globalThis.__mockUsers || globalThis.__mockUsers.length === 0) {
    globalThis.__mockUsers = DEFAULT_USERS.map(u => ({
      ...u,
      permissions: calculatePermissions(u.role),
    }));
  } else {
    // Ensure every seeded user exists (add if missing)
    DEFAULT_USERS.forEach(def => {
      const exists = globalThis.__mockUsers.find(u => u.id === def.id);
      if (!exists) {
        globalThis.__mockUsers.push({ ...def, permissions: calculatePermissions(def.role) });
      }
    });
  }
}

if (!globalThis.__mockAuditLogs) globalThis.__mockAuditLogs = [];

function addAuditLog(adminUser, targetUser, changes) {
  globalThis.__mockAuditLogs.unshift({
    id: `AL-${Date.now()}`,
    timestamp: new Date().toISOString(),
    adminId: adminUser?.id,
    adminName: adminUser?.profile?.fullName || adminUser?.name || 'System',
    adminRole: adminUser?.role,
    targetId: targetUser?.id,
    targetName: targetUser?.profile?.fullName,
    ...changes,
  });
}

export default function mockApiPlugin() {
  seedDefaultUsers();

  return {
    name: 'mock-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api')) return next();

        const url = new URL(req.url, `http://${req.headers.host}`);
        const path = url.pathname;
        const method = req.method;

        // ─── Ensure default users always exist (hot-reload safe) ───────────
        seedDefaultUsers();

        // ─── Token helper ───────────────────────────────────────────────────
        function getUserFromToken(req) {
          const authHeader = req.headers.authorization || '';
          const match = authHeader.match(/Bearer opz_([^_]+)_/);
          if (!match) return null;
          const userId = parseInt(match[1], 10);
          return globalThis.__mockUsers?.find(u => u.id === userId) || null;
        }

        // ─── Auth endpoints ─────────────────────────────────────────────────

        if (path === '/api/auth/login' && method === 'POST') {
          const body = await getRequestBody(req);
          const { email, password, portalType } = body;

          if (!email) return sendJson(res, { message: 'Email is required' }, 400);

          const foundUser = globalThis.__mockUsers?.find(u => u.profile?.email === email);
          if (!foundUser) return sendJson(res, { message: 'Invalid email or password.' }, 401);

          if (foundUser.profile?.password !== password) {
            return sendJson(res, { message: 'Invalid email or password.' }, 401);
          }

          // Portal-type mismatch check
          if (portalType) {
            const expectedPortal = ROLE_TO_PORTAL[foundUser.role];
            if (expectedPortal !== portalType) {
              const roleLabel = foundUser.role.replace('ULTRASUPERADMIN','Ultra Admin').replace('SUPERADMIN','Super Admin').replace('ADMIN','Admin').replace('USER','User');
              const portalLabel = portalType.split('-').map(w => w.charAt(0).toUpperCase()+w.slice(1)).join(' ');
              return sendJson(res, {
                message: `This account belongs to the ${roleLabel} Portal. Please login using the ${roleLabel} Login page.`
              }, 403);
            }
          }

          if (foundUser.profile?.loginEnabled === false) {
            return sendJson(res, { message: 'Your login has been disabled by the administrator.' }, 403);
          }
          if (foundUser.profile?.status !== 'Active') {
            return sendJson(res, { message: 'Your account has been deactivated. Please contact an administrator.' }, 403);
          }

          const token = `opz_${foundUser.id}_${Date.now()}`;
          return sendJson(res, {
            accessToken: token,
            refreshToken: `opz_refresh_${foundUser.id}_${Date.now()}`,
            user: {
              id: foundUser.id,
              name: foundUser.profile?.fullName,
              email: foundUser.profile?.email,
              role: foundUser.role,
              tenantId: 'tenant_demo',
            }
          });
        }

        if (path === '/api/auth/me' && method === 'GET') {
          const foundUser = getUserFromToken(req);
          if (!foundUser) return sendJson(res, { message: 'Unauthorized' }, 401);

          return sendJson(res, {
            id: foundUser.id,
            name: foundUser.profile?.fullName || 'User',
            email: foundUser.profile?.email,
            role: foundUser.role,
            tenantId: 'tenant_demo',
            grantedModules: buildGrantedModules(foundUser.role),
            status: foundUser.profile?.status,
            loginEnabled: foundUser.profile?.loginEnabled,
          });
        }

        if (path === '/api/auth/refresh' && method === 'POST') {
          const body = await getRequestBody(req);
          const match = (body.refreshToken || '').match(/opz_refresh_(\d+)_/);
          if (!match) return sendJson(res, { message: 'Invalid refresh token' }, 401);
          const userId = parseInt(match[1], 10);
          return sendJson(res, { accessToken: `opz_${userId}_${Date.now()}` });
        }

        if (path === '/api/auth/reset-password' && method === 'POST') {
          const body = await getRequestBody(req);
          if (!body.email || !body.password) return sendJson(res, { message: 'Email and password are required' }, 400);
          const foundUser = globalThis.__mockUsers?.find(u => u.profile?.email === body.email);
          if (!foundUser) return sendJson(res, { message: 'User not found' }, 404);
          foundUser.profile.password = body.password;
          if (body.forceChangeOnNextLogin) foundUser.profile.forcePasswordChange = true;
          return sendJson(res, { message: 'Password reset successfully', success: true });
        }

        if (path === '/api/auth/change-portal' && method === 'POST') {
          const body = await getRequestBody(req);
          const { newPortalRole, password } = body;
          const actingUser = getUserFromToken(req);

          if (!actingUser) return sendJson(res, { message: 'Unauthorized' }, 401);

          // Only Ultra Admin can change their own portal
          if (actingUser.role !== 'ULTRASUPERADMIN') {
            return sendJson(res, { message: 'Only Ultra Admin users can change portals.' }, 403);
          }

          if (!newPortalRole) return sendJson(res, { message: 'New portal role is required.' }, 400);
          if (!password) return sendJson(res, { message: 'Password is required.' }, 400);

          // Validate password
          if (actingUser.profile?.password !== password) {
            return sendJson(res, { message: 'Incorrect password. Please try again.' }, 401);
          }

          // Prevent switching to same role
          if (actingUser.role === newPortalRole) {
            return sendJson(res, { message: 'You are already on this portal.' }, 400);
          }

          // Protect last Ultra Admin from downgrading themselves
          const ultraCount = globalThis.__mockUsers.filter(u => u.role === 'ULTRASUPERADMIN').length;
          if (actingUser.role === 'ULTRASUPERADMIN' && newPortalRole !== 'ULTRASUPERADMIN' && ultraCount <= 1) {
            return sendJson(res, { message: 'Cannot change portal. You are the last Ultra Admin.' }, 400);
          }

          const previousRole = actingUser.role;

          // Apply role change
          actingUser.role = newPortalRole;
          actingUser.permissions = calculatePermissions(newPortalRole);

          // Audit log
          addAuditLog(actingUser, actingUser, {
            action: 'PORTAL_CHANGE',
            previousPortal: previousRole,
            newPortal: newPortalRole,
            changedBy: actingUser.profile?.fullName || actingUser.name || 'Self',
          });

          return sendJson(res, { message: 'Portal changed successfully.' });
        }

        // ─── Audit Logs ─────────────────────────────────────────────────────
        if (path === '/api/audit-logs' && method === 'GET') {
          return sendJson(res, globalThis.__mockAuditLogs || []);
        }

        // ─── Employees API ───────────────────────────────────────────────────
        if (path === '/api/employees' && method === 'GET') {
          return sendJson(res, globalThis.__mockUsers);
        }

        if (path === '/api/employees' && method === 'POST') {
          const body = await getRequestBody(req);
          const adminUser = getUserFromToken(req);
          const { id, email, role, status, loginEnabled, password, ...rest } = body;

          if (!email) return sendJson(res, { error: 'Email is required' }, 400);

          // Locate existing user
          let existingIdx = -1;
          if (id) {
            existingIdx = globalThis.__mockUsers.findIndex(u => u.id === id);
          } else {
            existingIdx = globalThis.__mockUsers.findIndex(u => u.profile?.email === email);
          }

          // Duplicate email check (across other users)
          const dupeIdx = globalThis.__mockUsers.findIndex(u => u.profile?.email === email && u.id !== id);
          if (dupeIdx !== -1) return sendJson(res, { message: 'Email address is already in use by another account.' }, 400);

          if (existingIdx !== -1) {
            const target = globalThis.__mockUsers[existingIdx];
            const oldRole = target.role;
            const oldEmail = target.profile?.email;
            const oldStatus = target.profile?.status;
            const oldLoginEnabled = target.profile?.loginEnabled;

            // RBAC: Super Admin cannot modify Ultra Admin
            if (adminUser?.role === 'SUPERADMIN' && target.role === 'ULTRASUPERADMIN') {
              return sendJson(res, { message: 'You do not have permission to modify an Ultra Admin account.' }, 403);
            }
            // Admin cannot modify Super Admin or Ultra Admin
            if (adminUser?.role === 'ADMIN' && (target.role === 'ULTRASUPERADMIN' || target.role === 'SUPERADMIN')) {
              return sendJson(res, { message: 'You do not have permission to modify this account.' }, 403);
            }

            // Security: Prevent removing last Ultra Admin
            if (oldRole === 'ULTRASUPERADMIN' && role && role !== 'ULTRASUPERADMIN') {
              const ultraCount = globalThis.__mockUsers.filter(u => u.role === 'ULTRASUPERADMIN').length;
              if (ultraCount <= 1) {
                return sendJson(res, { message: 'Cannot change the role of the last Ultra Admin.' }, 400);
              }
            }

            // Apply updates
            const updatedProfile = {
              ...target.profile,
              ...rest,
              email,
              status: status !== undefined ? status : target.profile.status,
              loginEnabled: loginEnabled !== undefined ? loginEnabled : (target.profile.loginEnabled ?? true),
            };
            if (password) updatedProfile.password = password;

            globalThis.__mockUsers[existingIdx].profile = updatedProfile;

            if (role && role !== oldRole) {
              globalThis.__mockUsers[existingIdx].role = role;
              globalThis.__mockUsers[existingIdx].permissions = calculatePermissions(role);
            }

            // Audit log
            const changes = {};
            if (role && role !== oldRole) { changes.oldPortalType = oldRole; changes.newPortalType = role; }
            if (email !== oldEmail) changes.emailChanged = `${oldEmail} → ${email}`;
            if (password) changes.passwordReset = true;
            if (loginEnabled !== undefined && loginEnabled !== oldLoginEnabled) changes.loginEnabledChanged = loginEnabled;
            if (status !== undefined && status !== oldStatus) changes.statusChanged = status;
            addAuditLog(adminUser, target, changes);

            return sendJson(res, globalThis.__mockUsers[existingIdx]);
          }

          // Create new user
          const newRole = role || 'USER';
          const newUser = {
            id: Date.now(),
            profile: {
              ...rest,
              email,
              status: status || 'Active',
              loginEnabled: loginEnabled ?? true,
              password: password || 'Default@123',
            },
            role: newRole,
            permissions: calculatePermissions(newRole),
          };
          globalThis.__mockUsers.push(newUser);
          addAuditLog(adminUser, newUser, { action: 'USER_CREATED', newPortalType: newRole });
          return sendJson(res, newUser);
        }

        // ─── Clients API (Ultra Admin Only) ─────────────────────────────────
        if (path === '/api/clients' && method === 'GET') {
          return sendJson(res, clients);
        }
        if (path === '/api/clients' && method === 'POST') {
          const body = await getRequestBody(req);
          if (!body.companyName) return sendJson(res, { error: 'Company name is required' }, 400);
          const newClient = {
            id: 'CLT-' + String(clients.length + 1).padStart(3, '0') + '-' + Math.floor(100 + Math.random() * 900),
            ...body,
            companyCode: body.companyCode || ('CLT-' + Math.floor(1000 + Math.random() * 9000)),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          clients.push(newClient);
          return sendJson(res, newClient);
        }
        const clientMatch = path.match(/^\/api\/clients\/(.+)$/);
        if (clientMatch && method === 'GET') {
          const client = clients.find(c => c.id === clientMatch[1]);
          return client ? sendJson(res, client) : sendJson(res, { error: 'Client not found' }, 404);
        }
        if (clientMatch && method === 'PUT') {
          const body = await getRequestBody(req);
          const idx = clients.findIndex(c => c.id === clientMatch[1]);
          if (idx !== -1) { clients[idx] = { ...clients[idx], ...body, updatedAt: new Date().toISOString() }; return sendJson(res, clients[idx]); }
          return sendJson(res, { error: 'Client not found' }, 404);
        }
        if (clientMatch && method === 'DELETE') {
          const before = clients.length;
          clients = clients.filter(c => c.id !== clientMatch[1]);
          return clients.length < before ? sendJson(res, { message: 'Client deleted' }) : sendJson(res, { error: 'Client not found' }, 404);
        }

        // ─── Users CRUD ──────────────────────────────────────────────────────
        if (path === '/api/users' && method === 'GET') return sendJson(res, globalThis.__mockUsers);

        if (path === '/api/users' && method === 'POST') {
          const body = await getRequestBody(req);
          if (globalThis.__mockUsers.find(u => u.profile?.email === body.email)) {
            return sendJson(res, { error: 'Email already exists' }, 400);
          }
          const newU = { id: Date.now(), profile: { fullName: body.fullName||'', email: body.email||'', department: body.department||'', status: body.status||'Active', loginEnabled: true, password: body.password||'Default@123' }, role: body.role||'USER', permissions: calculatePermissions(body.role||'USER') };
          globalThis.__mockUsers.push(newU);
          return sendJson(res, newU);
        }

        const userMatch = path.match(/^\/api\/users\/(\d+)$/);
        if (userMatch && method === 'GET') {
          const u = globalThis.__mockUsers.find(u => u.id === parseInt(userMatch[1], 10));
          return u ? sendJson(res, u) : sendJson(res, { error: 'User not found' }, 404);
        }
        if (userMatch && method === 'PUT') {
          const body = await getRequestBody(req);
          const idx = globalThis.__mockUsers.findIndex(u => u.id === parseInt(userMatch[1], 10));
          if (idx !== -1) {
            globalThis.__mockUsers[idx] = { ...globalThis.__mockUsers[idx], profile: { ...globalThis.__mockUsers[idx].profile, ...body.profile, status: body.status || globalThis.__mockUsers[idx].profile.status }, role: body.role || globalThis.__mockUsers[idx].role, permissions: body.permissions || globalThis.__mockUsers[idx].permissions };
            return sendJson(res, globalThis.__mockUsers[idx]);
          }
          return sendJson(res, { error: 'User not found' }, 404);
        }
        if (userMatch && method === 'DELETE') {
          globalThis.__mockUsers = globalThis.__mockUsers.filter(u => u.id !== parseInt(userMatch[1], 10));
          return sendJson(res, { message: 'Deleted' });
        }

        const userPermMatch = path.match(/^\/api\/users\/(\d+)\/permissions$/);
        if (userPermMatch && method === 'PUT') {
          const body = await getRequestBody(req);
          const idx = globalThis.__mockUsers.findIndex(u => u.id === parseInt(userPermMatch[1], 10));
          if (idx !== -1) { globalThis.__mockUsers[idx].permissions = { ...globalThis.__mockUsers[idx].permissions, ...body }; return sendJson(res, globalThis.__mockUsers[idx]); }
          return sendJson(res, { error: 'User not found' }, 404);
        }

        // ─── User/Profile ────────────────────────────────────────────────────
        if (path === '/api/user/profile' && method === 'GET') {
          const u = getUserFromToken(req);
          return sendJson(res, u ? u.profile : (globalThis.__mockUsers[0]?.profile || {}));
        }
        if (path === '/api/user/profile' && method === 'PUT') {
          const body = await getRequestBody(req);
          const tokenUser = getUserFromToken(req);
          const idx = tokenUser
            ? globalThis.__mockUsers.findIndex(u => u.id === tokenUser.id)
            : globalThis.__mockUsers.findIndex(u => u.profile?.email === body.email || u.profile?.employeeId === body.employeeId);
          if (idx !== -1) {
            globalThis.__mockUsers[idx].profile = { ...globalThis.__mockUsers[idx].profile, ...body };
            if (body.role) globalThis.__mockUsers[idx].role = body.role;
          }
          return sendJson(res, body);
        }

        // ─── Dashboard endpoints ──────────────────────────────────────────────
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
