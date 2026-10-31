import { Router, Request, Response, NextFunction } from 'express';
import { pool } from '../db/pool.js';
import { AppError } from '../middleware/errorHandler.js';
import { createTaskSchema, updateTaskSchema, taskQuerySchema } from '../validation/task.js';
import { emitTaskEvent } from '../realtime/emitter.js';

const router = Router();

/**
 * GET /api/tasks/stats
 * Returns statistics for the authenticated user's tasks
 * Must be registered BEFORE /api/tasks/:id to avoid route collision!
 */
router.get('/stats', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;

    const query = `
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE completed = TRUE OR status = 'done')::int AS completed,
        COUNT(*) FILTER (WHERE completed = FALSE AND status != 'done')::int AS pending,
        COUNT(*) FILTER (WHERE status = 'in-progress')::int AS in_progress,
        COUNT(*) FILTER (WHERE status = 'todo')::int AS todo,
        COUNT(*) FILTER (WHERE completed = FALSE AND status != 'done' AND due_date < CURRENT_DATE)::int AS overdue
      FROM tasks
      WHERE user_id = $1
    `;

    const result = await pool.query(query, [userId]);
    const row = result.rows[0];

    const total = row.total || 0;
    const completed = row.completed || 0;
    const pending = row.pending || 0;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    return res.status(200).json({
      success: true,
      data: {
        total,
        completed,
        pending,
        inProgress: row.in_progress || 0,
        todo: row.todo || 0,
        overdue: row.overdue || 0,
        percent,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/tasks
 * Supports query parameters: ?status=&priority=&search=&sort=
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const queryParams = taskQuerySchema.parse(req.query);

    const conditions: string[] = ['user_id = $1'];
    const values: any[] = [userId];
    let paramIndex = 2;

    if (queryParams.status && queryParams.status !== 'all') {
      conditions.push(`status = $${paramIndex}`);
      values.push(queryParams.status);
      paramIndex++;
    }

    if (queryParams.priority && queryParams.priority !== 'all') {
      conditions.push(`priority = $${paramIndex}`);
      values.push(queryParams.priority);
      paramIndex++;
    }

    if (queryParams.search && queryParams.search.trim() !== '') {
      conditions.push(`(title ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`);
      values.push(`%${queryParams.search.trim()}%`);
      paramIndex++;
    }

    let orderBy = 'ORDER BY created_at DESC';
    if (queryParams.sort) {
      switch (queryParams.sort) {
        case 'dueDate-asc':
          orderBy = 'ORDER BY due_date ASC NULLS LAST, created_at DESC';
          break;
        case 'dueDate-desc':
          orderBy = 'ORDER BY due_date DESC NULLS LAST, created_at DESC';
          break;
        case 'priority-desc':
          orderBy = `ORDER BY CASE priority WHEN 'high' THEN 3 WHEN 'medium' THEN 2 WHEN 'low' THEN 1 ELSE 0 END DESC, created_at DESC`;
          break;
        case 'priority-asc':
          orderBy = `ORDER BY CASE priority WHEN 'high' THEN 3 WHEN 'medium' THEN 2 WHEN 'low' THEN 1 ELSE 0 END ASC, created_at DESC`;
          break;
        case 'created-asc':
          orderBy = 'ORDER BY created_at ASC';
          break;
        case 'created-desc':
        default:
          orderBy = 'ORDER BY created_at DESC';
          break;
      }
    }

    const sql = `
      SELECT
        id,
        user_id AS "userId",
        title,
        description,
        priority,
        status,
        TO_CHAR(due_date, 'YYYY-MM-DD') AS "dueDate",
        completed,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM tasks
      WHERE ${conditions.join(' AND ')}
      ${orderBy}
    `;

    const result = await pool.query(sql, values);

    return res.status(200).json({
      success: true,
      data: result.rows,
      meta: {
        count: result.rows.length,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/tasks/:id
 * Retrieve a single task owned by authenticated user
 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const taskId = req.params.id;

    const sql = `
      SELECT
        id,
        user_id AS "userId",
        title,
        description,
        priority,
        status,
        TO_CHAR(due_date, 'YYYY-MM-DD') AS "dueDate",
        completed,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM tasks
      WHERE id = $1 AND user_id = $2
    `;

    const result = await pool.query(sql, [taskId, userId]);

    if (result.rows.length === 0) {
      throw new AppError('Task not found', 404, 'NOT_FOUND');
    }

    return res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/tasks
 * Create a new task for the authenticated user
 */
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const body = createTaskSchema.parse(req.body);

    const isCompleted = body.status === 'done';
    const dueDate = body.dueDate && body.dueDate !== '' ? body.dueDate : null;

    const sql = `
      INSERT INTO tasks (user_id, title, description, priority, status, due_date, completed)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING
        id,
        user_id AS "userId",
        title,
        description,
        priority,
        status,
        TO_CHAR(due_date, 'YYYY-MM-DD') AS "dueDate",
        completed,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `;

    const result = await pool.query(sql, [
      userId,
      body.title,
      body.description || null,
      body.priority,
      body.status,
      dueDate,
      isCompleted,
    ]);

    const createdTask = result.rows[0];
    emitTaskEvent(userId, 'task:created', createdTask);

    return res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: createdTask,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/tasks/:id
 * Full update of an existing task owned by user
 */
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const taskId = req.params.id;
    const body = updateTaskSchema.parse(req.body);

    // Verify task exists and belongs to user
    const checkResult = await pool.query(
      'SELECT id, user_id FROM tasks WHERE id = $1',
      [taskId]
    );

    if (checkResult.rows.length === 0 || checkResult.rows[0].user_id !== userId) {
      throw new AppError('Task not found', 404, 'NOT_FOUND');
    }

    const isCompleted =
      body.completed !== undefined ? body.completed : body.status === 'done';
    const dueDate = body.dueDate !== undefined ? (body.dueDate === '' ? null : body.dueDate) : undefined;

    const sql = `
      UPDATE tasks
      SET
        title = COALESCE($1, title),
        description = CASE WHEN $2::text IS NOT NULL THEN $2 ELSE description END,
        priority = COALESCE($3, priority),
        status = COALESCE($4, status),
        due_date = CASE WHEN $5::text IS NOT NULL THEN $5::date ELSE due_date END,
        completed = COALESCE($6, completed),
        updated_at = NOW()
      WHERE id = $7 AND user_id = $8
      RETURNING
        id,
        user_id AS "userId",
        title,
        description,
        priority,
        status,
        TO_CHAR(due_date, 'YYYY-MM-DD') AS "dueDate",
        completed,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `;

    const result = await pool.query(sql, [
      body.title,
      body.description,
      body.priority,
      body.status,
      dueDate,
      isCompleted,
      taskId,
      userId,
    ]);

    const updatedTask = result.rows[0];
    emitTaskEvent(userId, 'task:updated', updatedTask);

    return res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/tasks/:id/toggle
 * Toggle completion status of a task
 */
router.patch('/:id/toggle', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const taskId = req.params.id;

    // Verify ownership
    const checkResult = await pool.query(
      'SELECT id, user_id, completed, status FROM tasks WHERE id = $1',
      [taskId]
    );

    if (checkResult.rows.length === 0 || checkResult.rows[0].user_id !== userId) {
      throw new AppError('Task not found', 404, 'NOT_FOUND');
    }

    const currentTask = checkResult.rows[0];
    const newCompleted = !currentTask.completed;
    const newStatus = newCompleted ? 'done' : 'todo';

    const sql = `
      UPDATE tasks
      SET
        completed = $1,
        status = $2,
        updated_at = NOW()
      WHERE id = $3 AND user_id = $4
      RETURNING
        id,
        user_id AS "userId",
        title,
        description,
        priority,
        status,
        TO_CHAR(due_date, 'YYYY-MM-DD') AS "dueDate",
        completed,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `;

    const result = await pool.query(sql, [newCompleted, newStatus, taskId, userId]);
    const updatedTask = result.rows[0];
    emitTaskEvent(userId, 'task:updated', updatedTask);

    return res.status(200).json({
      success: true,
      message: `Task marked as ${newCompleted ? 'completed' : 'incomplete'}`,
      data: updatedTask,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/tasks/:id
 * Delete a single task owned by user
 */
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const taskId = req.params.id;

    const checkResult = await pool.query(
      'SELECT id, user_id, title FROM tasks WHERE id = $1',
      [taskId]
    );

    if (checkResult.rows.length === 0 || checkResult.rows[0].user_id !== userId) {
      throw new AppError('Task not found', 404, 'NOT_FOUND');
    }

    await pool.query('DELETE FROM tasks WHERE id = $1 AND user_id = $2', [taskId, userId]);
    emitTaskEvent(userId, 'task:deleted', { id: taskId });

    return res.status(200).json({
      success: true,
      message: `Task "${checkResult.rows[0].title}" deleted successfully`,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/tasks
 * Clear ALL tasks of the authenticated user
 */
router.delete('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;

    const result = await pool.query(
      'DELETE FROM tasks WHERE user_id = $1 RETURNING id',
      [userId]
    );

    emitTaskEvent(userId, 'task:cleared', { deletedCount: result.rowCount });

    return res.status(200).json({
      success: true,
      message: `Cleared all ${result.rowCount} tasks successfully`,
      data: {
        deletedCount: result.rowCount,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
