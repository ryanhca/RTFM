'use strict';

describe('Service: EnvironmentService', function () {

  // load the service's module
  beforeEach(module('rtfmApp'));

  // instantiate service
  var EnvironmentService;
  beforeEach(inject(function (_EnvironmentService_) {
    EnvironmentService = _EnvironmentService_;
  }));

  it('should do something', function () {
    expect(!!EnvironmentService).toBe(true);
  });

});
