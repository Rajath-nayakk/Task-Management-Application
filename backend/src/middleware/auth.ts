import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { COOKIE_NAME, UserPayload } from '../utils/token.js';

// Extend Express Request type to include user payload
declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  // 1. Try reading from httpOnly cookie first
  let token = req.cookies ? req.cookies[COOKIE_NAME] : undefined;

  // 2. Fallback to Authorization header Bearer token
  if (!token && req.headers.authorization) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
      token = parts[1];
    }
  }

  if (!token) {
    res.status(401).json({
      success: false,
      error: 'Authentication required. Please sign in.',
    });
    return;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    res.status(500).json({
      success: false,
      error: 'Server authentication configuration error.',
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, secret) as UserPayload;
    req.user = decoded;
    next();
  } catch (err: any) {
    res.status(401).json({
      success: false,
      error: 'Invalid or expired authentication session. Please sign in again.',
    });
  }
};

export const requireRole = (requiredRole: 'admin' | 'user') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required.',
      });
      return;
    }

    if (req.user.role !== requiredRole && req.user.role !== 'admin') {
      res.status(403).json({
        success: false,
        error: `Clearance denied. Requires ${requiredRole} role.`,
      });
      return;
    }

    next();
  };
};
