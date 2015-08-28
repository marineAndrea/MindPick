var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AricleSchema = new Schema({
  name: String
});

module.exports = mongoose.model('Bear', BearSchema);