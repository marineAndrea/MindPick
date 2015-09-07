var articlesController = require('./articlesController.js');

module.exports = function(app) { // app === articlesRouter injected from middleware.js
  app.route('/')
    .get(articlesController.allArticles)
    .post(articlesController.uploadArticle);
};