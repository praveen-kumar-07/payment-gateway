import pkg from "pg";
const { Pool } = pkg;

/**
 * Shared PostgreSQL connection pool
 */
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

/**
 * Used by /health endpoint
 */
export async function dbHealth() {
  try {
    await pool.query("SELECT 1");
    return "connected";
  } catch (err) {
    return "disconnected";
  }
}
