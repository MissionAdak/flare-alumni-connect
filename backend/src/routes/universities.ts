import express from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest, requireRole } from '../middleware/auth';
import Joi from 'joi';

const router = express.Router();
const prisma = new PrismaClient();

// Get university dashboard data
router.get('/dashboard', requireRole(['UNIVERSITY_ADMIN']), async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    
    const university = await prisma.universityProfile.findUnique({
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

    if (!university) {
      return res.status(404).json({ message: 'University profile not found' });
    }

    // Get aggregated data from all colleges
    const colleges = await prisma.collegeProfile.findMany({
      where: {
        user: {
          university: university.universityName
        }
      },
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

    // Get all students and alumni from university
    const students = await prisma.user.findMany({
      where: {
        role: 'STUDENT',
        university: university.universityName
      },
      include: {
        studentProfile: true
      }
    });

    const alumni = await prisma.user.findMany({
      where: {
        role: 'ALUMNI',
        university: university.universityName
      },
      include: {
        alumniProfile: true
      }
    });

    // Calculate aggregated metrics
    const totalStudents = students.length;
    const totalAlumni = alumni.length;
    const totalColleges = colleges.length;

    const averageCGPA = students.reduce((sum, student) => 
      sum + (student.cgpa || 0), 0) / totalStudents || 0;

    const placedStudents = students.filter(student => 
      student.studentProfile?.placementStatus === 'placed'
    ).length;

    const placementPercentage = totalStudents > 0 ? 
      (placedStudents / totalStudents) * 100 : 0;

    const averagePackage = students
      .filter(student => student.studentProfile?.placementPackage)
      .reduce((sum, student) => sum + (student.studentProfile?.placementPackage || 0), 0) / 
      students.filter(student => student.studentProfile?.placementPackage).length || 0;

    return res.json({
      university,
      colleges,
      statistics: {
        totalStudents,
        totalAlumni,
        totalColleges,
        averageCGPA: Math.round(averageCGPA * 100) / 100,
        placedStudents,
        placementPercentage: Math.round(placementPercentage * 100) / 100,
        averagePackage: Math.round(averagePackage * 100) / 100
      }
    });
  } catch (error) {
    return next(error);
  }
});

// Get college-wise data
router.get('/colleges', requireRole(['UNIVERSITY_ADMIN']), async (req: AuthRequest, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const university = await prisma.universityProfile.findUnique({
      where: { userId: req.user!.id }
    });

    if (!university) {
      return res.status(404).json({ message: 'University profile not found' });
    }

    const colleges = await prisma.collegeProfile.findMany({
      where: {
        user: {
          university: university.universityName
        }
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit)
    });

    // Get statistics for each college
    const collegesWithStats = await Promise.all(
      colleges.map(async (college) => {
        const students = await prisma.user.findMany({
          where: {
            role: 'STUDENT',
            college: college.collegeName
          },
          include: {
            studentProfile: true
          }
        });

        const alumni = await prisma.user.findMany({
          where: {
            role: 'ALUMNI',
            college: college.collegeName
          }
        });

        const averageCGPA = students.reduce((sum, student) => 
          sum + (student.cgpa || 0), 0) / students.length || 0;

        const placedStudents = students.filter(student => 
          student.studentProfile?.placementStatus === 'placed'
        ).length;

        const placementPercentage = students.length > 0 ? 
          (placedStudents / students.length) * 100 : 0;

        return {
          ...college,
          statistics: {
            totalStudents: students.length,
            totalAlumni: alumni.length,
            averageCGPA: Math.round(averageCGPA * 100) / 100,
            placedStudents,
            placementPercentage: Math.round(placementPercentage * 100) / 100
          }
        };
      })
    );

    const total = await prisma.collegeProfile.count({
      where: {
        user: {
          university: university.universityName
        }
      }
    });

    return res.json({
      colleges: collegesWithStats,
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

// Generate reports
router.get('/reports', requireRole(['UNIVERSITY_ADMIN']), async (req: AuthRequest, res, next) => {
  try {
    const { reportType, startDate, endDate } = req.query;

    const university = await prisma.universityProfile.findUnique({
      where: { userId: req.user!.id }
    });

    if (!university) {
      return res.status(404).json({ message: 'University profile not found' });
    }

    const dateFilter: any = {};
    if (startDate) {
      dateFilter.gte = new Date(startDate as string);
    }
    if (endDate) {
      dateFilter.lte = new Date(endDate as string);
    }

    let reportData: any = {};

    switch (reportType) {
      case 'placement':
        const placementData = await prisma.user.findMany({
          where: {
            role: 'STUDENT',
            university: university.universityName,
            ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter })
          },
          include: {
            studentProfile: true
          }
        });

        const branchWisePlacement = placementData.reduce((acc, student) => {
          const branch = student.branch || 'Unknown';
          if (!acc[branch]) {
            acc[branch] = { total: 0, placed: 0, packages: [] };
          }
          acc[branch].total++;
          if (student.studentProfile?.placementStatus === 'placed') {
            acc[branch].placed++;
            if (student.studentProfile.placementPackage) {
              acc[branch].packages.push(student.studentProfile.placementPackage);
            }
          }
          return acc;
        }, {} as any);

        // Calculate average package for each branch
        Object.keys(branchWisePlacement).forEach(branch => {
          const packages = branchWisePlacement[branch].packages;
          branchWisePlacement[branch].averagePackage = packages.length > 0 ? 
            packages.reduce((sum: number, pkg: number) => sum + pkg, 0) / packages.length : 0;
          branchWisePlacement[branch].placementPercentage = 
            (branchWisePlacement[branch].placed / branchWisePlacement[branch].total) * 100;
        });

        reportData = {
          type: 'placement',
          university: university.universityName,
          period: { startDate, endDate },
          totalStudents: placementData.length,
          placedStudents: placementData.filter(s => s.studentProfile?.placementStatus === 'placed').length,
          branchWisePlacement
        };
        break;

      case 'academic':
        const academicData = await prisma.user.findMany({
          where: {
            role: 'STUDENT',
            university: university.universityName,
            ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter })
          }
        });

        const cgpaDistribution = {
          '9-10': academicData.filter(s => (s.cgpa || 0) >= 9).length,
          '8-9': academicData.filter(s => (s.cgpa || 0) >= 8 && (s.cgpa || 0) < 9).length,
          '7-8': academicData.filter(s => (s.cgpa || 0) >= 7 && (s.cgpa || 0) < 8).length,
          '6-7': academicData.filter(s => (s.cgpa || 0) >= 6 && (s.cgpa || 0) < 7).length,
          'below-6': academicData.filter(s => (s.cgpa || 0) < 6).length
        };

        const averageCGPA = academicData.reduce((sum, student) => 
          sum + (student.cgpa || 0), 0) / academicData.length || 0;

        reportData = {
          type: 'academic',
          university: university.universityName,
          period: { startDate, endDate },
          totalStudents: academicData.length,
          averageCGPA: Math.round(averageCGPA * 100) / 100,
          cgpaDistribution
        };
        break;

      case 'alumni':
        const alumniData = await prisma.user.findMany({
          where: {
            role: 'ALUMNI',
            university: university.universityName,
            ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter })
          },
          include: {
            alumniProfile: true
          }
        });

        const industryDistribution = alumniData.reduce((acc, alum) => {
          const industry = alum.company || 'Unknown';
          acc[industry] = (acc[industry] || 0) + 1;
          return acc;
        }, {} as any);

        const experienceDistribution = {
          '0-2 years': alumniData.filter(a => (a.experience || 0) <= 2).length,
          '2-5 years': alumniData.filter(a => (a.experience || 0) > 2 && (a.experience || 0) <= 5).length,
          '5-10 years': alumniData.filter(a => (a.experience || 0) > 5 && (a.experience || 0) <= 10).length,
          '10+ years': alumniData.filter(a => (a.experience || 0) > 10).length
        };

        reportData = {
          type: 'alumni',
          university: university.universityName,
          period: { startDate, endDate },
          totalAlumni: alumniData.length,
          industryDistribution,
          experienceDistribution
        };
        break;

      default:
        return res.status(400).json({ message: 'Invalid report type' });
    }

    return res.json(reportData);
  } catch (error) {
    return next(error);
  }
});

