# ⚡ TASKBUDDY // TACTICAL CYBERPUNK TASK PLATFORM

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB.svg)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg)](https://nodejs.org/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-Real--Time-black.svg)](https://socket.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791.svg)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-Cyberpunk--HUD-38B2AC.svg)](https://tailwindcss.com/)
[![Render](https://img.shields.io/badge/Render-Backend-46E3B7.svg)](https://render.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Frontend-black.svg)](https://vercel.com/)

**TaskBuddy** is a full-stack, enterprise-grade, real-time task management command platform inspired by tactical cyberpunk military heads-up displays. It features instant multi-client synchronization via Socket.IO, secure JWT session cookies with strict cross-site isolation, role-based clearance access control (`admin` vs `user`), and high-performance parameterized PostgreSQL queries.

---

## 🌟 Core Features

- **Tactical Cyberpunk HUD Interface**:
  - Immersive high-contrast command center with bracketed visual containers and scanline filters.
  - Multi-accent chromatic switcher (`cyan`, `magenta`, `green`) persisted across operative sessions.
  - Interactive live connection telemetry pill (`LINK: ONLINE` / `LINK: OFFLINE`).
  - Tactically styled operational drawers, modal forms, priority badges, and status pills.
- **Real-Time Multi-Tab Synchronization**:
  - Socket.IO WebSockets with automatic reconnection backoff.
  - Authenticated handshake via `taskbuddy_token` cookie (denying rogue unauthenticated connections).
  - Private per-user room isolation (`user:<userId>`); mutations broadcast exclusively to the authenticated user across all open tabs/devices.
- **Enterprise-Grade Security & Auth**:
  - JWT tokens issued inside `httpOnly`, `sameSite: 'none'`, and `secure` cookies (preventing XSS exfiltration).
  - CSRF origin validation verifying incoming `Origin` and `Referer` headers on state-changing requests.
  - Express rate limiting protecting authentication and global API routes against brute-force assaults.
  - Multi-tenant tenant isolation with 404 responses for non-owned mission IDs (zero UUID enumeration leakage).
- **Administrative Clearance & Matrix**:
  - Role-based route guards (`ProtectedRoute` and `AdminRoute`).
  - `/agents` operator directory providing administrators with global mission distribution metrics.
- **Resilient Full-Stack Validation**:
  - Synchronized Zod validation schemas across both React client and Node.js server.
  - Database schema migration script (`npm run db:migrate`) and idempotent seed script (`npm run db:seed`).

---

## 🏗 Architecture & Tech Stack

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
  - React 18 (TypeScript), Vite, Tailwind CSS, Lucide React
  - React Router DOM v6 with SPA rewrites (`vercel.json`)
  - Context architecture: `AuthContext`, `TaskContext`, `SocketContext`, `CyberThemeContext`, `ToastContext`
- **Backend (`/backend`)**:
  - Node.js, Express.js (TypeScript), Socket.IO
  - PostgreSQL driver `pg` with parameterized queries and configurable SSL pooler support
  - Reverse proxy support with `app.set('trust proxy', 1)` for Render
- **Database (`/backend/db`)**:
  - PostgreSQL schema: `users` and `tasks` with foreign key `ON DELETE CASCADE` and index `idx_tasks_user_id`

---

## 🔐 Environment Variables Specification

> **SECURITY ENFORCEMENT**: Never commit `.env` files or hardcoded credentials. All production values must be entered directly in your Render and Vercel dashboards.

### Backend Environment Variables (`backend/.env` / Render Dashboard)
| Variable Name | Purpose & Guidance |
| :--- | :--- |
| `PORT` | Internal HTTP listening port (Default `5000` locally, set automatically to `10000` on Render) |
| `NODE_ENV` | Environment mode (`development` locally, `production` on Render) |
| `FRONTEND_URL` | Trusted origin URL of the Vercel frontend (e.g., `https://taskbuddy-app.vercel.app`) |
| `DATABASE_URL` | PostgreSQL connection string (Supabase session pooler, Neon, or Render PostgreSQL) |
| `DB_SSL` | Enable SSL certificate verification for cloud databases (`true` in production, `false` locally) |
| `JWT_SECRET` | High-entropy cryptographic random string used to sign session tokens |
| `ADMIN_EMAIL` | Default administrator seed email (e.g., `admin@taskbuddy.com`) |
| `ADMIN_PASSWORD` | Secure password for initial admin account seeding |

### Frontend Environment Variables (`frontend/.env` / Vercel Dashboard)
| Variable Name | Purpose & Guidance |
| :--- | :--- |
| `VITE_API_URL` | Full URL to the backend REST API endpoint (e.g., `https://taskbuddy-backend.onrender.com/api`) |

---

## 📡 REST API & Socket.IO Specifications

### Authentication Routes (`/api/auth`)
| Method | Endpoint | Clearance | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register account; issues `taskbuddy_token` cookie |
| `POST` | `/api/auth/login` | Public | Authenticate operative; issues `taskbuddy_token` cookie |
| `POST` | `/api/auth/logout` | Authenticated | Clears `taskbuddy_token` cookie and terminates session |
| `GET` | `/api/auth/me` | Authenticated | Retrieves current authenticated operative profile |

### Missions & Operations Routes (`/api/tasks`)
| Method | Endpoint | Clearance | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/tasks` | Authenticated | List tasks with filters (`?status=&priority=&search=&sort=`) |
| `GET` | `/api/tasks/stats` | Authenticated | Real-time counts (total, completed, pending, overdue, %) |
| `GET` | `/api/tasks/:id` | Authenticated | Retrieve task (returns 404 for non-owned IDs) |
| `POST` | `/api/tasks` | Authenticated | Create mission (broadcasts `task:created` via Socket.IO) |
| `PUT` | `/api/tasks/:id` | Authenticated | Update mission parameters (broadcasts `task:updated`) |
| `PATCH`| `/api/tasks/:id/toggle`| Authenticated | Toggle completion state (broadcasts `task:updated`) |
| `DELETE`| `/api/tasks/:id` | Authenticated | Terminate mission (broadcasts `task:deleted`) |
| `DELETE`| `/api/tasks` | Authenticated | Purge all operative missions (broadcasts `task:cleared`) |

### Admin Intelligence Routes (`/api/admin`)
| Method | Endpoint | Clearance | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/users` | Admin Role | Operator directory with assigned/completed mission metrics |
| `GET` | `/api/admin/tasks` | Admin Role | Global mission telemetry across all registered agents |

### Socket.IO Real-Time Events
- **Authentication**: Socket client connects with `withCredentials: true`. Handshake parses and validates JWT from the `taskbuddy_token` cookie.
- **Rooms**: Socket joins private channel `user:<userId>`.
- **Events Dispatched**:
  - `task:created` -> Dispatched on task creation with new task object.
  - `task:updated` -> Dispatched on task modification or completion toggle.
  - `task:deleted` -> Dispatched on single task deletion with `{ id }`.
  - `task:cleared` -> Dispatched on clear all with `{ deletedCount }`.

---

## 💻 Local Development Setup

### 1. Prerequisites
- Node.js >= 18
- PostgreSQL 16 running locally (e.g. port 5432)

### 2. Quick Setup & Database Seeding
```bash
# Clone the repository
git clone https://github.com/Rajath-nayakk/Task-Management-Application.git
cd Task-Management-Application

# Install dependencies across both workspaces
npm run build --prefix backend
npm run build --prefix frontend

# In /backend, verify connection and run database scripts
cd backend
npm run db:check
npm run db:migrate
npm run db:seed
```

### 3. Launch Development Servers
```bash
# Terminal 1: Backend API (port 5000)
cd backend && npm run dev

# Terminal 2: Frontend HUD (port 5173)
cd frontend && npm run dev
```

### 4. Run Automated End-to-End Test Suite
```bash
npm test
```
*Executes all 22 automated integration tests verifying registration, login, logout, session persistence, role restrictions, CRUD, Zod validation, and Socket.IO tenant isolation.*

---

## 🚀 COMPLETE PRODUCTION DEPLOYMENT GUIDE

Follow these exact numbered steps to deploy TaskBuddy into production:

### (a) Create Hosted PostgreSQL Database
1. Create a database on [Supabase](https://supabase.com), [Neon](https://neon.tech), or [Render PostgreSQL](https://render.com).
2. Copy the **Postgres Connection URI** (e.g., `postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/postgres`).
3. For Supabase, use the **Transaction/Session Pooler connection string** (port `6543` or `5432` with pooling enabled).

### (b) Deploy Backend Web Service on Render
1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** -> **Web Service** (or use **Blueprint** pointing to `render.yaml`).
2. Connect your GitHub repository: `https://github.com/Rajath-nayakk/Task-Management-Application.git`.
3. Configure the build parameters:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/api/health`
4. Set the **Environment Variables** in the Render Dashboard:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `DB_SSL`: `true`
   - `DATABASE_URL`: `[Your hosted PostgreSQL connection string from step (a)]`
   - `JWT_SECRET`: `[Generate a secure 32+ character random string]`
   - `ADMIN_EMAIL`: `[Your desired production admin email]`
   - `ADMIN_PASSWORD`: `[Your desired production admin password]`
   - `FRONTEND_URL`: `http://localhost:5173` *(Temporary placeholder; will be updated in step e)*
5. Click **Create Web Service** and wait for deployment to succeed. Note your backend service URL (e.g., `https://taskbuddy-backend.onrender.com`).

### (c) Run Migrations & Admin Seed Against Hosted Database
Run the idempotent schema migrations and admin account seed against your hosted production database from your local machine with:
```bash
# From the backend directory:
DATABASE_URL="[Your hosted database string]" DB_SSL=true npm run db:migrate
DATABASE_URL="[Your hosted database string]" DB_SSL=true ADMIN_EMAIL="admin@yourdomain.com" ADMIN_PASSWORD="YourStrongPassword123!" NODE_ENV=production npm run db:seed
```
*Note: In production mode (`NODE_ENV=production`), the seed script creates strictly the administrator account and skips all development demo users.*

### (d) Deploy Frontend on Vercel
1. Go to [Vercel Dashboard](https://vercel.com/) and click **Add New...** -> **Project**.
2. Select `Task-Management-Application`.
3. Configure project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. In **Environment Variables**, add:
   - `VITE_API_URL`: `https://taskbuddy-backend.onrender.com/api` *(Your Render backend URL from step b)*
5. Click **Deploy**. Note your live Vercel URL (e.g., `https://taskbuddy-app.vercel.app`).

### (e) Couple Render Backend to Vercel Origin
1. Return to [Render Dashboard](https://dashboard.render.com/) -> `taskbuddy-backend` -> **Environment**.
2. Update `FRONTEND_URL` with your exact live Vercel frontend domain:
   - `FRONTEND_URL`: `https://taskbuddy-app.vercel.app`
3. Click **Save Changes**. Render will automatically trigger a zero-downtime redeploy with strict CORS and CSRF locked to your Vercel URL.

### (f) Production Verification Checklist
- [ ] **Public Health Check**: Visit `https://taskbuddy-backend.onrender.com/api/health` -> Returns `{"status":"ok"}`.
- [ ] **Operative Registration**: Open `https://taskbuddy-app.vercel.app/register` and register a new user -> Successfully issues `taskbuddy_token` cookie and navigates to `/dashboard`.
- [ ] **Session Persistence**: Refresh the browser on `/dashboard` and `/tasks` -> User remains logged in (`ProtectedRoute` passes).
- [ ] **Task CRUD**: Create, update, toggle, and delete a mission on `/tasks` -> Updates immediately.
- [ ] **Real-Time Multi-Client Sync**: Open two separate browser windows side-by-side to `/tasks`. Add a task in Window 1 -> Instantly appears in Window 2 via Socket.IO.
- [ ] **HUD Telemetry Indicator**: TopBar displays `LINK: ONLINE`. Check `/systems` -> displays `CONNECTED (ONLINE)`.
- [ ] **Admin Clearance**: Log in using `ADMIN_EMAIL` and `ADMIN_PASSWORD` from step (c). Navigate to `/agents` -> Operator directory displays multi-tenant telemetry. Non-admin users attempting to open `/agents` are automatically redirected to `/dashboard`.
- [ ] **Deep Route Refresh**: Refresh on `/systems`, `/analytics`, or `/tasks` -> Vercel SPA rewrites render the page cleanly without 404s.

### (g) Production Troubleshooting Matrix

| Issue | Root Cause | Solution |
| :--- | :--- | :--- |
| **CORS Error** (`Access-Control-Allow-Origin`) | `FRONTEND_URL` on Render does not match exact Vercel URL (e.g. trailing slash or missing `https://`). | Ensure `FRONTEND_URL` on Render is exactly `https://your-app.vercel.app` without a trailing slash. |
| **Cookie Not Stored / 401 on Refresh** | Browser blocks third-party cookies if not using `SameSite=None; Secure`. | Ensure `NODE_ENV=production` is set on Render so Express sets `sameSite: 'none'` and `secure: true`. |
| **Render Cold Start (Free Plan Delay)** | Free Render web services spin down after 15 minutes of inactivity. | Allow 30–50 seconds on initial wake-up. For production uptime, upgrade to Render Starter plan or configure an uptime monitor pinging `/api/health`. |
| **WebSocket Connection Fails (`LINK: OFFLINE`)** | Socket.IO client fails handshake due to mismatched origin or unauthenticated cookie. | Confirm `VITE_API_URL` on Vercel points to backend, and check Render logs for `[Socket.IO] Authenticated client connected`. |
| **Database Connection Timeout / SSL Error** | Cloud database requires SSL but `DB_SSL=true` is missing, or pooler URL is incorrect. | Ensure `DB_SSL=true` is set in Render environment variables. If using Supabase, ensure using Session pooler connection URI. |
| **404 on Refreshing Vercel Page** | React Router routes request static file on server instead of SPA fallback. | Verified resolved by `frontend/vercel.json` rewrite (`/(.*) -> /index.html`). |

---

## 🛠 Roadmap & Implementation Status

- [x] **Phase 1: Project Scaffolding & Health Check**
- [x] **Phase 2: Frontend UI & Cyberpunk HUD Design**
- [x] **Phase 3: Database Schema & REST API (PostgreSQL)**
- [x] **Phase 4: Authentication & Authorization (JWT + httpOnly Cookie)**
- [x] **Phase 5: API Integration & Full CRUD Operations**
- [x] **Phase 6: Real-time Multi-tab Sync with Socket.IO**
- [x] **Phase 7: End-to-End Verification & Production Builds**
- [x] **Phase 8: Deployment Preparation (Vercel + Render) & Production Configuration**
