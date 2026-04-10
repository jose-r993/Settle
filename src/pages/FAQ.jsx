import { useState } from 'react';

const FAQS = [
  {
    category: 'Account',
    q: 'How do I create a Settle account?',
    a: 'Click "Get Started" or "Sign Up" on the login page. Enter your name, email, target city, and password, then agree to our Terms of Service. Your account is created instantly.',
  },
  {
    category: 'Account',
    q: 'Can I change my target city after signing up?',
    a: 'Yes. Go to Settings → Location & Property → Target City and update it anytime. Your recommendations will automatically refresh to reflect the new city.',
  },
  {
    category: 'Account',
    q: 'How do I reset my password?',
    a: 'On the login page, click "Forgot Password?" and enter your email. You\'ll receive a reset link within a few minutes. Check your spam folder if you don\'t see it.',
  },
  {
    category: 'Recommendations',
    q: 'How does Settle determine which apartments to recommend?',
    a: 'Our algorithm weighs your stated preferences (budget, commute tolerance, safety priority, amenities) alongside your interaction history — listings you\'ve viewed, saved, or toured. The compatibility % score reflects how well a listing matches all of these factors.',
  },
  {
    category: 'Recommendations',
    q: 'Why did my recommendations change?',
    a: 'Settle adapts over time. After 3 or more consistent interactions (e.g., saving high-floor units), the engine begins to weight those patterns. You\'ll see a note on your dashboard explaining what changed.',
  },
  {
    category: 'Recommendations',
    q: 'How do I refine my recommendations without changing preferences?',
    a: 'Use the "Refine your search" text box on the Dashboard. Type natural language like "closer to downtown" or "in-unit laundry" and the engine will adjust results within seconds.',
  },
  {
    category: 'Data',
    q: 'Where does Settle get its listing data?',
    a: 'Listing data comes from Zillow\'s real-time feed. Safety scores are sourced from Crimeometer, which aggregates crime data at the neighborhood level. Amenity data comes from Yelp.',
  },
  {
    category: 'Data',
    q: 'How up-to-date is the listing information?',
    a: 'Each listing shows a "Last Updated" timestamp. Zillow listing data typically refreshes every 24–48 hours. If you notice a discrepancy, use the "Report" button on the listing page.',
  },
  {
    category: 'Data',
    q: 'How is the neighborhood safety score calculated?',
    a: 'The score (0–100) is a composite of crime rate per capita, lighting index, and resident review sentiment from Crimeometer. A score above 80 is considered high safety.',
  },
  {
    category: 'Tours',
    q: 'How do I schedule an apartment tour?',
    a: 'Open any listing and click "Book a Tour" at the bottom. Select a date, time slot, and tour type (In-Person or Video), add any notes, and confirm. You\'ll see the booking in your Notifications.',
  },
  {
    category: 'Tours',
    q: 'Can I reschedule or cancel a tour?',
    a: 'Yes. Open the tour notification and click "Reschedule" or "Cancel Tour." Cancellations made more than 24 hours in advance are always free of charge.',
  },
];

const CATEGORIES = ['All', 'Account', 'Recommendations', 'Data', 'Tours'];

export default function FAQ({ onNavigate }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [openId,         setOpenId]         = useState(null);

  const filtered = FAQS.filter(f => activeCategory === 'All' || f.category === activeCategory);

  return (
    <div className="pt-32 pb-24 px-8 max-w-screen-xl mx-auto w-full">

      <header className="mb-12">
        <h1 className="text-6xl font-extrabold tracking-tight text-on-surface mb-4">Frequently Asked Questions</h1>
        <p className="text-xl text-on-surface-variant font-medium max-w-2xl">
          Find answers to common questions about recommendations, data sources, tours, and your account.
        </p>
      </header>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-10">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={[
              'px-5 py-2.5 rounded-xl text-sm font-bold transition-all',
              activeCategory === cat
                ? 'bg-primary text-white shadow-sm'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container editorial-shadow',
            ].join(' ')}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Accordion */}
      <div className="space-y-3">
        {filtered.map((faq, i) => {
          const id = `${faq.category}-${i}`;
          const isOpen = openId === id;
          return (
            <div key={id} className={`bg-surface-container-low rounded-xl overflow-hidden transition-all editorial-shadow ${isOpen ? 'ring-1 ring-primary/20' : ''}`}>
              <button
                onClick={() => setOpenId(isOpen ? null : id)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <div className="flex items-center gap-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[0.65rem] font-bold uppercase tracking-[0.1em] ${
                    faq.category === 'Account'         ? 'bg-primary/10 text-primary' :
                    faq.category === 'Recommendations' ? 'bg-secondary/20 text-secondary' :
                    faq.category === 'Data'            ? 'bg-tertiary/10 text-tertiary' :
                                                        'bg-green-50 text-green-700'
                  }`}>{faq.category}</span>
                  <span className="font-bold text-on-surface">{faq.q}</span>
                </div>
                <span className={`material-symbols-outlined text-outline text-[20px] transition-transform shrink-0 ml-4 ${isOpen ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </button>
              {isOpen && (
                <div className="px-6 pb-6 pt-0">
                  <div className="pl-[calc(1rem+40px+1rem)] border-l-0">
                    <p className="text-on-surface-variant font-medium leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Still need help */}
      <div className="mt-16 bg-surface-container-low p-10 rounded-xl editorial-shadow text-center">
        <span className="material-symbols-outlined text-primary text-[40px] mb-4 block">support_agent</span>
        <h2 className="text-2xl font-bold text-on-surface mb-3">Still Have Questions?</h2>
        <p className="text-on-surface-variant font-medium mb-6">Our support team is available Monday–Friday, 9am–6pm CT.</p>
        <button
          onClick={() => onNavigate('/contact')}
          className="bg-gradient-to-br from-primary to-primary-container text-white px-8 py-4 rounded-xl font-bold hover:shadow-lg transition-all active:scale-95"
        >
          Contact Support
        </button>
      </div>
    </div>
  );
}
