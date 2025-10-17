# 🏆 Contest Participation System

A simple **contest participation REST API** built with **Node.js**, **Express**, and **PostgreSQL**.

This project provides endpoints for:

* User registration and login (JWT-based authentication)
* Listing contests and fetching contest questions
* Submitting answers and scoring submissions
* Public contest leaderboards
* Admin endpoints for creating contests and adding questions

> 💡 **Note:** On startup, the server automatically **runs all database migrations and creates necessary indexes** — no manual SQL setup required.

---

## 🚀 Quick Start

### Prerequisites

* Node.js (v16+)
* PostgreSQL (v12+)

### 1️⃣ Install dependencies

```bash
cd contest-participation-system
npm install
```

### 2️⃣ Configure environment

Create a `.env` file in the project root (`contest-participation-system/`) with:

```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_db_password
DB_NAME=contest_db
JWT_SECRET=your_jwt_secret_key
```

### 3️⃣ Start the server

```bash
npm start
```

On startup:

* The app connects to PostgreSQL
* Automatically runs all SQL migrations in `migrations/`
* Creates necessary **indexes** to optimize performance

Server runs at: **[http://localhost:3000](http://localhost:3000)**

---

## 📁 Project Structure (Important Files)

| Path           | Description                             |
| -------------- | --------------------------------------- |
| `server.js`    | Application entry point                 |
| `config/db.js` | PostgreSQL pool and migration runner    |
| `routes/`      | API route definitions                   |
| `controllers/` | Request handlers                        |
| `services/`    | Business logic and scoring              |
| `models/`      | Database access layer                   |
| `migrations/`  | SQL migrations (auto-run on startup)    |
| `middleware/`  | Auth, error handling, and rate limiting |

---

## 🔗 API Overview

**Base path:** `/api`

### 👤 User Routes (`/api/user`)

* **POST** `/register` – Register a user
  Body: `{ username, email, password, role? }`
* **POST** `/login` – Login and receive a JWT
  Body: `{ email, password }`
* **GET** `/history` – Authenticated user’s contest/submission history
* **GET** `/prizes` – Authenticated user’s won contests (rank 1)

---

### 🏁 Contest Routes (`/api/contests`)

* **GET** `/` – List all accessible contests (guest allowed)
* **GET** `/:contestId` – Get contest details and questions (auth required)
* **POST** `/:contestId/submit` – Submit answers
  Body: `{ answers: { [question_id]: <answer> } }`

---

### 🏅 Leaderboard Routes (`/api/leaderboard`)

* **GET** `/:contestId` – Public leaderboard for the contest

---

### 🛠️ Admin Routes (`/api/admin`)

**Requires Admin role**

* **POST** `/contests` – Create contest
  Body: `{ name, description, start_time, end_time, prize_info?, access_level? }`
* **POST** `/contests/:contestId/questions` – Add question
  Body: `{ question_text, question_type, correct_answers, options? }`

---

## 🔐 Authentication

* JWT tokens signed with `JWT_SECRET`
* Include token in header:

  ```
  Authorization: Bearer <token>
  ```

---

## 🧮 Question Types & Scoring

* `true/false` – Boolean
* `single-select` – One correct option
* `multi-select` – Multiple correct options (must match exactly)

Scoring logic in `services/scoring.service.js` → **1 point per correct question**

---

## 🗄️ Database & Migrations

* All `.sql` files in `migrations/` are executed automatically at startup.
* Tables: `users`, `contests`, `questions`, `options`, `submissions`
* **Indexes** are created for commonly queried columns for performance.
* To run manually, execute SQL files sequentially in PostgreSQL.

---

## 🧰 Development Notes

* Security handled by `helmet`, `cors`, and `express-rate-limit`
* Centralized error handler: `middleware/errorHandler.js`
* `correct_answers` stored as `JSONB` in `questions` table

---

## 📬 Postman Collection

A ready-to-use **Postman collection** (`ContestParticipationSystem.postman_collection.json`) is included in the repository.

> Import it into Postman to test all routes easily with preconfigured requests and example payloads.

---

## 📜 Scripts

| Command     | Description                                       |
| ----------- | ------------------------------------------------- |
| `npm start` | Starts the server (runs migrations automatically) |

---

## 🪪 License

This project is provided **as-is**.
Update `package.json` with your license and author information as needed.

---
