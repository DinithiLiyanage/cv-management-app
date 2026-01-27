# CV Management Application

A full-stack web application for managing CVs/resumes, job applications, and organizational workflows. Built with Next.js and Express.js.

## 🚀 Features

- **User Authentication**: Secure login and registration with JWT
- **CV Management**: Create, update, and manage professional CVs
- **Job Listings**: Browse and filter available job opportunities
- **Organization Management**: Handle organizational profiles and structures
- **User Onboarding**: Multi-step onboarding process for new users
    - Personal Information
    - Professional Information
    - Skills Assessment
    - Preferences Setup
- **Profile Management**: Customize user profiles and settings
- **Caching**: Redis and in-memory caching for improved performance

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 15 with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Material-UI (MUI)
- **State Management**: React Context API

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js 5
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Caching**: Redis & node-cache

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or cloud instance)
- Redis (optional, for caching)

## 🔧 Installation

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd cv-management-app
    ```

2. **Backend Setup**

    ```bash
    cd backend
    npm install
    ```

    Create a `.env` file in the backend directory:

    ```env
    PORT=5000
    MONGODB_URI=mongodb://localhost:27017/cv-management
    JWT_SECRET=your_jwt_secret_key
    JWT_EXPIRES_IN=7d
    REDIS_URL=redis://localhost:6379
    ```

3. **Frontend Setup**

    ```bash
    cd ../frontend
    npm install
    ```

    Create a `.env.local` file in the frontend directory:

    ```env
    NEXT_PUBLIC_API_URL=http://localhost:5000
    ```

## 🚀 Running the Application

### Development Mode

1. **Start the Backend Server**

    ```bash
    cd backend
    node index.js
    ```

    The backend will run on `http://localhost:5000`

2. **Start the Frontend Development Server**
    ```bash
    cd frontend
    npm run dev
    ```
    The frontend will run on `http://localhost:3000`

### Production Mode

1. **Build the Frontend**

    ```bash
    cd frontend
    npm run build
    npm start
    ```

2. **Start the Backend**
    ```bash
    cd backend
    node index.js
    ```

## 📁 Project Structure

```
cv-management-app/
├── backend/
│   ├── Controllers/      # Request handlers
│   ├── Middleware/       # Authentication & validation
│   ├── Models/          # Database schemas
│   ├── Routers/         # API routes
│   ├── Utils/           # Utility functions
│   ├── cache.js         # Caching configuration
│   └── index.js         # Entry point
│
└── frontend/
    ├── app/             # Next.js app directory
    │   ├── api/        # API routes
    │   ├── home/       # Home page
    │   ├── jobs/       # Job listings
    │   ├── login/      # Login page
    │   ├── onboarding/ # User onboarding
    │   ├── organizations/ # Organization management
    │   ├── profile/    # User profile
    │   ├── register/   # Registration
    │   └── settings/   # User settings
    ├── components/      # Reusable components
    ├── contexts/        # React contexts
    ├── hooks/          # Custom React hooks
    ├── types/          # TypeScript type definitions
    └── validations/    # Form validation schemas
```

