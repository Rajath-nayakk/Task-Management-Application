import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export class AppError extends Error {
  statusCode: number;
  code?: string;
  details?: any;

  constructor(message: string, statusCode = 500, code?: string, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Handle Zod Validation Errors
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));

    return res.status(400).json({
      success: false,
      error: {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: formattedErrors,
      },
    });
  }

  // Handle custom AppErrors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        code: err.code || 'APP_ERROR',
        details: err.details,
      },
    });
  }

  // Handle PostgreSQL syntax or constraint errors
  if (err.code === '23505') {
    return res.status(409).json({
      success: false,
      error: {
        message: 'A resource with this identifier already exists.',
        code: 'CONFLICT',
      },
    });
  }

  if (err.code === '22P02') {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Invalid UUID format in request parameters.',
        code: 'INVALID_ID_FORMAT',
      },
    });
  }

  // Generic 500 Internal Server Error
  console.error('[Centralized Error Handler]:', err);
  return res.status(err.statusCode || 500).json({
    success: false,
    error: {
      message: err.message || 'An unexpected internal server error occurred.',
      code: err.code || 'INTERNAL_SERVER_ERROR',
    },
  });
}
