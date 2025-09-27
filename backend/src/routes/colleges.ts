import express from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest, requireRole } from '../middleware/auth';
import Joi from 'joi';

const router = express.Router();
const prisma = new PrismaClient();

// Get college dashboard data
router.get('/dashboard', requireRole(['COLLEGE_ADMIN']), async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    
    const college = await prisma.collegeProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    if (!college) {
      return res.status(404).json({ message: 'College profile not found' });
    }

    // Get student statistics
    const studentStats = await prisma.user.findMany({
      where: {
        role: 'STUDENT',
        college: college.collegeName
      },
      include: {
        studentProfile: true
      }
    });

    // Get alumni statistics
    const alumniStats = await prisma.user.findMany({
      where: {
        role: 'ALUMNI',
        college: college.collegeName
      },
      include: {
        alumniProfile: true
      }
    });

    // Calculate metrics
    const totalStudents = studentStats.length;
    const totalAlumni = alumniStats.length;
    const averageCGPA = studentStats.reduce((sum, student) => 
      sum + (student.cgpa || 0), 0) / totalStudents || 0;
    
    const placedStudents = studentStats.filter(student => 
      student.studentProfile?.placementStatus === 'placed'
    ).length;
    
    const placementPercentage = totalStudents > 0 ? 
      (placedStudents / totalStudents) * 100 : 0;

    const internshipStudents = studentStats.filter(student => 
      student.studentProfile?.internshipStatus === 'completed'
    ).length;

    res.json({
      college,
      statistics: {
        totalStudents,
        totalAlumni,
        averageCGPA: Math.round(averageCGPA * 100) / 100,
        placedStudents,
        placementPercentage: Math.round(placementPercentage * 100) / 100,
        internshipStudents
      },
      students: studentStats,
      alumni: alumniStats
    });
  } catch (error) {
    next(error);
  }
});

