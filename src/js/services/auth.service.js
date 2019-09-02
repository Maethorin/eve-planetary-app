'use strict';

evePlanetaryServices.service('AuthService', ['$rootScope', '$cookies', function($rootScope, $cookies) {
  this.token = null;
  this.username = null;

  this.update = function() {
    this.token = $cookies.get('evePlanetaryUserToken');
    this.username = $cookies.get('evePlanetaryUserName');
  };

  this.clear = function(){
    $cookies.remove('evePlanetaryUserToken', {path: '/', domain: 'maethorin.com.br'});
    $cookies.remove('evePlanetaryUserName', {path: '/', domain: 'maethorin.com.br'});
    this.update();
  };

  this.userIsLogged = function() {
    return this.token !== null && this.token !== undefined;
  };

}]);
