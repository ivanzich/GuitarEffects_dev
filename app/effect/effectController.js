(function () {
    'use strict';

    angular
        .module('app')
        .controller('EffectController', Controller);

    function Controller() {
        var vm = this;

        window.AudioContext = window.AudioContext || window.webkitAudioContext;

        var context = new AudioContext();
        var filtre = context.createBiquadFilter();
        var gainNode = context.createGain();
        //Declaration des variables effects
        var mic=null;
        var reverb = null;

        //Fonction pour activer le micro
        vm.activerMicro=function()
        {
            if(vm.micro)
            {
                navigator.getUserMedia = navigator.getUserMedia ||
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia ||
                navigator.msGetUserMedia;
                navigator.getUserMedia(
                {
                    audio: true
                },
                    function (e) {

                        mic = context.createMediaStreamSource(e);
                        mic.connect(context.destination);
                        mic.start();
                    },
                    function (e) {
                        // error
                        console.error(e);
                    });
            }else{
                mic.disconnect();
            }
        };

        //Fonction pour activer reverb
        vm.slider = {
            value: 150,
            options: {
                floor: 0,
                ceil: 200
            }
        };


    }

})();