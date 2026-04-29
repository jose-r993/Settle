import { useState, useEffect } from 'react';
import { useAuth } from '../context/SupabaseAuthContext';

const SECTION_ROW = ({ label, value, icon, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center justify-between py-4 w-full hover:bg-surface-container/30 -mx-2 px-2 rounded-lg transition group"
  >
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center shrink-0">
        <span className="material-symbols-outlined text-on-surface-variant text-[20px]">{icon}</span>
      </div>
      <div className="text-left">
        <p className="text-sm font-semibold text-on-surface">{label}</p>
        <p className="text-xs text-on-surface-variant font-normal">{value}</p>
      </div>
    </div>
    <span className="material-symbols-outlined text-on-surface-variant text-[20px] group-hover:translate-x-0.5 transition-transform">chevron_right</span>
  </button>
);

export default function Settings({ onNavigate }) {
  const { user, logout } = useAuth();
  const [language, setLanguage] = useState('English');

  useEffect(() => {
    if (!user) {
      onNavigate('/login');
    }
  }, [user, onNavigate]);

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'JD';

  const handleLogout = () => {
    logout();
    onNavigate('/login');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="pt-24 pb-24 px-6 max-w-5xl mx-auto w-full">

      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-on-surface mb-2">Settings</h1>
        <p className="text-base text-on-surface-variant">Manage your account settings and preferences</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* Left — settings sections */}
        <div className="lg:col-span-2 space-y-6">

          {/* Profile Card */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 editorial-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <span className="text-primary font-bold text-lg">{initials}</span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-on-surface">{user.name}</h2>
                  <p className="text-sm text-on-surface-variant">{user.email}</p>
                </div>
              </div>
              <button className="px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/5 rounded-lg transition">
                Edit Profile
              </button>
            </div>
          </div>

          {/* Account */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 editorial-shadow">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary text-[20px]">person</span>
              <h3 className="text-base font-semibold text-on-surface">Account</h3>
            </div>
            <div className="space-y-1">
              <SECTION_ROW
                label="Personal Information"
                value={`${user.name} • ${user.email}`}
                icon="badge"
                onClick={() => { }}
              />
              <SECTION_ROW
                label="Phone Number"
                value={user.phone || 'Not set'}
                icon="phone"
                onClick={() => { }}
              />
              <SECTION_ROW
                label="Password"
                value="Change your password"
                icon="lock"
                onClick={() => { }}
              />
            </div>
          </div>

          {/* Location & Property */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 editorial-shadow">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary text-[20px]">location_on</span>
              <h3 className="text-base font-semibold text-on-surface">Location & Property</h3>
            </div>
            <div className="space-y-1">
              <SECTION_ROW
                label="Current Address"
                value={user.address || 'Not set'}
                icon="home"
                onClick={() => { }}
              />
              <SECTION_ROW
                label="Target City"
                value={user.targetCity || 'Not set'}
                icon="location_on"
                onClick={() => { }}
              />
            </div>
          </div>

        </div>

        {/* Right sidebar — quick actions */}
        <aside className="space-y-6">
          <div className="bg-surface-container-lowest rounded-2xl p-6 editorial-shadow">
            <h3 className="text-base font-semibold text-on-surface mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => onNavigate('/faq')}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-surface-container transition text-left"
              >
                <span className="material-symbols-outlined text-on-surface-variant text-[20px]">help</span>
                <span className="text-sm font-medium text-on-surface">Help Center</span>
              </button>

              <button
                onClick={() => onNavigate('/contact')}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-surface-container transition text-left"
              >
                <span className="material-symbols-outlined text-on-surface-variant text-[20px]">mail</span>
                <span className="text-sm font-medium text-on-surface">Contact Support</span>
              </button>

              <button
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-surface-container transition text-left"
              >
                <span className="material-symbols-outlined text-on-surface-variant text-[20px]">language</span>
                <span className="text-sm font-medium text-on-surface">Language</span>
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-error/5 transition text-left mt-4"
              >
                <span className="material-symbols-outlined text-error text-[20px]">logout</span>
                <span className="text-sm font-semibold text-error">Log Out</span>
              </button>
            </div>

            <div className="mt-6 pt-4 border-t border-surface-container">
              <p className="text-xs text-on-surface-variant text-center">App Version</p>
              <p className="text-sm font-medium text-on-surface text-center">Settle v2.1.0</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
