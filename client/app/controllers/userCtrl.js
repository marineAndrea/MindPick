// TODO be consistent with $location.path;
// Maybe refactor

angular.module('thesis.user', [])

.controller('UserCtrl', function ($scope, User, Articles, $location) {
  $scope.getUserInfo = function() {
    User.getInfo()
      .then(function (info) {
        $scope.user = info;
      })
      .catch(function (error) {
        console.error(error);
      });
  };
  $scope.getUserInfo();

  $scope.article = {};
  
  $scope.uploadArticle = function() {
    var username = User.getUsername();
    $scope.article.username = username;
    var url = $scope.article.url;
    var tags = $scope.article.tags;
    if (url && tags) {
      Articles.uploadArticle($scope.article)
        .then(function() {
          $scope.article = null;
        })
        .catch(function (error) { // catch vs fail?
          console.error(error);
        });
    } else {
      alert('must provide both url and tags');
    }
  };

  $scope.getUserdArticles = function() {
    // get username and user's list of articlesId
    $scope.userArticles = [];
    User.getInfo()
      .then(function (userInfo) {
        var username = userInfo.username;
        var userArticles = userInfo.articles;
        // get all articles
        Articles.getAll()
          .then(function (articles) {
            // for each article
            for (var i = 0; i < articles.length; i++) {
              // check if id in userArticles
              if (userArticles.indexOf(articles[i]._id) !== -1) {
              // if so
                // check if username is in article uploaders or in article commentators
                if ((articles[i].uploaders.indexOf(username) !== -1) || (articles[i].commentators.indexOf(username) !== -1)) {
                // if so
                  // push to userArticles
                  $scope.userArticles.push(articles[i]);
                  articles[i].uploaded = (articles[i].uploaders.indexOf(username) !== -1) ? 'yes' : 'no';
                  articles[i].commented = (articles[i].commentators.indexOf(username) !== -1) ? 'yes' : 'no';
                }
              }
            }
          })
          .catch(function (error) {
            console.error(error);
          });
      })
      .catch(function (error) {
        console.error(error);
      });
  };
  $scope.getUserdArticles();
});