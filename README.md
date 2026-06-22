# TechVault - E-Commerce Angular Application

A full-featured e-commerce application built with Angular 21, MongoDB, and Express.js.

## Features

- **Product Catalog** - Browse products with filtering by category and sorting by price
- **Product Details** - View detailed product information with image gallery
- **Shopping Cart** - Add/remove products, update quantities (persisted in MongoDB)
- **Favorites** - Save and manage favorite products (persisted in MongoDB)
- **User Authentication** - JWT-based login and signup with role selection
- **Admin Dashboard** - Product management with CRUD operations (Admin-only)
- **Dark/Light Mode** - Theme toggle with high-contrast dark mode
- **Role-Based Access** - Admin and Customer roles with route guards
- **Responsive Design** - Mobile-friendly UI with Bootstrap 5

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Angular 21.1, TypeScript 5.9 |
| UI Framework | Bootstrap 5.3 |
| Backend | Express.js 4.21 |
| Database | MongoDB 8 (via Mongoose 8.5) |
| Authentication | JWT (jsonwebtoken 9.0) |
| Testing | Vitest 4.0 |

## Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- **MongoDB** running locally on port 27017 (or update `.env`)

## Environment Variables

Create a `.env` file in the project root:

```env
MONGODB_URI=mongodb://localhost:27017/techvault
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1h
PORT=3000
```

## Project Structure

```
├── server/                         # Express.js backend
│   ├── index.js                    # Server entry point (port 3000)
│   ├── seed.js                     # Database seed script
│   ├── middleware/
│   │   └── auth.js                 # JWT verification + adminOnly middleware
│   ├── models/
│   │   ├── User.js                 # Mongoose User schema (username, password, role)
│   │   ├── Product.js              # Mongoose Product schema
│   │   ├── Cart.js                 # Mongoose Cart schema
│   │   └── Favorite.js             # Mongoose Favorite   schema
│   └── routes/
│       ├── auth.js                 # POST /auth/login, POST /auth/signup
│       ├── products.js             # GET/POST/PUT/DELETE /products
│       ├── cart.js                 # GET/POST/PUT/DELETE /cart
│       └── favorites.js            # GET/POST/DELETE /favorites
│
├── src/                            # Angular frontend
│   ├── app/
│   │   ├── app.routes.ts           # Main route configuration
│   │   ├── app.config.ts           # App providers (interceptors)
│   │   ├── admin.routes.ts         # Admin-only routes
│   │   └── customer.routes.ts      # Customer routes
│   ├── components/
│   │   ├── admin-dashboard/        # Admin product management
│   │   ├── cart/                   # Shopping cart page
│   │   ├── favorites/              # Favorites page
│   │   ├── home/                   # Home/landing page
│   │   ├── login/                  # Login form
│   │   ├── signup/                 # Registration form
│   │   ├── main-layout/            # Navbar + layout wrapper
│   │   ├── product-card/           # Reusable product card
│   │   ├── product-details/        # Single product view
│   │   ├── product-form/           # Add/edit product form
│   │   ├── products/               # Product listing with filters
│   │   └── error/                  # Error page
│   ├── services/
│   │   ├── auth.service.ts         # JWT login, token management, role check
│   │   ├── cart.service.ts         # Cart CRUD operations
│   │   ├── favorite.service.ts     # Favorites CRUD operations
│   │   ├── product.service.ts      # Product API calls
│   │   ├── loading.service.ts      # Loading state management
│   │   └── message.service.ts      # Toast notification service
│   ├── models/
│   │   ├── product.ts              # Product interface
│   │   ├── user.ts                 # User interface
│   │   ├── cart-item.ts            # CartItem interface
│   │   └── favorite.ts             # Favorite interface
│   ├── guards/
│   │   ├── auth.guard.ts           # Requires valid JWT token
│   │   └── admin.guard.ts          # Requires Admin role
│   ├── interceptors/
│   │   ├── auth.interceptor.ts     # Attaches Bearer token to requests
│   │   ├── error.interceptor.ts    # Handles 401 auto-logout, shows errors
│   │   └── loading.interceptor.ts  # Tracks loading state
│   ├── directives/
│   │   ├── image-zoom.directive.ts  # Image zoom on hover
│   │   └── theme.directive.ts       # Dark/light mode toggle
│   └── pipes/
│       └── short-description.pipe.ts
│
├── .env                            # Environment variables (git-ignored)
├── db.json                         # Legacy JSON Server data (no longer used as backend)
└── package.json
```

## How to Run

### 1. Install Dependencies

```bash
npm install
```

### 2. Start MongoDB

Make sure MongoDB is running locally on port 27017:

```bash
# Windows (if installed as a service, it may already be running)
net start MongoDB

# macOS (Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### 3. Seed the Database

Populate MongoDB with users and products from `db.json`:

```bash
npm run seed
```

### 4. Start the Backend Server

```bash
npm run server
```

The Express.js server starts on `http://localhost:3000`.

### 5. Start the Angular Dev Server

In a separate terminal:

```bash
npm run dev
```

The application opens automatically at `http://localhost:4200`.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Angular dev server with auto-open |
| `npm run server` | Start Express.js backend on port 3000 |
| `npm run seed` | Seed MongoDB with initial data |
| `npm start` | Start Angular dev server (no auto-open) |
| `npm run build` | Build for production |
| `npm run watch` | Build in watch mode |
| `npm run test` | Run unit tests |

## Default Accounts

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | Admin |
| Ali Maher | 000000 | Customer |
| khaled Maher | 000000 | Customer |
| amr | 123456Aa | Customer |

## API Endpoints

### Auth

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| POST | `/auth/login` | `{ username, password }` | Returns `{ token, user }` |
| POST | `/auth/signup` | `{ username, password, role }` | Creates new user |

### Products

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/products` | No | List all products |
| GET | `/products/:id` | No | Get product by ID |
| POST | `/products` | Admin | Create product |
| PUT | `/products/:id` | Admin | Update product |
| DELETE | `/products/:id` | Admin | Delete product |

### Cart

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/cart` | No | List all cart items |
| POST | `/cart` | Yes | Add item `{ productId, quantity }` |
| PUT | `/cart/:id` | Yes | Update item `{ productId, quantity }` |
| DELETE | `/cart/:id` | Yes | Remove item |

### Favorites

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/favorites` | No | List all favorites |
| POST | `/favorites` | Yes | Add favorite `{ productId }` |
| DELETE | `/favorites/:id` | Yes | Remove favorite |
