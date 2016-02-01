(function () {
    'use strict';

    angular
        .module('app')
        .controller('EffectController', Controller);

    function Controller() {
        var vm = this;

        window.AudioContext = window.AudioContext || window.webkitAudioContext;

        var context = new AudioContext();

        //Activer micro et delay
        var mic=null;
        var delay= null;

        //Activer reverb
        var micRerb=  new p5.AudioIn();
        var reverb = new p5.Reverb()

        //Activer Gain Flo;
        var oscillator = null;
        var lfo = null;
        var gain =null;


        //Activer chorus
        var delayNodeChorus = null;
        var oscillatorChorus = null;
        var  gainChorus = null;

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

        //Activer reverb
        vm.activerReverb= function(){
            if(vm.reverb){
                reverb.process(micRerb,10, 2);
                micRerb.connect();
                micRerb.start();
            }else {
                micRerb.disconnect();
            }
        }

        //Activer  Gain Flo
        vm.activerGainLfo = function(){

            oscillator = context.createOscillator();
            lfo = context.createOscillator();
            context.createOscillator();

            gain = context.createGain();

            if(vm.GainLfo)
            {
                lfo.type="triangle";
                oscillator.type="triangle";
                //lfo.frequency.value = 300; // 3Hz: two oscillations par second
                lfo.frequency.value = valSlide(vm.lfoSpeed.value)*5;
                gain.gain.value = 0.5;
                lfo.connect(gain.gain);
                oscillator.connect(gain);
                mic.connect(gain);
                gain.connect(context.destination);
                oscillator.start();
                lfo.start();
            }
            else{
                gain.disconnect();
                oscillator.stop();
                lfo.stop();
            }
        }

        //Activer chorus
        vm.activerChorus = function(){
            delayNodeChorus = context.createDelay();
            delayNodeChorus.delayTime.value = 0.6;

            oscillatorChorus = context.createOscillator();
            gainChorus = context.createGain();

            gainChorus.gain.value= 1.0;

            oscillatorChorus.type="sine";
            oscillatorChorus.frequency.value=100;


            oscillatorChorus.connect(gainChorus);
            gainChorus.connect(delayNodeChorus.delayTime);

            mic.connect(gainChorus);
            mic.connect(delayNodeChorus);

            delayNodeChorus.connect(context.destination);

            oscillatorChorus.start(0);



            if(vm.chorus){
            }
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

        vm.lfo = {
            value: 0,
            options: {
                floor: 0,
                ceil: 100
            }
        };

        vm.lfoSpeed = {
            value: 0,
            options: {
                floor: 0,
                ceil: 100
            }
        };

        vm.chorusSpeed = {
            value: 0,
            options: {
                floor: 0,
                ceil: 50
            }
        };


        function valSlide(slide){
        return(slide/100);
    }

    }

})();
