# API Testing Guide & Postman Structure

## Overview
LuxeMarket Enterprise uses **Jest** and **Supertest** for automated testing.
- **Unit Tests**: Test individual functions or utilities in isolation.
- **Integration Tests**: Test API endpoints including database interactions (using in-memory MongoDB).

## Running Tests

Prerequisites:
- Node.js installed
- Dependencies installed (`npm install` in backend directory)

Commands:
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Test Structure
```
backend/src/tests/
├── integration/       # API Route tests
│   └── productRoutes.test.ts
├── unit/             # Function/Unit tests
│   └── generateToken.test.ts
└── setup.ts          # Global test configuration (DB connection)
```

---

## Postman Collection Structure

You can replicate this structure in Postman to manually test the API.

### 1. Auth Folder
- **POST /Register**: `{{base_url}}/api/auth/register`
  - Body: `{ "name": "John Doe", "email": "john@example.com", "password": "password123" }`
- **POST /Login**: `{{base_url}}/api/auth/login`
  - Body: `{ "email": "john@example.com", "password": "password123" }`
- **POST /Logout**: `{{base_url}}/api/auth/logout`

### 2. Products Folder
- **GET /List Products**: `{{base_url}}/api/products?pageNumber=1&keyword=phone`
- **GET /Product Details**: `{{base_url}}/api/products/:id`
- **POST /Create Product (Admin)**: `{{base_url}}/api/products`
  - Auth: Bearer Token (Admin)
  - Body: `{ "name": "New Item", "price": 99.99, "description": "...", "category": "ID...", "stock": 10, "images": ["url"], "slug": "new-item" }`

### 3. Cart Folder
- **GET /Get Cart**: `{{base_url}}/api/cart`
  - Cookie: `jwt` (automatically handled by Postman if Login was called)
- **POST /Add Item**: `{{base_url}}/api/cart`
  - Body: `{ "productId": "ID...", "quantity": 1 }`
- **DELETE /Remove Item**: `{{base_url}}/api/cart/:itemId`

### 4. Orders Folder
- **POST /Create Order**: `{{base_url}}/api/orders`
  - Body: `{ "orderItems": [...], "shippingAddress": {...}, "paymentMethod": "RAZORPAY", "totalPrice": 100 }`
- **GET /My Orders**: `{{base_url}}/api/orders/myorders`

### 5. Admin Folder
- **GET /Dashboard Stats**: `{{base_url}}/api/admin/stats`

## Environment Variables (Postman)
Create an environment in Postman with:
- `base_url`: `http://localhost:5000`

## Jest Setup Notes
The `backend/src/tests/setup.ts` file handles the lifecycle of `mongodb-memory-server`. It creates a fresh in-memory database instance for the test suite and clears data between tests to ensure isolation.
