'use strict';

evePlanetaryControllers.controller('HomeController', ['$rootScope', '$scope', 'RawResource', 'ProcessedMaterial', 'RefinedCommodity', function($rootScope, $scope, RawResource, ProcessedMaterial, RefinedCommodity) {
  $scope.refinedCommodities = [];

  RefinedCommodity.query(
    function(refinedCommodities) {
      $scope.refinedCommodities = refinedCommodities;
    },

    function(error) {
      console.log(error)
    }
  );
}]);
