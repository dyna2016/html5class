var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var configDB = require('./config/database.js');
var flash = require('connect-flash');
var index = require('./routes/index');
var users = require('./routes/users');
var dbtest = require('./routes/dbtest');
var auth = require('./routes/auth');
var psptRte = require('./routes/passport');
var googleRte = require('./routes/google');
/* I still need to config express */
var app = express();

/*test db */
mongoose.connect(configDB.url);
var db = mongoose.connection;
//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('--- we are connected ----');
});

app.use(
  session({
    secret: 'pratical_HTML5',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: db
    })
  })
);

// Express Messages Middleware
app.use(flash());
app.use(function(req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// view engine setup
const exphbs = require('express-handlebars');
const helpers = require('./lib/helpers');
// console.log(helpers);
const hbs = exphbs.create({
  helpers: helpers,
  defaultLayout: 'main',
  extname: 'handlebars',
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  partialsDir: path.join(__dirname, 'views', 'partials')
});
app.engine('handlebars', hbs.engine);
// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* user defined middleware */
app.use((req, res, next) => {
  req.basket = {};
  req.sayHi = () => {
    console.log('Hi');
  };
  req.sayBye = ()=> {
    console.log('Bye');
  };
  next();
});

/* passport*/
//https://www.youtube.com/watch?v=mAOxWf36YLo
// require('./config/passport')(passport);
require('./config/google')(passport);
app.use(passport.initialize());
app.use(passport.session());
// catch 404 and forward to error handler


/* mount points */
app.use('/', index);
app.use('/users', users);
app.use('/db', dbtest);
app.use('/auth', auth);
app.use('/passport', psptRte);
app.use('/google', googleRte);

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
