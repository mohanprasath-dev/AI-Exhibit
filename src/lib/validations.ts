import { z } from 'zod';

export const submitEntrySchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),
  category: z.string().min(1, 'Please select a category'),
  prompt: z
    .string()
    .min(10, 'Prompt must be at least 10 characters')
    .max(2000, 'Prompt must be less than 2000 characters'),
  tool_used: z.string().min(1, 'Please select an AI tool'),
  share_link: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters')
    .max(1000, 'Description must be less than 1000 characters'),
  creator_name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  creator_email: z.string().email('Please enter a valid email'),
  creator_social: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
});

export type SubmitEntryFormData = z.infer<typeof submitEntrySchema>;

export const voteSchema = z.object({
  entryId: z.string().uuid('Invalid entry ID'),
  deviceHash: z.string().min(10, 'Invalid device hash'),
});

export type VoteData = z.infer<typeof voteSchema>;

export const searchSchema = z.object({
  query: z.string().max(100).optional(),
  category: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(12),
  sortBy: z.enum(['votes', 'created_at', 'title']).default('created_at'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type SearchParams = z.infer<typeof searchSchema>;
