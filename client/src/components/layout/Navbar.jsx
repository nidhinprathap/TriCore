import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext.jsx';
import Button from '../ui/Button.jsx';
import Logo from '../ui/Logo.jsx';

const Navbar = () => {
  const { settings } = useSiteSettings();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const nav = settings?.navigation;

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header className={`sticky top-0 z-50 flex items-center justify-between px-6 md:px-16 py-5 border-b border-tc-border/50 transition-all duration-200 ${scrolled ? 'header-blur' : ''}`}>
      <Link to="/" className="flex items-center">
        <Logo size="md" />
      </Link>

      <nav className="hidden md:flex items-center gap-8">
        {[...(nav?.links || [])].sort((a, b) => a.order - b.order).map((link) => (
          <Link
            key={link.href}
            to={link.href}
            className="text-xs font-medium tracking-[2px] uppercase text-tc-muted hover:text-tc-primary transition-colors"
          >
            {link.label}
          </Link>
        ))}
        {nav?.ctaButton?.enabled && (
          <Link to={nav.ctaButton.href}>
            <Button size="sm">{nav.ctaButton.label}</Button>
          </Link>
        )}
      </nav>

      <button className="md:hidden text-white" onClick={() => setMobileOpen(!mobileOpen)}>
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {mobileOpen && (
        <div className="absolute top-[72px] left-0 right-0 bg-tc-bg border-b border-tc-border p-6 flex flex-col gap-4 z-50 md:hidden">
          {[...(nav?.links || [])].sort((a, b) => a.order - b.order).map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="text-sm font-medium tracking-[2px] uppercase text-tc-muted hover:text-tc-primary"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default Navbar;
