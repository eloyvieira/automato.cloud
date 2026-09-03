import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(72),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const symbolSchema = z.string().min(1).max(20).regex(/^[A-Z0-9]+$/);

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters')
      .max(72, 'New password must be at most 72 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'New password and confirmation do not match',
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    path: ['newPassword'],
    message: 'New password must be different from the current password',
  });

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name').max(100),
  email: z.string().trim().email('Please enter a valid e-mail address').max(190),
  subject: z.string().trim().min(3, 'Please enter a subject').max(150),
  message: z
    .string()
    .trim()
    .min(10, 'Please write at least 10 characters')
    .max(5000, 'Message is too long'),
});
