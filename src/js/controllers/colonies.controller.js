'use strict';

evePlanetaryControllers.controller('ColoniesController', ['$rootScope', '$scope', 'MeService', 'Colony', function($rootScope, $scope, MeService, Colony) {
  $scope.accounts = [];
  $scope.calculating = false;

  MeService.getInfo().then(
    function(userInfo) {
      _.forEach(userInfo.accounts, function(account) {
        $scope.accounts.push(account);
        _.forEach(account.characters, function(character) {
          Colony.query(
            {accountId: account.id, characterId: character.id},

            function(result) {
              character.colonies = result;
            },

            function(error) {
              console.log(error);
            }
          )
        });
      });
    }
  );

  $scope.selectColony = function(account, character, colony) {
    if (colony.loaded) {
      colony.isOpen = !colony.isOpen;
      return;
    }
    colony.loading = true;
    Colony.get(
      {accountId: account.id, characterId: character.id, colonyId: colony.id},

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

  $scope.calculateRawResource = function(account, character, colony) {
    $scope.calculating = true;
    var getObject = {accountId: account.id, characterId: character.id, colonyId: colony.id, calculate: true};
    if (colony.productionTarget !== null) {
      getObject.productionTarget = colony.productionTarget;
    }
    Colony.get(
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
          });
          $scope.calculating = false;
        });
      },

      function(error) {
        $scope.calculating = false;
        console.log(error);
      }

    )
  };
}]);
