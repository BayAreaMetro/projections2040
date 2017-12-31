(function () {
  'use strict';

  angular
    .module('angularjs.tableau.demo')
    .config(config);

  /** @ngInject */
  function config($logProvider, tableauProvider) {
    // Enable log
    $logProvider.debugEnabled(true);

    tableauProvider.setDefaultOptions({
      hideToolbar: true,
      hideTabs: true
    });
  }

})();
