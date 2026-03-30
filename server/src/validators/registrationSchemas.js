import { z } from 'zod';

export const createRegistrationSchema = z.object({
  sportItemId: z.string().min(1),
  type: z.enum(['individual', 'team', 'group']),
  teamName: z.string().optional(),
  teamMembers: z.array(z.object({
    name: z.string().min(1),
    email: z.string().optional(),
    phone: z.string().optional(),
    role: z.string().optional(),
  })).optional(),
  notes: z.string().optional(),
});

export const paymentConfirmSchema = z.object({
  razorpayOrderId: z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  razorpaySignature: z.string().min(1),
});
