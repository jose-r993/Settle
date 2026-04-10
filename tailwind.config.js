/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // ── Primary scale (#004AC6) ──
        'primary':              '#004AC6',
        'primary-container':    '#2563EB',
        'primary-fixed':        '#DBEAFE',
        'primary-fixed-dim':    '#93C5FD',
        'inverse-primary':      '#93C5FD',
        'on-primary':           '#FFFFFF',
        'on-primary-container': '#EFF6FF',
        'on-primary-fixed':     '#001C5C',

        // ── Secondary scale (#6675A7) ──
        'secondary':              '#6675A7',
        'secondary-container':    '#A8B4D8',
        'secondary-fixed':        '#E4E7F3',
        'secondary-fixed-dim':    '#C5CAE0',
        'on-secondary':           '#FFFFFF',
        'on-secondary-container': '#1A2052',
        'on-secondary-fixed':     '#1A2052',

        // ── Tertiary scale (#9C2E02 — rust) ──
        'tertiary':              '#9C2E02',
        'tertiary-container':    '#C44A10',
        'tertiary-fixed':        '#FFD5C0',
        'tertiary-fixed-dim':    '#F4A07A',
        'on-tertiary':           '#FFFFFF',
        'on-tertiary-container': '#FFF0EA',
        'on-tertiary-fixed':     '#380D00',

        // ── Neutral scale (#1B1B20) ──
        'on-surface':         '#1B1B20',
        'on-surface-variant': '#6675A7',   // secondary as variant tone
        'on-background':      '#1B1B20',
        'inverse-surface':    '#2E2E35',
        'inverse-on-surface': '#F4F4F7',
        'outline':            '#9BA3C0',
        'outline-variant':    '#D0D3E6',

        // ── Surface scale (cool neutral, light gray) ──
        'surface':                  '#F5F6FA',
        'surface-bright':           '#FFFFFF',
        'surface-dim':              '#C5C7D4',
        'surface-container-lowest': '#FFFFFF',
        'surface-container-low':    '#EEEEF4',
        'surface-container':        '#E7E8EF',
        'surface-container-high':   '#E0E1EA',
        'surface-container-highest':'#D9DAE4',
        'surface-variant':          '#E4E7F3',
        'surface-tint':             '#004AC6',

        // ── Error ──
        'error':              '#BA1A1A',
        'error-container':    '#FFDAD6',
        'on-error':           '#FFFFFF',
        'on-error-container': '#93000A',

        // ── Background ──
        'background': '#F5F6FA',
      },
      borderRadius: {
        DEFAULT: '0.125rem',
        lg:      '0.25rem',
        xl:      '0.5rem',
        '2xl':   '0.75rem',
        full:    '9999px',
      },
      fontFamily: {
        sans:     ['Manrope', 'system-ui', 'sans-serif'],
        headline: ['Manrope'],
        body:     ['Manrope'],
        label:    ['Manrope'],
      },
      boxShadow: {
        editorial:        '0 20px 40px rgba(27, 27, 32, 0.04)',
        'editorial-hover':'0 28px 56px rgba(27, 27, 32, 0.10)',
        nav:              '0 4px 24px rgba(27, 27, 32, 0.06)',
        sm:               '0 1px 4px rgba(27, 27, 32, 0.06)',
      },
    },
  },
  plugins: [],
}
