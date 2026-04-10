const SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    body: `By accessing or using Settle ("the Platform"), you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, do not use the Platform.

These Terms apply to all visitors, registered users, and anyone who accesses or uses the Platform in any capacity. Settle reserves the right to update these Terms at any time. Continued use after changes are posted constitutes acceptance.`,
  },
  {
    title: '2. Eligibility',
    body: `You must be at least 18 years of age to create an account or use the Platform. By using Settle, you represent and warrant that you meet this requirement.

Settle is intended for use by individuals seeking residential rental housing. Commercial use, scraping, or automated access without prior written authorization is strictly prohibited.`,
  },
  {
    title: '3. User Accounts',
    body: `**Registration:** You must provide accurate and complete information when creating your account. You are responsible for maintaining the confidentiality of your password.

**Account Security:** You agree to notify us immediately at support@settle.com if you suspect unauthorized use of your account. Settle is not liable for losses arising from unauthorized account access caused by your failure to secure your credentials.

**Termination:** We reserve the right to suspend or terminate your account at any time, with or without notice, for violation of these Terms or for any other reason at our sole discretion.`,
  },
  {
    title: '4. Permitted Use',
    body: `You may use Settle to:

- Search for and browse residential rental listings
- Save listings to your favorites
- Submit tour requests to property managers
- Adjust your recommendation preferences
- Submit maintenance requests (where applicable)

You may not use Settle to:

- Post false, misleading, or fraudulent content
- Harass, threaten, or harm other users or property managers
- Circumvent any security or access controls
- Use automated tools (bots, scrapers) to collect data
- Reproduce, redistribute, or resell any Platform content without permission`,
  },
  {
    title: '5. Listing Accuracy & Disclaimer',
    body: `Settle aggregates listing data from Zillow and other third-party providers. While we strive for accuracy, we do not independently verify listing information and make no guarantees regarding:

- The accuracy, completeness, or timeliness of listing data
- The availability of listed units
- The accuracy of rent prices, fees, or availability dates
- The accuracy of safety scores or neighborhood data

**Always verify listing details directly with the property manager before making any housing decisions.** Settle is a discovery and recommendation tool — it is not a party to any rental agreement between you and a landlord.`,
  },
  {
    title: '6. Intellectual Property',
    body: `The Settle platform, including its design, recommendation algorithms, branding, and all content produced by Settle (excluding third-party listing data), is owned by Settle Digital Curator and is protected by applicable intellectual property laws.

You may not reproduce, modify, distribute, or create derivative works of any Settle content without prior written permission. User-submitted content (e.g., maintenance request descriptions) remains your property but grants Settle a non-exclusive license to use it to operate the service.`,
  },
  {
    title: '7. Third-Party Services',
    body: `Settle integrates with third-party services including Zillow, Crimeometer, and Yelp. Your use of these services through Settle is subject to their respective terms of service and privacy policies. Settle is not responsible for the practices or content of third-party services.

Links or references to third-party content within Settle do not constitute endorsement by Settle.`,
  },
  {
    title: '8. Limitation of Liability',
    body: `To the maximum extent permitted by law, Settle and its officers, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from:

- Your use of or inability to use the Platform
- Any listing inaccuracies or errors
- Unauthorized access to your account or data
- Any conduct of third parties on the Platform

Settle's total liability for any claim shall not exceed the greater of $100 or the amount you paid us in the 12 months prior to the claim.`,
  },
  {
    title: '9. Fair Housing Compliance',
    body: `Settle is committed to Fair Housing principles. We do not discriminate on the basis of race, color, national origin, religion, sex, familial status, disability, or any other protected class under applicable federal, state, or local law.

Our recommendation algorithm is designed to surface listings based on lifestyle and practical preferences only — never on demographic characteristics. If you believe you have experienced discrimination, please contact support@settle.com immediately.`,
  },
  {
    title: '10. Governing Law & Disputes',
    body: `These Terms are governed by the laws of the State of Texas, without regard to conflict of law principles. Any disputes arising from these Terms or your use of Settle shall be resolved through binding arbitration in Dallas, Texas, except that either party may seek injunctive relief in a court of competent jurisdiction.

**Class Action Waiver:** You agree to resolve disputes on an individual basis and waive any right to participate in class action lawsuits.`,
  },
  {
    title: '11. Contact',
    body: `For questions about these Terms, contact us at:

**Email:** support@settle.com
**Address:** Settle Digital Curator, Dallas, TX
**Response time:** Within 2 business days`,
  },
];

export default function Terms({ onNavigate }) {
  return (
    <div className="pt-32 pb-24 px-8 max-w-screen-lg mx-auto w-full">

      <header className="mb-12">
        <h1 className="text-6xl font-extrabold tracking-tight text-on-surface mb-4">Terms of Service</h1>
        <p className="text-on-surface-variant font-medium">
          <span className="font-bold">Effective Date:</span> April 9, 2026 · Last updated April 9, 2026
        </p>
      </header>

      <div className="bg-surface-container-low rounded-xl p-8 mb-12 editorial-shadow">
        <div className="flex items-start gap-4">
          <span className="material-symbols-outlined text-outline text-[24px] shrink-0 mt-0.5">gavel</span>
          <p className="text-on-surface font-medium leading-relaxed">
            Please read these Terms of Service carefully before using Settle. By creating an account or using the Platform, you agree to these terms. If you do not agree, please do not use Settle.
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
        <button onClick={() => onNavigate('/privacy')} className="text-primary font-bold hover:underline text-sm">
          Privacy Policy →
        </button>
        <button onClick={() => onNavigate('/contact')} className="text-primary font-bold hover:underline text-sm">
          Contact Us →
        </button>
      </div>
    </div>
  );
}
