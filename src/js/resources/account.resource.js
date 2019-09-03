'use strict';

evePlanetaryResources.factory('Account', ['$resource', 'appConfig', function($resource, appConfig) {
  return $resource(
    '{backendURL}/admins/me/accounts/:accountId'.format(appConfig),
    null,
    {update: {method: 'PUT'}}
  );
}]);