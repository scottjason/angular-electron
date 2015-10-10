angular.module('app', ['ui.router'])

.config(function($stateProvider, $locationProvider, $urlRouterProvider) {
  $stateProvider
    .state('landing', {
      url: '/',
      templateUrl: '../views/landing.html',
      controller: 'LandingCtrl'
    });
  $urlRouterProvider.otherwise('/');
})
