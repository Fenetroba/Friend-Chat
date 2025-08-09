import AuthRoutes from './routers/Auth.router.js';
import userRoutes from './routers/User.router.js';
import MessageRoutes from './routers/Message.router.js';
import express from 'express';
import cookieParser from 'cookie-parser';
import ConnectDb from './lib/DB.js';
import "dotenv/config";
const PORT = process.env.PORT || 5000;
import cors from 'cors';
import session from 'express-session';
import passport from './lib/passport.js';

const app = express();
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb', extended: true }));
app.use(cookieParser());

// Configure CORS options if needed
app.use(cors({
  origin: true,
  credentials: true,
}));

// Trust proxy for secure cookies when behind proxies (production)
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// Sessions for Passport (required by oauth20 strategy)
app.use(session({
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: 'none',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', AuthRoutes);
app.use('/api/user', userRoutes);
app.use('/api/chat', MessageRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  ConnectDb();  
});
