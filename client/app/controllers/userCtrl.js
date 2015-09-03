// TODO be consistent with $location.path;

angular.module('thesis.user', [])

.controller('UserCtrl', function ($scope, User, Articles, $location) {
  $scope.getUserInfo = function() {
    User.getInfo()
      .then(function (info) {
        $scope.user = info;
        console.log('$scope.user', $scope.user);
      })
      .catch(function (error) {
        console.error(error);
      });
  };
  $scope.getUserInfo();

  $scope.article = {};
  $scope.addArticle = function() {
    var username = User.getUsername();
    $scope.article.uploader = username;
    Articles.addArticle($scope.article)
      .then(function () {
        $location.path('/users/profile');
        $scope.article = null;
      })
      .catch(function (error) {
        console.error(error);
      });
    // var update = {'article': $scope.article.url};
    // User.updateArticles(update);
    // do not do that have the articles on profile updated by checking article table
  };
  
  
  /*$scope.getUploadedArticles = function() {
    User.getArticles()
      .then(function (articles) {
        $scope.articles = articles;
        console.log('$scope.articles', $scope.articles);
      })
      .catch(function (error) {
        console.error(error);
      });
  };*/

});