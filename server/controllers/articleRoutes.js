var articleController = require('./articleController.js');

module.exports = function(app) { // app === articleRouter injected from middleware.js
  app.route('/')
    .get(articleController.allArticles)
    .post(articleController.newArticle);
};