# HR Management System - Employee Leave & Attendance

A full-stack web application for managing employee leave requests and attendance records built with MERN stack.

## 🎯 Project Overview

This is a comprehensive HR management system that allows employees to apply for leaves, mark attendance, and track their records. Administrators can approve/reject leave requests, monitor attendance, and manage employee data.

## ✨ Features

### Employee Features
- User Registration & Login
- Apply for Leave (Casual, Sick, Paid)
- View Leave Request History
- Edit/Cancel Pending Leave Requests
- Mark Daily Attendance (Present/Absent)
- View Attendance History
- Track Leave Balance
- Personal Dashboard with Statistics

### Admin Features
- Approve/Reject Leave Requests
- View All Employee Records
- Monitor Attendance Data
- Filter Attendance by Date/Employee
- View Employee Statistics
- Attendance Summary Reports
- Comprehensive Admin Dashboard

##  Technology Stack

### Frontend
- **React** -UI Library
- **Vite**-Build Tool
- **React Router DOM** -Routing
- **Axios**-HTTP Client
- **Tailwind CSS**-Styling
- **React Toastify**-Notifications
- **React Icons** -Icons

### Backend
- **Node.js** - Runtime Environment
- **Express** -Web Framework
- **MongoDB** - Database
- **Mongoose**-ODM
- **JWT**- Authentication
- **Bcrypt.js**-Password Hashing
- **Moment** -Date Management

##  Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn**

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd hr-management-system
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file and configure environment variables
# See "Environment Variables" section below

# Seed admin user
npm run seed

# Start development server
npm run dev
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file and configure
# See "Environment Variables" section below

# Start development server
npm run dev
```
##  Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=****************************
JWT_SECRET=****************************
JWT_EXPIRE=**
NODE_ENV=*****
`````

## Default Admin Credentials

After running the seed script, use these credentials to login as admin:

- **Email:** admin@hr.com
- **Password:** admin123

**⚠️ Important:** Change the admin password after first login in production!

## 📁 Project Structure

```
hr-management-system/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── leaveController.js   # Leave management
│   │   ├── attendanceController.js  # Attendance management
│   │   └── userController.js    # User management
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   └── errorHandler.js      # Error handling
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── Leave.js             # Leave schema
│   │   └── Attendance.js        # Attendance schema
│   ├── routes/
│   │   ├── authRoutes.js        # Auth endpoints
│   │   ├── leaveRoutes.js       # Leave endpoints
│   │   ├── attendanceRoutes.js  # Attendance endpoints
│   │   └── userRoutes.js        # User endpoints
│   ├── utils/
│   │   └── seedAdmin.js         # Admin seeding script
│   ├── .env                     # Environment variables
│   ├── .gitignore
│   ├── package.json
│   └── server.js                # Entry point
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx       # Navigation bar
    │   │   └── ProtectedRoute.jsx  # Route protection
    │   ├── context/
    │   │   └── AuthContext.jsx  # Auth state management
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── ApplyLeave.jsx
    │   │   ├── MyLeaves.jsx
    │   │   ├── MarkAttendance.jsx
    │   │   ├── MyAttendance.jsx
    │   │   └── admin/
    │   │       ├── AdminDashboard.jsx
    │   │       ├── AdminLeaves.jsx
    │   │       ├── AdminAttendance.jsx
    │   │       └── AdminEmployees.jsx
    │   ├── services/
    │   │   ├── api.js           # Axios instance
    │   │   ├── authService.js   # Auth API calls
    │   │   ├── leaveService.js  # Leave API calls
    │   │   ├── attendanceService.js  # Attendance API calls
    │   │   └── userService.js   # User API calls
    │   ├── App.jsx              # Main app component
    │   ├── main.jsx             # Entry point
    │   └── index.css            # Global styles
    ├── .env
    ├── .gitignore
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── postcss.config.js
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (Protected)
- `PUT /api/auth/profile` - Update profile (Protected)

### Leave Management
- `POST /api/leaves` - Apply for leave (Employee)
- `GET /api/leaves/my-leaves` - Get my leaves (Employee)
- `GET /api/leaves/:id` - Get leave by ID
- `PUT /api/leaves/:id` - Update leave (Employee - Pending only)
- `DELETE /api/leaves/:id` - Cancel leave (Employee - Pending only)
- `GET /api/leaves/admin/all` - Get all leaves (Admin)
- `PUT /api/leaves/admin/:id/status` - Approve/Reject leave (Admin)

### Attendance Management
- `POST /api/attendance` - Mark attendance (Employee)
- `GET /api/attendance/my-attendance` - Get my attendance (Employee)
- `GET /api/attendance/:id` - Get attendance by ID
- `PUT /api/attendance/:id` - Update attendance (Employee)
- `DELETE /api/attendance/:id` - Delete attendance (Employee)
- `GET /api/attendance/admin/all` - Get all attendance (Admin)
- `GET /api/attendance/admin/summary` - Get attendance summary (Admin)

### User Management (Admin Only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/stats/:id` - Get user statistics

## Database Models

### User Model
```javascript
{
  fullName: String (required, 2-50 chars),
  email: String (required, unique, valid email),
  password: String (required, min 6 chars, hashed),
  role: String (enum: ['employee', 'admin'], default: 'employee'),
  dateOfJoining: Date (default: now),
  leaveBalance: Number (default: 20),
  isActive: Boolean (default: true),
  timestamps: true
}
```

### Leave Model
```javascript
{
  employee: ObjectId (ref: 'User', required),
  leaveType: String (enum: ['Casual', 'Sick', 'Paid'], required),
  startDate: Date (required),
  endDate: Date (required),
  totalDays: Number (auto-calculated, required),
  reason: String (optional, max 500 chars),
  status: String (enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending'),
  appliedDate: Date (default: now),
  actionDate: Date,
  actionBy: ObjectId (ref: 'User'),
  rejectionReason: String,
  timestamps: true
}
```

### Attendance Model
```javascript
{
  employee: ObjectId (ref: 'User', required),
  date: Date (required),
  status: String (enum: ['Present', 'Absent'], required),
  markedAt: Date (default: now),
  remarks: String (optional, max 200 chars),
  timestamps: true
}
// Unique compound index: employee + date
```

## Security Features

- JWT-based authentication
- Password hashing with bcrypt (10 rounds)
- Protected API routes with middleware
- Role-based access control (Employee/Admin)
- Input validation and sanitization
- HTTP status codes (401, 403, 404) for proper error handling
- CORS enabled for cross-origin requests

## UI/UX Features

- Responsive design (mobile-friendly)
- Modern gradient cards and components
- Real-time toast notifications
- Loading states and spinners
- Form validation with error messages
- Intuitive navigation
- Clean and professional interface
- Color-coded status badges

## AI Tools Usage Disclosure

This project was developed with assistance from AI tools to enhance productivity and code quality:


## Deployment

### Backend Deployment (Render/Railway/Heroku)
1. Create new web service
2. Connect to repository
3. Set environment variables
4. Deploy

### Frontend Deployment (Vercel/Netlify)
1. Connect to repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Set environment variables
5. Deploy

### MongoDB Atlas Setup
1. Create free cluster
2. Get connection string
3. Update MONGODB_URI in backend .env


## License

This project is open source and available under the MIT License.

## 👨‍💻 Aman Goswami
Developed as a take-home assignment for Full-Stack Developer position.

- Anthropic Claude for AI assistance
- MERN stack community for excellent documentation
- Tailwind CSS for the utility-first CSS framework

---

**Note:** This is a demo/assignment project. In production, additional security measures, testing, and features should be implemented.
