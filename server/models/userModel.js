var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Q = require('q');
var SALT_WORK_FACTOR = 10;

// TODO add required and default if necessary
var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique:true
  },
  password: {
    type: String,
    required: true
  },
  salt: String,
  interests: String, // make array
  picture: String,
  email: String,
  articles: Array,
  beliefs: Array,
});


UserSchema.methods.comparePasswords = function (candidatePassword) {
  var defer = Q.defer(); // a new instance of deferred is constructed
  // The purpose of the deferred object is to expose the associated Promise instance 
  // as well as APIs that can be used for signaling the successful or unsuccessful completion,
  // as well as the status of the task.
  var savedPassword = this.password;
  bcrypt.compare(candidatePassword, savedPassword, function (err, isMatch) {
    if (err) {
      defer.reject(err);
    } else {
      defer.resolve(isMatch);
    }
  });
  return defer.promise;
};

UserSchema.pre('save', function(next) {
  var user = this;
  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) {
    return next();
  }
  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) {
      return next(err);
    }
    // hash the password along with our new salt
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) {
        return next(err);
      }
      // override the cleartext password with the hashed one
      user.password = hash;
      user.salt = salt;
      next();
    });
  });
});

module.exports = mongoose.model('User', UserSchema);