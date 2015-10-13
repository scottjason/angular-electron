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
  $scope.timer = '00:00:00';

  function init() {
   
    customerStore.on("child_added", function(snapshot, prevChildKey) {
        var customer = snapshot.val();
        if (customer) {
          $timeout(function() {
            console.log(customer)
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
        $scope.product = {};
        var product = snapshot.val();
        $scope.product.title = product.title;
        $scope.product.cost = product.cost;
        $scope.product.photo = product.photo;
        console.log('fittingRoom item added', product);
      },
      function(errorObject) {
        console.log("The read failed: " + errorObject.code);
      });

    fittingRoom.on("child_removed", function(snapshot) {
        $scope.product.title = "";
        $scope.product.cost = "";
        $scope.product.photo = "";
        console.log('fittingRoom item removed', product);
      },
      function(errorObject) {
        console.log("The read failed: " + errorObject.code);
      });


    likedItems.on("value", function(snapshot) {
        var likedItems = snapshot.val();
        console.log('liked item modified', likedItems)
      },
      function(errorObject) {
        console.log("The read failed: " + errorObject.code);
      });

    dislikedItems.on("value", function(snapshot) {
        var dislikedItems = snapshot.val();
        console.log('disliked item modified', dislikedItems)
      },
      function(errorObject) {
        console.log("The read failed: " + errorObject.code);
      });
  }

  init();

  LandingCtrl.$inject['$scope', '$rootScope', '$state', '$timeout', 'StateService'];
}
