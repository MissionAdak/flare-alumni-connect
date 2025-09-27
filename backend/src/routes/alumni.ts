import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { PrismaClient } from '@prisma/client';
import { AuthRequest, requireRole } from '../middleware/auth';
import Joi from 'joi';

const router = express.Router();
const prisma = new PrismaClient();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Get alumni profile
router.get('/profile', requireRole(['ALUMNI']), async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    
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

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
});

// Update alumni profile
router.put('/profile', requireRole(['ALUMNI']), async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const updateSchema = Joi.object({
      bio: Joi.string().optional(),
      currentPosition: Joi.string().optional(),
      company: Joi.string().optional(),
      experience: Joi.number().optional(),
      skills: Joi.array().items(Joi.string()).optional(),
      cgpa: Joi.number().min(0).max(10).optional(),
      graduationYear: Joi.number().optional(),
      university: Joi.string().optional(),
      college: Joi.string().optional(),
      branch: Joi.string().optional(),
      careerJourney: Joi.array().optional(),
      achievements: Joi.array().items(Joi.string()).optional(),
      certifications: Joi.array().items(Joi.string()).optional(),
      socialLinks: Joi.object().optional(),
      isAvailableForMentorship: Joi.boolean().optional(),
      mentorshipRate: Joi.number().optional()
    });

    const { error, value } = updateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { careerJourney, achievements, certifications, socialLinks, isAvailableForMentorship, mentorshipRate, ...userData } = value;

    // Update user data
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: userData
    });

    // Update alumni profile
    const updatedProfile = await prisma.alumniProfile.upsert({
      where: { userId },
      update: {
        careerJourney: careerJourney ? JSON.stringify(careerJourney) : undefined,
        achievements,
        certifications,
        socialLinks: socialLinks ? JSON.stringify(socialLinks) : undefined,
        isAvailableForMentorship,
        mentorshipRate
      },
      create: {
        userId,
        careerJourney: careerJourney ? JSON.stringify(careerJourney) : null,
        achievements: achievements || [],
        certifications: certifications || [],
        socialLinks: socialLinks ? JSON.stringify(socialLinks) : null,
        isAvailableForMentorship: isAvailableForMentorship ?? true,
        mentorshipRate
      }
    });

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser,
      profile: updatedProfile
    });
  } catch (error) {
    next(error);
  }
});

// Upload mentorship video
router.post('/videos', requireRole(['ALUMNI']), upload.single('video'), async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const { title, description, category, tags, youtubeUrl } = req.body;

    const videoSchema = Joi.object({
      title: Joi.string().required(),
      description: Joi.string().optional(),
      category: Joi.string().optional(),
      tags: Joi.array().items(Joi.string()).optional(),
      youtubeUrl: Joi.string().uri().optional()
    });

    const { error, value } = videoSchema.validate({ title, description, category, tags, youtubeUrl });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    let cloudinaryUrl = null;
    let thumbnail = null;

    // If file is uploaded, upload to Cloudinary
    if (req.file) {
      const result = await cloudinary.uploader.upload_stream(
        {
          resource_type: 'video',
          folder: 'flare-alumni/videos',
          transformation: [
            { width: 1280, height: 720, crop: 'limit' }
          ]
        },
        (error, result) => {
          if (error) throw error;
        }
      ).end(req.file.buffer);

      cloudinaryUrl = result.secure_url;
      
      // Generate thumbnail
      const thumbnailResult = await cloudinary.uploader.upload(
        cloudinaryUrl,
        {
          resource_type: 'video',
          format: 'jpg',
          transformation: [
            { width: 640, height: 360, crop: 'limit' },
            { start_offset: 'auto' }
          ]
        }
      );
      
      thumbnail = thumbnailResult.secure_url;
    }

    const video = await prisma.video.create({
      data: {
        title: value.title,
        description: value.description,
        youtubeUrl: value.youtubeUrl,
        cloudinaryUrl,
        thumbnail,
        category: value.category,
        tags: value.tags || [],
        authorId: userId
      }
    });

    res.status(201).json({
      message: 'Video uploaded successfully',
      video
    });
  } catch (error) {
    next(error);
  }
});

