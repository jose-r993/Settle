const METRICS = [
  { label: 'Active Listings', value: '2,847', delta: '+12%',  icon: 'home_work',    color: 'text-primary   bg-primary/10' },
  { label: 'Bookings Today',  value: '143',   delta: '+8%',   icon: 'calendar_month',color: 'text-green-700 bg-green-50' },
  { label: 'Avg List Price',  value: '$485K', delta: '+3.2%', icon: 'payments',      color: 'text-yellow-700 bg-yellow-50' },
  { label: 'Agents Online',   value: '38',    delta: '-2',    icon: 'support_agent', color: 'text-tertiary  bg-tertiary/10' },
];

const LISTING_ACTIVITY = [
  { week: 'Feb W1', count: 48 }, { week: 'Feb W2', count: 62 },
  { week: 'Feb W3', count: 55 }, { week: 'Feb W4', count: 71 },
  { week: 'Mar W1', count: 83 }, { week: 'Mar W2', count: 95 },
  { week: 'Mar W3', count: 78 }, { week: 'Mar W4', count: 110 },
];
const MAX_COUNT = Math.max(...LISTING_ACTIVITY.map(d => d.count));

const LISTING_MIX = [
  { label: 'Studio',     pct: 18, color: 'bg-primary' },
  { label: '1 Bedroom',  pct: 35, color: 'bg-secondary' },
  { label: '2 Bedrooms', pct: 32, color: 'bg-tertiary' },
  { label: '3+ Bedrooms',pct: 15, color: 'bg-outline' },
];

const RECENT_LISTINGS = [
  { name: 'The McKenzie Luxury Highrise', agent: 'Jordan Lee',  price: '$2,100/mo', status: 'Active' },
  { name: 'Loft 404 Apartments',          agent: 'Mia Torres',  price: '$1,450/mo', status: 'Pending' },
  { name: 'Madera Broadway',              agent: 'Alex Chen',   price: '$2,400/mo', status: 'Active' },
  { name: 'The Lyric Apartments',         agent: 'Sam Rivera',  price: '$1,950/mo', status: 'Pending' },
];

const STATUS_STYLE = {
  Active:  'bg-green-50 text-green-700',
  Pending: 'bg-yellow-50 text-yellow-700',
};

