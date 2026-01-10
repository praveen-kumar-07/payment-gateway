# Payment Gateway Project

## 🚀 Overview
This is a full-stack Payment Gateway simulation built as a capstone project. It mimics the core functionalities of platforms like Razorpay or Stripe, allowing merchants to generate orders and customers to make payments via a hosted checkout page.

The system supports **UPI** and **Credit Card** payments (with Luhn algorithm validation) and includes a merchant dashboard to view transaction history.

## 🛠 Tech Stack (PERN)
- **Database:** PostgreSQL 15 (Dockerized)
- **Backend:** Node.js + Express
- **Frontend:** React + Vite + TailwindCSS
- **Containerization:** Docker & Docker Compose

## 📋 Prerequisites
- Docker Desktop installed and running.
- No local Node.js or npm installation required.

## ⚡ Quick Start (For Evaluators)
The entire application is containerized.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/VamsiReddyTetali/payment-gateway.git
   cd payment-gateway
   ```

2. **Start the application:**
   ```bash
   docker-compose up -d
   ```
   *Note: Please wait approx. 30-60 seconds after the command finishes for the database to initialize and the containers to install dependencies.*

3. **Verify running services:**
   ```bash
   docker ps
   ```
   You should see 4 containers: `gateway_api`, `pg_gateway`, `gateway_dashboard`, and `gateway_checkout`.

## 🌐 Services URLs
| Service | URL | Description |
|---------|-----|-------------|
| **Backend API** | `http://localhost:8000` | The REST API processing payments. |
| **Dashboard** | `http://localhost:3000` | Merchant portal to view stats. |
| **Checkout** | `http://localhost:3001` | Customer payment page. |

---

## 🧪 Testing Guide

### 1. Verify System Health
Check if the API and Database are connected:
[http://localhost:8000/health](http://localhost:8000/health)

### 2. Create a Test Order
Since there is no "Merchant Shop" UI, you must create an order via the API to get an `order_id`.

**Option A: Using PowerShell (Windows)**
```powershell
Invoke-RestMethod -Uri "http://localhost:8000/api/v1/orders" `
  -Method Post `
  -Headers @{ "X-Api-Key"="key_test_abc123"; "X-Api-Secret"="secret_test_xyz789"; "Content-Type"="application/json" } `
  -Body '{"amount": 50000, "currency": "INR", "receipt": "receipt_1", "notes": { "desc": "Test Order" }}'
```

**Option B: Using cURL (Mac/Linux/Git Bash)**
```bash
curl -X POST http://localhost:8000/api/v1/orders \
  -H "Content-Type: application/json" \
  -H "X-Api-Key: key_test_abc123" \
  -H "X-Api-Secret: secret_test_xyz789" \
  -d '{
    "amount": 50000,
    "currency": "INR",
    "receipt": "receipt_1",
    "notes": { "desc": "Test Order" }
  }'
```

**⚠️ Important:** Copy the `id` from the JSON response (e.g., `order_xYz123...`). You will need this for the checkout step.

### 3. Complete Payment (Checkout Page)
1. Navigate to: `http://localhost:3001/checkout?order_id=YOUR_ORDER_ID_HERE`
   *(Replace `YOUR_ORDER_ID_HERE` with the ID generated in the previous step)*.
   
2. **UPI Test:** - Enter `test@okaxis` (or any valid VPA format).
   - Click Pay.

3. **Card Test:** - Use a valid test number (starts with 4 for Visa, passes Luhn check): `4111 1111 1111 1111`.
   - Any future expiry date (e.g., `12/30`).
   - Any 3-digit CVV.
   - Click Pay.

4. **Observation:** - The system simulates a 5-10 second bank processing delay.
   - The status will eventually update to Success (Green) or Failed (Red).

### 4. Verify in Dashboard
1. Go to: `http://localhost:3000`
2. Login with test credentials:
   - **Email:** `test@example.com`
   - **Password:** (Any password works for this deliverable)
3. Go to the **Transactions** tab.
4. Verify your recent payment is listed with the correct status.

---

## 📚 Project Documentation
Detailed documentation regarding the system design and API specifications can be found here:

- [System Architecture & Data Flow](./documentation/ARCHITECTURE.md)
- [Database Schema & ER Diagram](./documentation/SCHEMA.md)
- [API Endpoints & Examples](./documentation/API_DOCS.md)

## ✨ Key Features Implemented
1. **Luhn Algorithm:** Validates credit card numbers mathematically before processing.
2. **Card Network Detection:** Automatically detects Visa/Mastercard/Amex/RuPay based on IIN ranges.
3. **Mock Banking Delay:** API simulates a realistic bank processing delay.
4. **Resilience:** Docker health checks ensure the API waits for Postgres to be ready before launching.
5. **Security:** Protected routes require `X-Api-Key` headers; API secrets are never exposed to the frontend.

## 📂 Project Structure
```text
/backend          # Express API logic & Validation Utils
/database         # SQL Init scripts & Seeding
/frontend         # React Dashboard (Merchant view)
/checkout-page    # React Checkout App (Customer view)
docker-compose.yml # Orchestration configuration
```