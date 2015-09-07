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
  date = monthNames[monthIndex] + " " + day + ", " + year;
  return date;
};


module.exports = {

  updateUsersTable: function(identifier, field, item, check, next) {
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
  },

  updateArticlesTable: function(identifier, field, item, check, next) {
    return Article.findOne({_id: identifier})
      .exec(function (err, article) {
        if (err) next(err); ///////////Error
        if (!article) {
          next(err); ///////////Error
        } else {
          if (check) {
            if (alreadyExist(article[field], item)) {
              console.log("" + item + " already in article's " + field);
              return article;
            }
          }
          article[field].push(item);
          return article.save();
        }
      });
  },


  /////////////////////////////   OTHER VERSION WITH Q.NBIND    ///////////////////////////

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


  createNewArticle: function(url, tags) {
    // create new article
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