import jwt from 'jsonwebtoken';
import { Response, CookieOptions } from 'express';

export interface UserPayload {
  id: string;
  userId: string;
  email: string;
  role: 'user' | 'admin';
}

export const COOKIE_NAME = 'taskbuddy_token';

export const getCookieOptions = (): CookieOptions => {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  };
};

export const generateToken = (payload: { userId: string; email: string; role: 'user' | 'admin'; id?: string }): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured in backend/.env');
  }
  return jwt.sign(
    {
      id: payload.userId,
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    },
    secret,
    { expiresIn: '7d' }
  );
};

export const setAuthCookie = (res: Response, token: string): void => {
  res.cookie(COOKIE_NAME, token, getCookieOptions());
};

export const clearAuthCookie = (res: Response): void => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
  });
};
