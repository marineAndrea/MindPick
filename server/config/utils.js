//Model.findByIdAndRemove(id, [options], [callback])
//Model.findByIdAndUpdate(id, [update], [options], [callback])

var Article = require('../models/articleModel.js');
var User = require('../models/userModel.js');
var Q = require('q');

var alreadyExist = function(arr, item) {
  return (arr.indexOf(item) !== -1);
};

var dateGenerator =  function() {
  var date = new Date();
  var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();
  date = monthNames[monthIndex] + ' ' + day + ', ' + year;
  return date;
};


module.exports = {

  updateUsersTable: function(identifier, field, item, check) {
    console.log('updateUsersTable called with ', identifier, field, item, check);
    var findUser = Q.nbind(User.findOne, User);
    findUser({username: identifier})
      .then(function (user) {
        if (!user) {
          next(new Error("user does not exist"));
        } else {
          if (check) {
            if (alreadyExist(user[field], item)) {
              console.log("" + item + " already in user's " + field);
              return;
            } 
          }
          user[field].push(item);
          user.save(function (err) {
            if (err) {
              return console.error(err);
            } else {
              console.log('user saved');
            }
          });
        }
      });
  },

  updateArticlesTable: function(identifier, field, item, check) {
    console.log('updateArticlesTable called with ', identifier, field, item, check);
    var findArticle = Q.nbind(Article.findOne, Article);
    findArticle({_id: identifier})
      .then(function (article) {
        if (!article) {
          next(new Error("article does not exist"));
        } else {
          if (check) {
            if (alreadyExist(article[field], item)) {
              console.log("" + item + " already in article's " + field);
              return;
            }
          }
          article[field].push(item);
          article.save(function (err) {
            if (err) {
              return console.error(err);
            } else {
              console.log('article saved');
            }
          });
        }
      });
  },

  createNewArticle: function(url, tags) {
    // create new article
    console.log('createNewArticle called');
    var createArticle = Q.nbind(Article.create, Article);
    var date = dateGenerator();
    var articleId;
    var newArticle = {
      url: url,
      tags: tags,
      uploaders: [],
      dataloc: '0', // TODO file system
      date: date,
      comments: [],
      commentators: [],
      popularityIdx: 0,
      controversyIdx: 0
    };
    // save article into Articles table
    return createArticle(newArticle);
  },

  getArticleId: function(id) {
    var oid;
    var findArticle = Q.nbind(Article.findOne, Article);
    return findArticle({_id: id});
  }

};