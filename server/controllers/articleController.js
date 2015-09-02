// TODO be consistent with sent err

var Article = require('../models/articleModel.js');
var Q = require('q');

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

  newArticle: function (req, res, next) {
    var url = req.body.url;
    // check if valid url
    var createArticle = Q.nbind(Article.create, Article);
    // check if article already exist
    var newArticle = {
      url: url,
      tags: ['#me', '#me', '#andme'],
      uploader: 'uploader', // find username
      dataloc: '0', // TODO file system
      date: 'date', // put real date
      comments: ['voila'],
      commentators: ['me'],
      popularityIdx: 0,
      controversyIdx: 0
    };
    console.log('newArticle', newArticle);
    createArticle(newArticle)
      .then(function (createdArticle) {
        if (createdArticle) {
          res.json(createdArticle);
        }
      })
      .fail(function (error) {
        next(error);
      });
  }
};
