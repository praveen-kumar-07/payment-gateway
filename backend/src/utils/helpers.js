import crypto from "crypto";

/**
 * Generates order ID:
 * order_ + exactly 16 alphanumeric characters
 */
export function generateOrderId() {
  return "order_" + crypto.randomBytes(8).toString("hex");
}

/**
 * Generates payment ID:
 * pay_ + exactly 16 alphanumeric characters
 */
export function generatePaymentId() {
  return "pay_" + crypto.randomBytes(8).toString("hex");
}
