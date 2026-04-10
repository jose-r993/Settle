const NEIGHBORHOODS = [
  {
    name: 'Downtown Dallas',
    badge: 'Top Pick',
    avgRent: '$2,200',
    safetyScore: 91,
    walkability: 88,
    commuteAvg: '18 min',
    amenities: ['Klyde Warren Park', 'Whole Foods', 'AT&T Performing Arts Center'],
    highlight: true,
  },
  {
    name: 'Uptown',
    badge: null,
    avgRent: '$1,980',
    safetyScore: 87,
    walkability: 82,
    commuteAvg: '22 min',
    amenities: ['Katy Trail', 'Trader Joe\'s', 'McKinney Avenue'],
    highlight: false,
  },
  {
    name: 'Deep Ellum',
    badge: null,
    avgRent: '$1,600',
    safetyScore: 74,
    walkability: 76,
    commuteAvg: '26 min',
    amenities: ['Deep Ellum Music Venues', 'Belo Garden', 'Local Restaurants'],
    highlight: false,
  },
];

function ScoreBar({ score, color = 'bg-primary' }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-surface-container-highest rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-sm font-black text-on-surface w-8 text-right">{score}</span>
    </div>
  );
}

export default function Compare({ onNavigate }) {
  return (
    <div className="pt-32 pb-24 px-8 max-w-screen-2xl mx-auto w-full">

      <header className="mb-12">
        <h1 className="text-6xl font-extrabold tracking-tight text-on-surface mb-4">Compare Neighborhoods</h1>
        <p className="text-xl text-on-surface-variant font-medium max-w-2xl leading-relaxed">
          See how Dallas neighborhoods stack up side by side across safety, rent, walkability, and commute.
        </p>
      </header>

      {/* Comparison grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {NEIGHBORHOODS.map(n => (
          <div
            key={n.name}
            className={[
              'rounded-xl p-8 relative editorial-shadow flex flex-col',
              n.highlight ? 'bg-primary/5 ring-2 ring-primary/20' : 'bg-surface-container-low',
            ].join(' ')}
          >
            {n.badge && (
              <span className="absolute top-4 right-4 inline-flex items-center px-3 py-1 rounded-full bg-primary text-white text-[0.65rem] font-black uppercase tracking-[0.1em]">
                {n.badge}
              </span>
            )}

            <h2 className={`text-2xl font-extrabold mb-1 ${n.highlight ? 'text-primary' : 'text-on-surface'}`}>{n.name}</h2>
            <p className="text-3xl font-black text-on-surface mb-8">{n.avgRent}<span className="text-base font-medium text-on-surface-variant">/mo avg</span></p>

            <div className="space-y-6 flex-1">
              <div>
                <p className="text-[0.75rem] font-bold uppercase tracking-[0.1em] text-on-surface-variant mb-2">Safety Score</p>
                <ScoreBar score={n.safetyScore} color={n.highlight ? 'bg-primary' : 'bg-secondary'} />
              </div>
              <div>
                <p className="text-[0.75rem] font-bold uppercase tracking-[0.1em] text-on-surface-variant mb-2">Walkability</p>
                <ScoreBar score={n.walkability} color={n.highlight ? 'bg-primary' : 'bg-secondary'} />
              </div>
              <div>
                <p className="text-[0.75rem] font-bold uppercase tracking-[0.1em] text-on-surface-variant mb-3">Avg Commute</p>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-on-surface-variant text-[20px]">directions_car</span>
                  <span className="text-xl font-bold text-on-surface">{n.commuteAvg}</span>
                </div>
              </div>
              <div>
                <p className="text-[0.75rem] font-bold uppercase tracking-[0.1em] text-on-surface-variant mb-3">Top Amenities</p>
                <div className="space-y-2">
                  {n.amenities.map(a => (
                    <div key={a} className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[16px]">check_circle</span>
                      <span className="text-sm text-on-surface-variant font-medium">{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('/search')}
              className={[
                'mt-8 w-full py-3 rounded-xl font-bold text-sm transition-all active:scale-95',
                n.highlight
                  ? 'bg-gradient-to-br from-primary to-primary-container text-white hover:shadow-lg'
                  : 'bg-surface-container-highest text-on-surface hover:bg-surface-dim',
              ].join(' ')}
            >
              Browse {n.name.split(' ')[0]} Listings
            </button>
          </div>
        ))}
      </div>

      {/* Add neighborhood CTA (disabled) */}
      <div className="flex justify-center mb-16">
        <button
          disabled
          className="flex items-center gap-2 px-8 py-4 bg-surface-container-low text-outline rounded-xl font-bold opacity-50 cursor-not-allowed editorial-shadow"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Add Neighborhood
        </button>
      </div>

      {/* Summary stats strip */}
      <div className="bg-primary/5 rounded-xl p-10 editorial-shadow">
        <div className="flex flex-wrap gap-10 justify-between items-center">
          {[
            { label: 'Neighborhoods Analyzed', value: '12', icon: 'location_city' },
            { label: 'Avg Dallas Safety Score', value: '78/100', icon: 'verified_user' },
            { label: 'Median Rent (Dallas)',   value: '$1,890', icon: 'payments' },
            { label: 'Data Sources',           value: 'Zillow + Crimeometer', icon: 'database' },
          ].map(({ label, value, icon }) => (
            <div key={label} className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary text-[22px]">{icon}</span>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-on-surface">{value}</p>
                <p className="text-[0.75rem] font-bold uppercase tracking-[0.1em] text-on-surface-variant">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
