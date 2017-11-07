var express = require('express');
var router = express.Router();
const passport = require('passport');

function showPage(req, res, next) {
  res.render('passport-login', { title: 'passport login' });
  // res.send('to test passport');
}

router.get('/profile', (req, res) => {
  res.render('user-profile', req.user);
});

router.get('/logout', function(req, res) {
  req.logout();
  req.sayBye();
  res.send(
    'successfully logged out. <br> verify with <a href=/passport/profile>click</a>'
  );
});

router.get('/', (req, res) => {
  res.send('to be implemented');
});
router.get('/bank', (req, res) => {
  if (!req.user) {
    res.send('proteced resource. <br> no credentials found');
  } else {
    res.send('you saved $1000');
  }
});

//http://mherman.org/blog/2015/01/31/local-authentication-with-passport-and-express-4/#.WfS8IltSyM8
// router.post('/login', passport.authenticate('local'),  (req,res)=>{
//   res.send('user loggined ' + req.body.logemail);
// });
// router.post('/', (req, res)=>{res.send('posted here');});
// https://github.com/passport/express-4.x-local-example/blob/master/server.js

/* GET home page. */
router.get('/signin', [showPage]);

// Option 1: passport will send a 401 Un
router.post('/signin',
  passport.authenticate('local'), (req, res)=>{
    res.redirect('/passport/profile');
  });

// Option 2: provide successfulRedirect and failureRedirect
// router.post('/login', function(req, res, next) {
//   passport.authenticate('local', {
//     successRedirect: '/passport/profile',
//     failureRedirect: '/users',
//     failureFlash: true
//   })(req, res, next);
// });

// Option 3: use 3rd party

module.exports = router;
