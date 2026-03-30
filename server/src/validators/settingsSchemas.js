import { z } from 'zod';

export const updateSettingsSchema = z.object({
  branding: z.object({
    siteName: z.string().optional(),
    tagline: z.string().optional(),
    logo: z.object({ url: z.string().optional(), altText: z.string().optional() }).optional(),
    favicon: z.string().optional(),
  }).optional(),
  theme: z.object({
    colors: z.record(z.string()).optional(),
    fonts: z.object({ heading: z.string().optional(), body: z.string().optional() }).optional(),
  }).optional(),
  navigation: z.any().optional(),
  footer: z.any().optional(),
  contact: z.object({
    email: z.string().optional(),
    phone: z.string().optional(),
    whatsapp: z.string().optional(),
    address: z.string().optional(),
  }).optional(),
}).strict();
