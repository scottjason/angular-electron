'use strict';

angular.module('app')
  .controller('LandingCtrl', LandingCtrl);

function LandingCtrl($scope, $rootScope, $state, $timeout, StateService) {

  var Firebase = require('firebase');
  var fittingRoom = new Firebase('https://retail-store-app.firebaseio.com/fitting-room/products');
  var customerStore = new Firebase('https://retail-store-app.firebaseio.com/customers');
  var likedItems = new Firebase('https://retail-store-app.firebaseio.com/fitting-room/liked-items');
  var dislikedItems = new Firebase('https://retail-store-app.firebaseio.com/fitting-room/disliked-items');

  $scope.customer = {};
  $scope.product = {};
  $scope.timer = '00:00:00';

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
        $scope.stopTimer = false;
        setInterval(runTimer, 1000);
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
        $scope.stopTimer = true;
        $scope.product.isLiked = false;
        $scope.product.isDisliked = false;
        $scope.timer = '00:00:00';
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

  var totalSeconds = 0;

  function runTimer() {
    if (!$scope.stopTimer) {
      ++totalSeconds;
      var hours = "00";
      var seconds = padVal(totalSeconds % 60);
      var minutes = padVal(parseInt(totalSeconds / 60));
      $timeout(function() {
        $scope.timer = hours + ":" + minutes + ":" + seconds;
      });
    }
  }

  function padVal(val) {
    var valString = val + "";
    if (valString.length < 2) {
      return "0" + valString;
    } else {
      return valString;
    }
  }

  LandingCtrl.$inject['$scope', '$rootScope', '$state', '$timeout', 'StateService'];
}
