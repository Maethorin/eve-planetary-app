'use strict';

evePlanetaryResources.factory('RefinedCommodity', ['$resource', 'appConfig', function($resource, appConfig) {
  return $resource(
    '{backendURL}/admins/me/refined-commodities/:refinedCommodityId'.format(appConfig),
    null,
    {update: {method: 'PUT'}}
  );
}]);