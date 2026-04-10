import { useState } from 'react';

const CATEGORIES = [
  { id: 'plumbing',    label: 'Plumbing',     icon: 'plumbing' },
  { id: 'electrical',  label: 'Electrical',   icon: 'electrical_services' },
  { id: 'hvac',        label: 'HVAC',         icon: 'ac_unit' },
  { id: 'appliances',  label: 'Appliances',   icon: 'kitchen' },
  { id: 'structural',  label: 'Structural',   icon: 'foundation' },
  { id: 'painting',    label: 'Painting',     icon: 'format_paint' },
  { id: 'locks',       label: 'Locks/Doors',  icon: 'lock' },
  { id: 'internet',    label: 'Internet',     icon: 'wifi' },
  { id: 'pest',        label: 'Pest Control', icon: 'pest_control' },
];

const PRIORITIES = [
  { value: 'low',    label: 'Low',    desc: 'Non-urgent, within 2 weeks',   color: 'text-green-700 bg-green-50  ring-green-200' },
  { value: 'medium', label: 'Medium', desc: 'Moderate, within 3–5 days',    color: 'text-yellow-700 bg-yellow-50 ring-yellow-200' },
  { value: 'high',   label: 'High',   desc: 'Urgent, needs immediate help',  color: 'text-error bg-error/10 ring-error/30' },
];

const RECENT = [
  { id: '1', cat: 'HVAC',        desc: 'AC unit not cooling properly',  date: 'Mar 15, 2026', status: 'In Progress' },
  { id: '2', cat: 'Electrical',  desc: 'Outlet sparking in kitchen',    date: 'Feb 28, 2026', status: 'Resolved' },
  { id: '3', cat: 'Plumbing',    desc: 'Slow drain in bathroom sink',   date: 'Feb 10, 2026', status: 'Resolved' },
];

const STATUS_STYLE = {
  'Submitted':   'bg-primary/10 text-primary',
  'In Progress': 'bg-yellow-50 text-yellow-700',
  'Resolved':    'bg-green-50 text-green-700',
};

