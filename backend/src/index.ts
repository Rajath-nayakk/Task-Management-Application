import express, { Request, Response } from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { Server as SocketIOServer } from 'socket.io';
import tasksRouter from './routes/tasks.js';
import { mockAuthMiddleware } from './middleware/mockAuth.js';
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
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      message: 'Too many requests from this IP, please try again after 15 minutes.',
      code: 'RATE_LIMIT_EXCEEDED',
    },
  },
});
app.use(globalLimiter);

// 4. Request body and cookie parsers
app.use(express.json());
app.use(cookieParser());

// 5. Socket.IO initialization
const io = new SocketIOServer(server, {
  cors: {
    origin: FRONTEND_URL,
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log(`[Socket.IO] Client connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
  });
});

// 6. Health check endpoint (public, exempt from auth)
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    service: 'taskbuddy-backend',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// 7. Tasks API Routes
// Note: In Phase 3, mockAuthMiddleware scopes tasks to the demo user.
// In Phase 4, this will be swapped with authentic JWT verification.
app.use('/api/tasks', mockAuthMiddleware, tasksRouter);

// 8. Centralized Error Handler (must be registered after all routes)
app.use(errorHandler);

// Export server, app, and io
export { app, server, io };

// Start listening if executed directly
if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    console.log(`🚀 TaskBuddy backend server running on port ${PORT}`);
    console.log(`👉 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📋 Tasks API: http://localhost:${PORT}/api/tasks`);
  });
}
