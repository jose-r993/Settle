/**
 * Design system: Cards use surface-container-low + editorial-shadow.
 * For elevated/listing cards that need to pop, pass elevated={true}
 * which switches to surface-container-lowest (white) per the Layering Principle.
 * Hover: -4px translate + deeper shadow per spec.
 * NO borders — separation through tonal background shift only.
 */
export default function Card({ children, className = '', hoverable = false, elevated = false, ...props }) {
  return (
    <div
      className={[
        elevated ? 'bg-surface-container-lowest' : 'bg-surface-container-low',
        'rounded-xl editorial-shadow',
        hoverable && 'hover:-translate-y-1 hover:shadow-[0_28px_56px_rgba(27,27,32,0.10)] transition-all duration-300 cursor-pointer',
        className,
      ].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </div>
  );
}
