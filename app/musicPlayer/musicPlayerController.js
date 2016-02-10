(function () {
    'use strict';

    angular
        .module('guitareffect.musicplayer')
        .controller('MusicPlayerController', Controller);


    function Controller(ProjectService, FlashService,  PEDAL_EFFECT_CONSTANT, $localStorage) {
        var vm = this;

        vm.projectList = null;
        vm.deleteProject = deleteProject;
        vm.newProject = newProject;
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

        function deleteProject(id) {
            ProjectService.Delete(id)
                .then(function () {
                    // log user out
                    initController();
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }

        function newProject(){
            $localStorage.data=angular.copy(PEDAL_EFFECT_CONSTANT.chartDataModel);
        }
    }


})();
