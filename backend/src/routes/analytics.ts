import express from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest, requireRole } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get system analytics (for admin)
router.get('/system', requireRole(['COLLEGE_ADMIN', 'UNIVERSITY_ADMIN']), async (req: AuthRequest, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter: any = {};
    if (startDate) {
      dateFilter.gte = new Date(startDate as string);
    }
    if (endDate) {
      dateFilter.lte = new Date(endDate as string);
    }

    const whereClause = Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {};

    const [
      totalUsers,
      activeUsers,
      totalVideos,
      totalSessions,
      totalDonations,
      totalJobs,
      userGrowth,
      roleDistribution
    ] = await Promise.all([
      prisma.user.count({ where: whereClause }),
      prisma.user.count({ 
        where: { 
          ...whereClause,
          status: 'ACTIVE' 
        } 
      }),
      prisma.video.count({ where: whereClause }),
      prisma.mentorshipSession.count({ where: whereClause }),
      prisma.donation.aggregate({
        where: { 
          ...whereClause,
          status: 'COMPLETED' 
        },
        _sum: { amount: true }
      }),
      prisma.job.count({ where: whereClause }),
      prisma.user.findMany({
        where: whereClause,
        select: {
          createdAt: true,
          role: true
        },
        orderBy: { createdAt: 'asc' }
      }),
      prisma.user.groupBy({
        by: ['role'],
        where: whereClause,
        _count: { id: true }
      })
    ]);

    // Process user growth data
    const monthlyGrowth = userGrowth.reduce((acc, user) => {
      const month = user.createdAt.toISOString().substring(0, 7);
      if (!acc[month]) {
        acc[month] = { total: 0, alumni: 0, students: 0, others: 0 };
      }
      acc[month].total++;
      if (user.role === 'ALUMNI') acc[month].alumni++;
      else if (user.role === 'STUDENT') acc[month].students++;
      else acc[month].others++;
      return acc;
    }, {} as any);

    res.json({
      overview: {
        totalUsers,
        activeUsers,
        totalVideos,
        totalSessions,
        totalDonations: totalDonations._sum.amount || 0,
        totalJobs
      },
      userGrowth: monthlyGrowth,
      roleDistribution
    });
  } catch (error) {
    next(error);
  }
});

// Get user analytics
router.get('/user/:userId', requireRole(['COLLEGE_ADMIN', 'UNIVERSITY_ADMIN']), async (req: AuthRequest, res, next) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;

    const dateFilter: any = {};
    if (startDate) {
      dateFilter.gte = new Date(startDate as string);
    }
    if (endDate) {
      dateFilter.lte = new Date(endDate as string);
    }

    const whereClause = Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {};

    const user = await prisma.user.findUnique({
      where: { id: userId },
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

    const [
      videos,
      posts,
      mentorshipSessions,
      donations,
      jobApplications,
      analytics
    ] = await Promise.all([
      prisma.video.count({ 
        where: { 
          authorId: userId,
          ...whereClause 
        } 
      }),
      prisma.post.count({ 
        where: { 
          authorId: userId,
          ...whereClause 
        } 
      }),
      prisma.mentorshipSession.count({
        where: {
          OR: [
            { mentorId: userId },
            { menteeId: userId }
          ],
          ...whereClause
        }
      }),
      prisma.donation.aggregate({
        where: { 
          donorId: userId,
          status: 'COMPLETED',
          ...whereClause 
        },
        _sum: { amount: true }
      }),
      prisma.jobApplication.count({
        where: { 
          applicantId: userId,
          ...whereClause 
        }
      }),
      prisma.userAnalytics.findMany({
        where: { 
          userId,
          ...(Object.keys(dateFilter).length > 0 && { date: dateFilter })
        },
        orderBy: { date: 'desc' }
      })
    ]);

    res.json({
      user,
      statistics: {
        videos,
        posts,
        mentorshipSessions,
        totalDonated: donations._sum.amount || 0,
        jobApplications
      },
      analytics
    });
  } catch (error) {
    next(error);
  }
});

export default router;
