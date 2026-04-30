import { useState, useEffect } from 'react';
import { AuthProvider } from './context/SupabaseAuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { PreferencesProvider } from './context/PreferencesContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Preferences from './pages/Preferences';
import Results from './pages/Results';
import Search from './pages/Search';
import ListingDetail from './pages/ListingDetail';
import Favorites from './pages/Favorites';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';
import Booking from './pages/Booking';
import Maintenance from './pages/Maintenance';
import Compare from './pages/Compare';
import Admin from './pages/Admin';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import AuthCallback from './pages/AuthCallback';
import DebugAuth from './pages/DebugAuth';

const PUBLIC_ROUTES = ['/', '/login', '/about', '/contact', '/faq', '/privacy', '/terms', '/auth/callback', '/debug-auth'];

function Router() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handler = () => setPath(window.location.pathname);
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);

  const navigate = (to) => {
    window.history.pushState({}, '', to);
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.scrollTo(0, 0);
  };

  // Parse dynamic segments: /listing/:id and /booking/:id
  const listingMatch = path.match(/^\/listing\/(.+)$/);
  const bookingMatch = path.match(/^\/booking\/(.+)$/);

  const isPublic = PUBLIC_ROUTES.includes(path);

  const renderPage = () => {
    if (listingMatch) return <ListingDetail id={listingMatch[1]} onNavigate={navigate} />;
    if (bookingMatch) return <Booking id={bookingMatch[1]} onNavigate={navigate} />;

    switch (path) {
      case '/':
      case '/login': return <Login onNavigate={navigate} />;
      case '/auth/callback': return <AuthCallback onNavigate={navigate} />;
      case '/debug-auth': return <DebugAuth onNavigate={navigate} />;
      case '/dashboard': return <Dashboard onNavigate={navigate} />;
      case '/preferences': return <Preferences onNavigate={navigate} />;
      case '/results': return <Results onNavigate={navigate} />;
      case '/search': return <Search onNavigate={navigate} />;
      case '/favorites': return <Favorites onNavigate={navigate} />;
      case '/settings': return <Settings onNavigate={navigate} />;
      case '/notifications': return <Notifications onNavigate={navigate} />;
      case '/maintenance': return <Maintenance onNavigate={navigate} />;
      case '/compare': return <Compare onNavigate={navigate} />;
      case '/admin': return <Admin onNavigate={navigate} />;
      case '/about': return <About onNavigate={navigate} />;
      case '/contact': return <Contact onNavigate={navigate} />;
      case '/faq': return <FAQ onNavigate={navigate} />;
      case '/privacy': return <Privacy onNavigate={navigate} />;
      case '/terms': return <Terms onNavigate={navigate} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-on-surface-variant">
            <span className="material-symbols-outlined text-[64px] text-outline mb-4">error</span>
            <p className="text-2xl font-bold text-on-surface mb-2">Page not found</p>
            <code className="text-sm bg-surface-container px-3 py-1 rounded-lg mb-6 font-medium">{path}</code>
            <button onClick={() => navigate('/dashboard')} className="text-primary font-bold hover:underline flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Back to Dashboard
            </button>
          </div>
        );
    }
  };

  if (isPublic) {
    return (
      <div className="min-h-screen flex flex-col bg-surface text-on-surface selection:bg-primary-fixed">
        {path !== '/' && path !== '/login' && <Navbar onNavigate={navigate} />}
        <main className="flex-1">{renderPage()}</main>
        {path !== '/' && path !== '/login' && <Footer />}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface selection:bg-primary-fixed">
      <Navbar onNavigate={navigate} />
      <main className="flex-1">{renderPage()}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <PreferencesProvider>
        <FavoritesProvider>
          <Router />
        </FavoritesProvider>
      </PreferencesProvider>
    </AuthProvider>
  );
}