// Get alumni videos
router.get('/videos', requireRole(['ALUMNI']), async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const { page = 1, limit = 10 } = req.query;

    const videos = await prisma.video.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: 'desc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
            profileImage: true
          }
        }
      }
    });

    const total = await prisma.video.count({
      where: { authorId: userId }
    });

    res.json({
      videos,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get mentorship sessions
router.get('/mentorship-sessions', requireRole(['ALUMNI']), async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const { status, page = 1, limit = 10 } = req.query;

    const whereClause: any = { mentorId: userId };
    if (status) {
      whereClause.status = status;
    }

    const sessions = await prisma.mentorshipSession.findMany({
      where: whereClause,
      orderBy: { scheduledAt: 'desc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      include: {
        mentee: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            profileImage: true
          }
        }
      }
    });

    const total = await prisma.mentorshipSession.count({
      where: whereClause
    });

    res.json({
      sessions,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get mentorship requests
router.get('/mentorship-requests', requireRole(['ALUMNI']), async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const { status, page = 1, limit = 10 } = req.query;

    const whereClause: any = { mentorId: userId };
    if (status) {
      whereClause.status = status;
    }

    const requests = await prisma.mentorshipRequest.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            profileImage: true,
            studentProfile: {
              select: {
                studentId: true,
                currentYear: true,
                branch: true
              }
            }
          }
        }
      }
    });

    const total = await prisma.mentorshipRequest.count({
      where: whereClause
    });

    res.json({
      requests,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    next(error);
  }
});

// Accept/Reject mentorship request
router.patch('/mentorship-requests/:requestId', requireRole(['ALUMNI']), async (req: AuthRequest, res, next) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    if (!['PENDING', 'ACTIVE', 'CANCELLED'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const request = await prisma.mentorshipRequest.findFirst({
      where: {
        id: requestId,
        mentorId: req.user!.id
      }
    });

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    const updatedRequest = await prisma.mentorshipRequest.update({
      where: { id: requestId },
      data: { status }
    });

    res.json({
      message: 'Request updated successfully',
      request: updatedRequest
    });
  } catch (error) {
    next(error);
  }
});

// Get donation history
router.get('/donations', requireRole(['ALUMNI']), async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const { page = 1, limit = 10 } = req.query;

    const donations = await prisma.donation.findMany({
      where: { donorId: userId },
      orderBy: { createdAt: 'desc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit)
    });

    const total = await prisma.donation.count({
      where: { donorId: userId }
    });

    const totalDonated = await prisma.donation.aggregate({
      where: { 
        donorId: userId,
        status: 'COMPLETED'
      },
      _sum: { amount: true }
    });

    res.json({
      donations,
      totalDonated: totalDonated._sum.amount || 0,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get alumni analytics
router.get('/analytics', requireRole(['ALUMNI']), async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;

    const [
      totalVideos,
      totalViews,
      totalSessions,
      totalDonations,
      activeMentorships,
      recentActivity
    ] = await Promise.all([
      prisma.video.count({ where: { authorId: userId } }),
      prisma.video.aggregate({
        where: { authorId: userId },
        _sum: { views: true }
      }),
      prisma.mentorshipSession.count({ where: { mentorId: userId } }),
      prisma.donation.aggregate({
        where: { donorId: userId, status: 'COMPLETED' },
        _sum: { amount: true }
      }),
      prisma.mentorshipSession.count({
        where: { mentorId: userId, status: 'ACTIVE' }
      }),
      prisma.userAnalytics.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        take: 30
      })
    ]);

    res.json({
      totalVideos,
      totalViews: totalViews._sum.views || 0,
      totalSessions,
      totalDonations: totalDonations._sum.amount || 0,
      activeMentorships,
      recentActivity
    });
  } catch (error) {
    next(error);
  }
});

export default router;
