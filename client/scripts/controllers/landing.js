'use strict';

angular.module('app')
  .controller('LandingCtrl', LandingCtrl);

function LandingCtrl($scope, $timeout, RecommendationService, $firebaseArray) {

  var Firebase = require('firebase');
  var fittingRoom = {};

  var allProducts = new Firebase('https://retail-store-app.firebaseio.com/products');
  allProducts = $firebaseArray(allProducts);

  fittingRoom.products = new Firebase('https://retail-store-app.firebaseio.com/fitting-room/products');
  fittingRoom.recommendations = new Firebase('https://retail-store-app.firebaseio.com/fitting-room/recommendations');

  var customerStore = new Firebase('https://retail-store-app.firebaseio.com/customers');
  var likedItems = new Firebase('https://retail-store-app.firebaseio.com/fitting-room/liked-items');
  var dislikedItems = new Firebase('https://retail-store-app.firebaseio.com/fitting-room/disliked-items');

  $scope.customer = {};
  $scope.product = {};

  var bindListeners = function() {

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

    fittingRoom.products.on("child_added", function(snapshot) {
        $timeout(function() {
          var product = snapshot.val();
          $scope.product.title = product.title;
          $scope.product.cost = product.cost;
          $scope.product.photo = product.photo;
          console.log('fittingRoom products.item added', product);
        });
      },
      function(errorObject) {
        console.log("The read failed: " + errorObject.code);
      });

    fittingRoom.products.on("child_removed", function(snapshot) {
        $scope.product.isLiked = false;
        $scope.product.isDisliked = false;
        $scope.product.title = "";
        $scope.product.cost = "";
        $scope.product.photo = "";
        console.log('fittingRoom products.item removed');
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

  bindListeners();

  $scope.sendRecommendation = function(selectedProduct) {
    RecommendationService.send(selectedProduct, fittingRoom, allProducts, function(isSent, isPriceBased) {
      if (isSent) {
        if (!isPriceBased) {
          console.log('Recommendation sent, previous association');
        } else {
          console.log('Recommendation sent, price-Based');
        }
      }
    });
  };


  LandingCtrl.$inject['$scope', '$timeout', 'RecommendationService', '$firebaseArray'];
}
