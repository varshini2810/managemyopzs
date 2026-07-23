/**
 * Defines the hierarchical weight of each role in the system.
 * Higher numbers represent higher privileges.
 */
export const ROLE_WEIGHTS = {
  'ULTRASUPERADMIN': 4,
  'SUPERADMIN': 3,
  'ADMIN': 2,
  'USER': 1
};

/**
 * Checks if the user's role is greater than or equal to the required role.
 * 
 * @param {string} userRole - The role of the current user (e.g., 'ADMIN')
 * @param {string} requiredRole - The minimum role required (e.g., 'SUPERADMIN')
 * @returns {boolean} True if the user has access, false otherwise.
 */
export const hasMinRole = (userRole, requiredRole) => {
  if (!userRole || !requiredRole) return false;
  
  const userWeight = ROLE_WEIGHTS[userRole?.toUpperCase()];
  const requiredWeight = ROLE_WEIGHTS[requiredRole?.toUpperCase()];
  
  if (userWeight === undefined || requiredWeight === undefined) {
    return false;
  }
  
  return userWeight >= requiredWeight;
};
