var Article = require('../models/articleModel.js');
var User = require('../models/userModel.js');
var Q = require('q');

module.exports = {
  updateArticle: function(req, res, nex) {
    // add user id of commentator
    
    var opinion = req.body;
    var articleId = req.body.articleId;
    console.log('opinion', opinion, 'articleId', articleId);

    var findArticle = Q.nbind(Article.findOne, Article);
    findArticle({_id: articleId})
      .then(function (article) {
        if (!article) {
          next(new Error('Article does not exist'));
        } else {
          console.log('article.comments before', article.comments);
          article.comments.push(opinion);
          console.log('article.comments after', article.comments);
          article.save(function (err, comment) {
            if (err) {
              return console.error(err);
            } else {
              console.log('comment in res', comment);
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

/*  req.body { opinion: 'dsfgsdfg',
  source: 'sdfgsdfg',
  articleId: '55e8a844e5f7b20000000006' }*/