import { useState } from 'react';
import { useAuth } from '../context/SupabaseAuthContext';

const SECTION_ROW = ({ label, value, icon }) => (
  <div className="flex items-center justify-between py-4">
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <span className="material-symbols-outlined text-primary text-[18px]">{icon}</span>
      </div>
      <div>
        <p className="text-sm font-bold text-on-surface">{label}</p>
        <p className="text-xs text-on-surface-variant font-medium">{value}</p>
      </div>
    </div>
    <button className="text-primary text-sm font-bold hover:underline">Edit</button>
  </div>
);

export default function Settings({ onNavigate }) {
  const { user, logout } = useAuth();
  const [language, setLanguage] = useState('English');

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const handleLogout = () => {
    logout();
    onNavigate('/login');
  };

  return (
    <div className="pt-32 pb-24 px-8 max-w-screen-2xl mx-auto w-full">

      <header className="mb-10">
        <h1 className="text-6xl font-extrabold tracking-tight text-on-surface mb-4">Settings</h1>
        <p className="text-xl text-on-surface-variant font-medium">Manage your account settings and preferences.</p>
      </header>

      {/* Profile row */}
      <div className="bg-surface-container-lowest rounded-xl p-8 flex items-center gap-6 mb-8 editorial-shadow">
        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shrink-0">
          <span className="text-white font-black text-xl">{initials}</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-on-surface">{user?.name ?? 'User'}</h2>
          <p className="text-on-surface-variant font-medium">{user?.email ?? 'user@settle.com'}</p>
        </div>
        <button className="ml-auto flex items-center gap-2 px-5 py-2.5 bg-surface-container-high rounded-xl font-bold text-sm text-on-surface hover:bg-surface-container-highest transition">
          <span className="material-symbols-outlined text-[18px]">edit</span>
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left — settings sections */}
        <div className="lg:col-span-8 space-y-6">

          {/* Account */}
          <div className="bg-surface-container-low p-8 rounded-xl editorial-shadow">
            <p className="text-[0.75rem] font-bold uppercase tracking-[0.1em] text-on-surface-variant mb-6">Account</p>
            <div className="divide-y divide-surface-container">
              <SECTION_ROW label="Personal Information" value="Update your name, email, and photo" icon="person" />
              <SECTION_ROW label="Phone Number" value={user?.phone ?? '(555) 000-0000'} icon="phone" />
              <SECTION_ROW label="Password" value="Last changed 30 days ago" icon="lock" />
            </div>
          </div>

          {/* Location & Property */}
          <div className="bg-surface-container-low p-8 rounded-xl editorial-shadow">
            <p className="text-[0.75rem] font-bold uppercase tracking-[0.1em] text-on-surface-variant mb-6">Location & Property</p>
            <div className="divide-y divide-surface-container">
              <SECTION_ROW label="Current Address" value="123 Main St, Apt 4, Austin, TX 78701" icon="home" />
              <SECTION_ROW label="Target City" value={user?.city ?? 'Dallas, TX'} icon="location_on" />
              <SECTION_ROW label="Relocation Timeline" value="Within 3 months" icon="calendar_month" />
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-surface-container-low p-8 rounded-xl editorial-shadow">
            <p className="text-[0.75rem] font-bold uppercase tracking-[0.1em] text-on-surface-variant mb-6">Preferences</p>
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-[18px]">tune</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface">Apartment Preferences</p>
                  <p className="text-xs text-on-surface-variant font-medium">Budget, commute, safety, amenities</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('/preferences')}
                className="text-primary text-sm font-bold hover:underline flex items-center gap-1"
              >
                Update
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-surface-container-low p-8 rounded-xl editorial-shadow">
            <p className="text-[0.75rem] font-bold uppercase tracking-[0.1em] text-on-surface-variant mb-6">Notifications</p>
            {[
              { label: 'New Listing Alerts', desc: 'When listings matching your preferences are added', on: true },
              { label: 'Price Change Alerts', desc: 'When saved listing prices drop', on: true },
              { label: 'Tour Reminders', desc: '24 hours before a scheduled tour', on: true },
              { label: 'Marketing Emails', desc: 'Tips, trends, and neighborhood news', on: false },
            ].map(({ label, desc, on }) => (
              <div key={label} className="flex items-center justify-between py-4">
                <div>
                  <p className="text-sm font-bold text-on-surface">{label}</p>
                  <p className="text-xs text-on-surface-variant font-medium">{desc}</p>
                </div>
                <div className={`w-11 h-6 rounded-full transition-colors cursor-pointer ${on ? 'bg-primary' : 'bg-surface-container-highest'} relative`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${on ? 'left-6' : 'left-1'}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right sidebar — quick actions */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-surface-container-low p-8 rounded-xl editorial-shadow">
            <p className="text-[0.75rem] font-bold uppercase tracking-[0.1em] text-on-surface-variant mb-6">Quick Actions</p>
            <div className="space-y-2">
              {[
                { label: 'Help Center', icon: 'help', action: () => onNavigate('/faq') },
                { label: 'Contact Support', icon: 'support_agent', action: () => onNavigate('/contact') },
              ].map(({ label, icon, action }) => (
                <button
                  key={label}
                  onClick={action}
                  className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-surface-container transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-outline text-[20px]">{icon}</span>
                    <span className="text-sm font-semibold text-on-surface">{label}</span>
                  </div>
                  <span className="material-symbols-outlined text-outline text-[18px]">chevron_right</span>
                </button>
              ))}

              {/* Language */}
              <div className="flex items-center justify-between p-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-outline text-[20px]">language</span>
                  <span className="text-sm font-semibold text-on-surface">Language</span>
                </div>
                <select
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                  className="text-sm font-bold text-primary bg-transparent focus:outline-none"
                >
                  <option>English</option>
                  <option>Español</option>
                  <option>Français</option>
                </select>
              </div>

              {/* Log out */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-error/5 transition"
              >
                <span className="material-symbols-outlined text-error text-[20px]">logout</span>
                <span className="text-sm font-bold text-error">Log Out</span>
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-surface-container">
              <p className="text-center text-[0.65rem] font-medium text-outline">Settle v1.0.0 · Built for Zillow</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
