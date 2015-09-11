var mongoose = require('mongoose');

// TODO add required and default if necessary
// use base url?
var ArticleSchema = new mongoose.Schema({
  date: String, // put date ?
  journal: String,
  url: String,
  tags: String, // change to array
  dataloc: String,
  uploaders: Array,
  commentators: Array,
  minmaxComments: Array,
  comments: Array,
  popularityIdx: Number,
  controversy: Object
});

module.exports = mongoose.model('Article', ArticleSchema);