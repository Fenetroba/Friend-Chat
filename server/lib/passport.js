import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/Auth.model.js';
import { upsertStreamUser } from '../lib/stream.js';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || 'https://friend-chat-1.onrender.com/auth/google/callback';

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.warn('Google OAuth env vars missing: GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET');
}

passport.use(
  new GoogleStrategy(
    {
      clientID: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      callbackURL: CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails && profile.emails[0]?.value;
        const Fullname = profile.displayName || 'User';
        const profilePic = profile.photos && profile.photos[0]?.value;
        if (!email) return done(new Error('No email from Google'), null);

        let user = await User.findOne({ email });
        if (!user) {
          user = new User({ Fullname, email, password: `${Date.now()}_google`, profilePic });
          await user.save();
          try {
            await upsertStreamUser({ id: user._id.toString(), name: user.Fullname, image: user.profilePic || '' });
          } catch (e) {
            console.log('Stream upsert failed:', e?.message);
          }
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id.toString());
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (e) {
    done(e, null);
  }
});

export default passport;
