import express from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest, requireRole } from '../middleware/auth';
import Joi from 'joi';

const router = express.Router();
const prisma = new PrismaClient();

// Schedule mentorship session
router.post('/sessions', requireRole(['ALUMNI']), async (req: AuthRequest, res, next) => {
  try {
    const sessionSchema = Joi.object({
      title: Joi.string().required(),
      description: Joi.string().optional(),
      scheduledAt: Joi.date().required(),
      duration: Joi.number().min(15).max(180).required(), // 15 minutes to 3 hours
      meetingLink: Joi.string().uri().optional(),
      menteeId: Joi.string().required()
    });

    const { error, value } = sessionSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { menteeId, ...sessionData } = value;

    // Verify mentee exists and is a student
    const mentee = await prisma.user.findFirst({
      where: {
        id: menteeId,
        role: 'STUDENT',
        status: 'ACTIVE'
      }
    });

    if (!mentee) {
      return res.status(404).json({ message: 'Mentee not found' });
    }

    // Check if there's an active mentorship request
    const request = await prisma.mentorshipRequest.findFirst({
      where: {
        studentId: menteeId,
        mentorId: req.user!.id,
        status: 'ACTIVE'
      }
    });

    if (!request) {
      return res.status(400).json({ message: 'No active mentorship request found' });
    }

    const session = await prisma.mentorshipSession.create({
      data: {
        ...sessionData,
        mentorId: req.user!.id,
        menteeId: menteeId
      },
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

    return res.status(201).json({
      message: 'Mentorship session scheduled successfully',
      session
    });
  } catch (error) {
    return next(error);
  }
});

// Update session
router.put('/sessions/:sessionId', requireRole(['ALUMNI']), async (req: AuthRequest, res, next) => {
  try {
    const { sessionId } = req.params;
    const updateSchema = Joi.object({
      title: Joi.string().optional(),
      description: Joi.string().optional(),
      scheduledAt: Joi.date().optional(),
      duration: Joi.number().min(15).max(180).optional(),
      meetingLink: Joi.string().uri().optional(),
      status: Joi.string().valid('PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED').optional(),
      notes: Joi.string().optional(),
      feedback: Joi.string().optional(),
      rating: Joi.number().min(1).max(5).optional()
    });

    const { error, value } = updateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const session = await prisma.mentorshipSession.findFirst({
      where: {
        id: sessionId,
        mentorId: req.user!.id
      }
    });

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const updatedSession = await prisma.mentorshipSession.update({
      where: { id: sessionId },
      data: value,
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

    return res.json({
      message: 'Session updated successfully',
      session: updatedSession
    });
  } catch (error) {
    return next(error);
  }
});

// Get all mentorship sessions for a user
router.get('/sessions', requireRole(['STUDENT', 'ALUMNI']), async (req: AuthRequest, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const userId = req.user!.id;

    const whereClause: any = {
      OR: [
        { mentorId: userId },
        { menteeId: userId }
      ]
    };

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
        },
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

export default router;
