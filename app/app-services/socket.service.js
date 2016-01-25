/**
 * Created by frouyer on 25/01/16.
 */
(function () {
    'use strict';

    angular
        .module('app')
        .factory('SocketService', Service);

    function Service($rootScope) {
        var service = {};
        var socket = io.connect();
        service.on = on;
        service.emit = emit;

        return service;


        function on(eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket,args);
                });
            });
        }

        function emit(eventName, data, callback) {
            socket.emit(eventName, data, function (){
                var args = arguments;
                $rootScope.$apply(function (){
                    if(callback){
                        callback.apply(socket, args);
                    }
                });
            });
        }


    }

})();
