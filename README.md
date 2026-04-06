# Zorvyn Finance API (Finance Data Processing and Access Control)

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-%3E4.0-green)](https://www.mongodb.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-orange)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-MIT-blue)](#license)

---

## Brief Description

Zorvyn Finance API is a secure, robust RESTful API built to manage financial records. It integrates Firebase Authentication for secure user verification, issues custom JWTs for session management, and implements role-based access control (Admin, Analyst, Viewer). The API provides CRUD operations for financial records, advanced data processing endpoints (pagination, filtering, summaries), and admin-only user management features.

## Key Features

- Secure Authentication using Firebase Auth and custom JWTs
- Role-Based Access Control (Admin, Analyst, Viewer)
- Financial Record Management (Create / Read / Update / Delete)
- Advanced Data Processing: pagination, filtering, and dynamic dashboard summaries
- User Management: list users, promote/demote roles, deactivate, delete (Admin-only)
- Designed for extensibility and production-readiness (logging, error handling middleware)

## Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- Firebase Admin SDK (Authentication)
- JWT (JSON Web Tokens)

## Prerequisites

- Node.js (v16+ recommended)
- npm (or yarn)
- MongoDB (local or hosted Atlas cluster)
- Firebase account with a service account JSON (for Firebase Admin SDK)

## Installation & Setup Instructions

1. Clone the repository:

   ```bash
   git clone <your-repo-url>
   cd "Finance Data Processing and Access Control"
   ```

2. Install backend dependencies:

   ```bash
   cd backend
   npm install
   ```

3. Copy example environment variables and update values:

   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

4. Add your Firebase service account JSON to the project root (or a secure path) and set its path in `.env`.

5. Start the server (development):

   ```bash
   npm run dev
   ```

6. Build and start for production:

   ```bash
   npm run build
   npm start
   ```

## Environment Variables (.env example)

Create a `.env` file in the `backend` folder with the following variables:

```
PORT=4000
MONGODB_URI=mongodb://localhost:27017/zorvyn-finance
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=1d
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json
# Optional
LOG_LEVEL=info
```

Notes:

- `FIREBASE_SERVICE_ACCOUNT_PATH` should point to the service account JSON file you download from Firebase Console.
- Keep `JWT_SECRET` secure and rotate periodically.

## API Documentation (Key Routes)

| Method | Endpoint                    | Description                                   | Required Role                    |
| ------ | --------------------------- | --------------------------------------------- | -------------------------------- |
| POST   | `/api/auth/firebase-verify` | Verify Firebase ID token and issue custom JWT | Public (Firebase token required) |
| POST   | `/api/auth/custom-token`    | Exchange Firebase token for application JWT   | Public (Firebase token required) |
| GET    | `/api/auth/me`              | Get current user profile                      | Viewer (authenticated)           |

| GET | `/api/records` | List financial records (supports pagination & filters: ?page=&limit=&type=&category=&from=&to=) | Viewer |
| POST | `/api/records` | Create a new financial record | Analyst, Admin |
| GET | `/api/records/:id` | Get single financial record | Viewer |
| PUT | `/api/records/:id` | Update a financial record | Analyst, Admin |
| DELETE | `/api/records/:id` | Delete a financial record | Admin |

| GET | `/api/dashboard/summary` | Get dashboard summary (total income, expenses, category breakdown) | Viewer |
| GET | `/api/dashboard/trends` | Time-based income/expense trends (date range & aggregation) | Viewer |

| GET | `/api/users` | List all registered users | Admin |
| GET | `/api/users/:id` | Get user details | Admin |
| PUT | `/api/users/:id/role` | Update user role (promote/demote) | Admin |
| PATCH | `/api/users/:id/deactivate` | Deactivate a user account | Admin |
| DELETE | `/api/users/:id` | Delete user | Admin |

> Authentication: All protected routes require `Authorization: Bearer <JWT>` header. Firebase ID tokens are verified server-side to mint application JWTs.

## Request & Response Notes

- Pagination: `/api/records?page=1&limit=20`
- Filters: `/api/records?type=income&category=salary&from=2026-01-01&to=2026-03-31`
- Dashboard endpoints return aggregated numbers and simple series for charts.

## Folder Structure

```
backend/
├─ package.json
├─ server.js               # App entry (Express server configuration)
├─ firebase-service-account.json  # (not committed) Firebase service account
├─ src/
│  ├─ app.js               # Express app setup, middleware registration
│  ├─ config/
│  │  ├─ db.js             # Mongoose connection
│  │  └─ firebaseAdmin.js  # Firebase Admin initialization
│  ├─ controllers/
│  │  ├─ auth.controller.js
│  │  ├─ finance.controller.js
│  │  ├─ record.controller.js
│  │  ├─ user.controller.js
│  │  └─ dashboard.controller.js
│  ├─ middleware/
│  │  ├─ auth.middleware.js    # JWT + Firebase verification
│  │  ├─ role.middleware.js    # Role-based access enforcement
│  │  ├─ validatorMiddleware.js# Request validation
│  │  └─ error.middleware.js   # Centralized error handling
│  ├─ models/
│  │  ├─ User.js
│  │  ├─ Record.js
│  │  └─ finance.model.js
│  ├─ routes/
│  │  ├─ auth.routes.js
│  │  ├─ record.route.js
│  │  ├─ finance.routes.js
│  │  └─ user.routes.js
│  ├─ services/
│  │  └─ dashboard.service.js
│  └─ utils/
│     └─ generateToken.js   # JWT helpers
└─ .env.example
```

## Development Tips

- Use a local MongoDB or a free Atlas cluster for development.
- Keep the Firebase service account JSON out of version control; use environment-based secrets in production.
- Use tools like `nodemon` for automatic server reloads during development.
- Add request logging (morgan/winston) and monitor error middleware for production readiness.

## Testing

- Add integration tests with Jest or Mocha + Supertest for critical endpoints: auth, records, and dashboard summaries.

## License

MIT License

---

If you'd like, I can also:

- Generate detailed OpenAPI/Swagger docs from these routes
- Add Postman collection export
- Create a `.env.example` file in the `backend` folder
