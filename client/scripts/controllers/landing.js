'use strict';

angular.module('app')
  .controller('LandingCtrl', LandingCtrl);

function LandingCtrl($scope, $rootScope, $state, $timeout, $firebaseArray, StateService) {

  var Firebase = require('firebase');
  var allProducts = new Firebase('https://retail-store-app.firebaseio.com/products');
  allProducts = $firebaseArray(allProducts);
  var fittingRoom = new Firebase('https://retail-store-app.firebaseio.com/fitting-room/products');
  var customerStore = new Firebase('https://retail-store-app.firebaseio.com/customers');
  var likedItems = new Firebase('https://retail-store-app.firebaseio.com/fitting-room/liked-items');
  var dislikedItems = new Firebase('https://retail-store-app.firebaseio.com/fitting-room/disliked-items');
  var recommendations = new Firebase('https://retail-store-app.firebaseio.com/fitting-room/recommendations');

  $scope.customer = {};
  $scope.product = {};

  function init() {

    console.log('### init');

    customerStore.on("child_added", function(snapshot, prevChildKey) {
        var customer = snapshot.val();
        if (customer) {
          $timeout(function() {
            $scope.customer.name = customer.name;
          });
        }
        console.log('customer added', $scope.customer);
      },
      function(errorObject) {
        console.log("The read failed: " + errorObject.code);
      });

    customerStore.on("child_removed", function(snapshot, prevChildKey) {
        $timeout(function() {
          $scope.customer.name = '';
        });
        console.log('customer removed', $scope.customer);
      },
      function(errorObject) {
        console.log("The read failed: " + errorObject.code);
      });

    fittingRoom.on("child_added", function(snapshot) {
        $timeout(function() {
          var product = snapshot.val();
          $scope.product.title = product.title;
          $scope.product.cost = product.cost;
          $scope.product.photo = product.photo;
          console.log('fittingRoom item added', product);
        });
      },
      function(errorObject) {
        console.log("The read failed: " + errorObject.code);
      });

    fittingRoom.on("child_removed", function(snapshot) {
        $scope.product.isLiked = false;
        $scope.product.isDisliked = false;
        $scope.product.title = "";
        $scope.product.cost = "";
        $scope.product.photo = "";
        console.log('fittingRoom item removed');
      },
      function(errorObject) {
        console.log("The read failed: " + errorObject.code);
      });

    likedItems.on("value", function(snapshot) {
        if (snapshot.val()) {
          $timeout(function() {
            $scope.product.isLiked = true;
          });
        }
        console.log('liked item modified');
      },
      function(errorObject) {
        console.log("The read failed: " + errorObject.code);
      });

    dislikedItems.on("value", function(snapshot) {
        if (snapshot.val()) {
          $timeout(function() {
            $scope.product.isDisliked = true;
          });
        }
        console.log('disliked item modified');
      },
      function(errorObject) {
        console.log("The read failed: " + errorObject.code);
      });
  }

  init();

  $scope.sendRecommendation = function(selectedProduct) {

    var foundMatch = false;
    var bestMatch = {}
    var highestScore = 0;

    var targetTitle = selectedProduct.title;
    var targetPrice = parseInt(selectedProduct.cost.split('$')[1]);

    var ref = new Firebase('https://retail-store-app.firebaseio.com/recommendations');

    // first see if there's already an association, if not send the recommendation based on price, plus or minus $20 range
    ref.once("value", function(snapshot) {
        var obj = snapshot.val();
        angular.forEach(obj, function(incoming, key) {

          console.log(incoming.firstShownName, targetTitle);

          var isMatch = (targetTitle === incoming.firstShownName);
          var isHighestScore = (incoming.score >= highestScore);

          if (isMatch && isHighestScore) {
            foundMatch = true;
            bestMatch.title = incoming.recommendedName;
            highestScore = incoming.score;
          }
        });

        if (foundMatch) {
          console.log('foundMatch', bestMatch);
          bestMatch.firstShown = {};
          bestMatch.firstShown.title = targetTitle;
          recommendations.push(bestMatch);
          console.log('found a previously associated recommendation', bestMatch);

        } else {

          for (var i = 0; i < allProducts.length; i++) {

            var incomingPrice = parseInt(selectedProduct.cost.split('$')[1]);
            var diffInPrice = (targetPrice - incomingPrice);
            diffInPrice = (diffInPrice > 0) ? diffInPrice : (diffInPrice * -1);

            if (diffInPrice <= 20 && targetTitle !== allProducts[i].title) {
              console.log('found price-based recommendation', allProducts[i]);
              delete allProducts[i].$id;
              delete allProducts[i].$priority;
              allProducts[i].firstShown = {};
              allProducts[i].firstShown.title = targetTitle;
              recommendations.push(allProducts[i]);
              break;
            }
          }
        }
      },
      function(errorObject) {
        console.log("The read failed: " + errorObject.code);
      });
  };


  LandingCtrl.$inject['$scope', '$rootScope', '$state', '$timeout', '$firebaseArray', 'StateService'];
}
