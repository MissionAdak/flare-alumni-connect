import express from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest, requireRole } from '../middleware/auth';
import Joi from 'joi';

const router = express.Router();
const prisma = new PrismaClient();

// Get recruiter profile
router.get('/profile', requireRole(['RECRUITER']), async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        recruiterProfile: true,
        postedJobs: {
          orderBy: { createdAt: 'desc' },
          include: {
            applications: {
              include: {
                applicant: {
                  select: {
                    firstName: true,
                    lastName: true,
                    email: true,
                    profileImage: true
                  }
                }
              }
            }
          }
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

// Update recruiter profile
router.put('/profile', requireRole(['RECRUITER']), async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const updateSchema = Joi.object({
      companyName: Joi.string().optional(),
      companySize: Joi.string().valid('startup', 'small', 'medium', 'large').optional(),
      industry: Joi.string().optional(),
      website: Joi.string().uri().optional(),
      isAlumniRecruiter: Joi.boolean().optional()
    });

    const { error, value } = updateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Update user data
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        company: value.companyName
      }
    });

    // Update recruiter profile
    const updatedProfile = await prisma.recruiterProfile.upsert({
      where: { userId },
      update: value,
      create: {
        userId,
        companyName: value.companyName || '',
        companySize: value.companySize,
        industry: value.industry,
        website: value.website,
        isAlumniRecruiter: value.isAlumniRecruiter || false
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

// Browse students by skills and grades
router.get('/students', requireRole(['RECRUITER']), async (req: AuthRequest, res, next) => {
  try {
    const { 
      skills, 
      cgpaMin, 
      cgpaMax, 
      branch, 
      year,
      placementStatus,
      page = 1, 
      limit = 10 
    } = req.query;

    const whereClause: any = {
      role: 'STUDENT',
      status: 'ACTIVE'
    };

    if (skills) {
      const skillArray = Array.isArray(skills) ? skills : [skills];
      whereClause.skills = {
        hasSome: skillArray
      };
    }

    if (cgpaMin || cgpaMax) {
      whereClause.cgpa = {};
      if (cgpaMin) whereClause.cgpa.gte = Number(cgpaMin);
      if (cgpaMax) whereClause.cgpa.lte = Number(cgpaMax);
    }

    if (branch) {
      whereClause.branch = { contains: branch, mode: 'insensitive' };
    }

    if (year) {
      whereClause.studentProfile = {
        currentYear: Number(year)
      };
    }

    if (placementStatus) {
      whereClause.studentProfile = {
        ...whereClause.studentProfile,
        placementStatus: placementStatus
      };
    }

    const students = await prisma.user.findMany({
      where: whereClause,
      include: {
        studentProfile: true
      },
      orderBy: { createdAt: 'desc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit)
    });

    const total = await prisma.user.count({
      where: whereClause
    });

    return res.json({
      students,
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

// Post job/internship opening
router.post('/jobs', requireRole(['RECRUITER']), async (req: AuthRequest, res, next) => {
  try {
    const jobSchema = Joi.object({
      title: Joi.string().required(),
      description: Joi.string().required(),
      company: Joi.string().required(),
      location: Joi.string().optional(),
      isRemote: Joi.boolean().default(false),
      salaryMin: Joi.number().min(0).optional(),
      salaryMax: Joi.number().min(0).optional(),
      experience: Joi.string().optional(),
      skills: Joi.array().items(Joi.string()).default([]),
      jobType: Joi.string().valid('full-time', 'part-time', 'internship').required()
    });

    const { error, value } = jobSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const job = await prisma.job.create({
      data: {
        ...value,
        posterId: req.user!.id,
        status: 'PUBLISHED'
      }
    });

    return res.status(201).json({
      message: 'Job posted successfully',
      job
    });
  } catch (error) {
    return next(error);
  }
});

// Get posted jobs
router.get('/jobs', requireRole(['RECRUITER']), async (req: AuthRequest, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const whereClause: any = { posterId: req.user!.id };
    if (status) {
      whereClause.status = status;
    }

    const jobs = await prisma.job.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      include: {
        applications: {
          include: {
            applicant: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                profileImage: true,
                cgpa: true,
                skills: true,
                studentProfile: {
              select: {
                currentYear: true,
                placementStatus: true
              }
            }
              }
            }
          }
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

// Update job
router.put('/jobs/:jobId', requireRole(['RECRUITER']), async (req: AuthRequest, res, next) => {
  try {
    const { jobId } = req.params;
    const updateSchema = Joi.object({
      title: Joi.string().optional(),
      description: Joi.string().optional(),
      company: Joi.string().optional(),
      location: Joi.string().optional(),
      isRemote: Joi.boolean().optional(),
      salaryMin: Joi.number().min(0).optional(),
      salaryMax: Joi.number().min(0).optional(),
      experience: Joi.string().optional(),
      skills: Joi.array().items(Joi.string()).optional(),
      jobType: Joi.string().valid('full-time', 'part-time', 'internship').optional(),
      status: Joi.string().valid('DRAFT', 'PUBLISHED', 'CLOSED', 'FILLED').optional()
    });

    const { error, value } = updateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const job = await prisma.job.findFirst({
      where: {
        id: jobId,
        posterId: req.user!.id
      }
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: value
    });

    return res.json({
      message: 'Job updated successfully',
      job: updatedJob
    });
  } catch (error) {
    return next(error);
  }
});

// Get job applications
router.get('/jobs/:jobId/applications', requireRole(['RECRUITER']), async (req: AuthRequest, res, next) => {
  try {
    const { jobId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;

    // Verify job ownership
    const job = await prisma.job.findFirst({
      where: {
        id: jobId,
        posterId: req.user!.id
      }
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const whereClause: any = { jobId };
    if (status) {
      whereClause.status = status;
    }

    const applications = await prisma.jobApplication.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      include: {
        applicant: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            profileImage: true,
            cgpa: true,
            skills: true,
            university: true,
            college: true,
            branch: true,
            studentProfile: {
              select: {
                currentYear: true,
                currentSemester: true,
                placementStatus: true,
                internshipStatus: true
              }
            }
          }
        }
      }
    });

    const total = await prisma.jobApplication.count({
      where: whereClause
    });

    return res.json({
      applications,
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

// Update application status
router.patch('/applications/:applicationId', requireRole(['RECRUITER']), async (req: AuthRequest, res, next) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    if (!['pending', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Verify application ownership through job
    const application = await prisma.jobApplication.findFirst({
      where: {
        id: applicationId,
        job: {
          posterId: req.user!.id
        }
      }
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const updatedApplication = await prisma.jobApplication.update({
      where: { id: applicationId },
      data: { status }
    });

    return res.json({
      message: 'Application status updated successfully',
      application: updatedApplication
    });
  } catch (error) {
    return next(error);
  }
});

// Get recruiter analytics
router.get('/analytics', requireRole(['RECRUITER']), async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;

    const [
      totalJobs,
      totalApplications,
      acceptedApplications,
      recentActivity
    ] = await Promise.all([
      prisma.job.count({ where: { posterId: userId } }),
      prisma.jobApplication.count({
        where: {
          job: { posterId: userId }
        }
      }),
      prisma.jobApplication.count({
        where: {
          job: { posterId: userId },
          status: 'accepted'
        }
      }),
      prisma.userAnalytics.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        take: 30
      })
    ]);

    return res.json({
      totalJobs,
      totalApplications,
      acceptedApplications,
      recentActivity
    });
  } catch (error) {
    return next(error);
  }
});

// If alumni recruiter, get alumni dashboard access
router.get('/alumni-dashboard', requireRole(['RECRUITER']), async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;

    const recruiterProfile = await prisma.recruiterProfile.findUnique({
      where: { userId }
    });

    if (!recruiterProfile?.isAlumniRecruiter) {
      return res.status(403).json({ message: 'Access denied. Not an alumni recruiter.' });
    }

    // Get alumni data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        alumniProfile: true,
        videos: {
          orderBy: { createdAt: 'desc' }
        },
        donations: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    return res.json({ user });
  } catch (error) {
    return next(error);
  }
});

export default router;
