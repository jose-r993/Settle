import { useState } from 'react';

const SUBJECTS = ['General Inquiry', 'Tour Support', 'Technical Issue', 'Billing Question', 'Report a Listing', 'Partnership'];

export default function Contact({ onNavigate }) {
  const [form, setForm]       = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const inputCls = 'w-full bg-surface-container-lowest shadow-sm rounded-lg px-4 py-3 text-on-surface placeholder:text-outline font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-shadow';
  const labelCls = 'text-[0.75rem] font-bold uppercase tracking-[0.1em] text-on-surface-variant block mb-2';

  if (submitted) {
    return (
      <div className="pt-32 pb-24 px-8 max-w-screen-2xl mx-auto w-full flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-primary text-[40px]" style={{ fontVariationSettings: "'FILL' 1" }}>mark_email_read</span>
        </div>
        <h1 className="text-3xl font-extrabold text-on-surface mb-3">Message Sent!</h1>
        <p className="text-on-surface-variant font-medium mb-2 text-center">We'll get back to you at <span className="font-bold">{form.email}</span> within 24 hours.</p>
        <button onClick={() => onNavigate('/dashboard')} className="mt-6 text-primary font-bold hover:underline">
          Back to Dashboard →
        </button>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-8 max-w-screen-2xl mx-auto w-full">

      <header className="mb-16">
        <h1 className="text-6xl font-extrabold tracking-tight text-on-surface mb-4">Contact Us</h1>
        <p className="text-xl text-on-surface-variant font-medium">We'd love to hear from you. Our team responds within 24 hours.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

        {/* Left — contact info */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-surface-container-low p-8 rounded-xl editorial-shadow">
            <h2 className="text-2xl font-bold text-on-surface mb-8">Get in Touch</h2>
            <div className="space-y-6">
              {[
                { icon: 'mail',       label: 'Email',         value: 'support@settle.com' },
                { icon: 'schedule',   label: 'Response Time', value: 'Within 24 hours' },
                { icon: 'location_on',label: 'Location',      value: 'Dallas, TX' },
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

          <div className="bg-surface-container-low p-6 rounded-xl editorial-shadow">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-outline text-[20px] shrink-0 mt-0.5">info</span>
              <p className="text-sm text-on-surface-variant font-medium leading-relaxed">
                For property-specific inquiries, please contact the property manager directly through the listing page using the "Send Message" button.
              </p>
            </div>
          </div>

          <div className="bg-primary rounded-xl p-8 text-white relative overflow-hidden editorial-shadow">
            <div className="absolute -bottom-4 -right-4 opacity-20 pointer-events-none">
              <span className="material-symbols-outlined text-[100px]">forum</span>
            </div>
            <div className="relative z-10">
              <h3 className="font-bold mb-2">Need Faster Help?</h3>
              <p className="text-blue-100 text-sm mb-4 font-medium">Check our FAQ for instant answers to common questions.</p>
              <button
                onClick={() => onNavigate('/faq')}
                className="w-full bg-white text-primary py-2.5 rounded-full font-bold text-[0.75rem] uppercase tracking-[0.1em] hover:bg-surface-bright transition active:scale-95"
              >
                Browse FAQ
              </button>
            </div>
          </div>
        </div>

        {/* Right — form */}
        <div className="lg:col-span-8">
          <div className="bg-surface-container-low p-10 rounded-xl editorial-shadow">
            <h2 className="text-2xl font-bold text-on-surface mb-8">Send Us a Message</h2>
            <form
              onSubmit={e => { e.preventDefault(); if (form.name && form.email && form.message) setSubmitted(true); }}
              className="flex flex-col gap-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className={labelCls}>Full Name</label>
                  <input type="text" placeholder="John Doe" value={form.name} onChange={set('name')} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Email Address</label>
                  <input type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} className={inputCls} />
                </div>
              </div>

              <div>
                <label className={labelCls}>Subject</label>
                <select value={form.subject} onChange={set('subject')} className={inputCls}>
                  <option value="">Select a subject…</option>
                  {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className={labelCls}>Message</label>
                <textarea
                  placeholder="How can we help you?"
                  value={form.message}
                  onChange={set('message')}
                  rows={6}
                  className={`${inputCls} resize-none`}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-br from-primary to-primary-container text-white py-4 rounded-xl font-bold text-base hover:shadow-lg transition-all active:scale-95"
              >
                Submit Message
              </button>

              <p className="text-center text-xs text-outline font-medium">
                By submitting you agree to our{' '}
                <button type="button" onClick={() => onNavigate('/privacy')} className="text-primary hover:underline font-semibold">Privacy Policy</button>
                . We never share your information with third parties.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
