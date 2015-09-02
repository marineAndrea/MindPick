var morgan = require('morgan');
var bodyParser = require('body-parser');

module.exports = function (app, express) {
  // routers config
  var userRouter = express.Router();
  var articleRouter = express.Router();

  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({extended: true})); // in order to get the data from a POST
  app.use(bodyParser.json());
  app.use(express.static(__dirname + '/../../client'));

  app.use('/api/users', userRouter); // use user router for all user request
  app.use('/api/articles', articleRouter); // user link router for link request
 
  // inject routers into their respective route files
  require('../controllers/userRoutes.js')(userRouter);
  require('../controllers/articleRoutes.js')(articleRouter);
};