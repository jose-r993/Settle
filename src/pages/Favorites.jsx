import { useState } from 'react';
import { LISTINGS } from '../data/listings';

export default function Favorites({ onNavigate }) {
  const [saved, setSaved] = useState({ '1': true, '3': true, '6': true });
  const toggleFav = (id) => setSaved(s => ({ ...s, [id]: !s[id] }));

  const favListings = LISTINGS.filter(l => saved[l.id]);

  if (favListings.length === 0) {
    return (
      <div className="pt-32 pb-24 px-8 max-w-screen-2xl mx-auto w-full flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-20 h-20 rounded-full bg-surface-container-low flex items-center justify-center mb-6 editorial-shadow">
          <span className="material-symbols-outlined text-outline text-[40px]">favorite_border</span>
        </div>
        <h1 className="text-3xl font-extrabold text-on-surface mb-3">No Saved Listings Yet</h1>
        <p className="text-on-surface-variant font-medium mb-8 text-center max-w-sm">
          Heart a listing while browsing to save it here. Your favorites sync across devices.
        </p>
        <button
          onClick={() => onNavigate('/search')}
          className="bg-gradient-to-br from-primary to-primary-container text-white px-8 py-4 rounded-xl font-bold hover:shadow-lg transition-all active:scale-95 flex items-center gap-2"
        >
          <span className="material-symbols-outlined">search</span>
          Start Exploring
        </button>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-8 max-w-screen-2xl mx-auto w-full">

      <header className="mb-12">
        <h1 className="text-6xl font-extrabold tracking-tight text-on-surface mb-4">Saved Listings</h1>
        <p className="text-xl text-on-surface-variant font-medium">
          {favListings.length} saved {favListings.length === 1 ? 'listing' : 'listings'}
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {favListings.map(listing => (
          <div
            key={listing.id}
            onClick={() => onNavigate(`/listing/${listing.id}`)}
            className="group relative bg-surface-container-lowest rounded-xl overflow-hidden editorial-shadow hover:-translate-y-1 hover:shadow-[0_28px_56px_rgba(27,27,32,0.10)] transition-all duration-300 cursor-pointer"
          >
            <div className="aspect-[4/3] relative overflow-hidden">
              <img
                src={listing.image}
                alt={listing.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Match badge */}
              <div className="absolute top-4 left-4 bg-primary text-white text-[0.65rem] font-black uppercase tracking-[0.1em] px-2.5 py-1 rounded-full">
                {listing.match}% Match
              </div>
              {/* Heart button */}
              <button
                onClick={e => { e.stopPropagation(); toggleFav(listing.id); }}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-2 rounded-full hover:bg-white transition-colors shadow-sm"
              >
                <span
                  className="material-symbols-outlined text-primary-container text-[20px]"
                  style={{ fontVariationSettings: saved[listing.id] ? "'FILL' 1" : "'FILL' 0" }}
                >favorite</span>
              </button>
            </div>

            <div className="p-5">
              <h3 className="font-bold text-on-surface text-base mb-1 leading-tight">{listing.name}</h3>
              <p className="text-on-surface-variant font-medium text-sm mb-3">{listing.neighborhood}</p>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xl font-bold text-on-surface">{listing.price}<span className="text-sm font-medium text-on-surface-variant">/mo</span></span>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-tertiary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="text-sm font-semibold text-on-surface">{listing.rating}</span>
                </div>
              </div>
              <div className="flex gap-3 text-[0.7rem] font-bold uppercase tracking-[0.1em] text-outline mb-4">
                <span>{listing.beds} bd</span><span>·</span>
                <span>{listing.baths} ba</span><span>·</span>
                <span>{listing.sqft} sqft</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={e => { e.stopPropagation(); onNavigate(`/listing/${listing.id}`); }}
                  className="flex-1 bg-gradient-to-br from-primary to-primary-container text-white py-2.5 rounded-lg font-bold text-sm hover:shadow-lg transition-all active:scale-95"
                >
                  View Details
                </button>
                <button
                  onClick={e => { e.stopPropagation(); onNavigate(`/booking/${listing.id}`); }}
                  className="px-4 py-2.5 bg-surface-container-high text-on-surface rounded-lg font-semibold text-sm hover:bg-surface-container-highest transition active:scale-95"
                  title="Book tour"
                >
                  <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <button
          onClick={() => onNavigate('/search')}
          className="flex items-center gap-2 px-8 py-4 bg-surface-container-low text-on-surface rounded-xl font-bold hover:bg-surface-container transition editorial-shadow"
        >
          <span className="material-symbols-outlined text-primary">search</span>
          Find More Listings
        </button>
      </div>
    </div>
  );
}
