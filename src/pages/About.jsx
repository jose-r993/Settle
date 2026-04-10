const TEAM = [
  { initials: 'JR', name: 'Jose Rodriguez',    role: 'Lead Engineer & Product',    color: 'bg-primary' },
  { initials: 'AL', name: 'Alex Lin',          role: 'Backend & AI Integration',   color: 'bg-secondary' },
  { initials: 'MK', name: 'Maya Kapoor',       role: 'Frontend & Design Systems',  color: 'bg-tertiary' },
  { initials: 'TN', name: 'Tyler Nguyen',      role: 'Data & Recommendation Engine', color: 'bg-primary' },
];

const DATA_SOURCES = [
  { name: 'Zillow',       role: 'Listing data, rent estimates, and property details', icon: 'home_work' },
  { name: 'Crimeometer',  role: 'Neighborhood crime statistics and safety scoring',   icon: 'verified_user' },
  { name: 'Yelp',         role: 'Nearby amenity data — restaurants, gyms, and more', icon: 'restaurant' },
  { name: 'Google Maps',  role: 'Transit times, commute distances, walkability',      icon: 'directions_car' },
];

const VALUES = [
  { icon: 'verified_user', title: 'Safety First',       desc: 'Every recommendation weighs neighborhood safety as a primary factor.' },
  { icon: 'auto_awesome',  title: 'AI-Powered',         desc: 'Our recommendation engine learns from your behavior to improve over time.' },
  { icon: 'handshake',     title: 'Transparent',        desc: 'We always explain why we recommended a listing — no black boxes.' },
  { icon: 'diversity_3',   title: 'Fair Housing',       desc: 'Settle is built in full compliance with the Fair Housing Act.' },
];

export default function About({ onNavigate }) {
  return (
    <div className="pt-32 pb-24 px-8 max-w-screen-2xl mx-auto w-full">

      {/* Hero */}
      <div className="max-w-3xl mb-20">
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-[0.75rem] font-bold uppercase tracking-[0.1em] mb-6">
          Built for Zillow
        </span>
        <h1 className="text-6xl font-extrabold tracking-tight text-on-surface mb-6 leading-tight">
          Making Relocation Simple,<br />Safe, and Smart
        </h1>
        <p className="text-xl text-on-surface-variant font-medium leading-relaxed">
          Settle is an AI-powered apartment recommendation platform designed to help renters find their perfect neighborhood — not just a unit. We combine safety data, lifestyle preferences, and real-time listings to give you personalized, explainable recommendations.
        </p>
      </div>

      {/* Mission */}
      <div className="bg-primary/5 rounded-xl p-12 mb-16 editorial-shadow relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
          <span className="material-symbols-outlined text-[300px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>home_work</span>
        </div>
        <div className="relative max-w-2xl">
          <p className="text-[0.75rem] font-bold uppercase tracking-[0.1em] text-primary mb-4">Our Mission</p>
          <p className="text-2xl font-bold text-on-surface leading-relaxed">
            "To empower every renter — especially those relocating to a new city — with the data, context, and confidence they need to make the best housing decision for their life."
          </p>
        </div>
      </div>

      {/* Values */}
      <div className="mb-20">
        <h2 className="text-4xl font-extrabold tracking-tight text-on-surface mb-10">What We Stand For</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUES.map(({ icon, title, desc }) => (
            <div key={title} className="bg-surface-container-low p-8 rounded-xl editorial-shadow">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                <span className="material-symbols-outlined text-primary text-[22px]">{icon}</span>
              </div>
              <h3 className="text-lg font-bold text-on-surface mb-2">{title}</h3>
              <p className="text-on-surface-variant font-medium text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Data Sources */}
      <div className="mb-20">
        <h2 className="text-4xl font-extrabold tracking-tight text-on-surface mb-4">Our Data Sources</h2>
        <p className="text-xl text-on-surface-variant font-medium mb-10">
          Settle surfaces data from trusted partners to ensure recommendations are accurate and current.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {DATA_SOURCES.map(({ name, role, icon }) => (
            <div key={name} className="bg-surface-container-lowest rounded-xl p-8 flex items-center gap-6 editorial-shadow">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary text-[26px]">{icon}</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-on-surface mb-1">{name}</h3>
                <p className="text-on-surface-variant font-medium text-sm">{role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div className="mb-20">
        <h2 className="text-4xl font-extrabold tracking-tight text-on-surface mb-10">The Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM.map(({ initials, name, role, color }) => (
            <div key={name} className="bg-surface-container-low p-8 rounded-xl editorial-shadow text-center">
              <div className={`w-16 h-16 rounded-full ${color} flex items-center justify-center mx-auto mb-5`}>
                <span className="text-white font-black text-xl">{initials}</span>
              </div>
              <h3 className="font-bold text-on-surface mb-1">{name}</h3>
              <p className="text-on-surface-variant font-medium text-sm">{role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-primary rounded-xl p-12 text-white text-center relative overflow-hidden editorial-shadow">
        <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
          <span className="material-symbols-outlined text-[400px]">home_work</span>
        </div>
        <div className="relative z-10">
          <h2 className="text-3xl font-extrabold mb-4">Ready to Find Your Place?</h2>
          <p className="text-blue-100 font-medium mb-8 max-w-md mx-auto">Join thousands of renters using Settle to make smarter housing decisions.</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => onNavigate('/preferences')}
              className="bg-white text-primary px-8 py-4 rounded-xl font-bold hover:bg-surface-bright transition active:scale-95"
            >
              Get Started
            </button>
            <button
              onClick={() => onNavigate('/contact')}
              className="border-2 border-white/40 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition active:scale-95"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
