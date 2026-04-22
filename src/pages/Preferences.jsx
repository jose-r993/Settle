import { useState } from 'react';

const AMENITIES = [
  { id: 'parking',   label: 'Parking',        icon: 'local_parking' },
  { id: 'gym',       label: 'Gym',             icon: 'fitness_center' },
  { id: 'laundry',   label: 'In-Unit Laundry', icon: 'local_laundry_service' },
  { id: 'pets',      label: 'Pet Friendly',    icon: 'pets' },
  { id: 'pool',      label: 'Pool',            icon: 'pool' },
  { id: 'storage',   label: 'Storage',         icon: 'inventory_2' },
  { id: 'rooftop',   label: 'Rooftop',         icon: 'roofing' },
  { id: 'concierge', label: 'Concierge',       icon: 'support_agent' },
];

const SAFETY = [
  { value: 'low',    label: 'Low',    desc: 'Flexible on safety ratings' },
  { value: 'medium', label: 'Medium', desc: 'Prefer safe neighborhoods' },
  { value: 'high',   label: 'High',   desc: 'Only show safest areas' },
];

const EXPERIENCE = [
  { value: 'first',      label: 'First-Time Renter',  desc: 'New to renting — show me guidance and comparisons', icon: 'waving_hand' },
  { value: 'experienced',label: 'Experienced Renter', desc: 'I\'ve rented before — show me smart comparisons',   icon: 'verified' },
  { value: 'relocating', label: 'Relocating Pro',     desc: 'I\'m moving cities — prioritize neighborhood fit',  icon: 'flight_takeoff' },
];

