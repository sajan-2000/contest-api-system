const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  max: 10,
  idleTimeoutMillis: 30_000,
});


async function runMigrations() {
  console.log('[DB] Running migrations...');
  await pool.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);

  const migrationsDir = path.join(__dirname, '../migrations');
  const files = fs.readdirSync(migrationsDir).sort();
  for (const file of files) {
    if (!file.endsWith('.sql')) continue;
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    await pool.query(sql);
    console.log(`[DB] Applied migration: ${file}`);
  }
  console.log('[DB] Migrations complete');
}

module.exports = { pool, runMigrations };