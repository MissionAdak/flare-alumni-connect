import express from 'express';
import passport from 'passport';
import { googleStrategy } from '../config/google';

const router = express.Router();

// Initialize passport with Google strategy
passport.use('google', googleStrategy);

// Serialize and deserialize user (for session support)
passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  done(null, user);
});

// Google OAuth login route
router.get('/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    session: false 
  })
);

// Google OAuth callback route
router.get('/google/callback',
  passport.authenticate('google', { 
    session: false,
    failureRedirect: '/login?error=google_auth_failed'
  }),
  (req: any, res) => {
    // Successful authentication
    const { user, token } = req.user;
    
    // Redirect to frontend with token and user data
    const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    }))}`;
    
    res.redirect(redirectUrl);
  }
);

export default router;