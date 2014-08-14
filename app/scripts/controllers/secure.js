'use strict';

angular.module('rtfmApp')
  .controller('SecureCtrl', function ($scope, $state, username) {
    if (!username) {
      $state.go('login');
    }

    $scope.username = username;
  });
