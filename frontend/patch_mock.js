const fs = require('fs');
let code = fs.readFileSync('mock-api.js', 'utf8');

const userEndpointCode = 
        // --- Users API (Edit Credentials) -----------------------------------
        if (path.match(/^\\/api\\/users\\/([^/]+)$/) && method === 'GET') {
          const userId = path.split('/').pop();
          const target = globalThis.__mockUsers.find(u => u.id == userId);
          if (!target) return sendJson(res, { message: 'User not found' }, 404);
          return sendJson(res, {
            id: target.id,
            fullName: target.profile?.fullName || target.name || 'User Name',
            employeeId: target.profile?.employeeId || 'EMP-000',
            email: target.profile?.email || target.email,
            portalType: target.role,
            loginEnabled: target.profile?.loginEnabled ?? true,
            accountActive: target.profile?.status === 'Active'
          });
        }

        if (path.match(/^\\/api\\/users\\/([^/]+)$/) && method === 'PUT') {
          const userId = path.split('/').pop();
          const body = await getRequestBody(req);
          const adminUser = getUserFromToken(req);
          
          const existingIdx = globalThis.__mockUsers.findIndex(u => u.id == userId);
          if (existingIdx === -1) return sendJson(res, { message: 'User not found' }, 404);
          
          const target = globalThis.__mockUsers[existingIdx];
          
          // Validation
          if (!body.email) return sendJson(res, { message: 'Email is required' }, 400);
          
          // Duplicate check
          const dupeIdx = globalThis.__mockUsers.findIndex(u => u.profile?.email === body.email && u.id != userId);
          if (dupeIdx !== -1) return sendJson(res, { message: 'Email address is already in use by another account.' }, 400);

          // Update fields
          if (body.fullName) {
             target.name = body.fullName;
             if (target.profile) target.profile.fullName = body.fullName;
          }
          if (body.email) {
             target.email = body.email;
             if (target.profile) target.profile.email = body.email;
          }
          if (body.portalType) target.role = body.portalType;
          if (body.password) {
             if (target.profile) target.profile.password = body.password;
          }
          if (body.loginEnabled !== undefined) {
             if (target.profile) target.profile.loginEnabled = body.loginEnabled;
          }
          if (body.accountActive !== undefined) {
             if (target.profile) target.profile.status = body.accountActive ? 'Active' : 'Inactive';
          }
          
          return sendJson(res, { message: 'User updated successfully' });
        }
;

if (!code.includes('Users API (Edit Credentials)')) {
    code = code.replace('// --- Employees API', userEndpointCode + '\\n        // --- Employees API');
    fs.writeFileSync('mock-api.js', code);
    console.log('mock-api.js updated successfully.');
} else {
    console.log('mock-api.js already updated.');
}