// Get university analytics
router.get('/analytics', requireRole(['UNIVERSITY_ADMIN']), async (req: AuthRequest, res, next) => {
  try {
    const university = await prisma.universityProfile.findUnique({
      where: { userId: req.user!.id }
    });

    if (!university) {
      return res.status(404).json({ message: 'University profile not found' });
    }

    const [
      totalStudents,
      totalAlumni,
      totalColleges,
      totalEvents,
      totalMentorshipSessions,
      recentActivity
    ] = await Promise.all([
      prisma.user.count({
        where: {
          role: 'STUDENT',
          university: university.universityName
        }
      }),
      prisma.user.count({
        where: {
          role: 'ALUMNI',
          university: university.universityName
        }
      }),
      prisma.collegeProfile.count({
        where: {
          user: {
            university: university.universityName
          }
        }
      }),
      prisma.event.count({
        where: {
          creator: {
            university: university.universityName
          }
        }
      }),
      prisma.mentorshipSession.count({
        where: {
          OR: [
            { mentor: { university: university.universityName } },
            { mentee: { university: university.universityName } }
          ]
        }
      }),
      prisma.userAnalytics.findMany({
        where: {
          user: {
            university: university.universityName
          }
        },
        orderBy: { date: 'desc' },
        take: 30
      })
    ]);

    return res.json({
      totalStudents,
      totalAlumni,
      totalColleges,
      totalEvents,
      totalMentorshipSessions,
      recentActivity
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
