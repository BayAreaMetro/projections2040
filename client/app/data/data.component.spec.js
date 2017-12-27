'use strict';

describe('Component: DataComponent', function() {
  // load the controller's module
  beforeEach(module('projections2040App.data'));

  var DataComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    DataComponent = $componentController('data', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
