/**
 * Design system: primary-container/10% fill + high-contrast text.
 * Label typography: 0.75rem bold, 0.1em tracking.
 * NO borders.
 */
export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-primary-container/10 text-primary-container',
    green:   'bg-green-600/10 text-green-700',
    yellow:  'bg-yellow-500/10 text-yellow-700',
    red:     'bg-error/10 text-error',
    match:   'bg-gradient-to-br from-primary to-primary-container text-white',
  };

  return (
    <span className={[
      'inline-flex items-center px-3 py-1 rounded-full',
      'text-[0.75rem] font-bold uppercase tracking-[0.1em]',
      variants[variant],
      className,
    ].join(' ')}>
      {children}
    </span>
  );
}
