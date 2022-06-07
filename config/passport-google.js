const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const keys = require('./keys');
// const { User } = require('../db/models');

passport.use(new GoogleStrategy(
  {
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret,
    callbackURL: 'https://localhost:3000/google/callback',
    passReqToCallback: true,
  },
  // function (request, accessToken, refreshToken, profile, done) {
  //   User.findOrCreate({ googleId: profile.id }, function (err, user) {
  //     return done(err, user);
  //   });
  // }
  ((request, accessToken, refreshToken, profile, done) => done(null, profile)),
));

//

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});
