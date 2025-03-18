# API Routes Documentation

This document provides information about the available API routes in the JayLoy Frontend application.

## Authentication

All API routes require authentication. You need to include an `Authorization` header with a bearer token in your requests.

Example:
```
Authorization: Bearer yourAccessToken
```

## Transactions API

### Base URL
```
/api/transactions
```

### Routes

#### GET /api/transactions
Get all transactions with optional filtering.

**Query Parameters:**
- `date` (string): Filter by specific date (YYYY-MM-DD format)
- `month` (string): Filter by month (YYYY-MM format)
- `categoryID` (number): Filter by category ID
- `type` (string): Filter by transaction type (EXPENSE or INCOME)

**Response:**
```json
[
  {
    "id": "123",
    "amount": 5000, // In cents (50.00)
    "type": "EXPENSE",
    "categoryID": 2,
    "date": "2023-05-01",
    "description": "Groceries"
  },
  ...
]
```

#### GET /api/transactions/:id
Get a specific transaction by ID.

**Response:**
```json
{
  "id": "123",
  "amount": 5000,
  "type": "EXPENSE",
  "categoryID": 2,
  "date": "2023-05-01",
  "description": "Groceries"
}
```

#### POST /api/transactions
Create a new transaction.

**Request Body:**
```json
{
  "amount": 5000, // In cents (50.00)
  "type": "EXPENSE",
  "categoryID": 2,
  "date": "2023-05-01",
  "description": "Groceries"
}
```

**Response:**
```json
{
  "id": "123",
  "amount": 5000,
  "type": "EXPENSE",
  "categoryID": 2,
  "date": "2023-05-01",
  "description": "Groceries"
}
```

#### PATCH /api/transactions/:id
Update an existing transaction.

**Request Body:**
```json
{
  "amount": 6000, // In cents (60.00)
  "description": "Updated description"
}
```

**Response:**
```json
{
  "id": "123",
  "amount": 6000,
  "type": "EXPENSE",
  "categoryID": 2,
  "date": "2023-05-01",
  "description": "Updated description"
}
```

#### DELETE /api/transactions/:id
Delete a transaction.

**Response:**
Status: 204 No Content

#### GET /api/transactions/by-date/:date
Get transactions for a specific date.

**Response:**
```json
[
  {
    "id": "123",
    "amount": 5000,
    "type": "EXPENSE",
    "categoryID": 2,
    "date": "2023-05-01",
    "description": "Groceries"
  },
  ...
]
```

## Usage in Frontend Code

You can use the provided `transactionApi` utility in your components:

```typescript
import { transactionApi } from "@/app/(root)/api/transactions/api";

// Get all transactions
const transactions = await transactionApi.getTransactions();

// Get filtered transactions
const expenseTransactions = await transactionApi.getTransactions({ 
  type: "EXPENSE", 
  month: "2023-05" 
});

// Get a specific transaction
const transaction = await transactionApi.getTransaction("123");

// Create a transaction
const newTransaction = await transactionApi.createTransaction({
  amount: 5000,
  type: "EXPENSE",
  categoryID: 2,
  date: "2023-05-01",
  description: "Groceries"
});

// Update a transaction
await transactionApi.updateTransaction("123", {
  amount: 6000,
  description: "Updated description"
});

// Delete a transaction
await transactionApi.deleteTransaction("123");
``` 