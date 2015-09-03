angular.module('thesis.articles', [])

.controller('ArticlesCtrl', function ($scope, Articles) {

  $scope.getArticles = function() {
    Articles.getAll()
      .then(function (articles) {
        $scope.articles = articles;
      })
      .catch(function (error) {
        console.error(error);
      });
  };
  $scope.getArticles();
});