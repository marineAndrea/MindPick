// TODO be consistent with $location.path;

angular.module('thesis.user', [])

.controller('UserCtrl', function ($scope, User, Articles, $location, $filter) {

  // DON"T NEED THIS ANYMORE, it is being called in GetUserArticles
  // $scope.getUserInfo = function() {
  //   User.getInfo()
  //     .then(function (info) {
  //       $scope.user = info;
  //       $scope.user.picture = $scope.user.picture || "https://upload.wikimedia.org/wikipedia/commons/9/9b/Social_Network_Analysis_Visualization.png";
  //     })
  //     .catch(function (error) {
  //       console.log("oops cannot get user's info");
  //     });
  // };
  // $scope.getUserInfo();

  $scope.article = {};
  $scope.uploadArticle = function() {
    var username = User.getUsername();
    $scope.article.username = username;
    var url = $scope.article.url;
    // var journal = url.parser.host;
    // console.log('***********************host', host);
    var tags = $scope.article.tags;
    if (url && tags) {
      Articles.addArticle($scope.article)
        .then(function() {
          $scope.article = null;
          // $location.path('/articles');
          $scope.getUserArticles();
        })
        .catch(function (error) {
          console.log("oops cannot upload article");
        });
    } else {
      alert("must provide both url and tags");
    }
  };
  
  $scope.articlesInMemory = [];
  $scope.checkUploaded = false;
  $scope.checkCommented = false;
  var orderBy = $filter('orderBy');

  $scope.order = function(predicate, reverse) {
    $scope.userArticles = orderBy($scope.articlesInMemory, predicate);
  };

  $scope.includeUploaded = function() {
    if (!$scope.checkUploaded) {
      $scope.checkUploaded = true;
      $scope.userArticles = [];
      if ($scope.checkCommented) {
        for (var i = 0; i < $scope.articlesInMemory.length; i++) {
          if ($scope.articlesInMemory[i].commented && $scope.articlesInMemory[i].uploaded) {
            $scope.userArticles.push($scope.articlesInMemory[i]);
          }
        }
      } else {
        for (var j = 0; j < $scope.articlesInMemory.length; j++) {
          if ($scope.articlesInMemory[j].uploaded) {
            $scope.userArticles.push($scope.articlesInMemory[j]);
          }
        }
      }
    } else {
      $scope.checkUploaded = false;
      if (!$scope.checkcommented) {
        $scope.userArticles = $scope.articlesInMemory;
      } else {
        $scope.userArticles = [];
        for (var k = 0; k < $scope.articlesInMemory.length; k++) {
          if ($scope.articlesInMemory[k].commented) {
            $scope.userArticles.push($scope.articlesInMemory[k]);
          }
        }
      }
    }
  };

  $scope.includeCommented = function() {
    if (!$scope.checkCommented) {
      $scope.checkCommented = true;
      $scope.userArticles = [];
      if ($scope.checkUploaded) {
        for (var i = 0; i < $scope.articlesInMemory.length; i++) {
          if ($scope.articlesInMemory[i].commented && $scope.articlesInMemory[i].uploaded) {
            $scope.userArticles.push($scope.articlesInMemory[i]);
          }
        }
      } else {
        for (var j = 0; j < $scope.articlesInMemory.length; j++) {
          if ($scope.articlesInMemory[j].commented) {
            $scope.userArticles.push($scope.articlesInMemory[j]);
          }
        }
      }
    } else {
      $scope.checkCommented = false;
      if (!$scope.checkUploaded) {
        $scope.userArticles = $scope.articlesInMemory;
      } else {
        $scope.userArticles = [];
        for (var k = 0; k < $scope.articlesInMemory.length; k++) {
          if ($scope.articlesInMemory[k].uploaded) {
            $scope.userArticles.push($scope.articlesInMemory[k]);
          }
        }
      }
    }
  };

  $scope.getUserArticles = function() {
    // get username and user's list of articlesId

    $scope.userArticles = [];
    User.getInfo()
      .then(function (userInfo) {
        $scope.user = userInfo;
        $scope.user.picture = $scope.user.picture || "https://upload.wikimedia.org/wikipedia/commons/9/9b/Social_Network_Analysis_Visualization.png";
      
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
                  articles[i].uploaded = (articles[i].uploaders.indexOf(username) !== -1) ? 1 : 0;
                  articles[i].commented = (articles[i].commentators.indexOf(username) !== -1) ? 1 : 0;
                  articles[i].userValence = User.getUserValence(articles[i], username);
                  articleValence = articles[i].controversy.valence;
                  articles[i].dissonance = User.getDissonance(articles[i].controversy.valence, articles[i].userValence); // returns true or false
                }
              }
            }
            $scope.articlesInMemory = $scope.userArticles;
          })
          .then(function () {
            $scope.order('-popularityIdx',false); // change to date but change date format first
          })
          .catch(function (error) {
            console.log("oops cannot get user's articles");
          });
      })
      .catch(function (error) {
        console.log("oops cannot get user's info");
      });
  };

  $scope.getUserArticles();

});