import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { pool } from "./config/db.js";
import { seedTestMerchant } from "./seed/merchant.seed.js";

/* Routes */
import healthRoutes from "./routes/health.routes.js";
import orderRoutes from "./routes/order.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import testRoutes from "./routes/test.routes.js";

dotenv.config();

const app = express();

/* -------------------- Middlewares -------------------- */
app.use(cors());
app.use(express.json());

/* -------------------- Routes ------------------------ */
app.use("/health", healthRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/test", testRoutes);

/* -------------------- DB Schema Loader --------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function loadSchema() {
  const schemaPath = path.join(__dirname, "schema.sql");
  const sql = fs.readFileSync(schemaPath, "utf8");
  await pool.query(sql);
  console.log("Database schema loaded");
}

/* -------------------- Server Boot -------------------- */
const PORT = process.env.PORT || 8000;

(async () => {
  try {
    await loadSchema();
    await seedTestMerchant();

    app.listen(PORT, () => {
      console.log(`API running on ${PORT}`);
    });
  } catch (err) {
    console.error("Startup error:", err);
    process.exit(1);
  }
})();
