import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { pool } from '../db/pool.js';
import { registerSchema, loginSchema } from '../validation/auth.js';
import { generateToken, setAuthCookie, clearAuthCookie } from '../utils/token.js';
import { authenticateToken } from '../middleware/auth.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';

export const authRouter = Router();

/**
 * POST /api/auth/register
 * Registers a new user. Role is always set to 'user' on the server.
 */
authRouter.post('/register', authRateLimiter, async (req: Request, res: Response): Promise<void> => {
  const validation = registerSchema.safeParse(req.body);
  if (!validation.success) {
    res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: validation.error.format(),
    });
    return;
  }

  const { name, email, password } = validation.data;

  try {
    // 1. Check if user already exists
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      res.status(409).json({
        success: false,
        error: 'An account with this email address already exists.',
      });
      return;
    }

    // 2. Hash password with bcrypt (10 rounds)
    const passwordHash = await bcrypt.hash(password, 10);

    // 3. Insert user into database with role strictly set to 'user'
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, 'user')
       RETURNING id, name, email, role, created_at as "createdAt"`,
      [name, email, passwordHash]
    );

    const user = result.rows[0];

    // 4. Issue JWT token and set in httpOnly cookie
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });
    setAuthCookie(res, token);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: user,
    });
  } catch (err: any) {
    console.error('Registration error:', err.message);
    res.status(500).json({
      success: false,
      error: 'Failed to create account. Please try again.',
    });
  }
});

/**
 * POST /api/auth/login
 * Authenticates user, issues JWT in httpOnly cookie. Generic error message on failure.
 */
authRouter.post('/login', authRateLimiter, async (req: Request, res: Response): Promise<void> => {
  const validation = loginSchema.safeParse(req.body);
  if (!validation.success) {
    res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: validation.error.format(),
    });
    return;
  }

  const { email, password } = validation.data;

  try {
    // 1. Look up user by email
    const result = await pool.query(
      `SELECT id, name, email, password_hash, role, created_at as "createdAt"
       FROM users WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      // Generic error message prevents username/email enumeration
      res.status(401).json({
        success: false,
        error: 'Invalid email or password.',
      });
      return;
    }

    const user = result.rows[0];

    // 2. Compare password hash
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        error: 'Invalid email or password.',
      });
      return;
    }

    // 3. Issue JWT token and set httpOnly cookie
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });
    setAuthCookie(res, token);

    // Don't return password_hash to the client
    const { password_hash, ...safeUser } = user;

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: safeUser,
    });
  } catch (err: any) {
    console.error('Login error:', err.message);
    res.status(500).json({
      success: false,
      error: 'Failed to authenticate. Please try again.',
    });
  }
});

/**
 * POST /api/auth/logout
 * Clears authentication cookie
 */
authRouter.post('/logout', (req: Request, res: Response): void => {
  clearAuthCookie(res);
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

/**
 * GET /api/auth/me
 * Retrieves profile of currently authenticated operative
 */
authRouter.get('/me', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, role, created_at as "createdAt"
       FROM users WHERE id = $1`,
      [req.user!.userId]
    );

    if (result.rows.length === 0) {
      clearAuthCookie(res);
      res.status(401).json({
        success: false,
        error: 'User account no longer exists.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (err: any) {
    console.error('Auth/me error:', err.message);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve session data.',
    });
  }
});
