export default function Footer() {
  const links = [
    { label: 'Privacy Policy',   href: '/privacy' },
    { label: 'Terms of Service', href: '/terms'   },
    { label: 'Fair Housing',     href: '/about'   },
    { label: 'Contact Us',       href: '/contact' },
    { label: 'FAQ',              href: '/faq'     },
  ];

  return (
    <footer className="w-full mt-auto bg-surface-container">
      <div className="flex flex-col md:flex-row justify-between items-center w-full px-8 py-8 gap-4 max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <img src="/ZillowLogo.png" alt="Zillow" className="h-4 w-4 rounded-full opacity-60" />
            <span className="text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-on-surface-variant">Settle</span>
          </div>
          <span className="text-[0.6875rem] font-medium tracking-wide text-outline">
            © 2026 Settle Digital Curator. Powered by Zillow.
          </span>
        </div>
        <div className="flex gap-6">
          {links.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="text-[0.6875rem] font-medium tracking-wide text-outline hover:text-primary hover:underline transition-all"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
