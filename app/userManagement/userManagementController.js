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
            console.log('passe');
            UserService.GetUserList()
                .then(function (userList) {
                    vm.userList = userList;
                    console.log(userList);
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }
    }
})();

