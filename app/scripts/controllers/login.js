'use strict';

angular.module('rtfmApp')
  .controller('LoginCtrl', function ($scope, UserService, $state) {
    $scope.logMeIn = function (email, password) {
      UserService.logIn(email, password).then(function (user) {
        $state.go('secure.threads');
      }, function (error) {
        alert(error);
      });

    };

    $scope.register = function (username, email, password) {
      UserService.register(username, email, password).then(function (user) {
        UserService.logIn(email, password).then(function () {
          $state.go('secure.threads');
        });

      }, function (error) {
        alert(error);
      });
    };

  });
