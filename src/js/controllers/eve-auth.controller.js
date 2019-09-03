'use strict';

evePlanetaryControllers.controller('EVEAuthController', ['$rootScope', 'appConfig', '$interval', '$window', '$scope', 'Account', 'Colony', function($rootScope, appConfig, $interval, $window, $scope, Account, Colony) {
// http://local-eveplanetary.maethorin.com.br/?code=rsRVfhtsHkCYk31vsameLQ&state=8ca196930b6992#!/eve-auth
  $scope.redirecting = false;
  $scope.continueAuthorizing = false;
  $scope.hasAccounts = false;
  $scope.planeting = false;
  $scope.eveAuthCodeExpiration = '5:00';
  $scope.account = {
    authCode: null,
    username: null
  };

  function redirectToSecureEve() {
    $scope.redirecting = true;
    $scope.redirectTimer = 10;

    if (localStorage.getItem('eveState') === null) {
      localStorage.setItem('eveState', createEVEState());
    }

    $scope.eveState = localStorage.getItem('eveState');

    var eveSecureParameters = {
      redirect_uri: encodeURIComponent('http://local-eveplanetary.maethorin.com.br/#!/eve-auth'),
      client_id: encodeURIComponent(appConfig.eveClientId),
      scope: encodeURIComponent('esi-planets.manage_planets.v1'),
      state: $scope.eveState
    };
    var eveSecureUrl = 'https://login.eveonline.com/v2/oauth/authorize/?response_type=code&redirect_uri={redirect_uri}&client_id={client_id}&scope={scope}&state={state}'.format(eveSecureParameters);

    var redirectInterval = $interval(
      function() {
        $scope.redirectTimer -= 1;
        if ($scope.redirectTimer <= 0) {
          $interval.cancel(redirectInterval);
          $window.location = eveSecureUrl;
        }
      },
      1000
    );
  }

  $scope.continueAuthorization = function() {
    var queryPairParameters = $window.location.search.slice(1).split('&');
    var queryParameters = {};
    queryPairParameters.forEach(function(pair) {
        pair = pair.split('=');
        queryParameters[pair[0]] = decodeURIComponent(pair[1] || '');
    });

    // TODO: validate state here!

    $scope.account.authCode = queryParameters.code;

    Account.save(
      {},

      $scope.account,

      function(result) {
        $scope.continueAuthorizing = false;
        $scope.planeting = true;
        $scope.account = result;
        localStorage.removeItem('eveState');
        $interval.cancel($scope.timerAuthCodeInterval);
      },

      function(error) {
        console.log(error);
      }
    );
  };

  $scope.loadCharacterPlanetaryData = function(account, character) {
    Colony.save(
      {accountId: account.id, characterId: character.id},

      {},

      function(result) {
        console.log(result)
      },

      function(error) {
        console.log(error);
      }
    )
  };

  if ($window.location.search === "") {
    Account.query(
      function(accounts) {
        if (accounts.length === 0) {
          redirectToSecureEve();
          return;
        }
        $scope.accounts = accounts;
        $scope.hasAccounts = true;
      },

      function(error) {
        console.log(error);
      }
    );
  }
  else {
    $scope.continueAuthorizing = true;
    $scope.timerAuthCodeExpiration = 300;
    $scope.timerAuthCodeInterval = $interval(
      function() {
        $scope.timerAuthCodeExpiration -= 1;
        var minutes = parseInt($scope.timerAuthCodeExpiration / 60);
        var seconds = ($scope.timerAuthCodeExpiration - (minutes * 60)).paddingLeft(2, '0');
        $scope.eveAuthCodeExpiration = '{0}:{1}'.format([minutes, seconds]);
        if ($scope.timerAuthCodeExpiration <= 0) {
          $interval.cancel($scope.timerAuthCodeInterval);
          $window.location.search = '';
          redirectToSecureEve();
        }
      },
      1000
    );
  }
}]);
