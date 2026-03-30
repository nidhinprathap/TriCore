import mongoose from 'mongoose';

const linkSchema = new mongoose.Schema({
  label: { type: String, required: true },
  href: { type: String, required: true },
  order: { type: Number, default: 0 },
  isExternal: { type: Boolean, default: false },
}, { _id: false });

const siteSettingsSchema = new mongoose.Schema({
  branding: {
    siteName: { type: String, default: 'TriCore Events' },
    tagline: { type: String, default: '' },
    logo: {
      url: { type: String, default: '' },
      altText: { type: String, default: 'TriCore Events' },
    },
    favicon: { type: String, default: '' },
  },
  theme: {
    colors: {
      primary: { type: String, default: '#D4AF37' },
      accent: { type: String, default: '#D4AF37' },
      background: { type: String, default: '#0A0A0A' },
      surface: { type: String, default: '#141414' },
      surfaceAlt: { type: String, default: '#1A1A1A' },
      text: { type: String, default: '#FFFFFF' },
      textMuted: { type: String, default: '#A0A0A0' },
      border: { type: String, default: '#2A2A2A' },
    },
    fonts: {
      heading: { type: String, default: 'Space Grotesk' },
      body: { type: String, default: 'Space Grotesk' },
    },
  },
  navigation: {
    links: [linkSchema],
    ctaButton: {
      label: { type: String, default: 'Contact Us' },
      href: { type: String, default: '/contact' },
      enabled: { type: Boolean, default: true },
    },
  },
  footer: {
    columns: [{
      title: String,
      links: [{ label: String, href: String }],
    }],
    socialLinks: [{
      platform: { type: String, enum: ['instagram', 'linkedin', 'twitter', 'whatsapp'] },
      url: String,
    }],
    bottomText: { type: String, default: '© 2026 TriCore Events. All rights reserved.' },
  },
  contact: {
    email: String,
    phone: String,
    whatsapp: String,
    address: String,
  },
  integrations: {
    razorpay: {
      enabled: { type: Boolean, default: false },
      keyId: { type: String, default: '' },
      keySecret: { type: String, default: '' },
    },
    google: {
      enabled: { type: Boolean, default: false },
      clientId: { type: String, default: '' },
    },
    smtp: {
      enabled: { type: Boolean, default: false },
      host: { type: String, default: '' },
      port: { type: Number, default: 587 },
      user: { type: String, default: '' },
      pass: { type: String, default: '' },
    },
    sms: {
      enabled: { type: Boolean, default: false },
      provider: { type: String, default: '' },
      apiKey: { type: String, default: '' },
      senderId: { type: String, default: '' },
    },
    whatsapp: {
      enabled: { type: Boolean, default: false },
      apiKey: { type: String, default: '' },
      phoneNumberId: { type: String, default: '' },
    },
  },
}, { timestamps: true });

export default mongoose.model('SiteSettings', siteSettingsSchema);
