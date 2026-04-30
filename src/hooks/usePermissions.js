import { useAuth } from '../context/SupabaseAuthContext';
import { authConfig } from '../data/authConfig';

export function usePermissions() {
  const { user, hasPermission, hasRole } = useAuth();

  const can = (permission) => {
    return hasPermission(permission);
  };

  const canAny = (permissions) => {
    return permissions.some(permission => hasPermission(permission));
  };

  const canAll = (permissions) => {
    return permissions.every(permission => hasPermission(permission));
  };

  const isAdmin = () => {
    return hasRole(authConfig.userRoles.ADMIN);
  };

  const isUser = () => {
    return hasRole(authConfig.userRoles.USER);
  };

  const isGuest = () => {
    return hasRole(authConfig.userRoles.GUEST);
  };

  return {
    can,
    canAny,
    canAll,
    isAdmin,
    isUser,
    isGuest,
    user,
  };
}

export function useRequirePermission(permission) {
  const { hasPermission } = useAuth();
  return hasPermission(permission);
}

export function useRequireRole(role) {
  const { hasRole } = useAuth();
  return hasRole(role);
}
