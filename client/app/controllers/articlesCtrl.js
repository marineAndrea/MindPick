angular.module('thesis.articles', [])

.controller('ArticlesCtrl', function ($scope, Articles) {

  // Articles.getArticleHTML();
  $scope.getArticles = function() {
    Articles.getAll()
      .then(function (articles) {
        $scope.articles = articles;
      })
      .catch(function (error) {
        console.log("oops articles cannot be accessed");
      });
  };
  $scope.getArticles();
});