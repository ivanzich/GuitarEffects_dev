/**
 * Created by frouyer on 20/01/16.
 */
(function () {
    'use strict';

    angular
        .module('app')
        .controller('UserManagementController', Controller);

    function Controller(UserService, FlashService) {
        var vm = this;

        vm.userList = null;

        initController();

        function initController() {
            UserService.GetUserList()
                .then(function (userList) {
                    vm.userList = userList;
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }
    }
})();

