var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  url: String,
  tags: Array,
  uploader: String,
  dataloc: String,
  date: Date,
  comments: Array,
  commentators: Array,
  popularityIdx: Number,
  controversyIdx: Number
});

module.exports = mongoose.model('Article', ArticleSchema);