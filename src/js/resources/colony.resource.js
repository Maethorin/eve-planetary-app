'use strict';

evePlanetaryResources.factory('Colony', ['$resource', 'appConfig', function($resource, appConfig) {
  return $resource(
    '{backendURL}/admins/me/accounts/:accountId/characters/:characterId/colonies/:colonyId'.format(appConfig),
    null,
    {update: {method: 'PUT'}}
  );
}]);