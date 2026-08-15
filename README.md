# Fruit Store — POS Application

A full-stack point-of-sale web application for an online fruit store, built with a three-tier architecture: a React frontend, an Express middleware/API layer, and a MongoDB Atlas data store. Supports two personas — **customers** (browse, add to cart, check out) and **store owners** (view inventory and orders via an admin dashboard).

**Live demo:** https://raid-software-challenge-pin.netlify.app

---
## Disclaimer
```
I used Claude as a debugging and troubleshooting partner throughout this build, particularly for tracing async/timing issues in React state, a Mongoose model-registration bug that silently broke document hydration, and a CORS failure that turned out to be a stale start script on Render. It was also useful for explaining underlying concepts as they came up — closures, functional state updates, CORS — rather than just supplying fixes.
```

## Architecture

![Three-tier architecture](./ref/three_tier_architecture.svg)


| Tier | Responsibility |
|---|---|
| **Frontend** | Renders the UI, manages client-side state (cart), calls the API, never talks to the database directly |
| **Middleware** | Express REST API (Node Js) — validates requests, applies business logic (stock decrementing, order totals), talks to MongoDB via Mongoose, the only tier with database credentials |
| **Backend** | MongoDB Atlas — persists inventory, orders, and user accounts |

---

## Tech stack

**Frontend**
- React + TypeScript (Vite)
- Material UI (MUI) — components and styling via `sx`
- React Router — client-side routing (`/`, `/cart`, `/login`, `/admin`)
- Deployed as a static build to **Netlify**

**Middleware**
- Node.js + Express
- Mongoose (MongoDB ODM)
- `bcrypt` — password hashing for admin login
- `cors` — restricts API access to the deployed frontend origin
- `dotenv` — environment-based configuration
- Deployed to **Render**

**Backend**
- MongoDB Atlas (cloud-hosted, managed cluster)
- Collections: `inventory`, `orders`, `users`

---

## Features

**Customer**
- Browse available fruit (live inventory, fetched from the API)
- Add items to cart with quantity controls, capped at available stock
- View/edit cart on a dedicated checkout page
- Place an order with name + delivery address
- Receives an order confirmation with a generated order ID

**Store owner**
- Login (email + password, bcrypt-hashed credentials)
- Admin dashboard: inventory levels (low-stock flagged), all orders with status and line-item breakdown, revenue summary

**Business logic**
- Placing an order automatically decrements inventory stock for each line item (via a Mongoose post-save hook)
- Server-side generation of order IDs — never trusted from the client

---


## Known limitations / next steps

- No session/token-based auth yet — `/api/login` returns a success flag, but admin routes aren't currently protected by a token
- No proper routing into `/adminlogin`, and relies on direct url insertion 
- Cart state is not shared between the storefront and checkout page beyond a one-way handoff via router state
- Order status is not yet updatable from the admin dashboard (display-only)
- Not mobile friendly since there are still resizing issues when tested on a mobile device



## Project structure

```
Backend/
  dev.js              # Express server — routes, schemas, models, DB connection
  package.json

src/
  LandingPage.tsx      # Customer-facing storefront
  CheckoutPage.tsx      # Cart / checkout
  AdminLoginPage.tsx    # Store owner login
  AdminPage.tsx         # Store owner dashboard
  Materials.tsx         # Shared MUI-based components (TicketPaper, FruitCard, MaterialCard)
  items.ts              # Fetches inventory from the API
  orders.ts             # Order submission / retrieval, calls the API
  assets/FruitIcons.tsx  # Custom line-art SVG icon set
```

---

## Environment variables

**Backend (Render / local `.env`)**
```
FRONTEND_ORIGIN=https://raid-software-challenge-pin.netlify.app
```

**Frontend (Netlify / local `.env`)**
```
VITE_API_BASE_URL=https://raid-software-engineering-challenge-pin.onrender.com
```

---

## Running locally

**Backend**
```bash
cd Backend
npm run dev
```

**Frontend**
```bash
npm install
# create a .env file with VITE_API_BASE_URL=http://localhost:3001
npm run dev
```

---

## API endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/getInventory` | All inventory items |
| `GET` | `/api/getInventoryCustomer` | Inventory items with stock > 0 |
| `POST` | `/api/submitOrder` | Create a new order, decrements stock |
| `GET` | `/api/getAllOrders` | All orders (admin) |
| `POST` | `/api/login` | Store owner authentication |

---
