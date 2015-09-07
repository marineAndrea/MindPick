var Article = require('../models/articleModel.js');
var User = require('../models/userModel.js');
var Q = require('q');
var utils = require('../config/utils.js');

var createBelief = function(id, opin, src, ctrIdx) {
  var belief = {
    articleId: id,
    opinion: opin,
    source: src,
    controversyIdx: ctrIdx
  };
  return belief;
};

var createComment = function(name, id, opin, src) {
  var comment = {
    username: name,
    articleId: id,
    opinion: opin,
    source: src
  };
  return comment;
};

module.exports = {

  commentDocument: function(req, res, next) {
    // unable comment with no opinion and no source

    // get username from local storage
    var username = req.body.username;
    var opinion = req.body.opinion || "interesting";
    var source = req.body.source;
    console.log('++++++++++++++++++++++++source', source);
    if (source) {
      var url = req.body.source.url || undefined;
      var tags = req.body.source.tags || undefined;
    }
    var articleId, articleContrIdx, comment, belief;
    // get article Id
    utils.getArticleId(req.body.articleId)
      .then(function (article) {
        articleId = article._id;
        articleContrIdx = article.controversyIdx;
        comment = createComment(username, articleId, opinion, source);
        belief = createBelief(articleId, opinion, source, articleContrIdx);
        console.log('comment', comment, 'belief', belief);
        
        // if opinion provided
        if (opinion !== "interesting") {
          console.log('opninon provided', opinion);
          //   UPDATE USEROPINIONS
          utils.updateUsersTable(username, 'beliefs', belief, false);
        } else {
          console.log('no opinion provided');
        }
        // if source provided
        if (source) {
        console.log('source provided', source);
          // UPLOAD ARTICLE (SOURCE)
          // if article does not exist
          //   CREATE NEW ARTICLE
          var findArticle = Q.nbind(Article.findOne, Article);
          findArticle({url: url})
            .then(function (foundArticle) {
              console.log('foundArticle', foundArticle);
              if (!foundArticle) {
                console.log('article does not already exist in database');
                return utils.createNewArticle(url, tags);
              } else {
                console.log('article already exists in database');
                return foundArticle; // not a promise !!!!!!!!!!!!!
              }
            })
            // in any case
            .then(function (article) {
              // UPDATE ARTICLEUPLOADERS
              utils.updateArticlesTable(article._id, 'uploaders', username, true);
              // UPDATE USERSARTICLES
              utils.updateUsersTable(username, 'articles', article._id, true);
            })
            .catch(function (error) {
              console.error(error);
            });
        } else {
          console.log('no source provided');
        }
        // in any case
        //   UPDATE ARTICLECOMMENTS
        utils.updateArticlesTable(articleId, 'comments', comment, false);
        //   UPDATE ARTICLECOMMENTATORS
        utils.updateArticlesTable(articleId, 'commentators', username, true);
        //   UPDATE USERARTICLES (COMMENTED ARTICLE)
        utils.updateUsersTable(username, 'articles', articleId, true);
        res.json();
      })
      .catch(function (error) {
        console.error(error);
      });
  }
};