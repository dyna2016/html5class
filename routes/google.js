var express = require('express');
var router = express.Router();
const passport = require('passport');

var toBeImplemented = function(q, r, n) {
  r.send('to be implemented');
};

router.get('/', (q, r, n) => {
  r.send(' <h1> google signin </h1> <a href="/google/signin"> click </a>');
});

// router.get('/signin', toBeImplemented);
// router.post('/signin', toBeImplemented);
router.get('/profile', (q, r, n) => {
  r.send('google profile');
});

// GET /google/signin
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
router.get(
  '/signin',
  passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/plus.login']
  })
);

// GET /google/signin/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
router.get(
  '/signin/callback',
  passport.authenticate('google', { failureRedirect: '/google' }),
  function(req, res) {
    // res.redirect(redirect);
    // res.send('return code:'+ req.user.displayName);
    res.redirect('/google/profile');
  }
);

router.get('/callback', (q, r, n) => {
  r.send('okay' + q.user.displayName);
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated()) return next();

  // if they aren't redirect them to the home page
  res.redirect('/');
}

router.get('bank', isLoggedIn, (q, r, n) => {
  r.send('money saved');
});

module.exports = router;
