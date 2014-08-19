'use strict';

angular.module('rtfmApp')
  .service('UserService', function UserService($q, $firebase, $firebaseSimpleLogin, EnvironmentService) {
    var firebaseUrl = EnvironmentService.getEnv().firebase,
      firebase = new Firebase(firebaseUrl),
      firebaseSimpleLogin = $firebaseSimpleLogin(firebase);

    return {
      getCurrentUser: function () {
        return firebaseSimpleLogin.$getCurrentUser();
      },

      register: function (username, email, password) {
        var firebasePromise = firebaseSimpleLogin.$createUser(email, password),
          userDeferred = $q.defer(),
          combinedPromise = $q.all(firebasePromise, userDeferred.promise);

        // After the Firebase user has been created, create our own user object
        firebasePromise.then(function (currentUser) {
          var userObject = $firebase(new Firebase(firebaseUrl + '/users/' + currentUser.id)).$asObject();

          userObject.username = username;
          userObject.email = currentUser.email;
          userObject.$save().then(userDeferred.resolve, userDeferred.reject);
        });

        return combinedPromise;
      },

      logIn: function (email, password) {
        return firebaseSimpleLogin.$login('password', {
          email: email,
          password: password,
          rememberMe: true // Override default session length (browser session) to be 30 days
        });
      },

      logOut: function () {
        var deferred = $q.defer();

        deferred.resolve(firebaseSimpleLogin.$logout());

        return deferred.promise;
      },

      getUser: function () {
        var deferred = $q.defer();

        firebaseSimpleLogin.$getCurrentUser().then(function (currentUser) {
          if (currentUser && currentUser.id) {
            var userRef = $firebase(new Firebase(firebaseUrl + '/users/' + currentUser.id));
            deferred.resolve(userRef.$asObject());
          } else {
            deferred.reject();
          }

        });

        return deferred.promise;
      }


    }
  });
