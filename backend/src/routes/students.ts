import express from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest, requireRole } from '../middleware/auth';
import Joi from 'joi';

const router = express.Router();
const prisma = new PrismaClient();

// Get student profile
router.get('/profile', requireRole(['STUDENT']), async (req: Request, res, next) => {
  try {
    const userId = req.user!.id;
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        studentProfile: true,
        mentorshipRequests: {
          include: {
            mentor: {
              select: {
                firstName: true,
                lastName: true,
                profileImage: true,
                currentPosition: true,
                company: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ user });
  } catch (error) {
    return next(error);
  }
});

// Update student profile
router.put('/profile', requireRole(['STUDENT']), async (req: Request, res, next) => {
  try {
    const userId = req.user!.id;
    const updateSchema = Joi.object({
      currentYear: Joi.number().min(1).max(4).optional(),
      currentSemester: Joi.number().min(1).max(8).optional(),
      attendance: Joi.number().min(0).max(100).optional(),
      internshipStatus: Joi.string().valid('none', 'ongoing', 'completed').optional(),
      placementStatus: Joi.string().valid('not_placed', 'placed', 'offered').optional(),
      placementCompany: Joi.string().optional(),
      placementPackage: Joi.number().optional(),
      skills: Joi.array().items(Joi.string()).optional(),
      cgpa: Joi.number().min(0).max(10).optional()
    });

    const { error, value } = updateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { currentYear, currentSemester, attendance, internshipStatus, placementStatus, placementCompany, placementPackage, ...userData } = value;

    // Update user data
    const updatedUser = await prisma.user.update({
      where: { id: authReq.user!.id },
      data: userData
    });

    // Update student profile
    const updatedProfile = await prisma.studentProfile.upsert({
      where: { userId: authReq.user!.id },
      update: {
        currentYear,
        currentSemester,
        attendance,
        internshipStatus,
        placementStatus,
        placementCompany,
        placementPackage
      },
      create: {
        userId: authReq.user!.id,
        studentId: `STU${Date.now()}`,
        currentYear: currentYear || 1,
        currentSemester: currentSemester || 1,
        attendance,
        internshipStatus,
        placementStatus,
        placementCompany,
        placementPackage
      }
    });

    return res.json({
      message: 'Profile updated successfully',
      user: updatedUser,
      profile: updatedProfile
    });
  } catch (error) {
    return next(error);
  }
});

// Search alumni by skills and career path
router.get('/search-alumni', requireRole(['STUDENT']), async (req: Request, res, next) => {
  const authReq = req as AuthRequest;
  try {
    const { skills, careerPath, page = 1, limit = 10 } = req.query;

    const whereClause: any = {
      role: 'ALUMNI',
      status: 'ACTIVE',
      alumniProfile: {
        isAvailableForMentorship: true
      }
    };

    if (skills) {
      const skillArray = Array.isArray(skills) ? skills : [skills];
      whereClause.skills = {
        hasSome: skillArray
      };
    }

    if (careerPath) {
      whereClause.OR = [
        { currentPosition: { contains: careerPath, mode: 'insensitive' } },
        { company: { contains: careerPath, mode: 'insensitive' } }
      ];
    }

    const alumni = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        profileImage: true,
        currentPosition: true,
        company: true,
        experience: true,
        skills: true,
        cgpa: true,
        graduationYear: true,
        university: true,
        college: true,
        branch: true,
        alumniProfile: {
          select: {
            achievements: true,
            certifications: true,
            mentorshipRate: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit)
    });

    const total = await prisma.user.count({
      where: whereClause
    });

    return res.json({
      alumni,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    return next(error);
  }
});

// View mentorship sessions/videos
router.get('/mentorship-content', requireRole(['STUDENT']), async (req: Request, res, next) => {
  const authReq = req as AuthRequest;
  try {
    const { category, page = 1, limit = 10 } = req.query;

    const whereClause: any = {
      isPublic: true
    };

    if (category) {
      whereClause.category = category;
    }

    const videos = await prisma.video.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
            profileImage: true,
            currentPosition: true,
            company: true,
            experience: true
          }
        }
      }
    });

    const total = await prisma.video.count({
      where: whereClause
    });

    return res.json({
      videos,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    return next(error);
  }
});

