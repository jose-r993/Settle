import { useAuth } from '../../context/SupabaseAuthContext';

export default function ProtectedRoute({ children, requirePermission, requireRole, fallback }) {
  const { user, hasPermission, hasRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-on-surface-variant font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center max-w-md">
          <span className="material-symbols-outlined text-6xl text-outline mb-4">lock</span>
          <h2 className="text-2xl font-bold text-on-surface mb-2">Authentication Required</h2>
          <p className="text-on-surface-variant">Please log in to access this page.</p>
        </div>
      </div>
    );
  }

  if (requirePermission && !hasPermission(requirePermission)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center max-w-md">
          <span className="material-symbols-outlined text-6xl text-error mb-4">block</span>
          <h2 className="text-2xl font-bold text-on-surface mb-2">Access Denied</h2>
          <p className="text-on-surface-variant">You do not have permission to access this page.</p>
        </div>
      </div>
    );
  }

  if (requireRole && !hasRole(requireRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center max-w-md">
          <span className="material-symbols-outlined text-6xl text-error mb-4">block</span>
          <h2 className="text-2xl font-bold text-on-surface mb-2">Access Denied</h2>
          <p className="text-on-surface-variant">You do not have the required role to access this page.</p>
        </div>
      </div>
    );
  }

  return children;
}
