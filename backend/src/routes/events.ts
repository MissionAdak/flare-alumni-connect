import express from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest, requireRole } from '../middleware/auth';
import Joi from 'joi';

const router = express.Router();
const prisma = new PrismaClient();

// Get all public events
router.get('/', async (req: AuthRequest, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const whereClause: any = {
      status: 'PUBLISHED'
    };

    if (status) {
      whereClause.status = status;
    }

    const events = await prisma.event.findMany({
      where: whereClause,
      orderBy: { eventDate: 'asc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      include: {
        creator: {
          select: {
            firstName: true,
            lastName: true,
            profileImage: true
          }
        },
        registrations: {
          select: {
            id: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
                profileImage: true
              }
            }
          }
        }
      }
    });

    const total = await prisma.event.count({
      where: whereClause
    });

    res.json({
      events,
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

// Get event by ID
router.get('/:id', async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            firstName: true,
            lastName: true,
            profileImage: true,
            email: true
          }
        },
        registrations: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                profileImage: true,
                role: true
              }
            }
          }
        }
      }
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ event });
  } catch (error) {
    next(error);
  }
});

// Register for event
router.post('/:id/register', requireRole(['STUDENT', 'ALUMNI']), async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;

    const event = await prisma.event.findUnique({
      where: { id }
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.status !== 'PUBLISHED') {
      return res.status(400).json({ message: 'Event is not available for registration' });
    }

    // Check if already registered
    const existingRegistration = await prisma.eventRegistration.findFirst({
      where: {
        userId: req.user!.id,
        eventId: id
      }
    });

    if (existingRegistration) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    // Check max attendees limit
    if (event.maxAttendees) {
      const currentRegistrations = await prisma.eventRegistration.count({
        where: { eventId: id }
      });

      if (currentRegistrations >= event.maxAttendees) {
        return res.status(400).json({ message: 'Event is full' });
      }
    }

    const registration = await prisma.eventRegistration.create({
      data: {
        userId: req.user!.id,
        eventId: id
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            profileImage: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Successfully registered for event',
      registration
    });
  } catch (error) {
    next(error);
  }
});

// Cancel event registration
router.delete('/:id/register', requireRole(['STUDENT', 'ALUMNI']), async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;

    const registration = await prisma.eventRegistration.findFirst({
      where: {
        userId: req.user!.id,
        eventId: id
      }
    });

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    await prisma.eventRegistration.delete({
      where: { id: registration.id }
    });

    res.json({
      message: 'Registration cancelled successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
