import { useAuth } from '../../context/AuthContext';

export default function Navbar({ showSearch = false, onNavigate }) {
  const { user, logout } = useAuth();
  const nav = (path) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

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
              <button onClick={() => nav('/favorites')} className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors">Saved</button>
              <button onClick={() => nav('/faq')}       className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors">Help</button>
            </div>
          )}
          {user ? (
            <button
              onClick={() => nav('/settings')}
              className="flex items-center gap-2 px-4 py-2 bg-surface-container-high rounded-xl text-on-surface text-sm font-semibold hover:bg-surface-container-highest transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">account_circle</span>
              Account
            </button>
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
