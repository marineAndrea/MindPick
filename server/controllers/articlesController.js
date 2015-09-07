// TODO be consistent with sent err
// if (err) return console.error(err) ?

var Article = require('../models/articleModel.js');
var User = require('../models/userModel.js');
var Q = require('q');
var utils = require('../config/utils.js');

module.exports = {
  allArticles: function(req, res, next) {
  var findAll = Q.nbind(Article.find, Article);

  findAll({})
    .then(function (articles) {
      res.json(articles);
    })
    .fail(function (error) {
      next(error);
    });
  },

  uploadArticle: function(req, res, next) {
    // unable upload article if no url and no tags provided

    // if article does not exist
    //   CREATE NEW ARTICLE
    // in any case
    // UPDATE ARTICLEUPLOADERS
    // UPDATE USERSARTICLES
    var url = req.body.url;
    var tags = req.body.tags;
    var username = req.body.username;
    // check if article exists already
    var findArticle = Q.nbind(Article.findOne, Article);
    findArticle({url: url})
      .then(function (foundArticle) {
        if (!foundArticle) {
          console.log('article does not already exist in database');
          return utils.createNewArticle(url, tags); //returns a promise
        } else {
          console.log('article already exists in database');
          return foundArticle; // not a promise !!!!!!!!!!!!!
        }
      })
      .then(function (article) {
        utils.updateArticlesTable(article._id, 'uploaders', username, true);
        utils.updateUsersTable(username, 'articles', article._id, true);
        res.json();
      })
      .catch(function (error) {
        console.error(error);
      });
  }
};


