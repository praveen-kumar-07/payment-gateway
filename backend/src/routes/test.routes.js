import express from "express";
import { pool } from "../config/db.js";

const router = express.Router();

/**
 * GET /api/v1/test/merchant
 * Required for automated evaluation
 */
router.get("/merchant", async (_req, res) => {
  const { rows } = await pool.query(
    "SELECT id, email, api_key FROM merchants WHERE email='test@example.com'"
  );

  if (!rows.length) {
    return res.status(404).json({
      error: "Test merchant not found",
    });
  }

  res.json({
    id: rows[0].id,
    email: rows[0].email,
    api_key: rows[0].api_key,
    seeded: true,
  });
});

export default router;
