
# SecureAuth — Full Stack Authentication System

A responsive full-stack authentication application built using React, Node.js, Express.js, and MongoDB.

Developed as part of the Prodigy InfoTech Full Stack Web Development Internship.

## Features

- User registration with input validation
- Secure password hashing using bcrypt
- Login authentication using JSON Web Tokens (JWT)
- HTTP-only authentication cookies
- Protected user dashboard
- User profile retrieval through authenticated APIs
- Logout functionality
- Duplicate email registration prevention
- Responsive user interface
- Error handling and loading states

## Technology Stack

### Frontend
- React
- Vite
- React Router
- JavaScript
- CSS
- Lucide React Icons

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- bcryptjs
- Zod

## Project Structure

```text
PRODIGY_FS_01/
├── backend/
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   └── authRoutes.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── styles/
│   └── package.json
└── README.md
```

## Installation and Setup

### 1. Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd PRODIGY_FS_01
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/secureauth_db
NODE_ENV=development
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=1h
```

Start your local MongoDB server, then run:

```bash
node server.js
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/health | Backend health check |
| POST | /api/auth/register | Register a new user |
| POST | /api/auth/login | Authenticate user |
| GET | /api/auth/me | Get authenticated profile |
| POST | /api/auth/logout | Clear authentication cookie |

## Authentication Workflow

1. Users register using the registration form.
2. Passwords are hashed before storage in MongoDB.
3. Users log in with their email and password.
4. The backend generates a signed JWT.
5. The JWT is stored in an HTTP-only cookie.
6. Protected endpoints verify the authentication token.
7. Logout clears the authentication cookie.

## Security Features

- bcrypt password hashing
- JWT signature verification
- HTTP-only cookies
- Input validation
- Duplicate email protection
- Authentication middleware
- API rate limiting
- Helmet security headers
- Environment variables for secrets

**Security note:** This project demonstrates local authentication functionality. Additional safeguards, including CSRF protection, deployment-specific cookie and CORS configuration, and session revocation, should be implemented before production deployment.

## Internship Details

**Organization:** Prodigy InfoTech  
**Domain:** Full Stack Web Development  
**Task:** PRODIGY_FS_01  
**Project:** SecureAuth

## Author

Sanju Maji

## License

Created for educational and internship demonstration purposes.

---

## Application Screenshots

### Login Page

![SecureAuth Login Page](screenshots/login.png)

### Registration Page

![SecureAuth Registration Page](screenshots/register.png)

### Protected Dashboard

![SecureAuth Dashboard](screenshots/dashboard.png)

---

## Project Information

**Project:** SecureAuth — Full-Stack Authentication System

**Internship:** Prodigy InfoTech

**Task:** PRODIGY_FS_01

**Technology Stack:** React.js, Node.js, Express.js, MongoDB, JWT Authentication

**Features:** User Registration, Secure Login, Password Hashing, Protected Dashboard, Session Authentication, and Logout.
