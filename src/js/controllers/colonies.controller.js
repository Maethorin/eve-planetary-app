'use strict';

evePlanetaryControllers.controller('ColoniesController', ['$rootScope', '$scope', 'Notifier', 'MeService', 'Colony', function($rootScope, $scope, Notifier, MeService, Colony) {
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
              Notifier.success('All Colonies loaded!', 'Colonies Loaded')
            },

            function(error) {
              console.log(error);
              Notifier.danger('Something when very bad loading colonies. If you are a developer, you know what to do.', 'On No!')
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

  $scope.saveColony = function(account, character, colony) {
    colony.loading = true;
    Colony.update(
      {accountId: account.id, characterId: character.id, colonyId: colony.id},

      colony,

      function(result) {
        colony.loading = false;
        Notifier.success('Your Colony was saved with success!', 'Colony Saved')
      },

      function(error) {
        console.log(error);
        colony.loading = false;
        Notifier.danger('Something when very bad. If you are a developer, you know what to do.', 'On No!')
      }
    );
  };

  $scope.deleteColony = function(account, character, colony) {
    colony.loading = true;
    Colony.delete(
      {accountId: account.id, characterId: character.id, colonyId: colony.id},

      colony,

      function() {
        colony.loading = false;
        var colonyIndex = _.findIndex(character.colonies, ['id', colony.id]);
        character.colonies.splice(colonyIndex, 1);
        Notifier.success('Your Colony was deleted with success! Are we gonna missing it?', 'Colony Deleted')
      },

      function(error) {
        console.log(error);
        colony.loading = false;
        Notifier.danger('Something when very bad. If you are a developer, you know what to do.', 'On No!')
      }

    )
  };

  $scope.calculateRawResource = function(account, character, colony) {
    colony.loading = true;
    $scope.calculating = true;
    var getObject = {accountId: account.id, characterId: character.id, colonyId: colony.id, calculate: true};
    if (colony.productionTarget !== null) {
      getObject.productionTarget = colony.productionTarget;
    }
    Colony.get(
      getObject,

      function(result) {
        colony.loading = false;
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
        Notifier.success('Calcule is done!', 'Ready!')
      },

      function(error) {
        console.log(error);
        colony.loading = false;
        $scope.calculating = false;
        Notifier.danger('Something when very bad. If you are a developer, you know what to do.', 'On No!')
      }

    )
  };
}]);
