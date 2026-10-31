import { Request, Response, NextFunction } from 'express';
import { pool } from '../db/pool.js';

// Extend Express Request type to include authenticated user info
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

/**
 * ⚠️ TEMPORARY MIDDLEWARE FOR PHASE 3
 * REPLACE WITH JWT MIDDLEWARE IN PHASE 4
 *
 * Scopes incoming requests to the default demo user ('alex@example.com')
 * so all task CRUD operations are strictly parameterized by req.user.id.
 */
export async function mockAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const demoEmail = 'alex@example.com';
    const result = await pool.query<AuthUser>(
      'SELECT id, name, email, role FROM users WHERE email = $1 LIMIT 1',
      [demoEmail]
    );

    if (result.rows.length === 0) {
      // In case the DB was migrated but not yet seeded, create a fallback demo user record
      const insertResult = await pool.query<AuthUser>(
        `INSERT INTO users (name, email, password_hash, role)
         VALUES ($1, $2, $3, $4)
         RETURNING id, name, email, role`,
        ['Alex Morgan', demoEmail, 'temporary_hash', 'user']
      );
      req.user = insertResult.rows[0];
    } else {
      req.user = result.rows[0];
    }

    next();
  } catch (error) {
    next(error);
  }
}
