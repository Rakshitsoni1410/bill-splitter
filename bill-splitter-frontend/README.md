# Bill Splitter Frontend

A React-based web app to split bills and manage expenses with friends. Built with Vite + React 19.

## 🔗 Live Demo

- **Frontend:** [bill-splitter-app.vercel.app](https://bill-splitter-app.vercel.app)
- **Backend API:** [bill-splitter-1.onrender.com](https://bill-splitter-1.onrender.com)

## ✨ Features

- 🔐 User registration and login with JWT authentication
- 👥 Create and manage groups
- 💸 Split bills among group members
- 👛 Wallet to track balances
- 📱 Responsive design

## 🛠️ Tech Stack

- **React 19** — UI framework
- **Vite** — Build tool
- **React Router v7** — Client-side routing
- **Axios** — API calls
- **React Toastify** — Notifications

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Clone the repo
git clone https://github.com/Rakshitsoni1410/bill-splitter

# Go to frontend folder
cd bill-splitter-frontend

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the `bill-splitter-frontend` folder:

```env
VITE_API_URL=http://localhost:8080/api
```

For production, set:

```env
VITE_API_URL=https://bill-splitter-1.onrender.com/api
```

### Run Locally

```bash
npm run dev
```

App runs at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## 📁 Project Structure

```
bill-splitter-frontend/
├── public/
├── src/
│   ├── api/
│   │   └── axios.js        # Axios instance with JWT interceptor
│   ├── assets/
│   ├── components/         # Reusable components
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── GroupPage.jsx
│   │   └── Wallet.jsx
│   ├── App.jsx
│   └── main.jsx
├── .env
├── index.html
├── package.json
└── vite.config.js
```

## ☁️ Deployment (Vercel)

| Setting | Value |
|---|---|
| Root Directory | `bill-splitter-frontend` |
| Build Command | `npm run build` |
| Publish Directory | `dist` |
| Env Variable | `VITE_API_URL=https://bill-splitter-1.onrender.com/api` |

## 🔧 Backend

The backend is a Spring Boot REST API. See the root `README.md` for backend setup.