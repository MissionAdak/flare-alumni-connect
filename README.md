# FLARE Alumni Connect Platform

A comprehensive alumni management platform that connects alumni, students, colleges, universities, and recruiters in a unified ecosystem. Built with React, TypeScript, Node.js, and PostgreSQL.

## 🚀 Features

### Phase 5: Key Features (Role-based Dashboards)

#### Alumni Features
- ✅ Upload mentorship videos/sessions (YouTube embed + Cloudinary storage)
- ✅ Profile with career journey, skillsets, grades
- ✅ Donation portal (Razorpay API integration)
- ✅ Mentorship session management
- ✅ Analytics and insights

#### Student Features
- ✅ View alumni mentorship sessions/videos
- ✅ Search alumni by skillset, career path
- ✅ Request mentorship sessions
- ✅ Job application tracking
- ✅ Academic performance tracking

#### College Admin/Faculty Features
- ✅ Track students' grades, internships, alumni careers
- ✅ Organize & manage events
- ✅ Access alumni & student data for NAAC/placement
- ✅ Analytics and reporting

#### University Features
- ✅ View aggregated college data → avg CGPA, placement %, NAAC grade
- ✅ Generate reports (Chart.js integration)
- ✅ Institutional performance tracking
- ✅ Multi-college management

#### Recruiter Features
- ✅ Browse student skillsets, grades
- ✅ Post job/internship openings
- ✅ Application management
- ✅ Dual role access (if alumni recruiter)

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **shadcn/ui** for components
- **React Router** for navigation
- **React Query** for state management
- **Sonner** for notifications

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **PostgreSQL** with Prisma ORM
- **JWT** for authentication
- **Cloudinary** for file storage
- **Razorpay** for payments
- **Nodemailer** for emails

## 📁 Project Structure

```
flare-alumni-connect/
├── src/                          # Frontend source code
│   ├── components/               # Reusable UI components
│   ├── contexts/                 # React contexts (Auth, etc.)
│   ├── hooks/                    # Custom React hooks
│   ├── lib/                      # Utilities and API client
│   ├── pages/                    # Page components
│   └── assets/                   # Static assets
├── backend/                      # Backend source code
│   ├── src/                      # Backend source
│   │   ├── routes/               # API route handlers
│   │   ├── middleware/           # Express middleware
│   │   └── index.ts              # Main server file
│   ├── prisma/                   # Database schema and migrations
│   └── package.json              # Backend dependencies
└── README.md                     # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v13 or higher)
- npm or yarn

### 1. Clone the Repository

```bash
git clone <repository-url>
cd flare-alumni-connect
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Update .env with your configuration:
# - DATABASE_URL (PostgreSQL connection string)
# - JWT_SECRET (random string)
# - CLOUDINARY_* (for file uploads)
# - RAZORPAY_* (for payments)
# - SMTP_* (for emails)

# Generate Prisma client
npm run generate

# Run database migrations
npm run migrate

# Start development server
npm run dev
```

**Windows users can run:**
```bash
setup.bat
```

**Linux/Mac users can run:**
```bash
chmod +x setup.sh
./setup.sh
```

### 3. Frontend Setup

```bash
# Go back to root directory
cd ..

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/flare_alumni_db"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"

# Server
PORT=5000
NODE_ENV="development"

# Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Razorpay (for payments)
RAZORPAY_KEY_ID="your-razorpay-key-id"
RAZORPAY_KEY_SECRET="your-razorpay-key-secret"

# Email (for notifications)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Frontend URL
FRONTEND_URL="http://localhost:5173"
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 📊 Database Schema

The platform uses a comprehensive database schema with the following main entities:

- **Users** - Core user information with role-based profiles
- **AlumniProfile** - Alumni-specific data and career journey
- **StudentProfile** - Student academic and placement data
- **CollegeProfile** - College admin and institutional data
- **UniversityProfile** - University admin and multi-college data
- **RecruiterProfile** - Recruiter and company information
- **Videos** - Mentorship videos and content
- **MentorshipSession** - Scheduled mentorship sessions
- **MentorshipRequest** - Student mentorship requests
- **Event** - College and university events
- **Job** - Job postings and opportunities
- **Donation** - Alumni donations and contributions
- **Analytics** - User and system analytics

## 🔐 Authentication & Authorization

- **JWT-based authentication** with secure token management
- **Role-based access control** (RBAC) for different user types
- **Password hashing** with bcrypt
- **Protected routes** based on user roles
- **Session management** with automatic token refresh

## 🎯 User Roles & Permissions

### Alumni
- Upload and manage mentorship videos
- Track career journey and achievements
- Manage mentorship sessions
- Make donations to alma mater
- View analytics and insights

### Students
- Search and connect with alumni
- Request mentorship sessions
- Apply for jobs and internships
- Track academic performance
- Access mentorship content

### College Admin
- Manage student and alumni data
- Organize events and activities
- Track placement and academic metrics
- Generate NAAC reports
- Access institutional analytics

### University Admin
- Monitor multiple colleges
- Generate comprehensive reports
- Track institutional performance
- Manage university-wide initiatives
- Access aggregated analytics

### Recruiters
- Browse student profiles and skills
- Post job opportunities
- Manage applications
- Access recruitment analytics
- Dual role access (if alumni)

## 🚀 Deployment

### Backend Deployment

1. **Build the application:**
   ```bash
   cd backend
   npm run build
   ```

2. **Set production environment variables**

3. **Run database migrations:**
   ```bash
   npm run migrate
   ```

4. **Start the production server:**
   ```bash
   npm start
   ```

### Frontend Deployment

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder to your hosting service**

## 📱 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Alumni Endpoints
- `GET /api/alumni/profile` - Get alumni profile
- `PUT /api/alumni/profile` - Update alumni profile
- `POST /api/alumni/videos` - Upload mentorship video
- `GET /api/alumni/videos` - Get alumni videos
- `GET /api/alumni/mentorship-sessions` - Get mentorship sessions
- `GET /api/alumni/donations` - Get donation history

### Student Endpoints
- `GET /api/students/profile` - Get student profile
- `GET /api/students/search-alumni` - Search alumni
- `POST /api/students/mentorship-requests` - Request mentorship
- `GET /api/students/jobs` - Get job opportunities
- `POST /api/students/jobs/:id/apply` - Apply for job

### College Admin Endpoints
- `GET /api/colleges/dashboard` - Get college dashboard
- `GET /api/colleges/students` - Get students
- `POST /api/colleges/events` - Create event
- `GET /api/colleges/naac-data` - Get NAAC data

### University Admin Endpoints
- `GET /api/universities/dashboard` - Get university dashboard
- `GET /api/universities/colleges` - Get colleges
- `GET /api/universities/reports` - Generate reports

### Recruiter Endpoints
- `GET /api/recruiters/students` - Browse students
- `POST /api/recruiters/jobs` - Post job
- `GET /api/recruiters/jobs` - Get posted jobs
- `GET /api/recruiters/analytics` - Get recruiter analytics

## 🔧 Development

### Running in Development Mode

```bash
# Backend
cd backend
npm run dev

# Frontend (in another terminal)
npm run dev
```

### Database Management

```bash
# Generate Prisma client
npm run generate

# Run migrations
npm run migrate

# Open Prisma Studio
npm run studio

# Reset database
npm run migrate:reset
```

### Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed description
3. Contact the development team

## 🎉 Acknowledgments

- Built with modern web technologies
- Designed for scalability and performance
- Focused on user experience and accessibility
- Comprehensive role-based access control
- Integrated payment and file storage solutions

---

**FLARE Alumni Connect** - Connecting alumni, empowering futures. 🎓✨