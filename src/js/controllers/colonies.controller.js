'use strict';

evePlanetaryControllers.controller('ColoniesController', ['$rootScope', '$scope', 'MeService', 'Colony', 'ColonyCalculate', function($rootScope, $scope, MeService, Colony, ColonyCalculate) {
  MeService.getInfo().then(
    function(userInfo) {
      Colony.query(
        function(result) {
          $scope.colonies = result;
        },
        function(error) {
          console.log(error);
        }
      )
    }
  );

  $scope.selectColony = function(colony) {
    if (colony.loaded) {
      colony.isOpen = !colony.isOpen;
      return;
    }
    colony.loading = true;
    Colony.get(
      {colonyId: colony.id},

      function(colonyResult) {
        colony.refinedCommodities = colonyResult.refinedCommodities;
        colony.isOpen = true;
        colony.loading = false;
        colony.loaded = true;
        colony.productionTarget = null;
      },

      function(error) {
        colony.loading = false;
        console.log(error)
      }
    );
  };

  $scope.saveColony = function(colony) {
    Colony.update(
      {colonyId: colony.id},

      colony,

      function(result) {

      },

      function(error) {
        console.log(error);
      }

    )
  };

  $scope.calculateRawResource = function(colony) {
    var getObject = {colonyId: colony.id};
    if (colony.productionTarget !== null) {
      getObject.productionTarget = colony.productionTarget;
    }
    ColonyCalculate.get(
      getObject,

      function(result) {
        colony.productionTarget = parseInt(result.productionTarget);
        _.forEach(colony.refinedCommodities, function(refinedCommodity) {
          _.forEach(refinedCommodity.processedMaterials, function(processedMaterial) {
            _.forEach(result.calculeResult, function(calculate) {
              if (calculate.processedMaterial.id === processedMaterial.processedMaterialId) {
                processedMaterial.productionTarget = result.productionTarget - processedMaterial.quantity;
                processedMaterial.rawResource.productionTarget = calculate.extractionNeeded;
              }
            })
          })
        });
      },

      function(error) {
        console.log(error);
      }

    )
  };
}]);
