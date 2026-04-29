import { useState } from 'react';
import { useAuth } from '../context/SupabaseAuthContext';
import { getPasswordStrength } from '../utils/validators';

export default function Login({ onNavigate }) {
  const { login, signup, clearError, loginWithGoogle, useSupabase } = useAuth();
  const [tab, setTab] = useState('signup');
  const [form, setForm] = useState({ name: '', email: '', city: '', password: '' });
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ strength: 'none', score: 0 });
  const isLogin = tab === 'login';

  const set = field => e => {
    const value = e.target.value;
    setForm({ ...form, [field]: value });

    if (field === 'password' && !isLogin) {
      setPasswordStrength(getPasswordStrength(value));
    }

    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (isLogin) {
        const result = await login(form.email, form.password);
        if (result.success) {
          setTimeout(() => {
            onNavigate('/dashboard');
          }, 300);
        } else {
          setError(result.error);
          setIsSubmitting(false);
        }
      } else {
        if (!agreed) {
          setError('Please agree to the Terms of Service.');
          setIsSubmitting(false);
          return;
        }

        const result = await signup({
          name: form.name,
          email: form.email,
          password: form.password,
          targetCity: form.city,
        });

        if (result.success) {
          setTimeout(() => {
            onNavigate('/preferences');
          }, 300);
        } else {
          setError(result.error);
          setIsSubmitting(false);
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      if (!useSupabase) {
        const result = await login('demo@settle.com', 'password');
        if (result.success) {
          onNavigate('/dashboard');
        } else {
          setError(result.error);
        }
      } else {
        const result = await loginWithGoogle();
        if (!result.success) {
          setError(result.error || 'Failed to initiate Google sign-in');
        }
      }
    } catch (err) {
      console.error('Google OAuth error:', err);
      setError(err.message || 'An error occurred with Google sign-in');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* Shared input style — surface-container-lowest + shadow-sm + focus ring, NO border */
  const inputCls = 'w-full bg-surface-container-lowest shadow-sm rounded-lg px-4 py-3 text-on-surface placeholder:text-outline font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-shadow';

  return (
    <div className="min-h-screen flex bg-surface">

      {/* ── Left: form on surface-container-lowest (pops off surface) ── */}
      <div className="flex-1 flex items-center justify-center px-10 py-16 bg-surface-container-lowest">
        <div className="w-full max-w-sm">

          {/* Brand */}
          <span className="text-2xl font-black tracking-tighter text-primary block mb-10">Settle</span>

          {/* Display header */}
          <h1 className="text-[2.25rem] font-extrabold tracking-tight text-on-surface mb-2">Get started</h1>
          {/* Body Large */}
          <p className="text-on-surface-variant font-medium text-lg mb-8">
            {isLogin ? 'Welcome back.' : 'Create an account to start your relocation journey.'}
          </p>

          {/* Tabs — surface-container-high bg, no border */}
          <div className="flex bg-surface-container-high rounded-xl p-1 mb-8">
            {['login', 'signup'].map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(''); clearError(); setPasswordStrength({ strength: 'none', score: 0 }); }}
                className={[
                  'flex-1 py-2 text-sm font-bold rounded-lg transition-all',
                  tab === t
                    ? 'bg-surface-container-lowest text-on-surface editorial-shadow'
                    : 'text-on-surface-variant hover:text-on-surface',
                ].join(' ')}
              >
                {t === 'login' ? 'Login' : 'Sign Up'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {!isLogin && (
              <div className="flex flex-col gap-2">
                <label className="text-[0.75rem] font-bold uppercase tracking-[0.1em] text-on-surface-variant">Full Name</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">person</span>
                  <input className={`${inputCls} pl-10`} type="text" placeholder="John Doe" value={form.name} onChange={set('name')} />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-[0.75rem] font-bold uppercase tracking-[0.1em] text-on-surface-variant">Email</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">mail</span>
                <input className={`${inputCls} pl-10`} type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} />
              </div>
            </div>

            {!isLogin && (
              <div className="flex flex-col gap-2">
                <label className="text-[0.75rem] font-bold uppercase tracking-[0.1em] text-on-surface-variant">Target City</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">location_on</span>
                  <input className={`${inputCls} pl-10`} type="text" placeholder="Where are you moving?" value={form.city} onChange={set('city')} />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-[0.75rem] font-bold uppercase tracking-[0.1em] text-on-surface-variant">Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">lock</span>
                <input className={`${inputCls} pl-10`} type="password" placeholder="••••••••" value={form.password} onChange={set('password')} />
              </div>
              {!isLogin && form.password && (
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${passwordStrength.strength === 'strong' ? 'bg-green-500 w-full' :
                          passwordStrength.strength === 'medium' ? 'bg-yellow-500 w-2/3' :
                            'bg-red-500 w-1/3'
                          }`}
                      />
                    </div>
                    <span className={`text-[0.625rem] font-bold uppercase tracking-wider ${passwordStrength.strength === 'strong' ? 'text-green-600' :
                      passwordStrength.strength === 'medium' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                      {passwordStrength.strength}
                    </span>
                  </div>
                  <p className="text-[0.625rem] text-on-surface-variant">
                    Use 8+ characters with uppercase, lowercase, and numbers
                  </p>
                </div>
              )}
            </div>

            {!isLogin && (
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="mt-1 accent-primary" />
                <span className="text-sm font-medium text-on-surface-variant">
                  I agree to the{' '}
                  <a href="/terms" className="text-primary hover:underline font-semibold">Terms of Service</a>
                  {' '}and{' '}
                  <a href="/privacy" className="text-primary hover:underline font-semibold">Privacy Policy</a>
                </span>
              </label>
            )}

            {error && (
              <div className="bg-error/8 rounded-lg px-4 py-3">
                <p className="text-[0.75rem] font-bold text-error">{error}</p>
              </div>
            )}

            {/* Primary CTA — gradient, rounded-lg */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-br from-primary to-primary-container text-white py-4 rounded-lg font-bold hover:shadow-lg transition-all active:scale-95 mt-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {isSubmitting ? 'Please wait...' : (isLogin ? 'Login' : 'Create Account')}
            </button>

            {/* Divider — spacing only, no line */}
            <div className="flex items-center gap-3 py-1">
              <div className="flex-1 h-px bg-surface-container-highest" />
              <span className="text-[0.75rem] font-bold text-outline uppercase tracking-[0.1em]">or</span>
              <div className="flex-1 h-px bg-surface-container-highest" />
            </div>

            {/* Secondary button */}
            <button
              type="button"
              onClick={handleGoogle}
              disabled={isSubmitting}
              className="w-full bg-surface-container-highest text-on-surface py-3 rounded-lg font-semibold text-sm hover:bg-surface-dim transition active:scale-95 flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>
          </form>
        </div>
      </div>

      {/* ── Right: editorial panel on surface-container-low (tonal shift from left) ── */}
      <div className="hidden lg:flex flex-1 bg-surface flex-col justify-center px-16 relative overflow-hidden">
        {/* Decorative background icon at low opacity */}
        <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
          <span className="material-symbols-outlined text-[400px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>home_work</span>
        </div>

        <div className="relative max-w-md">
          {/* Badge — primary-container/10 fill */}
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-[0.75rem] font-bold uppercase tracking-[0.1em] mb-8">
            Find Your Perfect Neighborhood
          </span>

          {/* Display/Hero (3.75rem / extrabold) */}
          <h2 className="text-6xl font-extrabold text-on-surface leading-tight tracking-tight mb-6">
            Make Informed<br />Housing<br />Decisions
          </h2>

          {/* Body Large (1.25rem / medium) */}
          <p className="text-xl text-on-surface-variant font-medium leading-relaxed mb-14">
            Personalized rental recommendations, neighborhood safety insights, and AI-powered support — all in one platform.
          </p>

          {/* Feature list — elevated cards (surface-container-lowest) on surface-container-low */}
          <div className="flex flex-col gap-5">
            {[
              { icon: 'home_work', text: 'Personalized neighborhood recommendations based on your preferences' },
              { icon: 'verified_user', text: 'Safety insights and neighborhood comparisons for peace of mind' },
              { icon: 'auto_awesome', text: 'AI-powered recommendations to simplify your rental experience' },
            ].map(({ icon, text }) => (
              <div key={icon} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-surface-container-lowest editorial-shadow flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-[20px]">{icon}</span>
                </div>
                <p className="text-on-surface-variant font-medium leading-relaxed">{text}</p>
              </div>
            ))}
          </div>

          {/* Zillow — spacing gap, no line */}
          <div className="mt-16 pt-8 flex items-center gap-3">
            <span className="text-[0.75rem] font-bold uppercase tracking-[0.1em] text-outline">Built for</span>
            <img src="/ZillowLogo.png" alt="Zillow" className="h-7 w-7 rounded-full editorial-shadow" />
            <span className="text-sm font-bold text-on-surface-variant">Zillow</span>
          </div>
        </div>
      </div>
    </div>
  );
}
