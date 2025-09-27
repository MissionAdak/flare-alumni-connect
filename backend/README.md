# FLARE Alumni Connect - Backend

A comprehensive backend API for the FLARE Alumni Connect platform built with Node.js, Express, TypeScript, and PostgreSQL.

## Features

### Role-based Authentication
- JWT-based authentication
- Role-based access control (Alumni, Student, College Admin, University Admin, Recruiter)
- Secure password hashing with bcrypt

### Alumni Features
- Profile management with career journey tracking
- Video upload and management (YouTube + Cloudinary)
- Mentorship session scheduling and management
- Donation portal with Razorpay integration
- Analytics and insights

### Student Features
- Profile management with academic tracking
- Alumni search by skills and career path
- Mentorship request system
- Job application tracking
- Access to mentorship content

### College Admin Features
- Student and alumni data management
- Event organization and management
- NAAC/placement data tracking
- Analytics and reporting

### University Admin Features
- Aggregated college data monitoring
- Comprehensive reporting system
- Analytics dashboard
- Institutional performance tracking

### Recruiter Features
- Student profile browsing
- Job posting and management
- Application tracking
- Dual role access (if alumni recruiter)

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT
- **File Storage**: Cloudinary
- **Payments**: Razorpay
- **Email**: Nodemailer
- **Validation**: Joi

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v13 or higher)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
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
   
   # Admin credentials
   ADMIN_EMAIL="admin@flarealums.com"
   ADMIN_PASSWORD="admin123"
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npm run generate
   
   # Run database migrations
   npm run migrate
   ```

5. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm run build
   npm start
   ```

## API Documentation

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
- `GET /api/alumni/mentorship-requests` - Get mentorship requests
- `PATCH /api/alumni/mentorship-requests/:id` - Update mentorship request
- `GET /api/alumni/donations` - Get donation history
- `GET /api/alumni/analytics` - Get alumni analytics

### Student Endpoints

- `GET /api/students/profile` - Get student profile
- `PUT /api/students/profile` - Update student profile
- `GET /api/students/search-alumni` - Search alumni
- `GET /api/students/mentorship-content` - Get mentorship content
- `POST /api/students/mentorship-requests` - Request mentorship
- `GET /api/students/mentorship-sessions` - Get mentorship sessions
- `GET /api/students/jobs` - Get job opportunities
- `POST /api/students/jobs/:id/apply` - Apply for job
- `GET /api/students/analytics` - Get student analytics

### College Admin Endpoints

- `GET /api/colleges/dashboard` - Get college dashboard
- `GET /api/colleges/students` - Get students
- `GET /api/colleges/alumni` - Get alumni
- `POST /api/colleges/events` - Create event
- `GET /api/colleges/events` - Get college events
- `PUT /api/colleges/events/:id` - Update event
- `GET /api/colleges/naac-data` - Get NAAC data
- `GET /api/colleges/analytics` - Get college analytics

### University Admin Endpoints

- `GET /api/universities/dashboard` - Get university dashboard
- `GET /api/universities/colleges` - Get colleges
- `GET /api/universities/reports` - Generate reports
- `GET /api/universities/analytics` - Get university analytics

### Recruiter Endpoints

- `GET /api/recruiters/profile` - Get recruiter profile
- `PUT /api/recruiters/profile` - Update recruiter profile
- `GET /api/recruiters/students` - Browse students
- `POST /api/recruiters/jobs` - Post job
- `GET /api/recruiters/jobs` - Get posted jobs
- `PUT /api/recruiters/jobs/:id` - Update job
- `GET /api/recruiters/jobs/:id/applications` - Get job applications
- `PATCH /api/recruiters/applications/:id` - Update application status
- `GET /api/recruiters/analytics` - Get recruiter analytics
- `GET /api/recruiters/alumni-dashboard` - Get alumni dashboard (if alumni recruiter)

### General Endpoints

- `GET /api/videos` - Get public videos
- `GET /api/videos/:id` - Get video details
- `POST /api/videos/:id/like` - Like video
- `GET /api/events` - Get public events
- `GET /api/events/:id` - Get event details
- `POST /api/events/:id/register` - Register for event
- `DELETE /api/events/:id/register` - Cancel event registration
- `GET /api/jobs` - Get public jobs
- `GET /api/jobs/:id` - Get job details

### Donation Endpoints

- `POST /api/donations/create-order` - Create donation order
- `POST /api/donations/verify-payment` - Verify payment
- `GET /api/donations/history` - Get donation history
- `GET /api/donations/statistics` - Get donation statistics (admin)

### Analytics Endpoints

- `GET /api/analytics/system` - Get system analytics (admin)
- `GET /api/analytics/user/:id` - Get user analytics (admin)

## Database Schema

The database uses Prisma ORM with the following main entities:

- **Users** - Core user information with role-based profiles
- **AlumniProfile** - Alumni-specific data
- **StudentProfile** - Student-specific data
- **CollegeProfile** - College admin data
- **UniversityProfile** - University admin data
- **RecruiterProfile** - Recruiter data
- **Videos** - Mentorship videos
- **MentorshipSession** - Mentorship sessions
- **MentorshipRequest** - Mentorship requests
- **Event** - Events
- **Job** - Job postings
- **Donation** - Donations
- **UserAnalytics** - User analytics
- **SystemAnalytics** - System analytics

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- Rate limiting
- CORS configuration
- Input validation with Joi
- SQL injection prevention with Prisma
- XSS protection with helmet

## Development

```bash
# Run in development mode
npm run dev

# Run database migrations
npm run migrate

# Generate Prisma client
npm run generate

# Open Prisma Studio
npm run studio

# Run tests
npm test
```

## Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Set environment variables for production

3. Run database migrations:
   ```bash
   npm run migrate
   ```

4. Start the production server:
   ```bash
   npm start
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
