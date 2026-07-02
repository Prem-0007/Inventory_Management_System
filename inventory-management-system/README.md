# Inventory Management System (MERN)

## Structure
- `backend/` — Express + MongoDB (Mongoose) + JWT auth API
- `frontend/` — React (Vite) dashboard UI

## Backend setup
```
cd backend
npm install
cp .env.example .env   # edit MONGO_URI, JWT_SECRET
npm run dev
```
Runs on http://localhost:5000

## Frontend setup
```
cd frontend
npm install
npm run dev
```
Runs on http://localhost:5173 (proxies /api to backend)

## Flow
1. Register a user at /register (first user can be role: admin via API body if needed)
2. Add suppliers first (Products need a supplier)
3. Add products, set low stock threshold
4. Use "Stock" button on a product to increase/decrease quantity — this logs to Inventory Log
5. Dashboard shows totals, low stock chart, recent activity
6. Reports page: low stock report, category summary, supplier summary

## API Endpoints
- POST /api/auth/register, /api/auth/login, GET /api/auth/me
- GET/POST /api/products, GET/PUT/DELETE /api/products/:id, POST /api/products/:id/stock
- GET/POST /api/suppliers, GET/PUT/DELETE /api/suppliers/:id
- GET /api/dashboard/summary
- GET /api/reports/low-stock, /api/reports/product-summary, /api/reports/supplier-summary

All routes except register/login require `Authorization: Bearer <token>`.
