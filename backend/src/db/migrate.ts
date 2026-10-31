import fs from 'fs';
import path from 'path';
import { pool } from './pool.js';

export async function runMigration() {
  console.log('🔄 Running database migrations...');
  // Check in current working directory /db/schema.sql
  let schemaPath = path.resolve(process.cwd(), 'db/schema.sql');
  if (!fs.existsSync(schemaPath)) {
    schemaPath = path.resolve(process.cwd(), 'backend/db/schema.sql');
  }

  if (!fs.existsSync(schemaPath)) {
    throw new Error(`Schema file not found at ${schemaPath}`);
  }

  const sql = fs.readFileSync(schemaPath, 'utf-8');

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
    console.log('✅ Database migration completed successfully.');
  } catch (err: any) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', err.message);
    throw err;
  } finally {
    client.release();
  }
}

// Run directly if script entry point
if (process.argv[1] && process.argv[1].includes('migrate')) {
  runMigration()
    .then(async () => {
      await pool.end();
      process.exit(0);
    })
    .catch(async () => {
      await pool.end();
      process.exit(1);
    });
}
