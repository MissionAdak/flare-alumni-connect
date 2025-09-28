import express from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest, requireRole } from '../middleware/auth';
import Joi from 'joi';

const router = express.Router();
const prisma = new PrismaClient();

// Get user profile
router.get('/profile', async (req, res, next) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user!.id;
    
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

    return res.json({ user });
  } catch (error) {
    return next(error);
  }
});

// Update user profile
router.put('/profile', async (req, res, next) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user!.id;
    const updateSchema = Joi.object({
      firstName: Joi.string().min(2).optional(),
      lastName: Joi.string().min(2).optional(),
      phone: Joi.string().optional(),
      bio: Joi.string().optional(),
      profileImage: Joi.string().uri().optional(),
      currentPosition: Joi.string().optional(),
      company: Joi.string().optional(),
      experience: Joi.number().min(0).optional(),
      skills: Joi.array().items(Joi.string()).optional(),
      cgpa: Joi.number().min(0).max(10).optional(),
      graduationYear: Joi.number().optional(),
      university: Joi.string().optional(),
      college: Joi.string().optional(),
      branch: Joi.string().optional()
    });

    const { error, value } = updateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: value
    });

    return res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    return next(error);
  }
});

// Get user dashboard data
router.get('/dashboard', async (req, res, next) => {
  const authReq = req as AuthRequest;
  try {
    const userId = authReq.user!.id;
    const userRole = authReq.user!.role;

    let dashboardData: any = {};

    switch (userRole) {
      case 'ALUMNI':
        const [alumniVideos, alumniSessions, alumniDonations] = await Promise.all([
          prisma.video.count({ where: { authorId: userId } }),
          prisma.mentorshipSession.count({ where: { mentorId: userId } }),
          prisma.donation.aggregate({
            where: { donorId: userId, status: 'COMPLETED' },
            _sum: { amount: true }
          })
        ]);

        dashboardData = {
          totalVideos: alumniVideos,
          totalSessions: alumniSessions,
          totalDonated: alumniDonations._sum.amount || 0
        };
        break;

      case 'STUDENT':
        const [studentRequests, studentSessions, studentApplications] = await Promise.all([
          prisma.mentorshipRequest.count({ where: { studentId: userId } }),
          prisma.mentorshipSession.count({ where: { menteeId: userId } }),
          prisma.jobApplication.count({ where: { applicantId: userId } })
        ]);

        dashboardData = {
          totalRequests: studentRequests,
          totalSessions: studentSessions,
          totalApplications: studentApplications
        };
        break;

      case 'COLLEGE_ADMIN':
        const college = await prisma.collegeProfile.findUnique({
          where: { userId }
        });

        if (college) {
          const [collegeStudents, collegeAlumni, collegeEvents] = await Promise.all([
            prisma.user.count({
              where: { role: 'STUDENT', college: college.collegeName }
            }),
            prisma.user.count({
              where: { role: 'ALUMNI', college: college.collegeName }
            }),
            prisma.event.count({ where: { creatorId: userId } })
          ]);

          dashboardData = {
            totalStudents: collegeStudents,
            totalAlumni: collegeAlumni,
            totalEvents: collegeEvents
          };
        }
        break;

      case 'UNIVERSITY_ADMIN':
        const university = await prisma.universityProfile.findUnique({
          where: { userId }
        });

        if (university) {
          const [universityStudents, universityAlumni] = await Promise.all([
            prisma.user.count({
              where: { role: 'STUDENT', university: university.universityName }
            }),
            prisma.user.count({
              where: { role: 'ALUMNI', university: university.universityName }
            })
          ]);

          dashboardData = {
            totalStudents: universityStudents,
            totalAlumni: universityAlumni,
            totalColleges: 0 // TODO: Implement proper college-university relationship
          };
        }
        break;

      case 'RECRUITER':
        const [recruiterJobs, recruiterApplications] = await Promise.all([
          prisma.job.count({ where: { posterId: userId } }),
          prisma.jobApplication.count({
            where: { job: { posterId: userId } }
          })
        ]);

        dashboardData = {
          totalJobs: recruiterJobs,
          totalApplications: recruiterApplications
        };
        break;
    }

    return res.json({ dashboardData });
  } catch (error) {
    return next(error);
  }
});

export default router;
