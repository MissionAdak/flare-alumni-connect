import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import passport from 'passport';
import session from 'express-session';

import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import alumniRoutes from './routes/alumni';
import studentRoutes from './routes/students';
import collegeRoutes from './routes/colleges';
import universityRoutes from './routes/universities';
import recruiterRoutes from './routes/recruiters';
import videoRoutes from './routes/videos';
import mentorshipRoutes from './routes/mentorship';
import eventRoutes from './routes/events';
import jobRoutes from './routes/jobs';
import donationRoutes from './routes/donations';
import analyticsRoutes from './routes/analytics';

import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import { authenticateToken } from './middleware/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Session middleware for Google OAuth
app.use(session({
  secret: process.env.JWT_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression and logging
app.use(compression());
app.use(morgan('combined'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/alumni', authenticateToken, alumniRoutes);
app.use('/api/students', authenticateToken, studentRoutes);
app.use('/api/colleges', authenticateToken, collegeRoutes);
app.use('/api/universities', authenticateToken, universityRoutes);
app.use('/api/recruiters', authenticateToken, recruiterRoutes);
app.use('/api/videos', authenticateToken, videoRoutes);
app.use('/api/mentorship', authenticateToken, mentorshipRoutes);
app.use('/api/events', authenticateToken, eventRoutes);
app.use('/api/jobs', authenticateToken, jobRoutes);
app.use('/api/donations', authenticateToken, donationRoutes);
app.use('/api/analytics', authenticateToken, analyticsRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
