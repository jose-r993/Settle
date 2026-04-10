const SECTIONS = [
  {
    title: '1. Information We Collect',
    body: `We collect information you provide directly to us when you create an account or use our services:

**Account Information:** Name, email address, password, and target city at signup.

**Preference Data:** Budget range, commute tolerance, safety priority, desired amenities, and renter experience level that you enter in the Preferences flow.

**Usage Data:** Listings you view, save, or tour-request; search queries; filter selections; and free-text refinement inputs.

**Device & Technical Data:** Browser type, IP address, operating system, and session identifiers — used to deliver and improve our service.

We do not collect payment information. Rent applications and payments are handled directly by property managers or through Zillow.`,
  },
  {
    title: '2. How We Use Your Information',
    body: `We use the information we collect to:

- **Generate recommendations** personalized to your preferences and interaction history
- **Improve the recommendation engine** by learning from aggregate user behavior patterns
- **Send notifications** about price changes, new listings, and tour confirmations (only if you've opted in)
- **Provide customer support** when you contact us
- **Analyze usage trends** to improve our platform features and UI

We do not sell your personal data to third parties. We do not use your data for advertising targeting.`,
  },
  {
    title: '3. Data Sharing',
    body: `We share your data only in limited circumstances:

**Service Providers:** We use Zillow, Crimeometer, and Yelp APIs to power listing data, safety scores, and amenity information. These providers receive only the queries necessary to return results — not your account details.

**Legal Requirements:** We may disclose information if required by law, court order, or governmental authority.

**Business Transfers:** If Settle is acquired or merges with another company, your data may be transferred as part of that transaction. We will notify you beforehand.

We never share individual user data with landlords or property managers without your explicit consent (e.g., when you initiate a "Send Message" action).`,
  },
  {
    title: '4. Cookies & Tracking',
    body: `Settle uses browser localStorage to persist your session and preference data locally on your device. We do not use third-party advertising cookies.

We may use anonymized, aggregated analytics (e.g., page view counts) to understand how users interact with the platform. This data cannot be used to identify individual users.

You can clear your localStorage at any time through your browser settings. This will log you out and reset your saved preferences.`,
  },
  {
    title: '5. Data Retention',
    body: `We retain your account data for as long as your account is active. If you delete your account, we will delete or anonymize your personal data within 30 days, except where we are legally required to retain it longer.

Interaction history (viewed listings, search queries) is retained for 12 months by default and is used to improve your recommendations. You can request earlier deletion by contacting support@settle.com.`,
  },
  {
    title: '6. Your Rights',
    body: `You have the right to:

- **Access** the personal data we hold about you
- **Correct** inaccurate information in your account
- **Delete** your account and associated personal data
- **Export** your preference data in a portable format
- **Opt out** of non-essential communications at any time via Settings → Notifications

To exercise any of these rights, email support@settle.com with the subject line "Privacy Request." We will respond within 30 days.`,
  },
  {
    title: '7. Children\'s Privacy',
    body: `Settle is not intended for use by individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a minor, please contact us immediately at support@settle.com.`,
  },
  {
    title: '8. Changes to This Policy',
    body: `We may update this Privacy Policy from time to time. When we do, we will update the "Effective Date" at the top and notify you via email or an in-app notification if the changes are material. Continued use of Settle after the effective date constitutes acceptance of the updated policy.`,
  },
  {
    title: '9. Contact Us',
    body: `If you have questions about this Privacy Policy or how we handle your data, please contact us:

**Email:** support@settle.com
**Address:** Settle Digital Curator, Dallas, TX
**Response time:** Within 2 business days`,
  },
];

export default function Privacy({ onNavigate }) {
  return (
    <div className="pt-32 pb-24 px-8 max-w-screen-lg mx-auto w-full">

      <header className="mb-12">
        <h1 className="text-6xl font-extrabold tracking-tight text-on-surface mb-4">Privacy Policy</h1>
        <p className="text-on-surface-variant font-medium">
          <span className="font-bold">Effective Date:</span> April 9, 2026 · Last updated April 9, 2026
        </p>
      </header>

      <div className="bg-primary/5 rounded-xl p-8 mb-12 editorial-shadow">
        <div className="flex items-start gap-4">
          <span className="material-symbols-outlined text-primary text-[24px] shrink-0 mt-0.5">info</span>
          <p className="text-on-surface font-medium leading-relaxed">
            Settle ("we," "our," or "us") is committed to protecting your privacy. This policy explains what data we collect, how we use it, and your rights. If you have questions, email <span className="font-bold text-primary">support@settle.com</span>.
          </p>
        </div>
      </div>

      <div className="space-y-10">
        {SECTIONS.map(({ title, body }) => (
          <section key={title} className="bg-surface-container-low p-8 rounded-xl editorial-shadow">
            <h2 className="text-xl font-bold text-on-surface mb-5">{title}</h2>
            <div className="space-y-3">
              {body.split('\n\n').map((para, i) => (
                <p key={i} className="text-on-surface-variant font-medium leading-relaxed text-[0.9375rem]">
                  {para.split('**').map((chunk, j) =>
                    j % 2 === 1 ? <strong key={j} className="font-bold text-on-surface">{chunk}</strong> : chunk
                  )}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-12 flex gap-4 justify-center">
        <button onClick={() => onNavigate('/terms')} className="text-primary font-bold hover:underline text-sm">
          Terms of Service →
        </button>
        <button onClick={() => onNavigate('/contact')} className="text-primary font-bold hover:underline text-sm">
          Contact Us →
        </button>
      </div>
    </div>
  );
}
