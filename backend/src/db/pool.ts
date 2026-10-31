import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl || databaseUrl.trim() === '') {
  console.error('❌ CRITICAL ERROR: DATABASE_URL is not set in backend/.env');
  throw new Error('DATABASE_URL is missing. Please add your PostgreSQL connection string in backend/.env');
}

// Enable SSL with rejectUnauthorized: false as required by Supabase transaction/session poolers
export const pool = new Pool({
  connectionString: databaseUrl,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle database client:', err.message);
});
