angular.module('thesis.articles', [])

.controller('ArticlesCtrl', function ($scope, Articles, $filter) {

  // Articles.getArticleHTML();

  var orderBy = $filter('orderBy');

  $scope.order = function(predicate, reverse) {
    $scope.articles = orderBy($scope.articles, predicate);
  };

  $scope.getArticles = function() {
    Articles.getAll()
      .then(function (articles) {
        $scope.articles = articles;
        $scope.order('-popularityIdx',false);
      })
      .catch(function (error) {
        console.log("oops articles cannot be accessed");
      });
  };
  $scope.getArticles();
});