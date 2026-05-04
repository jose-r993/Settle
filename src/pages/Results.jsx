import { useState, useEffect } from 'react';
import { LISTINGS } from '../data/listings';
import { useFavorites } from '../context/FavoritesContext';
import { usePreferences } from '../context/PreferencesContext';

const featured = LISTINGS[0];
const grid     = LISTINGS.slice(1, 7);

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const SAFETY_DESC = {
  low:    'flexible on safety ratings',
  medium: 'safe, verified neighborhoods',
  high:   'only the highest-rated safety areas',
};

function getLocalWhyPoints(prefs) {
  const points = [
    `All results are priced within your $${prefs.budget.toLocaleString()}/mo budget.`,
    `Every listing is within your ${prefs.commute}-minute max commute.`,
    `Neighborhoods are filtered for ${SAFETY_DESC[prefs.safety] ?? prefs.safety} based on your safety priority.`,
  ];
  if (prefs.keywords?.length) {
    points[2] = `Results are matched to your feature preferences: ${prefs.keywords.slice(0, 3).join(', ')}.`;
  }
  return points;
}

async function generateWhyPoints(prefs) {
  if (!GEMINI_API_KEY) throw new Error('VITE_GEMINI_API_KEY not set');

  const keywordNote = prefs.keywords?.length
    ? `Feature preferences: ${prefs.keywords.join(', ')}.`
    : '';

  const prompt = `You are a helpful apartment search assistant. Write exactly 3 short bullet points (one sentence each) explaining why these apartment results are a great match for this user. Be specific and reference their actual numbers.

User preferences:
- Budget: up to $${prefs.budget.toLocaleString()}/mo
- Max commute: ${prefs.commute} minutes
- Safety priority: ${prefs.safety}
${keywordNote}

Return ONLY a JSON array of 3 strings, no markdown, no code fences. Example:
["Point one.", "Point two.", "Point three."]`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini ${res.status}: ${err}`);
  }

  const data = await res.json();
  let text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  // Strip markdown fences if present
  text = text.replace(/```(?:json)?\s*/gi, '').replace(/```/g, '').trim();
  const points = JSON.parse(text);
  if (!Array.isArray(points) || points.length === 0) throw new Error('Unexpected response shape');
  return points;
}

export default function Results({ onNavigate }) {
  const { favorites, toggleFav } = useFavorites();
  const { prefs } = usePreferences();

  const safetyLabel = prefs.safety.charAt(0).toUpperCase() + prefs.safety.slice(1);

  const prefsKey = `${prefs.budget}-${prefs.commute}-${prefs.safety}-${(prefs.keywords ?? []).join(',')}`;
  const [fetchedKey, setFetchedKey] = useState('');
  const [whyPoints, setWhyPoints] = useState(() => getLocalWhyPoints(prefs));
  const whyLoading = fetchedKey !== prefsKey;

  useEffect(() => {
    let cancelled = false;
    generateWhyPoints(prefs)
      .then(points => {
        if (!cancelled) { setWhyPoints(points); setFetchedKey(prefsKey); }
      })
      .catch(err => {
        console.error('[Why These Results]', err);
        if (!cancelled) { setWhyPoints(getLocalWhyPoints(prefs)); setFetchedKey(prefsKey); }
      });
    return () => { cancelled = true; };
  }, [prefsKey]); // eslint-disable-line

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

          {/* Why these results — Gemini-generated */}
          <div className="bg-surface-container-low p-8 rounded-xl editorial-shadow">
            <div className="flex items-center gap-2 mb-6">
              <p className="text-[0.75rem] font-bold uppercase tracking-[0.1em] text-on-surface-variant">Why These Results?</p>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[0.65rem] font-bold uppercase tracking-[0.1em]">
                <span className="material-symbols-outlined text-[12px]">auto_awesome</span>
                AI
              </span>
            </div>
            {whyLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 shrink-0 animate-pulse" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 bg-surface-container rounded animate-pulse w-full" />
                      <div className="h-3 bg-surface-container rounded animate-pulse w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {whyPoints.map((text, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary bg-primary/10 rounded-full p-1 text-sm shrink-0 mt-0.5">check</span>
                    <p className="text-sm text-on-surface-variant font-medium leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            )}
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
