import bcrypt from 'bcrypt';
import { pool } from './pool.js';
import dotenv from 'dotenv';

dotenv.config();

export async function runSeed() {
  console.log('🌱 Starting database seeding...');

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@taskbuddy.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPassword123!';

  const demoEmail = 'alex@example.com';
  const demoPassword = 'password123';

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Seed Admin User
    const adminHash = await bcrypt.hash(adminPassword, 10);
    const existingAdmin = await client.query('SELECT id FROM users WHERE email = $1', [adminEmail]);

    let adminId: string;
    if (existingAdmin.rows.length === 0) {
      const res = await client.query(
        `INSERT INTO users (name, email, password_hash, role)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        ['System Administrator', adminEmail, adminHash, 'admin']
      );
      adminId = res.rows[0].id;
      console.log(`👤 Admin user created: ${adminEmail} (role: admin)`);
    } else {
      adminId = existingAdmin.rows[0].id;
      console.log(`ℹ️ Admin user already exists: ${adminEmail}`);
    }

    // 2. Seed Demo User (Development only)
    if (process.env.NODE_ENV === 'development') {
      const demoHash = await bcrypt.hash(demoPassword, 10);
    const existingDemo = await client.query('SELECT id FROM users WHERE email = $1', [demoEmail]);

    let demoUserId: string;
    if (existingDemo.rows.length === 0) {
      const res = await client.query(
        `INSERT INTO users (name, email, password_hash, role)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        ['Alex Morgan', demoEmail, demoHash, 'user']
      );
      demoUserId = res.rows[0].id;
      console.log(`👤 Demo user created: ${demoEmail} (role: user)`);
    } else {
      demoUserId = existingDemo.rows[0].id;
      console.log(`ℹ️ Demo user already exists: ${demoEmail}`);
    }

    // 3. Seed Sample Tasks for Demo User (idempotent: only seed if user has 0 tasks)
    const existingTasks = await client.query('SELECT COUNT(*) FROM tasks WHERE user_id = $1', [demoUserId]);
    const taskCount = parseInt(existingTasks.rows[0].count, 10);

    if (taskCount === 0) {
      const today = new Date();
      const formatOffset = (days: number) => {
        const d = new Date(today);
        d.setDate(d.getDate() + days);
        return d.toISOString().split('T')[0];
      };

      const sampleTasks = [
        {
          title: 'Complete Project Architecture & Tech Review',
          description: 'Finalize database entity relationship diagrams, evaluate indexes for Supabase PostgreSQL, and document REST endpoints.',
          priority: 'high',
          status: 'done',
          completed: true,
          dueDate: formatOffset(-2),
        },
        {
          title: 'Implement Dark & Light Theme System',
          description: 'Ensure smooth color transitions, high contrast accessibility compliance, and local storage state persistence.',
          priority: 'medium',
          status: 'done',
          completed: true,
          dueDate: formatOffset(-1),
        },
        {
          title: 'Build Mobile Responsive Navigation Drawer',
          description: 'Ensure touch targets meet 44px min size, collapse filter sidebar on screen widths under 768px, and test at 360px.',
          priority: 'high',
          status: 'in-progress',
          completed: false,
          dueDate: formatOffset(-1), // Overdue
        },
        {
          title: 'Implement Real-time Socket.IO synchronization',
          description: 'Connect client socket listeners to update tasks across multiple browser tabs instantaneously without page reload.',
          priority: 'high',
          status: 'todo',
          completed: false,
          dueDate: formatOffset(3),
        },
        {
          title: 'Integrate Zod Form Validation and Error Handling',
          description: 'Enforce strict client and server schemas with clear user feedback for title length, due date, and priority fields.',
          priority: 'medium',
          status: 'todo',
          completed: false,
          dueDate: formatOffset(6),
        },
      ];

      for (const t of sampleTasks) {
        await client.query(
          `INSERT INTO tasks (user_id, title, description, priority, status, completed, due_date)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [demoUserId, t.title, t.description, t.priority, t.status, t.completed, t.dueDate]
        );
      }
      console.log(`📋 Inserted ${sampleTasks.length} sample tasks for demo user.`);
    } else {
      console.log(`ℹ️ Demo user already has ${taskCount} tasks, skipping task seeding.`);
    }
    } else {
      console.log('ℹ️ Non-development environment: skipping demo user and sample tasks.');
    }

    await client.query('COMMIT');
    console.log('✅ Database seeding finished successfully.');
  } catch (err: any) {
    await client.query('ROLLBACK');
    console.error('❌ Seeding failed:', err.message);
    throw err;
  } finally {
    client.release();
  }
}

// Always run when invoked as entry point
runSeed()
  .then(async () => {
    await pool.end();
    process.exit(0);
  })
  .catch(async (err) => {
    const safeMessage = (err.message || 'Unknown database error').replace(/postgresql:\/\/[^@]+@/g, 'postgresql://***:***@');
    console.error('❌ Seeding error:', safeMessage);
    await pool.end();
    process.exit(1);
  });
