(function () {
    'use strict';


    angular
        .module('app', [
            'ui.router',
            'ngDragDrop',
            'irontec.simpleChat',
            'flowChart',
            'ui.bootstrap',
            'rzModule'
        ])
        .config(config)
        .run(run);

    function config($stateProvider, $urlRouterProvider) {
        // default route
        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'home/index.html',
                controller: 'Home.IndexController',
                controllerAs: 'vm',
                data: {activeTab: 'home'}
            })
            .state('account', {
                url: '/account',
                templateUrl: 'account/index.html',
                controller: 'Account.IndexController',
                controllerAs: 'vm',
                data: {activeTab: 'account'}
            })
            .state('pedalEffect', {
                url: '/pedalEffect',
                templateUrl: 'pedalEffect/pedalEffect.html',
                controller: 'PedalEffectController',
                controllerAs: 'vm',
                data: {activeTab: 'pedalEffect'}
            })
            .state('usermanagement', {
                url: '/usermanagement',
                templateUrl: 'userManagement/userManagement.html',
                controller: 'UserManagementController',
                controllerAs: 'vm',
                data: {activeTab: 'usermanagement'}
            })
            .state('musicplayer', {
                url: '/musicplayer',
                templateUrl: 'musicPlayer/musicPlayer.html',
                controller: 'MusicPlayerController',
                controllerAs: 'vm',
                data: {activeTab: 'musicplayer'}
            })
            .state('chat', {
                url: '/chat',
                templateUrl: 'chat/chat.html',
                controller: 'ChatController',
                controllerAs: 'vm',
                data: {activeTab: 'chat'}
            })
            .state('effect', {
                url: '/effect',
                templateUrl: 'effect/effect.html',
                controller: 'EffectController',
                controllerAs: 'vm',
                data: {activeTab: 'effect'}
            });
    }

    function run($http, $rootScope, $window) {
        // add JWT token as default auth header
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.jwtToken;

        // update active tab on state change
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            $rootScope.activeTab = toState.data.activeTab;
        });
    }

    // manually bootstrap angular after the JWT token is retrieved from the server
    $(function () {
        // get JWT token from server
        $.get('/app/token', function (token) {
            window.jwtToken = token;

            angular.bootstrap(document, ['app']);
        });
    });
})();