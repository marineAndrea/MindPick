angular.module('thesis.document', [])

.controller('DocumentCtrl', function ($scope, Articles, User, $filter, $location, $sce) {
  
  $scope.enableComment = false;
  $scope.toggleCommentArticle = function() {
    $scope.enableViewRelatedArticles = false;
    $scope.enableComment = !$scope.enableComment;
  };

  $scope.enableViewRelatedArticles = false;
  $scope.toggleRelatedArticles = function() {
    $scope.enableComment = false;
    $scope.enableViewRelatedArticles = !$scope.enableViewRelatedArticles;
  };

  $scope.getDocument = function() {
    var docId = $location.$$path.slice(10);
    Articles.getArticle(docId)
      .then(function (url) {
        $scope.website = $sce.trustAsResourceUrl(url);
      })
      .catch(function(err) {
        console.log("oops cannot get html");
      });
  };
  $scope.getDocument();

  $scope.comment = {};
  $scope.commentArticle = function() {    
    // send request only if an opinion or a source is provided
    if ($scope.comment.opinion || $scope.comment.source) {
      // if url but no tags or tags but no url provided alert user
      if ($scope.comment.source && !($scope.comment.source.url && $scope.comment.source.tags)) {
        alert("must provide both tags and url");
      } else {
        $scope.comment.articleId = $location.url().slice(10);
        // get username
        $scope.comment.username = User.getUsername();
        // send comment.opinion to server
        Articles.addComment($scope.comment)
          .then(function (articles) {
            $scope.comment = null;
            $location.path('/users/profile');
          })
          .catch(function(err) {
            console.log("oops cannot comment article");
          });
      }
    } else {
      alert("must provide an opinion or a related source");
    }
  };
  
  // $scope.checkSupporting = false;
  // $scope.checkUndermining = false;
  var orderBy = $filter('orderBy');

  $scope.order = function(predicate, reserve) {
    $scope.relatedArticles = orderBy($scope.relatedArticles, predicate);
  };

  $scope.includeSupporting = function() {
    if (!$scope.checkSupporting) {
      $scope.checkSupporting = true;
      $scope.relatedArticles = [];
      for (var i = 0; i < $scope.articlesInMemo.length; i++) {
        if ($scope.articlesInMemo[i].relationship === "supporting") {
          $scope.relatedArticles.push($scope.articlesInMemo[i]);
        }
      }
    } else {
      $scope.checkSupporting = false;
      $scope.relatedArticles = $scope.articlesInMemo;
    }
  };

  $scope.includeUndermining = function() {
    if (!$scope.checkUndermining) {
      $scope.checkUndermining = true;
      $scope.relatedArticles = [];
      for (var i = 0; i < $scope.articlesInMemo.length; i++) {
        if ($scope.articlesInMemo[i].relationship === "undermining") {
          $scope.relatedArticles.push($scope.articlesInMemo[i]);
        }
      }
    } else {
      $scope.checkUndermining = false;
      $scope.relatedArticles = $scope.articlesInMemo;
    }
  };

  $scope.getRelatedArticles = function() {
    var docId = $location.$$path.slice(10);
    Articles.getRelated(docId)
      .then(function (articles) {
        $scope.relatedArticles = articles;
        $scope.articlesInMemo = $scope.relatedArticles;
        $scope.order('-popularityIdx',false);
      })
      .catch(function (error) {
        console.log("oops articles cannot be accessed");
      });
  };
  $scope.getRelatedArticles();
});