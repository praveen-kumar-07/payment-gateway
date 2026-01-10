# API Documentation

**Base URL:** `http://localhost:8000/api/v1`

## Authentication
Protected endpoints require the following headers:
- `X-Api-Key`: Your Merchant API Key
- `X-Api-Secret`: Your Merchant API Secret

---

### 1. Health Check
**GET** `/health`  
Used by Docker to verify service uptime.
- **Auth:** None
- **Response:**
  ```json
  {
    "status": "healthy",
    "database": "connected",
    "timestamp": "2024-01-09T10:00:00Z"
  }
  ```

### 2. Create Order
**POST** `/orders`
- **Auth:** Required
- **Body:**
  ```json
  {
    "amount": 50000,
    "currency": "INR",
    "receipt": "receipt_001"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "id": "order_a1b2c3d4e5f6g7h8",
    "status": "created",
    "amount": 50000
  }
  ```

### 3. Create Payment
**POST** `/payments`
- **Auth:** Required (or Public Endpoint variant for Checkout)
- **Body (Card):**
  ```json
  {
    "order_id": "order_a1b2c3d4e5f6g7h8",
    "method": "card",
    "card": {
      "number": "4111111111111111",
      "expiry_month": "12",
      "expiry_year": "2030",
      "cvv": "123",
      "holder_name": "Test User"
    }
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "id": "pay_z9y8x7w6v5u4t3s2",
    "status": "processing",
    "method": "card"
  }
  ```

### 4. Get Payment Status
**GET** `/payments/:paymentId`
- **Auth:** Required
- **Response:**
  ```json
  {
    "id": "pay_z9y8x7w6v5u4t3s2",
    "status": "success",
    "error_code": null
  }
  ```