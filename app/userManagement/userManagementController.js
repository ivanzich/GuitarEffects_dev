/**
 * Created by frouyer on 20/01/16.
 */
(function () {
    'use strict';

    angular
        .module('app')
        .controller('UserManagementController', Controller);

    function Controller($window, UserService, FlashService) {
        var vm = this;

        vm.userList = null;
        vm.deleteUser = deleteUser;
        var currentUser = null;

        initController();

        function initController() {
            UserService.GetCurrent().then(function (user) {
                currentUser = user;
            });

            UserService.GetUserList()
                .then(function (userList) {
                    vm.userList = userList;
                    console.log(userList);
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }

        function deleteUser(id) {
            var redirect = false;
            if (currentUser._id == id)
                redirect = true;
            UserService.Delete(id)
                .then(function () {
                    // log user out
                    if (redirect)
                        $window.location = '/login';

                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }
    }
})();

