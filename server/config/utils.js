//Model.findByIdAndRemove(id, [options], [callback])
//Model.findByIdAndUpdate(id, [update], [options], [callback])
// are the variables in thne global space?

var Article = require('../models/articleModel.js');
var User = require('../models/userModel.js');
var Q = require('q');
var helper = require('./helper.js');
var request = require('request');
var parseUrl = require('url');

// Why does exporting the functions does not work?

var createNewArticle = function(url, journal, tags, minComments, maxComments) {
  // create new article
  var createArticle = Q.nbind(Article.create, Article);
  var date = helper.dateGenerator();
  var articleId;
  var newArticle = {
    date: date,
    journal: journal,
    url: url,
    tags: tags,
    dataloc: '0', // TODO file system
    uploaders: [],
    commentators: [],
    minmaxComments: [minComments, maxComments],
    comments: [],
    popularityIdx: 1,
    controversy: {idx: 1, valence: 0}
  };
  // save article into Articles table
  console.log('+++++++++++++++++++++newArticle', newArticle);
  return createArticle(newArticle);
};

var updateTable = function(table, field, item, check) { // do not save here for efficiency
  if (check) {
    if (helper.alreadyExist(table[field], item)) {
      console.log("" + item + " already in user's " + field);
      return table;
    } 
  }
  table[field].push(item);
  return table;
};

var getArticleByUrl = function(url) {
  var findArticle = Q.nbind(Article.findOne, Article);
  return findArticle({url: url});
};

var getAllArticles = function() {
  var findAll = Q.nbind(Article.find, Article);
  return findAll({});
};

var getUserByUsername = function(username) {
  var findUser = Q.nbind(User.findOne, User);
  return findUser({username: username});
};

var saveTable = function(table) {
  var save = Q.nbind(table.save, table);
  return save();
};

module.exports = {
    
  uploadArticle: function(url, tags, username, next) {
    var journal = parseUrl.parse(url).hostname;
    var minMax;
    return getArticleByUrl(url)
      .then(function (foundArticle) {
        // if article does not exist
        if (!foundArticle) {
          console.log("article does not already exist in database");
          // check if have to update all articles to new min = 0
          return helper.articlesCheckOnUpload()
            .then(function (minMax) {

              // CREATE NEW ARTICLE
              return createNewArticle(url, journal, tags, minMax[0], minMax[1]);
            });
        } else {
          console.log("article already exists in database");
          return foundArticle;
        }
      })
      // in any case
      .then(function (article) {
        return getUserByUsername(username)
          .then(function (user) {
            // UPDATE USERSARTICLES
            // UPDATE ARTICLEUPLOADERS
            user = updateTable(user, "articles", article._id, true);
            artilce = updateTable(article, "uploaders", username, true);
            return Q.all([saveTable(user), saveTable(article)]);
          })
          .then(function (userAndArticle) {
            // do not store html, using iframe on the front-end instead!
            //send request to url and save into db 
            // request(url, function(error, response, body) {
            //   if (!error && response.statusCode == 200) {
            //     console.log(body);
            //     article.dataloc = body;
            //     saveTable(article);
            //   }
            // });
            return userAndArticle[1][0]; // because after saving, get the model in an array
          });
      })
      .catch(function (error) {
        next(error);
      });
  },

  updateTable: updateTable,

  getAllArticles: getAllArticles,

  getArticleById: function(id) {
    var oid;
    var findArticle = Q.nbind(Article.findOne, Article);
    return findArticle({_id: id});
  },

  getMultiArticles: function(arr) {
    var findArticles = Q.nbind(Article.find, Article);
    return findArticles({url: {$in: arr}});
  },

  getUserByUsername: function(username) {
    var findUser = Q.nbind(User.findOne, User);
    return findUser({username: username});
  },

  saveTable: function(table) {
    var save = Q.nbind(table.save, table);
    return save();
  }
};


/////////////////////////////   OTHER VERSIONS    ///////////////////////////
  
  /*updateUsersTable: function(identifier, field, item, check, next) {
    return User.findOne({username: identifier})
      .exec(function (err, user) { ///////////read about exec
        if (err) next(err); ///////////Error
        if (!user) {
          next(err); ///////////Error
        } else {
          if (check) {
            if (alreadyExist(user[field], item)) {
              console.log("" + item + " already in user's " + field);
              return user;
            } 
          }
          user[field].push(item);
          return user.save();
        }
      });
  },*/
  /*updateArticlesTable: function(identifier, field, item, check) {
    console.log('updateArticlesTable called with ', identifier, field, item, check);
    var findArticle = Q.nbind(Article.findOne, Article);
    return findArticle({_id: identifier})
      .then(function (article) {
        if (!article) {
          next(err); ///////////Error
        } else {
          if (check) {
            if (alreadyExist(article[field], item)) {
              console.log("" + item + " already in article's " + field);
              return;
            }
          }
          article[field].push(item);
          var saveArticle = Q.nbind(article.save, article);
          return saveArticle();
        }
      });
  },*/

  /////////////////////////////////////////////////////////////////////////////////////////

