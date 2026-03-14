# Task Management Application

A full-stack task management application built with Next.js, MongoDB, and JWT authentication.

## Tech Stack

- **Frontend**: Next.js (App Router), React, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with HTTP-only cookies
- **Password Hashing**: bcryptjs
- **Deployment**: Vercel-ready

## Features

### Authentication
- User registration and login
- JWT token-based authentication
- HTTP-only cookies for security
- Protected routes

### Task Management
- Create, read, update, delete tasks
- Task fields: title, description, status (pending/in-progress/completed), createdAt
- Pagination
- Search by title
- Filter by status
- User-specific tasks (users can only access their own tasks)

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd task-manager
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env.local` file in the root directory:
   ```
   MONGODB_URI=mongodb://localhost:27017/taskmanager
   JWT_SECRET=your-super-secret-jwt-key-here
   ```

4. **MongoDB Setup**
   - Install MongoDB locally or use MongoDB Atlas
   - Update `MONGODB_URI` in `.env.local`

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user.
- **Body**: `{ "email": "string", "password": "string" }`
- **Response**: `{ "message": "User registered successfully" }`

#### POST /api/auth/login
Login a user.
- **Body**: `{ "email": "string", "password": "string" }`
- **Response**: Sets HTTP-only cookie with JWT token

#### GET /api/auth/check
Check if user is authenticated.
- **Response**: `{ "authenticated": true/false }`

#### POST /api/auth/logout
Logout a user.
- **Response**: Clears the JWT cookie

### Task Endpoints

#### GET /api/tasks
Get user's tasks with optional filters.
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
  - `search`: Search in title
  - `status`: Filter by status
- **Response**: `{ "tasks": [...], "pagination": {...} }`

#### POST /api/tasks
Create a new task.
- **Body**: `{ "title": "string", "description": "string", "status": "string" }`
- **Response**: Created task object

#### GET /api/tasks/[id]
Get a specific task.
- **Response**: Task object

#### PUT /api/tasks/[id]
Update a task.
- **Body**: `{ "title": "string", "description": "string", "status": "string" }`
- **Response**: Updated task object

#### DELETE /api/tasks/[id]
Delete a task.
- **Response**: `{ "message": "Task deleted successfully" }`

## Project Structure

```
task-manager/
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── register/route.js
│   │       ├── login/route.js
│   │       ├── check/route.js
│   │       └── logout/route.js
│   │   └── tasks/
│   │       ├── route.js
│   │       └── [id]/route.js
│   ├── dashboard/page.js
│   ├── login/page.js
│   ├── register/page.js
│   └── page.js
├── components/
│   ├── TaskCard.js
│   └── Navbar.js
├── lib/
│   ├── db.js
│   └── auth.js
├── middleware/
│   └── authMiddleware.js
├── models/
│   ├── User.js
│   └── Task.js
├── styles/
│   └── globals.css
├── .env.example
├── package.json
└── README.md
```

## Deployment

### Vercel Deployment

1. **Connect to Vercel**
   - Push your code to GitHub
   - Connect your repository to Vercel

2. **Environment Variables**
   Set the following environment variables in Vercel:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure random string

3. **Deploy**
   Vercel will automatically build and deploy your application.

### MongoDB Atlas
For production, use MongoDB Atlas:
1. Create a cluster
2. Get the connection string
3. Whitelist Vercel's IP addresses or use 0.0.0.0/0
4. Update `MONGODB_URI` with the Atlas connection string

## Security Features

- Password hashing with bcryptjs
- JWT tokens stored in HTTP-only cookies
- Input validation
- User isolation (users can only access their own tasks)
- CORS protection
- Environment variables for secrets

## Development

- Run tests: `npm test`
- Lint code: `npm run lint`
- Build for production: `npm run build`
