angular.module('thesis.document', [])

.controller('DocumentCtrl', function ($scope, Articles, User, $location, $sce) {
  
  // $scope.detailFrame= $sce.trustAsResourceUrl("http://www.bbc.com/news/world-middle-east-34226003");

  $scope.enableComment = false;
  $scope.toggleCommentArticle = function() {
    $scope.enableComment = !$scope.enableComment;
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

});