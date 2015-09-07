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

var uploadArticle = function(url, tags, username, next) {

  // if article does not exist
  //   CREATE NEW ARTICLE
  // in any case
  // UPDATE ARTICLEUPLOADERS
  // UPDATE USERSARTICLES

  var findArticle = Q.nbind(Article.findOne, Article);
  return findArticle({url: url})
    .then(function (foundArticle) {
      if (!foundArticle) {
        console.log("article does not already exist in database");
        return utils.createNewArticle(url, tags);
      } else {
        console.log("article already exists in database");
        return foundArticle;
      }
    })
    .then(function (article) {
      return utils.updateArticlesTable(article._id, "uploaders", username, true, next); ///////////Error
    })
    .then(function (article) {
      return utils.updateUsersTable(username, "articles", article._id, true, next); ///////////Error
    })
    .catch(function (error) { //Error
      next(error);
    });
};

module.exports = {

  commentDocument: function(req, res, next) {


    // only if opinion provided
    //   UPDATE USEROPINIONS
    //   update user by pushing comment: {articleID, opinion, controversyIdx} into opinions [] in user table
    // only if source provided
    //   UPLOAD ARTICLE
    // in any case
    //   UPDATE ARTICLECOMMENTS (set up default opinion to related)
    //   update article by pushing comment {articleID, username, opinion, source} into comments [] in article table
    //   UPDATE ARTICLECOMMENTATORS
    //   update article by pushing username into commentators [] in article table
    //   UPDATE USERARTICLES


    // get username from local storage
    var username = req.body.username;
    var opinion = req.body.opinion || "interesting";
    var source = req.body.source;
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
        if (opinion !== "interesting") {
          console.log("opninon provided", opinion);
          return utils.updateUsersTable(username, "beliefs", belief, false, next); ///////////Error
          // returns a user
        } else {
          console.log("no opinion provided");
        }
      })
      .then(function (user) {
        if (source) {
          console.log("source provided", source);
          return uploadArticle(url, tags, username, next);
          // returns a user
        } else {
          console.log("no source provided");
          return user;
        }
      })
      .then(function (user) {
        return utils.updateArticlesTable(articleId, "comments", comment, false, next);
      })
      .then(function (article) {
        return utils.updateArticlesTable(articleId, "commentators", username, true, next);
      })
      .then(function (article) {
        return utils.updateUsersTable(username, "articles", articleId, true, next);
      })
      .then(function (user) {
        if (!user) {
          next(err); //Error
        } else {
          res.json();
        }
      })
      .catch(function (error) { //Error
        next(error);
      });
  }
};