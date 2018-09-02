
var app = angular.module("myApp", ["ngRoute"]);
app.config(function($routeProvider) {
    $routeProvider
    .when("/:post", {
        templateUrl: function(params){return 'Posts/' + params.post +'.html';},
        controller : "postController",
    }).
    otherwise({
      redirectTo: '/'
    });
});

var viewCtrl =  app.controller("postController", function ($scope,$route) {
  console.log("FAFA")
  MathJax.Hub.Queue(["Typeset",MathJax.Hub]); // redo mathjax typesetting
});
