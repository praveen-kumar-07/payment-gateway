import express from "express";
import { pool } from "../config/db.js";
import { auth } from "../middleware/auth.middleware.js";
import { generateOrderId } from "../utils/helpers.js";

const router = express.Router();

/**
 * POST /api/v1/orders
 */
router.post("/", auth, async (req, res) => {
  const { amount, currency = "INR", receipt, notes } = req.body;

  if (!Number.isInteger(amount) || amount < 100) {
    return res.status(400).json({
      error: {
        code: "BAD_REQUEST_ERROR",
        description: "amount must be at least 100"
      }
    });
  }

  const orderId = generateOrderId();

  await pool.query(
    `INSERT INTO orders
     (id, merchant_id, amount, currency, receipt, notes)
     VALUES ($1,$2,$3,$4,$5,$6)`,
    [
      orderId,
      req.merchant.id,
      amount,
      currency,
      receipt || null,
      notes || {}
    ]
  );

  res.status(201).json({
    id: orderId,
    merchant_id: req.merchant.id,
    amount,
    currency,
    receipt,
    notes,
    status: "CREATED",
    created_at: new Date().toISOString()
  });
});

/**
 * GET /api/v1/orders/:order_id
 */
router.get("/:order_id", auth, async (req, res) => {
  const { order_id } = req.params;

  const { rows } = await pool.query(
    `SELECT * FROM orders
     WHERE id=$1 AND merchant_id=$2`,
    [order_id, req.merchant.id]
  );

  if (!rows.length) {
    return res.status(404).json({
      error: {
        code: "NOT_FOUND_ERROR",
        description: "Order not found"
      }
    });
  }

  const order = rows[0];

  res.json({
    id: order.id,
    merchant_id: order.merchant_id,
    amount: order.amount,
    currency: order.currency,
    receipt: order.receipt,
    notes: order.notes || {},
    status: order.status,
    created_at: order.created_at,
    updated_at: order.updated_at
  });
});

export default router;

/* ---------------- PUBLIC ORDER (CHECKOUT) ---------------- */
router.get("/:order_id/public", async (req, res) => {
  const { order_id } = req.params;

  const { rows } = await pool.query(
    "SELECT id, amount, currency, status FROM orders WHERE id=$1",
    [order_id]
  );

  if (!rows.length) {
    return res.status(404).json({
      error: {
        code: "NOT_FOUND_ERROR",
        description: "Order not found"
      }
    });
  }

  res.json(rows[0]);
});

