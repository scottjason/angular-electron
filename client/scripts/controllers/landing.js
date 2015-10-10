'use strict';

angular.module('app')
  .controller('LandingCtrl', LandingCtrl);

function LandingCtrl($scope, $rootScope, $state, $timeout) {

  var os = require('os');

  console.log(os.platform());

  $scope.fadeInWelcome = true;





  LandingCtrl.$inject['$scope', '$rootScope', '$state', '$timeout'];
}
