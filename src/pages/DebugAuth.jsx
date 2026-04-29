import { useAuth } from '../context/SupabaseAuthContext';
import { isSupabaseConfigured } from '../config/supabase';

export default function DebugAuth({ onNavigate }) {
  const auth = useAuth();

  const clearAll = () => {
    localStorage.clear();
    sessionStorage.clear();
    alert('Cleared all storage. Reloading...');
    window.location.reload();
  };

  const testNavigation = () => {
    console.log('Testing navigation to /dashboard');
    onNavigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-surface p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-surface-container-lowest rounded-xl editorial-shadow p-8 mb-6">
          <h1 className="text-3xl font-bold text-on-surface mb-4">🔍 Auth Debug Panel</h1>
          <p className="text-on-surface-variant mb-6">
            Use this page to diagnose authentication issues
          </p>

          <div className="flex gap-3 mb-6">
            <button
              onClick={clearAll}
              className="px-4 py-2 bg-error/10 text-error rounded-lg font-semibold hover:bg-error/20"
            >
              Clear All Storage
            </button>
            <button
              onClick={testNavigation}
              className="px-4 py-2 bg-primary/10 text-primary rounded-lg font-semibold hover:bg-primary/20"
            >
              Test Navigation
            </button>
            <button
              onClick={() => onNavigate('/login')}
              className="px-4 py-2 bg-surface-container-highest text-on-surface rounded-lg font-semibold hover:bg-surface-dim"
            >
              Go to Login
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Auth State */}
          <div className="bg-surface-container-lowest rounded-xl editorial-shadow p-6">
            <h2 className="text-xl font-bold text-on-surface mb-4">Auth State</h2>
            <div className="space-y-2 text-sm font-mono">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Loading:</span>
                <span className={auth.loading ? 'text-yellow-600' : 'text-green-600'}>
                  {auth.loading ? 'true' : 'false'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Has User:</span>
                <span className={auth.user ? 'text-green-600' : 'text-red-600'}>
                  {auth.user ? 'true' : 'false'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Has Session:</span>
                <span className={auth.session ? 'text-green-600' : 'text-red-600'}>
                  {auth.session ? 'true' : 'false'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Using Supabase:</span>
                <span className={auth.useSupabase ? 'text-green-600' : 'text-yellow-600'}>
                  {auth.useSupabase ? 'true' : 'false'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Is Authenticated:</span>
                <span className={auth.isAuthenticated() ? 'text-green-600' : 'text-red-600'}>
                  {auth.isAuthenticated() ? 'true' : 'false'}
                </span>
              </div>
              {auth.error && (
                <div className="mt-4 p-3 bg-error/10 rounded-lg">
                  <p className="text-error font-semibold text-xs">Error:</p>
                  <p className="text-error text-xs mt-1">{auth.error}</p>
                </div>
              )}
            </div>
          </div>

          {/* User Data */}
          <div className="bg-surface-container-lowest rounded-xl editorial-shadow p-6">
            <h2 className="text-xl font-bold text-on-surface mb-4">User Data</h2>
            {auth.user ? (
              <div className="space-y-2 text-sm font-mono">
                <div>
                  <span className="text-on-surface-variant">ID:</span>
                  <p className="text-on-surface text-xs break-all">{auth.user.id}</p>
                </div>
                <div>
                  <span className="text-on-surface-variant">Email:</span>
                  <p className="text-on-surface">{auth.user.email}</p>
                </div>
                <div>
                  <span className="text-on-surface-variant">Name:</span>
                  <p className="text-on-surface">{auth.user.name}</p>
                </div>
                <div>
                  <span className="text-on-surface-variant">Role:</span>
                  <p className="text-on-surface">{auth.user.role}</p>
                </div>
                {auth.user.oauthProvider && (
                  <div>
                    <span className="text-on-surface-variant">OAuth Provider:</span>
                    <p className="text-on-surface">{auth.user.oauthProvider}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-on-surface-variant text-sm">No user data</p>
            )}
          </div>

          {/* Environment */}
          <div className="bg-surface-container-lowest rounded-xl editorial-shadow p-6">
            <h2 className="text-xl font-bold text-on-surface mb-4">Environment</h2>
            <div className="space-y-2 text-sm font-mono">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Supabase Configured:</span>
                <span className={isSupabaseConfigured() ? 'text-green-600' : 'text-red-600'}>
                  {isSupabaseConfigured() ? 'YES' : 'NO'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Current Path:</span>
                <span className="text-on-surface text-xs">{window.location.pathname}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Has Hash:</span>
                <span className="text-on-surface">{window.location.hash ? 'YES' : 'NO'}</span>
              </div>
            </div>
          </div>

          {/* LocalStorage */}
          <div className="bg-surface-container-lowest rounded-xl editorial-shadow p-6">
            <h2 className="text-xl font-bold text-on-surface mb-4">LocalStorage Keys</h2>
            <div className="space-y-1 text-xs font-mono">
              {Object.keys(localStorage).map(key => (
                <div key={key} className="text-on-surface-variant">
                  • {key}
                </div>
              ))}
              {Object.keys(localStorage).length === 0 && (
                <p className="text-on-surface-variant">No items in localStorage</p>
              )}
            </div>
          </div>
        </div>

        {/* Full Auth Object */}
        <div className="bg-surface-container-lowest rounded-xl editorial-shadow p-6 mt-6">
          <h2 className="text-xl font-bold text-on-surface mb-4">Full Auth Object (JSON)</h2>
          <pre className="text-xs bg-surface-container-high p-4 rounded-lg overflow-auto max-h-96 text-on-surface">
            {JSON.stringify({
              user: auth.user,
              session: auth.session ? {
                access_token: auth.session.access_token?.substring(0, 20) + '...',
                refresh_token: auth.session.refresh_token?.substring(0, 20) + '...',
                expires_at: auth.session.expires_at,
              } : null,
              loading: auth.loading,
              error: auth.error,
              useSupabase: auth.useSupabase,
            }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
