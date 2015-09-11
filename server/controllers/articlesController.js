// TODO be consistent with sent err
// console.error, throw err, next err, fail catch

var Article = require('../models/articleModel.js');
var User = require('../models/userModel.js');
var Q = require('q');
var utils = require('../config/utils.js');
var helper = require('../config/helper.js');

module.exports = {
  
  allArticles: function(req, res, next) {
    utils.getAllArticles()
      .then(function (articles) {
        res.json(articles);
      })
      .fail(function (error) {
        next(error);
      });
  },

  addArticle: function(req, res, next) {
    var url = req.body.url;
    var tags = req.body.tags;
    var username = req.body.username;
    utils.uploadArticle(url, tags, username, next)
      .then(function (article) {
        res.json();
      })
      .fail(function (error) {
        next(error);
      });
  }
};


