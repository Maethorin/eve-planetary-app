'use strict';

evePlanetaryResources.factory('NewUser', ['$resource', 'appConfig', function ($resource, appConfig) {
  return $resource('{0}/admins'.format([appConfig.backendURL]));
}]);
