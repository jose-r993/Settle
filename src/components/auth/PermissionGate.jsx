import { useAuth } from '../../context/SupabaseAuthContext';

export default function PermissionGate({
  children,
  permission,
  role,
  fallback = null,
  requireAll = false,
}) {
  const { hasPermission, hasRole } = useAuth();

  if (permission) {
    const permissions = Array.isArray(permission) ? permission : [permission];

    const hasAccess = requireAll
      ? permissions.every(p => hasPermission(p))
      : permissions.some(p => hasPermission(p));

    if (!hasAccess) return fallback;
  }

  if (role) {
    const roles = Array.isArray(role) ? role : [role];

    const hasAccess = requireAll
      ? roles.every(r => hasRole(r))
      : roles.some(r => hasRole(r));

    if (!hasAccess) return fallback;
  }

  return children;
}