export default function Preferences({ onNavigate }) {
  const [budget, setBudget]       = useState(1500);
  const [commute, setCommute]     = useState(30);
  const [safety, setSafety]       = useState('medium');
  const [amenities, setAmenities] = useState({ parking: true, laundry: true });
  const [experience, setExperience] = useState('experienced');

  const toggleAmenity = (id) => setAmenities(a => ({ ...a, [id]: !a[id] }));

  const inputCls = 'w-full bg-surface-container-lowest shadow-sm rounded-lg px-4 py-3 text-on-surface font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-shadow';

  return (
    <div className="pt-32 pb-24 px-8 max-w-3xl mx-auto w-full">

      <header className="mb-10">
        <h1 className="text-6xl font-extrabold tracking-tight text-on-surface mb-4">
          Tell Us What Matters
        </h1>
        <p className="text-xl text-on-surface-variant font-medium leading-relaxed">
          Help us find the perfect neighborhood and apartment for you.
        </p>
      </header>

      <div className="flex flex-col gap-6">

        {/* Budget */}
        <section className="bg-surface-container-low p-8 rounded-xl editorial-shadow">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-[0.75rem] font-bold uppercase tracking-[0.1em] text-on-surface-variant mb-1">Budget</p>
              <h2 className="text-2xl font-bold text-on-surface">Monthly Rent</h2>
            </div>
            <div className="bg-primary/10 rounded-xl px-5 py-3 text-center">
              <span className="text-2xl font-black text-primary">${budget.toLocaleString()}</span>
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.1em] text-primary/70 mt-0.5">per month</p>
            </div>
          </div>
          <div className="relative">
            <input
              type="range" min={500} max={5000} step={50}
              value={budget} onChange={e => setBudget(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer accent-primary bg-surface-container-highest"
            />
            <div className="flex justify-between mt-2 text-[0.7rem] font-bold text-outline uppercase tracking-[0.1em]">
              <span>$500</span><span>$5,000+</span>
            </div>
          </div>
        </section>

        {/* Commute */}
        <section className="bg-surface-container-low p-8 rounded-xl editorial-shadow">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-[0.75rem] font-bold uppercase tracking-[0.1em] text-on-surface-variant mb-1">Commute</p>
              <h2 className="text-2xl font-bold text-on-surface">Max Commute Time</h2>
            </div>
            <div className="bg-secondary/10 rounded-xl px-5 py-3 text-center">
              <span className="text-2xl font-black text-secondary">{commute} min</span>
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.1em] text-secondary/70 mt-0.5">one way</p>
            </div>
          </div>
          <div className="relative">
            <input
              type="range" min={5} max={60} step={5}
              value={commute} onChange={e => setCommute(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer accent-primary bg-surface-container-highest"
            />
            <div className="flex justify-between mt-2 text-[0.7rem] font-bold text-outline uppercase tracking-[0.1em]">
              <span>5 min</span><span>60 min</span>
            </div>
          </div>
        </section>

        {/* Safety Priority */}
        <section className="bg-surface-container-low p-8 rounded-xl editorial-shadow">
          <p className="text-[0.75rem] font-bold uppercase tracking-[0.1em] text-on-surface-variant mb-2">Safety Priority</p>
          <h2 className="text-2xl font-bold text-on-surface mb-6">How important is neighborhood safety?</h2>
          <div className="grid grid-cols-3 gap-4">
            {SAFETY.map(({ value, label, desc }) => (
              <button
                key={value}
                onClick={() => setSafety(value)}
                className={[
                  'flex flex-col items-start p-5 rounded-xl transition-all text-left',
                  safety === value
                    ? 'bg-primary/10 ring-2 ring-primary/30'
                    : 'bg-surface-container hover:bg-surface-container-high',
                ].join(' ')}
              >
                <span className={`text-sm font-black mb-1 ${safety === value ? 'text-primary' : 'text-on-surface'}`}>{label}</span>
                <span className="text-[0.75rem] text-on-surface-variant font-medium leading-snug">{desc}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Amenities */}
        <section className="bg-surface-container-low p-8 rounded-xl editorial-shadow">
          <p className="text-[0.75rem] font-bold uppercase tracking-[0.1em] text-on-surface-variant mb-2">Amenities</p>
          <h2 className="text-2xl font-bold text-on-surface mb-6">Desired Amenities</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {AMENITIES.map(({ id, label, icon }) => (
              <button
                key={id}
                onClick={() => toggleAmenity(id)}
                className={[
                  'flex items-center gap-3 p-4 rounded-xl transition-all',
                  amenities[id]
                    ? 'bg-primary/10 ring-2 ring-primary/30'
                    : 'bg-surface-container hover:bg-surface-container-high',
                ].join(' ')}
              >
                <span className={`material-symbols-outlined text-[20px] ${amenities[id] ? 'text-primary' : 'text-outline'}`}>{icon}</span>
                <span className={`text-sm font-semibold ${amenities[id] ? 'text-primary' : 'text-on-surface-variant'}`}>{label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Experience Level */}
        <section className="bg-surface-container-low p-8 rounded-xl editorial-shadow">
          <p className="text-[0.75rem] font-bold uppercase tracking-[0.1em] text-on-surface-variant mb-2">Experience Level</p>
          <h2 className="text-2xl font-bold text-on-surface mb-6">What best describes you?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {EXPERIENCE.map(({ value, label, desc, icon }) => (
              <button
                key={value}
                onClick={() => setExperience(value)}
                className={[
                  'flex flex-col items-start p-6 rounded-xl transition-all text-left',
                  experience === value
                    ? 'bg-primary/10 ring-2 ring-primary/30'
                    : 'bg-surface-container hover:bg-surface-container-high',
                ].join(' ')}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${experience === value ? 'bg-primary text-white' : 'bg-surface-container-high text-outline'}`}>
                  <span className="material-symbols-outlined text-[20px]">{icon}</span>
                </div>
                <span className={`text-sm font-black mb-2 ${experience === value ? 'text-primary' : 'text-on-surface'}`}>{label}</span>
                <span className="text-[0.75rem] text-on-surface-variant font-medium leading-snug">{desc}</span>
              </button>
            ))}
          </div>
        </section>

        {/* CTA */}
        <button
          onClick={() => onNavigate('/results')}
          className="w-full bg-gradient-to-br from-primary to-primary-container text-white py-5 rounded-xl font-bold text-lg hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3"
        >
          <span className="material-symbols-outlined">search</span>
          Find My Perfect Place
        </button>
      </div>
    </div>
  );
}
