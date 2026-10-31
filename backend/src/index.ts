import express, { Request, Response } from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { Server as SocketIOServer } from 'socket.io';
import tasksRouter from './routes/tasks.js';
import { authRouter } from './routes/auth.js';
import { adminRouter } from './routes/admin.js';
import { authenticateToken } from './middleware/auth.js';
import { csrfProtection } from './middleware/csrf.js';
import { generalRateLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// 1. Security Headers with Helmet
app.use(helmet());

// 2. Strict CORS restricted to FRONTEND_URL with credentials support
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// 3. Global Rate Limiter
app.use(generalRateLimiter);

// 4. Request body and cookie parsers
app.use(express.json());
app.use(cookieParser());

// 5. CSRF Protection for state-changing browser requests
app.use(csrfProtection);

import jwt from 'jsonwebtoken';
import { COOKIE_NAME, UserPayload } from './utils/token.js';

function parseCookies(cookieHeader?: string): Record<string, string> {
  const list: Record<string, string> = {};
  if (!cookieHeader) return list;

  cookieHeader.split(';').forEach((cookie) => {
    let [name, ...rest] = cookie.split('=');
    name = name?.trim();
    if (!name) return;
    const value = rest.join('=').trim();
    if (!value) return;
    list[name] = decodeURIComponent(value);
  });

  return list;
}

// 6. Socket.IO initialization with authenticated handshake
const io = new SocketIOServer(server, {
  cors: {
    origin: FRONTEND_URL,
    credentials: true,
  },
});

io.use((socket, next) => {
  try {
    const cookies = parseCookies(socket.handshake.headers.cookie);
    const token = cookies[COOKIE_NAME] || socket.handshake.auth?.token;

    if (!token) {
      return next(new Error('Unauthorized socket: Missing token'));
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return next(new Error('Server configuration error: JWT_SECRET missing'));
    }

    const decoded = jwt.verify(token, secret) as UserPayload;
    socket.data.user = decoded;
    next();
  } catch (err: any) {
    return next(new Error(`Unauthorized socket: ${err.message || 'Invalid token'}`));
  }
});

io.on('connection', (socket) => {
  console.log(`[Socket.IO] Authenticated client connected: ${socket.id} (user: ${socket.data.user?.userId || socket.data.user?.id})`);

  socket.on('disconnect', () => {
    console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
  });
});

// 7. Health check endpoint (public)
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    service: 'taskbuddy-backend',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// 8. Auth API Routes (register, login, logout, me)
app.use('/api/auth', authRouter);

// 9. Admin API Routes (directory, system missions)
app.use('/api/admin', adminRouter);

// 10. Tasks API Routes (protected by authentic JWT verification)
app.use('/api/tasks', authenticateToken, tasksRouter);

// 11. Centralized Error Handler (must be registered after all routes)
app.use(errorHandler);

// Export server, app, and io
export { app, server, io };

// Start listening if executed directly
if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    console.log(`🚀 TaskBuddy backend server running on port ${PORT}`);
    console.log(`👉 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📋 Auth API: http://localhost:${PORT}/api/auth`);
    console.log(`📋 Tasks API: http://localhost:${PORT}/api/tasks`);
    console.log(`📋 Admin API: http://localhost:${PORT}/api/admin`);
  });
}
