angular.module('MindPick.auth', [])

.controller('AuthCtrl', function ($scope, $window, $location, Auth) {
  $scope.user = {};
  
  if ($location.$$path !== "/signup") {
    Auth.signout();
  }

  $scope.signin = function () {
    // Auth.signout();
    Auth.signin($scope.user)
      .then(function (token) {
        $window.localStorage.setItem('com.MindPick', token);
        $window.localStorage.setItem('com.MindPick.username', $scope.user.username);
        $location.path('/users/profile');
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  $scope.signup = function () {
    Auth.signup($scope.user)
      .then(function (token) {
        $window.localStorage.setItem('com.MindPick', token);
        $window.localStorage.setItem('com.MindPick.username', $scope.user.username);
        $location.path('/users/profile');
      })
      .catch(function (error) {
        console.error(error);
      });
  };
});
