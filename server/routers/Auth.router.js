import express from 'express';
const router=express.Router();
import { CreateUser, LoginUser,LogOut, Onboarding } from '../controllers/Auth.controller.js';
import { Protect_router } from '../Middleware/Protect_Route.js';
import passport from 'passport';
import jwt from 'jsonwebtoken';

router.post('/register', CreateUser);
router.post('/login', LoginUser);
router.post('/logout', LogOut);
router.post('/Onboarding', Protect_router, Onboarding);
router.get('/me', Protect_router, (req, res) => {
  return res.status(200).json({ success: true, user: req.UserOne });
});

// Passport Google OAuth
router.get('/google/oauth',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: true }),
  (req, res) => {
    try {
      // Issue JWT cookie after successful OAuth
      const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });
      res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      const redirectTo = process.env.CLIENT_URL || '/';
      return res.redirect('http://localhost:5173/chat');
    } catch (e) {
      return res.redirect('http://localhost:5173/login');
    }
  }
);

export default router;
