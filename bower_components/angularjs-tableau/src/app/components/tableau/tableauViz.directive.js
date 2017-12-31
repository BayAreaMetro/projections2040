(function () {
  'use strict';

  angular
    .module('angularjs.tableau')
    .directive('tableauViz', TableauViz);

  /** @ngInject */
  function TableauViz(tableau, $log, $interval) {
    var directive = {
      restrict: 'A',
      scope: {
        path: '@tableauViz',
        height: '=',
        width: '=',
        options: '=',
        onCustomViewLoad: '&',
        onCustomViewRemove: '&',
        onCustomViewSave: '&',
        onCustomViewSetDefault: '&',
        onFilterChange: '&',
        onMarksSelection: '&',
        onParameterChange: '&',
        onStoryPointSwitch: '&',
        onTabSwitch: '&',
        onToolbarStateChange: '&',
        onVizResize: '&'
      },
      link: function (scope, element, attrs) {
        var viz;

        // We need a url to do anything.
        if (!scope.path) {
          $log.log("Error: No URL was specified for Tableau Viz");
          return;
        }

        function createViz() {
          var options = tableau.createOptions({
            width: scope.width ? scope.width : '100%',
            height: scope.height ? scope.height : '100%'
          });

          if (scope.options) {
            angular.merge(options, scope.options);
          }

          // TODO: May want a way to lazy-init visualizations as they are scrolled into view
          // (especially on mobile devices, to avoid overloading the browser)
          viz = new tableau.api.Viz(element[0], scope.path, options);
        }

        createViz();

        // We need to rebuild the dashboard periodically to accommodate session timeouts. This is pretty hacky though. :/
        var stop = $interval(function rebuild() {
          viz.dispose();
          createViz();
        }, 300000);

        // Destroy the dashboard and interval timers upon destroying directive.
        scope.$on('$destroy', function () {
          if (viz) viz.dispose();
          if (angular.isDefined(stop)) {
            $interval.cancel(stop);
            stop = undefined;
          }
        });

        // Implement callbacks for each event if passed in.
        if (scope.onCustomViewLoad && angular.isDefined(attrs.onCustomViewLoad)) {
          viz.addEventListener('customViewLoad', function (events) {
            $log.log("Event 'customViewLoad' has fired");
            scope.onCustomViewLoad({ arg1: events });
          });
        }

        if (scope.onCustomViewRemove && angular.isDefined(attrs.onCustomViewRemove)) {
          viz.addEventListener('customViewRemove', function (events) {
            $log.log("Event 'customViewRemove' has fired");
            scope.onCustomViewRemove({ arg1: events });
          });
        }

        if (scope.onCustomViewSave && angular.isDefined(attrs.onCustomViewSave)) {
          viz.addEventListener('customViewSave', function (events) {
            $log.log("Event 'customViewSave' has fired");
            scope.onCustomViewSave({ arg1: events });
          });
        }

        if (scope.onCustomViewSetDefault && angular.isDefined(attrs.onCustomViewSetDefault)) {
          viz.addEventListener('customViewSetDefault', function (events) {
            $log.log("Event 'customViewSetDefault' has fired");
            scope.onCustomViewSetDefault({ arg1: events });
          });
        }

        if (scope.onFilterChange && angular.isDefined(attrs.onFilterChange)) {
          viz.addEventListener('filterChange', function (events) {
            $log.log("Event 'filterChange' has fired");
            scope.onFilterChange({ arg1: events });
          });
        }

        if (scope.onMarksSelection && angular.isDefined(attrs.onMarksSelection)) {
          viz.addEventListener('marksSelection', function (events) {
            $log.log("Event 'marksSelection' has fired");
            scope.onMarksSelection({ arg1: events });
          });
        }

        if (scope.onParameterChange && angular.isDefined(attrs.onParameterChange)) {
          viz.addEventListener('parameterValueChange', function (events) {
            $log.log("Event 'parameterValueChange' has fired");
            scope.onParameterChange({ arg1: events });
          });
        }

        if (scope.onStoryPointSwitch && angular.isDefined(attrs.onStoryPointSwitch)) {
          viz.addEventListener('storyPointSwitch', function (events) {
            $log.log("Event 'storyPointSwitch' has fired");
            scope.onStoryPointSwitch({ arg1: events });
          });
        }

        if (scope.onTabSwitch && angular.isDefined(attrs.onTabSwitch)) {
          viz.addEventListener('tabSwitch', function (events) {
            $log.log("Event 'tabSwitch' has fired");
            scope.onTabSwitch({ arg1: events });
          });
        }

        if (scope.onToolbarStateChange && angular.isDefined(attrs.onToolbarStateChange)) {
          viz.addEventListener('toolbarStateChange', function (events) {
            $log.log("Event 'toolbarStateChange' has fired");
            scope.onToolbarStateChange({ arg1: events });
          });
        }

        if (scope.onVizResize && angular.isDefined(attrs.onVizResize)) {
          viz.addEventListener('vizResize', function (events) {
            $log.log("Event 'vizResize' has fired");
            scope.onVizResize({ arg1: events });
          });
        }
      }
    };

    return directive;
  }
})();