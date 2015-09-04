var Article = require('../models/articleModel.js');
var User = require('../models/userModel.js');
var Q = require('q');

module.exports = {
  updateArticle: function(req, res, nex) {
    
    var opinion = req.body;
    var articleId = req.body.articleId;
    var commentator = req.body.username;

    var findArticle = Q.nbind(Article.findOne, Article);
    findArticle({_id: articleId})
      .then(function (article) {
        if (!article) {
          next(new Error('Article does not exist'));
        } else {
          article.comments.push(opinion);
          // push commentator only if he/she has not already commented the document
          if (article.commentators.indexOf(commentator) === -1) {
            article.commentators.push(commentator);
          } else {
            console.log('commentator has already commented on article');
            // do nothing
          }
          article.save(function (err, comment) {
            if (err) {
              return console.error(err);
            } else {
              res.json(comment);
            }
          });
        }
      })
      .fail(function (error) {
        next(error);
      });

    // add article id to user db
    var findUser = Q.nbind(User.findOne, User);
    findUser({username: commentator})
      .then (function (user) {
        if (!user) {
          next(new Error('User does not exist'));
        } else {
          // check if article has already been pushed
          if (user.articles.indexOf(articleId) === -1) {
            user.articles.push(articleId);
            user.save(function (err, id) {  // should u use id? and be consistent
              if (err) {
                return console.error(err);
              } else {
                res.json(id);
              }
            });
          } else {
            // document already in user's articles
          }
        }
      })
      .fail(function (error) {
        next(error);
      });
  }
};