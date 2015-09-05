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
    var url = $scope.article.url;
    var alreadyUploaded = false;
    var articleId;
    // check if article already in db
    Articles.getAll()
      .then(function (articles) {
        for (var i = 0; i < articles.length; i++) {
          if (articles[i].url === url) {
            alreadyUploaded = true;
            articleId = articles[i]._id; // why as opposed to articleController l53 returns 2q33523454 intead of {"oid: 3456435756474"}?!!
          }
        }
        // add article only if not in db
        if (!alreadyUploaded) {
          $scope.article.uploader = username;
          Articles.addArticle($scope.article)
            .then(function () {
              // $location.path('/users/profile'); redirect to document?
              $scope.article = null;
            })
            .catch(function (error) {
              console.error(error);
            });
        } else {
          // message user that article already in database
          // update article by adding username to uploaders
          Articles.addUploader(username, articleId)
            .then(function () {
              $scope.article = null;
            })
            .catch(function (error) {
              console.error(error);
            });
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  $scope.getUploadedArticles = function() {
    var uploaded, commented, username;
    $scope.articlesInfo = [];
    // get user's articles' ids
    User.getInfo()
      .then(function (info) {
        username = info.username;
        $scope.articlesIds = info.articles;
        // get all articles
        Articles.getAll()
        // then select only the ones that correspond to user's
        .then(function (articles) {
          for (var i = 0; i < articles.length; i++) {
            if ($scope.articlesIds.indexOf(articles[i]._id) !== -1) {
              // see if uploader
              uploaded = (articles[i].uploader === username);
              articles[i].uploaded = uploaded ? 'yes' : 'no';
              // see if commentator
              commented = (articles[i].commentators.indexOf(username) !== -1);
              articles[i].commented = commented ? 'yes' : 'no';
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

});