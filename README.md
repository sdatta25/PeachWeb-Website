# PeachWeb

A professional web development company website that builds custom websites and AI chatbots for local businesses and organizations.

## Project Overview

PeachWeb is a full-stack website with:
- **React + Vite + Tailwind CSS** frontend (port 5174)
- **Node.js + Express** backend (port 3002)
- **SQLite** database (via better-sqlite3) for storing inquiries
- **Nodemailer** for email notifications and auto-replies
- **Anthropic Claude** AI chatbot ("Peachy")

---

## Setup Instructions

### 1. Get a Gmail App Password (for Nodemailer)

Gmail requires an App Password instead of your regular password when using third-party apps.

1. Go to your Google Account → **Security**
2. Under "How you sign in to Google", enable **2-Step Verification** (required)
3. Search for **"App passwords"** in the search bar
4. Create a new App Password — name it "PeachWeb"
5. Copy the 16-character password shown

### 2. Get an Anthropic API Key (for AI Chatbot)

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign in or create an account
3. Navigate to **API Keys**
4. Click **Create Key** and copy it

### 3. Create the `.env` file

```bash
cd backend
cp .env.example .env
```

Then edit `backend/.env` and fill in your values:

```
EMAIL_USER=peachwebdevelopment@gmail.com
EMAIL_PASS=your_16_char_gmail_app_password
ANTHROPIC_API_KEY=sk-ant-...your_key_here...
PORT=3002
```

---

## Install Dependencies

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

---

## Running the Project

You need two terminal windows — one for each server.

### Terminal 1 — Backend
```bash
cd backend
npm run dev
```
Backend will run at: **http://localhost:3002**

### Terminal 2 — Frontend
```bash
cd frontend
npm run dev
```
Frontend will run at: **http://localhost:5174**

Open **http://localhost:5174** in your browser.

---

## Admin: Viewing Inquiries

To view all submitted inquiries:
Set `ADMIN_KEY` in your environment to a long random string; the admin endpoints
refuse all requests until it is set.

```bash
curl -H "x-admin-key: $ADMIN_KEY" http://localhost:3002/api/inquiries
```

To update an inquiry's status:
```bash
curl -X PATCH -H "x-admin-key: $ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{"status":"contacted"}' \
  http://localhost:3002/api/inquiries/<id>
```

---

## Project Structure

```
PeachWeb/
├── backend/
│   ├── server.js         # Express API server
│   ├── package.json
│   ├── .env.example      # Copy to .env and fill in secrets
│   └── peachweb.db       # Auto-created SQLite database
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   │   └── components/
│   │       ├── Navbar.jsx
│   │       ├── Hero.jsx
│   │       ├── WhySection.jsx
│   │       ├── WhatWeBuild.jsx
│   │       ├── HowItWorks.jsx
│   │       ├── ContactSection.jsx
│   │       ├── RequestModal.jsx
│   │       ├── ChatWidget.jsx
│   │       └── Footer.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/inquiries` | Submit a new website request |
| GET | `/api/inquiries` | List all inquiries (admin key required) |
| PATCH | `/api/inquiries/:id` | Update inquiry status (admin key required) |
| POST | `/api/chat` | Chat with Peachy AI assistant |
