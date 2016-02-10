(function () {
    'use strict';


    angular
        .module('app', [
            'ui.router',
            'guitareffect.account',
            'guitareffect.pedaleffect',
            'guitareffect.usermanagement',
            'guitareffect.home',
            'guitareffect.musicplayer',
            'guitareffect.comment'
        ])
        .config(config)
        .run(run);

    function config($stateProvider, $urlRouterProvider) {
        // default route
        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'home/home.html',
                controller: 'HomeController',
                controllerAs: 'vm',
                data: {activeTab: 'home'}
            })
            .state('account', {
                url: '/account',
                templateUrl: 'account/account.html',
                controller: 'AccountController',
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
            .state('pedalEffectDetail', {
                url: '/pedalEffect/:partyID',
                templateUrl: 'pedalEffect/pedalEffect.html',
                controller: 'PedalEffectController',
                controllerAs: 'vm',
                data: {activeTab: 'pedalEffect'}
            })
            .state('comment', {
                url: '/comment/:partyID',
                templateUrl: 'comment/comment.html',
                controller: 'CommentController',
                controllerAs: 'vm',
                data: {activeTab: 'comment'}
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
            });
    }

    function run($http, $rootScope, $window,editableOptions) {
        // add JWT token as default auth header
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.jwtToken;

        // update active tab on state change
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            $rootScope.activeTab = toState.data.activeTab;
        });
        editableOptions.theme = 'bs3';

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