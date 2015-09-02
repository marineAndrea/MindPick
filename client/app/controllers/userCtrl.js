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
    // console.log('username',username);
    // console.log('adding article');
    $scope.article.uploader = username;
    console.log('scope', $scope.article);
    Articles.addArticle($scope.article)
      .then(function () {
        $location.path('/users/profile');
        $scope.article = null;
      })
      .catch(function (error) {
        console.error(error);
      });
  };
});