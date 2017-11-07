const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
// const config = require('../config/database');
// const bcrypt = require('bcryptjs');

/* note your login form may use different fields for user crendentials*/
const formFields2Use = {
  usernameField: 'username',
  passwordField: 'password'
};

const checkDb = function(username, password, done) {
  //match username
  let query = { username: username };
  User.findOne(query, function(err, user) {
    // console.log('------------ findONe-----');
    if (err) throw err;
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }
    // console.log('----- user found -----');
    // match password
    if (!user.validPassword(password)) {
      return done(null, false, { message: 'Incorrect password.' });
    }
    return done(null, user);
  });
};

function local_strategy(passport) {
  passport.use(new LocalStrategy(formFields2Use, checkDb));
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
}

module.exports = local_strategy;
