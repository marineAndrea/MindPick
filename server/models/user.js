var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// TODO add required and default if necessary
var UserSchema = new Schema({
  name: String,
  password: String,
  interests: Array,
  picture: String,
  email: String,
  articles: Array
});

module.exports = mongoose.model('User', UserSchema);