import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/SupabaseAuthContext';

export default function AuthCallback({ onNavigate }) {
  const { user, loading } = useAuth();
  const [error, setError] = useState(null);
  const [redirecting, setRedirecting] = useState(false);
  const hasNavigated = useRef(false);

  useEffect(() => {
    const handleCallback = async () => {
      if (hasNavigated.current) return;

      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const urlError = hashParams.get('error');
      const errorDescription = hashParams.get('error_description');

      if (urlError) {
        setError(errorDescription || urlError);
        setTimeout(() => {
          hasNavigated.current = true;
          onNavigate('/login');
        }, 3000);
        return;
      }

      if (user && !loading) {
        setRedirecting(true);
        hasNavigated.current = true;

        const isNewUser = hashParams.get('type') === 'signup';

        setTimeout(() => {
          if (isNewUser) {
            onNavigate('/preferences');
          } else {
            onNavigate('/dashboard');
          }
        }, 500);
      }
    };

    if (!loading) {
      handleCallback();
    }

    const timeoutId = setTimeout(() => {
      if (!hasNavigated.current && !loading) {
        console.warn('Auth callback timeout - redirecting to dashboard');
        hasNavigated.current = true;
        onNavigate('/dashboard');
      }
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, [user, loading, onNavigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="bg-surface-container-lowest rounded-xl editorial-shadow p-8 max-w-md text-center">
          <span className="material-symbols-outlined text-6xl text-error mb-4 block">error</span>
          <h2 className="text-2xl font-bold text-on-surface mb-2">Authentication Error</h2>
          <p className="text-on-surface-variant mb-4">{error}</p>
          <p className="text-sm text-outline">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="bg-surface-container-lowest rounded-xl editorial-shadow p-8 max-w-md text-center">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-on-surface mb-2">
          {redirecting ? 'Redirecting...' : 'Completing Sign In'}
        </h2>
        <p className="text-on-surface-variant">
          {redirecting ? 'Taking you to your dashboard...' : 'Please wait while we set up your account...'}
        </p>
      </div>
    </div>
  );
}
