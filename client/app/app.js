angular.module('MindPick', [
  'MindPick.services',
  'MindPick.articles',
  'MindPick.graph',
  'MindPick.document',
  'MindPick.user',
  'MindPick.auth',
  'ngRoute'
])

// see if ui-router better

.config(function($routeProvider, $httpProvider) { // check $httpProvider
  $routeProvider
    .when('/signin', {
      templateUrl: 'app/views/signin.html',
      controller: 'AuthCtrl'
    })
    .when('/signup', {
      templateUrl: 'app/views/signup.html',
      controller: 'AuthCtrl'
    })
    .when('/articles', {
      templateUrl: 'app/views/articles.html',
      controller: 'ArticlesCtrl'
    })
    .when('/graph', {
      templateUrl: 'app/views/graph.html',
      controller: 'GraphCtrl'
    })
    .when('/document/:id', {
      templateUrl: 'app/views/document.html',
      controller: 'DocumentCtrl'
    })
    .when('/users/profile', {
      templateUrl: 'app/views/user.html',
      controller: 'UserCtrl',
      authenticate: true
    })
    .otherwise({
      redirectTo: '/signin'
    });
})

.factory('AttachTokens', function ($window) {
  // this is an $httpInterceptor
  // its job is to stop all out going request
  // then look in local storage and find the user's token
  // then add it to the header so the server can validate the request
  var attach = {
    request: function (object) {
      var jwt = $window.localStorage.getItem('com.MindPick'); // change name
      if (jwt) {
        object.headers['x-access-token'] = jwt;
      }
      object.headers['Allow-Control-Allow-Origin'] = '*';
      return object;
    }
  };
  return attach;
})

.run(function ($rootScope, $location, Auth) {
  // here inside the run phase of angular, our services and controllers
  // have just been registered and our app is ready
  // however, we want to make sure the user is authorized
  // we listen for when angular is trying to change routes
  // when it does change routes, we then look for the token in localstorage
  // and send that token to the server to see if it is a real user or hasn't expired
  // if it's not valid, we then redirect back to signin/signup
  $rootScope.$on('$routeChangeStart', function (evt, next, current) {
    if (next.$$route && next.$$route.authenticate && !Auth.isAuth()) {
      $location.path('/signin');
    }
  });
});

//python -m SimpleHTTPServer