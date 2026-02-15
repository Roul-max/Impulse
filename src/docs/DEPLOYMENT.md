# 🚀 Deployment Guide - LuxeMarket Enterprise

This guide covers the deployment process for the LuxeMarket e-commerce application. The architecture consists of a **Node.js/Express Backend** and a **React/Vite Frontend**.

---

## 🏗 System Architecture
- **Frontend**: React + TypeScript + Vite (Deployed on Vercel/Netlify)
- **Backend**: Node.js + Express (Deployed on Render/Railway/AWS)
- **Database**: MongoDB Atlas (Cloud Managed)
- **Payment**: Razorpay
- **AI**: Google Gemini API

---

## 1. ☁️ Database Setup (MongoDB Atlas)

1. **Create Account**: Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. **Create Cluster**: Launch a free M0 Sandbox cluster.
3. **Create User**: In "Database Access", create a user (e.g., `luxe_admin`) and generate a password.
4. **Network Access**: Allow access from anywhere (`0.0.0.0/0`) or specific deployment IPs.
5. **Get Connection String**:
   - Click "Connect" -> "Drivers" -> "Node.js".
   - Copy the string: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/luxemarket?retryWrites=true&w=majority`

---

## 2. 🔙 Backend Deployment (Render.com)

We will deploy the backend as a Web Service.

### Prerequisites
- Push `backend/` code to a Git repository.

### Steps
1. **New Web Service**: Connect your GitHub repo.
2. **Root Directory**: `backend`
3. **Build Command**: `npm install && npm run build`
4. **Start Command**: `npm start`
5. **Environment Variables**:
   Add the following in the Render dashboard:
   - `NODE_ENV`: `production`
   - `PORT`: `5000` (or leave default)
   - `MONGO_URI`: (Your MongoDB Atlas connection string)
   - `JWT_SECRET`: (Generate a strong random string)
   - `JWT_REFRESH_SECRET`: (Generate a strong random string)
   - `RAZORPAY_KEY_ID`: (From Razorpay Dashboard)
   - `RAZORPAY_KEY_SECRET`: (From Razorpay Dashboard)
   - `FRONTEND_URL`: `https://your-frontend-app.vercel.app` (Add this after deploying frontend)

---

## 3. 🖥 Frontend Deployment (Vercel)

We will deploy the React frontend.

### Steps
1. **Install Vercel CLI** or use the Dashboard.
2. **New Project**: Import your Git repo.
3. **Root Directory**: `.` (Root)
4. **Framework Preset**: Vite
5. **Build Command**: `npm run build`
6. **Output Directory**: `dist`
7. **Environment Variables**:
   - `VITE_API_URL`: `https://your-backend-service.onrender.com/api` (The URL of your deployed backend)
   - `VITE_RAZORPAY_KEY_ID`: (Your Razorpay Key ID, public)

### Rewrites (for SPA)
Ensure `vercel.json` is present to handle client-side routing.

---

## 4. 🔒 Security Checklist

- [ ] **HTTPS**: Ensure all endpoints are served over HTTPS.
- [ ] **Headers**: `helmet` middleware is active on backend.
- [ ] **CORS**: `FRONTEND_URL` in backend env matches the actual frontend domain.
- [ ] **Rate Limiting**: `express-rate-limit` is configured and active.
- [ ] **Mongo Sanitize**: `express-mongo-sanitize` is preventing injection.
- [ ] **Secrets**: No secrets committed to Git (check `.gitignore`).
- [ ] **Logging**: Production logs are writing to `combined.log` or a logging service (Datadog/NewRelic).

---

## 5. 🤖 CI/CD (GitHub Actions)

Create `.github/workflows/deploy.yml` to automate testing on push.

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Use Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20.x'
    
    # Backend
    - name: Install Backend Deps
      working-directory: ./backend
      run: npm ci
    - name: Run Tests
      working-directory: ./backend
      run: npm test
      env:
         JWT_SECRET: test
         JWT_REFRESH_SECRET: test
    
    # Frontend (Build Check)
    - name: Install Frontend Deps
      run: npm ci
    - name: Build Frontend
      run: npm run build
```

---

## 6. 🌐 Environment Variables Reference

### Backend (`backend/.env`)
```bash
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=super_secret_key_123
JWT_REFRESH_SECRET=super_secret_refresh_456
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=...
FRONTEND_URL=https://luxemarket.vercel.app
```

### Frontend (`.env`)
```bash
VITE_API_URL=https://luxemarket-api.onrender.com/api
# Note: Google GenAI Key is handled via Backend proxy or dangerously in frontend for demo.
# For Production: Move GenAI calls to Backend to hide API_KEY.
```
