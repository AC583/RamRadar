import { z } from 'zod';

export const createActivitySchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(60, 'Title cannot exceed 60 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description cannot exceed 500 characters'),
  category: z.enum([
    'study',
    'social',
    'sports',
    'clubs',
    'academic',
    'campus-events',
    'other',
  ]),
  campus: z.enum(['rose-hill', 'lincoln-center']),
  locationId: z.string().min(1, 'Please select a campus location'),
  customLocationDetails: z.string().max(100).optional(),
  startDate: z.string().min(1, 'Start date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endDate: z.string().optional(),
  endTime: z.string().optional(),
  maxParticipants: z
    .preprocess((val) => {
      if (
        val === '' ||
        val === null ||
        val === undefined ||
        (typeof val === 'number' && isNaN(val))
      ) {
        return undefined;
      }
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    }, z.number().int('Capacity must be an integer').positive('Capacity must be at least 1').optional()),
});

export type CreateActivityFormData = z.infer<typeof createActivitySchema>;
