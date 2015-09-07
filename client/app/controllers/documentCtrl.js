angular.module('thesis.document', [])

.controller('DocumentCtrl', function ($scope, Articles, User, $location) {
  
  $scope.enableComment = false;
  $scope.toggleCommentArticle = function() {
    $scope.enableComment = !$scope.enableComment;
  };

  $scope.comment = {};
  $scope.commentArticle = function() {    
    // send request only if an opinion or a source is provided
    if ($scope.comment.opinion || $scope.comment.source) {
      // if url but no tags or tags but no url provided alert user
      if ($scope.comment.source && !($scope.comment.source.url && $scope.comment.source.tags)) {
        alert('must provide both tags and url');
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
      alert('must provide an opinion or a related source');
    }
  };

});