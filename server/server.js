var express = require('express');
var mongoose = require('mongoose');

var app = express();

// connects to database
mongoose.connect(process.env.MONGO_LAB_CONNECTION_STRING, function(error) {
  if (error) {
    console.log('err', error);
  }
});

// configure our server with all the middleware and and routing
require('./config/middleware.js')(app, express);

// starts the server
// app.listen(8000);
// console.log('listening on port ' + 8000);
app.listen(process.env.PORT || 8000);