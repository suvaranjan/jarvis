# Jarvis AI chat Bot Setup Guide

This project consists of a **client** (frontend) and a **server** (backend). Follow the steps below to configure and run the application locally.

---

## 📁 Environment Configuration

###  Client `.env` (inside `/client` folder)

Create a `.env` file inside the `client` directory with the following:

```env
VITE_CLERK_PUBLISHABLE_KEY=
VITE_API_BASE_URL=
VITE_IMAGEKIT_PUBLIC_KEY=
```

### Server `.env` (inside `/server` folder)

Create a `.env` file inside the `server` directory with the following:

```env
PORT=
MONGODB_URI=
appName=
GEMINI_API_KEY=
CLERK_WEBHOOK_SECRET=
CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
IMAGEKIT_ENDPOINT=
IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
```

---

## 📦 Installation & Development

### ▶️ Start the Client

```bash
cd client
npm install --force
npm run dev
```

### ▶️ Start the Server

```bash
cd server
npm install
npm run dev
```

---

## ✅ You're all set!

Make sure all environment variables are correctly filled out for full functionality.  

