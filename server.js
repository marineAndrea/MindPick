// PACKAGES
// =============================================================================
// call the packages we need
var express = require('express'); // call express
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Bear = require('./app/models/bear');


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

// on routes that end in /bears
// -----------------------------------------------------------------------------
router.route('/bears') // to handle multiple routes for the same URI
  // create a bear 
  // accessed at POST http://localhost:8080/api/bears
  .post(function(req, res) {      
    var bear = new Bear();
    bear.name = req.body.name; // set the bears name (comes from the request)
    bear.save(function(err) {
      if (err) {
        res.send(err);
      }
      res.json({ message: 'Bear created!' });
    });
  })

  // get all the bears
  // accessed at GET http://localhost:8080/api/bears
  .get(function(req, res) {
    Bear.find(function(err, bears) {
      if (err) {
        res.send(err);
      }
      res.json(bears);
    });
  });

router.route('/bears/:bear_id')
  // get the bear with that id 
  // accessed at GET http://localhost:8080/api/bears/:bear_id
  .get(function(req, res) {
    Bear.findById(req.params.bear_id, function(err, bear) {
      if (err) {
        res.send(err);
      }
      res.json(bear);
    });
  })

  // update the bear with this id 
  // accessed at PUT http://localhost:8080/api/bears/:bear_id
  .put(function(req, res) {
    Bear.findById(req.params.bear_id, function(err, bear) {
      if (err) {
        res.send(err);
      }
      bear.name = req.body.name;
      bear.save(function(err) {
        if (err) {
          res.send(err);
        }
        res.json({ message: 'Bear updated!' });
      });
    });  
  })

  // delete the bear with this id 
  // accessed at DELETE http://localhost:8080/api/bears/:bear_id
  .delete(function(req, res) {
    Bear.remove ({
      _id: req.params.bear_id
    }, function(err, bear) {
      if (err) {
        res.send(err);
      }
      res.json({ message: 'Successfully deleted' });
    });
  });


// REGISTER ROUTES -------------------------------------------------------------
// all routes will be prefixed with /api
app.use('/api', router);


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);

