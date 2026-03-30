import { z } from 'zod';

export const createEventSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  tagline: z.string().optional(),
  description: z.string().optional(),
  coverImage: z.string().optional(),
  category: z.enum(['sports', 'corporate', 'community']),
  status: z.enum(['draft', 'published', 'archived', 'cancelled']).optional(),
  dates: z.object({
    start: z.string(),
    end: z.string().optional(),
    registrationDeadline: z.string().optional(),
  }),
  venue: z.object({
    name: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    mapUrl: z.string().optional(),
  }).optional(),
  registration: z.object({
    enabled: z.boolean().optional(),
    maxParticipants: z.number().optional(),
    requiresApproval: z.boolean().optional(),
  }).optional(),
  schedule: z.array(z.object({ time: z.string(), activity: z.string(), description: z.string().optional() })).optional(),
  rules: z.array(z.string()).optional(),
  prizes: z.array(z.object({ position: z.string(), prize: z.string(), amount: z.number().optional() })).optional(),
  sponsors: z.array(z.object({ name: z.string(), logo: z.string().optional(), url: z.string().optional(), tier: z.enum(['title', 'gold', 'silver', 'bronze']).optional() })).optional(),
  contacts: z.array(z.object({ name: z.string(), role: z.string().optional(), phone: z.string().optional(), email: z.string().optional() })).optional(),
  featured: z.boolean().optional(),
});

export const updateEventSchema = createEventSchema.partial();

export const statusUpdateSchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected', 'waitlisted', 'cancelled']),
});
