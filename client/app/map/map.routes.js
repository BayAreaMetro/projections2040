'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('map', {
      url: '/map',
      template: '<map></map>'
    });
}