// Request mentorship session
router.post('/mentorship-requests', requireRole(['STUDENT']), async (req: Request, res, next) => {
  const authReq = req as AuthRequest;
  try {
    const { mentorId, message } = req.body;

    const requestSchema = Joi.object({
      mentorId: Joi.string().required(),
      message: Joi.string().optional()
    });

    const { error, value } = requestSchema.validate({ mentorId, message });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Check if mentor exists and is available
    const mentor = await prisma.user.findFirst({
      where: {
        id: mentorId,
        role: 'ALUMNI',
        status: 'ACTIVE',
        alumniProfile: {
          isAvailableForMentorship: true
        }
      }
    });

    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found or not available' });
    }

    // Check if request already exists
    const existingRequest = await prisma.mentorshipRequest.findFirst({
      where: {
        studentId: req.user!.id,
        mentorId: mentorId,
        status: 'PENDING'
      }
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'Mentorship request already pending' });
    }

    const request = await prisma.mentorshipRequest.create({
      data: {
        studentId: req.user!.id,
        mentorId: mentorId,
        message: value.message
      },
      include: {
        mentor: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            profileImage: true
          }
        }
      }
    });

    return res.status(201).json({
      message: 'Mentorship request sent successfully',
      request
    });
  } catch (error) {
    return next(error);
  }
});

// Get mentorship sessions (as mentee)
router.get('/mentorship-sessions', requireRole(['STUDENT']), async (req: Request, res, next) => {
  const authReq = req as AuthRequest;
  try {
    const userId = authReq.user!.id;
    const { status, page = 1, limit = 10 } = req.query;

    const whereClause: any = { menteeId: authReq.user!.id };
    if (status) {
      whereClause.status = status;
    }

    const sessions = await prisma.mentorshipSession.findMany({
      where: whereClause,
      orderBy: { scheduledAt: 'desc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      include: {
        mentor: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            profileImage: true,
            currentPosition: true,
            company: true
          }
        }
      }
    });

    const total = await prisma.mentorshipSession.count({
      where: whereClause
    });

    return res.json({
      sessions,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    return next(error);
  }
});

// Get job opportunities
router.get('/jobs', requireRole(['STUDENT']), async (req: Request, res, next) => {
  const authReq = req as AuthRequest;
  try {
    const { skills, location, jobType, page = 1, limit = 10 } = req.query;

    const whereClause: any = {
      status: 'PUBLISHED'
    };

    if (skills) {
      const skillArray = Array.isArray(skills) ? skills : [skills];
      whereClause.skills = {
        hasSome: skillArray
      };
    }

    if (location) {
      whereClause.location = {
        contains: location,
        mode: 'insensitive'
      };
    }

    if (jobType) {
      whereClause.jobType = jobType;
    }

    const jobs = await prisma.job.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      include: {
        poster: {
          select: {
            firstName: true,
            lastName: true,
            company: true
          }
        },
        applications: {
          where: { applicantId: authReq.user!.id },
          select: { id: true, status: true }
        }
      }
    });

    const total = await prisma.job.count({
      where: whereClause
    });

    return res.json({
      jobs,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    return next(error);
  }
});

// Apply for job
router.post('/jobs/:jobId/apply', requireRole(['STUDENT']), async (req: Request, res, next) => {
  const authReq = req as AuthRequest;
  try {
    const { jobId } = req.params;
    const { coverLetter, resumeUrl } = req.body;

    const applicationSchema = Joi.object({
      coverLetter: Joi.string().optional(),
      resumeUrl: Joi.string().uri().optional()
    });

    const { error, value } = applicationSchema.validate({ coverLetter, resumeUrl });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Check if job exists
    const job = await prisma.job.findUnique({
      where: { id: jobId }
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if already applied
    const existingApplication = await prisma.jobApplication.findFirst({
      where: {
        applicantId: authReq.user!.id,
        jobId: jobId
      }
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'Already applied for this job' });
    }

    const application = await prisma.jobApplication.create({
      data: {
        applicantId: authReq.user!.id,
        jobId: jobId,
        coverLetter: value.coverLetter,
        resumeUrl: value.resumeUrl
      }
    });

    return res.status(201).json({
      message: 'Application submitted successfully',
      application
    });
  } catch (error) {
    return next(error);
  }
});

// Get student analytics
router.get('/analytics', requireRole(['STUDENT']), async (req: Request, res, next) => {
  const authReq = req as AuthRequest;
  try {
    const userId = authReq.user!.id;

    const [
      totalMentorshipRequests,
      acceptedRequests,
      completedSessions,
      totalJobApplications,
      acceptedApplications,
      recentActivity
    ] = await Promise.all([
      prisma.mentorshipRequest.count({ where: { studentId: userId } }),
      prisma.mentorshipRequest.count({ 
        where: { studentId: userId, status: 'ACTIVE' } 
      }),
      prisma.mentorshipSession.count({ 
        where: { menteeId: userId, status: 'COMPLETED' } 
      }),
      prisma.jobApplication.count({ where: { applicantId: userId } }),
      prisma.jobApplication.count({ 
        where: { applicantId: userId, status: 'accepted' } 
      }),
      prisma.userAnalytics.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        take: 30
      })
    ]);

    return res.json({
      totalMentorshipRequests,
      acceptedRequests,
      completedSessions,
      totalJobApplications,
      acceptedApplications,
      recentActivity
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
