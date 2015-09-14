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
  },

  relatedArticles: function(req, res, next) {
    var id = req.params.id;
    var urls = [];
    // var relationships = [];
    var sources = [];
    utils.getArticleById(id)
      .then(function (article) {
        for (var i = 0; i < article.comments.length; i++) {
          if (article.comments[i].source) { // not null
            sources.push([article.comments[i].source.url, article.comments[i].opinion]); //tuples
          }
        }
        // need to send back for each source the article + the type of relationship
        // { article: {}, relationship: undermining / supporting }
        // look for duplicates in sources and average opinions
        sources = helper.averageOpinions(sources);
        for (var key in sources) {
          urls.push(key);
        }
        utils.getMultiArticles(urls)
          .then(function (articles) {
            for (var i = 0; i < articles.length; i++) {
              articles[i].relationship = sources[articles[i].url];
            }
            res.json(articles);
          });
      })
      .catch(function (error) {
        next(error);
      });
  }

};


