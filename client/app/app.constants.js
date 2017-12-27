'use strict';

import angular from 'angular';

export default angular.module('projections2040App.constants', [])
  .constant('appConfig', require('../../server/config/environment/shared'))
  .name;
