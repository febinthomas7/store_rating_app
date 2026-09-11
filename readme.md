# Store Rating Platform

A full-stack, role-based web application for listing stores, submitting user ratings, and managing platform analytics with secure authentication.

[**View Repository on GitHub**](https://github.com/febinthomas7/store_rating_app)

---

## Overview

The Store Rating Platform is designed to manage store listings, customer reviews, and user accounts under strict **Role-Based Access Control (RBAC)**. The application provides dedicated dashboard views and permissions for three user roles:

- **Admin**: Platform-wide metrics, user directory management, and store management.
- **Store Owner**: Store analytics, average customer ratings, and review management.
- **Normal User**: Search and filter store directory, view store details, and submit 1–5 star ratings.

---

## Tech Stack

### Frontend

- **Framework**: React + TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **HTTP Client**: Axios (with centralized interceptors)
- **UI & Controls**: Custom Reusable Components (Table, Input, Button)

### Backend

- **Runtime**: Node.js + Express.js
- **Database**: MySQL / PostgreSQL
- **Validation**: Zod /coustom schema
- **Security & Middleware**: Rate limiting (`express-rate-limit`), CORS, Cookie Parser, central error handler

---

## Features

- **Role-Based Access Control**: Route protection and layout guards tailored for Admins, Store Owners, and Users.
- **Dynamic Store Directory**: Interactive table with column sorting, live filtering (by name, email, address), and pagination.
- **Star Rating System**: Intuitive rating submission and automatic calculation of overall store rating averages.
- **Admin Management**: Capability to create, filter, and inspect user profiles along with specific store owner metrics.
- **API Hardening**: Strict validation on client input via Zod and rate limiting to protect against brute-force attacks.

---

## Getting Started

### Prerequisites

- **Node.js**: `v18.x` or higher
- **npm**: `v9.x` or higher
- **Database**: Local or hosted MySQL / PostgreSQL instance

---

## Installation & Setup

### 1. Clone the Repository

```bash
git clone [https://github.com/febinthomas7/store_rating_app.git](https://github.com/febinthomas7/store_rating_app.git)
cd store_rating_app



# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env


PORT=5000
DATABASE_URL=your_database_connection_string
JWT_SECRET=your_jwt_secret_key
CORS_ORIGINS=http://localhost:5173
NODE_ENV=development

npm run dev


# Open a new terminal and navigate to frontend
cd frontend

# Install dependencies
npm install

VITE_BASE_URL=http://localhost:3000

# Start development server
npm run dev
```
