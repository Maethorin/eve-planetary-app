'use strict';

evePlanetaryControllers.controller('LoginController', ['$rootScope', '$scope', '$window', '$location', '$state','$timeout', 'AuthService', 'NewUser', 'Login',
function($rootScope, $scope, $window, $location, $state, $timeout, AuthService, NewUser, Login) {
  if (AuthService.userIsLogged()) {
    $state.go('home', {}, {reload: 'home'});
  }

  $scope.newUser = {
    name: null,
    email: null,
    password: null,
    confirmPassword: null
  };

  $scope.login = new Login({
    username: null,
    password: null
  });

  $scope.formLogin = true;
  $scope.formRecover = false;
  $scope.loginFail = false;
  $scope.createFail = false;
  $scope.loginLoad = false;
  $scope.passwordNotMatch = false;
  $scope.userCreated = false;

  $scope.logingIn = function() {
    $scope.loginFail = false;
    if ($scope.formLogin.$invalid) {
      $scope.loginFail = true;
      return false;
    }
    $scope.loginLoad = true;
    $scope.userCreated = false;

    $scope.login.$save().then(
      function(resp) {
        AuthService.update();
        var next = $location.search();
        var redirectUrl = '/';
        if (next.hasOwnProperty('next')) {
          redirectUrl = decodeURIComponent(next.next);
        }
        $window.location.href = redirectUrl;
        $window.location.reload();
      },
      function() {
        $scope.loginFail = true;
        $scope.loginLoad = false;
      }
    );
  };

  $scope.toggleRecoverForm = function() {
    $scope.formLogin = !$scope.formLogin;
    $scope.formRecover = !$scope.formRecover;
  };

  $scope.toggleCreateUser = function() {
    $scope.userCreated = false;
    $scope.passwordNotMatch = false;
    $scope.formLogin = !$scope.formLogin;
    $scope.formCreate = !$scope.formCreate;
  };

  $scope.createNewUser = function() {
    $scope.createFail = false;
    $scope.passwordNotMatch = $scope.newUser.confirmPassword !== $scope.newUser.password;
    if ($scope.passwordNotMatch) {
      $scope.createFail = true;
      return false;
    }
    $scope.loginLoad = true;
    delete $scope.newUser.confirmPassword;

    NewUser.save(
      $scope.newUser,

      function(result) {
        $scope.formLogin = true;
        $scope.formCreate = false;
        $scope.loginLoad = false;
        $scope.userCreated = true;
      },

      function(error) {
        $scope.createFail = true;
        $scope.loginLoad = false;
        console.log(error);
      }
    )
  }

}]);


evePlanetaryControllers.controller('LogoutController', ['$rootScope', '$window', 'AuthService', 'Login', function($rootScope, $window, AuthService, Login) {
  AuthService.clear();
  $window.location.href = '/';
}]);