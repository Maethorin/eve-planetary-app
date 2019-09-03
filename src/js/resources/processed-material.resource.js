'use strict';

evePlanetaryResources.factory('ProcessedMaterial', ['$resource', 'appConfig', function($resource, appConfig) {
  return $resource(
    '{backendURL}/admins/me/processed-materials/:processedMaterialId'.format(appConfig),
    null,
    {update: {method: 'PUT'}}
  );
}]);