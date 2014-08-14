'use strict';

describe('Controller: SecureCtrl', function () {

  // load the controller's module
  beforeEach(module('rtfmApp'));

  var SecureCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SecureCtrl = $controller('SecureCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
