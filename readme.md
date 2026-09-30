# 🎓 Skill Binimoy (স্কিল বিনিময়)

> **Decentralized Peer-to-Peer Skill Exchange & Mentorship Platform**  
> Learn what you love, teach what you master — with zero monetary barriers.

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![GSAP](https://img.shields.io/badge/GSAP-3.x-88CE02?style=for-the-badge&logo=greensock&logoColor=white)](https://greensock.com/gsap/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Firebase](https://img.shields.io/badge/Firebase_Firestore-Admin_SDK-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Open in GitHub Codespaces](https://img.shields.io/badge/Codespaces-Ready-blue?style=for-the-badge&logo=github)](https://codespaces.new/Abrar2212/Skill_Binimoy)

---

## 🌟 Overview

**Skill Binimoy** is a full-stack peer-to-peer knowledge barter platform designed to democratize education. Instead of paying tuition or subscription fees, users exchange their skills (e.g., Web Development, Graphic Design, Languages, Music) in return for learning skills from vetted peers across the community.

---

## 🚀 Key Features

- 🎨 **Dynamic Landing Page**: Cutout hero presentation with circular emerald gradient backdrop, continuous floating badges powered by GSAP, and live stats counters.
- 🏪 **Live Peer Marketplace**: Search by keyword, filter by categories, explore community members with teaching/learning tags, and propose skill exchanges.
- 🤝 **Exchange Requests Hub**: Two-way workflow for sent and received proposals with real-time status management.
- 📹 **1-on-1 Video Sessions & Calling**: Integrated meeting management with Jitsi Meet and peer ratings/reviews.
- 💬 **Peer Messaging & AI Assistant**: Real-time conversation sync alongside an embedded AI learning assistant drawer.
- 📊 **Learner Dashboard**: Overview metrics (skills shared, skills learned, active sessions, reputation), activity feeds, and upcoming schedules.
- 👤 **Profile Studio**: Profile image upload with automatic client-side canvas compression, custom banner themes, and skill portfolio manager.
- 🌓 **Dark & Light Mode**: Persistent theme toggle with smooth transitions.

---

## 📁 Repository Structure

```text
Skill_Binimoy/
├── backend/
│   ├── config/                # Firebase Admin & database configuration
│   ├── controllers/           # Business logic & request handlers
│   ├── database/              # Schema & initialization scripts
│   ├── middleware/            # JWT authentication middleware
│   ├── routes/                # Express API routes
│   ├── utils/                 # Email delivery (Brevo) & helpers
│   ├── .env.example           # Environment variable template
│   ├── package.json
│   ├── seedDatabase.js        # Initial database seeder
│   └── server.js              # Express server entry point
├── frontend/
│   ├── public/                # Static assets, SVG icons, images
│   ├── src/
│   │   ├── assets/            # Graphics and SVGs
│   │   ├── components/
│   │   │   ├── common/        # Atoms: Button, Card, Modal, Input, Badge, ThemeToggle
│   │   │   ├── features/      # Feature modules (auth, chat, dashboard, marketplace, etc.)
│   │   │   └── layout/        # Navbar, Footer, Sidebar, AppLayout
│   │   ├── context/           # AuthContext, ThemeContext
│   │   ├── pages/             # Application views & route pages
│   │   ├── services/          # API client, auth, user, and exchange services
│   │   └── types/             # TypeScript definitions
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
├── .gitignore
└── readme.md
```

---

## 🛠️ Getting Started

### ☁️ Run in GitHub Codespaces (Recommended & Zero Setup)

You can launch and run Skill Binimoy directly inside GitHub Codespaces without installing anything on your machine:

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/Abrar2212/Skill_Binimoy)

1. Click the **Open in GitHub Codespaces** button above or click **Code > Codespaces > Create codespace on main**.
2. Dependencies and `.env` setup will run automatically.
3. Start both backend and frontend servers with a single command from the project root:
   ```bash
   npm run dev
   ```
4. VS Code will automatically forward port `5173` (Frontend) and `5000` (Backend API) and prompt you to open the application in your browser.

---

### Local Setup Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** or **yarn** / **pnpm**
- Firebase project credentials (for backend)

---

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Fill in your configuration in `.env` (Port, JWT Secret, Firebase credentials, Brevo API key).

4. Start the backend server:
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

---

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
