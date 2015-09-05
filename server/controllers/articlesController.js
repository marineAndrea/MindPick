// TODO be consistent with sent err
// if (err) return console.error(err) ?

var Article = require('../models/articleModel.js');
var User = require('../models/userModel.js');
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
    // TODO check if valid url
    var tags = req.body.tags;
    var uploader = req.body.uploader;

    var date = new Date();
    var monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    date = monthNames[monthIndex] + ' ' + day + ', ' + year;

    // create new article
    var createArticle = Q.nbind(Article.create, Article);
    // TODO check if article already exist
    var newArticle = {
      url: url,
      tags: tags,
      uploaders: [uploader],
      dataloc: '0', // TODO file system
      date: date,
      comments: [],
      commentators: [],
      popularityIdx: 0,
      controversyIdx: 0
    };
    // save article into Articles table
    createArticle(newArticle)
      // then get article's ID and uploader's username
      .then(function (createdArticle) {
        var id = createdArticle._id;
        var uploader = createdArticle.uploaders[0];
        // and save article's ID into Users table
        var findUser = Q.nbind(User.findOne, User);
        findUser({username: uploader})
          .then(function (user) {
            if (!user) {
              next(new Error('User does not exist'));
            } else {
              // console.log('id', id);
              user.articles.push(id);
              user.save(function (err, id) {
                if (err) {
                  return console.error(err);
                } else {
                  res.json(id);
                }
              });
            }
          })
          .fail (function (error) {
            next(error);
          });
        if (createdArticle) {
          res.json(createdArticle);
        }
      })
      .fail(function (error) {
        next(error);
      });
  },

  updateUploaders: function(req, res, next) {
    var uploader = req.body.uploader;
    var articleId = req.body.articleId;
    
    var findArticle = Q.nbind(Article.findOne, Article);
    
    findArticle({_id: articleId})
      .then(function (article) {
        // add username to article uploaders if not present already
        if (article.uploaders.indexOf(uploader) === -1) {
          article.uploaders.push(uploader);
          article.save(function (err, uploader) {
            if (err) {
              return console.error(err);
            } else {
              res.json(uploader);
            }
          });
        } else {
          // do not push
          // alert user that he has already uploaded the article
          console.log('uploader already in article table');
        }

        // add article ID to user db
        var findUser = Q.nbind(User.findOne, User);
        findUser({username: uploader})
          .then(function (user) {
            if (!user) {
              next(new Error('User does not exist'));
            } else {
              // if article not already there
              if (user.articles.indexOf(articleId) === -1) {
                user.articles.push(articleId); // pushing just id instead of {oid: 2342345}
                user.save(function (err, id) {
                  if (err) {
                    return console.error(err);
                  } else {
                    res.json(id);
                  }
                });
              } else {
                // do not push
                // alert user that he has already uploaded the article
                console.log('user has already uploaded this article');
              } 
            }
          })
          .fail (function (error) {
            next(error);
          });
      })
      .fail (function (error) {
        next(error);
      });
  }

};


