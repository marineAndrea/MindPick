var Article = require('../models/articleModel.js');
var User = require('../models/userModel.js');
var Q = require('q');
var utils = require('./utils.js');

var getAllArticles = function() {
  var findAll = Q.nbind(Article.find, Article);
  return findAll({});
};

saveTable = function(table) {
  console.log('=============================================about to save table', table);
  var save = Q.nbind(table.save, table);
  return save();
};

var updateAllArticlesPopularity = function(idx, val) {
  var min, max;
  getAllArticles()
    .then(function (articles) {
      for (var i = 0; i < articles.length; i++) {
        if (idx === 0) {
          min = val;
          max = articles[i].minmaxComments[1];
        } else if (idx === 1) {
          max = val;
          min = articles[i].minmaxComments[0];
        }
        articles[i].minmaxComments = [min, max];
        articles[i].popularityIdx = getPopularity(articles[i], 10, 'wat');
        saveTable(articles[i]); // do not need to wait for this
      }
    });
  return;
};

var getPopularity = function(article, scale) {
  var nbComments = article.comments.length;
  var min = article.minmaxComments[0];
  var max = article.minmaxComments[1];
  return Math.round(1 + (((scale - 1) / (max - min)) * nbComments));
};

module.exports = {

  dateGenerator: function() {
    var date = new Date();
    var monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var month = monthIndex < 10 ? "0" + monthIndex : monthIndex;
    var year = date.getFullYear();
    // date = monthNames[monthIndex] + " " + day + ", " + year;
    date = "" + year + "-" +  month + "-" + day;
    return date;
  },  

  alreadyExist: function(arr, item) {
    return (arr.indexOf(item) !== -1);
  },

  createBelief: function(name, id, opin, src) {
    var belief = {
      username: name, // can remove this
      articleId: id,
      opinion: opin,
      source: src,
      // controversy: ctr, // otherwise need to update values for all users
      // populartityIdx: popIdx
    };
    return belief;
  },

  createComment: function(id, name, opin, src) {
    var comment = {
      articleId: id, // can remove this
      username: name,
      opinion: opin,
      source: src
    };
    return comment;
  },

  getPopularity: function(article, scale) {
    var nbComments = article.comments.length;
    var min = article.minmaxComments[0];
    var max = article.minmaxComments[1];
    return Math.round(1 + (((scale - 1) / (max - min)) * nbComments));
  },

  getControversy: function(article, scale) {
    // contr should not depend on contr of other articles (for the sake of time efficiency)
    var ctrObj = {};
    var nbSupported = 0;
    var nbOffBase = 0;
    var leastCtr, diff;
    for (var i = 0; i < article.comments.length; i++) {
      if (article.comments[i].opinion === "supported") {
        nbSupported++;
      } else if (article.comments[i].opinion === "notSupported") {
        nbOffBase++;
      }
    }
    leastCtr = (nbSupported + nbOffBase);
    diff = nbSupported - nbOffBase;
    ctrObj.idx = Math.round(1 + ((scale - 1) / leastCtr) * (leastCtr - Math.abs(diff)));
    if (diff > 0) {
      ctrObj.valence = 1;
    } else if (diff < 0) {
      ctrObj.valence = -1;
    } else if (diff === 0) {
      ctrObj.valence = 0;
    }
    return ctrObj;
  },


  articlesCheckOnUpload: function() {
    return getAllArticles()
      .then(function (articles) {
        if (articles.length === 0) {
          console.log('first article will be created');
          return [0, 0];
        /*} else {
          if (articles[0].minmaxComments[0] !== 0) {
            console.log('+++++++++++++++++++++++++min comments not 0');
            // min comments of all the articles has to be changed
            // update pop idx of all articles
            updateAllArticlesPopularity(0, 0);
          }*/
        } else {
          return [0, articles[0].minmaxComments[1]]; 
        }
      });
  },

  articlesCheckOnComment: function(article) {
    var newMax;
    if (article.comments.length > article.minmaxComments[1]) {
      newMax = article.comments.length;
      console.log('++++++++++++++++++++++++there is a new max', newMax);
      // max comments of all the articles has to be changed
      // update pop idx of all articles;
      updateAllArticlesPopularity(1, newMax);
    // }
    // or if > min, because this article could have the lowest min, in this case, by adding a comment, the min has to be updated to newMin
    // if it is also the only article then min has to be evaluated to new min as well
    // for now we can set the min to always be 0 (to avoid looping though all articles)
    // then remove check for min in upload
    // if (article.comments.length > article.minmaxComments[0]) {
    //   console.log('++++++++++++++++++++++++there may be a new min');
      // check all the articles length of comments and if they are all >= min then new min
      
    } else {
      newMax = article.minmaxComments[1];
    }
    return [article.minmaxComments[0], newMax];
  },

  averageOpinions: function(arr) { // an array of tuples
    // change opinion into values
    // look for duplicates
    var obj = {};
    for (var i = 0; i < arr.length; i++) {
      if (arr[i][1] === 'supported') {
        arr[i][1] = 1;
      } else if (arr[i][1] === 'notSupported') {
        arr[i][1] = -1;
      } else {
        arr[i][1] = 0;
      }
      obj[arr[i][0]] = (obj[arr[i][0]] || []).concat([arr[i][1]]);
    }
    // generate average opinion
    for (var key in obj) {
      var score = 0;
      var attr = "";
      if (obj[key].length > 1) {
        for (var j = 0; j < obj[key].length; j++) {
          score += obj[key][j];
        }
        obj[key] = score;
      } else {
        obj[key] = obj[key][0];
      }
    }
    // return an array with labels for opinions
    for (key in obj) {
      if (obj[key] >= 1) {
        obj[key] = "supporting";
      } else if (obj[key] <= -1) {
        obj[key] = "undermining";
      } else {
        obj[key] = "related";
      }
    }
    return obj;
  }
};