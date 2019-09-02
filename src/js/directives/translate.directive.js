'use strict';

evePlanetaryDirectives.directive('translate', ['TranslateService', function(TranslateService) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      translated: '=?'
    },
    link: function(scope, element, attrs, controller) {
      TranslateService.translateAsync(attrs.section, attrs.text).then(
        function(result) {
          scope.translated = result;
        }
      );
    },
    template: function(element, attrs) {
      return '<span>{{translated}}</span>';
    }
  };
}]);