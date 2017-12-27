'use strict';

describe('Component: MapComponent', function() {
  // load the controller's module
  beforeEach(module('projections2040App.map'));

  var MapComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    MapComponent = $componentController('map', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
