import { useState } from 'react';
import { LISTINGS } from '../data/listings';

const FILTERS = ['Total Monthly Cost', 'Bedrooms', 'Pet Policy', 'Commute Distance'];
const SORTS   = ['Compatibility', 'Price: Low to High', 'Price: High to Low', 'Safety Rating', 'Newest'];

const MAP_PINS = [
  { top: '22%', left: '30%', safety: 'high',   label: 'The McKenzie',  price: '$2,100' },
  { top: '45%', left: '58%', safety: 'high',   label: 'Katy Trail',    price: '$1,850' },
  { top: '60%', left: '25%', safety: 'medium', label: 'Loft 404',      price: '$1,450' },
  { top: '35%', left: '70%', safety: 'medium', label: 'Alton Oak',     price: '$2,275' },
  { top: '72%', left: '50%', safety: 'lower',  label: 'Veritas',       price: '$1,700' },
  { top: '28%', left: '82%', safety: 'high',   label: 'Madera Bway',   price: '$2,400' },
];

const safetyColor = {
  high:   'text-green-600  bg-green-50',
  medium: 'text-yellow-600 bg-yellow-50',
  lower:  'text-orange-600 bg-orange-50',
};
const safetyDot = {
  high: 'bg-green-500', medium: 'bg-yellow-500', lower: 'bg-orange-500',
};

