'use strict';

var format = function(str, data) {
  return str.replace(/{([^{}]+)}/g, function(match, val) {
    var prop = data;
    val.split('.').forEach(function(key) {
      prop = prop[key];
    });

    return prop;
  });
};

String.prototype.format = function(data) {
  return format(this, data);
};

String.prototype.encodedURI = function() {
  return this.replace(' ', '+');
};

String.prototype.slugify = function() {
  function dasherize(str) {
    return str.trim().replace(/[-_\s]+/g, '-').toLowerCase();
  }

  function clearSpecial(str) {
    var from  = 'ąàáäâãåæăćčĉęèéëêĝĥìíïîĵłľńňòóöőôõðøśșşšŝťțţŭùúüűûñÿýçżźž',
      to    = 'aaaaaaaaaccceeeeeghiiiijllnnoooooooossssstttuuuuuunyyczzz';
    to = to.split('');
    return str.replace(/.{1}/g, function(c){
      var index = from.indexOf(c);
      return index === -1 ? c : to[index];
    });
  }

  return clearSpecial(dasherize(this));
};

Number.prototype.paddingLeft = function(size, char) {
  if (!char) {
    char = '0'
  }
  var length = this.toString().length;
  if (length >= size) {
    return this.toString();
  }
  var result = [];
  for (var i = length; i < size; i++) {
    result.push(char);
  }
  return result.join('') + this.toString();
};

function createEVEState(){
    var dt = new Date().getTime();
    return 'xxxxxxyxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c === 'x' ? r :(r&0x3|0x8)).toString(16);
    });
}


var evePlanetaryServices  = angular.module('evePlanetary.services', []);
var evePlanetaryFactories  = angular.module('evePlanetary.factories', []);
var evePlanetaryResources  = angular.module('evePlanetary.resources', []);
var evePlanetaryDirectives  = angular.module('evePlanetary.directives', []);
var evePlanetaryControllers  = angular.module('evePlanetary.controllers', []);

var evePlanetary = angular.module(
  'evePlanetary', [
    'ngResource',
    'ngAnimate',
    'ngCookies',
    'ui.router',
    'ui.utils.masks',
    'ui.bootstrap',
    '19degrees.ngSweetAlert2',
    'angular.filter',
    'ngMaterial',
    'evePlanetary.services',
    'evePlanetary.factories',
    'evePlanetary.resources',
    'evePlanetary.directives',
    'evePlanetary.controllers'
  ]
);

evePlanetary.constant('appConfig', {
  backendURL: '@@backendURL',
  env: '@@env',
  eveClientId: '@@eveClientId'
});

evePlanetary.config(['$httpProvider', '$stateProvider', '$locationProvider', '$urlRouterProvider', function($httpProvider, $stateProvider, $locationProvider, $urlRouterProvider) {
  $httpProvider.interceptors.push('UpdateToken');
  $locationProvider.hashPrefix('!');

  $stateProvider
    .state({
      name: 'home',
      url: '/',
      templateUrl: 'templates/home.html',
      controller: 'HomeController',
      cache: false,
      headers: {
        'Cache-Control' : 'no-cache'
      }
    })

    .state({
      name: 'login',
      url: '/login',
      cache: false,
      templateUrl: 'templates/login.html',
      controller: 'LoginController'
    })

    .state({
      name: 'eve-auth',
      url: '/eve-auth',
      templateUrl: 'templates/eve-auth.html',
      controller: 'EVEAuthController'
    })

    .state({
      name: 'logout',
      url: '/logout',
      controller: 'LogoutController'
    })

    .state({
      name: 'colonies',
      url: '/colonies',
      cache: false,
      templateUrl: 'templates/colonies.html',
      controller: 'ColoniesController'
    });

  $urlRouterProvider.when('', '/');
}]);

evePlanetary.run(['$rootScope', '$http', 'appConfig', 'AuthService', 'MeService', 'TranslateService', function($rootScope, $http, appConfig, AuthService, MeService, TranslateService) {
  $rootScope.appLanguage = 'en-us';
  window.moment.locale($rootScope.appLanguage);
  AuthService.update();

  $rootScope.translator = TranslateService;

  $rootScope.formatDecimal = function(value, isInteger) {
    if (!value) {
      value = 0.0;
    }
    if (isInteger === undefined) {
      isInteger = false;
    }
    try {
      value = value.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+\,)/g, '$1.');
    }
    catch (ValueError) {
      return 'NC';
    }
    if (isInteger) {
      return value.split(',')[0];
    }
    return value
  };

  MeService.getInfo().then(
    function(userInfo) {
      $rootScope.userInfo = userInfo;
    }
  );

}]);
