'use strict';

angular.module('rtfmApp', ['firebase', 'ui.router']).config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/login');

  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'views/login.html',
      controller: 'LoginCtrl'
    })
    .state('secure', {
      abstract: true,
      template: '<div ui-view>',
      controller: 'SecureCtrl',
      resolve: {
        username: function (EnvironmentService) {
          return EnvironmentService.getUsername();
        }
      }
    })
    .state('secure.threads', {
      url: '/threads',
      templateUrl: 'views/threads.html',
      controller: 'ThreadsCtrl'
    })
    .state('secure.thread', {
      url: '/thread/$threadId'
    });
});
