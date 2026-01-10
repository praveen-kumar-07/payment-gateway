import express from "express";
import health from "./routes/health.routes.js";
import orders from "./routes/order.routes.js";
import payments from "./routes/payment.routes.js";

const app = express();
app.use(express.json());

app.use("/health", health);
app.use("/api/v1/orders", orders);
app.use("/api/v1/payments", payments);

export default app;
