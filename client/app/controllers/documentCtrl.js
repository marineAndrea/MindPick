angular.module('thesis.document', [])

.controller('DocumentCtrl', function ($scope, Articles, User, $location) {
  
  $scope.enableComment = false;
  $scope.toggleCommentArticle = function() {
    $scope.enableComment = !$scope.enableComment;
  };

  $scope.comment = {};
  $scope.commentArticle = function() {
    // get article ID
    var articleId = $location.url().slice(10);
    $scope.comment.articleId = articleId;
    // get username
    var username = User.getUsername();
    $scope.comment.username = username;
    // send comment.opinion to server
    Articles.addComment($scope.comment)
      .then(function (articles) {
        $scope.comment = null;
      })
      .catch(function(err) {
        console.error(err);
      });


    // create new article with comment.source
  };

});