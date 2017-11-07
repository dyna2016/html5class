var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  passwordConf: {
    type: String,
    required: true
  },
  googleId: String
});

//authenticate input against database
UserSchema.statics.authenticate = function(email, password, callback) {
  User.findOne({ email: email }).exec(function(err, user) {
    if (err) {
      return callback(err);
    } else if (!user) {
      var err0 = new Error('User not found.');
      err0.status = 401;
      return callback(err0);
    }
    bcrypt.compare(password, user.password, function(err, result) {
      if (result === true) {
        return callback(null, user);
      } else {
        return callback();
      }
    });
  });
};

UserSchema.statics.findOrCreate = function(googleProfile, cb) {
  let guid = googleProfile.id;
  console.log('---------' + guid);
  User.findOne({googleId: guid }).exec(function(err, user) {
    if (err) {
      return cb(err, user);
    } else if (!user) {
      var newUser = new User();
      newUser.googleId = guid;
      newUser.email = 'actcmaps@google.com';
      newUser.username = googleProfile.displayName;
      newUser.password = 'someword';
      newUser.passwordConf = 'someword';
      newUser.save(function(err1) {
        if (err1) throw err1;
        return cb(null, newUser);
      });      
    } else {
      return cb(null, user);
    }
  });

  let user = { username: 'atctmaps: ' + guid };
  cb(null, user);
};

UserSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

//hashing a password before saving it to the database
UserSchema.pre('save', function(next) {
  var user = this;
  var salt = bcrypt.genSaltSync(10);
  // var hash = bcrypt.hashSync("B4c0/\/", salt);

  bcrypt.hash(user.password, salt, function(err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  });
});

var User = mongoose.model('User', UserSchema);
module.exports = User;
