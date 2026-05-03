import { useState } from 'react';
import { getListing } from '../data/listings';
import { useFavorites } from '../context/FavoritesContext';
import AmenityMap from '../components/map/AmenityMap';

export default function ListingDetail({ id, onNavigate }) {
  const listing = getListing(id);
  const [activeImg, setActiveImg] = useState(0);
  const { favorites, toggleFav } = useFavorites();
  const saved = !!favorites[listing.id];

  const costs = listing.costs;
  const formatter = (n) => `$${n.toLocaleString()}`;

  return (
    <div className="pt-32 pb-24 px-8 max-w-screen-xl mx-auto w-full">

      {/* Back nav */}
      <button
        onClick={() => onNavigate('/results')}
        className="flex items-center gap-1 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors mb-8"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Back to Results
      </button>

      {/* Image gallery */}
      <div className="mb-10">
        <div className="aspect-[16/7] rounded-2xl overflow-hidden mb-3 editorial-shadow">
          <img src={listing.images[activeImg]} alt={listing.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex gap-3">
          {listing.images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveImg(i)}
              className={`h-20 flex-1 rounded-xl overflow-hidden transition-all ${activeImg === i ? 'ring-2 ring-primary' : 'opacity-60 hover:opacity-100'}`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
          <button className="h-20 flex-1 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition">
            <div className="text-center">
              <span className="material-symbols-outlined text-[20px]">photo_library</span>
              <p className="text-[0.65rem] font-bold mt-1">View All</p>
            </div>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

        {/* Left — main info */}
        <div className="lg:col-span-8 space-y-8">

          {/* Header */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-[0.75rem] font-bold uppercase tracking-[0.1em]">
                {listing.match}% Match
              </span>
              <span className="text-[0.75rem] font-bold uppercase tracking-[0.1em] text-outline">
                Updated {listing.lastUpdated}
              </span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2">{listing.name}</h1>
            <p className="text-on-surface-variant font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px]">location_on</span>
              {listing.address}
            </p>
          </div>

          {/* Price + specs */}
          <div className="bg-surface-container-low p-8 rounded-xl editorial-shadow">
            <div className="flex flex-wrap gap-8 items-end">
              <div>
                <p className="text-[0.75rem] font-bold uppercase tracking-[0.1em] text-on-surface-variant mb-1">Monthly Rent</p>
                <p className="text-5xl font-extrabold text-on-surface">{listing.price}<span className="text-xl font-medium text-on-surface-variant">/mo</span></p>
              </div>
              <div className="flex gap-8">
                {[
                  { label: 'Bedrooms', value: listing.beds },
                  { label: 'Bathrooms', value: listing.baths },
                  { label: 'Sq Ft', value: listing.sqft.toLocaleString() },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-[0.75rem] font-bold uppercase tracking-[0.1em] text-on-surface-variant mb-1">{label}</p>
                    <p className="text-2xl font-bold text-on-surface">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 mt-8">
              <button className="flex items-center gap-2 bg-gradient-to-br from-primary to-primary-container text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transition-all active:scale-95">
                <span className="material-symbols-outlined text-[18px]">mail</span>
                Send Message
              </button>
              <button className="flex items-center gap-2 bg-surface-container-high text-on-surface px-6 py-3 rounded-lg font-semibold hover:bg-surface-container-highest transition active:scale-95">
                <span className="material-symbols-outlined text-[18px]">call</span>
                Call Property
              </button>
              <button
                onClick={() => toggleFav(listing.id)}
                className="flex items-center gap-2 bg-surface-container-high text-on-surface px-6 py-3 rounded-lg font-semibold hover:bg-surface-container-highest transition active:scale-95"
              >
                <span
                  className="material-symbols-outlined text-primary-container text-[18px]"
                  style={{ fontVariationSettings: saved ? "'FILL' 1" : "'FILL' 0" }}
                >favorite</span>
                {saved ? 'Saved to Favorites' : 'Save to Favorites'}
              </button>
              <button className="flex items-center gap-2 bg-surface-container-high text-on-surface px-6 py-3 rounded-lg font-semibold hover:bg-surface-container-highest transition active:scale-95">
                <span className="material-symbols-outlined text-[18px]">forum</span>
                Ask a Question
              </button>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {listing.tags.map(t => (
              <span key={t} className="inline-flex items-center px-4 py-2 rounded-full bg-surface-container-low text-on-surface-variant text-sm font-semibold editorial-shadow">
                {t}
              </span>
            ))}
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-surface-container-low text-on-surface-variant text-sm font-semibold editorial-shadow">
              {listing.petPolicy}
            </span>
          </div>

          {/* Nearby Amenities */}
          <section>
            <h2 className="text-2xl font-bold text-on-surface mb-6">Nearby Amenities</h2>

            {/* Amenity map */}
            <div className="rounded-xl mb-6 overflow-hidden editorial-shadow" style={{ height: '220px' }}>
              <AmenityMap listing={listing} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {listing.amenities.map(a => (
                <div key={a.name} className="flex items-center gap-4 bg-surface-container-low p-4 rounded-xl editorial-shadow">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary text-[20px]">{a.icon}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">{a.name}</p>
                    <p className="text-[0.75rem] font-medium text-on-surface-variant">{a.distance}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Neighborhood Safety */}
          <section className="bg-primary/5 rounded-xl p-10 editorial-shadow">
            <div className="flex gap-8 items-center">
              <div className="relative shrink-0">
                <svg width="120" height="120" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#E0E1EA" strokeWidth="10" />
                  <circle
                    cx="60" cy="60" r="50"
                    fill="none"
                    stroke="#004AC6"
                    strokeWidth="10"
                    strokeDasharray={`${2 * Math.PI * 50 * listing.safetyScore / 100} ${2 * Math.PI * 50}`}
                    strokeLinecap="round"
                    transform="rotate(-90 60 60)"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-primary">{listing.safetyScore}</span>
                  <span className="text-[0.65rem] font-bold text-outline uppercase">/100</span>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-on-surface mb-3">Neighborhood Safety</h2>
                <p className="text-on-surface-variant font-medium leading-relaxed">
                  This neighborhood scores <span className="font-bold text-primary">{listing.safetyScore}/100</span> on our composite safety index, combining crime data, lighting coverage, and resident reviews. Higher than {listing.safetyScore - 10}% of Dallas neighborhoods.
                </p>
              </div>
            </div>
          </section>

          {/* Cost Breakdown */}
          <section>
            <h2 className="text-2xl font-bold text-on-surface mb-6">Full Cost Breakdown</h2>
            <div className="bg-surface-container-low rounded-xl overflow-hidden editorial-shadow">
              {[
                ['Monthly Rent',      formatter(costs.rent)],
                ['Utilities (est.)',  formatter(costs.utilities)],
                ['Parking',          costs.parking ? formatter(costs.parking) : 'Included'],
              ].map(([label, val], i) => (
                <div key={label} className={`flex justify-between items-center px-8 py-5 ${i > 0 ? 'border-t border-surface-container' : ''}`}>
                  <span className="text-on-surface-variant font-medium">{label}</span>
                  <span className="font-bold text-on-surface">{val}</span>
                </div>
              ))}
              <div className="flex justify-between items-center px-8 py-5 bg-primary/5">
                <span className="font-bold text-on-surface text-lg">Total / Month</span>
                <span className="font-black text-primary text-xl">{formatter(costs.total)}</span>
              </div>
            </div>
          </section>
        </div>

        {/* Right sidebar */}
        <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">

          {/* Quick facts */}
          <div className="bg-surface-container-low p-8 rounded-xl editorial-shadow">
            <p className="text-[0.75rem] font-bold uppercase tracking-[0.1em] text-on-surface-variant mb-6">Quick Facts</p>
            <div className="space-y-4">
              {[
                { icon: 'directions_car', label: 'Commute', value: listing.commute },
                { icon: 'verified_user',  label: 'Safety Score', value: `${listing.safetyScore}/100` },
                { icon: 'star',           label: 'Rating', value: `${listing.rating}/5.0` },
                { icon: 'pets',           label: 'Pet Policy', value: listing.petPolicy },
              ].map(({ icon, label, value }) => (
                <div key={label} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary text-[20px]">{icon}</span>
                  </div>
                  <div>
                    <p className="text-[0.75rem] font-bold uppercase tracking-[0.1em] text-on-surface-variant">{label}</p>
                    <p className="font-bold text-on-surface">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Schedule tour CTA */}
          <div className="bg-primary rounded-xl p-8 text-white relative overflow-hidden editorial-shadow">
            <div className="absolute -bottom-4 -right-4 opacity-20 pointer-events-none">
              <span className="material-symbols-outlined text-[100px]">calendar_month</span>
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">Schedule a Tour</h3>
              <p className="text-blue-100 text-sm mb-6 font-medium leading-relaxed">
                See the unit in person or via video — choose a time that works for you.
              </p>
              <button
                onClick={() => onNavigate(`/booking/${listing.id}`)}
                className="w-full bg-white text-primary py-3 rounded-full font-bold text-[0.75rem] uppercase tracking-[0.1em] hover:bg-surface-bright transition active:scale-95"
              >
                Book a Tour
              </button>
            </div>
          </div>

          {/* Similar listings */}
          <div className="bg-surface-container-low p-8 rounded-xl editorial-shadow">
            <p className="text-[0.75rem] font-bold uppercase tracking-[0.1em] text-on-surface-variant mb-4">Similar Listings</p>
            <div className="space-y-4">
              {LISTINGS_MINI.map(l => (
                <button
                  key={l.id}
                  onClick={() => onNavigate(`/listing/${l.id}`)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container transition"
                >
                  <img src={l.img} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0" />
                  <div className="text-left">
                    <p className="text-sm font-bold text-on-surface leading-tight">{l.name}</p>
                    <p className="text-xs text-on-surface-variant font-medium">{l.price}/mo · {l.match}% match</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

import { LISTINGS } from '../data/listings';
const LISTINGS_MINI = LISTINGS.slice(1, 4).map(l => ({ id: l.id, name: l.name, price: l.price, match: l.match, img: l.image }));