export default function Search({ onNavigate }) {
  const [query,     setQuery]     = useState('');
  const [activeSort,setActiveSort]= useState('Compatibility');
  const [safetyOn,  setSafetyOn]  = useState(true);
  const [favorites, setFavorites] = useState({});
  const toggleFav = (id) => setFavorites(f => ({ ...f, [id]: !f[id] }));

  const listings = LISTINGS.slice(0, 5);

  return (
    <div className="pt-28 pb-24 px-8 max-w-screen-2xl mx-auto w-full">

      {/* Search + filter bar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1 max-w-lg">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search neighborhoods, zip codes, keywords…"
            className="w-full bg-surface-container-lowest shadow-sm rounded-xl pl-11 pr-4 py-3.5 text-on-surface placeholder:text-outline font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-shadow"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map(f => (
            <button key={f} className="flex items-center gap-1.5 px-4 py-2.5 bg-surface-container-low rounded-xl text-sm font-semibold text-on-surface hover:bg-surface-container transition editorial-shadow">
              {f}
              <span className="material-symbols-outlined text-[16px] text-outline">expand_more</span>
            </button>
          ))}
        </div>
      </div>

      {/* Count + sort bar */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-on-surface-variant font-medium">
          <span className="font-black text-on-surface">142</span> rentals in Dallas, TX
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-on-surface-variant font-medium">Sort by</span>
          <select
            value={activeSort}
            onChange={e => setActiveSort(e.target.value)}
            className="bg-surface-container-low rounded-lg px-3 py-2 text-sm font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 editorial-shadow"
          >
            {SORTS.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Main grid: map left, results right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Map panel */}
        <div className="lg:col-span-7 sticky top-28">
          <div className="bg-surface-container rounded-2xl overflow-hidden editorial-shadow" style={{ height: '680px' }}>
            <div className="relative w-full h-full bg-gradient-to-br from-surface-container-high to-surface-container-highest flex items-center justify-center">

              {/* Mock map texture */}
              <div className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 39px, #D0D3E6 39px, #D0D3E6 40px),
                                    repeating-linear-gradient(90deg, transparent, transparent 39px, #D0D3E6 39px, #D0D3E6 40px)`,
                }}
              />

              {/* Road-like lines */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/3 left-0 right-0 h-1 bg-outline-variant rounded" />
                <div className="absolute top-2/3 left-0 right-0 h-0.5 bg-outline-variant rounded" />
                <div className="absolute left-1/3 top-0 bottom-0 w-1 bg-outline-variant rounded" />
                <div className="absolute left-2/3 top-0 bottom-0 w-0.5 bg-outline-variant rounded" />
              </div>

              {/* Location pins */}
              {MAP_PINS.map((pin, i) => (
                <div
                  key={i}
                  className="absolute group cursor-pointer"
                  style={{ top: pin.top, left: pin.left, transform: 'translate(-50%, -100%)' }}
                >
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[0.7rem] font-bold shadow-lg editorial-shadow ${safetyColor[pin.safety]}`}>
                    <span className={`w-2 h-2 rounded-full shrink-0 ${safetyDot[pin.safety]}`} />
                    {pin.price}
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-10 left-1/2 -translate-x-1/2 bg-surface-container-lowest shadow-lg rounded-lg px-3 py-1.5 whitespace-nowrap text-[0.7rem] font-bold text-on-surface editorial-shadow">
                    {pin.label}
                  </div>
                </div>
              ))}

              {/* Map center label */}
              <div className="text-center opacity-40 pointer-events-none select-none">
                <span className="material-symbols-outlined text-[48px] text-outline" style={{ fontVariationSettings: "'FILL' 1" }}>map</span>
                <p className="text-sm font-bold text-outline mt-2">Dallas, TX</p>
              </div>

              {/* Controls */}
              <div className="absolute top-4 left-4 flex gap-2">
                <button className="bg-surface-container-lowest shadow-sm rounded-lg px-3 py-2 text-[0.7rem] font-bold text-on-surface editorial-shadow">Map</button>
                <button className="bg-surface-container-high rounded-lg px-3 py-2 text-[0.7rem] font-bold text-on-surface-variant">Satellite</button>
              </div>

              {/* Safety legend */}
              <div className="absolute bottom-4 left-4 flex gap-2">
                {safetyOn && (
                  <>
                    <div className="flex items-center gap-1.5 bg-surface-container-lowest px-3 py-1.5 rounded-full text-[0.65rem] font-bold text-green-600 editorial-shadow">
                      <div className="w-2 h-2 rounded-full bg-green-500" />High Safety
                    </div>
                    <div className="flex items-center gap-1.5 bg-surface-container-lowest px-3 py-1.5 rounded-full text-[0.65rem] font-bold text-yellow-600 editorial-shadow">
                      <div className="w-2 h-2 rounded-full bg-yellow-500" />Moderate
                    </div>
                    <div className="flex items-center gap-1.5 bg-surface-container-lowest px-3 py-1.5 rounded-full text-[0.65rem] font-bold text-orange-600 editorial-shadow">
                      <div className="w-2 h-2 rounded-full bg-orange-500" />Lower
                    </div>
                  </>
                )}
                <button
                  onClick={() => setSafetyOn(s => !s)}
                  className="flex items-center gap-1 bg-surface-container-lowest px-3 py-1.5 rounded-full text-[0.65rem] font-bold text-on-surface editorial-shadow"
                >
                  <span className="material-symbols-outlined text-[14px]">{safetyOn ? 'visibility_off' : 'visibility'}</span>
                  Safety
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results panel */}
        <div className="lg:col-span-5 space-y-4">
          {listings.map(listing => (
            <div
              key={listing.id}
              onClick={() => onNavigate(`/listing/${listing.id}`)}
              className="group bg-surface-container-lowest rounded-xl overflow-hidden editorial-shadow hover:shadow-[0_28px_56px_rgba(27,27,32,0.10)] transition-all duration-300 cursor-pointer flex"
            >
              <div className="w-32 shrink-0 relative overflow-hidden">
                <img src={listing.image} alt={listing.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-2 left-2 bg-primary text-white text-[0.6rem] font-black uppercase px-2 py-0.5 rounded-full">
                  {listing.match}%
                </div>
              </div>
              <div className="flex-1 p-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-on-surface text-sm leading-tight">{listing.name}</h3>
                  <button
                    onClick={e => { e.stopPropagation(); toggleFav(listing.id); }}
                    className="ml-2 shrink-0"
                  >
                    <span
                      className="material-symbols-outlined text-primary-container text-[18px]"
                      style={{ fontVariationSettings: favorites[listing.id] ? "'FILL' 1" : "'FILL' 0" }}
                    >favorite</span>
                  </button>
                </div>
                <p className="text-on-surface-variant text-xs font-medium mb-1">{listing.neighborhood}</p>
                <p className="text-lg font-bold text-on-surface mb-2">{listing.price}<span className="text-xs font-medium text-on-surface-variant">/mo</span></p>
                <div className="flex gap-1 text-[0.6rem] font-bold uppercase tracking-[0.1em] text-outline mb-3">
                  <span>{listing.beds}bd</span><span>·</span>
                  <span>{listing.baths}ba</span><span>·</span>
                  <span>{listing.sqft}sqft</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-green-600 text-[14px]">verified_user</span>
                    <span className="text-[0.65rem] font-bold text-green-700">{listing.safetyScore}/100 Safety</span>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); onNavigate(`/listing/${listing.id}`); }}
                    className="text-[0.65rem] font-bold text-primary hover:underline"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={() => onNavigate('/results')}
            className="w-full py-4 bg-surface-container-low rounded-xl font-bold text-on-surface hover:bg-surface-container transition editorial-shadow text-sm"
          >
            Load More Results
          </button>
        </div>
      </div>
    </div>
  );
}
