import express from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest, requireRole } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get all public videos
router.get('/', async (req: AuthRequest, res, next) => {
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

// Get video by ID
router.get('/:id', async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;

    const video = await prisma.video.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
            profileImage: true,
            currentPosition: true,
            company: true,
            experience: true,
            bio: true
          }
        }
      }
    });

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Increment view count
    await prisma.video.update({
      where: { id },
      data: { views: { increment: 1 } }
    });

    return res.json({ video });
  } catch (error) {
    return next(error);
  }
});

// Like video
router.post('/:id/like', requireRole(['STUDENT', 'ALUMNI']), async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;

    const video = await prisma.video.findUnique({
      where: { id }
    });

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const updatedVideo = await prisma.video.update({
      where: { id },
      data: { likes: { increment: 1 } }
    });

    return res.json({
      message: 'Video liked successfully',
      likes: updatedVideo.likes
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
