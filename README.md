# 💰 Zorvyn Finance API

**A Secure, Scalable RESTful Backend for Financial Data Management and Access Control**

[![Node.js](https://img.shields.io/badge/Node.js-18.x+-green?style=flat-square&logo=node.js)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-lightgrey?style=flat-square&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-5.0+-green?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Admin%20SDK-orange?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![JWT](https://img.shields.io/badge/JWT-Secured-blue?style=flat-square)](https://jwt.io/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](#license)

---

## 📋 Overview

**Zorvyn Finance API** is a production-grade REST API designed to be the secure backend engine for financial record management systems. It solves the core challenge of safely managing sensitive financial data through:

- **Seamless Authentication**: Firebase-backed identity verification with custom JWT token generation
- **Fine-Grained Access Control**: Three-tier role-based access (Admin, Analyst, Viewer) protecting sensitive operations
- **Robust Financial Data Management**: Complete CRUD operations with pagination, filtering, and validation
- **Advanced Analytics**: Real-time dashboard summaries and financial trend analysis
- **Scalability**: Stateless API design suitable for cloud deployment and horizontal scaling

This API is designed for evaluators, senior developers, and production environments requiring enterprise-grade security and reliability.

---

## 🏗️ System Architecture

The following diagram illustrates the high-level architecture of the Zorvyn Finance API:

```mermaid
graph LR
    A["Client (Mobile/Web)"] -->|HTTP Request| B["Express.js API Server"]
    B -->|Verify Credentials| C["Firebase Auth Service"]
    C -->|Return Auth Token| B
    B -->|Route Request| D["RBAC Middleware"]
    D -->|Authorization Check| E["Role Validator"]
    E -->|Authorized| F["Controllers"]
    E -->|Unauthorized| G["403 Forbidden Response"]
    F -->|Business Logic| H["Services Layer"]
    H -->|CRUD Operations| I["Mongoose Models"]
    I -->|Query/Update| J["MongoDB Database"]
    J -->|Result| I
    I -->|Data| H
    H -->|Processed Data| F
    F -->|JSON Response| B
    B -->|HTTP Response| A

    style A fill:#e1f5ff
    style B fill:#fff3e0
    style C fill:#f3e5f5
    style D fill:#e8f5e9
    style J fill:#fce4ec
```

---

## 🔐 Authentication Workflow

The following sequence diagram represents the complete authentication and JWT token flow:

```mermaid
sequenceDiagram
    participant User
    participant Client as Client App
    participant FirebaseAuth as Firebase Auth
    participant API as Zorvyn API
    participant JWT as JWT Service
    participant MongoDB as MongoDB

    User->>Client: Enter credentials
    Client->>FirebaseAuth: Send credentials
    FirebaseAuth->>Client: Return ID Token
    Client->>API: POST /auth/login (with ID Token)
    API->>FirebaseAuth: Verify ID Token
    FirebaseAuth->>API: Token Valid ✓
    API->>JWT: Generate Custom JWT
    JWT->>API: Return Custom JWT
    API->>Client: Return JWT + User Profile
    Client->>Client: Store JWT locally

    Note over User,MongoDB: Subsequent Requests
    Client->>API: GET /api/records (Authorization: Bearer JWT)
    API->>JWT: Validate JWT Signature
    JWT->>API: Token Valid ✓
    API->>MongoDB: Fetch Records
    MongoDB->>API: Return Data
    API->>Client: Return Records JSON
    Client->>User: Display Financial Data

    style FirebaseAuth fill:#f3e5f5
    style JWT fill:#e8f5e9
    style MongoDB fill:#fce4ec
```

---

## ✨ Key Features

### 🔐 **Security & Authentication**

- Firebase Admin SDK for secure user identity verification
- Custom JWT token generation with configurable expiration
- Token refresh mechanisms for extended sessions
- Secure password hashing and validation

### 👥 **Role-Based Access Control (RBAC)**

- **Admin**: Full system access, user management, record deletion
- **Analyst**: Create/edit financial records, view all data
- **Viewer**: Read-only access to financial records and dashboards
- Middleware-based authorization on every protected route

### 💳 **Financial Record Management**

- Create, read, update, and delete financial records
- Support for multiple transaction types (Income, Expense, Transfer)
- Categorization system for better organization
- Date-based filtering and search capabilities

### 📊 **Advanced Data Processing**

- Pagination support (limit, offset, page-based)
- Dynamic filtering (by type, category, date range)
- Aggregation pipelines for summary statistics
- Real-time dashboard metrics and analytics

### 👤 **User Management** (Admin-only)

- List active and inactive users
- Promote or demote user roles
- Deactivate or permanently delete accounts
- User activity auditing capabilities

### 🛡️ **Production-Ready Architecture**

- Centralized error handling and logging
- Request validation middleware
- CORS protection and security headers
- Environment-based configuration
- MongoDB indexing for performance optimization

## Tech Stack

| Technology             | Purpose                         | Version |
| ---------------------- | ------------------------------- | ------- |
| **Node.js**            | Runtime environment             | 18.x+   |
| **Express.js**         | Web framework & routing         | 4.x+    |
| **MongoDB**            | NoSQL database                  | 5.0+    |
| **Mongoose**           | ODM for MongoDB                 | 7.x+    |
| **Firebase Admin SDK** | Authentication & identity       | Latest  |
| **JWT (jsonwebtoken)** | Token generation & validation   | 9.x+    |
| **Bcryptjs**           | Password hashing                | 2.x+    |
| **Dotenv**             | Environment variable management | 16.x+   |
| **Cors**               | Cross-origin resource sharing   | 2.x+    |
| **Joi**                | Request schema validation       | 17.x+   |

---

## 📁 Folder Structure

```
backend/
├── server.js                           # Application entry point
├── package.json                        # Dependencies and scripts
├── .env.example                        # Environment variables template
├── firebase-service-account.json       # Firebase credentials (not committed)
│
├── src/
│   ├── app.js                          # Express app configuration & middleware setup
│   │
│   ├── config/                         # Configuration files
│   │   ├── db.js                       # MongoDB/Mongoose connection
│   │   └── firebaseAdmin.js            # Firebase Admin SDK initialization
│   │
│   ├── controllers/                    # Business logic & route handlers
│   │   ├── auth.controller.js          # Authentication endpoints
│   │   ├── record.controller.js        # Financial record CRUD
│   │   ├── finance.controller.js       # Finance-specific operations
│   │   ├── dashboard.controller.js     # Analytics & summaries
│   │   └── user.controller.js          # User management (admin)
│   │
│   ├── middleware/                     # Custom middleware functions
│   │   ├── auth.middleware.js          # JWT & Firebase token verification
│   │   ├── role.middleware.js          # Role-based access control
│   │   ├── validatorMiddleware.js      # Request body/query validation
│   │   └── error.middleware.js         # Centralized error handling
│   │
│   ├── models/                         # Mongoose schemas & models
│   │   ├── User.js                     # User schema
│   │   ├── Record.js                   # Financial record schema
│   │   └── finance.model.js            # Finance-specific models
│   │
│   ├── routes/                         # API route definitions
│   │   ├── auth.routes.js              # /api/auth endpoints
│   │   ├── record.route.js             # /api/records endpoints
│   │   ├── finance.routes.js           # /api/finance endpoints
│   │   ├── dashboard.routes.js         # /api/dashboard endpoints
│   │   └── user.routes.js              # /api/users endpoints (admin)
│   │
│   ├── services/                       # Business logic & data processing
│   │   └── dashboard.service.js        # Dashboard calculations & aggregations
│   │
│   └── utils/                          # Utility functions
│       ├── generateToken.js            # JWT generation helpers
│       └── validators.js               # Input validation utilities
│
└── tests/                              # Test files (optional)
    ├── auth.test.js
    ├── records.test.js
    └── dashboard.test.js
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your system:

- **Node.js** (v16 or higher) — [Download](https://nodejs.org/)
- **npm** (v7 or higher, included with Node.js)
- **MongoDB** (v5.0+) — [Cloud: MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or [Local: Download](https://www.mongodb.com/try/download/community)
- **Firebase Account** — [Create Free Account](https://firebase.google.com/)

### Step-by-Step Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/zorvyn-finance.git
cd "Finance Data Processing and Access Control/backend"
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Set Up Environment Variables

Create a `.env` file in the `backend` directory (use `.env.example` as a template):

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/zorvyn-finance
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/zorvyn-finance?retryWrites=true&w=majority

# Firebase Configuration
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

# Logging
LOG_LEVEL=info
```

#### 4. Add Firebase Service Account

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project → Project Settings → Service Accounts
3. Click "Generate New Private Key"
4. Save the JSON file as `firebase-service-account.json` in the `backend` folder
5. **⚠️ IMPORTANT**: Add `firebase-service-account.json` to `.gitignore` (it's sensitive data)

#### 5. Start the Development Server

```bash
npm run dev
```

The API will be running at `http://localhost:4000`

#### 6. Build for Production

```bash
npm run build
npm start
```

---

## 📡 API Documentation

### Base URL

```
http://localhost:4000/api
```

### Authentication Header

All protected endpoints require:

```
Authorization: Bearer <JWT_TOKEN>
```

### Endpoints Reference

#### **Authentication Routes**

| Method | Endpoint                | Description                       | Required Role | Status Code |
| ------ | ----------------------- | --------------------------------- | ------------- | ----------- |
| POST   | `/auth/register-admin`  | Register a new admin user         | Public        | 201 / 400   |
| POST   | `/auth/login`           | Authenticate user & get JWT token | Public        | 200 / 401   |
| POST   | `/auth/firebase-verify` | Verify Firebase token directly    | Public        | 200 / 401   |
| GET    | `/auth/me`              | Get current user profile          | Viewer+       | 200 / 401   |
| POST   | `/auth/logout`          | Invalidate current session        | Viewer+       | 200         |

#### **Financial Records Routes**

| Method | Endpoint       | Description                   | Query Params                                      | Required Role  | Status Code     |
| ------ | -------------- | ----------------------------- | ------------------------------------------------- | -------------- | --------------- |
| GET    | `/records`     | List all financial records    | `page`, `limit`, `type`, `category`, `from`, `to` | Viewer         | 200 / 401       |
| POST   | `/records`     | Create a new financial record | —                                                 | Analyst, Admin | 201 / 400 / 403 |
| GET    | `/records/:id` | Get a specific record by ID   | —                                                 | Viewer         | 200 / 404 / 401 |
| PUT    | `/records/:id` | Update a financial record     | —                                                 | Analyst, Admin | 200 / 404 / 403 |
| DELETE | `/records/:id` | Delete a financial record     | —                                                 | Admin          | 204 / 404 / 403 |

**Example Request (Create Record):**

```bash
curl -X POST http://localhost:4000/api/records \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Monthly Salary",
    "amount": 5000,
    "type": "income",
    "category": "Salary",
    "date": "2026-04-06"
  }'
```

#### **Dashboard & Analytics Routes**

| Method | Endpoint                        | Description                                        | Query Params           | Required Role | Status Code |
| ------ | ------------------------------- | -------------------------------------------------- | ---------------------- | ------------- | ----------- |
| GET    | `/dashboard/summary`            | Get financial overview (income, expenses, balance) | `from`, `to`           | Viewer        | 200 / 401   |
| GET    | `/dashboard/trends`             | Get time-based trends (daily/monthly aggregates)   | `period`, `from`, `to` | Viewer        | 200 / 401   |
| GET    | `/dashboard/category-breakdown` | Get spending breakdown by category                 | `type`                 | Viewer        | 200 / 401   |

**Example Response (Dashboard Summary):**

```json
{
  "totalIncome": 15000,
  "totalExpenses": 4500,
  "netBalance": 10500,
  "categoryBreakdown": {
    "Groceries": 1200,
    "Utilities": 800,
    "Entertainment": 1500,
    "Transportation": 1000
  },
  "recordCount": 45
}
```

#### **User Management Routes** (Admin Only)

| Method | Endpoint                | Description                       | Required Role | Status Code     |
| ------ | ----------------------- | --------------------------------- | ------------- | --------------- |
| GET    | `/users`                | List all registered users         | Admin         | 200 / 403       |
| GET    | `/users/:id`            | Get user details by ID            | Admin         | 200 / 404 / 403 |
| PUT    | `/users/:id/role`       | Update user role (promote/demote) | Admin         | 200 / 404 / 403 |
| PATCH  | `/users/:id/deactivate` | Deactivate a user account         | Admin         | 200 / 404 / 403 |
| DELETE | `/users/:id`            | Permanently delete a user         | Admin         | 204 / 404 / 403 |

**Example Request (Update User Role):**

```bash
curl -X PUT http://localhost:4000/api/users/USER_ID/role \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role": "analyst"}'
```

---

## 🔧 Configuration

### Environment Variables Explained

| Variable                        | Default     | Description                                  |
| ------------------------------- | ----------- | -------------------------------------------- |
| `PORT`                          | 4000        | API server port                              |
| `NODE_ENV`                      | development | Execution environment                        |
| `MONGODB_URI`                   | (required)  | MongoDB connection string                    |
| `FIREBASE_SERVICE_ACCOUNT_PATH` | (required)  | Path to Firebase service account JSON        |
| `JWT_SECRET`                    | (required)  | Secret key for JWT signing                   |
| `JWT_EXPIRES_IN`                | 7d          | JWT token expiration duration                |
| `LOG_LEVEL`                     | info        | Logging verbosity (debug, info, warn, error) |

---

## 🧪 Testing (Optional)

To write and run tests for critical endpoints:

```bash
npm install --save-dev jest supertest
```

Example test structure:

```javascript
// tests/auth.test.js
const request = require("supertest");
const app = require("../src/app");

describe("Auth Endpoints", () => {
  it("should return JWT on successful login", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "user@example.com", password: "password" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});
```

Run tests:

```bash
npm test
```

---

## 📈 Performance & Scalability

- **Stateless Design**: API servers can be horizontally scaled behind a load balancer
- **Database Indexing**: Indexes on frequently queried fields (email, date, category)
- **Pagination**: Prevents memory overload with large datasets
- **JWT-based Auth**: No session storage on server, reducing memory footprint
- **Connection Pooling**: Mongoose manages MongoDB connection pool automatically

---

## 🚨 Error Handling

The API returns standardized error responses:

```json
{
  "success": false,
  "message": "Unauthorized access",
  "statusCode": 403,
  "timestamp": "2026-04-06T10:30:00Z"
}
```

Common HTTP Status Codes:

- `200 OK` — Successful request
- `201 Created` — Resource created successfully
- `400 Bad Request` — Invalid input or validation error
- `401 Unauthorized` — Missing or invalid authentication
- `403 Forbidden` — Insufficient permissions
- `404 Not Found` — Resource not found
- `500 Internal Server Error` — Server-side error

---

## 🔐 Security Best Practices

✅ **Implemented:**

- Firebase authentication for user identity
- JWT tokens with expiration
- Role-based access control (RBAC)
- Input validation & sanitization
- MongoDB injection prevention (Mongoose schema validation)
- CORS protection

✅ **Recommendations for Production:**

- Use HTTPS/TLS for all communications
- Rotate JWT_SECRET periodically
- Implement rate limiting on auth endpoints
- Enable MongoDB authentication & encryption
- Use environment-based secrets (AWS Secrets Manager, Azure Key Vault)
- Add API request logging & monitoring
- Implement audit trails for sensitive operations

---

## 📝 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 📧 Support & Feedback

For questions, issues, or contributions, please:

- Create an issue in the repository
- Contact the development team
- Review the inline code documentation

---

**Last Updated:** April 6, 2026  
**Version:** 1.0.0  
**Maintainer:** Development Team
