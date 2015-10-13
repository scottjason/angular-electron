'use strict';

angular.module('app')
  .controller('LandingCtrl', LandingCtrl);

function LandingCtrl($scope, $rootScope, $state, $timeout, StateService) {

  var ipc = require('ipc');

  ipc.send('asynchronous-message', 'ping');

  var Firebase = require('firebase');
  var fittingRoom = new Firebase('https://retail-store-app.firebaseio.com/fitting-room/products');
  var customerStore = new Firebase('https://retail-store-app.firebaseio.com/customers');

  $scope.customers = [];

  function init() {
    fittingRoom.on("value", function(snapshot) {
        $scope.products = [];
        var products = snapshot.val();
        console.log('fittingRoom', products);
      },
      function(errorObject) {
        console.log("The read failed: " + errorObject.code);
      });

    customerStore.on("value", function(snapshot) {
        var customers = snapshot.val();
        console.log('customer modified', customers)
      },
      function(errorObject) {
        console.log("The read failed: " + errorObject.code);
      });
  }

  init();

  $scope.getRequests = function() {
    return StateService.data['Request'];
  }

  $scope.getState = function(key) {
    return StateService.data['Request'][key];
  };


  LandingCtrl.$inject['$scope', '$rootScope', '$state', '$timeout', 'StateService'];
}
