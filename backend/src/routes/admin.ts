import { Router, Request, Response } from 'express';
import { pool } from '../db/pool.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

export const adminRouter = Router();

// Protect all admin routes with authentication and admin role enforcement
adminRouter.use(authenticateToken);
adminRouter.use(requireRole('admin'));

/**
 * GET /api/admin/users
 * Returns directory of users with their task counts and completion ratios
 */
adminRouter.get('/users', async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query(`
      SELECT 
        u.id, 
        u.name, 
        u.email, 
        u.role, 
        u.created_at as "createdAt",
        COUNT(t.id)::int as "taskCount",
        COUNT(CASE WHEN t.completed = true OR t.status = 'done' THEN 1 END)::int as "completedCount"
      FROM users u
      LEFT JOIN tasks t ON u.id = t.user_id
      GROUP BY u.id
      ORDER BY u.created_at ASC
    `);

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (err: any) {
    console.error('Admin users error:', err.message);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve agent network directory.',
    });
  }
});

/**
 * GET /api/admin/tasks
 * Returns system-wide tasks with author telemetry
 */
adminRouter.get('/tasks', async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query(`
      SELECT 
        t.id,
        t.user_id as "userId",
        u.name as "userName",
        u.email as "userEmail",
        t.title,
        t.description,
        t.priority,
        t.status,
        t.due_date as "dueDate",
        t.completed,
        t.created_at as "createdAt",
        t.updated_at as "updatedAt"
      FROM tasks t
      JOIN users u ON t.user_id = u.id
      ORDER BY t.created_at DESC
    `);

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (err: any) {
    console.error('Admin tasks error:', err.message);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve system missions.',
    });
  }
});
