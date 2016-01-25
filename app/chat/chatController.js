/**
 * Created by frouyer on 25/01/16.
 */
(function () {
    'use strict';

    angular
        .module('app')
        .controller('ChatController', Controller);

    function Controller($window, UserService, FlashService) {
        var vm = this;
        vm.username = 'poney';

        vm.messages = [
            {
                'username': 'username1',
                'content': 'Hi!'
            },
            {
                'username': 'username2',
                'content': 'Hello!'
            },
            {
                'username': 'username2',
                'content': 'Hello!'
            },
            {
                'username': 'username2',
                'content': 'Hello!'
            },
            {
                'username': 'username2',
                'content': 'Hello!'
            },
            {
                'username': 'username2',
                'content': 'Hello!'
            }
        ];



        initController();

        function initController() {

            // get current user
            UserService.GetCurrent().then(function (user) {
                console.log(vm.username);
                vm.username = user.username;
                console.log(vm.username);
            });
        }


        vm.sendMessage = function(message, username) {
            if(message && message !== '' && username) {
                console.log(vm.username);
                vm.messages.push({
                    'username': vm.username,
                    'content': message
                });
            }
        };
        vm.visible = true;
        vm.expandOnNew = true;


    }

})();



