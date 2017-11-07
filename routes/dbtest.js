var express = require('express');
var router = express.Router();
var Cat = require('../models/cat');

/* GET home page. */
router.get('/', function(req, res, next) {
  var lines = '';
  Cat.find().exec(function(error, data) {
    if (error) {
      return next(error);
    }
    // lines = data.reduce(function(c,v){ c +=  '<br>'; }, '');
    // res.send(data.length);
    // https://stackoverflow.com/questions/24035872/return-results-mongoose-in-find-query-to-a-variable
    // data.forEach(function(cat) {
    //   lines += cat.name + '<br>';
    // });
    // res.send(lines);
    res.render('allCat', { title: 'Express', doc: data });
  });
});

router.post('/', function(req, res, next) {
  res.send('save a record to db');
});

router.get('/_dump', function(req, res, next) {
  function populate_db() {
    var yellowCat = new Cat({ name: 'yellow' });
    var blackCat = new Cat({ name: 'black' });
    yellowCat.save();
    blackCat.save();
  }
  populate_db();
  res.send('data saved to db');
});

router.get('/_clear', function(req, res, next) {
  res.send('data dumped to db');
});

module.exports = router;
