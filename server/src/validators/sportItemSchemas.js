import { z } from 'zod';

export const createSportItemSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  category: z.string().optional(),
  type: z.enum(['individual', 'team', 'group']),
  fee: z.number().min(0).optional(),
  maxParticipants: z.number().optional(),
  teamSize: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
  }).optional(),
  ageRestriction: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
  }).optional(),
  gender: z.enum(['any', 'male', 'female']).optional(),
  enabled: z.boolean().optional(),
  order: z.number().optional(),
});

export const updateSportItemSchema = createSportItemSchema.partial();