export default function Admin({ onNavigate }) {
  return (
    <div className="pt-32 pb-24 px-8 max-w-screen-2xl mx-auto w-full">

      {/* Header + actions */}
      <header className="flex flex-wrap gap-4 justify-between items-end mb-12">
        <div>
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-error/10 text-error text-[0.75rem] font-bold uppercase tracking-[0.1em] mb-4">
            Admin View
          </span>
          <h1 className="text-6xl font-extrabold tracking-tight text-on-surface mb-2">Dashboard Overview</h1>
          <p className="text-xl text-on-surface-variant font-medium">Settle platform metrics · Last updated April 9, 2026</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
            <input
              placeholder="Search listings, agents…"
              className="bg-surface-container-lowest shadow-sm rounded-lg pl-10 pr-4 py-2.5 text-on-surface placeholder:text-outline font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-shadow text-sm w-56"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-surface-container-low rounded-xl text-sm font-semibold text-on-surface hover:bg-surface-container editorial-shadow transition">
            <span className="material-symbols-outlined text-[18px]">file_download</span>
            Export
          </button>
          <button className="flex items-center gap-2 bg-gradient-to-br from-primary to-primary-container text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:shadow-lg transition-all active:scale-95">
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add Listing
          </button>
        </div>
      </header>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {METRICS.map(({ label, value, delta, icon, color }) => (
          <div key={label} className="bg-surface-container-lowest p-8 rounded-xl editorial-shadow">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${color}`}>
              <span className="material-symbols-outlined text-[22px]">{icon}</span>
            </div>
            <p className="text-[0.75rem] font-bold uppercase tracking-[0.1em] text-on-surface-variant mb-1">{label}</p>
            <div className="flex items-end gap-3">
              <p className="text-3xl font-extrabold text-on-surface">{value}</p>
              <span className={`text-sm font-bold mb-1 ${delta.startsWith('+') ? 'text-green-600' : 'text-error'}`}>{delta}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">

        {/* Bar chart — Listing Activity */}
        <div className="lg:col-span-8 bg-surface-container-low p-8 rounded-xl editorial-shadow">
          <div className="flex justify-between items-center mb-8">
            <div>
              <p className="text-[0.75rem] font-bold uppercase tracking-[0.1em] text-on-surface-variant mb-1">Listing Activity</p>
              <h2 className="text-xl font-bold text-on-surface">Last 8 Weeks</h2>
            </div>
            <button className="text-primary text-sm font-bold hover:underline">View all</button>
          </div>
          <div className="flex items-end gap-3 h-48">
            {LISTING_ACTIVITY.map((d, i) => (
              <div key={d.week} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-[0.6rem] font-black text-on-surface">{d.count}</span>
                <div
                  className={`w-full rounded-t-lg transition-all ${i === LISTING_ACTIVITY.length - 1 ? 'bg-primary' : 'bg-surface-container-highest'}`}
                  style={{ height: `${(d.count / MAX_COUNT) * 160}px` }}
                />
                <span className="text-[0.55rem] font-medium text-outline text-center leading-tight">{d.week}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Donut — Listing Mix */}
        <div className="lg:col-span-4 bg-surface-container-low p-8 rounded-xl editorial-shadow">
          <p className="text-[0.75rem] font-bold uppercase tracking-[0.1em] text-on-surface-variant mb-1">Listing Type Mix</p>
          <h2 className="text-xl font-bold text-on-surface mb-8">By Unit Type</h2>

          {/* Simple CSS donut approximation */}
          <div className="flex items-center justify-center mb-8">
            <div className="relative w-32 h-32">
              <svg viewBox="0 0 36 36" className="w-32 h-32 -rotate-90">
                {(() => {
                  let offset = 0;
                  return LISTING_MIX.map(({ pct, color }, i) => {
                    const dashArray = `${pct} ${100 - pct}`;
                    const el = (
                      <circle
                        key={i}
                        cx="18" cy="18" r="15.9155"
                        fill="none"
                        strokeWidth="3.5"
                        className={color.replace('bg-', 'stroke-')}
                        strokeDasharray={dashArray}
                        strokeDashoffset={-offset}
                      />
                    );
                    offset += pct;
                    return el;
                  });
                })()}
              </svg>
            </div>
          </div>

          <div className="space-y-3">
            {LISTING_MIX.map(({ label, pct, color }) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${color}`} />
                  <span className="text-sm font-medium text-on-surface-variant">{label}</span>
                </div>
                <span className="text-sm font-bold text-on-surface">{pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Listings table */}
      <div className="bg-surface-container-low rounded-xl editorial-shadow overflow-hidden">
        <div className="flex justify-between items-center p-8">
          <div>
            <p className="text-[0.75rem] font-bold uppercase tracking-[0.1em] text-on-surface-variant mb-1">Recent Listings</p>
            <h2 className="text-xl font-bold text-on-surface">Latest Submissions</h2>
          </div>
          <button className="text-primary text-sm font-bold hover:underline">View all listings</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-container">
                {['Property', 'Agent', 'Price', 'Status', 'Actions'].map(col => (
                  <th key={col} className="text-left px-8 py-4 text-[0.7rem] font-bold uppercase tracking-[0.1em] text-on-surface-variant">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RECENT_LISTINGS.map((row, i) => (
                <tr key={row.name} className={`${i > 0 ? 'border-t border-surface-container' : ''} hover:bg-surface-container transition`}>
                  <td className="px-8 py-5 font-bold text-on-surface text-sm">{row.name}</td>
                  <td className="px-8 py-5 text-on-surface-variant font-medium text-sm">{row.agent}</td>
                  <td className="px-8 py-5 font-bold text-on-surface text-sm">{row.price}</td>
                  <td className="px-8 py-5">
                    <span className={`text-[0.7rem] font-bold px-3 py-1.5 rounded-full ${STATUS_STYLE[row.status]}`}>{row.status}</span>
                  </td>
                  <td className="px-8 py-5">
                    <button className="text-primary text-sm font-bold hover:underline">View →</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
