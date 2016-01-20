/**
 * Created by frouyer on 18/01/16.
 */
(function () {
    'use strict';

    angular
        .module('app')
        .controller('PedalEffectController', Controller);

    function Controller() {
        var vm = this;
        vm.list1 = {title: 'AngularJS - Drag Me'};
        vm.list2 = {};

    }


})();

