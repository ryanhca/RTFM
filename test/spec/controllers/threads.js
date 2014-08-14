'use strict';

describe('Controller: ThreadsCtrl', function () {

  // load the controller's module
  beforeEach(module('rtfmApp'));

  var ThreadsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ThreadsCtrl = $controller('ThreadsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
