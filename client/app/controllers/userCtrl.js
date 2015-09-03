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

  $scope.getUploadedArticles = function() {
    $scope.articlesInfo = [];
    // get user's articles' ids
    User.getInfo()
      .then(function (info) {
        $scope.articlesIds = info.articles;
        // get all articles
        Articles.getAll()
        // then select only the ones that correspond to user's
        .then(function (articles) {
          for (var i = 0; i < articles.length; i++) {
            if ($scope.articlesIds.indexOf(articles[i]._id) !== -1) {
              $scope.articlesInfo.push(articles[i]);
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
  $scope.getUploadedArticles();
  
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