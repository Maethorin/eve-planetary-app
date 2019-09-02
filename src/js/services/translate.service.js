'use strict';

evePlanetaryServices.service('TranslateService', ['$rootScope', '$q', '$http', function($rootScope, $q, $http) {
  var self = this;
  var language = null;
  var loading = false;
  var defer = $q.defer();

  this.getLanguage = function() {
    if (language) {
      defer.resolve(language);
    }
    else {
      if (!loading) {
        loading = true;

        $http.get('/languages/{0}.json'.format([$rootScope.appLanguage.toLowerCase()])).then(
          function(response) {
            language = response.data;
            defer.resolve();
          },
          function(error) {
            defer.reject(error);
          }
        );
      }
    }
    return defer.promise;
  };

  this.translate = function(section, text) {
    return language[section][text]
  };

  this.translateAsync = function(section, text) {
    var trans = $q.defer();
    this.getLanguage().then(
      function() {
        trans.resolve(language[section][text]);
      }
    );
    return trans.promise;
  };
}]);
