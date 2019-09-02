'use strict';

evePlanetaryResources.factory('Me', ['$resource', 'appConfig', function ($resource, appConfig) {
  return $resource('{0}/admins/me'.format([appConfig.backendURL]));
}]);
