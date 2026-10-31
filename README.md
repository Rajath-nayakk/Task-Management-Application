# TaskBuddy - Full-Stack Task Management Web Application

TaskBuddy is a full-stack, real-time task management application built with React, Node.js/Express, Socket.IO, and PostgreSQL on Supabase.

---

## 🏗 Architecture & Tech Stack

- **Frontend (`/frontend`)**:
  - React 18 + Vite + TypeScript
  - Tailwind CSS + Lucide React
  - React Router DOM v6
  - Framer Motion (subtle, accessible micro-animations)
  - Zod (client-side form validation matching server schemas)
- **Backend (`/backend`)**:
  - Node.js + Express.js REST API
  - Socket.IO (room-based real-time synchronizations per user)
  - PostgreSQL with `pg` (parameterized queries only)
  - Auth: bcrypt password hashing + JWT in `httpOnly` secure cookies
  - Role-based authorization (`user`, `admin`)
  - Helmet, CORS, and Express Rate Limiter
  - Zod request body validation & centralized error handler
- **Database**:
  - PostgreSQL on Supabase (`users`, `tasks`, indexed lookups)

---

## 📁 Repository Structure

```text
├── backend/                # Node.js + Express + Socket.IO API
│   ├── src/
│   │   └── index.ts        # Server entrypoint and healthcheck
│   ├── .env.example        # Environment variable template
│   ├── package.json
│   └── tsconfig.json
├── frontend/               # React + Vite + Tailwind CSS SPA
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── .env.example
│   ├── package.json
│   └── vite.config.ts
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start (Development)

### 1. Prerequisites
- Node.js >= 18
- npm >= 9

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```
Backend runs on [http://localhost:5000](http://localhost:5000) (Health check: `/api/health`).

### 3. Local Database Setup
TaskBuddy supports both local PostgreSQL and hosted cloud instances.

1. **Verify Connection**:
   Ensure PostgreSQL is running locally on port 5432 and configure your credentials in `backend/.env`:
   ```bash
   cd backend
   npm run db:check
   ```
2. **Run Migrations & Seeds**:
   ```bash
   npm run db:migrate
   npm run db:seed
   ```
   *Note: In Phase 8, production deployment will utilize a hosted PostgreSQL instance (such as Supabase, Neon, or Render).*

### 4. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
Frontend runs on [http://localhost:5173](http://localhost:5173).

---

## 🛠 Roadmap & Implementation Phases

- [x] **Phase 1: Project Scaffolding & Health Check**
- [x] **Phase 2: Frontend UI & Cyberpunk HUD Design**
- [x] **Phase 3: Database Schema & REST API (PostgreSQL)**
- [x] **Phase 4: Authentication & Authorization (JWT + httpOnly Cookie)**
- [x] **Phase 5: API Integration & Full CRUD Operations**
- [ ] **Phase 6: Real-time Multi-tab Sync with Socket.IO**
- [ ] **Phase 7: End-to-End Verification & Production Builds**
- [ ] **Phase 8: Deployment Prep (Vercel + Render) & Production Configuration**
