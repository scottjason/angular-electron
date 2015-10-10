'use strict';

angular.module('app')
  .controller('LandingCtrl', LandingCtrl);

function LandingCtrl($scope, $rootScope, $state, $timeout) {

	console.log("LandingCtrl init");

  
  LandingCtrl.$inject['$scope', '$rootScope', '$state', '$timeout'];
}