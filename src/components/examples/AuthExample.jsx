import { useAuth } from '../../context/SupabaseAuthContext';
import { usePermissions } from '../../hooks/usePermissions';
import PermissionGate from '../auth/PermissionGate';

export default function AuthExample() {
  const { user, logout, updateProfile } = useAuth();
  const { can, isAdmin, isUser } = usePermissions();

  const handleUpdateCity = async () => {
    const result = await updateProfile({
      targetCity: 'Austin',
    });

    if (result.success) {
      alert('City updated successfully!');
    }
  };

  return (
    <div className="min-h-screen bg-surface p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-surface-container-lowest rounded-xl editorial-shadow p-8 mb-6">
          <h1 className="text-4xl font-extrabold text-on-surface mb-2">
            Authentication System Demo
          </h1>
          <p className="text-on-surface-variant text-lg">
            Demonstrating data-driven authentication features
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-surface-container-lowest rounded-xl editorial-shadow p-6">
            <h2 className="text-xl font-bold text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">person</span>
              User Information
            </h2>
            <div className="space-y-2 text-sm">
              <p className="text-on-surface"><strong>Name:</strong> {user?.name}</p>
              <p className="text-on-surface"><strong>Email:</strong> {user?.email}</p>
              <p className="text-on-surface"><strong>Role:</strong>
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${user?.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-surface-container-high text-on-surface'
                  }`}>
                  {user?.role}
                </span>
              </p>
              <p className="text-on-surface"><strong>City:</strong> {user?.targetCity}</p>
              <p className="text-on-surface"><strong>Verified:</strong> {user?.metadata?.isVerified ? '✓' : '✗'}</p>
            </div>
            <button
              onClick={logout}
              className="mt-4 w-full bg-error/10 text-error py-2 rounded-lg font-semibold hover:bg-error/20 transition"
            >
              Logout
            </button>
          </div>

          <div className="bg-surface-container-lowest rounded-xl editorial-shadow p-6">
            <h2 className="text-xl font-bold text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">shield</span>
              Role & Permissions
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-on-surface-variant">Is Admin</span>
                <span className={`px-2 py-1 rounded text-xs font-bold ${isAdmin() ? 'bg-green-500/10 text-green-600' : 'bg-surface-container-high text-outline'
                  }`}>
                  {isAdmin() ? 'YES' : 'NO'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-on-surface-variant">Is User</span>
                <span className={`px-2 py-1 rounded text-xs font-bold ${isUser() ? 'bg-green-500/10 text-green-600' : 'bg-surface-container-high text-outline'
                  }`}>
                  {isUser() ? 'YES' : 'NO'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-on-surface-variant">Can Manage Users</span>
                <span className={`px-2 py-1 rounded text-xs font-bold ${can('manage_users') ? 'bg-green-500/10 text-green-600' : 'bg-surface-container-high text-outline'
                  }`}>
                  {can('manage_users') ? 'YES' : 'NO'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-on-surface-variant">Can Save Favorites</span>
                <span className={`px-2 py-1 rounded text-xs font-bold ${can('save_favorites') ? 'bg-green-500/10 text-green-600' : 'bg-surface-container-high text-outline'
                  }`}>
                  {can('save_favorites') ? 'YES' : 'NO'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-on-surface-variant">Can View Analytics</span>
                <span className={`px-2 py-1 rounded text-xs font-bold ${can('view_analytics') ? 'bg-green-500/10 text-green-600' : 'bg-surface-container-high text-outline'
                  }`}>
                  {can('view_analytics') ? 'YES' : 'NO'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl editorial-shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-on-surface mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">visibility</span>
            Permission-Based Rendering
          </h2>

          <div className="space-y-4">
            <PermissionGate permission="save_favorites">
              <div className="bg-green-500/10 border-2 border-green-500/20 rounded-lg p-4">
                <p className="text-green-700 font-semibold">✓ You can see this because you have 'save_favorites' permission</p>
              </div>
            </PermissionGate>

            <PermissionGate permission="manage_users">
              <div className="bg-blue-500/10 border-2 border-blue-500/20 rounded-lg p-4">
                <p className="text-blue-700 font-semibold">✓ You can see this because you have 'manage_users' permission (Admin only)</p>
              </div>
            </PermissionGate>

            <PermissionGate
              permission="manage_users"
              fallback={
                <div className="bg-surface-container-high rounded-lg p-4">
                  <p className="text-on-surface-variant">✗ Admin-only content is hidden for regular users</p>
                </div>
              }
            >
              <div className="bg-primary/10 border-2 border-primary/20 rounded-lg p-4">
                <p className="text-primary font-semibold">✓ Admin Controls Visible</p>
              </div>
            </PermissionGate>

            <PermissionGate role="admin">
              <div className="bg-purple-500/10 border-2 border-purple-500/20 rounded-lg p-4">
                <p className="text-purple-700 font-semibold">✓ You can see this because you have 'admin' role</p>
              </div>
            </PermissionGate>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl editorial-shadow p-6">
          <h2 className="text-xl font-bold text-on-surface mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">settings</span>
            Profile Actions
          </h2>

          <div className="space-y-3">
            <button
              onClick={handleUpdateCity}
              className="w-full bg-gradient-to-br from-primary to-primary-container text-white py-3 rounded-lg font-semibold hover:shadow-lg transition"
            >
              Update City to Austin
            </button>

            <PermissionGate permission="manage_settings">
              <button className="w-full bg-surface-container-highest text-on-surface py-3 rounded-lg font-semibold hover:bg-surface-dim transition">
                Admin Settings (Admin Only)
              </button>
            </PermissionGate>
          </div>
        </div>

        <div className="mt-8 bg-surface-container-low rounded-xl p-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-outline mb-3">
            User Preferences
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-on-surface-variant mb-1">Budget Range</p>
              <p className="text-on-surface font-semibold">
                ${user?.preferences?.budget?.min} - ${user?.preferences?.budget?.max}
              </p>
            </div>
            <div>
              <p className="text-on-surface-variant mb-1">Bedrooms</p>
              <p className="text-on-surface font-semibold">{user?.preferences?.bedrooms}</p>
            </div>
            <div>
              <p className="text-on-surface-variant mb-1">Bathrooms</p>
              <p className="text-on-surface font-semibold">{user?.preferences?.bathrooms}</p>
            </div>
            <div>
              <p className="text-on-surface-variant mb-1">Occupation</p>
              <p className="text-on-surface font-semibold">{user?.profile?.occupation || 'Not set'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
