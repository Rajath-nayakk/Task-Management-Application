import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from './pool.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function runMigration() {
  console.log('🔄 Running database migrations...');
  const schemaPath = path.resolve(__dirname, '../../db/schema.sql');

  if (!fs.existsSync(schemaPath)) {
    throw new Error(`Schema file not found at ${schemaPath}`);
  }

  const sql = fs.readFileSync(schemaPath, 'utf-8');

  let client;
  try {
    client = await pool.connect();
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
    console.log('✅ Database migration completed successfully.');
  } catch (err: any) {
    if (client) {
      try {
        await client.query('ROLLBACK');
      } catch {}
    }
    // Sanitize any potential connection string before logging
    const safeMessage = (err.message || 'Unknown database error').replace(/postgresql:\/\/[^@]+@/g, 'postgresql://***:***@');
    console.error('❌ Migration error:', safeMessage);
    if (err.code) {
      console.error('❌ Error Code:', err.code);
    }
    throw new Error(safeMessage);
  } finally {
    if (client) {
      client.release();
    }
  }
}

// Always run when invoked as entry point
runMigration()
  .then(async () => {
    await pool.end();
    process.exit(0);
  })
  .catch(async (err) => {
    await pool.end();
    process.exit(1);
  });
