# System Architecture

## Overview
The Payment Gateway mimics a real-world payment processing system using a microservices-style architecture. It is built on the **PERN Stack** (PostgreSQL, Express, React, Node.js) and is fully Dockerized.

## System Diagram
The following diagram illustrates the data flow between the Client, Frontend Applications, Backend API, and Database.

```mermaid
graph TD
    %% Actors
    Client[Client / Merchant API]
    User[End User / Customer]

    %% Frontend Services
    subgraph Frontend
        Dashboard[Merchant Dashboard :3000]
        Checkout[Checkout Page :3001]
    end

    %% Backend Services
    subgraph Backend
        API[Backend API :8000]
        %% FIXED LINE BELOW: Added quotes around the label
        Worker["Payment Worker (Internal)"]
    end

    %% Database
    DB[(PostgreSQL :5432)]

    %% Connections
    Client -->|Create Order| API
    User -->|View Payment Page| Checkout
    User -->|View Stats| Dashboard
    
    Checkout -->|Poll Status| API
    Checkout -->|Submit Payment| API
    Dashboard -->|Fetch Transactions| API
    
    API -->|Read/Write| DB
    API -.->|Simulate Delay| Worker
```

## Data Flow Description
1.  **Order Creation:** The Merchant sends a POST request to the API to create an order. The API creates a record in the database with status `created`.
2.  **Checkout Initialization:** The Customer is redirected to the Checkout Page with the `order_id`. The page fetches order details.
3.  **Payment Processing:**
    * The Customer submits payment (UPI/Card).
    * The API validates inputs (Luhn Algorithm, VPA regex).
    * The API creates a payment record with status `processing`.
    * The system simulates a bank delay (5-10s) before randomly assigning `success` or `failed`.
4.  **Completion:** The Checkout Page polls the API to detect the status change and displays the result.