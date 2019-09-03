'use strict';

evePlanetaryResources.factory('Character', ['$resource', 'appConfig', function($resource, appConfig) {
  return $resource(
    '{backendURL}/admins/me/accounts/:accountId/characters/characterId'.format(appConfig),
    null,
    {update: {method: 'PUT'}}
  );
}]);