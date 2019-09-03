'use strict';

evePlanetaryResources.factory('RawResource', ['$resource', 'appConfig', function($resource, appConfig) {
  return $resource(
    '{backendURL}/admins/me/raw-resources/:rawResourceId'.format(appConfig),
    null,
    {update: {method: 'PUT'}}
  );
}]);