const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../models');

passport.use(new GoogleStrategy({
    clientID: process.env.Client_ID,
    clientSecret: process.env.Client_secret,
    callbackURL: process.env.REDIRECT_URI
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Logic: Find or Create User based on Google Email
      const email = profile.emails[0].value;
      let user = await User.findOne({ where: { email } });
      
      if (!user) {
        // Create user with a dummy hashed password if necessary (for Oauth skip password)
        user = await User.create({ 
          email, 
          name: profile.displayName,
          password: 'OAUTH_USER_NO_PASSWORD' 
        });
      }
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));
