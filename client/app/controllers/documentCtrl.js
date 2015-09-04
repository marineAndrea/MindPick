angular.module('thesis.document', [])

.controller('DocumentCtrl', function ($scope, Articles, $location) {
  
  $scope.enableComment = false;
  $scope.toggleCommentArticle = function() {
    $scope.enableComment = !$scope.enableComment;
  };

  $scope.comment = {};
  $scope.commentArticle = function() {
    // get article ID
    var articleId = "55e8a844e5f7b20000000006";
    $scope.comment.articleId = articleId;

    // add comment to article's comments in db with comment.opinion
    
    Articles.addComment($scope.comment)
      .then(function (articles) {
        $location.path('/document');
        $scope.article = null;
      })
      .catch(function(err) {
        console.error(err);
      });


    // create new article with comment.source
  };

});