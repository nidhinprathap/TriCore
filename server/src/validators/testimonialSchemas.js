import { z } from 'zod';

export const createTestimonialSchema = z.object({
  name: z.string().min(1),
  role: z.string().optional(),
  company: z.string().optional(),
  content: z.string().min(1),
  avatar: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
  status: z.enum(['pending', 'approved', 'rejected']).optional(),
  featured: z.boolean().optional(),
});

export const updateTestimonialSchema = createTestimonialSchema.partial();
