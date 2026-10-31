import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve directory of this file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Always load backend/.env relative to this file location, regardless of where the command was executed
const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl || databaseUrl.trim() === '') {
  console.error('❌ CRITICAL ERROR: DATABASE_URL is missing or empty.');
  console.error(`❌ Looked for environment configuration in: ${envPath}`);
  console.error('❌ Please configure DATABASE_URL in backend/.env with your PostgreSQL/Supabase connection string.');
  throw new Error('DATABASE_URL is missing or empty. Please set DATABASE_URL in backend/.env');
}

// SSL is configurable via DB_SSL (default "false" for local development, "true" for hosted databases like Supabase/Neon/Render)
const isSsl = process.env.DB_SSL === 'true' || (process.env.NODE_ENV === 'production' && process.env.DB_SSL !== 'false');

export const pool = new Pool({
  connectionString: databaseUrl,
  ssl: isSsl ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle database client:', err.message);
});
