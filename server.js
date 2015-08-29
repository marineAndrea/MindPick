// PACKAGES
// =============================================================================
// call the packages we need
var express = require('express'); // call express
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var User = require('./app/models/user');
var Article = require('./app/models/article');


// SET-UP
// =============================================================================
var app = express();

// configure app to use bodyParser() in order to get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

// connects to database
mongoose.connect('marine:marine@ds035723.mongolab.com:35723/articles');


// API ROUTES
// =============================================================================
var router = express.Router(); // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
  // do logging
  console.log('Something is happening.');
  next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working
// accessed at GET http://localhost:8080/api
router.get('/', function(req, res) {
    res.json({ message: 'Welcome!' });   
});

// on routes that end in /user
// -----------------------------------------------------------------------------
router.route('/users') // to handle multiple routes for the same URI
  // create a user
  // accessed at POST http://localhost:8080/api/users
  .post(function(req, res) {      
    var user = new User();
    user.name = req.body.name;
    user.password = req.body.password;
    user.interests = req.body.interests;
    user.picture = req.body.picture;
    user.email = req.body.email;
    user.articles = req.body.articles;
    user.save(function(err) {
      if (err) {
        res.send(err);
      }
      res.json({ message: 'User created!' });
    });
  })

  // get all the users
  // accessed at GET http://localhost:8080/api/users
  .get(function(req, res) {
    User.find(function(err, users) {
      if (err) {
        res.send(err);
      }
      res.json(users);
    });
  });

router.route('/users/:user_id')
  // get the user with that id 
  // accessed at GET http://localhost:8080/api/users/:user_id
  .get(function(req, res) {
    User.findById(req.params.user_id, function(err, user) {
      if (err) {
        res.send(err);
      }
      res.json(user);
    });
  })

  // update the user with this id 
  // accessed at PUT http://localhost:8080/api/users/:user_id
  .put(function(req, res) {
    User.findById(req.params.user_id, function(err, user) {
      if (err) {
        res.send(err);
      }
      user.name = req.body.name;
      user.password = req.body.password;
      user.interests = req.body.interests;
      user.picture = req.body.picture;
      user.email = req.body.email;
      user.articles = req.body.articles;
      user.save(function(err) {
        if (err) {
          res.send(err);
        }
        res.json({ message: 'User updated!' });
      });
    });  
  })

  // delete the user with this id 
  // accessed at DELETE http://localhost:8080/api/user/:user_id
  .delete(function(req, res) {
    User.remove ({
      _id: req.params.user_id
    }, function(err, user) {
      if (err) {
        res.send(err);
      }
      res.json({ message: 'User successfully deleted' });
    });
  });

// on routes that end in /articles
// -----------------------------------------------------------------------------
router.route('/articles') // to handle multiple routes for the same URI
  // create an article
  // accessed at POST http://localhost:8080/api/articles
  .post(function(req, res) {      
    var article = new Article();
    article.url = req.body.url;
    article.tags = req.body.tags;
    article.uploader = req.body.uploader;
    article.dataloc = req.body.dataloc;
    article.date = req.body.date;
    article.comments = req.body.comments;
    article.commentators = req.body.commentators;
    article.popularityIdx = req.body.popularityIdx;
    article.controversyIdx = req.body.controversyIdx;
    article.save(function(err) {
      if (err) {
        res.send(err);
      }
      res.json({ message: 'Article created!' });
    });
  })

  // get all the articles
  // accessed at GET http://localhost:8080/api/articles
  .get(function(req, res) {
    Article.find(function(err, articles) {
      if (err) {
        res.send(err);
      }
      res.json(articles);
    });
  });

router.route('/articles/:article_id')
  // get the article with that id 
  // accessed at GET http://localhost:8080/api/articles/:article_id
  .get(function(req, res) {
    Article.findById(req.params.article_id, function(err, article) {
      if (err) {
        res.send(err);
      }
      res.json(article);
    });
  })

  // update the article with this id 
  // accessed at PUT http://localhost:8080/api/articles/:article_id
  .put(function(req, res) {
    Article.findById(req.params.article_id, function(err, article) {
      if (err) {
        res.send(err);
      }
      article.url = req.body.url;
      article.tags = req.body.tags;
      article.uploader = req.body.uploader;
      article.dataloc = req.body.dataloc;
      article.date = req.body.date;
      article.comments = req.body.comments;
      article.commentators = req.body.commentators;
      article.popularityIdx = req.body.popularityIdx;
      article.controversyIdx = req.body.controversyIdx;
      article.save(function(err) {
        if (err) {
          res.send(err);
        }
        res.json({ message: 'Article updated!' });
      });
    });  
  })

  // delete the article with this id 
  // accessed at DELETE http://localhost:8080/api/articles/:article_id
  .delete(function(req, res) {
    Article.remove ({
      _id: req.params.article_id
    }, function(err, article) {
      if (err) {
        res.send(err);
      }
      res.json({ message: 'Article successfully deleted' });
    });
  });



// REGISTER ROUTES -------------------------------------------------------------
// all routes will be prefixed with /api
app.use('/api', router);


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);

