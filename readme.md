# 🎓 Skill Binimoy (Frontend)

> **Decentralized Peer-to-Peer Skill Exchange & Mentorship Platform**  
> Learn what you love, teach what you master — with zero monetary barriers.

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![GSAP](https://img.shields.io/badge/GSAP-3.x-88CE02?style=for-the-badge&logo=greensock&logoColor=white)](https://greensock.com/gsap/)

---

## 🌟 Overview

**Skill Binimoy** is a peer-to-peer knowledge barter platform designed to democratize learning and skill sharing. Rather than paying monetary fees, users exchange their skills (e.g., Web Development, UI/UX Design, Language Learning, Music) in return for learning skills from fellow community members.

This repository hosts the **modern frontend application**, engineered with a clean component-driven architecture, fluid GSAP micro-animations, Tailwind CSS styling, responsive Dark/Light themes, and full TypeScript type safety.

---

## 🚀 Features

- 🎨 **Dynamic Landing Page**: Cutout hero showcase, continuous floating badges powered by GSAP, live stats counters, and interactive testimonials.
- 🏪 **Skill Marketplace**: Search, filter by categories, and explore community members with teaching/learning tags. Direct modal to submit skill exchange proposals.
- 🤝 **Exchange Requests Hub**: Manage incoming requests and sent proposals with real-time status tracking (Pending, Accepted, Rejected).
- 📹 **1-on-1 Video Calling & Sessions**: Video session management with Jitsi Meet integration, review endorsements, and star rating system.
- 💬 **Messaging & AI Assistant**: Direct peer chat interface alongside an embedded AI learning assistant drawer.
- 📊 **Learner Dashboard**: Overview metrics (skills shared, skills learned, active sessions, reputation), activity feeds, and upcoming sessions.
- 👤 **Profile & Customization**: Image upload with automatic client-side canvas compression, custom banner themes, bio, and skill portfolio manager.
- 🌓 **Dark & Light Mode**: Persistent theme toggle with seamless visual transitions.

---

## 📁 Directory Structure

```text
Skill_Binimoy/
├── frontend/
│   ├── public/                # Static assets, SVG icons, images
│   ├── src/
│   │   ├── assets/            # Component graphics and SVGs
│   │   ├── components/
│   │   │   ├── common/        # Atoms: Button, Card, Modal, Input, Badge, ThemeToggle
│   │   │   ├── features/      # Feature modules: auth, chat, dashboard, home, marketplace, profile, requests, sessions
│   │   │   └── layout/        # Navbar, Footer, Sidebar, AppLayout
│   │   ├── context/           # AuthContext, ThemeContext
│   │   ├── pages/             # Route pages (Home, Marketplace, Dashboard, Chat, etc.)
│   │   ├── services/          # API client, auth, chat, user, and exchange services
│   │   └── types/             # TypeScript type definitions
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

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** or **yarn** / **pnpm**

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Abrar2212/Skill_Binimoy.git
   cd Skill_Binimoy/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

### Production Build

To build the application for production:
```bash
npm run build
```

To preview the production build locally:
```bash
npm run preview
```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
