(function () {
    'use strict';

    angular
        .module('app')
        .controller('EffectController', Controller);

    function Controller() {
        var vm = this;

        window.AudioContext = window.AudioContext || window.webkitAudioContext;

        var context = new AudioContext();

        var mic=null;
        var delay= null;


        var micRerb=  new p5.AudioIn();
        var reverb = new p5.Reverb()


        //Fonction pour activer le micro
        vm.activerMicro=function()
        {
            if(vm.micro)
            {
                navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||  navigator.mozGetUserMedia ||  navigator.msGetUserMedia;
                navigator.getUserMedia(
                    {
                        audio: true
                    },
                    function (stream) {
                        mic = context.createMediaStreamSource(stream);
                        mic.connect(context.destination);
                     },
                    function (e) {
                        // error
                        console.error(e);
                    });
            }else{
                mic.disconnect();
            }
        };

        //Fonction pour activer delay
        vm.activerDelay= function(){

            var feedback =null;

            if(vm.delay){
                delay = context.createDelay();
                delay.delayTime.value = valSlide(vm.delayTime.value);

                feedback = context.createGain();
                feedback.gain.value = valSlide(vm.delayFeedback.value);


                delay.connect(feedback);
                feedback.connect(delay);

                mic.connect(delay);
                delay.connect(context.destination);

            }else{
                delay.disconnect();
            }
        }

        vm.activerReverb= function(){

            if(vm.reverb){

                reverb.process(micRerb,10, 2);
                micRerb.connect();
                micRerb.start();


            }
            reverb.disconnect();
        }

        vm.delayTime = {
            value: 30,
            options: {
                floor: 0,
                ceil: 100
            }
        };
        vm.delayFeedback = {
            value: 0,
            options: {
                floor: 0,
                ceil: 100
            }
        };
        vm.delayFrequence = {
            value: 0,
            options: {
                floor: 0,
                ceil: 100
            }
        };

    function valSlide(slide){
        return(slide/100);
    }

    }

})();
