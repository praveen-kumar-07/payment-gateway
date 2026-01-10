import { pool } from "../config/db.js";

export async function seedTestMerchant() {
  const merchant = {
    id: "550e8400-e29b-41d4-a716-446655440000",
    name: "Test Merchant",
    email: "test@example.com",
    api_key: "key_test_abc123",
    api_secret: "secret_test_xyz789"
  };

  const exists = await pool.query(
    "SELECT 1 FROM merchants WHERE email=$1",
    [merchant.email]
  );

  if (exists.rowCount > 0) {
    console.log("Test merchant already exists, skipping seed");
    return;
  }

  await pool.query(
    `INSERT INTO merchants 
     (id, name, email, api_key, api_secret)
     VALUES ($1,$2,$3,$4,$5)`,
    [
      merchant.id,
      merchant.name,
      merchant.email,
      merchant.api_key,
      merchant.api_secret
    ]
  );

  console.log("Test merchant seeded successfully");
}
