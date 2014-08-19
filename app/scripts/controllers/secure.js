'use strict';

angular.module('rtfmApp')
  .controller('SecureCtrl', function ($scope, $state, currentUser, user, UserService) {
    if (!currentUser) {
      $state.go('login');
    }

    $scope.currentUser = currentUser;

    $scope.user = user;

    $scope.logOut = function () {
      delete $scope.currentUser;

      $scope.user.$destroy(); // Stop listening... failure to stop listening results in errors.

      UserService.logOut().then(function () {
        $state.go('login');
      });
    }

  });
