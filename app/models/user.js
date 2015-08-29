var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: String,
  password: String,
  interests: Array,
  picture: String,
  email: String,
  articles: Array
});

module.exports = mongoose.model('User', UserSchema);