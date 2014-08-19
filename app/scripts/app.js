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
      template: '<a ng-click="logOut()">Log Out</a><div ui-view>',
      controller: 'SecureCtrl',
      resolve: {
        currentUser: function (UserService) {
          return UserService.getCurrentUser();
        },
        user: function (UserService) {
          return UserService.getUser();
        }
      }
    })
    .state('secure.threads', {
      url: '/threads',
      templateUrl: 'views/threads.html',
      controller: 'ThreadsCtrl',
      resolve: {
        threadsRef: function (ThreadService) {
          return ThreadService.getThreads();
        }
      }
    })
    .state('secure.thread', {
      url: '/thread/:threadId',
      templateUrl: 'views/thread.html',
      controller: 'ThreadCtrl',
      resolve: {
        threadRef: function (ThreadService, $stateParams) {
          return ThreadService.getThread($stateParams.threadId);
        },
        commentsRef: function (ThreadService, $stateParams) {
          return ThreadService.getComments($stateParams.threadId);
        }
      }
    });
});
