import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists with this email
      let user = await prisma.user.findUnique({
        where: { email: profile.emails![0].value },
        include: {
          alumniProfile: true,
          studentProfile: true,
          collegeProfile: true,
          universityProfile: true,
          recruiterProfile: true
        }
      });

      if (!user) {
        // Create new user
        user = await prisma.user.create({
          data: {
            email: profile.emails![0].value,
            firstName: profile.name?.givenName || profile.displayName?.split(' ')[0] || '',
            lastName: profile.name?.familyName || profile.displayName?.split(' ')[1] || '',
            // For Google OAuth users, we'll set a default role and let them choose later
            role: 'STUDENT', // Default role, can be changed later
            status: 'ACTIVE',
            // No password needed for Google OAuth
            password: '',
            // phone: profile.phoneNumbers?.[0]?.value || null, // phoneNumbers not available in Google profile
            profileImage: profile.photos?.[0]?.value || undefined
          },
          include: {
            alumniProfile: true,
            studentProfile: true,
            collegeProfile: true,
            universityProfile: true,
            recruiterProfile: true
          }
        });

        // Create default student profile
        await prisma.studentProfile.create({
          data: {
            userId: user!.id,
            studentId: `GOOGLE_${user!.id}`,
            currentYear: 1,
            currentSemester: 1
          }
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user!.id, email: user!.email, role: user!.role },
        process.env.JWT_SECRET!,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as any
      );

      return done(null, { user: user!, token });
    } catch (error) {
      return done(error, undefined);
    }
  }
);

export default googleStrategy;