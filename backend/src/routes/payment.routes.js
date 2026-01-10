import express from "express";
import { pool } from "../config/db.js";
import { auth } from "../middleware/auth.middleware.js";
import { generatePaymentId } from "../utils/helpers.js";
import {
  isValidVPA,
  isValidCard,
  detectNetwork,
  isValidExpiry
} from "../utils/validation.js";

const router = express.Router();

/* CREATE PAYMENT */
router.post("/", auth, async (req, res) => {
  const { order_id, method, vpa, card } = req.body;

  const { rows } = await pool.query(
    "SELECT * FROM orders WHERE id=$1 AND merchant_id=$2",
    [order_id, req.merchant.id]
  );

  if (!rows.length) {
    return res.status(404).json({
      error: { code: "NOT_FOUND_ERROR", description: "Order not found" }
    });
  }

  const order = rows[0];
  const id = generatePaymentId();

  let card_network = null;
  let card_last4 = null;

  if (method === "upi") {
    if (!isValidVPA(vpa)) {
      return res.status(400).json({
        error: { code: "INVALID_VPA", description: "Invalid VPA" }
      });
    }
  }

  if (method === "card") {
  if (!card) {
    return res.status(400).json({
      error: { code: "INVALID_CARD", description: "Card details missing" }
    });
  }

  let { number, expiry_month, expiry_year } = card;

  if (!number || !expiry_month || !expiry_year) {
    return res.status(400).json({
      error: { code: "INVALID_CARD", description: "Incomplete card details" }
    });
  }

  // normalize card number
  number = number.replace(/[\s-]/g, "");

  if (!isValidCard(number)) {
    return res.status(400).json({
      error: { code: "INVALID_CARD", description: "Card validation failed" }
    });
  }

  if (!isValidExpiry(expiry_month, expiry_year)) {
    return res.status(400).json({
      error: { code: "EXPIRED_CARD", description: "Card expired" }
    });
  }

  card_network = detectNetwork(number);
  card_last4 = number.slice(-4);
}


  await pool.query(
    `INSERT INTO payments
     (id, order_id, merchant_id, amount, currency, method, status, vpa, card_network, card_last4)
     VALUES ($1,$2,$3,$4,$5,$6,'processing',$7,$8,$9)`,
    [
      id,
      order.id,
      req.merchant.id,
      order.amount,
      order.currency,
      method,
      vpa || null,
      card_network,
      card_last4
    ]
  );

  const testMode = process.env.TEST_MODE === "true";
  const delay = testMode
    ? parseInt(process.env.TEST_PROCESSING_DELAY || "1000")
    : Math.floor(Math.random() * 5000) + 5000;

  const success = testMode
    ? process.env.TEST_PAYMENT_SUCCESS !== "false"
    : Math.random() < (method === "upi" ? 0.9 : 0.95);

  await new Promise(r => setTimeout(r, delay));

  await pool.query(
    "UPDATE payments SET status=$1, updated_at=NOW() WHERE id=$2",
    [success ? "success" : "failed", id]
  );

  res.status(201).json({
    id,
    order_id: order.id,
    amount: order.amount,
    currency: order.currency,
    method,
    ...(method === "upi" && { vpa }),
    ...(method === "card" && { card_network, card_last4 }),
    status: success ? "success" : "failed",
    created_at: new Date().toISOString()
  });
});

/* ---------------- PUBLIC PAYMENT (CHECKOUT) ---------------- */
/* ---------------- PUBLIC PAYMENT (CHECKOUT) ---------------- */
router.post("/public", async (req, res) => {
  const { order_id, method, vpa, card } = req.body;

  const { rows } = await pool.query(
    "SELECT * FROM orders WHERE id=$1",
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

  const order = rows[0];
  const id = generatePaymentId();

  let card_network = null;
  let card_last4 = null;

  if (method === "upi") {
    if (!isValidVPA(vpa)) {
      return res.status(400).json({
        error: { code: "INVALID_VPA", description: "Invalid VPA" }
      });
    }
  }

  if (method === "card") {
    const number = card.number.replace(/[\s-]/g, "");
    card_network = detectNetwork(number);
    card_last4 = number.slice(-4);
  }

  await pool.query(
    `INSERT INTO payments
     (id, order_id, merchant_id, amount, currency, method, status, vpa, card_network, card_last4)
     VALUES ($1,$2,$3,$4,$5,$6,'processing',$7,$8,$9)`,
    [
      id,
      order.id,
      order.merchant_id,
      order.amount,
      order.currency,
      method,
      vpa || null,
      card_network,
      card_last4
    ]
  );

  const delay = Math.floor(Math.random() * 5000) + 5000;
  await new Promise(r => setTimeout(r, delay));

  await pool.query(
    "UPDATE payments SET status='success', updated_at=NOW() WHERE id=$1",
    [id]
  );

  res.status(201).json({
    id,
    order_id: order.id,
    amount: order.amount,
    currency: order.currency,
    method,
    ...(method === "upi" && { vpa }),
    ...(method === "card" && { card_network, card_last4 }),
    status: "success",
    created_at: new Date().toISOString()
  });
});


/* GET ALL PAYMENTS (MERCHANT DASHBOARD) */
router.get("/", auth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `
      SELECT id, order_id, amount, currency, method, status, created_at
      FROM payments
      WHERE merchant_id = $1
      ORDER BY created_at DESC
      `,
      [req.merchant.id]
    );

    res.json(rows);
  } catch (err) {
    console.error("Fetch payments error:", err);
    res.status(500).json({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        description: "Failed to fetch payments"
      }
    });
  }
});


/* GET PAYMENT */
router.get("/:payment_id", auth, async (req, res) => {
  const { rows } = await pool.query(
    "SELECT * FROM payments WHERE id=$1",
    [req.params.payment_id]
  );

  if (!rows.length) {
    return res.status(404).json({
      error: { code: "NOT_FOUND_ERROR", description: "Payment not found" }
    });
  }

  res.json(rows[0]);
});

export default router;


/* ---------------- PUBLIC PAYMENT STATUS (CHECKOUT) ---------------- */
router.get("/:payment_id/public", async (req, res) => {
  const { payment_id } = req.params;

  const { rows } = await pool.query(
    "SELECT id, order_id, amount, currency, method, status, created_at, updated_at FROM payments WHERE id=$1",
    [payment_id]
  );

  if (!rows.length) {
    return res.status(404).json({
      error: {
        code: "NOT_FOUND_ERROR",
        description: "Payment not found"
      }
    });
  }

  res.json(rows[0]);
});




