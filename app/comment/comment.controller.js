/**
 * Created by frouyer on 11/02/16.
 */
(function () {
    'use strict';

    angular
        .module('guitareffect.comment')
        .controller('CommentController', Controller);


    function Controller(ProjectService,
                        FlashService,
                        UserService,
                        $stateParams) {
        var vm = this;

        vm.user = null;
        vm.project = null;

        initController();
        function initController() {


            initChartViewModel();
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
            });

        }


        function initChartViewModel() {
            if ($stateParams.partyID) {
                ProjectService.GetById($stateParams.partyID)
                    .then(function (project) {
                        vm.project = project;
                    })
                    .catch(function (error) {
                        FlashService.Error(error);
                    });
            } else {
                //vm.chartViewModel = new flowchart.ChartViewModel(chartDataModel);
                vm.chartViewModel = new flowchart.ChartViewModel($localStorage.data);

            }
        }


    }

})();