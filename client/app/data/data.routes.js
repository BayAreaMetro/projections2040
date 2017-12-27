'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('data', {
      url: '/data',
      template: '<data></data>'
    });
}
