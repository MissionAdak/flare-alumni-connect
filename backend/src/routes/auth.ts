import express from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import Joi from 'joi';
import { PrismaClient } from '@prisma/client';
import googleAuthRoutes from './auth-google';

const router = express.Router();
const prisma = new PrismaClient();

// Validation schemas
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().min(2).required(),
  lastName: Joi.string().min(2).required(),
  phone: Joi.string().optional(),
  role: Joi.string().valid('ALUMNI', 'STUDENT', 'COLLEGE_ADMIN', 'UNIVERSITY_ADMIN', 'RECRUITER').required(),
  // Additional fields based on role
  studentId: Joi.string().when('role', { is: 'STUDENT', then: Joi.required() }),
  collegeCode: Joi.string().when('role', { is: 'COLLEGE_ADMIN', then: Joi.required() }),
  universityCode: Joi.string().when('role', { is: 'UNIVERSITY_ADMIN', then: Joi.required() }),
  companyName: Joi.string().when('role', { is: 'RECRUITER', then: Joi.required() })
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Register
router.post('/register', async (req, res, next) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password, firstName, lastName, phone, role, ...additionalData } = value;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        role,
        status: 'PENDING'
      }
    });

    // Create role-specific profile
    if (role === 'ALUMNI') {
      await prisma.alumniProfile.create({
        data: {
          userId: user.id,
          isAvailableForMentorship: true
        }
      });
    } else if (role === 'STUDENT') {
      await prisma.studentProfile.create({
        data: {
          userId: user.id,
          studentId: additionalData.studentId,
          currentYear: 1,
          currentSemester: 1
        }
      });
    } else if (role === 'COLLEGE_ADMIN') {
      await prisma.collegeProfile.create({
        data: {
          userId: user.id,
          collegeName: additionalData.collegeName || '',
          collegeCode: additionalData.collegeCode
        }
      });
    } else if (role === 'UNIVERSITY_ADMIN') {
      await prisma.universityProfile.create({
        data: {
          userId: user.id,
          universityName: additionalData.universityName || '',
          universityCode: additionalData.universityCode
        }
      });
    } else if (role === 'RECRUITER') {
      await prisma.recruiterProfile.create({
        data: {
          userId: user.id,
          companyName: additionalData.companyName
        }
      });
    }

    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    return next(error);
  }
});

// Login
router.post('/login', async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = value;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        alumniProfile: true,
        studentProfile: true,
        collegeProfile: true,
        universityProfile: true,
        recruiterProfile: true
      }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user is active
    if (user.status !== 'ACTIVE') {
      return res.status(401).json({ message: 'Account is not active' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as SignOptions
    );

    return res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        profile: user.alumniProfile || user.studentProfile || 
                user.collegeProfile || user.universityProfile || 
                user.recruiterProfile
      }
    });
  } catch (error) {
    return next(error);
  }
});

// Get current user
router.get('/me', async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        alumniProfile: true,
        studentProfile: true,
        collegeProfile: true,
        universityProfile: true,
        recruiterProfile: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        profile: user.alumniProfile || user.studentProfile || 
                user.collegeProfile || user.universityProfile || 
                user.recruiterProfile
      }
    });
  } catch (error) {
    return next(error);
  }
});

// Google OAuth routes
router.use('/google', googleAuthRoutes);

export default router;
