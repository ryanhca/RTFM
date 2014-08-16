'use strict';

describe('Service: ThreadService', function () {

  // load the service's module
  beforeEach(module('rtfmApp'));

  // instantiate service
  var ThreadService;
  beforeEach(inject(function (_ThreadService_) {
    ThreadService = _ThreadService_;
  }));

  it('should do something', function () {
    expect(!!ThreadService).toBe(true);
  });

});
