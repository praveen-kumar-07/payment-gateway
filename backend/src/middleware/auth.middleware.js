import { pool } from "../config/db.js";

/**
 * Merchant authentication middleware
 */
export async function auth(req, res, next) {
  const key = req.header("X-Api-Key");
  const secret = req.header("X-Api-Secret");

  if (!key || !secret) {
    return res.status(401).json({
      error: {
        code: "AUTHENTICATION_ERROR",
        description: "Invalid API credentials"
      }
    });
  }

  const { rows } = await pool.query(
    "SELECT * FROM merchants WHERE api_key=$1 AND api_secret=$2",
    [key, secret]
  );

  if (!rows.length) {
    return res.status(401).json({
      error: {
        code: "AUTHENTICATION_ERROR",
        description: "Invalid API credentials"
      }
    });
  }

  req.merchant = rows[0];
  next();
}