// Get students by criteria
router.get('/students', requireRole(['COLLEGE_ADMIN']), async (req: AuthRequest, res, next) => {
  try {
    const { 
      year, 
      branch, 
      cgpaMin, 
      cgpaMax, 
      placementStatus, 
      internshipStatus,
      page = 1, 
      limit = 10 
    } = req.query;

    const college = await prisma.collegeProfile.findUnique({
      where: { userId: req.user!.id }
    });

    if (!college) {
      return res.status(404).json({ message: 'College profile not found' });
    }

    const whereClause: any = {
      role: 'STUDENT',
      college: college.collegeName
    };

    if (year) {
      whereClause.studentProfile = {
        currentYear: Number(year)
      };
    }

    if (branch) {
      whereClause.branch = { contains: branch, mode: 'insensitive' };
    }

    if (cgpaMin || cgpaMax) {
      whereClause.cgpa = {};
      if (cgpaMin) whereClause.cgpa.gte = Number(cgpaMin);
      if (cgpaMax) whereClause.cgpa.lte = Number(cgpaMax);
    }

    if (placementStatus) {
      whereClause.studentProfile = {
        ...whereClause.studentProfile,
        placementStatus: placementStatus
      };
    }

    if (internshipStatus) {
      whereClause.studentProfile = {
        ...whereClause.studentProfile,
        internshipStatus: internshipStatus
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

    res.json({
      students,
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

// Get alumni by criteria
router.get('/alumni', requireRole(['COLLEGE_ADMIN']), async (req: AuthRequest, res, next) => {
  try {
    const { 
      graduationYear, 
      branch, 
      company, 
      experience,
      page = 1, 
      limit = 10 
    } = req.query;

    const college = await prisma.collegeProfile.findUnique({
      where: { userId: req.user!.id }
    });

    if (!college) {
      return res.status(404).json({ message: 'College profile not found' });
    }

    const whereClause: any = {
      role: 'ALUMNI',
      college: college.collegeName
    };

    if (graduationYear) {
      whereClause.graduationYear = Number(graduationYear);
    }

    if (branch) {
      whereClause.branch = { contains: branch, mode: 'insensitive' };
    }

    if (company) {
      whereClause.company = { contains: company, mode: 'insensitive' };
    }

    if (experience) {
      whereClause.experience = { gte: Number(experience) };
    }

    const alumni = await prisma.user.findMany({
      where: whereClause,
      include: {
        alumniProfile: true
      },
      orderBy: { createdAt: 'desc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit)
    });

    const total = await prisma.user.count({
      where: whereClause
    });

    res.json({
      alumni,
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

// Create event
router.post('/events', requireRole(['COLLEGE_ADMIN']), async (req: AuthRequest, res, next) => {
  try {
    const eventSchema = Joi.object({
      title: Joi.string().required(),
      description: Joi.string().required(),
      eventDate: Joi.date().required(),
      endDate: Joi.date().optional(),
      location: Joi.string().optional(),
      isVirtual: Joi.boolean().default(false),
      meetingLink: Joi.string().uri().optional(),
      maxAttendees: Joi.number().optional(),
      registrationFee: Joi.number().min(0).default(0)
    });

    const { error, value } = eventSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const event = await prisma.event.create({
      data: {
        ...value,
        creatorId: req.user!.id,
        status: 'PUBLISHED'
      }
    });

    res.status(201).json({
      message: 'Event created successfully',
      event
    });
  } catch (error) {
    next(error);
  }
});

// Get college events
router.get('/events', requireRole(['COLLEGE_ADMIN']), async (req: AuthRequest, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const whereClause: any = { creatorId: req.user!.id };
    if (status) {
      whereClause.status = status;
    }

    const events = await prisma.event.findMany({
      where: whereClause,
      orderBy: { eventDate: 'desc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      include: {
        registrations: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                role: true
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

// Update event
router.put('/events/:eventId', requireRole(['COLLEGE_ADMIN']), async (req: AuthRequest, res, next) => {
  try {
    const { eventId } = req.params;
    const updateSchema = Joi.object({
      title: Joi.string().optional(),
      description: Joi.string().optional(),
      eventDate: Joi.date().optional(),
      endDate: Joi.date().optional(),
      location: Joi.string().optional(),
      isVirtual: Joi.boolean().optional(),
      meetingLink: Joi.string().uri().optional(),
      maxAttendees: Joi.number().optional(),
      registrationFee: Joi.number().min(0).optional(),
      status: Joi.string().valid('DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED').optional()
    });

    const { error, value } = updateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const event = await prisma.event.findFirst({
      where: {
        id: eventId,
        creatorId: req.user!.id
      }
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: value
    });

    res.json({
      message: 'Event updated successfully',
      event: updatedEvent
    });
  } catch (error) {
    next(error);
  }
});

// Get NAAC/placement data
router.get('/naac-data', requireRole(['COLLEGE_ADMIN']), async (req: AuthRequest, res, next) => {
  try {
    const college = await prisma.collegeProfile.findUnique({
      where: { userId: req.user!.id }
    });

    if (!college) {
      return res.status(404).json({ message: 'College profile not found' });
    }

    // Get placement statistics
    const placementData = await prisma.user.findMany({
      where: {
        role: 'STUDENT',
        college: college.collegeName
      },
      include: {
        studentProfile: true
      }
    });

    const totalStudents = placementData.length;
    const placedStudents = placementData.filter(student => 
      student.studentProfile?.placementStatus === 'placed'
    ).length;

    const averagePackage = placementData
      .filter(student => student.studentProfile?.placementPackage)
      .reduce((sum, student) => sum + (student.studentProfile?.placementPackage || 0), 0) / 
      placementData.filter(student => student.studentProfile?.placementPackage).length || 0;

    // Get CGPA distribution
    const cgpaDistribution = {
      '9-10': placementData.filter(s => (s.cgpa || 0) >= 9).length,
      '8-9': placementData.filter(s => (s.cgpa || 0) >= 8 && (s.cgpa || 0) < 9).length,
      '7-8': placementData.filter(s => (s.cgpa || 0) >= 7 && (s.cgpa || 0) < 8).length,
      '6-7': placementData.filter(s => (s.cgpa || 0) >= 6 && (s.cgpa || 0) < 7).length,
      'below-6': placementData.filter(s => (s.cgpa || 0) < 6).length
    };

    // Get branch-wise statistics
    const branchStats = placementData.reduce((acc, student) => {
      const branch = student.branch || 'Unknown';
      if (!acc[branch]) {
        acc[branch] = { total: 0, placed: 0, averageCGPA: 0 };
      }
      acc[branch].total++;
      if (student.studentProfile?.placementStatus === 'placed') {
        acc[branch].placed++;
      }
      acc[branch].averageCGPA += student.cgpa || 0;
      return acc;
    }, {} as any);

    // Calculate average CGPA for each branch
    Object.keys(branchStats).forEach(branch => {
      branchStats[branch].averageCGPA = branchStats[branch].averageCGPA / branchStats[branch].total;
    });

    res.json({
      college: {
        name: college.collegeName,
        naacGrade: college.naacGrade,
        naacScore: college.naacScore
      },
      placementData: {
        totalStudents,
        placedStudents,
        placementPercentage: totalStudents > 0 ? (placedStudents / totalStudents) * 100 : 0,
        averagePackage: Math.round(averagePackage * 100) / 100,
        cgpaDistribution,
        branchStats
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get college analytics
router.get('/analytics', requireRole(['COLLEGE_ADMIN']), async (req: AuthRequest, res, next) => {
  try {
    const college = await prisma.collegeProfile.findUnique({
      where: { userId: req.user!.id }
    });

    if (!college) {
      return res.status(404).json({ message: 'College profile not found' });
    }

    const [
      totalStudents,
      totalAlumni,
      totalEvents,
      totalMentorshipSessions,
      recentActivity
    ] = await Promise.all([
      prisma.user.count({
        where: {
          role: 'STUDENT',
          college: college.collegeName
        }
      }),
      prisma.user.count({
        where: {
          role: 'ALUMNI',
          college: college.collegeName
        }
      }),
      prisma.event.count({
        where: { creatorId: req.user!.id }
      }),
      prisma.mentorshipSession.count({
        where: {
          OR: [
            { mentor: { college: college.collegeName } },
            { mentee: { college: college.collegeName } }
          ]
        }
      }),
      prisma.userAnalytics.findMany({
        where: {
          user: {
            college: college.collegeName
          }
        },
        orderBy: { date: 'desc' },
        take: 30
      })
    ]);

    res.json({
      totalStudents,
      totalAlumni,
      totalEvents,
      totalMentorshipSessions,
      recentActivity
    });
  } catch (error) {
    next(error);
  }
});

export default router;
