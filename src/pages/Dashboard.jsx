import { useState } from 'react';
import { usePreferences } from '../context/PreferencesContext';
import { useFavorites } from '../context/FavoritesContext';

const RECENTLY_VIEWED = [
  { id: '1', name: 'The McKenzie Luxury Highrise', price: '$2,350', rating: 4.8, neighborhood: 'Downtown, Dallas',        beds: 2, baths: 1, sqft: 850,  image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80' },
  { id: '2', name: 'Loft 404 Apartments',          price: '$2,100', rating: 4.9, neighborhood: 'Uptown, Dallas',           beds: 1, baths: 1, sqft: 620,  image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80' },
  { id: '3', name: 'The Katy Trail Apartments',    price: '$2,450', rating: 4.7, neighborhood: 'Deep Ellum, Dallas',       beds: 2, baths: 2, sqft: 1100, image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80' },
  { id: '4', name: 'The Alton Oak',                price: '$2,275', rating: 4.8, neighborhood: 'Lower Greenville, Dallas', beds: 1, baths: 1, sqft: 780,  image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80' },
];

const FOCUS = [
  { label: 'Safety Score',    pct: '+15%' },
  { label: 'Walkability',     pct: '+22%' },
  { label: 'Modern Finishes', pct: '+8%'  },
];

const IMPROVEMENTS = [
  'Analyzing your recent saves to prioritize units with floor-to-ceiling windows and natural light.',
  'Weighting results toward the Uptown district based on your recurring search patterns.',
  'Refining budget thresholds to exclude properties with hidden utility surcharges.',
];

export default function Dashboard({ onNavigate }) {
  const [refine, setRefine] = useState('');
  const { prefs, updatePrefs } = usePreferences();
  const { favorites, toggleFav } = useFavorites();
  const safetyLabel = prefs.safety.charAt(0).toUpperCase() + prefs.safety.slice(1);
  const keywords = prefs.keywords ?? [];

  const addKeyword = () => {
    const trimmed = refine.trim();
    if (!trimmed || keywords.includes(trimmed)) return;
    updatePrefs({ keywords: [...keywords, trimmed] });
    setRefine('');
  };

  const removeKeyword = (kw) =>
    updatePrefs({ keywords: keywords.filter(k => k !== kw) });

  return (
    <div className="pt-32 pb-24 px-8 max-w-screen-2xl mx-auto w-full">

      {/* ── Display Header (3.75rem / extrabold / tight tracking) ── */}
      <header className="mb-12">
        <h1 className="text-6xl font-extrabold tracking-tight text-on-surface mb-4">
          Recommendation Overview
        </h1>
        {/* Body Large (1.25rem / medium) */}
        <p className="text-xl text-on-surface-variant max-w-2xl leading-relaxed font-medium">
          Your curated selection based on architectural preference, neighborhood safety, and urban proximity.
        </p>
      </header>

      {/* ── Preference Summary (surface-container-low cards on surface bg) ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
        {[
          { icon: 'payments',      label: 'Budget',  value: `Under $${prefs.budget.toLocaleString()}/mo` },
          { icon: 'directions_car',label: 'Commute', value: `Max ${prefs.commute} min`                  },
          { icon: 'verified_user', label: 'Safety',  value: `${safetyLabel} safety rating`              },
        ].map(({ icon, label, value }) => (
          /* surface-container-low sits on surface — tonal shift creates boundary, no border */
          <div
            key={label}
            className="bg-surface-container-low p-6 rounded-xl flex flex-col items-start gap-4 editorial-shadow hover:bg-surface-bright transition-all duration-200"
          >
            <div className="w-12 h-12 rounded-full bg-primary-container/10 flex items-center justify-center text-primary-container">
              <span className="material-symbols-outlined">{icon}</span>
            </div>
            {/* Label typography */}
            <div>
              <p className="text-[0.75rem] uppercase tracking-[0.1em] text-on-surface-variant font-bold mb-1">{label}</p>
              {/* Sub-headline (1.5rem / bold) */}
              <p className="text-2xl font-bold text-on-surface">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

        {/* Left col */}
        <div className="lg:col-span-8 space-y-10">

          {/* Improving section — primary/5 tint */}
          <section className="bg-primary/5 rounded-xl p-10 relative overflow-hidden editorial-shadow">
            {/* Decorative background icon at low opacity (Do: use iconography as decorative elements) */}
            <div className="absolute top-0 right-0 p-8 opacity-10 translate-x-1/4 -translate-y-1/4 pointer-events-none">
              <span className="material-symbols-outlined text-[120px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span>
            </div>

            <div className="flex gap-6 items-start relative">
              <div className="bg-primary-container w-14 h-14 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined text-white text-3xl">trending_up</span>
              </div>
              <div>
                {/* Headline (2.25rem / extrabold) */}
                <h2 className="text-2xl font-bold text-on-surface mb-6">How Your Results are Improving</h2>
                <div className="space-y-4">
                  {IMPROVEMENTS.map(text => (
                    <div key={text} className="flex items-start gap-4">
                      <span className="material-symbols-outlined text-primary bg-primary/10 rounded-full p-1 text-sm shrink-0 mt-0.5">check</span>
                      {/* Body Standard (1.125rem) */}
                      <p className="text-lg text-on-surface-variant">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Refine search — surface-container-low tonal section */}
          <section className="bg-surface-container-low p-10 rounded-xl">
            <h3 className="text-2xl font-bold text-on-surface mb-6">Refine your search</h3>
            <div className="flex flex-col md:flex-row gap-4">
              <input
                value={refine}
                onChange={e => setRefine(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addKeyword()}
                className="flex-grow bg-surface-container-lowest shadow-sm rounded-lg px-6 py-4 text-on-surface placeholder:text-outline font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-shadow"
                placeholder="Add keywords (e.g. 'Rooftop garden', 'In-unit laundry')"
                type="text"
              />
              <button
                onClick={addKeyword}
                className="bg-gradient-to-br from-primary to-primary-container text-white px-8 py-4 rounded-lg font-bold hover:shadow-lg transition-all active:scale-95 whitespace-nowrap"
              >
                Update Results
              </button>
            </div>
            {keywords.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {keywords.map(kw => (
                  <span
                    key={kw}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-[0.75rem] font-bold uppercase tracking-[0.1em]"
                  >
                    {kw}
                    <button
                      onClick={() => removeKeyword(kw)}
                      className="hover:text-primary-container transition-colors leading-none"
                      aria-label={`Remove ${kw}`}
                    >
                      <span className="material-symbols-outlined text-[14px]">close</span>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right sidebar */}
        <aside className="lg:col-span-4 space-y-8">

          {/* Recommendations panel — surface-container-low, editorial-shadow, NO border */}
          <div className="bg-surface-container-low p-8 rounded-xl editorial-shadow">
            <p className="text-[0.75rem] uppercase tracking-[0.1em] text-on-surface-variant font-black mb-8">
              Recommendations focus more on
            </p>
            <div className="space-y-2 mb-8">
              {FOCUS.map(({ label, pct }) => (
                /* Tonal separation: hover bg shift, no line */
                <div key={label} className="flex justify-between items-center p-4 rounded-lg hover:bg-surface-container transition-colors">
                  <span className="text-on-surface-variant font-medium">{label}</span>
                  <span className="text-primary font-black text-xl">{pct}</span>
                </div>
              ))}
            </div>
            {/* Interior divider via spacing gap, not a line */}
            <div className="pt-6 mt-2 bg-surface-container-lowest rounded-lg p-4">
              <h4 className="font-bold text-on-surface mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">info</span>
                Why These Matches?
              </h4>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Our algorithm synthesizes neighborhood crime data, transit availability, and current market trends to ensure your top results offer long-term lifestyle stability.
              </p>
            </div>
          </div>

          {/* CTA card — primary bg, decorative icon at low opacity */}
          <div className="bg-primary rounded-xl p-8 text-white overflow-hidden relative group editorial-shadow">
            <div className="absolute -bottom-6 -right-6 opacity-20 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
              <span className="material-symbols-outlined text-[120px]">auto_awesome</span>
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-3">Get Instant Alerts</h3>
              <p className="text-blue-100 text-sm mb-6 leading-relaxed font-medium">
                Be the first to see units that match your evolving preferences.
              </p>
              <button
                onClick={() => onNavigate('/notifications')}
                className="w-full bg-white text-primary py-3 rounded-full font-bold text-[0.75rem] uppercase tracking-[0.1em] transition-transform active:scale-95 hover:bg-surface-bright"
              >
                Enable Notifications
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* ── Recently Viewed ── */}
      <section className="mt-24">
        <div className="flex justify-between items-end mb-10">
          {/* Headline (2.25rem / extrabold) */}
          <h2 className="text-4xl font-extrabold tracking-tight text-on-surface">Recently Viewed</h2>
          <button onClick={() => onNavigate('/search')} className="text-primary font-bold hover:underline flex items-center gap-2 text-sm">
            Search for More Places
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {RECENTLY_VIEWED.map(listing => (
            /* Elevated listing card: surface-container-lowest pops above surface bg */
            /* Hover: -4px translate + deeper shadow per spec */
            <div
              key={listing.id}
              onClick={() => onNavigate(`/listing/${listing.id}`)}
              className="group relative bg-surface-container-lowest rounded-xl overflow-hidden editorial-shadow hover:-translate-y-1 hover:shadow-[0_28px_56px_rgba(27,27,32,0.10)] transition-all duration-300 cursor-pointer"
            >
              {/* 4:3 image with zoom on hover */}
              <div className="aspect-[4/3] relative overflow-hidden">
                <img
                  src={listing.image}
                  alt="Apartment"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Glassmorphic heart */}
                <button
                  onClick={e => { e.stopPropagation(); toggleFav(listing.id); }}
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-2 rounded-full hover:bg-white transition-colors shadow-sm"
                >
                  <span
                    className="material-symbols-outlined text-primary-container text-[20px]"
                    style={{ fontVariationSettings: favorites[listing.id] ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    favorite
                  </span>
                </button>
              </div>

              <div className="p-5">
                <h3 className="font-bold text-on-surface text-base leading-tight mb-1">{listing.name}</h3>
                <p className="text-on-surface-variant text-sm font-medium mb-2">{listing.neighborhood}</p>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xl font-bold text-on-surface">{listing.price}/mo</span>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-tertiary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="text-sm font-semibold text-on-surface">{listing.rating}</span>
                  </div>
                </div>
                {/* Label typography */}
                <div className="flex gap-3 text-[0.7rem] font-bold uppercase tracking-[0.1em] text-outline">
                  <span>{listing.beds} bd</span><span>·</span>
                  <span>{listing.baths} ba</span><span>·</span>
                  <span>{listing.sqft} sqft</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
