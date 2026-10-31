import { Request, Response, NextFunction } from 'express';

/**
 * CSRF Protection middleware verifying Origin/Referer headers on state-changing requests.
 */
export const csrfProtection = (req: Request, res: Response, next: NextFunction): void => {
  // Safe HTTP methods do not change state
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  // Determine allowed origin from environment (default to FRONTEND_URL or local Vite dev)
  const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
  const originHeader = req.headers.origin || req.headers.referer;

  // In non-browser API clients (curl, automated tests) without Origin/Referer headers, allow if in development
  if (!originHeader) {
    if (process.env.NODE_ENV === 'production') {
      res.status(403).json({
        success: false,
        error: 'CSRF validation failed: Missing origin/referer header.',
      });
      return;
    }
    return next();
  }

  try {
    const originUrl = new URL(originHeader);
    const expectedUrl = new URL(allowedOrigin);

    if (originUrl.host !== expectedUrl.host && !originUrl.host.includes('localhost')) {
      res.status(403).json({
        success: false,
        error: 'CSRF validation failed: Request origin not allowed.',
      });
      return;
    }
  } catch {
    // If URL parsing fails
    if (process.env.NODE_ENV === 'production') {
      res.status(403).json({
        success: false,
        error: 'CSRF validation failed: Invalid origin format.',
      });
      return;
    }
  }

  next();
};
