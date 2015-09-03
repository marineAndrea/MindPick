//TODO check signedin

var userController = require('./userController.js');

module.exports = function(app) { // app === userRouter injected from middlware.js
  app.post('/signin', userController.signin);
  app.post('/signup', userController.signup);
  app.get('/signedin', userController.checkAuth);
  // app.route('/')
  //   .get(userController.allUsers);
  app.route('/:username')
    .get(userController.getUserByUsername)
    .put(userController.updateUserArticles);
};
