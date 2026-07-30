<div align="center">

<img src="https://img.shields.io/badge/Status-Live%20%26%20Deployed-00C896?style=for-the-badge&logo=vercel&logoColor=white" />
<img src="https://img.shields.io/badge/Stack-MERN-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
<img src="https://img.shields.io/badge/AI-Powered%20Insights-FF6B6B?style=for-the-badge&logo=openai&logoColor=white" />
<img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" />

<br /><br />

# 💸 AI Finance Tracker

### *Where your money finally starts making sense.*

**A production-grade, AI-enhanced personal finance dashboard** built with the MERN stack —
designed with a modern fintech aesthetic and deployed on cloud infrastructure.

<br />

[🌐 Live Demo](https://ai-finance-tracker.vercel.app) &nbsp;|&nbsp; [🔗 Backend API](https://ai-finance-tracker-8aqe.onrender.com) &nbsp;|&nbsp; [📁 Source Code](https://github.com/soumyadip-das-dev/ai-finance-tracker)

<br />

---

</div>

```
📁 docs/screenshots/
    ├── dashboard.png     ← Main dashboard view
    ├── chart.png         ← Category analytics chart
    └── add.png           ← Add transaction UI
```

---

## ✨ Why This Project Stands Out

> Most expense trackers are CRUD apps with a table. This is not that.

This project was built around three core convictions:

| Conviction | What it means in practice |
|---|---|
| 🧠 **Insight > Storage** | Data is displayed *and* interpreted — the app tells you what it means |
| 🎨 **UX is a feature** | Smooth animations, instant updates, and a Stripe-grade UI make it feel real |
| 🏗️ **Architecture scales** | JWT auth, LLM integration, and forecasting are drop-in additions — not afterthoughts |

---

## 🚀 Core Features

### 💳 Expense Management
- Add and delete transactions with **instant UI updates** (no page reloads)
- Categorized spending: Food, Travel, Bills, Entertainment, and more
- Real-time balance and spending totals

### 📊 Analytics Dashboard
- Total spending overview at a glance
- **Category-wise distribution** with interactive charts
- Automatic **top spending category detection**
- Clean, scannable visual hierarchy inspired by Stripe and Linear

### 🧠 AI Insights Engine *(Rule-Based → LLM-Ready)*
- Intelligent spending pattern analysis
- High-expense category flagging
- Actionable financial suggestions
- Architected to plug in GPT-4/Claude with minimal refactoring

---

## 🏗️ Tech Stack

<table>
<tr>
<td valign="top" width="33%">

**Frontend**
- ⚛️ React (Vite)
- 🎨 Material UI
- 🔗 Axios
- ⚡ `useMemo` + Custom Hooks

</td>
<td valign="top" width="33%">

**Backend**
- 🟢 Node.js
- 🚂 Express.js
- 🍃 MongoDB Atlas

</td>
<td valign="top" width="33%">

**DevOps**
- ▲ Vercel (Frontend)
- 🖥️ Render (Backend)
- ☁️ MongoDB Atlas (DB)

</td>
</tr>
</table>

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/soumyadip-das-dev/ai-finance-tracker.git
cd ai-finance-tracker
```

### 2️⃣ Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in `/server`:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

Start the server:
```bash
npm start
# Server running at http://localhost:5000
```

### 3️⃣ Frontend Setup
```bash
cd client
npm install
npm run dev
# App running at http://localhost:5173
```

---

## 📐 Architecture Overview

```
ai-finance-tracker/
├── client/                  # React + Vite Frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── pages/           # Route-level views
│   │   └── utils/           # Helpers & AI insight logic
│   └── vite.config.js
│
├── server/                  # Node.js + Express Backend
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API endpoints
│   ├── controllers/         # Business logic
│   └── index.js
│
└── docs/
    └── screenshots/         # UI previews
```

---

## 🔮 Roadmap

- [x] Core expense tracking (add, delete, categorize)
- [x] Analytics dashboard with category charts
- [x] Rule-based AI insights engine
- [x] Full cloud deployment (Vercel + Render + Atlas)
- [ ] 🔐 JWT Authentication — multi-user support
- [ ] 🤖 LLM Integration — GPT-4 / Claude for natural language insights
- [ ] 📈 Monthly trends & spending forecasting
- [ ] 🔁 Recurring expense tracking
- [ ] 📤 CSV/PDF export

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

### ⭐ Found this useful? Star it on GitHub!

*Every star helps this project reach more developers.*

[Give it a ⭐](https://github.com/soumyadip-das-dev/ai-finance-tracker)

</div>
