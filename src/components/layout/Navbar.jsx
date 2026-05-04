import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/SupabaseAuthContext';

export default function Navbar({ showSearch = false, onNavigate }) {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const nav = (path) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
    setIsDropdownOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    setIsDropdownOpen(false);
    nav('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface-container-lowest/80 backdrop-blur-xl shadow-nav">
      <div className="flex justify-between items-center w-full px-8 py-3 max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-10">
          <button onClick={() => nav(user ? '/dashboard' : '/')} className="flex items-center gap-2 text-xl font-black tracking-tighter text-primary">
            <img src="/ZillowLogo.png" alt="Zillow" className="h-6 w-6 rounded-full" />
            Settle
          </button>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <div className="hidden md:flex gap-6">
              <button onClick={() => nav('/preferences')} className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors">Preferences</button>
              <button onClick={() => nav('/favorites')} className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors">Saved</button>
              <button onClick={() => nav('/faq')} className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors">Help</button>
            </div>
          )}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-surface-container-high rounded-xl text-on-surface text-sm font-semibold hover:bg-surface-container-highest transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-bold text-xs">{initials}</span>
                </div>
                Account
                <span className={`material-symbols-outlined text-[18px] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-surface-container-lowest rounded-xl shadow-lg editorial-shadow overflow-hidden">
                  <div className="p-4 border-b border-surface-container">
                    <p className="text-sm font-semibold text-on-surface">{user.name}</p>
                    <p className="text-xs text-on-surface-variant truncate">{user.email}</p>
                  </div>

                  <div className="py-2">
                    <button
                      onClick={() => nav('/favorites')}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-container transition text-left"
                    >
                      <span className="material-symbols-outlined text-on-surface-variant text-[20px]">favorite</span>
                      <span className="text-sm font-medium text-on-surface">Saved</span>
                    </button>

                    <button
                      onClick={() => nav('/maintenance')}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-container transition text-left"
                    >
                      <span className="material-symbols-outlined text-on-surface-variant text-[20px]">build</span>
                      <span className="text-sm font-medium text-on-surface">Maintenance</span>
                    </button>

                    <button
                      onClick={() => nav('/settings')}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-container transition text-left"
                    >
                      <span className="material-symbols-outlined text-on-surface-variant text-[20px]">settings</span>
                      <span className="text-sm font-medium text-on-surface">Settings</span>
                    </button>

                    <button
                      onClick={() => nav('/faq')}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-container transition text-left"
                    >
                      <span className="material-symbols-outlined text-on-surface-variant text-[20px]">help</span>
                      <span className="text-sm font-medium text-on-surface">Help</span>
                    </button>
                  </div>

                  <div className="border-t border-surface-container py-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-error/5 transition text-left"
                    >
                      <span className="material-symbols-outlined text-error text-[20px]">logout</span>
                      <span className="text-sm font-semibold text-error">Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => nav('/login')}
              className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-container transition-colors"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
