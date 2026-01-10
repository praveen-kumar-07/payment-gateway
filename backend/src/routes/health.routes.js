import express from "express";
import { dbHealth } from "../config/db.js";

const router = express.Router();

router.get("/", async (_, res) => {
  res.json({
    status: "healthy",
    database: await dbHealth(),
    timestamp: new Date().toISOString()
  });
});

export default router;
