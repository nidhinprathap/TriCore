import { Link } from 'react-router-dom';
import { useSiteSettings } from '../../context/SiteSettingsContext.jsx';
import Logo from '../ui/Logo.jsx';

const Footer = () => {
  const { settings } = useSiteSettings();
  const footer = settings?.footer;
  const contact = settings?.contact;

  return (
    <footer className="border-t border-tc-border bg-tc-bg">
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <div className="mb-4">
              <Logo size="md" />
            </div>
            {contact?.email && <p className="text-sm text-tc-muted">{contact.email}</p>}
            {contact?.phone && <p className="text-sm text-tc-muted">{contact.phone}</p>}
          </div>
          {footer?.columns?.map((col, i) => (
            <div key={i}>
              <h4 className="text-[10px] font-bold tracking-[2px] uppercase text-tc-dim mb-4">{col.title}</h4>
              <div className="flex flex-col gap-2">
                {col.links?.map((link, j) => (
                  <Link key={j} to={link.href} className="text-sm text-tc-muted hover:text-tc-primary transition-colors">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-6 border-t border-tc-border text-center">
          <p className="text-xs text-tc-dim">{footer?.bottomText || '© 2026 TriCore Events. All rights reserved.'}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
