'use strict';

angular.module('rtfmApp')
  .controller('LoginCtrl', function ($scope, EnvironmentService, $state) {
    $scope.env = EnvironmentService.getEnv();

    $scope.logMeIn = function (username) {
      EnvironmentService.saveUsername(username);
      $state.go('secure.threads');
    };

  });
