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
    // console.log('adding article');
    Articles.addArticle($scope.article)
      .then(function () {
        $location.path('/users/profile');
        $scope.article = null;
      })
      .catch(function (error) {
        console.error(error);
      });
      // add date, uploader to $scope.article
  };
});