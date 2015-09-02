var express = require('express');
var mongoose = require('mongoose');

var app = express();

// connects to database
mongoose.connect('marine:marine@ds035723.mongolab.com:35723/articles');

// configure our server with all the middleware and and routing
require('./config/middleware.js')(app, express);

// starts the server
app.listen(8000);
console.log('listening on port ' + 8000);

