# 🌾 Mazao ERP - Agricultural Management System

A modern, full-stack Enterprise Resource Planning (ERP) system designed specifically for agricultural businesses.

---

## 🚀 Live Demo
- **Frontend (Vercel)**  [https://mazao-erp.vercel.app/](https://mazao-erp.vercel.app/)
- **Backend API (Render):** [https://mazao-erp.onrender.com](https://mazao-erp.onrender.com)

---

## 📸 Screenshots

<p align="center">
  <img src="https://github.com/user-attachments/assets/be6abae6-bf96-4c72-8d07-77bed1afe6a9" alt="Landing Page showcasing the Mazao ERP system" width="45%"/>
  &nbsp; <!-- spacing -->
  <img src="https://github.com/user-attachments/assets/447a62bf-c6af-4a8a-b5b4-2b60cf391bf1" alt="Admin Dashboard for managing farmers, crops, and analytics" width="45%"/>
</p>

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)  
- npm, yarn, or pnpm

---

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd mazao-erp
   ```

## Setting up Backend
```
cd backend
npm install
```
### Create a .env file on the backend and input the following value
```
DATABASE_URL=Your postgress database url
JWT_SECRET=you secret Key
NODE_ENV="development"
PORT=5000
FRONTEND_URL="http://localhost:5173"
```
### ⚠️ Important Note on Performance

- You can setup a database on render for free. Then copy that external Link and post it on the .env

### Then run the following commands to set up database To set demo account.

```
npx prisma generate
npx prisma db push
npm run db:seed
```

### Then run the development server for the Backend
```
npm run dev
```

- If the server is running you can post the address on browser. If it working you will see this response on the screen
```
message	"Welcome to the Mazao ERP API!"
```

## Setting up Frontend
```
cd frontend
npm install
```
### Create a .env file on the frontend and input the following value
```
VITE_API_URL="http://localhost:5000/api"
```

### Finally run the development server on the frontend
```
npm run dev
```

## 🔐 Demo Credentials

You can log in to the live demo using the following test accounts:

### Admin Account
- **Email:** `shamba@admin.com`  
- **Password:** `12345678`  
- **Access:** Full system access to manage everything.

### Farmer Account
- **Email:** `zack@gmail.com`  
- **Password:** `12345678`  
- **Access:** Limited access to personal profile and crop management.

---

## ⚠️ Important Note on Performance

The backend API for the live demo is hosted on **Render's Free Tier**. Please keep in mind:

- **Cold Starts:** After inactivity, the server spins down. The first request may take **30–60 seconds** to wake up.  
-  **Subsequent Requests:** Once awake, responses are much faster.  
-  **Timeouts:** If a page seems stuck, it’s likely waiting for the backend. Please give it a moment.  


## 🛠️ Tech Stack & Architecture Decisions

### Frontend
- **React 18 + TypeScript**  
  Robust, type-safe, and maintainable UI framework. TypeScript helps catch errors at compile time, improving developer experience and code quality.  

- **Vite**  
  Ultra-fast build tool chosen for development and bundling. Much faster than Create React App.  

- **shadcn/ui + Tailwind CSS**  
  Provides a beautiful, accessible, and customizable component library. Enables rapid UI development without sacrificing design consistency.  

---

### Backend
- **Node.js + Express.js**  
  Flexible, minimal framework for building RESTful APIs with a vast ecosystem of middleware.  

- **Prisma**  
  Modern ORM with type-safety and intuitive data modeling. Simplifies database operations while ensuring runtime safety.  

- **PostgreSQL**  
  Reliable, robust relational database. Perfect for ERP systems handling complex relationships.  

---

### Deployment & Hosting
- **Frontend:** Deployed on **Vercel** – seamless Git integration, auto-deployments, and excellent global performance.  
- **Backend:** Deployed on **Render** – simple deployment for Node.js services. Free tier is used here for demo purposes.  


## 📜 Available Scripts

### Backend (`/backend` directory)
- `npm run dev` – Start the development server with hot reload.  
- `npm start` – Start the production server.  
- `npm run db:push` – Push the Prisma schema to the database.  
- `npm run db:seed` – Seed the database with sample data.  

---

### Frontend (`/frontend` directory)
- `npm run dev` – Start the Vite development server.  
- `npm run build` – Build the app for production. 


---

<p align="center">
  Made with ❤️ by <strong>Hassan Munene Awanzi</strong>
</p>