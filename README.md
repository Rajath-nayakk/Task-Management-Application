# TaskBuddy - Tactical Cyberpunk Task Management Application

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB.svg)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg)](https://nodejs.org/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-Real--Time-black.svg)](https://socket.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791.svg)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-Cyberpunk--HUD-38B2AC.svg)](https://tailwindcss.com/)

**TaskBuddy** is a full-stack, enterprise-grade, real-time task management platform featuring a high-contrast Cyberpunk HUD command center, multi-tab synchronization via Socket.IO, JWT session authentication delivered in secure `httpOnly` cookies, role-based access control, and PostgreSQL with parameterized queries.

---

## 🏗 System Architecture & Technology Stack

```text
┌─────────────────────────────────────────────────────────────┐
│                 REACT 18 + VITE + TAILWIND                  │
│       Cyberpunk Tactical HUD // CommandCenter / Ops         │
└──────────────┬──────────────────────────────┬───────────────┘
               │ HTTP REST (fetch)            │ WebSocket
               │ (Credentials: include)       │ (Handshake Auth)
               ▼                              ▼
┌─────────────────────────────────────────────────────────────┐
│                 EXPRESS REST API + SOCKET.IO                │
│  Helmet · CORS · Rate-Limiting · CSRF · Zod · JWT Cookies   │
└──────────────┬──────────────────────────────┬───────────────┘
               │ Parameterized Queries        │ User-Specific Rooms
               ▼ (pg Pool)                    ▼
┌───────────────────────────┐  ┌──────────────────────────────┐
│        POSTGRESQL         │  │   REAL-TIME NOTIFICATIONS    │
│  users, tasks, cascades   │  │   task:created/updated/...   │
└───────────────────────────┘  └──────────────────────────────┘
```

- **Frontend (`/frontend`)**:
  - React 18, Vite, TypeScript, Tailwind CSS
  - Cyberpunk HUD design: dynamic neon chromatics (`cyan`, `magenta`, `green`), CRT scanline overlay, bracketed tactical panels, micro-animations
  - React Router DOM v6 with `ProtectedRoute` and `AdminRoute` guards
  - Typed API client (`fetch`) with automatic 401 handling and credentials
  - Optimistic UI updates with automatic rollback on failure
  - `SocketProvider` managing persistent, auto-reconnecting WebSocket connections
- **Backend (`/backend`)**:
  - Node.js + Express REST API with TypeScript
  - Socket.IO server authenticating handshake via `taskbuddy_token` cookie
  - PostgreSQL connection pool (`pg`) supporting both local DBs and SSL poolers
  - Role-based authorization: `admin` (global directory & telemetry) vs `user` (isolated missions)
  - Security hardening: Helmet HTTP headers, CORS whitelisting, express-rate-limit, CSRF origin verification, and 404 enumeration prevention for cross-tenant tasks
  - Zod schemas validating client inputs and server request bodies
- **Database (`/backend/db`)**:
  - `users`: UUID primary keys, unique emails, bcrypt hashed passwords, roles (`user`, `admin`), timestamps
  - `tasks`: UUID primary keys, foreign key to `users` with `ON DELETE CASCADE`, titles, descriptions, priorities (`low`, `medium`, `high`), statuses (`todo`, `in-progress`, `done`), due dates, completed flags, timestamps, and indexes

---

## 📁 Repository Structure

```text
├── backend/
│   ├── src/
│   │   ├── db/                 # Pool configuration, migrations, seeds, check
│   │   ├── middleware/         # Auth, CSRF, rate-limiting, error handling
│   │   ├── realtime/           # Socket.IO emitter instance & room events
│   │   ├── routes/             # REST routes: auth, tasks, admin
│   │   ├── utils/              # JWT signing, cookie configuration
│   │   ├── validation/         # Zod schemas for auth, tasks, queries
│   │   └── index.ts            # Express server & Socket.IO initialization
│   ├── test-phase7.cjs         # End-to-end automated test suite
│   ├── .env.example            # Backend environment template
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── api/                # Typed REST client, auth, tasks, admin services
│   │   ├── components/         # Reusable Cyberpunk UI components, layout, guards
│   │   ├── context/            # Auth, Task, Socket, CyberTheme, Toast contexts
│   │   ├── pages/              # CommandCenter, Operations, Intelligence, Agents, Systems, Login, Register
│   │   ├── types/              # TypeScript interfaces and Zod schemas
│   │   ├── App.tsx             # Route declarations and root providers
│   │   └── main.tsx            # Entry point
│   ├── .env.example            # Frontend environment template
│   ├── package.json
│   └── vite.config.ts
├── package.json                # Root monorepo build and test orchestrator
├── .gitignore
└── README.md
```

---

## 🔐 Environment Variables Specification

> **SECURITY NOTICE**: Never commit `.env` files or hardcoded credentials. Only use `.env.example` templates.

### Backend (`backend/.env`)
| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `PORT` | HTTP port for the Express backend | `5000` |
| `FRONTEND_URL` | Trusted client origin for CORS and CSRF | `http://localhost:5173` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/taskbuddy` |
| `DB_SSL` | Enable SSL for cloud poolers (`true` / `false`) | `false` (local) / `true` (Supabase) |
| `JWT_SECRET` | Secret key for signing session tokens | `(high-entropy random string)` |
| `ADMIN_EMAIL` | Default administrator seed email | `admin@taskbuddy.com` |
| `ADMIN_PASSWORD` | Default administrator seed password | `(secure random password)` |

### Frontend (`frontend/.env`)
| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `VITE_API_URL` | Base URL for REST API endpoints | `http://localhost:5000/api` |

---

## 📡 API Endpoint Specifications

### Authentication API (`/api/auth`)
| Method | Endpoint | Clearance | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user; issues JWT `httpOnly` cookie |
| `POST` | `/api/auth/login` | Public | Authenticate user credentials; issues JWT cookie |
| `POST` | `/api/auth/logout` | Authenticated | Clears `taskbuddy_token` cookie and invalidates session |
| `GET` | `/api/auth/me` | Authenticated | Returns current authenticated user profile |

### Tasks API (`/api/tasks`)
| Method | Endpoint | Clearance | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/tasks` | Authenticated | List tasks with filters (`?status=&priority=&search=&sort=`) |
| `GET` | `/api/tasks/stats` | Authenticated | Summary statistics (total, completed, pending, overdue, %) |
| `GET` | `/api/tasks/:id` | Authenticated | Retrieve a single task (returns 404 for other users' tasks) |
| `POST` | `/api/tasks` | Authenticated | Create a task (emits `task:created` via Socket.IO) |
| `PUT` | `/api/tasks/:id` | Authenticated | Update a task (emits `task:updated` via Socket.IO) |
| `PATCH`| `/api/tasks/:id/toggle`| Authenticated | Toggle completed status (emits `task:updated`) |
| `DELETE`| `/api/tasks/:id` | Authenticated | Delete a task (emits `task:deleted` via Socket.IO) |
| `DELETE`| `/api/tasks` | Authenticated | Clear all user tasks (emits `task:cleared` via Socket.IO) |

### Admin API (`/api/admin`)
| Method | Endpoint | Clearance | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/users` | Admin Role | Directory of all operators with task metrics |
| `GET` | `/api/admin/tasks` | Admin Role | Global mission telemetry across all operators |

---

## ⚡ Real-Time Socket.IO Architecture

Socket.IO operates with strict per-user room routing:
1. **Handshake Authentication**: The connection parses `taskbuddy_token` from `socket.handshake.headers.cookie` and verifies the JWT.
2. **Room Joining**: On successful authentication, the socket joins the private room `user:<userId>`.
3. **Event Broadcasting**: Mutations on `/api/tasks` emit events only to `user:<userId>`, guaranteeing that user B never receives user A's events.
4. **Events Dispatched**:
   - `task:created`: Sent when a task is added.
   - `task:updated`: Sent when a task is edited or toggled.
   - `task:deleted`: Sent with `{ id }` when a task is removed.
   - `task:cleared`: Sent when all tasks are purged.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js >= 18
- PostgreSQL 16 (local or cloud instance)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/Rajath-nayakk/Task-Management-Application.git
cd Task-Management-Application

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
cd ..
```

### 3. Database Initialization
```bash
cd backend

# Verify database connection
npm run db:check

# Run idempotent schema migrations
npm run db:migrate

# Seed administrative and demo accounts
npm run db:seed
```

### 4. Running the Dev Servers
```bash
# In terminal 1 (Backend - port 5000):
cd backend && npm run dev

# In terminal 2 (Frontend - port 5173):
cd frontend && npm run dev
```

### 5. Running the Automated Test Suite
```bash
cd backend
npm run test
```
*All 22 integration tests will execute, validating authentication, authorization, role enforcement, CRUD operations, Zod validation, and Socket.IO real-time tenant isolation.*

### 6. Production Builds
```bash
# Build both frontend and backend from the root
npm run build
```

---

## 🛠 Roadmap & Implementation Status

- [x] **Phase 1: Project Scaffolding & Health Check**
- [x] **Phase 2: Frontend UI & Cyberpunk HUD Design**
- [x] **Phase 3: Database Schema & REST API (PostgreSQL)**
- [x] **Phase 4: Authentication & Authorization (JWT + httpOnly Cookie)**
- [x] **Phase 5: API Integration & Full CRUD Operations**
- [x] **Phase 6: Real-time Multi-tab Sync with Socket.IO**
- [x] **Phase 7: End-to-End Verification & Production Builds**
- [ ] **Phase 8: Deployment Prep (Vercel + Render) & Production Configuration**
