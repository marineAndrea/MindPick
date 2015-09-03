angular.module('thesis.user', [])

.controller('UserCtrl', function ($scope, User, Articles, $location) {
  $scope.getUserInfo = function() {
    User.getInfo()
      .then(function (info) {
        $scope.user = info;
        // console.log('$scope.user.username', $scope.user.username);
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
    var update = {'article': $scope.article.url};
    // User.updateArticles(update);
    // do not do that have the articles on profile updated by checking article table
  };
});