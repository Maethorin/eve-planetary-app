evePlanetaryDirectives.directive('clickOff', function($parse, $document) {
  var dir = {
    compile: function($element, attr) {
      var fn = $parse(attr["clickOff"]);
      return function(scope, element, attr) {
        element.bind("click", function(event) {
          event.stopPropagation();
        });
        angular.element($document[0].body).bind("click",function(event) {
          scope.$apply(function() {
            fn(scope, {$event:event});
          });
        });
      };
    }
  };
  return dir;
});