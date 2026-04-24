import { LISTINGS } from '../data/listings';
import { useFavorites } from '../context/FavoritesContext';
import { usePreferences } from '../context/PreferencesContext';

const featured = LISTINGS[0];
const grid     = LISTINGS.slice(1, 7);

const WHY = [
  'Close to your workplace — all results within your commute preference',
  'Within your budget range with no hidden fees',
  'High safety ratings in verified neighborhoods',
];

export default function Results({ onNavigate }) {
  const { favorites, toggleFav } = useFavorites();
  const { prefs } = usePreferences();

  const safetyLabel = prefs.safety.charAt(0).toUpperCase() + prefs.safety.slice(1);

  const PREFS = [
    { icon: 'payments',       label: 'Budget',  value: `Under $${prefs.budget.toLocaleString()}/mo` },
    { icon: 'directions_car', label: 'Commute', value: `Max ${prefs.commute} min` },
    { icon: 'verified_user',  label: 'Safety',  value: `${safetyLabel} priority` },
  ];

  return (
    <div className="pt-32 pb-24 px-8 max-w-screen-2xl mx-auto w-full">

      <header className="mb-10">
        <h1 className="text-6xl font-extrabold tracking-tight text-on-surface mb-4">Best Matches</h1>
        <p className="text-xl text-on-surface-variant font-medium leading-relaxed max-w-2xl">
          Based on your preferences and lifestyle goals.
        </p>
      </header>

      {/* Preference summary chips */}
      <div className="flex flex-wrap gap-3 mb-12">
        {PREFS.map(({ icon, label, value }) => (
          <div key={label} className="flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-full editorial-shadow">
            <span className="material-symbols-outlined text-primary text-[18px]">{icon}</span>
            <span className="text-[0.75rem] font-bold uppercase tracking-[0.1em] text-on-surface-variant">{label}:</span>
            <span className="text-sm font-bold text-on-surface">{value}</span>
          </div>
        ))}
        <button onClick={() => onNavigate('/preferences')} className="flex items-center gap-1 px-4 py-2 text-primary text-sm font-bold hover:underline">
          <span className="material-symbols-outlined text-[18px]">tune</span>
          Adjust
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

        {/* Left — main results */}
        <div className="lg:col-span-8 space-y-8">

          {/* Featured card */}
          <div className="bg-surface-container-lowest rounded-xl overflow-hidden editorial-shadow hover:shadow-[0_28px_56px_rgba(27,27,32,0.10)] transition-all duration-300">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-2/5 aspect-[4/3] md:aspect-auto overflow-hidden relative">
                <img src={featured.image} alt={featured.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 p-8">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-2xl font-bold text-on-surface">{featured.name}</h2>
                  <button onClick={() => toggleFav(featured.id)}>
                    <span
                      className="material-symbols-outlined text-primary-container text-[24px]"
                      style={{ fontVariationSettings: favorites[featured.id] ? "'FILL' 1" : "'FILL' 0" }}
                    >favorite</span>
                  </button>
                </div>
                <p className="text-on-surface-variant font-medium mb-1">{featured.neighborhood}</p>
                <p className="text-3xl font-extrabold text-on-surface mb-4">{featured.price}<span className="text-base font-medium text-on-surface-variant">/mo</span></p>
                <div className="flex gap-4 text-[0.7rem] font-bold uppercase tracking-[0.1em] text-outline mb-6">
                  <span>{featured.beds} bd</span><span>·</span>
                  <span>{featured.baths} ba</span><span>·</span>
                  <span>{featured.sqft} sqft</span>
                </div>
                <div className="flex gap-2 flex-wrap mb-6">
                  {featured.tags.map(t => (
                    <span key={t} className="text-[0.7rem] font-bold uppercase tracking-[0.1em] bg-primary/10 text-primary px-3 py-1 rounded-full">{t}</span>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => onNavigate(`/listing/${featured.id}`)}
                    className="flex-1 bg-gradient-to-br from-primary to-primary-container text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all active:scale-95"
                  >
                    View Details
                  </button>
                  <button className="px-5 py-3 bg-surface-container-high text-on-surface rounded-lg font-semibold text-sm hover:bg-surface-container-highest transition active:scale-95">
                    See Similar
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Grid of remaining listings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {grid.map(listing => (
              <div
                key={listing.id}
                className="bg-surface-container-lowest rounded-xl overflow-hidden editorial-shadow hover:-translate-y-1 hover:shadow-[0_28px_56px_rgba(27,27,32,0.10)] transition-all duration-300 cursor-pointer"
                onClick={() => onNavigate(`/listing/${listing.id}`)}
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img src={listing.image} alt={listing.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  <button
                    onClick={e => { e.stopPropagation(); toggleFav(listing.id); }}
                    className="absolute top-3 right-3 bg-white/90 backdrop-blur-md p-1.5 rounded-full hover:bg-white transition-colors shadow-sm"
                  >
                    <span
                      className="material-symbols-outlined text-primary-container text-[18px]"
                      style={{ fontVariationSettings: favorites[listing.id] ? "'FILL' 1" : "'FILL' 0" }}
                    >favorite</span>
                  </button>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-on-surface text-base leading-tight">{listing.name}</h3>
                  </div>
                  <p className="text-on-surface-variant text-sm font-medium mb-2">{listing.neighborhood}</p>
                  <p className="text-xl font-bold text-on-surface mb-3">{listing.price}<span className="text-sm font-medium text-on-surface-variant">/mo</span></p>
                  <div className="flex gap-2 text-[0.65rem] font-bold uppercase tracking-[0.1em] text-outline mb-4">
                    <span>{listing.beds} bd</span><span>·</span>
                    <span>{listing.baths} ba</span><span>·</span>
                    <span>{listing.sqft} sqft</span>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); onNavigate(`/listing/${listing.id}`); }}
                    className="w-full bg-gradient-to-br from-primary to-primary-container text-white py-2.5 rounded-lg font-bold text-sm hover:shadow-lg transition-all active:scale-95"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* More options */}
          <div className="flex items-center justify-center pt-4">
            <button
              onClick={() => onNavigate('/search')}
              className="flex items-center gap-2 px-8 py-4 bg-surface-container-low text-on-surface rounded-xl font-bold hover:bg-surface-container transition-all editorial-shadow"
            >
              <span className="material-symbols-outlined text-primary">search</span>
              See All Listings
            </button>
          </div>
        </div>

        {/* Right sidebar */}
        <aside className="lg:col-span-4 space-y-6">

          {/* Why these results */}
          <div className="bg-surface-container-low p-8 rounded-xl editorial-shadow">
            <p className="text-[0.75rem] font-bold uppercase tracking-[0.1em] text-on-surface-variant mb-6">Why These Results?</p>
            <div className="space-y-4">
              {WHY.map(text => (
                <div key={text} className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary bg-primary/10 rounded-full p-1 text-sm shrink-0 mt-0.5">check</span>
                  <p className="text-sm text-on-surface-variant font-medium leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => onNavigate('/preferences')}
              className="mt-6 w-full text-primary text-sm font-bold hover:underline flex items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">tune</span>
              Adjust Preferences
            </button>
          </div>

          {/* See More Results CTA */}
          <div className="bg-primary rounded-xl p-6 text-white relative overflow-hidden editorial-shadow">
            <div className="absolute -bottom-4 -right-4 opacity-20 pointer-events-none">
              <span className="material-symbols-outlined text-[100px]">search</span>
            </div>
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-2">See More Results</h3>
              <p className="text-blue-100 text-sm mb-4 font-medium">Explore the full listing database and filter by your exact criteria.</p>
              <button
                onClick={() => onNavigate('/search')}
                className="w-full bg-white text-primary py-2.5 rounded-full font-bold text-[0.75rem] uppercase tracking-[0.1em] hover:bg-surface-bright transition active:scale-95"
              >
                Browse All Listings
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
