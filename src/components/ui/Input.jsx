/**
 * Design system: surface-container-lowest bg + shadow-sm.
 * Focus signals via ring — NO border change.
 */
export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-[0.75rem] font-bold uppercase tracking-[0.1em] text-on-surface-variant">
          {label}
        </label>
      )}
      <input
        className={[
          'w-full bg-surface-container-lowest shadow-sm rounded-lg px-4 py-3',
          'text-on-surface placeholder:text-outline font-medium',
          'focus:outline-none focus:ring-2 focus:ring-primary/20 transition-shadow',
          error && 'ring-2 ring-error/40',
          className,
        ].filter(Boolean).join(' ')}
        {...props}
      />
      {error && <span className="text-[0.75rem] font-bold text-error">{error}</span>}
    </div>
  );
}
