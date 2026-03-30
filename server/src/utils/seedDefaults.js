import mongoose from 'mongoose';
import config from '../config/env.js';
import SiteSettings from '../models/SiteSettings.js';
import PageContent from '../models/PageContent.js';
import User from '../models/User.js';

const seedSiteSettings = async () => {
  const exists = await SiteSettings.findOne();
  if (exists) return console.log('SiteSettings already seeded');

  await SiteSettings.create({
    branding: {
      siteName: 'TriCore Events',
      tagline: 'Where Every Event Becomes an Experience',
    },
    navigation: {
      links: [
        { label: 'Home', href: '/', order: 0 },
        { label: 'About', href: '/about', order: 1 },
        { label: 'Events', href: '/events', order: 2 },
        { label: 'Corporate', href: '/corporate', order: 3 },
        { label: 'Contact', href: '/contact', order: 4 },
      ],
    },
    footer: {
      columns: [
        {
          title: 'Company',
          links: [
            { label: 'About Us', href: '/about' },
            { label: 'Contact', href: '/contact' },
          ],
        },
        {
          title: 'Events',
          links: [
            { label: 'Upcoming', href: '/events' },
            { label: 'Corporate', href: '/corporate' },
          ],
        },
      ],
      socialLinks: [
        { platform: 'instagram', url: 'https://instagram.com/tricore' },
        { platform: 'linkedin', url: 'https://linkedin.com/company/tricore' },
      ],
    },
    contact: {
      email: 'info@tricore.in',
      phone: '+91 98765 43210',
    },
  });
  console.log('SiteSettings seeded');
};

const seedPages = async () => {
  const pages = [
    {
      slug: 'home',
      title: 'Home',
      sections: [
        { type: 'hero', order: 0, enabled: true, data: { headline: 'Where Every Event Becomes an Experience', subheadline: 'Sports tournaments. Corporate events. Community competitions.', ctaLabel: 'Explore Events', ctaHref: '/events' } },
        { type: 'service-pillars', order: 1, enabled: true, data: { title: 'What We Do', pillars: [{ icon: 'trophy', title: 'Sports Tournaments', description: 'Professional-grade sporting events' }, { icon: 'building', title: 'Corporate Events', description: 'Team building and corporate functions' }, { icon: 'users', title: 'Community Competitions', description: 'Local engagement and community events' }] } },
        { type: 'featured-events', order: 2, enabled: true, data: { title: 'Upcoming Events' } },
        { type: 'testimonials', order: 3, enabled: true, data: { title: 'What People Say' } },
        { type: 'final-cta', order: 4, enabled: true, data: { title: 'Ready to Create Something Extraordinary?', ctaLabel: 'Get in Touch', ctaHref: '/contact' } },
      ],
    },
    { slug: 'about', title: 'About Us', sections: [{ type: 'hero', order: 0, enabled: true, data: { headline: 'About TriCore Events', subheadline: 'The team behind unforgettable experiences' } }, { type: 'content-block', order: 1, enabled: true, data: { title: 'Our Story', body: 'TriCore Events was founded with a vision to transform how events are organized and experienced.' } }, { type: 'team', order: 2, enabled: true, data: { title: 'Our Team', members: [] } }] },
    { slug: 'corporate', title: 'Corporate Events', sections: [{ type: 'hero', order: 0, enabled: true, data: { headline: 'Corporate Events', subheadline: 'Elevate your team with world-class events' } }, { type: 'content-block', order: 1, enabled: true, data: { title: 'Why TriCore for Corporate', body: 'We specialize in creating meaningful corporate experiences.' } }] },
    { slug: 'contact', title: 'Contact', sections: [{ type: 'hero', order: 0, enabled: true, data: { headline: 'Contact Us' } }, { type: 'contact-form', order: 1, enabled: true, data: {} }] },
  ];

  for (const page of pages) {
    const exists = await PageContent.findOne({ slug: page.slug });
    if (!exists) await PageContent.create(page);
  }
  console.log('Pages seeded');
};

const seedAdminUser = async () => {
  const exists = await User.findOne({ email: 'admin@tricore.in' });
  if (exists) return console.log('Admin user already exists');

  await User.create({
    name: 'Admin',
    email: 'admin@tricore.in',
    password: 'Admin@123',
    role: 'admin',
  });
  console.log('Admin user seeded (admin@tricore.in / Admin@123)');
};

const seed = async () => {
  await mongoose.connect(config.mongoUri);
  console.log('Connected to MongoDB for seeding');

  await seedSiteSettings();
  await seedPages();
  await seedAdminUser();

  await mongoose.disconnect();
  console.log('Seeding complete');
};

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
