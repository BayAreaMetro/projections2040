'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('feedback', {
      url: '/feedback',
      template: '<feedback></feedback>'
    });
}
