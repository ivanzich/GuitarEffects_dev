(function () {
    'use strict';

    angular
        .module('app')
        .controller('MusicPlayerController', Controller);


    function Controller($window, ProjectService, FlashService) {
        var vm = this;

        vm.projectList = null;
        initController();

        function initController() {


            ProjectService.GetProjectList()
                .then(function (projectList) {
                    vm.projectList = projectList;
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }


    }



})();