export default function Maintenance({ onNavigate }) {
  const [category,  setCategory]  = useState(null);
  const [priority,  setPriority]  = useState('medium');
  const [desc,      setDesc]      = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!category || !desc.trim()) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="pt-32 pb-24 px-8 max-w-screen-2xl mx-auto w-full flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-primary text-[40px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
        </div>
        <h1 className="text-3xl font-extrabold text-on-surface mb-3">Request Submitted</h1>
        <p className="text-on-surface-variant font-medium mb-2 text-center max-w-sm">
          Your {CATEGORIES.find(c => c.id === category)?.label} request has been submitted with <span className="font-bold capitalize">{priority}</span> priority.
        </p>
        <p className="text-sm text-outline mb-8">You'll receive updates in your Notifications.</p>
        <div className="flex gap-3">
          <button
            onClick={() => { setSubmitted(false); setDesc(''); setCategory(null); }}
            className="bg-gradient-to-br from-primary to-primary-container text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transition-all active:scale-95"
          >
            Submit Another
          </button>
          <button
            onClick={() => onNavigate('/notifications')}
            className="bg-surface-container-high text-on-surface px-6 py-3 rounded-lg font-semibold hover:bg-surface-container-highest transition active:scale-95"
          >
            View Notifications
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-8 max-w-screen-2xl mx-auto w-full">

      <header className="mb-10">
        <h1 className="text-6xl font-extrabold tracking-tight text-on-surface mb-4">Maintenance Request</h1>
        <p className="text-xl text-on-surface-variant font-medium">Submit an issue and we'll get it resolved as quickly as possible.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

        {/* Left — form */}
        <div className="lg:col-span-8 space-y-8">

          {/* Category grid */}
          <div className="bg-surface-container-low p-8 rounded-xl editorial-shadow">
            <p className="text-[0.75rem] font-bold uppercase tracking-[0.1em] text-on-surface-variant mb-2">Step 1</p>
            <h2 className="text-2xl font-bold text-on-surface mb-6">Select Issue Category</h2>
            <div className="grid grid-cols-3 gap-3">
              {CATEGORIES.map(({ id, label, icon }) => (
                <button
                  key={id}
                  onClick={() => setCategory(id)}
                  className={[
                    'flex flex-col items-center gap-3 p-5 rounded-xl transition-all',
                    category === id
                      ? 'bg-primary/10 ring-2 ring-primary/30'
                      : 'bg-surface-container hover:bg-surface-container-high',
                  ].join(' ')}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${category === id ? 'bg-primary text-white' : 'bg-surface-container-high text-outline'}`}>
                    <span className="material-symbols-outlined text-[20px]">{icon}</span>
                  </div>
                  <span className={`text-xs font-bold ${category === id ? 'text-primary' : 'text-on-surface-variant'}`}>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div className="bg-surface-container-low p-8 rounded-xl editorial-shadow">
            <p className="text-[0.75rem] font-bold uppercase tracking-[0.1em] text-on-surface-variant mb-2">Step 2</p>
            <h2 className="text-2xl font-bold text-on-surface mb-6">Priority Level</h2>
            <div className="grid grid-cols-3 gap-4">
              {PRIORITIES.map(({ value, label, desc, color }) => (
                <button
                  key={value}
                  onClick={() => setPriority(value)}
                  className={[
                    'flex flex-col items-start p-5 rounded-xl transition-all text-left',
                    priority === value ? `${color} ring-2` : 'bg-surface-container hover:bg-surface-container-high',
                  ].join(' ')}
                >
                  <span className={`text-sm font-black mb-1 ${priority === value ? '' : 'text-on-surface'}`}>{label}</span>
                  <span className={`text-[0.7rem] font-medium leading-snug ${priority === value ? '' : 'text-on-surface-variant'}`}>{desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="bg-surface-container-low p-8 rounded-xl editorial-shadow">
            <p className="text-[0.75rem] font-bold uppercase tracking-[0.1em] text-on-surface-variant mb-2">Step 3</p>
            <h2 className="text-2xl font-bold text-on-surface mb-6">Describe the Issue</h2>
            <textarea
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="Please describe the issue in detail — when it started, what you've noticed, and any relevant context…"
              rows={5}
              className="w-full bg-surface-container-lowest shadow-sm rounded-lg px-4 py-3 text-on-surface placeholder:text-outline font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-shadow resize-none"
            />
            <p className="text-[0.7rem] text-outline mt-2 font-medium">{desc.length} / 500 characters</p>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!category || !desc.trim()}
            className={[
              'w-full py-5 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3',
              category && desc.trim()
                ? 'bg-gradient-to-br from-primary to-primary-container text-white hover:shadow-lg active:scale-95'
                : 'bg-surface-container-highest text-outline cursor-not-allowed',
            ].join(' ')}
          >
            <span className="material-symbols-outlined">send</span>
            Submit Request
          </button>
        </div>

        {/* Right sidebar */}
        <aside className="lg:col-span-4 space-y-6">

          {/* Recent requests */}
          <div className="bg-surface-container-low p-8 rounded-xl editorial-shadow">
            <p className="text-[0.75rem] font-bold uppercase tracking-[0.1em] text-on-surface-variant mb-6">Recent Requests</p>
            <div className="space-y-4">
              {RECENT.map(req => (
                <div key={req.id} className="bg-surface-container-lowest rounded-xl p-4 editorial-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[0.65rem] font-bold uppercase tracking-[0.08em]">
                      {req.cat}
                    </span>
                    <span className={`text-[0.65rem] font-bold px-2.5 py-1 rounded-full ${STATUS_STYLE[req.status]}`}>
                      {req.status}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-on-surface mb-1">{req.desc}</p>
                  <p className="text-[0.65rem] text-outline font-medium">{req.date}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency contact */}
          <div className="bg-error/5 p-6 rounded-xl ring-1 ring-error/20">
            <div className="flex items-center gap-3 mb-3">
              <span className="material-symbols-outlined text-error text-[24px]">emergency</span>
              <h3 className="font-bold text-on-surface">Emergency?</h3>
            </div>
            <p className="text-sm text-on-surface-variant font-medium mb-4 leading-relaxed">
              For gas leaks, flooding, or fire hazards — call maintenance immediately.
            </p>
            <button className="w-full flex items-center justify-center gap-2 bg-error text-white py-3 rounded-lg font-bold hover:opacity-90 transition active:scale-95">
              <span className="material-symbols-outlined text-[18px]">call</span>
              (214) 555-0911
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
