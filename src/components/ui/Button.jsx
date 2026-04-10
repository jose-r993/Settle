/**
 * Design system buttons:
 * Primary   — gradient primary→primary-container, rounded-lg (4px), no border
 * Secondary — surface-container-highest bg, semi-bold, no border
 * Tertiary  — text-only, primary color, label weight
 */
export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center font-bold transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:   'bg-gradient-to-br from-primary to-primary-container text-white px-6 py-3 rounded-lg hover:opacity-90 hover:shadow-lg',
    secondary: 'bg-surface-container-highest text-on-surface font-semibold px-6 py-3 rounded-lg hover:bg-surface-dim',
    tertiary:  'text-primary text-[0.75rem] font-bold uppercase tracking-[0.1em] hover:opacity-70 px-0 py-0',
    danger:    'bg-error text-on-error px-6 py-3 rounded-lg hover:opacity-90',
    ghost:     'text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded-full p-2',
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
