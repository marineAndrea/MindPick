var Article = require('../models/articleModel.js');
var User = require('../models/userModel.js');
var Q = require('q');
var utils = require('../config/utils.js');
var helper = require('../config/helper.js');

module.exports = {
  commentDocument: function(req, res, next) {

    var username = req.body.username;
    var articleId;
    var opinion = req.body.opinion || "interesting";
    var source = req.body.source;
    if (source) {
      var url = req.body.source.url || undefined;
      var tags = req.body.source.tags || undefined;
    }
    var comment, belief, minMax;

    utils.getArticleById(req.body.articleId)
      // UPDATE ARTICLECOMMENTS (set up default opinion to related) by pushing comment into comments [] in article table
      .then(function (article) {
        articleId = article._id;
        return utils.getUserByUsername(username)
          .then(function (user) {
            // UPDATE USERARTICLES by pushing article id into articles [] in user table
            user = utils.updateTable(user, "articles", articleId, true);
            // UPDATE ARTICLECOMMENTATORS by pushing username into commentators [] in article table
            article = utils.updateTable(article, "commentators", username, true);
            comment = helper.createComment(articleId, username, opinion, source);
            // UPDATE ARTICLECOMMENTS by pushing comment {articleID, username, opinion, source} into comments [] in article table
            article = utils.updateTable(article, "comments", comment, false, next);
            // need to save pushed comment in article comments, in case update all articles is called and its popularity has to be evaluated
            return utils.saveTable(article)
              .then(function (article) { // article after saved is an array
                // only if opinion provided
                if (opinion !== "interesting") {
                  console.log("opninon provided:", opinion);
                  // GET CONTROVERSY INDEX and UPDATE ARTICLECONTRIDX
                  article[0].controversy = helper.getControversy(article[0], 10);
                  // check if new max comment and UPDATE ARTILCEPOPULARITY, MIN and MAX
                  minMax = helper.articlesCheckOnComment(article[0]); // is going to be a promise!!!
                  article[0].minmaxComments = [minMax[0], minMax[1]];
                  article[0].popularityIdx = helper.getPopularity(article[0], 10);

                  // UPDATE USEROPINIONS by pushing belief: {username, articleID, opinion, source, controversyIdx, popularity, dissonanceIdx} into beliefs [] in user table
                  belief = helper.createBelief(username, articleId, opinion, source);
                  user = utils.updateTable(user, "beliefs", belief, false, next);
                }
                return Q.all([utils.saveTable(article[0]), utils.saveTable(user)]);
              });
          });
      })
      .then(function (articleAndUser) {
        // only if source provided
        if (source) {
          console.log("source provided:", source);
          // UPLOAD ARTICLE
          return utils.uploadArticle(url, tags, username, next);
        } else {
          console.log("no source provided");
          return articleAndUser[0];
        }
      })
      .then(function (article) {
        res.json();
      })
      .catch(function (error) {
        next(error);
      });
  }
};


