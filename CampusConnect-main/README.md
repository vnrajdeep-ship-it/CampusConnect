# CampusConnect — Campus Lost & Found Portal

A full-stack MERN academic project for reporting and finding belongings around a campus.

## Features
- Student registration and login using JWT authentication and bcrypt password hashing
- Create, browse, search and filter lost/found listings
- View listing details and manage your own listings
- Submit claim requests for found items; duplicate claims are prevented
- Admin dashboard with basic statistics and claim approval/rejection
- Responsive React interface

## Requirements
- Node.js 18 or newer
- npm
- MongoDB Community Server running locally, or a MongoDB Atlas connection string

## Run locally

### 1. Backend setup
Open a terminal in the project root:

```bash
cd server
npm install
```

Copy `server/.env.example` to `server/.env` and configure it:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/campusconnect
JWT_SECRET=replace_with_a_long_random_secret
CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

The API runs at `http://localhost:5000`. Health check: `http://localhost:5000/api/health`.

### 2. Frontend setup
Open a second terminal in the project root:

```bash
cd client
npm install
npm run dev
```

Open the Vite URL shown in the terminal, normally `http://localhost:5173`.

Keep both terminals running while using the application.

## Create an admin account for the demo
1. Register an account through the website.
2. Open MongoDB Compass and connect to `mongodb://127.0.0.1:27017`.
3. Open database `campusconnect`, collection `users`.
4. Find your account and change its `role` field from `student` to `admin`.
5. Log out and log in again.

Never let public users choose their own admin role. For a deployed application, create the first admin using a secure one-time seed process.

## API overview
| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| POST | `/api/auth/register` | Register | Public |
| POST | `/api/auth/login` | Login | Public |
| GET | `/api/auth/me` | Current user | Logged in |
| GET | `/api/items` | Browse/search/filter listings | Public |
| GET | `/api/items/:id` | Listing details | Public |
| POST | `/api/items` | Create listing | Logged in |
| GET | `/api/items/mine` | My listings | Logged in |
| PUT | `/api/items/:id` | Update listing | Owner/admin |
| DELETE | `/api/items/:id` | Delete listing | Owner/admin |
| POST | `/api/items/:id/claims` | Submit claim | Logged in |
| GET | `/api/admin/stats` | Dashboard statistics | Admin |
| GET | `/api/admin/claims` | View claims | Admin |
| PATCH | `/api/admin/claims/:id` | Approve/reject claim | Admin |

## Project structure

```text
campusconnect/
├── client/                 React + Vite frontend
│   └── src/
│       ├── components/
│       ├── context/
│       └── pages/
├── server/                 Express + MongoDB backend
│   └── src/
│       ├── config/
│       ├── middleware/
│       ├── models/
│       └── routes/
├── .gitignore
└── README.md
```

## Important notes
- This is an academic demonstration project, not a production-ready campus service.
- Listings display the contact information provided by their creator. Avoid entering sensitive personal information.
- The app does not currently include image uploads, built-in chat, email notifications or identity verification.
- Keep `server/.env` private. Do not commit `.env`, database credentials, JWT secrets or `node_modules` to GitHub.
