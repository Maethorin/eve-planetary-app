'use strict';

evePlanetaryResources.factory('ColonyCalculate', ['$resource', 'appConfig', function($resource, appConfig) {
  return $resource(
    '{backendURL}/admins/me/colonies/:colonyId/calculate/:productionTarget'.format(appConfig)
  );
}]);