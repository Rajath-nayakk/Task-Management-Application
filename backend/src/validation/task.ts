import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .trim()
    .min(2, 'Title must be at least 2 characters long')
    .max(100, 'Title cannot exceed 100 characters'),
  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters')
    .optional()
    .nullable()
    .or(z.literal('')),
  priority: z.enum(['low', 'medium', 'high'], {
    errorMap: () => ({ message: 'Priority must be low, medium, or high' }),
  }),
  status: z
    .enum(['todo', 'in-progress', 'done'], {
      errorMap: () => ({ message: 'Status must be todo, in-progress, or done' }),
    })
    .default('todo'),
  dueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Due date must be in YYYY-MM-DD format')
    .optional()
    .nullable()
    .or(z.literal('')),
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, 'Title must be at least 2 characters long')
    .max(100, 'Title cannot exceed 100 characters')
    .optional(),
  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters')
    .optional()
    .nullable()
    .or(z.literal('')),
  priority: z
    .enum(['low', 'medium', 'high'], {
      errorMap: () => ({ message: 'Priority must be low, medium, or high' }),
    })
    .optional(),
  status: z
    .enum(['todo', 'in-progress', 'done'], {
      errorMap: () => ({ message: 'Status must be todo, in-progress, or done' }),
    })
    .optional(),
  dueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Due date must be in YYYY-MM-DD format')
    .optional()
    .nullable()
    .or(z.literal('')),
  completed: z.boolean().optional(),
});

export const taskQuerySchema = z.object({
  status: z.enum(['todo', 'in-progress', 'done', 'all']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'all']).optional(),
  search: z.string().optional(),
  sort: z
    .enum([
      'dueDate-asc',
      'dueDate-desc',
      'priority-desc',
      'priority-asc',
      'created-desc',
      'created-asc',
    ])
    .optional(),
});
