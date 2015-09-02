angular.module('thesis.user', [])

.controller('UserCtrl', function ($scope, User) {
  $scope.getUserInfo = function() {
    User.getInfo()
      .then(function (info) {
        $scope.user = info;
        console.log('$scope.user.username', $scope.user.username);
      })
      .catch(function (error) {
        console.error(error);
      });
  };
  $scope.getUserInfo();
});