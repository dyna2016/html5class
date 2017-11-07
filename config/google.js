// var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('../models/user');
/* delete this */
let GOOGLE_CLIENT_ID =
  '914427779990-514vo2c4sv6bl3gc9gtau30llgg9apth.apps.googleusercontent.com';
let GOOGLE_CLIENT_SECRET = '';

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.

function extractProfile(profile) {
  let imageUrl = '';
  if (profile.photos && profile.photos.length) {
    imageUrl = profile.photos[0].value;
  }
  return {
    id: profile.id,
    displayName: profile.displayName,
    image: imageUrl
  };
}

let googleConfig = {
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:8080/google/signin/callback'
};

let googleLogin = function(accessToken, refreshToken, profile, done) {
  // console.log(profile);
  User.findOrCreate(extractProfile(profile), function(err, user) {
    return done(err, user);
  });
};




function google_strategy(passport) {
  passport.use(new GoogleStrategy(googleConfig, googleLogin));
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
}

module.exports = google_strategy;
