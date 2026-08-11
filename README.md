<div align="center">

<img src="https://img.shields.io/badge/Stack-MERN-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
<img src="https://img.shields.io/badge/AI-Gemini%20Powered-4285F4?style=for-the-badge&logo=google&logoColor=white" />
<img src="https://img.shields.io/badge/Auth-JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />
<img src="https://img.shields.io/badge/Security-Hardened-green?style=for-the-badge&logo=shield&logoColor=white" />
<img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" />

<br /><br />

# 💸 AI Finance Tracker

### *Where your money finally starts making sense.*

A full-stack personal finance dashboard powered by **Google Gemini AI** — built with the MERN stack, featuring JWT authentication, budget management, recurring transactions, and intelligent AI-driven insights.

<br />

[📁 Source Code](https://github.com/soumyadip-das-dev/ai-finance-tracker)

<br />

---

</div>

## ✨ Features

### 🔐 Authentication
- Secure **JWT-based** login & registration
- Protected routes — dashboard is inaccessible without a valid token
- Persistent sessions via `localStorage`
- **Rate limiting** on auth endpoints — 10 requests per 15 minutes per IP

### 💳 Transaction Management
- Add, edit, and delete transactions with **instant UI updates**
- Categorized spending: Food, Travel, Bills, Entertainment, and more
- Real-time balance and spending totals

### 📊 Analytics Dashboard
- Category-wise spending breakdown with interactive charts
- Total income vs expense overview
- Top spending category detection

### 🧠 Gemini AI Insights
- AI-powered financial analysis using **Google Gemini 1.5 Flash**
- Personalized spending summaries and savings suggestions
- Budget health score (0–100) based on last 3 months of data
- Natural language insights from your transaction history

### 📅 Budget Management
- Set monthly budgets per category
- Track budget utilization in real-time
- Alerts when nearing or exceeding limits

### 🔁 Recurring Transactions
- Schedule recurring income or expenses (daily, weekly, monthly)
- Auto-applied via a background cron job (runs every hour)

---

## 🏗️ Tech Stack

<table>
<tr>
<td valign="top" width="33%">

**Frontend**
- ⚛️ React (Vite)
- 🎨 Material UI v5
- 💨 Tailwind CSS v4
- 🔗 Axios
- 🧭 React Router v6

</td>
<td valign="top" width="33%">

**Backend**
- 🟢 Node.js + Express v5
- 🍃 MongoDB Atlas + Mongoose
- 🔑 JWT + bcryptjs
- 🛡️ express-rate-limit
- ⏱️ node-cron (recurring jobs)
- 🤖 Google Generative AI SDK

</td>
<td valign="top" width="33%">

**Infrastructure**
- ☁️ MongoDB Atlas (Database)
- 🌐 Vite dev server (Frontend)
- 🖥️ Nodemon (Backend)

</td>
</tr>
</table>

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier works)
- Google Gemini API key — [get one here](https://aistudio.google.com/app/apikey)

### 1. Clone the Repository
```bash
git clone https://github.com/soumyadip-das-dev/ai-finance-tracker.git
cd ai-finance-tracker
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file inside `/server` (use `.env.example` as a template):
```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_strong_random_secret_64_chars
GEMINI_API_KEY=your_google_gemini_api_key
ALLOWED_ORIGINS=http://localhost:5173
PORT=5000
```

> **JWT_SECRET tip:** Generate a secure secret with:
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

> **MongoDB Atlas**: Go to **Network Access** → Add your current IP (or `0.0.0.0/0` for development).

Start the backend:
```bash
npm run dev
# Server running at http://localhost:5000
```

### 3. Frontend Setup
```bash
cd client
npm install
```

Create a `.env` file inside `/client` (optional for local dev):
```env
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
# App running at http://localhost:5173
```

---

## 📐 Project Structure

```
ai-finance-tracker/
├── client/                     # React + Vite Frontend
│   └── src/
│       ├── api/                # Axios instance & interceptors
│       ├── components/         # Navbar, BudgetManager, RecurringManager
│       ├── context/            # AuthContext (JWT session)
│       ├── pages/              # Login, Register, Dashboard
│       └── index.css           # Tailwind CSS v4 entry
│
└── server/                     # Node.js + Express Backend
    ├── controllers/            # Business logic (auth, transactions, AI)
    ├── jobs/                   # Cron jobs (recurring transactions)
    ├── middleware/             # JWT auth middleware
    ├── models/                 # Mongoose schemas
    ├── routes/                 # API route definitions
    ├── .env.example            # Environment variable template
    └── server.js               # Entry point
```

---

## 🔌 API Endpoints

| Method | Endpoint | Auth | Rate Limited | Description |
|--------|----------|------|--------------|-------------|
| `POST` | `/api/auth/register` | ❌ | ✅ 10/15min | Create new account |
| `POST` | `/api/auth/login` | ❌ | ✅ 10/15min | Login, returns JWT |
| `GET` | `/api/transactions` | ✅ | ❌ | Fetch all transactions |
| `POST` | `/api/transactions` | ✅ | ❌ | Add a transaction |
| `PUT` | `/api/transactions/:id` | ✅ | ❌ | Update a transaction |
| `DELETE` | `/api/transactions/:id` | ✅ | ❌ | Delete a transaction |
| `GET` | `/api/budgets` | ✅ | ❌ | Fetch budgets with spent amount |
| `POST` | `/api/budgets` | ✅ | ❌ | Set / update a budget |
| `DELETE` | `/api/budgets/:id` | ✅ | ❌ | Delete a budget |
| `GET` | `/api/recurring` | ✅ | ❌ | Fetch recurring rules |
| `POST` | `/api/recurring` | ✅ | ❌ | Add a recurring rule |
| `POST` | `/api/ai/analyze` | ✅ | ❌ | Get Gemini AI spending analysis |

---

## 🔒 Security

- **CORS** restricted to allowed origins via `ALLOWED_ORIGINS` environment variable
- **Rate limiting** on auth endpoints to prevent brute-force attacks
- **JWT** tokens verified server-side on every protected route
- **Password hashing** with bcryptjs (salt rounds: 10)
- **Ownership checks** on every transaction update/delete — users can only access their own data
- **No sensitive data leaked** in API error responses
- **`.env` never committed** — use `.env.example` as reference

---

## 🔮 Roadmap

- [x] JWT Authentication — multi-user support
- [x] Gemini AI integration — natural language insights & budget health score
- [x] Budget management per category
- [x] Recurring expense/income scheduling
- [x] Analytics dashboard with charts
- [x] Security hardening (CORS, rate limiting, error sanitization)
- [ ] 📤 CSV / PDF export
- [ ] 📈 Monthly trends & spending forecasting
- [ ] 📱 Mobile responsive layout

---

## 🧑‍💻 Author

<div align="center">

**Soumyadip Das**
B.Tech Student &nbsp;|&nbsp; Aspiring AI/ML Engineer

[![GitHub](https://img.shields.io/badge/GitHub-soumyadip--das--dev-181717?style=flat-square&logo=github)](https://github.com/soumyadip-das-dev)

*Building at the intersection of AI and full-stack engineering.*

</div>

---

<div align="center">

⭐ If you found this useful, consider starring the repo!

</div>
