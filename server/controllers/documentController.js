var Article = require('../models/articleModel.js');
var User = require('../models/userModel.js');
var Q = require('q');

module.exports = {
  updateArticle: function(req, res, nex) {
    // add user id of commentator
    console.log('updatearticle called');
    
    var opinion = req.body;
    var articleId = req.body.articleId;

    var findArticle = Q.nbind(Article.findOne, Article);
    findArticle({_id: articleId})
      .then(function (article) {
        if (!article) {
          next(new Error('Article does not exist'));
        } else {
          article.comments.push(opinion);
          article.save(function (err, comment) {
            if (err) {
              return console.error(err);
            } else {
              res.json(comment);
            }
          });
        }
      })
      .fail (function (error) {
        next(error);
      });
  }
};