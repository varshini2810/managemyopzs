import React from 'react';
import { useAuth } from '../../store/AuthContext';

export default function RequirePermission({ role, permission, children }) {
  const { user } = useAuth();
  
  if (!user) return null;

  if (user.role === 'ULTRASUPERADMIN' || user.role === 'SUPERADMIN') {
    return <>{children}</>;
  }

  if (role && user.role !== role) {
    return null;
  }

  if (permission && user.permissions && !user.permissions.includes(permission)) {
    return null;
  }

  return <>{children}</>;
}
