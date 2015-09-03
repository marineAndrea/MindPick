// TODO be consistent with sent err

var User = require('../models/userModel.js');
var Q = require('q');
var jwt = require('jwt-simple');

module.exports = {
  /*allUsers: function(req, res, next) {
  var findAll = Q.nbind(User.find, User);

  findAll({})
    .then(function (users) {
      res.json(users);
    })
    .fail(function (error) {
      next(error);
    });
  },*/

  getUserByUsername: function(req, res, next) {
    // console.log(req.params.username, 'req.params.username');
    var username = req.params.username;
    var findUser = Q.nbind(User.findOne, User);
    findUser({username: username})
     .then(function(user) {
      res.json(user);
     });
  },

  /*updateUserArticles: function(req, res, next) {
    // use update instead of save??
    console.log('updateUserArticles called');
    var username = req.params.username;
    var article = req.body.article;
    var findUser = Q.nbind(User.findOne, User);
    if (!username) {
      console.log('401');
      res.send(401);
    }
    findUser({username: username})
      .then(function (user) {
        if (!user) {
          next(new Error('User does not exist'));
        } else {
          user.articles.push(article);
          user.save(function (err, thing) {
            if (err) {
              return console.error(err);
            }
            res.json(thing);
          });
        }
      })
      .fail(function(error) {
        next(error);
      });
  },*/

  signin: function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var findUser = Q.nbind(User.findOne, User);
    findUser({username: username})
      .then(function (user) {
        if (!user) {
          next(new Error('User does not exist'));
        } else {
          return user.comparePasswords(password)
            .then(function (foundUser) {
              if (foundUser) {
                var token = jwt.encode(user, 'secret');
                res.json({token: token});
              } else {
                return next(new Error('No user'));
              }
            });
        }
      })
      .fail(function(error) {
        next(error);
      });
  },

  signup: function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var interests = req.body.interests;
    var picture = req.body.picture;
    var email = req.body.email;
    var create;
    var newUser;
    var findOne = Q.nbind(User.findOne, User);

    findOne({username: username})
      .then(function (user) {
        if (user) {
          next(new Error('User already exist!'));
        } else {
          create = Q.nbind(User.create, User);
          newUser = {
            username: username,
            password: password,
            interests: interests,
            picture: picture,
            email: email
          };
          return create(newUser);
        }
      })
      .then(function (user) {
        // create token to send back for auth
        var token = jwt.encode(user, 'secret');
        res.json({token: token});
      })
      .fail(function (error) {
        next(error);
      });
  },

  checkAuth: function (req, res, next) {
    var token = req.headers['x-access-token'];
    if (!token) {
      next(new Error('No token'));
    } else {
      var user = jwt.decode(token, 'secret');
      var findUser = Q.nbind(User.findOne, User);
      findUser({username: user.username})
        .then(function (foundUser) {
          if (foundUser) {
            res.send(200);
          } else {
            res.send(401);
          }
        })
        .fail(function (error) {
          next(error);
        });
    }
  }
};
