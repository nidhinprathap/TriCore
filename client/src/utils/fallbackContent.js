export const fallbackSettings = {
  branding: {
    siteName: 'TriCore Events',
    tagline: 'Where Every Event Becomes an Experience',
    logo: { url: '', altText: 'TriCore Events' },
  },
  theme: {
    colors: {
      primary: '#D4AF37', accent: '#D4AF37', background: '#0A0A0A', surface: '#141414',
      surfaceAlt: '#1A1A1A', text: '#FFFFFF', textMuted: '#A0A0A0', border: '#2A2A2A',
    },
    fonts: { heading: 'Space Grotesk', body: 'Space Grotesk' },
  },
  navigation: {
    links: [
      { label: 'Home', href: '/', order: 0 },
      { label: 'About', href: '/about', order: 1 },
      { label: 'Events', href: '/events', order: 2 },
      { label: 'Contact', href: '/contact', order: 3 },
    ],
    ctaButton: { label: 'Contact Us', href: '/contact', enabled: true },
  },
  footer: { columns: [], socialLinks: [], bottomText: '© 2026 TriCore Events. All rights reserved.' },
  contact: {},
};
