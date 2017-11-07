var express = require('express');
var router = express.Router();

function showPage(req, res, next) {
  res.render('bankAccount', { title: 'Account Summary' });
}

function checkAuth(req, res, next) {
  if (req.session.userId) {
    next();
  } else {
    res.send(
      'no info avaiable. You need to login! <a href="/users/signin"> click here </a>'
    );
  }
}

/* GET home page. */
router.get('/', [checkAuth, showPage]);
module.exports = router;
