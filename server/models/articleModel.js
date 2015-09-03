var mongoose = require('mongoose');

// TODO add required and default if necessary
// use base url?
var ArticleSchema = new mongoose.Schema({
  url: String,
  tags: String, // change to array
  uploader: String,
  dataloc: String,
  date: String, // put date ?
  comments: Array,
  commentators: Array,
  popularityIdx: Number,
  controversyIdx: Number
});

module.exports = mongoose.model('Article', ArticleSchema);