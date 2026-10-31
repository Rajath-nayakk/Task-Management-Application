import { pool } from './pool.js';

async function checkDatabaseConnection() {
  const rawUrl = process.env.DATABASE_URL || '';
  let host = 'unknown';

  try {
    const parsed = new URL(rawUrl);
    host = parsed.hostname || parsed.host || 'unknown';
  } catch {
    host = 'invalid-url-format';
  }

  console.log(`📡 Target Host: ${host}`);

  let client;
  try {
    client = await pool.connect();
    await client.query('SELECT 1');
    console.log('✅ Status: connected OK');
    process.exit(0);
  } catch (err: any) {
    const errorType = err.code || err.name || 'ConnectionError';
    console.error(`❌ Status: Connection failed (${errorType})`);
    if (err.message && !err.message.includes('://')) {
      console.error(`❌ Details: ${err.message}`);
    }
    process.exit(1);
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
}

checkDatabaseConnection();
