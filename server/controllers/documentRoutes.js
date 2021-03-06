var documentController = require('./documentController.js');

module.exports = function(app) {
  app.route('/')
    .put(documentController.commentDocument);
  app.route('/:id')
    .get(documentController.websiteUrl);
};