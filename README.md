# VARA — Channapatna Handicrafts E-Commerce Platform

VARA is a full-stack e-commerce web application for showcasing and selling traditional **Channapatna handicrafts** — handcrafted wooden toys, home décor, and accessories made by local artisans. The platform connects artisans directly with customers, preserving heritage craftsmanship while enabling modern online commerce.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Local Development](#local-development)
  - [Docker Deployment](#docker-deployment)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Frontend Pages & Components](#frontend-pages--components)
- [Authentication Flow](#authentication-flow)
- [Payment Integration](#payment-integration)
- [Deployment](#deployment)

---

## Features

### Storefront
- **Homepage** with hero banner, product grid, intro section, testimonials, and about section
- **Category browsing** — filter products by Toys, Accessories, and Décor
- **Product detail pages** with artisan info, materials used, and add-to-cart functionality
- **Subscription box** page for curated artisan collections

### Shopping & Checkout
- **Shopping cart** with add/remove/quantity controls and live item counter in the navbar
- **Secure checkout** with shipping address form
- **Razorpay payment gateway** integration (test mode) with server-side signature verification
- **Order success** confirmation page

### Authentication
- **Email/password** registration and login with bcrypt password hashing
- **Google Sign-In** via Firebase Authentication with server-side ID token verification
- **JWT-based sessions** with localStorage persistence
- **Protected routes** — payment/checkout pages require authentication

### User Profile
- **Profile panel** (slide-out sidebar) with:
  - Editable user details (name, phone, address)
  - Order history view
  - Logout functionality

### Backend & Data
- **RESTful API** built with Express.js
- **MongoDB Atlas** database with Mongoose ODM
- **Product catalog** stored in the database (not hardcoded)
- **Order management** — orders are created server-side with DB-verified prices (never trusting frontend prices)
- **Static file serving** for product images via `/uploads`

### DevOps
- **Dockerized** frontend (multi-stage build with Nginx) and backend
- **Docker Compose** for single-command orchestration
- **GitHub Pages** deployment support for frontend

---

## Tech Stack

| Layer        | Technology                                                    |
| ------------ | ------------------------------------------------------------- |
| **Frontend** | React 19, React Router v7, Framer Motion, React Icons, React Slick |
| **Backend**  | Node.js, Express 5, Mongoose 9, JWT, bcryptjs                |
| **Database** | MongoDB Atlas                                                 |
| **Auth**     | Firebase Authentication (Google Sign-In), JWT                 |
| **Payments** | Razorpay (test mode)                                         |
| **DevOps**   | Docker, Docker Compose, Nginx, GitHub Pages                  |

---

## Project Structure

```
VARAproj/
├── docker-compose.yml            # Orchestrates frontend + backend containers
└── VARA/                         # Main application directory
    ├── Dockerfile                # Multi-stage build: React → Nginx
    ├── nginx.conf                # Nginx config for React Router SPA
    ├── package.json
    ├── .env                      # Local development env vars
    ├── .env.production           # Production env vars
    │
    ├── public/                   # Static public assets
    │
    ├── src/                      # React frontend source
    │   ├── App.js                # Root component with route definitions
    │   ├── index.js              # Entry point with React DOM render
    │   │
    │   ├── config/
    │   │   └── firebase.js       # Firebase app & Google Auth provider setup
    │   │
    │   ├── Context/
    │   │   ├── AuthContext.jsx    # Auth state, login/register/Google/logout
    │   │   └── ShopContext.jsx    # Cart state, product fetching from API
    │   │
    │   ├── Data/
    │   │   └── Products.jsx      # Legacy static product data (now fetched from API)
    │   │
    │   ├── components/
    │   │   ├── NavBar/           # Navigation bar with cart counter & profile
    │   │   ├── Hero/             # Homepage hero banner
    │   │   ├── Intro/            # Introduction / brand story section
    │   │   ├── ProductGrid/      # Grid display of product cards
    │   │   ├── Aboutc/           # About page component
    │   │   ├── Testimonials/     # Customer testimonials carousel
    │   │   ├── ProfilePanel/     # Slide-out user profile & order history
    │   │   ├── Assets/           # Static image assets
    │   │   └── ProtectedRoute.jsx # Auth guard for protected pages
    │   │
    │   └── pages/
    │       ├── Shop.jsx          # Homepage (Hero + Intro + Products + Testimonials)
    │       ├── ShopCategory.jsx  # Category-filtered product listing
    │       ├── ProductDetail.jsx # Individual product detail page
    │       ├── Cart.jsx          # Shopping cart page
    │       ├── Login/            # Login & registration page
    │       ├── Checkout/
    │       │   ├── Payment.jsx   # Shipping form + Razorpay payment
    │       │   └── OrderSuccess.jsx  # Post-payment confirmation
    │       ├── SubscriptionBox/  # Subscription box feature page
    │       └── CSS/              # Page-specific stylesheets
    │
    └── vara-backend/             # Express.js backend
        ├── Dockerfile            # Node.js container
        ├── server.js             # Express app entry point
        ├── package.json
        │
        ├── config/
        │   └── db.js             # MongoDB Atlas connection
        │
        ├── middleware/
        │   └── authMiddleware.js # JWT verification middleware
        │
        ├── models/
        │   ├── User.js           # User schema (name, email, password, address, role)
        │   ├── Product.js        # Product schema (name, price, category, artisan, image)
        │   └── Order.js          # Order schema (items, shipping, payment, status)
        │
        ├── controllers/
        │   ├── authController.js     # Register, login, Google auth with Firebase token verification
        │   ├── productController.js  # Get all / get by ID
        │   ├── orderController.js    # Create order, Razorpay order, verify payment, order history
        │   └── userController.js     # Get / update user profile
        │
        ├── routes/
        │   ├── authRoutes.js     # /api/auth/*
        │   ├── productRoutes.js  # /api/products/*
        │   ├── orderRoutes.js    # /api/orders/*
        │   └── userRoutes.js     # /api/users/*
        │
        └── uploads/              # Product image uploads (served statically)
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- **MongoDB Atlas** account (or local MongoDB instance)
- **Docker & Docker Compose** (for containerized deployment)

### Local Development

**1. Clone the repository**

```bash
git clone https://github.com/Ashwin18522/VARA.git
cd VARAproj/VARA
```

**2. Set up the backend**

```bash
cd vara-backend
npm install

# Create a .env file with the required variables (see Environment Variables section)
npm run dev    # Starts with nodemon on port 8000
```

**3. Set up the frontend**

```bash
cd ..          # Back to VARA/
npm install
npm start      # Starts React dev server on port 3000
```

The app will be available at [http://localhost:3000](http://localhost:3000), with the API at [http://localhost:8000](http://localhost:8000).

### Docker Deployment

From the project root (`VARAproj/`):

```bash
docker-compose up --build
```

This starts:
- **Backend** container on port `8000`
- **Frontend** container (Nginx) on port `3000`

---

## Environment Variables

### Backend (`vara-backend/.env`)

| Variable               | Description                          |
| ---------------------- | ------------------------------------ |
| `MONGO_URI`            | MongoDB Atlas connection string      |
| `JWT_SECRET`           | Secret key for JWT signing           |
| `PORT`                 | Server port (default: `8000`)        |
| `FIREBASE_PROJECT_ID`  | Firebase project ID for Google auth  |
| `RAZORPAY_KEY_ID`      | Razorpay API key ID (test mode)      |
| `RAZORPAY_KEY_SECRET`  | Razorpay API key secret              |

### Frontend (`VARA/.env`)

| Variable                     | Description                     |
| ---------------------------- | ------------------------------- |
| `REACT_APP_API_URL`          | Backend API base URL            |
| `REACT_APP_RAZORPAY_KEY_ID`  | Razorpay public key for checkout |

---

## API Endpoints

### Authentication — `/api/auth`

| Method | Endpoint   | Description                            | Auth |
| ------ | ---------- | -------------------------------------- | ---- |
| POST   | `/register`| Register with email/password           | No   |
| POST   | `/login`   | Login with email/password              | No   |
| POST   | `/google`  | Authenticate via Firebase ID token     | No   |

### Products — `/api/products`

| Method | Endpoint   | Description              | Auth |
| ------ | ---------- | ------------------------ | ---- |
| GET    | `/`        | Get all products         | No   |
| GET    | `/:id`     | Get product by ID        | No   |

### Orders — `/api/orders`

| Method | Endpoint                  | Description                        | Auth     |
| ------ | ------------------------- | ---------------------------------- | -------- |
| POST   | `/`                       | Create a new order                 | Required |
| GET    | `/my`                     | Get logged-in user's order history | Required |
| POST   | `/create-razorpay-order`  | Initiate Razorpay payment          | Required |
| POST   | `/verify-payment`         | Verify Razorpay payment signature  | Required |

### Users — `/api/users`

| Method | Endpoint   | Description              | Auth     |
| ------ | ---------- | ------------------------ | -------- |
| GET    | `/me`      | Get current user profile | Required |
| PUT    | `/me`      | Update user profile      | Required |

---

## Frontend Pages & Components

| Route                | Page / Component   | Description                              |
| -------------------- | ------------------ | ---------------------------------------- |
| `/`                  | Shop               | Homepage with hero, products, testimonials |
| `/shop`              | ShopCategory       | All products listing                     |
| `/toys`              | ShopCategory       | Toys category filter                     |
| `/accessories`       | ShopCategory       | Accessories category filter              |
| `/decor`             | ShopCategory       | Décor category filter                    |
| `/product/:id`       | ProductDetail      | Individual product page                  |
| `/cart`              | Cart               | Shopping cart                            |
| `/login`             | Login              | Login & registration forms               |
| `/payment`           | Payment (protected)| Checkout with shipping & Razorpay        |
| `/order-success`     | OrderSuccess       | Payment confirmation                     |
| `/subscription-box`  | SubscriptionBox    | Curated subscription box page            |
| `/about`             | About              | About VARA / brand story                 |

---

## Authentication Flow

### Email/Password
1. User submits registration or login form
2. Frontend sends credentials to `/api/auth/register` or `/api/auth/login`
3. Backend validates, hashes password (bcrypt), and returns a JWT
4. JWT is stored in `localStorage` and sent with subsequent API requests

### Google Sign-In
1. User clicks "Sign in with Google"
2. Firebase handles the OAuth popup (with `select_account` prompt)
3. Frontend receives a Firebase ID token
4. Token is sent to `/api/auth/google`
5. Backend fetches Google's public keys and verifies the token signature, issuer, and audience
6. Backend creates or finds the user and returns a custom JWT

---

## Payment Integration

VARA uses **Razorpay** (test mode) for payment processing:

1. **Order creation** — Backend creates an order with DB-verified prices (never trusts frontend prices)
2. **Razorpay order** — Backend calls Razorpay API to create a payment order (amount in paise)
3. **Checkout UI** — Razorpay's checkout widget opens on the frontend
4. **Verification** — After payment, the signature is verified server-side using HMAC-SHA256
5. **Status update** — On successful verification, the order status changes from `pending` → `paid`

---

## Deployment

### GitHub Pages (Frontend Only)

```bash
npm run deploy    # Builds and deploys to gh-pages branch
```


### Docker (Full Stack)

```bash
docker-compose up --build -d
```

- Frontend served via Nginx on port `3000`
- Backend on port `8000`
- Nginx configured with `try_files` for React Router SPA support

---

## License

This project is for educational and portfolio purposes.
