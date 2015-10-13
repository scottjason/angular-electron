angular.module('app', ['ui.router', 'firebase'])

.config(function($stateProvider, $locationProvider, $urlRouterProvider) {
  $stateProvider
    .state('landing', {
      url: '/',
      templateUrl: '../views/landing.html',
      controller: 'LandingCtrl'
    });
  $urlRouterProvider.otherwise('/');
})
