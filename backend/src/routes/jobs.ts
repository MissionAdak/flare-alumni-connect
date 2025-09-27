import express from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest, requireRole } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get all published jobs
router.get('/', async (req: AuthRequest, res, next) => {
  try {
    const { 
      skills, 
      location, 
      jobType, 
      experience,
      page = 1, 
      limit = 10 
    } = req.query;

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

    if (experience) {
      whereClause.experience = experience;
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
            company: true,
            profileImage: true
          }
        },
        applications: {
          where: req.user ? { applicantId: req.user.id } : undefined,
          select: { id: true, status: true }
        }
      }
    });

    const total = await prisma.job.count({
      where: whereClause
    });

    res.json({
      jobs,
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

// Get job by ID
router.get('/:id', async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;

    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        poster: {
          select: {
            firstName: true,
            lastName: true,
            company: true,
            profileImage: true,
            email: true
          }
        },
        applications: {
          where: req.user ? { applicantId: req.user.id } : undefined,
          select: { id: true, status: true, createdAt: true }
        }
      }
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json({ job });
  } catch (error) {
    next(error);
  }
});

export default router;
