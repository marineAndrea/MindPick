angular.module('MindPick.services', [])

.factory('Articles', function ($http) { 
  var addArticle = function(article) {
    return $http({
      method: 'POST',
      url: '/api/articles',
      data: article
    });
  };

  // var getArticleHTML = function (url) {
  //   return $http({
  //     method: 'GET',
  //     url: 'http://localhost:8000/api/html',
  //   })
  //   .then (function(resp) {
  //     console.log(resp);
  //   });
  // };

  var getAll = function() {
    return $http({
      method: 'GET',
      url: '/api/articles'
    })
    .then(function (resp) {
      return resp.data;
    });
  };

  var getRelated = function(id) {
    return $http({
      method: 'GET',
      url: '/api/articles/' + id,
    })
    .then(function (resp) {
      return resp.data;
    });
  };

  var getArticle = function(id) {
    return $http({
      method: 'GET',
      url: '/api/document/' + id,
    })
    .then(function (resp) {
      return resp.data;
    });
  };

  var addComment = function(comment) {
    return $http({
      method:'PUT',
      url: 'api/document',
      data: comment
    });
  };

  return {
    addArticle: addArticle,
    getAll: getAll,
    addComment: addComment,
    getArticle: getArticle,
    getRelated: getRelated
    // getArticleHTML: getArticleHTML
  };
})

.factory('User', function ($http, $window) {
  var getUsername = function() {
    return $window.localStorage.getItem('com.MindPick.username'); // || User?
  };

  var getDissonance = function(articleValence, userValence) {
    return +(userValence * articleValence === -1);
  };
  
  var getUserValence = function(article, name) {
    var opinion = 0;
    var comment;
    for (var i = 0; i < article.comments.length; i++) {
      comment = article.comments[i];
      if (comment.username === name) {
        if (comment.opinion === "supported") {
          opinion += 1;
        } else if (comment.opinion === "notSupported") {
          opinion -= 1;
        }
      }
    }
    if (opinion > 0) {
      return 1;
    } else if (opinion < 0) {
      return -1;
    } else {
      return 0;
    }
    // return opinion > 0 ? 1 : -1;
  };

  var getInfo = function() {
    var username = getUsername();
    return $http({
      method: 'GET',
      url: '/api/users/' + username,
    })
    .then(function (resp) {
      return resp.data;
    });
  };

  return {
    getUsername: getUsername,
    getInfo: getInfo,
    getDissonance : getDissonance,
    getUserValence: getUserValence
  };
})

.factory('Auth', function ($http, $location, $window) {
  // exchanges the user's username and password for a JWT from the server
  // that JWT is then stored in localStorage as 'com.app'
  var signin = function(user) {
    return $http({
      method: 'POST',
      url: '/api/users/signin',
      data: user
    })
    .then(function (resp) {
      return resp.data.token;
    });
  };

  var signup = function(user) {
    return $http({
      method: 'POST',
      url: '/api/users/signup',
      data: user
    })
    .then(function (resp) {
      return resp.data.token;
    });
  };

  var isAuth = function() {
    return !!$window.localStorage.getItem('com.MindPick');
  };

  var signout = function() {
    $window.localStorage.removeItem('com.MindPick');
    $window.localStorage.removeItem('com.MindPick.username');
    $location.path('/signin');
  };

  return {
    signin: signin,
    signup: signup,
    isAuth: isAuth,
    signout: signout
  };
});